import { FastifyRequest, FastifyReply } from 'fastify';
import { blogSchema } from '../../models/blogs';
import { z } from 'zod';
type BlogParams = {
    id: string;
};
type BlogQuery = {
    page?: string;
    limit?: string;
    status?: 'visible' | 'hidden' | 'draft';
};
type BlogBody = z.infer<typeof blogSchema>;
export declare const BlogController: {
    getAllBlogs(request: FastifyRequest<{
        Querystring: BlogQuery;
    }>, reply: FastifyReply): Promise<void>;
    getBlogById(request: FastifyRequest<{
        Params: BlogParams;
    }>, reply: FastifyReply): Promise<void>;
    createBlog(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateBlog(request: FastifyRequest<{
        Params: BlogParams;
        Body: Partial<BlogBody>;
    }>, reply: FastifyReply): Promise<void>;
    deleteBlog(request: FastifyRequest<{
        Params: BlogParams;
    }>, reply: FastifyReply): Promise<void>;
    addBlogImage(request: FastifyRequest<{
        Params: BlogParams;
    }>, reply: FastifyReply): Promise<void>;
    getBlogImages(request: FastifyRequest<{
        Params: BlogParams;
    }>, reply: FastifyReply): Promise<void>;
    deleteBlogImage(request: FastifyRequest<{
        Params: {
            blogId: string;
            imageId: string;
        };
    }>, reply: FastifyReply): Promise<void>;
};
export {};
