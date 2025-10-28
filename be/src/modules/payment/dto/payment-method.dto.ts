import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IntersectionType } from '@nestjs/mapped-types';

export class PaymentMethodIdDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}

export class PaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_active: boolean = true;
}

export class PaymentMethodResDto extends IntersectionType(
  PaymentMethodIdDto,
  PaymentMethodDto,
) {}
