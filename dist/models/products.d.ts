import { z } from "zod";
export declare const productSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    stock_quantity: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    image_url: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodDate>;
    updated_at: z.ZodOptional<z.ZodDate>;
    discount_percentage: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    views: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    whatsapp_number: z.ZodOptional<z.ZodString>;
    uploaded_by: z.ZodOptional<z.ZodNumber>;
    approval_status: z.ZodDefault<z.ZodEnum<["pending", "approved", "rejected"]>>;
    approved_by: z.ZodOptional<z.ZodNumber>;
    approved_at: z.ZodOptional<z.ZodDate>;
    rejection_reason: z.ZodOptional<z.ZodString>;
    approval_deadline: z.ZodOptional<z.ZodDate>;
    is_visible: z.ZodDefault<z.ZodBoolean>;
    cart: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        product_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        quantity: z.ZodNumber;
        created_at: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
    }, {
        quantity: number;
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
    }>, "many">>;
    order_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        order_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        product_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        price: number;
        quantity: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }, {
        price: number;
        quantity: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }>, "many">>;
    category_name: z.ZodOptional<z.ZodString>;
    reviews: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user_id: z.ZodNumber;
        product_id: z.ZodNumber;
        rating: z.ZodNumber;
        comment: z.ZodString;
        username: z.ZodDefault<z.ZodString>;
        created_at: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        user_id: number;
        product_id: number;
        rating: number;
        comment: string;
        created_at?: Date | undefined;
    }, {
        user_id: number;
        product_id: number;
        rating: number;
        comment: string;
        username?: string | undefined;
        created_at?: Date | undefined;
    }>, "many">>;
    review_likes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user_id: z.ZodNumber;
        is_like: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        user_id: number;
        is_like: boolean;
    }, {
        user_id: number;
        is_like: boolean;
    }>, "many">>;
    review_comments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user_id: z.ZodOptional<z.ZodNumber>;
        comment: z.ZodString;
        username: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        comment: string;
        user_id?: number | undefined;
    }, {
        comment: string;
        username?: string | undefined;
        user_id?: number | undefined;
    }>, "many">>;
    product_views: z.ZodOptional<z.ZodArray<z.ZodObject<{
        user_id: z.ZodOptional<z.ZodNumber>;
        ip_address: z.ZodOptional<z.ZodString>;
        user_agent: z.ZodOptional<z.ZodString>;
        username: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        user_id?: number | undefined;
        ip_address?: string | undefined;
        user_agent?: string | undefined;
    }, {
        username?: string | undefined;
        user_id?: number | undefined;
        ip_address?: string | undefined;
        user_agent?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    price: number;
    stock_quantity: number;
    discount_percentage: number;
    views: number;
    approval_status: "pending" | "approved" | "rejected";
    is_visible: boolean;
    description?: string | undefined;
    created_at?: Date | undefined;
    updated_at?: Date | undefined;
    cart?: {
        quantity: number;
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
    }[] | undefined;
    reviews?: {
        username: string;
        user_id: number;
        product_id: number;
        rating: number;
        comment: string;
        created_at?: Date | undefined;
    }[] | undefined;
    review_likes?: {
        user_id: number;
        is_like: boolean;
    }[] | undefined;
    review_comments?: {
        username: string;
        comment: string;
        user_id?: number | undefined;
    }[] | undefined;
    product_views?: {
        username: string;
        user_id?: number | undefined;
        ip_address?: string | undefined;
        user_agent?: string | undefined;
    }[] | undefined;
    image_url?: string | undefined;
    whatsapp_number?: string | undefined;
    uploaded_by?: number | undefined;
    approved_by?: number | undefined;
    approved_at?: Date | undefined;
    rejection_reason?: string | undefined;
    approval_deadline?: Date | undefined;
    order_items?: {
        price: number;
        quantity: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }[] | undefined;
    category_name?: string | undefined;
}, {
    name: string;
    price: number;
    description?: string | undefined;
    created_at?: Date | undefined;
    updated_at?: Date | undefined;
    cart?: {
        quantity: number;
        created_at?: Date | undefined;
        user_id?: number | null | undefined;
        product_id?: number | null | undefined;
    }[] | undefined;
    reviews?: {
        user_id: number;
        product_id: number;
        rating: number;
        comment: string;
        username?: string | undefined;
        created_at?: Date | undefined;
    }[] | undefined;
    review_likes?: {
        user_id: number;
        is_like: boolean;
    }[] | undefined;
    review_comments?: {
        comment: string;
        username?: string | undefined;
        user_id?: number | undefined;
    }[] | undefined;
    product_views?: {
        username?: string | undefined;
        user_id?: number | undefined;
        ip_address?: string | undefined;
        user_agent?: string | undefined;
    }[] | undefined;
    stock_quantity?: number | undefined;
    image_url?: string | undefined;
    discount_percentage?: number | undefined;
    views?: number | undefined;
    whatsapp_number?: string | undefined;
    uploaded_by?: number | undefined;
    approval_status?: "pending" | "approved" | "rejected" | undefined;
    approved_by?: number | undefined;
    approved_at?: Date | undefined;
    rejection_reason?: string | undefined;
    approval_deadline?: Date | undefined;
    is_visible?: boolean | undefined;
    order_items?: {
        price: number;
        quantity: number;
        product_id?: number | null | undefined;
        order_id?: number | null | undefined;
    }[] | undefined;
    category_name?: string | undefined;
}>;
