"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRequestSchema = exports.aiResponseSchema = exports.aiQuerySchema = void 0;
// // Input for AI query by users
// export const aiQuerySchema = z.object({
//   query: z.string().min(3).max(1000),
// });
// // Output AI response
// export const aiResponseSchema = z.object({
//   message: z.string(), // AI answer
//   report_type: z.enum(['sales', 'user_activity', 'inventory', 'revenue']).optional(),
//   start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
//   end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
// });
const zod_1 = require("zod");
exports.aiQuerySchema = zod_1.z.object({
    query: zod_1.z.string().min(1, 'Query cannot be empty').max(1000, 'Query too long'),
    image_url: zod_1.z.string().url().optional(),
    audio_url: zod_1.z.string().url().optional(),
});
exports.aiResponseSchema = zod_1.z.object({
    message: zod_1.z.string(),
    report_type: zod_1.z.string().optional(),
    start_date: zod_1.z.string().optional(),
    end_date: zod_1.z.string().optional(),
    analysis_type: zod_1.z.enum(['text', 'image', 'audio', 'multimodal']).optional(),
});
exports.reportRequestSchema = zod_1.z.object({
    report_type: zod_1.z.enum([
        'products', 'product-sales', 'inventory',
        'users', 'user-activity', 'customers',
        'blogs', 'content', 'articles',
        'sales', 'revenue', 'financial',
        'general', 'overview'
    ]),
    start_date: zod_1.z.string().optional(),
    end_date: zod_1.z.string().optional(),
});
//# sourceMappingURL=Aischema.js.map