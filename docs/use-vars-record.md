# useVarsRecord

## Correct Usage

```ts
/**
 * {
 * 'color-primary': 'var(--color-primary, blue)',
 * }
 */
useVarsRecord('color-primary', 'blue')
useVarsRecord('--color-primary', 'blue')
useVarsRecord({'color-primary': 'blue'})

/**
 * {
 * 'color-primary': 'var(--color-primary, blue);',
 * }
 */
useVarsRecord('color-primary', 'blue', true)
useVarsRecord('--color-primary', 'blue', true)
useVarsRecord({'color-primary': 'blue'}, true)

/**
 * {
 * 'color-primary': 'var(--color-primary, blue)',
 * 'font-size-base': 'var(--font-size-base, 16px)',
 * }
 */
useVarsRecord({
    'color-primary': 'blue',
    '--font-size-base': '16px'
})

/**
 * {
 * 'color-primary': 'var(--color-primary, blue);',
 * '_font-size-base': 'var(--_font-size-base, 16px);',
 * }
 */
useVarsRecord({
    'color-primary': 'blue',
    '--_font-size-base': '16px'
}, true)
```

## Special Usage

```ts
/**
 * {
 * 'a': 'var(--a, var(--b, var(--c, default-value)))',
 * }
 */
useVarsRecord(['a', 'b', 'c'], 'default-value')

/**
 * {
 * 'a': 'var(--a, var(--b, var(--c, default-value)));',
 * }
 */
useVarsRecord(['a', 'b', 'c'], 'default-value', true)

/**
 * {
 * 'a': 'var(--a, var(--b, var(--c, )))',
 * }
 */
useVarsRecord(['a', 'b', 'c'], '')

/**
 * {
 * 'a': 'var(--a, var(--b, var(--c, )));',
 * }
 */
useVarsRecord(['a', 'b', 'c'], '', true)

/**
 * {
 * 'a': 'var(--a, var(--b, var(--c)))',
 * }
 */
useVarsRecord(['a', 'b', 'c'])

/**
 * {
 * 'a': 'var(--a, var(--b, var(--c)));',
 * }
 */
useVarsRecord(['a', 'b', 'c'], true)

/**
 * {
 * 'color-primary': 'var(--color-primary, var(--a, var(--b, var(--c, blue))));',
 * '_font-size-base': 'var(--_font-size-base, 16px);',
 * }
 */
useVarsRecord({
    'color-primary': [['a', 'b', 'c'], 'blue'],
    '--_font-size-base': '16px'
}, true)
```
