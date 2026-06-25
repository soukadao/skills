# Frontend QA Checklist

Use this checklist when validating a frontend screen, route, component, or PR. Select the parts relevant to the target; do not turn every review into an exhaustive audit unless the user asks for it.

## Setup

- Confirm the tested URL, route, branch, build, or artifact.
- Record browser, viewport, and device emulation.
- Check the console for errors before and after interactions.
- Watch failed network requests, broken images, missing fonts, and source-map noise that hides real errors.
- Use realistic data when possible: long names, empty values, many items, missing media, and localized strings.

## Layout and Responsiveness

- Check desktop, mobile, and any project-specific breakpoints.
- Resize through breakpoints and watch for jumps, overlap, clipped content, and unusable controls.
- Confirm no unintended horizontal scroll.
- Confirm sticky headers, footers, sidebars, and overlays do not hide content or actions.
- Confirm panels, tables, cards, grids, and toolbars keep stable dimensions where needed.
- Confirm dialogs, drawers, popovers, dropdowns, and toasts fit within small viewports.

## Text and Visual Polish

- Check all visible text fits inside its container.
- Check long words, long labels, numbers, file names, email addresses, and URLs.
- Check buttons do not wrap awkwardly or resize unpredictably.
- Check headings are proportional to their containers.
- Check spacing rhythm, alignment, icon sizing, image cropping, and visual hierarchy.
- Check loading skeletons, empty states, and error states do not shift layout excessively.

## Interaction States

- Hover and focus interactive controls.
- Activate primary and secondary actions.
- Open and close menus, tooltips, dialogs, drawers, date pickers, selects, tabs, accordions, and comboboxes.
- Check active, selected, disabled, read-only, pressed, expanded, current, loading, success, warning, and error states.
- Submit forms with valid, invalid, empty, and edge-case input.
- Confirm keyboard basics: tab order is sensible, focus is visible, Enter/Space activate controls, Escape closes temporary UI.

## Navigation and Workflow

- Follow important links and buttons.
- Use browser back/forward when the UI changes routes or query parameters.
- Refresh deep links and states that should be addressable.
- Confirm auth gates, permission states, and not-found states if relevant.
- Complete the main user workflow end to end.

## Data and Content States

- Empty list or no search results.
- One item, many items, and pagination/infinite scroll.
- Long item names, translated strings, and dense numeric values.
- Missing avatars/images, slow image loading, and failed media.
- Partial API failures, retry states, and stale data indicators.
- Sorting, filtering, searching, and clearing filters.

## Canvas, Charts, Maps, and 3D

- Confirm the rendered area is nonblank.
- Confirm the scene or chart is framed and legible at desktop and mobile sizes.
- Confirm interactions such as drag, zoom, hover, select, tooltip, and reset.
- Check fallback or loading state when assets fail.
- For canvas-heavy views, use screenshots or pixel checks to confirm content rendered.

## Code Review Signals

When only code is available, look for likely QA risks:

- Hard-coded widths/heights without responsive constraints.
- `overflow: hidden` used to mask layout problems.
- Missing empty/error/loading branches.
- Unbounded text in buttons, cards, table cells, or badges.
- Components that assume images, arrays, or API values always exist.
- State updates that can leave modals, menus, or spinners stuck.
- CSS that removes focus outlines without replacement.
