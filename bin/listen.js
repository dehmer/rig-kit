#!/usr/bin/env node
import { FNCODE, parse } from "../src/sysex.js"
import { open, shutdown, listen, send } from "../src/io.js"
import { requester } from "../src/requester.js"
import { leases } from "../src/leases.js"


const io = open("Profiler")


// Combine SPC events and parameter unit leases:
const dispose = listen(io, buffer => {
    console.log(buffer)
})

setTimeout(() => {
    console.log("disposing listener...")
    dispose()
}, 5000)

// Graceful cleanup on exit
process.on("SIGINT", async () => {
    await shutdown(io)
    process.exit(0)
})
