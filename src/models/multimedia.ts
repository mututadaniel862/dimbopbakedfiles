import { z } from 'zod';

export const multimediaSchema = z.object({
  user_id: z.number().int().positive().optional(), // Optional user ID (nullable in schema)
  file_type: z.enum(['pdf', 'image', 'audio', 'video', 'document']), // Supported file types
  file_url: z.string().min(1, 'File URL is required').max(255, 'File URL too long'),
  extracted_text: z.string().optional(), // Extracted text is optional
});

export const multimediaCreateSchema = z.object({
  file: z.any(), // Handled by fastify-multipart
  user_id: z.number().int().positive().optional(),
});

export type Multimedia = z.infer<typeof multimediaSchema>;
export type MultimediaCreate = z.infer<typeof multimediaCreateSchema>;