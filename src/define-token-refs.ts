import {
  type NormalizeVarName,
  type WithSemi,
  type StripDash,
  varName,
  stripDashPrefix,
} from './internal/utils.js'
import { buildCornerName, LOGICAL_CORNERS } from './internal/logical-corners.js'

// ── Options ──

export interface DefineTokenRefsOptions {
  /** Append semicolons to values */
  semi?: boolean
  /**
   * Keys to expand into 4 logical corners (border-radius).
   * When `true`, auto-detects keys ending in `shape`.
   * When a string array, uses the given keys explicitly.
   */
  expandShapes?: boolean | readonly string[]
  /**
   * When `true` with `expandShapes`, each corner's `var()` also falls back to
   * the base var before the original value.
   *
   * @example
   * // useBaseFallback: false (Output 3)
   * '--_button-shape-start-start': 'var(--button-shape-start-start, <value>)'
   *
   * // useBaseFallback: true (Output 4)
   * '--_button-shape-start-start': 'var(--button-shape-start-start, var(--button-shape, <value>))'
   */
  useBaseFallback?: boolean
}

// ── Return-type helpers ──

type TokenRefValue<K extends string, V extends string> = `var(${NormalizeVarName<K>}, ${V})`

type BasicTokenRefsResult<T extends Record<string, string>, S extends boolean> = {
  [K in keyof T & string as `--_${K}`]: S extends true
    ? WithSemi<TokenRefValue<K, T[K]>>
    : TokenRefValue<K, T[K]>
}

// ── Overloads ──

/** Basic: `{key: value}` → `{ '--_key': 'var(--key, value)' }` */
export function defineTokenRefsRecord<const T extends Record<string, string>>(
  tokens: T,
): BasicTokenRefsResult<T, false>

/** Basic with semicolon: → `{ '--_key': 'var(--key, value);' }` */
export function defineTokenRefsRecord<const T extends Record<string, string>>(
  tokens: T,
  semi: true,
): BasicTokenRefsResult<T, true>

/** With options (shape expansion, etc.) */
export function defineTokenRefsRecord<const T extends Record<string, string>>(
  tokens: T,
  options: DefineTokenRefsOptions,
): Record<string, string>

// ── Implementation ──

export function defineTokenRefsRecord(
  tokens: Record<string, string>,
  semiOrOptions?: boolean | DefineTokenRefsOptions,
): Record<string, string> {
  // ── Parse options ──
  let semi = false
  let expandShapes: readonly string[] | boolean = false
  let useBaseFallback = false

  if (typeof semiOrOptions === 'boolean') {
    semi = semiOrOptions
  } else if (semiOrOptions) {
    semi = semiOrOptions.semi ?? false
    expandShapes = semiOrOptions.expandShapes ?? false
    useBaseFallback = semiOrOptions.useBaseFallback ?? false
  }

  // ── Determine which keys are shape keys ──
  const shapeKeys = new Set<string>(
    Array.isArray(expandShapes)
      ? expandShapes
      : expandShapes === true
        ? Object.keys(tokens).filter(k => k.endsWith('shape'))
        : [],
  )

  const entries: Array<[string, string]> = []

  for (const [key, value] of Object.entries(tokens)) {
    if (shapeKeys.has(key)) {
      // ── Expand to 4 logical corners ──
      for (const corner of LOGICAL_CORNERS) {
        const cornerName = buildCornerName(key, corner)
        const recordKey = `--_${stripDashPrefix(cornerName)}`

        let varExpr: string
        if (useBaseFallback) {
          const baseRef = `var(${varName(key)}, ${value})`
          varExpr = `var(${cornerName}, ${baseRef})`
        } else {
          varExpr = `var(${cornerName}, ${value})`
        }

        entries.push([recordKey, semi ? `${varExpr};` : varExpr])
      }
    } else {
      // ── Simple: --_key: var(--key, value) ──
      const stripped = stripDashPrefix(key)
      const recordKey = `--_${stripped}`
      const varExpr = `var(${varName(key)}, ${value})`
      entries.push([recordKey, semi ? `${varExpr};` : varExpr])
    }
  }

  return Object.fromEntries(entries)
}
