/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom/vitest" />

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'jest-axe' {
  interface AxeResults {
    violations: Array<{ id: string; description: string; help: string }>
    passes: Array<{ id: string; description: string; help: string }>
    incomplete: Array<{ id: string; description: string; help: string }>
    inapplicable: Array<{ id: string; description: string; help: string }>
    timestamp: string
    url: string
  }

  function axe(
    node: Node | Element | string,
    options?: Record<string, unknown>,
  ): Promise<AxeResults>

  function configureAxe(options?: Record<string, unknown>): typeof axe

  const toHaveNoViolations: Record<
    string,
    (received: Element | DocumentFragment) => {
      pass: boolean
      message: () => string
    }
  >
}

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): T
  }
}
