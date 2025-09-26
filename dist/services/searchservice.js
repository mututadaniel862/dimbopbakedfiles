"use strict";
// ====================================
// SEARCH SERVICE (services/searchService.ts)
// ====================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.SearchService = {
    async globalSearch(query, page = 1, limit = 20, type, baseUrl = 'http://localhost:5173' // Frontend base URL
    ) {
        try {
            const skip = (page - 1) * limit;
            const searchTerm = `%${query.toLowerCase()}%`;
            let productResults = [];
            let blogResults = [];
            // Search Products (if not filtered to blogs only)
            if (!type || type === 'product') {
                productResults = await prisma.products.findMany({
                    where: {
                        OR: [
                            {
                                name: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                categories: {
                                    name: {
                                        contains: query,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        ],
                    },
                    include: {
                        categories: true,
                        reviews: true,
                    },
                    orderBy: {
                        views: 'desc', // Most viewed first
                    },
                    take: type === 'product' ? limit : Math.ceil(limit / 2),
                    skip: type === 'product' ? skip : 0,
                });
            }
            // Search Blogs (if not filtered to products only)
            if (!type || type === 'blog') {
                blogResults = await prisma.blogs.findMany({
                    where: {
                        AND: [
                            {
                                status: 'visible', // Only visible blogs
                            },
                            {
                                OR: [
                                    {
                                        title: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        description: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        content: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        categories: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        keywords: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    include: {
                        blog_images: true,
                    },
                    orderBy: {
                        created_at: 'desc', // Most recent first
                    },
                    take: type === 'blog' ? limit : Math.ceil(limit / 2),
                    skip: type === 'blog' ? skip : 0,
                });
            }
            // Transform and combine results
            const transformedResults = [];
            // Transform product results
            productResults.forEach((product) => {
                transformedResults.push({
                    id: product.id,
                    title: product.name,
                    description: product.description || 'No description available',
                    type: 'product',
                    image_url: product.image_url,
                    price: product.price,
                    category: product.categories?.name || null,
                    status: 'active',
                    created_at: product.created_at,
                    updated_at: product.updated_at,
                    frontend_url: `${baseUrl}/products/${product.id}`, // Frontend product page
                });
            });
            // Transform blog results
            blogResults.forEach((blog) => {
                transformedResults.push({
                    id: blog.id,
                    title: blog.title,
                    description: blog.description || blog.content?.substring(0, 200) + '...' || 'No description available',
                    type: 'blog',
                    image_url: blog.hero_image || blog.image_url,
                    category: blog.categories,
                    status: blog.status,
                    created_at: blog.created_at,
                    updated_at: blog.updated_at,
                    frontend_url: `${baseUrl}/blogs/${blog.id}`, // Frontend blog page
                });
            });
            // Sort combined results by relevance (you can customize this)
            transformedResults.sort((a, b) => {
                // Prioritize exact title matches
                const aExact = a.title.toLowerCase().includes(query.toLowerCase());
                const bExact = b.title.toLowerCase().includes(query.toLowerCase());
                if (aExact && !bExact)
                    return -1;
                if (!aExact && bExact)
                    return 1;
                // Then sort by date
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
            // Apply pagination to combined results
            const paginatedResults = transformedResults.slice(skip, skip + limit);
            return {
                results: paginatedResults,
                total: transformedResults.length,
                query,
                categories: {
                    products: productResults.length,
                    blogs: blogResults.length,
                },
            };
        }
        catch (error) {
            console.error('Global search error:', error);
            throw new Error(`Search failed: ${error}`);
        }
    },
    async getSearchSuggestions(query, limit = 5) {
        try {
            const searchTerm = `%${query.toLowerCase()}%`;
            // Get suggestions from product names and blog titles
            const [products, blogs] = await Promise.all([
                prisma.products.findMany({
                    where: {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    select: {
                        name: true,
                    },
                    take: Math.ceil(limit / 2),
                }),
                prisma.blogs.findMany({
                    where: {
                        AND: [
                            { status: 'visible' },
                            {
                                title: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                    select: {
                        title: true,
                    },
                    take: Math.ceil(limit / 2),
                }),
            ]);
            const suggestions = [];
            products.forEach(p => suggestions.push(p.name));
            blogs.forEach(b => suggestions.push(b.title));
            // Remove duplicates and limit results
            return [...new Set(suggestions)].slice(0, limit);
        }
        catch (error) {
            console.error('Search suggestions error:', error);
            return [];
        }
    },
};
//# sourceMappingURL=searchservice.js.map