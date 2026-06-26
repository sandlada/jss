import { defineOverrides } from './dist/index.js'

const FocusRing = {
    'outline-color': 'red',
    'outline-width': '1px',
}
const CompB = {
    'bg-color': 'blue',
    ...defineOverrides(FocusRing, { 'outline-color': 'blue' })('--my-comp')
}

console.log(CompB)
