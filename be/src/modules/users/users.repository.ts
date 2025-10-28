import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';
import { AddDto, AddResponseDto, AddWithHashResponseDto, EditDto } from './dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AddWithHashResponseDto | null> {
    const userRaw = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!userRaw) {
      return null;
    }

    return {
      id: userRaw?.id ?? '',
      email: userRaw?.email ?? '',
      name: userRaw?.name ?? 'User',
      role: userRaw?.role ?? 'user',
      avatar_url: userRaw?.avatar_url ?? '',
      password_hash: userRaw?.password_hash ?? '',
    };
  }

  async findById(id: string): Promise<AddWithHashResponseDto | null> {
    const userRaw = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!userRaw) {
      return null;
    }

    return {
      id: userRaw?.id ?? '',
      email: userRaw?.email ?? '',
      name: userRaw?.name ?? 'User',
      role: userRaw?.role ?? 'user',
      avatar_url: userRaw?.avatar_url ?? '',
      password_hash: userRaw?.password_hash ?? '',
    };
  }

  async findUser(id: string): Promise<AddWithHashResponseDto> {
    const userRaw = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!userRaw) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return {
      id: userRaw?.id ?? '',
      email: userRaw?.email ?? '',
      name: userRaw?.name ?? 'User',
      role: userRaw?.role ?? 'user',
      avatar_url: userRaw?.avatar_url ?? '',
      password_hash: userRaw?.password_hash ?? '',
    };
  }

  async createUser(dto: AddDto): Promise<AddResponseDto> {
    const { email, password_hash, name, role } = dto;

    const userRaw = await this.prisma.users.create({
      data: {
        email: email,
        password_hash,
        name: name,
        role: role ?? 'user',
      },
    });

    return {
      id: userRaw.id,
      email: userRaw.email,
      name: userRaw.name ?? 'User',
      role: userRaw.role ?? 'user',
      avatar_url: userRaw.avatar_url ?? null,
    };
  }

  async allUsers(): Promise<AddResponseDto[]> {
    const users = await this.prisma.users.findMany();

    return (
      users?.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name ?? '',
        avatar_url: user.avatar_url,
        role: user.role as string,
      })) || []
    );
  }

  async updateUser(dto: EditDto): Promise<AddResponseDto> {
    const { id, name, role, password_hash } = dto;

    const userRaw = await this.prisma.users.update({
      where: { id },
      data: {
        name,
        role,
        password_hash,
      },
    });

    return {
      id: userRaw.id,
      email: userRaw.email,
      name: userRaw.name ?? 'User',
      role: userRaw.role ?? 'user',
      avatar_url: userRaw.avatar_url ?? null,
    };
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.users.delete({
      where: { id },
    });
  }

  private mapToResponse(user: AddResponseDto): AddResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? 'User',
      role: user.role ?? 'user',
      avatar_url: user.avatar_url ?? null,
    };
  }
}
