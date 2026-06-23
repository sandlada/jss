import { Result } from "./types.ts";

export function cssVarName<Name extends string>(name: Name): `--${Name}` {
    return `--${name}`
}

export function defineVar<Name extends string, Value extends string>(name: Name, value: Value): Result<[`--${Name}`, Value], `--${Name}:${Value};`> {
    return {
        value: [cssVarName(name), value],
        cssText: `--${name}:${value};`
    }
}

export function defineVars() {

}

export const BorderRadius = {
    StartStart: 'border-start-start-radius',
    StartEnd: 'border-start-end-radius',
    EndStart: 'border-end-start-radius',
    EndEnd: 'border-end-end-radius',
    Full: 'border-radius',
} as const

type BorderRadiusProperty = typeof BorderRadius[keyof typeof BorderRadius]
type CornerProperty = Exclude<BorderRadiusProperty, typeof BorderRadius.Full>

type RadiusObjectFromKeys<
    T extends readonly CornerProperty[],
    V extends string
> = {
    [P in T[number]]: V
}

type FullRadiusObject<V extends string> = {
    [BorderRadius.StartStart]: V
    [BorderRadius.StartEnd]: V
    [BorderRadius.EndStart]: V
    [BorderRadius.EndEnd]: V
}

type RadiusValueObject = {
    [K in CornerProperty]?: string
}

export function borderRadius<T extends RadiusValueObject>(config: T): T
export function borderRadius<V extends string>(
    corner: typeof BorderRadius.Full,
    value: V
): FullRadiusObject<V>
export function borderRadius<
    const C extends readonly CornerProperty[],
    V extends string
>(corners: C, value: V): RadiusObjectFromKeys<C, V>
export function borderRadius<C extends CornerProperty, V extends string>(
    corner: C,
    value: V
): { [K in C]: V }

export function borderRadius(
    configOrCornerOrCorners:
        | RadiusValueObject
        | BorderRadiusProperty
        | readonly CornerProperty[],
    value?: string
): Record<string, string> {
    if (typeof configOrCornerOrCorners === 'object') {
        return Array.isArray(configOrCornerOrCorners)
            ? (configOrCornerOrCorners as readonly CornerProperty[]).reduce(
                  (acc, key) => ({ ...acc, [key]: value! }),
                  {}
              )
            : configOrCornerOrCorners
    }

    if (configOrCornerOrCorners === BorderRadius.Full) {
        return {
            [BorderRadius.StartStart]: value!,
            [BorderRadius.StartEnd]: value!,
            [BorderRadius.EndStart]: value!,
            [BorderRadius.EndEnd]: value!,
        }
    }

    return { [configOrCornerOrCorners]: value! }
}