import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetFavoritesDto {
  @ApiProperty({
    description: 'User ID',
  })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  userId: string;
}

export class AddFavoriteDto {
  @ApiProperty({
    description: 'User ID',
  })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  userId: string;

  @ApiProperty({
    description: 'Product ID',
  })
  @IsNumber()
  @Type(() => Number)
  productId: number;
}

export class GetFavoritesResponseDto {
  @ApiProperty({ example: 1, description: 'Favorite ID' })
  id: number;

  @ApiProperty({ example: 'user-uuid', description: 'User ID' })
  user_id: string;

  @ApiProperty({ example: 1, description: 'Product ID' })
  product_id: number;

  @ApiProperty({
    example: '2025-10-06T16:12:16.061Z',
    description: 'Created at',
  })
  created_at: Date;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the favorite already exists',
    required: false,
  })
  exists?: boolean;
}
