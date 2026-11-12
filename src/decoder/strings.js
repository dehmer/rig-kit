
/**
 * String tags by controller (MSB, LSB).
 */
export const STRING_LIST = [
  [0x00, 0x01, "Rig:Name"],
  [0x00, 0x02, "Rig:Author"],
  [0x00, 0x03, "Rig:Modification Date"],
  [0x00, 0x04, "Rig:Comment"], // S/N

  [0x00, 0x10, "Amp:Name"],
  [0x00, 0x11, "Amp:Author"],
  [0x00, 0x12, "Amp:Creation Date"],
  [0x00, 0x13, "Amp:Creation Time"], // Now longer used; now same as "Amp:Creation Date"
  [0x00, 0x14, "Amp:Location"],
  [0x00, 0x15, "Amp:Manufacturer"],
  [0x00, 0x16, "Amp:Comment"],
  [0x00, 0x18, "Amp:Model"],
  [0x00, 0x19, "Amp:Channel"],
  [0x00, 0x1a, "Amp:Pickup Type"],
  [0x00, 0x1b, "Amp:Year of Production"],

  [0x00, 0x20, "Cabinet:Name"],
  [0x00, 0x21, "Cabinet:Author"],
  [0x00, 0x22, "Cabinet:Creation Date"],
  [0x00, 0x23, "Cabinet:Creation Time"], // Now longer used; now same as "Cabinet:Creation Date"
  [0x00, 0x24, "Cabinet:Location"],
  [0x00, 0x25, "Cabinet:Manufacturer"],
  [0x00, 0x27, "Cabinet:Comment"],
  [0x00, 0x2a, "Cabinet:Model"],

  [0x00, 0x29, "Speaker:Configuration"],
  [0x00, 0x2c, "Speaker:Manufacturer"],
  [0x00, 0x2d, "Speaker:Model"],

  [0x00, 0x26, "Mic:Model"],
  [0x00, 0x28, "Mic:Position"],

  [0x4e, 0x0e, "System:Firmware"],
]

export const STRING_KEYS = Object.fromEntries(
  STRING_LIST.map(([page, register, key]) => [page << 8 | register, key])
)
