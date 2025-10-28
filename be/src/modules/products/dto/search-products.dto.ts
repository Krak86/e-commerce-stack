import {
  IsOptional,
  IsString,
  IsIn,
  IsNumber,
  IsBoolean,
  Validate,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';

import { ASCENDING } from '@/utils/static';
import type { AscType } from '@/utils/type';
import { MinLessThanMaxConstraint } from '@/common/validators/min-less-than-max.validator';
import { LanguageCodeDto } from '@/modules/categories/dto';
import { PaginationDto, ProductCategoryDto } from './base.dto';

export class SearchProductsDto extends IntersectionType(
  PaginationDto,
  ProductCategoryDto,
  LanguageCodeDto,
) {
  @Validate(MinLessThanMaxConstraint)
  dummy?: any;

  @ApiPropertyOptional({
    description: 'Search text',
    type: String,
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description: `Order by direction`,
    enum: ASCENDING,
    default: ASCENDING?.[0],
  })
  @IsString()
  @IsOptional()
  @IsIn(ASCENDING as readonly string[], {
    message: `orderBy must be one of: ${ASCENDING.join(', ')}`,
  })
  orderBy: AscType = ASCENDING?.[0];

  @ApiPropertyOptional({
    description: 'Minimum price',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter by stock availability',
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  inStock?: boolean;
}
