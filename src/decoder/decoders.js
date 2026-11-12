import * as R from 'ramda'
import hex from './hex.js'

export const TO_FIXED = n => v => Number(v.toFixed(n))
export const BOOL = v => !!v
export const DEVIDE = b => a => a / b
export const LOOKUP = kv => v => kv[v]
export const IDENTITY = v => `${hex(4)(v)} (${TO_FIXED(0)(v / 16383 * 100)}%)`
export const LINEAR = (min, max) => v => v / 16383 * (max - min) + min

export const P2_P6 = R.compose(TO_FIXED(1), LINEAR(2, 6))
export const N5_P5 = R.compose(TO_FIXED(1), LINEAR(-5, 5))
export const N12_P12 = R.compose(TO_FIXED(1), LINEAR(-12, 12))
export const N18_P18 = R.compose(TO_FIXED(1), LINEAR(-18, 18))
export const N36_P36 = v => v - 64
export const N50_P50 = R.compose(TO_FIXED(1), LINEAR(-50, 50))
export const Z_P10 = R.compose(TO_FIXED(1), LINEAR(0, 10))
export const Z_P100 = R.compose(TO_FIXED(0), LINEAR(0, 100))
export const Z_P2000 = R.compose(TO_FIXED(0), LINEAR(0, 2000))
export const N100_P100 =  R.compose(TO_FIXED(0), LINEAR(-100, 100))
export const Q = v => v // 0.100..5.000
export const RATE = R.compose(TO_FIXED(1), v => v / 16256 * 10)
