import { SetMetadata, CustomDecorator } from '@nestjs/common';

import type { RedisCacheMeta } from '@/utils/type';
import { DEFAULT_REDIS_CACHE_TTL, REDIS_CACHE_META_KEY } from '@/utils/static';

export const SetRedisCache = (meta: RedisCacheMeta): CustomDecorator<string> =>
  SetMetadata(REDIS_CACHE_META_KEY, meta);

export const RedisCache = (
  meta: RedisCacheMeta = { scope: 'cache-aside', ttl: DEFAULT_REDIS_CACHE_TTL },
): CustomDecorator<string> => SetRedisCache(meta);
