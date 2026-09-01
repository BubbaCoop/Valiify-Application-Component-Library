# Component Implementation Roadmap

**Status**: In progress — 13 components built, roughly 20 remain.

The phased plan for the component library. Tokens are extracted and the Figma
designs exist; what is left is implementation.

**How to build one: [component-process.md](component-process.md).**

## Implementation Status

### Phase 1: Proof of Concept ✅ COMPLETE

- [x] Button (all variants)
- [x] Input
- [x] Textarea (own component, not an Input variant)
- [~] Card — scaffolded, but placeholder only. Never extracted from Figma;
      see the note in `src/components/card.css`.

### Phase 2: Foundation Components — mostly done

- [ ] Checkbox
- [x] Radio (`RadioSelect`)
- [x] Switch
- [x] Badge / Status Chip (`Chip` — chip, badge and dot, SM/MD)
- [x] Avatar
- [x] Icon Button
- [x] Icon (not originally listed — the sizing primitive)

### Phase 3: Data Display — partially done

- [ ] Cell (table primitive)
- [ ] Data Row
- [ ] Content Row
- [x] Pill (filter toggle / dropdown trigger)
- [x] Tag (label with avatar / count / status-dot slots)
- [x] Dropdown / Menu (`DropdownField`, `DropdownMenu`, `MenuItem`)
- [ ] Modal

### Phase 4: Navigation — designs exist, not built

Figma has Nav Rail (`728:20677`), Nav Items (`723:18649`),
Breadcrumbs (`880:31218`) and Pagination (`880:31248`) already drawn.

- [x] Tabs (underline, chip, segment) + SegmentSelector container
- [ ] Nav Rail
- [ ] Breadcrumb
- [ ] Pagination

### Phase 5: Review-Specific Components — designs exist, not built

Figma has Field Verification (`142:350`), Section Marker (`141:1071`),
Data Row (`165:678`), Content Row (`168:845`) and Summary Preview
(`548:22173`) already drawn.

- [ ] Field Verification
- [ ] Section Marker
- [ ] Secure (PII mask)
- [ ] Rule / Override Row
- [ ] Event (timeline)
- [ ] Document (multi-signer)
- [ ] Summary Preview

**Built so far**: 18 components — Avatar, Button, Card (placeholder), Chip,
DropdownField, DropdownMenu, Icon, IconButton, Input, MenuItem, Pill, RadioSelect,
Pill, SegmentSelector, Switch, Tabs, Tag, Textarea, Tooltip. Roughly 15 remain.

> Keep this list current when you build something. It drifted badly once —
> Switch, Icon Button, Avatar and the Dropdown pair all shipped while still
> shown as unbuilt here.

## Per-Component Workflow

See **[component-process.md](component-process.md)** — the process of record.

This section used to describe a different eight-step sequence that contradicted
it (hand-created files instead of the scaffolder, raw `var(--color-*)` instead
of the generated utilities, bare `:hover`, manual devtools measurement instead
of `verify:visual`, and a Code Connect step that has never been done). It was
removed rather than maintained in parallel.

## Component Priority Matrix

### High Priority (Week 1-2)

Components needed for basic dashboard functionality:

- Button ✅
- Input ✅
- Card ✅
- Checkbox
- Badge
- Tabs
- Dropdown

### Medium Priority (Week 3-4)

Components for data-heavy interfaces:

- Cell / Data Row
- Content Row
- Avatar
- Tag and Pill are both built; see "Tag vs Pill" in CLAUDE.md for which to use
- Modal
- Nav Rail

### Low Priority (Week 5+)

Review-specific components (may not be needed for all dashboards):

- Field Verification
- Section Marker
- Secure
- Rule / Override Row
- Event
- Document

## Quality Gates

Before marking a component "complete":

### Visual Fidelity

- [ ] Matches Figma design pixel-perfect
- [ ] All variants implemented
- [ ] All states functional
- [ ] Theme tokens used consistently

### Accessibility

- [ ] WCAG AA color contrast (4.5:1 text, 3:1 UI)
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Screen reader compatible
- [ ] ARIA labels where needed

### Documentation

- [ ] Storybook story with all variants
- [ ] Usage examples in stories
- [ ] TypeScript definitions
- [ ] CLAUDE.md entry
- [ ] Code Connect mapping

### Testing

- [ ] Works in Chrome, Firefox, Safari
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors/warnings
- [ ] Build passes without errors

## Estimation

**Per component**:

- Simple (Button, Badge): 1-2 hours
- Medium (Card, Dropdown): 2-3 hours
- Complex (Data Row, Rule): 3-4 hours

**Total for 20 components**: ~40-50 hours

**With Figma extraction and testing**: ~60-70 hours total

## Dependencies

Some components depend on others being completed first:

- **Cell** → required by Data Row, Content Row
- **Badge** → required by Status Chip
- **Icon Button** → required by many components
- **Dropdown** → required by Select, Nav Rail

Build in dependency order to avoid rework.

## Resources

- **Figma**: Commercial-Designs (FdcEV83HPv44bzLPAQU1hR)
- **Design Tokens**: `docs/figma-extraction.md`
