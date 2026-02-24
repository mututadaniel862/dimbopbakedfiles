// src/routes/agents.ts
import { FastifyInstance } from 'fastify';
import { authenticate, authorize } from '../middlewares/auth';
import * as agentController from '../controllers/agents/controller';

export default async (app: FastifyInstance) => {
  // ============================================
  // AGENT REGISTRATION & STATS
  // ============================================

  // NEW AGENT REGISTRATION (No auth required)
// ============================================
// NEW AGENT DIRECT REGISTRATION (NO AUTH)
// ============================================
app.post('/register-new', {
  preHandler: [authorize(['client'])],
  handler: agentController.registerNewAgent,
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        password: { type: 'string', minLength: 6 },
        confirmPassword: { type: 'string' },
        commissionRate: { type: 'number', minimum: 0.1, maximum: 50 },
        payoutMethod: { type: 'string', enum: ['ecocash', 'bank', 'paynow', 'onemoney', 'telecash'] },
        payoutNumber: { type: 'string' },
        payoutName: { type: 'string' },
        minPayoutAmount: { type: 'number', minimum: 1 }
      },
      required: ['name', 'email', 'phone', 'password', 'confirmPassword']
    }
  }
});
     
  // Register as agent (PUBLIC)
  app.post('/register', {
    preHandler: [authorize(['client'])],
    handler: agentController.registerAgent,
    schema: {
      body: {
        type: 'object',
        properties: {
          commissionRate: { type: 'number', minimum: 0, maximum: 100 },
          payoutMethod: { type: 'string', enum: ['ecocash', 'bank', 'paynow'] },
          payoutNumber: { type: 'string' },
          payoutName: { type: 'string' },
          minPayoutAmount: { type: 'number', minimum: 1 }
        }
      }
    }
  });
  
  // Get my agent stats (PUBLIC)
  app.get('/my-stats', {
    preHandler: [authenticate],
    handler: agentController.getAgentStats
  });
  
  // Record sale with agent code (public - called when customer places order)
  app.post('/record-sale', {
    handler: agentController.recordAgentSale,
    schema: {
      body: {
        type: 'object',
        properties: {
          orderId: { type: 'number' },
          agentCode: { type: 'string' }
        },
        required: ['orderId', 'agentCode']
      }
    }
  });
  
  // ============================================
  // ADMIN ROUTES
  // ============================================
  
  // Get all agents
  app.get('/all', {
    preHandler: [authenticate],
    handler: agentController.getAllAgents
  });
  
  // Approve commission
  app.post('/sales/:saleId/approve', {
    preHandler: [authenticate],
    handler: agentController.approveCommission
  });
  
  // Create payout
  app.post('/payouts/create', {
    preHandler: [authenticate],
    handler: agentController.createPayout,
    schema: {
      body: {
        type: 'object',
        properties: {
          agentId: { type: 'number' },
          amount: { type: 'number', minimum: 0 },
          paymentMethod: { type: 'string' },
          paymentReference: { type: 'string' },
          payoutAccount: { type: 'string' },
          fromDate: { type: 'string', format: 'date' },
          toDate: { type: 'string', format: 'date' }
        },
        required: ['agentId', 'amount', 'paymentMethod', 'fromDate', 'toDate']
      }
    }
  });
  
  // Complete payout
  app.post('/payouts/:payoutId/complete', {
    preHandler: [authenticate],
    handler: agentController.completePayout
  });
  
  // Get pending payouts
  app.get('/payouts/pending', {
    preHandler: [authenticate],
    handler: agentController.getPendingPayouts
  });

  // ============================================
  // API DOCUMENTATION & EXAMPLES
  // ============================================
  /*
  
  💰 AGENT COMMISSION API
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  📝 AGENT REGISTRATION
  
  Register as Agent:
  POST /api/agents/register
  Headers: { Authorization: "Bearer <token>" }
  Body: {
    "commissionRate": 5.0,
    "payoutMethod": "ecocash",
    "payoutNumber": "+263771234567",
    "payoutName": "John Doe",
    "minPayoutAmount": 10.0
  }
  
  Response: {
    "success": true,
    "message": "Successfully registered as agent",
    "data": {
      "agentCode": "JOHN2025",
      "commissionRate": 5.0,
      "status": "active"
    }
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  📊 AGENT DASHBOARD
  
  Get My Stats:
  GET /api/agents/my-stats
  Headers: { Authorization: "Bearer <token>" }
  
  Response: {
    "success": true,
    "data": {
      "agent": {
        "agent_code": "JOHN2025",
        "commission_rate": 5.0,
        "total_sales_value": 5000.00,
        "total_commission_earned": 250.00,
        "pending_commission": 150.00,
        "paid_commission": 100.00,
        "total_orders_referred": 15,
        "agent_status": "active"
      },
      "recentSales": [
        {
          "id": 1,
          "sale_amount": 500.00,
          "commission_amount": 25.00,
          "commission_status": "pending",
          "sale_date": "2025-11-15T...",
          "order": {
            "id": 123,
            "total_price": 500.00,
            "status": "completed"
          }
        }
      ],
      "thisMonth": {
        "_sum": {
          "sale_amount": 2000.00,
          "commission_amount": 100.00
        },
        "_count": 8
      }
    }
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🛒 RECORD SALE WITH AGENT CODE
  
  When customer places order using agent code:
  POST /api/agents/record-sale
  Body: {
    "orderId": 123,
    "agentCode": "JOHN2025"
  }
  
  Response: {
    "success": true,
    "message": "Agent sale recorded",
    "data": {
      "id": 1,
      "agent_id": 5,
      "order_id": 123,
      "sale_amount": 500.00,
      "commission_rate": 5.0,
      "commission_amount": 25.00,
      "commission_status": "pending",
      "sale_date": "2025-11-17T..."
    }
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  👨‍💼 ADMIN ENDPOINTS
  
  Get All Agents:
  GET /api/agents/all
  Headers: { Authorization: "Bearer <admin_token>" }
  
  Response: {
    "success": true,
    "data": [
      {
        "id": 5,
        "name": "John Doe",
        "email": "john@example.com",
        "agent_code": "JOHN2025",
        "commission_rate": 5.0,
        "total_sales_value": 5000.00,
        "total_commission_earned": 250.00,
        "pending_commission": 150.00,
        "paid_commission": 100.00,
        "total_orders_referred": 15,
        "agent_status": "active"
      }
    ],
    "count": 10
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Approve Commission:
  POST /api/agents/sales/:saleId/approve
  Headers: { Authorization: "Bearer <admin_token>" }
  
  Response: {
    "success": true,
    "message": "Commission approved",
    "data": { ... }
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Create Payout:
  POST /api/agents/payouts/create
  Headers: { Authorization: "Bearer <admin_token>" }
  Body: {
    "agentId": 5,
    "amount": 100.00,
    "paymentMethod": "ecocash",
    "paymentReference": "TXN123456",
    "payoutAccount": "+263771234567",
    "fromDate": "2025-11-01",
    "toDate": "2025-11-17"
  }
  
  Response: {
    "success": true,
    "message": "Payout created",
    "data": {
      "id": 1,
      "agent_id": 5,
      "amount": 100.00,
      "payment_method": "ecocash",
      "sales_count": 8,
      "status": "pending",
      "created_at": "2025-11-17T..."
    }
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Complete Payout:
  POST /api/agents/payouts/:payoutId/complete
  Headers: { Authorization: "Bearer <admin_token>" }
  
  Response: {
    "success": true,
    "message": "Payout completed successfully",
    "data": { ... }
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Get Pending Payouts:
  GET /api/agents/payouts/pending
  Headers: { Authorization: "Bearer <admin_token>" }
  
  Response: {
    "success": true,
    "data": [
      {
        "id": 1,
        "amount": 100.00,
        "payment_method": "ecocash",
        "status": "pending",
        "agent": {
          "name": "John Doe",
          "agent_code": "JOHN2025"
        }
      }
    ],
    "count": 5
  }
  
  */
};