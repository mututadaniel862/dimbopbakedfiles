import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductAgentService } from '../../services/productAgentService';

type AgentApplicationParams = {
  id: string;
};

type ProductIdParams = {
  productId: string;
};

type AgentIdParams = {
  agentId: string;
};

type ApplyAgentBody = {
  productId: number;
  fullName: string;
  nationalId: string;
  idDocumentUrl?: string;
  payoutMethod: string;
  payoutNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  reason?: string;
  acceptedTerms: boolean;
};

type ApproveAgentBody = {
  commissionRate?: number;
};

type RejectAgentBody = {
  rejectionReason: string;
};

type GenerateReferralBody = {
  productId: number;
};

// ============================================
// USER CONTROLLERS
// ============================================

// export const applyAsProductAgentHandler = async (
//   request: FastifyRequest<{ Body: ApplyAgentBody }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { 
//       productId, 
//       fullName, 
//       nationalId, 
//       idDocumentUrl,
//       payoutMethod, 
//       payoutNumber, 
//       bankName, 
//       bankAccountNumber, 
//       bankAccountName, 
//       reason,
//       acceptedTerms
//     } = request.body;
    
//     const userId = (request.user as any).id;
    
//     // Validate terms acceptance
//     if (!acceptedTerms) {
//       return reply.status(400).send({
//         success: false,
//         message: 'You must accept the terms and conditions'
//       });
//     }
    
//     // Validate required fields
//     if (!productId || !fullName || !nationalId || !payoutMethod) {
//       return reply.status(400).send({
//         success: false,
//         message: 'Missing required fields: productId, fullName, nationalId, payoutMethod'
//       });
//     }
    
//     // Build the data object conditionally
//     const agentData: {
//       productId: number;
//       userId: number;
//       fullName: string;
//       nationalId: string;
//       payoutMethod: string;
//       idDocumentUrl?: string;
//       payoutNumber?: string;
//       bankName?: string;
//       bankAccountNumber?: string;
//       bankAccountName?: string;
//       reason?: string;
//     } = {
//       productId,
//       userId,
//       fullName,
//       nationalId,
//       payoutMethod
//     };
    
//     // Only add optional fields if they have values
//     if (idDocumentUrl) agentData.idDocumentUrl = idDocumentUrl;
//     if (payoutNumber) agentData.payoutNumber = payoutNumber;
//     if (bankName) agentData.bankName = bankName;
//     if (bankAccountNumber) agentData.bankAccountNumber = bankAccountNumber;
//     if (bankAccountName) agentData.bankAccountName = bankAccountName;
//     if (reason) agentData.reason = reason;
    
//     const application = await ProductAgentService.applyAsProductAgent(agentData);
    
//     reply.status(201).send({
//       success: true,
//       message: 'Application submitted successfully. Admin will review within 7 days.',
//       data: application
//     });
//   } catch (error: any) {
//     console.error('Error applying as product agent:', error);
//     reply.status(400).send({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };


// src/controllers/productAgents/controller.ts
// export const applyAsProductAgentHandler = async (
//   request: FastifyRequest<{ Body: ApplyAgentBody }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { 
//       productId, 
//       fullName, 
//       nationalId, 
//       idDocumentUrl,
//       payoutMethod, 
//       payoutNumber, 
//       bankName, 
//       bankAccountNumber, 
//       bankAccountName, 
//       reason,
//       acceptedTerms
//     } = request.body;
    
//     const userId = (request.user as any).id;
    
//     // Validate terms acceptance
//     if (!acceptedTerms) {
//       return reply.status(400).send({
//         success: false,
//         message: 'You must accept the terms and conditions'
//       });
//     }
    
//     // Validate required fields
//     if (!productId || !fullName || !nationalId || !payoutMethod) {
//       return reply.status(400).send({
//         success: false,
//         message: 'Missing required fields: productId, fullName, nationalId, payoutMethod'
//       });
//     }
    
//     const application = await ProductAgentService.applyAsProductAgent({
//       productId,
//       userId,
//       fullName,
//       nationalId,
//       payoutMethod,
//       ...(idDocumentUrl && { idDocumentUrl }),
//       ...(payoutNumber && { payoutNumber }),
//       ...(bankName && { bankName }),
//       ...(bankAccountNumber && { bankAccountNumber }),
//       ...(bankAccountName && { bankAccountName }),
//       ...(reason && { reason })
//     });
    
//     reply.status(201).send({
//       success: true,
//       message: 'Application submitted successfully. Admin will review within 7 days.',
//       data: application
//     });
//   } catch (error: any) {
//     console.error('Error applying as product agent:', error);
//     reply.status(400).send({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };



// src/controllers/productAgents/controller.ts
export const applyAsProductAgentHandler = async (
  request: FastifyRequest<{ Body: ApplyAgentBody }>,
  reply: FastifyReply
) => {
  try {
    const { 
      productId, 
      fullName, 
      nationalId, 
      idDocumentUrl,
      payoutMethod, 
      payoutNumber, 
      bankName, 
      bankAccountNumber, 
      bankAccountName, 
      reason,
      acceptedTerms
    } = request.body;
    
    const userId = (request.user as any)?.id;
    
    if (!userId) {
      return reply.status(401).send({
        success: false,
        message: 'You must be logged in as an agent to apply for a product. Guest registration through this endpoint is not supported yet.'
      });
    }
    
    if (!acceptedTerms) {
      return reply.status(400).send({
        success: false,
        message: 'You must accept the terms and conditions'
      });
    }
    
    if (!productId || !fullName || !nationalId || !payoutMethod) {
      return reply.status(400).send({
        success: false,
        message: 'Missing required fields: productId, fullName, nationalId, payoutMethod'
      });
    }
    
    const result = await ProductAgentService.applyAsProductAgent({
      productId,
      userId,
      fullName,
      nationalId,
      payoutMethod,
      ...(idDocumentUrl && { idDocumentUrl }),
      ...(payoutNumber && { payoutNumber }),
      ...(bankName && { bankName }),
      ...(bankAccountNumber && { bankAccountNumber }),
      ...(bankAccountName && { bankAccountName }),
      ...(reason && { reason })
    });
    
    const response: any = {
      success: true,
      message: 'Application submitted successfully. Admin will review within 7 days.',
      data: result
    };
    
    // Add warning if product is pending
    if (result.warning) {
      response.warning = result.warning;
    }
    
    reply.status(201).send(response);
  } catch (error: any) {
    console.error('Error applying as product agent:', error);
    reply.status(400).send({ 
      success: false, 
      message: error.message 
    });
  }
};




export const getUserAgentApplicationsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = (request.user as any).id;
    const applications = await ProductAgentService.getUserAgentApplications(userId);
    
    reply.send({ 
      success: true, 
      data: applications,
      count: applications.length
    });
  } catch (error: any) {
    console.error('Error fetching user applications:', error);
    reply.status(500).send({ 
      success: false, 
      message: 'Error fetching your applications' 
    });
  }
};

export const generateReferralLinkHandler = async (
  request: FastifyRequest<{ Body: GenerateReferralBody }>,
  reply: FastifyReply
) => {
  try {
    const { productId } = request.body;
    const userId = (request.user as any).id;
    
    if (!productId) {
      return reply.status(400).send({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    const linkData = await ProductAgentService.generateReferralLink(productId, userId);
    
    reply.send({ 
      success: true, 
      message: 'Referral link generated successfully',
      data: linkData 
    });
  } catch (error: any) {
    console.error('Error generating referral link:', error);
    reply.status(403).send({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getAgentStatsHandler = async (
  request: FastifyRequest<{ Params: AgentIdParams }>,
  reply: FastifyReply
) => {
  try {
    const { agentId } = request.params;
    const userId = (request.user as any).id;
    
    const stats = await ProductAgentService.getAgentStats(parseInt(agentId));
    
    reply.send({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Error fetching agent stats:', error);
    reply.status(500).send({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// PUBLIC CONTROLLERS
// ============================================

export const getProductAgentsHandler = async (
  request: FastifyRequest<{ Params: ProductIdParams }>,
  reply: FastifyReply
) => {
  try {
    const { productId } = request.params;
    const agents = await ProductAgentService.getProductAgents(parseInt(productId));
    
    reply.send({
      success: true,
      data: agents,
      count: agents.length
    });
  } catch (error: any) {
    console.error('Error fetching product agents:', error);
    reply.status(500).send({ 
      success: false, 
      message: 'Error fetching agents for this product' 
    });
  }
};




// ============================================
// ADMIN CONTROLLERS
// ============================================

export const getPendingAgentApplicationsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userRole = (request.user as any)?.role;
    
    // Check if user is admin
    if (userRole !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    const applications = await ProductAgentService.getPendingApplications();
    
    reply.send({ 
      success: true, 
      data: applications, 
      count: applications.length,
      message: applications.length > 0 
        ? `${applications.length} pending agent application(s)` 
        : 'No pending applications'
    });
  } catch (error: any) {
    console.error('Error fetching pending applications:', error);
    reply.status(500).send({ 
      success: false, 
      message: 'Error fetching pending applications' 
    });
  }
};

export const approveAgentHandler = async (
  request: FastifyRequest<{ 
    Params: AgentApplicationParams; 
    Body: ApproveAgentBody 
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const { commissionRate } = request.body;
    const adminId = (request.user as any).id;
    const userRole = (request.user as any)?.role;
    
    // Check if user is admin
    if (userRole !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    // Validate commission rate if provided
    if (commissionRate !== undefined) {
      if (commissionRate < 0.1 || commissionRate > 50) {
        return reply.status(400).send({
          success: false,
          message: 'Commission rate must be between 0.1% and 50%'
        });
      }
    }
    
    const approvedAgent = await ProductAgentService.approveAgent(
      parseInt(id),
      adminId,
      commissionRate || 5.0
    );
    
    reply.send({
      success: true,
      message: 'Agent approved successfully',
      data: approvedAgent
    });
  } catch (error: any) {
    console.error('Error approving agent:', error);
    reply.status(400).send({ 
      success: false, 
      message: error.message 
    });
  }
};

export const rejectAgentHandler = async (
  request: FastifyRequest<{ 
    Params: AgentApplicationParams; 
    Body: RejectAgentBody 
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const { rejectionReason } = request.body;
    const adminId = (request.user as any).id;
    const userRole = (request.user as any)?.role;
    
    // Check if user is admin
    if (userRole !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    // Validate rejection reason
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      return reply.status(400).send({
        success: false,
        message: 'Rejection reason must be at least 10 characters'
      });
    }
    
    const rejectedAgent = await ProductAgentService.rejectAgent(
      parseInt(id),
      adminId,
      rejectionReason
    );
    
    reply.send({
      success: true,
      message: 'Agent application rejected',
      data: rejectedAgent
    });
  } catch (error: any) {
    console.error('Error rejecting agent:', error);
    reply.status(400).send({ 
      success: false, 
      message: error.message 
    });
  }
};









// export const getAllAgentApplicationsHandler = async (
//   request: FastifyRequest<{ 
//     Querystring: { 
//       status?: string; 
//       productId?: string;
//       limit?: string;
//       offset?: string;
//     } 
//   }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const userRole = (request.user as any)?.role;
    
//     // Check if user is admin
//     if (userRole !== 'super_admin') {
//       return reply.status(403).send({
//         success: false,
//         message: 'Access denied. Admin privileges required.'
//       });
//     }
    
//     const { status, productId, limit, offset } = request.query;
    
//     // This would need to be implemented in the service
//     // For now, just return pending applications
//     const applications = await ProductAgentService.getPendingApplications();
    
//     reply.send({
//       success: true,
//       data: applications,
//       count: applications.length
//     });
//   } catch (error: any) {
//     console.error('Error fetching all applications:', error);
//     reply.status(500).send({ 
//       success: false, 
//       message: 'Error fetching applications' 
//     });
//   }
// };






// In your controller.ts file - UPDATE THIS FUNCTION:

export const getAllAgentApplicationsHandler = async (
  request: FastifyRequest<{ 
    Querystring: { 
      status?: string; 
      productId?: string;
    } 
  }>,
  reply: FastifyReply
) => {
  try {
    const userRole = (request.user as any)?.role;
    
    if (userRole !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    const { status, productId } = request.query;
    
    // ✅ FIX: Call getAllApplications instead of getPendingApplications
    const applications = await ProductAgentService.getAllApplications({
      ...(status && { status: status as 'pending' | 'approved' | 'rejected' }),
      ...(productId && { productId: parseInt(productId) })
    });
    
    reply.send({
      success: true,
      data: applications,
      count: applications.length
    });
  } catch (error: any) {
    console.error('Error fetching all applications:', error);
    reply.status(500).send({ 
      success: false, 
      message: 'Error fetching applications' 
    });
  }
};