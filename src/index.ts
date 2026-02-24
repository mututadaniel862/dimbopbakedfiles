import * as dotenv from 'dotenv';
import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import prisma from './config/db';
import authRoutes from './routes/auth';
import serachroute from './routes/serachroute';
// import userpayments from './routes/user';
import productRoutes from './routes/productroute';
import blogRoutes from './routes/blog';
import aiRoutes from './routes/aiRouts';
import analytics from './routes/analytics';
import productAgentRoutes from './routes/productAgents';
// import oderRoutes from './routes/order';
import { JwtUser } from './utils/jwt';
import multipart from '@fastify/multipart';
import oauthRoutes from './routes/oauth';
import businessDocumentRoutes from './routes/businessDocuments';
import agentRoutes from './routes/agents';
import { startSubscriptionCron } from './jobs/subscriptionCron';
import subscriptionRoutes from './routes/subscription';



dotenv.config();

const app: FastifyInstance = fastify({
  logger: true,
});

// CORS Configuration
app.register(cors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
'https://mmshop.co.zw',
'https://www.mmshop.co.zw'
    ,
    'https://dimbop-digital-dasboard.netlify.app',
    'https://dimbop-users-site.vercel.app',
    'https://dimbop-digital-marketing-dashboard.vercel.app',
    'https://dimbop-digital-marketing-dashboard-c4u3iq736.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length'],
  strictPreflight: true
});

// Multipart/Form-data support for file uploads
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 3, // Maximum 3 files
    fieldSize: 1024 * 1024, // 1MB field size limit
  }
});

// JWT Configuration
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'your-very-secure-secret',
  cookie: {
    cookieName: 'token',
    signed: false,
  },
  sign: {
    expiresIn: '1d',
  },
});

// JWT typings
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JwtUser;
  }
}

startSubscriptionCron();

// Register routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(oauthRoutes, { prefix: '/api/oauth' });
app.register(productRoutes, { prefix: '/api/products' });
app.register(blogRoutes, { prefix: '/api/blogs' });
app.register(analytics, { prefix: '/api/analytics' });
// app.register(oderRoutes, { prefix: '/api/order' });
app.register(aiRoutes, { prefix: '/api/assitence' });
app.register(serachroute, { prefix: '/api/search' });
app.register(businessDocumentRoutes, { prefix: '/api/business-documents' });
app.register(agentRoutes, { prefix: '/api/agents' });
app.register(subscriptionRoutes, { prefix: '/api/v1' });


// Register routes
app.register(productAgentRoutes, { prefix: '/api/agentproduct' });
// app.register(userpayments, { prefix: '/api/userpayments' });

// Health check endpoints
app.get('/', async (request, reply) => {
  return { 
    message: 'API is running!',
    status: 'ok',
    cloudinary: 'enabled'
  };
});

app.get('/health', async () => {
  return { status: 'ok' };
});

// Debug env info in non-production only
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/env', async () => {
    return {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      host: process.env.HOST,
      databaseUrl: process.env.DATABASE_URL ? 'Set (value hidden)' : 'Not Set',
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set',
        apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set (value hidden)' : 'Not Set',
      }
    };
  });
}

// JWT auth decorator
app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ success: false, error: 'Unauthorized' });
  }
});

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    const address = await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || '0.0.0.0',
    });
    
    console.log(`🚀 Server listening at ${address}`);
    console.log(`📦 Cloudinary integration: ${process.env.CLOUDINARY_CLOUD_NAME ? 'ENABLED' : 'DISABLED'}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n⚠️  Received ${signal}, closing server gracefully...`);
    await prisma.$disconnect();
    await app.close();
    console.log('✅ Server closed');
    process.exit(0);
  });
});

start().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}