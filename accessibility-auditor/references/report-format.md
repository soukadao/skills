# Report Format

Use this format for concise accessibility reports. Keep raw tool output separate unless the user asks for it.

## Summary

Include:

- Product, URL, route, PR, or flow evaluated.
- Date and environment.
- Target WCAG version and level, if known.
- Sample set or files reviewed.
- Tools used.
- Important limitations.
- Overall risk statement for the evaluated sample.

Do not claim full-product WCAG conformance unless the scope and evidence actually support it.

## Severity

Use severity based on user impact and reach:

- Critical: Blocks completion of essential tasks, prevents keyboard or assistive technology access to core flows, causes data loss, or creates severe safety/legal/financial risk.
- Serious: Significantly impairs use for many users or affects important workflows, but a limited workaround may exist.
- Moderate: Creates friction, confusion, inefficiency, or localized barriers.
- Minor: Low-impact defect, polish issue, or issue with limited reach.

If severity is uncertain, state the assumption and evidence needed to confirm.

## Finding Template

```markdown
### [Severity] Short finding title

- Location: URL, route, component, file, selector, or screen state
- Evidence: observed behavior and relevant snippet/screenshot/tool result
- Impact: who is affected and how
- WCAG: success criterion if reasonably known, or "Needs mapping"
- Steps to reproduce:
  1. ...
  2. ...
- Expected behavior: ...
- Recommended fix: ...
- Verification: how to confirm the fix
```

## Report Sections

Recommended order:

1. Executive summary
2. Scope and sample set
3. Environment and tools
4. Findings by severity
5. Manual checks completed
6. Automated scan summary
7. Not evaluated / limitations
8. Suggested retest plan

## Automated Scan Notes

When using axe or another automated tool:

- Report verified issues as findings.
- Put unverified tool output in an appendix or "needs verification" section.
- Explain that automated tools do not cover all WCAG requirements.
- Avoid counting issues by node count alone; one root cause may produce many nodes.
