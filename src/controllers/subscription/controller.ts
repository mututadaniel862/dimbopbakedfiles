// import { FastifyRequest, FastifyReply } from 'fastify';
// import * as subscriptionService from '../../services/subscriptionService';

// // Type for authenticated request
// interface AuthRequest extends FastifyRequest {
//   user: {
//     id: number;
//     role: string;
//     email: string;
//   };
// }

// // ============================================
// // MERCHANT: Submit Activation Payment
// // ============================================
// export const submitActivation = async (req: AuthRequest, reply: FastifyReply) => {
//   try {
//     const userId = req.user.id;
    
//     if (!userId) {
//       return reply.status(401).send({
//         success: false,
//         error: 'Unauthorized - No user ID found'
//       });
//     }
    
//     const body = req.body as {
//       paymentMethod: string;
//       phoneNumber: string;
//       transactionReference: string;
//       amount: number;
//       paymentProof?: string;
//     };
    
//     const payment = await subscriptionService.submitActivationPayment({
//       merchantId: userId, // ✅ Get from authenticated user
//       paymentMethod: body.paymentMethod,
//       phoneNumber: body.phoneNumber,
//       transactionReference: body.transactionReference,
//       amount: body.amount,
//       ...(body.paymentProof && { paymentProof: body.paymentProof })
//     });
    
//     return reply.status(201).send({
//       success: true,
//       message: 'Activation payment submitted successfully',
//       data: payment
//     });
    
//   } catch (error: any) {
//     return reply.status(400).send({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // MERCHANT: Submit Subscription Payment
// // ============================================
// export const submitSubscription = async (req: AuthRequest, reply: FastifyReply) => {
//   try {
//     const userId = req.user.id;
    
//     if (!userId) {
//       return reply.status(401).send({
//         success: false,
//         error: 'Unauthorized'
//       });
//     }
    
//     const body = req.body as {
//       planType: '3_months' | '6_months' | '1_year';
//       paymentMethod: string;
//       phoneNumber: string;
//       transactionReference: string;
//       paymentProof?: string;
//     };
    
//     const payment = await subscriptionService.submitSubscriptionPayment({
//       merchantId: userId, // ✅ Get from authenticated user
//       planType: body.planType,
//       paymentMethod: body.paymentMethod,
//       phoneNumber: body.phoneNumber,
//       transactionReference: body.transactionReference,
//       ...(body.paymentProof && { paymentProof: body.paymentProof })
//     });
    
//     return reply.status(201).send({
//       success: true,
//       message: 'Subscription payment submitted successfully',
//       data: payment
//     });
    
//   } catch (error: any) {
//     return reply.status(400).send({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // MERCHANT: Get My Subscription Status
// // ============================================
// export const getMySubscription = async (req: AuthRequest, reply: FastifyReply) => {
//   try {
//     const userId = req.user.id;
    
//     if (!userId) {
//       return reply.status(401).send({
//         success: false,
//         error: 'Unauthorized'
//       });
//     }
    
//     const subscription = await subscriptionService.getMerchantSubscription(userId);
    
//     return reply.send({
//       success: true,
//       data: subscription
//     });
    
//   } catch (error: any) {
//     return reply.status(400).send({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ADMIN: Get Pending Payments
// // ============================================
// export const getPendingPayments = async (req: AuthRequest, reply: FastifyReply) => {
//   try {
//     const userRole = req.user.role;
    
//     if (userRole !== 'admin' && userRole !== 'super_admin') {
//       return reply.status(403).send({
//         success: false,
//         error: 'Access denied - Admin only'
//       });
//     }
    
//     const payments = await subscriptionService.getPendingPayments();
    
//     return reply.send({
//       success: true,
//       data: payments
//     });
    
//   } catch (error: any) {
//     return reply.status(400).send({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // ============================================
// // ADMIN: Approve/Reject Payment
// // ============================================
// export const processPayment = async (req: AuthRequest, reply: FastifyReply) => {
//   try {
//     const adminId = req.user.id;
//     const userRole = req.user.role;
    
//     if (userRole !== 'admin' && userRole !== 'super_admin') {
//       return reply.status(403).send({
//         success: false,
//         error: 'Access denied - Admin only'
//       });
//     }
    
//     if (!adminId) {
//       return reply.status(401).send({
//         success: false,
//         error: 'Unauthorized'
//       });
//     }
    
//     const body = req.body as {
//       paymentId: number;
//       action: 'approve' | 'reject';
//       rejectionReason?: string;
//     };
    
//     // Determine if it's activation or subscription based on payment type
//     const payment = await subscriptionService.getPaymentById(body.paymentId);
    
//     if (!payment) {
//       return reply.status(404).send({
//         success: false,
//         error: 'Payment not found'
//       });
//     }
    
//     if (payment.payment_type === 'activation') {
//       await subscriptionService.approveActivationPayment(
//         body.paymentId,
//         body.action,
//         adminId,
//         body.rejectionReason
//       );
//     } else {
//       await subscriptionService.approveSubscriptionPayment(
//         body.paymentId,
//         body.action,
//         adminId,
//         body.rejectionReason
//       );
//     }
    
//     const message = body.action === 'approve' 
//       ? 'Payment approved successfully' 
//       : 'Payment rejected';
    
//     return reply.send({
//       success: true,
//       message
//     });
    
//   } catch (error: any) {
//     return reply.status(400).send({
//       success: false,
//       error: error.message
//     });
//   }
// };

















import { FastifyRequest, FastifyReply } from 'fastify';
import * as subscriptionService from '../../services/subscriptionService';

// Type for authenticated request
interface AuthRequest extends FastifyRequest {
  user: {
    id: number;
    role: string;
    email: string;
  };
}

// ============================================
// MERCHANT: Submit Activation Payment
// ============================================
export const submitActivation = async (req: AuthRequest, reply: FastifyReply) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized - No user ID found'
      });
    }
    
    // Handle multipart form data
    const data = await req.file();
    
    if (!data) {
      return reply.status(400).send({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    // Get form fields
    const fields = data.fields as any;
    const paymentMethod = fields.paymentMethod?.value;
    const phoneNumber = fields.phoneNumber?.value;
    const transactionReference = fields.transactionReference?.value;
    const amount = parseFloat(fields.amount?.value);
    
    // Get file buffer
    const buffer = await data.toBuffer();
    const file = {
      buffer,
      filename: data.filename,
      mimetype: data.mimetype
    };
    
    const payment = await subscriptionService.submitActivationPayment({
      merchantId: userId,
      paymentMethod,
      phoneNumber,
      transactionReference,
      amount
    }, file);
    
    return reply.status(201).send({
      success: true,
      message: 'Activation payment submitted successfully',
      data: payment
    });
    
  } catch (error: any) {
    return reply.status(400).send({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// MERCHANT: Submit Subscription Payment
// ============================================
export const submitSubscription = async (req: AuthRequest, reply: FastifyReply) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    // Handle multipart form data
    const data = await req.file();
    
    if (!data) {
      return reply.status(400).send({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    // Get form fields
    const fields = data.fields as any;
    const planType = fields.planType?.value as '3_months' | '6_months' | '1_year';
    const paymentMethod = fields.paymentMethod?.value;
    const phoneNumber = fields.phoneNumber?.value;
    const transactionReference = fields.transactionReference?.value;
    
    // Get file buffer
    const buffer = await data.toBuffer();
    const file = {
      buffer,
      filename: data.filename,
      mimetype: data.mimetype
    };
    
    const payment = await subscriptionService.submitSubscriptionPayment({
      merchantId: userId,
      planType,
      paymentMethod,
      phoneNumber,
      transactionReference
    }, file);
    
    return reply.status(201).send({
      success: true,
      message: 'Subscription payment submitted successfully',
      data: payment
    });
    
  } catch (error: any) {
    return reply.status(400).send({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// MERCHANT: Get My Subscription Status
// ============================================
export const getMySubscription = async (req: AuthRequest, reply: FastifyReply) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    const subscription = await subscriptionService.getMerchantSubscription(userId);
    
    return reply.send({
      success: true,
      data: subscription
    });
    
  } catch (error: any) {
    return reply.status(400).send({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// ADMIN: Get Pending Payments
// ============================================
export const getPendingPayments = async (req: AuthRequest, reply: FastifyReply) => {
  try {
    const userRole = req.user.role;
    
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Access denied - Admin only'
      });
    }
    
    const payments = await subscriptionService.getPendingPayments();
    
    return reply.send({
      success: true,
      data: payments
    });
    
  } catch (error: any) {
    return reply.status(400).send({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// ADMIN: Approve/Reject Payment
// ============================================
export const processPayment = async (req: AuthRequest, reply: FastifyReply) => {
  try {
    const adminId = req.user.id;
    const userRole = req.user.role;
    
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Access denied - Admin only'
      });
    }
    
    if (!adminId) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    const body = req.body as {
      paymentId: number;
      action: 'approve' | 'reject';
      rejectionReason?: string;
    };
    
    // Determine if it's activation or subscription based on payment type
    const payment = await subscriptionService.getPaymentById(body.paymentId);
    
    if (!payment) {
      return reply.status(404).send({
        success: false,
        error: 'Payment not found'
      });
    }
    
    if (payment.payment_type === 'activation') {
      await subscriptionService.approveActivationPayment(
        body.paymentId,
        body.action,
        adminId,
        body.rejectionReason
      );
    } else {
      await subscriptionService.approveSubscriptionPayment(
        body.paymentId,
        body.action,
        adminId,
        body.rejectionReason
      );
    }
    
    const message = body.action === 'approve' 
      ? 'Payment approved successfully' 
      : 'Payment rejected';
    
    return reply.send({
      success: true,
      message
    });
    
  } catch (error: any) {
    return reply.status(400).send({
      success: false,
      error: error.message
    });
  }
};