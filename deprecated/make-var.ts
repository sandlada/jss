/**
 * @fileoverview
 * ```typescript
 * // --_color
 * makeVar('_color')
 * 
 * // --_color: red
 * makeVar('_color', 'red')
 * 
 * // --_color: red;
 * makeVar('_color', 'red', true)
 * 
 * // --text-color
 * makeVar('text-color')
 * 
 * //--text-color: #000
 * makeVar('text-color', '#000')
 * 
 * // --text-color: #000;
 * makeVar('text-color', '#000', true)
 * ```
 */

function makeVar<P1 extends string>(cssVariable: P1): `--${P1}`
function makeVar<P1 extends string, P2 extends string>(cssVariable: P1, cssValue: P2): `--${P1}: ${P2}`
function makeVar<P1 extends string, P2 extends string>(cssVariable: P1, cssValue: P2, withSemicolon: true): `--${P1}: ${P2};`
function makeVar<P1 extends string, P2 extends string>(cssVariable: P1, cssValue: P2, withSemicolon?: boolean): `--${P1}: ${P2}`

function makeVar<P1 extends string, P2 extends string>(cssVariable: P1, cssValue?: P2, withSemicolon: boolean = false) {
    if(cssValue === undefined) {
        return `--${cssVariable}`
    }
    if(withSemicolon) {
        return `--${cssVariable}:${cssValue};`
    }
    return `--${cssVariable}:${cssValue}`
}

export {
    makeVar
}
