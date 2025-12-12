/**
 * This module provides a standalone ponyfill of the native `atob` and `btoa`
 * functions, for encoding and decoding between base64 and ASCII strings.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/atob
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa
 * @module atob
 */
import {
  AZ,
  StringFromCharCode,
  StringPrototypeCharAt,
  StringPrototypeCharCodeAt,
  StringPrototypeIndexOf,
  StringPrototypeTrim,
  ThrowException,
} from "./src/_internal.ts";

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
 * @example
 * ```ts
 * import { atob } from "@nick/atob";
 * import assert from "node:assert";
 *
 * const decoded = atob("aGVsbG8gd29ybGQ=");
 * assert.strictEqual(decoded, "hello world");
 * ```
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

/**
 * Encodes a string of ASCII characters into a base64 string.
 *
 * @param b The string to encode.
 * @returns The base64 encoded string.
 * @throws {DOMException} If the input string contains characters that are
 * outside the valid range of ASCII characters.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa
 * @example
 * ```ts
 * import { btoa } from "@nick/atob";
 * import assert from "node:assert";
 *
 * const encoded = btoa("hello world");
 * assert.strictEqual(encoded, "aGVsbG8gd29ybGQ=");
 * ```
 */
export function btoa(b: string): string {
  b ??= "";
  b += ""; // implicit string conversion

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
