#!/usr/bin/env node
import { basename, resolve } from 'node:path'
import { globSync, readFileSync } from 'node:fs'
import { EOX, parse } from '../src/sysex.js'
import { decode } from '../src/decoder/decode.js'

const readFrames = (buffer, pos, acc = []) => {
  if (pos >= buffer.length) return acc

  // System Exclusive; skip delta-time (= 0)
  // Read buffer from $F0 (SYX) to $F7 (EOX) inclusive:
  const end = buffer.indexOf(EOX, pos + 1) // EOX (end of system exclusive)
  const message = buffer.subarray(pos + 1, end + 1)
  return readFrames(buffer, end + 1, [...acc, message])
}


const scan = (dir = '.') => {
    // Resolve absolute path and build glob pattern for .krig files
    const absolutePath = resolve(dir)
    const pattern = absolutePath + "/*.krig"
    const files = globSync(pattern)

    for (const path of files) {
      console.log("[file]", basename(path))
      const buffer = readFileSync(path)
      const offset = 22 // skip KThd and KTrk
      const frames = readFrames(buffer, offset)
      const message = frames.map(parse)
      console.log("[message]", message)

      // Decode messages and merge properties into one object:
      const decoded = message
        .map(decode)
        .reduce((acc, { decoded }) => {
          return { ...acc, ...decoded }
        }, {})

      console.log(decoded)
    }
}

scan('./data/rigs')
