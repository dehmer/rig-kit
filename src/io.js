import midi from "@julusian/midi"
const { Input, Output } = midi

/**
 * open :: s -> IO
 *
 * Open input/output ports for given name.
 */
export const open = (portName = "Profiler") => {
    const input = new Input()
    const output = new Output()
    const disposables = []

    const sysex = false
    const timing = true
    const activeSensing = true
    input.ignoreTypes(sysex, timing, activeSensing)

    input.openPortByName(portName)
    output.openPortByName(portName)

    return { input, output, disposables }
}

/**
 * shutdown :: IO -> unit
 *
 * Close input/output ports and frees other resources.
 */
export const shutdown = async io => {
    const { input, output, disposables } = io

    // Execute disposables in reverse order sequentially:
    const ds = [...disposables].reverse()
    for (const dispose of ds) {
        await dispose()
    }

    disposables.length = 0
    output.closePort()
    input.closePort()
}

/**
 * dispose :: () -> unit
 * handler :: Buffer -> unit
 * listen :: dispose d, handler h => io -> h -> d
 *
 * Listen to `messageBuffer` events on input port and
 * forward to handler function.
 */
export const listen = (io, fn) => {
    const { input, disposables } = io
    const handler = (_, buffer) => setImmediate(() => fn(buffer))
    input.on("messageBuffer", handler)

    const dispose = () => {
        input.off("messageBuffer", handler)
        const index = disposables.indexOf(dispose)
        if (index !== -1) {
            disposables.splice(index, 1)
        }
    }

    disposables.push(dispose)
    return dispose
}

/**
 * send :: IO -> Buffer -> unit
 *
 * Send buffer to output port.
 */
export const send = (io, buffer) => {
    const { output } = io
    setImmediate(() => output.sendMessage(buffer))
}
