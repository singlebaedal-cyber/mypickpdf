/**
 * Lightweight, zero-dependency Client-Side GIF89a Encoder
 * Converts video frames (ImageData) to animated GIF completely in the browser
 */

// LZW compressor for GIF
function lzwEncode(minCodeSize: number, pixelIndices: Uint8Array): Uint8Array {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;
  const maxCode = 4096;

  const dictionary: { [key: string]: number } = {};
  const output: number[] = [];

  let curByte = 0;
  let curBits = 0;

  function writeBits(code: number, size: number) {
    curByte |= (code << curBits);
    curBits += size;
    while (curBits >= 8) {
      output.push(curByte & 0xff);
      curByte >>= 8;
      curBits -= 8;
    }
  }

  function resetDict() {
    for (let key in dictionary) delete dictionary[key];
    codeSize = minCodeSize + 1;
    nextCode = eoiCode + 1;
  }

  writeBits(clearCode, codeSize);

  let currentPrefix = "";

  for (let i = 0; i < pixelIndices.length; i++) {
    const pixel = pixelIndices[i];
    const key = currentPrefix === "" ? String(pixel) : currentPrefix + "," + pixel;

    if (dictionary[key] !== undefined) {
      currentPrefix = key;
    } else {
      if (currentPrefix === "") {
        writeBits(pixel, codeSize);
      } else {
        writeBits(dictionary[currentPrefix] !== undefined ? dictionary[currentPrefix] : parseInt(currentPrefix), codeSize);
      }

      if (nextCode < maxCode) {
        dictionary[key] = nextCode++;
        if (nextCode > (1 << codeSize) && codeSize < 12) {
          codeSize++;
        }
      } else {
        writeBits(clearCode, codeSize);
        resetDict();
      }

      currentPrefix = String(pixel);
    }
  }

  if (currentPrefix !== "") {
    writeBits(dictionary[currentPrefix] !== undefined ? dictionary[currentPrefix] : parseInt(currentPrefix), codeSize);
  }

  writeBits(eoiCode, codeSize);

  if (curBits > 0) {
    output.push(curByte & 0xff);
  }

  // Pack into GIF sub-blocks (max 255 bytes per sub-block)
  const result: number[] = [minCodeSize];
  for (let i = 0; i < output.length; i += 254) {
    const chunk = output.slice(i, Math.min(i + 254, output.length));
    result.push(chunk.length);
    for (let j = 0; j < chunk.length; j++) {
      result.push(chunk[j]);
    }
  }
  result.push(0); // Sub-block terminator

  return new Uint8Array(result);
}

// Simple 216-color Web-safe palette + 40 grays
function generatePalette(): { palette: Uint8Array; colorCount: number } {
  const palette = new Uint8Array(256 * 3);
  let idx = 0;

  // 6x6x6 color cube
  for (let r = 0; r < 6; r++) {
    for (let g = 0; g < 6; g++) {
      for (let b = 0; b < 6; b++) {
        palette[idx++] = Math.round((r * 255) / 5);
        palette[idx++] = Math.round((g * 255) / 5);
        palette[idx++] = Math.round((b * 255) / 5);
      }
    }
  }

  // 40 grayscale levels
  for (let i = 0; i < 40; i++) {
    const val = Math.round((i * 255) / 39);
    palette[idx++] = val;
    palette[idx++] = val;
    palette[idx++] = val;
  }

  return { palette, colorCount: 256 };
}

// Map RGB to closest index in the palette
function mapRgbToPaletteIndex(r: number, g: number, b: number): number {
  const rIdx = Math.min(5, Math.round((r * 5) / 255));
  const gIdx = Math.min(5, Math.round((g * 5) / 255));
  const bIdx = Math.min(5, Math.round((b * 5) / 255));
  return rIdx * 36 + gIdx * 6 + bIdx;
}

export interface GifFrame {
  data: ImageData;
  delayMs: number;
}

export function encodeGif(
  width: number,
  height: number,
  frames: GifFrame[]
): Blob {
  const bytes: number[] = [];

  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
  }

  function writeShort(val: number) {
    bytes.push(val & 0xff);
    bytes.push((val >> 8) & 0xff);
  }

  // 1. Header: GIF89a
  writeString("GIF89a");

  // 2. Logical Screen Descriptor
  writeShort(width);
  writeShort(height);
  bytes.push(0xf7); // Global color table flag (1), color resolution (7 = 8 bits), sort (0), GCT size (7 = 256 colors)
  bytes.push(0);    // Background color index
  bytes.push(0);    // Pixel aspect ratio

  // 3. Global Color Table (256 colors = 768 bytes)
  const { palette } = generatePalette();
  for (let i = 0; i < palette.length; i++) {
    bytes.push(palette[i]);
  }

  // 4. Netscape Application Block for looping
  bytes.push(0x21); // Extension Introducer
  bytes.push(0xff); // Application Extension
  bytes.push(11);   // Block Size
  writeString("NETSCAPE2.0");
  bytes.push(3);    // Sub-block size
  bytes.push(1);    // Loop sub-block ID
  writeShort(0);    // Loop count (0 = infinite)
  bytes.push(0);    // Block Terminator

  // 5. Frames
  for (let f = 0; f < frames.length; f++) {
    const frame = frames[f];
    const delay100ths = Math.max(2, Math.round(frame.delayMs / 10));

    // Graphic Control Extension
    bytes.push(0x21); // Extension Introducer
    bytes.push(0xf9); // Graphic Control Label
    bytes.push(4);    // Block size
    bytes.push(0x04); // Disposal method: 1 (do not dispose / restore background)
    writeShort(delay100ths); // Delay time
    bytes.push(0);    // Transparent color index
    bytes.push(0);    // Block terminator

    // Image Descriptor
    bytes.push(0x2c); // Image separator
    writeShort(0);    // Left
    writeShort(0);    // Top
    writeShort(width);
    writeShort(height);
    bytes.push(0);    // No local color table

    // Map ImageData RGBA to palette indices
    const numPixels = width * height;
    const pixelIndices = new Uint8Array(numPixels);
    const rgba = frame.data.data;
    for (let i = 0; i < numPixels; i++) {
      const offset = i * 4;
      pixelIndices[i] = mapRgbToPaletteIndex(rgba[offset], rgba[offset + 1], rgba[offset + 2]);
    }

    // LZW Encode (min code size 8 for 256 colors)
    const lzwData = lzwEncode(8, pixelIndices);
    for (let i = 0; i < lzwData.length; i++) {
      bytes.push(lzwData[i]);
    }
  }

  // 6. Trailer: 0x3B
  bytes.push(0x3b);

  return new Blob([new Uint8Array(bytes)], { type: "image/gif" });
}
