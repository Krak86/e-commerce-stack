import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProductsService } from '@/modules/products/products.service';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { UsersRepository } from '@/modules/users/users.repository';
import { FORBIDDEN_TO_UPDATE, ORDER_STATUS } from '@/utils/static';
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
import { OrderItemEntity, OrdersEntity } from './entities';
import { getPaymentPayload } from '@/modules/payment/utils';
import { OrderStatus } from '@/utils/type';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersRepository,
    private productService: ProductsService,
  ) {}

  async getOrderById(param: OrdersIdDto): Promise<OrdersEntity> {
    const { id } = param;

    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: true,
        payments: true,
        shipping: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async getOrder(param: OrdersIdDto): Promise<OrdersResDto> {
    const { id } = param;

    const order = await this.getOrderById({ id });

    return this.getOrderPayload(order);
  }

  async getOrders(dto: OrdersFilterReqDto): Promise<OrdersResDto[]> {
    const { user_id, page = 1, limit = 10 } = dto;

    const skip = page * limit;

    if (user_id) {
      await this.usersService.findUser(user_id);
    }

    const orders = await this.prisma.orders.findMany({
      where: user_id ? { user_id } : undefined,
      skip,
      take: limit,
      include: {
        order_items: true,
        payments: true,
        shipping: true,
      },
    });

    return orders.map((order) => this.getOrderPayload(order));
  }

  async addOrder(dto: OrdersDto): Promise<OrdersResDto> {
    const {
      user_id,
      status,
      total_amount,
      payment_method,
      shipping_address_id,
      notes,
    } = dto;

    await this.usersService.findUser(user_id);

    // TODO: validate shipping_address_id

    const order = await this.prisma.orders.create({
      data: {
        user_id,
        status: status ?? ORDER_STATUS?.[0],
        total_amount,
        payment_method,
        ...(shipping_address_id && {
          shipping_address_id,
        }),
        notes,
      },
    });

    return this.getOrderPayload(order);
  }

  async editOrder(
    param: OrdersIdDto,
    dto: OrdersEditReqDto,
  ): Promise<OrdersResDto> {
    const { id } = param;
    const {
      user_id,
      status,
      total_amount,
      payment_method,
      shipping_address_id,
      notes,
      /*  shipping,
      order_items,
      payments, */
    } = dto;

    await this.getOrderById({ id });

    await this.usersService.findUser(user_id);

    this.verifyStatus(status);

    /*    if (order_items?.length) {
      await this.verifyOrderItemsExist(order_items);

      this.verifyOrderIdAreSame(id, order_items);
    } */

    // TODO: validate shipping_address_id

    const order = await this.prisma.orders.update({
      where: { id },
      data: {
        user_id,
        status,
        total_amount,
        payment_method,
        shipping_address_id,
        notes,
        /*  order_items: order_items ? { set: [], create: order_items } : undefined,
        payments: payments ? { set: [], create: payments } : undefined,
        shipping: shipping ? { set: shipping } : undefined, */
      },
    });

    return this.getOrderPayload(order);
  }

  async deleteOrder(param: OrdersIdDto): Promise<void> {
    const { id } = param;

    await this.getOrderById({ id });

    await this.prisma.orders.delete({
      where: { id },
    });
  }

  async getOrderItem(param: OrdersIdDto): Promise<OrderItemResDto> {
    const { id } = param;

    const orderItem = await this.getOrderItemById(id);

    return this.getOrderItemPayload(orderItem);
  }

  async getOrderItems(dto: OrderItemsFilterReqDto): Promise<OrderItemResDto[]> {
    const { order_id, product_id, page = 1, limit = 10 } = dto;

    if (order_id) {
      await this.getOrderById({ id: order_id });
    }

    if (product_id) {
      await this.productService.verifyProductById(product_id);
    }

    const skip = page * limit;

    const orderItems = await this.prisma.order_items.findMany({
      where: { order_id, product_id },
      skip,
      take: limit,
    });

    return orderItems.map((orderItem) => this.getOrderItemPayload(orderItem));
  }

  async addOrderItem(dto: OrderAddItemResDto): Promise<OrderItemResDto> {
    const { order_id, product_id, quantity, variant, price_at_order_time } =
      dto;

    const orderItem = await this.prisma.order_items.create({
      data: {
        order_id,
        product_id,
        quantity,
        variant,
        price_at_order_time,
      },
    });

    return this.getOrderItemPayload(orderItem);
  }

  async editOrderItem(
    param: OrderItemResDto,
    dto: OrderItemResDto,
  ): Promise<OrderItemResDto> {
    const { id } = param;
    const { order_id, product_id, quantity, variant, price_at_order_time } =
      dto;

    const orderItem = await this.getOrderItemById(id);

    const updatedOrderItem = await this.prisma.order_items.update({
      where: { id: orderItem.id },
      data: {
        order_id,
        product_id,
        quantity,
        variant,
        price_at_order_time,
      },
    });

    return this.getOrderItemPayload(updatedOrderItem);
  }

  async deleteOrderItem(param: OrderItemResDto): Promise<void> {
    const { id } = param;

    await this.getOrderItemById(id);

    await this.prisma.order_items.delete({
      where: { id },
    });
  }

  private getOrderPayload(order: OrdersEntity): OrdersResDto {
    return {
      id: order.id,
      user_id: order.user_id,
      status: order.status ?? ORDER_STATUS?.[0],
      total_amount: order?.total_amount ? Number(order.total_amount) : 0,
      payment_method: order.payment_method ?? '',
      shipping_address_id: order.shipping_address_id ?? 0,
      notes: order.notes ?? '',
      order_items: order?.order_items
        ? order.order_items.map((item) => this.getOrderItemPayload(item))
        : [],
      payments: order.payments
        ? order.payments.map((payment) => getPaymentPayload(payment))
        : [],
      shipping: order.shipping ?? [],
    };
  }

  private async getOrderItemById(id: number): Promise<OrderItemEntity> {
    const orderItem = await this.prisma.order_items.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item with id ${id} not found`);
    }

    return orderItem;
  }

  private getOrderItemPayload(orderItem: OrderItemEntity): OrderItemResDto {
    return {
      id: orderItem.id,
      order_id: orderItem.order_id,
      product_id: orderItem.product_id,
      quantity: orderItem.quantity,
      variant: orderItem?.variant ? String(orderItem.variant) : '',
      price_at_order_time: orderItem?.price_at_order_time
        ? Number(orderItem.price_at_order_time)
        : 0,
    };
  }

  private verifyStatus(status: OrderStatus): boolean {
    if (FORBIDDEN_TO_UPDATE.includes(status)) {
      throw new BadRequestException(
        `The next statuses cannot be updated: ${FORBIDDEN_TO_UPDATE.join(', ')}`,
      );
    }
    return true;
  }

  private async verifyOrderItemsExist(
    orderItems: OrderItemResDto[],
  ): Promise<boolean> {
    // Verify each product in the order items
    for (const item of orderItems) {
      const isValid = await this.productService.verifyProductById(
        item.product_id,
      );
      if (!isValid) {
        throw new BadRequestException('Invalid order items');
      }
    }

    return true;
  }

  private verifyOrderIdAreSame(
    orderId: number,
    orderItems: OrderItemResDto[],
  ): boolean {
    for (const item of orderItems) {
      if (item.order_id !== orderId) {
        throw new BadRequestException('Order ID mismatch');
      }
    }
    return true;
  }
}
