import { FastifyRequest, FastifyReply } from 'fastify';
type AnalyticsQuery = {
    page?: string;
    limit?: string;
    deviceType?: string;
};
type AnalyticsParams = {
    id: string;
};
export declare const AnalyticsController: {
    getAllAnalytics(request: FastifyRequest<{
        Querystring: AnalyticsQuery;
    }>, reply: FastifyReply): Promise<void>;
    getAnalyticsById(request: FastifyRequest<{
        Params: AnalyticsParams;
    }>, reply: FastifyReply): Promise<void>;
    getDeviceStats(request: FastifyRequest, reply: FastifyReply): Promise<void>;
};
export {};
