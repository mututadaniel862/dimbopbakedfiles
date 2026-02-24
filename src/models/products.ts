import { z } from "zod";
import { cartSchema } from "./cart";
import { orderItemSchema } from "./orderitem";
import {orderSchema} from "./order"
// import { categorySchema } from "./category";
import { reviewSchema, reviewLikeSchema, reviewCommentSchema, productViewSchema } from "./review";


export const productSchema = z.object({
//   id: z.number().int().positive(),
  name: z.string().max(255),
  description: z.string().optional(),
  price: z.number().min(0), 
  stock_quantity: z.number().optional().default(0),
  image_url: z.string().optional(),
  created_at: z.coerce.date().optional(), 
  updated_at: z.coerce.date().optional(),
  discount_percentage: z.number().optional().default(0),
  views: z.number().optional().default(0),
  whatsapp_number: z.string().optional(),

  // ⬇️⬇️⬇️ NEW APPROVAL FIELDS ⬇️⬇️⬇️
  uploaded_by: z.number().optional(),
  approval_status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  approved_by: z.number().optional(),
  approved_at: z.coerce.date().optional(),
  rejection_reason: z.string().optional(),
  approval_deadline: z.coerce.date().optional(),
  is_visible: z.boolean().default(false),
  // ⬆️⬆️⬆️ END NEW FIELDS ⬆️⬆️⬆️

  cart: z.array(cartSchema).optional(),
  order_items: z.array(orderItemSchema).optional(), 
  category_name: z.string().optional(), 
  reviews: z.array(reviewSchema).optional(), 
   review_likes: z.array(reviewLikeSchema).optional(),
  review_comments: z.array(reviewCommentSchema).optional(),
  product_views: z.array(productViewSchema).optional(),
   
});


