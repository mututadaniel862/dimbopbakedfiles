import { z } from 'zod';
 
export const shippingDetailsSchema = z.object({
    
    user_id: z.number().optional().nullable(),
    full_name: z.string().max(255),
    country: z.string().max(100),
    city: z.string().max(100),
    street: z.string().max(255),
    apartment: z.string().max(255).optional(),
    postal_code: z.string().max(20),
    phone: z.string().max(20),
    email: z.string().email().max(255),
    created_at: z.date().optional(),
    user: z.object({
      id: z.number(),
      email: z.string().email()
    }).optional()
  });
  
  export type ShippingDetails = z.infer<typeof shippingDetailsSchema>;