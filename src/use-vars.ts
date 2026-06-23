import {
    type NormalizeVarName,
    type BuildVarChainWithFallback,
    type BuildVarChainNoFallback,
    type WithSemi,
    varName,
    stripDashPrefix,
    buildVarChain,
} from './internal/utils.js'

// ── Types ──

/** A single var-entry value: plain string, or a [chain, finalFallback] pair */
type UseVarValue = string | [readonly string[], string]

type UseVarsArrayResult<T extends Record<string, UseVarValue>, S extends boolean> =
    Array<{
        [K in keyof T]: T[K] extends readonly [
            infer Chain extends readonly string[],
            infer F extends string,
        ]
        ? S extends true
        ? WithSemi<BuildVarChainWithFallback<[K & string, ...Chain], F>>
        : BuildVarChainWithFallback<[K & string, ...Chain], F>
        : S extends true
        ? WithSemi<`var(${NormalizeVarName<K & string>}, ${T[K] & string})`>
        : `var(${NormalizeVarName<K & string>}, ${T[K] & string})`
    }[keyof T]>

type UseVarsRecordResult<T extends Record<string, UseVarValue>, S extends boolean> = {
    [K in keyof T]: T[K] extends readonly [
        infer Chain extends readonly string[],
        infer F extends string,
    ]
    ? S extends true
    ? WithSemi<BuildVarChainWithFallback<[K & string, ...Chain], F>>
    : BuildVarChainWithFallback<[K & string, ...Chain], F>
    : S extends true
      ? WithSemi<`var(${NormalizeVarName<K & string>}, ${T[K] & string})`>
      : `var(${NormalizeVarName<K & string>}, ${T[K] & string})`
}

/** Check if a value is a [chain, fallback] pair at runtime */
function isChainValue(v: unknown): v is [readonly string[], string] {
    return (
        Array.isArray(v) &&
        v.length === 2 &&
        Array.isArray(v[0]) &&
        typeof v[1] === 'string'
    )
}

// ────────────────────────────────────────────────────────────────────────────
// useVars  (array variant)
// ────────────────────────────────────────────────────────────────────────────

/** (name, fallback) → 1‑element tuple */
export function useVars<N extends string, F extends string>(
    name: N,
    fallback: F,
): [`var(${NormalizeVarName<N>}, ${F})`]

/** (name, fallback, true) → 1‑element tuple with semicolon */
export function useVars<N extends string, F extends string>(
    name: N,
    fallback: F,
    semi: true,
): [WithSemi<`var(${NormalizeVarName<N>}, ${F})`>]

/** ({name: fallback}) → array */
export function useVars<const T extends Record<string, string>>(
    vars: T,
): UseVarsArrayResult<T, false>

/** ({name: fallback}, true) → array with semicolons */
export function useVars<const T extends Record<string, string>>(
    vars: T,
    semi: true,
): UseVarsArrayResult<T, true>

/** ([chain], fallback) → 1‑element tuple (fallback chain) */
export function useVars<
    const Names extends readonly string[],
    F extends string,
>(names: Names, finalFallback: F): [BuildVarChainWithFallback<Names, F>]

/** ([chain], fallback, true) → with semicolon */
export function useVars<
    const Names extends readonly string[],
    F extends string,
>(names: Names, finalFallback: F, semi: true): [
        WithSemi<BuildVarChainWithFallback<Names, F>>,
    ]

/** ([chain], '') → empty fallback slot */
export function useVars<const Names extends readonly string[]>(
    names: Names,
    finalFallback: '',
): [BuildVarChainWithFallback<Names, ''>]

/** ([chain], '', true) → empty fallback with semi */
export function useVars<const Names extends readonly string[]>(
    names: Names,
    finalFallback: '',
    semi: true,
): [WithSemi<BuildVarChainWithFallback<Names, ''>>]

/** ([chain]) → no fallback */
export function useVars<const Names extends readonly string[]>(
    names: Names,
): [BuildVarChainNoFallback<Names>]

/** ([chain], true) → no fallback with semi */
export function useVars<const Names extends readonly string[]>(
    names: Names,
    semi: true,
): [WithSemi<BuildVarChainNoFallback<Names>>]

// ── Implementation ──

export function useVars(
    nameOrNamesOrVars: string | readonly string[] | Record<string, UseVarValue>,
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
            if (isChainValue(value)) {
                const [chain, final] = value
                const inner = buildVarChain(chain, final)
                const result = `var(${varName(key)}, ${inner})`
                return withSemi ? `${result};` : result
            }
            const result = `var(${varName(key)}, ${value})`
            return withSemi ? `${result};` : result
        })
    }

    // Fallback chain: first arg is an array
    if (Array.isArray(nameOrNamesOrVars)) {
        const names = nameOrNamesOrVars
        const withSemi = semi === true || (typeof fallbackOrSemi === 'boolean' ? fallbackOrSemi : false)
        const fallback = typeof fallbackOrSemi === 'string' ? fallbackOrSemi : undefined
        const result = buildVarChain(names, fallback)
        return [withSemi ? `${result};` : result]
    }

    // Simple (name, fallback)
    const name = nameOrNamesOrVars
    const fallback = fallbackOrSemi as string
    const withSemi = semi === true
    const result = `var(${varName(name)}, ${fallback})`
    return [withSemi ? `${result};` : result]
}

// ────────────────────────────────────────────────────────────────────────────
// useVarsRecord
// ────────────────────────────────────────────────────────────────────────────

/** (name, fallback) → record with one entry */
export function useVarsRecord<N extends string, F extends string>(
    name: N,
    fallback: F,
): { [K in StripDash<N>]: `var(${NormalizeVarName<N>}, ${F})` }

/** (name, fallback, true) → record with semicolon value */
export function useVarsRecord<N extends string, F extends string>(
    name: N,
    fallback: F,
    semi: true,
): { [K in StripDash<N>]: WithSemi<`var(${NormalizeVarName<N>}, ${F})`> }

/** ({name: fallback}) → object input */
export function useVarsRecord<const T extends Record<string, string>>(
    vars: T,
): UseVarsRecordResult<T, false>

/** ({name: fallback}, true) → object with semicolon */
export function useVarsRecord<const T extends Record<string, string>>(
    vars: T,
    semi: true,
): UseVarsRecordResult<T, true>

/** ([chain], fallback) → record with first name as key */
export function useVarsRecord<
    const Names extends readonly string[],
    F extends string,
>(names: Names, finalFallback: F): {
        [K in Names[0]]: BuildVarChainWithFallback<Names, F>
    }

/** ([chain], fallback, true) → semicolon */
export function useVarsRecord<
    const Names extends readonly string[],
    F extends string,
>(names: Names, finalFallback: F, semi: true): {
        [K in Names[0]]: WithSemi<BuildVarChainWithFallback<Names, F>>
    }

/** ([chain], '') → empty fallback */
export function useVarsRecord<const Names extends readonly string[]>(
    names: Names,
    finalFallback: '',
): {
        [K in Names[0]]: BuildVarChainWithFallback<Names, ''>
    }

/** ([chain]) → no fallback */
export function useVarsRecord<const Names extends readonly string[]>(
    names: Names,
): {
        [K in Names[0]]: BuildVarChainNoFallback<Names>
    }

/** ([chain], true) → no fallback with semi */
export function useVarsRecord<const Names extends readonly string[]>(
    names: Names,
    semi: true,
): {
        [K in Names[0]]: WithSemi<BuildVarChainNoFallback<Names>>
    }

/** ({name: [[chain], fallback]}) → nested chain (needs runtime overload) */

// ── Implementation ──

export function useVarsRecord(
    nameOrNamesOrVars: string | readonly string[] | Record<string, UseVarValue>,
    fallbackOrSemi?: string | boolean,
    semi?: boolean,
): Record<string, string> {
    // Object input
    if (
        typeof nameOrNamesOrVars === 'object' &&
        !Array.isArray(nameOrNamesOrVars) &&
        nameOrNamesOrVars !== null
    ) {
        const withSemi = fallbackOrSemi === true
        const entries = Object.entries(nameOrNamesOrVars).map(([key, value]) => {
            const recordKey = stripDashPrefix(key)
            if (isChainValue(value)) {
                const [chain, final] = value
                const inner = buildVarChain(chain, final)
                const result = `var(${varName(key)}, ${inner})`
                return [recordKey, withSemi ? `${result};` : result] as [string, string]
            }
            const result = `var(${varName(key)}, ${value})`
            return [recordKey, withSemi ? `${result};` : result] as [string, string]
        })
        return Object.fromEntries(entries)
    }

    // Fallback chain: first arg is an array
    if (Array.isArray(nameOrNamesOrVars)) {
        const names = nameOrNamesOrVars
        const withSemi = semi === true || (typeof fallbackOrSemi === 'boolean' ? fallbackOrSemi : false)
        const fallback = typeof fallbackOrSemi === 'string' ? fallbackOrSemi : undefined
        const result = buildVarChain(names, fallback)
        return { [names[0]!]: withSemi ? `${result};` : result }
    }

    // Simple (name, fallback)
    const name = nameOrNamesOrVars
    const fallback = fallbackOrSemi as string
    const withSemi = semi === true
    const recordKey = stripDashPrefix(name)
    const result = `var(${varName(name)}, ${fallback})`
    return { [recordKey]: withSemi ? `${result};` : result }
}

// Need StripDash at type level for useVarsRecord
import type { StripDash } from './internal/utils.js'
