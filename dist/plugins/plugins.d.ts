import { FastifyPluginAsync } from 'fastify';
declare const deviceTypePlugin: FastifyPluginAsync;
declare module 'fastify' {
    interface FastifyRequest {
        deviceType: string;
    }
}
export default deviceTypePlugin;
