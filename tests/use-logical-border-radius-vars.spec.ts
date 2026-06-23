import { describe, it, expect, expectTypeOf } from 'vitest'
import { useLogicalBorderRadiusVars } from '../src/index.js'

describe('useLogicalBorderRadiusVars', () => {
  it('(corner, fallback) → var(corner, var(base, fallback))', () => {
    const r = useLogicalBorderRadiusVars('container-shape-start-start', '12px')
    expectTypeOf(r).toEqualTypeOf<
      ['var(--container-shape-start-start, var(--container-shape, 12px))']
    >()
    expect(r).toStrictEqual([
      'var(--container-shape-start-start, var(--container-shape, 12px))',
    ])
  })

  it('(corner, fallback) with -- prefix', () => {
    const r = useLogicalBorderRadiusVars('--container-shape-start-start', '12px')
    expect(r).toStrictEqual([
      'var(--container-shape-start-start, var(--container-shape, 12px))',
    ])
  })

  it('(corner, fallback, true) → semicolon', () => {
    const r = useLogicalBorderRadiusVars('--container-shape-start-start', '12px', true)
    expect(r).toStrictEqual([
      'var(--container-shape-start-start, var(--container-shape, 12px));',
    ])
  })

  it('(corner) without fallback → just base fallback', () => {
    const r = useLogicalBorderRadiusVars('container-shape-start-start')
    expect(r).toStrictEqual([
      'var(--container-shape-start-start, var(--container-shape))',
    ])
  })

  it('(corner, "") → empty fallback slot', () => {
    const r = useLogicalBorderRadiusVars('container-shape-start-start', '')
    expect(r).toStrictEqual([
      'var(--container-shape-start-start, var(--container-shape, ))',
    ])
  })

  it('(corner) with _ prefix → internal notation', () => {
    const r = useLogicalBorderRadiusVars('_container-shape-start-start', '12px')
    expect(r).toStrictEqual([
      'var(--_container-shape-start-start, var(--_container-shape, 12px))',
    ])
  })

  it('({key: fallback}) → object input', () => {
    const r = useLogicalBorderRadiusVars({
      'container-shape-start-start': '12px',
      '--container-shape-start-end': '16px',
    })
    expect(r).toStrictEqual([
      'var(--container-shape-start-start, var(--container-shape, 12px))',
      'var(--container-shape-start-end, var(--container-shape, 16px))',
    ])
  })

  it('({key: fallback}, true) → object with semicolon', () => {
    const r = useLogicalBorderRadiusVars({
      'container-shape-start-start': '12px',
      '--container-shape-start-end': '16px',
      'container-shape-end-end': '',
    }, true)
    expect(r).toStrictEqual([
      'var(--container-shape-start-start, var(--container-shape, 12px));',
      'var(--container-shape-start-end, var(--container-shape, 16px));',
      'var(--container-shape-end-end, var(--container-shape, ));',
    ])
  })

  it('() → empty array', () => {
    expect(useLogicalBorderRadiusVars()).toStrictEqual([])
  })

  it('({}) → empty array', () => {
    expect(useLogicalBorderRadiusVars({})).toStrictEqual([])
  })

  // ── Error cases ──

  it('throws for empty string', () => {
    expect(() => (useLogicalBorderRadiusVars as any)('')).toThrow()
  })

  it('throws for single segment', () => {
    expect(() => (useLogicalBorderRadiusVars as any)('a')).toThrow()
    expect(() => (useLogicalBorderRadiusVars as any)('a', '4px')).toThrow()
  })

  it('throws for base name without corner', () => {
    expect(() => (useLogicalBorderRadiusVars as any)('container-shape', '4px')).toThrow()
  })

  it('throws for partial corner suffix', () => {
    expect(() => (useLogicalBorderRadiusVars as any)('container-shape-s-s', '4px')).toThrow()
    expect(() => (useLogicalBorderRadiusVars as any)('container-shape-start', '4px')).toThrow()
    expect(() => (useLogicalBorderRadiusVars as any)('container-shape-start-en')).toThrow()
    expect(() => (useLogicalBorderRadiusVars as any)('container-shape-start-en', '4px')).toThrow()
  })
})
