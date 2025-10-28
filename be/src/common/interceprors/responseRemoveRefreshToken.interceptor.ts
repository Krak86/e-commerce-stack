import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { COOKIE_REFRESH } from '@/utils/static';

@Injectable()
export class ResponseRemoveRefreshToken implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        res.clearCookie('refreshToken', COOKIE_REFRESH);
      }),
    );
  }
}
