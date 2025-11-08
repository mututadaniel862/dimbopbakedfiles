
import { FastifyInstance } from 'fastify';
import { BlogController } from '../controllers/blog/controller';
import { zodToJsonSchema } from '../utils/schemas';
import { blogSchema } from '../models/blogs';

export default async (app: FastifyInstance) => {
  // Public routes
  app.get('/', BlogController.getAllBlogs);
  app.get('/:id', BlogController.getBlogById);

  // Create blog (public, no body schema for form-data)
  app.post('/newblog', {
    handler: BlogController.createBlog,
  });

  // Protected routes
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', app.authenticate);

    // Update blog (expects JSON body)
    protectedRoutes.put('/:id', {
      handler: BlogController.updateBlog,
      schema: {
        body: zodToJsonSchema(blogSchema.partial()),
      },
    });

    protectedRoutes.delete('/:id', BlogController.deleteBlog);

    // Image routes (no body schema for file upload)
    protectedRoutes.post('/:id/images', {
      handler: BlogController.addBlogImage,
    });

    protectedRoutes.get('/:id/images', BlogController.getBlogImages);

    protectedRoutes.delete('/:blogId/images/:imageId', BlogController.deleteBlogImage);
  });
};