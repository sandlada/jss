// ── Type helpers ──

/** Strip `--` prefix from a string type */
export type StripDash<S extends string> = S extends `--${infer R}` ? R : S

/** Ensure exactly one `--` prefix */
export type NormalizeVarName<N extends string> = N extends `--${infer R}` ? `--${R}` : `--${N}`

/** Semicolon suffix helper */
export type WithSemi<S extends string> = `${S};`

// ── BuildVarChain types ──

/** Build nested `var()` chain **with** a fallback value (non‑empty or empty `''`) */
export type BuildVarChainWithFallback<
  Names extends readonly string[],
  F extends string,
> = Names extends readonly [...infer Rest extends readonly string[], infer Last extends string]
  ? Rest extends readonly []
    ? `var(${NormalizeVarName<Last>}, ${F})`
    : `var(${NormalizeVarName<Last>}, ${BuildVarChainWithFallback<Rest, F>})`
  : F

/** Build nested `var()` chain **without** any fallback */
export type BuildVarChainNoFallback<Names extends readonly string[]> =
  Names extends readonly [...infer Rest extends readonly string[], infer Last extends string]
    ? Rest extends readonly []
      ? `var(${NormalizeVarName<Last>})`
      : `var(${NormalizeVarName<Last>}, ${BuildVarChainNoFallback<Rest>})`
    : never

// ── Runtime helpers ──

/** Normalise a name so it always has exactly one `--` prefix. */
export function varName<N extends string>(name: N): NormalizeVarName<N> {
  return (name.startsWith('--') ? name : `--${name}`) as any
}

/** Strip `--` prefix from a string. */
export function stripDashPrefix<S extends string>(s: S): StripDash<S> {
  return (s.startsWith('--') ? s.slice(2) : s) as any
}

// ── JSSOptions ──

/** Shared options for JSS functions that support semi and prefix. */
export interface JSSOptions {
  /** Append semicolons to output values */
  semi?: boolean
  /**
   * CSS variable prefix to apply.
   * Replaces the `--` prefix on variable names with the given prefix + `-`.
   * @example `'--md-badge'` → `var(--md-badge-color-primary, blue)` instead of `var(--color-primary, blue)`
   */
  prefix?: string
}

/**
 * Normalize a `JSSOptions` or `boolean` (legacy) to a resolved options object.
 * This handles backward compat where `semi` was passed as a bare boolean.
 */
export function parseOptions(semiOrOptions?: boolean | JSSOptions): {
  semi: boolean
  prefix: string | undefined
} {
  if (typeof semiOrOptions === 'boolean') {
    return { semi: semiOrOptions, prefix: undefined }
  }
  if (semiOrOptions && typeof semiOrOptions === 'object') {
    return {
      semi: semiOrOptions.semi ?? false,
      prefix: semiOrOptions.prefix,
    }
  }
  return { semi: false, prefix: undefined }
}

/**
 * Apply a CSS variable prefix to a name.
 *
 * @param name - The CSS variable name (with or without `--` prefix)
 * @param prefix - The prefix to apply (e.g. `'--md-badge'`)
 * @returns The prefixed CSS variable name
 *
 * @example
 * applyPrefix('color-primary', '--md-badge') → '--md-badge-color-primary'
 * applyPrefix('--color-primary', '--md-badge') → '--md-badge-color-primary'
 * applyPrefix('color-primary', undefined) → '--color-primary'
 */
export function applyPrefix(name: string, prefix?: string): string {
  if (!prefix) return varName(name)
  const bareName = name.startsWith('--') ? name.slice(2) : name
  return `${prefix}-${bareName}`
}

/**
 * Build a nested `var()` chain.
 *
 * @example
 * buildVarChain(['b', 'c'], 'x') → 'var(--b, var(--c, x))'
 * buildVarChain(['b', 'c'])      → 'var(--b, var(--c))'
 * buildVarChain(['b', 'c'], '')  → 'var(--b, var(--c, ))'
 */
export function buildVarChain(
  names: readonly string[],
  finalFallback?: string,
): string {
  if (names.length === 0) return ''

  const reversed = [...names].reverse()
  const [last, ...rest] = reversed

  let result: string
  if (finalFallback === undefined) {
    result = `var(${varName(last)})`
  } else {
    result = `var(${varName(last)}, ${finalFallback})`
  }

  for (const name of rest) {
    result = `var(${varName(name)}, ${result})`
  }

  return result
}
