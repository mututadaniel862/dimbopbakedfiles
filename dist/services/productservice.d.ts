import { Prisma } from "@prisma/client";
import { productSchema } from "../models/products";
import { z } from "zod";
export declare const getAllProducts: () => Promise<({
    cart: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
    }[];
    reviews: {
        username: string;
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }[];
    order_items: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
    }[];
    categories: {
        name: string;
        id: number;
    } | null;
} & {
    name: string;
    description: string | null;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    uploaded_by: number | null;
    approval_status: string;
    approved_by: number | null;
    approved_at: Date | null;
    rejection_reason: string | null;
    approval_deadline: Date | null;
    is_visible: boolean;
})[]>;
export declare const getProductById: (id: number) => Promise<({
    cart: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
    }[];
    reviews: {
        username: string;
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }[];
    order_items: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
    }[];
    categories: {
        name: string;
        id: number;
    } | null;
} & {
    name: string;
    description: string | null;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    uploaded_by: number | null;
    approval_status: string;
    approved_by: number | null;
    approved_at: Date | null;
    rejection_reason: string | null;
    approval_deadline: Date | null;
    is_visible: boolean;
}) | null>;
export declare const createProduct: (data: z.infer<typeof productSchema>, file?: {
    buffer: Buffer;
    filename: string;
    mimetype: string;
}) => Promise<{
    cart: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
    }[];
    reviews: {
        username: string;
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }[];
    order_items: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
    }[];
    categories: {
        name: string;
        id: number;
    } | null;
} & {
    name: string;
    description: string | null;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    uploaded_by: number | null;
    approval_status: string;
    approved_by: number | null;
    approved_at: Date | null;
    rejection_reason: string | null;
    approval_deadline: Date | null;
    is_visible: boolean;
}>;
export declare const addProductToCart: (userId: number, productId: number, quantity: number) => Promise<{
    products: {
        name: string;
        description: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        stock_quantity: number | null;
        category_id: number | null;
        image_url: string | null;
        discount_percentage: number | null;
        views: number | null;
        uploaded_by: number | null;
        approval_status: string;
        approved_by: number | null;
        approved_at: Date | null;
        rejection_reason: string | null;
        approval_deadline: Date | null;
        is_visible: boolean;
    } | null;
} & {
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    user_id: number | null;
    price: Prisma.Decimal;
    product_id: number | null;
    quantity: number;
}>;
export declare const updateCartItemQuantity: (cartItemId: number, userId: number, newQuantity: number) => Promise<{
    products: {
        id: number;
        stock_quantity: number | null;
    } | null;
} & {
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    user_id: number | null;
    price: Prisma.Decimal;
    product_id: number | null;
    quantity: number;
}>;
export declare const deleteCartItem: (cartItemId: number, userId: number, restoreStock?: boolean) => Promise<{
    products: {
        id: number;
        stock_quantity: number | null;
    } | null;
} & {
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    user_id: number | null;
    price: Prisma.Decimal;
    product_id: number | null;
    quantity: number;
}>;
export declare const getUserCart: (userId: number) => Promise<{
    items: ({
        products: ({
            categories: {
                name: string;
                id: number;
            } | null;
        } & {
            name: string;
            description: string | null;
            id: number;
            created_at: Date | null;
            updated_at: Date | null;
            price: Prisma.Decimal;
            stock_quantity: number | null;
            category_id: number | null;
            image_url: string | null;
            discount_percentage: number | null;
            views: number | null;
            uploaded_by: number | null;
            approval_status: string;
            approved_by: number | null;
            approved_at: Date | null;
            rejection_reason: string | null;
            approval_deadline: Date | null;
            is_visible: boolean;
        }) | null;
    } & {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
    })[];
    subtotal: number;
    totalItems: number;
    totalDiscount: number;
    grandTotal: number;
}>;
export declare const clearUserCart: (userId: number) => Promise<Prisma.BatchPayload>;
export declare const updateProduct: (id: number, data: Partial<z.infer<typeof productSchema>>, file?: {
    buffer: Buffer;
    filename: string;
    mimetype: string;
}) => Promise<{
    cart: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
    }[];
    reviews: {
        username: string;
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }[];
    order_items: {
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
    }[];
    categories: {
        name: string;
        id: number;
    } | null;
} & {
    name: string;
    description: string | null;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    uploaded_by: number | null;
    approval_status: string;
    approved_by: number | null;
    approved_at: Date | null;
    rejection_reason: string | null;
    approval_deadline: Date | null;
    is_visible: boolean;
}>;
export declare const deleteProduct: (id: number) => Promise<{
    name: string;
    description: string | null;
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    discount_percentage: number | null;
    views: number | null;
    uploaded_by: number | null;
    approval_status: string;
    approved_by: number | null;
    approved_at: Date | null;
    rejection_reason: string | null;
    approval_deadline: Date | null;
    is_visible: boolean;
}>;
export declare const getAllProductImages: () => Promise<(string | null)[]>;
export declare class ReviewService {
    static addReview(productId: number, data: {
        user_id?: number;
        rating: number;
        comment: string;
        username?: string;
    }): Promise<{
        username: string;
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }>;
    static getProductReviews(productId: number): Promise<{
        username: string;
        likes_count: number;
        dislikes_count: number;
        comments_count: number;
        users: {
            email: string;
            username: string | null;
            id: number;
        } | null;
        review_likes: ({
            users: {
                username: string | null;
                id: number;
            } | null;
        } & {
            id: number;
            created_at: Date;
            user_id: number | null;
            is_like: boolean;
            review_id: number;
        })[];
        review_comments: ({
            users: {
                username: string | null;
                id: number;
            } | null;
        } & {
            username: string;
            id: number;
            created_at: Date;
            user_id: number | null;
            comment: string;
            review_id: number;
        })[];
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }[]>;
    static deleteReview(reviewId: number, userId?: number): Promise<{
        username: string;
        id: number;
        created_at: Date | null;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
    }>;
}
export declare class ReviewLikeService {
    static toggleReviewLike(reviewId: number, userId: number, isLike: boolean): Promise<{
        id: number;
        created_at: Date;
        user_id: number | null;
        is_like: boolean;
        review_id: number;
    }>;
    static getReviewLikeStatus(reviewId: number, userId: number): Promise<boolean | null>;
}
export declare class ReviewCommentService {
    static addReviewComment(reviewId: number, data: {
        user_id?: number;
        comment: string;
        username?: string;
    }): Promise<{
        users: {
            username: string | null;
            id: number;
        } | null;
    } & {
        username: string;
        id: number;
        created_at: Date;
        user_id: number | null;
        comment: string;
        review_id: number;
    }>;
    static getReviewComments(reviewId: number): Promise<{
        username: string;
        users: {
            username: string | null;
            id: number;
        } | null;
        id: number;
        created_at: Date;
        user_id: number | null;
        comment: string;
        review_id: number;
    }[]>;
    static deleteReviewComment(commentId: number, userId?: number): Promise<{
        username: string;
        id: number;
        created_at: Date;
        user_id: number | null;
        comment: string;
        review_id: number;
    }>;
}
export declare class ProductViewService {
    static trackProductView(productId: number, data: {
        user_id?: number;
        ip_address?: string;
        user_agent?: string;
        username?: string;
    }): Promise<{
        username: string;
        id: number;
        user_id: number | null;
        product_id: number;
        ip_address: string | null;
        user_agent: string | null;
        viewed_at: Date;
    } | null>;
    static getProductViewCount(productId: number): Promise<{
        total_views: number;
        unique_users: number;
        today_views: number;
        week_views: number;
    }>;
    static getProductWithViews(productId: number): Promise<({
        product_views: {
            users: {
                username: string | null;
                id: number;
            } | null;
            id: number;
            viewed_at: Date;
        }[];
        _count: {
            reviews: number;
            product_views: number;
        };
    } & {
        name: string;
        description: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        stock_quantity: number | null;
        category_id: number | null;
        image_url: string | null;
        discount_percentage: number | null;
        views: number | null;
        uploaded_by: number | null;
        approval_status: string;
        approved_by: number | null;
        approved_at: Date | null;
        rejection_reason: string | null;
        approval_deadline: Date | null;
        is_visible: boolean;
    }) | null>;
    static getMostViewedProducts(limit?: number): Promise<({
        _count: {
            reviews: number;
            product_views: number;
        };
    } & {
        name: string;
        description: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        stock_quantity: number | null;
        category_id: number | null;
        image_url: string | null;
        discount_percentage: number | null;
        views: number | null;
        uploaded_by: number | null;
        approval_status: string;
        approved_by: number | null;
        approved_at: Date | null;
        rejection_reason: string | null;
        approval_deadline: Date | null;
        is_visible: boolean;
    })[]>;
}
