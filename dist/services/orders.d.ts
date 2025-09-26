import { Prisma } from "@prisma/client";
import { z } from "zod";
import { orderSchema } from '../models/order';
export declare const OrderService: {
    getAllOrders(page: number, limit: number, status?: string, userId?: number): Promise<({
        payments: {
            status: string | null;
            id: number;
            created_at: Date | null;
            user_id: number | null;
            order_id: number | null;
            payment_method: string | null;
            transaction_id: string;
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
        financials: {
            type: string | null;
            description: string | null;
            id: number;
            created_at: Date | null;
            order_id: number | null;
            amount: Prisma.Decimal;
        }[];
    } & {
        status: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        total_price: Prisma.Decimal;
        browser_used: string | null;
    })[]>;
    getOrderById(id: number): Promise<({
        payments: {
            status: string | null;
            id: number;
            created_at: Date | null;
            user_id: number | null;
            order_id: number | null;
            payment_method: string | null;
            transaction_id: string;
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
        financials: {
            type: string | null;
            description: string | null;
            id: number;
            created_at: Date | null;
            order_id: number | null;
            amount: Prisma.Decimal;
        }[];
    } & {
        status: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        total_price: Prisma.Decimal;
        browser_used: string | null;
    }) | null>;
    createOrder(data: z.infer<typeof orderSchema>): Promise<{
        payments: {
            status: string | null;
            id: number;
            created_at: Date | null;
            user_id: number | null;
            order_id: number | null;
            payment_method: string | null;
            transaction_id: string;
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
        financials: {
            type: string | null;
            description: string | null;
            id: number;
            created_at: Date | null;
            order_id: number | null;
            amount: Prisma.Decimal;
        }[];
    } & {
        status: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        total_price: Prisma.Decimal;
        browser_used: string | null;
    }>;
    updateOrder(id: number, data: Partial<z.infer<typeof orderSchema>>): Promise<{
        status: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        total_price: Prisma.Decimal;
        browser_used: string | null;
    }>;
    deleteOrder(id: number): Promise<{
        status: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        total_price: Prisma.Decimal;
        browser_used: string | null;
    }>;
    addOrderItem(orderId: number, itemData: {
        product_id: number | null;
        quantity: number;
        price: number;
    }): Promise<{
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
    }>;
    updateOrderItem(itemId: number, data: {
        quantity?: number;
        price?: number;
    }): Promise<{
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
    }>;
    removeOrderItem(itemId: number): Promise<{
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        price: Prisma.Decimal;
        product_id: number | null;
        quantity: number;
        order_id: number | null;
    }>;
    updateOrderStatus(id: number, status: string): Promise<{
        status: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        total_price: Prisma.Decimal;
        browser_used: string | null;
    }>;
    getOrdersByUserId(userId: number, page: number, limit: number, status?: string): Promise<({
        payments: {
            status: string | null;
            id: number;
            created_at: Date | null;
            user_id: number | null;
            order_id: number | null;
            payment_method: string | null;
            transaction_id: string;
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
        financials: {
            type: string | null;
            description: string | null;
            id: number;
            created_at: Date | null;
            order_id: number | null;
            amount: Prisma.Decimal;
        }[];
    } & {
        status: string | null;
        id: number;
        created_at: Date | null;
        updated_at: Date | null;
        user_id: number | null;
        total_price: Prisma.Decimal;
        browser_used: string | null;
    })[]>;
};
