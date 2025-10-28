import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  AddCartItemReqDto,
  AddCartItemResDto,
  DeleteCartItemReqDto,
  EditCartItemReqDto,
  EditCartItemResDto,
  GetCartItemsReqDto,
  GetCartItemsResDto,
} from './dto';

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) {}

  async getCartItems(dto: GetCartItemsReqDto): Promise<GetCartItemsResDto> {
    const { user_id } = dto;

    const items = await this.prisma.cart_items.findMany({
      where: { user_id },
    });

    return (
      items?.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        quantity: item.quantity,
        variant: item?.variant ?? 'default',
        price_snapshot: item?.price_snapshot ? Number(item.price_snapshot) : 0,
      })) || []
    );
  }

  async addCartItem(dto: AddCartItemReqDto): Promise<AddCartItemResDto> {
    const { user_id, product_id, quantity, price_snapshot, variant } = dto;

    await this.verifyCartItemOwnership(user_id, product_id);

    const cartItem = await this.prisma.cart_items.create({
      data: {
        user_id,
        product_id,
        quantity,
        variant,
        price_snapshot,
      },
    });

    return {
      id: cartItem.id,
      user_id: cartItem.user_id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      variant: cartItem.variant || 'default',
      price_snapshot: cartItem.price_snapshot
        ? Number(cartItem.price_snapshot)
        : 0,
    };
  }

  async editCartItem(dto: EditCartItemReqDto): Promise<EditCartItemResDto> {
    const { id, user_id, product_id, quantity, price_snapshot, variant } = dto;

    await this.verifyCartItemExistence(id);
    await this.verifyCartItemOwnership(user_id, product_id, quantity);

    const cartItem = await this.prisma.cart_items.update({
      where: { id },
      data: {
        user_id,
        product_id,
        quantity,
        variant,
        price_snapshot,
      },
    });

    return {
      id: cartItem.id,
      user_id: cartItem.user_id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      variant: cartItem.variant || 'default',
      price_snapshot: cartItem.price_snapshot
        ? Number(cartItem.price_snapshot)
        : 0,
    };
  }

  async deleteCartItem(dto: DeleteCartItemReqDto): Promise<void> {
    const { id } = dto;

    await this.verifyCartItemExistence(id);

    await this.prisma.cart_items.delete({
      where: { id },
    });
  }

  private async verifyCartItemExistence(id: number): Promise<boolean> {
    const existing = await this.prisma.cart_items.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new BadRequestException('Cart item not found');
    }

    return !!existing;
  }

  private async verifyCartItemOwnership(
    user_id: string,
    product_id: number,
    quantity: number = 0,
  ): Promise<boolean> {
    const existing =
      quantity > 0
        ? await this.prisma.cart_items.findFirst({
            where: { user_id, product_id, quantity },
          })
        : await this.prisma.cart_items.findFirst({
            where: { user_id, product_id },
          });

    if (existing) {
      throw new BadRequestException(
        'Cart item for this user and product already exists',
      );
    }
    return !!existing;
  }
}
