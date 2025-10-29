import { APP_URL } from './urls'

export const COLORS_LOG = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m'
}

export const HEADERS_DEFAULT = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}



export const METADATA_TEXT = {
  title:  'E-Commerce App',
  description: 'The best e-commerce app in the market',
  siteName: 'E-Commerce App',
  images: [
    {
      url: `${APP_URL}/images/og/og-profile.png`,
      width: 1200,
      height: 1024,
      alt: ''
    }
  ],
  locale: 'en_US',
  type: 'website'
}


