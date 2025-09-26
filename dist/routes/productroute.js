"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const productController = __importStar(require("../controllers/products/controller"));
const products_1 = require("../models/products");
const schemas_1 = require("../utils/schemas");
const controller_1 = require("../controllers/products/controller");
exports.default = async (fastify) => {
    // Get all products
    fastify.get('/', productController.getProductsHandler);
    // Get single product by ID
    fastify.get('/:id', productController.getProductHandler);
    // Get all product images
    fastify.get('/images', productController.getProductImagesHandler);
    // Create new product
    fastify.post('/newproduct', {
        handler: productController.createProductHandler,
        // Remove schema validation for body to allow multipart/form-data
        // Validation is handled manually in createProductHandler
    });
    // llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
    // ------------------- REVIEWS -------------------
    // fastify.post('/:id/reviews', productController.addReviewHandler);
    // fastify.get('/:id/reviews', productController.getReviewsHandler);
    // ------------------- REVIEWS -------------------
    fastify.post('/:id/reviews', controller_1.ReviewController.addReview);
    fastify.get('/:id/reviews', controller_1.ReviewController.getReviews);
    fastify.delete('/reviews/:reviewId', controller_1.ReviewController.deleteReview);
    // ------------------- REVIEW LIKES -------------------
    fastify.post('/reviews/:reviewId/like', controller_1.ReviewLikeController.toggleLike);
    fastify.get('/reviews/:reviewId/like-status', controller_1.ReviewLikeController.getLikeStatus);
    // ------------------- REVIEW COMMENTS -------------------
    fastify.post('/reviews/:reviewId/comments', controller_1.ReviewCommentController.addComment);
    fastify.get('/reviews/:reviewId/comments', controller_1.ReviewCommentController.getComments);
    fastify.delete('/review-comments/:commentId', controller_1.ReviewCommentController.deleteComment);
    // ------------------- PRODUCT VIEWS -------------------
    fastify.post('/:id/view', controller_1.ProductViewController.trackView);
    fastify.get('/:id/views', controller_1.ProductViewController.getViewStats);
    fastify.get('/:id/with-views', controller_1.ProductViewController.getProductWithViews);
    fastify.get('/most-viewed', controller_1.ProductViewController.getMostViewed);
    // lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
    // Update product
    fastify.put('/:id', {
        handler: productController.updateProductHandler,
        schema: {
            body: (0, schemas_1.zodToJsonSchema)(products_1.productSchema.partial()),
        },
    });
    // Delete product
    fastify.delete('/:id', productController.deleteProductHandler);
    // Cart routes
    fastify.post('/:userId/cart', {
        handler: productController.addProductToCartHandler,
        schema: {
            params: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                },
                required: ['userId'],
            },
            body: {
                type: 'object',
                properties: {
                    productId: { type: ['number', 'string'] }, // Allow both number and string
                    quantity: { type: ['number', 'string'], minimum: 1 },
                },
                required: ['productId', 'quantity'],
            },
        },
    });
    fastify.get('/:userId/cart', productController.getUserCartHandler);
    fastify.put('/:userId/cart/:cartItemId', {
        handler: productController.updateCartItemQuantityHandler,
        schema: {
            body: {
                type: 'object',
                properties: {
                    quantity: { type: 'number', minimum: 1 },
                },
                required: ['quantity'],
            },
        },
    });
    fastify.delete('/:userId/cart/:cartItemId', productController.deleteCartItemHandler);
};
//# sourceMappingURL=productroute.js.map