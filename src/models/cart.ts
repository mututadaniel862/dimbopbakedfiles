import { z } from "zod";

export const cartSchema = z.object({
  user_id: z.number().nullable().optional(),
  product_id: z.number().nullable().optional(),
  quantity: z.number(),
  created_at: z.coerce.date().optional()
});
