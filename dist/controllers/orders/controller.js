"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const orders_1 = require("../../services/orders");
exports.OrderController = {
    // Get all orders with optional filtering and pagination
    async getAllOrders(request, reply) {
        try {
            const { page = '1', limit = '10', status, userId } = request.query;
            const orders = await orders_1.OrderService.getAllOrders(parseInt(page), parseInt(limit), status, userId ? parseInt(userId) : undefined);
            reply.send(orders);
        }
        catch (error) {
            reply.status(500).send({
                message: 'Error fetching orders',
                error: error.message
            });
        }
    },
    // Get a single order by ID
    async getOrderById(request, reply) {
        try {
            const { id } = request.params;
            const order = await orders_1.OrderService.getOrderById(parseInt(id));
            if (!order) {
                reply.status(404).send({ message: 'Order not found' });
                return;
            }
            reply.send(order);
        }
        catch (error) {
            reply.status(500).send({
                message: 'Error fetching order',
                error: error.message
            });
        }
    },
    // Create a new order
    async createOrder(request, reply) {
        try {
            const order = await orders_1.OrderService.createOrder(request.body);
            reply.status(201).send(order);
        }
        catch (error) {
            reply.status(400).send({
                message: 'Invalid order data',
                error: error.message
            });
        }
    },
    // Update an existing order
    async updateOrder(request, reply) {
        try {
            const { id } = request.params;
            const updatedOrder = await orders_1.OrderService.updateOrder(parseInt(id), request.body);
            if (!updatedOrder) {
                reply.status(404).send({ message: 'Order not found' });
                return;
            }
            reply.send(updatedOrder);
        }
        catch (error) {
            reply.status(400).send({
                message: 'Error updating order',
                error: error.message
            });
        }
    },
    // Delete an order
    async deleteOrder(request, reply) {
        try {
            const { id } = request.params;
            await orders_1.OrderService.deleteOrder(parseInt(id));
            reply.status(204).send();
        }
        catch (error) {
            reply.status(500).send({
                message: 'Error deleting order',
                error: error.message
            });
        }
    },
    // Order Items Controllers
    async addOrderItem(request, reply) {
        try {
            const { id } = request.params;
            const orderItem = await orders_1.OrderService.addOrderItem(parseInt(id), request.body);
            reply.status(201).send(orderItem);
        }
        catch (error) {
            reply.status(400).send({
                message: 'Error adding item to order',
                error: error.message
            });
        }
    },
    async updateOrderItem(request, reply) {
        try {
            const { orderId, itemId } = request.params;
            const updatedItem = await orders_1.OrderService.updateOrderItem(parseInt(itemId), request.body);
            reply.send(updatedItem);
        }
        catch (error) {
            reply.status(400).send({
                message: 'Error updating order item',
                error: error.message
            });
        }
    },
    async removeOrderItem(request, reply) {
        try {
            const { itemId } = request.params;
            await orders_1.OrderService.removeOrderItem(parseInt(itemId));
            reply.status(204).send();
        }
        catch (error) {
            reply.status(500).send({
                message: 'Error removing item from order',
                error: error.message
            });
        }
    },
    // Order Status Management
    async updateOrderStatus(request, reply) {
        try {
            const { id } = request.params;
            const updatedOrder = await orders_1.OrderService.updateOrderStatus(parseInt(id), request.body.status);
            if (!updatedOrder) {
                reply.status(404).send({ message: 'Order not found' });
                return;
            }
            reply.send(updatedOrder);
        }
        catch (error) {
            reply.status(400).send({
                message: 'Error updating order status',
                error: error.message
            });
        }
    },
    // Get orders by user ID
    async getOrdersByUser(request, reply) {
        try {
            const { userId } = request.params;
            const { page = '1', limit = '10', status } = request.query;
            const orders = await orders_1.OrderService.getOrdersByUserId(parseInt(userId), parseInt(page), parseInt(limit), status);
            reply.send(orders);
        }
        catch (error) {
            reply.status(500).send({
                message: 'Error fetching user orders',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=controller.js.map