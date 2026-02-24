"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = exports.blogTypeSchema = exports.blogImageSchema = void 0;
const zod_1 = require("zod");
// Schema for blog images
// export const blogImageSchema = z.object({
//   // blog_id: z.number().int().positive().optional(),
//   // image_url: z.string().url(),
//   image_url: z.string(),  // ✅ Removed .url() - too strict
//   blog_id: z.number().int().positive().optional(),
// });
exports.blogImageSchema = zod_1.z.object({
    image_url: zod_1.z.string().min(1),
});
// Schema for blog types
exports.blogTypeSchema = zod_1.z.object({
    name: zod_1.z.string().max(100),
    image_url: zod_1.z.string().optional().nullable(),
    description: zod_1.z.string().optional().nullable(),
});
// Main blog schema
exports.blogSchema = zod_1.z.object({
    title: zod_1.z.string().max(255),
    description: zod_1.z.string(),
    content: zod_1.z.string(),
    image_url: zod_1.z.string().optional().nullable(),
    created_at: zod_1.z.coerce.date().optional(),
    hero_image: zod_1.z.string().optional().nullable(),
    blog_image_one: zod_1.z.string().optional().nullable(),
    blog_image_two: zod_1.z.string().optional().nullable(),
    blog_image_three: zod_1.z.string().optional().nullable(),
    author_avatar: zod_1.z.string().optional().nullable(),
    epigraph: zod_1.z.string().optional().nullable(),
    first_paragraph: zod_1.z.string().optional().nullable(),
    second_paragraph: zod_1.z.string().optional().nullable(),
    third_paragraph: zod_1.z.string().optional().nullable(),
    fourth_paragraph: zod_1.z.string().optional().nullable(),
    fifth_paragraph: zod_1.z.string().optional().nullable(),
    annotation_image_one: zod_1.z.string().optional().nullable(),
    annotation_image_two: zod_1.z.string().optional().nullable(),
    annotation_image_three: zod_1.z.string().optional().nullable(),
    annotation_image_four: zod_1.z.string().optional().nullable(),
    annotation_image_five: zod_1.z.string().optional().nullable(),
    point_one_title: zod_1.z.string().max(255).optional().nullable(),
    point_one_description: zod_1.z.string().optional().nullable(),
    point_two_title: zod_1.z.string().max(255).optional().nullable(),
    point_two_description: zod_1.z.string().optional().nullable(),
    point_three_title: zod_1.z.string().max(255).optional().nullable(),
    point_three_description: zod_1.z.string().optional().nullable(),
    point_four_title: zod_1.z.string().max(255).optional().nullable(),
    point_four_description: zod_1.z.string().optional().nullable(),
    point_five_title: zod_1.z.string().max(255).optional().nullable(),
    point_five_description: zod_1.z.string().optional().nullable(),
    categories: zod_1.z.string().max(255).optional().nullable(),
    more_blogs: zod_1.z.string().optional().nullable(),
    meta_description: zod_1.z.string().optional().nullable(),
    keywords: zod_1.z.string().optional().nullable(),
    meta_author: zod_1.z.string().max(255).optional().nullable(),
    meta_og_title: zod_1.z.string().max(255).optional().nullable(),
    meta_og_url: zod_1.z.string().optional().nullable(),
    meta_og_image: zod_1.z.string().optional().nullable(),
    meta_facebook_id: zod_1.z.string().optional().nullable(),
    meta_site_name: zod_1.z.string().optional().nullable(),
    meta_post_twitter: zod_1.z.string().optional().nullable(),
    status: zod_1.z.enum(["visible", "hidden", "draft"]).default("visible").optional(),
    // blog_images: z.array(blogImageSchema).optional(), // For handling multiple images
    // blog_images: z.array(blogImageSchema).optional().default([]),
});
//# sourceMappingURL=blogs.js.map