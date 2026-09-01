P5 — /source entry failed to build in a consumer (@apply min-w-0)

Status: Fixed and verified, 2026-08-25. Committed in 0e2039b — but see CORRECTION below, which supersedes this diagnosis.
Severity when open: Build-breaking, on the recommended entry point.

Symptom. A clean Tailwind v4 consumer importing @valiify/dashboard-ui/source failed to compile with Cannot apply unknown utility class min-w-0, thrown from src/library.css. The prebuilt ./dist entry was unaffected; only /source — the entry the README labels "recommended" — broke. No in-repo check caught this: dist builds fine, Storybook runs, and all 826 visual / 105 static checks passed green, because every one of them exercises the library's own build, never a consumer's.

Cause. 14 component rules used @apply min-w-0 (the min-w-0 flex-1 shrink idiom), across 9 files: divider, alert (×2), menu-item, textarea, input, modal (×3), toast (×2), dropdown-field (×2), field-verification. min-w-0 is a core static utility; it resolves at build time in the library's own dist build (which imports @import "tailwindcss" source(none)), but when a consumer's Tailwind processes the raw library.css on the /source path, @apply-ing that core utility across the import boundary is not resolvable, and the build aborts at the first occurrence.

Fix. Replaced each @apply min-w-0 with a raw min-width: 0; declaration in the same rule, leaving all other applied classes intact. min-w-0 is exactly min-width: 0, so the swap is lossless and no longer depends on Tailwind resolving the utility.

Verification.

Compiled output provably unchanged: pre/post dist/index.css diff is 14 × min-width: 0px → 0 plus 4 × flex: 1 position shifts within the same rule; sorted-and-normalised, the two files are identical. min-width declaration count is 14 on both sides.
In-repo gates still green after rebuild: typecheck clean, verify:visual 826/826, audit 826 checks, verify:component 35/35.
Confirmed against the original failure: packed the fixed tarball, installed it in an external Vite + Tailwind v4 consumer, and loaded the /source page. It now builds and renders (previously it threw). grep confirms 0 @apply min-w-0 and 14 raw min-width: 0 in the installed package's component CSS.
Bonus observation from the same render: on /source, the consumer's custom --font-sans override survives (page rendered in the consumer's font), consistent with P2 — /source preserves consumer theme tokens where the default entry reverts them.

Not swept. Only @apply min-w-0 was audited and fixed. Other @apply of core static utilities elsewhere in src/ could fail a consumer's /source build the same way; none surfaced when the /source page rendered, but a full src/ sweep for bare-core-utility @apply has not been done.

CORRECTION — 2026-08-25. The diagnosis above is wrong, and the earlier "builds and renders" confirmation was a false positive. Appended rather than rewritten so the original reasoning stays on the record.

What actually breaks it is the consumer's IMPORT FORM, not any particular utility. The test app did `import '@valiify/dashboard-ui/source'` from TypeScript, so Vite handed library.css to PostCSS as its own root with no Tailwind context. In that mode every `@apply` of a core utility is unresolvable and Tailwind aborts at the first one it meets. min-w-0 was simply first in file order; removing it advanced the failure to `gap-3` in alert.css:90. There are 116 spacing-derived @apply utilities across src/, so under that import form the failure would recur indefinitely, one utility at a time.

Under the documented form the entry is fine. Running `@import "tailwindcss"; @import "@valiify/dashboard-ui/source";` through the consumer's own PostCSS (Tailwind 4.3.3) resolves gap-3 to `calc(var(--spacing) * 3)` and builds clean. Bisected to rule out alternatives: plain Tailwind resolves gap-1/2/3/4, min-w-0 and px-1 on their own, and removing the consumer's `--spacing-4` @theme override changed nothing, so this is neither a Tailwind bug nor a P2 theme interaction.

Why the earlier confirmation was false. Vite serves index-source.html with HTTP 200 even while the PostCSS transform fails — the page loads, the consumer's own CSS (including the Comic Sans override) applies, and the library CSS silently does not. "It loads" was read as "it built". The bonus --font-sans observation in the Verification block above was therefore measuring the consumer's own stylesheet, not the /source path, and should not be relied on.

Status of the min-w-0 change. Kept. It is harmless and the compiled output was proven byte-identical once `0px`/`0` is normalised, so there is no reason to revert it — but it was not the fix, and the finding it was based on did not exist as stated. No library change is needed for P5.

Still open. Whether the README is clear enough that /source must be reached with a CSS `@import` from inside the consumer's own Tailwind stylesheet, never with a JS/TS `import`. That is the only thing standing between a consumer and this failure, and one team already got it wrong.

Packaging findings summary

Six findings examined against a real packed tarball installed in an external Vite + Tailwind v4 consumer. P1 fixed; P2 and P3 confirmed; P4 and P6 disproven; P5 superseded by its 2026-08-25 correction above (no library change needed). Two of them — P5 and P6 — were originally filed on faulty evidence and are corrected in place rather than deleted, so the reasoning stays auditable.

P1 — Published tarball shipped no CSS

Status: Fixed and verified, 2026-08-25. Committed in 5829810.
Severity when open: Publish-breaking.

Symptom. dist/ is gitignored and there was no build hook, so publishing from a clean clone shipped a tarball whose only CSS file (dist/index.css) was absent — the ., ./index.css, and style entry points all resolved to nothing. npm pack succeeded silently, so the failure only surfaced on a consumer's machine, looking like their setup was broken.

Fix. Added "prepack": "npm run build" to package.json scripts. prepack runs on both npm pack and npm publish (unlike prepublishOnly, which skips pack — the exact path that made this invisible), so dist/ and the icon sprite are regenerated into every tarball.

Verification. Deleted dist/ and src/icons/sprite.svg, ran npm pack, and confirmed both regenerated into the tarball (dist/index.css 104,579 bytes; sprite.svg 516,938 bytes). Regenerated sprite is byte-identical to the committed one (git diff --quiet clean), confirming the build is deterministic and the hook can't introduce spurious diffs. Fix ships with the package — prepack is present in the packed package.json.

Not covered. prepack fixes the published tarball, not a fresh clone for local dev (where dist/ is absent until npm run build). That's a contributor-onboarding note (a docs line or postinstall), not a publish bug — a consumer receives the tarball, not a clone.

P2 — Prebuilt entry reverts consumer theme tokens

Status: Confirmed, narrower than originally filed. Not fixed — entry-point decision pending.
Severity: High on default entry; /source unaffected.

Measured. In a consumer with a custom @theme (--spacing-4: 2rem, --font-sans: "Comic Sans MS"):

Default entry: mt-4 measured 32px (survived — library doesn't define spacing), but font-family measured Inter (reverted).
/source entry: custom --font-sans survives (source page rendered in Comic Sans).

Cause. Not a blanket clobber. The library ships @layer theme { :root { --font-sans: Inter... } }; because the library import lands after the consumer's @theme, source order wins for any token both define. Only tokens the library also declares (its own fonts/colors/radii) are overridden; tokens it doesn't define (spacing) survive. This is ordinary cascade order on the default entry, and does not occur on /source.

P3 — Prebuilt entry double-applies Preflight

Status: Confirmed as filed. Not fixed — entry-point decision pending.
Severity: High on default entry.

Measured. Default entry: 2 box-sizing: border-box rules, 2 h1 { font-size } resets, 3 @layer base declarations — the consumer's Tailwind Preflight plus the library's bundled copy both apply. CSS-only test (library dist/index.css via <link> on a page with no Tailwind): base elements reset anyway — h1 measured 16px / 0 margin, ul bullets stripped. So the prebuilt entry applies a global reset to a non-Tailwind page, which a component library should not do.

P4 — focus-ring / type-label-* "advertised but missing" — DISPROVEN

Status: False finding on the README; minor doc-polish item on the CHANGELOG.

What the tarball shows. focus-ring and type-label-* are @utility definitions (in utilities/index.css and themes/valiify.css), imported by /source. They are absent from prebuilt dist/index.css (grep count 0) by design: the prebuilt entry uses @import "tailwindcss" source(none), and on-demand @utility classes nothing references aren't emitted. The README documents this correctly — it names type-label-l explicitly as something that "will not exist" on the prebuilt entry and lists both utilities under /source ("recommended"). Docs and code agree. The only residual issue: the CHANGELOG lists the utilities under "Custom utilities" without the entry-point caveat the README carries — a one-line doc edit, not a code defect.

P6 — Icon sprite is packed but not exported

Status: RETRACTED, 2026-08-25 — see the retraction below; this finding was wrong.
Severity: High for any consumer using icons, which is most of them.

Symptom. `import '@valiify/dashboard-ui/src/icons/sprite.svg'` fails in a Vite + Tailwind v4 consumer with: Missing "./src/icons/sprite.svg" specifier in "@valiify/dashboard-ui" package.

Cause. The file ships — src/icons/sprite.svg is present in the tarball, 516,938 bytes, regenerated by the prepack hook added for P1 — but package.json's exports map does not expose it. The map lists ".", "./source", "./fonts" and "./types" only. Node and Vite treat exports as exhaustive, so any path not listed is unreachable by package name even when the bytes are on disk.

Consequence. Every icon-bearing component — Button, IconButton, Input, MenuItem, Alert, Toast, Modal, Breadcrumbs, Step, Pagination and the rest — renders its glyph through `<use href="#name">`, which requires the consumer to have loaded the sprite. With no exported specifier the only routes left are reaching into node_modules by literal path (which is exactly what exports exists to prevent, and breaks under pnpm's strict layout), vendoring a copy, or serving it from their own public directory. None of those is documented.

Verified. Reproduced in the external consumer: the TypeScript import throws at dep-scan; fetching the same file by the raw path /node_modules/@valiify/dashboard-ui/src/icons/sprite.svg returns HTTP 200, confirming the bytes are present and only the specifier is missing.

Not fixed. Adding "./sprite" (or "./icons/sprite.svg") to the exports map is a one-line change, but it is an addition to the public API surface and should be named deliberately — see the Public API section of CHANGELOG.md.

RETRACTED — 2026-08-25. This finding is wrong. The sprite IS exported, as "./icons/sprite.svg": "./src/icons/sprite.svg", present since commit 5d22705 and in the very tarball this finding was tested against. The specifier that failed — @valiify/dashboard-ui/src/icons/sprite.svg — was fabricated by mirroring the on-disk path. It correctly is not exported, and that error was generalised into a packaging finding without ever reading the exports map. `require.resolve('@valiify/dashboard-ui/icons/sprite.svg')` resolves in the consumer, and the documented `?url` import loads all 2036 symbols and renders a glyph.

The real gap was smaller: the specifier was UNDOCUMENTED. The README never mentioned the sprite at all. Fixed in the README's new Icons section, with the fetch-and-inline pattern verified in the external consumer. No packaging change is or was needed, and nothing should be added to the exports map.

Appended rather than substituted, matching the P5 correction, so the faulty reasoning stays auditable.

For the designer

Consolidated from docs/figma-audit-newer-eleven.md — the full component-by-component detail lives there; this is the designer-facing subset only. Copied verbatim. Section 1 of that document (four real defects) is already fixed, committed in 9d3ab4c, and is not repeated here.

Designer questions (section 4 of figma-audit-newer-eleven.md)

1. **Icon stroke weight does not scale.** Figma's exports are `stroke-width="2"`
   at every icon size (home at 14, check at 12); the sprite's symbols are
   24-viewBox, giving ~1.17px at 14 and 1.0px at 12 — roughly half. Should
   strokes scale on resize?
   RESOLVED — answered by the designer and fixed. The per-size stroke ramp is
   committed in 3a04d14; the separate help-icon colour fix (stroke="black" ->
   currentColor, which had pinned that one glyph to black regardless of the
   ramp) is committed in 083e8fc, NOT 3a04d14. Note the finding above is wrong
   as written and is left intact only as the record: Figma does not export
   stroke-width="2" at every size (only the 24px variant declares 2; the 12px
   variant declares nothing at all), and our strokes were 0-22% too THICK, never
   half. 14px was the one open value and is now set to 1.25px per the designer.
   custom-help is
   still deliberately exempt from the ramp — a 22x22 viewBox with its own
   stroke-width="2" presentation attribute, which renders Figma's 1.09px at
   icon-size-12 and is correct.
2. **Stepper's step number is not an overridable property**, which is why all
   four instances read "1".
3. **FilterSegment binds `Radius/XS` (4px)** somewhere in the variant set that
   does not appear in instances — most plausibly the hidden Ring overlay. The
   segment box itself measures 6px. What carries the 4?
4. **Breadcrumbs models no hover or focus state** on its links.
5. **Chip vs Divider casing** — the same typed-caps-or-transform question,
   answered two different ways. One answer, please.


False claims corrected — still open (section 2 of figma-audit-newer-eleven.md)

Nine. Listed because the headers are the only durable record of *why* each
decision was made, so a wrong one is worse than no comment.

| # | Component | Claim | Reality |
| --- | --- | --- | --- |
| 1 | LoadingIndicator | "Figma's own PNG export renders 2px and 3px — traced pixel by pixel" | It renders **1.56 / 2.00 / 2.50 / 3.11**. My trace used a binary is-it-white test, so the 56%-coverage pixel at XS counted as a full one. |
| 2 | LoadingIndicator | authored widths are "2.5 and 3, Figma's arc math" | Authored are **2.52 / 3.04** — the actual path annulus. |
| 3 | LoadingIndicator | "masked stroke-widths are exactly double the ring" | 5 ≠ 5.04, 6 ≠ 6.08. In a mask-inside technique the stroke only needs to be ≥ the annulus, so it is not evidence of thickness at all. |
| 4 | PaginationItem | borders are "roughly Stroke/Border at 0.24 and 0.33 alpha" | Figma declares them literally at **0.2 / 0.25**, over the state fill. Compositing those gives Δ **0.0** against the render. I composited over white. |
| 5 | PaginationItem | default-pressed is "Δ 5.7" from Action/Selected | **Δ 10.3–11.7.** My script hardcoded Action/Selected at 0.09; its real alpha is 0.078. |
| 6 | Divider | the label is "byte-for-byte `Label S Sans - Bold`" | The *values* match; **no style is bound**. Provenance overstated. |
| 7 | Pagination | `.pagination-summary` "maps cleanly" to `--text-data-xs` | Figma is Auto leading, the token carries 16.5px — the very mismatch the next bullet discloses for `.pagination-status`. |
| 8 | Pagination | 1208px is "the artboard's content width" | Both variants are authored at a literal fixed `w-[1208px]` inside a 1321 frame. `w-full` is still right; the reason given is not. |
| 9 | Stepper | the instances "kept the component's default label instead of being overridden" | The number is **not an exposed property** — there is nothing to override. Observation right, cause wrong. |


Assumptions worth surfacing — still open (section 3 of figma-audit-newer-eleven.md)

- **PaginationItem active-pressed** binds `primary-pressed` (Δ **36.6** from
  Figma's `#143d75`) where `primary-dark` is Δ **10.6**. The header justifies the
  *hover* divergence and is silent on this one.
- **LoadingIndicator dots**: `#5b5b68` is ambiguous — `--color-secondary` and
  `--color-content-secondary` are the *same value*, so the spec's "Secondary/Main
  not Primary" assertion cannot distinguish them. LoadingInline's sibling label
  at the identical hex is bound to Content/Secondary.
- **ProgressBar** drops Figma's `overflow-clip` on both rows and
  `whitespace-nowrap` on every text child: a long title wraps and pushes the
  value; a long legend overflows rather than clipping.
- **ProgressBar** stores letter-spacing as `0.5px` against the documented rule
  that Figma authors it only as a percentage.
- **Stepper** root is `w-full` where Figma fixes 400px — undocumented, unlike the
  fill and radius in the same paragraph.
- **Step** documents `aria-current="step"` but nothing selects it; styling is
  class-only, where Tabs, Pill, MenuItem and DropdownField all drive from ARIA.


For the dev team

Accessibility and CSS-architecture items a designer cannot action. Moved here verbatim from the assumptions list in docs/figma-audit-newer-eleven.md section 3, where they were originally filed alongside Figma questions. The two Breadcrumbs items overlap with the pending accessibility pass.

- **Link** rest declarations rely on source order (`.link` sets `no-underline`,
  `.link-quiet` overrides at equal specificity) — in a file whose own comment
  disavows exactly that pattern for its state rules.
- **Link** pressed states are unassertable: the harness supports only `hover:`.
  `--color-critical-content`, the token added *for this component*, appears in
  no spec and is protected by nothing.
- **Breadcrumbs** separators have no `aria-hidden`, so a screen reader announces
  "greater than" / "slash" / "middot" between every crumb.
- **Breadcrumbs** has no `:focus-visible` at all, though `.breadcrumb` is
  documented as an `<a href>`.
