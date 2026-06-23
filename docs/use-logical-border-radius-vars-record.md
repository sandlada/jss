# useLogicalBorderRadiusVarsRecord

輸入對象必須以`shape-start-start``shape-start-end``shape-end-start``shape-end-end`結尾。

## Correct Usage

```ts
/**
 * {
 * 'container-shape-start-start': 'var(--container-shape-start-start, var(--container-shape, ))',
 * }
 */
useLogicalBorderRadiusVarsRecord('container-shape-start-start', '')

/**
 * {
 * 'container-shape-start-start': 'var(--container-shape-start-start, var(--container-shape))',
 * }
 */
useLogicalBorderRadiusVarsRecord('container-shape-start-start')

/**
 * {
 * 'container-shape-start-start': 'var(--container-shape-start-start, var(--container-shape, 12px))',
 * }
 */
useLogicalBorderRadiusVarsRecord('container-shape-start-start', '12px')
useLogicalBorderRadiusVarsRecord('--container-shape-start-start', '12px')

/**
 * {
 * 'container-shape-start-start': 'var(--_container-shape-start-start, var(--_container-shape, 12px))',
 * }
 */
useLogicalBorderRadiusVarsRecord('_container-shape-start-start', '12px')
useLogicalBorderRadiusVarsRecord('--_container-shape-start-start', '12px')

/**
 * {
 * 'container-shape-start-start': 'var(--container-shape-start-start, var(--container-shape, 12px));',
 * }
 */
useLogicalBorderRadiusVarsRecord('container-shape-start-start', '12px', true)
useLogicalBorderRadiusVarsRecord('--container-shape-start-start', '12px', true)

/**
 * {
 * 'container-shape-start-start': 'var(--container-shape-start-start, var(--container-shape, 12px))',
 * 'container-shape-start-end': 'var(--container-shape-start-end, var(--container-shape, 16px))',
 * }
 */
useLogicalBorderRadiusVarsRecord({
    'container-shape-start-start': '12px',
    '--container-shape-start-end': '16px'
})

/**
 * {
 * 'container-shape-start-start': 'var(--container-shape-start-start, var(--container-shape, 12px));',
 * 'container-shape-start-end': 'var(--container-shape-start-end, var(--container-shape, 16px));',
 * 'container-shape-end-end': 'var(--container-shape-end-end, var(--container-shape, ));',
 * }
 */
useLogicalBorderRadiusVarsRecord({
    'container-shape-start-start': '12px',
    '--container-shape-start-end': '16px'
    'container-shape-end-end': ''
}, true)
```

## Special Usage

```ts
// {}
useLogicalBorderRadiusVarsRecord()
useLogicalBorderRadiusVarsRecord({})
```

## Error Usage

```ts
// Will throw an error.
useLogicalBorderRadiusVarsRecord('')
useLogicalBorderRadiusVarsRecord('a')
useLogicalBorderRadiusVarsRecord('a', '4px')
useLogicalBorderRadiusVarsRecord('container-shape', '4px')
useLogicalBorderRadiusVarsRecord('container-shape-s-s', '4px')
useLogicalBorderRadiusVarsRecord('container-shape-start', '4px')
useLogicalBorderRadiusVarsRecord('container-shape-start-en')
useLogicalBorderRadiusVarsRecord('container-shape-start-en', '4px')
```
