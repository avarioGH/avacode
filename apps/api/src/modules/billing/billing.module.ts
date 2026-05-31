import { Module } from '@nestjs/common';

import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { PakasirClient } from './gateways/pakasir.client';
import { PaydisiniClient } from './gateways/paydisini.client';

@Module({
  controllers: [BillingController],
  providers: [BillingService, PaydisiniClient, PakasirClient],
  exports: [BillingService],
})
export class BillingModule {}
