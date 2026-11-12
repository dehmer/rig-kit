import { STRING_KEYS } from './strings.js'

export default message => {
    const address = message.page << 8 | message.register
    const key = STRING_KEYS[address]

    return key
        ? { [key]: message.string }
        : { ...message, warning: `key not found: ${address}` }
}
