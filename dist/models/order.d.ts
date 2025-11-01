import { z } from "zod";
export declare const orderSchema: z.ZodObject<{
    user_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    total_price: z.ZodNumber;
    status: z.ZodDefault<z.ZodString>;
    created_at: z.ZodOptional<z.ZodDate>;
    browser_used: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodDate>;
    order_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        order_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        product_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        price: number;
        quantity: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }, {
        price: number;
        quantity: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }>, "many">>;
    financials: z.ZodOptional<z.ZodArray<z.ZodObject<{
        order_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        type: z.ZodOptional<z.ZodString>;
        amount: z.ZodNumber;
        description: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        type?: string | undefined;
        description?: string | undefined;
        created_at?: Date | undefined;
        order_id?: number | null | undefined;
    }, {
        amount: number;
        type?: string | undefined;
        description?: string | undefined;
        created_at?: Date | undefined;
        order_id?: number | null | undefined;
    }>, "many">>;
    payments: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: string;
    total_price: number;
    created_at?: Date | undefined;
    updated_at?: Date | undefined;
    payments?: {
        status: string;
        transaction_id: string;
        user_id?: number | null | undefined;
        order_id?: number | null | undefined;
        payment_method?: string | undefined;
        customerMsisdn?: string | null | undefined;
    }[] | undefined;
    user_id?: number | null | undefined;
    order_items?: {
        price: number;
        quantity: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }[] | undefined;
    browser_used?: string | undefined;
    financials?: {
        amount: number;
        type?: string | undefined;
        description?: string | undefined;
        created_at?: Date | undefined;
        order_id?: number | null | undefined;
    }[] | undefined;
}, {
    total_price: number;
    status?: string | undefined;
    created_at?: Date | undefined;
    updated_at?: Date | undefined;
    payments?: {
        transaction_id: string;
        status?: string | undefined;
        user_id?: number | null | undefined;
        order_id?: number | null | undefined;
        payment_method?: string | undefined;
        customerMsisdn?: string | null | undefined;
    }[] | undefined;
    user_id?: number | null | undefined;
    order_items?: {
        price: number;
        quantity: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }[] | undefined;
    browser_used?: string | undefined;
    financials?: {
        amount: number;
        type?: string | undefined;
        description?: string | undefined;
        created_at?: Date | undefined;
        order_id?: number | null | undefined;
    }[] | undefined;
}>;
