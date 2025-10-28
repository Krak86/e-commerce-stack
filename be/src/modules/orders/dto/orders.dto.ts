import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';

import { UserIdDto, PaginationDto, OrderStatusDto } from '@/common/dto';
import { PaymentResDto } from '@/modules/payment/dto';
import { OrderItemResDto } from './order-item.dto';

export class OrderItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemResDto)
  order_items: OrderItemResDto[];
}

export class OrderPaymentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentResDto)
  payments: PaymentResDto[];
}

export class OrdersShippingDto {
  @IsArray()
  @ValidateNested({ each: true })
  // @Type(() => any)
  shipping: any[];
}

export class OrdersIdDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}

export class OrdersDto extends IntersectionType(UserIdDto, OrderStatusDto) {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => (value ? Number(value) : 0))
  @Min(1)
  total_amount: number;

  @IsString()
  @IsOptional()
  payment_method?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  shipping_address_id: number;

  @IsString()
  @IsOptional()
  notes: string;
}

export class OrdersResDto extends IntersectionType(
  OrdersIdDto,
  OrdersDto,
  OrderItemsDto,
  OrderPaymentsDto,
  OrdersShippingDto,
) {}

export class OrdersFilterReqDto extends IntersectionType(
  PartialType(UserIdDto),
  PaginationDto,
) {}

export class OrdersEditReqDto extends IntersectionType(
  OrdersDto,
  PartialType(OrderItemsDto),
  PartialType(OrderPaymentsDto),
  PartialType(OrdersShippingDto),
) {}
