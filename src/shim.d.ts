/**
 * Decodes a string of data encoded with base64 encoding, returning the string
 * as a Latin1-encoded string.
 *
 * @param s The base64-encoded string to decode.
 * @returns The decoded string in the Latin1 character set.
 * @example
 * ```ts
 * import "@nick/atob/shim";
 *
 * console.log(atob("aGVsbG8gd29ybGQ=")); // "hello world"
 * ```
 * @category Encoding
 */
declare function atob(s: string): string;

/**
 * Creates a base64 ASCII encoded string from the input string.
 *
 * @param s The string to encode.
 * @returns The base64-encoded string.
 * @example
 * ```ts
 * import "@nick/atob/shim";
 *
 * console.log(btoa("hello world")); // "aGVsbG8gd29ybGQ="
 * ```
 * @category Encoding
 */
declare function btoa(s: string): string;
