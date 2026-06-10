import { JwtUser } from './utils/jwt.js';
declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: JwtUser;
    }
}
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
