import { AscType, PaymentStatus, OrderStatus } from '@/utils/type';
import { language_code } from '@prisma/client';

export const LANGUAGES: language_code[] = ['uk', 'en'];

export const ASCENDING: AscType[] = ['asc', 'desc'];

export const COOKIE_REFRESH = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  domain: process.env.DOMAIN_COMMON
    ? `.${process.env.DOMAIN_COMMON}`
    : undefined,
};

export const TOKENS_LIFETIME: Record<string, any> = {
  access: 1800000, // '30m',
  refresh: 604800000, // '7d',
};

export const ALLOWED_KEYS = ['price', 'stock'] as const;

export const ROLES = ['guest', 'user', 'admin'] as const;

export const CACHE_META_KEY = 'cache:meta';

export const REDIS_CACHE_META_KEY = 'redis-cache:meta';

export const DEFAULT_CACHE_TTL = 3600;
export const DEFAULT_REDIS_CACHE_TTL = 3600;

export const PAYMENT_STATUS: PaymentStatus[] = [
  'pending',
  'paid',
  'failed',
  'refunded',
  'other',
] as const;

export const PAYMENT_CURRENCY = 'UAH';

export const ORDER_STATUS: OrderStatus[] = [
  'pending',
  'paid',
  'other',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export const FORBIDDEN_TO_UPDATE: OrderStatus[] = [
  'shipped',
  'delivered',
  'cancelled',
  'paid',
] as const;
