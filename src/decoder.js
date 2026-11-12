import { listen } from "../src/io.js"
import { FNCODE, parse } from "./sysex.js"
import { leases } from "./leases.js"
import { decode } from "./decoder/decode.js"

// Combine SPC events and parameter unit leases:
const decodeSPC = acquire => async (fn, message) => {
    const lease = acquire(message)
    const { unit, values } = lease
    const offset = message.register - unit.register

    if (lease.status === 'ready') values[offset] = message.value
    else if (lease.status === 'loading') {
        lease.buffered.push({ offset, raw: message.value })
    }

    if (lease.status === "ready") {
        // Decode as MPC:
        fn({
            fncode: FNCODE.MPC,
            page: unit.page,
            register: unit.register,
            values
        })
    }

}

const DECODERS = ((acquire) => ({
    [FNCODE.SPC]: decodeSPC(acquire)
}))

const DEFAULT_DECODER = (fn, message) => fn(message)

export const decoder = (io, fn) => {
    const { acquire } = leases(io)
    const decoders = DECODERS(acquire)

    const disposeListener = listen(io, async buffer => {
        const message = parse(buffer)
        const decoder = (decoders[message.fncode] || DEFAULT_DECODER)
        decoder(message => fn(decode(message)), message)
    })

    const dispose = () => {
        disposeListener()
    }

    return { dispose }
}