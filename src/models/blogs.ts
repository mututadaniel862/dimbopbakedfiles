import { z } from "zod";

// Schema for blog images
// export const blogImageSchema = z.object({

//   // blog_id: z.number().int().positive().optional(),
//   // image_url: z.string().url(),
//   image_url: z.string(),  // ✅ Removed .url() - too strict
//   blog_id: z.number().int().positive().optional(),
// });


export const blogImageSchema = z.object({
  image_url: z.string().min(1),
});


// Schema for blog types
export const blogTypeSchema = z.object({

  name: z.string().max(100),
  image_url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

// Main blog schema
export const blogSchema = z.object({

  title: z.string().max(255),
  description: z.string(),
  content: z.string(),
  image_url: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  hero_image: z.string().optional().nullable(),
  blog_image_one: z.string().optional().nullable(),
  blog_image_two: z.string().optional().nullable(),
  blog_image_three: z.string().optional().nullable(),
  author_avatar: z.string().optional().nullable(),
  epigraph: z.string().optional().nullable(),
  first_paragraph: z.string().optional().nullable(),
  second_paragraph: z.string().optional().nullable(),
  third_paragraph: z.string().optional().nullable(),
  fourth_paragraph: z.string().optional().nullable(),
  fifth_paragraph: z.string().optional().nullable(),
  annotation_image_one: z.string().optional().nullable(),
  annotation_image_two: z.string().optional().nullable(),
  annotation_image_three: z.string().optional().nullable(),
  annotation_image_four: z.string().optional().nullable(),
  annotation_image_five: z.string().optional().nullable(),
  point_one_title: z.string().max(255).optional().nullable(),
  point_one_description: z.string().optional().nullable(),
  point_two_title: z.string().max(255).optional().nullable(),
  point_two_description: z.string().optional().nullable(),
  point_three_title: z.string().max(255).optional().nullable(),
  point_three_description: z.string().optional().nullable(),
  point_four_title: z.string().max(255).optional().nullable(),
  point_four_description: z.string().optional().nullable(),
  point_five_title: z.string().max(255).optional().nullable(),
  point_five_description: z.string().optional().nullable(),
  categories: z.string().max(255).optional().nullable(),
  more_blogs: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  meta_author: z.string().max(255).optional().nullable(),
  meta_og_title: z.string().max(255).optional().nullable(),
  meta_og_url: z.string().optional().nullable(),
  meta_og_image: z.string().optional().nullable(),
  meta_facebook_id: z.string().optional().nullable(),
  meta_site_name: z.string().optional().nullable(),
  meta_post_twitter: z.string().optional().nullable(),
  status: z.enum(["visible", "hidden", "draft"]).default("visible").optional(),
  // blog_images: z.array(blogImageSchema).optional(), // For handling multiple images
    // blog_images: z.array(blogImageSchema).optional().default([]),
});

// Types
export type BlogSchemaType = z.infer<typeof blogSchema>;
export type BlogImageSchemaType = z.infer<typeof blogImageSchema>;
export type BlogTypeSchemaType = z.infer<typeof blogTypeSchema>;