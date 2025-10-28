import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response, Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import type { CacheMeta } from '@/utils/type';
import { CACHE_META_KEY, DEFAULT_CACHE_TTL } from '@/utils/static';

@Injectable()
export class CacheHeadersInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly defaultScope: CacheMeta['scope'] = 'no-store',
    private readonly defaultMaxAgeSeconds = DEFAULT_CACHE_TTL,
  ) {}

  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const meta =
      this.reflector.getAllAndOverride<CacheMeta>(CACHE_META_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? {};

    const scope = meta.scope ?? this.defaultScope;

    const ttl =
      typeof meta.ttl === 'number' ? meta.ttl : this.defaultMaxAgeSeconds;
    const flags = meta?.flags?.length ? `, ${meta.flags.join(', ')}` : '';

    return next.handle().pipe(
      tap(() => {
        res.setHeader(
          'Vary',
          'Authorization, Accept-Encoding, Accept-Language',
        );
        res.setHeader('X-Powered-By', 'R8S6N');

        if (req.method !== 'GET') {
          res.setHeader('Cache-Control', 'no-store');
          return;
        }

        switch (scope) {
          case 'public':
            res.setHeader('Cache-Control', `public, max-age=${ttl}${flags}`);
            break;

          case 'private':
            res.setHeader('Cache-Control', `private, max-age=${ttl}${flags}`);
            break;

          case 'no-cache':
            res.setHeader('Cache-Control', `private, no-cache${flags}`);
            break;

          case 'no-store':
            res.setHeader('Cache-Control', 'no-store');
            break;

          case 'other':
            res.setHeader(
              'Cache-Control',
              `${meta?.scopeName ? `${meta.scopeName}, ` : ''}max-age=${ttl}${flags}`,
            );
            break;

          default:
            res.setHeader('Cache-Control', 'no-store');
        }
      }),
    );
  }
}
