import { Prisma } from "@prisma/client";
import { z } from "zod";
import { shippingDetailsSchema } from "../models/shippingdetails";
export declare class UserPurchaseService {
    static getUsersWithPurchases(): Promise<{
        username: string;
        email: string;
        phone: string | null;
        id: number;
        created_at: Date | null;
        orders: ({
            users: {
                username: string;
                email: string;
                id: number;
            } | null;
            payments: {
                status: string | null;
                id: number;
                created_at: Date | null;
                user_id: number | null;
                order_id: number | null;
                payment_method: string | null;
                transaction_id: string;
                customerMsisdn: string | null;
            }[];
            order_items: ({
                products: {
                    name: string;
                    id: number;
                    price: Prisma.Decimal;
                    image_url: string | null;
                } | null;
            } & {
                id: number;
                created_at: Date | null;
                updated_at: Date | null;
                price: Prisma.Decimal;
                quantity: number;
                order_id: number | null;
                product_id: number | null;
            })[];
        } & {
            status: string | null;
            id: number;
            created_at: Date | null;
            updated_at: Date | null;
            user_id: number | null;
            total_price: Prisma.Decimal;
            browser_used: string | null;
        })[];
        shipping_details: {
            email: string;
            phone: string;
            id: number;
            created_at: Date | null;
            user_id: number | null;
            full_name: string;
            country: string;
            city: string;
            street: string;
            apartment: string | null;
            postal_code: string;
        }[];
        _count: {
            orders: number;
            payments: number;
        };
    }[]>;
    static getUserPurchaseHistory(userId: number): Promise<{
        username: string;
        email: string;
        phone: string | null;
        id: number;
        orders: ({
            payments: {
                status: string | null;
                id: number;
                created_at: Date | null;
                user_id: number | null;
                order_id: number | null;
                payment_method: string | null;
                transaction_id: string;
                customerMsisdn: string | null;
            }[];
            order_items: ({
                products: {
                    description: string | null;
                    name: string;
                    id: number;
                    created_at: Date | null;
                    updated_at: Date | null;
                    price: Prisma.Decimal;
                    stock_quantity: number | null;
                    category_id: number | null;
                    image_url: string | null;
                    discount_percentage: number | null;
                    views: number | null;
                } | null;
            } & {
                id: number;
                created_at: Date | null;
                updated_at: Date | null;
                price: Prisma.Decimal;
                quantity: number;
                order_id: number | null;
                product_id: number | null;
            })[];
        } & {
            status: string | null;
            id: number;
            created_at: Date | null;
            updated_at: Date | null;
            user_id: number | null;
            total_price: Prisma.Decimal;
            browser_used: string | null;
        })[];
        shipping_details: {
            email: string;
            phone: string;
            id: number;
            created_at: Date | null;
            user_id: number | null;
            full_name: string;
            country: string;
            city: string;
            street: string;
            apartment: string | null;
            postal_code: string;
        }[];
        _count: {
            orders: number;
        };
    } | null>;
    static createOrderWithPayment(data: {
        user_id: number;
        total_price: number;
        browser_used?: string;
        order_items: Array<{
            product_id: number;
            quantity: number;
            price: number;
        }>;
        payment: {
            payment_method: string;
            transaction_id: string;
            customerMsisdn?: string;
        };
        shipping_details: z.infer<typeof shippingDetailsSchema>;
    }): Promise<{
        order: {
            status: string | null;
            id: number;
            created_at: Date | null;
            updated_at: Date | null;
            user_id: number | null;
            total_price: Prisma.Decimal;
            browser_used: string | null;
        };
        orderItems: {
            id: number;
            created_at: Date | null;
            updated_at: Date | null;
            price: Prisma.Decimal;
            quantity: number;
            order_id: number | null;
            product_id: number | null;
        }[];
        payment: {
            status: string | null;
            id: number;
            created_at: Date | null;
            user_id: number | null;
            order_id: number | null;
            payment_method: string | null;
            transaction_id: string;
            customerMsisdn: string | null;
        };
        shipping: {
            email: string;
            phone: string;
            id: number;
            created_at: Date | null;
            user_id: number | null;
            full_name: string;
            country: string;
            city: string;
            street: string;
            apartment: string | null;
            postal_code: string;
        };
    }>;
    static updatePaymentStatus(transactionId: string, status: "Completed" | "Failed" | "Pending"): Promise<{
        status: string | null;
        id: number;
        created_at: Date | null;
        user_id: number | null;
        order_id: number | null;
        payment_method: string | null;
        transaction_id: string;
        customerMsisdn: string | null;
    }>;
    static getOrderById(orderId: number): Promise<({
        users: {
            username: string;
            email: string;
            phone: string | null;
            id: number;
        } | null;
        payments: {
            status: string | null;
            id: number;
            created_at: Date | null;
            user_id: number | null;
            order_id: number | null;
            payment_method: string | null;
            transaction_id: string;
            customerMsisdn: string | null;
        }[];
        order_items: ({
            products: {
                description: string | null;
                name: string;
                id: number;
                created_at: Date | null;
                updated_at: Date | null;
                price: Prisma.Decimal;
                stock_quantity: number | null;
                category_id: number | null;
                image_url: string | null;
                discount_percentage: number | null;
                views: number | null;
            } | null;
        } & {
            id: number;
            created_at: Date | null;
            updated_at: Date | null;
            price: Prisma.Decimal;
            quantity: number;
            order_id: number | null;
            product_id: number | null;
        })[];
    } & {
        status: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        total_price: Prisma.Decimal;
        browser_used: string | null;
    }) | null>;
    static getUserShippingDetails(userId: number): Promise<{
        email: string;
        phone: string;
        id: number;
        created_at: Date | null;
        user_id: number | null;
        full_name: string;
        country: string;
        city: string;
        street: string;
        apartment: string | null;
        postal_code: string;
    }[]>;
    static getPaymentByTransactionId(transactionId: string): Promise<({
        users: {
            username: string;
            email: string;
            phone: string | null;
            id: number;
        } | null;
        orders: ({
            order_items: ({
                products: {
                    description: string | null;
                    name: string;
                    id: number;
                    created_at: Date | null;
                    updated_at: Date | null;
                    price: Prisma.Decimal;
                    stock_quantity: number | null;
                    category_id: number | null;
                    image_url: string | null;
                    discount_percentage: number | null;
                    views: number | null;
                } | null;
            } & {
                id: number;
                created_at: Date | null;
                updated_at: Date | null;
                price: Prisma.Decimal;
                quantity: number;
                order_id: number | null;
                product_id: number | null;
            })[];
        } & {
            status: string | null;
            id: number;
            created_at: Date | null;
            updated_at: Date | null;
            user_id: number | null;
            total_price: Prisma.Decimal;
            browser_used: string | null;
        }) | null;
    } & {
        status: string | null;
        id: number;
        created_at: Date | null;
        user_id: number | null;
        order_id: number | null;
        payment_method: string | null;
        transaction_id: string;
        customerMsisdn: string | null;
    }) | null>;
    static getPurchaseStatistics(): Promise<{
        totalOrders: number;
        completedOrders: number;
        pendingOrders: number;
        totalRevenue: number | Prisma.Decimal;
        uniqueCustomers: number;
    }>;
}
