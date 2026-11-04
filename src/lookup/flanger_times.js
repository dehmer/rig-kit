import times from './flanger_times.json' with { type: "json" };

const lookup = Object.fromEntries(times.map((x, i) => [128 * i, x]))

export const flangerTimes = v => lookup[v]
