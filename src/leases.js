import { FNCODE, REQUESTS, parse, unitAt } from "./sysex.js"
import { requester } from "./requester.js"

const LEASE_TTL = 3000 // ms, sliding
const UNSUPPORTED_TTL = 30000 // ms

export const leases = io => {
    const { query } = requester(io)
    const leases = {}

    const touch = (key, lease, ttl = LEASE_TTL) => {
        clearTimeout(lease.timer)
        lease.timer = setTimeout(() => {
            delete leases[key]
        }, ttl)
    }

    const acquire = message => {
        const unit = unitAt(message.page, message.register)
        const key = `${unit.page}:${unit.register}`
        let lease = leases[key]

        if (!lease) {
            lease = { unit, values: null, status: 'loading', buffered: [] }
            leases[key] = lease

            const request = REQUESTS[FNCODE.RMPV](unit.page, unit.register)
            lease.ready = query(request)
                .then(buffer => {
                    const message = parse(buffer)
                    if (leases[key] !== lease) return lease // already expired
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
