import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { LanguageCodeDto } from '@/modules/categories/dto';
import {
  CategoryInfo,
  PaginationDto,
  ProductCategoryDto,
  ProductIdDto,
} from './base.dto';

export class GetProductDto extends IntersectionType(
  ProductIdDto,
  LanguageCodeDto,
) {}

export class GetProductsDto extends IntersectionType(
  PaginationDto,
  ProductCategoryDto,
  LanguageCodeDto,
) {}

export class GetProductsResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: number;

  @ApiProperty({
    example: 'product-slug',
    description: 'Product slug (URL identifier)',
  })
  slug: string;

  @ApiProperty({ example: 99.99, description: 'Product price' })
  price: number;

  @ApiProperty({ example: 10, description: 'Stock quantity' })
  stock: number;

  @ApiProperty({
    example: 'Product Name',
    description: 'Product name',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    example: 'Product description',
    description: 'Product description',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Product image URL',
    nullable: true,
  })
  image: string | null;

  @ApiProperty({
    description: 'Product category',
    type: () => CategoryInfo,
  })
  category: CategoryInfo;
}
