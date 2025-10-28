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
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { Roles, PublicCache, RedisCache } from '@/common/decorators';
import { Role } from '@/utils/type';
import { AuthGuard, RolesGuard } from '@/common/guards';
import {
  AddCategoryDto,
  AddCategoryResponseDto,
  AddCategoryTranslationDto,
  AddCategoryTranslationResponseDto,
  AddCategoryWithTranslationDto,
  AddCategoryWithTranslationResponseDto,
  DeleteCategoryDto,
  EditCategoriesDto,
  EditCategoriesResponseDto,
  EditCategoryTranslationDto,
  EditCategoryWithTranslationDto,
  GetCategoriesDto,
  GetCategoriesResponseDto,
  GetCategoriesTranslationsDto,
  GetCategoriesTranslationsResponseDto,
  GetCategoriesWithTranslationsResponseDto,
  GetCategoryDto,
  GetCategoryWithTranslationsResponseDto,
} from './dto';
import { CategoriesService } from './categories.service';

@RedisCache()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @PublicCache()
  @ApiResponse({
    type: [GetCategoriesResponseDto],
    description: 'Returns GetCategoriesResponseDto[]',
  })
  @Get()
  async getAllCategories(): Promise<GetCategoriesResponseDto[]> {
    return this.categoriesService.getCategories();
  }

  @ApiExtraModels(AddCategoryDto)
  @ApiResponse({
    type: AddCategoryResponseDto,
    description: 'Returns AddCategoryResponseDto',
    schema: {
      $ref: getSchemaPath(AddCategoryDto),
    },
  })
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async postCategory(
    @Body() dto: AddCategoryDto,
  ): Promise<AddCategoryResponseDto> {
    return this.categoriesService.postCategory(dto);
  }

  @ApiResponse({
    type: EditCategoriesResponseDto,
    description: 'Returns EditCategoriesResponseDto',
  })
  @Patch()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async patchCategory(
    @Body() dto: EditCategoriesDto,
  ): Promise<EditCategoriesResponseDto> {
    return this.categoriesService.patchCategory(dto);
  }

  @Delete()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteCategory(@Body() dto: DeleteCategoryDto): Promise<void> {
    return this.categoriesService.deleteCategory(dto);
  }

  @PublicCache()
  @ApiResponse({
    type: GetCategoryWithTranslationsResponseDto,
    description: 'Returns GetCategoryWithTranslationsResponseDto',
  })
  @Get('/translation/:id')
  async getCategoryWithTranslations(
    @Param() dto: GetCategoryDto,
  ): Promise<GetCategoryWithTranslationsResponseDto> {
    return this.categoriesService.getCategoryWithTranslations(dto);
  }

  @PublicCache()
  @ApiResponse({
    type: [GetCategoriesTranslationsResponseDto],
    description: 'Returns GetCategoriesTranslationsResponseDto[]',
  })
  @Get('/translations')
  async getAllCategoriesTranslations(
    @Query() dto: GetCategoriesTranslationsDto,
  ): Promise<GetCategoriesTranslationsResponseDto[]> {
    return this.categoriesService.getAllCategoriesTranslations(dto);
  }

  @ApiResponse({
    type: AddCategoryTranslationResponseDto,
    description: 'Returns AddCategoryTranslationResponseDto',
  })
  @Post('/translations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async addCategoryTranslation(
    @Body() dto: AddCategoryTranslationDto,
  ): Promise<AddCategoryTranslationResponseDto> {
    return this.categoriesService.addCategoryTranslation(dto);
  }

  @ApiResponse({
    type: AddCategoryTranslationResponseDto,
    description: 'Returns AddCategoryTranslationResponseDto',
  })
  @Patch('/translations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async editCategoryTranslation(
    @Body() dto: EditCategoryTranslationDto,
  ): Promise<AddCategoryTranslationResponseDto> {
    return this.categoriesService.editCategoryTranslation(dto);
  }

  @PublicCache()
  @ApiResponse({
    type: [GetCategoriesWithTranslationsResponseDto],
    description: 'Returns GetCategoriesWithTranslationsResponseDto[]',
  })
  @Get('/with-translations')
  async getAllCategoriesWithTranslations(
    @Query() dto: GetCategoriesDto,
  ): Promise<GetCategoriesWithTranslationsResponseDto[]> {
    return this.categoriesService.getAllCategoriesWithTranslations(dto);
  }

  @ApiResponse({
    type: AddCategoryWithTranslationResponseDto,
    description: 'Returns AddCategoryWithTranslationResponseDto',
  })
  @Post('/with-translations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async postCategoryWithTranslation(
    @Body() dto: AddCategoryWithTranslationDto,
  ): Promise<AddCategoryWithTranslationResponseDto> {
    return await this.categoriesService.postCategoryWithTranslation(dto);
  }

  @ApiResponse({
    type: AddCategoryWithTranslationResponseDto,
    description: 'Returns AddCategoryWithTranslationResponseDto',
  })
  @Patch('/with-translations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async patchCategoryWithTranslation(
    @Body() dto: EditCategoryWithTranslationDto,
  ): Promise<AddCategoryWithTranslationResponseDto> {
    return await this.categoriesService.patchCategoryWithTranslation(dto);
  }
}
