import { describe, it, expect, expectTypeOf } from 'vitest'
import { useVarsRecord } from '../src/index.js'

describe('useVarsRecord', () => {
  it('(name, fallback) → record with one entry (key stripped of --)', () => {
    const r = useVarsRecord('color-primary', 'blue')
    type Expected = { 'color-primary': 'var(--color-primary, blue)' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ 'color-primary': 'var(--color-primary, blue)' })
  })

  it('(name, fallback) with -- prefix → key is stripped', () => {
    const r = useVarsRecord('--color-primary', 'blue')
    expect(r).toStrictEqual({ 'color-primary': 'var(--color-primary, blue)' })
  })

  it('(name, fallback, { semi: true }) → semicolon in value', () => {
    const r = useVarsRecord('--color-primary', 'blue', { semi: true })
    expect(r).toStrictEqual({ 'color-primary': 'var(--color-primary, blue);' })
  })

  it('({key: fallback}) → object input', () => {
    const r = useVarsRecord({
      'color-primary': 'blue',
      '--font-size-base': '16px',
    })
    expect(r).toStrictEqual({
      'color-primary': 'var(--color-primary, blue)',
      'font-size-base': 'var(--font-size-base, 16px)',
    })
  })

  it('({key: fallback}, { semi: true }) → semicolon', () => {
    const r = useVarsRecord({
      'color-primary': 'blue',
      '--_font-size-base': '16px',
    }, { semi: true })
    expect(r).toStrictEqual({
      'color-primary': 'var(--color-primary, blue);',
      '_font-size-base': 'var(--_font-size-base, 16px);',
    })
  })

  // ── Fallback chain ──

  it('([chain], fallback) → record with first name as key', () => {
    const r = useVarsRecord(['a', 'b', 'c'], 'default-value')
    expect(r).toStrictEqual({
      a: 'var(--a, var(--b, var(--c, default-value)))',
    })
  })

  it('([chain], fallback, { semi: true }) → semicolon', () => {
    const r = useVarsRecord(['a', 'b', 'c'], 'default-value', { semi: true })
    expect(r).toStrictEqual({
      a: 'var(--a, var(--b, var(--c, default-value)));',
    })
  })

  it('([chain], "") → empty fallback', () => {
    const r = useVarsRecord(['a', 'b', 'c'], '')
    expect(r).toStrictEqual({
      a: 'var(--a, var(--b, var(--c, )))',
    })
  })

  it('([chain]) → no fallback', () => {
    const r = useVarsRecord(['a', 'b', 'c'])
    expect(r).toStrictEqual({
      a: 'var(--a, var(--b, var(--c)))',
    })
  })

  it('([chain], { semi: true }) → no fallback with semi', () => {
    const r = useVarsRecord(['a', 'b', 'c'], { semi: true })
    expect(r).toStrictEqual({
      a: 'var(--a, var(--b, var(--c)));',
    })
  })

  // ── Nested chain in object values ──

  it('({key: [[chain], fallback]}, { semi: true }) → nested chain', () => {
    const r = useVarsRecord({
      'color-primary': [['a', 'b', 'c'], 'blue'],
      '--_font-size-base': '16px',
    }, { semi: true })
    expect(r).toStrictEqual({
      'color-primary': 'var(--color-primary, var(--a, var(--b, var(--c, blue))));',
      '_font-size-base': 'var(--_font-size-base, 16px);',
    })
  })

  // ── Prefix ──

  it('(name, fallback, { prefix }) → prefixed var() reference', () => {
    const r = useVarsRecord('color-primary', 'blue', { prefix: '--md-badge' })
    expect(r).toStrictEqual({
      'color-primary': 'var(--md-badge-color-primary, blue)',
    })
  })

  it('({key: value}, { prefix }) → prefixes var() references', () => {
    const r = useVarsRecord({
      'color-primary': 'blue',
      '--font-size-base': '16px',
    }, { prefix: '--md-badge' })
    expect(r).toStrictEqual({
      'color-primary': 'var(--md-badge-color-primary, blue)',
      'font-size-base': 'var(--md-badge-font-size-base, 16px)',
    })
  })

  it('([chain], fallback, { prefix }) → prefix on chain', () => {
    const r = useVarsRecord(['a', 'b', 'c'], 'default-value', { prefix: '--md-badge' })
    expect(r).toStrictEqual({
      a: 'var(--md-badge-a, var(--b, var(--c, default-value)))',
    })
  })
})
