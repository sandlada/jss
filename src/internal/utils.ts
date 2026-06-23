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
