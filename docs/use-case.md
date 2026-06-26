# Use Case

新功能：

- 提供類型化樣式覆蓋輔助
- 使用xxx作爲新功能函數的暫時名稱

```ts
/**
 * 假設用戶擁有兩個組件樣式，分別是FocusRing, CompB
 * 其中FocusRing是共享組件，CompB使用到FocusRing并且CompB需要覆蓋FocusRing的默認樣式
 */
const FocusRing = {
    'outline-color': 'red',
} as const
const CompB = {
    // CompB自己的樣式
    'bg-color': 'blue',
    // 此處需要覆蓋FocusRing的默認樣式
    ...xxx(FocusRing, { 'outline-color': 'blue' }),
} as const
```

可以接受的使用方式：

```ts
const FocusRing = {
    'outline-color': 'red',
} as const

/**
 * {
 * 'outline-color': 'blue'
 * }
 */
const overrideRecord = xxx({
    'outline-color': 'blue'
})
```

```ts
/**
 * {
 * 'outline-color': 'blue'
 * }
 */
const overrideRecord = xxx(FocusRing, {
    // 此處有類型提示
    'outline-color': 'blue'
})
const overrideRecord = xxx<typeof FocusRing>({
    // 此處有類型提示
    'outline-color': 'blue'
})
// 這個勉强可接受，因爲需要輸入繁瑣的keyof typeof
const overrideRecord = xxx<keyof typeof FocusRing>({
    // 此處有類型提示
    'outline-color': 'blue'
})
```

```ts
/**
 * {
 * '--my-comp-css-prefix-outline-color': 'blue'
 * }
 */
const overrideRecord = xxx(FocusRing, '--my-comp-css-prefix', {
    // 此處有類型提示
    'outline-color': 'blue'
})
const overrideRecord = xxx<typeof FocusRing>('--my-comp-css-prefix', {
    // 此處有類型提示
    'outline-color': 'blue'
})
```

上述方法展示了xxx函數的使用場景，但考慮複雜的參數傳遞和認知負擔，需要使用函數式(如下給出了多種函數式設計原型，但考慮到第一種FocusRing是對象而非類型，所以我認爲方案一更可選)：

```ts
const FocusRing = {
    'outline-color': 'red',
} as const

// 方案一
const overrideRecord = xxx<typeof FocusRing>({
    // 此處有類型提示
    'outline-color': 'blue'
})('--my-comp-css-prefix')
// 方案一 變體 (更推薦方案一)
const overrideRecord = xxx<keyof typeof FocusRing>({
    // 此處有類型提示
    'outline-color': 'blue'
})('--my-comp-css-prefix')

// 方案二
const overrideRecord = xxx(FocusRing)('--my-comp-css-prefix', {
    // 此處有類型提示
    'outline-color': 'blue'
})
```
