import { FastifyRequest, FastifyReply } from 'fastify';
type ProductParams = {
    id: string;
};
export declare const createProductHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
export declare const getProductsHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const getProductImagesHandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const getUserCartHandler: (request: FastifyRequest<{
    Params: {
        userId: string;
    };
}>, reply: FastifyReply) => Promise<void>;
export declare const deleteCartItemHandler: (request: FastifyRequest<{
    Params: {
        cartItemId: string;
        userId: string;
    };
}>, reply: FastifyReply) => Promise<void>;
export declare const addProductToCartHandler: (request: FastifyRequest<{
    Params: {
        userId: string;
    };
    Body: {
        productId: number;
        quantity: number;
    };
}>, reply: FastifyReply) => Promise<undefined>;
export declare const updateCartItemQuantityHandler: (request: FastifyRequest<{
    Params: {
        cartItemId: string;
        userId: string;
    };
    Body: {
        quantity: number;
    };
}>, reply: FastifyReply) => Promise<void>;
export declare const getProductHandler: (request: FastifyRequest<{
    Params: ProductParams;
}>, reply: FastifyReply) => Promise<void>;
export declare const updateProductHandler: (request: FastifyRequest<{
    Params: ProductParams;
}>, reply: FastifyReply) => Promise<void>;
export declare const deleteProductHandler: (request: FastifyRequest<{
    Params: ProductParams;
}>, reply: FastifyReply) => Promise<void>;
export declare class ReviewController {
    static addReview(request: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            user_id?: number;
            rating: number;
            comment: string;
            username?: string;
        };
    }>, reply: FastifyReply): Promise<undefined>;
    static getReviews(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    static deleteReview(request: FastifyRequest<{
        Params: {
            reviewId: string;
        };
        Body: {
            user_id?: number;
        };
    }>, reply: FastifyReply): Promise<void>;
}
export declare class ReviewLikeController {
    static toggleLike(request: FastifyRequest<{
        Params: {
            reviewId: string;
        };
        Body: {
            user_id?: number;
            is_like: boolean;
        };
    }>, reply: FastifyReply): Promise<undefined>;
    static getLikeStatus(request: FastifyRequest<{
        Params: {
            reviewId: string;
        };
        Querystring: {
            user_id: string;
        };
    }>, reply: FastifyReply): Promise<undefined>;
}
export declare class ReviewCommentController {
    static addComment(request: FastifyRequest<{
        Params: {
            reviewId: string;
        };
        Body: {
            user_id: number;
            comment: string;
            username?: string;
        };
    }>, reply: FastifyReply): Promise<undefined>;
    static getComments(request: FastifyRequest<{
        Params: {
            reviewId: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    static deleteComment(request: FastifyRequest<{
        Params: {
            commentId: string;
        };
        Body: {
            user_id?: number;
        };
    }>, reply: FastifyReply): Promise<void>;
}
export declare class ProductViewController {
    static trackView(request: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            user_id?: number;
            username?: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    static getViewStats(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    static getProductWithViews(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<undefined>;
    static getMostViewed(request: FastifyRequest<{
        Querystring: {
            limit?: string;
        };
    }>, reply: FastifyReply): Promise<void>;
}
export {};
