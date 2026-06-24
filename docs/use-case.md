# Use Case

```ts
const AppTokens = {
    'button-text-color': 'red',
    'button-bg-color': 'white',

    // 需要攻克的常见特殊情况
    'button-shape': 'var(--md-sys-shape-corner-full, 9999px)',
} as const

/**
 * 期待的输出1
 * {
 * '--_button-text-color': 'var(--button-text-color, red)',
 * '--_button-bg-color': 'var(--button-bg-color, white)',
 * '--_button-shape': 'var(--button-shape, var(--md-sys-shape-corner-full, 9999px))',
 * }
 */
const output = xxx(AppTokens)

/**
 * 期待的输出2
 * {
 * '--_button-text-color': 'var(--button-text-color, red);',
 * '--_button-bg-color': 'var(--button-bg-color, white);',
 * '--_button-shape': 'var(--button-shape, var(--md-sys-shape-corner-full, 9999px));',
 * }
 */
const output = xxx(AppTokens)

/**
 * 期待的输出3
 * {
 * '--_button-text-color': 'var(--button-text-color, red)',
 * '--_button-bg-color': 'var(--button-bg-color, white)',
 * '--_button-shape-start-start': 'var(--button-shape-start-start, var(--md-sys-shape-corner-full, 9999px))',
 * '--_button-shape-start-end': 'var(--button-shape-start-end, var(--md-sys-shape-corner-full, 9999px))',
 * '--_button-shape-end-start': 'var(--button-shape-end-start, var(--md-sys-shape-corner-full, 9999px))',
 * '--_button-shape-end-end': 'var(--button-shape-end-end, var(--md-sys-shape-corner-full, 9999px))',
 * }
 */
const output = xxx(AppTokens)

/**
 * 期待的输出4
 * {
 * '--_button-text-color': 'var(--button-text-color, red)',
 * '--_button-bg-color': 'var(--button-bg-color, white)',
 * '--_button-shape-start-start': 'var(--button-shape-start-start, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
 * '--_button-shape-start-end': 'var(--button-shape-start-end, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
 * '--_button-shape-end-start': 'var(--button-shape-end-start, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
 * '--_button-shape-end-end': 'var(--button-shape-end-end, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
 * }
 */
const output = xxx(AppTokens)
```
