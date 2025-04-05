/**
 * This module provides a standalone ponyfill of the native `btoa` function,
 * for encoding ASCII strings into base64.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa
 * @module btoa
 */
import {
  AZ,
  StringPrototypeCharAt,
  StringPrototypeCharCodeAt,
} from "./_internal.ts";

/**
 * Encodes a string of ASCII characters into a base64 string.
 *
 * @param b The string to encode.
 * @returns The base64 encoded string.
 * @throws {DOMException} If the input string contains characters that are
 * outside the valid range of ASCII characters.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa
 */
export function btoa(b: string): string {
  b = (b ?? "") + "";

  let s = "", i = 0;
  while (i < b.length) {
    const c1 = StringPrototypeCharCodeAt(b, i++) & 0xff;
    s += StringPrototypeCharAt(AZ, c1 >> 2);
    const c2 = StringPrototypeCharCodeAt(b, i++) & 0xff;
    s += StringPrototypeCharAt(AZ, (c1 & 0x3) << 4 | (c2 >> 4));
    if (i >= b.length) {
      s += StringPrototypeCharAt(AZ, (c2 & 0x0f) << 2);
      s += "=";
      break;
    }
    const c3 = StringPrototypeCharCodeAt(b, i++) & 0xff;
    s += StringPrototypeCharAt(AZ, (c2 & 0x0f) << 2 | (c3 >> 6));
    s += StringPrototypeCharAt(AZ, c3 & 0x3f);
  }
  return s;
}
