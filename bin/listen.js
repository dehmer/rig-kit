#!/usr/bin/env node
import * as profiler from '../src/profiler.js'
import { decode } from '../src/decode.js'

profiler.open()


profiler.listen()

// // const request = SysEx.REQUEST[SysEx.FUNCTION_CODE.RRS](0x0a, 0x13, 16383)
// // const request = SysEx.REQUEST[SysEx.FUNCTION_CODE.RRS](0x04, 74, 8000)
// const request = SysEx.REQUEST[SysEx.FUNCTION_CODE.RMPV](0x32, 0) // STOMP A
// // const request = SysEx.REQUEST[SysEx.FUNCTION_CODE.RMPV](0x04, 71) // Rig Settings
// // const request = SysEx.REQUEST[SysEx.FUNCTION_CODE.RSPV](0x32, 0) // STOMP A, effect type
// const response = await profiler.query(request)
// console.log("response", response)

// await sleep(100)
// profiler.close()
