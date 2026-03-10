// src/services/pesepayService.ts
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as https from 'https';

const prisma = new PrismaClient();

const INTEGRATION_KEY = (process.env.PESEPAY_INTEGRATION_KEY || '').replace(/[\r\n\t ]+/g, '').trim();
const ENCRYPTION_KEY  = (process.env.PESEPAY_ENCRYPTION_KEY  || '').replace(/[\r\n\t ]+/g, '').trim();
const RESULT_URL      = process.env.PESEPAY_RESULT_URL!;
const RETURN_URL      = process.env.PESEPAY_RETURN_URL!;

function encryptPayload(data: object): string {
  const key     = Buffer.from(ENCRYPTION_KEY, 'utf8');
  const iv      = Buffer.from(ENCRYPTION_KEY.substring(0, 16), 'utf8');
  const cipher  = crypto.createCipheriv('aes-256-cbc', key, iv);
  const json    = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(json, 'utf8')),
    cipher.final()
  ]);
  return encrypted.toString('base64');
}

function decryptPayload(encryptedBase64: string): any {
  const key      = Buffer.from(ENCRYPTION_KEY, 'utf8');
  const iv       = Buffer.from(ENCRYPTION_KEY.substring(0, 16), 'utf8');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, 'base64')),
    decipher.final()
  ]);
  return JSON.parse(decrypted.toString('utf8'));
}

// ── Pure Node https request — no axios ───────────────────────
function httpsPost(body: object): Promise<any> {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);

    const options: https.RequestOptions = {
      hostname: 'api.pesepay.com',
      path:     '/api/payments-engine/v1/payments/initiate',
      method:   'POST',
      headers:  {
        'Authorization': INTEGRATION_KEY,
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
      },
    };

    console.log('📤 HTTPS options:', JSON.stringify({ ...options, headers: options.headers }));

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        console.log('📥 Status:', res.statusCode);
        console.log('📥 Raw response:', data);
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Failed to parse response: ' + data));
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ HTTPS error:', err.message);
      reject(err);
    });

    req.write(bodyStr);
    req.end();
  });
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
    amountDetails:    { amount: totalAmount, currencyCode: 'USD' },
    reasonForPayment: fullReason,
    resultUrl:        RESULT_URL,
    returnUrl:        RETURN_URL,
  };

  if (data.customerEmail || data.customerName || data.customerPhone) {
    requestBody.customer = {
      email:       data.customerEmail ?? null,
      name:        data.customerName  ?? null,
      phoneNumber: data.customerPhone ?? null,
    };
  }

  console.log('📤 Request body:', JSON.stringify(requestBody));
  console.log('🔑 Integration key length:', INTEGRATION_KEY.length);
  console.log('🔑 Encryption key length:', ENCRYPTION_KEY.length);

  const encryptedPayload = encryptPayload(requestBody);
  const response = await httpsPost({ payload: encryptedPayload });

  if (!response?.payload) {
    console.error('❌ No payload in response:', response);
    throw new Error('Pesepay returned no payload: ' + JSON.stringify(response));
  }

  let decrypted: any;
  try {
    decrypted = decryptPayload(response.payload);
  } catch (err: any) {
    throw new Error('Decrypt failed: ' + err.message);
  }

  console.log('🔓 Decrypted:', JSON.stringify(decrypted));

  if (!decrypted?.redirectUrl) {
    throw new Error(
      `No redirectUrl. Status: ${decrypted?.transactionStatus}. ` +
      `Desc: ${decrypted?.transactionStatusDescription}`
    );
  }

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
  return new Promise<any>((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: 'api.pesepay.com',
      path:     `/api/payments-engine/v1/payments/check-payment?referenceNumber=${encodeURIComponent(referenceNumber)}`,
      method:   'GET',
      headers:  {
        'Authorization': INTEGRATION_KEY,
        'Content-Type':  'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', async () => {
        try {
          const parsed    = JSON.parse(data);
          const decrypted = decryptPayload(parsed.payload);
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
            }
          }

          resolve({ referenceNumber, status, paid, amountDetails: decrypted.amountDetails });
        } catch (err: any) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
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