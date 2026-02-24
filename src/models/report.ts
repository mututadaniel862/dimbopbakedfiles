// import {z} from "zod"
// export const reportTypeEnum = z.enum([
//     "monthly",
//     "annual",
//     "financial",
//     "user_activity",
//     "inventory",
//     "custom"
//   ]);
  
//   export const reportSchema = z.object({
//     report_type: reportTypeEnum.optional(),
//     report_content: z.string().optional(),
//     report_date: z.date().optional()
//   });
  
//   export type Report = z.infer<typeof reportSchema>;






import { z } from 'zod';

export const reportTypeEnum = z.enum([
  'monthly',
  'annual',
  'financial',
  'user_activity',
  'inventory',
  'custom',
  'multimedia', 
]);

export const reportSchema = z.object({
  report_type: reportTypeEnum.optional(),
  report_content: z.string().optional(),
  report_date: z.date().optional(),
  user_id: z.number().int().positive().optional(), 
});

export type Report = z.infer<typeof reportSchema>;