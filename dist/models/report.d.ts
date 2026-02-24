import { z } from 'zod';
export declare const reportTypeEnum: z.ZodEnum<["monthly", "annual", "financial", "user_activity", "inventory", "custom", "multimedia"]>;
export declare const reportSchema: z.ZodObject<{
    report_type: z.ZodOptional<z.ZodEnum<["monthly", "annual", "financial", "user_activity", "inventory", "custom", "multimedia"]>>;
    report_content: z.ZodOptional<z.ZodString>;
    report_date: z.ZodOptional<z.ZodDate>;
    user_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    user_id?: number | undefined;
    report_type?: "custom" | "inventory" | "financial" | "user_activity" | "monthly" | "annual" | "multimedia" | undefined;
    report_content?: string | undefined;
    report_date?: Date | undefined;
}, {
    user_id?: number | undefined;
    report_type?: "custom" | "inventory" | "financial" | "user_activity" | "monthly" | "annual" | "multimedia" | undefined;
    report_content?: string | undefined;
    report_date?: Date | undefined;
}>;
export type Report = z.infer<typeof reportSchema>;
