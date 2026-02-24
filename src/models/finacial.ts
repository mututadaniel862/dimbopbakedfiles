import {z} from "zod"
export const financialTypeEnum = z.enum([
    "income",
    "expense",
    "refund",
    "tax",
    "shipping"
  ]);
  
  export const financialSchema = z.object({
  
    order_id: z.number().nullable().optional(),
    type: z.string().optional(),
    amount: z.number(),
    description: z.string().optional(),
     created_at: z.coerce.date().optional(),

  });

  
  export type Financial = z.infer<typeof financialSchema>;
  
  export const revenueSchema = z.object({
   
    total_income: z.number().default(0),
    total_expense: z.number().default(0),
    report_month: z.date()
  });
  
  export type Revenue = z.infer<typeof revenueSchema>;