import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PrivateCache, Roles } from '@/common/decorators';
import { Role } from '@/utils/type';
import { AuthGuard, RolesGuard } from '@/common/guards';
import { CartItemsService } from './cart-items.service';
import {
  AddCartItemReqDto,
  AddCartItemResDto,
  DeleteCartItemReqDto,
  EditCartItemReqDto,
  EditCartItemResDto,
  GetCartItemsReqDto,
  GetCartItemsResDto,
} from './dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN)
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @PrivateCache()
  @Get()
  async getCartItems(
    @Query() dto: GetCartItemsReqDto,
  ): Promise<GetCartItemsResDto> {
    return this.cartItemsService.getCartItems(dto);
  }

  @Post()
  async addCartItem(
    @Body() dto: AddCartItemReqDto,
  ): Promise<AddCartItemResDto> {
    return this.cartItemsService.addCartItem(dto);
  }

  @Patch()
  async editCartItem(
    @Body() dto: EditCartItemReqDto,
  ): Promise<EditCartItemResDto> {
    return this.cartItemsService.editCartItem(dto);
  }

  @Delete()
  async deleteCartItem(@Body() dto: DeleteCartItemReqDto): Promise<void> {
    return this.cartItemsService.deleteCartItem(dto);
  }
}
