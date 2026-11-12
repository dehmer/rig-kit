import { RESPONSE_CODES, parse } from "./sysex.js"
import { send, listen } from "./io.js"

const QUERY_TIMEOUT = 1500 // ms
const REQUEST_DELAY = 20 // ms


const responseKey = buffer => {
    const parts = parse(buffer)
    const tokens =
        RESPONSE_CODES[parts.fncode]
            ? [RESPONSE_CODES[parts.fncode], parts.page, parts.register]
            : [parts.fncode, parts.page, parts.register]

    return tokens.join(":")
}

export const requester = io => {
    const pending = {}
    const queue = []
    let inflight = null

    let now = Date.now()

    const disposeListener = listen(io, buffer => {
        const key = responseKey(buffer)
        response([key, buffer])
    })

    const response = ([key, result]) => {
        const entry = pending[key]
        if (!entry) return // no matching query

        clearTimeout(entry.timer)
        delete pending[key]
        entry.resolvers.forEach(resolve => resolve(result))

        // TODO: explain why this condition is needed
        if (key === inflight) {
            setTimeout(() => {
                inflight = null
                process()
            }, REQUEST_DELAY)
        }
    }

    const process = () => {
        if (inflight) return

        while (queue.length) {
            const { key, buffer } = queue.shift()
            const entry = pending[key]
            if (!entry) continue // already resolved

            inflight = key
            const onTimeout = () => {
                response([key, { type: "timeout", key }])
            }
            entry.timer = setTimeout(onTimeout, QUERY_TIMEOUT)
            return send(io, buffer)
        }
    }

    // Request/response.
    const query = buffer => new Promise(resolve => {
        const key = responseKey(buffer)
        const entry = pending[key]

        // Coalesce: Add resolver to "same" previous request.
        if (entry) return entry.resolvers.push(resolve)

        // Queue request and start processing queue:
        pending[key] = { resolvers: [resolve] }
        queue.push({ key, buffer })
        process()
    })

    return { query }
}
