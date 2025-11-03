'use server'

import { redirect } from 'next/navigation'
import https from 'node:https'
import axios, { AxiosResponseHeaders } from 'axios'

import { SigninFormSchema, FormState, axiosClient } from '@/lib'
import { ROUTES } from '@/static'
import { setRefreshToken } from '@/server/set-refreshtoken'

// HTTPS agent that accepts self-signed certificates (development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === 'production'
})

export async function signin(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  // Perform the login action
  const { email, password } = validatedFields.data

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

  const { data, status, error, headers } = await axiosClient({
    url: `${apiBaseUrl}/auth/login`,
    method: 'POST',
    data: {
      email,
      password
    },
    httpsAgent
  })

  if (status > 201) {
    return {
      isError: true,
      message: 'Login failed'
    }
  }

  // Forward cookies from API response to the browser
  await setRefreshToken(headers as AxiosResponseHeaders)

  if (error) {
    // Re-throw Next.js redirect errors (they're not actual errors)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    if (axios.isAxiosError(error)) {
      return {
        isError: true,
        message: data?.message || error.message || 'Login failed'
      }
    }
  }

  redirect(ROUTES.dashboard)
}
