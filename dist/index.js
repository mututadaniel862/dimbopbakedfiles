"use strict";
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
const dotenv = __importStar(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const serachroute_1 = __importDefault(require("./routes/serachroute"));
const productroute_1 = __importDefault(require("./routes/productroute"));
const blog_1 = __importDefault(require("./routes/blog"));
const aiRouts_1 = __importDefault(require("./routes/aiRouts"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const order_1 = __importDefault(require("./routes/order"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const static_1 = __importDefault(require("@fastify/static"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv.config();
const app = (0, fastify_1.default)({
    logger: true,
});
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
// app.register(multipart);// In your main server file (around line 55)
app.register(multipart_1.default, {
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 3, // Maximum 3 files
        fieldSize: 1024 * 1024, // 1MB field size limit
    }
});
// Serve static uploads with proper CORS headers
app.register(static_1.default, {
    root: path_1.default.join(__dirname, 'Uploads'),
    prefix: '/Uploads/',
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
    },
});
// Ensure Uploads directory exists
const uploadsDir = path_1.default.join(__dirname, 'Uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
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
            uploadsExists: fs_1.default.existsSync(uploadsDir),
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
        const address = await app.listen({
            port: Number(process.env.PORT) || 3000,
            host: process.env.HOST || '0.0.0.0',
        });
        console.log(`Server listening at ${address}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
['SIGTERM', 'SIGINT'].forEach((signal) => {
    process.on(signal, async () => {
        await db_1.default.$disconnect();
        await app.close();
        process.exit(0);
    });
});
start().catch((err) => {
    console.error(err);
    process.exit(1);
});
// $env:Path += ";C:\Program Files\PostgreSQL\17\bin"
// pg_dump -U postgres -d inventortest > inventortest_dump.sql 
// Get-Content inventortest_dump.sql | psql "postgresql://postgres:CEJtqVqKtvmApKPMuKAsCbrwXHoNuRtz@caboose.proxy.rlwy.net:29455/railway"
// https://platform.openai.com/docs/overview
// https://platform.openai.com/api-keys
//# sourceMappingURL=index.js.map