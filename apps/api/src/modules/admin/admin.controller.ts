import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AdminService } from './admin.service';
import { UpsertProductDto } from './dto/upsert-product.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  getOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.adminService.getOverview(user);
  }

  @Get('deployments')
  listDeployments(@CurrentUser() user: AuthenticatedUser) {
    return this.adminService.listDeployments(user);
  }

  @Post('products')
  createProduct(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpsertProductDto) {
    return this.adminService.createProduct(user, dto);
  }

  @Patch('products/:id')
  updateProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpsertProductDto,
  ) {
    return this.adminService.updateProduct(user, id, dto);
  }
}
