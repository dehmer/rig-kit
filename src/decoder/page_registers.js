import * as R from "ramda"
import * as D from "./decoders.js"
import * as L from "../lookup/index.js"
import { unitAt } from "../sysex.js"

export const REGISTERS = [

    // Rig Settings (page $04):
    [0x04, 0x03, "Panorama", D.N5_P5],
    [0x04, 0x04, "Transpose", D.N36_P36],
    [0x04, 0x4a, "DLY+REV", R.compose(D.TO_FIXED(0), v => (v - 8192) / 8192 * 100), "%"],
    [0x04, 0x01, "Volume", R.compose(D.TO_FIXED(1), L.volume), "dB"],
    [0x04, 0x49, "Spillover", D.BOOL],
    [0x04, 0x44, "Pedal Location", D.LOOKUP({0: "Off", 1: "Input", 2: "Pre Stack", 3: "Post Stack", 4: "Output"})],
    [0x04, 0x45, "Pedal Range", D.N5_P5],
    [0x04, 0x47, "Parallel Path", D.BOOL],
    [0x04, 0x48, "Parallel Mix", D.N5_P5],
    [0x04, 0x00, "Tempo", R.compose(D.TO_FIXED(1), D.DEVIDE(64)), "bpm"],
    [0x04, 0x02, "Tempo Enabled", D.BOOL],
    [0x04, 0x40, "Stomps Enabled", D.BOOL],
    [0x04, 0x41, "Stack Enabled", D.BOOL],
    [0x04, 0x42, "Effects Enabled", D.BOOL],

    // Input Section (page $09):
    [0x09, 0x03, "Noise Gate", D.Z_P10],
    [0x09, 0x04, "Clean Sense", D.N12_P12, "dB"],
    [0x09, 0x05, "Distortion Sense", D.N12_P12, "dB"],

    // Amplifier (page: $0a)
    [0x0a, 0x00, "Model", D.IDENTITY],
    [0x0a, 0x02, "Enabled", D.BOOL],
    [0x0a, 0x03, "Volume", D.N12_P12, "dB"],
    [0x0a, 0x04, "Generic Gain", D.Z_P10],
    [0x0a, 0x05, "Clean Compensation", D.Z_P10],
    [0x0a, 0x06, "Definition", D.Z_P10],
    [0x0a, 0x07, "Clarity", D.Z_P10],
    [0x0a, 0x08, "Power Sagging", D.Z_P10],
    [0x0a, 0x09, "Pick", D.N5_P5],
    [0x0a, 0x0a, "Compressor", D.Z_P10],
    [0x0a, 0x0b, "Tube Shape", D.Z_P10],
    [0x0a, 0x0c, "Tube Bias", D.Z_P10],
    [0x0a, 0x0f, "Direct Mix", D.Z_P10],

    // Amplifier EQ (page: $0b)
    [0x0b, 0x04, "Base", D.N5_P5],
    [0x0b, 0x05, "Middle", D.N5_P5],
    [0x0b, 0x06, "Treble", D.N5_P5],
    [0x0b, 0x07, "Presence", D.N5_P5],
    [0x0b, 0x08, "Position", D.LOOKUP({0: "Post", 1: "Pre"})],
]

/**
 * Aggregate registers by parameter units.
 */
export const UNIT_REGISTERS = REGISTERS.reduce((acc, entry) => {
    const [page, register, ...rest] = entry
    const unit = unitAt(page, register)
    const key = `${unit.page}:${unit.register}`

    const xs = acc[key] || []
    xs.push({
        offset: register - unit.register,
        name: rest[0],
        decode: rest[1],
        unit: rest[2]
    })

    acc[key] = xs
    return acc
}, {})
