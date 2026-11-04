import midi from "@julusian/midi"
import Signal from '@syncpoint/signal'
import * as R from 'ramda'
import safe from "./safe.js"
import { parse } from "./sysex.js"
import { SLOTS, SLOT_PAGES } from './slot.js'
import { effects } from './effect.js'
import sleep from './sleep.js'
import * as SysEx from './sysex.js'
import { decode } from './decode.js'

const { Input, Output } = midi

// const portNames = [
//     ...Input.getPortNames().map(x => `input/${x}`),
//     ...Output.getPortNames().map(x => `output/${x}`)
// ]
// console.log(portNames)

const state = {
    open: false
}

const message = Signal.of()

let time = 0
message.on(message => {
    console.log(Date.now() - time, message)
    time = Date.now()
})

// Collect stomp/effect type for slots in order to decode effect patameters.
const slots = Signal.scan((acc, message) => {
    if (message.function !== "SPC") return acc
    if (message.register !== 0) return acc
    if (!SLOT_PAGES.includes(message.page)) return acc

    const [section, slot] = SLOTS[message.page]

    // Need new instance to trigger signal update:
    return {
        ...acc,
        [message.page]: {
            key: message.value,
            slot: slot,
            effect: effects[message.value]
        }
    }
}, {}, message)

const decoder = Signal.link(slots => message => decode(message, slots), slots)

export const open = async (portname = "Profiler") => {
    state.input = new Input()
    state.output = new Output()
    const {input, output } = state

    const sysex = false
    const timing = false
    const activeSensing = false
    input.ignoreTypes(sysex, timing, activeSensing)

    // Forward parsed buffer to message signal:
    input.on('messageBuffer', (_, buffer) => message(parse(buffer)))

    input.openPortByName(portname)
    output.openPortByName(portname)

    // Query stomp/effect slots (fire/forget):
    // Sadly loading an effect into a slot through Rig Manager
    // does not trigger an event. This makes it hard to sync current
    // slot configurations.

    const SLEEP = 10 // ms
    for (const page of SLOT_PAGES) {
        const request = SysEx.REQUEST[SysEx.FUNCTION_CODE.RSPV](page, 0)
        output.sendMessage(request)
        await sleep(SLEEP)
    }

    state.open = true
}

export const close = () => {
    if (open) {
        state.output.closePort()
        state.input.closePort()
        state.open = false
        delete state.output
        delete state.input
    }
}

export const listen = () => {
    // Register default message handler:
    const messageHandler = decoder => (_, buffer) => {
        safe(() => {
            const parsed = parse(buffer)
            const decoded = decoder()(parsed)
            console.log("[messageHandler]", decoded)
        })
    }

    state.input.on('messageBuffer', messageHandler(decoder))
}

export const query = async (buffer, millis = 1000) => {
    return new Promise((resolve, reject) => {
        const queryState = {}

        const clearTimeout_ = () => {
            if (!queryState.timeout) return
            clearTimeout(queryState.timeout)
            delete queryState.timeout
        }

        const clearHandler_ = () =>{
            if (!queryState.handler) return
            state.input.off('messageBuffer', queryState.handler)
            delete queryState.handler
        }

        // Dedicated response handler: clear timeout, remove handler, resolve.
        queryState.handler = (_, buffer) => {
            safe(() => {
                clearTimeout_()
                clearHandler_()
                resolve(parse(buffer))
            })
        }

        // Register additional handler and send request:
        state.input.on('messageBuffer', queryState.handler)

        // Set timeout to reject on no message within given time:
        queryState.timeout = setTimeout(() => {
            clearHandler_()
            delete queryState.timeout
            reject(new Error("request timeout"))
        }, millis)

        state.output.sendMessage(buffer)
    })
}
