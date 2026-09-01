# QA Report — 2026-08-28-basic-signin — POST-REWORK PASS (re-run 2026-08-29)

**Stage 5 — behavioral QA, re-run after build rework pass 1.** Spec:
[`05-qa.spec.mjs`](05-qa.spec.mjs) (unchanged from the first pass — every
check re-executed; plain Node script over the repo's `playwright` package,
headless Chromium, run from the repo root; machine-readable results in
`05-qa-results.json`). Page opened via `file://` at 1280×800; resize checks
at 1440×900 / 1280×800 / 1024×768.

**What changed since the first pass:** the first pass ended
`QA: FAIL | TESTS: 29 | FAILURES: 2` — S6.1/S6.2, no visible keyboard focus
on `#email`/`#password`. The build agent applied one targeted fix: a
`:focus-visible` rule on `.signin-field .input` in `04-build/styles.css`
(lines 127–130), restating the library's `focus-ring` utility from the two
ring tokens (2px `Primary/Main` outline, negative offset). Nothing else
changed. **Both prior failures now pass; no regressions anywhere else** —
every check that passed or was n/a in the first pass returned the same
result.

**Behavior source:** `01-extraction/behaviors.json` is a source-limited
**empty set** (screenshot input), so part 1 of the brief has zero entries.
The behavioral tests below come from `03-requirements.md` §2 — the four
writeup-sourced flows — plus the §3 default-state precondition. All standing
checks from the brief were executed; sticky header, progress track and
expand/collapse do not exist on this page and are recorded **n/a**, per the
orchestrator's instruction.

## Results

| # | Test | Result | Prior pass |
| --- | --- | --- | --- |
| F0 | Default state: email prefilled `user@valiify.com`, password empty with placeholder, checkbox unchecked | pass | pass |
| F1 | Sign In click → alert `"Sign in clicked"`, no navigation | pass | pass |
| F2 | Cancel click → alert `"Cancel clicked"`, no navigation | pass | pass |
| F3 | Forgot password? is an `<a>` with an `href` (destination out of scope) | pass | pass |
| F3b | Forgot password? click stays in-page (no dialog, no document change) | pass | pass |
| F4 | View Demo Info click → informational alert, no navigation | pass | pass |
| S1.1 | Hover changes state — Sign In (`.btn-primary`) | pass | pass |
| S1.2 | Hover changes state — Cancel (`.btn-outline`) | pass | pass |
| S1.3 | Hover changes state — Forgot password? (`.link`) | pass | pass |
| S1.4 | Hover changes state — View Demo Info (`.btn-outline.btn-sm`) | pass | pass |
| S1.5 | Hover — Email input (chrome-less `.input`) | n/a¹ | n/a¹ |
| S1.6 | Hover — Password input (chrome-less `.input`) | n/a¹ | n/a¹ |
| S1.7 | Hover — Remember me (native checkbox) | n/a¹ | n/a¹ |
| S2 | Expand/collapse cycles both directions | n/a² | n/a² |
| S3 | Remember me toggles both directions, incl. via its label | pass | pass |
| S4 | Scroll: sticky header pinned / progress track updates | n/a³ | n/a³ |
| S4b | View Demo Info viewport-fixed, ~20px bottom-right insets (all measured 20.0px) | pass | pass |
| S5.1 | Resize 1440×900: no horizontal overflow, layout intact | pass | pass |
| S5.2 | Resize 1280×800: no horizontal overflow, layout intact | pass | pass |
| S5.3 | Resize 1024×768: no horizontal overflow, layout intact | pass | pass |
| S6.1 | Tab reaches `#email` with visible focus | **pass** | **fail** |
| S6.2 | Tab reaches `#password` with visible focus | **pass** | **fail** |
| S6.3 | Tab reaches `#remember` with visible focus | pass | pass |
| S6.4 | Tab reaches `#sign-in` with visible focus | pass | pass |
| S6.5 | Tab reaches `#cancel` with visible focus | pass | pass |
| S6.6 | Tab reaches `#forgot` with visible focus | pass | pass |
| S6.7 | Tab reaches `#view-demo` with visible focus | pass | pass |
| S6.8 | Tab order follows document order (email → password → remember → sign-in → cancel → forgot → view-demo) | pass | pass |
| S7 | Zero console errors across all tests (also 0 page errors, 0 unexpected dialogs, 0 failed requests) | pass | pass |

¹ The source specifies no hover state for these controls: the requester
mandated the chrome-less inputs and the native checkbox as drawn
(`00-input/requester-answers.md` answers 2–3), and `03-requirements.md` §3
notes hover/focus/active states "come with the components — the source draws
none of them". Measured anyway for completeness: no computed-style change on
hover, as expected. Not counted as failures.
² No expandable/collapsible elements exist on the page.
³ No sticky header and no progress track exist; the page also has no vertical
overflow at 1280×800 (scrollHeight 800 = viewport 800). The one
scroll-adjacent behavior that does exist — the viewport-fixed View Demo Info
button — is covered by S4b.

## Failures

None.

### Prior failures — resolution verified

**S6.1 / S6.2 (first pass: fail → now pass).** First pass: `#email` and
`#password` received keyboard focus in the correct tab-order position but
drew nothing — the library's `.input` reset (`outline-none`) suppressed the
browser ring, and the chrome-less treatment dropped the `.input-field`
wrapper whose `:focus-within` carries the library's visible ring. The fix —
`.signin-field .input:focus-visible { outline: var(--ring-focus-width) solid
var(--ring-focus-color); outline-offset: calc(-1 * var(--ring-focus-width)); }`
— now measures on both inputs at focus (read after the 450ms transition
settle): `outline: solid 2px oklch(0.4234 0.1163 256.9)` — i.e. a 2px
`Primary/Main` ring, matching the library's `focus-ring` utility. Tab order
is unchanged, hover on the inputs is still (correctly) inert, and the
rest-state rendering is untouched per the orchestrator (screenshot verified
byte-identical upstream).

## Notes

- View Demo Info alert copy is `"This is a demo!"`, same as the first pass.
  The requirements leave this copy unpinned ("informational alert"; requester
  answer 4 says "demo info"), so F4 asserts an alert with a non-empty message
  and records the actual text rather than pinning unspecified copy.
- The Forgot password? href is `"#"` — inert by design; the destination page
  is explicitly outside this build (`03-requirements.md` §2 row 3).
- Fonts and `dist/index.css` all loaded over `file://` with zero request
  failures; zero console/page errors across every test, including the three
  dialog flows.
- Tally: 29 checks — 24 pass, 0 fail, 5 n/a (the same five n/a as the first
  pass: three no-hover-in-source controls, no expand/collapse, no sticky
  header/progress track).

QA: PASS | TESTS: 29 | FAILURES: 0
