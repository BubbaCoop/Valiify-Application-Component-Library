<script>
  // Business flow · STEP 3 OF 10 · PRIMARY CONTACT
  // Built from the approved concept 02-concept/concept.v2.html
  // (sha256 b1cc6bb0a3788d8da2df74c914df56134b3d69b73b33299c546a10f8ac7d59be).
  //
  // Routing, navigation and persistence are the host app's (skill §11): this page never
  // navigates — it emits onback / oncontinue with the payload. The stylesheet and the icon
  // sprite are loaded once by the app shell, never here.
  import StepHeader from "$lib/components/StepHeader.svelte";
  import TitleBlock from "$lib/components/TitleBlock.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import StepButtonRow from "$lib/components/StepButtonRow.svelte";
  import MobileActionBar from "$lib/components/MobileActionBar.svelte";

  /**
   * logoSrc / logoAlt are the host's brand asset — the library's .header-logo is a caller
   * slot and neither the brief nor the concept supplies an asset or its alt text, so nothing
   * is defaulted here (HANDOFF §12).
   * @type {{ logoSrc: string, logoAlt: string,
   *          onback?: (values: Record<string, string>) => void,
   *          oncontinue?: (values: Record<string, string>) => void }}
   */
  let { logoSrc, logoAlt, onback, oncontinue } = $props();

  let values = $state({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    mobile: "",
  });

  // Errors show on blur and on Continue (brief § Validation rules); `touched` is the gate.
  let touched = $state({
    firstName: false,
    lastName: false,
    jobTitle: false,
    email: false,
    mobile: false,
  });

  const blank = (v) => v.trim() === "";
  const digits = (v) => v.replace(/\D/g, "");

  const errors = $derived({
    firstName: blank(values.firstName) ? "Enter the contact's first name." : "",
    lastName: blank(values.lastName) ? "Enter the contact's last name." : "",
    jobTitle: blank(values.jobTitle) ? "Enter the contact's job title." : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ? "" : "Enter a valid email address.",
    mobile: digits(values.mobile).length === 10 ? "" : "Enter a 10-digit mobile number.",
  });

  // The primary is disabled until all five fields are present and valid (§5, §6).
  const isValid = $derived(Object.values(errors).every((message) => message === ""));

  function touch(field) {
    touched[field] = true;
  }

  // Back keeps every entered value and runs no validation (brief § Actions).
  function handleBack() {
    onback?.({ ...values });
  }

  // The save is immediate and synchronous — Continue does not change while it happens and
  // there is no loading display anywhere on this step (answers-1.md Q1).
  function handleContinue() {
    for (const field of Object.keys(touched)) touched[field] = true;
    if (!isValid) return;
    oncontinue?.({ ...values });
  }
</script>

<!--
  Concept-bag provenance. The concept declares one class bag per viewport; this package is one
  artifact, so the bags are merged mobile-first over the methodology's single breakpoint (md, 768).
  Rendering matches the concept at both declared viewports; the spellings that differ are:

  b13 web bag: w-140 mx-auto py-12 flex flex-col gap-10 — built as mx-auto md:w-140 md:py-12 md:gap-10
  b13 mobile bag: p-4 flex flex-col gap-4 — built as py-4 flex flex-col gap-4, with the 16 gutter
      as px-4 on b02 (the canvas). A single element cannot hold a mobile-only x-padding: the
      reset md:px-0 is written nowhere in the methodology and is unsanctioned, and leaving p-4
      on b13 would make the web column 528 of content inside w-140 instead of 560. See HANDOFF §7 D1.
  b05 web bag: flex gap-6 — built as md:flex-row md:gap-6 over the mobile stack (flex flex-col gap-5)
  b06 / b07 web bag: w-67 — built as md:w-67 , the concept's own mobile-main spelling of the same 268
  b01: sticky top-0 z-40 are the library's own .header rules (§1.1 "by library contract"), not utilities
  focus-ring is not written in markup: the library applies it inside each component's CSS on
      :focus-visible (§10 keyboard focus; concept § Unsure says the build may not need the class)
-->

<StepHeader {logoSrc} {logoAlt} />

<!-- b02 is the page root element: the full-bleed canvas that paints the warm ground either
     side of the column (§9.2 never pure white). It carries no height class — see HANDOFF §12. -->
<div class="bg-surface-app-page px-4" data-block="b02">
  <div class="py-4 flex flex-col gap-4 mx-auto md:w-140 md:py-12 md:gap-10" data-block="b13">
    <TitleBlock
      step="Step 3 of 10"
      section="Primary contact"
      title="Who should we contact?"
      description="We'll use these details for anything we need to ask you about this application."
    />

    <div class="flex flex-col gap-5" data-block="b04">
      <div class="flex flex-col gap-5 md:flex-row md:gap-6" data-block="b05">
        <TextField
          data-block="b06"
          id="first-name"
          label="First name"
          placeholder="Jane"
          widthClass="md:w-67"
          bind:value={values.firstName}
          error={errors.firstName}
          touched={touched.firstName}
          onblur={() => touch("firstName")}
        />
        <TextField
          data-block="b07"
          id="last-name"
          label="Last name"
          placeholder="Doe"
          widthClass="md:w-67"
          bind:value={values.lastName}
          error={errors.lastName}
          touched={touched.lastName}
          onblur={() => touch("lastName")}
        />
      </div>

      <TextField
        data-block="b08"
        id="job-title"
        label="Job title"
        placeholder="Chief Financial Officer"
        bind:value={values.jobTitle}
        error={errors.jobTitle}
        touched={touched.jobTitle}
        onblur={() => touch("jobTitle")}
      />

      <TextField
        data-block="b09"
        id="email-address"
        label="Email address"
        type="email"
        placeholder="jane@company.com"
        bind:value={values.email}
        error={errors.email}
        touched={touched.email}
        onblur={() => touch("email")}
      />

      <TextField
        data-block="b10"
        id="mobile-phone"
        label="Mobile phone"
        type="tel"
        placeholder="(555) 555-5555"
        bind:value={values.mobile}
        error={errors.mobile}
        touched={touched.mobile}
        onblur={() => touch("mobile")}
      />
    </div>

    <StepButtonRow continueEnabled={isValid} onback={handleBack} oncontinue={handleContinue} />
  </div>
</div>

<MobileActionBar continueEnabled={isValid} onback={handleBack} oncontinue={handleContinue} />
