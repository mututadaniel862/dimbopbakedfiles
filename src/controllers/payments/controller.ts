// src/controllers/payments/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  initiatePayment,
  checkPaymentStatus,
  calculateShippingFee,
} from '../../services/pesepayService';
import { getUserCart, clearUserCart } from '../../services/productservice';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const PaymentController = {

  // ─────────────────────────────────────────────
  // POST /api/payments/checkout
  // The REAL checkout: reads cart → creates order → pays via Pesepay
  // ─────────────────────────────────────────────
  async checkout(
    request: FastifyRequest<{
      Body: {
        userId: number;
        customerEmail?: string;
        customerName?: string;
        customerPhone?: string;
        // Optional shipping
        includeShipping?: boolean;
        deliveryCity?: string;
        merchantId?: number;
      }
    }>,
    reply: FastifyReply
  ) {
    try {
      const {
        userId,
        customerEmail,
        customerName,
        customerPhone,
        includeShipping,
        deliveryCity,
        merchantId,
      } = request.body;

      if (!userId) {
        return reply.status(400).send({ error: 'userId is required' });
      }

      // 1️⃣ Get user's real cart
      const cart = await getUserCart(userId);

      if (!cart.items.length) {
        return reply.status(400).send({ error: 'Your cart is empty' });
      }

      // 2️⃣ Calculate shipping if requested
      let shippingFee = 0;
      let deliveryLocation = '';

      if (includeShipping && deliveryCity && merchantId) {
        const shipping = await calculateShippingFee({
          merchantId,
          customerCity: deliveryCity,
        });
        shippingFee = shipping.shippingFee;
        deliveryLocation = deliveryCity;
      }

      // 3️⃣ Calculate final total: grandTotal (after discounts) + shipping
      const cartTotal   = cart.grandTotal;
      const totalAmount = parseFloat((cartTotal + shippingFee).toFixed(2));

      // 4️⃣ Create the real order with all cart items
      const order = await prisma.orders.create({
        data: {
          user_id:     userId,
          total_price: new Prisma.Decimal(totalAmount),
          status:      'Pending',
          created_at:  new Date(),
          updated_at:  new Date(),
          order_items: {
            create: cart.items.map(item => ({
              product_id: item.product_id,
              quantity:   item.quantity,
              price:      item.price,
            })),
          },
        },
        include: { order_items: true },
      });

      console.log(`🛒 Order #${order.id} created | Items: ${cart.items.length} | Total: $${totalAmount}`);

      // 5️⃣ Initiate Pesepay payment with the real order total
      const itemNames = cart.items
        .map(i => `${i.products?.name ?? 'Item'} x${i.quantity}`)
        .join(', ');

      const paymentData: Parameters<typeof initiatePayment>[0] = {
        orderId: order.id,
        userId,
        amount: totalAmount,
        reason: `Order #${order.id}: ${itemNames}`.substring(0, 200),
      };

      if (customerEmail)    paymentData.customerEmail    = customerEmail;
      if (customerName)     paymentData.customerName     = customerName;
      if (customerPhone)    paymentData.customerPhone    = customerPhone;
      if (shippingFee)      paymentData.shippingFee      = 0; // Already included in totalAmount
      if (deliveryLocation) paymentData.deliveryLocation = deliveryLocation;

      const result = await initiatePayment(paymentData);

      // 6️⃣ Clear the cart after successful payment initiation
      await clearUserCart(userId);

      console.log(`✅ Checkout complete | Order #${order.id} | Ref: ${result.referenceNumber}`);

      return reply.send({
        success: true,
        orderId: order.id,
        redirectUrl: result.redirectUrl,
        referenceNumber: result.referenceNumber,
        totalAmount: result.totalAmount,
        cartTotal,
        shippingFee,
        itemCount: cart.totalItems,
      });

    } catch (error: any) {
      console.error('❌ Checkout error:', error.message);
      return reply.status(500).send({ error: error.message });
    }
  },

  async initiatePayment(
    request: FastifyRequest<{
      Body: {
        orderId?: number;
        userId: number;
        amount: number;
        reason?: string;
        customerEmail?: string;
        customerName?: string;
        customerPhone?: string;
        // Shipping
        includeShipping?: boolean;
        deliveryCity?: string;
        merchantId?: number;
      }
    }>,
    reply: FastifyReply
  ) {
    try {
      const {
        orderId,
        userId,
        amount,
        reason,
        customerEmail,
        customerName,
        customerPhone,
        includeShipping,
        deliveryCity,
        merchantId,
      } = request.body;

      if (!userId || !amount) {
        return reply.status(400).send({ error: 'userId and amount are required' });
      }

      // Calculate shipping if requested
      let shippingFee = 0;
      let deliveryLocation = '';

      if (includeShipping && deliveryCity && merchantId) {
        const shipping = await calculateShippingFee({
          merchantId,
          customerCity: deliveryCity,
        });
        shippingFee = shipping.shippingFee;
        deliveryLocation = deliveryCity;
      }

      const paymentData: Parameters<typeof initiatePayment>[0] = {
        userId,
        amount,
        reason: reason ?? 'Online Purchase - Multimart',
      };

      if (orderId)          paymentData.orderId          = orderId;

      if (customerEmail)    paymentData.customerEmail    = customerEmail;
      if (customerName)     paymentData.customerName     = customerName;
      if (customerPhone)    paymentData.customerPhone    = customerPhone;
      if (shippingFee)      paymentData.shippingFee      = shippingFee;
      if (deliveryLocation) paymentData.deliveryLocation = deliveryLocation;

      const result = await initiatePayment(paymentData);

      return reply.send({
        success: true,
        redirectUrl: result.redirectUrl,
        referenceNumber: result.referenceNumber,
        totalAmount: result.totalAmount,
        shippingFee,
      });

    } catch (error: any) {
      console.error('❌ Payment initiation error:', error.message);
      return reply.status(500).send({ error: error.message });
    }
  },

  // ─────────────────────────────────────────────
  // GET /api/payments/status/:referenceNumber
  // Frontend calls this to check if payment worked
  // ─────────────────────────────────────────────
  async checkStatus(
    request: FastifyRequest<{ Params: { referenceNumber: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { referenceNumber } = request.params;
      const result = await checkPaymentStatus(referenceNumber);
      return reply.send({ success: true, ...result });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  },

  // ─────────────────────────────────────────────
  // POST /api/payments/result
  // Pesepay calls this automatically after payment
  // DO NOT call this from frontend — Pesepay only
  // ─────────────────────────────────────────────
  async handleResult(
    request: FastifyRequest<{ Body: { referenceNumber?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { referenceNumber } = request.body;

      if (!referenceNumber) {
        return reply.status(400).send({ error: 'referenceNumber required' });
      }

      const result = await checkPaymentStatus(referenceNumber);

      console.log(`🔔 Pesepay result received | Ref: ${referenceNumber} | Status: ${result.status}`);

      return reply.status(200).send({ received: true });

    } catch (error: any) {
      console.error('❌ Result handler error:', error.message);
      return reply.status(500).send({ error: error.message });
    }
  },

  // ─────────────────────────────────────────────
  // GET /api/payments/shipping-fee
  // Frontend calls this to get delivery cost
  // ─────────────────────────────────────────────
  async getShippingFee(
    request: FastifyRequest<{
      Querystring: { merchantId: string; customerCity: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { merchantId, customerCity } = request.query as {
        merchantId: string;
        customerCity: string;
      };

      if (!merchantId || !customerCity) {
        return reply.status(400).send({ error: 'merchantId and customerCity are required' });
      }

      const result = await calculateShippingFee({
        merchantId: parseInt(merchantId),
        customerCity,
      });

      return reply.send({ success: true, ...result });

    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  },

  // ─────────────────────────────────────────────
  // GET /api/payments/history/:userId
  // Get payment history for a user
  // ─────────────────────────────────────────────
  async getPaymentHistory(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;

      const payments = await prisma.payments.findMany({
        where: { user_id: parseInt(userId) },
        include: {
          orders: {
            include: { order_items: true }
          }
        },
        orderBy: { created_at: 'desc' }
      });

      return reply.send({ success: true, payments });

    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  },
};