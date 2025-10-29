import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'

import * as fonts from '@/fonts'
import { APP_URL, METADATA_TEXT } from '@/static'
import { cn } from '@/lib'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: METADATA_TEXT.title,
  description: METADATA_TEXT.description,
  openGraph: {
    title: METADATA_TEXT.title,
    description: METADATA_TEXT.description,
    url: APP_URL,
    siteName: METADATA_TEXT.siteName,
    images: METADATA_TEXT.images,
    locale: METADATA_TEXT.locale,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: METADATA_TEXT.title,
    description: METADATA_TEXT.description,
    images: METADATA_TEXT.images
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          fonts.geistSans.variable,
          fonts.geistMono.variable,
          fonts.inter.variable,
          fonts.jetbrainsMono.variable,
          'antialiased'
        )}
      >
        {children}

        <ToastContainer />
      </body>
    </html>
  )
}
