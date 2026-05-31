import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { UpdateServiceConfigDto } from './dto/update-service-config.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  listServices(@CurrentUser() user: AuthenticatedUser) {
    return this.servicesService.listServices(user);
  }

  @Get(':id')
  getService(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.servicesService.getService(user, id);
  }

  @Patch(':id/config')
  updateConfig(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateServiceConfigDto,
  ) {
    return this.servicesService.updateConfig(user, id, dto);
  }

  @Post(':id/deploy')
  deploy(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.servicesService.deploy(user, id);
  }

  @Post(':id/restart')
  restart(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.servicesService.restart(user, id);
  }

  @Post(':id/suspend')
  suspend(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.servicesService.suspend(user, id);
  }
}
