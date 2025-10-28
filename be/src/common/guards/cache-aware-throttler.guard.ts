import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerStorage } from '@nestjs/throttler';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { ThrottlerModuleOptions } from '@nestjs/throttler';
import type { Cache } from 'cache-manager';

import type { RedisCacheMeta } from '@/utils/type';
import { REDIS_CACHE_META_KEY } from '@/utils/static';
import { verbose } from '@/utils/helper';

@Injectable()
export class CacheAwareThrottlerGuard extends ThrottlerGuard {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    // Only skip throttling for GET requests that might be cached
    if (req.method === 'GET') {
      const meta =
        this.reflector.getAllAndOverride<RedisCacheMeta>(REDIS_CACHE_META_KEY, [
          context.getHandler(),
          context.getClass(),
        ]) ?? {};

      // If this endpoint uses Redis caching, check if response is already cached
      if (meta.ttl !== undefined || meta.key !== undefined) {
        const key = typeof meta.key === 'string' ? meta.key : req.url;

        try {
          const cachedData = await this.cacheManager.get(key);
          if (cachedData) {
            // Cache HIT: Skip throttling since we're not hitting the database/handler
            verbose(() =>
              console.log('Throttler: Skipping due to cache HIT for key:', key),
            );
            return true;
          }
        } catch (error: unknown) {
          verbose(() =>
            console.error('Cache check failed in throttler guard:', error),
          );
          // If cache check fails, fall through to normal throttling
        }
      }
    }

    // Cache MISS or non-GET request: Apply normal throttling
    return super.canActivate(context);
  }
}
