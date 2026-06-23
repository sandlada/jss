/**
 * Assert that `key` does NOT start with `_` or `--_`.
 * Used by `useInternalVars` / `useInternalVarsRecord`.
 */
export function assertNoUnderscorePrefix(key: string): void {
  if (key.startsWith('--_') || key.startsWith('_')) {
    throw new TypeError('The key must be a valid CSS variable name.')
  }
}
