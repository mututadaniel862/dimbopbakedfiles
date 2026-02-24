import { z } from 'zod';

export const multimediaQuerySchema = z.object({
  user_id: z.number().int().positive().optional(),
  file_type: z.enum(['pdf', 'image', 'audio', 'video', 'document']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type MultimediaQuery = z.infer<typeof multimediaQuerySchema>;