"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const blog_1 = require("../../services/blog");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const fs_2 = require("fs");
const promises_1 = require("stream/promises");
const UPLOADS_DIR = path_1.default.join(process.cwd(), 'Uploads');
exports.BlogController = {
    // Get all blogs with pagination
    async getAllBlogs(request, reply) {
        try {
            request.log.info('Fetching all blogs');
            const { page = '1', limit = '10', status } = request.query;
            const blogs = await blog_1.BlogService.getAllBlogs(parseInt(page), parseInt(limit), status);
            reply.send(blogs);
        }
        catch (error) {
            request.log.error(`Error fetching blogs: ${error}`);
            reply.status(500).send({
                message: 'Error fetching blogs',
                error: error.message,
            });
        }
    },
    // Get a single blog by ID
    async getBlogById(request, reply) {
        try {
            request.log.info(`Fetching blog with ID: ${request.params.id}`);
            const { id } = request.params;
            const blog = await blog_1.BlogService.getBlogById(parseInt(id));
            if (!blog) {
                reply.status(404).send({ message: 'Blog not found' });
                return;
            }
            reply.send(blog);
        }
        catch (error) {
            request.log.error(`Error fetching blog: ${error}`);
            reply.status(500).send({
                message: 'Error fetching blog',
                error: error.message,
            });
        }
    },
    async createBlog(request, reply) {
        const timeout = setTimeout(() => {
            request.log.error('Request timed out after 60 seconds');
            reply.status(408).send({ message: 'Request timed out' });
        }, 60000);
        try {
            request.log.info('Starting createBlog processing');
            const fields = {};
            const blogImages = [];
            const uploadedUrls = {};
            // const parts = await request.parts({ limits: { fileSize: 10 * 1024 * 1024 } });
            // CHANGE IT TO:
            const parts = await request.parts({
                limits: {
                    fileSize: 10 * 1024 * 1024, // 10MB per file
                    files: 20 // ✅ ADD THIS - Allow 15 files
                }
            });
            for await (const part of parts) {
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
                        const uploadResult = await new Promise((resolve, reject) => {
                            const uploadStream = cloudinary_1.default.uploader.upload_stream({
                                folder: 'blogs',
                                public_id: `blog_${Date.now()}_${fieldname}`,
                                resource_type: 'auto',
                                transformation: [
                                    { width: 1200, height: 800, crop: 'limit' },
                                    { quality: 'auto' },
                                    { fetch_format: 'auto' }
                                ]
                            }, (error, result) => {
                                if (error)
                                    reject(error);
                                else
                                    resolve(result);
                            });
                            uploadStream.end(buffer);
                        });
                        const cloudinaryUrl = uploadResult.secure_url;
                        request.log.info(`✅ Uploaded ${fieldname} to Cloudinary: ${cloudinaryUrl}`);
                        if (fieldname.startsWith('blog_images')) {
                            blogImages.push({ image_url: cloudinaryUrl });
                        }
                        else {
                            uploadedUrls[fieldname] = cloudinaryUrl;
                        }
                    }
                    catch (error) {
                        request.log.error(`❌ Cloudinary upload error for ${fieldname}: ${String(error)}`);
                        clearTimeout(timeout);
                        reply.status(500).send({
                            message: `Failed to upload ${fieldname} to Cloudinary`,
                            error: error instanceof Error ? error.message : 'Unknown error'
                        });
                        return;
                    }
                }
                else {
                    fields[part.fieldname] = part.value;
                    request.log.info(`Received field: ${part.fieldname}=${part.value}`);
                }
            }
            console.log('📋 uploadedUrls:', uploadedUrls);
            console.log('📋 blogImages:', blogImages);
            console.log('📋 fields:', fields);
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
            // Prepare blog data with Cloudinary URLs
            const blogData = {
                title: fields.title,
                description: fields.description,
                content: fields.content,
                status: fields.status || 'visible',
                categories: fields.categories || null,
                meta_description: fields.meta_description || null,
                meta_author: fields.meta_author || null,
                keywords: fields.keywords || null,
                meta_og_title: fields.meta_og_title || null,
                meta_og_url: fields.meta_og_url || null,
                meta_og_image: uploadedUrls.meta_og_image || null,
                meta_facebook_id: fields.meta_facebook_id || null,
                meta_site_name: fields.meta_site_name || null,
                meta_post_twitter: fields.meta_post_twitter || null,
                image_url: uploadedUrls.image_url || null,
                hero_image: uploadedUrls.hero_image || null,
                blog_image_one: uploadedUrls.blog_image_one || null,
                blog_image_two: uploadedUrls.blog_image_two || null,
                blog_image_three: uploadedUrls.blog_image_three || null,
                author_avatar: uploadedUrls.author_avatar || null,
                epigraph: fields.epigraph || null,
                first_paragraph: fields.first_paragraph || null,
                second_paragraph: fields.second_paragraph || null,
                third_paragraph: fields.third_paragraph || null,
                fourth_paragraph: fields.fourth_paragraph || null,
                fifth_paragraph: fields.fifth_paragraph || null,
                annotation_image_one: uploadedUrls.annotation_image_one || null,
                annotation_image_two: uploadedUrls.annotation_image_two || null,
                annotation_image_three: uploadedUrls.annotation_image_three || null,
                annotation_image_four: uploadedUrls.annotation_image_four || null,
                annotation_image_five: uploadedUrls.annotation_image_five || null,
                point_one_title: fields.point_one_title || null,
                point_two_title: fields.point_two_title || null,
                point_three_title: fields.point_three_title || null,
                point_four_title: fields.point_four_title || null,
                point_five_title: fields.point_five_title || null,
                point_one_description: fields.point_one_description || null,
                point_two_description: fields.point_two_description || null,
                point_three_description: fields.point_three_description || null,
                point_four_description: fields.point_four_description || null,
                point_five_description: fields.point_five_description || null,
                more_blogs: fields.more_blogs || null,
                blog_images: blogImages.length > 0 ? blogImages : [],
            };
            const blog = await blog_1.BlogService.createBlog(blogData);
            request.log.info('✅ Blog created successfully');
            clearTimeout(timeout);
            reply.status(201).send(blog);
        }
        catch (error) {
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
    async updateBlog(request, reply) {
        try {
            request.log.info(`Updating blog with ID: ${request.params.id}`);
            const { id } = request.params;
            const updatedBlog = await blog_1.BlogService.updateBlog(parseInt(id), request.body);
            if (!updatedBlog) {
                reply.status(404).send({ message: 'Blog not found' });
                return;
            }
            reply.send(updatedBlog);
        }
        catch (error) {
            request.log.error(`Error updating blog: ${error}`);
            reply.status(400).send({
                message: 'Error updating blog',
                error: error.message,
            });
        }
    },
    // Delete a blog
    async deleteBlog(request, reply) {
        try {
            request.log.info(`Deleting blog with ID: ${request.params.id}`);
            const { id } = request.params;
            await blog_1.BlogService.deleteBlog(parseInt(id));
            reply.status(204).send();
        }
        catch (error) {
            request.log.error(`Error deleting blog: ${error}`);
            reply.status(500).send({
                message: 'Error deleting blog',
                error: error.message,
            });
        }
    },
    // Add a blog image
    async addBlogImage(request, reply) {
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
            await fs_1.promises.mkdir(UPLOADS_DIR, { recursive: true });
            // Generate unique filename
            const fileName = `${Date.now()}-${data.filename}`;
            const filePath = path_1.default.join(UPLOADS_DIR, fileName);
            // Save file
            try {
                await (0, promises_1.pipeline)(data.file, (0, fs_2.createWriteStream)(filePath));
                request.log.info(`Saved blog image: ${fileName}`);
            }
            catch (err) {
                request.log.error(`Error saving blog image: ${err}`);
                reply.status(400).send({ message: 'Failed to save blog image', error: err.message });
                return;
            }
            // Generate public URL
            const imageUrl = `${request.protocol}://${request.hostname}/Uploads/${fileName}`;
            // Save to database
            const image = await blog_1.BlogService.addBlogImage(parseInt(id), imageUrl);
            reply.status(201).send(image);
        }
        catch (error) {
            request.log.error(`Error uploading blog image: ${error}`);
            reply.status(400).send({
                message: 'Error uploading image',
                error: error.message,
            });
        }
    },
    // Get blog images
    async getBlogImages(request, reply) {
        try {
            request.log.info(`Fetching images for blog ID: ${request.params.id}`);
            const { id } = request.params;
            const images = await blog_1.BlogService.getBlogImages(parseInt(id));
            reply.send(images);
        }
        catch (error) {
            request.log.error(`Error fetching blog images: ${error}`);
            reply.status(500).send({
                message: 'Error fetching blog images',
                error: error.message,
            });
        }
    },
    // Delete a blog image
    async deleteBlogImage(request, reply) {
        try {
            request.log.info(`Deleting image ID: ${request.params.imageId} for blog ID: ${request.params.blogId}`);
            const { imageId } = request.params;
            await blog_1.BlogService.deleteBlogImage(parseInt(imageId));
            reply.status(204).send();
        }
        catch (error) {
            request.log.error(`Error deleting blog image: ${error}`);
            reply.status(500).send({
                message: 'Error deleting blog image',
                error: error.message,
            });
        }
    },
};
//# sourceMappingURL=controller.js.map