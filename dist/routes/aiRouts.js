"use strict";
// // // import { FastifyInstance } from 'fastify';
// // // import { authenticate } from '../middlewares/auth'; // Your JWT auth middleware
// // // import { handleUserQuery, handleGenerateReport } from '../controllers/ai/aiController';
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const aiController_1 = require("../controllers/ai/aiController");
exports.default = async (app) => {
    // AI Query endpoint - supports text, images, and audio
    app.post('/ai/query', {
        preHandler: [auth_1.authenticate]
    }, aiController_1.handleUserQuery);
    // Report generation endpoint
    app.post('/ai/report', {
        preHandler: [auth_1.authenticate]
    }, aiController_1.handleGenerateReport);
    // Bulk analysis endpoint
    app.get('/ai/analysis', {
        preHandler: [auth_1.authenticate]
    }, aiController_1.handleBulkAnalysis);
    // Health check endpoint
    app.get('/ai/health', async (request, reply) => {
        reply.send({
            status: 'healthy',
            services: {
                gemini: !!process.env.GEMINI_API_KEY,
                database: true,
                multimodal: true
            }
        });
    });
};
//# sourceMappingURL=aiRouts.js.map