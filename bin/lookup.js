#!/usr/bin/env node
import { FNCODE, REQUESTS, parse } from "../src/sysex.js"
import { open, close } from "../src/io.js"
import { requester } from "../src/requester.js"

const PAGE = 0x3c
const REGISTER = 0x47

const io = open("Profiler")
const { query } = requester(io)


const loop  = async (v, max, inc) => {
    const request = REQUESTS[FNCODE.RRS](PAGE, REGISTER, v)
    const response = await query(request)
    if (response.type !== "timeout") {
        const { value, string } = parse(response)
        console.log(`  "${value}": "${string}",`)
    }

    if (v < max) {
        await loop(inc(v), max, inc)
    }
}

await loop(0, 16383, v => v + 1)
// await loop(0, 2, v => v + 1)

close(io)