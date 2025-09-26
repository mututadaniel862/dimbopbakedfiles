import { z } from "zod";
export declare const reviewSchema: z.ZodObject<{
    user_id: z.ZodNumber;
    product_id: z.ZodNumber;
    rating: z.ZodNumber;
    comment: z.ZodString;
    username: z.ZodDefault<z.ZodString>;
    created_at: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    username: string;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    created_at?: Date | undefined;
}, {
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    username?: string | undefined;
    created_at?: Date | undefined;
}>;
export declare const reviewLikeSchema: z.ZodObject<{
    user_id: z.ZodNumber;
    is_like: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    user_id: number;
    is_like: boolean;
}, {
    user_id: number;
    is_like: boolean;
}>;
export declare const reviewCommentSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodNumber>;
    comment: z.ZodString;
    username: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    comment: string;
    user_id?: number | undefined;
}, {
    comment: string;
    username?: string | undefined;
    user_id?: number | undefined;
}>;
export declare const productViewSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodNumber>;
    ip_address: z.ZodOptional<z.ZodString>;
    user_agent: z.ZodOptional<z.ZodString>;
    username: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    user_id?: number | undefined;
    ip_address?: string | undefined;
    user_agent?: string | undefined;
}, {
    username?: string | undefined;
    user_id?: number | undefined;
    ip_address?: string | undefined;
    user_agent?: string | undefined;
}>;
