import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getCookieRefreshOptions, getCookieAccessOptions } from '@/utils';
import { AccessEntity } from '@/modules/auth/entities';

@Injectable()
export class ResponseRefreshToken implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: AccessEntity) => {
        const { refreshToken, accessToken, ...rest } = data;

        if (refreshToken) {
          res.cookie('refreshToken', refreshToken, getCookieRefreshOptions());
        }

        if (accessToken) {
          res.cookie('accessToken', accessToken, getCookieAccessOptions());
        }
        // exclude refreshToken from response body
        return {
          ...rest,
          accessToken,
        };
      }),
    );
  }
}
