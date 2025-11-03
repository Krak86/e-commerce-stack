'use client'

import { useRouter } from 'next/navigation'

import type { ErrorResponse, LoginResponse } from '@/types'
import { ROUTES } from '@/static'

const useAuthActions = () => {
  const router = useRouter()

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

  const handleLogin = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
        // cache: "force-cache",
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          isError: true,
          message: errorData?.message || 'Login failed'
        }
      }

      const data = await response.json()

      return data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          isError: true,
          message: error.message || 'Login failed'
        }
      }

      return { isError: true, message: 'Login failed' }
    }
  }

  const handleRegister = async (name: string, email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
        // cache: "force-cache",
      })
      if (!response.ok) {
        const errorData = await response.json()
        return {
          isError: true,
          message: errorData?.message || 'Registration failed'
        }
      }
      const data = await response.json()
      return data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          isError: true,
          message: error.message
        }
      }
      return { isError: true, message: 'Registration failed' }
    }
  }

  const handleLogout = async (): Promise<Record<string, string> | ErrorResponse> => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
        // cache: "no-store",
      })
      if (!response.ok) {
        const errorData = await response.json()
        return {
          isError: true,
          message: errorData?.message || 'Logout failed'
        }
      }
      const data = await response.json()
      return data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          isError: true,
          message: error.message || 'Logout failed'
        }
      }
      return { isError: true, message: 'Logout failed' }
    }
  }

  const handleRedirect = () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/${ROUTES.dashboard}`
    router.push(url)
  }

  return { handleLogin, handleRegister, handleLogout, handleRedirect }
}

export default useAuthActions
