// src/controllers/businessDocuments/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { BusinessDocumentService } from '../../services/businessDocumentService';
import { users } from '@prisma/client';




// Upload document (client_admin merchants)
export const uploadDocument = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'client_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only merchants can upload business documents'
      });
    }

    const data = await request.file();
    if (!data) {
      return reply.status(400).send({
        success: false,
        error: 'No file provided'
      });
    }

    // Extract form fields
    const fields = data.fields as any;
    const documentType = fields.documentType?.value || 'business_license';
    const productId = fields.productId?.value ? parseInt(fields.productId.value) : undefined;
    const expiresAt = fields.expiresAt?.value ? new Date(fields.expiresAt.value) : undefined;

    // Get file buffer
    const buffer = await data.toBuffer();
    const fileInfo = {
      buffer,
      filename: data.filename,
      mimetype: data.mimetype,
    };

 const documentData: {
  documentType: string;
  productId?: number;
  expiresAt?: Date;
} = {
  documentType,
};

if (productId !== undefined) documentData.productId = productId;
if (expiresAt !== undefined) documentData.expiresAt = expiresAt;

const document = await BusinessDocumentService.uploadDocument(
  user.id,
  fileInfo,
  documentData
);


    reply.status(201).send({
      success: true,
      message: 'Document uploaded successfully. Awaiting admin approval (7 days)',
      data: document
    });
  } catch (error: any) {
    reply.status(500).send({
      success: false,
      error: error.message || 'Failed to upload document'
    });
  }
};

// Get merchant's documents
export const getMerchantDocuments = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;
    const documents = await BusinessDocumentService.getMerchantDocuments(user.id);

    reply.send({
      success: true,
      data: documents
    });
  } catch (error: any) {
    reply.status(500).send({
      success: false,
      error: error.message || 'Failed to fetch documents'
    });
  }
};

// Get all pending documents (super_admin only)
export const getPendingDocuments = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only super admin can view pending documents'
      });
    }

    const documents = await BusinessDocumentService.getPendingDocuments();

    reply.send({
      success: true,
      data: documents,
      count: documents.length
    });
  } catch (error: any) {
    reply.status(500).send({
      success: false,
      error: error.message || 'Failed to fetch pending documents'
    });
  }
};

// Get overdue documents (super_admin only)
export const getOverdueDocuments = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only super admin can view overdue documents'
      });
    }

    const documents = await BusinessDocumentService.getOverdueDocuments();

    reply.send({
      success: true,
      data: documents,
      count: documents.length,
      message: documents.length > 0 
        ? `⚠️ ${documents.length} document(s) overdue for approval!`
        : 'No overdue documents'
    });
  } catch (error: any) {
    reply.status(500).send({
      success: false,
      error: error.message || 'Failed to fetch overdue documents'
    });
  }
};

// Approve document (super_admin only)
export const approveDocument = async (
  request: FastifyRequest<{
    Params: { documentId: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only super admin can approve documents'
      });
    }

    const { documentId } = request.params;
    const document = await BusinessDocumentService.approveDocument(
      parseInt(documentId),
      user.id
    );

    reply.send({
      success: true,
      message: 'Document approved successfully',
      data: document
    });
  } catch (error: any) {
    reply.status(400).send({
      success: false,
      error: error.message || 'Failed to approve document'
    });
  }
};

// Reject document (super_admin only)
export const rejectDocument = async (
  request: FastifyRequest<{
    Params: { documentId: string };
    Body: { rejectionReason: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;

    if (user.role !== 'super_admin') {
      return reply.status(403).send({
        success: false,
        error: 'Only super admin can reject documents'
      });
    }

    const { documentId } = request.params;
    const { rejectionReason } = request.body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return reply.status(400).send({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const document = await BusinessDocumentService.rejectDocument(
      parseInt(documentId),
      user.id,
      rejectionReason
    );

    reply.send({
      success: true,
      message: 'Document rejected',
      data: document
    });
  } catch (error: any) {
    reply.status(400).send({
      success: false,
      error: error.message || 'Failed to reject document'
    });
  }
};

// Delete document
export const deleteDocument = async (
  request: FastifyRequest<{
    Params: { documentId: string }
  }>,
  reply: FastifyReply
) => {
  try {
    const user = request.user as users;
    const { documentId } = request.params;

    // Only merchant or super_admin can delete
    const merchantId = user.role === 'client_admin' ? user.id : undefined;

    await BusinessDocumentService.deleteDocument(
      parseInt(documentId),
      merchantId
    );

    reply.send({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error: any) {
    reply.status(400).send({
      success: false,
      error: error.message || 'Failed to delete document'
    });
  }
};