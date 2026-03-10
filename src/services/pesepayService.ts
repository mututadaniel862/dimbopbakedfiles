// src/services/pesepayService.ts
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import axios from 'axios';

const prisma = new PrismaClient();

const INTEGRATION_KEY = process.env.PESEPAY_INTEGRATION_KEY!;
const ENCRYPTION_KEY  = process.env.PESEPAY_ENCRYPTION_KEY!;
const RESULT_URL      = process.env.PESEPAY_RESULT_URL!;
const RETURN_URL      = process.env.PESEPAY_RETURN_URL!;

const INITIATE_URL = 'https://api.pesepay.com/api/payments-engine/v1/payments/initiate';
const CHECK_URL    = 'https://api.pesepay.com/api/payments-engine/v1/payments/check-payment';

// ── Pesepay uses CryptoJS-style AES-256-CBC ──────────────────
// IV = first 16 chars of encryption key
// Key = full 32-char encryption key
function encryptPayload(data: object): string {
  const key = Buffer.from(ENCRYPTION_KEY, 'utf8');         // 32 bytes
  const iv  = Buffer.from(ENCRYPTION_KEY.substring(0, 16), 'utf8'); // 16 bytes
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const json = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(json, 'utf8')),
    cipher.final()
  ]);
  return encrypted.toString('base64');
}

function decryptPayload(encryptedBase64: string): any {
  const key = Buffer.from(ENCRYPTION_KEY, 'utf8');
  const iv  = Buffer.from(ENCRYPTION_KEY.substring(0, 16), 'utf8');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, 'base64')),
    decipher.final()
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
  shippingFee?: number;
  deliveryLocation?: string;
}) => {
  const totalAmount = data.amount + (data.shippingFee ?? 0);
  const fullReason  = data.deliveryLocation
    ? `${data.reason} | Delivery: ${data.deliveryLocation}`
    : data.reason;

  const requestBody: any = {
    amountDetails: {
      amount:       totalAmount,
      currencyCode: 'USD',
    },
    reasonForPayment: fullReason,
    resultUrl: RESULT_URL,
    returnUrl: RETURN_URL,
  };

  // Add customer info if provided
  if (data.customerEmail || data.customerName || data.customerPhone) {
    requestBody.customer = {
      email:       data.customerEmail  ?? null,
      name:        data.customerName   ?? null,
      phoneNumber: data.customerPhone  ?? null,
    };
  }

  console.log('📤 Pesepay request:', JSON.stringify(requestBody, null, 2));
  console.log('🔑 Keys loaded - Integration:', !!INTEGRATION_KEY, '| Encryption:', !!ENCRYPTION_KEY);
  console.log('🔗 Result URL:', RESULT_URL);
  console.log('🔗 Return URL:', RETURN_URL);

  // Encrypt and send
  const encryptedPayload = encryptPayload(requestBody);
  console.log('🔒 Encrypted payload (first 50 chars):', encryptedPayload.substring(0, 50));

  let axiosResponse: any;
  try {
    axiosResponse = await axios.post(
      INITIATE_URL,
      { payload: encryptedPayload },
      {
        headers: {
          authorization:  INTEGRATION_KEY,
          'content-type': 'application/json',
        },
        timeout: 30000,
      }
    );
  } catch (err: any) {
    const errData = err?.response?.data ?? err?.message ?? err;
    console.error('❌ Axios error calling Pesepay:', JSON.stringify(errData));
    throw new Error(`Pesepay API error: ${JSON.stringify(errData)}`);
  }

  console.log('📥 Pesepay raw response:', JSON.stringify(axiosResponse.data, null, 2));

  // Decrypt response
  let decrypted: any;
  try {
    decrypted = decryptPayload(axiosResponse.data.payload);
  } catch (err: any) {
    console.error('❌ Failed to decrypt Pesepay response:', err.message);
    throw new Error('Failed to decrypt Pesepay response');
  }

  console.log('🔓 Decrypted response:', JSON.stringify(decrypted, null, 2));

  if (!decrypted?.redirectUrl) {
    throw new Error(
      `Pesepay: no redirectUrl. Status: ${decrypted?.transactionStatus}. ` +
      `Desc: ${decrypted?.transactionStatusDescription}`
    );
  }

  // Save to DB
  await prisma.payments.create({
    data: {
      order_id:       data.orderId ?? null,
      user_id:        data.userId,
      transaction_id: decrypted.referenceNumber,
      payment_method: 'pesepay',
      status:         'Pending',
      processor:      'pesepay',
      net_amount:     totalAmount,
    }
  });

  console.log(`✅ Payment saved | Ref: ${decrypted.referenceNumber}`);

  return {
    redirectUrl:     decrypted.redirectUrl,
    referenceNumber: decrypted.referenceNumber,
    totalAmount,
  };
};

// ── CHECK PAYMENT STATUS ─────────────────────────────────────
export const checkPaymentStatus = async (referenceNumber: string) => {
  const axiosResponse = await axios.get(CHECK_URL, {
    params:  { referenceNumber },
    headers: { authorization: INTEGRATION_KEY, 'content-type': 'application/json' },
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
    const payment = await prisma.payments.findFirst({ where: { transaction_id: referenceNumber } });
    if (payment?.order_id) {
      await prisma.orders.update({
        where: { id: payment.order_id },
        data:  { status: 'Processing', updated_at: new Date() },
      });
      console.log(`✅ Order ${payment.order_id} → Processing`);
    }
  }

  return { referenceNumber, status, paid, amountDetails: decrypted.amountDetails };
};

// ── CALCULATE SHIPPING FEE ───────────────────────────────────
export const calculateShippingFee = async (data: {
  merchantId: number;
  customerCity: string;
}) => {
  const merchant = await prisma.users.findUnique({
    where:  { id: data.merchantId },
    select: { physical_address: true },
  });

  if (!merchant) throw new Error('Merchant not found');

  const customerCity = data.customerCity.toLowerCase();
  const shippingFee  = customerCity.includes('harare') ? 10 : 15;

  return {
    shippingFee,
    merchantCity: merchant.physical_address ?? '',
    customerCity: data.customerCity,
    freeDelivery: false,
  };
};



















// // src/services/pesepayService.ts
// import { PrismaClient } from '@prisma/client';
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { Pesepay } = require('pesepay');

// const prisma = new PrismaClient();

// const pesepay = new Pesepay(
//   process.env.PESEPAY_INTEGRATION_KEY!,
//   process.env.PESEPAY_ENCRYPTION_KEY!
// );

// pesepay.resultUrl = process.env.PESEPAY_RESULT_URL!;
// pesepay.returnUrl  = process.env.PESEPAY_RETURN_URL!;

// // ─────────────────────────────────────────────────────────────
// // INITIATE PAYMENT
// // Called when customer clicks "Pay Now"
// // Returns a redirectUrl → send this to the frontend
// // ─────────────────────────────────────────────────────────────
// export const initiatePayment = async (data: {
//   orderId: number;
//   userId: number;
//   amount: number;
//   reason: string;
//   customerEmail?: string;
//   customerName?: string;
//   customerPhone?: string;
//   shippingFee?: number;       // Added for delivery fee
//   deliveryLocation?: string;  // e.g. "Harare" or "Outside Harare"
// }) => {
//   const totalAmount = data.amount + (data.shippingFee ?? 0);

//   // Build reason including delivery info
//   const fullReason = data.deliveryLocation
//     ? `${data.reason} | Delivery: ${data.deliveryLocation}`
//     : data.reason;

//   // Create transaction using pesepay npm library
//   const transaction = pesepay.createTransaction(totalAmount, 'USD', fullReason);

//   // Attach customer info if available
//   if (data.customerEmail || data.customerName || data.customerPhone) {
//     (transaction as any).customer = {
//       email: data.customerEmail ?? null,
//       name: data.customerName ?? null,
//       phoneNumber: data.customerPhone ?? null,
//     };
//   }

//   // Add order reference so we can match it in resultUrl callback
//   (transaction as any).merchantReference = `ORDER-${data.orderId}`;

//   const response = await pesepay.initiateTransaction(transaction);

//   if (!response?.redirectUrl) {
//     throw new Error('Failed to get redirect URL from Pesepay');
//   }

//   // Save payment record in DB (status = Pending)
//   await prisma.payments.create({
//     data: {
//       order_id: data.orderId,
//       user_id: data.userId,
//       transaction_id: response.referenceNumber,
//       payment_method: 'pesepay',
//       status: 'Pending',
//       processor: 'pesepay',
//       net_amount: totalAmount,
//     }
//   });

//   console.log(`✅ Payment initiated | Order: ${data.orderId} | Ref: ${response.referenceNumber}`);

//   return {
//     redirectUrl: response.redirectUrl,
//     referenceNumber: response.referenceNumber,
//     totalAmount,
//   };
// };

// // ─────────────────────────────────────────────────────────────
// // CHECK PAYMENT STATUS
// // Call this to verify if a payment succeeded
// // ─────────────────────────────────────────────────────────────
// export const checkPaymentStatus = async (referenceNumber: string) => {
//   const response = await pesepay.checkPayment(referenceNumber);
//   const status = response.transactionStatus;
//   const paid = status === 'SUCCESS';

//   // Update payment in DB
//   await prisma.payments.updateMany({
//     where: { transaction_id: referenceNumber },
//     data: { status: paid ? 'Success' : status }
//   });

//   // If paid → update order status
//   if (paid) {
//     await prisma.payments.findFirst({
//       where: { transaction_id: referenceNumber }
//     }).then(async (payment) => {
//       if (payment?.order_id) {
//         await prisma.orders.update({
//           where: { id: payment.order_id },
//           data: { status: 'Processing', updated_at: new Date() }
//         });
//         console.log(`✅ Order ${payment.order_id} marked as Processing`);
//       }
//     });
//   }

//   return {
//     referenceNumber,
//     status,
//     paid,
//     amountDetails: response.amountDetails,
//   };
// };

// // ─────────────────────────────────────────────────────────────
// // CALCULATE SHIPPING FEE
// // Based on merchant location vs customer location
// // client_admin sets their own delivery fee in their profile
// // ─────────────────────────────────────────────────────────────
// export const calculateShippingFee = async (data: {
//   merchantId: number;
//   customerCity: string;
// }) => {
//   const merchant = await prisma.users.findUnique({
//     where: { id: data.merchantId },
//     select: {
//       physical_address: true,
//       geo_latitude: true,
//       geo_longitude: true,
//     }
//   });

//   if (!merchant) throw new Error('Merchant not found');

//   // Default fees — merchant can override these via their dashboard
//   // Harare = $10, Outside Harare = $15
//   // TODO: In future, merchant sets custom fee in their profile
//   const merchantCity = merchant.physical_address?.toLowerCase() ?? '';
//   const customerCity = data.customerCity.toLowerCase();

//   let shippingFee = 15; // Default: outside Harare

//   if (merchantCity.includes(customerCity) || customerCity.includes('harare')) {
//     shippingFee = 10; // Same city or Harare
//   }

//   return {
//     shippingFee,
//     merchantCity,
//     customerCity,
//     freeDelivery: false,
//   };
// };