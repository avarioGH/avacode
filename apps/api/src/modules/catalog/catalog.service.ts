import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  listProducts() {
    return this.prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        tutorials: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'asc' }],
    });
  }

  getProduct(slug: string) {
    return this.prisma.product.findUniqueOrThrow({
      where: { slug },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        tutorials: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }
}
