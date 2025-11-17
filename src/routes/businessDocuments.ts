// src/routes/businessDocuments.ts
import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth';
import * as businessDocController from '../controllers/businessDocuments/controller';

export default async (app: FastifyInstance) => {
  // ============================================
  // MERCHANT ROUTES (client_admin)
  // ============================================
  
  // Upload business document
  app.post('/upload', {
    preHandler: [authenticate],
    handler: businessDocController.uploadDocument
  });
  
  // Get my documents
  app.get('/my-documents', {
    preHandler: [authenticate],
    handler: businessDocController.getMerchantDocuments
  });
  
  // Delete my document
  app.delete('/:documentId', {
    preHandler: [authenticate],
    handler: businessDocController.deleteDocument
  });
  
  // ============================================
  // ADMIN ROUTES (super_admin)
  // ============================================
  
  // Get all pending documents (awaiting approval)
  app.get('/pending', {
    preHandler: [authenticate],
    handler: businessDocController.getPendingDocuments
  });
  
  // Get overdue documents (uploaded more than 7 days ago)
  app.get('/overdue', {
    preHandler: [authenticate],
    handler: businessDocController.getOverdueDocuments
  });
  
  // Approve document
  app.post('/:documentId/approve', {
    preHandler: [authenticate],
    handler: businessDocController.approveDocument
  });
  
  // Reject document
  app.post('/:documentId/reject', {
    preHandler: [authenticate],
    handler: businessDocController.rejectDocument,
    schema: {
      body: {
        type: 'object',
        properties: {
          rejectionReason: { type: 'string', minLength: 10 }
        },
        required: ['rejectionReason']
      }
    }
  });

  // ============================================
  // API DOCUMENTATION & EXAMPLES
  // ============================================
  /*
  
  📄 BUSINESS DOCUMENTS API
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🏪 MERCHANT ENDPOINTS (client_admin)
  
  Upload Business Document:
  POST /api/business-documents/upload
  Headers: { Authorization: "Bearer <token>" }
  Content-Type: multipart/form-data
  Form Data:
    - file: [PDF/Image file]
    - documentType: "business_license" | "tax_cert" | "registration"
    - productId: 123 (optional - if document is for specific product)
    - expiresAt: "2025-12-31" (optional - document expiration date)
  
  Response: {
    "success": true,
    "message": "Document uploaded successfully. Awaiting admin approval (7 days)",
    "data": {
      "id": 1,
      "document_type": "business_license",
      "document_url": "https://...",
      "approval_status": "pending",
      "uploaded_at": "2025-11-17T...",
      "merchant": { ... }
    }
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Get My Documents:
  GET /api/business-documents/my-documents
  Headers: { Authorization: "Bearer <token>" }
  
  Response: {
    "success": true,
    "data": [
      {
        "id": 1,
        "document_type": "business_license",
        "approval_status": "pending",
        "uploaded_at": "2025-11-17T...",
        "approved_at": null,
        "rejection_reason": null
      }
    ]
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Delete Document:
  DELETE /api/business-documents/:documentId
  Headers: { Authorization: "Bearer <token>" }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  👨‍💼 ADMIN ENDPOINTS (super_admin)
  
  Get Pending Documents:
  GET /api/business-documents/pending
  Headers: { Authorization: "Bearer <super_admin_token>" }
  
  Response: {
    "success": true,
    "data": [
      {
        "id": 1,
        "document_type": "business_license",
        "uploaded_at": "2025-11-10T...",
        "merchant": {
          "id": 5,
          "merchant_name": "Dan's Dental Clinic",
          "email": "dan@dental.com",
          "phone": "+263771234567"
        }
      }
    ],
    "count": 3
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Get Overdue Documents (uploaded more than 7 days ago):
  GET /api/business-documents/overdue
  Headers: { Authorization: "Bearer <super_admin_token>" }
  
  Response: {
    "success": true,
    "data": [ ... ],
    "count": 2,
    "message": "⚠️ 2 document(s) overdue for approval!"
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Approve Document:
  POST /api/business-documents/:documentId/approve
  Headers: { Authorization: "Bearer <super_admin_token>" }
  
  Response: {
    "success": true,
    "message": "Document approved successfully",
    "data": { ... }
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Reject Document:
  POST /api/business-documents/:documentId/reject
  Headers: { Authorization: "Bearer <super_admin_token>" }
  Body: {
    "rejectionReason": "Document is expired. Please upload a valid business license."
  }
  
  Response: {
    "success": true,
    "message": "Document rejected",
    "data": { ... }
  }
  
  */
};