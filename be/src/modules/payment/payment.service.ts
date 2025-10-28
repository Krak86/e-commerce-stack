import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrdersService } from '@/modules/orders/orders.service';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { LANGUAGES } from '@/utils/static';
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
  PaymentTranslationEditReqDto,
  PaymentTranslationIdDto,
  PaymentTranslationResDto,
  PaymentWithTranslationResDto,
} from './dto';
import {
  PaymentEntity,
  PaymentMethodEntity,
  PaymentTranslationEntity,
  PaymentWithTranslationEntity,
} from './entities';
import { getPaymentPayload } from './utils';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  // CRUD for payments
  async getPayment(param: PaymentIdDto): Promise<PaymentResDto> {
    const { id } = param;

    const payment = await this.getPaymentById(id);

    return getPaymentPayload(payment);
  }

  async getPayments(): Promise<PaymentResDto[]> {
    const payments = await this.prisma.payments.findMany();

    return payments.map((payment) => getPaymentPayload(payment));
  }

  async addPayment(dto: PaymentAddReqDto): Promise<PaymentResDto> {
    await this.ordersService.getOrderById({ id: dto.order_id });

    await this.getPaymentMethodById(dto.method_id);

    const payment = await this.prisma.payments.create({
      data: {
        ...dto,
      },
    });

    return getPaymentPayload(payment);
  }

  async editPayment(
    param: PaymentIdDto,
    dto: PaymentEditReqDto,
  ): Promise<PaymentResDto> {
    const { id } = param;

    await this.ordersService.getOrderById({ id: dto.order_id });

    await this.getPaymentById(id);

    const payment = await this.prisma.payments.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    return getPaymentPayload(payment);
  }

  async deletePayment(param: PaymentIdDto): Promise<void> {
    const { id } = param;

    await this.getPaymentById(id);

    await this.prisma.payments.delete({
      where: { id },
    });
  }

  // CRUD for payment methods
  async getPaymentMethod(
    param: PaymentMethodIdDto,
  ): Promise<PaymentMethodResDto> {
    const { id } = param;

    const paymentMethod = await this.getPaymentMethodById(id);

    return this.getPaymentMethodPayload(paymentMethod);
  }

  async getPaymentMethods(): Promise<PaymentMethodResDto[]> {
    const paymentMethods = await this.prisma.payment_methods.findMany();

    return paymentMethods.map((method) => this.getPaymentMethodPayload(method));
  }

  async addPaymentMethod(dto: PaymentMethodDto): Promise<PaymentMethodResDto> {
    await this.verifyCodeUniqueness(dto.code);

    const paymentMethod = await this.prisma.payment_methods.create({
      data: {
        ...dto,
      },
    });

    return this.getPaymentMethodPayload(paymentMethod);
  }

  async editPaymentMethod(
    param: PaymentMethodIdDto,
    dto: PaymentMethodDto,
  ): Promise<PaymentMethodResDto> {
    const { id } = param;

    await this.getPaymentMethodById(id);

    const paymentMethod = await this.prisma.payment_methods.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    return this.getPaymentMethodPayload(paymentMethod);
  }

  async deletePaymentMethod(param: PaymentMethodIdDto): Promise<void> {
    const { id } = param;

    await this.getPaymentMethodById(id);

    await this.prisma.payment_methods.delete({
      where: { id },
    });
  }

  // CRUD for payment method translations
  async getPaymentMethodTranslation(
    param: PaymentTranslationIdDto,
  ): Promise<PaymentTranslationResDto> {
    const { id } = param;

    await this.getPaymentMethodTranslationById(id);

    const paymentTranslation =
      await this.prisma.payment_method_translations.findUnique({
        where: { id },
      });

    return this.getPaymentTranslationPayload(paymentTranslation);
  }

  async getPaymentMethodTranslations(): Promise<PaymentTranslationResDto[]> {
    const paymentTranslations =
      await this.prisma.payment_method_translations.findMany();

    return paymentTranslations.map((translation) =>
      this.getPaymentTranslationPayload(translation),
    );
  }

  async addPaymentMethodTranslation(
    dto: PaymentTranslationAddReqDto,
  ): Promise<PaymentTranslationResDto> {
    await this.getPaymentMethodById(dto.payment_method_id);

    await this.verifyUniqueLanguageCode(dto);

    const paymentTranslation =
      await this.prisma.payment_method_translations.create({
        data: {
          ...dto,
        },
      });

    return this.getPaymentTranslationPayload(paymentTranslation);
  }

  async editPaymentMethodTranslation(
    param: PaymentTranslationIdDto,
    dto: PaymentTranslationDto,
  ): Promise<PaymentTranslationResDto> {
    const { id } = param;

    await this.getPaymentMethodTranslationById(id);

    const paymentTranslation =
      await this.prisma.payment_method_translations.update({
        where: { id },
        data: {
          ...dto,
        },
      });

    return this.getPaymentTranslationPayload(paymentTranslation);
  }

  async deletePaymentMethodTranslation(
    param: PaymentTranslationIdDto,
  ): Promise<void> {
    const { id } = param;
    await this.getPaymentMethodTranslationById(id);

    await this.prisma.payment_method_translations.delete({
      where: { id },
    });
  }

  // CRUD for payment methods with translations
  async getPaymentMethodsWithTranslation(
    param: PaymentMethodIdDto,
  ): Promise<PaymentWithTranslationResDto> {
    const { id } = param;

    await this.getPaymentMethodById(id);

    const payment = await this.prisma.payment_methods.findUnique({
      where: { id },
      include: {
        payment_method_translations: {
          select: {
            id: true,
            language_code: true,
            name: true,
            description: true,
            payment_method_id: true,
          },
        },
      },
    });

    return this.getPaymentWithTranslationPayload(payment);
  }

  async getAllPaymentMethodsWithTranslation(): Promise<
    PaymentWithTranslationResDto[]
  > {
    const paymentMethods = await this.prisma.payment_methods.findMany({
      include: {
        payment_method_translations: {
          select: {
            id: true,
            language_code: true,
            name: true,
            description: true,
            payment_method_id: true,
          },
        },
      },
    });

    return paymentMethods?.map((payment) =>
      this.getPaymentWithTranslationPayload(payment),
    );
  }

  async addPaymentMethodWithTranslation(
    dto: AddPaymentWithTranslationResDto,
  ): Promise<PaymentWithTranslationResDto> {
    const { translations, ...rest } = dto;

    this.verifyTranslationsCorrect(translations);
    await this.verifyPaymentMethodTranslationCorrect(translations);
    await this.verifyUniqueCodes(dto.code);

    const paymentMethod = await this.addPaymentMethod(rest);

    const paymentTranslations = await Promise.all(
      translations.map(async (translation) => {
        return this.addPaymentMethodTranslation({
          ...translation,
          payment_method_id: paymentMethod.id,
        });
      }),
    );

    return this.getPaymentWithTranslationPayload({
      ...paymentMethod,
      payment_method_translations: paymentTranslations,
    });
  }

  async editPaymentMethodWithTranslation(
    param: PaymentMethodIdDto,
    dto: AddPaymentWithTranslationResDto,
  ): Promise<PaymentWithTranslationResDto> {
    const { id } = param;
    const { translations, ...rest } = dto;

    this.verifyTranslationsCorrect(translations);
    await this.verifyPaymentMethodTranslationCorrect(translations);
    await this.getPaymentMethodById(id);

    const paymentMethod = await this.editPaymentMethod(param, rest);

    const paymentTranslations = await Promise.all(
      translations.map(async (translation) => {
        return this.editPaymentMethodTranslation(
          { id: translation.id },
          { ...translation, payment_method_id: paymentMethod.id },
        );
      }),
    );

    return this.getPaymentWithTranslationPayload({
      ...paymentMethod,
      payment_method_translations: paymentTranslations,
    });
  }

  async deletePaymentMethodWithTranslation(
    param: PaymentMethodIdDto,
  ): Promise<void> {
    const { id } = param;

    const paymentMethod = await this.getPaymentMethodById(id);

    const translations = await this.prisma.payment_method_translations.findMany(
      {
        where: { payment_method_id: paymentMethod?.id },
      },
    );

    await this.prisma.payment_methods.delete({
      where: { id: paymentMethod?.id },
    });

    await Promise.all(
      translations.map(async (translation) => {
        return this.prisma.payment_method_translations.delete({
          where: { id: translation.id },
        });
      }),
    );
  }

  // AUX methods
  private async getPaymentById(id: number): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payments.findUnique({
      where: { id },
    });

    this.verifyPaymentById(payment?.id);

    return payment;
  }
  private verifyPaymentById(id: number | undefined): boolean {
    if (!id) {
      throw new NotFoundException('Payment not found');
    }

    return !!id;
  }

  private async verifyCodeUniqueness(code: string): Promise<boolean> {
    const existing = await this.prisma.payment_methods.findUnique({
      where: { code },
    });
    if (existing) {
      throw new NotFoundException('Payment method code already exists');
    }

    return !existing;
  }

  private async getPaymentMethodById(
    id: number,
  ): Promise<PaymentMethodEntity | null> {
    const paymentMethod = await this.prisma.payment_methods.findUnique({
      where: { id },
    });

    this.verifyPaymentMethodById(paymentMethod?.id);

    return paymentMethod;
  }

  private verifyPaymentMethodById(id: number | undefined): boolean {
    if (!id) {
      throw new NotFoundException('Payment method not found');
    }

    return !!id;
  }

  private getPaymentMethodPayload(
    paymentMethod: PaymentMethodEntity | null,
  ): PaymentMethodResDto {
    return {
      id: paymentMethod?.id ?? 0,
      code: paymentMethod?.code ?? '',
      is_active: paymentMethod?.is_active ?? true,
    };
  }

  private async getPaymentMethodTranslationById(
    id: number,
  ): Promise<PaymentTranslationEntity | null> {
    const paymentTranslation =
      await this.prisma.payment_method_translations.findUnique({
        where: { id },
      });

    this.verifyPaymentMethodTranslationById(paymentTranslation?.id);

    return paymentTranslation;
  }

  private verifyPaymentMethodTranslationById(id: number | undefined): boolean {
    if (!id) {
      throw new NotFoundException('Payment translation not found');
    }
    return !!id;
  }

  private getPaymentTranslationPayload(
    paymentTranslation: PaymentTranslationEntity | null,
  ): PaymentTranslationResDto {
    return {
      id: paymentTranslation?.id ?? 0,
      language_code: paymentTranslation?.language_code ?? LANGUAGES?.[0],
      name: paymentTranslation?.name ?? '',
      description: paymentTranslation?.description ?? '',
      payment_method_id: paymentTranslation?.payment_method_id ?? 0,
    };
  }

  private getPaymentWithTranslationPayload(
    payment: PaymentWithTranslationEntity | null,
  ): PaymentWithTranslationResDto {
    return {
      id: payment?.id ?? 0,
      code: payment?.code ?? '',
      is_active: payment?.is_active ?? true,
      translations: (payment?.payment_method_translations ?? []).map(
        (translation) => ({
          id: translation.id,
          language_code: translation.language_code ?? LANGUAGES?.[0],
          name: translation.name ?? '',
          description: translation.description ?? '',
          payment_method_id: translation.payment_method_id ?? 0,
        }),
      ),
    };
  }

  private verifyTranslationsCorrect(
    translations: PaymentTranslationAddReqDto[],
  ): boolean {
    if (!Array.isArray(translations) || translations.length !== 2) {
      throw new BadRequestException(
        `Exactly two translations are required: ${LANGUAGES.join(', ')}`,
      );
    }

    const codes = translations?.map(({ language_code }) => language_code);
    const duplicates = codes?.filter(
      (code, index) => codes?.indexOf(code) !== index,
    );

    if (duplicates?.length > 0) {
      throw new BadRequestException(
        `Duplicate language_code(s): ${[...new Set(duplicates)].join(', ')}`,
      );
    }

    const invalid = codes.filter((code) => !LANGUAGES.includes(code));
    if (invalid.length > 0) {
      throw new BadRequestException(
        `Invalid language_code(s): ${invalid.join(', ')}. Only ${LANGUAGES.join(', ')} are allowed.`,
      );
    }

    return true;
  }

  private async verifyUniqueCodes(code: string): Promise<boolean> {
    const codes = await this.getPaymentMethods();
    if (
      codes.find(
        (c) => c.code?.toLowerCase() === code.toLowerCase()?.toLowerCase(),
      )
    ) {
      throw new BadRequestException(
        `The next codes are reserved: ${codes.map((c) => c.code).join(', ')}`,
      );
    }

    return !!codes?.length;
  }

  private async verifyPaymentMethodTranslationCorrect(
    translations: PaymentTranslationEditReqDto[],
  ): Promise<boolean> {
    if (translations?.[0]?.id === translations?.[1]?.id) {
      throw new BadRequestException(
        'Payment Method translation IDs must be different',
      );
    }

    const exists = await Promise.all(
      translations.map(async ({ id }) => {
        const found = await this.getPaymentMethodTranslation({ id });
        if (!found)
          throw new NotFoundException(
            'Payment Method translation does not exist',
          );
        return found;
      }),
    );

    return !!exists?.length;
  }

  private async verifyUniqueLanguageCode(
    dto: PaymentTranslationAddReqDto,
  ): Promise<boolean> {
    const existing = await this.prisma.payment_method_translations.findFirst({
      where: {
        payment_method_id: dto.payment_method_id,
        language_code: dto.language_code,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Translation for language ${dto.language_code} already exists for this payment method`,
      );
    }
    return !!existing;
  }
}
