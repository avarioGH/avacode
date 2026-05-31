import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateServiceConfigDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}
