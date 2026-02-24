import { z } from 'zod';

// Search Query Schema
export const SearchQuerySchema = z.object({
  q: z.string()
    .min(2, 'Search query must be at least 2 characters long')
    .max(200, 'Search query must be less than 200 characters'),
  page: z.string()
    .regex(/^[1-9][0-9]*$/, 'Page must be a positive integer')
    .optional()
    .default('1'),
  limit: z.string()
    .regex(/^[1-9][0-9]*$/, 'Limit must be a positive integer')
    .optional()
    .default('20'),
  type: z.enum(['product', 'blog'], {
    errorMap: () => ({ message: 'Type must be either "product" or "blog"' })
  }).optional()
});

// Search Suggestions Query Schema
export const SuggestionsQuerySchema = z.object({
  q: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters'),
  limit: z.string()
    .regex(/^[1-9][0-9]*$/, 'Limit must be a positive integer')
    .optional()
    .default('5')
});

// Search Result Schema
export const SearchResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['product', 'blog']),
  image_url: z.string().nullable().optional(),
  price: z.number().optional(),
  category: z.string().nullable().optional(),
  status: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date().optional(),
  frontend_url: z.string().url()
});

// Global Search Response Schema
export const GlobalSearchResponseSchema = z.object({
  results: z.array(SearchResultSchema),
  total: z.number().min(0),
  query: z.string(),
  categories: z.object({
    products: z.number().min(0),
    blogs: z.number().min(0)
  }),
  pagination: z.object({
    page: z.number().min(1),
    limit: z.number().min(1).max(100),
    totalPages: z.number().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  }).optional()
});

// Search Suggestions Response Schema
export const SearchSuggestionsResponseSchema = z.object({
  suggestions: z.array(z.string())
});

// Error Response Schema
export const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
  results: z.array(z.never()).optional(),
  total: z.number().optional(),
  suggestions: z.array(z.never()).optional()
});

// Health Check Response Schema
export const HealthCheckResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  service: z.literal('search'),
  timestamp: z.string().datetime(),
  error: z.string().optional()
});

// Type exports for use in your application
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SuggestionsQuery = z.infer<typeof SuggestionsQuerySchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type GlobalSearchResponse = z.infer<typeof GlobalSearchResponseSchema>;
export type SearchSuggestionsResponse = z.infer<typeof SearchSuggestionsResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;