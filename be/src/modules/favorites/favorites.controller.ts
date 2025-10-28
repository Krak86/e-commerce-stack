import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Role } from '@/utils/type';
import { PrivateCache, Roles } from '@/common/decorators';
import { AuthGuard, RolesGuard } from '@/common/guards';
import {
  AddFavoriteDto,
  GetFavoritesDto,
  GetFavoritesResponseDto,
} from './dto/get-favorites';
import { FavoritesService } from './favorites.service';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @PrivateCache()
  @Get()
  async getFavorites(
    @Query() query: GetFavoritesDto,
  ): Promise<GetFavoritesResponseDto[]> {
    return this.favoritesService.getFavoritesByUser(query);
  }

  @Post()
  async addFavorite(
    @Body() body: AddFavoriteDto,
  ): Promise<GetFavoritesResponseDto> {
    return this.favoritesService.addFavorite(body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async removeFavorite(@Body() body: AddFavoriteDto): Promise<void> {
    const { userId, productId } = body;
    return this.favoritesService.removeFavorite(userId, productId);
  }
}
