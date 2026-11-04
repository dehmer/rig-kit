import lookup from './mix.json' with { type: "json" };

export const mix = v => lookup[v]
