import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CatalogService } from './catalog.service';

@ApiTags('products')
@Controller('products')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  listProducts() {
    return this.catalogService.listProducts();
  }

  @Get(':slug')
  getProduct(@Param('slug') slug: string) {
    return this.catalogService.getProduct(slug);
  }
}
