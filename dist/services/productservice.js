"use strict";
// import { PrismaClient, Prisma } from "@prisma/client";
// import { productSchema } from "../models/products";
// import { z } from "zod";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductViewService = exports.ReviewCommentService = exports.ReviewLikeService = exports.ReviewService = exports.getAllProductImages = exports.deleteProduct = exports.updateProduct = exports.clearUserCart = exports.getUserCart = exports.deleteCartItem = exports.updateCartItemQuantity = exports.addProductToCart = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
// const prisma = new PrismaClient();
// export const getAllProducts = async () => {
//   return await prisma.products.findMany({
//     include: {
//       categories: true,
//       reviews: true,
//       cart: true,
//       order_items: true,
//     },
//   });
// };
// export const getProductById = async (id: number) => {
//   return await prisma.products.findUnique({
//     where: { id },
//     include: {
//       categories: true,
//       reviews: true,
//       cart: true,
//       order_items: true,
//     },
//   });
// };
// export const createProduct = async (
//   data: z.infer<typeof productSchema>,
//   file?: { filename: string }
// ) => {
//   const validatedData = productSchema.parse(data);
//   const createData: Prisma.productsCreateInput = {
//     name: validatedData.name,
//     description: validatedData.description ?? null,
//     price: validatedData.price,
//     image_url: file ? `/Uploads/${file.filename}` : null,
//     stock_quantity: validatedData.stock_quantity ?? 0,
//     discount_percentage: validatedData.discount_percentage ?? 0,
//     views: validatedData.views ?? 0,
//     created_at: validatedData.created_at ?? new Date(),
//     updated_at: validatedData.updated_at ?? new Date(),
//   };
//   if (validatedData.category_name) {
//     createData.categories = {
//       connectOrCreate: {
//         where: { name: validatedData.category_name },
//         create: { name: validatedData.category_name },
//       },
//     };
//   }
//   if (validatedData.reviews && validatedData.reviews.length > 0) {
//     createData.reviews = {
//       create: validatedData.reviews.map((item) => ({
//         user_id: item.user_id ?? null,
//         rating: item.rating ?? null,
//         comment: item.comment ?? "",
//         created_at: item.created_at ?? new Date(),
//       })),
//     };
//   }
//   if (validatedData.order_items && validatedData.order_items.length > 0) {
//     createData.order_items = {
//       create: validatedData.order_items.map((item) => ({
//         order_id: item.order_id,
//         quantity: item.quantity,
//         price: validatedData.price,
//       })),
//     };
//   }
//   return await prisma.products.create({
//     data: createData,
//     include: {
//       categories: true,
//       reviews: true,
//       cart: true,
//       order_items: true,
//     },
//   });
// };
// export const addProductToCart = async (userId: number, productId: number, quantity: number) => {
//   const product = await prisma.products.findUnique({
//     where: { id: productId }
//   });
//   if (!product) {
//     throw new Error('Product not found');
//   }
//   const originalStock = product.stock_quantity ?? 0;
//   // Check if there's enough stock
//   if (originalStock < quantity) {
//     throw new Error(`Insufficient stock. Only ${originalStock} items available.`);
//   }
//   const existingCartItem = await prisma.cart.findFirst({
//     where: {
//        product_id: productId,
//        user_id: userId 
//     }
//   });
//   const productPrice = new Prisma.Decimal(product.price);
//   if (existingCartItem) {
//     // Check if adding this quantity would exceed available stock
//     const totalRequestedQuantity = existingCartItem.quantity + quantity;
//     if (originalStock < totalRequestedQuantity) {
//       throw new Error(`Insufficient stock. Only ${originalStock} items available, you already have ${existingCartItem.quantity} in cart.`);
//     }
//     // Update existing cart item AND decrease stock
//     const [updatedCartItem] = await prisma.$transaction([
//       prisma.cart.update({
//         where: { id: existingCartItem.id },
//         data: {
//           quantity: existingCartItem.quantity + quantity,
//           price: productPrice.mul(existingCartItem.quantity + quantity),
//           updated_at: new Date()
//         },
//         include: { products: true }
//       }),
//       prisma.products.update({
//         where: { id: productId },
//         data: {
//           stock_quantity: { decrement: quantity },
//           updated_at: new Date()
//         }
//       })
//     ]);
//     return updatedCartItem;
//   } else {
//     // Create new cart item AND decrease stock
//     const [newCartItem] = await prisma.$transaction([
//       prisma.cart.create({
//         data: {
//           user_id: userId,
//           product_id: productId,
//           quantity,
//           price: productPrice.mul(quantity),
//           created_at: new Date(),
//           updated_at: new Date()
//         },
//         include: { products: true }
//       }),
//       prisma.products.update({
//         where: { id: productId },
//         data: {
//           stock_quantity: { decrement: quantity },
//           updated_at: new Date()
//         }
//       })
//     ]);
//     return newCartItem;
//   }
// };
// export const updateCartItemQuantity = async (
//   cartItemId: number,
//   userId: number,
//   newQuantity: number
// ) => {
//   // Delete the item if quantity is zero or less
//   if (newQuantity <= 0) {
//     return await deleteCartItem(cartItemId, userId, true); // Restore stock when deleting
//   }
//   // Get cart item with product info
//   const cartItem = await prisma.cart.findFirst({
//     where: {
//       id: cartItemId,
//       user_id: userId
//     },
//     include: {
//       products: {
//         select: {
//           id: true,
//           price: true,
//           stock_quantity: true
//         }
//       }
//     }
//   });
//   if (!cartItem || !cartItem.products) {
//     throw new Error('Cart item not found');
//   }
//   const product = cartItem.products;
//   const currentQuantity = cartItem.quantity;
//   const quantityDifference = newQuantity - currentQuantity;
//   // If increasing quantity, check stock availability
//   if (quantityDifference > 0) {
//     if ((product.stock_quantity ?? 0) < quantityDifference) {
//       throw new Error(`Insufficient stock. Only ${product.stock_quantity} items available.`);
//     }
//   }
//   // Update cart item and adjust stock using transaction
//   const productPrice = new Prisma.Decimal(product.price);
//   const [updatedCartItem] = await prisma.$transaction([
//     prisma.cart.update({
//       where: { id: cartItemId },
//       data: {
//         quantity: newQuantity,
//         price: productPrice.mul(newQuantity),
//         updated_at: new Date()
//       },
//       include: { products: true }
//     }),
//     prisma.products.update({
//       where: { id: product.id },
//       data: {
//         stock_quantity: { decrement: quantityDifference }, // This will add back if negative ...
//         updated_at: new Date()
//       }
//     })
//   ]);
//   return updatedCartItem;
// };
// export const deleteCartItem = async (
//   cartItemId: number, 
//   userId: number,
//   restoreStock: boolean = true // Add parameter to control stock restoration
// ) => {
//   const cartItem = await prisma.cart.findFirst({
//     where: {
//       id: cartItemId,
//       user_id: userId
//     },
//     include: {
//       products: {
//         select: {
//           id: true,
//           stock_quantity: true
//         }
//       }
//     }
//   });
//   if (!cartItem) {
//     throw new Error('Cart item not found or does not belong to user');
//   }
//   // Use transaction to delete cart item and restore stock
//   if (restoreStock && cartItem.products) {
//     await prisma.$transaction([
//       prisma.cart.delete({
//         where: { id: cartItemId }
//       }),
//       prisma.products.update({
//         where: { id: cartItem.products.id },
//         data: {
//           stock_quantity: {
//             increment: cartItem.quantity
//           },
//           updated_at: new Date()
//         }
//       })
//     ]);
//   } else {
//     await prisma.cart.delete({
//       where: { id: cartItemId }
//     });
//   }
//   return cartItem;
// };
// // Get user's cart
// export const getUserCart = async (userId: number) => {
//   const cartItems = await prisma.cart.findMany({
//     where: { user_id: userId },
//     include: {
//       products: {
//         include: {
//           categories: true
//         }
//       }
//     }
//   });
//   // Convert all prices to Decimal for safe calculations
//   const subtotal = cartItems.reduce((sum, item) => {
//     return sum.add(new Prisma.Decimal(item.price || 0));
//   }, new Prisma.Decimal(0));
//   const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
//   // Calculate discounts using Decimal
//   const totalDiscount = cartItems.reduce((sum, item) => {
//     const discount = item.products?.discount_percentage || 0;
//     const itemPrice = new Prisma.Decimal(item.price || 0);
//     return sum.add(itemPrice.mul(discount).div(100));
//   }, new Prisma.Decimal(0));
//   return {
//     items: cartItems,
//     subtotal: subtotal.toNumber(),
//     totalItems,
//     totalDiscount: totalDiscount.toNumber(),
//     grandTotal: subtotal.minus(totalDiscount).toNumber()
//   };
// };
// // Clear user's cart
// export const clearUserCart = async (userId: number) => {
//   return await prisma.cart.deleteMany({
//     where: { user_id: userId }
//   });
// };
// // Update product
// export const updateProduct = async (id: number, data: Partial<z.infer<typeof productSchema>>) => {
//   const validatedData = productSchema.partial().parse(data);
//   const updateData: Prisma.productsUpdateInput = {
//     updated_at: new Date(),
//   };
//   if (validatedData.name !== undefined) updateData.name = validatedData.name;
//   if (validatedData.description !== undefined) updateData.description = validatedData.description;
//   if (validatedData.price !== undefined) updateData.price = validatedData.price;
//   if (validatedData.stock_quantity !== undefined) updateData.stock_quantity = validatedData.stock_quantity;
//   if (validatedData.image_url !== undefined) updateData.image_url = validatedData.image_url;
//   if (validatedData.discount_percentage !== undefined) updateData.discount_percentage = validatedData.discount_percentage;
//   if (validatedData.views !== undefined) updateData.views = validatedData.views;
//   if (validatedData.category_name !== undefined) {
//     updateData.categories = validatedData.category_name
//       ? {
//           connectOrCreate: {
//             where: { name: validatedData.category_name },
//             create: { name: validatedData.category_name },
//           },
//         }
//       : { disconnect: true };
//   }
//   return await prisma.products.update({
//     where: { id },
//     data: updateData,
//   });
// };
// // Delete product
// export const deleteProduct = async (id: number) => {
//   return await prisma.products.delete({
//     where: { id },
//   });
// };
// export const getAllProductImages = async () => {
//   const products = await prisma.products.findMany({
//     where: {
//       image_url: {
//         not: null, // Only include products with an image_url
//       },
//     },
//     select: {
//       image_url: true, // Only fetch the image_url field
//     },
//   });
//   return products.map((product) => product.image_url); // Return an array of image URLs
// };
// export class ReviewService {
//   static async addReview(
//     productId: number,
//     data: { user_id?: number; rating: number; comment: string; username?: string }
//   ) {
//     return await prisma.reviews.create({
//       data: {
//         product_id: productId,
//         user_id: data.user_id ?? null,
//         rating: data.rating,
//         username: data.username || "Anonymous",
//         comment: data.comment,
//         created_at: new Date(),
//       },
//     });
//   }
//   static async getProductReviews(productId: number) {
//     const reviews = await prisma.reviews.findMany({
//       where: { product_id: productId },
//       include: {
//         users: {
//           select: {
//             id: true,
//             username: true,
//             email: true
//           }
//         },
//         review_likes: {
//           include: {
//             users: {
//               select: { id: true, username: true }
//             }
//           }
//         },
//         review_comments: {
//           include: {
//             users: {
//               select: { id: true, username: true }
//             }
//           },
//           orderBy: { created_at: "desc" }
//         }
//       },
//       orderBy: { created_at: "desc" },
//     });
//     return reviews.map(review => ({
//       ...review,
//       username: review.username || review.users?.username || "Anonymous",
//       likes_count: review.review_likes.filter(like => like.is_like === true).length,
//       dislikes_count: review.review_likes.filter(like => like.is_like === false).length,
//       comments_count: review.review_comments.length
//     }));
//   }
//   static async deleteReview(reviewId: number, userId?: number) {
//     const review = await prisma.reviews.findUnique({
//       where: { id: reviewId }
//     });
//     if (!review || (userId && review.user_id !== userId)) {
//       throw new Error("Not authorized to delete this review");
//     }
//     return await prisma.reviews.delete({
//       where: { id: reviewId }
//     });
//   }
// }
// export class ReviewLikeService {
//   static async toggleReviewLike(
//     reviewId: number,
//     userId: number,
//     isLike: boolean
//   ) {
//     const existing = await prisma.review_likes.findUnique({
//       where: {
//         review_id_user_id: {
//           review_id: reviewId,
//           user_id: userId
//         }
//       }
//     });
//     if (existing) {
//       if (existing.is_like === isLike) {
//         return await prisma.review_likes.delete({
//           where: { id: existing.id }
//         });
//       } else {
//         return await prisma.review_likes.update({
//           where: { id: existing.id },
//           data: { is_like: isLike }
//         });
//       }
//     } else {
//       return await prisma.review_likes.create({
//         data: {
//           review_id: reviewId,
//           user_id: userId,
//           is_like: isLike
//         }
//       });
//     }
//   }
//   static async getReviewLikeStatus(reviewId: number, userId: number) {
//     const like = await prisma.review_likes.findUnique({
//       where: {
//         review_id_user_id: {
//           review_id: reviewId,
//           user_id: userId
//         }
//       }
//     });
//     return like ? like.is_like : null;
//   }
// }
// export class ReviewCommentService {
//   static async addReviewComment(
//     reviewId: number,
//     data: { user_id?: number; comment: string; username?: string }
//   ) {
//     return await prisma.review_comments.create({
//       data: {
//         review_id: reviewId,
//         user_id: data.user_id ?? null,
//         comment: data.comment,
//         username: data.username || "Anonymous",
//         created_at: new Date(),
//       },
//       include: {
//         users: {
//           select: { id: true, username: true }
//         }
//       }
//     });
//   }
//   static async getReviewComments(reviewId: number) {
//     const comments = await prisma.review_comments.findMany({
//       where: { review_id: reviewId },
//       include: {
//         users: {
//           select: { id: true, username: true }
//         }
//       },
//       orderBy: { created_at: "desc" }
//     });
//     return comments.map(comment => ({
//       ...comment,
//       username: comment.username || comment.users?.username || "Anonymous"
//     }));
//   }
//   static async deleteReviewComment(commentId: number, userId?: number) {
//     const comment = await prisma.review_comments.findUnique({
//       where: { id: commentId }
//     });
//     if (!comment || (userId && comment.user_id !== userId)) {
//       throw new Error("Not authorized to delete this comment");
//     }
//     return await prisma.review_comments.delete({
//       where: { id: commentId }
//     });
//   }
// }
// export class ProductViewService {
//   static async trackProductView(
//     productId: number,
//     data: { 
//       user_id?: number; 
//       ip_address?: string; 
//       user_agent?: string;
//       username?: string;
//     }
//   ) {
//     try {
//       const orConditions: any[] = [];
//       if (data.user_id !== undefined) {
//         orConditions.push({ user_id: data.user_id });
//       }
//       if (data.ip_address !== undefined) {
//         orConditions.push({ ip_address: data.ip_address });
//       }
//       const existingView = await prisma.product_views.findFirst({
//         where: {
//           product_id: productId,
//           ...(orConditions.length > 0 && { OR: orConditions }),
//           viewed_at: {
//             gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
//           }
//         }
//       });
//       if (!existingView) {
//         return await prisma.product_views.create({
//           data: {
//             product_id: productId,
//             user_id: data.user_id ?? null,
//             ip_address: data.ip_address ?? null,
//             user_agent: data.user_agent ?? null,
//             username: data.username || "Anonymous",
//             viewed_at: new Date(),
//           },
//         });
//       }
//       return null;
//     } catch (error) {
//       console.log('View already tracked:', error);
//       return null;
//     }
//   }
//   static async getProductViewCount(productId: number) {
//     const totalViews = await prisma.product_views.count({
//       where: { product_id: productId }
//     });
//     const uniqueUsers = await prisma.product_views.groupBy({
//       by: ['user_id'],
//       where: { 
//         product_id: productId,
//         user_id: { not: null }
//       }
//     });
//     const todayViews = await prisma.product_views.count({
//       where: {
//         product_id: productId,
//         viewed_at: {
//           gte: new Date(new Date().setHours(0, 0, 0, 0))
//         }
//       }
//     });
//     const weekViews = await prisma.product_views.count({
//       where: {
//         product_id: productId,
//         viewed_at: {
//           gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
//         }
//       }
//     });
//     return {
//       total_views: totalViews,
//       unique_users: uniqueUsers.length,
//       today_views: todayViews,
//       week_views: weekViews
//     };
//   }
//   static async getProductWithViews(productId: number) {
//     return await prisma.products.findUnique({
//       where: { id: productId },
//       include: {
//         product_views: {
//           select: {
//             id: true,
//             viewed_at: true,
//             users: {
//               select: {
//                 id: true,
//                 username: true
//               }
//             }
//           },
//           orderBy: { viewed_at: 'desc' },
//           take: 10
//         },
//         _count: {
//           select: {
//             product_views: true,
//             reviews: true
//           }
//         }
//       }
//     });
//   }
//   static async getMostViewedProducts(limit: number = 10) {
//     return await prisma.products.findMany({
//       include: {
//         _count: {
//           select: {
//             product_views: true,
//             reviews: true
//           }
//         }
//       },
//       orderBy: {
//         product_views: {
//           _count: 'desc'
//         }
//       },
//       take: limit
//     });
//   }
// }
const client_1 = require("@prisma/client");
const products_1 = require("../models/products");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const prisma = new client_1.PrismaClient();
// Helper function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
    try {
        // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/public_id.jpg
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1)
            return null;
        // Get everything after 'upload/vXXXXXX/'
        const pathParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version
        const fullPath = pathParts.join('/');
        // Remove file extension
        return fullPath.replace(/\.[^/.]+$/, '');
    }
    catch {
        return null;
    }
};
const getAllProducts = async () => {
    return await prisma.products.findMany({
        include: {
            categories: true,
            reviews: true,
            cart: true,
            order_items: true,
        },
    });
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return await prisma.products.findUnique({
        where: { id },
        include: {
            categories: true,
            reviews: true,
            cart: true,
            order_items: true,
        },
    });
};
exports.getProductById = getProductById;
const createProduct = async (data, file) => {
    const validatedData = products_1.productSchema.parse(data);
    let imageUrl = null;
    // Upload to Cloudinary if file exists
    if (file) {
        try {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'products',
                    public_id: `product_${Date.now()}`,
                    resource_type: 'auto',
                    transformation: [
                        { width: 1000, height: 1000, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                uploadStream.end(file.buffer);
            });
            imageUrl = uploadResult.secure_url;
            console.log('✅ Image uploaded to Cloudinary:', imageUrl);
        }
        catch (error) {
            console.error('❌ Cloudinary upload error:', error);
            throw new Error('Failed to upload image to Cloudinary');
        }
    }
    const createData = {
        name: validatedData.name,
        description: validatedData.description ?? null,
        price: validatedData.price,
        image_url: imageUrl,
        stock_quantity: validatedData.stock_quantity ?? 0,
        discount_percentage: validatedData.discount_percentage ?? 0,
        views: validatedData.views ?? 0,
        created_at: validatedData.created_at ?? new Date(),
        updated_at: validatedData.updated_at ?? new Date(),
    };
    if (validatedData.category_name) {
        createData.categories = {
            connectOrCreate: {
                where: { name: validatedData.category_name },
                create: { name: validatedData.category_name },
            },
        };
    }
    if (validatedData.reviews && validatedData.reviews.length > 0) {
        createData.reviews = {
            create: validatedData.reviews.map((item) => ({
                user_id: item.user_id ?? null,
                rating: item.rating ?? null,
                comment: item.comment ?? "",
                created_at: item.created_at ?? new Date(),
            })),
        };
    }
    if (validatedData.order_items && validatedData.order_items.length > 0) {
        createData.order_items = {
            create: validatedData.order_items.map((item) => ({
                order_id: item.order_id,
                quantity: item.quantity,
                price: validatedData.price,
            })),
        };
    }
    return await prisma.products.create({
        data: createData,
        include: {
            categories: true,
            reviews: true,
            cart: true,
            order_items: true,
        },
    });
};
exports.createProduct = createProduct;
const addProductToCart = async (userId, productId, quantity) => {
    const product = await prisma.products.findUnique({
        where: { id: productId }
    });
    if (!product) {
        throw new Error('Product not found');
    }
    const originalStock = product.stock_quantity ?? 0;
    if (originalStock < quantity) {
        throw new Error(`Insufficient stock. Only ${originalStock} items available.`);
    }
    const existingCartItem = await prisma.cart.findFirst({
        where: {
            product_id: productId,
            user_id: userId
        }
    });
    const productPrice = new client_1.Prisma.Decimal(product.price);
    if (existingCartItem) {
        const totalRequestedQuantity = existingCartItem.quantity + quantity;
        if (originalStock < totalRequestedQuantity) {
            throw new Error(`Insufficient stock. Only ${originalStock} items available, you already have ${existingCartItem.quantity} in cart.`);
        }
        const [updatedCartItem] = await prisma.$transaction([
            prisma.cart.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: existingCartItem.quantity + quantity,
                    price: productPrice.mul(existingCartItem.quantity + quantity),
                    updated_at: new Date()
                },
                include: { products: true }
            }),
            prisma.products.update({
                where: { id: productId },
                data: {
                    stock_quantity: { decrement: quantity },
                    updated_at: new Date()
                }
            })
        ]);
        return updatedCartItem;
    }
    else {
        const [newCartItem] = await prisma.$transaction([
            prisma.cart.create({
                data: {
                    user_id: userId,
                    product_id: productId,
                    quantity,
                    price: productPrice.mul(quantity),
                    created_at: new Date(),
                    updated_at: new Date()
                },
                include: { products: true }
            }),
            prisma.products.update({
                where: { id: productId },
                data: {
                    stock_quantity: { decrement: quantity },
                    updated_at: new Date()
                }
            })
        ]);
        return newCartItem;
    }
};
exports.addProductToCart = addProductToCart;
const updateCartItemQuantity = async (cartItemId, userId, newQuantity) => {
    if (newQuantity <= 0) {
        return await (0, exports.deleteCartItem)(cartItemId, userId, true);
    }
    const cartItem = await prisma.cart.findFirst({
        where: {
            id: cartItemId,
            user_id: userId
        },
        include: {
            products: {
                select: {
                    id: true,
                    price: true,
                    stock_quantity: true
                }
            }
        }
    });
    if (!cartItem || !cartItem.products) {
        throw new Error('Cart item not found');
    }
    const product = cartItem.products;
    const currentQuantity = cartItem.quantity;
    const quantityDifference = newQuantity - currentQuantity;
    if (quantityDifference > 0) {
        if ((product.stock_quantity ?? 0) < quantityDifference) {
            throw new Error(`Insufficient stock. Only ${product.stock_quantity} items available.`);
        }
    }
    const productPrice = new client_1.Prisma.Decimal(product.price);
    const [updatedCartItem] = await prisma.$transaction([
        prisma.cart.update({
            where: { id: cartItemId },
            data: {
                quantity: newQuantity,
                price: productPrice.mul(newQuantity),
                updated_at: new Date()
            },
            include: { products: true }
        }),
        prisma.products.update({
            where: { id: product.id },
            data: {
                stock_quantity: { decrement: quantityDifference },
                updated_at: new Date()
            }
        })
    ]);
    return updatedCartItem;
};
exports.updateCartItemQuantity = updateCartItemQuantity;
const deleteCartItem = async (cartItemId, userId, restoreStock = true) => {
    const cartItem = await prisma.cart.findFirst({
        where: {
            id: cartItemId,
            user_id: userId
        },
        include: {
            products: {
                select: {
                    id: true,
                    stock_quantity: true
                }
            }
        }
    });
    if (!cartItem) {
        throw new Error('Cart item not found or does not belong to user');
    }
    if (restoreStock && cartItem.products) {
        await prisma.$transaction([
            prisma.cart.delete({
                where: { id: cartItemId }
            }),
            prisma.products.update({
                where: { id: cartItem.products.id },
                data: {
                    stock_quantity: {
                        increment: cartItem.quantity
                    },
                    updated_at: new Date()
                }
            })
        ]);
    }
    else {
        await prisma.cart.delete({
            where: { id: cartItemId }
        });
    }
    return cartItem;
};
exports.deleteCartItem = deleteCartItem;
const getUserCart = async (userId) => {
    const cartItems = await prisma.cart.findMany({
        where: { user_id: userId },
        include: {
            products: {
                include: {
                    categories: true
                }
            }
        }
    });
    const subtotal = cartItems.reduce((sum, item) => {
        return sum.add(new client_1.Prisma.Decimal(item.price || 0));
    }, new client_1.Prisma.Decimal(0));
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalDiscount = cartItems.reduce((sum, item) => {
        const discount = item.products?.discount_percentage || 0;
        const itemPrice = new client_1.Prisma.Decimal(item.price || 0);
        return sum.add(itemPrice.mul(discount).div(100));
    }, new client_1.Prisma.Decimal(0));
    return {
        items: cartItems,
        subtotal: subtotal.toNumber(),
        totalItems,
        totalDiscount: totalDiscount.toNumber(),
        grandTotal: subtotal.minus(totalDiscount).toNumber()
    };
};
exports.getUserCart = getUserCart;
const clearUserCart = async (userId) => {
    return await prisma.cart.deleteMany({
        where: { user_id: userId }
    });
};
exports.clearUserCart = clearUserCart;
const updateProduct = async (id, data, file) => {
    const validatedData = products_1.productSchema.partial().parse(data);
    const updateData = {
        updated_at: new Date(),
    };
    // Upload new image to Cloudinary if provided
    if (file) {
        try {
            // Get old product to delete old image
            const oldProduct = await prisma.products.findUnique({ where: { id } });
            // Upload new image
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'products',
                    public_id: `product_${Date.now()}`,
                    resource_type: 'auto',
                    transformation: [
                        { width: 1000, height: 1000, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                uploadStream.end(file.buffer);
            });
            updateData.image_url = uploadResult.secure_url;
            console.log('✅ Image updated on Cloudinary:', uploadResult.secure_url);
            // Delete old image from Cloudinary if exists
            if (oldProduct?.image_url) {
                const publicId = extractPublicIdFromUrl(oldProduct.image_url);
                if (publicId) {
                    try {
                        await cloudinary_1.default.uploader.destroy(publicId);
                        console.log('✅ Old image deleted from Cloudinary');
                    }
                    catch (error) {
                        console.error('⚠️ Failed to delete old image:', error);
                    }
                }
            }
        }
        catch (error) {
            console.error('❌ Cloudinary upload error:', error);
            throw new Error('Failed to upload image to Cloudinary');
        }
    }
    if (validatedData.name !== undefined)
        updateData.name = validatedData.name;
    if (validatedData.description !== undefined)
        updateData.description = validatedData.description;
    if (validatedData.price !== undefined)
        updateData.price = validatedData.price;
    if (validatedData.stock_quantity !== undefined)
        updateData.stock_quantity = validatedData.stock_quantity;
    if (validatedData.discount_percentage !== undefined)
        updateData.discount_percentage = validatedData.discount_percentage;
    if (validatedData.views !== undefined)
        updateData.views = validatedData.views;
    if (validatedData.category_name !== undefined) {
        updateData.categories = validatedData.category_name
            ? {
                connectOrCreate: {
                    where: { name: validatedData.category_name },
                    create: { name: validatedData.category_name },
                },
            }
            : { disconnect: true };
    }
    return await prisma.products.update({
        where: { id },
        data: updateData,
        include: {
            categories: true,
            reviews: true,
            cart: true,
            order_items: true,
        },
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    const product = await prisma.products.findUnique({ where: { id } });
    // Delete image from Cloudinary if exists
    if (product?.image_url) {
        const publicId = extractPublicIdFromUrl(product.image_url);
        if (publicId) {
            try {
                await cloudinary_1.default.uploader.destroy(publicId);
                console.log('✅ Image deleted from Cloudinary');
            }
            catch (error) {
                console.error('⚠️ Error deleting image from Cloudinary:', error);
            }
        }
    }
    return await prisma.products.delete({
        where: { id },
    });
};
exports.deleteProduct = deleteProduct;
const getAllProductImages = async () => {
    const products = await prisma.products.findMany({
        where: {
            image_url: {
                not: null,
            },
        },
        select: {
            image_url: true,
        },
    });
    return products.map((product) => product.image_url);
};
exports.getAllProductImages = getAllProductImages;
// Review Service
class ReviewService {
    static async addReview(productId, data) {
        return await prisma.reviews.create({
            data: {
                product_id: productId,
                user_id: data.user_id ?? null,
                rating: data.rating,
                username: data.username || "Anonymous",
                comment: data.comment,
                created_at: new Date(),
            },
        });
    }
    static async getProductReviews(productId) {
        const reviews = await prisma.reviews.findMany({
            where: { product_id: productId },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                review_likes: {
                    include: {
                        users: {
                            select: { id: true, username: true }
                        }
                    }
                },
                review_comments: {
                    include: {
                        users: {
                            select: { id: true, username: true }
                        }
                    },
                    orderBy: { created_at: "desc" }
                }
            },
            orderBy: { created_at: "desc" },
        });
        return reviews.map(review => ({
            ...review,
            username: review.username || review.users?.username || "Anonymous",
            likes_count: review.review_likes.filter(like => like.is_like === true).length,
            dislikes_count: review.review_likes.filter(like => like.is_like === false).length,
            comments_count: review.review_comments.length
        }));
    }
    static async deleteReview(reviewId, userId) {
        const review = await prisma.reviews.findUnique({
            where: { id: reviewId }
        });
        if (!review || (userId && review.user_id !== userId)) {
            throw new Error("Not authorized to delete this review");
        }
        return await prisma.reviews.delete({
            where: { id: reviewId }
        });
    }
}
exports.ReviewService = ReviewService;
class ReviewLikeService {
    static async toggleReviewLike(reviewId, userId, isLike) {
        const existing = await prisma.review_likes.findUnique({
            where: {
                review_id_user_id: {
                    review_id: reviewId,
                    user_id: userId
                }
            }
        });
        if (existing) {
            if (existing.is_like === isLike) {
                return await prisma.review_likes.delete({
                    where: { id: existing.id }
                });
            }
            else {
                return await prisma.review_likes.update({
                    where: { id: existing.id },
                    data: { is_like: isLike }
                });
            }
        }
        else {
            return await prisma.review_likes.create({
                data: {
                    review_id: reviewId,
                    user_id: userId,
                    is_like: isLike
                }
            });
        }
    }
    static async getReviewLikeStatus(reviewId, userId) {
        const like = await prisma.review_likes.findUnique({
            where: {
                review_id_user_id: {
                    review_id: reviewId,
                    user_id: userId
                }
            }
        });
        return like ? like.is_like : null;
    }
}
exports.ReviewLikeService = ReviewLikeService;
class ReviewCommentService {
    static async addReviewComment(reviewId, data) {
        return await prisma.review_comments.create({
            data: {
                review_id: reviewId,
                user_id: data.user_id ?? null,
                comment: data.comment,
                username: data.username || "Anonymous",
                created_at: new Date(),
            },
            include: {
                users: {
                    select: { id: true, username: true }
                }
            }
        });
    }
    static async getReviewComments(reviewId) {
        const comments = await prisma.review_comments.findMany({
            where: { review_id: reviewId },
            include: {
                users: {
                    select: { id: true, username: true }
                }
            },
            orderBy: { created_at: "desc" }
        });
        return comments.map(comment => ({
            ...comment,
            username: comment.username || comment.users?.username || "Anonymous"
        }));
    }
    static async deleteReviewComment(commentId, userId) {
        const comment = await prisma.review_comments.findUnique({
            where: { id: commentId }
        });
        if (!comment || (userId && comment.user_id !== userId)) {
            throw new Error("Not authorized to delete this comment");
        }
        return await prisma.review_comments.delete({
            where: { id: commentId }
        });
    }
}
exports.ReviewCommentService = ReviewCommentService;
class ProductViewService {
    static async trackProductView(productId, data) {
        try {
            const orConditions = [];
            if (data.user_id !== undefined) {
                orConditions.push({ user_id: data.user_id });
            }
            if (data.ip_address !== undefined) {
                orConditions.push({ ip_address: data.ip_address });
            }
            const existingView = await prisma.product_views.findFirst({
                where: {
                    product_id: productId,
                    ...(orConditions.length > 0 && { OR: orConditions }),
                    viewed_at: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            });
            if (!existingView) {
                return await prisma.product_views.create({
                    data: {
                        product_id: productId,
                        user_id: data.user_id ?? null,
                        ip_address: data.ip_address ?? null,
                        user_agent: data.user_agent ?? null,
                        username: data.username || "Anonymous",
                        viewed_at: new Date(),
                    },
                });
            }
            return null;
        }
        catch (error) {
            console.log('View already tracked:', error);
            return null;
        }
    }
    static async getProductViewCount(productId) {
        const totalViews = await prisma.product_views.count({
            where: { product_id: productId }
        });
        const uniqueUsers = await prisma.product_views.groupBy({
            by: ['user_id'],
            where: {
                product_id: productId,
                user_id: { not: null }
            }
        });
        const todayViews = await prisma.product_views.count({
            where: {
                product_id: productId,
                viewed_at: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });
        const weekViews = await prisma.product_views.count({
            where: {
                product_id: productId,
                viewed_at: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });
        return {
            total_views: totalViews,
            unique_users: uniqueUsers.length,
            today_views: todayViews,
            week_views: weekViews
        };
    }
    static async getProductWithViews(productId) {
        return await prisma.products.findUnique({
            where: { id: productId },
            include: {
                product_views: {
                    select: {
                        id: true,
                        viewed_at: true,
                        users: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    },
                    orderBy: { viewed_at: 'desc' },
                    take: 10
                },
                _count: {
                    select: {
                        product_views: true,
                        reviews: true
                    }
                }
            }
        });
    }
    static async getMostViewedProducts(limit = 10) {
        return await prisma.products.findMany({
            include: {
                _count: {
                    select: {
                        product_views: true,
                        reviews: true
                    }
                }
            },
            orderBy: {
                product_views: {
                    _count: 'desc'
                }
            },
            take: limit
        });
    }
}
exports.ProductViewService = ProductViewService;
//# sourceMappingURL=productservice.js.map