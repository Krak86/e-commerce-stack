import { $Enums } from '@prisma/client/index-browser';

export class PaymentTranslationEntity {
  id: number;
  language_code: $Enums.language_code;
  name: string;
  description: string | null;
  payment_method_id: number;
}
