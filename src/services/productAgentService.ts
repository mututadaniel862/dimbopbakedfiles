import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export class ProductAgentService {
  
  // User applies to become agent for a specific product
  static async applyAsProductAgent(data: {
    productId: number;
    userId: number;
    fullName: string;
    nationalId: string;
    payoutMethod: string;
    idDocumentUrl?: string;
    payoutNumber?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    reason?: string;
  }) {
    
    // Check if product exists
    const product = await prisma.products.findUnique({
      where: { id: data.productId }
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Check if product is rejected
    if (product.approval_status === 'rejected') {
      throw new Error('This product has been rejected and is not available for promotion');
    }
    
    // Check if user already applied for this product
    const existingApplication = await prisma.product_agents.findFirst({
      where: {
        product_id: data.productId,
        user_id: data.userId
      }
    });
    
    if (existingApplication) {
      if (existingApplication.status === 'pending') {
        throw new Error('Your application is pending review');
      }
      if (existingApplication.status === 'approved') {
        throw new Error('You are already an approved agent for this product');
      }
      if (existingApplication.status === 'rejected') {
        throw new Error(`Your previous application was rejected: ${existingApplication.rejection_reason}`);
      }
    }
    
    // Create application
    const application = await prisma.product_agents.create({
      data: {
        product_id: data.productId,
        user_id: data.userId,
        full_name: data.fullName,
        national_id: data.nationalId,
        payout_method: data.payoutMethod,
        status: 'pending',
        applied_at: new Date(),
        ...(data.idDocumentUrl && { id_document_url: data.idDocumentUrl }),
        ...(data.payoutNumber && { payout_number: data.payoutNumber }),
        ...(data.bankName && { bank_name: data.bankName }),
        ...(data.bankAccountNumber && { bank_account_number: data.bankAccountNumber }),
        ...(data.bankAccountName && { bank_account_name: data.bankAccountName }),
        ...(data.reason && { reason: data.reason })
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true,
            approval_status: true,
            is_visible: true
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
    
    // Return with a warning if product is not yet approved
    return {
      ...application,
      warning: product.approval_status === 'pending' 
        ? 'Note: This product is pending approval. You can start promoting once both the product and your agent application are approved.' 
        : null
    };
  }
  
  // Admin approves agent application
  static async approveAgent(
    applicationId: number, 
    adminId: number, 
    commissionRate: number = 5.0
  ) {
    
    const application = await prisma.product_agents.findUnique({
      where: { id: applicationId },
      include: { products: true }
    });
    
    if (!application) {
      throw new Error('Application not found');
    }
    
    if (application.status === 'approved') {
      throw new Error('Agent already approved');
    }
    
    // Generate unique agent code
    const agentCode = `AG${application.product_id}U${application.user_id}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    
    return await prisma.product_agents.update({
      where: { id: applicationId },
      data: {
        status: 'approved',
        approved_at: new Date(),
        approved_by: adminId,
        commission_rate: commissionRate,
        agent_code: agentCode
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true
          }
        },
        users: {
          select: { 
            id: true, 
            username: true, 
            email: true 
          }
        }
      }
    });
  }
  
  // Admin rejects agent application
  static async rejectAgent(
    applicationId: number, 
    adminId: number, 
    reason: string
  ) {
    return await prisma.product_agents.update({
      where: { id: applicationId },
      data: {
        status: 'rejected',
        rejection_reason: reason,
        reviewed_at: new Date(),
        reviewed_by: adminId
      }
    });
  }
  
  // Generate referral link for approved agent
  static async generateReferralLink(productId: number, userId: number) {
    
    const agent = await prisma.product_agents.findFirst({
      where: {
        product_id: productId,
        user_id: userId,
        status: 'approved'
      },
      include: {
        products: true
      }
    });
    
    if (!agent) {
      throw new Error('You are not an approved agent for this product');
    }
    
    const baseUrl = process.env.FRONTEND_URL || 'https://mmshop.co.zw';
    const referralLink = `${baseUrl}/product/${productId}?ref=${agent.agent_code}`;
    
    return {
      referralLink,
      agentCode: agent.agent_code,
      commissionRate: agent.commission_rate,
      product: {
        id: agent.products.id,
        name: agent.products.name,
        price: agent.products.price,
        image_url: agent.products.image_url
      }
    };
  }
  
  // Get all pending applications (Admin)
  static async getPendingApplications() {
    return await prisma.product_agents.findMany({
      where: { status: 'pending' },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true
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
      },
      orderBy: { applied_at: 'desc' }
    });
  }
  
  // ✅ FIXED: Get ALL applications with filters
  static async getAllApplications(filters?: {
    status?: 'pending' | 'approved' | 'rejected';
    productId?: number;
  }) {
    const whereClause: any = {};
    
    if (filters?.status) {
      whereClause.status = filters.status;
    }
    
    if (filters?.productId) {
      whereClause.product_id = filters.productId;
    }
    
    return await prisma.product_agents.findMany({
      where: whereClause,
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true
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
      },
      orderBy: { applied_at: 'desc' }
    });
  }
  
  // Get user's agent applications
  static async getUserAgentApplications(userId: number) {
    return await prisma.product_agents.findMany({
      where: { user_id: userId },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            image_url: true
          }
        }
      },
      orderBy: { applied_at: 'desc' }
    });
  }
  
  // Get all approved agents for a specific product
  static async getProductAgents(productId: number) {
    return await prisma.product_agents.findMany({
      where: {
        product_id: productId,
        status: 'approved'
      },
      include: {
        users: {
          select: { 
            id: true, 
            username: true 
          }
        }
      },
      orderBy: { approved_at: 'desc' }
    });
  }
  
  // Get agent stats
  static async getAgentStats(agentId: number) {
    const agent = await prisma.product_agents.findUnique({
      where: { id: agentId },
      include: {
        products: true
      }
    });
    
    if (!agent) {
      throw new Error('Agent not found');
    }
    
    return {
      agent_code: agent.agent_code,
      commission_rate: agent.commission_rate,
      total_sales: agent.total_sales || 0,
      total_commission: agent.total_commission || 0,
      status: agent.status,
      product: {
        id: agent.products.id,
        name: agent.products.name
      }
    };
  }
}















// import { PrismaClient } from "@prisma/client";
// import crypto from "crypto";

// const prisma = new PrismaClient();

// export class ProductAgentService {
  
//   // User applies to become agent for a specific product
// //    static async applyAsProductAgent(data: {
// //     productId: number;
// //     userId: number;
// //     fullName: string;
// //     nationalId: string;
// //     payoutMethod: string;
// //     idDocumentUrl?: string;
// //     payoutNumber?: string;
// //     bankName?: string;
// //     bankAccountNumber?: string;
// //     bankAccountName?: string;
// //     reason?: string;
// //   }) {
    
// //     // Check if product exists and is approved
// //     const product = await prisma.products.findUnique({
// //       where: { id: data.productId }
// //     });
    
// //     if (!product) {
// //       throw new Error('Product not found');
// //     }
    
// //     if (product.approval_status !== 'approved' || !product.is_visible) {
// //       throw new Error('This product is not available for agent registration');
// //     }
    
// //     // Check if user already applied for this product
// //     const existingApplication = await prisma.product_agents.findFirst({
// //       where: {
// //         product_id: data.productId,
// //         user_id: data.userId
// //       }
// //     });
    
// //     if (existingApplication) {
// //       if (existingApplication.status === 'pending') {
// //         throw new Error('Your application is pending review');
// //       }
// //       if (existingApplication.status === 'approved') {
// //         throw new Error('You are already an approved agent for this product');
// //       }
// //       if (existingApplication.status === 'rejected') {
// //         throw new Error(`Your previous application was rejected: ${existingApplication.rejection_reason}`);
// //       }
// //     }
    
// //     // Create application - only pass defined values
// //     return await prisma.product_agents.create({
// //       data: {
// //         product_id: data.productId,
// //         user_id: data.userId,
// //         full_name: data.fullName,
// //         national_id: data.nationalId,
// //         payout_method: data.payoutMethod,
// //         status: 'pending',
// //         applied_at: new Date(),
// //         // Conditionally add optional fields
// //         ...(data.idDocumentUrl && { id_document_url: data.idDocumentUrl }),
// //         ...(data.payoutNumber && { payout_number: data.payoutNumber }),
// //         ...(data.bankName && { bank_name: data.bankName }),
// //         ...(data.bankAccountNumber && { bank_account_number: data.bankAccountNumber }),
// //         ...(data.bankAccountName && { bank_account_name: data.bankAccountName }),
// //         ...(data.reason && { reason: data.reason })
// //       },
// //       include: {
// //         products: {
// //           select: {
// //             id: true,
// //             name: true,
// //             price: true,
// //             image_url: true
// //           }
// //         },
// //         users: {
// //           select: { 
// //             id: true, 
// //             username: true, 
// //             email: true, 
// //             phone: true 
// //           }
// //         }
// //       }
// //     });
// //   }



// static async applyAsProductAgent(data: {
//   productId: number;
//   userId: number;
//   fullName: string;
//   nationalId: string;
//   payoutMethod: string;
//   idDocumentUrl?: string;
//   payoutNumber?: string;
//   bankName?: string;
//   bankAccountNumber?: string;
//   bankAccountName?: string;
//   reason?: string;
// }) {
  
//   // Check if product exists
//   const product = await prisma.products.findUnique({
//     where: { id: data.productId }
//   });
  
//   if (!product) {
//     throw new Error('Product not found');
//   }
  
//   // ✅ Check if product is rejected - don't allow agent applications
//   if (product.approval_status === 'rejected') {
//     throw new Error('This product has been rejected and is not available for promotion');
//   }
  
//   // Check if user already applied for this product
//   const existingApplication = await prisma.product_agents.findFirst({
//     where: {
//       product_id: data.productId,
//       user_id: data.userId
//     }
//   });
  
//   if (existingApplication) {
//     if (existingApplication.status === 'pending') {
//       throw new Error('Your application is pending review');
//     }
//     if (existingApplication.status === 'approved') {
//       throw new Error('You are already an approved agent for this product');
//     }
//     if (existingApplication.status === 'rejected') {
//       throw new Error(`Your previous application was rejected: ${existingApplication.rejection_reason}`);
//     }
//   }
  
//   // Create application
//   const application = await prisma.product_agents.create({
//     data: {
//       product_id: data.productId,
//       user_id: data.userId,
//       full_name: data.fullName,
//       national_id: data.nationalId,
//       payout_method: data.payoutMethod,
//       status: 'pending',
//       applied_at: new Date(),
//       ...(data.idDocumentUrl && { id_document_url: data.idDocumentUrl }),
//       ...(data.payoutNumber && { payout_number: data.payoutNumber }),
//       ...(data.bankName && { bank_name: data.bankName }),
//       ...(data.bankAccountNumber && { bank_account_number: data.bankAccountNumber }),
//       ...(data.bankAccountName && { bank_account_name: data.bankAccountName }),
//       ...(data.reason && { reason: data.reason })
//     },
//     include: {
//       products: {
//         select: {
//           id: true,
//           name: true,
//           price: true,
//           image_url: true,
//           approval_status: true,
//           is_visible: true
//         }
//       },
//       users: {
//         select: { 
//           id: true, 
//           username: true, 
//           email: true, 
//           phone: true 
//         }
//       }
//     }
//   });
  
//   // Return with a warning if product is not yet approved
//   return {
//     ...application,
//     warning: product.approval_status === 'pending' 
//       ? 'Note: This product is pending approval. You can start promoting once both the product and your agent application are approved.' 
//       : null
//   };
// }

  
//   // Admin approves agent application
//   static async approveAgent(
//     applicationId: number, 
//     adminId: number, 
//     commissionRate: number = 5.0
//   ) {
    
//     const application = await prisma.product_agents.findUnique({
//       where: { id: applicationId },
//       include: { products: true }
//     });
    
//     if (!application) {
//       throw new Error('Application not found');
//     }
    
//     if (application.status === 'approved') {
//       throw new Error('Agent already approved');
//     }
    
//     // Generate unique agent code: AG-PRODUCTID-USERID-RANDOM
//     const agentCode = `AG${application.product_id}U${application.user_id}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    
//     return await prisma.product_agents.update({
//       where: { id: applicationId },
//       data: {
//         status: 'approved',
//         approved_at: new Date(),
//         approved_by: adminId,
//         commission_rate: commissionRate,
//         agent_code: agentCode
//       },
//       include: {
//         products: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             image_url: true
//           }
//         },
//         users: {
//           select: { 
//             id: true, 
//             username: true, 
//             email: true 
//           }
//         }
//       }
//     });
//   }
  
//   // Admin rejects agent application
//   static async rejectAgent(
//     applicationId: number, 
//     adminId: number, 
//     reason: string
//   ) {
//     return await prisma.product_agents.update({
//       where: { id: applicationId },
//       data: {
//         status: 'rejected',
//         rejection_reason: reason,
//         reviewed_at: new Date(),
//         reviewed_by: adminId
//       }
//     });
//   }
  
//   // Generate referral link for approved agent
//   static async generateReferralLink(productId: number, userId: number) {
    
//     const agent = await prisma.product_agents.findFirst({
//       where: {
//         product_id: productId,
//         user_id: userId,
//         status: 'approved'
//       },
//       include: {
//         products: true
//       }
//     });
    
//     if (!agent) {
//       throw new Error('You are not an approved agent for this product');
//     }
    
//     // Example referral link
//     const baseUrl = process.env.FRONTEND_URL || 'https://mmshop.co.zw';
//     const referralLink = `${baseUrl}/product/${productId}?ref=${agent.agent_code}`;
    
//     return {
//       referralLink,
//       agentCode: agent.agent_code,
//       commissionRate: agent.commission_rate,
//       product: {
//         id: agent.products.id,
//         name: agent.products.name,
//         price: agent.products.price,
//         image_url: agent.products.image_url
//       }
//     };
//   }
  
//   // Get all pending applications (Admin)
//   static async getPendingApplications() {
//     return await prisma.product_agents.findMany({
//       where: { status: 'pending' },
//       include: {
//         products: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             image_url: true
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
//       },
//       orderBy: { applied_at: 'asc' }
//     });
//   }
  
//   // Get user's agent applications
//   static async getUserAgentApplications(userId: number) {
//     return await prisma.product_agents.findMany({
//       where: { user_id: userId },
//       include: {
//         products: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             image_url: true
//           }
//         }
//       },
//       orderBy: { applied_at: 'desc' }
//     });
//   }
  
//   // Get all approved agents for a specific product
//   static async getProductAgents(productId: number) {
//     return await prisma.product_agents.findMany({
//       where: {
//         product_id: productId,
//         status: 'approved'
//       },
//       include: {
//         users: {
//           select: { 
//             id: true, 
//             username: true 
//           }
//         }
//       },
//       orderBy: { approved_at: 'desc' }
//     });
//   }
  
//   // Get agent stats
//   static async getAgentStats(agentId: number) {
//     const agent = await prisma.product_agents.findUnique({
//       where: { id: agentId },
//       include: {
//         products: true
//       }
//     });
    
//     if (!agent) {
//       throw new Error('Agent not found');
//     }
    
//     return {
//       agent_code: agent.agent_code,
//       commission_rate: agent.commission_rate,
//       total_sales: agent.total_sales || 0,
//       total_commission: agent.total_commission || 0,
//       status: agent.status,
//       product: {
//         id: agent.products.id,
//         name: agent.products.name
//       }
//     };
//   }
// }

