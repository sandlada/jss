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
} from './internal/utils.js'

import type { StripDash } from './internal/utils.js'

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

/** (name, fallback, options) → string[] (generic, with prefix/semi) */
export function useVars<N extends string, F extends string>(
    name: N,
    fallback: F,
    options: JSSOptions,
): string[]

/** ({name: fallback}) → array */
export function useVars<const T extends Record<string, string>>(
    vars: T,
): UseVarsArrayResult<T, false>

/** ({name: fallback}, options) → string[] (generic, with prefix/semi) */
export function useVars<const T extends Record<string, string>>(
    vars: T,
    options: JSSOptions,
): string[]

/** ([chain], fallback) → 1‑element tuple (fallback chain) */
export function useVars<
    const Names extends readonly string[],
    F extends string,
>(names: Names, finalFallback: F): [BuildVarChainWithFallback<Names, F>]

/** ([chain], fallback, options) → string[] (generic, with prefix/semi) */
export function useVars<
    const Names extends readonly string[],
    F extends string,
>(names: Names, finalFallback: F, options: JSSOptions): string[]

/** ([chain], '') → empty fallback slot */
export function useVars<const Names extends readonly string[]>(
    names: Names,
    finalFallback: '',
): [BuildVarChainWithFallback<Names, ''>]

/** ([chain]) → no fallback */
export function useVars<const Names extends readonly string[]>(
    names: Names,
): [BuildVarChainNoFallback<Names>]

/** ([chain], options) → string[] (generic, no fallback with prefix/semi) */
export function useVars<const Names extends readonly string[]>(
    names: Names,
    options: JSSOptions,
): string[]

// ── Implementation ──

export function useVars(
    nameOrNamesOrVars: string | readonly string[] | Record<string, UseVarValue>,
    fallbackOrSemiOrOptions?: string | boolean | JSSOptions,
    semiOrOptions?: boolean | JSSOptions,
): string[] {
    // Object input
    if (
        typeof nameOrNamesOrVars === 'object' &&
        !Array.isArray(nameOrNamesOrVars) &&
        nameOrNamesOrVars !== null
    ) {
        const opts = (
            fallbackOrSemiOrOptions && typeof fallbackOrSemiOrOptions === 'object' && !Array.isArray(fallbackOrSemiOrOptions)
                ? fallbackOrSemiOrOptions as JSSOptions
                : {}
        ) as JSSOptions
        const withSemi = opts.semi ?? false
        const prefix = opts.prefix
        return Object.entries(nameOrNamesOrVars).map(([key, value]) => {
            if (isChainValue(value)) {
                const [chain, final] = value
                const inner = buildVarChain(chain, final)
                const result = `var(${applyPrefix(key, prefix)}, ${inner})`
                return withSemi ? `${result};` : result
            }
            const result = `var(${applyPrefix(key, prefix)}, ${value})`
            return withSemi ? `${result};` : result
        })
    }

    // Fallback chain: first arg is an array
    if (Array.isArray(nameOrNamesOrVars)) {
        const names = nameOrNamesOrVars
        const opts = (
            semiOrOptions && typeof semiOrOptions === 'object' && !Array.isArray(semiOrOptions)
                ? semiOrOptions as JSSOptions
                : fallbackOrSemiOrOptions && typeof fallbackOrSemiOrOptions === 'object' && !Array.isArray(fallbackOrSemiOrOptions)
                    ? fallbackOrSemiOrOptions as JSSOptions
                    : {}
        ) as JSSOptions
        const withSemi = opts.semi ?? false
        const prefix = opts.prefix
        const fallback = typeof fallbackOrSemiOrOptions === 'string' ? fallbackOrSemiOrOptions : undefined

        // For fallback chain with prefix, wrap the chain in applyPrefix at the outermost level
        // The chain elements use varName normally, but the outer var() reference uses applyPrefix
        if (prefix) {
            const inner = buildVarChain(names.slice(1) as readonly string[], fallback)
            const result = `var(${applyPrefix(names[0]!, prefix)}, ${inner})`
            return [withSemi ? `${result};` : result]
        }

        const result = buildVarChain(names, fallback)
        return [withSemi ? `${result};` : result]
    }

    // Simple (name, fallback)
    const name = nameOrNamesOrVars
    const opts = (
        semiOrOptions && typeof semiOrOptions === 'object' && !Array.isArray(semiOrOptions)
            ? semiOrOptions as JSSOptions
            : {}
    ) as JSSOptions
    const withSemi = opts.semi ?? false
    const prefix = opts.prefix
    const fallback = fallbackOrSemiOrOptions as string
    const result = `var(${applyPrefix(name, prefix)}, ${fallback})`
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

/** (name, fallback, options) → Record<string, string> (generic, with prefix/semi) */
export function useVarsRecord<N extends string, F extends string>(
    name: N,
    fallback: F,
    options: JSSOptions,
): Record<string, string>

/** ({name: fallback}) → object input */
export function useVarsRecord<const T extends Record<string, string>>(
    vars: T,
): UseVarsRecordResult<T, false>

/** ({name: fallback}, options) → Record<string, string> (generic, with prefix/semi) */
export function useVarsRecord<const T extends Record<string, string>>(
    vars: T,
    options: JSSOptions,
): Record<string, string>

/** ([chain], fallback) → record with first name as key */
export function useVarsRecord<
    const Names extends readonly string[],
    F extends string,
>(names: Names, finalFallback: F): {
        [K in Names[0]]: BuildVarChainWithFallback<Names, F>
    }

/** ([chain], fallback, options) → Record<string, string> (generic, with prefix/semi) */
export function useVarsRecord<
    const Names extends readonly string[],
    F extends string,
>(names: Names, finalFallback: F, options: JSSOptions): Record<string, string>

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

/** ([chain], options) → Record<string, string> (generic, no fallback with prefix/semi) */
export function useVarsRecord<const Names extends readonly string[]>(
    names: Names,
    options: JSSOptions,
): Record<string, string>

/** ({name: [[chain], fallback]}) → nested chain (needs runtime overload) */

// ── Implementation ──

export function useVarsRecord(
    nameOrNamesOrVars: string | readonly string[] | Record<string, UseVarValue>,
    fallbackOrSemiOrOptions?: string | boolean | JSSOptions,
    semiOrOptions?: boolean | JSSOptions,
): Record<string, string> {
    // Object input
    if (
        typeof nameOrNamesOrVars === 'object' &&
        !Array.isArray(nameOrNamesOrVars) &&
        nameOrNamesOrVars !== null
    ) {
        const opts = (typeof fallbackOrSemiOrOptions === 'object' && fallbackOrSemiOrOptions !== null && !Array.isArray(fallbackOrSemiOrOptions)
            ? fallbackOrSemiOrOptions as JSSOptions
            : {}) as JSSOptions
        const withSemi = opts.semi ?? false
        const prefix = opts.prefix
        const entries = Object.entries(nameOrNamesOrVars).map(([key, value]) => {
            const recordKey = stripDashPrefix(key)
            if (isChainValue(value)) {
                const [chain, final] = value
                const inner = buildVarChain(chain, final)
                const result = `var(${applyPrefix(key, prefix)}, ${inner})`
                return [recordKey, withSemi ? `${result};` : result] as [string, string]
            }
            const result = `var(${applyPrefix(key, prefix)}, ${value})`
            return [recordKey, withSemi ? `${result};` : result] as [string, string]
        })
        return Object.fromEntries(entries)
    }

    // Fallback chain: first arg is an array
    if (Array.isArray(nameOrNamesOrVars)) {
        const names = nameOrNamesOrVars
        const opts = (semiOrOptions && typeof semiOrOptions === 'object' && !Array.isArray(semiOrOptions)
            ? semiOrOptions as JSSOptions
            : fallbackOrSemiOrOptions && typeof fallbackOrSemiOrOptions === 'object' && !Array.isArray(fallbackOrSemiOrOptions)
                ? fallbackOrSemiOrOptions as JSSOptions
                : {}) as JSSOptions
        const withSemi = opts.semi ?? false
        const prefix = opts.prefix
        const fallback = typeof fallbackOrSemiOrOptions === 'string' ? fallbackOrSemiOrOptions : undefined

        if (prefix) {
            const inner = buildVarChain(names.slice(1) as readonly string[], fallback)
            const result = `var(${applyPrefix(names[0]!, prefix)}, ${inner})`
            return { [names[0]!]: withSemi ? `${result};` : result }
        }

        const result = buildVarChain(names, fallback)
        return { [names[0]!]: withSemi ? `${result};` : result }
    }

    // Simple (name, fallback)
    const name = nameOrNamesOrVars
    const opts = (semiOrOptions && typeof semiOrOptions === 'object' && !Array.isArray(semiOrOptions)
        ? semiOrOptions as JSSOptions
        : {}) as JSSOptions
    const withSemi = opts.semi ?? false
    const prefix = opts.prefix
    const fallback = fallbackOrSemiOrOptions as string
    const recordKey = stripDashPrefix(name)
    const result = `var(${applyPrefix(name, prefix)}, ${fallback})`
    return { [recordKey]: withSemi ? `${result};` : result }
}
