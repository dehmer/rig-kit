import notes from './tremolo_notes.json' with { type: "json" };

const lookup = Object.fromEntries(notes.map((x, i) => [128 * i, x]))

export const tremoloNotes = v => lookup[v]
