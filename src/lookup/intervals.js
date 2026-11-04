import lookup from './intervals.json' with { type: "json" };

export const intervals = v => lookup[v]
