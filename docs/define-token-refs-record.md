# defineTokenRefsRecord

將設計 Token 綁定為內部 CSS 變數引用的高階函式。自動為每個 Token 產生 `--_key: var(--key, value)` 的宣告，並支援將形狀（shape）屬性展開為四個邏輯角。

## 適用場景

當你有一組設計 Token（如 `button-text-color: red`），需要將它們以內部變數形式 (`--_button-text-color`) 綁定到樣式系統中，並自動建立 `var()` 備援鏈。

## 基本用法

```ts
import { defineTokenRefsRecord } from '@sandlada/jss'

const AppTokens = {
  'button-text-color': 'red',
  'button-bg-color': 'white',
  'button-shape': 'var(--md-sys-shape-corner-full, 9999px)',
} as const

// Output 1: 基本綁定
defineTokenRefsRecord(AppTokens)
// {
//   '--_button-text-color': 'var(--button-text-color, red)',
//   '--_button-bg-color': 'var(--button-bg-color, white)',
//   '--_button-shape': 'var(--button-shape, var(--md-sys-shape-corner-full, 9999px))',
// }

// Output 2: 加上分號尾綴
defineTokenRefsRecord(AppTokens, true)
// {
//   '--_button-text-color': 'var(--button-text-color, red);',
//   ...
// }
```

## 形狀屬性展開

形狀屬性（如 `button-shape`、`container-shape`）通常需要對應到四個邏輯角。`defineTokenRefsRecord` 可自動將其展開。

### Output 3：基本展開

```ts
defineTokenRefsRecord(AppTokens, { expandShapes: ['button-shape'] })
// {
//   '--_button-text-color': 'var(--button-text-color, red)',
//   '--_button-bg-color': 'var(--button-bg-color, white)',
//   '--_button-shape-start-start': 'var(--button-shape-start-start, var(--md-sys-shape-corner-full, 9999px))',
//   '--_button-shape-start-end':   'var(--button-shape-start-end,   var(--md-sys-shape-corner-full, 9999px))',
//   '--_button-shape-end-start':   'var(--button-shape-end-start,   var(--md-sys-shape-corner-full, 9999px))',
//   '--_button-shape-end-end':     'var(--button-shape-end-end,     var(--md-sys-shape-corner-full, 9999px))',
// }
```

### Output 4：加上基底變數遞迴備援

有時希望每個角在找不到精確值時，回退到基底變數（如 `--button-shape`）再回退到原始值。設定 `useBaseFallback: true` 即可：

```ts
defineTokenRefsRecord(AppTokens, {
  expandShapes: ['button-shape'],
  useBaseFallback: true,
})
// {
//   '--_button-shape-start-start': 'var(--button-shape-start-start, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
//   '--_button-shape-start-end':   'var(--button-shape-start-end,   var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
//   '--_button-shape-end-start':   'var(--button-shape-end-start,   var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
//   '--_button-shape-end-end':     'var(--button-shape-end-end,     var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
// }
```

## 自動偵測形狀鍵

設定 `expandShapes: true` 可自動偵測所有以 `shape` 結尾的鍵名：

```ts
defineTokenRefsRecord({ 'container-shape': '8px', 'text-color': 'blue' }, {
  expandShapes: true,
})
// 'container-shape' 被自動展開為四個角，'text-color' 維持不變
```

## 選項

```ts
interface DefineTokenRefsOptions {
  /** 是否在值尾綴加上分號 */
  semi?: boolean
  /**
   * 要展開為四個邏輯角的鍵名。
   * - `true`: 自動偵測所有以 `shape` 結尾的鍵
   * - `readonly string[]`: 明確指定鍵名列表
   */
  expandShapes?: boolean | readonly string[]
  /**
   * 展開形狀屬性時，是否在 var() 中加入基底變數作為中繼備援。
   * - `false` (預設): `var(--button-shape-start-start, <value>)`
   * - `true`: `var(--button-shape-start-start, var(--button-shape, <value>))`
   */
  useBaseFallback?: boolean
}
```

## 型別推斷

基本用法（不傳 options）可獲得完整的 literal 型別推斷：

```ts
const r = defineTokenRefsRecord({ color: 'red' })
//    ^? { '--_color': 'var(--color, red)' }
```

使用 options 時回傳 `Record<string, string>`。

## 注意事項

- 鍵名若已帶有 `--` 前綴會被保留：`'--color-primary'` → `'--_color-primary'`
- 鍵名若帶有 `_` 前綴會如實轉換：`'_internal-var'` → `'--__internal-var'`
- 值中的 `var()` 表達式會原樣保留，不會被解析或轉換
