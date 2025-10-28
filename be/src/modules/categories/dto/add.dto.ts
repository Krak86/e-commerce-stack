import { ApiProperty } from '@nestjs/swagger';

import { CategorySlugDto } from './base.dto';
// import { IntersectionType } from '@nestjs/mapped-types';

export class AddCategoryDto extends CategorySlugDto {}

export class AddCategoryResponseDto {
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
}
