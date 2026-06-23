import { describe, it, expect, expectTypeOf } from 'vitest'
import { defineLogicalBorderRadiusVars } from '../src/index.js'

describe('defineLogicalBorderRadiusVars', () => {
  it('(base, value) → 4‑tuple', () => {
    const r = defineLogicalBorderRadiusVars('container-shape', '4px')
    type Expected = [
      '--container-shape-start-start: 4px',
      '--container-shape-start-end: 4px',
      '--container-shape-end-start: 4px',
      '--container-shape-end-end: 4px',
    ]
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual([
      '--container-shape-start-start: 4px',
      '--container-shape-start-end: 4px',
      '--container-shape-end-start: 4px',
      '--container-shape-end-end: 4px',
    ])
  })

  it('(base, value) with -- prefix', () => {
    const r = defineLogicalBorderRadiusVars('--container-shape', '4px')
    expect(r).toStrictEqual([
      '--container-shape-start-start: 4px',
      '--container-shape-start-end: 4px',
      '--container-shape-end-start: 4px',
      '--container-shape-end-end: 4px',
    ])
  })

  it('({key: value}) → object input expands all', () => {
    const r = defineLogicalBorderRadiusVars({
      'container-shape': '4px',
      'surface-shape': '8px',
    })
    expect(r).toStrictEqual([
      '--container-shape-start-start: 4px',
      '--container-shape-start-end: 4px',
      '--container-shape-end-start: 4px',
      '--container-shape-end-end: 4px',
      '--surface-shape-start-start: 8px',
      '--surface-shape-start-end: 8px',
      '--surface-shape-end-start: 8px',
      '--surface-shape-end-end: 8px',
    ])
  })

  it('({key: value}, true) → object with semicolon', () => {
    const r = defineLogicalBorderRadiusVars({ 'container-shape': '4px' }, true)
    expect(r).toStrictEqual([
      '--container-shape-start-start: 4px;',
      '--container-shape-start-end: 4px;',
      '--container-shape-end-start: 4px;',
      '--container-shape-end-end: 4px;',
    ])
  })

  it('() → empty', () => {
    const r = defineLogicalBorderRadiusVars()
    expectTypeOf(r).toEqualTypeOf<[]>()
    expect(r).toStrictEqual([])
  })

  it('("", value) → no prefix corners', () => {
    const r = defineLogicalBorderRadiusVars('', '4px')
    expect(r).toStrictEqual([
      '--start-start: 4px',
      '--start-end: 4px',
      '--end-start: 4px',
      '--end-end: 4px',
    ])
  })

  it('("--", value) → same as empty', () => {
    const r = defineLogicalBorderRadiusVars('--', '4px')
    expect(r).toStrictEqual([
      '--start-start: 4px',
      '--start-end: 4px',
      '--end-start: 4px',
      '--end-end: 4px',
    ])
  })

  it('("_", value) → internal prefix corners', () => {
    const r = defineLogicalBorderRadiusVars('_', '4px')
    expect(r).toStrictEqual([
      '--_start-start: 4px',
      '--_start-end: 4px',
      '--_end-start: 4px',
      '--_end-end: 4px',
    ])
  })

  it('("--_", value) → same as underscore', () => {
    const r = defineLogicalBorderRadiusVars('--_', '4px')
    expect(r).toStrictEqual([
      '--_start-start: 4px',
      '--_start-end: 4px',
      '--_end-start: 4px',
      '--_end-end: 4px',
    ])
  })
})
