// src/controllers/payments/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  initiatePayment,
  checkPaymentStatus,
  calculateShippingFee,
} from '../../services/pesepayService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PaymentController = {

  // ─────────────────────────────────────────────
  // POST /api/payments/initiate
  // Frontend calls this when customer clicks Pay
  // ─────────────────────────────────────────────
  async initiatePayment(
    request: FastifyRequest<{
      Body: {
        orderId: number;
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

      if (!orderId || !userId || !amount) {
        return reply.status(400).send({ error: 'orderId, userId and amount are required' });
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
        orderId,
        userId,
        amount,
        reason: reason ?? 'Online Purchase - Multimart',
      };

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