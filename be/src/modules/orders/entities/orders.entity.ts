import { $Enums } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentEntity } from '@/modules/payment/entities';
import { OrderItemEntity } from './order-item.entity';

export class OrdersEntity {
  id: number;
  created_at: Date | null;
  user_id: string;
  updated_at: Date | null;
  status: $Enums.order_status;
  total_amount: Decimal;
  payment_method: string | null;
  shipping_address_id: number | null;
  notes: string | null;
  order_items?: OrderItemEntity[];
  payments?: PaymentEntity[];
  shipping?: any[];
}
