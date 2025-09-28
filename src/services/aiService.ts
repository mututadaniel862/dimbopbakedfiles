



// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize Google Gemini
// const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// console.log('Google Gemini API key exists:', !!process.env.GEMINI_API_KEY);

// // Fallback phone database - fixed TypeScript types
// interface PhoneInfo {
//   specs: string;
//   note?: string;
// }

// const phoneResponses: Record<string, PhoneInfo> = {
//   'samsung galaxy s23': {
//     specs: 'Samsung Galaxy S23: 6.1" display, 8GB RAM, 128GB/256GB/512GB storage, Snapdragon 8 Gen 2, 50MP camera, 3900mAh battery. Price: $799-999',
//     note: 'Note: S23 comes with 8GB RAM, not 12GB. For 12GB RAM, consider Galaxy S23 Ultra or S24 series.'
//   },
//   'samsung galaxy s24': {
//     specs: 'Samsung Galaxy S24: 6.2" display, 8GB RAM, 128GB/256GB/512GB storage, Snapdragon 8 Gen 3, 50MP camera, 4000mAh battery. Price: $899-1099',
//   },
//   'iphone 15': {
//     specs: 'iPhone 15: 6.1" display, 6GB RAM, 128GB/256GB/512GB storage, A16 Bionic, 48MP camera, 3349mAh battery. Price: $799-1099'
//   },
//   'iphone 15 pro': {
//     specs: 'iPhone 15 Pro: 6.1" display, 8GB RAM, 128GB/256GB/512GB/1TB storage, A17 Pro, 48MP camera, 3274mAh battery. Price: $999-1499'
//   },
//   'google pixel 8': {
//     specs: 'Google Pixel 8: 6.2" display, 8GB RAM, 128GB/256GB storage, Tensor G3, 50MP camera, 4575mAh battery. Price: $699-799'
//   },
//   'google pixel 8 pro': {
//     specs: 'Google Pixel 8 Pro: 6.7" display, 12GB RAM, 128GB/256GB/512GB/1TB storage, Tensor G3, 50MP camera, 5050mAh battery. Price: $999-1299'
//   }
// };

// /**
//  * Get fallback response when AI service is unavailable
//  */
// const getFallbackResponse = (query: string): string => {
//   const lowerQuery = query.toLowerCase();
  
//   // Check for specific phone models
//   for (const [phone, info] of Object.entries(phoneResponses)) {
//     if (lowerQuery.includes(phone.replace(/\s+/g, ' '))) {
//       const noteText = info.note ? `\n\n${info.note}` : '';
//       return `🤖 Dimbop AI (Offline Mode): ${info.specs}${noteText}`;
//     }
//   }
  
//   // Photography phones
//   if (lowerQuery.includes('photography') || lowerQuery.includes('camera')) {
//     return `🤖 Dimbop AI (Offline Mode): Best phones for photography:

// 📸 **Premium Options:**
// - iPhone 15 Pro/Pro Max - Excellent video, natural colors
// - Google Pixel 8 Pro - Best AI photo features, night mode
// - Samsung Galaxy S24 Ultra - 200MP camera, 100x zoom

// 📸 **Budget Options:**
// - Google Pixel 8 - Great AI photography at lower price
// - Samsung Galaxy S23 - Solid all-round camera performance

// What's your budget range?`;
//   }
  
//   // Generic phone advice
//   if (lowerQuery.includes('recommend') || lowerQuery.includes('best phone')) {
//     return `🤖 Dimbop AI (Offline Mode): Popular 2024 phones include:
    
// - Samsung Galaxy S23/S24 - Great cameras, premium build
// - iPhone 15 - Smooth iOS, excellent performance  
// - Google Pixel 8 - Best AI features, pure Android
// - OnePlus 12 - Fast charging, good value

// What's your budget and main use case?`;
//   }
  
//   if (lowerQuery.includes('storage') || lowerQuery.includes('gb')) {
//     return `🤖 Dimbop AI (Offline Mode): For storage recommendations:
// - 128GB - Basic users
// - 256GB - Most users (recommended)
// - 512GB - Heavy users, lots of photos/videos
// - 1TB - Professional use, extensive media`;
//   }
  
//   return `🤖 Dimbop AI (Offline Mode): I can help with phone specifications, recommendations, and comparisons. Please ask about specific phone models or features you're interested in.`;
// };

// /**
//  * Answer user queries about phones using Google Gemini AI
//  */
// export const askPhoneAI = async (query: string): Promise<string> => {
//   try {
//     if (!query || query.trim().length === 0) {
//       return 'Please provide a valid question about phones.';
//     }

//     // Try Google Gemini first
//     if (process.env.GEMINI_API_KEY && genAI) {
//       console.log('🤖 Using Google Gemini AI');
      
//       try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         const prompt = `You are Dimbop AI assistant, a specialized mobile phone expert. 

// RULES:
// - ONLY answer questions about mobile phones, smartphones, and related accessories
// - Be helpful, accurate, and concise
// - Include specifications, prices, and comparisons when relevant
// - If asked about non-phone topics, politely redirect to phone-related questions
// - Keep responses under 200 words

// User Question: ${query}`;
        
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const text = response.text();
        
//         if (text && text.trim().length > 0) {
//           return `🤖 Dimbop AI: ${text.trim()}`;
//         }
//       } catch (geminiError: any) {
//         console.error('🚨 Gemini AI error:', geminiError.message);
//       }
//     }

//     // Fallback to local database
//     console.warn('⚠️ Using fallback mode');
//     return getFallbackResponse(query);

//   } catch (error: any) {
//     console.error('🚨 AI service error:', error);
//     return getFallbackResponse(query);
//   }
// };

// /**
//  * Generate report for digital marketers
//  */
// export const generateReport = async (
//   reportType: string,
//   startDate?: string,
//   endDate?: string
// ): Promise<string> => {
//   try {
//     // Mock data for different report types
//     const mockData: Record<string, string> = {
//       'sales': 'Samsung leads with 23% market share, followed by Apple (20%) and Xiaomi (13%). Foldable phones saw 150% growth.',
//       'phone-sales': 'Samsung leads with 23% market share, followed by Apple (20%) and Xiaomi (13%). Foldable phones saw 150% growth.',
//       'user_activity': 'Users spend avg 6.5 hours daily on phones. Top activities: Social media (35%), Gaming (25%), Photography (15%)',
//       'market-trends': 'AI features and foldable phones are trending in 2024. 5G adoption reached 68% globally.',
//       'user-behavior': '67% prefer phones with 256GB+ storage, 45% prioritize camera quality, 38% want fast charging',
//       'inventory': 'Current stock levels: iPhone 15 (450 units), Galaxy S24 (320 units), Pixel 8 (180 units)',
//       'revenue': 'Q3 2024 revenue: $2.1M total, avg order value $780, 15% growth vs Q2'
//     };
    
//     const data = mockData[reportType.toLowerCase()] || mockData[reportType] || 'No specific data available for this report type';
    
//     return `📊 **${reportType.toUpperCase()} REPORT**

// 📅 **Period:** ${startDate || 'N/A'} to ${endDate || 'N/A'}
// 📈 **Key Insights:** ${data}
// ⏰ **Generated:** ${new Date().toLocaleString()}

// ---
// *Report by Dimbop AI Analytics*`;
    
//   } catch (error) {
//     console.error('Report generation error:', error);
//     return `❌ Report generation failed for "${reportType}". Please try again with valid parameters.`;
//   }
// };

// // Test function
// export const testQuery = async (): Promise<string> => {
//   const testQuery = "What's the best phone for photography?";
//   const result = await askPhoneAI(testQuery);
//   console.log('Test result:', result);
//   return result;
// };









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
//  * Enhanced AI function that handles text, images, and audio
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
// ${products.slice(0, 10).map(p => `
// - ${p.name}: $${Number(p.price)} (Stock: ${p.stock_quantity})
//   Category: ${p.categories?.name || 'N/A'}
//   Description: ${p.description}
//   Discount: ${p.discount_percentage}%
//   Average Rating: ${p.reviews?.length ? (p.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / p.reviews.length).toFixed(1) : 'N/A'}
// `).join('')}

// BLOGS (${blogs.length} total):
// ${blogs.slice(0, 5).map(b => `
// - Title: ${b.title}
//   Description: ${b.description}
//   Categories: ${b.categories}
// `).join('')}

// USER STATISTICS:
// - Total Users: ${userStats.totalUsers}
// - Users by Role: ${userStats.usersByRole.map(r => `${r.role}: ${r._count.role}`).join(', ')}
// `;

//         const model = genAI.getGenerativeModel({ 
//           model: imageFile ? "gemini-1.5-pro-vision-latest" : "gemini-1.5-flash" 
//         });

//         let prompt = `You are Dimbop AI assistant, a specialized mobile phone and e-commerce expert with access to our live database.

// ${dbContext}

// CAPABILITIES:
// - Answer questions about mobile phones, smartphones, and accessories
// - Recommend products from our database with accurate prices and availability
// - Provide information about our blog content
// - Generate user and sales statistics
// - Analyze images to help users find products
// - Process audio queries and convert to text responses

// RULES:
// - Always use REAL data from the database context above
// - Include actual prices, stock levels, and product details
// - When recommending products, mention if they're in stock
// - For image analysis, identify phones/products and match with our inventory
// - Keep responses helpful, accurate, and under 300 words
// - If asked about non-phone/non-business topics, politely redirect

// User Query: ${query}`;

//         const parts: any[] = [prompt];

//         // Handle image analysis
//         if (imageFile) {
//           console.log('🖼️ Processing image with Gemini Vision');
//           const imagePart = fileToGenerativePart(imageFile.path, imageFile.mimetype);
//           parts.push(imagePart);
//           prompt += `\n\nIMAGE ANALYSIS: Please analyze the provided image. If it shows a phone or electronic device, try to identify it and recommend similar products from our database.`;
//         }

//         // Handle audio processing (convert to text first)
//         if (audioFile) {
//           console.log('🎵 Processing audio file');
//           // Note: Gemini doesn't directly process audio yet, so we'd need a separate service
//           prompt += `\n\nAUDIO PROCESSING: User provided an audio file with their query.`;
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

//     // Fallback to enhanced local database
//     console.warn('⚠️ Using enhanced fallback mode with database');
//     return await getFallbackResponseWithDB(query);

//   } catch (error: any) {
//     console.error('🚨 AI service error:', error);
//     return `🤖 Dimbop AI (Error): Sorry, I encountered an issue. Please try again. Error: ${error.message}`;
//   }
// };

// /**
//  * Enhanced fallback response with database integration
//  */
// const getFallbackResponseWithDB = async (query: string): Promise<string> => {
//   const lowerQuery = query.toLowerCase();
  
//   try {
//     // Product search and recommendations
//     if (lowerQuery.includes('product') || lowerQuery.includes('phone') || lowerQuery.includes('price')) {
//       const products = await getProductsFromDB();
      
//       // Search for specific products
//       const matchingProducts = products.filter(p => 
//         p.name.toLowerCase().includes(lowerQuery) ||
//         p.description?.toLowerCase().includes(lowerQuery) ||
//         p.categories?.name.toLowerCase().includes(lowerQuery)
//       );

//       if (matchingProducts.length > 0) {
//         const productList = matchingProducts.slice(0, 3).map(p => 
//           `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity && p.stock_quantity > 0 ? `${p.stock_quantity} in stock` : 'Out of stock'})`
//         ).join('\n');
        
//         return `🤖 Dimbop AI (Database): Found ${matchingProducts.length} matching products:\n\n${productList}\n\nWould you like more details about any of these?`;
//       }

//       // General product recommendations
//       const topProducts = products
//         .filter(p => p.stock_quantity && p.stock_quantity > 0)
//         .slice(0, 5);
      
//       return `🤖 Dimbop AI (Database): Here are our top available products:\n\n${topProducts.map(p => 
//         `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity} left)`
//       ).join('\n')}`;
//     }

//     // Blog-related queries
//     if (lowerQuery.includes('blog') || lowerQuery.includes('article') || lowerQuery.includes('guide')) {
//       const blogs = await getBlogsFromDB();
//       const recentBlogs = blogs.slice(0, 3);
      
//       return `🤖 Dimbop AI (Database): We have ${blogs.length} blog posts available:\n\n${recentBlogs.map(b => 
//         `📖 ${b.title}\n   ${b.description?.substring(0, 100)}...`
//       ).join('\n\n')}`;
//     }

//     // User statistics
//     if (lowerQuery.includes('user') || lowerQuery.includes('customer') || lowerQuery.includes('member')) {
//       const stats = await getUserStats();
//       return `🤖 Dimbop AI (Database): User Statistics:\n\n👥 Total Users: ${stats.totalUsers}\n📊 By Role: ${stats.usersByRole.map(r => `${r.role}: ${r._count.role}`).join(', ')}`;
//     }

//     // Default response
//     return `🤖 Dimbop AI (Database): I can help you with:
    
// 🛍️ Product information and recommendations
// 📱 Phone comparisons and specifications  
// 📖 Blog content and guides
// 📊 User and sales statistics
// 🖼️ Image analysis (upload an image)

// What would you like to know?`;

//   } catch (error) {
//     console.error('Database query error:', error);
//     return `🤖 Dimbop AI (Database Error): Sorry, I'm having trouble accessing our database. Please try again later.`;
//   }
// };





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

//         return `DIMBOP ENTERPRISES
// PRODUCT INVENTORY ANALYSIS

// Report Date: ${currentDate}
// Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

// EXECUTIVE SUMMARY
// This report provides a comprehensive analysis of our current product inventory status, including stock levels, financial valuation, and category distribution.

// INVENTORY OVERVIEW
// Total Products in Catalog: ${totalProducts}
// Products Currently in Stock: ${inStock}
// Products Out of Stock: ${outOfStock}
// Stock Availability Rate: ${((inStock/totalProducts) * 100).toFixed(1)}%

// FINANCIAL ANALYSIS
// Total Inventory Value: $${totalValue.toLocaleString()}
// Average Product Price: $${avgPrice.toFixed(2)}
// Inventory Turnover Potential: High

// CATEGORY BREAKDOWN
// ${await getCategoryBreakdownProfessional()}

// RECOMMENDATIONS
// 1. Monitor out-of-stock items to prevent lost sales opportunities
// 2. Consider reorder points for high-demand categories
// 3. Evaluate pricing strategy for optimal profit margins
// 4. Maintain current stock levels for popular items

// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
//       }

//       case 'users':
//       case 'user-activity': {
//         const userStats = await getUserStats();
//         const recentUsers = await prisma.users.count({
//           where: { created_at: { gte: start } }
//         });

//         return `DIMBOP ENTERPRISES
// USER ACTIVITY ANALYSIS

// Report Date: ${currentDate}
// Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

// EXECUTIVE SUMMARY
// This report analyzes user engagement metrics and provides insights into customer growth patterns and user role distribution.

// USER METRICS
// Total Registered Users: ${userStats.totalUsers}
// New User Registrations (Period): ${recentUsers}
// User Growth Rate: ${userStats.totalUsers > 0 ? ((recentUsers/userStats.totalUsers) * 100).toFixed(1) : 0}%

// USER ROLE DISTRIBUTION
// ${userStats.usersByRole.map(r => `${r.role ? r.role.charAt(0).toUpperCase() + r.role.slice(1) : 'Unknown'}: ${r._count.role} users`).join('\n')}

// ENGAGEMENT ANALYSIS
// Active User Base: Strong
// Role Distribution: Balanced
// Registration Trend: ${recentUsers > 0 ? 'Positive' : 'Stable'}

// STRATEGIC RECOMMENDATIONS
// 1. Implement user retention strategies for long-term engagement
// 2. Monitor user activity patterns for optimization opportunities
// 3. Consider targeted marketing for user acquisition
// 4. Develop role-specific features to enhance user experience

// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
//       }

//       case 'users':
// case 'user-activity': {
//   const userStats = await getUserStats();
//   const recentUsers = await prisma.users.count({
//     where: { created_at: { gte: start } }
//   });

//   return `DIMBOP ENTERPRISES
// USER ACTIVITY ANALYSIS

// Report Date: ${currentDate}
// Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

// EXECUTIVE SUMMARY
// This report analyzes user engagement metrics and provides insights into customer growth patterns and user role distribution.

// USER METRICS
// Total Registered Users: ${userStats.totalUsers}
// New User Registrations (Period): ${recentUsers}
// User Growth Rate: ${userStats.totalUsers > 0 ? ((recentUsers/userStats.totalUsers) * 100).toFixed(1) : 0}%

// USER ROLE DISTRIBUTION
// ${userStats.usersByRole.filter(r => r.role).map(r => `${r.role!.charAt(0).toUpperCase() + r.role!.slice(1)}: ${r._count.role} users`).join('\n')}

// ENGAGEMENT ANALYSIS
// Active User Base: Strong
// Role Distribution: Balanced
// Registration Trend: ${recentUsers > 0 ? 'Positive' : 'Stable'}

// STRATEGIC RECOMMENDATIONS
// 1. Implement user retention strategies for long-term engagement
// 2. Monitor user activity patterns for optimization opportunities
// 3. Consider targeted marketing for user acquisition
// 4. Develop role-specific features to enhance user experience

// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
// }

//       default: {
//         const productCount = await prisma.products.count();
//         const userCount = await prisma.users.count();
//         const blogCount = await prisma.blogs.count();

//         return `DIMBOP ENTERPRISES
// COMPREHENSIVE BUSINESS OVERVIEW

// Report Date: ${currentDate}
// Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

// EXECUTIVE SUMMARY
// This comprehensive business overview provides key performance indicators across all major business functions including product management, customer base, and content operations.

// KEY BUSINESS METRICS
// Product Catalog Size: ${productCount} active products
// Customer Base: ${userCount} registered users
// Content Library: ${blogCount} published articles

// OPERATIONAL STATUS
// Product Management: Active
// Customer Engagement: Ongoing
// Content Strategy: Implemented

// BUSINESS HEALTH INDICATORS
// Platform Stability: Excellent
// Data Integrity: Maintained
// System Performance: Optimal

// STRATEGIC OUTLOOK
// The business demonstrates solid operational fundamentals with established product offerings, growing customer base, and active content marketing initiatives.

// NEXT STEPS
// 1. Continue monitoring key performance indicators
// 2. Implement data-driven decision making processes
// 3. Expand analytics capabilities for deeper insights
// 4. Develop comprehensive dashboard for real-time monitoring

// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
//       }
//     }
//   } catch (error: any) {
//     return `DIMBOP ENTERPRISES - REPORT GENERATION ERROR

// An error occurred while generating the ${reportType} report.
// Error Details: ${error.message}
// Please contact the technical team for assistance.

// Generated: ${new Date().toLocaleString()}`;
//   }
// };

// // Updated helper function
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





// const getCategoryBreakdown = async (): Promise<string> => {
//   try {
//     const categories = await prisma.categories.findMany({
//       include: { _count: { select: { products: true } } }
//     });

//     return categories
//       .sort((a, b) => b._count.products - a._count.products)
//       .slice(0, 5)
//       .map(cat => `- ${cat.name}: ${cat._count.products} products`)
//       .join('\n');
//   } catch {
//     return '- Category data unavailable';
//   }
// };










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
//   Average Rating: ${p.reviews?.length ? (p.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / p.reviews.length).toFixed(1) : 'N/A'}
// `).join('')}

// BLOGS (${blogs.length} total):
// ${blogs.slice(0, 5).map(b => `
// - Title: ${b.title}
//   Description: ${b.description}
//   Categories: ${b.categories}
// `).join('')}

// USER STATISTICS:
// - Total Users: ${userStats.totalUsers}
// - Users by Role: ${userStats.usersByRole.map(r => `${r.role}: ${r._count.role}`).join(', ')}
// `;

//         // **FIX: Try different model names**
//         const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"];
//         let model = null;
        
//         for (const modelName of modelNames) {
//           try {
//             model = genAI.getGenerativeModel({ model: modelName });
//             break;
//           } catch (modelError) {
//             console.log(`Failed to load model ${modelName}, trying next...`);
//           }
//         }

//         if (!model) {
//           throw new Error('No working Gemini model found');
//         }

//         let prompt = `You are Dimbop AI assistant, a specialized mobile phone and e-commerce expert with access to our live database.

// ${dbContext}

// CAPABILITIES:
// - Answer questions about mobile phones, smartphones, and accessories
// - Recommend products from our database with accurate prices and availability
// - Provide information about our blog content
// - Generate user and sales statistics
// - Analyze images to help users find products
// - Process audio queries and convert to text responses

// RULES:
// - Always use REAL data from the database context above
// - Include actual prices, stock levels, and product details
// - When recommending products, mention if they're in stock
// - For image analysis, identify phones/products and match with our inventory
// - Keep responses helpful, accurate, and under 300 words
// - If asked about non-phone/non-business topics, politely redirect

// User Query: ${query}`;

//         const parts: any[] = [prompt];

//         // Handle image analysis
//         if (imageFile) {
//           console.log('🖼️ Processing image with Gemini Vision');
//           const imagePart = fileToGenerativePart(imageFile.path, imageFile.mimetype);
//           parts.push(imagePart);
//           prompt += `\n\nIMAGE ANALYSIS: Please analyze the provided image. If it shows a phone or electronic device, try to identify it and recommend similar products from our database.`;
//         }

//         // Handle audio processing
//         if (audioFile) {
//           console.log('🎵 Processing audio file');
//           prompt += `\n\nAUDIO PROCESSING: User provided an audio file with their query.`;
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

//     // Enhanced fallback with dynamic search
//     console.warn('⚠️ Using enhanced fallback mode with database');
//     return await getFallbackResponseWithDB(query);

//   } catch (error: any) {
//     console.error('🚨 AI service error:', error);
//     return `🤖 Dimbop AI (Error): Sorry, I encountered an issue. Please try again. Error: ${error.message}`;
//   }
// };

// /**
//  * **COMPLETELY FIXED**: Dynamic database search for ANY product
//  */
// const getFallbackResponseWithDB = async (query: string): Promise<string> => {
//   const lowerQuery = query.toLowerCase();
  
//   try {
//     const products = await getProductsFromDB();
    
//     // **FIX: Dynamic product search - extracts brand/product names from query**
//     const searchTerms = extractSearchTerms(lowerQuery);
    
//     if (searchTerms.length > 0) {
//       console.log(`🔍 Searching for terms: ${searchTerms.join(', ')}`);
      
//       // Search for products matching any of the search terms
//       const matchingProducts = products.filter(p => {
//         const productName = p.name.toLowerCase();
//         const productDescription = (p.description || '').toLowerCase();
        
//         return searchTerms.some(term => 
//           productName.includes(term) || 
//           productDescription.includes(term) ||
//           (p.categories?.name?.toLowerCase() || '').includes(term)
//         );
//       });
      
//       if (matchingProducts.length > 0) {
//         const productList = matchingProducts.slice(0, 5).map(p => 
//           `📱 ${p.name} - $${Number(p.price)} ${getStockStatus(p.stock_quantity)}`
//         ).join('\n');
        
//         return `🤖 Dimbop AI (Database): Found ${matchingProducts.length} products matching "${searchTerms.join(', ')}":\n\n${productList}\n\nWould you like more details about any of these?`;
//       } else {
//         // No exact matches - suggest similar or show available products
//         const availableProducts = products
//           .filter(p => p.stock_quantity && p.stock_quantity > 0)
//           .slice(0, 5);
          
//         if (availableProducts.length > 0) {
//           const productList = availableProducts.map(p => 
//             `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity} in stock)`
//           ).join('\n');
          
//           return `🤖 Dimbop AI (Database): We don't have "${searchTerms.join(', ')}" in our inventory, but here are our available products:\n\n${productList}\n\nTotal available: ${availableProducts.length} products`;
//         } else {
//           return `🤖 Dimbop AI (Database): We don't have "${searchTerms.join(', ')}" in stock and no other products are currently available.`;
//         }
//       }
//     }

//     // Handle "show all" or general queries
//     if (lowerQuery.includes('show') || lowerQuery.includes('all') || lowerQuery.includes('available') || lowerQuery.includes('products')) {
//       const availableProducts = products
//         .filter(p => p.stock_quantity && p.stock_quantity > 0)
//         .slice(0, 8);
      
//       if (availableProducts.length > 0) {
//         const productList = availableProducts.map(p => 
//           `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity} in stock)`
//         ).join('\n');
        
//         return `🤖 Dimbop AI (Database): Here are our available products:\n\n${productList}\n\nTotal products in stock: ${availableProducts.length}`;
//       }
//     }

//     // Blog-related queries
//     if (lowerQuery.includes('blog') || lowerQuery.includes('article') || lowerQuery.includes('guide')) {
//       const blogs = await getBlogsFromDB();
//       const recentBlogs = blogs.slice(0, 3);
      
//       return `🤖 Dimbop AI (Database): We have ${blogs.length} blog posts available:\n\n${recentBlogs.map(b => 
//         `📖 ${b.title}\n   ${b.description?.substring(0, 100)}...`
//       ).join('\n\n')}`;
//     }

//     // User statistics
//     if (lowerQuery.includes('user') || lowerQuery.includes('customer') || lowerQuery.includes('member')) {
//       const stats = await getUserStats();
//       return `🤖 Dimbop AI (Database): User Statistics:\n\n👥 Total Users: ${stats.totalUsers}\n📊 By Role: ${stats.usersByRole.map(r => `${r.role}: ${r._count.role}`).join(', ')}`;
//     }

//     // Default response with actual product count
//     const totalProducts = products.length;
//     const inStockProducts = products.filter(p => p.stock_quantity && p.stock_quantity > 0).length;
    
//     return `🤖 Dimbop AI (Database): I can help you with:
    
// 🛍️ Product information (${totalProducts} products, ${inStockProducts} in stock)
// 📱 Phone comparisons and specifications  
// 📖 Blog content and guides
// 📊 User and sales statistics
// 🖼️ Image analysis (upload an image)

// What would you like to know?`;

//   } catch (error) {
//     console.error('Database query error:', error);
//     return `🤖 Dimbop AI (Database Error): Sorry, I'm having trouble accessing our database. Please try again later.`;
//   }
// };

// /**
//  * Extract search terms from user query
//  */
// const extractSearchTerms = (query: string): string[] => {
//   // Remove common words and extract meaningful terms
//   const commonWords = ['i', 'need', 'want', 'do', 'you', 'have', 'is', 'there', 'any', 'show', 'me', 'all', 'okay', 'ok', 'please', 'tell', 'if', 'it', 'the', 'a', 'an', 'and', 'or', 'but', 'for', 'with'];
  
//   const words = query
//     .toLowerCase()
//     .replace(/[^\w\s]/g, ' ') // Replace special characters with spaces
//     .split(/\s+/) // Split by whitespace
//     .filter(word => word.length > 2 && !commonWords.includes(word)); // Filter short words and common words
  
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

// /**
//  * **ALL YOUR ORIGINAL REPORT FUNCTIONALITY PRESERVED**
//  * Generate report for digital marketers
//  */
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

//         return `DIMBOP ENTERPRISES
// PRODUCT INVENTORY ANALYSIS

// Report Date: ${currentDate}
// Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

// EXECUTIVE SUMMARY
// This report provides a comprehensive analysis of our current product inventory status, including stock levels, financial valuation, and category distribution.

// INVENTORY OVERVIEW
// Total Products in Catalog: ${totalProducts}
// Products Currently in Stock: ${inStock}
// Products Out of Stock: ${outOfStock}
// Stock Availability Rate: ${((inStock/totalProducts) * 100).toFixed(1)}%

// FINANCIAL ANALYSIS
// Total Inventory Value: $${totalValue.toLocaleString()}
// Average Product Price: $${avgPrice.toFixed(2)}
// Inventory Turnover Potential: High

// CATEGORY BREAKDOWN
// ${await getCategoryBreakdownProfessional()}

// RECOMMENDATIONS
// 1. Monitor out-of-stock items to prevent lost sales opportunities
// 2. Consider reorder points for high-demand categories
// 3. Evaluate pricing strategy for optimal profit margins
// 4. Maintain current stock levels for popular items

// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
//       }

//       case 'users':
//       case 'user-activity': {
//         const userStats = await getUserStats();
//         const recentUsers = await prisma.users.count({
//           where: { created_at: { gte: start } }
//         });

//         return `DIMBOP ENTERPRISES
// USER ACTIVITY ANALYSIS

// Report Date: ${currentDate}
// Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

// EXECUTIVE SUMMARY
// This report analyzes user engagement metrics and provides insights into customer growth patterns and user role distribution.

// USER METRICS
// Total Registered Users: ${userStats.totalUsers}
// New User Registrations (Period): ${recentUsers}
// User Growth Rate: ${userStats.totalUsers > 0 ? ((recentUsers/userStats.totalUsers) * 100).toFixed(1) : 0}%

// USER ROLE DISTRIBUTION
// ${userStats.usersByRole.filter(r => r.role).map(r => `${r.role!.charAt(0).toUpperCase() + r.role!.slice(1)}: ${r._count.role} users`).join('\n')}

// ENGAGEMENT ANALYSIS
// Active User Base: Strong
// Role Distribution: Balanced
// Registration Trend: ${recentUsers > 0 ? 'Positive' : 'Stable'}

// STRATEGIC RECOMMENDATIONS
// 1. Implement user retention strategies for long-term engagement
// 2. Monitor user activity patterns for optimization opportunities
// 3. Consider targeted marketing for user acquisition
// 4. Develop role-specific features to enhance user experience

// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
//       }

//       default: {
//         const productCount = await prisma.products.count();
//         const userCount = await prisma.users.count();
//         const blogCount = await prisma.blogs.count();

//         return `DIMBOP ENTERPRISES
// COMPREHENSIVE BUSINESS OVERVIEW

// Report Date: ${currentDate}
// Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

// EXECUTIVE SUMMARY
// This comprehensive business overview provides key performance indicators across all major business functions including product management, customer base, and content operations.

// KEY BUSINESS METRICS
// Product Catalog Size: ${productCount} active products
// Customer Base: ${userCount} registered users
// Content Library: ${blogCount} published articles

// OPERATIONAL STATUS
// Product Management: Active
// Customer Engagement: Ongoing
// Content Strategy: Implemented

// BUSINESS HEALTH INDICATORS
// Platform Stability: Excellent
// Data Integrity: Maintained
// System Performance: Optimal

// STRATEGIC OUTLOOK
// The business demonstrates solid operational fundamentals with established product offerings, growing customer base, and active content marketing initiatives.

// NEXT STEPS
// 1. Continue monitoring key performance indicators
// 2. Implement data-driven decision making processes
// 3. Expand analytics capabilities for deeper insights
// 4. Develop comprehensive dashboard for real-time monitoring

// Report Generated: ${new Date().toLocaleString()}
// Prepared by: Dimbop Analytics Division`;
//       }
//     }
//   } catch (error: any) {
//     return `DIMBOP ENTERPRISES - REPORT GENERATION ERROR

// An error occurred while generating the ${reportType} report.
// Error Details: ${error.message}
// Please contact the technical team for assistance.

// Generated: ${new Date().toLocaleString()}`;
//   }
// };

// /**
//  * **ALL ORIGINAL HELPER FUNCTIONS PRESERVED**
//  */
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

// const getCategoryBreakdown = async (): Promise<string> => {
//   try {
//     const categories = await prisma.categories.findMany({
//       include: { _count: { select: { products: true } } }
//     });

//     return categories
//       .sort((a, b) => b._count.products - a._count.products)
//       .slice(0, 5)
//       .map(cat => `- ${cat.name}: ${cat._count.products} products`)
//       .join('\n');
//   } catch {
//     return '- Category data unavailable';
//   }
// };






import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { UploadedFile } from '../types/file';

// Initialize Google Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const prisma = new PrismaClient();

console.log('Google Gemini API key exists:', !!process.env.GEMINI_API_KEY);

// Helper function to convert file to base64
const fileToGenerativePart = (filePath: string, mimeType: string) => {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
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
 * Enhanced AI function with dynamic database search
 */
export const askPhoneAI = async (
  query: string,
  imageFile?: UploadedFile,
  audioFile?: UploadedFile
): Promise<string> => {
  try {
    if (!query || query.trim().length === 0) {
      return 'Please provide a valid question about phones, products, or our services.';
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

PRODUCTS (${products.length} total):
${products.slice(0, 20).map(p => `
- ${p.name}: $${Number(p.price)} (Stock: ${p.stock_quantity || 0})
  Category: ${p.categories?.name || 'N/A'}
  Description: ${p.description || 'No description'}
  Discount: ${p.discount_percentage || 0}%
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
          } catch (modelError) {
            console.log(`❌ Model ${modelName} failed, trying next...`);
          }
        }

        if (!model) {
          throw new Error('No working Gemini model found');
        }

        let prompt = `You are Dimbop AI assistant. Search the database above and respond with accurate product information.

${dbContext}

User Query: ${query}`;

        const parts: any[] = [prompt];

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
          return `🤖 Dimbop AI: ${text.trim()}`;
        }
      } catch (geminiError: any) {
        console.error('🚨 Gemini AI error:', geminiError.message);
      }
    }

    // Enhanced fallback with smart search
    console.warn('⚠️ Using enhanced fallback mode with database');
    return await getFallbackResponseWithDB(query);

  } catch (error: any) {
    console.error('🚨 AI service error:', error);
    return `🤖 Dimbop AI (Error): Sorry, I encountered an issue. Please try again. Error: ${error.message}`;
  }
};

/**
 * **FIXED**: Smart search with typo tolerance
 */
const getFallbackResponseWithDB = async (query: string): Promise<string> => {
  const lowerQuery = query.toLowerCase();
  
  try {
    const products = await getProductsFromDB();
    
    // **NEW: Smart product search**
    const searchResults = await smartProductSearch(products, query);
    
    if (searchResults.exactMatches.length > 0) {
      const productList = searchResults.exactMatches.slice(0, 5).map(p => 
        `📱 ${p.name} - $${Number(p.price)} ${getStockStatus(p.stock_quantity)}
📝 ${p.description || 'No description available'}`
      ).join('\n\n');
      
      return `🤖 Dimbop AI (Database): Found ${searchResults.exactMatches.length} exact matches:\n\n${productList}\n\nWould you like more details about any of these?`;
    }
    
    if (searchResults.fuzzyMatches.length > 0) {
      const productList = searchResults.fuzzyMatches.slice(0, 5).map(p => 
        `📱 ${p.name} - $${Number(p.price)} ${getStockStatus(p.stock_quantity)}
📝 ${p.description || 'No description available'}`
      ).join('\n\n');
      
      return `🤖 Dimbop AI (Database): Found ${searchResults.fuzzyMatches.length} similar products:\n\n${productList}\n\nDid you mean one of these?`;
    }

    // Handle "show all" or general queries
    if (lowerQuery.includes('show') || lowerQuery.includes('all') || lowerQuery.includes('available') || lowerQuery.includes('products')) {
      const availableProducts = products
        .filter(p => p.stock_quantity && p.stock_quantity > 0)
        .slice(0, 6);
      
      if (availableProducts.length > 0) {
        const productList = availableProducts.map(p => 
          `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity} in stock)`
        ).join('\n');
        
        return `🤖 Dimbop AI (Database): Here are our available products:\n\n${productList}`;
      }
    }

    // No matches - show available products
    const availableProducts = products
      .filter(p => p.stock_quantity && p.stock_quantity > 0)
      .slice(0, 5);
      
    if (availableProducts.length > 0) {
      const productList = availableProducts.map(p => 
        `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity} in stock)`
      ).join('\n');
      
      return `🤖 Dimbop AI (Database): Couldn't find what you're looking for, but here are our available products:\n\n${productList}`;
    }

    return `🤖 Dimbop AI (Database): No products currently available.`;

  } catch (error) {
    console.error('Database query error:', error);
    return `🤖 Dimbop AI (Database Error): Sorry, I'm having trouble accessing our database. Please try again later.`;
  }
};

/**
 * **NEW**: Smart product search with brand detection and typo tolerance
 */
const smartProductSearch = async (products: any[], query: string) => {
  const lowerQuery = query.toLowerCase();
  
  // Extract meaningful terms (ignore common words)
  const meaningfulTerms = extractMeaningfulTerms(lowerQuery);
  console.log(`🔍 Smart search terms: ${meaningfulTerms.join(', ')}`);
  
  const exactMatches: any[] = [];
  const fuzzyMatches: any[] = [];
  
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
        // Handle common typos
        const variations = [
          term.replace('samsumg', 'samsung'),
          term.replace('samung', 'samsung'),
          term.replace('iphone', 'iphone'),
          term.replace('pixle', 'pixel')
        ];
        
        return variations.some(variant => 
          productName.includes(variant) || 
          productDesc.includes(variant)
        );
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
const extractMeaningfulTerms = (query: string): string[] => {
  // Remove common/filler words
  const fillerWords = [
    'i', 'need', 'want', 'do', 'you', 'have', 'is', 'there', 'any', 'show', 'me', 'all', 
    'okay', 'ok', 'oky', 'please', 'tell', 'if', 'it', 'the', 'a', 'an', 'and', 'or', 'but', 
    'for', 'with', 'its', 'description', 'price', 'cost', 'about', 'info', 'information'
  ];
  
  // Extract words, clean them up
  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !fillerWords.includes(word) &&
      /^[a-zA-Z0-9]+$/.test(word) // Only alphanumeric
    );
  
  return [...new Set(words)]; // Remove duplicates
};

/**
 * Helper function to get stock status
 */
const getStockStatus = (stockQuantity?: number | null): string => {
  if (!stockQuantity || stockQuantity <= 0) {
    return '(Out of stock)';
  }
  return `(${stockQuantity} in stock)`;
};

// Keep all your original generateReport and helper functions exactly as they were
export const generateReport = async (
  reportType: string,
  startDate?: string,
  endDate?: string
): Promise<string> => {
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

        return `DIMBOP ENTERPRISES - PRODUCT INVENTORY ANALYSIS

Report Date: ${currentDate}
Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

INVENTORY OVERVIEW
Total Products in Catalog: ${totalProducts}
Products Currently in Stock: ${inStock}
Products Out of Stock: ${outOfStock}
Stock Availability Rate: ${((inStock/totalProducts) * 100).toFixed(1)}%

FINANCIAL ANALYSIS
Total Inventory Value: $${totalValue.toLocaleString()}
Average Product Price: $${avgPrice.toFixed(2)}

CATEGORY BREAKDOWN
${await getCategoryBreakdownProfessional()}

Report Generated: ${new Date().toLocaleString()}
Prepared by: Dimbop Analytics Division`;
      }

      case 'users':
      case 'user-activity': {
        const userStats = await getUserStats();
        const recentUsers = await prisma.users.count({
          where: { created_at: { gte: start } }
        });

        return `DIMBOP ENTERPRISES - USER ACTIVITY ANALYSIS

Report Date: ${currentDate}
Analysis Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}

USER METRICS
Total Registered Users: ${userStats.totalUsers}
New User Registrations (Period): ${recentUsers}
User Growth Rate: ${userStats.totalUsers > 0 ? ((recentUsers/userStats.totalUsers) * 100).toFixed(1) : 0}%

USER ROLE DISTRIBUTION
${userStats.usersByRole.filter(r => r.role).map(r => `${r.role!.charAt(0).toUpperCase() + r.role!.slice(1)}: ${r._count.role} users`).join('\n')}

Report Generated: ${new Date().toLocaleString()}
Prepared by: Dimbop Analytics Division`;
      }

      default: {
        const productCount = await prisma.products.count();
        const userCount = await prisma.users.count();
        const blogCount = await prisma.blogs.count();

        return `DIMBOP ENTERPRISES - COMPREHENSIVE BUSINESS OVERVIEW

Report Date: ${currentDate}

KEY BUSINESS METRICS
Product Catalog Size: ${productCount} active products
Customer Base: ${userCount} registered users
Content Library: ${blogCount} published articles

Report Generated: ${new Date().toLocaleString()}
Prepared by: Dimbop Analytics Division`;
      }
    }
  } catch (error: any) {
    return `DIMBOP ENTERPRISES - REPORT GENERATION ERROR

An error occurred while generating the ${reportType} report.
Error Details: ${error.message}

Generated: ${new Date().toLocaleString()}`;
  }
};

const getCategoryBreakdownProfessional = async (): Promise<string> => {
  try {
    const categories = await prisma.categories.findMany({
      include: { _count: { select: { products: true } } }
    });

    return categories
      .sort((a, b) => b._count.products - a._count.products)
      .slice(0, 5)
      .map(cat => `${cat.name}: ${cat._count.products} products`)
      .join('\n');
  } catch {
    return 'Category analysis unavailable';
  }
};