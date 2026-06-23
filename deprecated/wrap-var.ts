
export type BuildVar<
    N extends readonly string[],
    F extends string = ''
> = N extends readonly [
    infer Head extends string,
    ...infer Tail extends readonly string[]
]
    ? `var(--${Head}${Tail['length'] extends 0
    ? F extends ''
    ? ''
    : `, ${F}`
    : `, ${BuildVar<Tail, F>}`
    })`
    : F

type WrapVarOptions = {
    withSemicolon?: boolean;
}

export function wrapVar<const N extends readonly string[], F extends string>(names: N, finalFallback: F, options: { withSemicolon: true }): `${BuildVar<N, F>};`
export function wrapVar<const N extends readonly string[], F extends string>(names: N, finalFallback: F, options?: WrapVarOptions): BuildVar<N, F>
export function wrapVar<const N extends readonly string[]>(names: N, options: { withSemicolon: true }): `${BuildVar<N>};`
export function wrapVar<const N extends readonly string[]>(names: N, options?: WrapVarOptions): BuildVar<N>
export function wrapVar<N extends string, F extends string>(name: N, fallback: F, options: { withSemicolon: true }): `var(--${N}, ${F});`
export function wrapVar<N extends string, F extends string>(name: N, fallback: F, options?: WrapVarOptions): `var(--${N}, ${F})`
export function wrapVar<N extends string>(name: N, options: { withSemicolon: true }): `var(--${N});`
export function wrapVar<N extends string>(name: N, options?: WrapVarOptions): `var(--${N})`

export function wrapVar(nameOrNames: string | readonly string[], fallbackOrOptions?: string | WrapVarOptions, options?: WrapVarOptions): string {
    const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
    if (names.length === 0) {
        return ''
    }

    let finalFallback: string | undefined
    let opts: WrapVarOptions = {}

    if (typeof fallbackOrOptions === 'string') {
        finalFallback = fallbackOrOptions
        opts = options ?? {}
    } else if (typeof fallbackOrOptions === 'object') {
        opts = fallbackOrOptions
    }

    const buildVarString = (
        varNames: readonly string[],
        fallback?: string
    ): string => {
        const reversedNames = [...varNames].reverse()
        const [first, ...rest] = reversedNames

        const initialValue = fallback
            ? `var(--${first}, ${fallback})`
            : `var(--${first})`

        return rest.reduce(
            (acc, name) => `var(--${name}, ${acc})`,
            initialValue
        )
    }

    const result = buildVarString(names, finalFallback)

    return opts.withSemicolon ? `${result};` : result
}

