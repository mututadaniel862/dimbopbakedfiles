import { z } from 'zod';
export declare const shippingDetailsSchema: z.ZodObject<{
    user_id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    full_name: z.ZodString;
    country: z.ZodString;
    city: z.ZodString;
    street: z.ZodString;
    apartment: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodString;
    phone: z.ZodString;
    email: z.ZodString;
    created_at: z.ZodOptional<z.ZodDate>;
    user: z.ZodOptional<z.ZodObject<{
        id: z.ZodNumber;
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        id: number;
    }, {
        email: string;
        id: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    phone: string;
    full_name: string;
    country: string;
    city: string;
    street: string;
    postal_code: string;
    user?: {
        email: string;
        id: number;
    } | undefined;
    created_at?: Date | undefined;
    user_id?: number | null | undefined;
    apartment?: string | undefined;
}, {
    email: string;
    phone: string;
    full_name: string;
    country: string;
    city: string;
    street: string;
    postal_code: string;
    user?: {
        email: string;
        id: number;
    } | undefined;
    created_at?: Date | undefined;
    user_id?: number | null | undefined;
    apartment?: string | undefined;
}>;
export type ShippingDetails = z.infer<typeof shippingDetailsSchema>;
