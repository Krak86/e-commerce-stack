import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: Record<string, unknown> }>();
    return data ? request.user?.[data] : request.user;
  },
);
