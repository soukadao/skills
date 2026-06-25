# Frontend QA Report Format

Use concise, evidence-driven reports. Avoid dumping raw logs unless the user asks.

## Summary

Include:

- Target: URL, route, component, PR, or screenshot set.
- Environment: browser, viewport sizes, device emulation, build or branch.
- Paths and states checked.
- Overall result: passed, passed with issues, or blocked.
- Important limitations.

## Severity

- Critical: Blocks a core workflow, prevents access to main content/actions, causes data loss, blank screen, or unrecoverable state.
- High: Breaks an important interaction, severe mobile/desktop layout failure, major content hidden, repeated runtime failure.
- Medium: Noticeable usability, responsive, visual, or state issue with a workaround.
- Low: Polish issue, small alignment inconsistency, minor copy fit issue, or low-risk edge case.

## Finding Template

```markdown
### [Severity] Short issue title

- Location: route, component, selector, or screen area
- Viewport: width x height
- Steps:
  1. ...
  2. ...
- Observed: ...
- Expected: ...
- Evidence: screenshot path, console message, failed request, or notes
- Suggested fix: ...
- Retest: ...
```

## Final Response Shape

When reporting to the user:

1. Start with the highest-impact findings.
2. Include exact reproduction details.
3. Mention checks that passed only when useful.
4. State what could not be tested.
5. If changes were made, include verification commands and remaining risk.

## No-Issue Report

If no issues are found, say what was actually verified:

```markdown
No issues found in the checked scope.

Checked:
- Desktop 1440x900 and mobile 390x844
- Main navigation, form submission, modal open/close, empty state
- Console and failed requests

Not checked:
- Authenticated admin-only route
- Real payment callback state
```
