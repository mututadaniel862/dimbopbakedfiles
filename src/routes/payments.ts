// src/routes/payments.ts
import { FastifyInstance } from 'fastify';
import { PaymentController } from '../controllers/payments/controller';
import { authenticate } from '../middlewares/auth';

export default async (fastify: FastifyInstance) => {

  // ──────────────────────────────────────────────────────────
  // POST /api/payments/initiate
  // Customer clicks Pay → backend creates Pesepay transaction
  // Returns redirectUrl → frontend redirects customer there
  // ──────────────────────────────────────────────────────────
  fastify.post('/initiate', {
    preHandler: [authenticate],
    handler: PaymentController.initiatePayment,
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'amount'],
        properties: {
          orderId:         { type: 'number' },
          userId:          { type: 'number' },
          amount:          { type: 'number' },
          reason:          { type: 'string' },
          customerEmail:   { type: 'string' },
          customerName:    { type: 'string' },
          customerPhone:   { type: 'string' },
          includeShipping: { type: 'boolean' },
          deliveryCity:    { type: 'string' },
          merchantId:      { type: 'number' },
        }
      }
    }
  });

  // ──────────────────────────────────────────────────────────
  // GET /api/payments/status/:referenceNumber
  // Check if a payment succeeded
  // ──────────────────────────────────────────────────────────
  fastify.get('/status/:referenceNumber', {
    preHandler: [authenticate],
    handler: PaymentController.checkStatus,
  });

  // ──────────────────────────────────────────────────────────
  // POST /api/payments/result
  // ⚠️ Pesepay calls this — NOT the frontend
  // Pesepay posts here after payment is complete
  // ──────────────────────────────────────────────────────────
  fastify.post('/result', {
    handler: PaymentController.handleResult,
  });

  // ──────────────────────────────────────────────────────────
  // GET /api/payments/shipping-fee
  // Get delivery fee based on merchant + customer city
  // ──────────────────────────────────────────────────────────
  fastify.get('/shipping-fee', {
    handler: PaymentController.getShippingFee,
  });

  // ──────────────────────────────────────────────────────────
  // GET /api/payments/history/:userId
  // Get all payments for a user
  // ──────────────────────────────────────────────────────────
  fastify.get('/history/:userId', {
    preHandler: [authenticate],
    handler: PaymentController.getPaymentHistory,
  });
};