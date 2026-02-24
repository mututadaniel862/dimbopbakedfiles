import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtUser } from '../utils/jwt';
declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: JwtUser;
    }
}
export declare const authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const authorize: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
