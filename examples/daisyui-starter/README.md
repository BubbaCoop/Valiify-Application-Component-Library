# shortapp-ui + Tailwind 3 + daisyUI 4

The host-collision test. The host runs **Tailwind 3 + daisyUI 4** — shortapp-web's
stack — and imports `@valiify/shortapp-ui/styles.css`, the prebuilt bundle, as a
plain stylesheet. No Tailwind 4 anywhere in this example; the bundle needs none.

`npm run check` renders the page in headless Chromium and asserts **computed
styles** in two directions. They are different bugs:

- **A — class-name collisions.** daisyUI owns `.btn`, `.badge`, `.input`,
  `.modal`, …; ours carry `va-`. Each pair must keep its own look. The `va-`
  namespace (1.0.0) is what fixes this.
- **B — the host's element reset.** `@tailwind base` emits Tailwind 3's preflight,
  unlayered and after our import: `* { border-width: 0 }`, `button {
  background-color: transparent }`, `input, textarea { font-size: 100%; color:
  inherit; padding: 0 }`, `textarea { resize: vertical }`. A component rule inside
  a cascade layer loses to every one of those before specificity or source order
  is consulted. This is asserted per control — **button, input, select,
  textarea** — because those are the elements preflight touches. The library
  ships no select component; the check asserts that from the manifest so the
  gap cannot go quiet when one lands.

The fingerprint of a layer defeat, which this check names when it sees it:
preflight never touches `outline`, so the **focus ring survives while the border
does not**, on the same control.

The host body is deliberately set to 13px / line-height 2 / purple. Preflight makes
form controls inherit those, so if our input rule loses the input visibly reads
the host's values. With the library's own values there, the defeat would be
invisible by coincidence.

```bash
npm install
npm run check
npm run dev
```

The `@import` must come first in `src/styles.css`; CSS discards an `@import` that
follows other rules, and the symptom looks exactly like a namespace failure.
