"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
const cart_1 = require("./cart");
const orderitem_1 = require("./orderitem");
// import { categorySchema } from "./category";
const review_1 = require("./review");
exports.productSchema = zod_1.z.object({
    //   id: z.number().int().positive(),
    name: zod_1.z.string().max(255),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().min(0),
    stock_quantity: zod_1.z.number().optional().default(0),
    image_url: zod_1.z.string().optional(),
    created_at: zod_1.z.coerce.date().optional(),
    updated_at: zod_1.z.coerce.date().optional(),
    discount_percentage: zod_1.z.number().optional().default(0),
    views: zod_1.z.number().optional().default(0),
    whatsapp_number: zod_1.z.string().optional(),
    // ⬇️⬇️⬇️ NEW APPROVAL FIELDS ⬇️⬇️⬇️
    uploaded_by: zod_1.z.number().optional(),
    approval_status: zod_1.z.enum(['pending', 'approved', 'rejected']).default('pending'),
    approved_by: zod_1.z.number().optional(),
    approved_at: zod_1.z.coerce.date().optional(),
    rejection_reason: zod_1.z.string().optional(),
    approval_deadline: zod_1.z.coerce.date().optional(),
    is_visible: zod_1.z.boolean().default(false),
    // ⬆️⬆️⬆️ END NEW FIELDS ⬆️⬆️⬆️
    cart: zod_1.z.array(cart_1.cartSchema).optional(),
    order_items: zod_1.z.array(orderitem_1.orderItemSchema).optional(),
    category_name: zod_1.z.string().optional(),
    reviews: zod_1.z.array(review_1.reviewSchema).optional(),
    review_likes: zod_1.z.array(review_1.reviewLikeSchema).optional(),
    review_comments: zod_1.z.array(review_1.reviewCommentSchema).optional(),
    product_views: zod_1.z.array(review_1.productViewSchema).optional(),
});
//# sourceMappingURL=products.js.map