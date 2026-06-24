# @sandlada/jss

一個簡單的 CSS-in-JS 函式庫，提供兩類工具來管理 CSS 自訂屬性（變數）：

- **define 系列** — 產生 CSS 宣告（`--name: value`），用於輸出到樣式表
- **use 系列** — 產生 `var()` 引用（`var(--name, fallback)`），用於組合進其他宣告中

完整文件請參閱 [docs/README.md](./docs/README.md)。

## 安裝

```bash
npm install @sandlada/jss
```

專案使用 TypeScript 6 + ESM，匯入即可獲得完整的型別推斷。

---

## define 系列 — 產生 CSS 宣告

| 函式                                               | 說明                                                                                | 文件                                                                                                   |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `defineVars(name, value)`                          | 基本變數定義，回傳字串陣列                                                          | [docs/define-vars.md](./docs/define-vars.md)                                                           |
| `defineLogicalBorderRadiusVars(base, value)`       | 展開為四個邏輯角（`start-start` / `start-end` / `end-start` / `end-end`），回傳陣列 | [docs/define-logical-border-radius-vars.md](./docs/define-logical-border-radius-vars.md)               |
| `defineLogicalBorderRadiusVarsRecord(base, value)` | 同上，但回傳 Record 物件                                                            | [docs/define-logical-border-radius-vars-record.md](./docs/define-logical-border-radius-vars-record.md) |
| `defineTokenRefsRecord(tokens, options?)`          | 將設計 Token 綁定為內部變數（`--_key: var(--key, value)`），支援形狀屬性展開        | [docs/define-token-refs-record.md](./docs/define-token-refs-record.md)                                 |

```ts
import { defineVars } from '@sandlada/jss'

// ['--color: red']
defineVars('color', 'red')

// ['--color: red', '--bg-color: blue']
defineVars({ color: 'red', 'bg-color': 'blue' })

// 第三個參數 true 加上分號尾綴
defineVars('color', 'red', true) // ['--color: red;']
```

```ts
import { defineTokenRefsRecord } from '@sandlada/jss'

const AppTokens = {
  'button-text-color': 'red',
  'button-bg-color': 'white',
  'button-shape': 'var(--md-sys-shape-corner-full, 9999px)',
} as const

// 將設計 Token 綁定為內部變數：
// { '--_button-text-color': 'var(--button-text-color, red)', ... }
defineTokenRefsRecord(AppTokens)

// 展開形狀屬性為四個邏輯角：
defineTokenRefsRecord(AppTokens, { expandShapes: ['button-shape'] })
// {
//   '--_button-text-color': 'var(--button-text-color, red)',
//   '--_button-shape-start-start': 'var(--button-shape-start-start, var(--md-sys-shape-corner-full, 9999px))',
//   '--_button-shape-start-end': 'var(--button-shape-start-end, ...)',
//   '--_button-shape-end-start': 'var(--button-shape-end-start, ...)',
//   '--_button-shape-end-end': 'var(--button-shape-end-end, ...)',
// }

// 加入基底變數作為中繼備援（兩層 var() 遞迴）：
defineTokenRefsRecord(AppTokens, { expandShapes: ['button-shape'], useBaseFallback: true })
// {
//   '--_button-shape-start-start': 'var(--button-shape-start-start, var(--button-shape, var(--md-sys-shape-corner-full, 9999px)))',
//   ...
// }
```

---

## use 系列 — 產生 `var()` 引用

| 函式                                                 | 說明                                      | 文件                                                                                             |
| ---------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `useVars(name, fallback)`                            | 基本變數引用，回傳陣列                    | [docs/use-vars.md](./docs/use-vars.md)                                                           |
| `useVarsRecord(name, fallback)`                      | 基本變數引用，回傳 Record                 | [docs/use-vars-record.md](./docs/use-vars-record.md)                                             |
| `useInternalVars(name, fallback)`                    | 內部變數（`--_` 前綴）引用，回傳陣列      | [docs/use-internal-vars.md](./docs/use-internal-vars.md)                                         |
| `useInternalVarsRecord(name, fallback)`              | 內部變數引用，回傳 Record                 | [docs/use-internal-vars-record.md](./docs/use-internal-vars-record.md)                           |
| `useLogicalBorderRadiusVars(corner, fallback)`       | 邏輯角變數（兩層 `var()` 遞迴），回傳陣列 | [docs/use-logical-border-radius-vars.md](./docs/use-logical-border-radius-vars.md)               |
| `useLogicalBorderRadiusVarsRecord(corner, fallback)` | 邏輯角變數，回傳 Record                   | [docs/use-logical-border-radius-vars-record.md](./docs/use-logical-border-radius-vars-record.md) |

```ts
import { useVars } from '@sandlada/jss'

// ['var(--color-primary, blue)']
useVars('color-primary', 'blue')

// 支援 `var()` 遞迴鏈：
// ['var(--a, var(--b, var(--c, default-value)))']
useVars(['a', 'b', 'c'], 'default-value')

// Record 模式自動剝除 -- 前綴作為鍵名：
// { 'color-primary': 'var(--color-primary, blue)' }
useVarsRecord('--color-primary', 'blue')
```

---

## 開發

```bash
# 安裝依賴
npm install

# 執行測試
npx vitest

# 型別檢查
npx tsc --noEmit
```
