# Accessibility Audit Checklist

Use this checklist during manual review. Adapt it to the product type, target WCAG level, and available runtime access.

## Keyboard and Focus

- Navigate all interactive content with `Tab`, `Shift+Tab`, arrow keys, `Enter`, `Space`, and `Esc` where applicable.
- Confirm focus order matches visual and logical order.
- Confirm visible focus is always present and not hidden behind sticky UI or overlays.
- Check custom widgets against expected keyboard patterns.
- Confirm modals, drawers, menus, popovers, and comboboxes manage focus correctly.
- Confirm users can escape temporary UI and are not trapped.
- Confirm focus returns to a sensible element after closing overlays or completing actions.

## Structure and Semantics

- Check one clear page or view title.
- Check a sensible heading outline; avoid skipped headings only when they harm structure.
- Check landmarks such as `main`, `nav`, `header`, `footer`, `aside`, and complementary regions.
- Check lists, tables, buttons, links, tabs, dialogs, alerts, and form controls use native semantics where possible.
- Check ARIA is necessary, valid, and matches actual behavior.
- Check accessible names for icon buttons, controls, links, images, and regions.

## Forms and Errors

- Confirm every input has a programmatically associated label or accessible name.
- Confirm required fields, formats, help text, and constraints are available before submission.
- Trigger validation errors and confirm messages are specific, associated with fields, and announced or discoverable.
- Confirm focus handling after errors is helpful.
- Confirm autocomplete, grouping, and fieldsets are used where relevant.

## Visual Presentation

- Check text and meaningful icon contrast.
- Check focus indicator contrast and area.
- Check non-color cues for state, errors, selection, and charts.
- Test zoom, text spacing, and reflow at narrow/mobile widths.
- Confirm content does not overlap, clip, or become hidden at common viewport sizes.
- Confirm touch targets and spacing are adequate for mobile or pointer-heavy interfaces.

## Non-Text Content and Media

- Check informative images have useful alternatives.
- Check decorative images are ignored by assistive technologies.
- Check charts, diagrams, icons, and SVGs expose equivalent information.
- Check audio/video captions, transcripts, controls, autoplay behavior, and keyboard access.

## Dynamic Content

- Check loading, success, failure, save, and validation status messages.
- Check live regions only when needed and not overly verbose.
- Check route changes, infinite scroll, filters, sorting, pagination, and async updates.
- Check disabled, busy, expanded, selected, current, pressed, and invalid states.

## Content and Language

- Check page language and language changes.
- Check link text and button text are meaningful in context.
- Check instructions do not rely only on shape, color, position, or sensory characteristics.
- Check error prevention for high-impact actions such as legal, financial, account, or data deletion flows.

## Code Review Signals

When reviewing source code without running the UI, look for:

- Click handlers on non-interactive elements.
- `div` or `span` used as controls without keyboard behavior.
- Icon-only buttons without accessible names.
- Inputs without labels.
- Custom selects, dialogs, tabs, menus, and tooltips without robust focus management.
- Positive `tabindex`, excessive `tabindex=0`, or focus suppression.
- `outline: none` without a replacement.
- ARIA roles or states that do not match visible behavior.
- Conditional rendering that may drop focus after updates.
