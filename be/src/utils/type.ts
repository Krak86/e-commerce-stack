import type { Request } from 'express';

import { payment_status, order_status } from '@prisma/client';

export type AscType = 'asc' | 'desc';

export type KeyRange = 'price' | 'stock';

export enum Role {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
}

export type CacheScope =
  | 'public'
  | 'private'
  | 'no-cache'
  | 'no-store'
  | 'other';

export interface CacheMeta {
  scope: CacheScope;
  scopeName?: string; // for 'other' scope
  ttl?: number;
  flags?: string[]; // ['must-revalidate', 'stale-while-revalidate=30']
}

export type RedisCacheScope = 'cache-aside' | 'none';

export interface RedisCacheMeta {
  scope: RedisCacheScope;
  ttl?: number;
  key?: string;
}

export type PaymentStatus = payment_status;

export type OrderStatus = order_status;

export type UserResponse = Request & { user?: JwtPayload };

export interface UserRequestWithCookies extends Request {
  cookies: { [key: string]: string };
  user?: JwtPayload | undefined;
  refreshToken?: string | undefined;
}

export type JwtPayload = {
  sub: string; // унікальний ідентифікатор користувача (часто user.id)
  email: string; // email користувача
  role: Role; // роль (наприклад, 'user', 'admin')
  iat?: number; // issued at (timestamp)
  exp?: number; // expiration (timestamp)
};
