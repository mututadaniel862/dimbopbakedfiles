import { z } from "zod";
export declare const financialTypeEnum: z.ZodEnum<["income", "expense", "refund", "tax", "shipping"]>;
export declare const financialSchema: z.ZodObject<{
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
}>;
export type Financial = z.infer<typeof financialSchema>;
export declare const revenueSchema: z.ZodObject<{
    total_income: z.ZodDefault<z.ZodNumber>;
    total_expense: z.ZodDefault<z.ZodNumber>;
    report_month: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    total_income: number;
    total_expense: number;
    report_month: Date;
}, {
    report_month: Date;
    total_income?: number | undefined;
    total_expense?: number | undefined;
}>;
export type Revenue = z.infer<typeof revenueSchema>;
