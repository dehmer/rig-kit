import range from "./range.js"

export const SYX = 0xf0 // start of system exclusive
export const EOX = 0xf7 // end of system exclusive
export const MANUFACTURER_ID = Buffer.from([0x00, 0x20, 0x33])
export const PRODUCT_TYPE = 0x00 // Kemper Profiler
export const DEVICE_ID_UNDEF = 0x00
export const DEVICE_ID_OMNI = 0x7f

export const FUNCTION_CODE = {
    SPC: 0x01,  // Single Parameter Change
    MPC: 0x02,  // Multi Parameter Change
    SP: 0x03,   // String Parameter
    BLOB: 0x04, // BLOB
    // 0x05: reserved
    EPC: 0x06,  // Extended Parameter Change
    ESPC: 0x07, // Extended String Parameter Change
    MMPC: 0x08, // Morphed Multi Parameter Changed
    RSPV: 0x41, // Request Single Parameter Value
    RMPV: 0x42, // Request Multi Parameter Values
    RSP: 0x43,  // Request String Parameter
    RESP: 0x47, // Request Extended String Parameter
    RRS: 0x7c,  // (124) Request Parameter Value as Rendered String
    // 0x7e: reserved
    // 0x7f: reserved
}

export const RESPONSE_CODE = {
    RRS: 0x3c, // (60)
}

/**
 * Request factories.
 */
export const REQUEST = {
    [FUNCTION_CODE.SPC]: (page, register, value) => [
        SYX,
        ...MANUFACTURER_ID,
        PRODUCT_TYPE,
        DEVICE_ID_OMNI,
        FUNCTION_CODE.SPC,
        0x00, // instance address
        page,
        register,
        value >> 7, // MSB (14-bit NRPN)
        value & 0x7F, // LSB (14-bit NRPN)
        EOX
    ],

    [FUNCTION_CODE.RSPV]: (page, register) => [
        SYX,
        ...MANUFACTURER_ID,
        PRODUCT_TYPE,
        DEVICE_ID_OMNI,
        FUNCTION_CODE.RSPV,
        0x00, // instance address
        page,
        register,
        EOX
    ],

    [FUNCTION_CODE.RRS]: (page, register, value) => [
        SYX,
        ...MANUFACTURER_ID,
        PRODUCT_TYPE,
        DEVICE_ID_OMNI,
        FUNCTION_CODE.RRS,
        0x00, // instance address
        page,
        register,
        value >> 7, // MSB (14-bit NRPN)
        value & 0x7F, // LSB (14-bit NRPN)
        EOX
    ],

    /**
     * A page is divided into one or more consecutive blocks (parameter unit)
     * with various lengths. Each block starts at a specific register address.
     */
    [FUNCTION_CODE.RMPV]: (page, register) => [
        SYX,
        ...MANUFACTURER_ID,
        PRODUCT_TYPE,
        DEVICE_ID_OMNI,
        FUNCTION_CODE.RMPV,
        0x00, // instance address
        page,
        register,
        EOX
    ]
}

const PARSERS = {
    [FUNCTION_CODE.SPC]: message => {
        // Skip instance address (0) and read controller MSB/LSB (page, register);
        const page = message.readInt8(2) & 0xff
        const register = message.readInt8(3) & 0xff

        // Read 14-bit NRPN value:
        const msb = message.readInt8(4) & 0x7f
        const lsb = message.readInt8(5) & 0x7f
        const value = (msb << 7) | lsb
        return { "function": "SPC", message, page, register, value }
    },

    [FUNCTION_CODE.MPC]: message => {
        // Skip instance address (0) and read controller MSB/LSB (page, register);
        const page = message.readInt8(2) & 0xff
        const register = message.readInt8(3) & 0xff // start register
        const count = (message.length - 4) / 2 // number of register values

        const values = range(count)
            .map(x => x * 2 + 4)
            .map(offset => {
                const msb = message.readInt8(offset) & 0x7f
                const lsb = message.readInt8(offset + 1) & 0x7f
                return (msb << 7) | lsb
            })

        return { "function": "MPC", message, page, register, values }
    },

    [FUNCTION_CODE.SP]: message => {
        // Skip instance address (0) and read controller MSB/LSB (page, register);
        const page = message.readInt8(2) & 0xff
        const register = message.readInt8(3) & 0xff // start register
        const string = message.toString("utf8", 4, message.length - 1).trim()
        return { "function": "SP", message, page, register, string }
    },

    0x3c: message => {
        // Skip instance address (0) and read controller MSB/LSB (page, register);
        const page = message.readInt8(2) & 0xff
        const register = message.readInt8(3) & 0xff

        // Read 14-bit NRPN value:
        const msb = message.readInt8(4) & 0x7f
        const lsb = message.readInt8(5) & 0x7f
        const value = (msb << 7) | lsb
        const string = message.toString("utf8", 6, message.length - 1).trim()

        return { "function": "RSS (response)", message, page, register, value, string }
    }
}

export const parse = buffer => {
    const syx = buffer.readInt8(0) & 0xff
    const eox = buffer.readInt8(buffer.length - 1) & 0xff
    if (syx !== SYX || eox !== EOX) return

    // Locate manufacturer ID:
    const index = buffer.indexOf(MANUFACTURER_ID)
    if (index === -1) return

    // Skip product type and device ID and extract payload (message):
    const message = buffer.subarray(index + MANUFACTURER_ID.length + 2, buffer.length - 1)
    const functionCode = message.readInt8(0) & 0xff
    const parser = PARSERS[functionCode] || (() => ({ functionCode }))
    return parser(message)
}