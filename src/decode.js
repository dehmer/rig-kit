import * as R from 'ramda'
import range from './range.js'
import hex from './hex.js'
import { SLOTS, SLOT_PAGES } from './slot.js'
import { effects } from './effect.js'
import { volume } from './lookup/volume.js'
import { eqLowCut } from './lookup/eq_low_cut.js'
import { eqHighCut } from './lookup/eq_high_cut.js'
import { delayLowCut } from './lookup/delay_low_cut.js'
import { delayHighCut } from './lookup/delay_high_cut.js'
import { freq } from './lookup/freq.js'
import { distance } from './lookup/distance.js'
import { noteValue } from './lookup/note_value.js'
import { mix } from './lookup/mix.js'
import { feedback } from './lookup/feedback.js'
import { flangerNotes } from './lookup/flanger_notes.js'
import { flangerTimes } from './lookup/flanger_times.js'
import { tremoloNotes } from './lookup/tremolo_notes.js'
import { tremoloTimes } from './lookup/tremolo_times.js'
import { intervals } from './lookup/intervals.js'
import { keys } from './lookup/keys.js'

const toFixed = n => v => Number(v.toFixed(n))
const bool = v => !!v
const divide = b => a => a / b
const lookup = kv => v => kv[v]
const identity = v => `${hex(4)(v)} (${toFixed(0)(v / 16383 * 100)}%)`
const linear = (min, max) => v => v / 16383 * (max - min) + min

const P2_P6 = R.compose(toFixed(1), linear(2, 6))
const N5_P5 = R.compose(toFixed(1), linear(-5, 5))
const N12_P12 = R.compose(toFixed(1), linear(-12, 12))
const N18_P18 = R.compose(toFixed(1), linear(-18, 18))
const N36_P36_0 = v => v - 64
const N36_P36_1 = R.compose(toFixed(1), linear(-36, 36))
const N50_P50 = R.compose(toFixed(1), linear(-50, 50))
const Z_P10 = R.compose(toFixed(1), linear(0, 10))
const Z_P100 = R.compose(toFixed(0), linear(0, 100))
const Z_P2000 = R.compose(toFixed(0), linear(0, 2000))
const N100_P100 =  R.compose(toFixed(0), linear(-100, 100))
const Q = v => v // 0.100..5.000
const RATE = R.compose(toFixed(1), v => v / 16256 * 10)

const PAGES = {
    0x04: "Rig Settings",
    0x09: "Input Section",
    0x0a: "Amplifier",
    0x0b: "Amplifier EQ",
}

const EFFECT_REGISTERS = [

    // ==> Wah

    // ==> TODO: Wah - Wah Wah (1)
    // ==> TODO: Wah - Wah Low Pass (2)
    // ==> TODO: Wah - Wah High Pass (3)
    // ==> TODO: Wah - Wah Vowel Filter (4)
    // ==> TODO: Wah - Wah Phaser (6)
    // ==> TODO: Wah - Wah Flanger (7)
    // ==> TODO: Wah - Wah Rate Reducer (8)
    // ==> TODO: Wah - Wah Ring Modulator (9)
    // ==> TODO: Wah - Wah Freq Shifter (10)
    // ==> TODO: Wah - Wah Formant Shifter (12)

    // <== Wah


    // ==> Distortion

    // Distortion - Kemper Drive (32)
    [32, 0x04, "Mix", Z_P100, "%"],
    [32, 0x06, "Volume", N5_P5],
    [32, 0x10, "Drive", Z_P10],
    [32, 0x11, "Tone", Z_P10],
    [32, 0x15, "Definition", Z_P10],
    [32, 0x17, "Slim Down", Z_P10],

    // Distortion - Green Scream (33)
    [33, 0x04, "Mix", Z_P100, "%"],
    [33, 0x06, "Volume", N5_P5],
    [33, 0x10, "Drive", Z_P10],
    [33, 0x11, "Tone", Z_P10],

    // Distortion - Plus DS (34)
    [34, 0x04, "Mix", Z_P100, "%"],
    [34, 0x06, "Volume", N5_P5],
    [34, 0x10, "Drive", Z_P10],

    // Distortion - One DS (35)
    [35, 0x04, "Mix", Z_P100, "%"],
    [35, 0x06, "Volume", N5_P5],
    [35, 0x10, "Drive", Z_P10],
    [35, 0x11, "Tone", Z_P10],

    // Distortion - Muffin (36)
    [36, 0x04, "Mix", Z_P100, "%"],
    [36, 0x06, "Volume", N5_P5],
    [36, 0x10, "Drive", Z_P10],
    [36, 0x11, "Tone", Z_P10],

    // Distortion - Mouse (37)
    [37, 0x04, "Mix", Z_P100, "%"],
    [37, 0x06, "Volume", N5_P5],
    [37, 0x10, "Drive", Z_P10],
    [37, 0x11, "Tone", Z_P10],

    // Distortion - Kemper Fuzz (38)
    [38, 0x04, "Mix", Z_P100, "%"],
    [38, 0x06, "Volume", N5_P5],
    [38, 0x10, "Drive", Z_P10],
    [38, 0x12, "Octa", Z_P10],
    [38, 0x13, "Impedance LP", Z_P10],
    [38, 0x14, "Transistor Shape", Z_P10],
    [38, 0x15, "Transistor Tone", Z_P10],
    [38, 0x17, "Definition", Z_P10],

    // Distortion - Metal DS (39)
    [39, 0x04, "Mix", Z_P100, "%"],
    [39, 0x06, "Volume", N5_P5],
    [39, 0x10, "Drive", Z_P10],
    [39, 0x2a, "Low", N18_P18, "dB"],
    [39, 0x2c, "High", N18_P18, "dB"],
    [39, 0x2e, "Middle", N18_P18, "dB"],
    [39, 0x2f, "Mid Freq", freq, "Hz"],

    // Distortion - Full OC (42)
    [42, 0x04, "Mix", Z_P100, "%"],
    [42, 0x06, "Volume", N5_P5],
    [42, 0x10, "Drive", Z_P10],
    [42, 0x11, "Tone", Z_P10],
    [42, 0x64, "LP/HP", lookup({0: "HP", 1: "LP"})],

    // <== Distortion


    // ==> Booster

    // Booster - Treble Booster (113)
    [113, 0x04, "Mix", Z_P100, "%"],
    [113, 0x06, "Volume", N5_P5],
    [113, 0x11, "Tone", Z_P10],
    [113, 0x35, "Ducking", N5_P5],

    // Booster - Lead Booster (114)
    [114, 0x04, "Mix", Z_P100, "%"],
    [114, 0x06, "Volume", N5_P5],
    [114, 0x11, "Tone", Z_P10],
    [114, 0x35, "Ducking", N5_P5],

    // Booster - Pure Booster (115)
    [115, 0x06, "Volume", N5_P5],

    // Booster - Wah Pedal Booster (116)
    [116, 0x06, "Volume", N5_P5],
    [116, 0x0a, "Pedal Range", N100_P100, "%"],

    // <== Booster


    // ==> Shaper

    // Shaper - Bit Shaper (17)
    [17, 0x10, "Drive", Z_P10],
    [17, 0x11, "Tone", Z_P10],
    [17, 0x06, "Volume", N5_P5],

    // Shaper - Octa Shaper (18)
    [18, 0x10, "Drive", Z_P10],
    [18, 0x12, "Soft", Z_P10],
    [18, 0x35, "Ducking", N5_P5],
    [18, 0x06, "Volume", N5_P5],

    // Shaper - Soft Shaper (19)
    [19, 0x10, "Drive", Z_P10],
    [19, 0x06, "Volume", N5_P5],

    // Shaper - Hard Shaper (20)
    [20, 0x10, "Drive", Z_P10],
    [20, 0x06, "Volume", N5_P5],

    // Shaper - Wave Shaper (21)
    [21, 0x10, "Drive", Z_P10],
    [21, 0x06, "Volume", N5_P5],

    // <== Shaper


    // ==> Equalizer

    // Equalizer - Graphic Equalizer (97)
    [97, 0x04, "Mix", Z_P100, "%"],
    [97, 0x06, "Volume", N5_P5],
    [97, 0x22, "63 Hz", N12_P12, "dB"],
    [97, 0x23, "125 Hz", N12_P12, "dB"],
    [97, 0x24, "250 Hz", N12_P12, "dB"],
    [97, 0x25, "500 Hz", N12_P12, "dB"],
    [97, 0x26, "1.0 kHz", N12_P12, "dB"],
    [97, 0x27, "2.0 kHz", N12_P12, "dB"],
    [97, 0x28, "4.0 kHz", N12_P12, "dB"],
    [97, 0x29, "8.0 kHz", N12_P12, "dB"],
    [97, 0x35, "Ducking", N5_P5],
    [97, 0x43, "Low Cut", eqLowCut],
    [97, 0x44, "High Cut", eqHighCut],

    // Equalizer - Studio Equalizer
    [98, 0x04, "Mix", Z_P100, "%"],
    [98, 0x06, "Volume", N5_P5],
    [98, 0x2a, "Low Gain", N18_P18, "dB"],
    [98, 0x2b, "Low Freq", freq, "Hz"],
    [98, 0x2c, "High Gain", N18_P18, "dB"],
    [98, 0x2d, "High Freq", freq, "Hz"],
    [98, 0x2e, "Mid 1 Gain", N18_P18, "dB"],
    [98, 0x2f, "Mid 1 Freq", freq, "Hz"],
    [98, 0x30, "Mid 1 Q", Q],
    [98, 0x31, "Mid 2 Gain", N18_P18, "dB"],
    [98, 0x32, "Mid 2 Freq", freq, "Hz"],
    [98, 0x33, "Mid 2 Q", Q],
    [98, 0x35, "Ducking", N5_P5],
    [98, 0x43, "Low Cut", eqLowCut],
    [98, 0x44, "High Cut", eqHighCut],
    [98, 0x50, "Steep Low", bool],
    [98, 0x65, "Steep High", bool],

    // Equalizer - Metal Equalizer (99)
    [99, 0x04, "Mix", Z_P100, "%"],
    [99, 0x06, "Volume", N5_P5],
    [99, 0x2a, "Low", N18_P18, "dB"],
    [99, 0x2c, "High", N18_P18, "dB"],
    [99, 0x2e, "Middle", N18_P18, "dB"],
    [99, 0x2f, "Middle Freq", freq, "Hz"],
    [99, 0x35, "Ducking", N5_P5],
    [99, 0x43, "Low Cut", eqLowCut],
    [99, 0x44, "High Cut", eqHighCut],

    // Equalizer - Acoustic Simulator (100)
    [100, 0x04, "Mix", Z_P100, "%"],
    [100, 0x06, "Volume", N5_P5],
    [100, 0x2a, "Body", N5_P5],
    [100, 0x2c, "Sparkle", N5_P5],
    [100, 0x2e, "Bronze", N5_P5],
    [100, 0x31, "Pickup", Z_P10],

    // Equalizer - Double Tracker (104)
    [104, 0x06, "Volume", N5_P5],
    [104, 0x15, "Looseness", Z_P10],
    [104, 0x67, "Detune", Z_P10, "cent"],

    // <== Equalizer


    // ==> Compressor

    // Compressor - Compressor (49)
    [49, 0x04, "Mix", Z_P100, "%"],
    [49, 0x06, "Volume", N5_P5],
    [49, 0x12, "Threshold", Z_P10],
    [49, 0x13, "Attack", Z_P10],
    [49, 0x21, "Squash", N5_P5],

    // Compressor - Auto Swell (50)
    [50, 0x12, "Compressor", Z_P10],
    [50, 0x14, "Swell", Z_P10],

    // Compressor - Compressor Sidechain (51)
    [51, 0x12, "Threshold", Z_P10],
    [51, 0x13, "Release", Z_P10],

    // <== Compressor


    // ==> Noise Gate

    // Noise Gate - Noise Gate 2:1 (57)
    [57, 0x12, "Threshold", Z_P10],

    // Noise Gate - Noise Gate 4:1 (58)
    [58, 0x12, "Threshold", Z_P10],

    // <== Noise Gate


    // ==> Chorus

    // Chorus - Vintage Chorus (65)
    [65, 0x04, "Mix", Z_P100, "%"],
    [65, 0x06, "Volume", N5_P5],
    [65, 0x14, "Rate", RATE],
    [65, 0x15, "Depth", Z_P10],
    [65, 0x17, "Crossover", freq, "Hz"],
    [65, 0x35, "Ducking", N5_P5],

    // Chorus - Hyper Chorus (66)
    [66, 0x04, "Mix", Z_P100, "%"],
    [66, 0x06, "Volume", N5_P5],
    [66, 0x15, "Depth", Z_P10],
    [66, 0x17, "Crossover", freq, "Hz"],
    [66, 0x18, "Amount", P2_P6],
    [66, 0x35, "Ducking", N5_P5],

    // Chorus - Air Chorus (67)
    [67, 0x06, "Volume", N5_P5],
    [67, 0x15, "Depth", Z_P10],
    [67, 0x17, "Crossover", freq, "Hz"],

    // Chorus - Micro Pitch (71)
    [71, 0x04, "Mix", Z_P100, "%"],
    [71, 0x06, "Volume", N5_P5],
    [71, 0x15, "Detune", identity, "cent"], // TODO: rendering string query yields wrong values
    [71, 0x17, "Crossover", freq, "Hz"],
    [71, 0x35, "Ducking", N5_P5],

    // Chorus - Vibrato (68)
    [68, 0x06, "Volume", N5_P5],
    [68, 0x14, "Rate", RATE],
    [68, 0x15, "Depth", Z_P10],
    [68, 0x17, "Crossover", freq, "Hz"],
    [68, 0x35, "Ducking", N5_P5],

    // Chorus - Rotary Speaker (69)
    [69, 0x04, "Mix", Z_P100, "%"],
    [69, 0x06, "Volume", N5_P5],
    [69, 0x1e, "Rotation Speed", lookup({0: "Slow", 16383: "Fast"})],
    [69, 0x1f, "Distance", distance, "cm"],
    [69, 0x20, "Low-High Balance", N100_P100, "%"],
    [69, 0x35, "Ducking", N5_P5],

    // <== Chorus


    // ==> Tremolo

    // Tremolo - Tube Bias Tremolo (70)
    // TODO: Rate depends on Tempo Sync
    // [70, 0x14, "Rate", tremoloNotes], // Tempo Sync = On
    [70, 0x14, "Rate", tremoloTimes], // Tempo Sync = Off
    [70, 0x15, "Depth", Z_P10],
    [70, 0x35, "Ducking", N5_P5],
    [70, 0x06, "Volume", N5_P5],
    [70, 0x50, "Tempo Sync", bool],

    // Tremolo - Photocell Tremolo (75)
    [75, 0x06, "Volume", N5_P5],
    // TODO: Rate depends on Tempo Sync
    [75, 0x14, "Rate", tremoloNotes], // Tempo Sync = On
    // [75, 0x14, "Rate", tremoloTimes], // Tempo Sync = Off
    [75, 0x15, "Intensity", Z_P10],
    [75, 0x35, "Ducking", N5_P5],
    [75, 0x50, "Tempo Sync", bool],

    // Tremolo - Harmonic Tremolo (76)
    [76, 0x06, "Volume", N5_P5],
    // TODO: Rate depends on Tempo Sync
    [76, 0x14, "Rate", tremoloNotes], // Tempo Sync = On
    // [76, 0x14, "Rate", tremoloTimes], // Tempo Sync = Off
    [76, 0x15, "Intensity", Z_P10],
    [76, 0x35, "Ducking", N5_P5],
    [76, 0x50, "Tempo Sync", bool],

    // Tremolo - Pulse Sliver (77)
    [77, 0x04, "Intensity", Z_P100, "%"],
    [77, 0x06, "Volume", N5_P5],
    // TODO: Rate depends on Tempo Sync
    [77, 0x14, "Rate", tremoloNotes], // Tempo Sync = On
    [77, 0x14, "Rate", tremoloTimes], // Tempo Sync = Off
    [77, 0x18, "Edge", Z_P10],
    [77, 0x19, "Skew", Z_P10],
    [77, 0x35, "Ducking", N5_P5],
    [77, 0x50, "Tempo Sync", bool],

    // Tremolo - Saw Slicer (78)
    [78, 0x04, "Intensity", Z_P100, "%"],
    [78, 0x06, "Volume", N5_P5],
    [78, 0x14, "Rate", identity],
    [78, 0x18, "Edge", Z_P10],
    [78, 0x19, "Skew", Z_P10],
    [78, 0x35, "Ducking", N5_P5],
    [78, 0x50, "Tempo Sync", bool],

    // TODO: Tremolo - Pulse Autopanner (79)
    // TODO: Tremolo - Saw Autopanner (80)

    // <== Tremolo


    // ==> Phaser

    // Phaser - Phaser (81)
    [81, 0x04, "Mix", Z_P100, "%"],
    [81, 0x06, "Volume", N5_P5],
    // TODO: Rate depends on Tempo Sync
    // [81, 0x14, "Rate", flangerNotes], // Tempo Sync = On
    [81, 0x14, "Rate", flangerTimes], // Tempo Sync = Off
    [81, 0x15, "Depth", Z_P10],
    [81, 0x19, "Manual", Z_P10],
    [81, 0x16, "Feedback", Z_P100, "%"],
    [81, 0x1a, "Peak Spread", N5_P5],
    [81, 0x1b, "Stages", v => 2 + v * 2],
    [81, 0x35, "Ducking", N5_P5],
    [81, 0x50, "Tempo Sync", bool],

    // Phaser - Phaser Vibe (82)
    [82, 0x04, "Mix", Z_P100, "%"],
    [82, 0x06, "Volume", N5_P5],
    // [82, 0x14, "Rate", flangerNotes], // Tempo Sync = On
    [82, 0x14, "Rate", flangerTimes], // Tempo Sync = Off
    [82, 0x15, "Depth", Z_P10],
    [82, 0x19, "Manual", Z_P10],
    [82, 0x16, "Feedback", Z_P100, "%"],
    [82, 0x1a, "Peak Spread", N5_P5],
    [82, 0x1b, "Stages", v => 2 + v * 2],
    [82, 0x35, "Ducking", N5_P5],
    [82, 0x50, "Tempo Sync", bool],

    // Phaser - Phaser Oneway (83)
    [83, 0x04, "Mix", Z_P100, "%"],
    [83, 0x06, "Volume", N5_P5],
    [83, 0x15, "Depth", Z_P10],
    [83, 0x19, "Manual", N5_P5],
    [83, 0x16, "Feedback", Z_P100, "%"],
    [83, 0x1a, "Peak Spread", N5_P5],
    [83, 0x1b, "Stages", v => 2 + v * 2],
    [83, 0x35, "Ducking", N5_P5],
    [83, 0x49, "Rate", N5_P5],

    // <== Phaser


    // ==> Flanger

    // TODO: Flanger - Flanger (89)
    // TODO: Flanger - Flanger Oneway (91)

    // <== Flanger


    // ==> Pitch Shifter

    // Pitch Shifter - Transpose (129)
    [129, 0x38, "Pitch", N36_P36_0],
    [129, 0x3c, "Chords", lookup({0: "Normal", 1: "Smooth"})],

    // Pitch Shifter - Pedal Pitch (11)
    [11, 0x04, "Mix", Z_P100, "%"],
    [11, 0x06, "Volume", N5_P5],
    [11, 0x35, "Ducking", N5_P5],
    [11, 0x38, "Toe Pitch", N36_P36_0],
    [11, 0x39, "Heel Pitch", N36_P36_0],
    [11, 0x3c, "Chords", lookup({0: "Normal", 1: "Smooth"})],
    [11, 0x3d, "Pure Tuning", bool],
    [11, 0x41, "Formants", bool],

    // Pitch Shifter - Pedal Vinyl Stop (13)
    [13, 0x06, "Volume", N5_P5],
    [13, 0x04, "Mix", Z_P100, "%"],
    [13, 0x41, "Formants", lookup({0: "Natural", 1: "Freeze"})],

    // Pitch Shifter - Chromatic Pitch (130)
    [130, 0x04, "Mix", Z_P100, "%"],
    [130, 0x06, "Volume", N5_P5],
    [130, 0x35, "Ducking", N5_P5],
    [130, 0x37, "Balance", N50_P50],
    [130, 0x38, "Voice 1 Pitch", N36_P36_0],
    [130, 0x39, "Voice 2 Pitch", N36_P36_0],
    [130, 0x3a, "Detune", N50_P50],
    [130, 0x3c, "Chords", lookup({0: "Normal", 1: "Smooth"})],
    [130, 0x3d, "Pure Tuning", bool],
    [130, 0x41, "Formant Shift Enabled", bool],
    [130, 0x42, "Formant Shift", N5_P5],

    // Pitch Shifter - Harmonic Pitch (131)
    [131, 0x06, "Volume", N5_P5],
    [131, 0x35, "Ducking", N5_P5],
    [131, 0x36, "Mix", N50_P50, "%"],
    [131, 0x37, "Balance", N50_P50, "%"],
    [131, 0x3d, "Pure Tuning", bool],
    [131, 0x3e, "Interval 1", intervals],
    [131, 0x3f, "Interval 2", intervals],
    [131, 0x40, "Key", keys],
    [131, 0x41, "Formant Shift Enabled", bool],
    [131, 0x42, "Formant Shift", N5_P5],

    // Pitch Shifter - Analog Octaver (132)
    [132, 0x06, "Volume", N5_P5],
    [132, 0x35, "Ducking", N5_P5],
    [132, 0x36, "Mix", N50_P50, "%"],
    [132, 0x17, "Low Cut", Z_P10],
    [132, 0x37, "Voice Balance", N50_P50],

    // <== Pitch Shifter


    // ==> Delay

    // Delay - Single Delay (146)
    [146, 0x35, "Ducking", N5_P5],
    [146, 0x45, "Mix", mix],
    [146, 0x46, "Position (Mix)", lookup({0: "Pre", 1: "Post"})],
    [146, 0x47, "Delay Time", Z_P2000, "ms"], // Tempo Sync = off
    [146, 0x4c, "Note Value", noteValue], // Tempo Sync = on
    [146, 0x50, "Tempo Sync", bool],
    [146, 0x5d, "Feedback", Z_P100, "%"], // Infinity = off
    [146, 0x5e, "Feedback", feedback, "%"], // Infinity = on
    [146, 0x5f, "Infinity", bool],
    [146, 0x62, "Low Cut", delayLowCut, "Hz"],
    [146, 0x63, "High Cut", delayHighCut, "Hz"],
    [146, 0x64, "Cut", lookup({0: "Normal", 1: "More"})],
    [146, 0x65, "Modulation", Z_P10],
    [146, 0x66, "Chorus", Z_P10],
    [146, 0x67, "Flutter Intensity", Z_P10],
    [146, 0x68, "Flutter Rate", Z_P10],
    [146, 0x69, "Grit", Z_P10],
    [146, 0x6a, "Reverse Mix", Z_P100, "%"],
    [146, 0x6d, "Position (Ducking)", lookup({0: "Pre", 1: "Post"})],

    // Delay - Dual Delay (147)
    [147, 0x0f, "Cross Feedback", Z_P10],
    [147, 0x35, "Ducking", N5_P5],
    [147, 0x37, "Delay Balance", N50_P50],
    [147, 0x45, "Mix", mix],
    [147, 0x46, "Position (Mix)", lookup({0: "Pre", 1: "Post"})],
    [147, 0x47, "Delay 1 Time", Z_P2000, "ms"], // Tempo Sync = off
    [147, 0x48, "Delay 2 Time", Z_P2000, "ms"], // Tempo Sync = off
    [147, 0x4c, "Note Value 1", noteValue], // Tempo Sync = on
    [147, 0x4d, "Note Value 2", noteValue], // Tempo Sync = on
    [147, 0x50, "Tempo Sync", bool],
    [147, 0x5d, "Feedback 1", Z_P100, "%"], // Infinity = off
    [147, 0x5e, "Feedback 1", feedback, "%"], // Infinity = on
    [147, 0x5f, "Infinity", bool],
    [147, 0x60, "Feedback 2", Z_P100, "%"], // Sync = off
    [147, 0x61, "Sync", lookup({0: "Off", 1: "On"})], // Infinity = on
    [147, 0x62, "Low Cut", delayLowCut, "Hz"],
    [147, 0x63, "High Cut", delayHighCut, "Hz"],
    [147, 0x64, "Cut", lookup({0: "Normal", 1: "More"})],
    [147, 0x65, "Modulation", Z_P10],
    [147, 0x66, "Chorus", Z_P10],
    [147, 0x67, "Flutter Intensity", Z_P10],
    [147, 0x68, "Flutter Rate", Z_P10],
    [147, 0x69, "Grit", Z_P10],
    [147, 0x6a, "Reverse Mix", Z_P100, "%"],
    [147, 0x6b, "Input Swell", Z_P100, "%"],
    [147, 0x6c, "Smear", Z_P100, "%"],
    [147, 0x6d, "Position (Ducking)", lookup({0: "Pre", 1: "Post"})],

    // Delay - Two-Tap Delay (148)
    [148, 0x35, "Ducking", N5_P5],
    [148, 0x45, "Mix", mix],
    [148, 0x46, "Position (Mix)", lookup({0: "Pre", 1: "Post"})],
    [148, 0x47, "Delay 1 Time", Z_P2000, "ms"], // Tempo Sync = off
    [148, 0x49, "Delay 2 Ratio", Z_P100, "%"], // Tempo Sync = off
    [148, 0x4c, "Note Value 1", noteValue], // Tempo Sync = on
    [148, 0x4d, "Note Value 2", noteValue], // Tempo Sync = on
    [148, 0x50, "Tempo Sync", bool],
    [148, 0x5d, "Feedback", Z_P100, "%"], // Infinity = off
    [148, 0x5e, "Feedback", feedback, "%"], // Infinity = on
    [148, 0x5f, "Infinity", bool],
    [148, 0x62, "Low Cut", delayLowCut, "Hz"],
    [148, 0x63, "High Cut", delayHighCut, "Hz"],
    [148, 0x64, "Cut", lookup({0: "Normal", 1: "More"})],
    [148, 0x66, "Chorus", Z_P10],
    [148, 0x65, "Modulation", Z_P10],
    [148, 0x67, "Flutter Intensity", Z_P10],
    [148, 0x68, "Flutter Rate", Z_P10],
    [148, 0x69, "Grit", Z_P10],
    [148, 0x6a, "Reverse Mix", Z_P100, "%"],
    [148, 0x6b, "Input Swell", Z_P100, "%"],
    [148, 0x6c, "Smear", Z_P100, "%"],
    [148, 0x6d, "Position (Ducking)", lookup({0: "Pre", 1: "Post"})],

    // Delay - Serial Two-Tap Delay (149)
    [149, 0x35, "Ducking", N5_P5],
    [149, 0x36, "Mix Serial", Z_P100, "%"],
    [149, 0x45, "Mix", mix],
    [149, 0x46, "Position (Mix)", lookup({0: "Pre", 1: "Post"})],
    [149, 0x47, "Delay 1 Time", Z_P2000, "ms"], // Tempo Sync = off
    [149, 0x49, "Delay 2 Ratio", Z_P100, "%"], // Tempo Sync = off
    [149, 0x4a, "Delay Ratio Serial", Z_P100, "%"],
    [149, 0x4c, "Note Value 1", noteValue], // Tempo Sync = on
    [149, 0x4d, "Note Value 2", noteValue], // Tempo Sync = on
    [149, 0x4e, "Note Value Serial", noteValue], // Tempo Sync = on
    [149, 0x50, "Tempo Sync", bool],
    [149, 0x5d, "Feedback", Z_P100, "%"], // Infinity = off
    [149, 0x5e, "Feedback", feedback, "%"], // Infinity = on
    [149, 0x5f, "Infinity", bool],
    [149, 0x60, "Feedback Serial", Z_P100, "%"], // Sync = off
    [149, 0x61, "Sync", lookup({0: "Off", 1: "On"})],
    [149, 0x62, "Low Cut", delayLowCut, "Hz"],
    [149, 0x63, "High Cut", delayHighCut, "Hz"],
    [149, 0x64, "Cut", lookup({0: "Normal", 1: "More"})],
    [149, 0x66, "Chorus", Z_P10],
    [149, 0x65, "Modulation", Z_P10],
    [149, 0x67, "Flutter Intensity", Z_P10],
    [149, 0x68, "Flutter Rate", Z_P10],
    [149, 0x69, "Grit", Z_P10],
    [149, 0x6a, "Reverse Mix", Z_P100, "%"],
    [149, 0x6b, "Input Swell", Z_P100, "%"],
    [149, 0x6c, "Smear", Z_P100, "%"],
    [149, 0x6d, "Position (Ducking)", lookup({0: "Pre", 1: "Post"})],

    // Delay - Rhythm Delay (161)
    [161, 0x35, "Ducking", N5_P5],
    [161, 0x45, "Mix", mix],
    [161, 0x46, "Position (Mix)", lookup({0: "Pre", 1: "Post"})],
    [161, 0x4c, "Note Value 4", noteValue], // Tempo Sync = on
    [161, 0x4d, "Note Value 3", noteValue], // Tempo Sync = on
    [161, 0x4e, "Note Value 2", noteValue], // Tempo Sync = on
    [161, 0x4f, "Note Value 1", noteValue], // Tempo Sync = on
    [161, 0x50, "Tempo Sync", bool],
    [161, 0x47, "Time", Z_P2000, "ms"], // Tempo Sync = off
    [161, 0x49, "Ratio 3", Z_P100, "%"], // Tempo Sync = off
    [161, 0x4a, "Ratio 2", Z_P100, "%"], // Tempo Sync = off
    [161, 0x4b, "Ratio 1", Z_P100, "%"], // Tempo Sync = off
    [161, 0x51, "Volume 4", Z_P10],
    [161, 0x52, "Volume 3", Z_P10],
    [161, 0x53, "Volume 2", Z_P10],
    [161, 0x54, "Volume 1", Z_P10],
    [161, 0x55, "Panorama 4", N100_P100, "%"],
    [161, 0x56, "Panorama 3", N100_P100, "%"],
    [161, 0x57, "Panorama 2", N100_P100, "%"],
    [161, 0x58, "Panorama 1", N100_P100, "%"],
    [161, 0x5d, "Feedback", Z_P100, "%"],
    [161, 0x62, "Low Cut", delayLowCut, "Hz"],
    [161, 0x63, "High Cut", delayHighCut, "Hz"],
    [161, 0x65, "Modulation", Z_P10],
    [161, 0x67, "Flutter Intensity", Z_P10],
    [161, 0x68, "Flutter Rate", Z_P10],
    [161, 0x6d, "Position (Ducking)", lookup({0: "Pre", 1: "Post"})],

    // Delay - Quad Delay (164)
    [164, 0x0f, "Cross Feedback", Z_P10],
    [164, 0x35, "Ducking", N5_P5],
    [164, 0x45, "Mix", mix],
    [164, 0x46, "Position (Mix)", lookup({0: "Pre", 1: "Post"})],
    [164, 0x4c, "Note Value 4", noteValue], // Tempo Sync = on
    [164, 0x4d, "Note Value 3", noteValue], // Tempo Sync = on
    [164, 0x4e, "Note Value 2", noteValue], // Tempo Sync = on
    [164, 0x4f, "Note Value 1", noteValue], // Tempo Sync = on
    [164, 0x50, "Tempo Sync", bool],
    [164, 0x5d, "Feedback", Z_P100, "%"],
    [164, 0x47, "Time", Z_P2000, "ms"], // Tempo Sync = off
    [164, 0x49, "Ratio 3", Z_P100, "%"], // Tempo Sync = off
    [164, 0x4a, "Ratio 2", Z_P100, "%"], // Tempo Sync = off
    [164, 0x4b, "Ratio 1", Z_P100, "%"], // Tempo Sync = off
    [164, 0x51, "Volume 4", Z_P10],
    [164, 0x52, "Volume 3", Z_P10],
    [164, 0x53, "Volume 2", Z_P10],
    [164, 0x54, "Volume 1", Z_P10],
    [164, 0x55, "Panorama 4", N100_P100, "%"],
    [164, 0x56, "Panorama 3", N100_P100, "%"],
    [164, 0x57, "Panorama 2", N100_P100, "%"],
    [164, 0x58, "Panorama 1", N100_P100, "%"],
    [164, 0x62, "Low Cut", delayLowCut, "Hz"],
    [164, 0x63, "High Cut", delayHighCut, "Hz"],
    [164, 0x65, "Modulation", Z_P10],
    [164, 0x67, "Flutter Intensity", Z_P10],
    [164, 0x68, "Flutter Rate", Z_P10],
    [164, 0x6d, "Position (Ducking)", lookup({0: "Pre", 1: "Post"})],

    // Delay - Legacy Delay (145)
    [145, 0x13, "Bandwidth", Z_P10],
    [145, 0x21, "Frequency", N5_P5],
    [145, 0x35, "Ducking", N5_P5],
    [145, 0x45, "Mix", mix],
    [145, 0x47, "Time 1", Z_P2000, "ms"],
    [145, 0x49, "Ratio 2", Z_P100, "%"],
    [145, 0x4c, "Note Value 1", noteValue],
    [145, 0x4d, "Note Value 2", noteValue],
    [145, 0x50, "Tempo Sync", bool],
    [145, 0x5d, "Feedback", Z_P100, "%"],
    [145, 0x65, "Modulation", Z_P10],

    // <== Delay


    // ==> Pitch Delay

    // Pitch Delay - Crystal Delay (150)
    [150, 0x35, "Ducking", N5_P5],
    [150, 0x36, "Crystal Mix", Z_P100, "%"],
    [150, 0x3a, "Pitch Detune", N50_P50, "cents"],
    [150, 0x3d, "Pure Tuning", bool],
    [150, 0x45, "Mix", mix],
    [150, 0x46, "Position (Mix)", lookup({0: "Pre", 1: "Post"})],
    [150, 0x4c, "Note Value 1", noteValue], // Tempo Sync = on
    [150, 0x4d, "Note Value 2", noteValue], // Tempo Sync = on
    [150, 0x50, "Tempo Sync", bool],
    [150, 0x59, "Chrystal Pitch", N36_P36_0],
    [150, 0x5d, "Feedback", Z_P100, "%"], // Infinity = off
    [150, 0x5e, "Feedback", feedback, "%"], // Infinity = on
    [150, 0x5f, "Infinity", bool],
    [150, 0x47, "Time 1", Z_P2000, "ms"], // Tempo Sync = off
    [150, 0x49, "Ratio 2", Z_P100, "%"], // Tempo Sync = off
    [150, 0x62, "Low Cut", delayLowCut, "Hz"],
    [150, 0x63, "High Cut", delayHighCut, "Hz"],
    [150, 0x64, "Cut", lookup({0: "Normal", 1: "More"})],
    [150, 0x65, "Modulation", Z_P10],
    [150, 0x66, "Chorus", Z_P10],
    [150, 0x6a, "Reverse Mix", Z_P100, "%"],
    [150, 0x67, "Flutter Intensity", Z_P10],
    [150, 0x68, "Flutter Rate", Z_P10],
    [150, 0x69, "Grit", Z_P10],
    [150, 0x6b, "Input Swell", Z_P100, "%"],
    [150, 0x6c, "Smear", Z_P100, "%"],
    [150, 0x6d, "Position (Ducking)", lookup({0: "Pre", 1: "Post"})],

    // Pitch Delay - Loop Pitch Delay (151)
    [151, 0x35, "Ducking", N5_P5],
    [151, 0x36, "Pitch Mix", Z_P100, "%"],
    [151, 0x3a, "Pitch Detune", N50_P50, "cents"],
    [151, 0x3d, "Pure Tuning", bool],
    [151, 0x45, "Mix", mix],
    [151, 0x46, "Position (Mix)", lookup({0: "Pre", 1: "Post"})],
    [151, 0x4c, "Note Value 1", noteValue], // Tempo Sync = on
    [151, 0x4d, "Note Value 2", noteValue], // Tempo Sync = on
    [151, 0x50, "Tempo Sync", bool],
    [151, 0x59, "Chrystal Pitch", N36_P36_0],
    [151, 0x5d, "Feedback", Z_P100, "%"], // Infinity = off
    [151, 0x5e, "Feedback", feedback, "%"], // Infinity = on
    [151, 0x5f, "Infinity", bool],
    [151, 0x47, "Delay 1 Time", Z_P2000, "ms"], // Tempo Sync = off
    [151, 0x48, "Delay 2 Time", Z_P2000, "ms"], // Tempo Sync = off
    [151, 0x62, "Low Cut", delayLowCut, "Hz"],
    [151, 0x63, "High Cut", delayHighCut, "Hz"],
    [151, 0x64, "Cut", lookup({0: "Normal", 1: "More"})],
    [151, 0x65, "Modulation", Z_P10],
    [151, 0x66, "Chorus", Z_P10],
    [151, 0x6a, "Reverse Mix", Z_P100, "%"],
    [151, 0x67, "Flutter Intensity", Z_P10],
    [151, 0x68, "Flutter Rate", Z_P10],
    [151, 0x69, "Grit", Z_P10],
    [151, 0x6b, "Input Swell", Z_P100, "%"],
    [151, 0x6c, "Smear", Z_P100, "%"],
    [151, 0x6d, "Position (Ducking)", lookup({0: "Pre", 1: "Post"})],

    // Pitch Delay - Freq Shifter Delay (152)
    [152, 0x04, "Frequency Mix", Z_P100, "%"],
    [152, 0x08, "Pitch", N5_P5, "%"],
    [152, 0x35, "Ducking", N5_P5],
    [152, 0x45, "Mix", mix],
    [152, 0x46, "Position (Mix)", lookup({0: "Pre", 1: "Post"})],
    [152, 0x4c, "Note Value 1", noteValue], // Tempo Sync = on
    [152, 0x4d, "Note Value 2", noteValue], // Tempo Sync = on
    [152, 0x50, "Tempo Sync", bool],
    [152, 0x5d, "Feedback", Z_P100, "%"], // Infinity = off
    [152, 0x5e, "Feedback", feedback, "%"], // Infinity = on
    [152, 0x5f, "Infinity", bool],
    [152, 0x47, "Delay 1 Time", Z_P2000, "ms"], // Tempo Sync = off
    [152, 0x49, "Delay 2 Ratio", Z_P100, "%"], // Tempo Sync = off
    [152, 0x62, "Low Cut", delayLowCut, "Hz"],
    [152, 0x63, "High Cut", delayHighCut, "Hz"],
    [152, 0x64, "Cut", lookup({0: "Normal", 1: "More"})],
    [152, 0x65, "Modulation", Z_P10],
    [152, 0x66, "Chorus", Z_P10],
    [152, 0x6a, "Reverse Mix", Z_P100, "%"],
    [152, 0x67, "Flutter Intensity", Z_P10],
    [152, 0x68, "Flutter Rate", Z_P10],
    [152, 0x69, "Grit", Z_P10],
    [152, 0x6b, "Input Swell", Z_P100, "%"],
    [152, 0x6c, "Smear", Z_P100, "%"],
    [152, 0x6d, "Position (Ducking)", lookup({0: "Pre", 1: "Post"})],

    // TODO: Pitch Delay - Dual Chromatic (137)
    // TODO: Pitch Delay - Dual Harmonic (138)
    // TODO: Pitch Delay - Dual Crystal (139)
    // TODO: Pitch Delay - Dual Loop Pitch (140)
    // TODO: Pitch Delay - Melody Chromatic (162)
    // TODO: Pitch Delay - Melody Harmonic (163)
    // TODO: Pitch Delay - Quad Chromatic (165)
    // TODO: Pitch Delay - Quad Harmonic (166)

    // <== Pitch Delay


    // ==> Reverb

    // TODO: Reverb - Spring Reverb (193)
    // TODO: Reverb - Natural Reverb (178)
    // TODO: Reverb - Easy Reverb (179)
    // TODO: Reverb - Echo Reverb (180)
    // TODO: Reverb - Cirrus Reverb (181)
    // TODO: Reverb - Formant Reverb (182)
    // TODO: Reverb - Ionosphere Reverb (183)
    // TODO: Reverb - Space (64)
    // TODO: Reverb - Legacy Reverb (177)

    // <== Reverb

]

const effectRegisters = EFFECT_REGISTERS.reduce((acc, entry) => {
    const [effect, ...rest] = entry
    acc[effect] = [...(acc[effect] || []), rest]
    return acc
}, {})

const REGISTERS = [

    // Rig Settings (page $04):
    [0x04, 0x03, "Panorama", N5_P5],
    [0x04, 0x04, "Transpose", N36_P36_1],
    [0x04, 0x4a, "DLY+REV", R.compose(toFixed(0), v => (v - 8192) / 8192 * 100), "%"],
    [0x04, 0x01, "Volume", R.compose(toFixed(1), volume), "dB"],
    [0x04, 0x49, "Spillover", bool],
    [0x04, 0x44, "Pedal Location", lookup({0: "Off", 1: "Input", 2: "Pre Stack", 3: "Post Stack", 4: "Output"})],
    [0x04, 0x45, "Pedal Range", N5_P5],
    [0x04, 0x47, "Parallel Path", bool],
    [0x04, 0x48, "Parallel Mix", N5_P5],
    [0x04, 0x00, "Tempo", R.compose(toFixed(1), divide(64)), "bmp"],
    [0x04, 0x02, "Tempo Enabled", bool],
    [0x04, 0x40, "Stomps Enabled", bool],
    [0x04, 0x41, "Stack Enabled", bool],
    [0x04, 0x42, "Effects Enabled", bool],

    // Input Section (page $09):
    [0x09, 0x03, "Noise Gate", Z_P10],
    [0x09, 0x04, "Clean Sense", N12_P12, "dB"],
    [0x09, 0x05, "Distortion Sense", N12_P12, "dB"],

    // Amplifier (page: $0a)
    [0x0a, 0x00, "Model", R.identity],
    [0x0a, 0x02, "Enabled", bool],
    [0x0a, 0x03, "Volume", N12_P12, "dB"],
    [0x0a, 0x04, "Generic Gain", Z_P10],
    [0x0a, 0x05, "Clean Compensation", Z_P10],
    [0x0a, 0x06, "Definition", Z_P10],
    [0x0a, 0x07, "Clarity", Z_P10],
    [0x0a, 0x08, "Power Sagging", Z_P10],
    [0x0a, 0x09, "Pick", N5_P5],
    [0x0a, 0x0a, "Compressor", Z_P10],
    [0x0a, 0x0b, "Tube Shape", Z_P10],
    [0x0a, 0x0c, "Tube Bias", Z_P10],
    [0x0a, 0x0f, "Direct Mix", Z_P10],

    // Amplifier EQ (page: $0b)
    [0x0b, 0x04, "Base", N5_P5],
    [0x0b, 0x05, "Middle", N5_P5],
    [0x0b, 0x06, "Treble", N5_P5],
    [0x0b, 0x07, "Presence", N5_P5],
    [0x0b, 0x08, "Position", lookup({0: "Post", 1: "Pre"})],
]

const pageRegisters = REGISTERS.reduce((acc, entry) => {
    const [page, register, ...rest] = entry
    acc[page] = acc[page] || {}
    acc[page][register] = rest
    return acc
}, {})

const decodeSlotSPC = (message, slots) => {
    const slot = slots[message.page]

    // Special handling of register 0: Effect type/name.
    if (message.register === 0) {
        return {
            ...message,
            effect: `${slot.effect} (${slot.slot})`
         }
    }

    // Special handling of register 3: On/Off
    if (message.register === 3) {
        return { [slot.slot]: { [slot.name]: message.value } }
    }

    const effectType = slots[message.page].key

    // Empty slot.
    if (effectType === 0) return {}

    // Get known register descriptors for specific effect type:
    const descriptors = effectRegisters[effectType]

    if (!descriptors) {
        return {
            ...message,
            warning: `no descriptors for effect: ${effectType}`
        }
    }

    // Convert descriptor list to lookup table:
    const registers = descriptors.reduce((acc, entry) => {
        const [register, ...rest] = entry
        acc[register] = rest
        return acc
    }, {})

    if (!registers[message.register]) {
        return {
            ...message,
            warning: `undefined register: ${hex(2)(message.register)}`
        }
    }

    // Get matching register and decode:
    const effect = effects[effectType]
    const register = registers[message.register]
    const [label, decode, unit] = register
    const key = `${effect}:${label}`

    return {
        ...message,
        slot: slot.slot,
        [key]: decode(message.value) + (unit ? ` ${unit}` : "")
    }
}

const decodePageSPC = message => {
    return message
}

const DECODERS = {

    /**
     * Decode single parameter message:
     * Either an effect parameter or a parameter from "general" page.
     */
    "SPC": (message, context) => SLOT_PAGES.includes(message.page)
            ? decodeSlotSPC(message, context)
            : decodePageSPC(message)
    ,

    "MPC": message => {

        if (SLOT_PAGES.includes(message.page)) {
            const effectType = message.values[0]
            const effect = effects[effectType]
            const descriptors = effectRegisters[effectType]

            if (!descriptors) return message

            console.log("stomp/effect page", message.page, effectType, effect, descriptors)
            return descriptors.reduce((acc, descriptor) => {
                const [register, label, decode, unit] = descriptor
                const key = `${effect}:${label}`
                const value = decode(message.values[register]) + (unit || "")
                console.log(descriptor, message.values[register], value)
                acc[key] = value
                return acc
            }, {})
        }


        const page = pageRegisters[message.page]
        if (!page) return message

        return range(message.values.length)
            .reduce((acc, offset) => {
                const register = offset + message.register
                const descriptor = page[register]

                if (!descriptor) {
                    console.warn(`undefined register ${register} for page ${message.page}`)
                    return acc
                }

                const [label, decode, unit] = descriptor
                const key = `${PAGES[message.page]}:${label}`
                acc[key] = decode(message.values[offset]) + (unit || "")
                return acc
            }, {})
    }
}

export const decode = (message, context) => {
    const decoder = DECODERS[message["function"]] || (() => message)
    return decoder(message, context)
}