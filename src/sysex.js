import range from "./utils/range.js"

export const SYX = 0xf0 // start of system exclusive
export const EOX = 0xf7 // end of system exclusive
export const MANUFACTURER_ID = Buffer.from([0x00, 0x20, 0x33])
export const PRODUCT_TYPE = 0x00 // Kemper Profiler
export const DEVICE_ID_UNDEF = 0x00
export const DEVICE_ID_OMNI = 0x7f


export const FNCODE = {
    SPC: 0x01,  // (1) Single Parameter Change
    MPC: 0x02,  // (2) Multi Parameter Change
    SP: 0x03,   // (3) String Parameter
    BLOB: 0x04, // (4) BLOB
    // 0x05: reserved
    EPC: 0x06,  // (6) Extended Parameter Change
    ESPC: 0x07, // (7) Extended String Parameter Change
    MMPC: 0x08, // (8) Morphed Multi Parameter Changed
    RSPV: 0x41, // (65) Request Single Parameter Value
    RMPV: 0x42, // (66) Request Multi Parameter Values
    RSP: 0x43,  // (67) Request String Parameter
    RESP: 0x47, // (71) Request Extended String Parameter
    RRS: 0x7c,  // (124) Request Parameter Value as Rendered String
    // 0x7e: reserved
    // 0x7f: reserved
}


// Map request function codes to response function codes.
export const RESPONSE_CODES = {
    [FNCODE.RMPV]: FNCODE.MPC,
    [FNCODE.RRS]: 0x3c
}


/**
 * A page is divided into one or more consecutive blocks (parameter units)
 * with various lengths. Each block starts at a specific register address.
 */
export const UNIT_LIST = [
    { "page": 4, "register": 0, "length": 1 },
    { "page": 4, "register": 1, "length": 1 },
    { "page": 4, "register": 2, "length": 1 },
    { "page": 4, "register": 3, "length": 2 },
    { "page": 4, "register": 64, "length": 1 },
    { "page": 4, "register": 65, "length": 1 },
    { "page": 4, "register": 66, "length": 1 },
    { "page": 4, "register": 68, "length": 2 },
    { "page": 4, "register": 71, "length": 4 },

    // Page 5: Only supported for Kemper Profiler MK 2
    { "page": 5, "register": 0, "length": 3 },
    { "page": 5, "register": 5, "length": 4 },
    { "page": 5, "register": 10, "length": 3 },
    { "page": 5, "register": 15, "length": 3 },
    { "page": 5, "register": 20, "length": 3 },
    { "page": 5, "register": 25, "length": 5 },
    { "page": 5, "register": 35, "length": 5 },
    { "page": 5, "register": 40, "length": 5 },

    { "page": 9, "register": 0, "length": 6 },
    { "page": 10, "register": 0, "length": 24 },
    { "page": 11, "register": 0, "length": 14 },
    { "page": 12, "register": 0, "length": 15 },
    { "page": 50, "register": 0, "length": 110 },
    { "page": 51, "register": 0, "length": 110 },
    { "page": 52, "register": 0, "length": 110 },
    { "page": 53, "register": 0, "length": 110 },
    { "page": 56, "register": 0, "length": 110 },
    { "page": 58, "register": 0, "length": 110 },
    { "page": 60, "register": 0, "length": 110 },
    { "page": 61, "register": 0, "length": 110 },
    { "page": 118, "register": 0, "length": 12 },
    { "page": 118, "register": 12, "length": 12 }
]

const ORDERED_UNITS_BY_PAGE = UNIT_LIST.reduce((acc, entry) => {
    acc[entry.page] = acc[entry.page] || []
    acc[entry.page].push(entry)

    // Sort for each entry. Not efficient, but effective.
    acc[entry.page].sort((a, b) => a.register - b.register)
    return acc
}, {})

export const unitAt =
    (page, register) =>
        (ORDERED_UNITS_BY_PAGE[page] || [])
            .find(u => register >= u.register && register < u.register + u.length)


/**
 * Request factories.
 */
export const REQUESTS = {

    [FNCODE.RMPV]: (page, register) => Buffer.from([
        SYX,
        ...MANUFACTURER_ID,
        PRODUCT_TYPE,
        DEVICE_ID_OMNI,
        FNCODE.RMPV,
        0x00, // instance address
        page,
        register,
        EOX
    ]),

    [FNCODE.RRS]: (page, register, value) => Buffer.from([
        SYX,
        ...MANUFACTURER_ID,
        PRODUCT_TYPE,
        DEVICE_ID_OMNI,
        FNCODE.RRS,
        0x00, // instance address
        page,
        register,
        value >> 7, // MSB (14-bit NRPN)
        value & 0x7F, // LSB (14-bit NRPN)
        EOX
    ]),

    [FNCODE.SPC]: (page, register, value) => Buffer.from([
        SYX,
        ...MANUFACTURER_ID,
        PRODUCT_TYPE,
        DEVICE_ID_OMNI,
        FNCODE.SPC,
        0x00, // instance address
        page,
        register,
        value >> 7, // MSB (14-bit NRPN)
        value & 0x7F, // LSB (14-bit NRPN)
        EOX
    ]),

    [FNCODE.RSPV]: (page, register) => [
        SYX,
        ...MANUFACTURER_ID,
        PRODUCT_TYPE,
        DEVICE_ID_OMNI,
        FNCODE.RSPV,
        0x00, // instance address
        page,
        register,
        EOX
    ]
}


/**
 * Extract 14-bit NRPN and string values for different layouts.
 */
const VALUES = {
    [FNCODE.SPC]: buffer => {
        const msb = buffer.readInt8(0) & 0x7f
        const lsb = buffer.readInt8(1) & 0x7f
        return {
            value: (msb << 7) | lsb
        }
    },

    [FNCODE.MPC]: buffer => {
        const count = buffer.length / 2 // number of 14-bit register values
        const values = range(count)
            .map(x => x * 2)
            .map(offset => {
                const msb = buffer.readInt8(offset) & 0x7f
                const lsb = buffer.readInt8(offset + 1) & 0x7f
                return (msb << 7) | lsb
            })

            return { values }
    },

    [FNCODE.SP]: buffer => {
        const string = buffer.toString("utf8", 0, buffer.length - 1).trim()
        return { string }
    },

    /**
     * Reply to RRS (0x47).
     */
    0x3c: buffer => {
        const msb = buffer.readInt8(0) & 0x7f
        const lsb = buffer.readInt8(1) & 0x7f

        return {
            value: (msb << 7) | lsb,
            string: buffer.toString("utf8", 2, buffer.length - 1).trim()
        }
    }
}


export const parse = buffer => {
    const syx = buffer.readInt8(0) & 0xff
    const eox = buffer.readInt8(buffer.length - 1) & 0xff
    if (syx !== SYX || eox !== EOX) return {}

    // Locate manufacturer ID:
    const index = buffer.indexOf(MANUFACTURER_ID)
    if (index === -1) return {}

    // Skip product type and device ID and extract payload (message):
    const message = buffer.subarray(index + MANUFACTURER_ID.length + 2, buffer.length - 1)

    const fncode = message.readInt8(0) & 0xff // function code
    const values = message.subarray(4)
    const reader = VALUES[fncode] || (() => ({ values }))

    return {
        fncode,
        page: message.readInt8(2) & 0xff,
        register: message.readInt8(3) & 0xff,
        ...reader(values)
    }
}
