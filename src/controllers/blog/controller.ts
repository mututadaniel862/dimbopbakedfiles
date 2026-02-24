import { FastifyRequest, FastifyReply } from 'fastify';
import { BlogService } from '../../services/blog';
import { blogSchema, BlogSchemaType, blogImageSchema, BlogImageSchemaType } from '../../models/blogs';
import { z } from 'zod';
import path from 'path';
import { promises as fsPromises } from 'fs';
import cloudinary from '../../config/cloudinary';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

// Type definitions for request parameters
type BlogParams = { id: string };
type BlogImageParams = { id: string; imageId?: string };
type BlogQuery = { page?: string; limit?: string; status?: 'visible' | 'hidden' | 'draft' };
type BlogBody = z.infer<typeof blogSchema>;
type BlogImageBody = z.infer<typeof blogImageSchema>;

const UPLOADS_DIR = path.join(process.cwd(), 'Uploads');

export const BlogController = {
  // Get all blogs with pagination
  async getAllBlogs(
    request: FastifyRequest<{ Querystring: BlogQuery }>,
    reply: FastifyReply
  ) {
    try {
      request.log.info('Fetching all blogs');
      const { page = '1', limit = '10', status } = request.query;
      const blogs = await BlogService.getAllBlogs(
        parseInt(page),
        parseInt(limit),
        status
      );
      reply.send(blogs);
    } catch (error) {
      request.log.error(`Error fetching blogs: ${error}`);
      reply.status(500).send({
        message: 'Error fetching blogs',
        error: (error as Error).message,
      });
    }
  },

  // Get a single blog by ID
  async getBlogById(
    request: FastifyRequest<{ Params: BlogParams }>,
    reply: FastifyReply
  ) {
    try {
      request.log.info(`Fetching blog with ID: ${request.params.id}`);
      const { id } = request.params;
      const blog = await BlogService.getBlogById(parseInt(id));
      if (!blog) {
        reply.status(404).send({ message: 'Blog not found' });
        return;
      }
      reply.send(blog);
    } catch (error) {
      request.log.error(`Error fetching blog: ${error}`);
      reply.status(500).send({
        message: 'Error fetching blog',
        error: (error as Error).message,
      });
    }
  },

// async createBlog(request: FastifyRequest, reply: FastifyReply) {

//   const timeout = setTimeout(() => {
//     request.log.error('Request timed out after 60 seconds');
//     reply.status(408).send({ message: 'Request timed out' });
//   }, 60000);

//   try {
//     request.log.info('Starting createBlog processing');

//     const fields: any = {};
//     const blogImages: { image_url: string }[] = [];
//     const uploadedUrls: { [key: string]: string } = {};

//     // ✅ FIXED: Increase file limit and add better limits
//     const parts = await request.parts({ 
//       limits: { 
//         fileSize: 10 * 1024 * 1024,  // 10MB per file
//         files: 20,  // Allow up to 20 files
//         fields: 50  // ✅ Allow more fields
//       } 
//     });
    
//     for await (const part of parts) {

//        if (!part || !part.fieldname) {
//     request.log.warn('Received invalid part without fieldname');
//     continue;
//   }
//       if (part.type === 'file') {
//         const fieldname = part.fieldname;
//         const filename = part.filename;

//         if (!filename) {
//           request.log.warn(`Skipping empty file for field: ${fieldname}`);
//           continue;
//         }

//         if (!part.mimetype.startsWith('image/')) {
//           request.log.error(`${fieldname} is not an image`);
//           clearTimeout(timeout);
//           reply.status(400).send({ message: `${fieldname} must be an image` });
//           return;
//         }

//         try {
//           const buffer = await part.toBuffer();
          
//           const uploadResult = await new Promise<any>((resolve, reject) => {
//             const uploadStream = cloudinary.uploader.upload_stream(
//               {
//                 folder: 'blogs',
//                 public_id: `blog_${Date.now()}_${fieldname}`,
//                 resource_type: 'auto',
//                 transformation: [
//                   { width: 1200, height: 800, crop: 'limit' },
//                   { quality: 'auto' },
//                   { fetch_format: 'auto' }
//                 ]
//               },
//               (error, result) => {
//                 if (error) reject(error);
//                 else resolve(result);
//               }
//             );
//             uploadStream.end(buffer);
//           });

//           const cloudinaryUrl = uploadResult.secure_url;
//           request.log.info(`✅ Uploaded ${fieldname} to Cloudinary: ${cloudinaryUrl}`);

//           if (fieldname.startsWith('blog_images')) {
//             blogImages.push({ image_url: cloudinaryUrl });
//           } else {
//             uploadedUrls[fieldname] = cloudinaryUrl;
//           }

//         } catch (error) {
//           request.log.error(`❌ Cloudinary upload error for ${fieldname}: ${String(error)}`);
//           clearTimeout(timeout);
//           reply.status(500).send({ 
//             message: `Failed to upload ${fieldname} to Cloudinary`,
//             error: error instanceof Error ? error.message : 'Unknown error'
//           });
//           return;
//         }

//   //     }
//   //      else {

//   //       if (!part || typeof part !== 'object' || !('value' in part)) {
//   //   request.log.warn(`Skipping invalid field part: ${JSON.stringify(part)}`);
//   //   continue;
//   // }
//   //       // ✅ FIXED: Safely handle undefined/null values
//   //       const value = part.value;
        
//   //       // Only add field if it has a valid value
//   //       if (value !== undefined && value !== null && value !== '') {
//   //         fields[part.fieldname] = value;
//   //         request.log.info(`Received field: ${part.fieldname}=${String(value).substring(0, 50)}...`);
//   //       } else {
//   //         request.log.warn(`Skipping empty field: ${part.fieldname}`);
//   //       }
//   //     }
//   } else {
//   // ✅ FIXED: Check if part has value property first
//   if (!part || typeof part !== 'object' || !('value' in part)) {
//     request.log.warn(`Skipping invalid field part: ${JSON.stringify(part)}`);
//     continue;
//   }
  
//   const value = part.value;
  
//   // Only add field if it has a valid value
//   if (value !== undefined && value !== null && value !== '') {
//     fields[part.fieldname] = value;
//     request.log.info(`Received field: ${part.fieldname}=${String(value).substring(0, 50)}...`);
//   } else {
//     request.log.warn(`Skipping empty field: ${part.fieldname}`);
//   }
// }
//     }

//     console.log('📋 uploadedUrls:', uploadedUrls);
//     console.log('📋 blogImages:', blogImages);
//     console.log('📋 fields:', Object.keys(fields)); // Just log field names, not full content

//     // Validate required fields
//     const requiredFields = ['title', 'description', 'content'];
//     for (const field of requiredFields) {
//       if (!fields[field]) {
//         request.log.error(`Missing required field: ${field}`);
//         clearTimeout(timeout);
//         reply.status(400).send({ message: `Missing required field: ${field}` });
//         return;
//       }
//     }

//     // ✅ FIXED: Better null handling for optional fields
//     const getFieldValue = (fieldName: string): string | null => {
//       const value = fields[fieldName];
//       return (value && value.trim() !== '') ? value : null;
//     };

//     // Prepare blog data with Cloudinary URLs
//     const blogData: z.infer<typeof blogSchema> = {
//       title: fields.title,
//       description: fields.description,
//       content: fields.content,
//       status: fields.status || 'visible',
//       categories: getFieldValue('categories'),
//       meta_description: getFieldValue('meta_description'),
//       meta_author: getFieldValue('meta_author'),
//       keywords: getFieldValue('keywords'),
//       meta_og_title: getFieldValue('meta_og_title'),
//       meta_og_url: getFieldValue('meta_og_url'),
//       meta_og_image: uploadedUrls.meta_og_image || null,
//       meta_facebook_id: getFieldValue('meta_facebook_id'),
//       meta_site_name: getFieldValue('meta_site_name'),
//       meta_post_twitter: getFieldValue('meta_post_twitter'),
//       image_url: uploadedUrls.image_url || null,
//       hero_image: uploadedUrls.hero_image || null,
//       blog_image_one: uploadedUrls.blog_image_one || null,
//       blog_image_two: uploadedUrls.blog_image_two || null,
//       blog_image_three: uploadedUrls.blog_image_three || null,
//       author_avatar: uploadedUrls.author_avatar || null,
//       epigraph: getFieldValue('epigraph'),
//       first_paragraph: getFieldValue('first_paragraph'),
//       second_paragraph: getFieldValue('second_paragraph'),
//       third_paragraph: getFieldValue('third_paragraph'),
//       fourth_paragraph: getFieldValue('fourth_paragraph'),
//       fifth_paragraph: getFieldValue('fifth_paragraph'),
//       annotation_image_one: uploadedUrls.annotation_image_one || null,
//       annotation_image_two: uploadedUrls.annotation_image_two || null,
//       annotation_image_three: uploadedUrls.annotation_image_three || null,
//       annotation_image_four: uploadedUrls.annotation_image_four || null,
//       annotation_image_five: uploadedUrls.annotation_image_five || null,
//       point_one_title: getFieldValue('point_one_title'),
//       point_two_title: getFieldValue('point_two_title'),
//       point_three_title: getFieldValue('point_three_title'),
//       point_four_title: getFieldValue('point_four_title'),
//       point_five_title: getFieldValue('point_five_title'),
//       point_one_description: getFieldValue('point_one_description'),
//       point_two_description: getFieldValue('point_two_description'),
//       point_three_description: getFieldValue('point_three_description'),
//       point_four_description: getFieldValue('point_four_description'),
//       point_five_description: getFieldValue('point_five_description'),
//       more_blogs: getFieldValue('more_blogs'),
//       // blog_images: blogImages.length > 0 ? blogImages : [],
//       blog_images: blogImages.length > 0 ? blogImages : [],
//     };

//     const blog = await BlogService.createBlog(blogData);
//     request.log.info('✅ Blog created successfully');
//     clearTimeout(timeout);
//     reply.status(201).send(blog);
//   } catch (error) {
//     request.log.error(`❌ Unexpected error in createBlog: ${String(error)}`);
//     clearTimeout(timeout);
//     reply.status(400).send({
//       message: 'Invalid blog data',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     });
//   }
// },



async createBlog(request: FastifyRequest, reply: FastifyReply) {
  const timeout = setTimeout(() => {
    request.log.error('Request timed out after 60 seconds');
    reply.status(408).send({ message: 'Request timed out' });
  }, 60000);

  try {
    request.log.info('Starting createBlog processing');

    const fields: any = {};
    // ❌ REMOVE THIS: const blogImages: { image_url: string }[] = [];
    const uploadedUrls: { [key: string]: string } = {};

    const parts = await request.parts({ 
      limits: { 
        fileSize: 10 * 1024 * 1024,
        files: 20,
        fields: 50
      } 
    });
    
    for await (const part of parts) {
      if (!part || !part.fieldname) {
        request.log.warn('Received invalid part without fieldname');
        continue;
      }
      
      if (part.type === 'file') {
        const fieldname = part.fieldname;
        const filename = part.filename;

        if (!filename) {
          request.log.warn(`Skipping empty file for field: ${fieldname}`);
          continue;
        }

        if (!part.mimetype.startsWith('image/')) {
          request.log.error(`${fieldname} is not an image`);
          clearTimeout(timeout);
          reply.status(400).send({ message: `${fieldname} must be an image` });
          return;
        }

        try {
          const buffer = await part.toBuffer();
          
          const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'blogs',
                public_id: `blog_${Date.now()}_${fieldname}`,
                resource_type: 'auto',
                transformation: [
                  { width: 1200, height: 800, crop: 'limit' },
                  { quality: 'auto' },
                  { fetch_format: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(buffer);
          });

          const cloudinaryUrl = uploadResult.secure_url;
          request.log.info(`✅ Uploaded ${fieldname} to Cloudinary: ${cloudinaryUrl}`);

          // ❌ REMOVE THIS ENTIRE BLOCK:
          // if (fieldname.startsWith('blog_images')) {
          //   blogImages.push({ image_url: cloudinaryUrl });
          // } else {
          //   uploadedUrls[fieldname] = cloudinaryUrl;
          // }
          
          // ✅ REPLACE WITH:
          uploadedUrls[fieldname] = cloudinaryUrl;

        } catch (error) {
          request.log.error(`❌ Cloudinary upload error for ${fieldname}: ${String(error)}`);
          clearTimeout(timeout);
          reply.status(500).send({ 
            message: `Failed to upload ${fieldname} to Cloudinary`,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          return;
        }
      } else {
        if (!part || typeof part !== 'object' || !('value' in part)) {
          request.log.warn(`Skipping invalid field part: ${JSON.stringify(part)}`);
          continue;
        }
        
        const value = part.value;
        
        if (value !== undefined && value !== null && value !== '') {
          fields[part.fieldname] = value;
          request.log.info(`Received field: ${part.fieldname}=${String(value).substring(0, 50)}...`);
        } else {
          request.log.warn(`Skipping empty field: ${part.fieldname}`);
        }
      }
    }

    console.log('📋 uploadedUrls:', uploadedUrls);
    // ❌ REMOVE: console.log('📋 blogImages:', blogImages);
    console.log('📋 fields:', Object.keys(fields));

    // Validate required fields
    const requiredFields = ['title', 'description', 'content'];
    for (const field of requiredFields) {
      if (!fields[field]) {
        request.log.error(`Missing required field: ${field}`);
        clearTimeout(timeout);
        reply.status(400).send({ message: `Missing required field: ${field}` });
        return;
      }
    }

    const getFieldValue = (fieldName: string): string | null => {
      const value = fields[fieldName];
      return (value && value.trim() !== '') ? value : null;
    };

    // Prepare blog data with Cloudinary URLs
    const blogData: z.infer<typeof blogSchema> = {
      title: fields.title,
      description: fields.description,
      content: fields.content,
      status: fields.status || 'visible',
      categories: getFieldValue('categories'),
      meta_description: getFieldValue('meta_description'),
      meta_author: getFieldValue('meta_author'),
      keywords: getFieldValue('keywords'),
      meta_og_title: getFieldValue('meta_og_title'),
      meta_og_url: getFieldValue('meta_og_url'),
      meta_og_image: uploadedUrls.meta_og_image || null,
      meta_facebook_id: getFieldValue('meta_facebook_id'),
      meta_site_name: getFieldValue('meta_site_name'),
      meta_post_twitter: getFieldValue('meta_post_twitter'),
      image_url: uploadedUrls.image_url || null,
      hero_image: uploadedUrls.hero_image || null,
      blog_image_one: uploadedUrls.blog_image_one || null,
      blog_image_two: uploadedUrls.blog_image_two || null,
      blog_image_three: uploadedUrls.blog_image_three || null,
      author_avatar: uploadedUrls.author_avatar || null,
      epigraph: getFieldValue('epigraph'),
      first_paragraph: getFieldValue('first_paragraph'),
      second_paragraph: getFieldValue('second_paragraph'),
      third_paragraph: getFieldValue('third_paragraph'),
      fourth_paragraph: getFieldValue('fourth_paragraph'),
      fifth_paragraph: getFieldValue('fifth_paragraph'),
      annotation_image_one: uploadedUrls.annotation_image_one || null,
      annotation_image_two: uploadedUrls.annotation_image_two || null,
      annotation_image_three: uploadedUrls.annotation_image_three || null,
      annotation_image_four: uploadedUrls.annotation_image_four || null,
      annotation_image_five: uploadedUrls.annotation_image_five || null,
      point_one_title: getFieldValue('point_one_title'),
      point_two_title: getFieldValue('point_two_title'),
      point_three_title: getFieldValue('point_three_title'),
      point_four_title: getFieldValue('point_four_title'),
      point_five_title: getFieldValue('point_five_title'),
      point_one_description: getFieldValue('point_one_description'),
      point_two_description: getFieldValue('point_two_description'),
      point_three_description: getFieldValue('point_three_description'),
      point_four_description: getFieldValue('point_four_description'),
      point_five_description: getFieldValue('point_five_description'),
      more_blogs: getFieldValue('more_blogs'),
      // ❌ REMOVE THIS LINE:
      // blog_images: blogImages.length > 0 ? blogImages : undefined,
    };

    const blog = await BlogService.createBlog(blogData);
    request.log.info('✅ Blog created successfully');
    clearTimeout(timeout);
    reply.status(201).send(blog);
  } catch (error) {
    request.log.error(`❌ Unexpected error in createBlog: ${String(error)}`);
    clearTimeout(timeout);
    reply.status(400).send({
      message: 'Invalid blog data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
},



  // async createBlog(request: FastifyRequest, reply: FastifyReply) {
  //   const timeout = setTimeout(() => {
  //     request.log.error('Request timed out after 60 seconds');
  //     reply.status(408).send({ message: 'Request timed out' });
  //   }, 60000);
  
  //   try {
  //     request.log.info('Starting createBlog processing');
  
  //     // Ensure Uploads directory exists
  //     await fsPromises.mkdir(UPLOADS_DIR, { recursive: true });
  
  //     // Parse form-data (fields and files)
  //     const fields: any = {};
  //     const blogImages: { image_url: string }[] = [];
  //     const files: { [key: string]: any } = {};
  
  //     // Handle multipart form-data
  //     const parts = await request.parts({ limits: { fileSize: 10 * 1024 * 1024 } });
  //     for await (const part of parts) {
  //       if (part.type === 'file') {
  //         const fieldname = part.fieldname;
  //         const filename = part.filename;
  
  //         if (!filename) {
  //           request.log.warn(`Skipping empty file for field: ${fieldname}`);
  //           continue;
  //         }
  
  //         if (!part.mimetype.startsWith('image/')) {
  //           request.log.error(`${fieldname} is not an image`);
  //           clearTimeout(timeout);
  //           reply.status(400).send({ message: `${fieldname} must be an image` });
  //           return;
  //         }
  
  //         const fileName = `${Date.now()}-${filename}`;
  //         const filePath = path.join(UPLOADS_DIR, fileName);
  
  //         await pipeline(part.file, createWriteStream(filePath));
  //         const fileUrl = `${request.protocol}://${request.hostname}/Uploads/${fileName}`;
  
  //         if (fieldname === 'hero_image') {
  //           fields.hero_image = fileUrl;
  //         } else if (fieldname.startsWith('blog_images')) {
  //           blogImages.push({ image_url: fileUrl });
  //         } else if (['blog_image_one', 'blog_image_two', 'blog_image_three', 'annotation_image_one', 'annotation_image_two', 'annotation_image_three', 'annotation_image_four', 'annotation_image_five', 'author_avatar'].includes(fieldname)) {
  //           fields[fieldname] = fileUrl;
  //         }
  
  //         request.log.info(`Saved file: ${fieldname} as ${fileName}`);
  //       } else {
  //         fields[part.fieldname] = part.value;
  //         request.log.info(`Received field: ${part.fieldname}=${part.value}`);
  //       }
  //     }
  
  //     // Validate required fields
  //     const requiredFields = ['title', 'description', 'content'];
  //     for (const field of requiredFields) {
  //       if (!fields[field]) {
  //         request.log.error(`Missing required field: ${field}`);
  //         clearTimeout(timeout);
  //         reply.status(400).send({ message: `Missing required field: ${field}` });
  //         return;
  //       }
  //     }
  
  //     // Prepare blog data
  //     const blogData: z.infer<typeof blogSchema> = {
  //       title: fields.title,
  //       description: fields.description,
  //       content: fields.content,
  //       status: fields.status || 'visible',
  //       categories: fields.categories || null,
  //       meta_description: fields.meta_description || null,
  //       meta_author: fields.meta_author || null,
  //       keywords: fields.keywords || null,
  //       meta_og_title: fields.meta_og_title || null,
  //       meta_og_url: fields.meta_og_url || null,
  //       meta_og_image: fields.meta_og_image || null,
  //       meta_facebook_id: fields.meta_facebook_id || null,
  //       meta_site_name: fields.meta_site_name || null,
  //       meta_post_twitter: fields.meta_post_twitter || null,
  //       image_url: fields.image_url || null,
  //       hero_image: fields.hero_image || null,
  //       blog_image_one: fields.blog_image_one || null,
  //       blog_image_two: fields.blog_image_two || null,
  //       blog_image_three: fields.blog_image_three || null,
  //       author_avatar: fields.author_avatar || null,
  //       epigraph: fields.epigraph || null,
  //       first_paragraph: fields.first_paragraph || null,
  //       second_paragraph: fields.second_paragraph || null,
  //       third_paragraph: fields.third_paragraph || null,
  //       fourth_paragraph: fields.fourth_paragraph || null,
  //       fifth_paragraph: fields.fifth_paragraph || null,
  //       annotation_image_one: fields.annotation_image_one || null,
  //       annotation_image_two: fields.annotation_image_two || null,
  //       annotation_image_three: fields.annotation_image_three || null,
  //       annotation_image_four: fields.annotation_image_four || null,
  //       annotation_image_five: fields.annotation_image_five || null,
  //       point_one_title: fields.point_one_title || null,
  //       point_two_title: fields.point_two_title || null,
  //       point_three_title: fields.point_three_title || null,
  //       point_four_title: fields.point_four_title || null,
  //       point_five_title: fields.point_five_title || null,
  //       point_one_description: fields.point_one_description || null,
  //       point_two_description: fields.point_two_description || null,
  //       point_three_description: fields.point_three_description || null,
  //       point_four_description: fields.point_four_description || null,
  //       point_five_description: fields.point_five_description || null,
  //       more_blogs: fields.more_blogs || null,
  //       blog_images: blogImages.length > 0 ? blogImages : [],
  //     };
  
  //     // Create blog in the database
  //     const blog = await BlogService.createBlog(blogData);
  //     request.log.info('Blog created successfully');
  //     clearTimeout(timeout);
  //     reply.status(201).send(blog);
  //   } catch (error) {
  //     request.log.error(`Unexpected error in createBlog: ${error}`);
  //     clearTimeout(timeout);
  //     reply.status(400).send({
  //       message: 'Invalid blog data',
  //       error: (error as Error).message,
  //     });
  //   }
  // },

  
  // Update an existing blog
  async updateBlog(
    request: FastifyRequest<{ Params: BlogParams; Body: Partial<BlogBody> }>,
    reply: FastifyReply
  ) {
    try {
      request.log.info(`Updating blog with ID: ${request.params.id}`);
      const { id } = request.params;
      const updatedBlog = await BlogService.updateBlog(parseInt(id), request.body);
      if (!updatedBlog) {
        reply.status(404).send({ message: 'Blog not found' });
        return;
      }
      reply.send(updatedBlog);
    } catch (error) {
      request.log.error(`Error updating blog: ${error}`);
      reply.status(400).send({
        message: 'Error updating blog',
        error: (error as Error).message,
      });
    }
  },

  // Delete a blog
  async deleteBlog(
    request: FastifyRequest<{ Params: BlogParams }>,
    reply: FastifyReply
  ) {
    try {
      request.log.info(`Deleting blog with ID: ${request.params.id}`);
      const { id } = request.params;
      await BlogService.deleteBlog(parseInt(id));
      reply.status(204).send();
    } catch (error) {
      request.log.error(`Error deleting blog: ${error}`);
      reply.status(500).send({
        message: 'Error deleting blog',
        error: (error as Error).message,
      });
    }
  },

  // Add a blog image
  async addBlogImage(
    request: FastifyRequest<{ Params: BlogParams }>,
    reply: FastifyReply
  ) {
    try {
      request.log.info(`Adding image to blog ID: ${request.params.id}`);
      const { id } = request.params;
      const data = await request.file();
      if (!data) {
        reply.status(400).send({ message: 'No file uploaded' });
        return;
      }

      // Validate file type
      if (!data.mimetype.startsWith('image/')) {
        reply.status(400).send({ message: 'Only images are allowed' });
        return;
      }

      // Ensure Uploads directory exists
      await fsPromises.mkdir(UPLOADS_DIR, { recursive: true });

      // Generate unique filename
      const fileName = `${Date.now()}-${data.filename}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      // Save file
      try {
        await pipeline(data.file, createWriteStream(filePath));
        request.log.info(`Saved blog image: ${fileName}`);
      } catch (err) {
        request.log.error(`Error saving blog image: ${err}`);
        reply.status(400).send({ message: 'Failed to save blog image', error: (err as Error).message });
        return;
      }

      // Generate public URL
      const imageUrl = `${request.protocol}://${request.hostname}/Uploads/${fileName}`;

      // Save to database
      const image = await BlogService.addBlogImage(parseInt(id), imageUrl);
      reply.status(201).send(image);
    } catch (error) {
      request.log.error(`Error uploading blog image: ${error}`);
      reply.status(400).send({
        message: 'Error uploading image',
        error: (error as Error).message,
      });
    }
  },

  // Get blog images
  async getBlogImages(
    request: FastifyRequest<{ Params: BlogParams }>,
    reply: FastifyReply
  ) {
    try {
      request.log.info(`Fetching images for blog ID: ${request.params.id}`);
      const { id } = request.params;
      const images = await BlogService.getBlogImages(parseInt(id));
      reply.send(images);
    } catch (error) {
      request.log.error(`Error fetching blog images: ${error}`);
      reply.status(500).send({
        message: 'Error fetching blog images',
        error: (error as Error).message,
      });
    }
  },

  // Delete a blog image
  async deleteBlogImage(
    request: FastifyRequest<{ Params: { blogId: string; imageId: string } }>,
    reply: FastifyReply
  ) {
    try {
      request.log.info(`Deleting image ID: ${request.params.imageId} for blog ID: ${request.params.blogId}`);
      const { imageId } = request.params;
      await BlogService.deleteBlogImage(parseInt(imageId));
      reply.status(204).send();
    } catch (error) {
      request.log.error(`Error deleting blog image: ${error}`);
      reply.status(500).send({
        message: 'Error deleting blog image',
        error: (error as Error).message,
      });
    }
  },
};