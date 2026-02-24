// import { FastifyRequest, FastifyReply } from 'fastify';
// import { AnalyticsService } from '../../services/analytics';
// import { UserAnalytics, userAnalyticsSchema } from '../../models/analytics';
// import { z } from 'zod';

// // Type definitions for request parameters
// type AnalyticsParams = {
//   id: string;
// };

// type AnalyticsQuery = {
//   page?: string;
//   limit?: string;
//   deviceType?: 'mobile' | 'tablet' | 'desktop' | 'other' | 'unknown';
// };

// type AnalyticsBody = z.infer<typeof userAnalyticsSchema>;

// export const AnalyticsController = {
//   // Create analytics record
//   async createAnalytics(
//     request: FastifyRequest<{ Body: AnalyticsBody }>,
//     reply: FastifyReply
//   ) {
//     try {
//       // Extract user agent from headers if not provided in body
//       const userAgent = request.headers['user-agent'];
//       const analyticsData = {
//         ...request.body,
//         device: request.body.device || userAgent
//       };

//       const analytics = await AnalyticsService.createAnalytics(analyticsData);
//       reply.status(201).send(analytics);
//     } catch (error) {
//       reply.status(400).send({
//         message: 'Invalid analytics data',
//         error: (error as Error).message
//       });
//     }
//   },

//   // Get all analytics records with pagination
//   async getAllAnalytics(
//     request: FastifyRequest<{ Querystring: AnalyticsQuery }>,
//     reply: FastifyReply
//   ) {
//     try {
//       const { page = '1', limit = '10', deviceType } = request.query;
      
//       // In a real implementation, you would add filtering by deviceType
//       // to your service method
//       const analytics = await AnalyticsService.getAllAnalytics(
//         parseInt(page),
//         parseInt(limit),
//         deviceType
//       );
      
//       reply.send(analytics);
//     } catch (error) {
//       reply.status(500).send({
//         message: 'Error fetching analytics',
//         error: (error as Error).message
//       });
//     }
//   },

//   // Get analytics by ID
//   async getAnalyticsById(
//     request: FastifyRequest<{ Params: AnalyticsParams }>,
//     reply: FastifyReply
//   ) {
//     try {
//       const { id } = request.params;
//       const analytics = await AnalyticsService.getAnalyticsById(parseInt(id));
      
//       if (!analytics) {
//         reply.status(404).send({ message: 'Analytics record not found' });
//         return;
//       }
      
//       reply.send(analytics);
//     } catch (error) {
//       reply.status(500).send({
//         message: 'Error fetching analytics record',
//         error: (error as Error).message
//       });
//     }
//   },

//   // Get device type statistics
//   async getDeviceStats(
//     request: FastifyRequest,
//     reply: FastifyReply
//   ) {
//     try {
//       const stats = await AnalyticsService.getDeviceTypeStats();
//       reply.send(stats);
//     } catch (error) {
//       reply.status(500).send({
//         message: 'Error fetching device statistics',
//         error: (error as Error).message
//       });
//     }
//   },

//   // Track purchase event (wrapper around createAnalytics with additional context)
//   async trackPurchase(
//     request: FastifyRequest<{ 
//       Body: {
//         user_id: number;
//         purchase_data: any; // Define proper type for your purchase data
//       }
//     }>,
//     reply: FastifyReply
//   ) {
//     try {
//       const userAgent = request.headers['user-agent'];
//       const { user_id, purchase_data } = request.body;

//       const analyticsData = {
//         user_id,
//         device: userAgent,
//         // You might want to include purchase-related metadata here
//         metadata: {
//           event_type: 'purchase',
//           ...purchase_data
//         }
//       };

//       const analytics = await AnalyticsService.createAnalytics(analyticsData);
//       reply.status(201).send(analytics);
//     } catch (error) {
//       reply.status(400).send({
//         message: 'Error tracking purchase',
//         error: (error as Error).message
//       });
//     }
//   }
// };




import { FastifyRequest, FastifyReply } from 'fastify';
import { AnalyticsService } from '../../services/analytics';
import { z } from 'zod';

type AnalyticsQuery = {
  page?: string;
  limit?: string;
  deviceType?: string;
};

type AnalyticsParams = {
  id: string;
};

export const AnalyticsController = {
  async getAllAnalytics(
    request: FastifyRequest<{ Querystring: AnalyticsQuery }>,
    reply: FastifyReply
  ) {
    try {
      const { page = '1', limit = '10', deviceType } = request.query;
      const analytics = await AnalyticsService.getAllAnalytics(
        parseInt(page),
        parseInt(limit),
        deviceType
      );
      reply.send(analytics);
    } catch (error) {
      reply.status(500).send({
        message: 'Error fetching analytics',
        error: (error as Error).message
      });
    }
  },

  async getAnalyticsById(
    request: FastifyRequest<{ Params: AnalyticsParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const analytics = await AnalyticsService.getAnalyticsById(parseInt(id));
      
      if (!analytics) {
        reply.status(404).send({ message: 'Analytics record not found' });
        return;
      }
      
      reply.send(analytics);
    } catch (error) {
      reply.status(500).send({
        message: 'Error fetching analytics record',
        error: (error as Error).message
      });
    }
  },

  async getDeviceStats(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const stats = await AnalyticsService.getDeviceTypeStats();
      reply.send(stats);
    } catch (error) {
      reply.status(500).send({
        message: 'Error fetching device statistics',
        error: (error as Error).message
      });
    }
  }
};