"use strict";
// import * as dotenv from 'dotenv';
// import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
// import cors from '@fastify/cors';
// import fastifyJwt from '@fastify/jwt';
// import prisma from './config/db';
// import authRoutes from './routes/auth';
// import serachroute from './routes/serachroute';
// import userpayments from './routes/user';
// import productRoutes from './routes/productroute';
// import blogRoutes from './routes/blog';
// import aiRoutes from './routes/aiRouts';
// import analytics from './routes/analytics';
// import oderRoutes from './routes/order';
// import { JwtUser } from './utils/jwt';
// import multipart from '@fastify/multipart';
// import fastifyStatic from '@fastify/static';
// import path from 'path';
// import fs from 'fs';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const app: FastifyInstance = fastify({
//   logger: true,
// });
// app.register(cors, {
//   origin: [
//     'http://localhost:3000',
//     'http://localhost:5173',
//     'https://dimbop-digital-dasboard.netlify.app',
//     'https://dimbop-users-site.vercel.app',
//     'https://dimbop-digital-marketing-dashboard.vercel.app',
//      'https://dimbop-digital-marketing-dashboard-c4u3iq736.vercel.app'
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Content-Length'],
//   strictPreflight: true
// });
// // app.register(multipart);// In your main server file (around line 55)
// app.register(multipart, {
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//     files: 3, // Maximum 3 files
//     fieldSize: 1024 * 1024, // 1MB field size limit
//   }
// });
// // Serve static uploads with proper CORS headers
// app.register(fastifyStatic, {
//   root: path.join(__dirname, 'Uploads'),
//   prefix: '/Uploads/',
//   setHeaders: (res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
//   },
// });
// // Ensure Uploads directory exists
// const uploadsDir = path.join(__dirname, 'Uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }
// app.register(fastifyJwt, {
//   secret: process.env.JWT_SECRET || 'your-very-secure-secret',
//   cookie: {
//     cookieName: 'token',
//     signed: false,
//   },
//   sign: {
//     expiresIn: '1d',
//   },
// });
// // JWT typings
// declare module '@fastify/jwt' {
//   interface FastifyJWT {
//     user: JwtUser;
//   }
// }
// // Register routes
// app.register(authRoutes, { prefix: '/api/auth' });
// app.register(productRoutes, { prefix: '/api/products' });
// app.register(blogRoutes, { prefix: '/api/blogs' });
// app.register(analytics, { prefix: '/api/analytics' });
// app.register(oderRoutes, { prefix: '/api/order' });
// app.register(aiRoutes, { prefix: '/api/assitence' });
// app.register(serachroute, { prefix: '/api/search' });
// app.register(userpayments, { prefix: '/api/userpayments' });
// // Health check endpoint  
// // ...............here
// app.get('/', async (request, reply) => {
//   return { message: 'API is running!' };
// });
// app.get('/health', async () => {
//   return { status: 'ok' };
// });
// // Debug env info in non-production only
// if (process.env.NODE_ENV !== 'production') {
//   app.get('/api/debug/env', async () => {
//     return {
//       nodeEnv: process.env.NODE_ENV,
//       port: process.env.PORT,
//       host: process.env.HOST,
//       databaseUrl: process.env.DATABASE_URL ? 'Set (value hidden)' : 'Not Set',
//       uploadsDir,
//       uploadsExists: fs.existsSync(uploadsDir),
//     };
//   });
// }
// // JWT auth decorator
// app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     await request.jwtVerify();
//   } catch (err) {
//     reply.code(401).send({ success: false, error: 'Unauthorized' });
//   }
// });
// const start = async () => {
//   try {
//     await prisma.$connect();
//     const address = await app.listen({
//       port: Number(process.env.PORT) || 3000,
//       host: process.env.HOST || '0.0.0.0',
//     });
//     console.log(`Server listening at ${address}`);
//   } catch (err) {
//     app.log.error(err);
//     process.exit(1);
//   }
// };
// ['SIGTERM', 'SIGINT'].forEach((signal) => {
//   process.on(signal, async () => {
//     await prisma.$disconnect();
//     await app.close();
//     process.exit(0);
//   });
// });
// start().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
// declare module 'fastify' {
//   interface FastifyInstance {
//     authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//   }
// }
// $env:Path += ";C:\Program Files\PostgreSQL\17\bin"
// pg_dump -U postgres -d inventortest > inventortest_dump.sql 
// Get-Content inventortest_dump.sql | psql "postgresql://postgres:CEJtqVqKtvmApKPMuKAsCbrwXHoNuRtz@caboose.proxy.rlwy.net:29455/railway"
// https://platform.openai.com/docs/overview
// https://platform.openai.com/api-keys
const dotenv = __importStar(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const serachroute_1 = __importDefault(require("./routes/serachroute"));
const user_1 = __importDefault(require("./routes/user"));
const productroute_1 = __importDefault(require("./routes/productroute"));
const blog_1 = __importDefault(require("./routes/blog"));
const aiRouts_1 = __importDefault(require("./routes/aiRouts"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const order_1 = __importDefault(require("./routes/order"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
dotenv.config();
const app = (0, fastify_1.default)({
    logger: true,
});
// CORS Configuration
app.register(cors_1.default, {
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
// Multipart/Form-data support for file uploads
app.register(multipart_1.default, {
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 3, // Maximum 3 files
        fieldSize: 1024 * 1024, // 1MB field size limit
    }
});
// JWT Configuration
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'your-very-secure-secret',
    cookie: {
        cookieName: 'token',
        signed: false,
    },
    sign: {
        expiresIn: '1d',
    },
});
// Register routes
app.register(auth_1.default, { prefix: '/api/auth' });
app.register(productroute_1.default, { prefix: '/api/products' });
app.register(blog_1.default, { prefix: '/api/blogs' });
app.register(analytics_1.default, { prefix: '/api/analytics' });
app.register(order_1.default, { prefix: '/api/order' });
app.register(aiRouts_1.default, { prefix: '/api/assitence' });
app.register(serachroute_1.default, { prefix: '/api/search' });
app.register(user_1.default, { prefix: '/api/userpayments' });
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
app.decorate('authenticate', async (request, reply) => {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        reply.code(401).send({ success: false, error: 'Unauthorized' });
    }
});
const start = async () => {
    try {
        await db_1.default.$connect();
        console.log('✅ Database connected successfully');
        const address = await app.listen({
            port: Number(process.env.PORT) || 3000,
            host: process.env.HOST || '0.0.0.0',
        });
        console.log(`🚀 Server listening at ${address}`);
        console.log(`📦 Cloudinary integration: ${process.env.CLOUDINARY_CLOUD_NAME ? 'ENABLED' : 'DISABLED'}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
// Graceful shutdown
['SIGTERM', 'SIGINT'].forEach((signal) => {
    process.on(signal, async () => {
        console.log(`\n⚠️  Received ${signal}, closing server gracefully...`);
        await db_1.default.$disconnect();
        await app.close();
        console.log('✅ Server closed');
        process.exit(0);
    });
});
start().catch((err) => {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map