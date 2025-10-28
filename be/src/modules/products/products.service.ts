import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

import { ALLOWED_KEYS, ASCENDING } from '@/utils/static';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  GetProductDto,
  GetProductsDto,
  GetProductsResponseDto,
  KeyRangeQueryDto,
  KeyRangeResponseDto,
  SearchProductsDto,
} from './dto';
import { LanguageCodeDto } from '@/modules/categories/dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProductById(
    dto: GetProductDto,
    query: LanguageCodeDto,
  ): Promise<any> {
    const { id } = dto;
    const { language_code } = query;

    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        product_translations: {
          where: { language_code },
          select: { name: true, description: true },
        },
        product_images: {
          where: { is_primary: true },
          select: { image_url: true },
        },
        categories: {
          include: {
            category_translations: {
              where: { language_code },
              select: { name: true },
            },
          },
        },
      },
    });

    if (!product) {
      throw new BadRequestException(`Product with id ${id} not found`);
    }

    return {
      // ...product,
      id: product.id,
      slug: product.slug,
      name: product.product_translations?.[0]?.name ?? null,
      description: product.product_translations?.[0]?.description ?? null,
      image: product.product_images?.[0]?.image_url ?? null,
      price: product.price,
      stock: product.stock ?? 0,
      category: {
        slug: product.categories?.slug ?? null,
        name: product.categories?.category_translations?.[0]?.name ?? null,
      },
    };
  }

  async getProducts(dto: GetProductsDto): Promise<GetProductsResponseDto[]> {
    const { language_code, page = 0, limit = 10, category } = dto;

    const skip = page * limit;

    const products = await this.prisma.products.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
      where: category
        ? {
            categories: {
              slug: category,
            },
          }
        : {},
      include: {
        product_translations: {
          where: { language_code },
          select: { name: true, description: true },
        },
        product_images: {
          where: { is_primary: true },
          select: { image_url: true },
        },
        categories: {
          include: {
            category_translations: {
              where: { language_code },
              select: { name: true },
            },
          },
        },
      },
    });

    // normalize the response to include only one translation and one image
    return products.map((p) => ({
      id: p.id,
      slug: p.slug,
      price: Number(p.price),
      stock: p.stock ?? 0,
      name: p.product_translations?.[0]?.name ?? null,
      description: p.product_translations?.[0]?.description ?? null,
      image: p.product_images?.[0]?.image_url ?? null,
      category: {
        slug: p.categories?.slug ?? null,
        name: p.categories?.category_translations?.[0]?.name ?? null,
      },
    }));
  }

  async searchProducts(
    dto: SearchProductsDto,
  ): Promise<GetProductsResponseDto[]> {
    const {
      text,
      language_code,
      category,
      minPrice,
      maxPrice,
      inStock,
      page = 0,
      limit = 10,
      orderBy = ASCENDING?.[0],
    } = dto;

    const skip = page * limit;

    const products = await this.prisma.products.findMany({
      skip,
      take: limit,
      orderBy: { id: orderBy },
      where: {
        ...(text && {
          OR: [
            {
              product_translations: {
                some: { name: { contains: text, mode: 'insensitive' } },
              },
            },
            {
              product_translations: {
                some: { description: { contains: text, mode: 'insensitive' } },
              },
            },
          ],
        }),
        ...(language_code && {
          product_translations: { some: { language_code } },
        }),
        ...(category
          ? {
              categories: {
                slug: category,
              },
            }
          : {}),
        ...(minPrice && { price: { gte: minPrice } }),
        ...(maxPrice && { price: { lte: maxPrice } }),
        ...(inStock !== undefined && { stock: inStock ? { gt: 0 } : 0 }),
      },
      include: {
        product_translations: {
          where: language_code ? { language_code } : undefined,
          select: { name: true, description: true },
        },
        product_images: {
          where: { is_primary: true },
          select: { image_url: true },
        },
        categories: {
          include: {
            category_translations: {
              where: language_code
                ? { language_code: language_code }
                : undefined,
              select: { name: true },
            },
          },
        },
      },
    });

    // normalize the response to include only one translation and one image
    return products.map((p) => ({
      id: p.id,
      slug: p.slug,
      price: Number(p.price),
      stock: p.stock ?? 0,
      name: p.product_translations?.[0]?.name ?? null,
      description: p.product_translations?.[0]?.description ?? null,
      image: p.product_images?.[0]?.image_url ?? null,
      category: {
        slug: p.categories?.slug ?? null,
        name: p.categories?.category_translations?.[0]?.name ?? null,
      },
    }));
  }

  async getKeyRange(dto: KeyRangeQueryDto): Promise<KeyRangeResponseDto> {
    const { key } = dto;

    if (!ALLOWED_KEYS.includes(key)) {
      throw new BadRequestException(
        `Key must be one of: ${ALLOWED_KEYS.join(', ')}`,
      );
    }
    const [min, max] = await Promise.all([
      this.prisma.products.aggregate({ _min: { [key]: true } }),
      this.prisma.products.aggregate({ _max: { [key]: true } }),
    ]);
    return {
      min: min._min[key] ?? 0,
      max: max._max[key] ?? 0,
    };
  }

  async verifyProductById(id: number): Promise<boolean> {
    const product = await this.prisma.products.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return !!product;
  }
}
