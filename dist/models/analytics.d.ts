import { z } from "zod";
export declare const userAnalyticsSchema: z.ZodObject<{
    user_id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    browser: z.ZodOptional<z.ZodString>;
    device: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    created_at?: Date | undefined;
    user_id?: number | null | undefined;
    browser?: string | undefined;
    device?: string | undefined;
}, {
    created_at?: Date | undefined;
    user_id?: number | null | undefined;
    browser?: string | undefined;
    device?: string | undefined;
}>;
export type UserAnalytics = z.infer<typeof userAnalyticsSchema>;
