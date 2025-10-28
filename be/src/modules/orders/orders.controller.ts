import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard, RolesGuard } from '@/common/guards';
import { Role } from '@/utils/type';
import { PrivateCache, Roles } from '@/common/decorators';
import { OrdersService } from './orders.service';
import {
  OrderAddItemResDto,
  OrderItemResDto,
  OrderItemsFilterReqDto,
  OrdersDto,
  OrdersEditReqDto,
  OrdersFilterReqDto,
  OrdersIdDto,
  OrdersResDto,
} from './dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @PrivateCache()
  @Get('items/:id')
  async getOrderItem(@Param() param: OrdersIdDto): Promise<OrderItemResDto> {
    return this.ordersService.getOrderItem(param);
  }

  @PrivateCache()
  @Get('items')
  async getOrderItems(
    @Query() dto: OrderItemsFilterReqDto,
  ): Promise<OrderItemResDto[]> {
    return this.ordersService.getOrderItems(dto);
  }

  @Post('items')
  async addOrderItem(
    @Body() dto: OrderAddItemResDto,
  ): Promise<OrderItemResDto> {
    return this.ordersService.addOrderItem(dto);
  }

  @Patch('items/:id')
  async editOrderItem(
    @Param() param: OrderItemResDto,
    @Body() dto: OrderItemResDto,
  ): Promise<OrderItemResDto> {
    return this.ordersService.editOrderItem(param, dto);
  }

  @Delete('items/:id')
  async deleteOrderItem(@Param() param: OrderItemResDto): Promise<void> {
    return this.ordersService.deleteOrderItem(param);
  }

  @PrivateCache()
  @Get(':id')
  async getOrder(@Param() param: OrdersIdDto): Promise<OrdersResDto> {
    return this.ordersService.getOrder(param);
  }

  @PrivateCache()
  @Get()
  async getOrders(@Query() dto: OrdersFilterReqDto): Promise<OrdersResDto[]> {
    return this.ordersService.getOrders(dto);
  }

  @Post()
  async addOrder(@Body() dto: OrdersDto): Promise<OrdersResDto> {
    return this.ordersService.addOrder(dto);
  }

  @Patch(':id')
  async editOrder(
    @Param() param: OrdersIdDto,
    @Body() dto: OrdersEditReqDto,
  ): Promise<OrdersResDto> {
    return this.ordersService.editOrder(param, dto);
  }

  @Delete(':id')
  async deleteOrder(@Param() param: OrdersIdDto): Promise<void> {
    return this.ordersService.deleteOrder(param);
  }
}
