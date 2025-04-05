// deno-lint-ignore-file no-explicit-any no-var

/**
 * This module provides a set of primordial objects and functions that are
 * cached for use throughout the lifecycle of the program, to avoid issues
 * related to global object shadowing, code transformations, and various other
 * forms of tampering.
 *
 * @module primordials
 * @internal
 */

declare const global: typeof globalThis | undefined;
declare const root: typeof globalThis | undefined;

export const ThrowTypeError: (
  message?: string,
  options?: ErrorOptions,
) => never = /*#__PURE__*/ (() => {
  var TypeError: TypeErrorConstructor;
  try {
    // @ts-expect-error -- this is intentional
    null.x;
  } catch (error) {
    TypeError = (error as any).constructor as TypeErrorConstructor;
  }
  return function ThrowTypeError(
    message?: string,
    options?: ErrorOptions,
  ): never {
    throw new TypeError(message, options);
  };
})();

export const $globalThis: typeof globalThis = /*#__PURE__*/ (() => {
  if (
    typeof globalThis === "object" && globalThis != null &&
    typeof globalThis.Object === "function" &&
    globalThis.Object === ({}).constructor
  ) return globalThis;

  // deno-fmt-ignore
  return (
      typeof self === "object" && self !== null ? self
      : typeof global === "object" && global !== null ? global
      : typeof window === "object" && window !== null ? window
      : typeof this === "object" && this !== null ? this
      : typeof root === "object" && root !== null ? root
      : (() => {
          try {
            return (0, eval)("this");
          } catch (_) {
            ThrowTypeError()
          }
        })()
    );
})();

export type $globalThis = typeof $globalThis;

export const Error: ErrorConstructor = $globalThis.Error;
export const ErrorCaptureStackTrace = Error.captureStackTrace;

export const Object: ObjectConstructor = $globalThis.Object;
export const ObjectDefineProperty = Object.defineProperty;
export const ObjectSetPrototypeOf = Object.setPrototypeOf;

export const Reflect: typeof $globalThis.Reflect = $globalThis.Reflect;
export const ReflectConstruct = Reflect.construct;

export const DOMException: typeof globalThis.DOMException = (() => {
  if (typeof $globalThis.DOMException === "function") {
    return $globalThis.DOMException;
  }

  /**
   * Returns the legacy error code for a given error name.
   *
   * @param name - The error name.
   * @returns The legacy error code, or 0 if not applicable.
   */
  function getLegacyCode(name: string): number {
    const legacyCodes: Record<string, number> = {
      "IndexSizeError": 1,
      "HierarchyRequestError": 3,
      "WrongDocumentError": 4,
      "InvalidCharacterError": 5,
      "NoModificationAllowedError": 7,
      "NotFoundError": 8,
      "NotSupportedError": 9,
      "InvalidStateError": 11,
      "InUseAttributeError": 10,
      "SyntaxError": 12,
      "InvalidModificationError": 13,
      "NamespaceError": 14,
      "InvalidAccessError": 15,
      "TypeMismatchError": 17,
      "SecurityError": 18,
      "NetworkError": 19,
      "AbortError": 20,
      "URLMismatchError": 21,
      "QuotaExceededError": 22,
      "TimeoutError": 23,
      "InvalidNodeTypeError": 24,
      "DataCloneError": 25,
    };
    return legacyCodes[name] ?? 0;
  }

  /**
   * A ponyfill for the DOMException interface.
   *
   * This class emulates the standard DOMException, including legacy error codes,
   * while extending Error to capture stack traces. The properties are set as
   * read‑only and enumerable so that instances can be structured-cloned or
   * transferred between Workers.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException
   *
   * @example
   * throw new DOMException("The index is not in the allowed range", "IndexSizeError");
   */
  return class DOMException {
    static readonly INDEX_SIZE_ERR = 1;
    static readonly DOMSTRING_SIZE_ERR = 2;
    static readonly HIERARCHY_REQUEST_ERR = 3;
    static readonly WRONG_DOCUMENT_ERR = 4;
    static readonly INVALID_CHARACTER_ERR = 5;
    static readonly NO_DATA_ALLOWED_ERR = 6;
    static readonly NO_MODIFICATION_ALLOWED_ERR = 7;
    static readonly NOT_FOUND_ERR = 8;
    static readonly NOT_SUPPORTED_ERR = 9;
    static readonly INUSE_ATTRIBUTE_ERR = 10;
    static readonly INVALID_STATE_ERR = 11;
    static readonly SYNTAX_ERR = 12;
    static readonly INVALID_MODIFICATION_ERR = 13;
    static readonly NAMESPACE_ERR = 14;
    static readonly INVALID_ACCESS_ERR = 15;
    static readonly VALIDATION_ERR = 16;
    static readonly TYPE_MISMATCH_ERR = 17;
    static readonly SECURITY_ERR = 18;
    static readonly NETWORK_ERR = 19;
    static readonly ABORT_ERR = 20;
    static readonly URL_MISMATCH_ERR = 21;
    static readonly QUOTA_EXCEEDED_ERR = 22;
    static readonly TIMEOUT_ERR = 23;
    static readonly INVALID_NODE_TYPE_ERR = 24;
    static readonly DATA_CLONE_ERR = 25;

    readonly INDEX_SIZE_ERR = 1;
    readonly DOMSTRING_SIZE_ERR = 2;
    readonly HIERARCHY_REQUEST_ERR = 3;
    readonly WRONG_DOCUMENT_ERR = 4;
    readonly INVALID_CHARACTER_ERR = 5;
    readonly NO_DATA_ALLOWED_ERR = 6;
    readonly NO_MODIFICATION_ALLOWED_ERR = 7;
    readonly NOT_FOUND_ERR = 8;
    readonly NOT_SUPPORTED_ERR = 9;
    readonly INUSE_ATTRIBUTE_ERR = 10;
    readonly INVALID_STATE_ERR = 11;
    readonly SYNTAX_ERR = 12;
    readonly INVALID_MODIFICATION_ERR = 13;
    readonly NAMESPACE_ERR = 14;
    readonly INVALID_ACCESS_ERR = 15;
    readonly VALIDATION_ERR = 16;
    readonly TYPE_MISMATCH_ERR = 17;
    readonly SECURITY_ERR = 18;
    readonly NETWORK_ERR = 19;
    readonly ABORT_ERR = 20;
    readonly URL_MISMATCH_ERR = 21;
    readonly QUOTA_EXCEEDED_ERR = 22;
    readonly TIMEOUT_ERR = 23;
    readonly INVALID_NODE_TYPE_ERR = 24;
    readonly DATA_CLONE_ERR = 25;

    /**
     * Legacy error code value. (Deprecated)
     * @readonly
     */
    declare readonly code: number;
    /**
     * The error message.
     * @readonly
     */
    declare readonly message: string;
    /**
     * The error name.
     * @readonly
     */
    declare readonly name: string;

    /**
     * Creates a new DOMException instance.
     *
     * @param message - The error message.
     * @param name - The error name.
     */
    constructor(message?: string, name?: string) {
      const error = ReflectConstruct(Error, [], new.target);
      error.message = message || "";
      error.name = name || "Error";
      (error as any).code = getLegacyCode(error.name = name || "Error");

      // Ensure properties are non-writable and enumerable.
      ObjectDefineProperty(error, "message", {
        writable: false,
        enumerable: true,
      });
      ObjectDefineProperty(error, "name", {
        writable: false,
        enumerable: true,
      });
      ObjectDefineProperty(error, "code", {
        writable: false,
        enumerable: true,
      });

      return error as unknown as this; // janky but it's what Deno does, too
    }
  };
})();

export const Function: FunctionConstructor = $globalThis.Function;
export const FunctionPrototype = Function.prototype;

const { bind, call } = FunctionPrototype;

/**
 * Creates an uncurried version of the provided function, which accepts the
 * receiver as its first param (sets the `this` binding in that invocation of
 * the target function), and the remaining arguments as a rest parameter.
 *
 * @param fn The function to uncurry.
 * @param [_thisArg] Used for type inference of `this` only; unused at runtime.
 * @returns An uncurried version of the provided function.
 * @internal
 */
export const uncurryThis: <T = any, A extends readonly any[] = any[], R = any>(
  fn: (this: T, ...args: A) => R,
  _thisArg?: T,
) => (target: T, ...args: A) => R = bind.bind(call) as any;

export const String: StringConstructor = $globalThis.String;
export const StringFromCharCode = String.fromCharCode;
export const StringPrototype = String.prototype;
export const StringPrototypeCharCodeAt = uncurryThis(
  StringPrototype.charCodeAt,
);
export const StringPrototypeCharAt = uncurryThis(StringPrototype.charAt);
export const StringPrototypeIndexOf = uncurryThis(StringPrototype.indexOf);
export const StringPrototypeTrim = uncurryThis(StringPrototype.trim);
export const StringPrototypeReplace = uncurryThis(StringPrototype.replace) as {
  (
    string: string,
    pattern: string | RegExp,
    replacement: string | ((m: string, ...args: any[]) => string),
  ): string;
};

export const AZ =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export function ThrowException(
  message: string,
  stackCrawlMark: Function = ThrowException,
): never {
  const error = new DOMException(message, "InvalidCharacterError");
  ErrorCaptureStackTrace(error, stackCrawlMark);
  error.stack; // Ensure stack is generated.
  throw error;
}
