import { IntersectionType } from '@nestjs/mapped-types';

import { PaymentMethodDto, PaymentMethodIdDto } from './payment-method.dto';
import {
  LangualeCodeDto,
  PaymentTranslationDto,
  PaymentTranslationIdDto,
  PaymentTranslationResDto,
} from './payment-translation.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentWithTranslationResDto extends IntersectionType(
  PaymentMethodIdDto,
  PaymentMethodDto,
) {
  translations: PaymentTranslationResDto[];
}

export class TranslationDto extends IntersectionType(
  PaymentTranslationIdDto,
  PaymentTranslationDto,
  LangualeCodeDto,
) {}

export class AddPaymentWithTranslationResDto extends PaymentMethodDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
