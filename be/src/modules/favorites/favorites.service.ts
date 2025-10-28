import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  AddFavoriteDto,
  GetFavoritesDto,
  GetFavoritesResponseDto,
} from './dto/get-favorites';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavoritesByUser(
    query: GetFavoritesDto,
  ): Promise<GetFavoritesResponseDto[]> {
    const { userId } = query;

    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes('invalid group length')
      ) {
        throw new BadRequestException('User not found');
      }
      throw err;
    }

    const data = await this.prisma.favorites.findMany({
      where: { user_id: userId },
      include: {
        products: true,
      },
    });

    return data.map((item) => ({
      id: item.id ?? 0,
      user_id: item.user_id ?? '',
      product_id: item.product_id ?? 0,
      created_at: item.created_at ?? new Date(),
    }));
  }

  async addFavorite(dto: AddFavoriteDto): Promise<GetFavoritesResponseDto> {
    const { userId, productId } = dto;

    const exists = await this.prisma.favorites.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });
    if (exists) {
      return {
        id: exists.id,
        user_id: exists.user_id,
        product_id: exists.product_id,
        created_at: exists.created_at ?? new Date(),
        exists: true,
      };
    }

    // check if productId is valid
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const favorite = await this.prisma.favorites.create({
      data: {
        user_id: userId,
        product_id: productId,
      },
    });

    return {
      id: favorite.id,
      user_id: favorite.user_id,
      product_id: favorite.product_id,
      created_at: favorite.created_at ?? new Date(),
    };
  }

  async removeFavorite(userId: string, productId: number): Promise<void> {
    try {
      await this.prisma.favorites.delete({
        where: {
          user_id_product_id: {
            user_id: userId,
            product_id: productId,
          },
        },
      });
    } catch (_) {
      throw new NotFoundException('Favorite not found');
    }
  }
}
