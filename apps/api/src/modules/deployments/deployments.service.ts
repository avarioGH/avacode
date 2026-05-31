import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeploymentStatus, ServiceStatus, SubscriptionStatus } from '@prisma/client';

import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { DEPLOYMENT_TEMPLATES } from './deployment.templates';
import { DockerEngineService } from './docker-engine.service';

@Injectable()
export class DeploymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dockerEngineService: DockerEngineService,
  ) {}

  async deployService(user: AuthenticatedUser, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        tenantId: user.tenantId ?? undefined,
      },
      include: {
        product: true,
        currentInstance: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    const config = this.ensureConfig(service.config, service.product.kind);
    const image =
      service.product.runtimeImage ?? DEPLOYMENT_TEMPLATES[service.product.kind].defaultImage;
    const containerName =
      service.currentInstance?.containerName ??
      `automationhub-${service.slug}-${service.id.slice(-6)}`;
    const version = new Date().toISOString();

    const deployment = await this.prisma.deployment.create({
      data: {
        serviceId: service.id,
        triggeredById: user.sub,
        status: DeploymentStatus.QUEUED,
        version,
        image,
        containerName,
        startedAt: new Date(),
      },
    });

    await this.log(deployment.id, 'INFO', 'prepare', 'Deployment queued.');
    await this.prisma.service.update({
      where: { id: service.id },
      data: { status: ServiceStatus.DEPLOYING },
    });

    try {
      await this.log(deployment.id, 'INFO', 'config', 'Generating runtime files.');

      const dockerResult = await this.dockerEngineService.deploy({
        containerName,
        image,
        serviceSlug: service.slug,
        config,
      });

      await this.log(deployment.id, 'INFO', 'docker', 'Container started successfully.');

      const instance = await this.prisma.instance.create({
        data: {
          serviceId: service.id,
          deploymentId: deployment.id,
          containerName,
          containerId: dockerResult.containerId,
          image,
          status: ServiceStatus.RUNNING,
        },
      });

      await this.prisma.service.update({
        where: { id: service.id },
        data: {
          currentInstanceId: instance.id,
          status: ServiceStatus.RUNNING,
          runtimePath: dockerResult.runtimePath,
          deployedAt: new Date(),
        },
      });

      const updatedDeployment = await this.prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          status: DeploymentStatus.RUNNING,
          envFilePath: dockerResult.envFilePath,
          configFilePath: dockerResult.configFilePath,
          finishedAt: new Date(),
        },
        include: {
          logs: true,
        },
      });

      return updatedDeployment;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown deployment error';
      await this.log(deployment.id, 'ERROR', 'docker', message);

      await this.prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          status: DeploymentStatus.FAILED,
          finishedAt: new Date(),
        },
      });

      await this.prisma.service.update({
        where: { id: service.id },
        data: { status: ServiceStatus.ERROR },
      });

      throw new BadRequestException(message);
    }
  }

  async suspendService(user: AuthenticatedUser, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        tenantId: user.tenantId ?? undefined,
      },
      include: {
        currentInstance: true,
        subscription: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    if (service.currentInstance?.containerName) {
      await this.dockerEngineService.stopContainer(service.currentInstance.containerName);
    }

    await this.prisma.subscription.update({
      where: { id: service.subscriptionId },
      data: {
        status: SubscriptionStatus.SUSPENDED,
        suspendedAt: new Date(),
      },
    });

    return this.prisma.service.update({
      where: { id: service.id },
      data: { status: ServiceStatus.SUSPENDED },
      include: { currentInstance: true, subscription: true, product: true },
    });
  }

  async restartService(user: AuthenticatedUser, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        tenantId: user.tenantId ?? undefined,
      },
      include: {
        currentInstance: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    if (service.currentInstance?.containerName) {
      await this.dockerEngineService.startContainer(service.currentInstance.containerName);
      return this.prisma.service.update({
        where: { id: service.id },
        data: { status: ServiceStatus.RUNNING },
        include: { currentInstance: true, subscription: true, product: true },
      });
    }

    return this.deployService(user, serviceId);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async suspendExpiredSubscriptions() {
    const expiredSubscriptions = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiresAt: {
          lte: new Date(),
        },
      },
      include: {
        service: {
          include: {
            currentInstance: true,
          },
        },
      },
    });

    for (const subscription of expiredSubscriptions) {
      if (subscription.service?.currentInstance?.containerName) {
        await this.dockerEngineService.stopContainer(subscription.service.currentInstance.containerName);
      }

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      });

      if (subscription.service) {
        await this.prisma.service.update({
          where: { id: subscription.service.id },
          data: { status: ServiceStatus.EXPIRED },
        });
      }
    }
  }

  private async log(
    deploymentId: string,
    level: 'INFO' | 'WARN' | 'ERROR',
    step: string,
    message: string,
  ) {
    await this.prisma.deploymentLog.create({
      data: {
        deploymentId,
        level,
        step,
        message,
      },
    });
  }

  private ensureConfig(config: unknown, productKind: keyof typeof DEPLOYMENT_TEMPLATES) {
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new BadRequestException('Service configuration is incomplete.');
    }

    const template = DEPLOYMENT_TEMPLATES[productKind];
    const record = config as Record<string, unknown>;
    const missing = template.expectedConfig.filter((key) => !record[key]);

    if (missing.length > 0) {
      throw new BadRequestException(`Missing config values: ${missing.join(', ')}`);
    }

    return record;
  }
}
