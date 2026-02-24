import {z} from "zod"
export const paymentSchema = z.object({
    
    order_id: z.number().optional().nullable(),
    user_id: z.number().optional().nullable(),
    payment_method: z.string().max(50).optional(),
    transaction_id: z.string().max(255),
    customerMsisdn: z.string().optional().nullable(),
    status: z.string().max(50).default("Pending"),
    // created_at: z.date().optional(),

  });
  
  export type Payment = z.infer<typeof paymentSchema>;