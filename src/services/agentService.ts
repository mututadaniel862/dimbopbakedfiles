// src/services/agentService.ts
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class AgentService {





static async registerNewAgent(agentData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  commissionRate?: number;
  payoutMethod?: string;
  payoutNumber?: string;
  payoutName?: string;
  minPayoutAmount?: number;
}) {
  // Check if email already exists
  const existingUser = await prisma.users.findUnique({
    where: { email: agentData.email }
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Generate unique agent code
  const baseCode = agentData.name.toUpperCase().slice(0, 6);
  const year = new Date().getFullYear();
  let agentCode = `${baseCode}${year}`;
  let counter = 1;

  while (await prisma.users.findUnique({ where: { agent_code: agentCode } })) {
    agentCode = `${baseCode}${year}${counter}`;
    counter++;
  }

  // ✅ HASH PASSWORD HERE
  const hashedPassword = await bcrypt.hash(agentData.password, 10);

  // Create new agent user
  return await prisma.users.create({
    data: {
      name: agentData.name,
      username: agentData.name.toLowerCase().replace(/\s+/g, '_'),
      email: agentData.email,
      phone: agentData.phone,
      
      // ✅ Correct field name
      password_hash: hashedPassword,

      role: 'agent',
      auth_provider: 'email',
      is_active: true,
      email_verified: false,

      // Agent-specific fields
      agent_code: agentCode,
      commission_rate: agentData.commissionRate ?? 5.0,
      agent_payout_method: agentData.payoutMethod ?? null,
      agent_payout_number: agentData.payoutNumber ?? null,
      agent_payout_name: agentData.payoutName ?? agentData.name,
      min_payout_amount: agentData.minPayoutAmount ?? 10.0,
      agent_status: 'active',
      total_sales_value: 0,
      total_commission_earned: 0,
      pending_commission: 0,
      paid_commission: 0,
      total_orders_referred: 0,
    }
  });
}







  
  // Generate unique agent code
  static async generateAgentCode(username: string): Promise<string> {
    const baseCode = username.toUpperCase().slice(0, 6);
    const year = new Date().getFullYear();
    let code = `${baseCode}${year}`;
    let counter = 1;

    // Check if code exists
    while (await prisma.users.findUnique({ where: { agent_code: code } })) {
      code = `${baseCode}${year}${counter}`;
      counter++;
    }

    return code;
  }

  // Register new agent
  static async registerAgent(userId: number, agentData: {
    commissionRate?: number;
    payoutMethod?: string;
    payoutNumber?: string;
    payoutName?: string;
    minPayoutAmount?: number;
  }) {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    const agentCode = await this.generateAgentCode(user.username || user.name || `USER${userId}`);

    return await prisma.users.update({
      where: { id: userId },
      data: {
        agent_code: agentCode,
        commission_rate: agentData.commissionRate || 5.0,
        agent_payout_method: agentData.payoutMethod || null,
        agent_payout_number: agentData.payoutNumber || null,
        agent_payout_name: agentData.payoutName || null,
        min_payout_amount: agentData.minPayoutAmount || 10.0,
        agent_status: 'active',
        total_sales_value: 0,
        total_commission_earned: 0,
        pending_commission: 0,
        paid_commission: 0,
        total_orders_referred: 0,
      }
    });
  }

  // Record sale when customer uses agent code
  static async recordAgentSale(orderId: number, agentCode: string) {
    // Find agent
    const agent = await prisma.users.findUnique({
      where: { agent_code: agentCode }
    });

    if (!agent || agent.agent_status !== 'active') {
      throw new Error('Invalid or inactive agent code');
    }

    // Get order details
    const order = await prisma.orders.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const saleAmount = new Prisma.Decimal(order.total_price);
    const commissionRate = agent.commission_rate || new Prisma.Decimal(5.0);
    const commissionAmount = saleAmount.mul(commissionRate).div(100);

    // Create agent sale record
    const agentSale = await prisma.agent_sales.create({
      data: {
        agent_id: agent.id,
        order_id: orderId,
        sale_amount: saleAmount,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        commission_status: 'pending',
        sale_date: new Date(),
      }
    });

    // Update agent totals
    await prisma.users.update({
      where: { id: agent.id },
      data: {
        total_sales_value: {
          increment: saleAmount,
        },
        total_commission_earned: {
          increment: commissionAmount,
        },
        pending_commission: {
          increment: commissionAmount,
        },
        total_orders_referred: {
          increment: 1,
        }
      }
    });

    // Update order with agent info
    await prisma.orders.update({
      where: { id: orderId },
      data: {
        referred_by_agent_id: agent.id,
        agent_code_used: agentCode,
      }
    });

    return agentSale;
  }

  // Get agent dashboard stats
  static async getAgentStats(agentId: number) {
    const agent = await prisma.users.findUnique({
      where: { id: agentId },
      select: {
        agent_code: true,
        commission_rate: true,
        total_sales_value: true,
        total_commission_earned: true,
        pending_commission: true,
        paid_commission: true,
        total_orders_referred: true,
        agent_status: true,
      }
    });

    const sales = await prisma.agent_sales.findMany({
      where: { agent_id: agentId },
      include: {
        order: {
          select: {
            id: true,
            total_price: true,
            status: true,
            created_at: true,
          }
        }
      },
      orderBy: {
        sale_date: 'desc',
      },
      take: 10,
    });

    const monthlyStats = await prisma.agent_sales.groupBy({
      by: ['agent_id'],
      where: {
        agent_id: agentId,
        sale_date: {
          gte: new Date(new Date().setDate(1)), // First day of current month
        }
      },
      _sum: {
        sale_amount: true,
        commission_amount: true,
      },
      _count: true,
    });

    return {
      agent,
      recentSales: sales,
      thisMonth: monthlyStats[0] || {
        _sum: { sale_amount: 0, commission_amount: 0 },
        _count: 0,
      }
    };
  }

  // Approve commission (admin action)
  static async approveCommission(saleId: number, adminId: number) {
    const sale = await prisma.agent_sales.findUnique({
      where: { id: saleId },
      include: { agent: true }
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    if (sale.commission_status !== 'pending') {
      throw new Error('Commission already processed');
    }

    return await prisma.agent_sales.update({
      where: { id: saleId },
      data: {
        commission_status: 'approved',
      }
    });
  }

  // Create payout for agent
  static async createPayout(agentId: number, adminId: number, data: {
    amount: number;
    paymentMethod: string;
    paymentReference?: string;
    payoutAccount?: string;
    fromDate: Date;
    toDate: Date;
  }) {
    const agent = await prisma.users.findUnique({
      where: { id: agentId }
    });

    if (!agent) {
      throw new Error('Agent not found');
    }

    // Get approved sales in date range
    const sales = await prisma.agent_sales.findMany({
      where: {
        agent_id: agentId,
        commission_status: 'approved',
        sale_date: {
          gte: data.fromDate,
          lte: data.toDate,
        }
      }
    });

    const salesCount = sales.length;
    const totalCommission = sales.reduce((sum, sale) => 
      sum + Number(sale.commission_amount), 0
    );

    if (data.amount > totalCommission) {
      throw new Error('Payout amount exceeds approved commission');
    }

    // Create payout record
    const payout = await prisma.agent_payouts.create({
      data: {
        agent_id: agentId,
        amount: new Prisma.Decimal(data.amount),
        payment_method: data.paymentMethod,
        payment_reference: data.paymentReference || null,
        payout_account: data.payoutAccount || agent.agent_payout_number || null,
        sales_count: salesCount,
        from_date: data.fromDate,
        to_date: data.toDate,
        status: 'pending',
        created_at: new Date(),
      }
    });

    return payout;
  }

  // Mark payout as completed
  static async completePayout(payoutId: number, adminId: number) {
    const payout = await prisma.agent_payouts.findUnique({
      where: { id: payoutId },
      include: { agent: true }
    });

    if (!payout) {
      throw new Error('Payout not found');
    }

    if (payout.status !== 'pending') {
      throw new Error('Payout already processed');
    }

    // Update payout status
    const updatedPayout = await prisma.agent_payouts.update({
      where: { id: payoutId },
      data: {
        status: 'completed',
        paid_at: new Date(),
      }
    });

    // Update agent commissions
    await prisma.users.update({
      where: { id: payout.agent_id },
      data: {
        pending_commission: {
          decrement: payout.amount,
        },
        paid_commission: {
          increment: payout.amount,
        }
      }
    });

    // Mark related sales as paid
    await prisma.agent_sales.updateMany({
      where: {
        agent_id: payout.agent_id,
        sale_date: {
          gte: payout.from_date,
          lte: payout.to_date,
        },
        commission_status: 'approved',
      },
      data: {
        commission_status: 'paid',
        commission_paid_at: new Date(),
      }
    });

    return updatedPayout;
  }

  // Get all agents (for admin)
  static async getAllAgents() {
    return await prisma.users.findMany({
      where: {
        agent_code: {
          not: null,
        }
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        agent_code: true,
        commission_rate: true,
        total_sales_value: true,
        total_commission_earned: true,
        pending_commission: true,
        paid_commission: true,
        total_orders_referred: true,
        agent_status: true,
        created_at: true,
      },
      orderBy: {
        total_sales_value: 'desc',
      }
    });
  }

  // Get pending payouts (for admin)
  static async getPendingPayouts() {
    return await prisma.agent_payouts.findMany({
      where: {
        status: 'pending',
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            agent_code: true,
          }
        }
      },
      orderBy: {
        created_at: 'asc',
      }
    });
  }
}