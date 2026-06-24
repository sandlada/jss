import {
  type NormalizeVarName,
  type BuildVarChainWithFallback,
  type BuildVarChainNoFallback,
  type WithSemi,
  type JSSOptions,
  varName,
  stripDashPrefix,
  buildVarChain,
  applyPrefix,
  parseOptions,
} from './internal/utils.js'
import { assertNoUnderscorePrefix } from './internal/validators.js'

// ── Internal-name helpers ──

/**
 * Ensure exactly `--_` prefix at the type level.
 * Input `'color'` → `'--_color'`, input `'--color'` → `'--_color'`.
 */
type InternalVarName<N extends string> = N extends `--${infer R}`
  ? `--_${R}`
  : `--_${N}`

/**
 * Strip `--_` or `--` prefix from a string type to get the bare record key.
 * For `useInternalVarsRecord` the key becomes `_name`.
 */
type InternalRecordKey<N extends string> = N extends `--${infer R}` ? `_${R}` : `_${N}`

/** BuildVarChain using `--_` prefix */
type InternalBuildVarChainWithFallback<
  Names extends readonly string[],
  F extends string,
> = Names extends readonly [...infer Rest extends readonly string[], infer Last extends string]
  ? Rest extends readonly []
    ? `var(${InternalVarName<Last>}, ${F})`
    : `var(${InternalVarName<Last>}, ${InternalBuildVarChainWithFallback<Rest, F>})`
  : F

type InternalBuildVarChainNoFallback<Names extends readonly string[]> =
  Names extends readonly [...infer Rest extends readonly string[], infer Last extends string]
    ? Rest extends readonly []
      ? `var(${InternalVarName<Last>})`
      : `var(${InternalVarName<Last>}, ${InternalBuildVarChainNoFallback<Rest>})`
    : never

/** Check if a value is a [chain, fallback] pair at runtime */
function isChainValue(v: unknown): v is [readonly string[], string] {
  return (
    Array.isArray(v) &&
    v.length === 2 &&
    Array.isArray(v[0]) &&
    typeof v[1] === 'string'
  )
}

type InternalUseVarValue = string | [readonly string[], string]

// ────────────────────────────────────────────────────────────────────────────
// useInternalVars  (array variant)
// ────────────────────────────────────────────────────────────────────────────

/** (name, fallback) → var(--_name, fallback) */
export function useInternalVars<N extends string, F extends string>(
  name: N,
  fallback: F,
): [`var(${InternalVarName<N>}, ${F})`]

/** (name, fallback, true) → semicolon */
export function useInternalVars<N extends string, F extends string>(
  name: N,
  fallback: F,
  semi: true,
): [WithSemi<`var(${InternalVarName<N>}, ${F})`>]

/** ({name: fallback}) → object input */
export function useInternalVars<const T extends Record<string, string>>(
  vars: T,
): Array<{ [K in keyof T]: `var(${InternalVarName<K & string>}, ${T[K]})` }[keyof T]>

/** ({name: fallback}, true) → object with semicolon */
export function useInternalVars<const T extends Record<string, string>>(
  vars: T,
  semi: true,
): Array<{ [K in keyof T]: WithSemi<`var(${InternalVarName<K & string>}, ${T[K]})`> }[keyof T]>

/** ([chain], fallback) → all with --_ prefix */
export function useInternalVars<
  const Names extends readonly string[],
  F extends string,
>(names: Names, finalFallback: F): [InternalBuildVarChainWithFallback<Names, F>]

/** ([chain], fallback, true) → semicolon */
export function useInternalVars<
  const Names extends readonly string[],
  F extends string,
>(names: Names, finalFallback: F, semi: true): [
  WithSemi<InternalBuildVarChainWithFallback<Names, F>>,
]

/** ([chain], '') → empty fallback */
export function useInternalVars<const Names extends readonly string[]>(
  names: Names,
  finalFallback: '',
): [InternalBuildVarChainWithFallback<Names, ''>]

/** ([chain]) → no fallback */
export function useInternalVars<const Names extends readonly string[]>(
  names: Names,
): [InternalBuildVarChainNoFallback<Names>]

/** ([chain], true) → no fallback with semi */
export function useInternalVars<const Names extends readonly string[]>(
  names: Names,
  semi: true,
): [WithSemi<InternalBuildVarChainNoFallback<Names>>]

// ── Implementation ──

export function useInternalVars(
  nameOrNamesOrVars: string | readonly string[] | Record<string, InternalUseVarValue>,
  fallbackOrSemi?: string | boolean,
  semi?: boolean,
): string[] {
  // Object input
  if (
    typeof nameOrNamesOrVars === 'object' &&
    !Array.isArray(nameOrNamesOrVars) &&
    nameOrNamesOrVars !== null
  ) {
    const withSemi = fallbackOrSemi === true
    return Object.entries(nameOrNamesOrVars).map(([key, value]) => {
      // Validate — keys must not start with _ or --_
      assertNoUnderscorePrefix(key)

      if (isChainValue(value)) {
        const [chain, final] = value
        const inner = buildVarChain(chain, final)
        // Prepend the main key with --_ prefix for the outer var()
        const result = `var(${internalVarName(key)}, ${internalizeChain(inner)})`
        return withSemi ? `${result};` : result
      }
      const result = `var(${internalVarName(key)}, ${value})`
      return withSemi ? `${result};` : result
    })
  }

  // Fallback chain: first arg is an array
  if (Array.isArray(nameOrNamesOrVars)) {
    const names = nameOrNamesOrVars
    const withSemi = semi === true || (typeof fallbackOrSemi === 'boolean' ? fallbackOrSemi : false)
    const fallback = typeof fallbackOrSemi === 'string' ? fallbackOrSemi : undefined

    // Build the chain with --_ prefix via internal buildVarChain
    const result = internalBuildVarChain(names, fallback)
    return [withSemi ? `${result};` : result]
  }

  // Simple (name, fallback)
  const name = nameOrNamesOrVars
  assertNoUnderscorePrefix(name)
  const fallback = fallbackOrSemi as string
  const withSemi = semi === true
  const result = `var(${internalVarName(name)}, ${fallback})`
  return [withSemi ? `${result};` : result]
}

// ────────────────────────────────────────────────────────────────────────────
// useInternalVarsRecord
// ────────────────────────────────────────────────────────────────────────────

/** (name, fallback) → record key is _name */
export function useInternalVarsRecord<N extends string, F extends string>(
  name: N,
  fallback: F,
): { [K in InternalRecordKey<N>]: `var(${InternalVarName<N>}, ${F})` }

/** ({name: value}) → record keys with _ prefix */
export function useInternalVarsRecord<const T extends Record<string, string>>(
  vars: T,
): {
  [K in keyof T as InternalRecordKey<K & string>]: `var(${InternalVarName<K & string>}, ${T[K]})`
}

/** ({name: value}, options) → Record<string, string> (generic, with prefix/semi) */
export function useInternalVarsRecord<const T extends Record<string, string>>(
  vars: T,
  options: JSSOptions,
): Record<string, string>

// ── Implementation ──

export function useInternalVarsRecord(
  nameOrVars: string | Record<string, string>,
  maybeSemiOrOptions?: string | boolean | JSSOptions,
): Record<string, string> {
  if (typeof nameOrVars === 'object' && nameOrVars !== null) {
    const opts = (typeof maybeSemiOrOptions === 'object' && maybeSemiOrOptions !== null && !Array.isArray(maybeSemiOrOptions)
      ? maybeSemiOrOptions as JSSOptions
      : {}) as JSSOptions
    const withSemi = opts.semi ?? false
    const prefix = opts.prefix
    const entries = Object.entries(nameOrVars).map(([key, value]) => {
      assertNoUnderscorePrefix(key)
      const recordKey = `_${stripDashPrefix(key)}`
      // When prefix is set, replace --_ with the user prefix via applyPrefix
      const varName = prefix ? applyPrefix(key, prefix) : internalVarName(key)
      const result = `var(${varName}, ${value})`
      return [recordKey, withSemi ? `${result};` : result] as [string, string]
    })
    return Object.fromEntries(entries)
  }

  const name = nameOrVars as string
  assertNoUnderscorePrefix(name)
  const fallback = maybeSemiOrOptions as string
  const recordKey = `_${stripDashPrefix(name)}`
  const result = `var(${internalVarName(name)}, ${fallback})`
  return { [recordKey]: result }
}

// ── Internal helpers ──

/**
 * Convert a normal name to its internal form (ensure `--_` prefix).
 * `'color'` → `'--_color'`, `'--color'` → `'--_color'`
 */
function internalVarName(name: string): string {
  const stripped = name.startsWith('--') ? name.slice(2) : name
  return `--_${stripped}`
}

/**
 * Build a var chain with `--_` prefix for each name.
 */
function internalBuildVarChain(
  names: readonly string[],
  finalFallback?: string,
): string {
  if (names.length === 0) return ''
  const reversed = [...names].reverse()
  const [last, ...rest] = reversed

  let result: string
  if (finalFallback === undefined) {
    result = `var(${internalVarName(last)})`
  } else {
    result = `var(${internalVarName(last)}, ${finalFallback})`
  }

  for (const name of rest) {
    result = `var(${internalVarName(name)}, ${result})`
  }

  return result
}

/**
 * Internalize `--` prefixes in a pre‑built var chain string.
 * Replaces `var(--` with `var(--_` for every occurrence.
 */
function internalizeChain(chain: string): string {
  return chain.replace(/var\(--/g, 'var(--_')
}
