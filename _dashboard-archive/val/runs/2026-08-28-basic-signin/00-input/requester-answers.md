# Requester answers to Gate 3 open questions (2026-08-28)

The acceptance target for this run is a pixel-faithful reproduction of the
attached design. Where the writeup and the design disagree, the design as
drawn wins:

1. Email typography — render as the design shows (Inter, sans). My
   "account data" phrasing described the value's meaning, not a typography
   requirement. Do not apply JetBrains Mono here.
2. Input chrome — reproduce the chrome-less fields exactly as drawn
   (bare label + text, no .input-field box).
3. Checkbox — reproduce the native 16x16 checkbox as drawn; do not
   substitute the library Checkbox.
4. Alerts — native alert() with the copy visible in the writeup
   ("Sign in clicked" / "Cancel clicked" / demo info).
5. Card surface — reproduce the rendered card (white, 1px hairline,
   ~6px radius, no shadow) as drawn.
