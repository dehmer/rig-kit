import midi from "@julusian/midi"
const { Input, Output } = midi

export const open = (portName = "Profiler") => {
    const input = new Input()
    const output = new Output()

    const sysex = false
    const timing = true
    const activeSensing = true
    input.ignoreTypes(sysex, timing, activeSensing)

    input.openPortByName(portName)
    output.openPortByName(portName)

    return { input, output }
}

export const close = io => {
    const { input, output } = io
    output.closePort()
    input.closePort()
}

export const listen = (io, fn) => {
    const { input } = io
    const handler = (_, buffer) => setImmediate(() => fn(buffer))
    input.on("messageBuffer", handler)
    return () => input.off("messageBuffer", handler)
}

/**
 * Fire/forget.
 */
export const send = (io, buffer) => {
    const { output } = io
    setImmediate(() => output.sendMessage(buffer))
}
