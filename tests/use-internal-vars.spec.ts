import { describe, it, expect, expectTypeOf } from 'vitest'
import { useInternalVars } from '../src/index.js'

describe('useInternalVars', () => {
  it('(name, fallback) → var(--_name, fallback)', () => {
    const r = useInternalVars('color', 'red')
    expectTypeOf(r).toEqualTypeOf<['var(--_color, red)']>()
    expect(r).toStrictEqual(['var(--_color, red)'])
  })

  it('(name, fallback) with -- prefix → --_ prefix', () => {
    const r = useInternalVars('--color', 'red')
    expect(r).toStrictEqual(['var(--_color, red)'])
  })

  it('(name, fallback, true) → semicolon', () => {
    const r = useInternalVars('color', 'red', true)
    expect(r).toStrictEqual(['var(--_color, red);'])
  })

  it('({key: fallback}) → object input', () => {
    const r = useInternalVars({ color: 'red', '--bg': 'blue' })
    expect(r).toStrictEqual([
      'var(--_color, red)',
      'var(--_bg, blue)',
    ])
  })

  it('({key: fallback}, true) → object with semicolon', () => {
    const r = useInternalVars({ color: 'red', '--bg': 'blue' }, true)
    expect(r).toStrictEqual([
      'var(--_color, red);',
      'var(--_bg, blue);',
    ])
  })

  // ── Fallback chain ──

  it('([chain], fallback) → all with --_ prefix', () => {
    const r = useInternalVars(['a', 'b', 'c'], 'default-value')
    expect(r).toStrictEqual(['var(--_a, var(--_b, var(--_c, default-value)))'])
  })

  it('([chain], fallback, true) → semicolon', () => {
    const r = useInternalVars(['a', 'b', 'c'], 'default-value', true)
    expect(r).toStrictEqual(['var(--_a, var(--_b, var(--_c, default-value)));'])
  })

  it('([chain], "") → empty fallback', () => {
    const r = useInternalVars(['a', 'b', 'c'], '')
    expect(r).toStrictEqual(['var(--_a, var(--_b, var(--_c, )))'])
  })

  it('([chain]) → no fallback', () => {
    const r = useInternalVars(['a', 'b', 'c'])
    expect(r).toStrictEqual(['var(--_a, var(--_b, var(--_c)))'])
  })

  it('([chain], true) → no fallback with semi', () => {
    const r = useInternalVars(['a', 'b', 'c'], true)
    expect(r).toStrictEqual(['var(--_a, var(--_b, var(--_c)));'])
  })

  // ── Nested chain in object values ──

  it('({key: [[chain], fallback]}) → nested internal chain', () => {
    const r = useInternalVars({
      color: [['a', 'b', 'c'], 'blue'],
      '--bg': 'blue',
    }, true)
    expect(r).toStrictEqual([
      'var(--_color, var(--_a, var(--_b, var(--_c, blue))));',
      'var(--_bg, blue);',
    ])
  })

  // ── Error: underscore prefix ──

  it('throws for _ prefixed keys in object', () => {
    expect(() =>
      useInternalVars({ _color: 'red', _bg: 'blue' }),
    ).toThrow('The key must be a valid CSS variable name.')
  })

  it('throws for --_ prefixed keys in object', () => {
    expect(() =>
      useInternalVars({ '--_color': 'red' }),
    ).toThrow('The key must be a valid CSS variable name.')
  })
})
