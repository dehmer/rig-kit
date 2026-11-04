import lookup from './keys.json' with { type: "json" };

export const keys = v => lookup[v]
