// src/routes/delivery.ts
import { FastifyInstance } from 'fastify';
import { DeliveryController } from '../controllers/delivery/controller';
import { authenticate } from '../middlewares/auth';

export default async (fastify: FastifyInstance) => {

  // client_admin saves their delivery settings
  fastify.post('/settings', {
    preHandler: [authenticate],
    handler: DeliveryController.saveSettings,
    schema: {
      body: {
        type: 'object',
        required: ['merchantId', 'offersDelivery'],
        properties: {
          merchantId:         { type: 'number' },
          offersDelivery:     { type: 'boolean' },
          harareFee:          { type: 'number' },
          outsideHarareFee:   { type: 'number' },
          freeDeliveryAbove:  { type: 'number' },
          deliveryCities:     { type: 'array', items: { type: 'string' } },
          deliveryNote:       { type: 'string' },
        }
      }
    }
  });

  // Get merchant delivery settings
  fastify.get('/settings/:merchantId', {
    handler: DeliveryController.getSettings,
  });

  // Get delivery fee for customer checkout
  fastify.get('/fee', {
    handler: DeliveryController.getFee,
  });
};


// ============================================================
// REGISTER IN YOUR app.ts / index.ts:
//
//   import deliveryRoutes from './routes/delivery';
//   app.register(deliveryRoutes, { prefix: '/api/delivery' });
//
// ============================================================
// ENDPOINTS:
//
//  POST  /api/delivery/settings          ← merchant sets options
//  GET   /api/delivery/settings/:id      ← get merchant settings
//  GET   /api/delivery/fee?merchantId=1&customerCity=Harare&orderAmount=50
//
// ============================================================
// EXAMPLE — merchant turns ON delivery:
//
//  POST /api/delivery/settings
//  {
//    "merchantId": 5,
//    "offersDelivery": true,
//    "harareFee": 8,
//    "outsideHarareFee": 12,
//    "freeDeliveryAbove": 80,
//    "deliveryCities": ["Harare", "Bulawayo", "Mutare"],
//    "deliveryNote": "We deliver Monday to Friday only"
//  }
//
// ============================================================
// EXAMPLE — merchant turns OFF delivery (pickup only):
//
//  POST /api/delivery/settings
//  {
//    "merchantId": 5,
//    "offersDelivery": false
//  }
//
// ============================================================