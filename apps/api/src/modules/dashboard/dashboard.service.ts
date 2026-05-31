import { Injectable } from '@nestjs/common';

import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(user: AuthenticatedUser) {
    const tenantId = user.tenantId ?? undefined;

    const [activeServices, totalInvoices, expiringSoon, recentActivity] = await Promise.all([
      this.prisma.service.count({
        where: {
          tenantId,
          userId: user.sub,
          status: 'RUNNING',
        },
      }),
      this.prisma.order.count({
        where: {
          tenantId,
          userId: user.sub,
        },
      }),
      this.prisma.subscription.count({
        where: {
          tenantId,
          userId: user.sub,
          expiresAt: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.activityLog.findMany({
        where: {
          tenantId,
          actorUserId: user.sub,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      activeServices,
      totalInvoices,
      expiringSoon,
      recentActivity,
    };
  }
}
