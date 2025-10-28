import { Transform } from 'class-transformer';

export function ToSlug(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }): unknown =>
    typeof value === 'string'
      ? value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with dash
          .replace(/^-+|-+$/g, '') // remove leading/trailing dashes
      : value,
  );
}
