# defineLogicalBorderRadiusVars

## Correct Usage

```ts
/**
 * [
 * '--container-shape-start-start: 4px',
 * '--container-shape-start-end: 4px',
 * '--container-shape-end-start: 4px',
 * '--container-shape-end-end: 4px',
 * ]
 */
defineLogicalBorderRadiusVars('container-shape', '4px')
defineLogicalBorderRadiusVars('--container-shape', '4px')

/**
 * [
 * '--container-shape-start-start: 4px',
 * '--container-shape-start-end: 4px',
 * '--container-shape-end-start: 4px',
 * '--container-shape-end-end: 4px',
 * ]
 */
defineLogicalBorderRadiusVars({'container-shape': '4px'})
defineLogicalBorderRadiusVars({'--container-shape': '4px'})

/**
 * [
 * '--container-shape-start-start: 4px;',
 * '--container-shape-start-end: 4px;',
 * '--container-shape-end-start: 4px;',
 * '--container-shape-end-end: 4px;',
 * ]
 */
defineLogicalBorderRadiusVars({'container-shape': '4px'}, true)

/**
 * [
 * '--container-shape-start-start: 4px',
 * '--container-shape-start-end: 4px',
 * '--container-shape-end-start: 4px',
 * '--container-shape-end-end: 4px',
 * '--surface-shape-start-start: 8px',
 * '--surface-shape-start-end: 8px',
 * '--surface-shape-end-start: 8px',
 * '--surface-shape-end-end: 8px',
 * ]
 */
defineLogicalBorderRadiusVars({
    'container-shape': '4px',
    'surface-shape'  : '8px',
})
```

## Special Usage

```ts
/**
 * []
 */
defineLogicalBorderRadiusVars()

/**
 * [
 * '--start-start: 4px',
 * '--start-end: 4px',
 * '--end-start: 4px',
 * '--end-end: 4px',
 * ]
 */
defineLogicalBorderRadiusVars('', '4px')
defineLogicalBorderRadiusVars('--', '4px')

/**
 * [
 * '--_start-start: 4px',
 * '--_start-end: 4px',
 * '--_end-start: 4px',
 * '--_end-end: 4px',
 * ]
 */
defineLogicalBorderRadiusVars('_', '4px')
defineLogicalBorderRadiusVars('--_', '4px')

/**
 * [
 * '--md-badge-container-shape-start-start: 4px',
 * '--md-badge-container-shape-start-end: 4px',
 * '--md-badge-container-shape-end-start: 4px',
 * '--md-badge-container-shape-end-end: 4px',
 * ]
 */
defineLogicalBorderRadiusVars('container-shape', '4px', { prefix: '--md-badge' })

/**
 * [
 * '--md-badge-container-shape-start-start: 4px;',
 * '--md-badge-container-shape-start-end: 4px;',
 * '--md-badge-container-shape-end-start: 4px;',
 * '--md-badge-container-shape-end-end: 4px;',
 * ]
 */
defineLogicalBorderRadiusVars('container-shape', '4px', { prefix: '--md-badge', semi: true })
```
