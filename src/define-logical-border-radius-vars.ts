import type { NormalizeVarName, WithSemi } from './internal/utils.js'
import { varName } from './internal/utils.js'
import { LOGICAL_CORNERS, buildCornerName, type LogicalCorner } from './internal/logical-corners.js'

// ── Return-type helpers ──

/** 4‑tuple result for a single (base, value) call — array variant */
type DefineRadius4Tuple<B extends string, V extends string, S extends boolean> =
  S extends true
    ? [
        WithSemi<`${NormalizeVarName<B>}-start-start: ${V}`>,
        WithSemi<`${NormalizeVarName<B>}-start-end: ${V}`>,
        WithSemi<`${NormalizeVarName<B>}-end-start: ${V}`>,
        WithSemi<`${NormalizeVarName<B>}-end-end: ${V}`>,
      ]
    : [
        `${NormalizeVarName<B>}-start-start: ${V}`,
        `${NormalizeVarName<B>}-start-end: ${V}`,
        `${NormalizeVarName<B>}-end-start: ${V}`,
        `${NormalizeVarName<B>}-end-end: ${V}`,
      ]

/** Merged-array result for object input — array variant */
type DefineRadiusArrayResult<T extends Record<string, string>, S extends boolean> =
  Array<{
    [K in keyof T]: S extends true
      ? WithSemi<`${NormalizeVarName<K & string>}-${LogicalCorner}: ${T[K]}`>
      : `${NormalizeVarName<K & string>}-${LogicalCorner}: ${T[K]}`
  }[keyof T]>

// ────────────────────────────────────────────────────────────────────────────
// defineLogicalBorderRadiusVars  (array variant)
// ────────────────────────────────────────────────────────────────────────────

/** (base, value) → 4‑tuple */
export function defineLogicalBorderRadiusVars<
  B extends string,
  V extends string,
>(base: B, value: V): DefineRadius4Tuple<B, V, false>

/** (base, value, true) → 4‑tuple with semicolons */
export function defineLogicalBorderRadiusVars<
  B extends string,
  V extends string,
>(base: B, value: V, semi: true): DefineRadius4Tuple<B, V, true>

/** ({base: value}) → merged array */
export function defineLogicalBorderRadiusVars<
  const T extends Record<string, string>,
>(bases: T): DefineRadiusArrayResult<T, false>

/** ({base: value}, true) → merged array with semicolons */
export function defineLogicalBorderRadiusVars<
  const T extends Record<string, string>,
>(bases: T, semi: true): DefineRadiusArrayResult<T, true>

/** () → empty */
export function defineLogicalBorderRadiusVars(): []

// ── Implementation ──

export function defineLogicalBorderRadiusVars(
  baseOrBases?: string | Record<string, string>,
  valueOrSemi?: string | boolean,
  semi?: boolean,
): string[] {
  if (baseOrBases === undefined) return []

  // Object input
  if (typeof baseOrBases === 'object' && baseOrBases !== null) {
    const withSemi = valueOrSemi === true
    return Object.entries(baseOrBases).flatMap(([base, val]) =>
      LOGICAL_CORNERS.map(
        corner => `${buildCornerName(base, corner)}: ${val}${withSemi ? ';' : ''}`,
      )
    )
  }

  // String input
  const base = baseOrBases
  const value = valueOrSemi as string
  const withSemi = semi === true
  return LOGICAL_CORNERS.map(
    corner => `${buildCornerName(base, corner)}: ${value}${withSemi ? ';' : ''}`,
  ) as any
}

// ────────────────────────────────────────────────────────────────────────────
// defineLogicalBorderRadiusVarsRecord  (record variant)
// ────────────────────────────────────────────────────────────────────────────

/** Conditionally add `-` separator between the var name and corner suffix at type level */
type BuildCornerKey<B extends string, K extends string> =
  NormalizeVarName<B> extends '--' | `${string}_`
    ? `${NormalizeVarName<B>}${K}`
    : `${NormalizeVarName<B>}-${K}`

type DefineRadiusRecordResult<B extends string, V extends string> = {
  [K in LogicalCorner as BuildCornerKey<B, K>]: V
}

type DefineRadiusRecordFromObject<T extends Record<string, string>> = {
  [K in keyof T as BuildCornerKey<K & string, LogicalCorner>]: T[K]
}

/** (base, value) → record with 4 keys */
export function defineLogicalBorderRadiusVarsRecord<
  B extends string,
  V extends string,
>(base: B, value: V): DefineRadiusRecordResult<B, V>

/** ({base: value}) → merged record */
export function defineLogicalBorderRadiusVarsRecord<
  const T extends Record<string, string>,
>(bases: T): DefineRadiusRecordFromObject<T>

/** () → empty record */
export function defineLogicalBorderRadiusVarsRecord(): Record<string, never>

/** ({}) → empty record */
export function defineLogicalBorderRadiusVarsRecord(bases: {}): Record<string, never>

// ── Implementation ──

export function defineLogicalBorderRadiusVarsRecord(
  baseOrBases?: string | Record<string, string>,
  value?: string,
): Record<string, string> {
  if (baseOrBases === undefined) return {}
  if (typeof baseOrBases === 'object' && !Array.isArray(baseOrBases)) {
    if (Object.keys(baseOrBases).length === 0) return {}
    return Object.entries(baseOrBases)
      .flatMap(([base, val]) =>
        LOGICAL_CORNERS.map(corner => [buildCornerName(base, corner), val] as [string, string]),
      )
      .reduce<Record<string, string>>((acc, [k, v]) => ({ ...acc, [k]: v }), {})
  }

  const base = baseOrBases as string
  return Object.fromEntries(
    LOGICAL_CORNERS.map(corner => [buildCornerName(base, corner), value!]),
  )
}
