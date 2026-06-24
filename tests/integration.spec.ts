import { describe, it, expect } from 'vitest'
import {
    defineVars,
    defineLogicalBorderRadiusVars,
    defineLogicalBorderRadiusVarsRecord,
    useVars,
    useLogicalBorderRadiusVarsRecord,
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

    it('should produce the correct combined vars (array) internal', () => {
        const shapeKeys = defineLogicalBorderRadiusVarsRecord('container-shape', AppTokens['container-shape'])
        const shapeFallback = AppTokens['container-shape']
        const shapeUseRecord = useLogicalBorderRadiusVarsRecord(
            Object.fromEntries(Object.keys(shapeKeys).map(k => [k, shapeFallback])),
        )
        expect({
            '--_container-color': useVars('container-color', AppTokens['container-color'])[0],
            ...Object.fromEntries(
                Object.entries(shapeUseRecord).map(([k, v]) => [`--_${k}`, v]),
            ),
        }).toStrictEqual({
            '--_container-color': 'var(--container-color, red)',
            '--_container-shape-start-start': 'var(--container-shape-start-start, var(--container-shape, 12px))',
            '--_container-shape-start-end': 'var(--container-shape-start-end, var(--container-shape, 12px))',
            '--_container-shape-end-start': 'var(--container-shape-end-start, var(--container-shape, 12px))',
            '--_container-shape-end-end': 'var(--container-shape-end-end, var(--container-shape, 12px))',
        })
    })
})
