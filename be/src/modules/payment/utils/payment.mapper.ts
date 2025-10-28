import { PAYMENT_STATUS } from '@/utils/static';
import { PaymentEntity } from '../entities';
import { PaymentResDto } from '../dto';

export function getPaymentPayload(
  payment: PaymentEntity | null,
): PaymentResDto {
  return {
    id: payment?.id ?? 0,
    order_id: payment?.order_id ?? 0,
    amount: payment?.amount ? Number(payment.amount) : 0,
    currency: payment?.currency ?? '',
    status: payment?.status ?? PAYMENT_STATUS[0],
    transaction_id: payment?.transaction_id ?? '',
    paid_at: payment?.paid_at ?? new Date(),
    method_id: payment?.method_id ? Number(payment.method_id) : 0,
  };
}
