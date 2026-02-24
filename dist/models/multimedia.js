"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multimediaCreateSchema = exports.multimediaSchema = void 0;
const zod_1 = require("zod");
exports.multimediaSchema = zod_1.z.object({
    user_id: zod_1.z.number().int().positive().optional(), // Optional user ID (nullable in schema)
    file_type: zod_1.z.enum(['pdf', 'image', 'audio', 'video', 'document']), // Supported file types
    file_url: zod_1.z.string().min(1, 'File URL is required').max(255, 'File URL too long'),
    extracted_text: zod_1.z.string().optional(), // Extracted text is optional
});
exports.multimediaCreateSchema = zod_1.z.object({
    file: zod_1.z.any(), // Handled by fastify-multipart
    user_id: zod_1.z.number().int().positive().optional(),
});
//# sourceMappingURL=multimedia.js.map