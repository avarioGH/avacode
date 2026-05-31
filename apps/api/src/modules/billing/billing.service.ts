import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  PaymentGateway,
  PaymentStatus,
  Prisma,
  ServiceStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { randomUUID } from 'crypto';

import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { addMonths } from '../../common/utils/date';
import { slugify } from '../../common/utils/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { GatewayCheckoutResponse, ParsedGatewayWebhook } from './billing.types';
import { PaydisiniClient } from './gateways/paydisini.client';
import { PakasirClient } from './gateways/pakasir.client';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paydisiniClient: PaydisiniClient,
    private readonly pakasirClient: PakasirClient,
  ) {}

  async createCheckout(user: AuthenticatedUser, dto: CheckoutDto) {
    if (!user.tenantId) {
      throw new BadRequestException('User does not have a default tenant.');
    }

    const packageRecord = await this.prisma.package.findUnique({
      where: { id: dto.packageId },
      include: { product: true },
    });

    if (!packageRecord || !packageRecord.isActive) {
      throw new NotFoundException('Package not found.');
    }

    const amount = packageRecord.price.plus(packageRecord.setupFee);
    const invoiceNumber = this.generateInvoiceNumber();

    const gatewayCheckout = await this.createGatewayCheckout(dto.gateway, {
      invoiceNumber,
      amount: amount.toNumber(),
      channel: dto.channel,
      customerEmail: user.email,
    });

    const order = await this.prisma.order.create({
      data: {
        tenantId: user.tenantId,
        userId: user.sub,
        productId: packageRecord.productId,
        packageId: packageRecord.id,
        invoiceNumber,
        amount,
        status: OrderStatus.PENDING,
        expiresAt: gatewayCheckout.expiresAt ?? new Date(Date.now() + 60 * 60 * 1000),
        metadata: {
          serviceName: dto.serviceName,
          requestedGateway: dto.gateway,
          requestedChannel: dto.channel,
        },
        payment: {
          create: {
            userId: user.sub,
            gateway: dto.gateway,
            status: PaymentStatus.PENDING,
            amount,
            channel: dto.channel,
            gatewayReference: gatewayCheckout.gatewayReference,
            checkoutUrl: gatewayCheckout.checkoutUrl,
            qrCode: gatewayCheckout.qrCode,
            rawPayload: gatewayCheckout.rawPayload as Prisma.InputJsonValue,
            expiresAt: gatewayCheckout.expiresAt,
          },
        },
      },
      include: {
        product: true,
        package: true,
        payment: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        tenantId: user.tenantId,
        actorUserId: user.sub,
        actorType: 'USER',
        action: 'billing.checkout.created',
        subjectType: 'order',
        subjectId: order.id,
        metadata: {
          invoiceNumber: order.invoiceNumber,
          gateway: dto.gateway,
        },
      },
    });

    return order;
  }

  listInvoices(user: AuthenticatedUser) {
    return this.prisma.order.findMany({
      where: {
        tenantId: user.tenantId ?? undefined,
        userId: user.sub,
      },
      include: {
        product: true,
        package: true,
        payment: true,
        subscription: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async handlePaydisiniWebhook(payload: Record<string, unknown>) {
    const parsed = this.paydisiniClient.parseWebhook(payload);
    return this.reconcileWebhook('PAYDISINI', parsed);
  }

  async handlePakasirWebhook(payload: Record<string, unknown>) {
    const parsed = this.pakasirClient.parseWebhook(payload);
    return this.reconcileWebhook('PAKASIR', parsed);
  }

  private async createGatewayCheckout(
    gateway: PaymentGateway,
    request: {
      invoiceNumber: string;
      amount: number;
      channel?: string;
      customerEmail: string;
    },
  ): Promise<GatewayCheckoutResponse> {
    if (gateway === PaymentGateway.PAYDISINI) {
      return this.paydisiniClient.createInvoice(request);
    }

    if (gateway === PaymentGateway.PAKASIR) {
      return this.pakasirClient.createInvoice(request);
    }

    return {
      gateway,
      gatewayReference: request.invoiceNumber,
      checkoutUrl: `${process.env.WEB_URL ?? 'http://localhost:3000'}/dashboard/billing`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      rawPayload: {
        gateway: 'MANUAL',
      },
    };
  }

  private async reconcileWebhook(
    gateway: PaymentGateway,
    parsed: ParsedGatewayWebhook,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { invoiceNumber: parsed.invoiceNumber },
      include: {
        product: true,
        package: true,
        payment: true,
      },
    });

    if (!order || !order.payment) {
      throw new NotFoundException('Order not found for webhook reconciliation.');
    }

    if (parsed.amount && Math.round(parsed.amount) !== Math.round(order.amount.toNumber())) {
      throw new BadRequestException('Webhook amount mismatch.');
    }

    if (this.isSettledStatus(parsed.status)) {
      return this.activateOrder(order.id, gateway, parsed);
    }

    if (this.isExpiredStatus(parsed.status)) {
      await this.prisma.payment.update({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.EXPIRED,
          callbackPayload: parsed.rawPayload as Prisma.InputJsonValue,
        },
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.EXPIRED },
      });

      return { success: true, status: 'expired' };
    }

    if (this.isCancelledStatus(parsed.status)) {
      await this.prisma.payment.update({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.CANCELLED,
          callbackPayload: parsed.rawPayload as Prisma.InputJsonValue,
        },
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED },
      });

      return { success: true, status: 'cancelled' };
    }

    await this.prisma.payment.update({
      where: { orderId: order.id },
      data: {
        callbackPayload: parsed.rawPayload as Prisma.InputJsonValue,
        gatewayReference: parsed.gatewayReference ?? order.payment.gatewayReference,
      },
    });

    return { success: true, status: 'pending' };
  }

  private async activateOrder(
    orderId: string,
    gateway: PaymentGateway,
    parsed: ParsedGatewayWebhook,
  ) {
    const now = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: {
          product: true,
          package: true,
          payment: true,
        },
      });

      if (order.status === OrderStatus.PAID && order.subscriptionId) {
        return tx.order.findUniqueOrThrow({
          where: { id: orderId },
          include: {
            product: true,
            package: true,
            payment: true,
            subscription: true,
          },
        });
      }

      const existingSubscription = await tx.subscription.findFirst({
        where: {
          tenantId: order.tenantId,
          productId: order.productId,
          userId: order.userId,
          status: {
            in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.SUSPENDED, SubscriptionStatus.PENDING],
          },
        },
        orderBy: { expiresAt: 'desc' },
      });

      const baseDate =
        existingSubscription && existingSubscription.expiresAt > now
          ? existingSubscription.expiresAt
          : now;

      const nextExpiry = addMonths(baseDate, order.package.durationMonths);

      const subscription = existingSubscription
        ? await tx.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              packageId: order.packageId,
              status: SubscriptionStatus.ACTIVE,
              suspendedAt: null,
              cancelledAt: null,
              expiresAt: nextExpiry,
            },
          })
        : await tx.subscription.create({
            data: {
              tenantId: order.tenantId,
              userId: order.userId,
              productId: order.productId,
              packageId: order.packageId,
              status: SubscriptionStatus.ACTIVE,
              startedAt: now,
              expiresAt: nextExpiry,
            },
          });

      const existingService = await tx.service.findFirst({
        where: { subscriptionId: subscription.id },
      });

      const serviceName = this.extractServiceName(order.metadata, order.product.name);
      const nextServiceStatus =
        existingService?.currentInstanceId ? ServiceStatus.RUNNING : ServiceStatus.DRAFT;

      if (existingService) {
        await tx.service.update({
          where: { id: existingService.id },
          data: {
            name: serviceName,
            status: nextServiceStatus,
            expiresAt: nextExpiry,
          },
        });
      } else {
        await tx.service.create({
          data: {
            tenantId: order.tenantId,
            userId: order.userId,
            subscriptionId: subscription.id,
            productId: order.productId,
            name: serviceName,
            slug: `${slugify(serviceName)}-${randomUUID().slice(0, 6)}`,
            status: ServiceStatus.DRAFT,
            expiresAt: nextExpiry,
          },
        });
      }

      await tx.payment.update({
        where: { orderId: order.id },
        data: {
          gateway,
          status: PaymentStatus.SETTLED,
          paidAt: now,
          callbackPayload: parsed.rawPayload as Prisma.InputJsonValue,
          gatewayReference: parsed.gatewayReference ?? order.payment?.gatewayReference,
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.PAID,
          paidAt: now,
          subscriptionId: subscription.id,
        },
      });

      await tx.activityLog.create({
        data: {
          tenantId: order.tenantId,
          actorUserId: order.userId,
          actorType: 'USER',
          action: 'billing.payment.settled',
          subjectType: 'order',
          subjectId: order.id,
          metadata: {
            invoiceNumber: order.invoiceNumber,
            gateway,
            subscriptionId: subscription.id,
          },
        },
      });

      return tx.order.findUniqueOrThrow({
        where: { id: order.id },
        include: {
          product: true,
          package: true,
          payment: true,
          subscription: true,
        },
      });
    });

    return {
      success: true,
      status: 'paid',
      order: result,
    };
  }

  private isSettledStatus(status: string) {
    return ['success', 'paid', 'settled', 'completed'].includes(status.toLowerCase());
  }

  private isExpiredStatus(status: string) {
    return ['expired'].includes(status.toLowerCase());
  }

  private isCancelledStatus(status: string) {
    return ['cancelled', 'canceled', 'failed'].includes(status.toLowerCase());
  }

  private generateInvoiceNumber() {
    return `INV-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`;
  }

  private extractServiceName(metadata: Prisma.JsonValue | null, fallback: string) {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      return fallback;
    }

    const serviceName = (metadata as Record<string, unknown>).serviceName;
    return typeof serviceName === 'string' && serviceName.trim().length > 0
      ? serviceName
      : fallback;
  }
}
