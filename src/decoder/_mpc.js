import { PAGES } from "./pages.js"
import { UNIT_REGISTERS } from "./page_registers.js"
import { SLOTS } from "./slot.js"
import { EFFECTS } from "./effect.js"
import { EFFECT_REGISTERS } from "./effect_registers.js"

const resolveRegisters = message => {
    if (SLOTS[message.page]) {
        const effectType = message.values[0]
        const slot = SLOTS[message.page]
        const effect = EFFECTS[effectType]
        return [
            `${effect} (${slot[1]})`,
            EFFECT_REGISTERS[effectType]
        ]
    } else {
        const key = `${message.page}:${message.register}`
        const registers = UNIT_REGISTERS[key]
        return [
            PAGES[message.page],
            registers
        ]
    }
}

/**
 * Decode consecutive parameter unit:
 * Either effect or general page parameters.
 */
export default message => {
    const [name, registers] = resolveRegisters(message)

    return (registers || []).reduce((acc, register) => {
        const { offset, name: key, decode, unit } = register
        const values = message.values
        const value = values[offset]
        const decoded = decode(value, values) + (unit ? ` ${unit}` : "")
        acc[`${name}:${key}`] = decoded
        return acc
    }, {})
}