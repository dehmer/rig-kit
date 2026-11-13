import { listen } from "../src/io.js"
import { FNCODE, parse } from "./sysex.js"
import { leases } from "./leases.js"
import { decode } from "./decoder/decode.js"

// Combine SPC events and parameter unit leases:
const decodeSPC = acquire => async (fn, message) => {
    const lease = acquire(message)
    if (lease.status === 'unsupported') return

    const { unit } = lease
    const offset = message.register - unit.register

    if (lease.status === 'loading') {
        lease.buffered.push({ offset, raw: message.value })
    }

    await lease.ready
    const { values } = lease
    values[offset] = message.value

    fn({
        fncode: FNCODE.MPC,
        page: unit.page,
        register: unit.register,
        values
    })
}

const DECODERS = ((acquire) => ({
    [FNCODE.SPC]: decodeSPC(acquire)
}))

const DEFAULT_DECODER = (fn, message) => fn(message)

export const decoder = (io, fn) => {
    const { acquire } = leases(io)
    const decoders = DECODERS(acquire)

    listen(io, async buffer => {
        const message = parse(buffer)
        const decoder = (decoders[message.fncode] || DEFAULT_DECODER)
        decoder(message => fn(decode(message)), message)
    })
}