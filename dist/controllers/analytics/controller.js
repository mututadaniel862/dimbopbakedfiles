"use strict";
// import { FastifyRequest, FastifyReply } from 'fastify';
// import { AnalyticsService } from '../../services/analytics';
// import { UserAnalytics, userAnalyticsSchema } from '../../models/analytics';
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_1 = require("../../services/analytics");
exports.AnalyticsController = {
    async getAllAnalytics(request, reply) {
        try {
            const { page = '1', limit = '10', deviceType } = request.query;
            const analytics = await analytics_1.AnalyticsService.getAllAnalytics(parseInt(page), parseInt(limit), deviceType);
            reply.send(analytics);
        }
        catch (error) {
            reply.status(500).send({
                message: 'Error fetching analytics',
                error: error.message
            });
        }
    },
    async getAnalyticsById(request, reply) {
        try {
            const { id } = request.params;
            const analytics = await analytics_1.AnalyticsService.getAnalyticsById(parseInt(id));
            if (!analytics) {
                reply.status(404).send({ message: 'Analytics record not found' });
                return;
            }
            reply.send(analytics);
        }
        catch (error) {
            reply.status(500).send({
                message: 'Error fetching analytics record',
                error: error.message
            });
        }
    },
    async getDeviceStats(request, reply) {
        try {
            const stats = await analytics_1.AnalyticsService.getDeviceTypeStats();
            reply.send(stats);
        }
        catch (error) {
            reply.status(500).send({
                message: 'Error fetching device statistics',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=controller.js.map