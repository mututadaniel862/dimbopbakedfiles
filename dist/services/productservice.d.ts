import { Prisma } from "@prisma/client";
import { productSchema } from "../models/products";
import { z } from "zod";
export declare const getAllProducts: () => Promise<({
    cart: {
        id: number;
        user_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }[];
    reviews: {
        id: number;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
        username: string;
        created_at: Date | null;
    }[];
    order_items: {
        id: number;
        order_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }[];
    categories: {
        id: number;
        name: string;
    } | null;
} & {
    id: number;
    name: string;
    description: string | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    discount_percentage: number | null;
    views: number | null;
    whatsapp_number: string | null;
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
        user_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }[];
    reviews: {
        id: number;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
        username: string;
        created_at: Date | null;
    }[];
    order_items: {
        id: number;
        order_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }[];
    categories: {
        id: number;
        name: string;
    } | null;
} & {
    id: number;
    name: string;
    description: string | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    discount_percentage: number | null;
    views: number | null;
    whatsapp_number: string | null;
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
        user_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }[];
    reviews: {
        id: number;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
        username: string;
        created_at: Date | null;
    }[];
    order_items: {
        id: number;
        order_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }[];
    categories: {
        id: number;
        name: string;
    } | null;
} & {
    id: number;
    name: string;
    description: string | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    discount_percentage: number | null;
    views: number | null;
    whatsapp_number: string | null;
    uploaded_by: number | null;
    approval_status: string;
    approved_by: number | null;
    approved_at: Date | null;
    rejection_reason: string | null;
    approval_deadline: Date | null;
    is_visible: boolean;
}>;
export declare const addProductToCart: (userId: number | null, productId: number, quantity: number) => Promise<{
    products: {
        id: number;
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        stock_quantity: number | null;
        category_id: number | null;
        image_url: string | null;
        created_at: Date | null;
        updated_at: Date | null;
        discount_percentage: number | null;
        views: number | null;
        whatsapp_number: string | null;
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
    user_id: number | null;
    product_id: number | null;
    quantity: number;
    price: Prisma.Decimal;
    created_at: Date | null;
    updated_at: Date | null;
}>;
export declare const updateCartItemQuantity: (cartItemId: number, userId: number | null, newQuantity: number) => Promise<{
    products: {
        id: number;
        stock_quantity: number | null;
    } | null;
} & {
    id: number;
    user_id: number | null;
    product_id: number | null;
    quantity: number;
    price: Prisma.Decimal;
    created_at: Date | null;
    updated_at: Date | null;
}>;
export declare const deleteCartItem: (cartItemId: number, userId: number | null, restoreStock?: boolean) => Promise<{
    products: {
        id: number;
        stock_quantity: number | null;
    } | null;
} & {
    id: number;
    user_id: number | null;
    product_id: number | null;
    quantity: number;
    price: Prisma.Decimal;
    created_at: Date | null;
    updated_at: Date | null;
}>;
export declare const getUserCart: (userId: number | null) => Promise<{
    items: ({
        products: ({
            categories: {
                id: number;
                name: string;
            } | null;
        } & {
            id: number;
            name: string;
            description: string | null;
            price: Prisma.Decimal;
            stock_quantity: number | null;
            category_id: number | null;
            image_url: string | null;
            created_at: Date | null;
            updated_at: Date | null;
            discount_percentage: number | null;
            views: number | null;
            whatsapp_number: string | null;
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
        user_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    })[];
    subtotal: number;
    totalItems: number;
    totalDiscount: number;
    grandTotal: number;
}>;
export declare const clearUserCart: (userId: number | null) => Promise<Prisma.BatchPayload>;
export declare const updateProduct: (id: number, data: Partial<z.infer<typeof productSchema>>, file?: {
    buffer: Buffer;
    filename: string;
    mimetype: string;
}) => Promise<{
    cart: {
        id: number;
        user_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }[];
    reviews: {
        id: number;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
        username: string;
        created_at: Date | null;
    }[];
    order_items: {
        id: number;
        order_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }[];
    categories: {
        id: number;
        name: string;
    } | null;
} & {
    id: number;
    name: string;
    description: string | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    discount_percentage: number | null;
    views: number | null;
    whatsapp_number: string | null;
    uploaded_by: number | null;
    approval_status: string;
    approved_by: number | null;
    approved_at: Date | null;
    rejection_reason: string | null;
    approval_deadline: Date | null;
    is_visible: boolean;
}>;
export declare const deleteProduct: (id: number) => Promise<{
    id: number;
    name: string;
    description: string | null;
    price: Prisma.Decimal;
    stock_quantity: number | null;
    category_id: number | null;
    image_url: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    discount_percentage: number | null;
    views: number | null;
    whatsapp_number: string | null;
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
        id: number;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
        username: string;
        created_at: Date | null;
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
            review_id: number;
            user_id: number | null;
            is_like: boolean;
            created_at: Date;
        })[];
        review_comments: ({
            users: {
                username: string | null;
                id: number;
            } | null;
        } & {
            id: number;
            review_id: number;
            user_id: number | null;
            comment: string;
            username: string;
            created_at: Date;
        })[];
        id: number;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
        created_at: Date | null;
    }[]>;
    static deleteReview(reviewId: number, userId?: number): Promise<{
        id: number;
        user_id: number | null;
        product_id: number | null;
        rating: number | null;
        comment: string | null;
        username: string;
        created_at: Date | null;
    }>;
}
export declare class ReviewLikeService {
    static toggleReviewLike(reviewId: number, userId: number, isLike: boolean): Promise<{
        id: number;
        review_id: number;
        user_id: number | null;
        is_like: boolean;
        created_at: Date;
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
        id: number;
        review_id: number;
        user_id: number | null;
        comment: string;
        username: string;
        created_at: Date;
    }>;
    static getReviewComments(reviewId: number): Promise<{
        username: string;
        users: {
            username: string | null;
            id: number;
        } | null;
        id: number;
        review_id: number;
        user_id: number | null;
        comment: string;
        created_at: Date;
    }[]>;
    static deleteReviewComment(commentId: number, userId?: number): Promise<{
        id: number;
        review_id: number;
        user_id: number | null;
        comment: string;
        username: string;
        created_at: Date;
    }>;
}
export declare class ProductViewService {
    static trackProductView(productId: number, data: {
        user_id?: number;
        ip_address?: string;
        user_agent?: string;
        username?: string;
    }): Promise<{
        id: number;
        product_id: number;
        user_id: number | null;
        ip_address: string | null;
        user_agent: string | null;
        username: string;
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
        id: number;
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        stock_quantity: number | null;
        category_id: number | null;
        image_url: string | null;
        created_at: Date | null;
        updated_at: Date | null;
        discount_percentage: number | null;
        views: number | null;
        whatsapp_number: string | null;
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
        id: number;
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        stock_quantity: number | null;
        category_id: number | null;
        image_url: string | null;
        created_at: Date | null;
        updated_at: Date | null;
        discount_percentage: number | null;
        views: number | null;
        whatsapp_number: string | null;
        uploaded_by: number | null;
        approval_status: string;
        approved_by: number | null;
        approved_at: Date | null;
        rejection_reason: string | null;
        approval_deadline: Date | null;
        is_visible: boolean;
    })[]>;
}
