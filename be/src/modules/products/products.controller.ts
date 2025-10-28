import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LanguageCodeDto } from '@/modules/categories/dto';
import { PublicCache, RedisCache } from '@/common/decorators';
import {
  GetProductsDto,
  KeyRangeResponseDto,
  SearchProductsDto,
  KeyRangeQueryDto,
  GetProductsResponseDto,
  GetProductDto,
} from './dto';
import { ProductsService } from './products.service';

@RedisCache()
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @PublicCache()
  @Get('key-range/:key')
  async getKeyRange(
    @Param() dto: KeyRangeQueryDto,
  ): Promise<KeyRangeResponseDto> {
    return this.productsService.getKeyRange(dto);
  }

  @PublicCache()
  @Get()
  async getProducts(
    @Query() dto: GetProductsDto,
  ): Promise<GetProductsResponseDto[]> {
    return this.productsService.getProducts(dto);
  }

  @PublicCache()
  @Get('search')
  async searchProducts(
    @Query() dto: SearchProductsDto,
  ): Promise<GetProductsResponseDto[]> {
    return this.productsService.searchProducts(dto);
  }

  @PublicCache()
  @Get(':id')
  async getProductById(
    @Query() query: LanguageCodeDto,
    @Param() dto: GetProductDto,
  ): Promise<any> {
    return this.productsService.getProductById(dto, query);
  }
}
