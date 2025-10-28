import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';

import { LANGUAGES } from '@/utils/static';
import { ToSlug } from '@/common/decorators';

export class LanguageCodeDto {
  @ApiProperty({
    description: `Language for product data`,
    enum: LANGUAGES,
    default: LANGUAGES?.[0],
  })
  @IsString()
  @IsIn(LANGUAGES as readonly string[], {
    message: `language must be one of: ${LANGUAGES.join(', ')}`,
  })
  language_code = LANGUAGES?.[0];
}

export class CategorySlugDto {
  @ToSlug()
  @ApiProperty({ example: 'electronics', description: 'Category slug' })
  @IsString()
  @IsNotEmpty({ message: 'Slug must not be empty' })
  slug: string;
}

export class CategoryNameDto {
  @ApiProperty({ description: 'Category name', example: 'Electronics' })
  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString()
  name: string;
}

export class CategoryDescDto {
  @ApiProperty({
    description: 'Category description',
    example: 'Devices and gadgets',
  })
  @IsNotEmpty({ message: 'Description must not be empty' })
  @IsString()
  description: string;
}

export class IdDto {
  @ApiProperty({ description: 'Category ID', example: 1 })
  @Type(() => Number)
  @IsNotEmpty({ message: 'ID must not be empty' })
  @IsNumber()
  id: number;
}

export class CategoryIdDto {
  @ApiProperty({ description: 'Category ID', example: 1 })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Category ID must not be empty' })
  @IsNumber()
  category_id: number;
}

export class CategoryTranslationIdDto {
  @ApiProperty({ description: 'Category Translation ID', example: 1 })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Category Translation ID must not be empty' })
  @IsNumber()
  category_translation_id: number;
}

export class CategoryTranslationDto extends IntersectionType(
  LanguageCodeDto,
  CategoryDescDto,
  CategoryNameDto,
  CategoryTranslationIdDto,
) {}

export class CategoryTranslationsDto {
  @ApiProperty({
    type: [CategoryTranslationDto],
    description: 'List of translations for the category',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations: CategoryTranslationDto[];
}

export class CategoryTranslationExtendedDto extends IntersectionType(
  LanguageCodeDto,
  CategoryNameDto,
  CategoryDescDto,
  CategoryTranslationIdDto,
) {}

export class CategoryTranslationsExtendedDto {
  @ApiProperty({
    type: [CategoryTranslationExtendedDto],
    description: 'List of translations for the category',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationExtendedDto)
  translations: CategoryTranslationExtendedDto[];
}
