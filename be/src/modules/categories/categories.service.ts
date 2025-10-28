import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { language_code } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  AddCategoryDto,
  AddCategoryResponseDto,
  GetCategoriesDto,
  GetCategoriesResponseDto,
  EditCategoriesDto,
  EditCategoriesResponseDto,
  AddCategoryTranslationDto,
  AddCategoryTranslationResponseDto,
  GetCategoriesWithTranslationsResponseDto,
  DeleteCategoryDto,
  EditCategoryTranslationDto,
  GetCategoriesTranslationsResponseDto,
  AddCategoryWithTranslationDto,
  AddCategoryWithTranslationResponseDto,
  EditCategoryWithTranslationDto,
  GetCategoryWithTranslationsResponseDto,
  GetCategoryDto,
  GetCategoriesTranslationsDto,
} from './dto';
import {
  CategoryTranslationDto,
  CategoryTranslationExtendedDto,
} from './dto/base.dto';
import { LANGUAGES } from '@/utils/static';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getCategories(): Promise<GetCategoriesResponseDto[]> {
    const categories = await this.prisma.categories.findMany({
      orderBy: { id: 'asc' },
    });

    return categories?.map((category) => ({
      id: category.id,
      slug: category.slug,
    }));
  }

  async postCategory(dto: AddCategoryDto): Promise<AddCategoryResponseDto> {
    await this.verifyUniqueCategoriesSlugs(dto.slug);

    const category = await this.prisma.categories.create({
      data: {
        slug: dto.slug,
      },
    });

    return {
      id: category.id,
      slug: category.slug,
    };
  }

  async patchCategory(
    dto: EditCategoriesDto,
  ): Promise<EditCategoriesResponseDto> {
    const { id, slug } = dto;

    await this.verifyUniqueCategoryByIdExist(id);
    await this.verifyUniqueCategorySlugs(slug, id);

    const category = await this.prisma.categories.update({
      where: { id },
      data: {
        slug,
      },
    });

    return {
      id: category.id,
      slug: category.slug,
    };
  }

  async deleteCategory(dto: DeleteCategoryDto): Promise<void> {
    await this.prisma.categories.delete({
      where: { id: dto.id },
    });
  }

  async getAllCategoriesTranslations(
    dto: GetCategoriesTranslationsDto,
  ): Promise<GetCategoriesTranslationsResponseDto[]> {
    const categories = await this.prisma.category_translations.findMany({
      where: {
        language_code: dto.language_code,
      },
    });

    return (
      categories?.map(
        ({ id, category_id, language_code, name, description }) => ({
          id,
          category_id,
          language_code,
          name,
          description: description ?? '',
        }),
      ) ?? []
    );
  }

  async addCategoryTranslation(
    dto: AddCategoryTranslationDto,
  ): Promise<AddCategoryTranslationResponseDto> {
    const { category_id, language_code, name, description } = dto;

    // check if category exists
    await this.verifyUniqueCategoryByIdExist(category_id);
    // check if category_id and language_code combination already exists
    await this.verifyCategoryLangUnique(category_id, language_code);

    const categoryTranslation = await this.prisma.category_translations.create({
      data: {
        category_id,
        language_code,
        name: name ?? '',
        description: description ?? '',
      },
    });

    return {
      category_id: categoryTranslation.category_id,
      language_code: categoryTranslation.language_code,
      name: categoryTranslation.name ?? '',
      description: categoryTranslation.description ?? '',
      category_translation_id: categoryTranslation.id,
    };
  }

  async editCategoryTranslation(
    dto: EditCategoryTranslationDto,
  ): Promise<AddCategoryTranslationResponseDto> {
    const {
      category_id,
      language_code,
      category_translation_id,
      name,
      description,
    } = dto;

    // check if category exists
    await this.verifyUniqueCategoryByIdExist(category_id);

    const categoryTranslation = await this.prisma.category_translations.update({
      data: {
        category_id,
        language_code,
        name: name ?? '',
        description: description ?? '',
      },
      where: { id: category_translation_id },
    });

    return {
      category_id: categoryTranslation.category_id,
      language_code: categoryTranslation.language_code,
      name: categoryTranslation.name ?? '',
      description: categoryTranslation.description ?? '',
      category_translation_id: categoryTranslation.id,
    };
  }

  async getCategoryWithTranslations(
    dto: GetCategoryDto,
  ): Promise<GetCategoryWithTranslationsResponseDto> {
    const { id } = dto;

    await this.verifyUniqueCategoryByIdExist(id);

    // find single by id
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        category_translations: {
          select: {
            id: true,
            name: true,
            description: true,
            category_id: true,
            language_code: true,
          },
        },
      },
    });

    return {
      id: category?.id ?? 0,
      slug: category?.slug ?? '',
      translations:
        category?.category_translations?.map((t) => ({
          category_id: t.category_id,
          category_translation_id: t.id,
          name: t.name ?? '',
          description: t.description ?? '',
          language_code: t.language_code ?? '',
        })) ?? [],
    };
  }

  async getAllCategoriesWithTranslations(
    dto: GetCategoriesDto,
  ): Promise<GetCategoriesWithTranslationsResponseDto[]> {
    const { language_code } = dto;

    const categories = await this.prisma.categories.findMany({
      include: {
        category_translations: language_code
          ? {
              where: { language_code },
              select: { name: true, description: true },
            }
          : {
              select: { name: true, description: true },
            },
      },
    });

    return categories?.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.category_translations?.[0]?.name ?? '',
      description: category.category_translations?.[0]?.description ?? '',
    }));
  }

  async postCategoryWithTranslation(
    dto: AddCategoryWithTranslationDto,
  ): Promise<AddCategoryWithTranslationResponseDto> {
    const { slug, translations } = dto;

    this.verifyTranslationsCorrect(translations);

    await this.verifyUniqueCategoriesSlugs(dto.slug);
    // create category
    const category = await this.postCategory({ slug });
    // create translations for each language
    const categoryWithTranslations = await Promise.all(
      translations.map(({ language_code, name, description }) =>
        this.addCategoryTranslation({
          category_id: category.id,
          language_code,
          name,
          description,
        }),
      ),
    );

    return {
      ...category,
      translations: categoryWithTranslations,
    };
  }

  async patchCategoryWithTranslation(
    dto: EditCategoryWithTranslationDto,
  ): Promise<AddCategoryWithTranslationResponseDto> {
    const { id, slug, translations } = dto;

    // check if category exists
    await this.verifyUniqueCategoryByIdExist(id);
    // validate translations
    this.verifyTranslationsCorrect(translations);

    await this.verifyCategoryTranslationCorrect(translations);

    // throw new BadRequestException('BadRequestException');

    // patch category
    const category = await this.patchCategory({ id, slug });

    // update translations
    const categoryWithTranslations = await Promise.all(
      translations.map(
        ({ language_code, name, description, category_translation_id }) =>
          this.editCategoryTranslation({
            category_id: category.id,
            language_code,
            category_translation_id,
            name,
            description,
          }),
      ),
    );

    return {
      ...category,
      translations: categoryWithTranslations,
    };
  }

  private async verifyUniqueCategoryByIdExist(id: number): Promise<boolean> {
    // check if category exists
    const categoryExists = await this.prisma.categories.findUnique({
      where: { id },
    });
    if (!categoryExists) {
      throw new NotFoundException('Category does not exist');
    }

    return !!categoryExists;
  }

  private async verifyUniqueCategorySlugs(
    slug: string,
    id: number,
  ): Promise<boolean> {
    // check if category slug exists
    const categoryExists = await this.prisma.categories.findUnique({
      where: { slug },
    });
    if (categoryExists && categoryExists.id !== id) {
      throw new NotFoundException('Category is already exist');
    }

    return !!categoryExists;
  }

  private async verifyUniqueCategoriesSlugs(slug: string): Promise<boolean> {
    const allSlugs = await this.getCategories();
    if (
      allSlugs.find(
        (c) => c.slug?.toLowerCase() === slug.toLowerCase()?.toLowerCase(),
      )
    ) {
      throw new BadRequestException(
        `The next slugs are reserved: ${allSlugs.map((c) => c.slug).join(', ')}`,
      );
    }

    return !!allSlugs?.length;
  }

  private verifyTranslationsCorrect(
    translations: CategoryTranslationDto[],
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

  private async verifyCategoryLangUnique(
    category_id: number,
    language_code: language_code,
  ): Promise<boolean> {
    // check if category_id and language_code combination already exists
    const exists = await this.prisma.category_translations.findUnique({
      where: {
        category_id_language_code: {
          category_id,
          language_code,
        },
      },
    });
    if (exists) {
      throw new BadRequestException(
        `Translation for category ID ${category_id} in language ${language_code} already exists`,
      );
    }

    return !!exists;
  }

  private async verifyCategoryTranslationCorrect(
    translations: CategoryTranslationExtendedDto[],
  ): Promise<boolean> {
    if (
      translations?.[0]?.category_translation_id ===
      translations?.[1]?.category_translation_id
    ) {
      throw new BadRequestException(
        'Category translation IDs must be different',
      );
    }

    const exists = await Promise.all(
      translations.map(async ({ category_translation_id }) => {
        const found = await this.prisma.category_translations.findUnique({
          where: { id: category_translation_id },
        });
        if (!found)
          throw new NotFoundException('Category translation does not exist');
        return found;
      }),
    );

    return !!exists?.length;
  }
}
