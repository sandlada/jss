# @sandlada/jss

## APIs

### useVar

```ts
// --color
useVar('color')
```

### wrapBorderRadiusVar

```ts
/**
 * '--container-shape-start-start': 'var(container-shape-start-start, var(container-shape, 4px))',
 * '--container-shape-start-end'  : 'var(container-shape-start-end,   var(container-shape, 4px))',
 * '--container-shape-end-start'  : 'var(container-shape-end-start,   var(container-shape, 4px))',
 * '--container-shape-end-end'    : 'var(container-shape-end-end,     var(container-shape, 4px))',
 */
wrapBorderRadiusVar(makeBorderRadiusVarRecord({
    'container-shape': '4px',
}))

/**
 * 'container-shape': 'var(container-shape, 4px)',
 */
wrapBorderRadiusVar({
    'container-shape': '4px',
}, false)
```
