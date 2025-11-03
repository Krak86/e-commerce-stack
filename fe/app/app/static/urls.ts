export const API_URL = process.env.NEXT_PUBLIC_API_URL

export const EMAIL_CONTACT = process.env.NEXT_PUBLIC_EMAIL_CONTACT ?? 'rukrak86@gmail.com'

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export const ROUTES = {
  emailContact: `mailto:${EMAIL_CONTACT}`,
  privacy: '/privacy',
  terms: '/terms',
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings'
}
