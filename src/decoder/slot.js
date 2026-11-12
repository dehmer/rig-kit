const SLOTS_LIST = [
    [0x32, "Stomp", "A"],
    [0x33, "Stomp", "B"],
    [0x34, "Stomp", "C"],
    [0x35, "Stomp", "D"],
    [0x38, "Effect", "X"],
    [0x3a, "Effect", "MOD"],
    [0x3c, "Effect", "REV"],
    [0x3d, "Effect", "DLY"],
]

export const SLOTS = Object.fromEntries(
    SLOTS_LIST.map(([key, ...value]) => [key, value])
)

export const SLOT_PAGES = SLOTS_LIST.map(entry => entry[0])
