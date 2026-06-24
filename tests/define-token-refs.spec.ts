import { describe, it, expect, expectTypeOf } from 'vitest'
import { defineTokenRefsRecord } from '../src/index.js'

describe('defineTokenRefsRecord — use-case outputs', () => {
  const AppTokens = {
    'button-text-color': 'red',
    'button-bg-color': 'white',
    'button-shape': 'var(--md-sys-shape-corner-full, 9999px)',
  } as const

  // ── Output 1 ──

  it('Output 1: basic token refs record', () => {
    const r = defineTokenRefsRecord(AppTokens)
    type Expected = {
      '--_button-text-color': 'var(--button-text-color, red)'
      '--_button-bg-color': 'var(--button-bg-color, white)'
      '--_button-shape': 'var(--button-shape, var(--md-sys-shape-corner-full, 9999px))'
    }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({
      '--_button-text-color': 'var(--button-text-color, red)',
      '--_button-bg-color': 'var(--button-bg-color, white)',
      '--_button-shape': 'var(--button-shape, var(--md-sys-shape-corner-full, 9999px))',
    })
  })

  // ── Output 2 ──

  it('Output 2: basic token refs record with semicolons', () => {
    const r = defineTokenRefsRecord(AppTokens, true)
    type Expected = {
      '--_button-text-color': 'var(--button-text-color, red);'
      '--_button-bg-color': 'var(--button-bg-color, white);'
      '--_button-shape': 'var(--button-shape, var(--md-sys-shape-corner-full, 9999px));'
    }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({
      '--_button-text-color': 'var(--button-text-color, red);',
      '--_button-bg-color': 'var(--button-bg-color, white);',
      '--_button-shape': 'var(--button-shape, var(--md-sys-shape-corner-full, 9999px));',
    })
  })

  // ── Output 3 ──

  it('Output 3: shape expansion (without base fallback)', () => {
    const r = defineTokenRefsRecord(AppTokens, {
      expandShapes: ['button-shape'],
    })
    expect(r).toStrictEqual({
      '--_button-text-color': 'var(--button-text-color, red)',
      '--_button-bg-color': 'var(--button-bg-color, white)',
      '--_button-shape-start-start': 'var(--button-shape-start-start, var(--md-sys-shape-corner-full, 9999px))',
      '--_button-shape-start-end': 'var(--button-shape-start-end, var(--md-sys-shape-corner-full, 9999px))',
      '--_button-shape-end-start': 'var(--button-shape-end-start, var(--md-sys-shape-corner-full, 9999px))',
      '--_button-shape-end-end': 'var(--button-shape-end-end, var(--md-sys-shape-corner-full, 9999px))',
    })
  })

  it('Output 3 with semi: shape expansion + semicolons', () => {
    const r = defineTokenRefsRecord(AppTokens, {
      semi: true,
      expandShapes: ['button-shape'],
    })
    expect(r).toStrictEqual({
      '--_button-text-color': 'var(--button-text-color, red);',
      '--_button-bg-color': 'var(--button-bg-color, white);',
      '--_button-shape-start-start': 'var(--button-shape-start-start, var(--md-sys-shape-corner-full, 9999px));',
      '--_button-shape-start-end': 'var(--button-shape-start-end, var(--md-sys-shape-corner-full, 9999px));',
      '--_button-shape-end-start': 'var(--button-shape-end-start, var(--md-sys-shape-corner-full, 9999px));',
      '--_button-shape-end-end': 'var(--button-shape-end-end, var(--md-sys-shape-corner-full, 9999px));',
    })
  })

  // ── Output 4 ──

  it('Output 4: shape expansion with base fallback', () => {
    const r = defineTokenRefsRecord(AppTokens, {
      expandShapes: ['button-shape'],
      useBaseFallback: true,
    })
    expect(r).toStrictEqual({
      '--_button-text-color': 'var(--button-text-color, red)',
      '--_button-bg-color': 'var(--button-bg-color, white)',
      '--_button-shape-start-start': 'var(--button-shape-start-start, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
      '--_button-shape-start-end': 'var(--button-shape-start-end, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
      '--_button-shape-end-start': 'var(--button-shape-end-start, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
      '--_button-shape-end-end': 'var(--button-shape-end-end, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
    })
  })

  it('Output 4 with semi: shape expansion + base fallback + semicolons', () => {
    const r = defineTokenRefsRecord(AppTokens, {
      semi: true,
      expandShapes: ['button-shape'],
      useBaseFallback: true,
    })
    expect(r).toStrictEqual({
      '--_button-text-color': 'var(--button-text-color, red);',
      '--_button-bg-color': 'var(--button-bg-color, white);',
      '--_button-shape-start-start': 'var(--button-shape-start-start, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)));',
      '--_button-shape-start-end': 'var(--button-shape-start-end, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)));',
      '--_button-shape-end-start': 'var(--button-shape-end-start, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)));',
      '--_button-shape-end-end': 'var(--button-shape-end-end, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)));',
    })
  })
})

describe('defineTokenRefsRecord — auto-detect shape keys', () => {
  it('expandShapes: true auto-detects keys ending in "shape"', () => {
    const tokens = {
      'text-color': 'blue',
      'container-shape': '8px',
      'bg-color': 'red',
    }
    const r = defineTokenRefsRecord(tokens, { expandShapes: true })
    expect(r).toStrictEqual({
      '--_text-color': 'var(--text-color, blue)',
      '--_container-shape-start-start': 'var(--container-shape-start-start, 8px)',
      '--_container-shape-start-end': 'var(--container-shape-start-end, 8px)',
      '--_container-shape-end-start': 'var(--container-shape-end-start, 8px)',
      '--_container-shape-end-end': 'var(--container-shape-end-end, 8px)',
      '--_bg-color': 'var(--bg-color, red)',
    })
  })
})

describe('defineTokenRefsRecord — edge cases', () => {
  it('empty object → empty record', () => {
    const r = defineTokenRefsRecord({})
    expectTypeOf(r).toEqualTypeOf<Record<string, never>>()
    expect(r).toStrictEqual({})
  })

  it('empty object with semi → empty record', () => {
    const r = defineTokenRefsRecord({}, true)
    expect(r).toStrictEqual({})
  })

  it('keys with -- prefix are handled correctly', () => {
    const r = defineTokenRefsRecord({ '--color-primary': 'blue' })
    type Expected = { '--_color-primary': 'var(--color-primary, blue)' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({
      '--_color-primary': 'var(--color-primary, blue)',
    })
  })

  it('keys with _ prefix are preserved', () => {
    const r = defineTokenRefsRecord({ '_internal-var': '10px' })
    type Expected = { '--__internal-var': 'var(--_internal-var, 10px)' }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({
      '--__internal-var': 'var(--_internal-var, 10px)',
    })
  })

  it('single token', () => {
    const r = defineTokenRefsRecord({ color: 'red' })
    expect(r).toStrictEqual({
      '--_color': 'var(--color, red)',
    })
  })

  it('shape expansion with empty shape keys array', () => {
    const r = defineTokenRefsRecord({ a: '1', b: '2' }, { expandShapes: [] })
    expect(r).toStrictEqual({
      '--_a': 'var(--a, 1)',
      '--_b': 'var(--b, 2)',
    })
  })

  it('shape expansion with -- prefixed key in shapeKeys', () => {
    const r = defineTokenRefsRecord({ '--surface-shape': '4px' }, {
      expandShapes: ['--surface-shape'],
    })
    expect(r).toStrictEqual({
      '--_surface-shape-start-start': 'var(--surface-shape-start-start, 4px)',
      '--_surface-shape-start-end': 'var(--surface-shape-start-end, 4px)',
      '--_surface-shape-end-start': 'var(--surface-shape-end-start, 4px)',
      '--_surface-shape-end-end': 'var(--surface-shape-end-end, 4px)',
    })
  })

  it('shape expansion with useBaseFallback + -- prefixed shape key', () => {
    const r = defineTokenRefsRecord({ '--surface-shape': '4px' }, {
      expandShapes: ['--surface-shape'],
      useBaseFallback: true,
    })
    expect(r).toStrictEqual({
      '--_surface-shape-start-start': 'var(--surface-shape-start-start, var(--surface-shape, 4px))',
      '--_surface-shape-start-end': 'var(--surface-shape-start-end, var(--surface-shape, 4px))',
      '--_surface-shape-end-start': 'var(--surface-shape-end-start, var(--surface-shape, 4px))',
      '--_surface-shape-end-end': 'var(--surface-shape-end-end, var(--surface-shape, 4px))',
    })
  })

  it('value containing special CSS is preserved as-is', () => {
    const r = defineTokenRefsRecord({ size: 'calc(100% - 32px)' })
    expect(r).toStrictEqual({
      '--_size': 'var(--size, calc(100% - 32px))',
    })
  })

  it('value with nested var() is preserved as-is', () => {
    const r = defineTokenRefsRecord({ color: 'var(--base-color, pink)' })
    expect(r).toStrictEqual({
      '--_color': 'var(--color, var(--base-color, pink))',
    })
  })
})
