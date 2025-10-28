import { IntersectionType } from '@nestjs/mapped-types';

import {
  IdDto,
  CategorySlugDto,
  CategoryTranslationsExtendedDto,
} from './base.dto';

export class EditCategoryWithTranslationDto extends IntersectionType(
  IdDto,
  CategorySlugDto,
  CategoryTranslationsExtendedDto,
) {}
