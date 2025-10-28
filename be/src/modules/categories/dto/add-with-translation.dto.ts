import { ApiProperty } from '@nestjs/swagger';
import { IntersectionType } from '@nestjs/mapped-types';

import {
  CategoryTranslationsDto,
  CategorySlugDto,
  CategoryTranslationDto,
} from './base.dto';

export class AddCategoryWithTranslationDto extends IntersectionType(
  CategorySlugDto,
  CategoryTranslationsDto,
) {}

export class AddCategoryWithTranslationResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the newly created category',
  })
  id: number;

  @ApiProperty({
    example: 'category-slug',
    description: 'The slug of the newly created category',
  })
  slug: string;

  @ApiProperty({
    description: 'List of translations for the category',
  })
  translations: CategoryTranslationDto[];
}
