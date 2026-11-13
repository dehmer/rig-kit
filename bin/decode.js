#!/usr/bin/env node
import { open, shutdown } from "../src/io.js"
import { decoder } from "../src/decoder.js"

const io = open("Profiler")
const handleMPC = message => {
    console.log("MPC", message)
}

decoder(io, handleMPC)

// Graceful cleanup on exit
process.on("SIGINT", async () => {
    await shutdown(io)
    process.exit(0)
})
