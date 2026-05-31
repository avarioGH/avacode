import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { BillingService } from './billing.service';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('webhooks/paydisini')
  paydisiniWebhook(@Body() payload: Record<string, unknown>) {
    return this.billingService.handlePaydisiniWebhook(payload);
  }

  @Post('webhooks/pakasir')
  pakasirWebhook(@Body() payload: Record<string, unknown>) {
    return this.billingService.handlePakasirWebhook(payload);
  }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  checkout(@CurrentUser() user: AuthenticatedUser, @Body() dto: CheckoutDto) {
    return this.billingService.createCheckout(user, dto);
  }

  @Get('invoices')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  listInvoices(@CurrentUser() user: AuthenticatedUser) {
    return this.billingService.listInvoices(user);
  }
}
