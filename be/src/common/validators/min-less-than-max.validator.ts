import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { SearchProductsDto } from '@/modules/products/dto';

@ValidatorConstraint({ name: 'MinLessThanMax', async: false })
export class MinLessThanMaxConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object as SearchProductsDto;
    return (
      object.minPrice === undefined ||
      object.maxPrice === undefined ||
      object.minPrice < object.maxPrice
    );
  }

  defaultMessage() {
    return 'minPrice must be less than maxPrice';
  }
}
