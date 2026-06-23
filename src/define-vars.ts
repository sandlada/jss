import {
  type NormalizeVarName,
  type BuildVarChainWithFallback,
  type BuildVarChainNoFallback,
  type WithSemi,
  varName,
  buildVarChain,
} from './internal/utils.js'

// ── Return-type helpers ──

type DefineVarsArrayResult<
  T extends Record<string, string>,
  S extends boolean,
> = Array<{
  [K in keyof T]: S extends true
    ? WithSemi<`${NormalizeVarName<K & string>}: ${T[K]}`>
    : `${NormalizeVarName<K & string>}: ${T[K]}`
}[keyof T]>

// ── Overloads ──

/** Simple: (name, value) */
export function defineVars<N extends string, V extends string>(
  name: N,
  value: V,
): [`${NormalizeVarName<N>}: ${V}`]

/** Simple + semicolon */
export function defineVars<N extends string, V extends string>(
  name: N,
  value: V,
  semi: true,
): [WithSemi<`${NormalizeVarName<N>}: ${V}`>]

/** Object input */
export function defineVars<const T extends Record<string, string>>(
  vars: T,
): DefineVarsArrayResult<T, false>

/** Object input + semicolon */
export function defineVars<const T extends Record<string, string>>(
  vars: T,
  semi: true,
): DefineVarsArrayResult<T, true>

/** Fallback chain: (name, [chain], fallback) */
export function defineVars<
  N extends string,
  const Names extends readonly string[],
  F extends string,
>(name: N, names: Names, finalFallback: F): [
  `${NormalizeVarName<N>}: ${BuildVarChainWithFallback<Names, F>}`,
]

/** Fallback chain + semicolon: (name, [chain], fallback, true) */
export function defineVars<
  N extends string,
  const Names extends readonly string[],
  F extends string,
>(name: N, names: Names, finalFallback: F, semi: true): [
  WithSemi<`${NormalizeVarName<N>}: ${BuildVarChainWithFallback<Names, F>}`>,
]

/** Fallback chain, no fallback: (name, [chain]) */
export function defineVars<
  N extends string,
  const Names extends readonly string[],
>(name: N, names: Names): [
  `${NormalizeVarName<N>}: ${BuildVarChainNoFallback<Names>}`,
]

/** Fallback chain, no fallback + semicolon: (name, [chain], true) */
export function defineVars<
  N extends string,
  const Names extends readonly string[],
>(name: N, names: Names, semi: true): [
  WithSemi<`${NormalizeVarName<N>}: ${BuildVarChainNoFallback<Names>}`>,
]

// ── Implementation ──

export function defineVars(
  nameOrVars: string | Record<string, string>,
  valueOrNamesOrSemi?: string | readonly string[] | boolean,
  fallbackOrSemi?: string | boolean,
  semi?: boolean,
): string[] {
  // ── Object input ──
  if (typeof nameOrVars === 'object' && nameOrVars !== null) {
    const withSemi = valueOrNamesOrSemi === true
    return Object.entries(nameOrVars).map(
      ([k, v]) => `${varName(k)}: ${v}${withSemi ? ';' : ''}`,
    )
  }

  const name = nameOrVars as string
  const second = valueOrNamesOrSemi

  // ── Fallback chain (second arg is an array) ──
  if (Array.isArray(second)) {
    let finalFallback: string | undefined
    let withSemi = false

    if (typeof fallbackOrSemi === 'string') {
      finalFallback = fallbackOrSemi
      withSemi = semi === true
    } else if (typeof fallbackOrSemi === 'boolean') {
      withSemi = fallbackOrSemi
    }

    const chain = buildVarChain(second, finalFallback)
    return [`${varName(name)}: ${chain}${withSemi ? ';' : ''}`]
  }

  // ── Simple (name, value) ──
  const value = second as string
  const withSemi = fallbackOrSemi === true
  return [`${varName(name)}: ${value}${withSemi ? ';' : ''}`]
}
