import { PaymentMethodEntity } from './payment-method.entity';
import { PaymentTranslationEntity } from './payment-translation.entity';

export class PaymentWithTranslationEntity extends PaymentMethodEntity {
  payment_method_translations: PaymentTranslationEntity[];
}
