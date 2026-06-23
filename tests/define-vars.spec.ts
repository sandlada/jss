import { describe, it, expect, expectTypeOf } from 'vitest'
import { defineVars } from '../src/index.js'

describe('defineVars', () => {
  it('(name, value) → single-element tuple', () => {
    const r = defineVars('color', 'red')
    expectTypeOf(r).toEqualTypeOf<['--color: red']>()
    expect(r).toStrictEqual(['--color: red'])
  })

  it('(name, value) with -- prefix already present', () => {
    const r = defineVars('--color', 'red')
    expectTypeOf(r).toEqualTypeOf<['--color: red']>()
    expect(r).toStrictEqual(['--color: red'])
  })

  it('(name, value) with _ prefix → preserved', () => {
    const r = defineVars('_color', 'red')
    expectTypeOf(r).toEqualTypeOf<['--_color: red']>()
    expect(r).toStrictEqual(['--_color: red'])
  })

  it('(name, value) with --_ prefix', () => {
    const r = defineVars('--_color', 'red')
    expectTypeOf(r).toEqualTypeOf<['--_color: red']>()
    expect(r).toStrictEqual(['--_color: red'])
  })

  it('(name, value, true) → semicolon suffix', () => {
    const r = defineVars('color', 'red', true)
    expectTypeOf(r).toEqualTypeOf<['--color: red;']>()
    expect(r).toStrictEqual(['--color: red;'])
  })

  it('({key: value}) → object input', () => {
    const r = defineVars({ color: 'red', 'bg-color': 'blue' })
    expectTypeOf(r).toEqualTypeOf<Array<'--color: red' | '--bg-color: blue'>>()
    expect(r).toStrictEqual(['--color: red', '--bg-color: blue'])
  })

  it('({key: value}, true) → object with semicolon', () => {
    const r = defineVars({ color: 'red', 'bg-color': 'blue' }, true)
    expectTypeOf(r).toEqualTypeOf<Array<'--color: red;' | '--bg-color: blue;'>>()
    expect(r).toStrictEqual(['--color: red;', '--bg-color: blue;'])
  })

  it('({...}) → object with _ keys preserved', () => {
    const r = defineVars({ _color: 'red' })
    expect(r).toStrictEqual(['--_color: red'])
  })

  // ── Fallback chain ──

  it('(name, [chain], fallback) → single element with var() chain', () => {
    const r = defineVars('a', ['b', 'c'], 'default-value')
    expectTypeOf(r).toEqualTypeOf<['--a: var(--b, var(--c, default-value))']>()
    expect(r).toStrictEqual(['--a: var(--b, var(--c, default-value))'])
  })

  it('(name, [chain], fallback, true) → with semicolon', () => {
    const r = defineVars('a', ['b', 'c'], 'default-value', true)
    expectTypeOf(r).toEqualTypeOf<['--a: var(--b, var(--c, default-value));']>()
    expect(r).toStrictEqual(['--a: var(--b, var(--c, default-value));'])
  })

  it('(name, [chain], empty) → empty fallback slot', () => {
    const r = defineVars('a', ['b', 'c'], '')
    expectTypeOf(r).toEqualTypeOf<['--a: var(--b, var(--c, ))']>()
    expect(r).toStrictEqual(['--a: var(--b, var(--c, ))'])
  })

  it('(name, [chain], empty, true) → empty fallback with semi', () => {
    const r = defineVars('a', ['b', 'c'], '', true)
    expectTypeOf(r).toEqualTypeOf<['--a: var(--b, var(--c, ));']>()
    expect(r).toStrictEqual(['--a: var(--b, var(--c, ));'])
  })

  it('(name, [chain]) → no fallback', () => {
    const r = defineVars('a', ['b', 'c'])
    expectTypeOf(r).toEqualTypeOf<['--a: var(--b, var(--c))']>()
    expect(r).toStrictEqual(['--a: var(--b, var(--c))'])
  })

  it('(name, [chain], true) → no fallback with semi', () => {
    const r = defineVars('a', ['b', 'c'], true)
    expectTypeOf(r).toEqualTypeOf<['--a: var(--b, var(--c));']>()
    expect(r).toStrictEqual(['--a: var(--b, var(--c));'])
  })
})
