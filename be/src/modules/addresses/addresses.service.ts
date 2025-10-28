import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  AddAddressReqDto,
  AddAddressResDto,
  AddressIdDto,
  DeleteAddressReqDto,
  EditAddressReqDto,
  EditAddressResDto,
  GetAddressesReqDto,
  GetAddressesResDto,
  GetAddressReqDto,
  GetAddressResDto,
} from './dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async getAddressById(dto: GetAddressReqDto): Promise<GetAddressResDto> {
    const { id } = dto;

    await this.verifyAddressExists(id);

    const address = await this.prisma.addresses.findUnique({
      where: {
        id,
      },
    });

    return {
      id: address?.id ?? 0,
      user_id: address?.user_id ?? '',
      full_name: address?.full_name ?? '',
      phone: address?.phone ?? '',
      country: address?.country ?? '',
      city: address?.city ?? '',
      postal_code: address?.postal_code ?? '',
      street: address?.street ?? '',
      house: address?.house ?? '',
      apartment: address?.apartment ?? '',
      is_default: address?.is_default ?? false,
      created_at: (address?.created_at as Date) ?? new Date(0),
      updated_at: (address?.updated_at as Date) ?? new Date(0),
    };
  }

  async getAddresses(dto: GetAddressesReqDto): Promise<GetAddressesResDto[]> {
    const { user_id, id } = dto;

    if (user_id) {
      await this.verifyUserExists(user_id);
    }
    if (id) {
      await this.verifyAddressExists(id);
    }

    const addresses = await this.prisma.addresses.findMany({
      where: {
        ...(user_id && { user_id }),
        ...(id && { id }),
      },
      orderBy: { id: 'asc' },
    });

    return addresses.map((address) => ({
      id: address?.id ?? 0,
      user_id: address?.user_id ?? '',
      full_name: address?.full_name ?? '',
      phone: address?.phone ?? '',
      country: address?.country ?? '',
      city: address?.city ?? '',
      postal_code: address?.postal_code ?? '',
      street: address?.street ?? '',
      house: address?.house ?? '',
      apartment: address?.apartment ?? '',
      is_default: address?.is_default ?? false,
    }));
  }

  async addAddress(dto: AddAddressReqDto): Promise<AddAddressResDto> {
    const { user_id, ...addressData } = dto;

    await this.verifyUserExists(user_id);

    try {
      const address = await this.prisma.addresses.create({
        data: {
          user_id,
          ...addressData,
        },
      });

      await this.verifyAddressExists(address?.id);

      return {
        id: address.id,
        user_id: address.user_id,
        full_name: address.full_name,
        phone: address.phone ?? '',
        country: address.country,
        city: address.city,
        postal_code: address.postal_code ?? '',
        street: address.street,
        house: address.house ?? '',
        apartment: address.apartment ?? '',
        is_default: address.is_default ?? false,
      };
    } catch (_) {
      throw new BadRequestException('Failed to create address');
    }
  }

  async editAddress(
    dto: EditAddressReqDto,
    param: AddressIdDto,
  ): Promise<EditAddressResDto> {
    const { id } = param;
    const { user_id, ...addressData } = dto;

    await this.verifyUserExists(user_id);
    await this.verifyAddressExists(id);

    try {
      const address = await this.prisma.addresses.update({
        where: { id },
        data: {
          ...addressData,
        },
      });

      await this.verifyAddressExists(address?.id);

      return {
        id: address.id,
        user_id: address.user_id,
        full_name: address.full_name,
        phone: address.phone ?? '',
        country: address.country,
        city: address.city,
        postal_code: address.postal_code ?? '',
        street: address.street,
        house: address.house ?? '',
        apartment: address.apartment ?? '',
        is_default: address.is_default ?? false,
        created_at: (address?.created_at as Date) ?? new Date(0),
        updated_at: (address?.updated_at as Date) ?? new Date(0),
      };
    } catch (_) {
      throw new BadRequestException('Failed to update address');
    }
  }

  async deleteAddress(dto: DeleteAddressReqDto): Promise<void> {
    const { id } = dto;

    await this.verifyAddressExists(id);

    try {
      await this.prisma.addresses.delete({
        where: { id },
      });
    } catch (_) {
      throw new BadRequestException('Failed to delete address');
    }
  }

  async verifyUserExists(user_id: string): Promise<boolean> {
    const user = await this.prisma.users.findUnique({
      where: { id: user_id },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return !!user;
  }

  async verifyAddressExists(id: number): Promise<boolean> {
    const address = await this.prisma.addresses.findUnique({
      where: { id },
    });
    if (!address) {
      throw new BadRequestException('Address not found');
    }

    return !!address;
  }
}
