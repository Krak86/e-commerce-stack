import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsString,
  IsIn,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { LANGUAGES, ORDER_STATUS, PAYMENT_STATUS } from '@/utils/static';
import type { OrderStatus, PaymentStatus } from '@/utils/type';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 0,
    default: 0,
  })
  @IsInt({ message: 'page must be an integer' })
  @Type(() => Number)
  @Min(0, { message: 'page must be >= 0' })
  @IsOptional()
  page: number = 0;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsInt({ message: 'limit must be an integer' })
  @Type(() => Number)
  @Min(1, { message: 'limit must be >= 1' })
  @Max(100, { message: 'limit must be <= 100' })
  @IsOptional()
  limit: number = 10;
}

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

export class UserIdDto {
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  @IsString()
  @IsNotEmpty({ message: 'userId is required' })
  user_id: string;
}

export class PaymentStatusDto {
  @IsIn(PAYMENT_STATUS, {
    message: `status must be one of: ${PAYMENT_STATUS.join(', ')}`,
  })
  status: PaymentStatus = PAYMENT_STATUS?.[0];
}

export class OrderStatusDto {
  @IsIn(ORDER_STATUS, {
    message: `status must be one of: ${ORDER_STATUS.join(', ')}`,
  })
  status: OrderStatus = ORDER_STATUS?.[0];
}
