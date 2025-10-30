import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, JwtUser } from '../utils/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JwtUser;
  }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return reply.code(401).send({ 
        success: false, 
        error: 'Authorization header missing' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return reply.code(401).send({ 
        success: false, 
        error: 'Token missing' 
      });
    }
    
    const decoded = verifyToken(token);
    request.user = decoded;
    
  } catch (error: any) {
    return reply.code(401).send({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

export const authorize = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await authenticate(request, reply);
    
    if (!request.user) {
      return reply.code(401).send({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }
    
    if (!roles.includes(request.user.role)) {
      return reply.code(403).send({ 
        success: false, 
        error: 'Forbidden' 
      });
    }
  };
};