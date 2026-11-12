import sp from "./_sp.js"
import mpc from "./_mpc.js"
import { FNCODE } from "../sysex.js"

const DECODERS = {
    [FNCODE.SP]: sp,
    [FNCODE.MPC]: mpc
}

export const decode = message => {
    const { fncode } = message
    const decoder = DECODERS[fncode] || (message => ({
        ...message,
        warning: `no decoder found: ${fncode}`
    }))

    return decoder(message)
}