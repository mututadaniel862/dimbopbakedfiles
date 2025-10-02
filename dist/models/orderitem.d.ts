import { z } from "zod";
export declare const orderItemSchema: z.ZodObject<{
    order_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    product_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    price: number;
    quantity: number;
    order_id?: number | null | undefined;
    product_id?: number | null | undefined;
}, {
    price: number;
    quantity: number;
    order_id?: number | null | undefined;
    product_id?: number | null | undefined;
}>;
