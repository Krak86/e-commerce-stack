'use client'

import React from 'react'

import { manageErrors } from '@/utils'
import { ROUTES } from '@/static'

class ComponentErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _info: React.ErrorInfo) {
    manageErrors({ error })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg bg-red-900 p-6 text-center text-white">
          <h2 className="mb-4 text-xl font-bold">{`Component failed to render`}</h2>

          <div className="flex justify-center gap-1">
            <p className="text-sm text-white/80">{`Try refreshing or`}</p>

            <a href={`mailto:${ROUTES.emailContact}`} className="text-sm text-white/80 underline">
              {`contact support`}
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ComponentErrorBoundary
