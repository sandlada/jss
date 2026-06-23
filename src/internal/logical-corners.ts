/** The four logical CSS corners */
export const LOGICAL_CORNERS = [
    'start-start',
    'start-end',
    'end-start',
    'end-end',
] as const

/** Union type of the four corner suffixes */
export type LogicalCorner = typeof LOGICAL_CORNERS[number]

/** Full corner suffix like `-start-start` */
export type CornerSuffix = `-${LogicalCorner}`

/**
 * Extract the base name by removing the corner suffix at the type level.
 *
 * @example
 * ExtractCornerBaseName<'container-shape-start-start'> → 'container-shape'
 */
export type ExtractCornerBaseName<S extends string> =
    S extends `${infer Base}-start-start` ? Base
    : S extends `${infer Base}-start-end` ? Base
    : S extends `${infer Base}-end-start` ? Base
    : S extends `${infer Base}-end-end` ? Base
    : never

/** Check whether `S` ends with a valid logical‑corner suffix. */
export type IsCornerName<S extends string> =
    S extends `${string}${CornerSuffix}` ? true : false

// ── Runtime ──

/**
 * Extract the base name from a full corner variable name at runtime.
 *
 * @example
 * extractCornerBaseName('container-shape-start-start') → 'container-shape'
 * extractCornerBaseName('_container-shape-start-start') → '_container-shape'
 * extractCornerBaseName('--container-shape-start-start') → '--container-shape'
 */
export function extractCornerBaseName(name: string): string {
    for (const corner of LOGICAL_CORNERS) {
        const suffix = `-${corner}`
        if (name.endsWith(suffix)) {
            return name.slice(0, -suffix.length)
        }
    }
    throw new TypeError(
        `"${name}" must end with a valid logical corner (` +
        `-start-start, -start-end, -end-start, -end-end)`,
    )
}

/**
 * Build a CSS variable name from a base name and a logical corner suffix.
 * Conditionally adds a `-` separator based on the base name.
 *
 * - `buildCornerName('shape', 'start-start')` → `--shape-start-start`
 * - `buildCornerName('', 'start-start')` → `--start-start`
 * - `buildCornerName('_', 'start-start')` → `--_start-start`
 */
export function buildCornerName(base: string, corner: string): string {
    const prefixed = base.startsWith('--') ? base : `--${base}`
    // Only add '-' separator when the prefixed name has actual content beyond '--'
    // and doesn't end with '_' (which acts as its own separator)
    if (prefixed === '--' || prefixed.endsWith('_')) {
        return `${prefixed}${corner}`
    }
    return `${prefixed}-${corner}`
}

/**
 * Validate that `name` ends with a valid logical‑corner suffix.
 * Throws `TypeError` otherwise.
 */
export function validateCornerName(name: string): void {
    const valid = LOGICAL_CORNERS.some(c => name.endsWith(`-${c}`))
    if (!valid) {
        throw new TypeError(
            `"${name}" is not a valid logical‑corner name. ` +
            `Expected it to end with one of: ` +
            `-start-start, -start-end, -end-start, -end-end.`,
        )
    }
}

/**
 * Validate that `name` is a non‑empty string (for logical‑corner APIs that
 * reject empty / single‑segment names).
 */
export function validateNonEmptyString(name: string): void {
    if (name === '') {
        throw new TypeError('Name must not be empty.')
    }
}
