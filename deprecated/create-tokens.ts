/**
 * 定义CSS逻辑角的四个方向。
 */
export const LogicalCorner = [
  'start-start',
  'start-end',
  'end-start',
  'end-end',
] as const;

/**
 * 一个表示CSS逻辑角的联合类型。
 */
export type LogicalCornerType = typeof LogicalCorner[number]

/**
 * 一个映射类型，用于在编译时计算 createLogicShapeTokens 函数的返回类型。
 * @template T - 输入的 token 对象类型，例如 `{ 'border-radius': '4px' }`。
 */
type CreateLogicShapeTokensResult<T extends Record<string, string>> = {
  [K in keyof T as `${K & string}-${LogicalCornerType}`]: T[K];
};

/**
 * 基于一个基础 token 对象，创建一组CSS逻辑形状属性。
 * 这是一个纯函数，它接收一个对象并返回一个新的、扩展后的对象。
 *
 * @template T - 一个包含基础属性名和值的对象。使用`const`断言以获得最精确的类型推断。
 * @param tokens - 键为基础属性名，值为CSS值的对象。
 * @returns 一个新的对象，其中每个基础属性都被扩展为四个逻辑角属性。
 *          例如: `{'border-radius': '4px'}` 变为 `{'border-radius-start-start': '4px', ...}`
 */
export function createLogicShapeTokens<const T extends Record<string, string>>(
  tokens: T
): CreateLogicShapeTokensResult<T> {
  return Object.entries(tokens).reduce((acc, [baseProp, value]) => {
    const newTokens = LogicalCorner.reduce((cornerAcc, corner) => {
      const propName = `${baseProp}-${corner}`;
      cornerAcc[propName] = value;
      return cornerAcc;
    }, {} as Record<string, string>);

    return { ...acc, ...newTokens };
  }, {}) as CreateLogicShapeTokensResult<T>;
}

