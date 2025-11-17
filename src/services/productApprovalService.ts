// src/services/productApprovalService.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProductApprovalService {
  // Get all pending products (for super_admin)
  static async getPendingProducts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await prisma.products.findMany({
      where: {
        approval_status: 'pending',
      },
      include: {
        uploaded_by_user: {
          select: {
            id: true,
            merchant_name: true,
            email: true,
            phone: true,
            physical_address: true,
          }
        },
        categories: true,
        business_documents: {
          where: {
            approval_status: { in: ['pending', 'approved'] }
          }
        }
      },
      orderBy: {
        created_at: 'asc', // Oldest first
      }
    });
  }

  // Get products uploaded by a merchant
  static async getMerchantProducts(merchantId: number) {
    return await prisma.products.findMany({
      where: {
        uploaded_by: merchantId,
      },
      include: {
        approved_by_user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        },
        categories: true,
        business_documents: true,
      },
      orderBy: {
        created_at: 'desc',
      }
    });
  }

  // Approve product (super_admin only)
  static async approveProduct(productId: number, adminId: number) {
    const product = await prisma.products.findUnique({
      where: { id: productId },
      include: { uploaded_by_user: true }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.approval_status !== 'pending') {
      throw new Error('Product already processed');
    }

    return await prisma.products.update({
      where: { id: productId },
      data: {
        approval_status: 'approved',
        approved_by: adminId,
        approved_at: new Date(),
        is_visible: true,
      },
      include: {
        uploaded_by_user: {
          select: {
            id: true,
            merchant_name: true,
            email: true,
          }
        }
      }
    });
  }

  // Reject product (super_admin only)
  static async rejectProduct(
    productId: number,
    adminId: number,
    rejectionReason: string
  ) {
    const product = await prisma.products.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.approval_status !== 'pending') {
      throw new Error('Product already processed');
    }

    return await prisma.products.update({
      where: { id: productId },
      data: {
        approval_status: 'rejected',
        approved_by: adminId,
        approved_at: new Date(),
        rejection_reason: rejectionReason,
        is_visible: false,
      },
      include: {
        uploaded_by_user: {
          select: {
            id: true,
            merchant_name: true,
            email: true,
          }
        }
      }
    });
  }

  // Get overdue products (uploaded more than 7 days ago, still pending)
  static async getOverdueProducts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await prisma.products.findMany({
      where: {
        approval_status: 'pending',
        created_at: {
          lt: sevenDaysAgo,
        }
      },
      include: {
        uploaded_by_user: {
          select: {
            id: true,
            merchant_name: true,
            email: true,
          }
        }
      },
      orderBy: {
        created_at: 'asc',
      }
    });
  }

  // Get only approved products (for public viewing)
  static async getApprovedProducts() {
    return await prisma.products.findMany({
      where: {
        approval_status: 'approved',
        is_visible: true,
      },
      include: {
        categories: true,
        reviews: true,
      },
      orderBy: {
        created_at: 'desc',
      }
    });
  }

  // Update createProduct to set uploaded_by and approval_status
  static async createProductWithApproval(
    merchantId: number,
    productData: any,
    file?: { buffer: Buffer; filename: string; mimetype: string }
  ) {
    // Set 7-day approval deadline
    const approvalDeadline = new Date();
    approvalDeadline.setDate(approvalDeadline.getDate() + 7);

    // The product creation logic from your existing createProduct function
    // but with these additional fields:
    const data = {
      ...productData,
      uploaded_by: merchantId,
      approval_status: 'pending',
      is_visible: false,
      approval_deadline: approvalDeadline,
    };

    // Rest of your existing createProduct logic...
    // (You can integrate this into your existing createProduct function)
  }
}

// Add these new handlers to your existing product controller:
export class ProductApprovalController {
  static async getPendingProducts(request: any, reply: any) {
    try {
      const user = request.user;

      if (user.role !== 'super_admin') {
        return reply.status(403).send({
          success: false,
          error: 'Only super admin can view pending products'
        });
      }

      const products = await ProductApprovalService.getPendingProducts();

      reply.send({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch pending products'
      });
    }
  }

  static async getOverdueProducts(request: any, reply: any) {
    try {
      const user = request.user;

      if (user.role !== 'super_admin') {
        return reply.status(403).send({
          success: false,
          error: 'Only super admin can view overdue products'
        });
      }

      const products = await ProductApprovalService.getOverdueProducts();

      reply.send({
        success: true,
        data: products,
        count: products.length,
        message: products.length > 0 
          ? `⚠️ ${products.length} product(s) overdue for approval!`
          : 'No overdue products'
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch overdue products'
      });
    }
  }

  static async approveProduct(request: any, reply: any) {
    try {
      const user = request.user;

      if (user.role !== 'super_admin') {
        return reply.status(403).send({
          success: false,
          error: 'Only super admin can approve products'
        });
      }

      const { id } = request.params;
      const product = await ProductApprovalService.approveProduct(
        parseInt(id),
        user.id
      );

      reply.send({
        success: true,
        message: 'Product approved successfully',
        data: product
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message || 'Failed to approve product'
      });
    }
  }

  static async rejectProduct(request: any, reply: any) {
    try {
      const user = request.user;

      if (user.role !== 'super_admin') {
        return reply.status(403).send({
          success: false,
          error: 'Only super admin can reject products'
        });
      }

      const { id } = request.params;
      const { rejectionReason } = request.body;

      if (!rejectionReason || rejectionReason.trim().length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'Rejection reason is required'
        });
      }

      const product = await ProductApprovalService.rejectProduct(
        parseInt(id),
        user.id,
        rejectionReason
      );

      reply.send({
        success: true,
        message: 'Product rejected',
        data: product
      });
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message || 'Failed to reject product'
      });
    }
  }

  static async getMerchantProducts(request: any, reply: any) {
    try {
      const user = request.user;

      if (user.role !== 'client_admin') {
        return reply.status(403).send({
          success: false,
          error: 'Only merchants can view their products'
        });
      }

      const products = await ProductApprovalService.getMerchantProducts(user.id);

      reply.send({
        success: true,
        data: products
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch merchant products'
      });
    }
  }
}