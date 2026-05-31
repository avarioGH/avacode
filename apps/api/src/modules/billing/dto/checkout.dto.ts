import { PaymentGateway } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @IsString()
  packageId!: string;

  @IsEnum(PaymentGateway)
  gateway!: PaymentGateway;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsOptional()
  @IsString()
  serviceName?: string;
}
