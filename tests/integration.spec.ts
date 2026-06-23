import { describe, it, expect } from 'vitest'
import {
  defineVars,
  defineLogicalBorderRadiusVars,
  defineLogicalBorderRadiusVarsRecord,
} from '../src/index.js'

describe('integration', () => {
  const AppTokens = {
    'container-color': 'red',
    'container-height': 'red',
    'container-shape': '12px',
  } as const

  it('should produce the correct container logical shape record', () => {
    const r = defineLogicalBorderRadiusVarsRecord('container-shape', AppTokens['container-shape'])
    expect(r).toStrictEqual({
      '--container-shape-start-start': '12px',
      '--container-shape-start-end': '12px',
      '--container-shape-end-start': '12px',
      '--container-shape-end-end': '12px',
    })
  })

  it('should produce the correct combined vars record', () => {
    const shapeRecord = defineLogicalBorderRadiusVarsRecord('container-shape', AppTokens['container-shape'])
    const decls = defineVars(AppTokens)
    const flat = decls.reduce<Record<string, string>>((acc, d) => {
      const [k, v] = d.split(/: (.+)/)
      acc[k!] = v!
      return acc
    }, {})
    const full = { ...flat, ...shapeRecord }
    expect(full).toStrictEqual({
      '--container-color': 'red',
      '--container-height': 'red',
      '--container-shape': '12px',
      '--container-shape-start-start': '12px',
      '--container-shape-start-end': '12px',
      '--container-shape-end-start': '12px',
      '--container-shape-end-end': '12px',
    })
  })

  it('should produce the correct container logical shape vars (array)', () => {
    const r = defineLogicalBorderRadiusVars('container-shape', AppTokens['container-shape'])
    expect(r).toStrictEqual([
      '--container-shape-start-start: 12px',
      '--container-shape-start-end: 12px',
      '--container-shape-end-start: 12px',
      '--container-shape-end-end: 12px',
    ])
  })

  it('should produce the correct combined vars (array)', () => {
    const shapeVars = defineLogicalBorderRadiusVars('container-shape', AppTokens['container-shape'])
    const full = [...defineVars('container-color', AppTokens['container-color']), ...shapeVars]
    expect(full).toStrictEqual([
      '--container-color: red',
      '--container-shape-start-start: 12px',
      '--container-shape-start-end: 12px',
      '--container-shape-end-start: 12px',
      '--container-shape-end-end: 12px',
    ])
  })
})
