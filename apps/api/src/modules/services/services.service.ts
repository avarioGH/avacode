import { Injectable, NotFoundException } from '@nestjs/common';

import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { DeploymentsService } from '../deployments/deployments.service';
import { UpdateServiceConfigDto } from './dto/update-service-config.dto';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly deploymentsService: DeploymentsService,
  ) {}

  listServices(user: AuthenticatedUser) {
    return this.prisma.service.findMany({
      where: {
        tenantId: user.tenantId ?? undefined,
        userId: user.sub,
      },
      include: {
        product: true,
        subscription: true,
        currentInstance: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getService(user: AuthenticatedUser, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        tenantId: user.tenantId ?? undefined,
        userId: user.sub,
      },
      include: {
        product: {
          include: {
            tutorials: {
              where: { isPublished: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        subscription: true,
        currentInstance: true,
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { logs: true },
        },
        supportTickets: {
          include: {
            messages: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    return service;
  }

  async updateConfig(user: AuthenticatedUser, serviceId: string, dto: UpdateServiceConfigDto) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        tenantId: user.tenantId ?? undefined,
        userId: user.sub,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    const nextConfig =
      dto.config && service.config && typeof service.config === 'object' && !Array.isArray(service.config)
        ? { ...(service.config as Record<string, unknown>), ...dto.config }
        : dto.config ?? service.config;

    return this.prisma.service.update({
      where: { id: service.id },
      data: {
        name: dto.name ?? service.name,
        domain: dto.domain ?? service.domain,
        logoUrl: dto.logoUrl ?? service.logoUrl,
        config: nextConfig as never,
      },
      include: {
        product: true,
        subscription: true,
        currentInstance: true,
      },
    });
  }

  deploy(user: AuthenticatedUser, serviceId: string) {
    return this.deploymentsService.deployService(user, serviceId);
  }

  restart(user: AuthenticatedUser, serviceId: string) {
    return this.deploymentsService.restartService(user, serviceId);
  }

  suspend(user: AuthenticatedUser, serviceId: string) {
    return this.deploymentsService.suspendService(user, serviceId);
  }
}
