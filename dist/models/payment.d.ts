import { z } from "zod";
export declare const paymentSchema: z.ZodObject<{
    order_id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    user_id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    payment_method: z.ZodOptional<z.ZodString>;
    transaction_id: z.ZodString;
    customerMsisdn: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    transaction_id: string;
    user_id?: number | null | undefined;
    order_id?: number | null | undefined;
    payment_method?: string | undefined;
    customerMsisdn?: string | null | undefined;
}, {
    transaction_id: string;
    status?: string | undefined;
    user_id?: number | null | undefined;
    order_id?: number | null | undefined;
    payment_method?: string | undefined;
    customerMsisdn?: string | null | undefined;
}>;
export type Payment = z.infer<typeof paymentSchema>;
