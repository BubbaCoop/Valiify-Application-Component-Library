<!--
  Case 2 — a SCOPED element selector. THE CASE THE BUNDLE CANNOT DEFEND AGAINST.
  Svelte scopes `button { }` to `button.svelte-<hash>` — specificity 0,1,1, which
  outranks our single-class rule (0,1,0) whether or not the bundle is layered.
  check-scoped-styles.mjs asserts that our border is LOST here on purpose: this
  pins the contract's second clause (a host rule at higher specificity wins) to a
  measurement, so the HANDOFF text cannot drift from what is true.
-->
<div class="row">
  <button id="scoped-trigger" class="va-dropdown-field-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
    <span class="va-dropdown-field-value va-dropdown-field-value-placeholder">scoped element reset — wins over us</span>
  </button>
</div>

<style>
  button {
    border: 0;
  }
  .row {
    margin-bottom: 24px;
  }
</style>
