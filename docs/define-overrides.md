# defineOverrides

型別安全的樣式覆蓋輔助函式。採用 curried API 設計：第一階段傳入來源物件與覆蓋物件（提供型別約束的鍵值檢查），第二階段可選擇性套用 CSS 變數前綴。

## 適用場景

當一個元件需要覆蓋共享元件（如 `FocusRing`）的預設樣式屬性時，`defineOverrides` 提供完整的 TypeScript 鍵值提示，確保只覆蓋存在於來源型別中的屬性。

## API

```ts
defineOverrides(source, overrides)(prefix?)
```

- `source` — 來源樣式物件，用於推導型別約束。傳入 `null` 表示不需要型別約束。
- `overrides` — 覆蓋物件，鍵必須存在於 `source` 中（當 `source` 非 `null` 時），所有鍵皆為可選。
- `prefix`（可選）— CSS 變數前綴。未提供時回傳原始覆蓋物件。

## 基本用法

```ts
import { defineOverrides } from '@sandlada/jss'

const FocusRing = {
  'outline-color': 'red',
} as const

// 無前綴：回傳原始覆蓋物件
const r1 = defineOverrides(FocusRing, {
  'outline-color': 'blue',
})()
// → { 'outline-color': 'blue' }

// 有前綴：所有鍵套用 CSS 變數前綴
const r2 = defineOverrides(FocusRing, {
  'outline-color': 'blue',
})('--my-comp-css-prefix')
// → { '--my-comp-css-prefix-outline-color': 'blue' }
```

## 型別安全

第一階段從 `source` 引數推導來源型別 `T`，對傳入的覆蓋物件進行鍵值約束。所有鍵皆為可選，可只覆蓋部分屬性或傳入 `{}`：

```ts
const FocusRing = {
  'outline-color': 'red',
  'outline-width': '2px',
} as const

// ✅ 正確：只覆蓋部分鍵
defineOverrides(FocusRing, { 'outline-color': 'blue' })

// ✅ 正確：空物件
defineOverrides(FocusRing, {})

// ❌ 型別錯誤：'invalid-key' 不存在
defineOverrides(FocusRing, { 'invalid-key': 'blue' })
```

## 無型別約束用法

若不需要型別檢查，將 `source` 傳入 `null`：

```ts
defineOverrides(null, { 'outline-color': 'blue' })()
// → { 'outline-color': 'blue' }

defineOverrides(null, { 'outline-color': 'blue' })('--pfx')
// → { '--pfx-outline-color': 'blue' }
```

## 前綴處理規則

- 鍵名中的 `--` 前綴會先被剝離，再套用新的前綴
- 空字串前綴（`''`）視為無前綴，回傳原始物件
- 前綴本身不會被標準化（允許任意字串）

```ts
defineOverrides(null, { '--outline-color': 'blue' })('--pfx')
// → { '--pfx-outline-color': 'blue' }
```

## 實際使用案例

```ts
const FocusRing = {
  'outline-color': 'red',
} as const

const overrideRecord = defineOverrides(FocusRing, {
  'outline-color': 'blue',
})('--my-comp-css-prefix')

const CompB = {
  'bg-color': 'blue',
  ...overrideRecord,
} as const
// CompB = {
//   'bg-color': 'blue',
//   '--my-comp-css-prefix-outline-color': 'blue',
// }
```
