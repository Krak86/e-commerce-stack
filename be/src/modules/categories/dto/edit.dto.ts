import { ApiProperty } from '@nestjs/swagger';
import { IntersectionType } from '@nestjs/mapped-types';

import { IdDto, CategorySlugDto } from './base.dto';

export class EditCategoriesDto extends IntersectionType(
  IdDto,
  CategorySlugDto,
) {}

export class EditCategoriesResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the edited category',
  })
  id: number;

  @ApiProperty({
    example: 'electronics',
    description: 'The slug of the edited category',
  })
  slug: string;
}
