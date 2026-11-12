#!/usr/bin/env node
import { FNCODE, parse } from "../src/sysex.js"
import { open, close, listen, send } from "../src/io.js"
import { requester } from "../src/requester.js"
import { leases } from "../src/leases.js"


const io = open("Profiler")
// const { query } = requester(io)

const handleMPC = message => console.log("MPC", message)
const { acquire } = leases(io)

// Combine SPC events and parameter unit leases:
const disposeListener = listen(io, async buffer => {
    const message = parse(buffer)
    if (message.fncode !== FNCODE.SPC) return

    const lease = acquire(message)
    const { unit, values } = lease
    const offset = message.register - unit.register

    if (lease.status === 'ready') values[offset] = message.value
    else if (lease.status === 'loading') {
        lease.buffered.push({ offset, raw: message.value })
    }

    if (lease.status === "ready") {
        // Decode as MPC:
        handleMPC({
            fncode: FNCODE.MPC,
            page: unit.page,
            register: unit.register,
            values
        })
    }
})

// Graceful cleanup on exit
process.on("SIGINT", () => {
    close(io)
    process.exit(0)
})
