import { describe, it, expect, expectTypeOf } from 'vitest'
import { defineOverrides } from '../src/index.js'

// ── Shared fixtures ──

const FocusRing = {
  'outline-color': 'red',
  'outline-width': '2px',
} as const

// ── Tests ──

describe('defineOverrides — basic (unconstrained, source = null)', () => {
  it('no prefix → returns overrides as-is', () => {
    const r = defineOverrides(null, { 'outline-color': 'blue' })()

    type Expected = { 'outline-color': 'blue' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ 'outline-color': 'blue' })
  })

  it('with prefix → keys are prefixed', () => {
    const r = defineOverrides(null, { 'outline-color': 'blue' })('--my-comp-css-prefix')

    type Expected = { '--my-comp-css-prefix-outline-color': 'blue' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ '--my-comp-css-prefix-outline-color': 'blue' })
  })

  it('multiple keys with prefix', () => {
    const r = defineOverrides(null, { 'outline-color': 'blue', 'outline-width': '3px' })('--pfx')

    type Expected = { '--pfx-outline-color': 'blue'; '--pfx-outline-width': '3px' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ '--pfx-outline-color': 'blue', '--pfx-outline-width': '3px' })
  })

  it('empty overrides', () => {
    const r = defineOverrides(null, {})()

    expectTypeOf(r).toEqualTypeOf<{}>()
    expect(r).toStrictEqual({})
  })

  it('empty overrides with prefix → still empty', () => {
    const r = defineOverrides(null, {})('--pfx')

    expectTypeOf(r).toEqualTypeOf<{}>()
    expect(r).toStrictEqual({})
  })
})

describe('defineOverrides — type-safe with source argument', () => {
  it('constrains keys to source type keys', () => {
    const r = defineOverrides(FocusRing, { 'outline-color': 'blue' })()

    type Expected = { 'outline-color': 'blue' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ 'outline-color': 'blue' })
  })

  it('partial override — only some keys', () => {
    const r = defineOverrides(FocusRing, { 'outline-color': 'blue' })('--pfx')

    type Expected = { '--pfx-outline-color': 'blue' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ '--pfx-outline-color': 'blue' })
  })

  it('empty override {} is allowed (type-safe)', () => {
    const r = defineOverrides(FocusRing, {})()

    expectTypeOf(r).toEqualTypeOf<{}>()
    expect(r).toStrictEqual({})
  })

  it('empty override {} with prefix (type-safe)', () => {
    const r = defineOverrides(FocusRing, {})('--pfx')

    expectTypeOf(r).toEqualTypeOf<{}>()
    expect(r).toStrictEqual({})
  })

  it('@ts-expect-error: invalid key is rejected', () => {
    // @ts-expect-error: 'invalid-key' is not in FocusRing
    defineOverrides(FocusRing, { 'invalid-key': 'x' })
  })
})

describe('defineOverrides — prefix edge cases', () => {
  it('keys with leading -- are normalised before prefixing', () => {
    const r = defineOverrides(null, { '--outline-color': 'blue' })('--pfx')

    type Expected = { '--pfx-outline-color': 'blue' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ '--pfx-outline-color': 'blue' })
  })

  it('prefix without leading -- is used as-is', () => {
    const r = defineOverrides(null, { 'outline-color': 'blue' })('my-prefix')

    type Expected = { 'my-prefix-outline-color': 'blue' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ 'my-prefix-outline-color': 'blue' })
  })

  it('prefix only -- works as prefix', () => {
    const r = defineOverrides(null, { 'outline-color': 'blue' })('--')

    type Expected = { '---outline-color': 'blue' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({ '---outline-color': 'blue' })
  })
})

describe('defineOverrides — integration (use-case)', () => {
  it('FocusRing → CompB override with prefix', () => {
    const FocusRingStyles = {
      'outline-color': 'red',
    } as const

    const overrideRecord = defineOverrides(FocusRingStyles, {
      'outline-color': 'blue',
    })('--my-comp-css-prefix')

    type Expected = { '--my-comp-css-prefix-outline-color': 'blue' }
    expectTypeOf(overrideRecord).toEqualTypeOf<Expected>()
    expect(overrideRecord).toStrictEqual({ '--my-comp-css-prefix-outline-color': 'blue' })

    const CompB = {
      'bg-color': 'blue',
      ...overrideRecord,
    } as const

    expect(CompB).toStrictEqual({
      'bg-color': 'blue',
      '--my-comp-css-prefix-outline-color': 'blue',
    })
  })
})
