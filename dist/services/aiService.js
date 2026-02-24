"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = exports.askPhoneAI = void 0;
const generative_ai_1 = require("@google/generative-ai");
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
// Initialize Google Gemini
const genAI = process.env.GEMINI_API_KEY ? new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const prisma = new client_1.PrismaClient();
console.log('Google Gemini API key exists:', !!process.env.GEMINI_API_KEY);
// Helper function to convert file to base64
const fileToGenerativePart = (filePath, mimeType) => {
    return {
        inlineData: {
            data: fs_1.default.readFileSync(filePath).toString("base64"),
            mimeType
        },
    };
};
// Get product data from database
const getProductsFromDB = async () => {
    return await prisma.products.findMany({
        include: {
            categories: true,
            reviews: true,
        },
    });
};
// Get blog data from database
const getBlogsFromDB = async () => {
    return await prisma.blogs.findMany({
        where: { status: 'visible' },
        include: { blog_images: true },
    });
};
// Get user statistics
const getUserStats = async () => {
    const totalUsers = await prisma.users.count();
    const usersByRole = await prisma.users.groupBy({
        by: ['role'],
        _count: { role: true },
    });
    return { totalUsers, usersByRole };
};
/**
 * Enhanced AI function with dynamic database search for multi-mart marketplace
 */
const askPhoneAI = async (query, imageFile, audioFile) => {
    try {
        if (!query || query.trim().length === 0) {
            return 'Please provide a valid question about our products, services, or marketplace.';
        }
        // Try Google Gemini first
        if (process.env.GEMINI_API_KEY && genAI) {
            console.log('🤖 Using Google Gemini AI with database integration');
            try {
                // Fetch database data
                const products = await getProductsFromDB();
                const blogs = await getBlogsFromDB();
                const userStats = await getUserStats();
                // Prepare database context
                const dbContext = `
DATABASE CONTEXT:
=================

PRODUCTS (${products.length} total - ALL CATEGORIES):
${products.slice(0, 20).map(p => `
- ${p.name}: $${Number(p.price)} (Stock: ${p.stock_quantity || 0})
  Category: ${p.categories?.name || 'N/A'}
  Description: ${p.description || 'No description'}
  Discount: ${p.discount_percentage || 0}%
`).join('')}

BLOGS & ARTICLES (${blogs.length} total):
${blogs.slice(0, 10).map(b => `
- ${b.title}
  ${b.content ? b.content.substring(0, 150) : ''}...
`).join('')}

USER STATISTICS:
- Total Users: ${userStats.totalUsers}
`;
                // **FIX: Use working Gemini model names**
                const modelNames = [
                    "gemini-2.0-flash-exp",
                    "gemini-1.5-flash",
                    "gemini-1.5-pro"
                ];
                let model = null;
                let workingModel = null;
                for (const modelName of modelNames) {
                    try {
                        model = genAI.getGenerativeModel({ model: modelName });
                        workingModel = modelName;
                        console.log(`✅ Using model: ${modelName}`);
                        break;
                    }
                    catch (modelError) {
                        console.log(`❌ Model ${modelName} failed, trying next...`);
                    }
                }
                if (!model) {
                    throw new Error('No working Gemini model found');
                }
                let prompt = `You are a Multi-Mart Marketplace AI assistant. Search the database above and respond with accurate product and blog information. We sell ALL types of products across multiple categories - electronics, fashion, home goods, beauty, sports, and more.

${dbContext}

User Query: ${query}`;
                const parts = [prompt];
                // Handle image analysis
                if (imageFile) {
                    console.log('🖼️ Processing image with Gemini Vision');
                    const imagePart = fileToGenerativePart(imageFile.path, imageFile.mimetype);
                    parts.push(imagePart);
                }
                const result = await model.generateContent(parts);
                const response = await result.response;
                const text = response.text();
                if (text && text.trim().length > 0) {
                    return `🛒 Multi-Mart AI: ${text.trim()}`;
                }
            }
            catch (geminiError) {
                console.error('🚨 Gemini AI error:', geminiError.message);
            }
        }
        // Enhanced fallback with smart search
        console.warn('⚠️ Using enhanced fallback mode with database');
        return await getFallbackResponseWithDB(query);
    }
    catch (error) {
        console.error('🚨 AI service error:', error);
        return `🛒 Multi-Mart AI (Error): Sorry, I encountered an issue. Please try again. Error: ${error.message}`;
    }
};
exports.askPhoneAI = askPhoneAI;
/**
 * **FIXED**: Smart search with typo tolerance for all products and blogs
 */
const getFallbackResponseWithDB = async (query) => {
    const lowerQuery = query.toLowerCase();
    try {
        const products = await getProductsFromDB();
        const blogs = await getBlogsFromDB();
        // Check if query is about blogs/articles
        if (lowerQuery.includes('blog') || lowerQuery.includes('article') || lowerQuery.includes('read')) {
            const blogResults = smartBlogSearch(blogs, query);
            if (blogResults.length > 0) {
                const blogList = blogResults.slice(0, 5).map(b => `📰 ${b.title}
📝 ${b.content ? b.content.substring(0, 150) : 'No preview available'}...`).join('\n\n');
                return `🛒 Multi-Mart AI (Database): Found ${blogResults.length} articles:\n\n${blogList}`;
            }
        }
        // **NEW: Smart product search**
        const searchResults = await smartProductSearch(products, query);
        if (searchResults.exactMatches.length > 0) {
            const productList = searchResults.exactMatches.slice(0, 5).map(p => `🛍️ ${p.name} - $${Number(p.price)} ${getStockStatus(p.stock_quantity)}
📦 Category: ${p.categories?.name || 'General'}
📝 ${p.description || 'No description available'}`).join('\n\n');
            return `🛒 Multi-Mart AI : Found ${searchResults.exactMatches.length} exact matches:\n\n${productList}\n\nWould you like more details about any of these?`;
        }
        if (searchResults.fuzzyMatches.length > 0) {
            const productList = searchResults.fuzzyMatches.slice(0, 5).map(p => `🛍️ ${p.name} - $${Number(p.price)} ${getStockStatus(p.stock_quantity)}
📦 Category: ${p.categories?.name || 'General'}
📝 ${p.description || 'No description available'}`).join('\n\n');
            return `🛒 Multi-Mart AI : Found ${searchResults.fuzzyMatches.length} similar products:\n\n${productList}\n\nDid you mean one of these?`;
        }
        // Handle "show all" or general queries
        if (lowerQuery.includes('show') || lowerQuery.includes('all') || lowerQuery.includes('available') || lowerQuery.includes('products')) {
            const availableProducts = products
                .filter(p => p.stock_quantity && p.stock_quantity > 0)
                .slice(0, 6);
            if (availableProducts.length > 0) {
                const productList = availableProducts.map(p => `🛍️ ${p.name} - $${Number(p.price)} (${p.stock_quantity} in stock) - ${p.categories?.name || 'General'}`).join('\n');
                return `🛒 Multi-Mart AI : Here are our available products across all categories:\n\n${productList}`;
            }
        }
        // No matches - show available products from different categories
        const availableProducts = products
            .filter(p => p.stock_quantity && p.stock_quantity > 0)
            .slice(0, 5);
        if (availableProducts.length > 0) {
            const productList = availableProducts.map(p => `🛍️ ${p.name} - $${Number(p.price)} (${p.stock_quantity} in stock) - ${p.categories?.name || 'General'}`).join('\n');
            return `🛒 Multi-Mart AI : Couldn't find what you're looking for, but here are some available products:\n\n${productList}`;
        }
        return `🛒 Multi-Mart AI : No products currently available. Check back soon!`;
    }
    catch (error) {
        console.error('Database query error:', error);
        return `🛒 Multi-Mart AI: Sorry, I'm having trouble finding products right now. Please try again in a moment.`;
    }
};
/**
 * **NEW**: Smart blog search
 */
const smartBlogSearch = (blogs, query) => {
    const lowerQuery = query.toLowerCase();
    const meaningfulTerms = extractMeaningfulTerms(lowerQuery);
    return blogs.filter(blog => {
        const blogTitle = blog.title.toLowerCase();
        const blogContent = (blog.content || '').toLowerCase();
        return meaningfulTerms.some(term => blogTitle.includes(term) || blogContent.includes(term));
    });
};
/**
 * **NEW**: Smart product search with brand detection and typo tolerance for ALL product types
 */
const smartProductSearch = async (products, query) => {
    const lowerQuery = query.toLowerCase();
    // Extract meaningful terms (ignore common words)
    const meaningfulTerms = extractMeaningfulTerms(lowerQuery);
    console.log(`🔍 Smart search terms: ${meaningfulTerms.join(', ')}`);
    const exactMatches = [];
    const fuzzyMatches = [];
    products.forEach(product => {
        const productName = product.name.toLowerCase();
        const productDesc = (product.description || '').toLowerCase();
        const categoryName = (product.categories?.name || '').toLowerCase();
        // Check for exact matches
        const hasExactMatch = meaningfulTerms.some(term => {
            return productName.includes(term) ||
                productDesc.includes(term) ||
                categoryName.includes(term);
        });
        if (hasExactMatch) {
            exactMatches.push(product);
            return;
        }
        // Check for fuzzy matches (typos)
        const hasFuzzyMatch = meaningfulTerms.some(term => {
            if (term.length > 3) {
                // Handle common typos for various product types
                const variations = [
                    term.replace('samsumg', 'samsung'),
                    term.replace('samung', 'samsung'),
                    term.replace('iphone', 'iphone'),
                    term.replace('pixle', 'pixel'),
                    term.replace('nke', 'nike'),
                    term.replace('adias', 'adidas'),
                    term.replace('tshirt', 't-shirt'),
                    term.replace('laptpo', 'laptop'),
                    term.replace('shose', 'shoes'),
                    term.replace('womens', 'women'),
                    term.replace('mens', 'men')
                ];
                return variations.some(variant => productName.includes(variant) ||
                    productDesc.includes(variant));
            }
            return false;
        });
        if (hasFuzzyMatch) {
            fuzzyMatches.push(product);
        }
    });
    return { exactMatches, fuzzyMatches };
};
/**
 * **NEW**: Extract only meaningful terms from query
 */
const extractMeaningfulTerms = (query) => {
    // Remove common/filler words
    const fillerWords = [
        'i', 'need', 'want', 'do', 'you', 'have', 'is', 'there', 'any', 'show', 'me', 'all',
        'okay', 'ok', 'oky', 'please', 'tell', 'if', 'it', 'the', 'a', 'an', 'and', 'or', 'but',
        'for', 'with', 'its', 'description', 'price', 'cost', 'about', 'info', 'information',
        'looking', 'find', 'search', 'get', 'buy', 'purchase'
    ];
    // Extract words, clean them up
    const words = query
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 &&
        !fillerWords.includes(word) &&
        /^[a-zA-Z0-9]+$/.test(word) // Only alphanumeric
    );
    return [...new Set(words)]; // Remove duplicates
};
/**
 * Helper function to get stock status
 */
const getStockStatus = (stockQuantity) => {
    if (!stockQuantity || stockQuantity <= 0) {
        return '(Out of stock)';
    }
    return `(${stockQuantity} in stock)`;
};
// Report generation for multi-mart marketplace
const generateReport = async (reportType, startDate, endDate) => {
    try {
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        switch (reportType.toLowerCase()) {
            case 'products':
            case 'product-sales':
            case 'inventory': {
                const products = await prisma.products.findMany({
                    include: { categories: true, reviews: true, cart: true }
                });
                const totalProducts = products.length;
                const inStock = products.filter(p => (p.stock_quantity || 0) > 0).length;
                const outOfStock = totalProducts - inStock;
                const totalValue = products.reduce((sum, p) => sum + (Number(p.price) * (p.stock_quantity || 0)), 0);
                const avgPrice = products.reduce((sum, p) => sum + Number(p.price), 0) / totalProducts;
                return `MULTI-MART MARKETPLACE - PRODUCT INVENTORY ANALYSIS

Report Date: ${currentDate}
Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

INVENTORY OVERVIEW (ALL CATEGORIES)
Total Products in Catalog: ${totalProducts}
Products Currently in Stock: ${inStock}
Products Out of Stock: ${outOfStock}
Stock Availability Rate: ${((inStock / totalProducts) * 100).toFixed(1)}%

FINANCIAL ANALYSIS
Total Inventory Value: $${totalValue.toLocaleString()}
Average Product Price: $${avgPrice.toFixed(2)}

CATEGORY BREAKDOWN
${await getCategoryBreakdownProfessional()}

Report Generated: ${new Date().toLocaleString()}
Prepared by: Multi-Mart Analytics Division`;
            }
            case 'users':
            case 'user-activity': {
                const userStats = await getUserStats();
                const recentUsers = await prisma.users.count({
                    where: { created_at: { gte: start } }
                });
                return `MULTI-MART MARKETPLACE - USER ACTIVITY ANALYSIS

Report Date: ${currentDate}
Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

USER METRICS
Total Registered Users: ${userStats.totalUsers}
New User Registrations (Period): ${recentUsers}
User Growth Rate: ${userStats.totalUsers > 0 ? ((recentUsers / userStats.totalUsers) * 100).toFixed(1) : 0}%

USER ROLE DISTRIBUTION
${userStats.usersByRole.filter(r => r.role).map(r => `${r.role.charAt(0).toUpperCase() + r.role.slice(1)}: ${r._count.role} users`).join('\n')}

Report Generated: ${new Date().toLocaleString()}
Prepared by: Multi-Mart Analytics Division`;
            }
            case 'blogs':
            case 'content': {
                const blogs = await getBlogsFromDB();
                const totalBlogs = blogs.length;
                return `MULTI-MART MARKETPLACE - CONTENT ANALYSIS

Report Date: ${currentDate}

BLOG & CONTENT METRICS
Total Published Articles: ${totalBlogs}
Visible Content Pieces: ${blogs.filter(b => b.status === 'visible').length}

Report Generated: ${new Date().toLocaleString()}
Prepared by: Multi-Mart Analytics Division`;
            }
            default: {
                const productCount = await prisma.products.count();
                const userCount = await prisma.users.count();
                const blogCount = await prisma.blogs.count();
                return `MULTI-MART MARKETPLACE - COMPREHENSIVE BUSINESS OVERVIEW

Report Date: ${currentDate}

KEY BUSINESS METRICS
Product Catalog Size: ${productCount} active products (all categories)
Customer Base: ${userCount} registered users
Content Library: ${blogCount} published articles

Report Generated: ${new Date().toLocaleString()}
Prepared by: Multi-Mart Analytics Division`;
            }
        }
    }
    catch (error) {
        return `MULTI-MART MARKETPLACE - REPORT GENERATION ERROR

An error occurred while generating the ${reportType} report.
Error Details: ${error.message}

Generated: ${new Date().toLocaleString()}`;
    }
};
exports.generateReport = generateReport;
const getCategoryBreakdownProfessional = async () => {
    try {
        const categories = await prisma.categories.findMany({
            include: { _count: { select: { products: true } } }
        });
        return categories
            .sort((a, b) => b._count.products - a._count.products)
            .slice(0, 10)
            .map(cat => `${cat.name}: ${cat._count.products} products`)
            .join('\n');
    }
    catch {
        return 'Category analysis unavailable';
    }
};
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { PrismaClient } from '@prisma/client';
// import fs from 'fs';
// import path from 'path';
// import { UploadedFile } from '../types/file';
// // Initialize Google Gemini
// const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
// const prisma = new PrismaClient();
// console.log('Google Gemini API key exists:', !!process.env.GEMINI_API_KEY);
// // Helper function to convert file to base64
// const fileToGenerativePart = (filePath: string, mimeType: string) => {
//   return {
//     inlineData: {
//       data: fs.readFileSync(filePath).toString("base64"),
//       mimeType
//     },
//   };
// };
// // Get product data from database
// const getProductsFromDB = async () => {
//   return await prisma.products.findMany({
//     include: {
//       categories: true,
//       reviews: true,
//     },
//   });
// };
// // Get blog data from database
// const getBlogsFromDB = async () => {
//   return await prisma.blogs.findMany({
//     where: { status: 'visible' },
//     include: { blog_images: true },
//   });
// };
// // Get user statistics
// const getUserStats = async () => {
//   const totalUsers = await prisma.users.count();
//   const usersByRole = await prisma.users.groupBy({
//     by: ['role'],
//     _count: { role: true },
//   });
//   return { totalUsers, usersByRole };
// };
// /**
//  * Enhanced AI function with dynamic database search
//  */
// export const askPhoneAI = async (
//   query: string,
//   imageFile?: UploadedFile,
//   audioFile?: UploadedFile
// ): Promise<string> => {
//   try {
//     if (!query || query.trim().length === 0) {
//       return 'Please provide a valid question about phones, products, or our services.';
//     }
//     // Try Google Gemini first
//     if (process.env.GEMINI_API_KEY && genAI) {
//       console.log('🤖 Using Google Gemini AI with database integration');
//       try {
//         // Fetch database data
//         const products = await getProductsFromDB();
//         const blogs = await getBlogsFromDB();
//         const userStats = await getUserStats();
//         // Prepare database context
//         const dbContext = `
// DATABASE CONTEXT:
// =================
// PRODUCTS (${products.length} total):
// ${products.slice(0, 20).map(p => `
// - ${p.name}: $${Number(p.price)} (Stock: ${p.stock_quantity || 0})
//   Category: ${p.categories?.name || 'N/A'}
//   Description: ${p.description || 'No description'}
//   Discount: ${p.discount_percentage || 0}%
// `).join('')}
// USER STATISTICS:
// - Total Users: ${userStats.totalUsers}
// `;
//         // **FIX: Use working Gemini model names**
//         const modelNames = [
//           "gemini-2.0-flash-exp",      
//           "gemini-1.5-flash",          
//           "gemini-1.5-pro"            
//         ];
//         let model = null;
//         let workingModel = null;
//         for (const modelName of modelNames) {
//           try {
//             model = genAI.getGenerativeModel({ model: modelName });
//             workingModel = modelName;
//             console.log(`✅ Using model: ${modelName}`);
//             break;
//           } catch (modelError) {
//             console.log(`❌ Model ${modelName} failed, trying next...`);
//           }
//         }
//         if (!model) {
//           throw new Error('No working Gemini model found');
//         }
//         let prompt = `You are Dimbop AI assistant. Search the database above and respond with accurate product information.
// ${dbContext}
// User Query: ${query}`;
//         const parts: any[] = [prompt];
//         // Handle image analysis
//         if (imageFile) {
//           console.log('🖼️ Processing image with Gemini Vision');
//           const imagePart = fileToGenerativePart(imageFile.path, imageFile.mimetype);
//           parts.push(imagePart);
//         }
//         const result = await model.generateContent(parts);
//         const response = await result.response;
//         const text = response.text();
//         if (text && text.trim().length > 0) {
//           return `🤖 Dimbop AI: ${text.trim()}`;
//         }
//       } catch (geminiError: any) {
//         console.error('🚨 Gemini AI error:', geminiError.message);
//       }
//     }
//     // Enhanced fallback with smart search
//     console.warn('⚠️ Using enhanced fallback mode with database');
//     return await getFallbackResponseWithDB(query);
//   } catch (error: any) {
//     console.error('🚨 AI service error:', error);
//     return `🤖 Dimbop AI (Error): Sorry, I encountered an issue. Please try again. Error: ${error.message}`;
//   }
// };
// /**
//  * **FIXED**: Smart search with typo tolerance
//  */
// const getFallbackResponseWithDB = async (query: string): Promise<string> => {
//   const lowerQuery = query.toLowerCase();
//   try {
//     const products = await getProductsFromDB();
//     // **NEW: Smart product search**
//     const searchResults = await smartProductSearch(products, query);
//     if (searchResults.exactMatches.length > 0) {
//       const productList = searchResults.exactMatches.slice(0, 5).map(p => 
//         `📱 ${p.name} - $${Number(p.price)} ${getStockStatus(p.stock_quantity)}
// 📝 ${p.description || 'No description available'}`
//       ).join('\n\n');
//       return `🤖 Dimbop AI (Database): Found ${searchResults.exactMatches.length} exact matches:\n\n${productList}\n\nWould you like more details about any of these?`;
//     }
//     if (searchResults.fuzzyMatches.length > 0) {
//       const productList = searchResults.fuzzyMatches.slice(0, 5).map(p => 
//         `📱 ${p.name} - $${Number(p.price)} ${getStockStatus(p.stock_quantity)}
// 📝 ${p.description || 'No description available'}`
//       ).join('\n\n');
//       return `🤖 Dimbop AI (Database): Found ${searchResults.fuzzyMatches.length} similar products:\n\n${productList}\n\nDid you mean one of these?`;
//     }
//     // Handle "show all" or general queries
//     if (lowerQuery.includes('show') || lowerQuery.includes('all') || lowerQuery.includes('available') || lowerQuery.includes('products')) {
//       const availableProducts = products
//         .filter(p => p.stock_quantity && p.stock_quantity > 0)
//         .slice(0, 6);
//       if (availableProducts.length > 0) {
//         const productList = availableProducts.map(p => 
//           `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity} in stock)`
//         ).join('\n');
//         return `🤖 Dimbop AI (Database): Here are our available products:\n\n${productList}`;
//       }
//     }
//     // No matches - show available products
//     const availableProducts = products
//       .filter(p => p.stock_quantity && p.stock_quantity > 0)
//       .slice(0, 5);
//     if (availableProducts.length > 0) {
//       const productList = availableProducts.map(p => 
//         `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity} in stock)`
//       ).join('\n');
//       return `🤖 Dimbop AI (Database): Couldn't find what you're looking for, but here are our available products:\n\n${productList}`;
//     }
//     return `🤖 Dimbop AI (Database): No products currently available.`;
//   } catch (error) {
//     console.error('Database query error:', error);
//     return `🤖 Dimbop AI (Database Error): Sorry, I'm having trouble accessing our database. Please try again later.`;
//   }
// };
// /**
//  * **NEW**: Smart product search with brand detection and typo tolerance
//  */
// const smartProductSearch = async (products: any[], query: string) => {
//   const lowerQuery = query.toLowerCase();
//   // Extract meaningful terms (ignore common words)
//   const meaningfulTerms = extractMeaningfulTerms(lowerQuery);
//   console.log(`🔍 Smart search terms: ${meaningfulTerms.join(', ')}`);
//   const exactMatches: any[] = [];
//   const fuzzyMatches: any[] = [];
//   products.forEach(product => {
//     const productName = product.name.toLowerCase();
//     const productDesc = (product.description || '').toLowerCase();
//     const categoryName = (product.categories?.name || '').toLowerCase();
//     // Check for exact matches
//     const hasExactMatch = meaningfulTerms.some(term => {
//       return productName.includes(term) || 
//              productDesc.includes(term) || 
//              categoryName.includes(term);
//     });
//     if (hasExactMatch) {
//       exactMatches.push(product);
//       return;
//     }
//     // Check for fuzzy matches (typos)
//     const hasFuzzyMatch = meaningfulTerms.some(term => {
//       if (term.length > 3) {
//         // Handle common typos
//         const variations = [
//           term.replace('samsumg', 'samsung'),
//           term.replace('samung', 'samsung'),
//           term.replace('iphone', 'iphone'),
//           term.replace('pixle', 'pixel')
//         ];
//         return variations.some(variant => 
//           productName.includes(variant) || 
//           productDesc.includes(variant)
//         );
//       }
//       return false;
//     });
//     if (hasFuzzyMatch) {
//       fuzzyMatches.push(product);
//     }
//   });
//   return { exactMatches, fuzzyMatches };
// };
// /**
//  * **NEW**: Extract only meaningful terms from query
//  */
// const extractMeaningfulTerms = (query: string): string[] => {
//   // Remove common/filler words
//   const fillerWords = [
//     'i', 'need', 'want', 'do', 'you', 'have', 'is', 'there', 'any', 'show', 'me', 'all', 
//     'okay', 'ok', 'oky', 'please', 'tell', 'if', 'it', 'the', 'a', 'an', 'and', 'or', 'but', 
//     'for', 'with', 'its', 'description', 'price', 'cost', 'about', 'info', 'information'
//   ];
//   // Extract words, clean them up
//   const words = query
//     .toLowerCase()
//     .replace(/[^\w\s]/g, ' ')
//     .split(/\s+/)
//     .filter(word => 
//       word.length > 2 && 
//       !fillerWords.includes(word) &&
//       /^[a-zA-Z0-9]+$/.test(word) // Only alphanumeric
//     );
//   return [...new Set(words)]; // Remove duplicates
// };
// /**
//  * Helper function to get stock status
//  */
// const getStockStatus = (stockQuantity?: number | null): string => {
//   if (!stockQuantity || stockQuantity <= 0) {
//     return '(Out of stock)';
//   }
//   return `(${stockQuantity} in stock)`;
// };
// // Keep all your original generateReport and helper functions exactly as they were
// export const generateReport = async (
//   reportType: string,
//   startDate?: string,
//   endDate?: string
// ): Promise<string> => {
//   try {
//     const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//     const end = endDate ? new Date(endDate) : new Date();
//     const currentDate = new Date().toLocaleDateString('en-US', { 
//       year: 'numeric', month: 'long', day: 'numeric' 
//     });
//     switch (reportType.toLowerCase()) {
//       case 'products':
//       case 'product-sales':
//       case 'inventory': {
//         const products = await prisma.products.findMany({
//           include: { categories: true, reviews: true, cart: true }
//         });
//         const totalProducts = products.length;
//         const inStock = products.filter(p => (p.stock_quantity || 0) > 0).length;
//         const outOfStock = totalProducts - inStock;
//         const totalValue = products.reduce((sum, p) => sum + (Number(p.price) * (p.stock_quantity || 0)), 0);
//         const avgPrice = products.reduce((sum, p) => sum + Number(p.price), 0) / totalProducts;
//         return `DIMBOP ENTERPRISES - PRODUCT INVENTORY ANALYSIS
// Report Date: ${currentDate}
// Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}
// INVENTORY OVERVIEW
// Total Products in Catalog: ${totalProducts}
// Products Currently in Stock: ${inStock}
// Products Out of Stock: ${outOfStock}
// Stock Availability Rate: ${((inStock/totalProducts) * 100).toFixed(1)}%
// FINANCIAL ANALYSIS
// Total Inventory Value: $${totalValue.toLocaleString()}
// Average Product Price: $${avgPrice.toFixed(2)}
// CATEGORY BREAKDOWN
// ${await getCategoryBreakdownProfessional()}
// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
//       }
//       case 'users':
//       case 'user-activity': {
//         const userStats = await getUserStats();
//         const recentUsers = await prisma.users.count({
//           where: { created_at: { gte: start } }
//         });
//         return `DIMBOP ENTERPRISES - USER ACTIVITY ANALYSIS
// Report Date: ${currentDate}
// Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}
// USER METRICS
// Total Registered Users: ${userStats.totalUsers}
// New User Registrations (Period): ${recentUsers}
// User Growth Rate: ${userStats.totalUsers > 0 ? ((recentUsers/userStats.totalUsers) * 100).toFixed(1) : 0}%
// USER ROLE DISTRIBUTION
// ${userStats.usersByRole.filter(r => r.role).map(r => `${r.role!.charAt(0).toUpperCase() + r.role!.slice(1)}: ${r._count.role} users`).join('\n')}
// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
//       }
//       default: {
//         const productCount = await prisma.products.count();
//         const userCount = await prisma.users.count();
//         const blogCount = await prisma.blogs.count();
//         return `DIMBOP ENTERPRISES - COMPREHENSIVE BUSINESS OVERVIEW
// Report Date: ${currentDate}
// KEY BUSINESS METRICS
// Product Catalog Size: ${productCount} active products
// Customer Base: ${userCount} registered users
// Content Library: ${blogCount} published articles
// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
//       }
//     }
//   } catch (error: any) {
//     return `DIMBOP ENTERPRISES - REPORT GENERATION ERROR
// An error occurred while generating the ${reportType} report.
// Error Details: ${error.message}
// Generated: ${new Date().toLocaleString()}`;
//   }
// };
// const getCategoryBreakdownProfessional = async (): Promise<string> => {
//   try {
//     const categories = await prisma.categories.findMany({
//       include: { _count: { select: { products: true } } }
//     });
//     return categories
//       .sort((a, b) => b._count.products - a._count.products)
//       .slice(0, 5)
//       .map(cat => `${cat.name}: ${cat._count.products} products`)
//       .join('\n');
//   } catch {
//     return 'Category analysis unavailable';
//   }
// };
//# sourceMappingURL=aiService.js.map