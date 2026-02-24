import { FastifyRequest, FastifyReply } from 'fastify';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getUserCart,
  getAllProductImages,
  ReviewService, 
  ReviewLikeService, 
  ReviewCommentService, 
  ProductViewService 
} from '../../services/productservice';
import { productSchema } from '../../models/products';
import { z } from 'zod';

type ProductParams = {
  id: string;
};

type ProductBody = z.infer<typeof productSchema>;

export const createProductHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ message: 'No file or form data provided' });
    }

    // Extract form fields
    const fields = data.fields as any;
    const formData: Record<string, any> = {};
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
    const validatedData = productSchema.parse(convertedData);

    // Handle file upload - convert to buffer for Cloudinary
    let fileInfo: { buffer: Buffer; filename: string; mimetype: string } | undefined;
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
    const product = await createProduct(validatedData, fileInfo);
    reply.status(201).send(product);
  } catch (error) {
    console.error('Error creating product:', error);
    reply.status(400).send({ 
      message: 'Invalid product data', 
      error: error instanceof Error ? error.message : JSON.stringify(error, null, 2) 
    });
  }
};

export const getProductsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const products = await getAllProducts();
    reply.send(products);
  } catch (error) {
    reply.status(500).send({ message: 'Error fetching products' });
  }
};

export const getProductImagesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const imageUrls = await getAllProductImages();
    reply.send(imageUrls);
  } catch (error) {
    console.error('Error fetching product images:', error);
    reply.status(500).send({ message: 'Error fetching product images' });
  }
};

export const getUserCartHandler = async (
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const cartItems = await getUserCart(parseInt(userId));
    if (!cartItems) {
      reply.status(404).send({ message: 'Cart not found' });
      return;
    }
    reply.send(cartItems);
  } catch (error) {
    reply.status(500).send({ message: 'Error fetching cart items' });
  }
};

export const deleteCartItemHandler = async (
  request: FastifyRequest<{ Params: { cartItemId: string; userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { cartItemId, userId } = request.params;
    const deletedItem = await deleteCartItem(parseInt(cartItemId), parseInt(userId));
    if (!deletedItem) {
      reply.status(404).send({ message: 'Cart item not found' });
      return;
    }
    reply.send(deletedItem);
  } catch (error) {
    reply.status(500).send({ message: 'Error deleting cart item' });
  }
};

export const addProductToCartHandler = async (
  request: FastifyRequest<{ 
    Params: { userId: string }; 
    Body: { productId: number; quantity: number } 
  }>,
  reply: FastifyReply
) => {
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
    
    const cartItem = await addProductToCart(userIdNum, productIdNum, quantityNum);
    reply.send(cartItem);
  } catch (error: any) {
    console.log(`🔥 ERROR in handler:`, error.message);
    reply.status(500).send({ 
      message: 'Error adding product to cart', 
      error: error.message 
    });
  }
};

export const updateCartItemQuantityHandler = async (
  request: FastifyRequest<{ Params: { cartItemId: string; userId: string }; Body: { quantity: number } }>,
  reply: FastifyReply
) => {
  try {
    const { cartItemId, userId } = request.params;
    const { quantity } = request.body;
    const updatedItem = await updateCartItemQuantity(parseInt(cartItemId), parseInt(userId), quantity);
    if (!updatedItem) {
      reply.status(404).send({ message: 'Cart item not found' });
      return;
    }
    reply.send(updatedItem);
  } catch (error) {
    reply.status(500).send({ message:'Error updating cart item quantity' });
  }
};

export const getProductHandler = async (
  request: FastifyRequest<{ Params: ProductParams }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const product = await getProductById(parseInt(id));
    if (!product) {
      reply.status(404).send({ message: 'Product not found' });
      return;
    }
    reply.send(product);
  } catch (error) {
    reply.status(500).send({ message: 'Error fetching product' });
  }
};

export const updateProductHandler = async (
  request: FastifyRequest<{ Params: ProductParams }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const data = await request.file();

    let formData: Record<string, any> = {};
    let fileInfo: { buffer: Buffer; filename: string; mimetype: string } | undefined;

    if (data) {
      // Extract form fields
      const fields = data.fields as any;
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
    if (formData.price) formData.price = parseFloat(formData.price);
    if (formData.stock_quantity) formData.stock_quantity = parseInt(formData.stock_quantity, 10);
    if (formData.discount_percentage) formData.discount_percentage = parseFloat(formData.discount_percentage);
    if (formData.views) formData.views = parseInt(formData.views, 10);

    const updatedProduct = await updateProduct(parseInt(id), formData, fileInfo);
    
    if (!updatedProduct) {
      reply.status(404).send({ message: 'Product not found' });
      return;
    }
    
    reply.send(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    reply.status(400).send({ 
      message: 'Error updating product', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteProductHandler = async (
  request: FastifyRequest<{ Params: ProductParams }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    await deleteProduct(parseInt(id));
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ message: 'Error deleting product' });
  }
};

// Review Controllers
export class ReviewController {
  static async addReview(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { user_id?: number; rating: number; comment: string; username?: string }
    }>,
    reply: FastifyReply
  ) {
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
      const reviewData: any = {
        rating,
        comment,
        username: username || "Anonymous"
      };
      if (user_id !== undefined) reviewData.user_id = user_id;

      const review = await ReviewService.addReview(parseInt(id), reviewData);

      reply.status(201).send(review);
    } catch (error: any) {
      reply.status(500).send({ message: "Error adding review", error: error.message });
    }
  }

  static async getReviews(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const reviews = await ReviewService.getProductReviews(parseInt(id));
      reply.send(reviews);
    } catch (error: any) {
      reply.status(400).send({ message: "Error fetching reviews", error: error.message });
    }
  }

  static async deleteReview(
    request: FastifyRequest<{
      Params: { reviewId: string };
      Body: { user_id?: number }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { reviewId } = request.params;
      const { user_id } = request.body;

      await ReviewService.deleteReview(parseInt(reviewId), user_id);
      reply.send({ message: "Review deleted successfully" });
    } catch (error: any) {
      reply.status(400).send({ message: error.message });
    }
  }
}

export class ReviewLikeController {
  static async toggleLike(
    request: FastifyRequest<{
      Params: { reviewId: string };
      Body: { user_id?: number; is_like: boolean }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { reviewId } = request.params;
      const { user_id, is_like } = request.body;

      if (!user_id) {
        // Allow anonymous likes - generate a temporary ID based on IP
        return reply.status(400).send({ message: "user_id is required for likes" });
      }

      const result = await ReviewLikeService.toggleReviewLike(parseInt(reviewId), user_id, is_like);
      reply.send(result);
    } catch (error: any) {
      reply.status(500).send({ message: "Error toggling like", error: error.message });
    }
  }

  static async getLikeStatus(
    request: FastifyRequest<{
      Params: { reviewId: string };
      Querystring: { user_id: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { reviewId } = request.params;
      const { user_id } = request.query as { user_id: string };

      if (!user_id) {
        return reply.status(400).send({ message: "user_id is required" });
      }

      const status = await ReviewLikeService.getReviewLikeStatus(parseInt(reviewId), parseInt(user_id));
      reply.send({ like_status: status });
    } catch (error: any) {
      reply.status(500).send({ message: "Error getting like status", error: error.message });
    }
  }
}

export class ReviewCommentController {
  static async addComment(
    request: FastifyRequest<{
      Params: { reviewId: string };
      Body: { user_id: number; comment: string; username?: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { reviewId } = request.params;
      const { user_id, comment, username } = request.body;

      if (!comment?.trim()) {
        return reply.status(400).send({ message: "Comment is required" });
      }

      const result = await ReviewCommentService.addReviewComment(parseInt(reviewId), {
        user_id,
        comment,
        username: username || "Anonymous"
      });

      reply.status(201).send(result);
    } catch (error: any) {
      reply.status(500).send({ message: "Error adding comment", error: error.message });
    }
  }

  static async getComments(
    request: FastifyRequest<{ Params: { reviewId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { reviewId } = request.params;
      const comments = await ReviewCommentService.getReviewComments(parseInt(reviewId));
      reply.send(comments);
    } catch (error: any) {
      reply.status(500).send({ message: "Error fetching comments", error: error.message });
    }
  }

  static async deleteComment(
    request: FastifyRequest<{
      Params: { commentId: string };
      Body: { user_id?: number }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { commentId } = request.params;
      const { user_id } = request.body;

      await ReviewCommentService.deleteReviewComment(parseInt(commentId), user_id);
      reply.send({ message: "Comment deleted successfully" });
    } catch (error: any) {
      reply.status(400).send({ message: error.message });
    }
  }
}

export class ProductViewController {
  static async trackView(
    request: FastifyRequest<{
      Params: { id: string };
      Body: { user_id?: number; username?: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const { user_id, username } = request.body;
      
      const ip_address = request.ip;
      const user_agent = request.headers['user-agent'];

      const viewData: {
        user_id?: number;
        username?: string;
        ip_address?: string;
        user_agent?: string;
      } = {
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

      const view = await ProductViewService.trackProductView(parseInt(id), viewData);

      if (view) {
        reply.status(201).send({ message: "View tracked", view });
      } else {
        reply.send({ message: "View already tracked recently" });
      }
    } catch (error: any) {
      reply.status(500).send({ message: "Error tracking view", error: error.message });
    }
  }

  static async getViewStats(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const stats = await ProductViewService.getProductViewCount(parseInt(id));
      reply.send(stats);
    } catch (error: any) {
      reply.status(500).send({ message: "Error getting view stats", error: error.message });
    }
  }

  static async getProductWithViews(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const product = await ProductViewService.getProductWithViews(parseInt(id));
      
      if (!product) {
        return reply.status(404).send({ message: "Product not found" });
      }
      
      reply.send(product);
    } catch (error: any) {
      reply.status(500).send({ message: "Error getting product with views", error: error.message });
    }
  }

  static async getMostViewed(
    request: FastifyRequest<{ Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { limit } = request.query as { limit?: string };
      const limitNumber = parseInt(limit || '10');
      const products = await ProductViewService.getMostViewedProducts(limitNumber);
      reply.send(products);
    } catch (error: any) {
      reply.status(500).send({ message: "Error getting most viewed products", error: error.message });
    }
  }
}