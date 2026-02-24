// src/services/businessDocumentService.ts
import { PrismaClient } from '@prisma/client';
import cloudinary from '../config/cloudinary';

const prisma = new PrismaClient();

export class BusinessDocumentService {
  // Upload business document (for client_admin merchants)
  static async uploadDocument(
    merchantId: number,
    file: { buffer: Buffer; filename: string; mimetype: string },
    data: {
      documentType: string;
      productId?: number;
      expiresAt?: Date;
    }
  ) {
    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'business_documents',
          public_id: `doc_${merchantId}_${Date.now()}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    // Create document record with 7-day approval deadline
    const approvalDeadline = new Date();
    approvalDeadline.setDate(approvalDeadline.getDate() + 7);

    return await prisma.business_documents.create({
      data: {
        merchant_id: merchantId,
        product_id: data.productId || null,
        document_type: data.documentType,
        document_url: uploadResult.secure_url,
        document_name: file.filename,
        file_size: file.buffer.length,
        approval_status: 'pending',
        expires_at: data.expiresAt || null,
        uploaded_at: new Date(),
      },
      include: {
        merchant: {
          select: {
            id: true,
            merchant_name: true,
            email: true,
            phone: true,
          }
        }
      }
    });
  }

  // Get all pending documents (for super_admin)
  static async getPendingDocuments() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await prisma.business_documents.findMany({
      where: {
        approval_status: 'pending',
      },
      include: {
        merchant: {
          select: {
            id: true,
            merchant_name: true,
            email: true,
            phone: true,
            physical_address: true,
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      },
      orderBy: {
        uploaded_at: 'asc', // Oldest first
      }
    });
  }

  // Get documents by merchant
  static async getMerchantDocuments(merchantId: number) {
    return await prisma.business_documents.findMany({
      where: {
        merchant_id: merchantId,
      },
      include: {
        approved_by_user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        },
        product: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        uploaded_at: 'desc',
      }
    });
  }

  // Approve document (super_admin only)
  static async approveDocument(documentId: number, adminId: number) {
    const document = await prisma.business_documents.findUnique({
      where: { id: documentId },
      include: { merchant: true }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    if (document.approval_status !== 'pending') {
      throw new Error('Document already processed');
    }

    // Update document status
    const updatedDoc = await prisma.business_documents.update({
      where: { id: documentId },
      data: {
        approval_status: 'approved',
        approved_by: adminId,
        approved_at: new Date(),
      },
      include: {
        merchant: {
          select: {
            id: true,
            merchant_name: true,
            email: true,
          }
        }
      }
    });

    // If document is linked to a product, approve the product too
    if (document.product_id) {
      await prisma.products.update({
        where: { id: document.product_id },
        data: {
          approval_status: 'approved',
          approved_by: adminId,
          approved_at: new Date(),
          is_visible: true,
        }
      });
    }

    return updatedDoc;
  }

  // Reject document (super_admin only)
  static async rejectDocument(
    documentId: number,
    adminId: number,
    rejectionReason: string
  ) {
    const document = await prisma.business_documents.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    if (document.approval_status !== 'pending') {
      throw new Error('Document already processed');
    }

    return await prisma.business_documents.update({
      where: { id: documentId },
      data: {
        approval_status: 'rejected',
        approved_by: adminId,
        approved_at: new Date(),
        rejection_reason: rejectionReason,
      },
      include: {
        merchant: {
          select: {
            id: true,
            merchant_name: true,
            email: true,
          }
        }
      }
    });
  }

  // Get overdue documents (uploaded more than 7 days ago, still pending)
  static async getOverdueDocuments() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await prisma.business_documents.findMany({
      where: {
        approval_status: 'pending',
        uploaded_at: {
          lt: sevenDaysAgo,
        }
      },
      include: {
        merchant: {
          select: {
            id: true,
            merchant_name: true,
            email: true,
          }
        }
      },
      orderBy: {
        uploaded_at: 'asc',
      }
    });
  }

  // Delete document
  static async deleteDocument(documentId: number, merchantId?: number) {
    const document = await prisma.business_documents.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // If merchantId provided, verify ownership
    if (merchantId && document.merchant_id !== merchantId) {
      throw new Error('Not authorized to delete this document');
    }

    // Delete from Cloudinary
    const publicId = document.document_url.split('/').slice(-2).join('/').split('.')[0];
    try {
      await cloudinary.uploader.destroy(`business_documents/${publicId}`);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }

    return await prisma.business_documents.delete({
      where: { id: documentId }
    });
  }
}