import {z} from "zod";

export const userAnalyticsSchema = z.object({

    user_id: z.number().optional().nullable(),
    browser: z.string().max(50).optional(),
    device: z.string().max(50).optional(),
    created_at: z.date().optional(),
  });
  
  export type UserAnalytics = z.infer<typeof userAnalyticsSchema>;