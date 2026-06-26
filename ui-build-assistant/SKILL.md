---
name: ui-build-assistant
description: Capture UI Build Assistant-style layout inspection screenshots with Playwright. Use when a user wants to inspect rendered page layout, DOM nesting, spacing, or element boundaries without installing a browser extension.
---

# UI Build Assistant

Use this skill when you need a quick visual layout inspection screenshot of a rendered page. It reproduces the useful part of the UI Build Assistant extension by injecting temporary CSS through Playwright, then capturing the visible page.

This is not a browser extension workflow. Prefer Playwright so the target can be captured repeatably from a URL, local dev server, or `file://` page.

## Workflow

1. Start or identify the target page URL.
2. Run the Playwright capture script.
3. Inspect the normal and assisted screenshots for layout boundaries, nesting depth, spacing, overflow, and unexpected hidden structure.
4. Use the screenshots as evidence while making frontend fixes.

## Capture

Run:

```bash
node ui-build-assistant/scripts/capture_ui_build_assistant.mjs <url> --out /tmp/ui-build-assistant
```

To avoid adding Playwright to the project, run it through `npx` and use local Chrome:

```bash
npx -y -p playwright node ui-build-assistant/scripts/capture_ui_build_assistant.mjs <url> --out /tmp/ui-build-assistant --channel chrome
```

If Playwright is not available, use the Chrome DevTools Protocol version instead:

```bash
node ui-build-assistant/scripts/capture_ui_build_assistant_cdp.mjs <url> --out /tmp/ui-build-assistant
```

Common options:

```bash
node ui-build-assistant/scripts/capture_ui_build_assistant.mjs http://localhost:3000 \
  --out /tmp/ui-build-assistant \
  --viewport desktop:1440x900 \
  --viewport mobile:390x844
```

Options:

- `--out <dir>`: output directory. Defaults to `ui-build-assistant-artifacts`.
- `--viewport <name:WIDTHxHEIGHT>`: capture one or more viewports.
- `--wait <ms>`: extra wait after page load. Defaults to `1000`.
- `--full-page`: capture the whole scrollable page instead of only the visible viewport.
- `--assisted-only`: skip the normal screenshot and capture only the assisted view.
- `--channel chrome`: use locally installed Chrome instead of Playwright's bundled browser.

The script writes:

- `<viewport>.png`: normal screenshot, unless `--assisted-only` is used.
- `<viewport>-assisted.png`: screenshot with UI Build Assistant CSS injected.
- `report.json`: metadata, console warnings/errors, failed requests, and screenshot paths.
- `report.md`: compact human-readable report.

## Notes

- The Playwright script requires Playwright in the current project or runtime: `npm install -D playwright`.
- The CDP script requires a local Chrome/Chromium executable and no npm package. Set `CHROME_PATH` if Chrome is not in a standard location.
- The CSS is injected into the page only for the Playwright session. It does not modify source files or browser settings.
- If the page depends on authenticated browser state, use a Playwright storage state or inspect through the in-app browser/Chrome tools instead.

references: https://github.com/lightsound/ui-build-assistant
