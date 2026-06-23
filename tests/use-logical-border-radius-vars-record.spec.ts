import { describe, it, expect, expectTypeOf } from 'vitest'
import { useLogicalBorderRadiusVarsRecord } from '../src/index.js'

describe('useLogicalBorderRadiusVarsRecord', () => {
  it('(corner, fallback) → record with one entry', () => {
    const r = useLogicalBorderRadiusVarsRecord('container-shape-start-start', '12px')
    type Expected = {
      'container-shape-start-start':
        'var(--container-shape-start-start, var(--container-shape, 12px))'
    }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({
      'container-shape-start-start':
        'var(--container-shape-start-start, var(--container-shape, 12px))',
    })
  })

  it('(corner, fallback) with -- prefix → key is stripped', () => {
    const r = useLogicalBorderRadiusVarsRecord('--container-shape-start-start', '12px')
    expect(r).toStrictEqual({
      'container-shape-start-start':
        'var(--container-shape-start-start, var(--container-shape, 12px))',
    })
  })

  it('(corner, fallback, true) → semicolon', () => {
    const r = useLogicalBorderRadiusVarsRecord('--container-shape-start-start', '12px', true)
    expect(r).toStrictEqual({
      'container-shape-start-start':
        'var(--container-shape-start-start, var(--container-shape, 12px));',
    })
  })

  it('(corner) without fallback', () => {
    const r = useLogicalBorderRadiusVarsRecord('container-shape-start-start')
    expect(r).toStrictEqual({
      'container-shape-start-start':
        'var(--container-shape-start-start, var(--container-shape))',
    })
  })

  it('(corner, "") → empty fallback slot', () => {
    const r = useLogicalBorderRadiusVarsRecord('container-shape-start-start', '')
    expect(r).toStrictEqual({
      'container-shape-start-start':
        'var(--container-shape-start-start, var(--container-shape, ))',
    })
  })

  it('(corner) with _ prefix', () => {
    const r = useLogicalBorderRadiusVarsRecord('_container-shape-start-start', '12px')
    expect(r).toStrictEqual({
      '_container-shape-start-start':
        'var(--_container-shape-start-start, var(--_container-shape, 12px))',
    })
  })

  it('({key: fallback}) → merged record', () => {
    const r = useLogicalBorderRadiusVarsRecord({
      'container-shape-start-start': '12px',
      '--container-shape-start-end': '16px',
    })
    expect(r).toStrictEqual({
      'container-shape-start-start':
        'var(--container-shape-start-start, var(--container-shape, 12px))',
      'container-shape-start-end':
        'var(--container-shape-start-end, var(--container-shape, 16px))',
    })
  })

  it('({key: fallback}, true) → semicolon', () => {
    const r = useLogicalBorderRadiusVarsRecord({
      'container-shape-start-start': '12px',
      '--container-shape-start-end': '16px',
      'container-shape-end-end': '',
    }, true)
    expect(r).toStrictEqual({
      'container-shape-start-start':
        'var(--container-shape-start-start, var(--container-shape, 12px));',
      'container-shape-start-end':
        'var(--container-shape-start-end, var(--container-shape, 16px));',
      'container-shape-end-end':
        'var(--container-shape-end-end, var(--container-shape, ));',
    })
  })

  it('() → empty record', () => {
    expect(useLogicalBorderRadiusVarsRecord()).toStrictEqual({})
  })

  it('({}) → empty record', () => {
    expect(useLogicalBorderRadiusVarsRecord({})).toStrictEqual({})
  })

  // ── Error cases ──

  it('throws for empty string', () => {
    expect(() => (useLogicalBorderRadiusVarsRecord as any)('')).toThrow()
  })

  it('throws for single segment', () => {
    expect(() => (useLogicalBorderRadiusVarsRecord as any)('a')).toThrow()
    expect(() => (useLogicalBorderRadiusVarsRecord as any)('a', '4px')).toThrow()
  })

  it('throws for base name without corner', () => {
    expect(() => (useLogicalBorderRadiusVarsRecord as any)('container-shape', '4px')).toThrow()
  })

  it('throws for partial corner suffix', () => {
    expect(() => (useLogicalBorderRadiusVarsRecord as any)('container-shape-s-s', '4px')).toThrow()
    expect(() => (useLogicalBorderRadiusVarsRecord as any)('container-shape-start', '4px')).toThrow()
    expect(() => (useLogicalBorderRadiusVarsRecord as any)('container-shape-start-en')).toThrow()
    expect(() => (useLogicalBorderRadiusVarsRecord as any)('container-shape-start-en', '4px')).toThrow()
  })
})
