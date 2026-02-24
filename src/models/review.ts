

// import { z } from "zod";

// export const reviewSchema = z.object({
//   user_id: z.number(),
//   product_id: z.number(),
//   rating: z.number().min(1).max(5),
//   comment: z.string().min(1),
//   created_at: z.coerce.date().optional()
// });






import { z } from "zod";

export const reviewSchema = z.object({
  user_id: z.number(),
  product_id: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
    username: z.string().default("Anonymous"),
  created_at: z.coerce.date().optional()
});

export const reviewLikeSchema = z.object({
  user_id: z.number(),
  is_like: z.boolean()
});

export const reviewCommentSchema = z.object({
  user_id: z.number().optional(),
  comment: z.string().min(1),
   username: z.string().default("Anonymous") // ✅ added username 
});

export const productViewSchema = z.object({
  user_id: z.number().optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
   username: z.string().default("Anonymous")
});