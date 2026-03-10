// src/services/deliveryService.ts
import { PrismaClient } from '@prisma/client';

const ZIMBABWE_CITIES = [
  'Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Kwekwe',
  'Kadoma', 'Masvingo', 'Chinhoyi', 'Bindura', 'Marondera',
  'Chegutu', 'Zvishavane', 'Redcliff', 'Hwange', 'Victoria Falls',
  'Beitbridge', 'Chipinge', 'Rusape', 'Chiredzi', 'Karoi',
];

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// MERCHANT: Save/Update their delivery settings
// ─────────────────────────────────────────────────────────────
export const saveMerchantDeliverySettings = async (data: {
  merchantId: number;
  offersDelivery: boolean;
  harareFee?: number;
  outsideHarareFee?: number;
  freeDeliveryAbove?: number;
  deliveryCities?: string[];
  deliveryNote?: string;
}) => {
  const existing = await (prisma as any).merchant_delivery_settings.findUnique({
    where: { merchant_id: data.merchantId }
  });

  const payload = {
    offers_delivery:      data.offersDelivery,
    harare_fee:           data.harareFee           ?? null,
    outside_harare_fee:   data.outsideHarareFee     ?? null,
    free_delivery_above:  data.freeDeliveryAbove    ?? null,
    delivery_cities:      data.deliveryCities?.join(',') ?? null,
    delivery_note:        data.deliveryNote          ?? null,
    updated_at:           new Date(),
  };

  if (existing) {
    return await (prisma as any).merchant_delivery_settings.update({
      where: { merchant_id: data.merchantId },
      data: payload,
    });
  } else {
    return await (prisma as any).merchant_delivery_settings.create({
      data: { merchant_id: data.merchantId, ...payload }
    });
  }
};

// ─────────────────────────────────────────────────────────────
// GET: Merchant delivery settings (used by customer checkout)
// ─────────────────────────────────────────────────────────────
export const getMerchantDeliverySettings = async (merchantId: number) => {
  const settings = await (prisma as any).merchant_delivery_settings.findUnique({
    where: { merchant_id: merchantId }
  });

  if (!settings || !settings.offers_delivery) {
    return {
      offersDelivery: false,
      message: 'This merchant does not offer delivery. Please arrange pickup.',
      deliveryCities: [],
    };
  }

  return {
    offersDelivery:     true,
    harareFee:          settings.harare_fee          ? Number(settings.harare_fee) : 10,
    outsideHarareFee:   settings.outside_harare_fee  ? Number(settings.outside_harare_fee) : 15,
    freeDeliveryAbove:  settings.free_delivery_above ? Number(settings.free_delivery_above) : null,
    deliveryCities:     settings.delivery_cities
                          ? settings.delivery_cities.split(',')
                          : ZIMBABWE_CITIES,
    deliveryNote:       settings.delivery_note ?? null,
  };
};

// ─────────────────────────────────────────────────────────────
// CALCULATE: Delivery fee for a specific customer city
// ─────────────────────────────────────────────────────────────
export const calculateDeliveryFee = async (data: {
  merchantId: number;
  customerCity: string;
  orderAmount: number;
}) => {
  const settings = await getMerchantDeliverySettings(data.merchantId);

  // Merchant doesn't offer delivery
  if (!settings.offersDelivery) {
    return {
      deliveryAvailable: false,
      fee: 0,
      message: 'Pickup only',
    };
  }

  // Check if merchant delivers to this city
  const cityAvailable = settings.deliveryCities?.includes(data.customerCity);
  if (!cityAvailable) {
    return {
      deliveryAvailable: false,
      fee: 0,
      message: `Sorry, delivery not available to ${data.customerCity}`,
    };
  }

  // Free delivery if order is above threshold
  if (settings.freeDeliveryAbove && data.orderAmount >= settings.freeDeliveryAbove) {
    return {
      deliveryAvailable: true,
      fee: 0,
      message: `Free delivery on orders above $${settings.freeDeliveryAbove}! 🎉`,
    };
  }

  // Harare vs outside Harare fee
  const isHarare = data.customerCity.toLowerCase() === 'harare';
  const fee = isHarare
    ? (settings.harareFee ?? 10)
    : (settings.outsideHarareFee ?? 15);

  return {
    deliveryAvailable: true,
    fee,
    message: settings.deliveryNote ?? `Delivery to ${data.customerCity}: $${fee}`,
  };
};