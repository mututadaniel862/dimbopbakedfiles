import { z } from 'zod';
export declare const aiQuerySchema: z.ZodObject<{
    query: z.ZodString;
    image_url: z.ZodOptional<z.ZodString>;
    audio_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    query: string;
    image_url?: string | undefined;
    audio_url?: string | undefined;
}, {
    query: string;
    image_url?: string | undefined;
    audio_url?: string | undefined;
}>;
export declare const aiResponseSchema: z.ZodObject<{
    message: z.ZodString;
    report_type: z.ZodOptional<z.ZodString>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
    analysis_type: z.ZodOptional<z.ZodEnum<["text", "image", "audio", "multimodal"]>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    report_type?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    analysis_type?: "text" | "image" | "audio" | "multimodal" | undefined;
}, {
    message: string;
    report_type?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    analysis_type?: "text" | "image" | "audio" | "multimodal" | undefined;
}>;
export declare const reportRequestSchema: z.ZodObject<{
    report_type: z.ZodEnum<["products", "product-sales", "inventory", "users", "user-activity", "customers", "blogs", "content", "articles", "sales", "revenue", "financial", "general", "overview"]>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    report_type: "users" | "blogs" | "products" | "content" | "revenue" | "product-sales" | "inventory" | "user-activity" | "customers" | "articles" | "sales" | "financial" | "general" | "overview";
    start_date?: string | undefined;
    end_date?: string | undefined;
}, {
    report_type: "users" | "blogs" | "products" | "content" | "revenue" | "product-sales" | "inventory" | "user-activity" | "customers" | "articles" | "sales" | "financial" | "general" | "overview";
    start_date?: string | undefined;
    end_date?: string | undefined;
}>;
export type AIQueryType = z.infer<typeof aiQuerySchema>;
export type AIResponseType = z.infer<typeof aiResponseSchema>;
export type ReportRequestType = z.infer<typeof reportRequestSchema>;
