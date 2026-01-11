import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";
import { orderSchema } from '../models/order';

const prisma = new PrismaClient();

export const OrderService = {
  async getAllOrders(page: number, limit: number, status?: string, userId?: number) {
    const whereClause: Prisma.ordersWhereInput = {};
    if (status) whereClause.status = status;
    if (userId) whereClause.user_id = userId;

    return await prisma.orders.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereClause,
      include: {
        financials: true,
        payments: true,
        order_items: true,
      },
    });
  },

  async getOrderById(id: number) {
    return await prisma.orders.findUnique({
      where: { id },
      include: {
        financials: true,
        payments: true,
        order_items: true,
      },
    });
  },

async createOrder(data: z.infer<typeof orderSchema>) {
    const validatedData = orderSchema.parse(data);

    const createData: Prisma.ordersCreateInput = {
      total_price: validatedData.total_price,
      status: validatedData.status ?? "Pending",
      created_at: validatedData.created_at ?? new Date(),
      updated_at: validatedData.updated_at ?? new Date(),
      browser_used: validatedData.browser_used ?? null,
      ...(validatedData.user_id && {
        user: {
          connect: { id: validatedData.user_id },
        },
      }),
    };

    if (validatedData.financials?.length) {
      createData.financials = {
        create: validatedData.financials.map(fin => ({
          amount: fin.amount,
          type: fin.type ?? null,
          description: fin.description ?? null,
        })),
      };
    }

    if (validatedData.payments?.length) {
      createData.payments = {
        create: validatedData.payments.map(payment => ({
          payment_method: payment.payment_method ?? null,
          user_id: payment.user_id ?? null,
          status: payment.status,
          transaction_id: payment.transaction_id,
        })),
      };
    }

    if (validatedData.order_items?.length) {
      createData.order_items = {
        create: validatedData.order_items.map(item => ({
          product_id: item.product_id ?? null,
          quantity: item.quantity,
          price: item.price,
        })),
      };
    }

    return await prisma.orders.create({
      data: createData,
      include: {
        financials: true,
        payments: true,
        order_items: true,
      },
    });
  },

  async updateOrder(id: number, data: Partial<z.infer<typeof orderSchema>>) {
    const validatedData = orderSchema.partial().parse(data);
      
    const updateData: Prisma.ordersUpdateInput = {
      ...(validatedData.user_id && {
        users: { connect: { id: validatedData.user_id } },
      }),
      ...(validatedData.browser_used !== undefined && {
        browser_used: validatedData.browser_used,
      }),
      ...(validatedData.status !== undefined && {
        status: validatedData.status,
      }),
      updated_at: new Date(),
      ...(validatedData.total_price !== undefined && {
        total_price: new Prisma.Decimal(validatedData.total_price),
      }),
    };

    return await prisma.orders.update({
      where: { id },
      data: updateData,
    });
  },



  async deleteOrder(id: number) {
    return await prisma.orders.delete({ where: { id } });
  },

  async addOrderItem(orderId: number, itemData: { product_id: number | null; quantity: number; price: number }) {
    return await prisma.order_items.create({
      data: {
        order_id: orderId,
        product_id: itemData.product_id,
        quantity: itemData.quantity,
        price: itemData.price,
      },
    });
  },

  async updateOrderItem(itemId: number, data: { quantity?: number; price?: number }) {
    return await prisma.order_items.update({
      where: { id: itemId },
      data,
    });
  },

  async removeOrderItem(itemId: number) {
    return await prisma.order_items.delete({
      where: { id: itemId },
    });
  },

  async updateOrderStatus(id: number, status: string) {
    return await prisma.orders.update({
      where: { id },
      data: {
        status,
        updated_at: new Date(),
      },
    });
  },

  async getOrdersByUserId(userId: number, page: number, limit: number, status?: string) {
    const whereClause: Prisma.ordersWhereInput = { user_id: userId };
    if (status) whereClause.status = status;

    return await prisma.orders.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereClause,
      include: {
        financials: true,
        payments: true,
        order_items: true,
      },
    });
  },
};

