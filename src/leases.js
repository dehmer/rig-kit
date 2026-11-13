import { FNCODE, REQUESTS, parse, unitAt } from "./sysex.js"
import { requester } from "./requester.js"

// TODO: tune both TTLs down considerable; they will hurt later shutdown
const LEASE_TTL = 3000 // ms, sliding
const UNSUPPORTED_TTL = 30000 // ms

/**
 * leases :: io => { acquire }
 *
 * Setup stateful lease management.
 * Useful for 'SPC -> RMPV -> MPC' situation.
 */
export const leases = io => {
    const { query } = requester(io)

    /**
     * unit :: { page, register }
     * lease :: { unit, values, status, buffered }
     * leases :: { string: lease }
     */
    const leases = {}

    /**
     * touch :: string -> lease
     */
    const touch = (key, lease, ttl = LEASE_TTL) => {
        clearTimeout(lease.timer)
        lease.timer = setTimeout(() => {
            delete leases[key]
        }, ttl)
    }

    /**
     * acquire :: message -> lease
     */
    const acquire = message => {
        const unit = unitAt(message.page, message.register)
        const key = `${unit.page}:${unit.register}`
        let lease = leases[key]

        if (!lease) {
            lease = { unit, values: null, status: 'loading', buffered: [] }
            leases[key] = lease

            // Request multiple parameter values for given parameter unit:
            const request = REQUESTS[FNCODE.RMPV](unit.page, unit.register)
            lease.ready = query(request)
                .then(buffer => {
                    const message = parse(buffer)
                    if (leases[key] !== lease) return lease // already expired
                    console.log(message.type)
                    if (message.type === 'timeout') {
                        lease.status = 'unsupported'
                        touch(key, lease, UNSUPPORTED_TTL)
                        return lease
                    }

                    // Apply buffered values if any:
                    lease.values = [...message.values] // assumes parse yields `values`
                    for (const { offset, raw } of lease.buffered) lease.values[offset] = raw

                    lease.buffered = []
                    lease.status = 'ready'
                    return lease
                })
        }

        if (lease.status !== 'unsupported') touch(key, lease)
        return lease
    }

    return { acquire }
}
