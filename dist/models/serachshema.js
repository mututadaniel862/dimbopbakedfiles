"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckResponseSchema = exports.ErrorResponseSchema = exports.SearchSuggestionsResponseSchema = exports.GlobalSearchResponseSchema = exports.SearchResultSchema = exports.SuggestionsQuerySchema = exports.SearchQuerySchema = void 0;
const zod_1 = require("zod");
// Search Query Schema
exports.SearchQuerySchema = zod_1.z.object({
    q: zod_1.z.string()
        .min(2, 'Search query must be at least 2 characters long')
        .max(200, 'Search query must be less than 200 characters'),
    page: zod_1.z.string()
        .regex(/^[1-9][0-9]*$/, 'Page must be a positive integer')
        .optional()
        .default('1'),
    limit: zod_1.z.string()
        .regex(/^[1-9][0-9]*$/, 'Limit must be a positive integer')
        .optional()
        .default('20'),
    type: zod_1.z.enum(['product', 'blog'], {
        errorMap: () => ({ message: 'Type must be either "product" or "blog"' })
    }).optional()
});
// Search Suggestions Query Schema
exports.SuggestionsQuerySchema = zod_1.z.object({
    q: zod_1.z.string()
        .min(1, 'Search query is required')
        .max(100, 'Search query must be less than 100 characters'),
    limit: zod_1.z.string()
        .regex(/^[1-9][0-9]*$/, 'Limit must be a positive integer')
        .optional()
        .default('5')
});
// Search Result Schema
exports.SearchResultSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    type: zod_1.z.enum(['product', 'blog']),
    image_url: zod_1.z.string().nullable().optional(),
    price: zod_1.z.number().optional(),
    category: zod_1.z.string().nullable().optional(),
    status: zod_1.z.string().optional(),
    created_at: zod_1.z.date(),
    updated_at: zod_1.z.date().optional(),
    frontend_url: zod_1.z.string().url()
});
// Global Search Response Schema
exports.GlobalSearchResponseSchema = zod_1.z.object({
    results: zod_1.z.array(exports.SearchResultSchema),
    total: zod_1.z.number().min(0),
    query: zod_1.z.string(),
    categories: zod_1.z.object({
        products: zod_1.z.number().min(0),
        blogs: zod_1.z.number().min(0)
    }),
    pagination: zod_1.z.object({
        page: zod_1.z.number().min(1),
        limit: zod_1.z.number().min(1).max(100),
        totalPages: zod_1.z.number().min(0),
        hasNext: zod_1.z.boolean(),
        hasPrev: zod_1.z.boolean()
    }).optional()
});
// Search Suggestions Response Schema
exports.SearchSuggestionsResponseSchema = zod_1.z.object({
    suggestions: zod_1.z.array(zod_1.z.string())
});
// Error Response Schema
exports.ErrorResponseSchema = zod_1.z.object({
    message: zod_1.z.string(),
    error: zod_1.z.string().optional(),
    results: zod_1.z.array(zod_1.z.never()).optional(),
    total: zod_1.z.number().optional(),
    suggestions: zod_1.z.array(zod_1.z.never()).optional()
});
// Health Check Response Schema
exports.HealthCheckResponseSchema = zod_1.z.object({
    status: zod_1.z.enum(['healthy', 'unhealthy']),
    service: zod_1.z.literal('search'),
    timestamp: zod_1.z.string().datetime(),
    error: zod_1.z.string().optional()
});
//# sourceMappingURL=serachshema.js.map