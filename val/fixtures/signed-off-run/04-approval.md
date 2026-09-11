# Approval — primary-contact

| field | value |
| --- | --- |
| concept | `02-concept/concept.v2.html` |
| sha256 | `b1cc6bb0a3788d8da2df74c914df56134b3d69b73b33299c546a10f8ac7d59be` |
| approved at | 2026-09-11T16:02:03Z |
| approved by | the reviewer, by invoking `/design build val/runs/2026-09-11-design-primary-contact` |

The concept is sealed at the hash above. If `concept.v2.html` changes in any way
after this point, the hash no longer matches, this approval is void, and the
reviewer must re-approve.

## Invoking message, verbatim

> Approved as v2. Name row stands (frame 172:10673 composes First/Last two-up).
> Footer offset is a methodology gap in §1.2, to be fixed in short-app.md
> separately — leave it recorded. Carry F11's label fix into the build; no
> rework. Running /design build val/runs/2026-09-11-design-primary-contact.

## Reviewer decisions carried into the build

Three decisions were made in the approving message. None of them edits the
sealed concept — doing so would void the hash. They are recorded here and passed
to the builder as instructions.

1. **Two-up name row — RESOLVED, stands as drawn.** The reviewer confirms frame
   172:10673 composes First name / Last name two-up. This closes critique F7 and
   the "one reversible block" item in concept.md § Unsure. The b05 wrapper and
   the `w-67` / `md:w-67` widths on b06 / b07 are correct and are to be built as
   drawn. The Unsure text in the sealed concept still reads as open because the
   concept cannot be edited post-seal; this file is the resolution of record.

2. **Mobile content offset under the sticky footer — NOT a build task.** The
   reviewer classifies the missing offset as a gap in the methodology itself
   (§1.2 specifies the 76px footer but no bottom offset), to be fixed in
   `design-methodology/short-app.md` separately. It stays recorded and
   unresolved in this run. The builder must NOT invent a padding. This carries
   into the writeup's divergence ledger as `methodology-gap`.

3. **Critique F11 — label fix carried into the build, no rework.** Critique 2's
   single advisory: b02's element identity is half-named. §11 gives the canvas
   no height, so a content-height section can leave the viewport below it
   unpainted, and §11's "`.header` as a direct child of the scroll container"
   clause is unresolved with the header drawn as b02's sibling. The builder is
   to name the canvas element as the page root in the package's mapping and
   HANDOFF. **Explicitly not a height class** — this is a naming/labelling fix,
   not new geometry, and it must not change what renders.
