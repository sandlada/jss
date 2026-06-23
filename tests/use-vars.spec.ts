import { describe, it, expect, expectTypeOf } from 'vitest'
import { useVars } from '../src/index.js'

describe('useVars', () => {
  it('(name, fallback) → single‑element tuple', () => {
    const r = useVars('color-primary', 'blue')
    expectTypeOf(r).toEqualTypeOf<['var(--color-primary, blue)']>()
    expect(r).toStrictEqual(['var(--color-primary, blue)'])
  })

  it('(name, fallback) with -- prefix', () => {
    const r = useVars('--color-primary', 'blue')
    expect(r).toStrictEqual(['var(--color-primary, blue)'])
  })

  it('(name, fallback, true) → semicolon', () => {
    const r = useVars('color-primary', 'blue', true)
    expectTypeOf(r).toEqualTypeOf<['var(--color-primary, blue);']>()
    expect(r).toStrictEqual(['var(--color-primary, blue);'])
  })

  it('(name, fallback, true) with -- prefix', () => {
    const r = useVars('--color-primary', 'blue', true)
    expect(r).toStrictEqual(['var(--color-primary, blue);'])
  })

  it('({key: fallback}) → object input', () => {
    const r = useVars({ 'color-primary': 'blue', '--font-size-base': '16px' })
    expect(r).toStrictEqual([
      'var(--color-primary, blue)',
      'var(--font-size-base, 16px)',
    ])
  })

  it('({key: fallback}, true) → object with semicolon', () => {
    const r = useVars({ 'color-primary': 'blue', '--_font-size-base': '16px' }, true)
    expect(r).toStrictEqual([
      'var(--color-primary, blue);',
      'var(--_font-size-base, 16px);',
    ])
  })

  // ── Fallback chain ──

  it('([chain], fallback) → single var() string', () => {
    const r = useVars(['a', 'b', 'c'], 'default-value')
    expect(r).toStrictEqual(['var(--a, var(--b, var(--c, default-value)))'])
  })

  it('([chain], fallback, true) → with semicolon', () => {
    const r = useVars(['a', 'b', 'c'], 'default-value', true)
    expect(r).toStrictEqual(['var(--a, var(--b, var(--c, default-value)));'])
  })

  it('([chain], "") → empty fallback slot', () => {
    const r = useVars(['a', 'b', 'c'], '')
    expect(r).toStrictEqual(['var(--a, var(--b, var(--c, )))'])
  })

  it('([chain], "", true) → empty fallback with semi', () => {
    const r = useVars(['a', 'b', 'c'], '', true)
    expect(r).toStrictEqual(['var(--a, var(--b, var(--c, )));'])
  })

  it('([chain]) → no fallback', () => {
    const r = useVars(['a', 'b', 'c'])
    expect(r).toStrictEqual(['var(--a, var(--b, var(--c)))'])
  })

  it('([chain], true) → no fallback with semi', () => {
    const r = useVars(['a', 'b', 'c'], true)
    expect(r).toStrictEqual(['var(--a, var(--b, var(--c)));'])
  })

  // ── Nested chain in object values ──

  it('({key: [[chain], fallback]}) → nested chain', () => {
    const r = useVars({
      'color-primary': [['a', 'b', 'c'], 'blue'],
      '--_font-size-base': '16px',
    }, true)
    expect(r).toStrictEqual([
      'var(--color-primary, var(--a, var(--b, var(--c, blue))));',
      'var(--_font-size-base, 16px);',
    ])
  })
})
