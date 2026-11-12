#!/usr/bin/env node
import { open, close } from "../src/io.js"
import { decoder } from "../src/decoder.js"


const io = open("Profiler")
const handleMPC = message => console.log("MPC", message)
const { dispose } = decoder(io, handleMPC)

// Graceful cleanup on exit
process.on("SIGINT", () => {
    dispose()
    close(io)
    process.exit(0)
})
