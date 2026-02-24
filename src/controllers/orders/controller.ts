import { FastifyRequest, FastifyReply } from 'fastify';
import { OrderService } from '../../services/orders';
import { orderSchema } from '../../models/order';
import { z } from 'zod';

// Type definitions for request parameters
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

export const OrderController = {
  // Get all orders with optional filtering and pagination
  async getAllOrders(
    request: FastifyRequest<{ Querystring: OrderQuery }>,
    reply: FastifyReply
  ) {
    try {
      const { page = '1', limit = '10', status, userId } = request.query;
      
      const orders = await OrderService.getAllOrders(
        parseInt(page),
        parseInt(limit),
        status,
        userId ? parseInt(userId) : undefined
      );
      
      reply.send(orders);
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error fetching orders',
        error: (error as Error).message 
      });
    }
  },

  // Get a single order by ID
  async getOrderById(
    request: FastifyRequest<{ Params: OrderParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const order = await OrderService.getOrderById(parseInt(id));
      
      if (!order) {
        reply.status(404).send({ message: 'Order not found' });
        return;
      }
      
      reply.send(order);
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error fetching order',
        error: (error as Error).message 
      });
    }
  },

  // Create a new order
  async createOrder(
    request: FastifyRequest<{ Body: OrderBody }>,
    reply: FastifyReply
  ) {
    try {
      const order = await OrderService.createOrder(request.body);
      reply.status(201).send(order);
    } catch (error) {
      reply.status(400).send({ 
        message: 'Invalid order data',
        error: (error as Error).message 
      });
    }
  },

  // Update an existing order
  async updateOrder(
    request: FastifyRequest<{ 
      Params: OrderParams;
      Body: Partial<OrderBody> 
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const updatedOrder = await OrderService.updateOrder(
        parseInt(id), 
        request.body
      );
      
      if (!updatedOrder) {
        reply.status(404).send({ message: 'Order not found' });
        return;
      }
      
      reply.send(updatedOrder);
    } catch (error) {
      reply.status(400).send({ 
        message: 'Error updating order',
        error: (error as Error).message 
      });
    }
  },

  // Delete an order
  async deleteOrder(
    request: FastifyRequest<{ Params: OrderParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      await OrderService.deleteOrder(parseInt(id));
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error deleting order',
        error: (error as Error).message 
      });
    }
  },

  // Order Items Controllers
  async addOrderItem(
    request: FastifyRequest<{ 
      Params: OrderParams;
      Body: { product_id: number | null; quantity: number; price: number } 
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const orderItem = await OrderService.addOrderItem(
        parseInt(id),
        request.body
      );
      reply.status(201).send(orderItem);
    } catch (error) {
      reply.status(400).send({ 
        message: 'Error adding item to order',
        error: (error as Error).message 
      });
    }
  },

  async updateOrderItem(
    request: FastifyRequest<{ 
      Params: { orderId: string; itemId: string };
      Body: { quantity?: number; price?: number } 
    }>,
    reply: FastifyReply
  ) {
    try {
      const { orderId, itemId } = request.params;
      const updatedItem = await OrderService.updateOrderItem(
        parseInt(itemId),
        request.body
      );
      reply.send(updatedItem);
    } catch (error) {
      reply.status(400).send({ 
        message: 'Error updating order item',
        error: (error as Error).message 
      });
    }
  },

  async removeOrderItem(
    request: FastifyRequest<{ 
      Params: { orderId: string; itemId: string } 
    }>,
    reply: FastifyReply
  ) {
    try {
      const { itemId } = request.params;
      await OrderService.removeOrderItem(parseInt(itemId));
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error removing item from order',
        error: (error as Error).message 
      });
    }
  },

  // Order Status Management
  async updateOrderStatus(
    request: FastifyRequest<{ 
      Params: OrderParams;
      Body: { status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" } 
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const updatedOrder = await OrderService.updateOrderStatus(
        parseInt(id),
        request.body.status
      );
      
      if (!updatedOrder) {
        reply.status(404).send({ message: 'Order not found' });
        return;
      }
      
      reply.send(updatedOrder);
    } catch (error) {
      reply.status(400).send({ 
        message: 'Error updating order status',
        error: (error as Error).message 
      });
    }
  },

  // Get orders by user ID
  async getOrdersByUser(
    request: FastifyRequest<{ 
      Params: { userId: string };
      Querystring: OrderQuery 
    }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;
      const { page = '1', limit = '10', status } = request.query;
      
      const orders = await OrderService.getOrdersByUserId(
        parseInt(userId),
        parseInt(page),
        parseInt(limit),
        status
      );
      
      reply.send(orders);
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error fetching user orders',
        error: (error as Error).message 
      });
    }
  }
};