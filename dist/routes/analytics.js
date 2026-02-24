"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controllers/analytics/controller");
exports.default = async (app) => {
    // Get paginated analytics (filter by device type)
    app.get('/', {
        handler: controller_1.AnalyticsController.getAllAnalytics,
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
    app.get('/:id', controller_1.AnalyticsController.getAnalyticsById);
    // GET /api/analytics/123
    // Get device distribution stats
    app.get('/stats/devices', controller_1.AnalyticsController.getDeviceStats);
    // GET /api/analytics/stats/devices
};
//# sourceMappingURL=analytics.js.map