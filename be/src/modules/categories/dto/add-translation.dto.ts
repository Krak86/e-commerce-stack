import { ApiProperty } from '@nestjs/swagger';
import { IntersectionType } from '@nestjs/mapped-types';

import { language_code } from '@prisma/client';
import {
  CategoryNameDto,
  CategoryDescDto,
  CategoryIdDto,
  LanguageCodeDto,
} from './base.dto';

export class AddCategoryTranslationDto extends IntersectionType(
  CategoryIdDto,
  CategoryNameDto,
  CategoryDescDto,
  LanguageCodeDto,
) {}

export class AddCategoryTranslationResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the category' })
  category_id: number;

  @ApiProperty({ example: 'en', description: 'Language code' })
  language_code: language_code;

  @ApiProperty({ description: 'Category name', example: 'Electronics' })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Latest electronics gadgets',
  })
  description: string;

  category_translation_id: number;
}
