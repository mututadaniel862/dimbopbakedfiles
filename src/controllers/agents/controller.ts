// src/controllers/agents/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { AgentService } from '../../services/agentService';
import { users } from '@prisma/client';

// Register as agent
export const registerAgent = async (
  request: FastifyRequest<{
    Body: {
      commissionRate?: number;
      payoutMethod?: string;
      payoutNumber?: string;
      payoutName?: string;
      minPayoutAmount?: number;
    }
  }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;
    const agent = await AgentService.registerAgent(user.id, request.body);

    reply.status(201).send({
      success: true,
      message: 'Successfully registered as agent',
      data: {
        agentCode: agent.agent_code,
        commissionRate: agent.commission_rate,
        status: agent.agent_status,
      }
    });
  } catch (error: any) {
    reply.status(400).send({
      success: false,
      error: error.message || 'Failed to register agent'
    });
  }
};

// Record sale with agent code (called when order is placed)
export const recordAgentSale = async (
  request: FastifyRequest<{
    Body: {
      orderId: number;
      agentCode: string;
    }
  }>,
  reply: FastifyReply
) => {
  try {
    const { orderId, agentCode } = request.body;

    if (!orderId || !agentCode) {
      return reply.status(400).send({
        success: false,
        error: 'orderId and agentCode are required'
      });
    }

    const sale = await AgentService.recordAgentSale(orderId, agentCode);

    reply.status(201).send({
      success: true,
      message: 'Agent sale recorded',
      data: sale
    });
  } catch (error: any) {
    reply.status(400).send({
      success: false,
      error: error.message || 'Failed to record agent sale'
    });
  }
};

// Get agent dashboard stats
export const getAgentStats = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (!user.agent_code) {
      return reply.status(403).send({
        success: false,
        error: 'User is not registered as an agent'
      });
    }

    const stats = await AgentService.getAgentStats(user.id);

    reply.send({
      success: true,
      data: stats
    });
  } catch (error: any) {
    reply.status(500).send({
      success: false,
      error: error.message || 'Failed to fetch agent stats'
    });
  }
};

// Get all agents (admin only)
export const getAllAgents = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'super_admin' && user.role !== 'digital_marketer_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only admins can view all agents'
      });
    }

    const agents = await AgentService.getAllAgents();

    reply.send({
      success: true,
      data: agents,
      count: agents.length
    });
  } catch (error: any) {
    reply.status(500).send({
      success: false,
      error: error.message || 'Failed to fetch agents'
    });
  }
};

// Approve commission (admin only)
export const approveCommission = async (
  request: FastifyRequest<{
    Params: { saleId: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only super admin can approve commissions'
      });
    }

    const { saleId } = request.params;
    const sale = await AgentService.approveCommission(
      parseInt(saleId),
      user.id
    );

    reply.send({
      success: true,
      message: 'Commission approved',
      data: sale
    });
  } catch (error: any) {
    reply.status(400).send({
      success: false,
      error: error.message || 'Failed to approve commission'
    });
  }
};

// Create payout (admin only)
export const createPayout = async (
  request: FastifyRequest<{
    Body: {
      agentId: number;
      amount: number;
      paymentMethod: string;
      paymentReference?: string;
      payoutAccount?: string;
      fromDate: string;
      toDate: string;
    }
  }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only super admin can create payouts'
      });
    }

    const { agentId, amount, paymentMethod, paymentReference, payoutAccount, fromDate, toDate } = request.body;

    if (!agentId || !amount || !paymentMethod || !fromDate || !toDate) {
      return reply.status(400).send({
        success: false,
        error: 'agentId, amount, paymentMethod, fromDate, and toDate are required'
      });
    }


    const payoutData: {
  amount: number;
  paymentMethod: string;
  paymentReference?: string;
  payoutAccount?: string;
  fromDate: Date;
  toDate: Date;
} = {
  amount,
  paymentMethod,
  fromDate: new Date(fromDate),
  toDate: new Date(toDate),
};

if (paymentReference) payoutData.paymentReference = paymentReference;
if (payoutAccount) payoutData.payoutAccount = payoutAccount;

const payout = await AgentService.createPayout(agentId, user.id, payoutData);



   

    reply.status(201).send({
      success: true,
      message: 'Payout created',
      data: payout
    });
  } catch (error: any) {
    reply.status(400).send({
      success: false,
      error: error.message || 'Failed to create payout'
    });
  }
};

// Complete payout (admin only)
export const completePayout = async (
  request: FastifyRequest<{
    Params: { payoutId: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only super admin can complete payouts'
      });
    }

    const { payoutId } = request.params;
    const payout = await AgentService.completePayout(
      parseInt(payoutId),
      user.id
    );

    reply.send({
      success: true,
      message: 'Payout completed successfully',
      data: payout
    });
  } catch (error: any) {
    reply.status(400).send({
      success: false,
      error: error.message || 'Failed to complete payout'
    });
  }
};

// Get pending payouts (admin only)
export const getPendingPayouts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only super admin can view pending payouts'
      });
    }

    const payouts = await AgentService.getPendingPayouts();

    reply.send({
      success: true,
      data: payouts,
      count: payouts.length
    });
  } catch (error: any) {
    reply.status(500).send({
      success: false,
      error: error.message || 'Failed to fetch pending payouts'
    });
  }
};