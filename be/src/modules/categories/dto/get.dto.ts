import { ApiProperty } from '@nestjs/swagger';

import {
  CategoryTranslationExtendedDto,
  IdDto,
  LanguageCodeDto,
} from './base.dto';

export class GetCategoriesDto extends LanguageCodeDto {}

export class GetCategoriesResponseDto {
  @ApiProperty({ description: 'Category ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Category slug', example: 'category-slug' })
  slug: string;
}

export class GetCategoryDto extends IdDto {}

export class GetCategoriesWithTranslationsResponseDto {
  @ApiProperty({ description: 'Category ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Category slug', example: 'category-slug' })
  slug: string;

  @ApiProperty({ description: 'Category name', example: 'Category Name' })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Category Description',
  })
  description: string;
}

export class GetCategoryWithTranslationsResponseDto {
  @ApiProperty({ description: 'Category ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Category slug', example: 'category-slug' })
  slug: string;

  @ApiProperty({
    type: [CategoryTranslationExtendedDto],
    description: 'List of translations for the category',
  })
  translations: CategoryTranslationExtendedDto[];
}
