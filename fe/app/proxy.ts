import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  // Simple test proxy - logs the request path
  console.log('Proxy triggered for path:', request.nextUrl.pathname)

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)'
  ]
}
