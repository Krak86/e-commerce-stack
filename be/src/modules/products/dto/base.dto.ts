import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IntersectionType } from '@nestjs/mapped-types';
import {
  CategoryNameDto,
  CategorySlugDto,
} from '@/modules/categories/dto/base.dto';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 0,
    default: 0,
  })
  @IsInt({ message: 'page must be an integer' })
  @Type(() => Number)
  @Min(0, { message: 'page must be >= 0' })
  @IsOptional()
  page: number = 0;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsInt({ message: 'limit must be an integer' })
  @Type(() => Number)
  @Min(1, { message: 'limit must be >= 1' })
  @Max(100, { message: 'limit must be <= 100' })
  @IsOptional()
  limit: number = 10;
}

export class ProductCategoryDto {
  @ApiPropertyOptional({
    description: 'Filter by category',
  })
  @IsString()
  @IsOptional()
  category?: string;
}

export class ProductIdDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  @Type(() => Number)
  @IsNotEmpty({ message: 'ID must not be empty' })
  @IsNumber()
  id: number;
}

export class CategoryInfo extends IntersectionType(
  CategorySlugDto,
  CategoryNameDto,
) {}
