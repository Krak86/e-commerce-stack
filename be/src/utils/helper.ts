import { CookieOptions } from 'express';

import { TOKENS_LIFETIME } from '@/utils';

export const verbose = (callback: () => void, show = false): void => {
  if (show) callback();
  return void 0;
};

export const getCookieRefreshOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: TOKENS_LIFETIME.refresh,
  domain: process.env.DOMAIN_COMMON
    ? `.${process.env.DOMAIN_COMMON}`
    : undefined,
});

export const getCookieAccessOptions = (): CookieOptions => ({
  httpOnly: false,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: TOKENS_LIFETIME.access,
  domain: process.env.DOMAIN_COMMON
    ? `.${process.env.DOMAIN_COMMON}`
    : undefined,
});
