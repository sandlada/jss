# useInternalVars

## Correct Usage

```ts
/**
 * ['var(--_color, red)']
 */
useInternalVars('color', 'red')
useInternalVars('--color', 'red')

/**
 * ['var(--_color, red);']
 */
useInternalVars('color', 'red', true)
useInternalVars('--color', 'red', true)

/**
 * [
 * 'var(--_color, red)',
 * 'var(--_bg, blue)',
 * ]
 */
useInternalVars({
    'color': 'red',
    '--bg': 'blue'
})

/**
 * [
 * 'var(--_color, red);',
 * 'var(--_bg, blue);',
 * ]
 */
useInternalVars({
    'color': 'red',
    '--bg': 'blue'
}, true)
```

## Special Usage

```ts
// 'var(--_a, var(--_b, var(--_c, default-value)))'
useInternalVars(['a', 'b', 'c'], 'default-value')

// 'var(--_a, var(--_b, var(--_c, default-value)));'
useInternalVars(['a', 'b', 'c'], 'default-value', true)

// 'var(--_a, var(--_b, var(--_c, )))'
useInternalVars(['a', 'b', 'c'], '')

// 'var(--_a, var(--_b, var(--_c, )));'
useInternalVars(['a', 'b', 'c'], '', true)

// 'var(--_a, var(--_b, var(--_c)))'
useInternalVars(['a', 'b', 'c'])

// 'var(--_a, var(--_b, var(--_c)));'
useInternalVars(['a', 'b', 'c'], true)

/**
 * [
 * 'var(--_color, var(--_a, var(--_b, var(--_c, blue))));',
 * 'var(--_bg, blue);',
 * ]
 */
useInternalVars({
    'color': [['a', 'b', 'c'], 'blue'],
    '--bg': 'blue'
}, true)
```

## Error Usage

```ts
/**
 * Throw a error: "The key must be a valid CSS variable name."
 */
useInternalVars({'_color': 'red', '_bg': 'blue'})
```
