import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { PaginationDto } from '@/common/dto';

export class OrderItemIdDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}

export class OrderProductIdDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  product_id: number;
}

export class OrdersItemOrderIdDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  order_id: number;
}

export class OrderItemDto extends IntersectionType(
  OrderProductIdDto,
  OrdersItemOrderIdDto,
) {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => (value ? Number(value) : 0))
  price_at_order_time: number;

  @IsOptional()
  @IsString()
  variant: string;
}

export class OrderItemResDto extends IntersectionType(
  OrderItemIdDto,
  OrderItemDto,
) {}

export class OrderAddItemResDto extends IntersectionType(OrderItemDto) {}

export class OrderItemsFilterReqDto extends IntersectionType(
  PartialType(PaginationDto),
  PartialType(OrderProductIdDto),
  PartialType(OrdersItemOrderIdDto),
) {}
