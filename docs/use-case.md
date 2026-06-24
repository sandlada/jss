# Use Case

这个功能应该要推广到尽可能多的api上

```ts
const AppTokens = {
    'button-text-color': 'red',
    'button-bg-color': 'white',
    'button-shape': 'var(--md-sys-shape-corner-full, 9999px)',
} as const

const options = {
    prefix: '--md-badge',
}

/**
 * {
 * '--_button-text-color': 'var(--md-badge-button-text-color, red)',
 * '--_button-bg-color': 'var(--md-badge-button-bg-color, white)',
 * '--_button-shape': 'var(--md-badge-button-shape, var(--md-sys-shape-corner-full, 9999px))',
 * }
 */
defineTokenRefsRecord(AppTokens, options)

/**
 * [
 * '--md-badge-container-shape-start-start: 4px',
 * '--md-badge-container-shape-start-end: 4px',
 * '--md-badge-container-shape-end-start: 4px',
 * '--md-badge-container-shape-end-end: 4px',
 * ]
 */
defineLogicalBorderRadiusVars('container-shape', '4px', options)

/**
 * {
 * 'container-shape-start-start': 'var(--md-badge-container-shape-start-start, var(--md-badge-container-shape, 12px))',
 * }
 */
useLogicalBorderRadiusVarsRecord('container-shape-start-start', '12px', options)

/**
 * ['var(--md-badge-container-shape-start-start, var(--md-badge-container-shape, 12px))']
 */
useLogicalBorderRadiusVars('container-shape-start-start', '12px', options)

/**
 * {
 * '_color': 'var(--md-badge-color, red)',
 * }
 */
useInternalVarsRecord('color', 'red', options)

/**
 * {
 * 'color-primary': 'var(--md-badge-color-primary, blue)',
 * }
 */
useVarsRecord('color-primary', 'blue', options)

/**
 * [
 * 'var(--md-badge-color-primary, blue)',
 * 'var(--md-badge-font-size-base, 16px)',
 * ]
 */
useVars({
    'color-primary': 'blue',
    '--font-size-base': '16px'
}, options)

/**
 * 不支持的api
 */
defineLogicalBorderRadiusVarsRecord('container-shape', '4px')
defineVars('color', 'red')
useInternalVars('color', 'red')
```
