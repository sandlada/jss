import type { StripDash } from './internal/utils.js'
import { stripDashPrefix } from './internal/utils.js'

// ── Return-type helpers ──

/** Map each key through `${Prefix}-${StripDash<Key>}` */
type PrefixedResult<U, P extends string> = {
  [K in keyof U & string as `${P}-${StripDash<K>}`]: U[K]
}

/** The callable returned by `defineOverrides` — apply an optional prefix */
interface PrefixApplier<U> {
  /** Return overrides as-is (no prefix) */
  (): U
  /** Prepend the given CSS-variable prefix to every key */
  <P extends string>(prefix: P): PrefixedResult<U, P>
}

// ── Overloads ──

/**
 * Type-safe: constrain overrides keys to those of source type `T`.
 * `T` is inferred from the `source` argument — every override key is optional,
 * so partial overrides (including `{}`) are allowed.
 *
 * @example
 * const FocusRing = { 'outline-color': 'red', 'outline-width': '2px' } as const
 * defineOverrides(FocusRing, {})()
 * defineOverrides(FocusRing, { 'outline-color': 'blue' })('--my-prefix')
 */
export function defineOverrides<
  T extends Record<string, string>,
  const U extends { [K in keyof T]?: string },
>(source: T, overrides: U): PrefixApplier<U>

/**
 * Unconstrained: accept any string-keyed overrides record.
 * Pass `null` as the `source` argument to skip type constraints.
 *
 * @example
 * defineOverrides(null, { 'outline-color': 'blue' })()
 * defineOverrides(null, { 'outline-color': 'blue' })('--pfx')
 */
export function defineOverrides<const U extends Record<string, string>>(
  source: null,
  overrides: U,
): PrefixApplier<U>

// ── Implementation ──

export function defineOverrides(
  source: Record<string, string> | null,
  overrides: Record<string, string>,
): PrefixApplier<Record<string, string>> {
  return (prefix?: string): Record<string, string> => {
    if (!prefix) return { ...overrides }

    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(overrides)) {
      result[`${prefix}-${stripDashPrefix(key)}`] = value
    }
    return result
  }
}
