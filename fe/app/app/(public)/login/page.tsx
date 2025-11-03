'use client'

import { useState } from 'react'

import useAuthActions from '@/hooks/use-auth-actions'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const { handleLogin, handleRedirect } = useAuthActions()

  const handleClick = async () => {
    setLoading(true)

    const response = await handleLogin('', '')

    if (response.isError) {
      console.error('Login failed:', response.message)
    } else {
      handleRedirect()
    }

    setLoading(false)
  }

  return (
    <div>
      <h1>Login</h1>

      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" disabled={loading} />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" disabled={loading} />
        </div>

        <button onClick={handleClick} disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
