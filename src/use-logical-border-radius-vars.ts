import {
  type NormalizeVarName,
  type WithSemi,
  type JSSOptions,
  varName,
  stripDashPrefix,
  applyPrefix,
  parseOptions,
} from './internal/utils.js'
import {
  type CornerSuffix,
  type ExtractCornerBaseName,
  validateCornerName,
  extractCornerBaseName,
} from './internal/logical-corners.js'

// ── Type helpers ──

/**
 * Build the two‑level var() fallback for a logical corner.
 * `var(--full-name, var(--base-name, F))`
 */
type LogicalRadiusVar<N extends string, F extends string> =
  `var(${NormalizeVarName<N>}, var(${NormalizeVarName<ExtractCornerBaseName<N>>}, ${F}))`

type LogicalRadiusVarNoFallback<N extends string> =
  `var(${NormalizeVarName<N>}, var(${NormalizeVarName<ExtractCornerBaseName<N>>}))`

/** Record key: strip `--` from the full corner name */
type RecordKey<N extends string> = N extends `--${infer R}` ? R : N

// ────────────────────────────────────────────────────────────────────────────
// useLogicalBorderRadiusVars  (array variant)
// ────────────────────────────────────────────────────────────────────────────

/** (corner, fallback) → var(corner, var(base, fallback)) */
export function useLogicalBorderRadiusVars<
  N extends `${string}${CornerSuffix}`,
  F extends string,
>(name: N, fallback: F): [LogicalRadiusVar<N, F>]

/** (corner, fallback, options) → string[] (generic, with prefix/semi) */
export function useLogicalBorderRadiusVars<
  N extends `${string}${CornerSuffix}`,
  F extends string,
>(name: N, fallback: F, options: JSSOptions): string[]

/** (corner) without fallback → just base fallback */
export function useLogicalBorderRadiusVars<
  N extends `${string}${CornerSuffix}`,
>(name: N): [LogicalRadiusVarNoFallback<N>]

/** ({corner: fallback}) → object input */
export function useLogicalBorderRadiusVars<
  const T extends Record<`${string}${CornerSuffix}`, string>,
>(vars: T): Array<{
  [K in keyof T]: LogicalRadiusVar<K & string, T[K] & string>
}[keyof T]>

/** ({corner: fallback}, options) → string[] (generic, with prefix/semi) */
export function useLogicalBorderRadiusVars<
  const T extends Record<`${string}${CornerSuffix}`, string>,
>(vars: T, options: JSSOptions): string[]

/** () → empty */
export function useLogicalBorderRadiusVars(): []

/** ({}) → empty */
export function useLogicalBorderRadiusVars(vars: {}): []

// ── Implementation ──

export function useLogicalBorderRadiusVars(
  nameOrVars?: string | Record<string, string>,
  fallbackOrSemiOrOptions?: string | boolean | JSSOptions,
  semiOrOptions?: boolean | JSSOptions,
): string[] {
  // Empty
  if (nameOrVars === undefined) return []
  if (typeof nameOrVars === 'object' && nameOrVars !== null) {
    if (Object.keys(nameOrVars).length === 0) return []
    const opts = (typeof fallbackOrSemiOrOptions === 'object' && fallbackOrSemiOrOptions !== null && !Array.isArray(fallbackOrSemiOrOptions)
      ? fallbackOrSemiOrOptions as JSSOptions
      : {}) as JSSOptions
    const withSemi = opts.semi ?? false
    const prefix = opts.prefix
    return Object.entries(nameOrVars).map(([key, value]) => {
      validateCornerName(key)
      const base = extractCornerBaseName(key)
      const result = `var(${applyPrefix(key, prefix)}, var(${applyPrefix(base, prefix)}, ${value}))`
      return withSemi ? `${result};` : result
    })
  }

  // String input
  const name = nameOrVars
  validateCornerName(name)
  const base = extractCornerBaseName(name)

  // Check for options object in the third position
  if (semiOrOptions && typeof semiOrOptions === 'object' && !Array.isArray(semiOrOptions)) {
    const opts = semiOrOptions as JSSOptions
    const withSemi = opts.semi ?? false
    const prefix = opts.prefix
    const fallback = fallbackOrSemiOrOptions as string
    const result = `var(${applyPrefix(name, prefix)}, var(${applyPrefix(base, prefix)}, ${fallback}))`
    return [withSemi ? `${result};` : result]
  }

  // Check for options object in the second position (no fallback case)
  if (fallbackOrSemiOrOptions && typeof fallbackOrSemiOrOptions === 'object' && !Array.isArray(fallbackOrSemiOrOptions)) {
    const opts = fallbackOrSemiOrOptions as JSSOptions
    const withSemi = opts.semi ?? false
    const prefix = opts.prefix
    const result = `var(${applyPrefix(name, prefix)}, var(${applyPrefix(base, prefix)}))`
    return [withSemi ? `${result};` : result]
  }

  if (typeof fallbackOrSemiOrOptions === 'boolean') {
    // (name, true) — no fallback, with semicolon
    const result = `var(${varName(name)}, var(${varName(base)}))`
    return [`${result};`]
  }

  if (fallbackOrSemiOrOptions === undefined) {
    // (name) — no fallback, no semicolon
    const result = `var(${varName(name)}, var(${varName(base)}))`
    return [result]
  }

  // (name, fallback) or (name, fallback, semi)
  const fallback = fallbackOrSemiOrOptions
  const withSemi = (typeof semiOrOptions === 'boolean') ? semiOrOptions : false
  const result = `var(${varName(name)}, var(${varName(base)}, ${fallback}))`
  return [withSemi ? `${result};` : result]
}

// ────────────────────────────────────────────────────────────────────────────
// useLogicalBorderRadiusVarsRecord
// ────────────────────────────────────────────────────────────────────────────

/** (corner, fallback) → record with one entry */
export function useLogicalBorderRadiusVarsRecord<
  N extends `${string}${CornerSuffix}`,
  F extends string,
>(name: N, fallback: F): {
  [K in RecordKey<N>]: LogicalRadiusVar<N, F>
}

/** (corner, fallback, options) → Record<string, string> (generic, with prefix/semi) */
export function useLogicalBorderRadiusVarsRecord<
  N extends `${string}${CornerSuffix}`,
  F extends string,
>(name: N, fallback: F, options: JSSOptions): Record<string, string>

/** (corner) without fallback */
export function useLogicalBorderRadiusVarsRecord<
  N extends `${string}${CornerSuffix}`,
>(name: N): {
  [K in RecordKey<N>]: LogicalRadiusVarNoFallback<N>
}

/** ({corner: fallback}) → merged record */
export function useLogicalBorderRadiusVarsRecord<
  const T extends Record<`${string}${CornerSuffix}`, string>,
>(vars: T): {
  [K in keyof T as RecordKey<K & string>]: LogicalRadiusVar<K & string, T[K] & string>
}

/** ({corner: fallback}, options) → Record<string, string> (generic, with prefix/semi) */
export function useLogicalBorderRadiusVarsRecord<
  const T extends Record<`${string}${CornerSuffix}`, string>,
>(vars: T, options: JSSOptions): Record<string, string>

/** () → empty */
export function useLogicalBorderRadiusVarsRecord(): Record<string, never>

/** ({}) → empty */
export function useLogicalBorderRadiusVarsRecord(vars: {}): Record<string, never>

// ── Implementation ──

export function useLogicalBorderRadiusVarsRecord(
  nameOrVars?: string | Record<string, string>,
  fallbackOrSemiOrOptions?: string | boolean | JSSOptions,
  semiOrOptions?: boolean | JSSOptions,
): Record<string, string> {
  // Empty
  if (nameOrVars === undefined) return {}
  if (typeof nameOrVars === 'object' && nameOrVars !== null) {
    if (Object.keys(nameOrVars).length === 0) return {}
    const opts = (typeof fallbackOrSemiOrOptions === 'object' && fallbackOrSemiOrOptions !== null && !Array.isArray(fallbackOrSemiOrOptions)
      ? fallbackOrSemiOrOptions as JSSOptions
      : {}) as JSSOptions
    const withSemi = opts.semi ?? false
    const prefix = opts.prefix
    return Object.fromEntries(
      Object.entries(nameOrVars).map(([key, value]) => {
        validateCornerName(key)
        const base = extractCornerBaseName(key)
        const result = `var(${applyPrefix(key, prefix)}, var(${applyPrefix(base, prefix)}, ${value}))`
        return [stripDashPrefix(key), withSemi ? `${result};` : result]
      }),
    )
  }

  // String input
  const name = nameOrVars
  validateCornerName(name)
  const base = extractCornerBaseName(name)
  const recordKey = stripDashPrefix(name)

  // Check for options object in the third position
  if (semiOrOptions && typeof semiOrOptions === 'object' && !Array.isArray(semiOrOptions)) {
    const opts = semiOrOptions as JSSOptions
    const withSemi = opts.semi ?? false
    const prefix = opts.prefix
    const fallback = fallbackOrSemiOrOptions as string
    const result = `var(${applyPrefix(name, prefix)}, var(${applyPrefix(base, prefix)}, ${fallback}))`
    return { [recordKey]: withSemi ? `${result};` : result }
  }

  // Check for options object in the second position (no fallback case)
  if (fallbackOrSemiOrOptions && typeof fallbackOrSemiOrOptions === 'object' && !Array.isArray(fallbackOrSemiOrOptions)) {
    const opts = fallbackOrSemiOrOptions as JSSOptions
    const withSemi = opts.semi ?? false
    const prefix = opts.prefix
    const result = `var(${applyPrefix(name, prefix)}, var(${applyPrefix(base, prefix)}))`
    return { [recordKey]: withSemi ? `${result};` : result }
  }

  if (typeof fallbackOrSemiOrOptions === 'boolean') {
    // (name, true) — no fallback, with semicolon
    const result = `var(${varName(name)}, var(${varName(base)}))`
    return { [recordKey]: `${result};` }
  }

  if (fallbackOrSemiOrOptions === undefined) {
    // (name) — no fallback
    const result = `var(${varName(name)}, var(${varName(base)}))`
    return { [recordKey]: result }
  }

  // (name, fallback) or (name, fallback, semi)
  const fallback = fallbackOrSemiOrOptions
  const withSemi = (typeof semiOrOptions === 'boolean') ? semiOrOptions : false
  const result = `var(${varName(name)}, var(${varName(base)}, ${fallback}))`
  return { [recordKey]: withSemi ? `${result};` : result }
}
