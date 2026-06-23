

export function makeVar<T extends string>(name: T): `--${T}`
export function makeVar<T extends string, V extends number | string>(name: T, value: V): `--${T}: ${V}`

export function makeVar<T extends string, V extends number | string>(name: T, value?: V): string {
    if(value) {
        return `--${name}: ${(String(value))}`
    }
    return `--${name}`
}

type BuildNestedVar<
  TNames extends string[],
  TInnermostValue extends string | number | undefined,
  TCurrentResult extends string | TInnermostValue = TInnermostValue
> = TNames extends [...infer RestNames extends string[], infer CurrentName extends string]
  ?
    BuildNestedVar<
      RestNames,
      TInnermostValue,
      `var(${CurrentName}${TCurrentResult extends undefined ? '' : `, ${TCurrentResult}`})`
    >
  :
    TCurrentResult extends string
    ? TCurrentResult
    : never;

export function wrapVar<T extends string>(name: T): `var(${T})`
export function wrapVar<T extends Array<string>, V extends string | number>(name: T, value: V): BuildNestedVar<T, V>
export function wrapVar<T extends Array<string>>(...name: T): BuildNestedVar<T, undefined>
export function wrapVar<T extends Array<string>, V extends string | number>(name: T, value: V): BuildNestedVar<T, V>

export function wrapVar<T extends string | Array<string>, V extends string | number>(name: T, value?: V) {
    if(Array.isArray(name)) {
        if(value) {
            return name.reduce((p, c) => p + `var(${c}, `, '') + String(value) + ')'.repeat(name.length)
        }
        return name.reduce((p, c) => p + `var(${c}, `, '') + ')'.repeat(name.length)

    } else {
        if(value) {
            return `var(${name}, ${value})`
        }
        return `var(${name})`
    }
}

export function createTokens<T extends Record<string, string | number>>(
    record: T, 
    callbacks?: {
        cssNameCallback?: (e: string) => string, 
        cssValueCallback?: (key: string, value: string | number) => string
    }
) {
    const defNameCb = (k: string) => `--${k}`
    const defValueCb = (_: string, v: string | number) => String(v)
    const nameCb = callbacks?.cssNameCallback ?? defNameCb
    const valueCb = callbacks?.cssValueCallback ?? defValueCb
    return Object.entries(record).reduce((p, [k, v]) => ({...p, [nameCb(k)]: valueCb(k, v)}), {})
}