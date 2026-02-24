import { JwtUser } from './utils/jwt';
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
