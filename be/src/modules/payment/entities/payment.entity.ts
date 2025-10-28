import { Decimal } from '@prisma/client/runtime/library';
import { $Enums } from '@prisma/client/index-browser';

export class PaymentEntity {
  id: number;
  order_id: number;
  amount: Decimal;
  currency: string;
  status: $Enums.payment_status;
  transaction_id: string | null;
  paid_at: Date | null;
  created_at: Date | null;
  method_id: number | null;
}
