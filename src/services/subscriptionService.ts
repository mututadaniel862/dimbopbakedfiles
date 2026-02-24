import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_PLANS } from '../utils/schemas';
import cloudinary from '../config/cloudinary';

const prisma = new PrismaClient();

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (file: { buffer: Buffer; filename: string; mimetype: string }): Promise<string> => {
  try {
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'payment-proofs',
          public_id: `payment_${Date.now()}`,
          resource_type: 'auto',
          transformation: [
            { width: 1500, height: 1500, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    console.log('✅ Payment proof uploaded to Cloudinary:', uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw new Error('Failed to upload payment proof to Cloudinary');
  }
};

// ============================================
// ACTIVATION PAYMENT (1 month free trial)
// ============================================
export const submitActivationPayment = async (
  data: {
    merchantId: number;
    paymentMethod: string;
    phoneNumber: string;
    transactionReference: string;
    amount: number;
  },
  file?: { buffer: Buffer; filename: string; mimetype: string }
): Promise<any> => {
  
  const merchant = await prisma.users.findUnique({
    where: { id: data.merchantId }
  });
  
  if (!merchant || merchant.role !== 'client_admin') {
    throw new Error('Merchant not found');
  }
  
  if (merchant.subscription_status !== 'inactive') {
    throw new Error('Account already activated');
  }
  
  if (data.amount < 1) {
    throw new Error('Activation fee must be at least $1');
  }
  
  let paymentProofUrl: string | null = null;
  if (file) {
    paymentProofUrl = await uploadToCloudinary(file);
  }
  
  const payment = await prisma.payment_proofs.create({
    data: {
      user_id: data.merchantId,
      payment_type: 'activation',
      payment_method: data.paymentMethod,
      phone_number: data.phoneNumber,
      transaction_reference: data.transactionReference,
      amount: data.amount,
      payment_proof_url: paymentProofUrl,
      status: 'pending'
    }
  });
  
  console.log(`✅ Activation payment submitted for merchant ID: ${data.merchantId}`);
  return payment;
};

// ============================================
// APPROVE/REJECT ACTIVATION PAYMENT
// ============================================
export const approveActivationPayment = async (
  paymentId: number,
  action: 'approve' | 'reject',
  adminId: number,
  rejectionReason?: string
): Promise<void> => {
  
  const payment = await prisma.payment_proofs.findUnique({
    where: { id: paymentId },
    include: { users: true }
  });
  
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  if (payment.status !== 'pending') {
    throw new Error('Payment already processed');
  }
  
  if (action === 'approve') {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);
    
    await prisma.$transaction([
      prisma.payment_proofs.update({
        where: { id: paymentId },
        data: {
          status: 'approved',
          approved_by: adminId,
          approved_at: new Date()
        }
      }),
      
      prisma.users.update({
        where: { id: payment.user_id },
        data: {
          subscription_status: 'trial',
          trial_ends_at: trialEndsAt
        }
      }),
      
      prisma.subscriptions.create({
        data: {
          user_id: payment.user_id,
          plan_type: '1_month_trial',
          start_date: new Date(),
          end_date: trialEndsAt,
          is_trial: true,
          is_active: true
        }
      })
    ]);
    
    console.log(`✅ Merchant ${payment.user_id} activated with 1-month free trial`);
    
  } else {
    await prisma.payment_proofs.update({
      where: { id: paymentId },
      data: {
        status: 'rejected',
        ...(rejectionReason !== undefined && { rejection_reason: rejectionReason }),
        approved_by: adminId,
        approved_at: new Date()
      }
    });
    
    console.log(`❌ Activation payment rejected for merchant ${payment.user_id}`);
  }
};

// ============================================
// SUBMIT SUBSCRIPTION PLAN PAYMENT
// ============================================
export const submitSubscriptionPayment = async (
  data: {
    merchantId: number;
    planType: '3_months' | '6_months' | '1_year';
    paymentMethod: string;
    phoneNumber: string;
    transactionReference: string;
  },
  file?: { buffer: Buffer; filename: string; mimetype: string }
): Promise<any> => {
  
  const merchant = await prisma.users.findUnique({
    where: { id: data.merchantId }
  });
  
  if (!merchant || merchant.role !== 'client_admin') {
    throw new Error('Merchant not found');
  }
  
  if (merchant.subscription_status === 'inactive') {
    throw new Error('Please activate your account first with $1 payment');
  }
  
  const plan = SUBSCRIPTION_PLANS[data.planType];
  
  let paymentProofUrl: string | null = null;
  if (file) {
    paymentProofUrl = await uploadToCloudinary(file);
  }
  
  const payment = await prisma.payment_proofs.create({
    data: {
      user_id: data.merchantId,
      payment_type: 'subscription',
      plan_type: data.planType,
      payment_method: data.paymentMethod,
      phone_number: data.phoneNumber,
      transaction_reference: data.transactionReference,
      amount: plan.price,
      payment_proof_url: paymentProofUrl,
      status: 'pending'
    }
  });
  
  console.log(`✅ Subscription payment submitted: ${plan.name} for merchant ${data.merchantId}`);
  return payment;
};

// ============================================
// APPROVE/REJECT SUBSCRIPTION PAYMENT
// ============================================
export const approveSubscriptionPayment = async (
  paymentId: number,
  action: 'approve' | 'reject',
  adminId: number,
  rejectionReason?: string
): Promise<void> => {
  
  const payment = await prisma.payment_proofs.findUnique({
    where: { id: paymentId }
  });
  
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  if (payment.status !== 'pending') {
    throw new Error('Payment already processed');
  }
  
  if (action === 'approve' && payment.plan_type) {
    const plan = SUBSCRIPTION_PLANS[payment.plan_type as '3_months' | '6_months' | '1_year'];
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);
    
    await prisma.$transaction([
      prisma.payment_proofs.update({
        where: { id: paymentId },
        data: {
          status: 'approved',
          approved_by: adminId,
          approved_at: new Date()
        }
      }),
      
      prisma.users.update({
        where: { id: payment.user_id },
        data: {
          subscription_status: 'active',
          trial_ends_at: null
        }
      }),
      
      prisma.subscriptions.create({
        data: {
          user_id: payment.user_id,
          plan_type: payment.plan_type,
          start_date: startDate,
          end_date: endDate,
          is_active: true,
          is_trial: false
        }
      })
    ]);
    
    console.log(`✅ Subscription activated: ${plan.name} for merchant ${payment.user_id}`);
    
  } else {
    await prisma.payment_proofs.update({
      where: { id: paymentId },
      data: {
        status: 'rejected',
        ...(rejectionReason !== undefined && { rejection_reason: rejectionReason }),
        approved_by: adminId,
        approved_at: new Date()
      }
    });
  }
};

// ============================================
// AUTO-SUSPEND EXPIRED SUBSCRIPTIONS (CRON JOB)
// ============================================
export const checkAndSuspendExpiredSubscriptions = async (): Promise<void> => {
  const now = new Date();
  
  const expiredSubs = await prisma.subscriptions.findMany({
    where: {
      end_date: { lte: now },
      is_active: true
    },
    include: { users: true }
  });
  
  for (const sub of expiredSubs) {
    await prisma.$transaction([
      prisma.subscriptions.update({
        where: { id: sub.id },
        data: { is_active: false }
      }),
      
      prisma.users.update({
        where: { id: sub.user_id },
        data: { subscription_status: 'suspended' }
      })
    ]);
    
    console.log(`🔒 Merchant ${sub.user_id} subscription suspended (expired)`);
  }
};


// ============================================
// ADMIN: Get All Payment Approvals (Activation + Subscription)
// ============================================
export const getAllApprovals = async () => {
  const payments = await prisma.payment_proofs.findMany({
    where: {
      status: {
        in: ['pending', 'approved', 'rejected']
      }
    },
    include: {
      users: {
        select: {
          id: true,
          merchant_name: true,
          email: true,
          phone: true,
          physical_address: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
  
  const formattedPayments = payments.map((payment: any) => ({
    id: payment.id,
    type: payment.payment_type, // 'activation' or 'subscription'
    title: payment.payment_type === 'activation' 
      ? 'Activation Payment ($1)' 
      : `${payment.plan_type?.replace('_', ' ')} Subscription`,
    description: `${payment.payment_method} - ${payment.transaction_reference}`,
    submittedBy: {
      id: payment.users.id,
      name: payment.users.merchant_name,
      email: payment.users.email,
      phone: payment.users.phone,
      company: payment.users.physical_address || 'N/A'
    },
    submittedAt: payment.created_at.toISOString(),
    status: payment.status,
    content: {
      amount: parseFloat(payment.amount.toString()),
      paymentMethod: payment.payment_method,
      phoneNumber: payment.phone_number,
      transactionRef: payment.transaction_reference,
      paymentProofUrl: payment.payment_proof_url,
      planType: payment.plan_type,
      rejectionReason: payment.rejection_reason
    }
  }));
  
  return formattedPayments;
};

// ============================================
// ADMIN: Get Pending Payment Approvals Only
// ============================================
export const getPendingApprovals = async () => {
  const payments = await prisma.payment_proofs.findMany({
    where: {
      status: 'pending'
    },
    include: {
      users: {
        select: {
          id: true,
          merchant_name: true,
          email: true,
          phone: true,
          physical_address: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
  
  const formattedPayments = payments.map((payment: any) => ({
    id: payment.id,
    type: payment.payment_type,
    title: payment.payment_type === 'activation' 
      ? 'Activation Payment ($1)' 
      : `${payment.plan_type?.replace('_', ' ')} Subscription`,
    description: `${payment.payment_method} - ${payment.transaction_reference}`,
    submittedBy: {
      id: payment.users.id,
      name: payment.users.merchant_name,
      email: payment.users.email,
      phone: payment.users.phone,
      company: payment.users.physical_address || 'N/A'
    },
    submittedAt: payment.created_at.toISOString(),
    status: payment.status,
    content: {
      amount: parseFloat(payment.amount.toString()),
      paymentMethod: payment.payment_method,
      phoneNumber: payment.phone_number,
      transactionRef: payment.transaction_reference,
      paymentProofUrl: payment.payment_proof_url,
      planType: payment.plan_type
    }
  }));
  
  return formattedPayments;
};

// ============================================
// ADMIN: Process Payment Approval
// ============================================
export const processApproval = async (
  paymentId: number,
  action: 'approve' | 'reject',
  adminId: number,
  reason?: string
) => {
  const payment = await prisma.payment_proofs.findUnique({
    where: { id: paymentId }
  });
  
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  if (payment.status !== 'pending') {
    throw new Error('Payment already processed');
  }
  
  // Use the appropriate approval function based on payment type
  if (payment.payment_type === 'activation') {
    await approveActivationPayment(paymentId, action, adminId, reason);
    return {
      success: true,
      message: `Activation payment ${action}d successfully`
    };
  } else if (payment.payment_type === 'subscription') {
    await approveSubscriptionPayment(paymentId, action, adminId, reason);
    return {
      success: true,
      message: `Subscription payment ${action}d successfully`
    };
  }
  
  throw new Error('Invalid payment type');
};

// ============================================
// ADMIN: Get Payment Approval Statistics
// ============================================
export const getApprovalStats = async () => {
  const activationPending = await prisma.payment_proofs.count({ 
    where: { payment_type: 'activation', status: 'pending' } 
  });
  const activationApproved = await prisma.payment_proofs.count({ 
    where: { payment_type: 'activation', status: 'approved' } 
  });
  const activationRejected = await prisma.payment_proofs.count({ 
    where: { payment_type: 'activation', status: 'rejected' } 
  });
  
  const subscriptionPending = await prisma.payment_proofs.count({ 
    where: { payment_type: 'subscription', status: 'pending' } 
  });
  const subscriptionApproved = await prisma.payment_proofs.count({ 
    where: { payment_type: 'subscription', status: 'approved' } 
  });
  const subscriptionRejected = await prisma.payment_proofs.count({ 
    where: { payment_type: 'subscription', status: 'rejected' } 
  });
  
  const totalPending = activationPending + subscriptionPending;
  const totalApproved = activationApproved + subscriptionApproved;
  const totalRejected = activationRejected + subscriptionRejected;
  
  return {
    total: totalPending + totalApproved + totalRejected,
    pending: totalPending,
    approved: totalApproved,
    rejected: totalRejected,
    byType: {
      activation: {
        pending: activationPending,
        approved: activationApproved,
        rejected: activationRejected,
        total: activationPending + activationApproved + activationRejected
      },
      subscription: {
        pending: subscriptionPending,
        approved: subscriptionApproved,
        rejected: subscriptionRejected,
        total: subscriptionPending + subscriptionApproved + subscriptionRejected
      }
    }
  };
};

// Get pending payments for admin approval
export const getPendingPayments = async (): Promise<any[]> => {
  return await prisma.payment_proofs.findMany({
    where: { status: 'pending' },
    include: {
      users: {
        select: {
          id: true,
          merchant_name: true,
          email: true,
          phone: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
};

// Get merchant subscription status
export const getMerchantSubscription = async (merchantId: number): Promise<any> => {
  const subscription = await prisma.subscriptions.findFirst({
    where: {
      user_id: merchantId,
      is_active: true
    },
    orderBy: { end_date: 'desc' }
  });
  
  const merchant = await prisma.users.findUnique({
    where: { id: merchantId },
    select: {
      subscription_status: true,
      trial_ends_at: true
    }
  });
  
  return {
    ...merchant,
    currentSubscription: subscription
  };
};

// Get payment by ID
export const getPaymentById = async (paymentId: number): Promise<any> => {
  return await prisma.payment_proofs.findUnique({
    where: { id: paymentId }
  });
};


















// import { PrismaClient } from '@prisma/client';
// import { SUBSCRIPTION_PLANS } from '../utils/schemas';
// import cloudinary from '../config/cloudinary';

// const prisma = new PrismaClient();

// // Helper function to upload to Cloudinary
// const uploadToCloudinary = async (file: { buffer: Buffer; filename: string; mimetype: string }): Promise<string> => {
//   try {
//     const uploadResult = await new Promise<any>((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: 'payment-proofs',
//           public_id: `payment_${Date.now()}`,
//           resource_type: 'auto',
//           transformation: [
//             { width: 1500, height: 1500, crop: 'limit' },
//             { quality: 'auto' },
//             { fetch_format: 'auto' }
//           ]
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );
//       uploadStream.end(file.buffer);
//     });

//     console.log('✅ Payment proof uploaded to Cloudinary:', uploadResult.secure_url);
//     return uploadResult.secure_url;
//   } catch (error) {
//     console.error('❌ Cloudinary upload error:', error);
//     throw new Error('Failed to upload payment proof to Cloudinary');
//   }
// };

// // ============================================
// // ACTIVATION PAYMENT (1 month free trial)
// // ============================================
// export const submitActivationPayment = async (
//   data: {
//     merchantId: number;
//     paymentMethod: string;
//     phoneNumber: string;
//     transactionReference: string;
//     amount: number;
//   },
//   file?: { buffer: Buffer; filename: string; mimetype: string }
// ): Promise<any> => {
  
//   // Check if merchant exists
//   const merchant = await prisma.users.findUnique({
//     where: { id: data.merchantId }
//   });
  
//   if (!merchant || merchant.role !== 'client_admin') {
//     throw new Error('Merchant not found');
//   }
  
//   // Check if already activated
//   if (merchant.subscription_status !== 'inactive') {
//     throw new Error('Account already activated');
//   }
  
//   // Validate amount ($1 minimum)
//   if (data.amount < 1) {
//     throw new Error('Activation fee must be at least $1');
//   }
  
//   // Upload payment proof to Cloudinary if provided
//   let paymentProofUrl: string | null = null;
//   if (file) {
//     paymentProofUrl = await uploadToCloudinary(file);
//   }
  
//   // Create payment proof record
//   const payment = await prisma.payment_proofs.create({
//     data: {
//       user_id: data.merchantId,
//       payment_type: 'activation',
//       payment_method: data.paymentMethod,
//       phone_number: data.phoneNumber,
//       transaction_reference: data.transactionReference,
//       amount: data.amount,
//       payment_proof_url: paymentProofUrl,
//       status: 'pending'
//     }
//   });
  
//   console.log(`✅ Activation payment submitted for merchant ID: ${data.merchantId}`);
//   return payment;
// };

// // ============================================
// // APPROVE/REJECT ACTIVATION PAYMENT
// // ============================================
// export const approveActivationPayment = async (
//   paymentId: number,
//   action: 'approve' | 'reject',
//   adminId: number,
//   rejectionReason?: string
// ): Promise<void> => {
  
//   const payment = await prisma.payment_proofs.findUnique({
//     where: { id: paymentId },
//     include: { users: true }
//   });
  
//   if (!payment) {
//     throw new Error('Payment not found');
//   }
  
//   if (payment.status !== 'pending') {
//     throw new Error('Payment already processed');
//   }
  
//   if (action === 'approve') {
//     // Activate 1 month free trial
//     const trialEndsAt = new Date();
//     trialEndsAt.setDate(trialEndsAt.getDate() + 30);
    
//     await prisma.$transaction([
//       // Update payment status
//       prisma.payment_proofs.update({
//         where: { id: paymentId },
//         data: {
//           status: 'approved',
//           approved_by: adminId,
//           approved_at: new Date()
//         }
//       }),
      
//       // Activate merchant with 1-month trial
//       prisma.users.update({
//         where: { id: payment.user_id },
//         data: {
//           subscription_status: 'trial',
//           trial_ends_at: trialEndsAt
//         }
//       }),
      
//       // Create trial subscription record
//       prisma.subscriptions.create({
//         data: {
//           user_id: payment.user_id,
//           plan_type: '1_month_trial',
//           start_date: new Date(),
//           end_date: trialEndsAt,
//           is_trial: true,
//           is_active: true
//         }
//       })
//     ]);
    
//     console.log(`✅ Merchant ${payment.user_id} activated with 1-month free trial`);
    
//   } else {
//     // Reject payment - only include rejection_reason if it exists
//     await prisma.payment_proofs.update({
//       where: { id: paymentId },
//       data: {
//         status: 'rejected',
//         ...(rejectionReason !== undefined && { rejection_reason: rejectionReason }),
//         approved_by: adminId,
//         approved_at: new Date()
//       }
//     });
    
//     console.log(`❌ Activation payment rejected for merchant ${payment.user_id}`);
//   }
// };

// // ============================================
// // SUBMIT SUBSCRIPTION PLAN PAYMENT
// // ============================================
// export const submitSubscriptionPayment = async (
//   data: {
//     merchantId: number;
//     planType: '3_months' | '6_months' | '1_year';
//     paymentMethod: string;
//     phoneNumber: string;
//     transactionReference: string;
//   },
//   file?: { buffer: Buffer; filename: string; mimetype: string }
// ): Promise<any> => {
  
//   const merchant = await prisma.users.findUnique({
//     where: { id: data.merchantId }
//   });
  
//   if (!merchant || merchant.role !== 'client_admin') {
//     throw new Error('Merchant not found');
//   }
  
//   // Check if trial/subscription is active
//   if (merchant.subscription_status === 'inactive') {
//     throw new Error('Please activate your account first with $1 payment');
//   }
  
//   const plan = SUBSCRIPTION_PLANS[data.planType];
  
//   // Upload payment proof to Cloudinary if provided
//   let paymentProofUrl: string | null = null;
//   if (file) {
//     paymentProofUrl = await uploadToCloudinary(file);
//   }
  
//   // Create payment proof
//   const payment = await prisma.payment_proofs.create({
//     data: {
//       user_id: data.merchantId,
//       payment_type: 'subscription',
//       plan_type: data.planType,
//       payment_method: data.paymentMethod,
//       phone_number: data.phoneNumber,
//       transaction_reference: data.transactionReference,
//       amount: plan.price,
//       payment_proof_url: paymentProofUrl,
//       status: 'pending'
//     }
//   });
  
//   console.log(`✅ Subscription payment submitted: ${plan.name} for merchant ${data.merchantId}`);
//   return payment;
// };

// // ============================================
// // APPROVE/REJECT SUBSCRIPTION PAYMENT
// // ============================================
// export const approveSubscriptionPayment = async (
//   paymentId: number,
//   action: 'approve' | 'reject',
//   adminId: number,
//   rejectionReason?: string
// ): Promise<void> => {
  
//   const payment = await prisma.payment_proofs.findUnique({
//     where: { id: paymentId }
//   });
  
//   if (!payment) {
//     throw new Error('Payment not found');
//   }
  
//   if (payment.status !== 'pending') {
//     throw new Error('Payment already processed');
//   }
  
//   if (action === 'approve' && payment.plan_type) {
//     const plan = SUBSCRIPTION_PLANS[payment.plan_type as '3_months' | '6_months' | '1_year'];
    
//     const startDate = new Date();
//     const endDate = new Date();
//     endDate.setDate(endDate.getDate() + plan.duration);
    
//     await prisma.$transaction([
//       // Update payment
//       prisma.payment_proofs.update({
//         where: { id: paymentId },
//         data: {
//           status: 'approved',
//           approved_by: adminId,
//           approved_at: new Date()
//         }
//       }),
      
//       // Update merchant status
//       prisma.users.update({
//         where: { id: payment.user_id },
//         data: {
//           subscription_status: 'active',
//           trial_ends_at: null
//         }
//       }),
      
//       // Create subscription
//       prisma.subscriptions.create({
//         data: {
//           user_id: payment.user_id,
//           plan_type: payment.plan_type,
//           start_date: startDate,
//           end_date: endDate,
//           is_active: true,
//           is_trial: false
//         }
//       })
//     ]);
    
//     console.log(`✅ Subscription activated: ${plan.name} for merchant ${payment.user_id}`);
    
//   } else {
//     // Only include rejection_reason if it exists
//     await prisma.payment_proofs.update({
//       where: { id: paymentId },
//       data: {
//         status: 'rejected',
//         ...(rejectionReason !== undefined && { rejection_reason: rejectionReason }),
//         approved_by: adminId,
//         approved_at: new Date()
//       }
//     });
//   }
// };

// // ============================================
// // AUTO-SUSPEND EXPIRED SUBSCRIPTIONS (CRON JOB)
// // ============================================
// export const checkAndSuspendExpiredSubscriptions = async (): Promise<void> => {
//   const now = new Date();
  
//   // Find expired subscriptions
//   const expiredSubs = await prisma.subscriptions.findMany({
//     where: {
//       end_date: { lte: now },
//       is_active: true
//     },
//     include: { users: true }
//   });
  
//   for (const sub of expiredSubs) {
//     await prisma.$transaction([
//       // Deactivate subscription
//       prisma.subscriptions.update({
//         where: { id: sub.id },
//         data: { is_active: false }
//       }),
      
//       // Suspend merchant account
//       prisma.users.update({
//         where: { id: sub.user_id },
//         data: { subscription_status: 'suspended' }
//       })
//     ]);
    
//     console.log(`🔒 Merchant ${sub.user_id} subscription suspended (expired)`);
//   }
// };

// // Get pending payments for admin approval
// export const getPendingPayments = async (): Promise<any[]> => {
//   return await prisma.payment_proofs.findMany({
//     where: { status: 'pending' },
//     include: {
//       users: {
//         select: {
//           id: true,
//           merchant_name: true,
//           email: true,
//           phone: true
//         }
//       }
//     },
//     orderBy: { created_at: 'desc' }
//   });
// };

// // Get merchant subscription status
// export const getMerchantSubscription = async (merchantId: number): Promise<any> => {
//   const subscription = await prisma.subscriptions.findFirst({
//     where: {
//       user_id: merchantId,
//       is_active: true
//     },
//     orderBy: { end_date: 'desc' }
//   });
  
//   const merchant = await prisma.users.findUnique({
//     where: { id: merchantId },
//     select: {
//       subscription_status: true,
//       trial_ends_at: true
//     }
//   });
  
//   return {
//     ...merchant,
//     currentSubscription: subscription
//   };
// };

// // Get payment by ID
// export const getPaymentById = async (paymentId: number): Promise<any> => {
//   return await prisma.payment_proofs.findUnique({
//     where: { id: paymentId }
//   });
// };












