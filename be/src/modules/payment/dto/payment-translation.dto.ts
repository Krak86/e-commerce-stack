import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/mapped-types';

import { LANGUAGES } from '@/utils/static';

export class LangualeCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(LANGUAGES as readonly string[], {
    message: `language must be one of: ${LANGUAGES.join(', ')}`,
  })
  language_code = LANGUAGES?.[0];
}

export class PaymentTranslationIdDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}

export class PaymentTranslationDto {
  @IsInt()
  @Type(() => Number)
  payment_method_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class PaymentTranslationAddReqDto extends IntersectionType(
  PaymentTranslationDto,
  LangualeCodeDto,
) {}

export class PaymentTranslationResDto extends IntersectionType(
  PaymentTranslationIdDto,
  PaymentTranslationDto,
  LangualeCodeDto,
) {}

export class PaymentTranslationEditReqDto extends IntersectionType(
  PaymentTranslationIdDto,
  PaymentTranslationDto,
  LangualeCodeDto,
) {}
