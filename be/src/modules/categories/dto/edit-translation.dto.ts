import { IntersectionType } from '@nestjs/mapped-types';

import {
  CategoryIdDto,
  CategoryNameDto,
  CategoryDescDto,
  LanguageCodeDto,
  CategoryTranslationIdDto,
} from './base.dto';

export class EditCategoryTranslationDto extends IntersectionType(
  CategoryIdDto,
  CategoryNameDto,
  CategoryDescDto,
  LanguageCodeDto,
  CategoryTranslationIdDto,
) {}
