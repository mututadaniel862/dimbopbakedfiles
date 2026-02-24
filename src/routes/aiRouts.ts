// // // import { FastifyInstance } from 'fastify';
// // // import { authenticate } from '../middlewares/auth'; // Your JWT auth middleware
// // // import { handleUserQuery, handleGenerateReport } from '../controllers/ai/aiController';

// // // export default async (app: FastifyInstance) => {
// // //   // Only authenticated users can access these endpoints
// // //   app.post('/ai/query', { preHandler: [authenticate] }, handleUserQuery);
// // //   app.post('/ai/report', { preHandler: [authenticate] }, handleGenerateReport);
// // // };







// // import { FastifyInstance } from 'fastify';
// // import { authenticate } from '../middlewares/auth';
// // import { handleUserQuery, handleGenerateReport, handleBulkAnalysis } from '../controllers/ai/aiController';

// // export default async (app: FastifyInstance) => {
// //   // Register multipart support for file uploads
// //   await app.register(require('@fastify/multipart'), {
// //     limits: {
// //       fileSize: 10 * 1024 * 1024, // 10MB limit
// //     }
// //   });

// //   // AI Query endpoint - supports text, images, and audio
// //   app.post('/ai/query', { 
// //     preHandler: [authenticate]
// //   }, handleUserQuery);

// //   // Report generation endpoint
// //   app.post('/ai/report', { 
// //     preHandler: [authenticate] 
// //   }, handleGenerateReport);

// //   // Bulk analysis endpoint
// //   app.get('/ai/analysis', { 
// //     preHandler: [authenticate] 
// //   }, handleBulkAnalysis);

// //   // Health check endpoint
// //   app.get('/ai/health', async (request, reply) => {
// //     reply.send({ 
// //       status: 'healthy', 
// //       services: {
// //         gemini: !!process.env.GEMINI_API_KEY,
// //         database: true,
// //         multimodal: true
// //       }
// //     });
// //   });
// // };




// import { FastifyInstance } from 'fastify';
// import { authenticate } from '../middlewares/auth';
// import { handleUserQuery, handleGenerateReport, handleBulkAnalysis } from '../controllers/ai/aiController';

// export default async (app: FastifyInstance) => {
//   // AI Query endpoint - supports text, images, and audio
//   app.post('/ai/query', {
//     preHandler: [authenticate]
//   }, handleUserQuery);

//   // Report generation endpoint
//   app.post('/ai/report', {
//     preHandler: [authenticate]
//   }, handleGenerateReport);

//   // Bulk analysis endpoint
//   app.get('/ai/analysis', {
//     preHandler: [authenticate]
//   }, handleBulkAnalysis);

//   // Health check endpoint
//   app.get('/ai/health', async (request, reply) => {
//     reply.send({
//       status: 'healthy',
//       services: {
//         gemini: !!process.env.GEMINI_API_KEY,
//         database: true,
//         multimodal: true
//       }
//     });
//   });
// };// routes/aiRoutes.ts


import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middlewares/auth';
import { handleUserQuery, handleGenerateReport, handleBulkAnalysis } from '../controllers/ai/aiController';

export default async (app: FastifyInstance) => {
  // AI Query endpoint - supports text, images, and audio (PUBLIC)
  app.post('/ai/query', handleUserQuery);

  // Report generation endpoint (PUBLIC)
  app.post('/ai/report', handleGenerateReport);

  // Bulk analysis endpoint (PUBLIC)
  app.get('/ai/analysis', handleBulkAnalysis);

  // Health check endpoint
  app.get('/ai/health', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({
      status: 'healthy',
      services: {
        gemini: !!process.env.GEMINI_API_KEY,
        database: true,
        multimodal: true
      }
    });
  });
};