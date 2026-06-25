---
name: frontend-qa-checker
description: Check frontend implementations, websites, web apps, component screens, or PRs for visual quality and functional UI regressions across desktop and mobile viewports. Use when asked to QA a frontend, inspect screenshots, verify responsive behavior, find layout overlap, text overflow, broken spacing, blank canvases, interaction/state bugs, loading/error/empty states, navigation issues, or run Playwright/browser-based visual checks before delivery.
---

# Frontend QA Checker

Use this skill to verify that a frontend is usable, polished, and stable across realistic viewports and states. Prefer direct browser inspection and screenshots when a runnable app or URL is available.

## Workflow

1. Identify the target: URL, local dev server, route, component, PR, or screenshots.
2. Determine key viewports: at minimum desktop and mobile. Add tablet, narrow desktop, high-DPI, or app-specific breakpoints when relevant.
3. Exercise core paths: load, navigate, interact, submit, open menus/modals, resize, trigger validation, and inspect loading/empty/error states.
4. Capture evidence: screenshots, console errors, network failures, selectors, reproduction steps, and affected viewport sizes.
5. Report findings: prioritize user-visible issues and regressions, then include lower-risk polish items.

For a focused checklist, read `references/qa-checklist.md`.

## What To Verify

- Layout: no unintended overlap, clipping, horizontal scroll, unstable heights, broken grids, or content hidden behind sticky UI.
- Typography: text fits containers, long words wrap sensibly, buttons and cards remain readable, line lengths are appropriate.
- Responsiveness: breakpoint transitions preserve hierarchy and controls remain reachable.
- Interaction: hover, focus, active, disabled, selected, expanded, loading, empty, and error states behave consistently.
- Navigation: links, tabs, menus, drawers, modals, back/close actions, and route changes work as expected.
- Data states: realistic long labels, missing images, zero results, many results, validation errors, and slow loading do not break the UI.
- Media/canvas/3D: images load, videos render, canvas is nonblank, and interactive scenes are framed correctly.
- Runtime health: console errors, hydration errors, failed assets, and failed API calls are investigated.

## Browser Verification

When a live target is available, use the in-app browser, Chrome, or Playwright rather than relying only on code inspection. Check at least:

- Desktop: 1440x900 or similar.
- Mobile: 390x844 or similar.
- Any known app breakpoints or dense screens.

Use `scripts/capture_viewports.mjs` when Node.js, Playwright, and a reachable URL are available:

```bash
node scripts/capture_viewports.mjs http://localhost:3000 --out /tmp/frontend-qa
```

The script captures screenshots, console messages, failed requests, and basic page metrics for multiple viewports. It is a helper, not a substitute for interactive inspection.

## Reporting

Lead with findings that block or degrade real workflows. Include exact viewport, route, steps to reproduce, expected behavior, observed behavior, and suggested fix. If no issues are found, say what was checked and what remains untested.

For report structure and severity guidance, read `references/report-format.md`.
