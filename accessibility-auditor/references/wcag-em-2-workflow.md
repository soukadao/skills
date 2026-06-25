# WCAG-EM 2.0 Workflow

Use this reference when planning or conducting a broader accessibility audit, selecting a representative sample, or writing an audit report.

Primary source: W3C Accessibility Guidelines Evaluation Methodology (WCAG-EM) 2.0, latest published version: https://www.w3.org/TR/wcag-em-2/

WCAG-EM 2.0 is a W3C Group Note Draft. It provides a methodology for evaluating digital products against WCAG 2, but it does not add WCAG requirements and does not replace WCAG success criteria or conformance rules.

## Step 1: Define Evaluation Scope

Capture:

- Target product or product area.
- URLs, routes, app states, documents, native/hybrid app screens, or other views included in scope.
- Explicit exclusions, with reasons.
- Third-party content or services included in the user experience.
- Target WCAG version and level, usually WCAG 2.2 Level AA unless the user specifies otherwise.
- Supported browsers, devices, viewport sizes, platforms, assistive technologies, and language versions.
- Evaluation purpose: self-assessment, development review, third-party assessment, procurement, redesign planning, release gate, or monitoring.
- Constraints: authentication access, test accounts, environment stability, time limit, unavailable devices, or incomplete designs.

Avoid ambiguous scope. Prefer exact URLs, route patterns, or named flows. If the target is a complete product, include common views and shared components because they affect many pages.

## Step 2: Explore the Product

Identify:

- Common views: home, listing, detail, search, navigation, account, help, legal, settings, empty states, error pages.
- Essential functionality: sign in, search, purchase, booking, form submission, upload, messaging, checkout, account changes, payment, cancellation.
- Templates and repeated components: headers, footers, cards, modals, tables, filters, sidebars, drawers, toasts.
- Sample types: static pages, interactive screens, forms, media, documents, responsive layouts, authenticated states, localization.
- Technologies relied upon: HTML, CSS, JavaScript framework, WAI-ARIA, PDF, canvas, SVG, video, third-party widgets.
- High-risk areas: custom controls, keyboard traps, visual-only state, dynamic validation, drag/drop, focus management, non-text content, charts, disabled states.

When implementation is local, run the app and inspect it directly. When only code is available, treat conclusions as risk findings until runtime verification is possible.

## Step 3: Select a Representative Sample

Build a sample that includes:

- Structured samples from major sections, templates, common views, and content types.
- Complete processes from start to finish, including confirmation and error states.
- Complex or high-risk interactions.
- Mobile/responsive states when relevant.
- A small random sample for larger sites, if page discovery is available.

For small products, evaluate all pages or states instead of sampling. For re-runs, keep some previously evaluated samples for comparison and replace some samples to improve coverage.

Document why each sample was selected. If important samples cannot be tested, record the limitation.

## Step 4: Evaluate the Selected Sample

For each sample:

- Run automated checks if a live target is available.
- Manually verify any automated result before promoting it to a finding.
- Test keyboard-only operation from entry to completion.
- Check focus order, visible focus, focus trapping and return behavior, skip links, and bypass mechanisms.
- Inspect accessible names, roles, states, descriptions, headings, landmarks, lists, tables, form labels, error messages, and status updates.
- Check color contrast, non-color cues, text resizing, reflow, zoom, orientation, target size, and pointer/keyboard alternatives.
- Validate complete processes, including validation errors, cancellation, review, submission, and confirmation states.
- Consider non-interference: content must not block access through keyboard traps, flashing, unexpected context changes, or inaccessible overlays.

Do not mark a full product conformant based only on a sample. Report evaluated-sample results and explain residual risk.

## Step 5: Report Findings

Include:

- Scope and target conformance level.
- Evaluation date, environment, tools, browser/device/assistive technology assumptions.
- Sample set and selection rationale.
- Findings grouped by severity and user impact.
- Evidence and reproduction steps.
- WCAG success criteria mapping where reasonably known.
- Recommended remediation and verification steps.
- Limitations, incomplete areas, and items requiring human or assistive technology validation.

Use `report-format.md` for the report structure.
