'use client'
import React from 'react'

import ComponentErrorBoundary from '@/components/features/componentErrorBoundary'

// Type for the HOC function
type WithErrorBoundaryHOC = <P extends object>(Component: React.ComponentType<P>) => React.ComponentType<P>

// HOC that wraps a component with error boundary
const withErrorBoundary: WithErrorBoundaryHOC = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  // Create a new component that renders the original component inside an error boundary
  const WithErrorBoundaryComponent = (props: P) => {
    return (
      <ComponentErrorBoundary>
        <WrappedComponent {...props} />
      </ComponentErrorBoundary>
    )
  }

  // Set display name for better debugging
  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`

  return WithErrorBoundaryComponent
}

export { withErrorBoundary }
