/* global FileReader */

export const getCorrectedRotation = (exifOrientation: number) => {
  switch (exifOrientation) {
    case 3:
      return 180
    case 6:
      return 90
    case 8:
      return 270
    default:
      return 0
  }
}

export const getImageOrientation = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: any) =>
      resolve(readOrientationFromEXIF(e.target.result))
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })

const readOrientationFromEXIF = (buffer: ArrayBuffer | SharedArrayBuffer) => {
  const data = new DataView(buffer)

  // Not a JPG
  if (data.getUint16(0) !== 0xffd8) {
    return -1
  }
  const length = data.byteLength

  let offset = 2

  while (offset < length) {
    if (data.getUint16(offset + 2, false) <= 8) {
      return -1
    }
    const marker = data.getUint16(offset, false)
    offset += 2
    if (marker === 0xffe1) {
      if (data.getUint32((offset += 2), false) !== 0x45786966) {
        return -1
      }

      const littleEndian = data.getUint16((offset += 6), false) === 0x4949
      offset += data.getUint32(offset + 4, littleEndian)
      const tags = data.getUint16(offset, littleEndian)
      offset += 2
      for (let i = 0; i < tags; i++) {
        if (data.getUint16(offset + i * 12, littleEndian) === 0x0112) {
          return data.getUint16(offset + i * 12 + 8, littleEndian)
        }
      }
      // tslint:disable-next-line:no-bitwise
    } else if ((marker & 0xff00) !== 0xff00) {
      break
    } else {
      offset += data.getUint16(offset, false)
    }
  }

  return -1
}
