import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { ALLOWED_KEYS } from '@/utils/static';
import type { KeyRange } from '@/utils/type';

/**
 * DTO for key-range input (path param)
 * @description The key to get range for (price, stock)
 */
export class KeyRangeQueryDto {
  @ApiProperty({
    description: `The key to get range for ${ALLOWED_KEYS.join(', ')}`,
    enum: ALLOWED_KEYS,
    example: 'price',
  })
  @IsIn(ALLOWED_KEYS as readonly string[], {
    message: `orderBy must be one of: ${ALLOWED_KEYS.join(', ')}`,
  })
  key: KeyRange;
}

/**
 * DTO for key-range output
 * @description Returns the minimum and maximum value for a numeric key (price, stock) in products.
 */
export class KeyRangeResponseDto {
  @ApiProperty({ description: 'Minimum value for the key', example: 0 })
  min: number;

  @ApiProperty({ description: 'Maximum value for the key', example: 1000 })
  max: number;
}
