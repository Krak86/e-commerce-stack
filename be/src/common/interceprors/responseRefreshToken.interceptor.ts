import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { COOKIE_REFRESH } from '@/utils/static';
import { AccessEntity } from '@/modules/auth/entities';

@Injectable()
export class ResponseRefreshToken implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: AccessEntity) => {
        const { refreshToken, ...rest } = data;

        if (refreshToken) {
          res.cookie('refreshToken', refreshToken, COOKIE_REFRESH);
        }
        // exclude refreshToken from response body
        return rest;
      }),
    );
  }
}
