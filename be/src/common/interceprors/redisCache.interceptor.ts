import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import { Response, Request } from 'express';
import { Observable, tap, of, from, switchMap } from 'rxjs';
import type { Cache } from 'cache-manager';

import type { RedisCacheMeta } from '@/utils/type';
import { DEFAULT_REDIS_CACHE_TTL, REDIS_CACHE_META_KEY } from '@/utils/static';
import { verbose } from '@/utils/helper';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflector: Reflector,
    private readonly defaultMaxAgeSeconds: number = DEFAULT_REDIS_CACHE_TTL,
    private readonly defaultScope: RedisCacheMeta['scope'] = 'none',
  ) {}

  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    // Only cache GET requests
    if (req.method !== 'GET') {
      return next.handle();
    }

    const meta =
      this.reflector.getAllAndOverride<RedisCacheMeta>(REDIS_CACHE_META_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? {};

    const scope = meta.scope ?? this.defaultScope;

    const ttl =
      typeof meta.ttl === 'number' ? meta.ttl : this.defaultMaxAgeSeconds;

    const key = typeof meta.key === 'string' ? meta.key : req.url;

    switch (scope) {
      case 'cache-aside':
        return from(this.cacheManager.get<T>(key)).pipe(
          switchMap((cachedData) => {
            if (cachedData) {
              // Cache HIT: Return cached data
              verbose(() => console.log('Cache HIT:', key));
              res.setHeader('X-Cache-Status', 'HIT');
              res.setHeader('X-Cache-Key', key);
              return of(cachedData);
            }

            // Cache MISS: Execute handler and cache the result
            verbose(() => console.log('Cache MISS:', key));
            res.setHeader('X-Cache-Status', 'MISS');
            res.setHeader('X-Cache-Key', key);

            return next.handle().pipe(
              tap((response) => {
                // Store response in cache with TTL (in milliseconds)
                this.cacheManager
                  .set(key, response, ttl * 1000)
                  .then(() => {
                    verbose(() =>
                      console.log(
                        'Cached response for key:',
                        key,
                        'TTL:',
                        ttl,
                        'seconds',
                      ),
                    );
                  })
                  .catch((error) => {
                    console.error('Failed to cache response:', error);
                  });
              }),
            );
          }),
        );

      case 'none':
        return next.handle();

      default:
        return next.handle();
    }
  }
}
