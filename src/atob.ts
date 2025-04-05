/**
 * This module provides a standalone ponyfill of the native `atob` function,
 * for decoding base64 strings into ASCII strings.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/atob
 * @module atob
 */
import {
  AZ,
  StringFromCharCode,
  StringPrototypeIndexOf,
  StringPrototypeTrim,
  ThrowException,
} from "./_internal.ts";

/**
 * Decodes a base64 string into a string of ASCII characters.
 *
 * @param a The base64 string to decode.
 * @returns The decoded string.
 * @throws {DOMException} If the input string contains characters that are not
 * valid base64 characters.
 * @throws {DOMException} If the decoded string contains characters that are
 * outside the valid range of ASCII characters.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob
 */
export function atob(a: string): string {
  a = (a ?? "") + "";
  a = StringPrototypeTrim(a);
  if (a.length % 4 !== 0) {
    ThrowException("The string to be decoded is not correctly encoded.");
  }

  let s = "";
  for (let i = 0; i < a.length;) {
    const e1 = StringPrototypeIndexOf(AZ, a[i++]);
    const e2 = StringPrototypeIndexOf(AZ, a[i++]);
    const e3 = StringPrototypeIndexOf(AZ, a[i++]);
    const e4 = StringPrototypeIndexOf(AZ, a[i++]);

    if (e1 === -1 || e2 === -1 || e3 === -1 || e4 === -1) {
      ThrowException(
        "The string to be decoded contains characters outside of the Latin1 range.",
      );
    }

    const c1 = (e1 << 2) | (e2 >> 4);
    const c2 = ((e2 & 15) << 4) | (e3 >> 2);
    const c3 = ((e3 & 3) << 6) | e4;

    s += StringFromCharCode(c1);
    if (e3 !== 64) s += StringFromCharCode(c2);
    if (e4 !== 64) s += StringFromCharCode(c3);
  }

  return s;
}
