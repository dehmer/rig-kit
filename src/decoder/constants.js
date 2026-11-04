import * as R from 'ramda'
import { toFixed, volume, bool, divide, v14 } from "./decoders.js"


/**
 * String tags by controller (MSB, LSB).
 */
export const STRING_TAGS = {
  0x0001: "Rig:Name",
  0x0002: "Rig:Author",
  0x0003: "Rig:Modification Date",
  0x0004: "Rig:Comment", // S/N
//   0x0005: "Rig:Author",

  0x0010: "Amp:Name",
  0x0011: "Amp:Author",
  0x0012: "Amp:Creation Date",
  0x0013: "Amp:Creation Time", // Now longer used; now same as "Amp:Creation Date"
  0x0014: "Amp:Location",
  0x0015: "Amp:Manufacturer",
  0x0016: "Amp:Comment",
  0x0018: "Amp:Model",
  0x0019: "Amp:Channel",
  0x001a: "Amp:Pickup Type",
  0x001b: "Amp:Year of Production",

  0x0020: "Cabinet:Name",
  0x0021: "Cabinet:Author",
  0x0022: "Cabinet:Creation Date",
  0x0023: "Cabinet:Creation Time", // Now longer used; now same as "Cabinet:Creation Date"
  0x0024: "Cabinet:Location",
  0x0025: "Cabinet:Manufacturer",
  0x0027: "Cabinet:Comment",
  0x002a: "Cabinet:Model",

  0x0029: "Speaker:Configuration",
  0x002c: "Speaker:Manufacturer",
  0x002d: "Speaker:Model",

  0x0026: "Mic:Model",
  0x0028: "Mic:Position",
}

const N5_P5 = R.compose(toFixed(1), v => (v - 8192) / 1638, v14) // -5..+5
const Z_P10 = R.compose(toFixed(1), v => v / 16383 * 10, v14) // 0..10
const LOOKUP = kv => R.compose(v => kv[v], v14)
const EFFECT_TYPE = R.compose(v => EFFECTS[v], v14)

const PAGE_04 = [
  "Rig Settings",
  {
    0x03: ["Panorama", N5_P5],
    0x04: ["Transpose", R.compose(v => (v - 64), v14)], // -36:+36
    0x4a: ["DLY+REV", R.compose(toFixed(0), v => (v - 8192) / 8192 * 100, v14), "%"],
    0x01: ["Volume", R.compose(toFixed(1), volume, v14), "dB"],
    0x49: ["Spillover", R.compose(bool, v14)],
    0x44: ["Pedal Location", LOOKUP({0: "Off", 1: "Input", 2: "Pre Stack", 3: "Post Stack", 4: "Output"})],
    0x45: ["Pedal Range", N5_P5],
    0x47: ["Parallel Path", R.compose(bool, v14)],
    0x48: ["Parallel Mix", N5_P5],
    0x00: ["Tempo", R.compose(toFixed(1), divide(64), v14), "bmp"],
    0x02: ["Tempo Enabled", R.compose(bool, v14)],
    0x40: ["Stomps Enabled", R.compose(bool, v14)],
    0x41: ["Stack Enabled", R.compose(bool, v14)],
    0x42: ["Effects Enabled", R.compose(bool, v14)],
  }
]

const PAGE_05 = {}

const PAGE_09 = [
  "Input Section",
  {
    0x03: ["Noise Gate", Z_P10],
    0x04: ["Clean Sense", N12_P12, "dB"],
    0x05: ["Distortion Sense", N12_P12, "dB"],
  }
]

const PAGE_0A = [
  "Amplifier",
  {
    0x00: ["Model", v14],
    0x02: ["Enabled", R.compose(bool, v14)],
    0x03: ["Volume", N12_P12, "dB"],
    0x04: ["Generic Gain", Z_P10],
    0x05: ["Clean Compensation", Z_P10],
    0x06: ["Definition", Z_P10],
    0x07: ["Clarity", Z_P10],
    0x08: ["Power Sagging", Z_P10],
    0x09: ["Pick", N5_P5],
    0x0a: ["Compressor", Z_P10],
    0x0b: ["Tube Shape", Z_P10],
    0x0c: ["Tube Bias", Z_P10],
    0x0f: ["Direct Mix", Z_P10],
    // 0x13: Gain Pot Reference
  }
]

const PAGE_0B = [
  "Amplifier EQ",
  {
    0x04: ["Base", N5_P5],
    0x05: ["Middle", N5_P5],
    0x06: ["Treble", N5_P5],
    0x07: ["Presence", N5_P5],
    0x08: ["Position", LOOKUP({0: "Post", 1: "Pre"})],
  }
]

const PAGE_SLOT = {
  0x00: ["Type", EFFECT_TYPE],
}

const decodePage = descriptor => buffer => {
  const [name, parameters] = descriptor
  const values = Object.entries(parameters).reduce((acc, [offset, parameter]) => {
    offset = parseInt(offset)
    const [key, decode, unit] = parameter
    acc[key] = decode(buffer, offset) + (unit || "")
    return acc
  }, {})

  return { [name]: values }
}

const decodeSlot = buffer => {
  return {}
}

export const SLOTS = {
  STOMP_A: 0x32,
  STOMP_B: 0x33,
  STOMP_C: 0x34,
  STOMP_D: 0x35,
  EFFECT_X: 0x38,
  EFFECT_MOD: 0x3a,
  EFFECT_REV: 0x3c,
  EFFECT_DLY: 0x3d,
}

export const MPC_DECODERS = {
    0x04: decodePage(PAGE_04),
    // 0x05: decodePage(PAGE_05),
    0x09: decodePage(PAGE_09),
    0x0a: decodePage(PAGE_0A),
    0x0b: decodePage(PAGE_0B),
    [SLOTS.STOMP_A]: decodeSlot,
    [SLOTS.STOMP_B]: decodeSlot,
    [SLOTS.STOMP_C]: decodeSlot,
    [SLOTS.STOMP_D]: decodeSlot,
    [SLOTS.EFFECT_X]: decodeSlot,
    [SLOTS.EFFECT_MOD]: decodeSlot,
    [SLOTS.EFFECT_REV]: decodeSlot,
    [SLOTS.EFFECT_DLY]: decodeSlot,
}
