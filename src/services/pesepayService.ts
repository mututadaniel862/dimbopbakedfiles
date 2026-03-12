// src/services/pesepayService.ts
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as https from 'https';
import axios from 'axios';

const prisma = new PrismaClient();

const INTEGRATION_KEY = 'a10148d9-755e-44f2-af64-444595169507';
const ENCRYPTION_KEY  = 'd4fc6074f15d4142a0af36133ac9615e';
const RESULT_URL = (process.env.PESEPAY_RESULT_URL || '').replace(/[^\x20-\x7E]/g, '').trim();
const RETURN_URL = (process.env.PESEPAY_RETURN_URL || '').replace(/[^\x20-\x7E]/g, '').trim();

const INITIATE_URL = 'https://api.pesepay.com/api/payments-engine/v1/payments/initiate';
const CHECK_URL    = 'https://api.pesepay.com/api/payments-engine/v1/payments/check-payment';

// Force HTTP/1.1 — prevents HPE_CR_EXPECTED error caused by HTTP/2 responses
const http1Agent = new https.Agent({
  keepAlive: false,
  insecureHTTPParser: true,
} as any);

// ── Encrypt / Decrypt ─────────────────────────────────────────
function encryptPayload(data: object): string {
  const key       = Buffer.from(ENCRYPTION_KEY, 'utf8');
  const iv        = Buffer.from(ENCRYPTION_KEY.substring(0, 16), 'utf8');
  const cipher    = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(JSON.stringify(data), 'utf8')),
    cipher.final(),
  ]);
  return encrypted.toString('base64');
}

function decryptPayload(encryptedBase64: string): any {
  const key       = Buffer.from(ENCRYPTION_KEY, 'utf8');
  const iv        = Buffer.from(ENCRYPTION_KEY.substring(0, 16), 'utf8');
  const decipher  = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, 'base64')),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString('utf8'));
}

// ── INITIATE PAYMENT ─────────────────────────────────────────
export const initiatePayment = async (data: {
  orderId?: number;
  userId: number;
  amount: number;
  reason: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  merchantId?: number;         // The client_admin who owns the products
}) => {
  const requestBody: any = {
    amountDetails: { amount: data.amount, currencyCode: 'USD' },
    reasonForPayment: data.reason,
    resultUrl: RESULT_URL,
    returnUrl: RETURN_URL,
  };

  if (data.customerEmail || data.customerName || data.customerPhone) {
    requestBody.customer = {
      email:       data.customerEmail ?? null,
      name:        data.customerName  ?? null,
      phoneNumber: data.customerPhone ?? null,
    };
  }

  console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

  const encryptedPayload = encryptPayload(requestBody);

  let axiosResponse: any;
  try {
    axiosResponse = await axios.post(
      INITIATE_URL,
      { payload: encryptedPayload },
      {
        httpsAgent: http1Agent,
        insecureHTTPParser: true,
        headers: {
          'authorization': INTEGRATION_KEY,
          'Content-Type':  'application/json',
        },
        timeout: 30000,
      }
    );
  } catch (err: any) {
    const status  = err?.response?.status;
    const errData = err?.response?.data ?? err?.message ?? String(err);
    console.error('❌ Pesepay error status:', status);
    console.error('❌ Pesepay error body:', JSON.stringify(errData));
    throw new Error(`Pesepay API error: ${JSON.stringify(errData)}`);
  }

  console.log('📥 Pesepay response:', JSON.stringify(axiosResponse.data, null, 2));

  let decrypted: any;
  try {
    decrypted = decryptPayload(axiosResponse.data.payload);
  } catch (err: any) {
    console.error('❌ Decrypt failed:', err.message);
    throw new Error('Failed to decrypt Pesepay response: ' + err.message);
  }

  console.log('🔓 Decrypted:', JSON.stringify(decrypted, null, 2));

  if (!decrypted?.redirectUrl) {
    throw new Error(
      `No redirectUrl. Status: ${decrypted?.transactionStatus}. ` +
      `Desc: ${decrypted?.transactionStatusDescription}`
    );
  }

  // Save payment record
  const payment = await prisma.payments.create({
    data: {
      order_id:       data.orderId ?? null,
      user_id:        data.userId,
      merchant_id:    data.merchantId ?? null,
      transaction_id: decrypted.referenceNumber,
      payment_method: 'pesepay',
      status:         'Pending',
      processor:      'pesepay',
      net_amount:     data.amount,
      is_held:        true,    // Will be held in escrow until delivery
    },
  });

  console.log(`✅ Payment saved | Ref: ${decrypted.referenceNumber} | ID: ${payment.id}`);

  return {
    redirectUrl:     decrypted.redirectUrl,
    referenceNumber: decrypted.referenceNumber,
    totalAmount:     data.amount,
    paymentId:       payment.id,
  };
};

// ── CHECK PAYMENT STATUS & CREATE ESCROW HOLD ─────────────────
export const checkPaymentStatus = async (referenceNumber: string) => {
  const axiosResponse = await axios.get(CHECK_URL, {
    httpsAgent: http1Agent,
    insecureHTTPParser: true,
    params:  { referenceNumber },
    headers: {
      'authorization': INTEGRATION_KEY,
      'Content-Type':  'application/json',
    },
    timeout: 30000,
  });

  const decrypted = decryptPayload(axiosResponse.data.payload);
  const status    = decrypted.transactionStatus;
  const paid      = status === 'SUCCESS';

  await prisma.payments.updateMany({
    where: { transaction_id: referenceNumber },
    data:  { status: paid ? 'Success' : status },
  });

  if (paid) {
    const payment = await prisma.payments.findFirst({
      where: { transaction_id: referenceNumber },
    });

    if (payment?.order_id) {
      // Update order to Processing
      await prisma.orders.update({
        where: { id: payment.order_id },
        data:  { status: 'Processing', updated_at: new Date() },
      });
      console.log(`✅ Order ${payment.order_id} → Processing`);

      // ── Create Escrow / Payment Hold ──────────────────────────
      // Determine merchant_id: use the one saved on payment, or look up from order items
      let merchantId = payment.merchant_id;

      if (!merchantId) {
        // Fallback: find from order items' products.uploaded_by
        const orderItem = await prisma.order_items.findFirst({
          where: { order_id: payment.order_id },
          include: { products: { select: { uploaded_by: true } } },
        });
        merchantId = orderItem?.products?.uploaded_by ?? null;
      }

      if (merchantId) {
        // Check no hold already exists for this payment
        const existingHold = await prisma.payment_holds.findUnique({
          where: { payment_id: payment.id },
        });

        if (!existingHold) {
          const holdUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

          await prisma.payment_holds.create({
            data: {
              payment_id:   payment.id,
              order_id:     payment.order_id,
              amount:       payment.net_amount ?? 0,
              merchant_id:  merchantId,
              processor:    'pesepay',
              hold_until:   holdUntil,
              status:       'holding',
            },
          });

          console.log(
            `🔒 Escrow created | Payment #${payment.id} | ` +
            `Merchant #${merchantId} | Release after: ${holdUntil.toISOString()}`
          );
        }
      } else {
        console.warn(`⚠️ No merchant found for order #${payment.order_id} — escrow skipped`);
      }
    }
  }

  return { referenceNumber, status, paid, amountDetails: decrypted.amountDetails };
};
