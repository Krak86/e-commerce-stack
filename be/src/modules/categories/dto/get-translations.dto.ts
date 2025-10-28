import { ApiProperty } from '@nestjs/swagger';

import { LanguageCodeDto } from './base.dto';

export class GetCategoriesTranslationsDto extends LanguageCodeDto {}

export class GetCategoriesTranslationsResponseDto {
  @ApiProperty({ example: 1, description: 'Translation ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Category ID' })
  category_id: number;

  @ApiProperty({ example: 'en', description: 'Language code' })
  language_code: string;

  @ApiProperty({ example: 'Electronics', description: 'Category name' })
  name: string;

  @ApiProperty({
    example: 'Latest electronics gadgets',
    description: 'Category description',
  })
  description: string;
}
