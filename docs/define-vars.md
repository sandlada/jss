# defineVars

## Correct Usage

```ts
// ['--color: red']
defineVars('color', 'red')
defineVars('--color', 'red')

// ['--_color: red']
defineVars('_color', 'red')
defineVars('--_color', 'red')

// ['--color: red']
defineVars({'color': 'red'})

// ['--color: red', '--bg-color: blue']
defineVars({
    'color'   : 'red',
    'bg-color': 'blue',
})

// ['--color: red;']
defineVars('color', 'red', true)

// ['--color: red;', '--bg-color: blue;']
defineVars({
    'color'   : 'red',
    'bg-color': 'blue',
}, true)
```

## Special Usage

```ts
// '--a: var(--b, var(--c, default-value))'
defineVars('a', ['b', 'c'], 'default-value')

// '--a: var(--b, var(--c, default-value));'
defineVars('a', ['b', 'c'], 'default-value', true)

// '--a: var(--b, var(--c, ))'
defineVars('a', ['b', 'c'], '')

// '--a: var(--b, var(--c, ));'
defineVars('a', ['b', 'c'], '', true)

// '--a: var(--b, var(--c, ))'
defineVars('a', ['b', 'c'])

// '--a: var(--b, var(--c));'
defineVars('a', ['b', 'c'], true)
```
