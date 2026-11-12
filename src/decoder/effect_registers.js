import * as D from './decoders.js'
import * as L from '../lookup/index.js'

const TREMOLO_RATE = (value, values) => {
    // rate (0x14) depends on tempo sync (0x50):
    const tempoSync = D.BOOL(values[0x50])
    const decode = tempoSync ? L.tremoloNotes : L.tremoloTimes
    return decode(value)
}

const FLANGER_RATE = (value, values) => {
    // rate (0x14) depends on tempo sync (0x50):
    const tempoSync = D.BOOL(values[0x50])
    const decode = tempoSync ? L.flangerNotes : L.flangerTimes
    return decode(value)
}

export const REGISTER_LIST = [

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
    [32, 0x04, "Mix", D.Z_P100, "%"],
    [32, 0x06, "Volume", D.N5_P5],
    [32, 0x10, "Drive", D.Z_P10],
    [32, 0x11, "Tone", D.Z_P10],
    [32, 0x15, "Definition", D.Z_P10],
    [32, 0x17, "Slim Down", D.Z_P10],

    // Distortion - Green Scream (33)
    [33, 0x04, "Mix", D.Z_P100, "%"],
    [33, 0x06, "Volume", D.N5_P5],
    [33, 0x10, "Drive", D.Z_P10],
    [33, 0x11, "Tone", D.Z_P10],

    // Distortion - Plus DS (34)
    [34, 0x04, "Mix", D.Z_P100, "%"],
    [34, 0x06, "Volume", D.N5_P5],
    [34, 0x10, "Drive", D.Z_P10],

    // Distortion - One DS (35)
    [35, 0x04, "Mix", D.Z_P100, "%"],
    [35, 0x06, "Volume", D.N5_P5],
    [35, 0x10, "Drive", D.Z_P10],
    [35, 0x11, "Tone", D.Z_P10],

    // Distortion - Muffin (36)
    [36, 0x04, "Mix", D.Z_P100, "%"],
    [36, 0x06, "Volume", D.N5_P5],
    [36, 0x10, "Drive", D.Z_P10],
    [36, 0x11, "Tone", D.Z_P10],

    // Distortion - Mouse (37)
    [37, 0x04, "Mix", D.Z_P100, "%"],
    [37, 0x06, "Volume", D.N5_P5],
    [37, 0x10, "Drive", D.Z_P10],
    [37, 0x11, "Tone", D.Z_P10],

    // Distortion - Kemper Fuzz (38)
    [38, 0x04, "Mix", D.Z_P100, "%"],
    [38, 0x06, "Volume", D.N5_P5],
    [38, 0x10, "Drive", D.Z_P10],
    [38, 0x12, "Octa", D.Z_P10],
    [38, 0x13, "Impedance LP", D.Z_P10],
    [38, 0x14, "Transistor Shape", D.Z_P10],
    [38, 0x15, "Transistor Tone", D.Z_P10],
    [38, 0x17, "Definition", D.Z_P10],

    // Distortion - Metal DS (39)
    [39, 0x04, "Mix", D.Z_P100, "%"],
    [39, 0x06, "Volume", D.N5_P5],
    [39, 0x10, "Drive", D.Z_P10],
    [39, 0x2a, "Low", D.N18_P18, "dB"],
    [39, 0x2c, "High", D.N18_P18, "dB"],
    [39, 0x2e, "Middle", D.N18_P18, "dB"],
    [39, 0x2f, "Mid Freq", L.freq, "Hz"],

    // Distortion - Full OC (42)
    [42, 0x04, "Mix", D.Z_P100, "%"],
    [42, 0x06, "Volume", D.N5_P5],
    [42, 0x10, "Drive", D.Z_P10],
    [42, 0x11, "Tone", D.Z_P10],
    [42, 0x64, "LP/HP", D.LOOKUP({0: "HP", 1: "LP"})],

    // <== Distortion


    // ==> Booster

    // Booster - Treble Booster (113)
    [113, 0x04, "Mix", D.Z_P100, "%"],
    [113, 0x06, "Volume", D.N5_P5],
    [113, 0x11, "Tone", D.Z_P10],
    [113, 0x35, "Ducking", D.N5_P5],

    // Booster - Lead Booster (114)
    [114, 0x04, "Mix", D.Z_P100, "%"],
    [114, 0x06, "Volume", D.N5_P5],
    [114, 0x11, "Tone", D.Z_P10],
    [114, 0x35, "Ducking", D.N5_P5],

    // Booster - Pure Booster (115)
    [115, 0x06, "Volume", D.N5_P5],

    // Booster - Wah Pedal Booster (116)
    [116, 0x06, "Volume", D.N5_P5],
    [116, 0x0a, "Pedal Range", D.N100_P100, "%"],

    // <== Booster


    // ==> Shaper

    // Shaper - Bit Shaper (17)
    [17, 0x10, "Drive", D.Z_P10],
    [17, 0x11, "Tone", D.Z_P10],
    [17, 0x06, "Volume", D.N5_P5],

    // Shaper - Octa Shaper (18)
    [18, 0x10, "Drive", D.Z_P10],
    [18, 0x12, "Soft", D.Z_P10],
    [18, 0x35, "Ducking", D.N5_P5],
    [18, 0x06, "Volume", D.N5_P5],

    // Shaper - Soft Shaper (19)
    [19, 0x10, "Drive", D.Z_P10],
    [19, 0x06, "Volume", D.N5_P5],

    // Shaper - Hard Shaper (20)
    [20, 0x10, "Drive", D.Z_P10],
    [20, 0x06, "Volume", D.N5_P5],

    // Shaper - Wave Shaper (21)
    [21, 0x10, "Drive", D.Z_P10],
    [21, 0x06, "Volume", D.N5_P5],

    // <== Shaper


    // ==> Equalizer

    // Equalizer - Graphic Equalizer (97)
    [97, 0x04, "Mix", D.Z_P100, "%"],
    [97, 0x06, "Volume", D.N5_P5],
    [97, 0x22, "63 Hz", D.N12_P12, "dB"],
    [97, 0x23, "125 Hz", D.N12_P12, "dB"],
    [97, 0x24, "250 Hz", D.N12_P12, "dB"],
    [97, 0x25, "500 Hz", D.N12_P12, "dB"],
    [97, 0x26, "1.0 kHz", D.N12_P12, "dB"],
    [97, 0x27, "2.0 kHz", D.N12_P12, "dB"],
    [97, 0x28, "4.0 kHz", D.N12_P12, "dB"],
    [97, 0x29, "8.0 kHz", D.N12_P12, "dB"],
    [97, 0x35, "Ducking", D.N5_P5],
    [97, 0x43, "Low Cut", L.eqLowCut],
    [97, 0x44, "High Cut", L.eqHighCut],

    // Equalizer - Studio Equalizer
    [98, 0x04, "Mix", D.Z_P100, "%"],
    [98, 0x06, "Volume", D.N5_P5],
    [98, 0x2a, "Low Gain", D.N18_P18, "dB"],
    [98, 0x2b, "Low Freq", L.freq, "Hz"],
    [98, 0x2c, "High Gain", D.N18_P18, "dB"],
    [98, 0x2d, "High Freq", L.freq, "Hz"],
    [98, 0x2e, "Mid 1 Gain", D.N18_P18, "dB"],
    [98, 0x2f, "Mid 1 Freq", L.freq, "Hz"],
    [98, 0x30, "Mid 1 Q", D.Q],
    [98, 0x31, "Mid 2 Gain", D.N18_P18, "dB"],
    [98, 0x32, "Mid 2 Freq", L.freq, "Hz"],
    [98, 0x33, "Mid 2 Q", D.Q],
    [98, 0x35, "Ducking", D.N5_P5],
    [98, 0x43, "Low Cut", L.eqLowCut],
    [98, 0x44, "High Cut", L.eqHighCut],
    [98, 0x50, "Steep Low", D.BOOL],
    [98, 0x65, "Steep High", D.BOOL],

    // Equalizer - Metal Equalizer (99)
    [99, 0x04, "Mix", D.Z_P100, "%"],
    [99, 0x06, "Volume", D.N5_P5],
    [99, 0x2a, "Low", D.N18_P18, "dB"],
    [99, 0x2c, "High", D.N18_P18, "dB"],
    [99, 0x2e, "Middle", D.N18_P18, "dB"],
    [99, 0x2f, "Middle Freq", L.freq, "Hz"],
    [99, 0x35, "Ducking", D.N5_P5],
    [99, 0x43, "Low Cut", L.eqLowCut],
    [99, 0x44, "High Cut", L.eqHighCut],

    // Equalizer - Acoustic Simulator (100)
    [100, 0x04, "Mix", D.Z_P100, "%"],
    [100, 0x06, "Volume", D.N5_P5],
    [100, 0x2a, "Body", D.N5_P5],
    [100, 0x2c, "Sparkle", D.N5_P5],
    [100, 0x2e, "Bronze", D.N5_P5],
    [100, 0x31, "Pickup", D.Z_P10],

    // Equalizer - Double Tracker (104)
    [104, 0x06, "Volume", D.N5_P5],
    [104, 0x15, "Looseness", D.Z_P10],
    [104, 0x67, "Detune", D.Z_P10, "cent"],

    // <== Equalizer


    // ==> Compressor

    // Compressor - Compressor (49)
    [49, 0x04, "Mix", D.Z_P100, "%"],
    [49, 0x06, "Volume", D.N5_P5],
    [49, 0x12, "Threshold", D.Z_P10],
    [49, 0x13, "Attack", D.Z_P10],
    [49, 0x21, "Squash", D.N5_P5],

    // Compressor - Auto Swell (50)
    [50, 0x12, "Compressor", D.Z_P10],
    [50, 0x14, "Swell", D.Z_P10],

    // Compressor - Compressor Sidechain (51)
    [51, 0x12, "Threshold", D.Z_P10],
    [51, 0x13, "Release", D.Z_P10],

    // <== Compressor


    // ==> Noise Gate

    // Noise Gate - Noise Gate 2:1 (57)
    [57, 0x12, "Threshold", D.Z_P10],

    // Noise Gate - Noise Gate 4:1 (58)
    [58, 0x12, "Threshold", D.Z_P10],

    // <== Noise Gate


    // ==> Chorus

    // Chorus - Vintage Chorus (65)
    [65, 0x04, "Mix", D.Z_P100, "%"],
    [65, 0x06, "Volume", D.N5_P5],
    [65, 0x14, "Rate", D.RATE],
    [65, 0x15, "Depth", D.Z_P10],
    [65, 0x17, "Crossover", L.freq, "Hz"],
    [65, 0x35, "Ducking", D.N5_P5],

    // Chorus - Hyper Chorus (66)
    [66, 0x04, "Mix", D.Z_P100, "%"],
    [66, 0x06, "Volume", D.N5_P5],
    [66, 0x15, "Depth", D.Z_P10],
    [66, 0x17, "Crossover", L.freq, "Hz"],
    [66, 0x18, "Amount", D.P2_P6],
    [66, 0x35, "Ducking", D.N5_P5],

    // Chorus - Air Chorus (67)
    [67, 0x06, "Volume", D.N5_P5],
    [67, 0x15, "Depth", D.Z_P10],
    [67, 0x17, "Crossover", L.freq, "Hz"],

    // Chorus - Micro Pitch (71)
    [71, 0x04, "Mix", D.Z_P100, "%"],
    [71, 0x06, "Volume", D.N5_P5],
    [71, 0x15, "Detune", D.IDENTITY, "cent"], // TODO: rendering string query yields wrong values
    [71, 0x17, "Crossover", L.freq, "Hz"],
    [71, 0x35, "Ducking", D.N5_P5],

    // Chorus - Vibrato (68)
    [68, 0x06, "Volume", D.N5_P5],
    [68, 0x14, "Rate", D.RATE],
    [68, 0x15, "Depth", D.Z_P10],
    [68, 0x17, "Crossover", L.freq, "Hz"],
    [68, 0x35, "Ducking", D.N5_P5],

    // Chorus - Rotary Speaker (69)
    [69, 0x04, "Mix", D.Z_P100, "%"],
    [69, 0x06, "Volume", D.N5_P5],
    [69, 0x1e, "Rotation Speed", D.LOOKUP({0: "Slow", 16383: "Fast"})],
    [69, 0x1f, "Distance", L.distance, "cm"],
    [69, 0x20, "Low-High Balance", D.N100_P100, "%"],
    [69, 0x35, "Ducking", D.N5_P5],

    // <== Chorus


    // ==> Tremolo

    // Tremolo - Tube Bias Tremolo (70)
    [70, 0x14, "Rate", TREMOLO_RATE],
    [70, 0x15, "Depth", D.Z_P10],
    [70, 0x35, "Ducking", D.N5_P5],
    [70, 0x06, "Volume", D.N5_P5],
    [70, 0x50, "Tempo Sync", D.BOOL],

    // Tremolo - Photocell Tremolo (75)
    [75, 0x06, "Volume", D.N5_P5],
    [75, 0x14, "Rate", TREMOLO_RATE],
    [75, 0x15, "Intensity", D.Z_P10],
    [75, 0x35, "Ducking", D.N5_P5],
    [75, 0x50, "Tempo Sync", D.BOOL],

    // Tremolo - Harmonic Tremolo (76)
    [76, 0x06, "Volume", D.N5_P5],
    [76, 0x14, "Rate", TREMOLO_RATE],
    [76, 0x15, "Intensity", D.Z_P10],
    [76, 0x35, "Ducking", D.N5_P5],
    [76, 0x50, "Tempo Sync", D.BOOL],

    // Tremolo - Pulse Sliver (77)
    [77, 0x04, "Intensity", D.Z_P100, "%"],
    [77, 0x06, "Volume", D.N5_P5],
    [77, 0x14, "Rate", TREMOLO_RATE],
    [77, 0x18, "Edge", D.Z_P10],
    [77, 0x19, "Skew", D.Z_P10],
    [77, 0x35, "Ducking", D.N5_P5],
    [77, 0x50, "Tempo Sync", D.BOOL],

    // Tremolo - Saw Slicer (78)
    [78, 0x04, "Intensity", D.Z_P100, "%"],
    [78, 0x06, "Volume", D.N5_P5],
    [78, 0x14, "Rate", D.IDENTITY],
    [78, 0x18, "Edge", D.Z_P10],
    [78, 0x19, "Skew", D.Z_P10],
    [78, 0x35, "Ducking", D.N5_P5],
    [78, 0x50, "Tempo Sync", D.BOOL],

    // TODO: Tremolo - Pulse Autopanner (79)
    // TODO: Tremolo - Saw Autopanner (80)

    // <== Tremolo


    // ==> Phaser

    // Phaser - Phaser (81)
    [81, 0x04, "Mix", D.Z_P100, "%"],
    [81, 0x06, "Volume", D.N5_P5],
    [81, 0x14, "Rate", FLANGER_RATE],
    [81, 0x15, "Depth", D.Z_P10],
    [81, 0x19, "Manual", D.Z_P10],
    [81, 0x16, "Feedback", D.Z_P100, "%"],
    [81, 0x1a, "Peak Spread", D.N5_P5],
    [81, 0x1b, "Stages", v => 2 + v * 2],
    [81, 0x35, "Ducking", D.N5_P5],
    [81, 0x50, "Tempo Sync", D.BOOL],

    // Phaser - Phaser Vibe (82)
    [82, 0x04, "Mix", D.Z_P100, "%"],
    [82, 0x06, "Volume", D.N5_P5],
    [82, 0x14, "Rate", FLANGER_RATE],
    [82, 0x15, "Depth", D.Z_P10],
    [82, 0x19, "Manual", D.Z_P10],
    [82, 0x16, "Feedback", D.Z_P100, "%"],
    [82, 0x1a, "Peak Spread", D.N5_P5],
    [82, 0x1b, "Stages", v => 2 + v * 2],
    [82, 0x35, "Ducking", D.N5_P5],
    [82, 0x50, "Tempo Sync", D.BOOL],

    // Phaser - Phaser Oneway (83)
    [83, 0x04, "Mix", D.Z_P100, "%"],
    [83, 0x06, "Volume", D.N5_P5],
    [83, 0x15, "Depth", D.Z_P10],
    [83, 0x19, "Manual", D.N5_P5],
    [83, 0x16, "Feedback", D.Z_P100, "%"],
    [83, 0x1a, "Peak Spread", D.N5_P5],
    [83, 0x1b, "Stages", v => 2 + v * 2],
    [83, 0x35, "Ducking", D.N5_P5],
    [83, 0x49, "Rate", D.N5_P5],

    // <== Phaser


    // ==> Flanger

    // TODO: Flanger - Flanger (89)
    // TODO: Flanger - Flanger Oneway (91)

    // <== Flanger


    // ==> Pitch Shifter

    // Pitch Shifter - Transpose (129)
    [129, 0x38, "Pitch", D.N36_P36],
    [129, 0x3c, "Chords", D.LOOKUP({0: "Normal", 1: "Smooth"})],

    // Pitch Shifter - Pedal Pitch (11)
    [11, 0x04, "Mix", D.Z_P100, "%"],
    [11, 0x06, "Volume", D.N5_P5],
    [11, 0x35, "Ducking", D.N5_P5],
    [11, 0x38, "Toe Pitch", D.N36_P36],
    [11, 0x39, "Heel Pitch", D.N36_P36],
    [11, 0x3c, "Chords", D.LOOKUP({0: "Normal", 1: "Smooth"})],
    [11, 0x3d, "Pure Tuning", D.BOOL],
    [11, 0x41, "Formants", D.BOOL],

    // Pitch Shifter - Pedal Vinyl Stop (13)
    [13, 0x06, "Volume", D.N5_P5],
    [13, 0x04, "Mix", D.Z_P100, "%"],
    [13, 0x41, "Formants", D.LOOKUP({0: "Natural", 1: "Freeze"})],

    // Pitch Shifter - Chromatic Pitch (130)
    [130, 0x04, "Mix", D.Z_P100, "%"],
    [130, 0x06, "Volume", D.N5_P5],
    [130, 0x35, "Ducking", D.N5_P5],
    [130, 0x37, "Balance", D.N50_P50],
    [130, 0x38, "Voice 1 Pitch", D.N36_P36],
    [130, 0x39, "Voice 2 Pitch", D.N36_P36],
    [130, 0x3a, "Detune", D.N50_P50],
    [130, 0x3c, "Chords", D.LOOKUP({0: "Normal", 1: "Smooth"})],
    [130, 0x3d, "Pure Tuning", D.BOOL],
    [130, 0x41, "Formant Shift Enabled", D.BOOL],
    [130, 0x42, "Formant Shift", D.N5_P5],

    // Pitch Shifter - Harmonic Pitch (131)
    [131, 0x06, "Volume", D.N5_P5],
    [131, 0x35, "Ducking", D.N5_P5],
    [131, 0x36, "Mix", D.N50_P50, "%"],
    [131, 0x37, "Balance", D.N50_P50, "%"],
    [131, 0x3d, "Pure Tuning", D.BOOL],
    [131, 0x3e, "Interval 1", L.intervals],
    [131, 0x3f, "Interval 2", L.intervals],
    [131, 0x40, "Key", L.keys],
    [131, 0x41, "Formant Shift Enabled", D.BOOL],
    [131, 0x42, "Formant Shift", D.N5_P5],

    // Pitch Shifter - Analog Octaver (132)
    [132, 0x06, "Volume", D.N5_P5],
    [132, 0x35, "Ducking", D.N5_P5],
    [132, 0x36, "Mix", D.N50_P50, "%"],
    [132, 0x17, "Low Cut", D.Z_P10],
    [132, 0x37, "Voice Balance", D.N50_P50],

    // <== Pitch Shifter


    // ==> Delay

    // Delay - Single Delay (146)
    [146, 0x35, "Ducking", D.N5_P5],
    [146, 0x45, "Mix", L.mix],
    [146, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    [146, 0x47, "Delay Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [146, 0x4c, "Note Value", L.noteValue], // Tempo Sync = on
    [146, 0x50, "Tempo Sync", D.BOOL],
    [146, 0x5d, "Feedback", D.Z_P100, "%"], // Infinity = off
    [146, 0x5e, "Feedback", L.feedback, "%"], // Infinity = on
    [146, 0x5f, "Infinity", D.BOOL],
    [146, 0x62, "Low Cut", L.delayLowCut, "Hz"],
    [146, 0x63, "High Cut", L.delayHighCut, "Hz"],
    [146, 0x64, "Cut", D.LOOKUP({0: "Normal", 1: "More"})],
    [146, 0x65, "Modulation", D.Z_P10],
    [146, 0x66, "Chorus", D.Z_P10],
    [146, 0x67, "Flutter Intensity", D.Z_P10],
    [146, 0x68, "Flutter Rate", D.Z_P10],
    [146, 0x69, "Grit", D.Z_P10],
    [146, 0x6a, "Reverse Mix", D.Z_P100, "%"],
    [146, 0x6d, "Position (Ducking)", D.LOOKUP({0: "Pre", 1: "Post"})],

    // Delay - Dual Delay (147)
    [147, 0x0f, "Cross Feedback", D.Z_P10],
    [147, 0x35, "Ducking", D.N5_P5],
    [147, 0x37, "Delay Balance", D.N50_P50],
    [147, 0x45, "Mix", L.mix],
    [147, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    [147, 0x47, "Delay 1 Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [147, 0x48, "Delay 2 Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [147, 0x4c, "Note Value 1", L.noteValue], // Tempo Sync = on
    [147, 0x4d, "Note Value 2", L.noteValue], // Tempo Sync = on
    [147, 0x50, "Tempo Sync", D.BOOL],
    [147, 0x5d, "Feedback 1", D.Z_P100, "%"], // Infinity = off
    [147, 0x5e, "Feedback 1", L.feedback, "%"], // Infinity = on
    [147, 0x5f, "Infinity", D.BOOL],
    [147, 0x60, "Feedback 2", D.Z_P100, "%"], // Sync = off
    [147, 0x61, "Sync", D.LOOKUP({0: "Off", 1: "On"})], // Infinity = on
    [147, 0x62, "Low Cut", L.delayLowCut, "Hz"],
    [147, 0x63, "High Cut", L.delayHighCut, "Hz"],
    [147, 0x64, "Cut", D.LOOKUP({0: "Normal", 1: "More"})],
    [147, 0x65, "Modulation", D.Z_P10],
    [147, 0x66, "Chorus", D.Z_P10],
    [147, 0x67, "Flutter Intensity", D.Z_P10],
    [147, 0x68, "Flutter Rate", D.Z_P10],
    [147, 0x69, "Grit", D.Z_P10],
    [147, 0x6a, "Reverse Mix", D.Z_P100, "%"],
    [147, 0x6b, "Input Swell", D.Z_P100, "%"],
    [147, 0x6c, "Smear", D.Z_P100, "%"],
    [147, 0x6d, "Position (Ducking)", D.LOOKUP({0: "Pre", 1: "Post"})],

    // Delay - Two-Tap Delay (148)
    [148, 0x35, "Ducking", D.N5_P5],
    [148, 0x45, "Mix", L.mix],
    [148, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    [148, 0x47, "Delay 1 Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [148, 0x49, "Delay 2 Ratio", D.Z_P100, "%"], // Tempo Sync = off
    [148, 0x4c, "Note Value 1", L.noteValue], // Tempo Sync = on
    [148, 0x4d, "Note Value 2", L.noteValue], // Tempo Sync = on
    [148, 0x50, "Tempo Sync", D.BOOL],
    [148, 0x5d, "Feedback", D.Z_P100, "%"], // Infinity = off
    [148, 0x5e, "Feedback", L.feedback, "%"], // Infinity = on
    [148, 0x5f, "Infinity", D.BOOL],
    [148, 0x62, "Low Cut", L.delayLowCut, "Hz"],
    [148, 0x63, "High Cut", L.delayHighCut, "Hz"],
    [148, 0x64, "Cut", D.LOOKUP({0: "Normal", 1: "More"})],
    [148, 0x66, "Chorus", D.Z_P10],
    [148, 0x65, "Modulation", D.Z_P10],
    [148, 0x67, "Flutter Intensity", D.Z_P10],
    [148, 0x68, "Flutter Rate", D.Z_P10],
    [148, 0x69, "Grit", D.Z_P10],
    [148, 0x6a, "Reverse Mix", D.Z_P100, "%"],
    [148, 0x6b, "Input Swell", D.Z_P100, "%"],
    [148, 0x6c, "Smear", D.Z_P100, "%"],
    [148, 0x6d, "Position (Ducking)", D.LOOKUP({0: "Pre", 1: "Post"})],

    // Delay - Serial Two-Tap Delay (149)
    [149, 0x35, "Ducking", D.N5_P5],
    [149, 0x36, "Mix Serial", D.Z_P100, "%"],
    [149, 0x45, "Mix", L.mix],
    [149, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    [149, 0x47, "Delay 1 Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [149, 0x49, "Delay 2 Ratio", D.Z_P100, "%"], // Tempo Sync = off
    [149, 0x4a, "Delay Ratio Serial", D.Z_P100, "%"],
    [149, 0x4c, "Note Value 1", L.noteValue], // Tempo Sync = on
    [149, 0x4d, "Note Value 2", L.noteValue], // Tempo Sync = on
    [149, 0x4e, "Note Value Serial", L.noteValue], // Tempo Sync = on
    [149, 0x50, "Tempo Sync", D.BOOL],
    [149, 0x5d, "Feedback", D.Z_P100, "%"], // Infinity = off
    [149, 0x5e, "Feedback", L.feedback, "%"], // Infinity = on
    [149, 0x5f, "Infinity", D.BOOL],
    [149, 0x60, "Feedback Serial", D.Z_P100, "%"], // Sync = off
    [149, 0x61, "Sync", D.LOOKUP({0: "Off", 1: "On"})],
    [149, 0x62, "Low Cut", L.delayLowCut, "Hz"],
    [149, 0x63, "High Cut", L.delayHighCut, "Hz"],
    [149, 0x64, "Cut", D.LOOKUP({0: "Normal", 1: "More"})],
    [149, 0x66, "Chorus", D.Z_P10],
    [149, 0x65, "Modulation", D.Z_P10],
    [149, 0x67, "Flutter Intensity", D.Z_P10],
    [149, 0x68, "Flutter Rate", D.Z_P10],
    [149, 0x69, "Grit", D.Z_P10],
    [149, 0x6a, "Reverse Mix", D.Z_P100, "%"],
    [149, 0x6b, "Input Swell", D.Z_P100, "%"],
    [149, 0x6c, "Smear", D.Z_P100, "%"],
    [149, 0x6d, "Position (Ducking)", D.LOOKUP({0: "Pre", 1: "Post"})],

    // Delay - Rhythm Delay (161)
    [161, 0x35, "Ducking", D.N5_P5],
    [161, 0x45, "Mix", L.mix],
    [161, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    [161, 0x4c, "Note Value 4", L.noteValue], // Tempo Sync = on
    [161, 0x4d, "Note Value 3", L.noteValue], // Tempo Sync = on
    [161, 0x4e, "Note Value 2", L.noteValue], // Tempo Sync = on
    [161, 0x4f, "Note Value 1", L.noteValue], // Tempo Sync = on
    [161, 0x50, "Tempo Sync", D.BOOL],
    [161, 0x47, "Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [161, 0x49, "Ratio 3", D.Z_P100, "%"], // Tempo Sync = off
    [161, 0x4a, "Ratio 2", D.Z_P100, "%"], // Tempo Sync = off
    [161, 0x4b, "Ratio 1", D.Z_P100, "%"], // Tempo Sync = off
    [161, 0x51, "Volume 4", D.Z_P10],
    [161, 0x52, "Volume 3", D.Z_P10],
    [161, 0x53, "Volume 2", D.Z_P10],
    [161, 0x54, "Volume 1", D.Z_P10],
    [161, 0x55, "Panorama 4", D.N100_P100, "%"],
    [161, 0x56, "Panorama 3", D.N100_P100, "%"],
    [161, 0x57, "Panorama 2", D.N100_P100, "%"],
    [161, 0x58, "Panorama 1", D.N100_P100, "%"],
    [161, 0x5d, "Feedback", D.Z_P100, "%"],
    [161, 0x62, "Low Cut", L.delayLowCut, "Hz"],
    [161, 0x63, "High Cut", L.delayHighCut, "Hz"],
    [161, 0x65, "Modulation", D.Z_P10],
    [161, 0x67, "Flutter Intensity", D.Z_P10],
    [161, 0x68, "Flutter Rate", D.Z_P10],
    [161, 0x6d, "Position (Ducking)", D.LOOKUP({0: "Pre", 1: "Post"})],

    // Delay - Quad Delay (164)
    [164, 0x0f, "Cross Feedback", D.Z_P10],
    [164, 0x35, "Ducking", D.N5_P5],
    [164, 0x45, "Mix", L.mix],
    [164, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    [164, 0x4c, "Note Value 4", L.noteValue], // Tempo Sync = on
    [164, 0x4d, "Note Value 3", L.noteValue], // Tempo Sync = on
    [164, 0x4e, "Note Value 2", L.noteValue], // Tempo Sync = on
    [164, 0x4f, "Note Value 1", L.noteValue], // Tempo Sync = on
    [164, 0x50, "Tempo Sync", D.BOOL],
    [164, 0x5d, "Feedback", D.Z_P100, "%"],
    [164, 0x47, "Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [164, 0x49, "Ratio 3", D.Z_P100, "%"], // Tempo Sync = off
    [164, 0x4a, "Ratio 2", D.Z_P100, "%"], // Tempo Sync = off
    [164, 0x4b, "Ratio 1", D.Z_P100, "%"], // Tempo Sync = off
    [164, 0x51, "Volume 4", D.Z_P10],
    [164, 0x52, "Volume 3", D.Z_P10],
    [164, 0x53, "Volume 2", D.Z_P10],
    [164, 0x54, "Volume 1", D.Z_P10],
    [164, 0x55, "Panorama 4", D.N100_P100, "%"],
    [164, 0x56, "Panorama 3", D.N100_P100, "%"],
    [164, 0x57, "Panorama 2", D.N100_P100, "%"],
    [164, 0x58, "Panorama 1", D.N100_P100, "%"],
    [164, 0x62, "Low Cut", L.delayLowCut, "Hz"],
    [164, 0x63, "High Cut", L.delayHighCut, "Hz"],
    [164, 0x65, "Modulation", D.Z_P10],
    [164, 0x67, "Flutter Intensity", D.Z_P10],
    [164, 0x68, "Flutter Rate", D.Z_P10],
    [164, 0x6d, "Position (Ducking)", D.LOOKUP({0: "Pre", 1: "Post"})],

    // Delay - Legacy Delay (145)
    [145, 0x13, "Bandwidth", D.Z_P10],
    [145, 0x21, "Frequency", D.N5_P5],
    [145, 0x35, "Ducking", D.N5_P5],
    [145, 0x45, "Mix", L.mix],
    [145, 0x47, "Time 1", D.Z_P2000, "ms"],
    [145, 0x49, "Ratio 2", D.Z_P100, "%"],
    [145, 0x4c, "Note Value 1", L.noteValue],
    [145, 0x4d, "Note Value 2", L.noteValue],
    [145, 0x50, "Tempo Sync", D.BOOL],
    [145, 0x5d, "Feedback", D.Z_P100, "%"],
    [145, 0x65, "Modulation", D.Z_P10],

    // <== Delay


    // ==> Pitch Delay

    // Pitch Delay - Crystal Delay (150)
    [150, 0x35, "Ducking", D.N5_P5],
    [150, 0x36, "Crystal Mix", D.Z_P100, "%"],
    [150, 0x3a, "Pitch Detune", D.N50_P50, "cents"],
    [150, 0x3d, "Pure Tuning", D.BOOL],
    [150, 0x45, "Mix", L.mix],
    [150, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    [150, 0x4c, "Note Value 1", L.noteValue], // Tempo Sync = on
    [150, 0x4d, "Note Value 2", L.noteValue], // Tempo Sync = on
    [150, 0x50, "Tempo Sync", D.BOOL],
    [150, 0x59, "Chrystal Pitch", D.N36_P36],
    [150, 0x5d, "Feedback", D.Z_P100, "%"], // Infinity = off
    [150, 0x5e, "Feedback", L.feedback, "%"], // Infinity = on
    [150, 0x5f, "Infinity", D.BOOL],
    [150, 0x47, "Time 1", D.Z_P2000, "ms"], // Tempo Sync = off
    [150, 0x49, "Ratio 2", D.Z_P100, "%"], // Tempo Sync = off
    [150, 0x62, "Low Cut", L.delayLowCut, "Hz"],
    [150, 0x63, "High Cut", L.delayHighCut, "Hz"],
    [150, 0x64, "Cut", D.LOOKUP({0: "Normal", 1: "More"})],
    [150, 0x65, "Modulation", D.Z_P10],
    [150, 0x66, "Chorus", D.Z_P10],
    [150, 0x6a, "Reverse Mix", D.Z_P100, "%"],
    [150, 0x67, "Flutter Intensity", D.Z_P10],
    [150, 0x68, "Flutter Rate", D.Z_P10],
    [150, 0x69, "Grit", D.Z_P10],
    [150, 0x6b, "Input Swell", D.Z_P100, "%"],
    [150, 0x6c, "Smear", D.Z_P100, "%"],
    [150, 0x6d, "Position (Ducking)", D.LOOKUP({0: "Pre", 1: "Post"})],

    // Pitch Delay - Loop Pitch Delay (151)
    [151, 0x35, "Ducking", D.N5_P5],
    [151, 0x36, "Pitch Mix", D.Z_P100, "%"],
    [151, 0x3a, "Pitch Detune", D.N50_P50, "cents"],
    [151, 0x3d, "Pure Tuning", D.BOOL],
    [151, 0x45, "Mix", L.mix],
    [151, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    [151, 0x4c, "Note Value 1", L.noteValue], // Tempo Sync = on
    [151, 0x4d, "Note Value 2", L.noteValue], // Tempo Sync = on
    [151, 0x50, "Tempo Sync", D.BOOL],
    [151, 0x59, "Chrystal Pitch", D.N36_P36],
    [151, 0x5d, "Feedback", D.Z_P100, "%"], // Infinity = off
    [151, 0x5e, "Feedback", L.feedback, "%"], // Infinity = on
    [151, 0x5f, "Infinity", D.BOOL],
    [151, 0x47, "Delay 1 Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [151, 0x48, "Delay 2 Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [151, 0x62, "Low Cut", L.delayLowCut, "Hz"],
    [151, 0x63, "High Cut", L.delayHighCut, "Hz"],
    [151, 0x64, "Cut", D.LOOKUP({0: "Normal", 1: "More"})],
    [151, 0x65, "Modulation", D.Z_P10],
    [151, 0x66, "Chorus", D.Z_P10],
    [151, 0x6a, "Reverse Mix", D.Z_P100, "%"],
    [151, 0x67, "Flutter Intensity", D.Z_P10],
    [151, 0x68, "Flutter Rate", D.Z_P10],
    [151, 0x69, "Grit", D.Z_P10],
    [151, 0x6b, "Input Swell", D.Z_P100, "%"],
    [151, 0x6c, "Smear", D.Z_P100, "%"],
    [151, 0x6d, "Position (Ducking)", D.LOOKUP({0: "Pre", 1: "Post"})],

    // Pitch Delay - Freq Shifter Delay (152)
    [152, 0x04, "Frequency Mix", D.Z_P100, "%"],
    [152, 0x08, "Pitch", D.N5_P5, "%"],
    [152, 0x35, "Ducking", D.N5_P5],
    [152, 0x45, "Mix", L.mix],
    [152, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    [152, 0x4c, "Note Value 1", L.noteValue], // Tempo Sync = on
    [152, 0x4d, "Note Value 2", L.noteValue], // Tempo Sync = on
    [152, 0x50, "Tempo Sync", D.BOOL],
    [152, 0x5d, "Feedback", D.Z_P100, "%"], // Infinity = off
    [152, 0x5e, "Feedback", L.feedback, "%"], // Infinity = on
    [152, 0x5f, "Infinity", D.BOOL],
    [152, 0x47, "Delay 1 Time", D.Z_P2000, "ms"], // Tempo Sync = off
    [152, 0x49, "Delay 2 Ratio", D.Z_P100, "%"], // Tempo Sync = off
    [152, 0x62, "Low Cut", L.delayLowCut, "Hz"],
    [152, 0x63, "High Cut", L.delayHighCut, "Hz"],
    [152, 0x64, "Cut", D.LOOKUP({0: "Normal", 1: "More"})],
    [152, 0x65, "Modulation", D.Z_P10],
    [152, 0x66, "Chorus", D.Z_P10],
    [152, 0x6a, "Reverse Mix", D.Z_P100, "%"],
    [152, 0x67, "Flutter Intensity", D.Z_P10],
    [152, 0x68, "Flutter Rate", D.Z_P10],
    [152, 0x69, "Grit", D.Z_P10],
    [152, 0x6b, "Input Swell", D.Z_P100, "%"],
    [152, 0x6c, "Smear", D.Z_P100, "%"],
    [152, 0x6d, "Position (Ducking)", D.LOOKUP({0: "Pre", 1: "Post"})],

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

    // Reverb - Spring Reverb (193)
    // [193, 0x45, "Mix", L.mix, "%"],
    // [193, 0x46, "Position (Mix)", D.LOOKUP({0: "Pre", 1: "Post"})],
    // [193, 0x58, "Decay Time", ],


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

export const EFFECT_REGISTERS = REGISTER_LIST.reduce((acc, entry) => {
    const [effect, register, ...rest] = entry
    const xs = acc[effect] || []
    xs.push({
        offset: register,
        name: rest[0],
        decode: rest[1],
        unit: rest[2]
    })

    acc[effect] = xs
    return acc
}, {})
