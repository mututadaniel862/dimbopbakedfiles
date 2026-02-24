// src/controllers/agents/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { users } from '@prisma/client';
import * as agentService from '../../services/agentService';
import { generateToken } from '../../utils/jwt';
import { 
  agentRegisterSchema,
  recordAgentSaleSchema,
  createPayoutSchema
} from '../../utils/schemas';

// ============================================
// REGISTER AS AGENT
// ============================================
export const registerAgent = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as users;
    
    if (!user) {
      return reply.code(401).send({
        success: false,
        error: 'Authentication failed. Please use /register-new for guest agent registration.'
      });
    }
    const validatedData = agentRegisterSchema.parse(request.body);

    // Check if already an agent
    if (user.agent_code) {
      return reply.code(400).send({
        success: false,
        error: 'You are already registered as an agent'
      });
    }

    // Build agent data object - only include defined values
    const agentData: {
      commissionRate?: number;
      payoutMethod?: string;
      payoutNumber?: string;
      payoutName?: string;
      minPayoutAmount?: number;
    } = {};

    if (validatedData.commissionRate !== undefined) agentData.commissionRate = validatedData.commissionRate;
    if (validatedData.payoutMethod !== undefined) agentData.payoutMethod = validatedData.payoutMethod;
    if (validatedData.payoutNumber !== undefined) agentData.payoutNumber = validatedData.payoutNumber;
    if (validatedData.payoutName !== undefined) agentData.payoutName = validatedData.payoutName;
    if (validatedData.minPayoutAmount !== undefined) agentData.minPayoutAmount = validatedData.minPayoutAmount;

    // Register as agent
    const updatedUser = await agentService.AgentService.registerAgent(user.id, agentData);

    // ✅ GENERATE NEW TOKEN WITH AGENT DATA
    const token = generateToken(updatedUser);

    reply.code(200).send({
      success: true,
      message: 'Successfully registered as agent',
      data: {
        agentCode: updatedUser.agent_code,
        commissionRate: updatedUser.commission_rate,
        status: updatedUser.agent_status,
        payoutMethod: updatedUser.agent_payout_method,
        payoutNumber: updatedUser.agent_payout_number,
        minPayoutAmount: updatedUser.min_payout_amount
      },
      token // ✅ NOW AGENT GETS A TOKEN
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Failed to register as agent'
    });
  }
};

// ============================================
// GET AGENT STATS
// ============================================
export const getAgentStats = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as users;

    if (!user.agent_code) {
      return reply.code(403).send({
        success: false,
        error: 'You are not registered as an agent'
      });
    }

    const stats = await agentService.AgentService.getAgentStats(user.id);

    reply.code(200).send({
      success: true,
      data: stats
    });
  } catch (error: any) {
    reply.code(500).send({
      success: false,
      error: error.message || 'Failed to fetch agent stats'
    });
  }
};

// ============================================
// RECORD AGENT SALE (Public - called when customer places order)
// ============================================
export const recordAgentSale = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // ✅ VALIDATE WITH SCHEMA
    const { orderId, agentCode } = recordAgentSaleSchema.parse(request.body);

    const sale = await agentService.AgentService.recordAgentSale(orderId, agentCode);

    reply.code(200).send({
      success: true,
      message: 'Agent sale recorded',
      data: sale
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Failed to record agent sale'
    });
  }
};

// ============================================
// ADMIN ROUTES
// ============================================
export const getAllAgents = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as users;

    // Only super_admin and digital_marketer_admin can view all agents
    if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
      return reply.code(403).send({
        success: false,
        error: 'Unauthorized'
      });
    }

    const agents = await agentService.AgentService.getAllAgents();

    reply.code(200).send({
      success: true,
      data: agents,
      count: agents.length
    });
  } catch (error: any) {
    reply.code(500).send({
      success: false,
      error: error.message || 'Failed to fetch agents'
    });
  }
};

export const approveCommission = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as users;
    const { saleId } = request.params as { saleId: string };

    if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
      return reply.code(403).send({
        success: false,
        error: 'Unauthorized'
      });
    }

    const sale = await agentService.AgentService.approveCommission(
      parseInt(saleId),
      user.id
    );

    reply.code(200).send({
      success: true,
      message: 'Commission approved',
      data: sale
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Failed to approve commission'
    });
  }
};

export const createPayout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as users;
    
    // ✅ VALIDATE WITH SCHEMA
    const validatedData = createPayoutSchema.parse(request.body);

    if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
      return reply.code(403).send({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Build payout data - only include defined optional values
    const payoutData: {
      amount: number;
      paymentMethod: string;
      paymentReference?: string;
      payoutAccount?: string;
      fromDate: Date;
      toDate: Date;
    } = {
      amount: validatedData.amount,
      paymentMethod: validatedData.paymentMethod,
      fromDate: new Date(validatedData.fromDate),
      toDate: new Date(validatedData.toDate)
    };

    if (validatedData.paymentReference !== undefined) {
      payoutData.paymentReference = validatedData.paymentReference;
    }
    if (validatedData.payoutAccount !== undefined) {
      payoutData.payoutAccount = validatedData.payoutAccount;
    }

    const payout = await agentService.AgentService.createPayout(
      validatedData.agentId, 
      user.id, 
      payoutData
    );

    reply.code(200).send({
      success: true,
      message: 'Payout created',
      data: payout
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Failed to create payout'
    });
  }
};

export const completePayout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as users;
    const { payoutId } = request.params as { payoutId: string };

    if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
      return reply.code(403).send({
        success: false,
        error: 'Unauthorized'
      });
    }

    const payout = await agentService.AgentService.completePayout(
      parseInt(payoutId),
      user.id
    );

    reply.code(200).send({
      success: true,
      message: 'Payout completed successfully',
      data: payout
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Failed to complete payout'
    });
  }
};

export const getPendingPayouts = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as users;

    if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
      return reply.code(403).send({
        success: false,
        error: 'Unauthorized'
      });
    }

    const payouts = await agentService.AgentService.getPendingPayouts();

    reply.code(200).send({
      success: true,
      data: payouts,
      count: payouts.length
    });
  } catch (error: any) {
    reply.code(500).send({
      success: false,
      error: error.message || 'Failed to fetch pending payouts'
    });
  }
};




// ============================================
// REGISTER NEW AGENT (NO AUTH REQUIRED)
// ============================================
export const registerNewAgent = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { registerNewAgentSchema } = await import('../../utils/schemas.js');
    const validatedData = registerNewAgentSchema.parse(request.body);

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const bcrypt = await import('bcryptjs');

    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return reply.code(400).send({
        success: false,
        error: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Generate agent code
    const baseCode = validatedData.name.toUpperCase().slice(0, 6);
    const year = new Date().getFullYear();
    let agentCode = `${baseCode}${year}`;
    let counter = 1;

    while (await prisma.users.findUnique({ where: { agent_code: agentCode } })) {
      agentCode = `${baseCode}${year}${counter}`;
      counter++;
    }

    // Create new agent user
    const newAgent = await prisma.users.create({
      data: {
        name: validatedData.name,
        username: validatedData.name.toLowerCase().replace(/\s+/g, '_'),
        email: validatedData.email,
        phone: validatedData.phone,
      password_hash: hashedPassword, 
        role: 'agent',
        auth_provider: 'email',
        is_active: true,
        email_verified: false,
        
        // Agent-specific fields
        agent_code: agentCode,
        commission_rate: validatedData.commissionRate || 5.0,
        agent_payout_method: validatedData.payoutMethod || null,
        agent_payout_number: validatedData.payoutNumber || null,
        agent_payout_name: validatedData.payoutName || validatedData.name,
        min_payout_amount: validatedData.minPayoutAmount || 10.0,
        agent_status: 'active',
        total_sales_value: 0,
        total_commission_earned: 0,
        pending_commission: 0,
        paid_commission: 0,
        total_orders_referred: 0,
      }
    });

    // Generate token
    const token = generateToken(newAgent);

    reply.code(201).send({
      success: true,
      message: 'Agent account created successfully',
      user: {
        id: newAgent.id,
        name: newAgent.name,
        email: newAgent.email,
        phone: newAgent.phone,
        role: newAgent.role,
        agentCode: newAgent.agent_code,
        commissionRate: newAgent.commission_rate,
      },
      token
    });
  } catch (error: any) {
    console.error('New agent registration error:', error);
    reply.code(400).send({
      success: false,
      error: error.message || 'Failed to register agent'
    });
  }
};














// // src/controllers/agents/controller.ts
// import { FastifyRequest, FastifyReply } from 'fastify';
// import { users } from '@prisma/client';
// import * as agentService from '../../services/agentService';
// import { generateToken } from '../../utils/jwt';

// // ============================================
// // REGISTER AS AGENT
// // ============================================
// export const registerAgent = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;
//     const body = request.body as {
//       commissionRate?: number;
//       payoutMethod?: string;
//       payoutNumber?: string;
//       payoutName?: string;
//       minPayoutAmount?: number;
//     };

//     // Check if already an agent
//     if (user.agent_code) {
//       return reply.code(400).send({
//         success: false,
//         error: 'You are already registered as an agent'
//       });
//     }

//     // Build agent data object - only include defined values
//     const agentData: {
//       commissionRate?: number;
//       payoutMethod?: string;
//       payoutNumber?: string;
//       payoutName?: string;
//       minPayoutAmount?: number;
//     } = {};

//     if (body.commissionRate !== undefined) agentData.commissionRate = body.commissionRate;
//     if (body.payoutMethod !== undefined) agentData.payoutMethod = body.payoutMethod;
//     if (body.payoutNumber !== undefined) agentData.payoutNumber = body.payoutNumber;
//     if (body.payoutName !== undefined) agentData.payoutName = body.payoutName;
//     if (body.minPayoutAmount !== undefined) agentData.minPayoutAmount = body.minPayoutAmount;

//     // Register as agent
//     const updatedUser = await agentService.AgentService.registerAgent(user.id, agentData);

//     // ✅ GENERATE NEW TOKEN WITH AGENT DATA
//     const token = generateToken(updatedUser);

//     reply.code(200).send({
//       success: true,
//       message: 'Successfully registered as agent',
//       data: {
//         agentCode: updatedUser.agent_code,
//         commissionRate: updatedUser.commission_rate,
//         status: updatedUser.agent_status,
//         payoutMethod: updatedUser.agent_payout_method,
//         payoutNumber: updatedUser.agent_payout_number,
//         minPayoutAmount: updatedUser.min_payout_amount
//       },
//       token // ✅ NOW AGENT GETS A TOKEN
//     });
//   } catch (error: any) {
//     reply.code(500).send({
//       success: false,
//       error: error.message || 'Failed to register as agent'
//     });
//   }
// };

// // ============================================
// // GET AGENT STATS
// // ============================================
// export const getAgentStats = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;

//     if (!user.agent_code) {
//       return reply.code(403).send({
//         success: false,
//         error: 'You are not registered as an agent'
//       });
//     }

//     const stats = await agentService.AgentService.getAgentStats(user.id);

//     reply.code(200).send({
//       success: true,
//       data: stats
//     });
//   } catch (error: any) {
//     reply.code(500).send({
//       success: false,
//       error: error.message || 'Failed to fetch agent stats'
//     });
//   }
// };

// // ============================================
// // RECORD AGENT SALE (Public - called when customer places order)
// // ============================================
// export const recordAgentSale = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const { orderId, agentCode } = request.body as {
//       orderId: number;
//       agentCode: string;
//     };

//     const sale = await agentService.AgentService.recordAgentSale(orderId, agentCode);

//     reply.code(200).send({
//       success: true,
//       message: 'Agent sale recorded',
//       data: sale
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Failed to record agent sale'
//     });
//   }
// };

// // ============================================
// // ADMIN ROUTES
// // ============================================
// export const getAllAgents = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;

//     // Only super_admin and digital_marketer_admin can view all agents
//     if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
//       return reply.code(403).send({
//         success: false,
//         error: 'Unauthorized'
//       });
//     }

//     const agents = await agentService.AgentService.getAllAgents();

//     reply.code(200).send({
//       success: true,
//       data: agents,
//       count: agents.length
//     });
//   } catch (error: any) {
//     reply.code(500).send({
//       success: false,
//       error: error.message || 'Failed to fetch agents'
//     });
//   }
// };

// export const approveCommission = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;
//     const { saleId } = request.params as { saleId: string };

//     if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
//       return reply.code(403).send({
//         success: false,
//         error: 'Unauthorized'
//       });
//     }

//     const sale = await agentService.AgentService.approveCommission(
//       parseInt(saleId),
//       user.id
//     );

//     reply.code(200).send({
//       success: true,
//       message: 'Commission approved',
//       data: sale
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Failed to approve commission'
//     });
//   }
// };

// export const createPayout = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;
//     const body = request.body as {
//       agentId: number;
//       amount: number;
//       paymentMethod: string;
//       paymentReference?: string;
//       payoutAccount?: string;
//       fromDate: string;
//       toDate: string;
//     };

//     if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
//       return reply.code(403).send({
//         success: false,
//         error: 'Unauthorized'
//       });
//     }

//     // Build payout data - only include defined optional values
//     const payoutData: {
//       amount: number;
//       paymentMethod: string;
//       paymentReference?: string;
//       payoutAccount?: string;
//       fromDate: Date;
//       toDate: Date;
//     } = {
//       amount: body.amount,
//       paymentMethod: body.paymentMethod,
//       fromDate: new Date(body.fromDate),
//       toDate: new Date(body.toDate)
//     };

//     if (body.paymentReference !== undefined) {
//       payoutData.paymentReference = body.paymentReference;
//     }
//     if (body.payoutAccount !== undefined) {
//       payoutData.payoutAccount = body.payoutAccount;
//     }

//     const payout = await agentService.AgentService.createPayout(
//       body.agentId, 
//       user.id, 
//       payoutData
//     );

//     reply.code(200).send({
//       success: true,
//       message: 'Payout created',
//       data: payout
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Failed to create payout'
//     });
//   }
// };

// export const completePayout = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;
//     const { payoutId } = request.params as { payoutId: string };

//     if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
//       return reply.code(403).send({
//         success: false,
//         error: 'Unauthorized'
//       });
//     }

//     const payout = await agentService.AgentService.completePayout(
//       parseInt(payoutId),
//       user.id
//     );

//     reply.code(200).send({
//       success: true,
//       message: 'Payout completed successfully',
//       data: payout
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Failed to complete payout'
//     });
//   }
// };

// export const getPendingPayouts = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;

//     if (!['super_admin', 'digital_marketer_admin'].includes(user.role || '')) {
//       return reply.code(403).send({
//         success: false,
//         error: 'Unauthorized'
//       });
//     }

//     const payouts = await agentService.AgentService.getPendingPayouts();

//     reply.code(200).send({
//       success: true,
//       data: payouts,
//       count: payouts.length
//     });
//   } catch (error: any) {
//     reply.code(500).send({
//       success: false,
//       error: error.message || 'Failed to fetch pending payouts'
//     });
//   }
// };


















// // // src/controllers/agents/controller.ts
// // import { FastifyRequest, FastifyReply } from 'fastify';
// // import { AgentService } from '../../services/agentService';
// // import { users } from '@prisma/client';

// // // Register as agent
// // export const registerAgent = async (
// //   request: FastifyRequest<{
// //     Body: {
// //       commissionRate?: number;
// //       payoutMethod?: string;
// //       payoutNumber?: string;
// //       payoutName?: string;
// //       minPayoutAmount?: number;
// //     }
// //   }>,
// //   reply: FastifyReply
// // ) => {
// //   try {
// //     const user = request.user as users;
// //     const agent = await AgentService.registerAgent(user.id, request.body);

// //     reply.status(201).send({
// //       success: true,
// //       message: 'Successfully registered as agent',
// //       data: {
// //         agentCode: agent.agent_code,
// //         commissionRate: agent.commission_rate,
// //         status: agent.agent_status,
// //       }
// //     });
// //   } catch (error: any) {
// //     reply.status(400).send({
// //       success: false,
// //       error: error.message || 'Failed to register agent'
// //     });
// //   }
// // };

// // // Record sale with agent code (called when order is placed)
// // export const recordAgentSale = async (
// //   request: FastifyRequest<{
// //     Body: {
// //       orderId: number;
// //       agentCode: string;
// //     }
// //   }>,
// //   reply: FastifyReply
// // ) => {
// //   try {
// //     const { orderId, agentCode } = request.body;

// //     if (!orderId || !agentCode) {
// //       return reply.status(400).send({
// //         success: false,
// //         error: 'orderId and agentCode are required'
// //       });
// //     }

// //     const sale = await AgentService.recordAgentSale(orderId, agentCode);

// //     reply.status(201).send({
// //       success: true,
// //       message: 'Agent sale recorded',
// //       data: sale
// //     });
// //   } catch (error: any) {
// //     reply.status(400).send({
// //       success: false,
// //       error: error.message || 'Failed to record agent sale'
// //     });
// //   }
// // };

// // // Get agent dashboard stats
// // export const getAgentStats = async (
// //   request: FastifyRequest,
// //   reply: FastifyReply
// // ) => {
// //   try {
// //     const user = request.user as users;

// //     if (!user.agent_code) {
// //       return reply.status(403).send({
// //         success: false,
// //         error: 'User is not registered as an agent'
// //       });
// //     }

// //     const stats = await AgentService.getAgentStats(user.id);

// //     reply.send({
// //       success: true,
// //       data: stats
// //     });
// //   } catch (error: any) {
// //     reply.status(500).send({
// //       success: false,
// //       error: error.message || 'Failed to fetch agent stats'
// //     });
// //   }
// // };

// // // Get all agents (admin only)
// // export const getAllAgents = async (
// //   request: FastifyRequest,
// //   reply: FastifyReply
// // ) => {
// //   try {
// //     const user = request.user as users;

// //     if (user.role !== 'super_admin' && user.role !== 'digital_marketer_admin') {
// //       return reply.status(403).send({
// //         success: false,
// //         error: 'Only admins can view all agents'
// //       });
// //     }

// //     const agents = await AgentService.getAllAgents();

// //     reply.send({
// //       success: true,
// //       data: agents,
// //       count: agents.length
// //     });
// //   } catch (error: any) {
// //     reply.status(500).send({
// //       success: false,
// //       error: error.message || 'Failed to fetch agents'
// //     });
// //   }
// // };

// // // Approve commission (admin only)
// // export const approveCommission = async (
// //   request: FastifyRequest<{
// //     Params: { saleId: string }
// //   }>,
// //   reply: FastifyReply
// // ) => {
// //   try {
// //     const user = request.user as users;

// //     if (user.role !== 'super_admin') {
// //       return reply.status(403).send({
// //         success: false,
// //         error: 'Only super admin can approve commissions'
// //       });
// //     }

// //     const { saleId } = request.params;
// //     const sale = await AgentService.approveCommission(
// //       parseInt(saleId),
// //       user.id
// //     );

// //     reply.send({
// //       success: true,
// //       message: 'Commission approved',
// //       data: sale
// //     });
// //   } catch (error: any) {
// //     reply.status(400).send({
// //       success: false,
// //       error: error.message || 'Failed to approve commission'
// //     });
// //   }
// // };

// // // Create payout (admin only)
// // export const createPayout = async (
// //   request: FastifyRequest<{
// //     Body: {
// //       agentId: number;
// //       amount: number;
// //       paymentMethod: string;
// //       paymentReference?: string;
// //       payoutAccount?: string;
// //       fromDate: string;
// //       toDate: string;
// //     }
// //   }>,
// //   reply: FastifyReply
// // ) => {
// //   try {
// //     const user = request.user as users;

// //     if (user.role !== 'super_admin') {
// //       return reply.status(403).send({
// //         success: false,
// //         error: 'Only super admin can create payouts'
// //       });
// //     }

// //     const { agentId, amount, paymentMethod, paymentReference, payoutAccount, fromDate, toDate } = request.body;

// //     if (!agentId || !amount || !paymentMethod || !fromDate || !toDate) {
// //       return reply.status(400).send({
// //         success: false,
// //         error: 'agentId, amount, paymentMethod, fromDate, and toDate are required'
// //       });
// //     }


// //     const payoutData: {
// //   amount: number;
// //   paymentMethod: string;
// //   paymentReference?: string;
// //   payoutAccount?: string;
// //   fromDate: Date;
// //   toDate: Date;
// // } = {
// //   amount,
// //   paymentMethod,
// //   fromDate: new Date(fromDate),
// //   toDate: new Date(toDate),
// // };

// // if (paymentReference) payoutData.paymentReference = paymentReference;
// // if (payoutAccount) payoutData.payoutAccount = payoutAccount;

// // const payout = await AgentService.createPayout(agentId, user.id, payoutData);



   

// //     reply.status(201).send({
// //       success: true,
// //       message: 'Payout created',
// //       data: payout
// //     });
// //   } catch (error: any) {
// //     reply.status(400).send({
// //       success: false,
// //       error: error.message || 'Failed to create payout'
// //     });
// //   }
// // };

// // // Complete payout (admin only)
// // export const completePayout = async (
// //   request: FastifyRequest<{
// //     Params: { payoutId: string }
// //   }>,
// //   reply: FastifyReply
// // ) => {
// //   try {
// //     const user = request.user as users;

// //     if (user.role !== 'super_admin') {
// //       return reply.status(403).send({
// //         success: false,
// //         error: 'Only super admin can complete payouts'
// //       });
// //     }

// //     const { payoutId } = request.params;
// //     const payout = await AgentService.completePayout(
// //       parseInt(payoutId),
// //       user.id
// //     );

// //     reply.send({
// //       success: true,
// //       message: 'Payout completed successfully',
// //       data: payout
// //     });
// //   } catch (error: any) {
// //     reply.status(400).send({
// //       success: false,
// //       error: error.message || 'Failed to complete payout'
// //     });
// //   }
// // };

// // // Get pending payouts (admin only)
// // export const getPendingPayouts = async (
// //   request: FastifyRequest,
// //   reply: FastifyReply
// // ) => {
// //   try {
// //     const user = request.user as users;

// //     if (user.role !== 'super_admin') {
// //       return reply.status(403).send({
// //         success: false,
// //         error: 'Only super admin can view pending payouts'
// //       });
// //     }

// //     const payouts = await AgentService.getPendingPayouts();

// //     reply.send({
// //       success: true,
// //       data: payouts,
// //       count: payouts.length
// //     });
// //   } catch (error: any) {
// //     reply.status(500).send({
// //       success: false,
// //       error: error.message || 'Failed to fetch pending payouts'
// //     });
// //   }
// // };