'use client'

import { useActionState } from 'react'

import { signin } from '@/server/actions'

export default function Signin() {
  const [state, action, loading] = useActionState(signin, undefined)

  return (
    <div>
      <h1>Signin</h1>

      <form action={action}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" disabled={loading} />
        </div>

        {state?.errors?.email && <p className="text-red-600">{state.errors.email}</p>}

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" disabled={loading} autoComplete="current-password" />
        </div>

        {state?.errors?.password && (
          <div className="text-red-600">
            <p>Password must:</p>
            <ul>
              {state.errors.password.map(error => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

      <p className="text-red-600">{state?.isError && state.message}</p>
    </div>
  )
}
