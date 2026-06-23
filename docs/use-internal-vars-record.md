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
useInternalVarsRecord({'text-color': 'red', 'bg-color': 'blue'}, true)
```

## Error Usage

```ts
/**
 * Throw a error: "The key must be a valid CSS variable name."
 */
useInternalVarsRecord({'_text-color': 'red', '_bg-color': 'blue'})
```
