/**
 * This module provides a single {@linkcode install} function to gracefully
 * polyfill the global `atob` and `btoa` functions, if they are not already
 * present in the global scope. It also provides types for the result of the
 * installation process.
 *
 * This is a relatively low-level module that is used internally by the
 * `./shim` module in this package. It's really only useful if you need to
 * manually perform a programmatic polyfill installation for `atob` and `btoa`.
 *
 * If you simply wish to ensure those two functions **_exist_** in the global
 * scope, you're better off using a side-effect import of `@nick/atob/shim`.
 *
 * | Feature             | Description                                        |
 * | ------------------- | -------------------------------------------------- |
 * | {@linkcode Success} | Represents a successful polyfill installation.     |
 * | {@linkcode Skipped} | Returned when `atob` and `btoa` already exist.     |
 * | {@linkcode Failure} | Represents a failed installation with an error.    |
 * | {@linkcode Data}    | References to the installed polyfill functions.    |
 * | {@linkcode Result}  | Represents the result of the installation process. |
 * | {@linkcode install} | Gracefully polyfills the `atob`/`btoa` functions.  |
 *
 * @example
 * ```ts
 * import { install } from "@nick/atob/install";
 *
 * if (typeof atob !== "function" || typeof btoa !== "function") install();
 *
 * btoa("hello world"); // "aGVsbG8gd29ybGQ="
 * atob("aGVsbG8gd29ybGQ="); // "hello world"
 * ```
 * @module install
 */
import { $globalThis, ObjectDefineProperty } from "./_internal.ts";
import { atob } from "./atob.ts";
import { btoa } from "./btoa.ts";

/**
 * Represents a successful operation.
 *
 * @template T - The type of the data returned upon success.
 * @category Types
 * @tags Result, Success
 */
export interface Success<T> {
  readonly type: "success";
  readonly data: T;
}

/**
 * Represents a skipped operation. This result is returned when the
 * installation is not performed because it has already been installed.
 *
 * @category Types
 * @tags Result, Skipped
 */
export interface Skipped {
  readonly type: "skipped";
  readonly info?: string | undefined;
}

/**
 * Represents a failed operation, along with the error encountered during the
 * installation process.
 *
 * @category Types
 * @tags Result, Failure
 */
export interface Failure {
  readonly type: "failure";
  readonly error: unknown;
}

/**
 * Represents the data returned upon successful installation, which contains
 * references to the functions installed by the polyfill. This is an object
 * that will contain the `atob` and/or `btoa` functions, depending on what  was
 * installed into the global scope.
 *
 * @category Types
 * @tags Result, Data
 */
export type Data =
  | { readonly atob: typeof atob }
  | { readonly btoa: typeof btoa }
  | { readonly atob: typeof atob; readonly btoa: typeof btoa };

/**
 * Represents the result of the installation process. This can be one of:
 *
 * - {@linkcode Success} result with the installation data.
 * - {@linkcode Skipped} result indicating that the installation was skipped.
 * - {@linkcode Failure} result indicating that the installation failed.
 *
 * @category Types
 * @tags Result
 */
export type Result = Success<Data> | Skipped | Failure;

/**
 * Installs the global `atob` and `btoa` functions if they are not already
 * present in the current environment's global scope.
 *
 * - If the global functions are already defined, the installation is skipped.
 * - In case of an error during the installation of either function, a
 *   `Failure` result is returned.
 * - On success, a `Success` result is returned with the installed functions.
 *
 * @returns The result of the installation process.
 * @example
 * ```ts
 * import { install } from "@nick/atob/install";
 *
 * if (typeof atob !== "function" || typeof btoa !== "function") {
 *   const result = install();
 *   if (result.type === "success") {
 *     console.log("atob and btoa installed successfully.");
 *   } else if (result.type === "skipped") {
 *     console.log("atob and btoa already installed.");
 *   } else {
 *     console.error("Failed to install atob and btoa:", result.error);
 *   }
 * }
 * ```
 */
export default function install(): Result {
  let result: Result = { type: "skipped", info: "Already installed." };
  if (typeof $globalThis.atob !== "function") {
    try {
      // in case it was mangled by a minifier
      ObjectDefineProperty(atob, "name", {
        __proto__: null,
        value: "atob",
      } as PropertyDescriptor);

      ObjectDefineProperty($globalThis, "atob", {
        __proto__: null,
        value: atob,
        configurable: true,
        writable: true,
        enumerable: false,
      } as PropertyDescriptor);
    } catch (error) {
      return { type: "failure", error };
    } finally {
      result = { type: "success", data: { atob } };
    }
  }

  if (typeof $globalThis.btoa !== "function") {
    try {
      // in case it was mangled by a minifier
      ObjectDefineProperty(
        btoa,
        "name",
        { __proto__: null, value: "btoa" } as PropertyDescriptor,
      );
      ObjectDefineProperty($globalThis, "btoa", {
        __proto__: null,
        value: btoa,
        configurable: true,
        writable: true,
        enumerable: false,
      } as PropertyDescriptor);
    } catch (error) {
      return { type: "failure", error };
    } finally {
      result = {
        type: "success",
        data: { ...("data" in result ? result.data : {}), btoa },
      };
    }
  }
  return result;
}

export { install };
