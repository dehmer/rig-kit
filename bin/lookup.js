#!/usr/bin/env node
import * as profiler from '../src/profiler.js'
import { REQUEST, FUNCTION_CODE } from '../src/sysex.js'
import sleep from "../src/sleep.js"

const PAGE = 52
const REGISTER = 20

profiler.open()

const loop  = async (v, max, inc) => {
    const request = REQUEST[FUNCTION_CODE.RRS](PAGE, REGISTER, v)
    console.log(Buffer.from(request))
    const { value, string } = await profiler.query(request)
    console.log(`  "${value}": "${string}",`)
    await sleep(5)
    if (v < max) loop(inc(v), max, inc)
}

// const loop  = async (register, max, inc) => {
//     const request = REQUEST[FUNCTION_CODE.RRS](PAGE, register, 16383)
//     const { value, string } = await profiler.query(request)
//     console.log(register, `  "${value}": "${string}",`)
//     await sleep(5)
//     if (register < max) loop(inc(register), max, inc)
// }

await loop(0, 16383, v => v + 128)
// await loop(0, 20, v => v + 1)
