// import { FastifyRequest, FastifyReply } from 'fastify';
// import { UserPurchaseService } from '../../services/user';
// import { z } from 'zod';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { shippingDetailsSchema } from '../../models/shippingdetails';

// // Validation schema for creating orders
// const createOrderSchema = z.object({
//   user_id: z.number(),
//   total_price: z.number().positive(),
//   browser_used: z.string().optional(),
//   order_items: z.array(z.object({
//     product_id: z.number(),
//     quantity: z.number().min(1),
//     price: z.number()
//   })),
//   payment: z.object({
//     payment_method: z.enum(['ecocash', 'card', 'cash']),
//     customerMsisdn: z.string().optional() // FIXED: camelCase
//   }).refine((data) => {
//     // Make customerMsisdn required only for EcoCash payments
//     if (data.payment_method === 'ecocash') {
//       return !!data.customerMsisdn && data.customerMsisdn.trim().length > 0; // FIXED
//     }
//     return true;
//   }, {
//     message: "Phone number is required for EcoCash payments",
//     path: ["customerMsisdn"] // FIXED: camelCase
//   }),
//   shipping_details: shippingDetailsSchema.omit({ 
//     user_id: true, 
//     created_at: true,
//     user: true 
//   })
// });

// type CreateOrderInput = z.infer<typeof createOrderSchema>;

// export class UserPurchaseController {
//   // Get all users with purchases
//   static async getAllPurchasers(
//     request: FastifyRequest,
//     reply: FastifyReply
//   ) {
//     try {
//       const users = await UserPurchaseService.getUsersWithPurchases();
//       return reply.code(200).send({
//         success: true,
//         count: users.length,
//         data: users
//       });
//     } catch (error) {
//       console.error('Get purchasers error:', error);
//       return reply.code(500).send({
//         success: false,
//         message: 'Failed to fetch purchasers',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   }

//   // Get specific user's purchase history
//   static async getUserPurchases(
//     request: FastifyRequest<{ Params: { userId: string } }>,
//     reply: FastifyReply
//   ) {
//     try {
//       const userId = parseInt(request.params.userId);
      
//       if (isNaN(userId)) {
//         return reply.code(400).send({
//           success: false,
//           message: 'Invalid user ID'
//         });
//       }

//       const data = await UserPurchaseService.getUserPurchaseHistory(userId);

//       if (!data) {
//         return reply.code(404).send({
//           success: false,
//           message: 'User not found'
//         });
//       }

//       return reply.code(200).send({
//         success: true,
//         data
//       });
//     } catch (error) {
//       console.error('Get user purchases error:', error);
//       return reply.code(500).send({
//         success: false,
//         message: 'Failed to fetch user purchases',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   }

//   // Create order with payment
//   // static async createOrder(
//   //   request: FastifyRequest<{ Body: CreateOrderInput }>,
//   //   reply: FastifyReply
//   // ) {
//   //   try {
//   //     const validatedData = createOrderSchema.parse(request.body);
//   //     const transactionId = uuidv4();

//   //     // If payment method is EcoCash, initiate payment
//   //     if (validatedData.payment.payment_method === 'ecocash') {
//   //       if (!validatedData.payment.customerMsisdn) { // FIXED: camelCase
//   //         return reply.code(400).send({
//   //           success: false,
//   //           message: 'Phone number required for EcoCash payment'
//   //         });
//   //       }

//   //       // Validate phone number format for EcoCash
//   //       const phoneRegex = /^263[0-9]{9}$/;
//   //       const cleanPhone = validatedData.payment.customerMsisdn.replace('+', '').replace(/\s/g, ''); // FIXED: camelCase
        
//   //       if (!phoneRegex.test(cleanPhone)) {
//   //         return reply.code(400).send({
//   //           success: false,
//   //           message: 'Invalid phone number format for EcoCash. Use 263XXXXXXXXX format'
//   //         });
//   //       }

//   //       try {
//   //         // Call EcoCash API
//   //         const ecocashResponse = await axios.post(
//   //           `${process.env.ECOCASH_BASE_URL}${process.env.ECOCASH_ENDPOINT}`,
//   //           {
//   //             customerMsisdn: cleanPhone,
//   //             amount: validatedData.total_price,
//   //             reason: process.env.ECOCASH_PAYMENT_REASON || 'Payment',
//   //             currency: process.env.ECOCASH_CURRENCY || 'USD',
//   //             sourceReference: transactionId
//   //           },
//   //           {
//   //             headers: {
//   //               'X-API-KEY': process.env.ECOCASH_API_KEY || '',
//   //               'Content-Type': 'application/json'
//   //             }
//   //           }
//   //         );

//   //         if (ecocashResponse.status !== 200) {
//   //           return reply.code(400).send({
//   //             success: false,
//   //             message: 'Payment initiation failed',
//   //             error: ecocashResponse.data
//   //           });
//   //         }
//   //       } catch (ecocashError) {
//   //         console.error('EcoCash API error:', ecocashError);
//   //         return reply.code(500).send({
//   //           success: false,
//   //           message: 'Failed to initiate EcoCash payment',
//   //           error: ecocashError instanceof Error ? ecocashError.message : 'Unknown error'
//   //         });
//   //       }
//   //     }

//   //     // Create order in database
//   //     const orderData = await UserPurchaseService.createOrderWithPayment({
//   //       user_id: validatedData.user_id,
//   //       total_price: validatedData.total_price,
//   //       ...(validatedData.browser_used && { browser_used: validatedData.browser_used }),
//   //       order_items: validatedData.order_items,
//   //       payment: {
//   //         payment_method: validatedData.payment.payment_method,
//   //         transaction_id: transactionId,
//   //         ...(validatedData.payment.customerMsisdn && { // FIXED: camelCase
//   //           customerMsisdn: validatedData.payment.customerMsisdn // FIXED: camelCase
//   //         })
//   //       },
//   //       shipping_details: validatedData.shipping_details
//   //     });

//   //     return reply.code(201).send({
//   //       success: true,
//   //       message: 'Order created successfully',
//   //       data: orderData,
//   //       transaction_id: transactionId
//   //     });
//   //   } catch (error) {
//   //     console.error('Create order error:', error);
      
//   //     if (error instanceof z.ZodError) {
//   //       return reply.code(400).send({
//   //         success: false,
//   //         message: 'Validation error',
//   //         errors: error.errors
//   //       });
//   //     }

//   //     return reply.code(500).send({
//   //       success: false,
//   //       message: 'Failed to create order',
//   //       error: error instanceof Error ? error.message : 'Unknown error'
//   //     });
//   //   }
//   // }



// // Create order with payment
// static async createOrder(
//   request: FastifyRequest<{ Body: CreateOrderInput }>,
//   reply: FastifyReply
// ) {
//   try {
//     const validatedData = createOrderSchema.parse(request.body);
//     const transactionId = uuidv4();

//     // If payment method is EcoCash, initiate payment
//     if (validatedData.payment.payment_method === 'ecocash') {
//       if (!validatedData.payment.customerMsisdn) {
//         return reply.code(400).send({
//           success: false,
//           message: 'Phone number required for EcoCash payment'
//         });
//       }

//       // Validate phone number format for EcoCash
//       const phoneRegex = /^263[0-9]{9}$/;
//       const cleanPhone = validatedData.payment.customerMsisdn.replace('+', '').replace(/\s/g, '');
      
//       if (!phoneRegex.test(cleanPhone)) {
//         return reply.code(400).send({
//           success: false,
//           message: 'Invalid phone number format for EcoCash. Use 263XXXXXXXXX format'
//         });
//       }

//       try {
//         // Call EcoCash API
//         const ecocashApiUrl = `${process.env.ECOCASH_BASE_URL}${process.env.ECOCASH_ENDPOINT}`;
//         console.log('Calling EcoCash API:', ecocashApiUrl);
        
//         const ecocashResponse = await axios.post(
//           ecocashApiUrl,
//           {
//             customerMsisdn: cleanPhone,
//             amount: validatedData.total_price,
//             reason: process.env.ECOCASH_PAYMENT_REASON || 'Payment',
//             currency: process.env.ECOCASH_CURRENCY || 'USD',
//             sourceReference: transactionId
//           },
//           {
//             headers: {
//               'X-API-KEY': process.env.ECOCASH_API_KEY || '',
//               'Content-Type': 'application/json'
//             },
//             timeout: 30000
//           }
//         );
        
//         console.log('EcoCash Response:', ecocashResponse.data);
        
//         if (ecocashResponse.status !== 200) {
//           return reply.code(400).send({
//             success: false,
//             message: 'Payment initiation failed',
//             error: ecocashResponse.data
//           });
//         }
//       } catch (ecocashError) {
//         console.error('EcoCash API error:', ecocashError);
        
//         if (axios.isAxiosError(ecocashError)) {
//           console.error('Response data:', ecocashError.response?.data);
//           console.error('Response status:', ecocashError.response?.status);
          
//           return reply.code(500).send({
//             success: false,
//             message: 'Failed to initiate EcoCash payment',
//             error: ecocashError.response?.data || ecocashError.message,
//             status: ecocashError.response?.status
//           });
//         }
        
//         return reply.code(500).send({
//           success: false,
//           message: 'Failed to initiate EcoCash payment',
//           error: ecocashError instanceof Error ? ecocashError.message : 'Unknown error'
//         });
//       }
//     } // <- Make sure this closing brace is here for the if statement

//     // Create order in database
//     const orderData = await UserPurchaseService.createOrderWithPayment({
//       user_id: validatedData.user_id,
//       total_price: validatedData.total_price,
//       ...(validatedData.browser_used && { browser_used: validatedData.browser_used }),
//       order_items: validatedData.order_items,
//       payment: {
//         payment_method: validatedData.payment.payment_method,
//         transaction_id: transactionId,
//         ...(validatedData.payment.customerMsisdn && {
//           customerMsisdn: validatedData.payment.customerMsisdn
//         })
//       },
//       shipping_details: validatedData.shipping_details
//     });

//     return reply.code(201).send({
//       success: true,
//       message: 'Order created successfully',
//       data: orderData,
//       transaction_id: transactionId
//     });
//   } catch (error) {
//     console.error('Create order error:', error);
    
//     if (error instanceof z.ZodError) {
//       return reply.code(400).send({
//         success: false,
//         message: 'Validation error',
//         errors: error.errors
//       });
//     }

//     return reply.code(500).send({
//       success: false,
//       message: 'Failed to create order',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// } // <- Make sure this closing brace is here for the createOrder method

// // EcoCash payment callback



  

//   // EcoCash payment callback
//   static async handlePaymentCallback(
//     request: FastifyRequest<{ 
//       Body: { 
//         transaction_id: string; 
//         status: string;
//       } 
//     }>,
//     reply: FastifyReply
//   ) {
//     try {
//       const { transaction_id, status } = request.body;

//       if (!transaction_id || !status) {
//         return reply.code(400).send({
//           success: false,
//           message: 'Missing transaction_id or status'
//         });
//       }

//       const paymentStatus = status === 'SUCCESS' ? 'Completed' : 'Failed';
//       const payment = await UserPurchaseService.updatePaymentStatus(
//         transaction_id,
//         paymentStatus
//       );

//       return reply.code(200).send({
//         success: true,
//         message: 'Payment status updated',
//         data: payment
//       });
//     } catch (error) {
//       console.error('Payment callback error:', error);
//       return reply.code(500).send({
//         success: false,
//         message: 'Failed to update payment status',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   }

//   // Get order by ID
//   static async getOrder(
//     request: FastifyRequest<{ Params: { orderId: string } }>,
//     reply: FastifyReply
//   ) {
//     try {
//       const orderId = parseInt(request.params.orderId);
      
//       if (isNaN(orderId)) {
//         return reply.code(400).send({
//           success: false,
//           message: 'Invalid order ID'
//         });
//       }

//       const order = await UserPurchaseService.getOrderById(orderId);

//       if (!order) {
//         return reply.code(404).send({
//           success: false,
//           message: 'Order not found'
//         });
//       }

//       return reply.code(200).send({
//         success: true,
//         data: order
//       });
//     } catch (error) {
//       console.error('Get order error:', error);
//       return reply.code(500).send({
//         success: false,
//         message: 'Failed to fetch order',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   }

//   // Get purchase statistics
//   static async getStatistics(
//     request: FastifyRequest,
//     reply: FastifyReply
//   ) {
//     try {
//       const stats = await UserPurchaseService.getPurchaseStatistics();
//       return reply.code(200).send({
//         success: true,
//         data: stats
//       });
//     } catch (error) {
//       console.error('Get statistics error:', error);
//       return reply.code(500).send({
//         success: false,
//         message: 'Failed to fetch statistics',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   }
// }