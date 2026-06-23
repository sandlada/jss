import { describe, it, expect, expectTypeOf } from 'vitest'
import { defineLogicalBorderRadiusVarsRecord } from '../src/index.js'

describe('defineLogicalBorderRadiusVarsRecord', () => {
  it('(base, value) → record with 4 corner keys', () => {
    const r = defineLogicalBorderRadiusVarsRecord('container-shape', '4px')
    type Expected = {
      '--container-shape-start-start': '4px'
      '--container-shape-start-end': '4px'
      '--container-shape-end-start': '4px'
      '--container-shape-end-end': '4px'
    }
    expectTypeOf(r).toEqualTypeOf<Expected>()
    expect(r).toStrictEqual({
      '--container-shape-start-start': '4px',
      '--container-shape-start-end': '4px',
      '--container-shape-end-start': '4px',
      '--container-shape-end-end': '4px',
    })
  })

  it('({key: value}) → merged record', () => {
    const r = defineLogicalBorderRadiusVarsRecord({
      '--container-shape': '4px',
      '--surface-shape': '8px',
    })
    expect(r).toStrictEqual({
      '--container-shape-start-start': '4px',
      '--container-shape-start-end': '4px',
      '--container-shape-end-start': '4px',
      '--container-shape-end-end': '4px',
      '--surface-shape-start-start': '8px',
      '--surface-shape-start-end': '8px',
      '--surface-shape-end-start': '8px',
      '--surface-shape-end-end': '8px',
    })
  })

  it('() → empty record', () => {
    expect(defineLogicalBorderRadiusVarsRecord()).toStrictEqual({})
  })

  it('({}) → empty record', () => {
    expect(defineLogicalBorderRadiusVarsRecord({})).toStrictEqual({})
  })

  it('({ "": value }) → unprefixed keys', () => {
    const r = defineLogicalBorderRadiusVarsRecord({ '': '4px' })
    expect(r).toStrictEqual({
      '--start-start': '4px',
      '--start-end': '4px',
      '--end-start': '4px',
      '--end-end': '4px',
    })
  })

  it('({ "_": value }) → underscore prefixed keys', () => {
    const r = defineLogicalBorderRadiusVarsRecord({ '_': '4px' })
    expect(r).toStrictEqual({
      '--_start-start': '4px',
      '--_start-end': '4px',
      '--_end-start': '4px',
      '--_end-end': '4px',
    })
  })
})
