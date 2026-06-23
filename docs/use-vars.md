# useVars

## Correct Usage

```ts
/**
 * ['var(--color-primary, blue)']
 */
useVars('color-primary', 'blue')
useVars('--color-primary', 'blue')

/**
 * ['var(--color-primary, blue);']
 */
useVars('color-primary', 'blue', true)
useVars('--color-primary', 'blue', true)

/**
 * [
 * 'var(--color-primary, blue)',
 * 'var(--font-size-base, 16px)',
 * ]
 */
useVars({
    'color-primary': 'blue',
    '--font-size-base': '16px'
})

/**
 * [
 * 'var(--color-primary, blue);',
 * 'var(--_font-size-base, 16px);',
 * ]
 */
useVars({
    'color-primary': 'blue',
    '--_font-size-base': '16px'
}, true)
```

## Special Usage

```ts
// 'var(--a, var(--b, var(--c, default-value)))'
useVars(['a', 'b', 'c'], 'default-value')

// 'var(--a, var(--b, var(--c, default-value)));'
useVars(['a', 'b', 'c'], 'default-value', true)

// 'var(--a, var(--b, var(--c, )))'
useVars(['a', 'b', 'c'], '')

// 'var(--a, var(--b, var(--c, )));'
useVars(['a', 'b', 'c'], '', true)

// 'var(--a, var(--b, var(--c)))'
useVars(['a', 'b', 'c'])

// 'var(--a, var(--b, var(--c)));'
useVars(['a', 'b', 'c'], true)

/**
 * [
 * 'var(--color-primary, var(--a, var(--b, var(--c, blue))));',
 * 'var(--_font-size-base, 16px);',
 * ]
 */
useVars({
    'color-primary': [['a', 'b', 'c'], 'blue'],
    '--_font-size-base': '16px'
}, true)
```
