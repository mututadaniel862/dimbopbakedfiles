import * as dotenv from 'dotenv';
import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import prisma from './config/db';
import authRoutes from './routes/auth';
import serachroute from './routes/serachroute';
import productRoutes from './routes/productroute';
import blogRoutes from './routes/blog';
import aiRoutes from './routes/aiRouts';
import analytics from './routes/analytics';
import oderRoutes from './routes/order';
import { JwtUser } from './utils/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';


dotenv.config();

const app: FastifyInstance = fastify({
  logger: true,
});




app.register(cors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
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

// 2. Add explicit OPTIONS handler for all routes



// app.register(cors, {
//   origin: [
//     'http://localhost:5173',
//     'http://localhost:3000',
//     'https://dimbop-digital-dasboard.netlify.app',
//     'https://dimbop-users-site.vercel.app',
//     'https://dimbop-digital-marketing-dashboard.vercel.app'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true
// });


// UPDATED CORS CONFIGURATION - This is the key fix
// app.register(cors, {
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       'http://localhost:3000',
//       'http://localhost:5173',
//       'https://dimbop-digital-dasboard.netlify.app',
//       'https://dimbop-users-site.vercel.app',
//       'https://dimbop-digital-marketing-dashboard.vercel.app',
//     ];

//     // Allow requests with no origin (like mobile apps, curl, Postman)
//     if (!origin) {
//       return callback(null, true);
//     }

//     // Normalize origin by removing trailing slash if present
//     const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

//     // Check if the normalized origin is in the allowed list
//     if (allowedOrigins.includes(normalizedOrigin)) {
//       return callback(null, true);
//     }

//     // Block other origins
//     console.error(`CORS blocked for origin: ${origin}`);
//     return callback(new Error('Not allowed by CORS'), false);
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//   exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// });


// ADD EXPLICIT OPTIONS HANDLER
// app.options('*', async (request, reply) => {
//   return reply.code(204).send();
// });


// app.register(multipart);// In your main server file (around line 55)
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 3, // Maximum 3 files
    fieldSize: 1024 * 1024, // 1MB field size limit
  }
});

// Serve static uploads with proper CORS headers
app.register(fastifyStatic, {
  root: path.join(__dirname, 'Uploads'),
  prefix: '/Uploads/',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  },
});

// Ensure Uploads directory exists
const uploadsDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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


// Register routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(productRoutes, { prefix: '/api/products' });
app.register(blogRoutes, { prefix: '/api/blogs' });
app.register(analytics, { prefix: '/api/analytics' });
app.register(oderRoutes, { prefix: '/api/order' });
app.register(aiRoutes, { prefix: '/api/assitence' });
app.register(serachroute, { prefix: '/api/search' });

// Health check endpoint  
// ...............here
app.get('/', async (request, reply) => {
  return { message: 'API is running!' };
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
      uploadsDir,
      uploadsExists: fs.existsSync(uploadsDir),
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
    const address = await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || '0.0.0.0',
    });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, async () => {
    await prisma.$disconnect();
    await app.close();
    process.exit(0);
  });
});

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}


// $env:Path += ";C:\Program Files\PostgreSQL\17\bin"
// pg_dump -U postgres -d inventortest > inventortest_dump.sql 
// Get-Content inventortest_dump.sql | psql "postgresql://postgres:CEJtqVqKtvmApKPMuKAsCbrwXHoNuRtz@caboose.proxy.rlwy.net:29455/railway"


// https://platform.openai.com/docs/overview
// https://platform.openai.com/api-keys