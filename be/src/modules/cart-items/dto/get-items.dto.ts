import { IntersectionType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UserIDDto {
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  @IsString()
  @IsNotEmpty({ message: 'userId is required' })
  user_id: string;
}

export class CartItemIdDto {
  @IsNotEmpty()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  id: number;
}

export class CartItemDto extends IntersectionType(UserIDDto) {
  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  variant: string;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 0))
  price_snapshot: number;
}

export class GetCartItemsReqDto extends IntersectionType(UserIDDto) {}

export class GetCartItemsResDto extends Array<CartItemDto> {}

export class AddCartItemReqDto extends CartItemDto {}

export class AddCartItemResDto extends IntersectionType(
  CartItemIdDto,
  CartItemDto,
) {}

export class EditCartItemReqDto extends IntersectionType(
  CartItemIdDto,
  CartItemDto,
) {}

export class EditCartItemResDto extends IntersectionType(
  CartItemIdDto,
  CartItemDto,
) {}

export class DeleteCartItemReqDto extends CartItemIdDto {}
