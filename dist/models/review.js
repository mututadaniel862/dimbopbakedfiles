"use strict";
// import { z } from "zod";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productViewSchema = exports.reviewCommentSchema = exports.reviewLikeSchema = exports.reviewSchema = void 0;
// export const reviewSchema = z.object({
//   user_id: z.number(),
//   product_id: z.number(),
//   rating: z.number().min(1).max(5),
//   comment: z.string().min(1),
//   created_at: z.coerce.date().optional()
// });
const zod_1 = require("zod");
exports.reviewSchema = zod_1.z.object({
    user_id: zod_1.z.number(),
    product_id: zod_1.z.number(),
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().min(1),
    username: zod_1.z.string().default("Anonymous"),
    created_at: zod_1.z.coerce.date().optional()
});
exports.reviewLikeSchema = zod_1.z.object({
    user_id: zod_1.z.number(),
    is_like: zod_1.z.boolean()
});
exports.reviewCommentSchema = zod_1.z.object({
    user_id: zod_1.z.number().optional(),
    comment: zod_1.z.string().min(1),
    username: zod_1.z.string().default("Anonymous") // ✅ added username 
});
exports.productViewSchema = zod_1.z.object({
    user_id: zod_1.z.number().optional(),
    ip_address: zod_1.z.string().optional(),
    user_agent: zod_1.z.string().optional(),
    username: zod_1.z.string().default("Anonymous")
});
//# sourceMappingURL=review.js.map