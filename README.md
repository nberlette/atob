<div align="center">

# @nick/atob

<b>Lightweight, dependency-free, portable ponyfills for `atob` and `btoa`.</b>

[![][badge-jsr-score]][JSR] [![][badge-jsr-pkg]][JSR]

</div>

---

## Install

```sh
# deno
deno add jsr:@nick/atob

# bun
bunx jsr add @nick/atob

# pnpm
pnpm dlx jsr add @nick/atob

# yarn
yarn dlx jsr add @nick/atob

# npm
npx -y jsr add @nick/atob
```

---

## Usage

This package provides [ponyfill] exports for `atob` and `btoa`, as well as a
`./shim` entrypoint that will automatically polyfill the global scope with
`atob` and/or `btoa` if they are not already supported.

### Ponyfill

```ts
import { atob, btoa } from "@nick/atob";

const datauri = `data:image/svg+xml;base64,${btoa("<svg>...</svg>")}`;

const base64 = datauri.split(",")[1]!;

const decoded = atob(base64); // "<svg>...</svg>"
console.assert(decoded === "<svg>...</svg>"); // OK
```

### Polyfill

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

if (typeof atob !== "function" || typeof btoa !== "function") {
  install(); // ta da!
}

console.assert(btoa("hello world") === "aGVsbG8gd29ybGQ="); // OK
console.assert(atob("aGVsbG8gd29ybGQ=") === "hello world"); // OK
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

const encoded = "aGVsbG8gd29ybGQ=";
const decoded = atob(encoded);

console.assert(decoded === "hello world"); // OK
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

const data = "hello world";
const encoded = btoa(data);

console.assert(encoded === "aGVsbG8gd29ybGQ=");
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

- On success, returns a `Success<Data>` object containing the installed
  functions.
- If the functions are already defined, returns a `Skipped` result.
- If an error occurs during installation, returns a `Failure` result with the
  error.

#### Associated Types

- **`Success<T>`** Represents a successful operation.
  ```ts ignore
  interface Success<T> {
    readonly type: "success";
    readonly data: T;
  }
  ```

- **`Skipped`** Indicates that the installation was skipped because `atob` and
  `btoa` are already present.
  ```ts ignore
  interface Skipped {
    readonly type: "skipped";
    readonly info?: string;
  }
  ```

- **`Failure`** Represents a failed installation with an error.
  ```ts ignore
  interface Failure {
    readonly type: "failure";
    readonly error: unknown;
  }
  ```

- **`Data`** Contains references to the installed polyfill functions.
  ```ts ignore
  type Data =
    | { readonly atob: typeof atob }
    | { readonly btoa: typeof btoa }
    | { readonly atob: typeof atob; readonly btoa: typeof btoa };
  ```

- **`Result`** Represents the union of all possible results of the installation
  process.
  ```ts ignore
  type Result = Success<Data> | Skipped | Failure;
  ```

#### Example

```ts
import { install } from "@nick/atob/install";

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

console.assert(typeof atob === "function" && typeof atob === "function"); // OK
console.assert(btoa("hello world") === "aGVsbG8gd29ybGQ=");
console.assert(atob("aGVsbG8gd29ybGQ=") === "hello world");
```

---

### Contributing

Contributions are always welcome! Before [submitting a pull request], I kindly
ask that you first [open an issue] and start a discussion regarding the feature
or bug you would like to address. This helps contributions align with the goals
and scope of the project, ensuring a smoother integration process.

For additional details, please refer to the [contributing guidelines]. Thanks!

---

<div align="center">

<strong>

[MIT] © [Nicholas Berlette]. All rights reserved.

</strong>

<small>

[Github] · [Issues] · [Docs] · [Contribute]

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
[GitHub]: https://github.com/nberlette/atob "Give @nick/atob a star on GitHub! 🌟"
[Issues]: https://github.com/nberlette/atob/issues "Found a bug? Let's squash it!"
[JSR]: https://jsr.io/@nick/atob/doc "View the @nick/atob package on JSR"
[Contribute]: https://github.com/nberlette/atob/blob/main/.github/CONTRIBUTING.md "Read the Contributing Guidelines"
[ponyfill]: https://ponyfill.com "Learn more about Ponyfills from Sindre Sorhus"
