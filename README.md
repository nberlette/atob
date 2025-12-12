<div align="center">

# @nick/atob

<b>Lightweight, dependency-free, portable ponyfills for `atob` and `btoa`.</b>

[![][badge-jsr-score]][JSR] [![][badge-jsr-pkg]][JSR]

</div>

---

## Install

```sh
deno add jsr:@nick/atob
```

```sh
pnpm add jsr:@nick/atob
```

```sh
yarn add jsr:@nick/atob
```

```sh
bunx jsr add @nick/atob
```

```sh
npx -y jsr add @nick/atob
```

---

## Usage

This package provides [ponyfill] exports for `atob` and `btoa`, as well as a
`./shim` entrypoint that will automatically polyfill the global scope with
`atob` and/or `btoa` if they are not already supported.

### [Ponyfill]

```ts
import { atob, btoa } from "@nick/atob";
import assert from "node:assert";

const datauri = `data:image/svg+xml;base64,${btoa("<svg>...</svg>")}`;
const base64 = datauri.split(",")[1]!;

const decoded = atob(base64); // "<svg>...</svg>"
assert.strictEqual(decoded, "<svg>...</svg>"); // OK
```

### [Polyfill]

While the primary focus of this package is providing a [ponyfill] for `atob` and
`btoa`, some users might need a <em>poly</em>fill instead.

Therefore, I've also provided an automatic shim module that gracefully installs
these functions on an as-needed basis, as well as a manual install module that
allows you to choose when and if you want it to mutate the global scope.

#### Shim (automatic)

```ts ignore
import "@nick/atob/shim"; // side-effect import

const bytes = "data:application/wasm;base64,AGFzbQEAAAABOwpgAn9/AX...";

const buf = Uint8Array.from(atob(bytes.split(",")[1]!), (b) => b.charCodeAt(0));

const module = new WebAssembly.Module(buf);
const instance = new WebAssembly.Instance(module);
```

#### Install (manual)

If you need explicit control over the polyfilling, [`install()`](#install-1) can
be used to gracefully install the functions on-demand.

```ts
import { install } from "@nick/atob/install";
import assert from "node:assert";

if (typeof atob !== "function" || typeof btoa !== "function") {
  install(); // ta da!
}

assert.strictEqual(btoa("hello world"), "aGVsbG8gd29ybGQ="); // OK
assert.strictEqual(atob("aGVsbG8gd29ybGQ="), "hello world"); // OK
```

> [!NOTE]
>
> This is used internally by the `./shim` entrypoint.

---

## API

### `atob`

Decodes a Base64-encoded string into a decoded string.

#### Signature

```ts ignore
function atob(data: string): string;
```

##### Params

**`data`** The Base64-encoded string to decode.

##### Return

A decoded string.

#### Example

```ts
import { atob } from "@nick/atob";
import assert from "node:assert";

const encoded = "aGVsbG8gd29ybGQ=";
const decoded = atob(encoded);

assert.strictEqual(decoded, "hello world"); // OK
```

#### References

- [`atob` - HTML Standard](https://html.spec.whatwg.org/multipage/webappapis.html#dom-atob)
- [MDN Reference: `atob`](https://developer.mozilla.org/en-US/docs/Web/API/atob)

---

### `btoa`

Encodes a string into Base64.

#### Signature

```ts ignore
function btoa(data: string): string;
```

##### Params

**`data`** The string to encode.

##### Return

A Base64-encoded string.

#### Example

```ts
import { btoa } from "@nick/atob";
import assert from "node:assert";

const data = "hello world";
const encoded = btoa(data);

assert.strictEqual(encoded, "aGVsbG8gd29ybGQ=");
```

#### References

- [`btoa` - HTML Standard](https://html.spec.whatwg.org/multipage/webappapis.html#dom-btoa)
- [MDN Reference: `btoa`](https://developer.mozilla.org/en-US/docs/Web/API/btoa)

---

### `install`

Gracefully polyfills the global `atob` and `btoa` functions if they are not
already present in the environment.

#### Signature

```ts ignore
function install(): Result;
```

##### Return

- On success, returns a `Success` object containing the installed functions.
- If the functions are already defined, returns a `Skipped` result.
- If the installation fails, returns a `Failure` result with the error.

#### Associated Types

##### `Success<T>`

Represents a successful polyfill installation

```ts ignore
interface Success<T> {
  readonly type: "success";
  readonly data: T;
}
```

##### `Skipped`

Indicates that the installation was skipped because `atob` and `btoa` are
already present. If available, the `info` property will contain extra context
about which functions were already defined and thus skipped.

```ts ignore
interface Skipped {
  readonly type: "skipped";
  readonly info?: string;
}
```

##### `Failure`

Represents a failed installation with an error.

```ts ignore
interface Failure {
  readonly type: "failure";
  readonly error: unknown;
}
```

##### `Data`

Contains references to the installed polyfill functions. This is the type of the
`data` property within a `Success` result returned by calling `install()`. If
only one function was installed, it will be the only one present in the data
payload. Otherwise, both of the polyfilled functions will be referenced.

```ts ignore
type Data =
  | { readonly atob: typeof atob }
  | { readonly btoa: typeof btoa }
  | { readonly atob: typeof atob; readonly btoa: typeof btoa };
```

##### `Result`

Represents the union of all possible results of the installation process, which
are each documented in the sections above. This is a discriminated union type;
check against the `type` property to determine which variant you have and allow
TypeScript to narrow the type accordingly.

```ts ignore
type Result = Success<Data> | Skipped | Failure;
```

#### Example

```ts
import { install } from "@nick/atob/install";
import assert from "node:assert";

if (typeof atob !== "function" || typeof btoa !== "function") {
  const result = install();
  if (result.type === "success") {
    console.log("atob and btoa installed successfully.");
  } else if (result.type === "skipped") {
    console.log("atob and btoa already installed.");
  } else {
    console.error("Failed to install atob and btoa:", result.error);
  }
}

assert.ok(typeof btoa === "function"); // OK
assert.strictEqual(btoa("hello world"), "aGVsbG8gd29ybGQ=");

assert.ok(typeof atob === "function"); // OK
assert.strictEqual(atob("aGVsbG8gd29ybGQ="), "hello world");
```

---

### [Contributing]

Contributions are always welcome! Before [submitting a pull request], I kindly
ask that you first [open an issue] and start a discussion regarding the feature
or bug you would like to address. This helps contributions align with the goals
and scope of the project, ensuring a smoother integration process.

For additional details, please refer to the [contributing guidelines]. Thanks!

---

<div align="center">

**[MIT] © [Nicholas Berlette]. All rights reserved.**

<small>

[github] · [issues] · [docs] · [contributing]

</small>

[![][badge-jsr]][JSR]

</div>

[Docs]: https://jsr.io/@nick/atob/doc "View the API documentation for @nick/atob on jsr.io!"
[open an issue]: https://github.com/nberlette/atob/issues/new "Found a bug? Please open an issue on the nberlette/atob repository!"
[contributing guidelines]: https://github.com/nberlette/atob/blob/main/.github/CONTRIBUTING.md "Please read the Contributing Guidelines prior to making your first contribution."
[submitting a pull request]: https://github.com/nberlette/atob/compare "Submit a Pull Request on GitHub"
[badge-jsr]: https://jsr.io/badges/@nick "View all of @nick's packages on jsr.io"
[badge-jsr-pkg]: https://jsr.io/badges/@nick/atob "View @nick/atob on jsr.io"
[badge-jsr-score]: https://jsr.io/badges/@nick/atob/score "View the score for @nick/atob on jsr.io"
[MIT]: https://nick.mit-license.org "MIT © Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Follow @nberlette on GitHub for more useful projects!"
[GitHub]: https://github.com/nberlette/atob "Give this project a star on GitHub! 🌟"
[Issues]: https://github.com/nberlette/atob/issues "Found a bug? Let's squash it!"
[JSR]: https://jsr.io/@nick/atob/doc "View the @nick/atob package on JSR"
[Contributing]: https://github.com/nberlette/atob/blob/main/.github/CONTRIBUTING.md "Read the Contributing Guidelines for nberlette/atob on GitHub"
[ponyfill]: https://ponyfill.com "Learn more about Ponyfills from Sindre Sorhus"
[polyfill]: https://developer.mozilla.org/en-US/docs/Glossary/Polyfill "Polyfills on MDN"
