import { describe, it, expect, expectTypeOf } from 'vitest'
import { useInternalVarsRecord } from '../src/index.js'

describe('useInternalVarsRecord', () => {
  it('(name, fallback) → record key is _name', () => {
    const r = useInternalVarsRecord('color', 'red')
    type Expected = { _color: 'var(--_color, red)' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ _color: 'var(--_color, red)' })
  })

  it('({key: value}) → record keys with _ prefix', () => {
    const r = useInternalVarsRecord({ 'text-color': 'red', 'bg-color': 'blue' })
    expect(r).toStrictEqual({
      '_text-color': 'var(--_text-color, red)',
      '_bg-color': 'var(--_bg-color, blue)',
    })
  })

  it('({key: value}, true) → semicolon', () => {
    const r = useInternalVarsRecord({ 'text-color': 'red', 'bg-color': 'blue' }, true)
    expect(r).toStrictEqual({
      '_text-color': 'var(--_text-color, red);',
      '_bg-color': 'var(--_bg-color, blue);',
    })
  })

  // ── Error: underscore prefix ──

  it('throws for _ prefixed keys in object', () => {
    expect(() =>
      useInternalVarsRecord({ '_text-color': 'red', '_bg-color': 'blue' }),
    ).toThrow('The key must be a valid CSS variable name.')
  })
})
