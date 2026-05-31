import { ProductKind, ProductStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpsertPackageDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  interval!: string;

  @IsInt()
  durationMonths!: number;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;
}

export class UpsertProductDto {
  @IsString()
  slug!: string;

  @IsEnum(ProductKind)
  kind!: ProductKind;

  @IsString()
  name!: string;

  @IsString()
  shortDescription!: string;

  @IsString()
  description!: string;

  @IsNumber()
  startingPrice!: number;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  demoUrl?: string;

  @IsOptional()
  @IsString()
  runtimeImage?: string;

  @IsOptional()
  @IsInt()
  runtimePort?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsArray()
  featureList?: string[];

  @IsOptional()
  faq?: unknown;

  @IsOptional()
  setupSchema?: unknown;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertPackageDto)
  packages?: UpsertPackageDto[];
}
