type StringRecord = Record<string, string>
type CornerShorthands = Record<string, string[]>

const CORNERS = ['start-start', 'start-end', 'end-end', 'end-start'] as const

const _expandShorthandValues = (values: string[]): string[] => {
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

const _getCornerRootName = (name: string): string =>
    name.replace(/-(start|end)-(start|end)$/, '')

export const varName = (name: string): string =>
    `--${name}`

export const defineVar = (name: string, value: string): string =>
    `${varName(name)}: ${value}`

export const createVar = (names: string[], fallbackValue: string): string => {
    const [mainVar, ...fallbackVars] = names
    const wrappedValue = fallbackVars
        .map(varName)
        .reduceRight((acc, currentVar) => `var(${currentVar}, ${acc})`, fallbackValue)
    return defineVar(mainVar, wrappedValue)
}

export const defineCornerVar = (name: string, value: string): string =>
    defineVar(name, value)

export const defineCorners = (baseName: string, values: string[]): string[] => {
    const expanded = _expandShorthandValues(values)
    return expanded
        .map((value, index) =>
            value ? defineCornerVar(`${baseName}-${CORNERS[index]}`, value) : ''
        )
        .filter(Boolean)
}

export const defineCornerVarWithFallback = (name: string, fallbackValue: string): string => {
    const rootName = _getCornerRootName(name)
    const value = `var(${varName(rootName)}, ${fallbackValue})`
    return defineVar(name, value)
}

export const expandCornerShorthands = (shorthands: CornerShorthands): StringRecord =>
    Object.entries(shorthands).reduce((acc, [baseName, values]) => {
        const expanded = _expandShorthandValues(values)
        const cornerVars = Object.fromEntries(
            expanded
                .map((value, index) =>
                    value ? [varName(`${baseName}-${CORNERS[index]}`), value] : null
                )
                .filter((pair): pair is [string, string] => pair !== null)
        )
        return { ...acc, ...cornerVars }
    }, {})

export const expandCornerFallbacks = (vars: StringRecord): StringRecord =>
    Object.fromEntries(
        Object.entries(vars).map(([name, fallbackValue]) => {
            const rootName = _getCornerRootName(name)
            const value = `var(${varName(rootName)}, ${fallbackValue})`
            return [varName(name), value]
        })
    )

export const toCssVarsObject = (obj: StringRecord): StringRecord =>
    Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [varName(key), value])
    )

export const toCssText = (vars: StringRecord): string =>
    Object.entries(vars)
        .map(([key, value]) => `${key}: ${value};`)
        .join('')