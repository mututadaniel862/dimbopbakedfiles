"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductViewController = exports.ReviewCommentController = exports.ReviewLikeController = exports.ReviewController = exports.deleteProductHandler = exports.updateProductHandler = exports.getProductHandler = exports.updateCartItemQuantityHandler = exports.addProductToCartHandler = exports.deleteCartItemHandler = exports.getUserCartHandler = exports.getProductImagesHandler = exports.getProductsHandler = exports.createProductHandler = void 0;
const productservice_1 = require("../../services/productservice");
const products_1 = require("../../models/products");
const createProductHandler = async (request, reply) => {
    try {
        const data = await request.file();
        if (!data) {
            return reply.status(400).send({ message: 'No file or form data provided' });
        }
        // Extract form fields
        const fields = data.fields;
        const formData = {};
        for (const key in fields) {
            const field = fields[key];
            if (field && 'value' in field && typeof field.value === 'string') {
                formData[key] = field.value;
            }
        }
        // Convert string fields to numbers for schema validation
        const convertedData = {
            ...formData,
            price: formData.price ? parseFloat(formData.price) : undefined,
            stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity, 10) : undefined,
            discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : undefined,
            views: formData.views ? parseInt(formData.views, 10) : undefined,
        };
        // Validate form fields against productSchema
        const validatedData = products_1.productSchema.parse(convertedData);
        // Handle file upload - convert to buffer for Cloudinary
        let fileInfo;
        if (data.file) {
            const buffer = await data.toBuffer();
            fileInfo = {
                buffer,
                filename: data.filename,
                mimetype: data.mimetype,
            };
            console.log('📁 File received:', data.filename, 'Size:', buffer.length, 'bytes');
        }
        // Create product with validated data and file info
        const product = await (0, productservice_1.createProduct)(validatedData, fileInfo);
        reply.status(201).send(product);
    }
    catch (error) {
        console.error('Error creating product:', error);
        reply.status(400).send({
            message: 'Invalid product data',
            error: error instanceof Error ? error.message : JSON.stringify(error, null, 2)
        });
    }
};
exports.createProductHandler = createProductHandler;
const getProductsHandler = async (request, reply) => {
    try {
        const products = await (0, productservice_1.getAllProducts)();
        reply.send(products);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error fetching products' });
    }
};
exports.getProductsHandler = getProductsHandler;
const getProductImagesHandler = async (request, reply) => {
    try {
        const imageUrls = await (0, productservice_1.getAllProductImages)();
        reply.send(imageUrls);
    }
    catch (error) {
        console.error('Error fetching product images:', error);
        reply.status(500).send({ message: 'Error fetching product images' });
    }
};
exports.getProductImagesHandler = getProductImagesHandler;
const getUserCartHandler = async (request, reply) => {
    try {
        const { userId } = request.params;
        const cartItems = await (0, productservice_1.getUserCart)(parseInt(userId));
        if (!cartItems) {
            reply.status(404).send({ message: 'Cart not found' });
            return;
        }
        reply.send(cartItems);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error fetching cart items' });
    }
};
exports.getUserCartHandler = getUserCartHandler;
const deleteCartItemHandler = async (request, reply) => {
    try {
        const { cartItemId, userId } = request.params;
        const deletedItem = await (0, productservice_1.deleteCartItem)(parseInt(cartItemId), parseInt(userId));
        if (!deletedItem) {
            reply.status(404).send({ message: 'Cart item not found' });
            return;
        }
        reply.send(deletedItem);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error deleting cart item' });
    }
};
exports.deleteCartItemHandler = deleteCartItemHandler;
const addProductToCartHandler = async (request, reply) => {
    console.log(`🔥 CART HANDLER HIT - Request received!`);
    console.log(`Request params:`, request.params);
    console.log(`Request body:`, request.body);
    try {
        const { userId } = request.params;
        const { productId, quantity } = request.body;
        const userIdNum = parseInt(userId, 10);
        const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId;
        const quantityNum = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
        if (isNaN(userIdNum) || isNaN(productIdNum) || isNaN(quantityNum)) {
            return reply.status(400).send({
                message: 'Invalid parameters',
                error: 'userId, productId, and quantity must be valid numbers'
            });
        }
        console.log(`🔥 About to call addProductToCart with:`, {
            userId: userIdNum,
            productId: productIdNum,
            quantity: quantityNum
        });
        const cartItem = await (0, productservice_1.addProductToCart)(userIdNum, productIdNum, quantityNum);
        reply.send(cartItem);
    }
    catch (error) {
        console.log(`🔥 ERROR in handler:`, error.message);
        reply.status(500).send({
            message: 'Error adding product to cart',
            error: error.message
        });
    }
};
exports.addProductToCartHandler = addProductToCartHandler;
const updateCartItemQuantityHandler = async (request, reply) => {
    try {
        const { cartItemId, userId } = request.params;
        const { quantity } = request.body;
        const updatedItem = await (0, productservice_1.updateCartItemQuantity)(parseInt(cartItemId), parseInt(userId), quantity);
        if (!updatedItem) {
            reply.status(404).send({ message: 'Cart item not found' });
            return;
        }
        reply.send(updatedItem);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error updating cart item quantity' });
    }
};
exports.updateCartItemQuantityHandler = updateCartItemQuantityHandler;
const getProductHandler = async (request, reply) => {
    try {
        const { id } = request.params;
        const product = await (0, productservice_1.getProductById)(parseInt(id));
        if (!product) {
            reply.status(404).send({ message: 'Product not found' });
            return;
        }
        reply.send(product);
    }
    catch (error) {
        reply.status(500).send({ message: 'Error fetching product' });
    }
};
exports.getProductHandler = getProductHandler;
const updateProductHandler = async (request, reply) => {
    try {
        const { id } = request.params;
        const data = await request.file();
        let formData = {};
        let fileInfo;
        if (data) {
            // Extract form fields
            const fields = data.fields;
            for (const key in fields) {
                const field = fields[key];
                if (field && 'value' in field) {
                    formData[key] = field.value;
                }
            }
            // Handle file if provided
            if (data.file) {
                const buffer = await data.toBuffer();
                fileInfo = {
                    buffer,
                    filename: data.filename,
                    mimetype: data.mimetype,
                };
                console.log('📁 Update file received:', data.filename, 'Size:', buffer.length, 'bytes');
            }
        }
        // Convert numeric fields
        if (formData.price)
            formData.price = parseFloat(formData.price);
        if (formData.stock_quantity)
            formData.stock_quantity = parseInt(formData.stock_quantity, 10);
        if (formData.discount_percentage)
            formData.discount_percentage = parseFloat(formData.discount_percentage);
        if (formData.views)
            formData.views = parseInt(formData.views, 10);
        const updatedProduct = await (0, productservice_1.updateProduct)(parseInt(id), formData, fileInfo);
        if (!updatedProduct) {
            reply.status(404).send({ message: 'Product not found' });
            return;
        }
        reply.send(updatedProduct);
    }
    catch (error) {
        console.error('Error updating product:', error);
        reply.status(400).send({
            message: 'Error updating product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateProductHandler = updateProductHandler;
const deleteProductHandler = async (request, reply) => {
    try {
        const { id } = request.params;
        await (0, productservice_1.deleteProduct)(parseInt(id));
        reply.status(204).send();
    }
    catch (error) {
        reply.status(500).send({ message: 'Error deleting product' });
    }
};
exports.deleteProductHandler = deleteProductHandler;
// Review Controllers
class ReviewController {
    static async addReview(request, reply) {
        try {
            const { id } = request.params;
            const { user_id, rating, comment, username } = request.body;
            if (!rating || !comment?.trim()) {
                return reply.status(400).send({
                    message: "Missing required fields: rating and comment are required"
                });
            }
            if (rating < 1 || rating > 5) {
                return reply.status(400).send({
                    message: "Rating must be between 1 and 5"
                });
            }
            // Build data object conditionally to satisfy TS exactOptionalPropertyTypes
            const reviewData = {
                rating,
                comment,
                username: username || "Anonymous"
            };
            if (user_id !== undefined)
                reviewData.user_id = user_id;
            const review = await productservice_1.ReviewService.addReview(parseInt(id), reviewData);
            reply.status(201).send(review);
        }
        catch (error) {
            reply.status(500).send({ message: "Error adding review", error: error.message });
        }
    }
    static async getReviews(request, reply) {
        try {
            const { id } = request.params;
            const reviews = await productservice_1.ReviewService.getProductReviews(parseInt(id));
            reply.send(reviews);
        }
        catch (error) {
            reply.status(400).send({ message: "Error fetching reviews", error: error.message });
        }
    }
    static async deleteReview(request, reply) {
        try {
            const { reviewId } = request.params;
            const { user_id } = request.body;
            await productservice_1.ReviewService.deleteReview(parseInt(reviewId), user_id);
            reply.send({ message: "Review deleted successfully" });
        }
        catch (error) {
            reply.status(400).send({ message: error.message });
        }
    }
}
exports.ReviewController = ReviewController;
class ReviewLikeController {
    static async toggleLike(request, reply) {
        try {
            const { reviewId } = request.params;
            const { user_id, is_like } = request.body;
            if (!user_id) {
                // Allow anonymous likes - generate a temporary ID based on IP
                return reply.status(400).send({ message: "user_id is required for likes" });
            }
            const result = await productservice_1.ReviewLikeService.toggleReviewLike(parseInt(reviewId), user_id, is_like);
            reply.send(result);
        }
        catch (error) {
            reply.status(500).send({ message: "Error toggling like", error: error.message });
        }
    }
    static async getLikeStatus(request, reply) {
        try {
            const { reviewId } = request.params;
            const { user_id } = request.query;
            if (!user_id) {
                return reply.status(400).send({ message: "user_id is required" });
            }
            const status = await productservice_1.ReviewLikeService.getReviewLikeStatus(parseInt(reviewId), parseInt(user_id));
            reply.send({ like_status: status });
        }
        catch (error) {
            reply.status(500).send({ message: "Error getting like status", error: error.message });
        }
    }
}
exports.ReviewLikeController = ReviewLikeController;
class ReviewCommentController {
    static async addComment(request, reply) {
        try {
            const { reviewId } = request.params;
            const { user_id, comment, username } = request.body;
            if (!comment?.trim()) {
                return reply.status(400).send({ message: "Comment is required" });
            }
            const result = await productservice_1.ReviewCommentService.addReviewComment(parseInt(reviewId), {
                user_id,
                comment,
                username: username || "Anonymous"
            });
            reply.status(201).send(result);
        }
        catch (error) {
            reply.status(500).send({ message: "Error adding comment", error: error.message });
        }
    }
    static async getComments(request, reply) {
        try {
            const { reviewId } = request.params;
            const comments = await productservice_1.ReviewCommentService.getReviewComments(parseInt(reviewId));
            reply.send(comments);
        }
        catch (error) {
            reply.status(500).send({ message: "Error fetching comments", error: error.message });
        }
    }
    static async deleteComment(request, reply) {
        try {
            const { commentId } = request.params;
            const { user_id } = request.body;
            await productservice_1.ReviewCommentService.deleteReviewComment(parseInt(commentId), user_id);
            reply.send({ message: "Comment deleted successfully" });
        }
        catch (error) {
            reply.status(400).send({ message: error.message });
        }
    }
}
exports.ReviewCommentController = ReviewCommentController;
class ProductViewController {
    static async trackView(request, reply) {
        try {
            const { id } = request.params;
            const { user_id, username } = request.body;
            const ip_address = request.ip;
            const user_agent = request.headers['user-agent'];
            const viewData = {
                username: username || "Anonymous",
            };
            if (user_id !== undefined) {
                viewData.user_id = user_id;
            }
            if (ip_address !== undefined) {
                viewData.ip_address = ip_address;
            }
            if (user_agent !== undefined) {
                viewData.user_agent = user_agent;
            }
            const view = await productservice_1.ProductViewService.trackProductView(parseInt(id), viewData);
            if (view) {
                reply.status(201).send({ message: "View tracked", view });
            }
            else {
                reply.send({ message: "View already tracked recently" });
            }
        }
        catch (error) {
            reply.status(500).send({ message: "Error tracking view", error: error.message });
        }
    }
    static async getViewStats(request, reply) {
        try {
            const { id } = request.params;
            const stats = await productservice_1.ProductViewService.getProductViewCount(parseInt(id));
            reply.send(stats);
        }
        catch (error) {
            reply.status(500).send({ message: "Error getting view stats", error: error.message });
        }
    }
    static async getProductWithViews(request, reply) {
        try {
            const { id } = request.params;
            const product = await productservice_1.ProductViewService.getProductWithViews(parseInt(id));
            if (!product) {
                return reply.status(404).send({ message: "Product not found" });
            }
            reply.send(product);
        }
        catch (error) {
            reply.status(500).send({ message: "Error getting product with views", error: error.message });
        }
    }
    static async getMostViewed(request, reply) {
        try {
            const { limit } = request.query;
            const limitNumber = parseInt(limit || '10');
            const products = await productservice_1.ProductViewService.getMostViewedProducts(limitNumber);
            reply.send(products);
        }
        catch (error) {
            reply.status(500).send({ message: "Error getting most viewed products", error: error.message });
        }
    }
}
exports.ProductViewController = ProductViewController;
//# sourceMappingURL=controller.js.map