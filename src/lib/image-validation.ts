const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 10_000;

export function extensionForImage(mime: string, name: string) {
  const extension = MIME_EXTENSIONS[mime.toLowerCase()];
  const declared = name.toLowerCase().split(".").pop();
  return extension && declared === extension ? extension : null;
}

function u16(bytes: Uint8Array, at: number) {
  return (bytes[at] << 8) | bytes[at + 1];
}
function u32(bytes: Uint8Array, at: number) {
  return (
    bytes[at] * 0x1000000 +
    (bytes[at + 1] << 16) +
    (bytes[at + 2] << 8) +
    bytes[at + 3]
  );
}

export function readImageDimensions(bytes: Uint8Array, mime: string) {
  if (
    mime === "image/png" &&
    bytes.length >= 24 &&
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71
  )
    return { width: u32(bytes, 16), height: u32(bytes, 20) };
  if (
    mime === "image/gif" &&
    bytes.length >= 10 &&
    bytes[0] === 71 &&
    bytes[1] === 73 &&
    bytes[2] === 70
  )
    return {
      width: bytes[6] | (bytes[7] << 8),
      height: bytes[8] | (bytes[9] << 8),
    };
  if (
    mime === "image/webp" &&
    bytes.length >= 30 &&
    bytes[0] === 82 &&
    bytes[1] === 73 &&
    bytes[2] === 70 &&
    bytes[8] === 87 &&
    bytes[9] === 69 &&
    bytes[10] === 66 &&
    bytes[11] === 80
  ) {
    if (
      bytes[12] === 86 &&
      bytes[13] === 80 &&
      bytes[14] === 56 &&
      bytes[15] === 32 &&
      bytes.length >= 30
    )
      return {
        width: bytes[26] | (bytes[27] << 8),
        height: bytes[28] | (bytes[29] << 8),
      };
    if (
      bytes[12] === 86 &&
      bytes[13] === 80 &&
      bytes[14] === 56 &&
      bytes[15] === 88
    )
      return {
        width:
          1 + ((bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) & 0x3fff),
        height:
          1 + ((bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) & 0x3fff),
      };
  }
  if (mime === "image/jpeg" && bytes[0] === 255 && bytes[1] === 216) {
    for (let i = 2; i + 9 < bytes.length; ) {
      if (bytes[i] !== 255) {
        i++;
        continue;
      }
      const marker = bytes[i + 1];
      const length = u16(bytes, i + 2);
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      )
        return { width: u16(bytes, i + 7), height: u16(bytes, i + 5) };
      i += 2 + length;
    }
  }
  return null;
}
