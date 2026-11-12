#!/usr/bin/env node
import { FNCODE, REQUESTS, parse } from "../src/sysex.js"
import { open, close } from "../src/io.js"
import { requester } from "../src/requester.js"

const io = open("Profiler")
const { query } = requester(io)

const PAGE = 52
const REGISTER = 0

let time = Date.now()
const response = await query(REQUESTS[FNCODE.RRS](PAGE, REGISTER, 0))
console.log("[response]", Date.now() - time, parse(response))

close(io)
