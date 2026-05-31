import { ForbiddenException, Injectable } from '@nestjs/common';
import { PackageInterval, Prisma, ProductStatus } from '@prisma/client';

import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertProductDto } from './dto/upsert-product.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(user: AuthenticatedUser) {
    this.assertAdmin(user);

    const [users, services, deployments, revenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.service.count(),
      this.prisma.deployment.count(),
      this.prisma.payment.aggregate({
        where: { status: 'SETTLED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      users,
      services,
      deployments,
      revenue: revenue._sum.amount ?? new Prisma.Decimal(0),
    };
  }

  async listDeployments(user: AuthenticatedUser) {
    this.assertAdmin(user);

    return this.prisma.deployment.findMany({
      include: {
        service: {
          include: {
            product: true,
          },
        },
        logs: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async createProduct(user: AuthenticatedUser, dto: UpsertProductDto) {
    this.assertAdmin(user);

    const product = await this.prisma.product.create({
      data: {
        slug: dto.slug,
        kind: dto.kind,
        name: dto.name,
        shortDescription: dto.shortDescription,
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
        demoUrl: dto.demoUrl,
        runtimeImage: dto.runtimeImage,
        runtimePort: dto.runtimePort,
        startingPrice: dto.startingPrice,
        isFeatured: dto.isFeatured ?? false,
        status: dto.status ?? ProductStatus.DRAFT,
        featureList: dto.featureList as Prisma.InputJsonValue,
        faq: dto.faq as Prisma.InputJsonValue,
        setupSchema: dto.setupSchema as Prisma.InputJsonValue,
        packages: dto.packages
          ? {
              create: dto.packages.map((pkg, index) => ({
                code: pkg.code,
                name: pkg.name,
                interval: this.mapInterval(pkg.interval),
                durationMonths: pkg.durationMonths,
                price: pkg.price,
                isPopular: pkg.isPopular ?? false,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        packages: true,
      },
    });

    return product;
  }

  async updateProduct(user: AuthenticatedUser, productId: string, dto: UpsertProductDto) {
    this.assertAdmin(user);

    const product = await this.prisma.product.update({
      where: { id: productId },
      data: {
        slug: dto.slug,
        kind: dto.kind,
        name: dto.name,
        shortDescription: dto.shortDescription,
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
        demoUrl: dto.demoUrl,
        runtimeImage: dto.runtimeImage,
        runtimePort: dto.runtimePort,
        startingPrice: dto.startingPrice,
        isFeatured: dto.isFeatured ?? false,
        status: dto.status ?? ProductStatus.DRAFT,
        featureList: dto.featureList as Prisma.InputJsonValue,
        faq: dto.faq as Prisma.InputJsonValue,
        setupSchema: dto.setupSchema as Prisma.InputJsonValue,
      },
      include: {
        packages: true,
      },
    });

    if (dto.packages?.length) {
      for (const [index, pkg] of dto.packages.entries()) {
        await this.prisma.package.upsert({
          where: {
            productId_code: {
              productId,
              code: pkg.code,
            },
          },
          update: {
            name: pkg.name,
            interval: this.mapInterval(pkg.interval),
            durationMonths: pkg.durationMonths,
            price: pkg.price,
            isPopular: pkg.isPopular ?? false,
            sortOrder: index,
          },
          create: {
            productId,
            code: pkg.code,
            name: pkg.name,
            interval: this.mapInterval(pkg.interval),
            durationMonths: pkg.durationMonths,
            price: pkg.price,
            isPopular: pkg.isPopular ?? false,
            sortOrder: index,
          },
        });
      }
    }

    return this.prisma.product.findUniqueOrThrow({
      where: { id: product.id },
      include: { packages: true },
    });
  }

  private assertAdmin(user: AuthenticatedUser) {
    if (!['ADMIN', 'OWNER'].includes(user.role)) {
      throw new ForbiddenException('Admin privileges required.');
    }
  }

  private mapInterval(interval: string) {
    const normalized = interval.toUpperCase();

    if (normalized in PackageInterval) {
      return normalized as PackageInterval;
    }

    return PackageInterval.MONTHLY;
  }
}
