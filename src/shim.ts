/// <reference types="./shim.d.ts" />

/**
 * This module automatically polyfills the global `atob` and `btoa` functions
 * if necessary. If they are already present, it does nothing. There are no
 * exports provided by this module; it is intended as a side-effect import.
 *
 * @example
 * ```ts
 * import "@nick/atob/shim";
 *
 * btoa("hello world"); // "aGVsbG8gd29ybGQ="
 *
 * atob("aGVsbG8gd29ybGQ="); // "hello world"
 * ```
 * @module shim
 */
import type {} from "./shim.d.ts";
import install from "./install.ts";

install();
