import { Module } from '@nestjs/common';

import { DockerEngineService } from './docker-engine.service';
import { DeploymentsService } from './deployments.service';

@Module({
  providers: [DockerEngineService, DeploymentsService],
  exports: [DockerEngineService, DeploymentsService],
})
export class DeploymentsModule {}
