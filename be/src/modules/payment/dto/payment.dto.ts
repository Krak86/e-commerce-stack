import { Transform, Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/mapped-types';

import { PAYMENT_CURRENCY, PAYMENT_STATUS } from '@/utils/static';
import type { PaymentStatus } from '@/utils/type';

export class PaymentIdDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}

export class PaymentDto {
  @IsInt()
  @Type(() => Number)
  order_id: number;

  @IsInt()
  @Transform(({ value }) => (value ? Number(value) : 0))
  amount: number;

  @IsString()
  currency: string = PAYMENT_CURRENCY;

  @IsIn(PAYMENT_STATUS, {
    message: `status must be one of: ${PAYMENT_STATUS.join(', ')}`,
  })
  status: PaymentStatus = PAYMENT_STATUS?.[0];

  @IsOptional()
  @IsString()
  transaction_id: string;

  @IsOptional()
  @IsDate()
  paid_at: Date;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  method_id: number;
}

export class PaymentGetReqDto extends PaymentDto {}

export class PaymentResDto extends IntersectionType(PaymentIdDto, PaymentDto) {}

export class PaymentAddReqDto extends PaymentDto {}

export class PaymentEditReqDto extends PaymentDto {}

export class PaymentDeleteReqDto extends PaymentIdDto {}
