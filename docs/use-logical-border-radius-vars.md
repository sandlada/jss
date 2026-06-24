# useLogicalBorderRadiusVars

輸入對象必須以`shape-start-start``shape-start-end``shape-end-start``shape-end-end`結尾。

## Correct Usage

```ts
/**
 * ['var(--container-shape-start-start, var(--container-shape, ))']
 */
useLogicalBorderRadiusVars('container-shape-start-start', '')

/**
 * ['var(--container-shape-start-start, var(--container-shape))']
 */
useLogicalBorderRadiusVars('container-shape-start-start')

/**
 * ['var(--container-shape-start-start, var(--container-shape, 12px))']
 */
useLogicalBorderRadiusVars('container-shape-start-start', '12px')
useLogicalBorderRadiusVars('--container-shape-start-start', '12px')

/**
 * ['var(--_container-shape-start-start, var(--_container-shape, 12px))']
 */
useLogicalBorderRadiusVars('_container-shape-start-start', '12px')
useLogicalBorderRadiusVars('--_container-shape-start-start', '12px')

/**
 * ['var(--container-shape-start-start, var(--container-shape, 12px));']
 */
useLogicalBorderRadiusVars('container-shape-start-start', '12px', { semi: true })
useLogicalBorderRadiusVars('--container-shape-start-start', '12px', { semi: true })

/**
 * ['var(--md-badge-container-shape-start-start, var(--md-badge-container-shape, 12px))']
 */
useLogicalBorderRadiusVars('container-shape-start-start', '12px', { prefix: '--md-badge' })

/**
 * [
 * 'var(--container-shape-start-start, var(--container-shape, 12px))',
 * 'var(--container-shape-start-end, var(--container-shape, 16px))',
 * ]
 */
useLogicalBorderRadiusVars({
    'container-shape-start-start': '12px',
    '--container-shape-start-end': '16px'
})

/**
 * [
 * 'var(--container-shape-start-start, var(--container-shape, 12px));',
 * 'var(--container-shape-start-end, var(--container-shape, 16px));',
 * 'var(--container-shape-end-end, var(--container-shape, ));',
 * ]
 */
useLogicalBorderRadiusVars({
    'container-shape-start-start': '12px',
    '--container-shape-start-end': '16px',
    'container-shape-end-end': ''
}, { semi: true })

/**
 * [
 * 'var(--md-badge-container-shape-start-start, var(--md-badge-container-shape, 12px))',
 * 'var(--md-badge-container-shape-start-end, var(--md-badge-container-shape, 16px))',
 * ]
 */
useLogicalBorderRadiusVars({
    'container-shape-start-start': '12px',
    '--container-shape-start-end': '16px'
}, { prefix: '--md-badge' })
```

## Special Usage

```ts
// []
useLogicalBorderRadiusVars()
useLogicalBorderRadiusVars({})
```

## Error Usage

```ts
// Will throw an error.
useLogicalBorderRadiusVars('')
useLogicalBorderRadiusVars('a')
useLogicalBorderRadiusVars('a', '4px')
useLogicalBorderRadiusVars('container-shape', '4px')
useLogicalBorderRadiusVars('container-shape-s-s', '4px')
useLogicalBorderRadiusVars('container-shape-start', '4px')
useLogicalBorderRadiusVars('container-shape-start-en')
useLogicalBorderRadiusVars('container-shape-start-en', '4px')
```
