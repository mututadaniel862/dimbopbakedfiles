import { FastifyInstance } from 'fastify';
import * as subscriptionController from '../controllers/subscription/controller';
import { authenticate } from '../middlewares/auth';

export default async (app: FastifyInstance) => {
  // Merchant: Submit activation payment ($1)
  app.post('/activation/submit', { preHandler: [authenticate] }, subscriptionController.submitActivation);
  
  // Merchant: Submit subscription plan payment
  app.post('/subscription/submit', { preHandler: [authenticate] }, subscriptionController.submitSubscription);
  
  // Merchant: Get my subscription status
  app.get('/subscription/me', { preHandler: [authenticate] }, subscriptionController.getMySubscription);
  
  // Admin: Get pending payments
  app.get('/payments/pending', { preHandler: [authenticate] }, subscriptionController.getPendingPayments);
  
  // Admin: Approve/reject payment
  app.post('/payments/process', { preHandler: [authenticate] }, subscriptionController.processPayment);
};