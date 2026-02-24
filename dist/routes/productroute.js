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
const productApprovalService_1 = require("../services/productApprovalService");
const auth_1 = require("../middlewares/auth");
const products_1 = require("../models/products");
const schemas_1 = require("../utils/schemas");
const agentController = __importStar(require("../controllers/productAgents/controller"));
const controller_1 = require("../controllers/products/controller");
exports.default = async (fastify) => {
    // ============================================
    // PUBLIC PRODUCT ROUTES (Approved products only)
    // ============================================
    // Get all approved products (public)
    fastify.get('/', productController.getProductsHandler);
    // Get single product by ID (public)
    fastify.get('/:id', productController.getProductHandler);
    // Get all product images (public)
    fastify.get('/images', productController.getProductImagesHandler);
    // ============================================
    // MERCHANT ROUTES (client_admin)
    // ============================================
    // Create new product (awaits approval)
    fastify.post('/newproduct', {
        preHandler: [auth_1.authenticate],
        handler: productController.createProductHandler,
    });
    // Get my products (merchant's own products)
    fastify.get('/my-products', {
        preHandler: [auth_1.authenticate],
        handler: productApprovalService_1.ProductApprovalController.getMerchantProducts
    });
    // Update product
    fastify.put('/:id', {
        preHandler: [auth_1.authenticate],
        handler: productController.updateProductHandler,
        schema: {
            body: (0, schemas_1.zodToJsonSchema)(products_1.productSchema.partial()),
        },
    });
    // Delete product
    fastify.delete('/:id', {
        preHandler: [auth_1.authenticate],
        handler: productController.deleteProductHandler
    });
    // ============================================
    // ADMIN ROUTES (super_admin)
    // ============================================
    // Get all pending products
    fastify.get('/approval/pending', {
        preHandler: [auth_1.authenticate],
        handler: productApprovalService_1.ProductApprovalController.getPendingProducts
    });
    // Get overdue products (uploaded more than 7 days ago)
    fastify.get('/approval/overdue', {
        preHandler: [auth_1.authenticate],
        handler: productApprovalService_1.ProductApprovalController.getOverdueProducts
    });
    // Approve product
    fastify.post('/:id/approve', {
        preHandler: [auth_1.authenticate],
        handler: productApprovalService_1.ProductApprovalController.approveProduct
    });
    // Reject product
    fastify.post('/:id/reject', {
        preHandler: [auth_1.authenticate],
        handler: productApprovalService_1.ProductApprovalController.rejectProduct,
        schema: {
            body: {
                type: 'object',
                properties: {
                    rejectionReason: { type: 'string', minLength: 10 }
                },
                required: ['rejectionReason']
            }
        }
    });
    // ============================================
    // CART ROUTES
    // ============================================
    fastify.post('/:userId/cart', {
        preHandler: [(0, auth_1.authorize)(['client'])],
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
                    productId: { type: ['number', 'string'] },
                    quantity: { type: ['number', 'string'], minimum: 1 },
                },
                required: ['productId', 'quantity'],
            },
        },
    });
    fastify.get('/:userId/cart', productController.getUserCartHandler);
    fastify.put('/:userId/cart/:cartItemId', {
        preHandler: [(0, auth_1.authorize)(['client'])],
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
    fastify.delete('/:userId/cart/:cartItemId', {
        preHandler: [(0, auth_1.authorize)(['client'])],
        handler: productController.deleteCartItemHandler
    });
    // ============================================
    // REVIEWS
    // ============================================
    fastify.post('/:id/reviews', {
        preHandler: [(0, auth_1.authorize)(['client'])],
        handler: controller_1.ReviewController.addReview
    });
    fastify.get('/:id/reviews', controller_1.ReviewController.getReviews);
    fastify.delete('/reviews/:reviewId', controller_1.ReviewController.deleteReview);
    // ============================================
    // REVIEW LIKES
    // ============================================
    fastify.post('/reviews/:reviewId/like', {
        preHandler: [(0, auth_1.authorize)(['client'])],
        handler: controller_1.ReviewLikeController.toggleLike
    });
    fastify.get('/reviews/:reviewId/like-status', controller_1.ReviewLikeController.getLikeStatus);
    // ============================================
    // REVIEW COMMENTS
    // ============================================
    fastify.post('/reviews/:reviewId/comments', {
        preHandler: [(0, auth_1.authorize)(['client'])],
        handler: controller_1.ReviewCommentController.addComment
    });
    fastify.get('/reviews/:reviewId/comments', controller_1.ReviewCommentController.getComments);
    fastify.delete('/review-comments/:commentId', controller_1.ReviewCommentController.deleteComment);
    // ============================================
    // PRODUCT VIEWS
    // ============================================
    fastify.post('/:id/view', controller_1.ProductViewController.trackView);
    fastify.get('/:id/views', controller_1.ProductViewController.getViewStats);
    fastify.get('/:id/with-views', controller_1.ProductViewController.getProductWithViews);
    fastify.get('/most-viewed', controller_1.ProductViewController.getMostViewed);
    fastify.get('/:id/agents', {
        handler: agentController.getProductAgentsHandler
    });
    // ============================================
    // API DOCUMENTATION & EXAMPLES
    // ============================================
    /*
    
    📦 PRODUCT APPROVAL API
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    🏪 MERCHANT ENDPOINTS (client_admin)
    
    Create Product (Requires Approval):
    POST /api/products/newproduct
    Headers: { Authorization: "Bearer <merchant_token>" }
    Content-Type: multipart/form-data
    Form Data:
      - file: [Product image]
      - name: "Dental Cleaning Service"
      - description: "Professional teeth cleaning"
      - price: 50.00
      - stock_quantity: 100
      - category_name: "Dental Services"
    
    Response: {
      "success": true,
      "message": "Product created. Awaiting admin approval (7 days)",
      "data": {
        "id": 1,
        "name": "Dental Cleaning Service",
        "approval_status": "pending",
        "is_visible": false,
        "uploaded_by": 5,
        "approval_deadline": "2025-11-24T...",
        "created_at": "2025-11-17T..."
      }
    }
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Get My Products:
    GET /api/products/my-products
    Headers: { Authorization: "Bearer <merchant_token>" }
    
    Response: {
      "success": true,
      "data": [
        {
          "id": 1,
          "name": "Dental Cleaning",
          "approval_status": "pending",
          "is_visible": false,
          "created_at": "2025-11-17T...",
          "approved_at": null,
          "rejection_reason": null
        },
        {
          "id": 2,
          "name": "Teeth Whitening",
          "approval_status": "approved",
          "is_visible": true,
          "approved_at": "2025-11-16T...",
          "approved_by_user": {
            "username": "super_admin"
          }
        }
      ]
    }
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    👨‍💼 ADMIN ENDPOINTS (super_admin)
    
    Get Pending Products:
    GET /api/products/approval/pending
    Headers: { Authorization: "Bearer <super_admin_token>" }
    
    Response: {
      "success": true,
      "data": [
        {
          "id": 1,
          "name": "Dental Cleaning Service",
          "price": 50.00,
          "created_at": "2025-11-10T...",
          "uploaded_by_user": {
            "merchant_name": "Dan's Dental Clinic",
            "email": "dan@dental.com",
            "phone": "+263771234567"
          },
          "business_documents": [
            {
              "document_type": "business_license",
              "approval_status": "approved"
            }
          ]
        }
      ],
      "count": 5
    }
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Get Overdue Products:
    GET /api/products/approval/overdue
    Headers: { Authorization: "Bearer <super_admin_token>" }
    
    Response: {
      "success": true,
      "data": [ ... ],
      "count": 3,
      "message": "⚠️ 3 product(s) overdue for approval!"
    }
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Approve Product:
    POST /api/products/:id/approve
    Headers: { Authorization: "Bearer <super_admin_token>" }
    
    Response: {
      "success": true,
      "message": "Product approved successfully",
      "data": {
        "id": 1,
        "name": "Dental Cleaning",
        "approval_status": "approved",
        "is_visible": true,
        "approved_at": "2025-11-17T...",
        "approved_by": 1
      }
    }
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    Reject Product:
    POST /api/products/:id/reject
    Headers: { Authorization: "Bearer <super_admin_token>" }
    Body: {
      "rejectionReason": "Product images are unclear. Please upload higher quality photos."
    }
    
    Response: {
      "success": true,
      "message": "Product rejected",
      "data": {
        "id": 1,
        "approval_status": "rejected",
        "is_visible": false,
        "rejection_reason": "Product images are unclear..."
      }
    }
    
    */
};
// import fastify from 'fastify';
// import { FastifyInstance } from 'fastify';
// import * as productController from '../controllers/products/controller';
// import { productSchema } from '../models/products';
// import { zodToJsonSchema } from '../utils/schemas';
// import { 
//   ReviewController, 
//   ReviewLikeController, 
//   ReviewCommentController, 
//   ProductViewController 
// } from '../controllers/products/controller';
// export default async (fastify: FastifyInstance) => {
//   // Get all products
//  fastify.get('/', productController.getProductsHandler);
//   // Get single product by ID
//   fastify.get('/:id', productController.getProductHandler);
//   // Get all product images
//   fastify.get('/images', productController.getProductImagesHandler);
//   // Create new product
//   fastify.post('/newproduct', {
//     handler: productController.createProductHandler,
//     // Remove schema validation for body to allow multipart/form-data
//     // Validation is handled manually in createProductHandler
//   });
// // llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
//     // ------------------- REVIEWS -------------------
// // fastify.post('/:id/reviews', productController.addReviewHandler);
// // fastify.get('/:id/reviews', productController.getReviewsHandler);
//   // ------------------- REVIEWS -------------------
//   fastify.post('/:id/reviews', ReviewController.addReview);
//   fastify.get('/:id/reviews', ReviewController.getReviews);
//   fastify.delete('/reviews/:reviewId', ReviewController.deleteReview);
//   // ------------------- REVIEW LIKES -------------------
//   fastify.post('/reviews/:reviewId/like', ReviewLikeController.toggleLike);
//   fastify.get('/reviews/:reviewId/like-status', ReviewLikeController.getLikeStatus);
//   // ------------------- REVIEW COMMENTS -------------------
//   fastify.post('/reviews/:reviewId/comments', ReviewCommentController.addComment);
//   fastify.get('/reviews/:reviewId/comments', ReviewCommentController.getComments);
//   fastify.delete('/review-comments/:commentId', ReviewCommentController.deleteComment);
//   // ------------------- PRODUCT VIEWS -------------------
//   fastify.post('/:id/view', ProductViewController.trackView);
//   fastify.get('/:id/views', ProductViewController.getViewStats);
//   fastify.get('/:id/with-views', ProductViewController.getProductWithViews);
//   fastify.get('/most-viewed', ProductViewController.getMostViewed);
// // lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
//   // Update product
//   fastify.put('/:id', {
//     handler: productController.updateProductHandler,
//     schema: {
//       body: zodToJsonSchema(productSchema.partial()),
//     },
//   });
//   // Delete product
//   fastify.delete('/:id', productController.deleteProductHandler);
//   // Cart routes
//   fastify.post('/:userId/cart', {
//     handler: productController.addProductToCartHandler,
//     schema: {
//       params: {
//         type: 'object',
//         properties: {
//           userId: { type: 'string' },
//         },
//         required: ['userId'],
//       },
//       body: {
//         type: 'object',
//         properties: {
//           productId: { type: ['number', 'string'] }, // Allow both number and string
//           quantity: { type: ['number', 'string'], minimum: 1 },
//         },
//         required: ['productId', 'quantity'],
//       },
//     },
//   });
//   fastify.get('/:userId/cart', productController.getUserCartHandler);
//   fastify.put('/:userId/cart/:cartItemId', {
//     handler: productController.updateCartItemQuantityHandler,
//     schema: {
//       body: {
//         type: 'object',
//         properties: {
//           quantity: { type: 'number', minimum: 1 },
//         },
//         required: ['quantity'],
//       },
//     },
//   });
//   fastify.delete('/:userId/cart/:cartItemId', productController.deleteCartItemHandler);
// };
//# sourceMappingURL=productroute.js.map