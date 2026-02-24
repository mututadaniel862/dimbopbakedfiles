"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controllers/blog/controller");
const schemas_1 = require("../utils/schemas");
const blogs_1 = require("../models/blogs");
exports.default = async (app) => {
    // Public routes
    app.get('/', controller_1.BlogController.getAllBlogs);
    app.get('/:id', controller_1.BlogController.getBlogById);
    // Create blog (public, no body schema for form-data)
    app.post('/newblog', {
        handler: controller_1.BlogController.createBlog,
    });
    // Protected routes
    app.register(async (protectedRoutes) => {
        protectedRoutes.addHook('preHandler', app.authenticate);
        // Update blog (expects JSON body)
        protectedRoutes.put('/:id', {
            handler: controller_1.BlogController.updateBlog,
            schema: {
                body: (0, schemas_1.zodToJsonSchema)(blogs_1.blogSchema.partial()),
            },
        });
        protectedRoutes.delete('/:id', controller_1.BlogController.deleteBlog);
        // Image routes (no body schema for file upload)
        protectedRoutes.post('/:id/images', {
            handler: controller_1.BlogController.addBlogImage,
        });
        protectedRoutes.get('/:id/images', controller_1.BlogController.getBlogImages);
        protectedRoutes.delete('/:blogId/images/:imageId', controller_1.BlogController.deleteBlogImage);
    });
};
//# sourceMappingURL=blog.js.map