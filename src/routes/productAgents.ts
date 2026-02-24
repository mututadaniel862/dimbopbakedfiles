import { FastifyInstance } from 'fastify';
import { authenticate, authorize } from '../middlewares/auth';
import * as agentController from '../controllers/productAgents/controller';

export default async (fastify: FastifyInstance) => {
  
  // ============================================
  // USER ROUTES
  // ============================================
  
  // Apply to become agent for a product (PUBLIC)
  fastify.post('/apply', {
    preHandler: [authorize(['client'])],
    handler: agentController.applyAsProductAgentHandler,
    schema: {
      body: {
        type: 'object',
        properties: {
          productId: { type: 'number' },
          fullName: { type: 'string', minLength: 2, maxLength: 100 },
          nationalId: { type: 'string', minLength: 5 },
          idDocumentUrl: { type: 'string' },
          payoutMethod: { 
            type: 'string',
            enum: ['ecocash', 'bank', 'paynow', 'onemoney', 'telecash']
          },
          payoutNumber: { type: 'string' },
          bankName: { type: 'string' },
          bankAccountNumber: { type: 'string' },
          bankAccountName: { type: 'string' },
          reason: { type: 'string', maxLength: 500 },
          acceptedTerms: { type: 'boolean' }
        },
        required: ['productId', 'fullName', 'nationalId', 'payoutMethod', 'acceptedTerms']
      }
    }
  });
  
  // Get my agent applications (PUBLIC)
  fastify.get('/my-applications', {
    preHandler: [authenticate],
    handler: agentController.getUserAgentApplicationsHandler
  });
  
  // Generate referral link (PUBLIC)
  fastify.post('/referral-link', {
    handler: agentController.generateReferralLinkHandler,
    schema: {
      body: {
        type: 'object',
        properties: {
          productId: { type: 'number' }
        },
        required: ['productId']
      }
    }
  });
  
  // Get agent stats (PUBLIC)
  fastify.get('/stats/:agentId', {
    handler: agentController.getAgentStatsHandler
  });
  
  // ============================================
  // PUBLIC ROUTES
  // ============================================
  
  // Get agents for a specific product
  fastify.get('/product/:productId', {
    handler: agentController.getProductAgentsHandler
  });
  
  // ============================================
  // ADMIN ROUTES
  // ============================================
  
  // Get all pending applications
  fastify.get('/pending', {
    preHandler: [authenticate],
    handler: agentController.getPendingAgentApplicationsHandler
  });
  
  // Get all applications (with filters)
  fastify.get('/all', {
    preHandler: [authenticate],
    handler: agentController.getAllAgentApplicationsHandler
  });
  
  // Approve agent application
  fastify.post('/:id/approve', {
    preHandler: [authenticate],
    handler: agentController.approveAgentHandler,
    schema: {
      body: {
        type: 'object',
        properties: {
          commissionRate: { type: 'number', minimum: 0.1, maximum: 50 }
        }
      }
    }
  });
  
  // Reject agent application
  fastify.post('/:id/reject', {
    preHandler: [authenticate],
    handler: agentController.rejectAgentHandler,
    schema: {
      body: {
        type: 'object',
        properties: {
          rejectionReason: { type: 'string', minLength: 10 }
        },
        required: ['rejectionReason']
      }
    }
  });
};