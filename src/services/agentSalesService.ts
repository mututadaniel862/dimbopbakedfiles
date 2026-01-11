// import { PrismaClient, Prisma } from "@prisma/client";

// const prisma = new PrismaClient();

// export class AgentSalesService {
  
//   // Record a sale when order is placed via referral link
//   static async recordAgentSale(data: {
//     orderId: number;
//     agentCode: string;
//     productId: number;
//     saleAmount: number;
//     quantity: number;
//   }) {
    
//     // Find the agent by agent_code
//     const agent = await prisma.product_agents.findUnique({
//       where: { agent_code: data.agentCode },
//       include: { products: true }
//     });
    
//     if (!agent) {
//       throw new Error('Invalid agent code');
//     }
    
//     if (agent.status !== 'approved') {
//       throw new Error('Agent is not approved');
//     }
    
//     if (agent.product_id !== data.productId) {
//       throw new Error('Agent code does not match this product');
//     }
    
//     // Calculate commission
//     const commissionRate = Number(agent.commission_rate) || 5;
//     const commissionAmount = (data.saleAmount * commissionRate) / 100;
    
//     // Create agent sale record
//     const sale = await prisma.agent_sales.create({
//       data: {
//         agent_id: agent.id,
//         order_id: data.orderId,
//         product_id: data.productId,
//         sale_amount: new Prisma.Decimal(data.saleAmount),
//         commission_rate: new Prisma.Decimal(commissionRate),
//         commission_amount: new Prisma.Decimal(commissionAmount),
//         quantity: data.quantity,
//         status: 'pending', // pending, approved, paid
//         sale_date: new Date()
//       }
//     });
    
//     // Update agent totals
//     await prisma.product_agents.update({
//       where: { id: agent.id },
//       data: {
//         total_sales: { increment: 1 },
//         total_commission: { 
//           increment: commissionAmount 
//         }
//       }
//     });
    
//     return {
//       sale,
//       agent: {
//         id: agent.id,
//         agent_code: agent.agent_code,
//         full_name: agent.full_name
//       },
//       commission: {
//         rate: commissionRate,
//         amount: commissionAmount
//       }
//     };
//   }
  
//   // Get agent's sales history
//   static async getAgentSales(agentId: number, status?: string) {
//     const where: any = { agent_id: agentId };
//     if (status) {
//       where.status = status;
//     }
    
//     return await prisma.agent_sales.findMany({
//       where,
//       include: {
//         products: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             image_url: true
//           }
//         },
//         orders: {
//           select: {
//             id: true,
//             total_price: true,
//             status: true,
//             created_at: true
//           }
//         }
//       },
//       orderBy: { sale_date: 'desc' }
//     });
//   }
  
//   // Get pending commissions for an agent
//   static async getPendingCommissions(agentId: number) {
//     const sales = await prisma.agent_sales.findMany({
//       where: {
//         agent_id: agentId,
//         status: 'pending'
//       },
//       include: {
//         products: true
//       }
//     });
    
//     const totalPending = sales.reduce((sum, sale) => {
//       return sum + Number(sale.commission_amount);
//     }, 0);
    
//     return {
//       sales,
//       total_pending: totalPending,
//       count: sales.length
//     };
//   }
  
//   // Admin: Approve commission (ready for payout)
//   static async approveCommission(saleId: number, adminId: number) {
//     return await prisma.agent_sales.update({
//       where: { id: saleId },
//       data: {
//         status: 'approved',
//         approved_at: new Date(),
//         approved_by: adminId
//       }
//     });
//   }
  
//   // Admin: Mark commission as paid
//   static async markCommissionPaid(saleId: number, paymentReference?: string) {
//     return await prisma.agent_sales.update({
//       where: { id: saleId },
//       data: {
//         status: 'paid',
//         paid_at: new Date(),
//         payment_reference: paymentReference
//       }
//     });
//   }
  
//   // Get all pending commissions (Admin)
//   static async getAllPendingCommissions() {
//     return await prisma.agent_sales.findMany({
//       where: { status: 'pending' },
//       include: {
//         product_agents: {
//           include: {
//             users: {
//               select: {
//                 id: true,
//                 username: true,
//                 email: true,
//                 phone: true
//               }
//             }
//           }
//         },
//         products: {
//           select: {
//             id: true,
//             name: true,
//             price: true
//           }
//         }
//       },
//       orderBy: { sale_date: 'asc' }
//     });
//   }
  
//   // Get agent earnings summary
//   static async getAgentEarnings(agentId: number) {
//     const agent = await prisma.product_agents.findUnique({
//       where: { id: agentId },
//       include: {
//         agent_sales: true
//       }
//     });
    
//     if (!agent) {
//       throw new Error('Agent not found');
//     }
    
//     const pending = agent.agent_sales
//       .filter(s => s.status === 'pending')
//       .reduce((sum, s) => sum + Number(s.commission_amount), 0);
      
//     const approved = agent.agent_sales
//       .filter(s => s.status === 'approved')
//       .reduce((sum, s) => sum + Number(s.commission_amount), 0);
      
//     const paid = agent.agent_sales
//       .filter(s => s.status === 'paid')
//       .reduce((sum, s) => sum + Number(s.commission_amount), 0);
    
//     return {
//       total_sales: agent.total_sales || 0,
//       total_commission: Number(agent.total_commission) || 0,
//       pending_commission: pending,
//       approved_commission: approved,
//       paid_commission: paid,
//       commission_rate: Number(agent.commission_rate)
//     };
//   }
// }
