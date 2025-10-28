import { SetMetadata, CustomDecorator } from '@nestjs/common';

import type { CacheMeta } from '@/utils/type';
import { CACHE_META_KEY } from '@/utils/static';

export const SetCache = (meta: CacheMeta): CustomDecorator<string> =>
  SetMetadata(CACHE_META_KEY, meta);

export const PublicCache = (
  ttl?: number,
  flags?: string[],
): CustomDecorator<string> => SetCache({ scope: 'public', ttl, flags });

export const PrivateCache = (
  ttl?: number,
  flags?: string[],
): CustomDecorator<string> => SetCache({ scope: 'private', ttl, flags });

export const Cache = ({
  scope,
  ttl,
  flags,
}: CacheMeta): CustomDecorator<string> => SetCache({ scope, ttl, flags });

export const NoCache = (): CustomDecorator<string> =>
  SetCache({ scope: 'no-cache' });
