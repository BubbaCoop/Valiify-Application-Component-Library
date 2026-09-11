<script>
  // b12 — mobile sticky action bar. §11 "Mobile footer (interim, until the §12 component
  // lands)" recipe, verbatim:
  //   h-19 py-3.5 px-4 flex gap-5 bg-surface-paper border-t border-stroke-divider sticky bottom-0 z-40
  // PLANNED (§12 "Mobile sticky action bar") — swap this composition for the shipped
  // component when the library ships it; see contract.planned and HANDOFF §7/§8.
  //
  // md:hidden is the build's viewport switch (§1.2: the bar applies below md; above md the
  // in-flow StepButtonRow (b11) carries the same two actions). Same two states as b11.
  /** @type {{ continueEnabled?: boolean, onback?: () => void, oncontinue?: () => void }} */
  let { continueEnabled = false, onback, oncontinue } = $props();
</script>

<div
  class="h-19 py-3.5 px-4 flex gap-5 bg-surface-paper border-t border-stroke-divider sticky bottom-0 z-40 md:hidden"
  data-block="b12"
>
  <button class="btn btn-secondary" type="button" onclick={onback}>
    <svg aria-hidden="true"><use href="#arrow-left" /></svg>
    Back
  </button>
  <button class="btn btn-primary flex-1" type="button" disabled={!continueEnabled} onclick={oncontinue}>
    Continue
    <svg aria-hidden="true"><use href="#arrow-right" /></svg>
  </button>
</div>
