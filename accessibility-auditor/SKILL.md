---
name: accessibility-auditor
description: Audit websites, web applications, app flows, frontend implementations, design-to-code work, or accessibility review requests using WCAG 2.x and the WCAG Evaluation Methodology (WCAG-EM) 2.0 process. Use when asked to find accessibility issues, review a page or PR for accessibility, prepare an accessibility audit report, choose representative pages or states to test, run automated accessibility checks, evaluate keyboard/focus/semantics/forms/contrast/alternative text, or document findings with severity, evidence, WCAG references, remediation, and verification steps.
---

# Accessibility Auditor

Use this skill to guide accessibility evaluations without overstating what automated checks prove. WCAG-EM 2.0 is a W3C Group Note Draft, so treat it as methodology guidance, not a new conformance standard.

## Core Workflow

1. Define the evaluation scope: product area, URLs or app states, included/excluded content, target WCAG version and level, browsers/devices, assistive technology assumptions, and any constraints.
2. Explore the product: identify common views, essential workflows, templates, dynamic states, content types, technologies, third-party content, and likely risk areas.
3. Select a representative sample: include structured samples, complete processes, and, when useful, a small random sample. For small products, evaluate every relevant page/state.
4. Evaluate the sample set: combine automated checks with manual review. Never treat an automated scan as a complete accessibility audit.
5. Report findings: provide evidence, impact, severity, WCAG mapping when known, reproduction steps, expected behavior, remediation guidance, and verification steps.

For the full WCAG-EM-style workflow, read `references/wcag-em-2-workflow.md`.

## Evaluation Practice

- Prefer real interaction over static inspection when the UI has menus, dialogs, forms, tabs, validation, async loading, drag/drop, media, auth, or multi-step flows.
- Use automated tools to surface likely defects, then manually verify each issue before presenting it as a finding.
- Include keyboard-only testing, focus visibility/order, accessible names, headings, landmarks, forms, status messages, error handling, contrast, text resizing/reflow, and screen-reader-relevant semantics.
- When reviewing code only, identify likely accessibility risks and recommend runtime verification rather than claiming observed user impact.
- When the sample is partial, say that findings apply to the evaluated sample and may not support a whole-product WCAG conformance claim.

For a focused manual checklist, read `references/audit-checklist.md`.

## Optional Script

Use `scripts/axe_scan.mjs` when a live URL or local dev server is available and Node.js can install or resolve Playwright and axe-core:

```bash
node scripts/axe_scan.mjs https://example.com --out /tmp/axe-results.json --markdown /tmp/axe-results.md
```

The script collects axe-core violations as supporting evidence. It does not cover manual requirements such as keyboard interaction quality, meaningful reading order, complete process success, or whether labels and instructions are genuinely usable.

## Reporting

Structure final audit reports around actionable findings, not raw tool output. Put blockers and serious user-impacting issues first. Include "not evaluated" and "residual risk" notes when scope, authentication, time, or tooling prevents complete coverage.

For report templates and severity guidance, read `references/report-format.md`.
