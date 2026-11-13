import { RESPONSE_CODES, parse } from "./sysex.js"
import { send, listen } from "./io.js"

const QUERY_TIMEOUT = 1500 // ms
const REQUEST_DELAY = 20 // ms

const Key = {

    /**
     * response :: Buffer -> string
     */
    response: buffer => {
        const parts = parse(buffer)
        const tokens =
            RESPONSE_CODES[parts.fncode]
                ? [RESPONSE_CODES[parts.fncode], parts.page, parts.register]
                : [parts.fncode, parts.page, parts.register]

        return tokens.join(":")
    }
}

/**
 * requester :: IO -> { query }
 *
 * Setup stateful query/response machinery.
 */
export const requester = io => {

    /**
     * pending :: { string: { resolvers, timer } }
     */
    const pending = {}

    /**
     * queue :: [{ key, buffer }]
     */
    const queue = []

    /**
     * inflight :: string
     */
    let inflight = null

    // Dedicated listener to handle potential responses:
    const responseHandler = buffer => response([Key.response(buffer), buffer])
    const disposeListener = listen(io, responseHandler)

    /**
     * response :: [string, Buffer | { type: "timeout", key }] -> unit
     *
     * Handle response buffer or query timeout.
     */
    const response = ([key, result]) => {
        const entry = pending[key]
        if (!entry) return // no matching query

        clearTimeout(entry.timer)
        delete pending[key]
        entry.resolvers.forEach(resolve => resolve(result))

        // Hardware Rate Limiting / Cooldown:
        if (key === inflight) {
            setTimeout(() => {
                inflight = null
                process()
            }, REQUEST_DELAY)
        }
    }

    /**
     * process :: () -> unit
     *
     * Process next query from queue if any.
     */
    const process = () => {
        if (inflight) return

        while (queue.length) {
            const { key, buffer } = queue.shift()
            const entry = pending[key]
            if (!entry) continue // already resolved

            inflight = key
            const onTimeout = () => response([key, { type: "timeout", key }])
            entry.timer = setTimeout(onTimeout, QUERY_TIMEOUT)
            return send(io, buffer)
        }
    }

    /**
     * query :: buffer -> Promise<Buffer | { type: "timeout" }>
     *
     * Schedule query and return async response.
     */
    const query = buffer => new Promise(resolve => {
        const key = Key.response(buffer)
        const entry = pending[key]

        // Coalesce: Add resolver to matching previous request.
        if (entry) return entry.resolvers.push(resolve)

        // Queue query and start processing queue:
        pending[key] = { resolvers: [resolve] }
        queue.push({ key, buffer })
        process()
    })

    /**
     * Teardown logic: clear timers, resolve pending promises with shutdown status,
     * and clean up the MIDI listener.
     */
    const dispose = () => {
        disposeListener()

        // Notify all pending/inflight queries that shutdown occurred
        for (const key of Object.keys(pending)) {
            const entry = pending[key]
            clearTimeout(entry.timer)
            entry.resolvers.forEach(resolve => resolve({ type: "shutdown", key }))
        }

        // Clear references
        for (const key in pending) delete pending[key]
        queue.length = 0
        inflight = null
    }

    // Automatically tie requester lifecycle to IO disposables if present:
    io.disposables.push(dispose)

    return { query }
}
