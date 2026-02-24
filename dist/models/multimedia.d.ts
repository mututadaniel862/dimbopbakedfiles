import { z } from 'zod';
export declare const multimediaSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodNumber>;
    file_type: z.ZodEnum<["pdf", "image", "audio", "video", "document"]>;
    file_url: z.ZodString;
    extracted_text: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    file_type: "image" | "video" | "pdf" | "audio" | "document";
    file_url: string;
    user_id?: number | undefined;
    extracted_text?: string | undefined;
}, {
    file_type: "image" | "video" | "pdf" | "audio" | "document";
    file_url: string;
    user_id?: number | undefined;
    extracted_text?: string | undefined;
}>;
export declare const multimediaCreateSchema: z.ZodObject<{
    file: z.ZodAny;
    user_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    user_id?: number | undefined;
    file?: any;
}, {
    user_id?: number | undefined;
    file?: any;
}>;
export type Multimedia = z.infer<typeof multimediaSchema>;
export type MultimediaCreate = z.infer<typeof multimediaCreateSchema>;
