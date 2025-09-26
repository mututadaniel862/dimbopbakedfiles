"use strict";
// ====================================
// SEARCH ROUTES (routes/search.ts)
// ====================================
Object.defineProperty(exports, "__esModule", { value: true });
const searchcontroller_1 = require("../controllers/search/searchcontroller");
const searchservice_1 = require("../services/searchservice");
exports.default = async (app) => {
    // Global search route
    app.get('/', {
        handler: searchcontroller_1.SearchController.globalSearch,
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    q: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 200,
                        description: 'Search query (minimum 2 characters)'
                    },
                    page: {
                        type: 'string',
                        pattern: '^[1-9][0-9]*$',
                        description: 'Page number (default: 1)'
                    },
                    limit: {
                        type: 'string',
                        pattern: '^[1-9][0-9]*$',
                        description: 'Results per page (default: 20, max: 100)'
                    },
                    type: {
                        type: 'string',
                        description: 'Filter by content type (product, blog). Leave empty to get all'
                    },
                },
                required: ['q'],
                additionalProperties: false,
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        results: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' },
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    type: { type: 'string', enum: ['product', 'blog'] },
                                    image_url: { type: ['string', 'null'] },
                                    price: { type: 'number' },
                                    category: { type: ['string', 'null'] },
                                    status: { type: 'string' },
                                    created_at: { type: 'string' },
                                    updated_at: { type: 'string' },
                                    frontend_url: { type: 'string' },
                                },
                            },
                        },
                        total: { type: 'number' },
                        query: { type: 'string' },
                        categories: {
                            type: 'object',
                            properties: {
                                products: { type: 'number' },
                                blogs: { type: 'number' },
                            },
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'number' },
                                limit: { type: 'number' },
                                totalPages: { type: 'number' },
                                hasNext: { type: 'boolean' },
                                hasPrev: { type: 'boolean' },
                            },
                        },
                    },
                },
            },
        },
    });
    // Search suggestions route
    app.get('/suggestions', {
        handler: searchcontroller_1.SearchController.getSearchSuggestions,
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    q: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 100,
                        description: 'Search query for suggestions'
                    },
                    limit: {
                        type: 'string',
                        pattern: '^[1-9][0-9]*$',
                        description: 'Number of suggestions (default: 5, max: 10)'
                    },
                },
                required: ['q'],
                additionalProperties: false,
            },
        },
    });
    // Health check for search service
    app.get('/health', async (request, reply) => {
        try {
            // Test search functionality (no type filter)
            await searchservice_1.SearchService.globalSearch('test', 1, 1);
            reply.send({
                status: 'healthy',
                service: 'search',
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            reply.status(503).send({
                status: 'unhealthy',
                service: 'search',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });
};
//# sourceMappingURL=serachroute.js.map