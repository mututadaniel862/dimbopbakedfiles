import { FastifyInstance } from 'fastify';
import { UserPurchaseController } from '../controllers/users/controller';

export default async (fastify: FastifyInstance) => {
  // Get all users who made purchases
  fastify.get('/purchasers', UserPurchaseController.getAllPurchasers);

  // Get specific user's purchase history
  fastify.get('/:userId/purchases', {
    schema: {
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string' }
        },
        required: ['userId']
      }
    },
    handler: UserPurchaseController.getUserPurchases
  });

  // Create new order with payment
  fastify.post('/orders', UserPurchaseController.createOrder);

  // Get specific order
  fastify.get('/orders/:orderId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          orderId: { type: 'string' }
        },
        required: ['orderId']
      }
    },
    handler: UserPurchaseController.getOrder
  });

  // EcoCash payment callback
  fastify.post('/payment/callback', UserPurchaseController.handlePaymentCallback);

  // Get purchase statistics
  fastify.get('/statistics/purchases', UserPurchaseController.getStatistics);
};