# shortapp-ui + SvelteKit (Svelte 5)

The scoped-style test. A Svelte component's `<style>` compiles to **unlayered**
CSS that Vite injects after the app stylesheet — a second source of the
cascade-layer defeat that `examples/daisyui-starter` measures with Tailwind 3
preflight, and one a plain Vite page never reproduces. shortapp-web has it.

No Tailwind here at all. The shell imports `reset.css` then `styles.css`; the
thing under test is what SvelteKit does to component CSS.

`npm run check` starts the dev server, renders the page and asserts computed
styles for three components in `src/lib`, reading the compiled selectors off the
served stylesheets rather than assuming them:

| case | scoped source | compiles to | bundle |
| --- | --- | --- | --- |
| 1 | `:global(button) { border: 0 }` | `button` — 0,0,1, unlayered | **must win** (this is the fix) |
| 2 | `button { border: 0 }` | `button.svelte-hash` — 0,1,1 | **cannot win** — asserted as a loss |
| 3 | `button:not([class*="va-"]) { border: 0 }` | never matches ours | must win; the dev's plain button still resets |

Case 2 is the honest one. Unlayering the bundle fixes preflight, daisyUI and any
`:global` reset; it does not fix a host rule at higher specificity, and a scoped
element selector on the same element is exactly that. The remedy is case 3, or
scoping the reset by class. The assertion pins the limit to a measurement so the
HANDOFF contract's second clause cannot drift from what is true.

The check also asserts that `.va-btn-primary`'s white label survives the
library's **own** `reset.css` — an unlayered `button { color: inherit }`, subject
to the same rules as any host reset.

```bash
npm install
npm run check
npm run dev
```
