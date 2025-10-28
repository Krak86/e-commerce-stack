import { Decimal } from '@prisma/client/runtime/library';

export class OrderItemEntity {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_order_time: Decimal;
  variant: string | null;
}
