import { varName } from "./var-name.ts";

type BuildVarChain<T extends Readonly<Array<string>>, Fallback extends string> =
  T extends readonly [infer Head, ...infer Tail extends Readonly<Array<string>>]
    ? `var(${VarName<Head & string>},${BuildVarChain<Tail, Fallback>})`
    : Fallback

type VarName<T extends string> = `--${T}`
type VarDefinition<Names extends readonly string[], Value extends string> =
  Names extends readonly [infer Main, ...infer Fallbacks extends readonly string[]]
    ? `${VarName<Main & string>}:${BuildVarChain<Fallbacks, Value>}`
    : string

function defineVar<Name extends string, Value extends string>(name: Name, value: Value): `${VarName<Name>}:${Value}`
function defineVar<const Names extends Readonly<Array<string>>, Value extends string>(names: Names, value: Value): VarDefinition<Names, Value>

function defineVar<Name extends string, const Names extends Readonly<Array<string>>, Value extends string>(
    nameOrNames: Name | Names,
    fallbackValue: Value
) {
    if(typeof nameOrNames === 'string') {
        return `${varName(nameOrNames)}:${fallbackValue}`
    }

    if (nameOrNames.length === 0) {
        return ''
    }

    const [mainVar, ...fallbackVars] = nameOrNames
    const wrappedValue = fallbackVars
        .map(varName)
        // @ts-ignore
        .reduceRight((acc, currentVar) => `var(${currentVar},${acc})`, fallbackValue)
    return `--${mainVar}:${wrappedValue}`
}

export {
    defineVar
}
