import { Prisma } from "@prisma/client";
import { z } from "zod";
import { orderSchema } from '../models/order';
export declare const OrderService: {
    getAllOrders(page: number, limit: number, status?: string, userId?: number): Promise<({
        payments: {
            id: number;
            order_id: number | null;
            user_id: number | null;
            payment_method: string | null;
            transaction_id: string;
            customerMsisdn: string | null;
            status: string | null;
            created_at: Date | null;
            processor: string | null;
            processor_fee: Prisma.Decimal | null;
            net_amount: Prisma.Decimal | null;
            merchant_id: number | null;
            is_held: boolean | null;
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
        financials: {
            id: number;
            order_id: number | null;
            type: string | null;
            amount: Prisma.Decimal;
            description: string | null;
            created_at: Date | null;
        }[];
    } & {
        id: number;
        user_id: number | null;
        referred_by_agent_id: number | null;
        agent_code_used: string | null;
        total_price: Prisma.Decimal;
        status: string | null;
        created_at: Date | null;
        browser_used: string | null;
        updated_at: Date | null;
    })[]>;
    getOrderById(id: number): Promise<({
        payments: {
            id: number;
            order_id: number | null;
            user_id: number | null;
            payment_method: string | null;
            transaction_id: string;
            customerMsisdn: string | null;
            status: string | null;
            created_at: Date | null;
            processor: string | null;
            processor_fee: Prisma.Decimal | null;
            net_amount: Prisma.Decimal | null;
            merchant_id: number | null;
            is_held: boolean | null;
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
        financials: {
            id: number;
            order_id: number | null;
            type: string | null;
            amount: Prisma.Decimal;
            description: string | null;
            created_at: Date | null;
        }[];
    } & {
        id: number;
        user_id: number | null;
        referred_by_agent_id: number | null;
        agent_code_used: string | null;
        total_price: Prisma.Decimal;
        status: string | null;
        created_at: Date | null;
        browser_used: string | null;
        updated_at: Date | null;
    }) | null>;
    createOrder(data: z.infer<typeof orderSchema>): Promise<{
        payments: {
            id: number;
            order_id: number | null;
            user_id: number | null;
            payment_method: string | null;
            transaction_id: string;
            customerMsisdn: string | null;
            status: string | null;
            created_at: Date | null;
            processor: string | null;
            processor_fee: Prisma.Decimal | null;
            net_amount: Prisma.Decimal | null;
            merchant_id: number | null;
            is_held: boolean | null;
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
        financials: {
            id: number;
            order_id: number | null;
            type: string | null;
            amount: Prisma.Decimal;
            description: string | null;
            created_at: Date | null;
        }[];
    } & {
        id: number;
        user_id: number | null;
        referred_by_agent_id: number | null;
        agent_code_used: string | null;
        total_price: Prisma.Decimal;
        status: string | null;
        created_at: Date | null;
        browser_used: string | null;
        updated_at: Date | null;
    }>;
    updateOrder(id: number, data: Partial<z.infer<typeof orderSchema>>): Promise<{
        id: number;
        user_id: number | null;
        referred_by_agent_id: number | null;
        agent_code_used: string | null;
        total_price: Prisma.Decimal;
        status: string | null;
        created_at: Date | null;
        browser_used: string | null;
        updated_at: Date | null;
    }>;
    deleteOrder(id: number): Promise<{
        id: number;
        user_id: number | null;
        referred_by_agent_id: number | null;
        agent_code_used: string | null;
        total_price: Prisma.Decimal;
        status: string | null;
        created_at: Date | null;
        browser_used: string | null;
        updated_at: Date | null;
    }>;
    addOrderItem(orderId: number, itemData: {
        product_id: number | null;
        quantity: number;
        price: number;
    }): Promise<{
        id: number;
        order_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }>;
    updateOrderItem(itemId: number, data: {
        quantity?: number;
        price?: number;
    }): Promise<{
        id: number;
        order_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }>;
    removeOrderItem(itemId: number): Promise<{
        id: number;
        order_id: number | null;
        product_id: number | null;
        quantity: number;
        price: Prisma.Decimal;
        created_at: Date | null;
        updated_at: Date | null;
    }>;
    updateOrderStatus(id: number, status: string): Promise<{
        id: number;
        user_id: number | null;
        referred_by_agent_id: number | null;
        agent_code_used: string | null;
        total_price: Prisma.Decimal;
        status: string | null;
        created_at: Date | null;
        browser_used: string | null;
        updated_at: Date | null;
    }>;
    getOrdersByUserId(userId: number, page: number, limit: number, status?: string): Promise<({
        payments: {
            id: number;
            order_id: number | null;
            user_id: number | null;
            payment_method: string | null;
            transaction_id: string;
            customerMsisdn: string | null;
            status: string | null;
            created_at: Date | null;
            processor: string | null;
            processor_fee: Prisma.Decimal | null;
            net_amount: Prisma.Decimal | null;
            merchant_id: number | null;
            is_held: boolean | null;
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
        financials: {
            id: number;
            order_id: number | null;
            type: string | null;
            amount: Prisma.Decimal;
            description: string | null;
            created_at: Date | null;
        }[];
    } & {
        id: number;
        user_id: number | null;
        referred_by_agent_id: number | null;
        agent_code_used: string | null;
        total_price: Prisma.Decimal;
        status: string | null;
        created_at: Date | null;
        browser_used: string | null;
        updated_at: Date | null;
    })[]>;
};
