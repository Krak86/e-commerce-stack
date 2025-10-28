import { Module } from '@nestjs/common';
import { ThrottlerModule, minutes } from '@nestjs/throttler';

import { UserResponse, Role } from '@/utils/type';
import { ThrottlerConfigService } from './throttler-config.service';
import { ThrottlerConfigController } from './throttler-config.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'query',
          ttl: minutes(1),
          limit: 100,
          skipIf(context) {
            const req = context.switchToHttp().getRequest<Request>();
            if (
              // skip 'auth'
              req.url.startsWith('/auth') ||
              // skip 'mutate'
              (req.method !== 'GET' &&
                req.method !== 'HEAD' &&
                req.method !== 'OPTIONS')
            ) {
              return true;
            } else return false;
          },
        },
        {
          name: 'mutate',
          ttl: minutes(1),
          limit: 50,
          skipIf(context) {
            const req = context.switchToHttp().getRequest<Request>();
            // skip 'auth'
            if (req.url.startsWith('/auth')) return true;
            else return false;
          },
        },
        {
          name: 'auth',
          ttl: minutes(1),
          limit: 10,
        },
      ],
      errorMessage(_, throttlerLimitDetail) {
        const limit = throttlerLimitDetail.limit;
        const ttl = throttlerLimitDetail.ttl;
        return `Too many requests. You can make ${limit} requests every ${ttl > 60 ? `${Math.ceil(ttl / 60)} minutes` : `${ttl} seconds`}. Please try again later. `;
      },
      skipIf(context) {
        const req = context.switchToHttp().getRequest<UserResponse>();
        if (
          req.headers['x-internal-request'] === 'nextjs-build' ||
          req?.user?.role === Role.ADMIN
        )
          return true;
        else return false;
      },
    }),
  ],
  controllers: [ThrottlerConfigController],
  providers: [ThrottlerConfigService],
  exports: [ThrottlerModule],
})
export class ThrottlerConfigModule {}
