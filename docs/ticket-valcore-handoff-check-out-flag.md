# Ticket (val-core): `handoff-check --out json` writes a file literally named `json`

**Status:** open · **Raised:** 2026-09-16 · **Repo:** `@valiify/val-core` (`~/Desktop/val-core`)
**Affected version:** 0.6.1 · **Severity:** low impact, high confusion — it drops an untracked
file at whatever directory you ran from, which is easy to commit by accident (and was).

## What happened

Run from the library repo root:

```
node val/tools/design/handoff-check.mjs <run-dir> --out json
```

wrote its report to `./json` — a file with no extension at the repo root. It was committed by
accident in `23d4980` and removed in `5d6ce85`.

## Why — the tool contradicts its own usage string

`--out` is a **path**. `val/tools/lib/report.mjs`:

```js
if (out) return { path: resolve(out) };
```

so `--out json` resolves to `<cwd>/json`.

But `handoff-check.mjs` documents it as a literal value, in two places — the header comment
(line 9) and the `fail()` usage string (line 42):

```
node <tools-dir>/design/handoff-check.mjs <run-dir> [--package 05-package] [--out json]
```

No angle brackets. That reads as "pass `--out json` to get JSON", which is what the invocation
did. **The tool invited the mistake and then followed its own implementation instead of its own
documentation.**

## The three design tools disagree with each other

| tool | documents | implements | consistent? |
|---|---|---|---|
| `class-audit.mjs` | `[--out <json>]` | path | **yes** — angle brackets signal a placeholder |
| `feedback-check.mjs` | `[--out json]` | `out: opts.out === "json" ? undefined : opts.out` — the literal string `json` means "use the default path" | **yes** — special-cased to match its docs |
| `handoff-check.mjs` | `[--out json]` | path, no special case | **no** |

`feedback-check.mjs:284` carries exactly the special case `handoff-check` is missing. That is
why the same `--out json` argument produced `feedback-check.json` in the run directory (correct)
and `./json` at the repo root (wrong) in the same session.

## Fix — pick one, in val-core, not here

`val/tools` is a symlink into `node_modules/@valiify/val-core/tools`; per this repo's CLAUDE.md
the generated tooling is never hand-edited. The change belongs in the val-core repo, then a
version bump and `npx val-init`.

1. **Make `handoff-check` match `feedback-check`** — add the `opts.out === "json" ? undefined`
   special case. Smallest diff, keeps both documented spellings working.
2. **Make the docs match the code** — change `handoff-check`'s two usage strings to
   `[--out <path>]`, as `class-audit` already does. Honest, but leaves the three tools spelled
   differently for the same flag.
3. **Do both, and unify** — `--out <path>` everywhere in the docs, plus the `json` special case
   everywhere in the code, so the flag behaves identically across all three tools regardless of
   which spelling a caller reaches for.

**(3) is the recommendation.** The failure here was not that someone typed the wrong thing; it
was that three sibling tools, invoked the same way in the same session, did three different
things. Whichever is chosen, the guard worth adding is: refuse an `--out` value with no
extension and no directory separator, since that is almost always a format word being taken as
a filename.

## Also worth considering

`resolveReport`'s docblock is careful about *not* writing into a tree you are only inspecting.
The same care would say: a report path that resolves to a bare filename in the current working
directory is a likely mistake, because the deliberate case names a directory.

## Our side, already fixed

The orchestrator's invocation now omits `--out` entirely. `handoff-check`'s default is
`join(runPath, "handoff-check.json")` — the run directory, which is where the report belongs.
No flag is needed for the normal case.
