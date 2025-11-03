import { AscType, PaymentStatus, OrderStatus } from '@/utils/type';
import { language_code } from '@prisma/client';

export const LANGUAGES: readonly language_code[] = ['uk', 'en'] as const;

export const ASCENDING: readonly AscType[] = ['asc', 'desc'] as const;

export const TOKENS_LIFETIME: Readonly<Record<string, number>> = {
  access: 1800000, // '30m',
  refresh: 604800000, // '7d',
  cacheTtl: 3600, // '1h',
  redisCacheTtl: 3600, // '1h',
} as const;

export const ALLOWED_KEYS: readonly string[] = ['price', 'stock'] as const;

export const ROLES: readonly string[] = ['guest', 'user', 'admin'] as const;

export const CACHE_META_KEY = 'cache:meta';

export const REDIS_CACHE_META_KEY = 'redis-cache:meta';

export const DEFAULT_CACHE_TTL = TOKENS_LIFETIME.cacheTtl;
export const DEFAULT_REDIS_CACHE_TTL = TOKENS_LIFETIME.redisCacheTtl;

export const PAYMENT_STATUS: readonly PaymentStatus[] = [
  'pending',
  'paid',
  'failed',
  'refunded',
  'other',
] as const;

export const PAYMENT_CURRENCY = 'UAH' as const;

export const ORDER_STATUS: readonly OrderStatus[] = [
  'pending',
  'paid',
  'other',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export const FORBIDDEN_TO_UPDATE: readonly OrderStatus[] = [
  'shipped',
  'delivered',
  'cancelled',
  'paid',
] as const;
