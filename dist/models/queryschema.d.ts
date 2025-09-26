import { z } from 'zod';
export declare const multimediaQuerySchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodNumber>;
    file_type: z.ZodOptional<z.ZodEnum<["pdf", "image", "audio", "video", "document"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    user_id?: number | undefined;
    file_type?: "image" | "audio" | "pdf" | "video" | "document" | undefined;
}, {
    user_id?: number | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    file_type?: "image" | "audio" | "pdf" | "video" | "document" | undefined;
}>;
export type MultimediaQuery = z.infer<typeof multimediaQuerySchema>;
