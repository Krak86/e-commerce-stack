import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Roles, PrivateCache } from '@/common/decorators';
import { Role } from '@/utils/type';
import { AuthGuard, RolesGuard } from '@/common/guards';
import { PaymentService } from './payment.service';
import {
  AddPaymentWithTranslationResDto,
  PaymentAddReqDto,
  PaymentEditReqDto,
  PaymentIdDto,
  PaymentMethodDto,
  PaymentMethodIdDto,
  PaymentMethodResDto,
  PaymentResDto,
  PaymentTranslationAddReqDto,
  PaymentTranslationDto,
  PaymentTranslationIdDto,
  PaymentTranslationResDto,
  PaymentWithTranslationResDto,
} from './dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.USER)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @PrivateCache()
  @Get('method/:id')
  async getPaymentMethod(
    @Param() param: PaymentMethodIdDto,
  ): Promise<PaymentMethodResDto> {
    return this.paymentService.getPaymentMethod(param);
  }

  @PrivateCache()
  @Get('method')
  async getPaymentMethods(): Promise<PaymentMethodResDto[]> {
    return this.paymentService.getPaymentMethods();
  }

  @Post('method')
  async addPaymentMethod(
    @Body() dto: PaymentMethodDto,
  ): Promise<PaymentMethodResDto> {
    return this.paymentService.addPaymentMethod(dto);
  }

  @Patch('method/:id')
  async editPaymentMethod(
    @Param() param: PaymentMethodIdDto,
    @Body() dto: PaymentMethodDto,
  ): Promise<PaymentMethodResDto> {
    return this.paymentService.editPaymentMethod(param, dto);
  }

  @Delete('method/:id')
  async deletePaymentMethod(@Param() param: PaymentMethodIdDto): Promise<void> {
    return this.paymentService.deletePaymentMethod(param);
  }

  @PrivateCache()
  @Get('translation/:id')
  async getPaymentMethodTranslation(
    @Param() param: PaymentTranslationIdDto,
  ): Promise<PaymentTranslationResDto> {
    return this.paymentService.getPaymentMethodTranslation(param);
  }

  @PrivateCache()
  @Get('translation')
  async getPaymentMethodTranslations(): Promise<PaymentTranslationResDto[]> {
    return this.paymentService.getPaymentMethodTranslations();
  }

  @Post('translation')
  async addPaymentMethodTranslation(
    @Body() dto: PaymentTranslationAddReqDto,
  ): Promise<PaymentTranslationResDto> {
    return this.paymentService.addPaymentMethodTranslation(dto);
  }

  @Patch('translation/:id')
  async editPaymentMethodTranslation(
    @Param() param: PaymentTranslationIdDto,
    @Body() dto: PaymentTranslationDto,
  ): Promise<PaymentTranslationResDto> {
    return this.paymentService.editPaymentMethodTranslation(param, dto);
  }

  @Delete('translation/:id')
  async deletePaymentMethodTranslation(
    @Param() param: PaymentTranslationIdDto,
  ): Promise<void> {
    return this.paymentService.deletePaymentMethodTranslation(param);
  }

  @PrivateCache()
  @Get('with-translation/:id')
  async getPaymentMethodsWithTranslation(
    @Param() param: PaymentMethodIdDto,
  ): Promise<PaymentWithTranslationResDto> {
    return this.paymentService.getPaymentMethodsWithTranslation(param);
  }

  @PrivateCache()
  @Get('with-translation')
  async getAllPaymentMethodsWithTranslation(): Promise<
    PaymentWithTranslationResDto[]
  > {
    return this.paymentService.getAllPaymentMethodsWithTranslation();
  }

  @Post('with-translation')
  async addPaymentMethodWithTranslation(
    @Body() dto: AddPaymentWithTranslationResDto,
  ): Promise<PaymentWithTranslationResDto> {
    return this.paymentService.addPaymentMethodWithTranslation(dto);
  }

  @Patch('with-translation/:id')
  async editPaymentMethodWithTranslation(
    @Param() param: PaymentMethodIdDto,
    @Body() dto: AddPaymentWithTranslationResDto,
  ): Promise<PaymentWithTranslationResDto> {
    return this.paymentService.editPaymentMethodWithTranslation(param, dto);
  }

  @Delete('with-translation/:id')
  async deletePaymentMethodWithTranslation(
    @Param() param: PaymentMethodIdDto,
  ): Promise<void> {
    return this.paymentService.deletePaymentMethodWithTranslation(param);
  }

  @PrivateCache()
  @Get(':id')
  async getPayment(@Param() param: PaymentIdDto): Promise<PaymentResDto> {
    return this.paymentService.getPayment(param);
  }

  @PrivateCache()
  @Get()
  async getPayments(): Promise<PaymentResDto[]> {
    return this.paymentService.getPayments();
  }

  @Post()
  async addPayment(@Body() dto: PaymentAddReqDto): Promise<PaymentResDto> {
    return this.paymentService.addPayment(dto);
  }

  @Patch(':id')
  async editPayment(
    @Param() param: PaymentIdDto,
    @Body() dto: PaymentEditReqDto,
  ): Promise<PaymentResDto> {
    return this.paymentService.editPayment(param, dto);
  }

  @Delete(':id')
  async deletePayment(@Param() param: PaymentIdDto): Promise<void> {
    return this.paymentService.deletePayment(param);
  }
}
