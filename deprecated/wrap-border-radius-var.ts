import { LogicalCorner, type LogicalCornerType } from "./create-tokens.ts";
import { BuildVar, wrapVar } from "./wrap-var.ts";

/**
 * 从一个完整的逻辑角属性名中提取其基础名称。
 * 例如: 'border-radius-start-start' -> 'border-radius'
 * @template S - 完整的属性名字符串类型。
 */
type BaseName<S extends string> = S extends `${infer Base}-${LogicalCornerType}`
    ? Base
    : S;

/**
 * 为一个特定的 border-radius 逻辑属性创建一个带有层级回退的 `var()` 包装器。
 * 
 * 它会自动推断出根属性作为第一级回退。
 * 例如: `wrapBorderRadiusVar('border-end-end-radius', '4px')` 
 * 会生成 `var(--border-end-end-radius, var(--border-radius, 4px))`
 *
 * @param specificName - 完整的逻辑角属性名，例如 `border-end-end-radius`。
 * @param finalFallback - 最终的回退值。
 * @param options - 包含 `withSemicolon` 的选项对象。
 */
export function wrapBorderRadiusVar<
    const N extends string,
    F extends string
>(
    specificName: N,
    finalFallback: F,
    options: { withSemicolon: true }
): `${BuildVar<[N, BaseName<N>], F>};`;

export function wrapBorderRadiusVar<
    const N extends string,
    F extends string
>(
    specificName: N,
    finalFallback: F,
    options?: { withSemicolon?: boolean }
): BuildVar<[N, BaseName<N>], F>;

/**
 * @param specificName - 完整的逻辑角属性名。
 * @param options - 包含 `withSemicolon` 的选项对象。
 */
export function wrapBorderRadiusVar<const N extends string>(
    specificName: N,
    options: { withSemicolon: true }
): `${BuildVar<[N, BaseName<N>]>};`;

export function wrapBorderRadiusVar<const N extends string>(
    specificName: N,
    options?: { withSemicolon?: boolean }
): BuildVar<[N, BaseName<N>]>;

/**
 * `wrapBorderRadiusVar` 的统一实现。
 */
export function wrapBorderRadiusVar(
    specificName: string,
    fallbackOrOptions?: string | { withSemicolon?: boolean },
    options?: { withSemicolon?: boolean }
): string {
    // 纯函数逻辑：从 specificName 派生出 baseName
    const deriveBaseName = (name: string): string => {
        for (const corner of LogicalCorner) {
            const suffix = `-${corner}`;
            if (name.endsWith(suffix)) {
                return name.slice(0, -suffix.length);
            }
        }
        // 如果没有匹配的后缀，则将自身作为根，尽管这不太可能发生
        return name;
    };

    const baseName = deriveBaseName(specificName);
    const names = [specificName, baseName];

    // 通过组合复用 `wrapVar` 的逻辑
    if (typeof fallbackOrOptions === 'string') {
        return wrapVar(names, fallbackOrOptions, options);
    }

    return wrapVar(names, fallbackOrOptions);
}