import {
  type NormalizeVarName,
  type WithSemi,
  varName,
  stripDashPrefix,
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

/** (corner, fallback, true) → semicolon */
export function useLogicalBorderRadiusVars<
  N extends `${string}${CornerSuffix}`,
  F extends string,
>(name: N, fallback: F, semi: true): [WithSemi<LogicalRadiusVar<N, F>>]

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

/** ({corner: fallback}, true) → object with semicolon */
export function useLogicalBorderRadiusVars<
  const T extends Record<`${string}${CornerSuffix}`, string>,
>(vars: T, semi: true): Array<{
  [K in keyof T]: WithSemi<LogicalRadiusVar<K & string, T[K] & string>>
}[keyof T]>

/** () → empty */
export function useLogicalBorderRadiusVars(): []

/** ({}) → empty */
export function useLogicalBorderRadiusVars(vars: {}): []

// ── Implementation ──

export function useLogicalBorderRadiusVars(
  nameOrVars?: string | Record<string, string>,
  fallbackOrSemi?: string | boolean,
  semi?: boolean,
): string[] {
  // Empty
  if (nameOrVars === undefined) return []
  if (typeof nameOrVars === 'object' && nameOrVars !== null) {
    if (Object.keys(nameOrVars).length === 0) return []
    const withSemi = fallbackOrSemi === true
    return Object.entries(nameOrVars).map(([key, value]) => {
      validateCornerName(key)
      const base = extractCornerBaseName(key)
      const result = `var(${varName(key)}, var(${varName(base)}, ${value}))`
      return withSemi ? `${result};` : result
    })
  }

  // String input
  const name = nameOrVars
  validateCornerName(name)
  const base = extractCornerBaseName(name)

  if (typeof fallbackOrSemi === 'boolean') {
    // (name, true) — no fallback, with semicolon
    const result = `var(${varName(name)}, var(${varName(base)}))`
    return [`${result};`]
  }

  if (fallbackOrSemi === undefined) {
    // (name) — no fallback, no semicolon
    const result = `var(${varName(name)}, var(${varName(base)}))`
    return [result]
  }

  // (name, fallback) or (name, fallback, semi)
  const fallback = fallbackOrSemi
  const withSemi = semi === true
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

/** (corner, fallback, true) → semicolon */
export function useLogicalBorderRadiusVarsRecord<
  N extends `${string}${CornerSuffix}`,
  F extends string,
>(name: N, fallback: F, semi: true): {
  [K in RecordKey<N>]: WithSemi<LogicalRadiusVar<N, F>>
}

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

/** ({corner: fallback}, true) → semicolon */
export function useLogicalBorderRadiusVarsRecord<
  const T extends Record<`${string}${CornerSuffix}`, string>,
>(vars: T, semi: true): {
  [K in keyof T as RecordKey<K & string>]: WithSemi<LogicalRadiusVar<K & string, T[K] & string>>
}

/** () → empty */
export function useLogicalBorderRadiusVarsRecord(): Record<string, never>

/** ({}) → empty */
export function useLogicalBorderRadiusVarsRecord(vars: {}): Record<string, never>

// ── Implementation ──

export function useLogicalBorderRadiusVarsRecord(
  nameOrVars?: string | Record<string, string>,
  fallbackOrSemi?: string | boolean,
  semi?: boolean,
): Record<string, string> {
  // Empty
  if (nameOrVars === undefined) return {}
  if (typeof nameOrVars === 'object' && nameOrVars !== null) {
    if (Object.keys(nameOrVars).length === 0) return {}
    return Object.fromEntries(
      Object.entries(nameOrVars).map(([key, value]) => {
        validateCornerName(key)
        const base = extractCornerBaseName(key)
        const withSemi = fallbackOrSemi === true
        const result = `var(${varName(key)}, var(${varName(base)}, ${value}))`
        return [stripDashPrefix(key), withSemi ? `${result};` : result]
      }),
    )
  }

  // String input
  const name = nameOrVars
  validateCornerName(name)
  const base = extractCornerBaseName(name)
  const recordKey = stripDashPrefix(name)

  if (typeof fallbackOrSemi === 'boolean') {
    // (name, true) — no fallback, with semicolon
    const result = `var(${varName(name)}, var(${varName(base)}))`
    return { [recordKey]: `${result};` }
  }

  if (fallbackOrSemi === undefined) {
    // (name) — no fallback
    const result = `var(${varName(name)}, var(${varName(base)}))`
    return { [recordKey]: result }
  }

  // (name, fallback) or (name, fallback, semi)
  const fallback = fallbackOrSemi
  const withSemi = semi === true
  const result = `var(${varName(name)}, var(${varName(base)}, ${fallback}))`
  return { [recordKey]: withSemi ? `${result};` : result }
}
