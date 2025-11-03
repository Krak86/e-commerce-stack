'use server'

import { AxiosResponseHeaders } from 'axios'
import { cookies } from 'next/headers'

export async function setRefreshToken(headers: AxiosResponseHeaders): Promise<void> {
  // Forward cookies from API response to the browser
  const setCookieHeader = headers['set-cookie']

  if (setCookieHeader) {
    const cookieStore = await cookies()
    const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]

    cookieArray.forEach(cookieString => {
      // Parse cookie string (format: "name=value; HttpOnly; Secure; Path=/; etc")
      const [nameValue, ...attributes] = cookieString.split(';').map(s => s.trim())
      const [name, value] = nameValue.split('=')

      // Parse cookie attributes
      const cookieOptions: any = {}
      attributes.forEach(attr => {
        const [key, val] = attr.split('=').map(s => s.trim())
        const lowerKey = key.toLowerCase()

        if (lowerKey === 'httponly') cookieOptions.httpOnly = true
        else if (lowerKey === 'secure') cookieOptions.secure = true
        else if (lowerKey === 'path') cookieOptions.path = val
        else if (lowerKey === 'domain') cookieOptions.domain = val
        else if (lowerKey === 'max-age') cookieOptions.maxAge = parseInt(val)
        else if (lowerKey === 'expires') cookieOptions.expires = new Date(val)
        else if (lowerKey === 'samesite') cookieOptions.sameSite = val.toLowerCase()
      })

      cookieStore.set(name, value, cookieOptions)
    })
  }
}
