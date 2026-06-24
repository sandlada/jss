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
useVars('color-primary', 'blue', { semi: true })
useVars('--color-primary', 'blue', { semi: true })

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
}, { semi: true })

/**
 * ['var(--md-badge-color-primary, blue)']
 */
useVars('color-primary', 'blue', { prefix: '--md-badge' })

/**
 * [
 * 'var(--md-badge-color-primary, blue)',
 * 'var(--md-badge-font-size-base, 16px)',
 * ]
 */
useVars({
    'color-primary': 'blue',
    '--font-size-base': '16px'
}, { prefix: '--md-badge' })
```

## Special Usage

```ts
// 'var(--a, var(--b, var(--c, default-value)))'
useVars(['a', 'b', 'c'], 'default-value')

// 'var(--a, var(--b, var(--c, default-value)));'
useVars(['a', 'b', 'c'], 'default-value', { semi: true })

// 'var(--a, var(--b, var(--c, )))'
useVars(['a', 'b', 'c'], '')

// 'var(--a, var(--b, var(--c, )));'
useVars(['a', 'b', 'c'], '', { semi: true })

// 'var(--a, var(--b, var(--c)))'
useVars(['a', 'b', 'c'])

// 'var(--a, var(--b, var(--c)));'
useVars(['a', 'b', 'c'], { semi: true })

/**
 * [
 * 'var(--color-primary, var(--a, var(--b, var(--c, blue))));',
 * 'var(--_font-size-base, 16px);',
 * ]
 */
useVars({
    'color-primary': [['a', 'b', 'c'], 'blue'],
    '--_font-size-base': '16px'
}, { semi: true })

// 'var(--md-badge-a, var(--md-badge-b, var(--md-badge-c, default-value)))'
useVars(['a', 'b', 'c'], 'default-value', { prefix: '--md-badge' })
```
