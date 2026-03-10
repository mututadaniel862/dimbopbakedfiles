// src/services/pesepayService.ts
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Pesepay } = require('pesepay');

const prisma = new PrismaClient();

const pesepay = new Pesepay(
  process.env.PESEPAY_INTEGRATION_KEY!,
  process.env.PESEPAY_ENCRYPTION_KEY!
);

pesepay.resultUrl = process.env.PESEPAY_RESULT_URL!;
pesepay.returnUrl  = process.env.PESEPAY_RETURN_URL!;

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

  const fullReason = data.deliveryLocation
    ? `${data.reason} | Delivery: ${data.deliveryLocation}`
    : data.reason;

  const transaction = pesepay.createTransaction(totalAmount, 'USD', fullReason);

  if (data.customerEmail || data.customerName || data.customerPhone) {
    (transaction as any).customer = {
      email: data.customerEmail ?? null,
      name: data.customerName ?? null,
      phoneNumber: data.customerPhone ?? null,
    };
  }

  (transaction as any).merchantReference = data.orderId
    ? `ORDER-${data.orderId}`
    : `USER-${data.userId}-${Date.now()}`;

  // ── LOG: show exactly what we're sending to Pesepay ──
  console.log('📤 Sending to Pesepay:', JSON.stringify(transaction, null, 2));
  console.log('🔑 Integration Key exists:', !!process.env.PESEPAY_INTEGRATION_KEY);
  console.log('🔑 Encryption Key exists:', !!process.env.PESEPAY_ENCRYPTION_KEY);
  console.log('🔗 Result URL:', process.env.PESEPAY_RESULT_URL);
  console.log('🔗 Return URL:', process.env.PESEPAY_RETURN_URL);

  let response: any;
  try {
    response = await pesepay.initiateTransaction(transaction);
  } catch (err: any) {
    console.error('❌ Pesepay initiateTransaction error:', err?.message ?? err);
    throw new Error(`Pesepay error: ${err?.message ?? 'Unknown error'}`);
  }

  // ── LOG: show exactly what Pesepay returned ──
  console.log('📥 Pesepay response:', JSON.stringify(response, null, 2));

  if (!response?.redirectUrl) {
    console.error('❌ No redirectUrl in response:', response);
    throw new Error(`Pesepay returned no redirectUrl. Status: ${response?.transactionStatus ?? 'unknown'}. Message: ${response?.transactionStatusDescription ?? 'none'}`);
  }

  await prisma.payments.create({
    data: {
      order_id:       data.orderId ?? null,
      user_id:        data.userId,
      transaction_id: response.referenceNumber,
      payment_method: 'pesepay',
      status:         'Pending',
      processor:      'pesepay',
      net_amount:     totalAmount,
    }
  });

  console.log(`✅ Payment initiated | Order: ${data.orderId ?? 'N/A'} | Ref: ${response.referenceNumber}`);

  return {
    redirectUrl:     response.redirectUrl,
    referenceNumber: response.referenceNumber,
    totalAmount,
  };
};

export const checkPaymentStatus = async (referenceNumber: string) => {
  const response = await pesepay.checkPayment(referenceNumber);
  const status = response.transactionStatus;
  const paid = status === 'SUCCESS';

  await prisma.payments.updateMany({
    where: { transaction_id: referenceNumber },
    data: { status: paid ? 'Success' : status }
  });

  if (paid) {
    const payment = await prisma.payments.findFirst({
      where: { transaction_id: referenceNumber }
    });
    if (payment?.order_id) {
      await prisma.orders.update({
        where: { id: payment.order_id },
        data: { status: 'Processing', updated_at: new Date() }
      });
    }
  }

  return { referenceNumber, status, paid, amountDetails: response.amountDetails };
};

export const calculateShippingFee = async (data: {
  merchantId: number;
  customerCity: string;
}) => {
  const merchant = await prisma.users.findUnique({
    where: { id: data.merchantId },
    select: { physical_address: true, geo_latitude: true, geo_longitude: true }
  });

  if (!merchant) throw new Error('Merchant not found');

  const merchantCity = merchant.physical_address?.toLowerCase() ?? '';
  const customerCity = data.customerCity.toLowerCase();
  let shippingFee = 15;

  if (merchantCity.includes(customerCity) || customerCity.includes('harare')) {
    shippingFee = 10;
  }

  return { shippingFee, merchantCity, customerCity, freeDelivery: false };
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