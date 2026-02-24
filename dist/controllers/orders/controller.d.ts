import { FastifyRequest, FastifyReply } from 'fastify';
import { orderSchema } from '../../models/order';
import { z } from 'zod';
type OrderParams = {
    id: string;
};
type OrderQuery = {
    page?: string;
    limit?: string;
    status?: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    userId?: string;
};
type OrderBody = z.infer<typeof orderSchema>;
export declare const OrderController: {
    getAllOrders(request: FastifyRequest<{
        Querystring: OrderQuery;
    }>, reply: FastifyReply): Promise<void>;
    getOrderById(request: FastifyRequest<{
        Params: OrderParams;
    }>, reply: FastifyReply): Promise<void>;
    createOrder(request: FastifyRequest<{
        Body: OrderBody;
    }>, reply: FastifyReply): Promise<void>;
    updateOrder(request: FastifyRequest<{
        Params: OrderParams;
        Body: Partial<OrderBody>;
    }>, reply: FastifyReply): Promise<void>;
    deleteOrder(request: FastifyRequest<{
        Params: OrderParams;
    }>, reply: FastifyReply): Promise<void>;
    addOrderItem(request: FastifyRequest<{
        Params: OrderParams;
        Body: {
            product_id: number | null;
            quantity: number;
            price: number;
        };
    }>, reply: FastifyReply): Promise<void>;
    updateOrderItem(request: FastifyRequest<{
        Params: {
            orderId: string;
            itemId: string;
        };
        Body: {
            quantity?: number;
            price?: number;
        };
    }>, reply: FastifyReply): Promise<void>;
    removeOrderItem(request: FastifyRequest<{
        Params: {
            orderId: string;
            itemId: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    updateOrderStatus(request: FastifyRequest<{
        Params: OrderParams;
        Body: {
            status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
        };
    }>, reply: FastifyReply): Promise<void>;
    getOrdersByUser(request: FastifyRequest<{
        Params: {
            userId: string;
        };
        Querystring: OrderQuery;
    }>, reply: FastifyReply): Promise<void>;
};
export {};
