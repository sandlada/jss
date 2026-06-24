# useInternalVarsRecord

## Correct Usage

```ts
/**
 * {
 * '_color': 'var(--color, red)',
 * }
 */
useInternalVarsRecord('color', 'red')
useInternalVarsRecord({'color': 'red'})

/**
 * {
 * '_text-color': 'var(--text-color, red)',
 * '_bg-color': 'var(--bg-color, red)',
 * }
 */
useInternalVarsRecord({'text-color': 'red', 'bg-color': 'blue'})

/**
 * {
 * '_text-color': 'var(--text-color, red);',
 * '_bg-color': 'var(--bg-color, red);',
 * }
 */
useInternalVarsRecord({'text-color': 'red', 'bg-color': 'blue'}, { semi: true })

/**
 * {
 * '_color': 'var(--md-badge-color, red)',
 * }
 */
useInternalVarsRecord('color', 'red', { prefix: '--md-badge' })
useInternalVarsRecord({'color': 'red'}, { prefix: '--md-badge' })
```

## Error Usage

```ts
/**
 * Throw a error: "The key must be a valid CSS variable name."
 */
useInternalVarsRecord({'_text-color': 'red', '_bg-color': 'blue'})
```
