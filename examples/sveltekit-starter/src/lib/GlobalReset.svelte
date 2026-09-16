<!--
  Case 1 — a :global element reset from a Svelte component.
  Compiles to a bare, UNLAYERED `button { border: 0 }` (0,0,1). This is the shape
  of a house reset written inside a component, and it is the case the unlayered
  bundle defends against: our class (0,1,0) beats it on specificity.
-->
<div class="row">
  <button id="global-reset-trigger" class="va-dropdown-field-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
    <span class="va-dropdown-field-value va-dropdown-field-value-placeholder">:global(button) reset in scope</span>
  </button>
</div>

<style>
  :global(button) {
    border: 0;
  }
  .row {
    margin-bottom: 24px;
  }
</style>
