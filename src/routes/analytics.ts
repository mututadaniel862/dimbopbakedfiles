import { FastifyInstance } from 'fastify';
import { AnalyticsController } from '../controllers/analytics/controller';
import { z } from 'zod';
import deviceTypePlugin from "../plugins/plugins"
export default async (app: FastifyInstance) => {
  // Get paginated analytics (filter by device type)
  app.get('/', {
    handler: AnalyticsController.getAllAnalytics,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', default: '1' },
          limit: { type: 'string', default: '10' },
          deviceType: {
            type: 'string',
            enum: ['mobile', 'tablet', 'desktop', 'other']
          }
        },
        required: [] // optional fields, so no required ones
      }
    }
  });
  
  // GET /api/analytics?page=1&limit=20&deviceType=mobile

  // Get specific analytics record
  app.get('/:id', AnalyticsController.getAnalyticsById);
  // GET /api/analytics/123

  // Get device distribution stats
  app.get('/stats/devices', AnalyticsController.getDeviceStats);
  // GET /api/analytics/stats/devices
};