import { defineVar } from "./define-var.ts";
import { varName } from "./var-name.ts";

type CornerNameTail = 'start-start' | 'start-end' | 'end-end' | 'end-start'
const Corners = ['start-start', 'start-end', 'end-end', 'end-start'] as const
type CornersTuple = typeof Corners

type ExpandShorthandValues<T extends readonly string[]> = 
    T['length'] extends 0 ? ['', '', '', ''] :
    T['length'] extends 1 ? [T[0], T[0], T[0], T[0]] :
    T['length'] extends 2 ? [T[0], T[1], T[0], T[1]] :
    T['length'] extends 3 ? [T[0], T[1], T[2], T[1]] :
    T extends readonly [infer V1, infer V2, infer V3, infer V4, ...any[]] ? [V1, V2, V3, V4] : Array<string>

type BuildCornerVars<
    Base extends string,
    Values extends readonly string[],
    Corners extends readonly CornerNameTail[]
> = Values extends readonly [infer V, ...infer RestV extends readonly string[]]
    ? Corners extends readonly [infer C, ...infer RestC extends readonly CornerNameTail[]]
        ? V extends ''
            ? BuildCornerVars<Base, RestV, RestC>
            : [`--${Base}-${C & string}:${V & string}`, ...BuildCornerVars<Base, RestV, RestC>]
        : []
    : []

const _expandShorthandValues = (values: readonly string[]): string[] => {
    switch (values.length) {
        case 0:
            return ['', '', '', '']
        case 1:
            return [values[0], values[0], values[0], values[0]]
        case 2:
            return [values[0], values[1], values[0], values[1]]
        case 3:
            return [values[0], values[1], values[2], values[1]]
        default:
            return values.slice(0, 4)
    }
}

export function defineCornerVar<Corner extends `${string}-${CornerNameTail}`, Value extends string>(
    name: Corner, 
    value: Value
): `--${Corner}:${Value}` {
    return defineVar(name, value)
}

export function defineCornerVars<RootName extends string, const Values extends Readonly<Array<string>>>(
    baseName: RootName, 
    values: Values
): BuildCornerVars<RootName, ExpandShorthandValues<Values>, CornersTuple> {
    const expanded = _expandShorthandValues(values)
    return expanded
        .map((value, index) =>
            // @ts-ignore
            value ? defineCornerVar(`${baseName}-${CORNERS[index]}`, value) : ''
        )
        .filter(Boolean) as any
}

type VarName<T extends string> = `--${T}`
type GetCornerRootName<T extends string> = T extends `${infer Root}-${CornerNameTail}` ? Root : T
const _getCornerRootName = (name: string): string => name.replace(/-(start|end)-(start|end)$/, '')

export function defineCornerVarWithFallback<
    Name extends `${string}-${CornerNameTail}`, 
    Value extends string
>(name: Name, fallbackValue: Value): `${VarName<Name>}:var(${VarName<GetCornerRootName<Name>>},${Value})` {
    const rootName = _getCornerRootName(name)
    const value = `var(${varName(rootName)}, ${fallbackValue})`
    return defineVar(name, value) as any
}


// type CornerShorthands = Record<string, string[]>
// type StringRecord = Record<string, string>

// type CreateCornerVarsObject<
//     Base extends string,
//     Values extends readonly string[],
//     Corners extends readonly CornerNameTail[]
// > = Values extends readonly [infer V, ...infer RestV extends readonly string[]]
//     ? Corners extends readonly [infer C, ...infer RestC extends readonly CornerNameTail[]]
//         ? V extends ''
//             ? CreateCornerVarsObject<Base, RestV, RestC>
//             : { [K in VarName<`${Base}-${C & string}`>]: V & string } & CreateCornerVarsObject<Base, RestV, RestC>
//         : {}
//     : {}
// type UnionToIntersection<U> = 
//   (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

// // The final return type, which maps over the input object, creates corner objects for each key,
// // and then merges them all into one.
// type ExpandedCornerShorthands<S extends CornerShorthands> = UnionToIntersection<
//     { [K in keyof S]: CreateCornerVarsObject<
//         K & string,
//         ExpandShorthandValues<S[K]>,
//         CornersTuple
//     >}[keyof S]
// >

// export function expandCornerShorthands<const S extends CornerShorthands>(shorthands: S): ExpandedCornerShorthands<S> {
//     const result = Object.entries(shorthands).reduce((acc, [baseName, values]) => {
//         const expanded = _expandShorthandValues(values)
//         const cornerVars = Object.fromEntries(
//             expanded
//                 .map((value, index) =>
//                     value ? [varName(`${baseName}-${Corners[index]}`), value] : null
//                 )
//                 .filter((pair): pair is [string, string] => pair !== null)
//         )
//         return { ...acc, ...cornerVars }
//     }, {})

//     return result as any
// }

// type ExpandedCornerFallbacks<V extends StringRecord> = {
//     [K in keyof V as VarName<K & string>]: `var(${VarName<GetCornerRootName<K & string>>}, ${V[K] & string})`
// }

// export function expandCornerFallbacks<const V extends StringRecord>(
//     vars: V
// ): ExpandedCornerFallbacks<V> {
//     const result = Object.fromEntries(
//         Object.entries(vars).map(([name, fallbackValue]) => {
//             const rootName = _getCornerRootName(name)
//             const value = `var(${varName(rootName)}, ${fallbackValue})`
//             return [varName(name), value]
//         })
//     )
//     return result as any
// }

// expandCornerFallbacks({
//     'g-shape': '444px'
// })