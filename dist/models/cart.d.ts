import { z } from "zod";
export declare const cartSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    product_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    quantity: z.ZodNumber;
    created_at: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    created_at?: Date | undefined;
    user_id?: number | null | undefined;
    product_id?: number | null | undefined;
}, {
    quantity: number;
    created_at?: Date | undefined;
    user_id?: number | null | undefined;
    product_id?: number | null | undefined;
}>;
