// src/controllers/delivery/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  saveMerchantDeliverySettings,
  getMerchantDeliverySettings,
  calculateDeliveryFee,
} from '../../services/deliveryService';

export const DeliveryController = {

  // ─────────────────────────────────────────────
  // POST /api/delivery/settings
  // client_admin sets their delivery options
  // ─────────────────────────────────────────────
  async saveSettings(
    request: FastifyRequest<{
      Body: {
        merchantId: number;
        offersDelivery: boolean;       // true = yes delivery, false = pickup only
        harareFee?: number;            // e.g. 10
        outsideHarareFee?: number;     // e.g. 15
        freeDeliveryAbove?: number;    // e.g. 100 (free if order > $100)
        deliveryCities?: string[];     // Which cities they deliver to
        deliveryNote?: string;         // e.g. "We deliver Mon–Fri only"
      }
    }>,
    reply: FastifyReply
  ) {
    try {
      const result = await saveMerchantDeliverySettings(request.body);
      return reply.send({
        success: true,
        message: request.body.offersDelivery
          ? '✅ Delivery settings saved!'
          : '✅ Set to pickup only.',
        settings: result,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  },

  // ─────────────────────────────────────────────
  // GET /api/delivery/settings/:merchantId
  // Get merchant delivery settings (for dashboard)
  // ─────────────────────────────────────────────
  async getSettings(
    request: FastifyRequest<{ Params: { merchantId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const result = await getMerchantDeliverySettings(
        parseInt(request.params.merchantId)
      );
      return reply.send({ success: true, ...result });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  },

  // ─────────────────────────────────────────────
  // GET /api/delivery/fee
  // Customer checkout — get delivery fee for their city
  // ─────────────────────────────────────────────
  async getFee(
    request: FastifyRequest<{
      Querystring: {
        merchantId: string;
        customerCity: string;
        orderAmount: string;
      }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { merchantId, customerCity, orderAmount } = request.query as any;

      const result = await calculateDeliveryFee({
        merchantId:   parseInt(merchantId),
        customerCity,
        orderAmount:  parseFloat(orderAmount),
      });

      return reply.send({ success: true, ...result });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  },
};