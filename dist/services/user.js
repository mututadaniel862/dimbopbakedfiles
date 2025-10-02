"use strict";
// import { PrismaClient, Prisma } from "@prisma/client";
// import { z } from "zod";
// import { shippingDetailsSchema } from "../models/shippingdetails";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPurchaseService = void 0;
// const prisma = new PrismaClient();
// export class UserPurchaseService {
//   // Get all users who have made purchases
//   static async getUsersWithPurchases() {
//     return await prisma.users.findMany({
//       where: {
//         orders: {
//           some: {}
//         }
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         phone: true,
//         created_at: true,
//         orders: {
//           include: {
//             order_items: {
//               include: {
//                 products: {
//                   select: {
//                     id: true,
//                     name: true,
//                     price: true,
//                     image_url: true
//                   }
//                 }
//               }
//             },
//             payments: true,
//             users: {
//               select: {
//                 id: true,
//                 username: true,
//                 email: true
//               }
//             }
//           },
//           orderBy: {
//             created_at: 'desc'
//           }
//         },
//         shipping_details: true,
//         _count: {
//           select: {
//             orders: true,
//             payments: true
//           }
//         }
//       }
//     });
//   }
//   // Get specific user's purchase history
//   static async getUserPurchaseHistory(userId: number) {
//     return await prisma.users.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         phone: true,
//         orders: {
//           include: {
//             order_items: {
//               include: {
//                 products: true
//               }
//             },
//             payments: true
//           },
//           orderBy: {
//             created_at: 'desc'
//           }
//         },
//         shipping_details: {
//           orderBy: {
//             created_at: 'desc'
//           }
//         },
//         _count: {
//           select: {
//             orders: true
//           }
//         }
//       }
//     });
//   }
//   // Create order with payment
//   static async createOrderWithPayment(data: {
//     user_id: number;
//     total_price: number;
//     browser_used?: string;
//     order_items: Array<{
//       product_id: number;
//       quantity: number;
//       price: number;
//     }>;
//     payment: {
//       payment_method: string;
//       transaction_id: string;
//        customerMsisdn?: string; 
//     };
//     shipping_details: z.infer<typeof shippingDetailsSchema>;
//   }) {
//     return await prisma.$transaction(async (tx) => {
//       // Create order - Fixed: properly handle optional fields
//       const order = await tx.orders.create({
//         data: {
//           user_id: data.user_id,
//           total_price: new Prisma.Decimal(data.total_price),
//           status: "Pending",
//           browser_used: data.browser_used ?? null, // Convert undefined to null
//           created_at: new Date(),
//           updated_at: new Date()
//         }
//       });
//       // Create order items
//       const orderItems = await Promise.all(
//         data.order_items.map(item =>
//           tx.order_items.create({
//             data: {
//               order_id: order.id,
//               product_id: item.product_id,
//               quantity: item.quantity,
//               price: new Prisma.Decimal(item.price),
//               created_at: new Date(),
//               updated_at: new Date()
//             }
//           })
//         )
//       );
//       // Create payment record
//       const payment = await tx.payments.create({
//         data: {
//           order_id: order.id,
//           user_id: data.user_id,
//           payment_method: data.payment.payment_method,
//           transaction_id: data.payment.transaction_id,
//         customerMsisdn: data.payment.customerMsisdn ?? null,
//           status: "Pending",
//           created_at: new Date()
//         }
//       });
//       // Create shipping details - Fixed: properly handle optional fields
//       const shipping = await tx.shipping_details.create({
//         data: {
//           user_id: data.user_id,
//           full_name: data.shipping_details.full_name,
//           country: data.shipping_details.country,
//           city: data.shipping_details.city,
//           street: data.shipping_details.street,
//           apartment: data.shipping_details.apartment ?? null, // Convert undefined to null
//           postal_code: data.shipping_details.postal_code,
//           phone: data.shipping_details.phone,
//           email: data.shipping_details.email,
//           created_at: new Date()
//         }
//       });
//       return {
//         order,
//         orderItems,
//         payment,
//         shipping
//       };
//     });
//   }
//   // Update payment status (after EcoCash callback)
//   static async updatePaymentStatus(
//     transactionId: string,
//     status: "Completed" | "Failed" | "Pending"
//   ) {
//     const payment = await prisma.payments.update({
//       where: { transaction_id: transactionId },
//       data: { status }
//     });
//     // Update order status based on payment
//     if (payment.order_id) {
//       await prisma.orders.update({
//         where: { id: payment.order_id },
//         data: {
//           status: status === "Completed" ? "Processing" : "Failed",
//           updated_at: new Date()
//         }
//       });
//     }
//     return payment;
//   }
//   // Get order by ID with all details
//   static async getOrderById(orderId: number) {
//     return await prisma.orders.findUnique({
//       where: { id: orderId },
//       include: {
//         order_items: {
//           include: {
//             products: true
//           }
//         },
//         payments: true,
//         users: {
//           select: {
//             id: true,
//             username: true,
//             email: true,
//             phone: true
//           }
//         }
//       }
//     });
//   }
// /*************  ✨ Windsurf Command 🌟  *************/
//   /**
//    * Get user's shipping details
//    * @param {number} userId - The ID of the user
//    * @returns {Promise<shippingDetails[]>} - A promise that resolves to an array of shipping details
//    */
//   static async getUserShippingDetails(userId: number): Promise<shippingDetails[]> {
//     /**
//   // Get user's shipping details
//   static async getUserShippingDetails(userId: number) {
//     return await prisma.shipping_details.findMany({
//       where: { user_id: userId },
//       orderBy: { created_at: 'desc' }
//     });
//   }
// /*******  4715da37-735d-4dde-8cb4-94edc41fc417  *******/
//   // Get payment by transaction ID
//   static async getPaymentByTransactionId(transactionId: string) {
//     return await prisma.payments.findUnique({
//       where: { transaction_id: transactionId },
//       include: {
//         orders: {
//           include: {
//             order_items: {
//               include: {
//                 products: true
//               }
//             }
//           }
//         },
//         users: {
//           select: {
//             id: true,
//             username: true,
//             email: true,
//             phone: true
//           }
//         }
//       }
//     });
//   }
//   // Get purchase statistics
//   static async getPurchaseStatistics() {
//     const totalOrders = await prisma.orders.count();
//     const completedOrders = await prisma.orders.count({
//       where: { status: "Completed" }
//     });
//     const totalRevenue = await prisma.orders.aggregate({
//       where: { status: "Completed" },
//       _sum: { total_price: true }
//     });
//     const uniqueCustomers = await prisma.users.count({
//       where: {
//         orders: {
//           some: {}
//         }
//       }
//     });
//     return {
//       totalOrders,
//       completedOrders,
//       pendingOrders: totalOrders - completedOrders,
//       totalRevenue: totalRevenue._sum.total_price || 0,
//       uniqueCustomers
//     };
//   }
// }
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserPurchaseService {
    // Get all users who have made purchases
    static async getUsersWithPurchases() {
        return await prisma.users.findMany({
            where: {
                orders: {
                    some: {}
                }
            },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                created_at: true,
                orders: {
                    include: {
                        order_items: {
                            include: {
                                products: {
                                    select: {
                                        id: true,
                                        name: true,
                                        price: true,
                                        image_url: true
                                    }
                                }
                            }
                        },
                        payments: true,
                        users: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                },
                shipping_details: true,
                _count: {
                    select: {
                        orders: true,
                        payments: true
                    }
                }
            }
        });
    }
    // Get specific user's purchase history
    static async getUserPurchaseHistory(userId) {
        return await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                orders: {
                    include: {
                        order_items: {
                            include: {
                                products: true
                            }
                        },
                        payments: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                },
                shipping_details: {
                    orderBy: {
                        created_at: 'desc'
                    }
                },
                _count: {
                    select: {
                        orders: true
                    }
                }
            }
        });
    }
    // Create order with payment
    static async createOrderWithPayment(data) {
        return await prisma.$transaction(async (tx) => {
            // Create order
            const order = await tx.orders.create({
                data: {
                    user_id: data.user_id,
                    total_price: new client_1.Prisma.Decimal(data.total_price),
                    status: "Pending",
                    browser_used: data.browser_used ?? null,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
            // Create order items
            const orderItems = await Promise.all(data.order_items.map(item => tx.order_items.create({
                data: {
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: new client_1.Prisma.Decimal(item.price),
                    created_at: new Date(),
                    updated_at: new Date()
                }
            })));
            // Create payment record - FIXED: Use customerMsisdn (not customer_msisdn)
            const payment = await tx.payments.create({
                data: {
                    order_id: order.id,
                    user_id: data.user_id,
                    payment_method: data.payment.payment_method,
                    transaction_id: data.payment.transaction_id,
                    customerMsisdn: data.payment.customerMsisdn ?? null, // FIXED: Correct casing
                    status: "Pending",
                    created_at: new Date()
                }
            });
            // Create shipping details
            const shipping = await tx.shipping_details.create({
                data: {
                    user_id: data.user_id,
                    full_name: data.shipping_details.full_name,
                    country: data.shipping_details.country,
                    city: data.shipping_details.city,
                    street: data.shipping_details.street,
                    apartment: data.shipping_details.apartment ?? null,
                    postal_code: data.shipping_details.postal_code,
                    phone: data.shipping_details.phone,
                    email: data.shipping_details.email,
                    created_at: new Date()
                }
            });
            return {
                order,
                orderItems,
                payment,
                shipping
            };
        });
    }
    // Update payment status (after EcoCash callback)
    static async updatePaymentStatus(transactionId, status) {
        const payment = await prisma.payments.update({
            where: { transaction_id: transactionId },
            data: { status }
        });
        // Update order status based on payment
        if (payment.order_id) {
            await prisma.orders.update({
                where: { id: payment.order_id },
                data: {
                    status: status === "Completed" ? "Processing" : "Failed",
                    updated_at: new Date()
                }
            });
        }
        return payment;
    }
    // Get order by ID with all details
    static async getOrderById(orderId) {
        return await prisma.orders.findUnique({
            where: { id: orderId },
            include: {
                order_items: {
                    include: {
                        products: true
                    }
                },
                payments: true,
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });
    }
    // Get user's shipping details - FIXED: Removed incomplete JSDoc and code
    static async getUserShippingDetails(userId) {
        return await prisma.shipping_details.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });
    }
    // Get payment by transaction ID
    static async getPaymentByTransactionId(transactionId) {
        return await prisma.payments.findUnique({
            where: { transaction_id: transactionId },
            include: {
                orders: {
                    include: {
                        order_items: {
                            include: {
                                products: true
                            }
                        }
                    }
                },
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });
    }
    // Get purchase statistics
    static async getPurchaseStatistics() {
        const totalOrders = await prisma.orders.count();
        const completedOrders = await prisma.orders.count({
            where: { status: "Completed" }
        });
        const totalRevenue = await prisma.orders.aggregate({
            where: { status: "Completed" },
            _sum: { total_price: true }
        });
        const uniqueCustomers = await prisma.users.count({
            where: {
                orders: {
                    some: {}
                }
            }
        });
        return {
            totalOrders,
            completedOrders,
            pendingOrders: totalOrders - completedOrders,
            totalRevenue: totalRevenue._sum.total_price || 0,
            uniqueCustomers
        };
    }
}
exports.UserPurchaseService = UserPurchaseService;
//# sourceMappingURL=user.js.map