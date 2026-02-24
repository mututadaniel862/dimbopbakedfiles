import { z } from "zod";

export const orderItemSchema = z.object({
    // id: z.number(),
    order_id: z.number().nullable().optional(),
    product_id: z.number().nullable().optional(),
    quantity: z.number(),
    price: z.number() // Prisma Decimal
  });
  
  