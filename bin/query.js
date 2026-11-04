#!/usr/bin/env node
import * as profiler from '../src/profiler.js'
import { REQUEST, FUNCTION_CODE } from '../src/sysex.js'
import sleep from "../src/sleep.js"

const PAGE = 52
const REGISTER = 0

await profiler.open()

let time = Date.now()
const request = REQUEST[FUNCTION_CODE.RMPV](PAGE, REGISTER)
const respone = await profiler.query(request)
console.log("[response]", Date.now() - time, respone)
