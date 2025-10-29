'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { manageErrors } from '@/utils'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    manageErrors({ error })
  }, [error])

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-hero-radial font-main">
      {/* Overlay */}
      <div className="absolute inset-0" />

      {/* Floating Shapes */}
      <div className="absolute inset-0 z-[1]">
        <div
          className="absolute left-[8%] top-[15%] h-[120px] w-[120px] animate-float rounded-full border border-shape-border bg-shape-bg-light"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute right-[12%] top-[65%] h-[80px] w-[80px] animate-float rounded-full border border-shape-border bg-shape-bg-light"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute left-[15%] top-[75%] h-[160px] w-[160px] animate-float rounded-full border border-shape-border bg-shape-bg-light"
          style={{ animationDelay: '6s' }}
        />
      </div>

      {/* Content */}
      <div className="container-2xl relative z-20 px-8 py-32 sm:py-48 lg:px-0 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-white ring-1 ring-gray-100/20 hover:ring-gray-100/50">
            <Link href="/">Return Home</Link>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">{`Ooops`}</h1>

          <p className="mb-12 mt-8 text-pretty text-lg font-medium text-white sm:text-xl/8">{`Something went wrong`}</p>

          <div>
            <button
              className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
              onClick={() => reset()}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
