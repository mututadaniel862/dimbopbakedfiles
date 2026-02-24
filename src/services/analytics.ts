import { PrismaClient } from "@prisma/client";
import { UserAnalytics, userAnalyticsSchema } from "../models/analytics";

const prisma = new PrismaClient();

type DeviceStats = {
  mobile: number;
  tablet: number;
  desktop: number;
  other: number;
  unknown: number;
};

export const AnalyticsService = {
  async createAnalytics(data: UserAnalytics) {
    const validated = userAnalyticsSchema.parse(data);
    
    return await prisma.user_analytics.create({
      data: {
        user_id: validated.user_id ?? null,
        browser: validated.browser ?? null,
        device: validated.device ?? null,
        created_at: validated.created_at ?? new Date(),
      }
    });
  },

  async getAllAnalytics(
    page: number = 1,
    limit: number = 10,
    deviceType?: string
  ) {
    const where = deviceType 
      ? { device: { contains: deviceType } } 
      : {};
    
    return await prisma.user_analytics.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
      where,
    });
  },

  async getAnalyticsById(id: number) {
    return await prisma.user_analytics.findUnique({
      where: { id },
      include: {
        users: true // Include related user data if needed
      }
    });
  },

  async getDeviceTypeStats(): Promise<DeviceStats> {
    const allRecords = await prisma.user_analytics.findMany({
      select: { device: true },
    });

    const stats: DeviceStats = {
      mobile: 0,
      tablet: 0,
      desktop: 0,
      other: 0,
      unknown: 0,
    };

    allRecords.forEach((record) => {
      const deviceType = this.getDeviceType(record.device);
      stats[deviceType] += 1;
    });

    return stats;
  },


  // async getDeviceTypeStats() {
  //   const stats = await prisma.userAnalytics.groupBy({
  //     by: ['device'],
  //     _count: {
  //       device: true
  //     },
  //   });
    
  //   const result = {
  //     mobile: 0,
  //     tablet: 0,
  //     desktop: 0,
  //     other: 0,
  //     unknown: 0
  //   };
    
  //   stats.forEach(stat => {
  //     const deviceType = stat.device?.toLowerCase() || 'unknown';
  //     if (deviceType in result) {
  //       result[deviceType as keyof typeof result] = stat._count.device;
  //     } else {
  //       result.other += stat._count.device;
  //     }
  //   });
    
  //   return result;
  // }

  

  getDeviceType(device: string | null): keyof DeviceStats {
    if (!device) return 'unknown';
    
    const lowerDevice = device.toLowerCase();
    
    if (/(android|iphone|mobile|windows phone|blackberry|opera mini)/.test(lowerDevice)) {
      return 'mobile';
    }
    
    if (/(ipad|tablet|kindle|silk)/.test(lowerDevice)) {
      return 'tablet';
    }
    
    if (/(windows|macintosh|linux|mac os|ubuntu)/.test(lowerDevice)) {
      return 'desktop';
    }
    
    return 'other';
  },
};