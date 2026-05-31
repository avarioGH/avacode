import { Module } from '@nestjs/common';

import { DeploymentsModule } from '../deployments/deployments.module';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [DeploymentsModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
