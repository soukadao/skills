---
name: browser-to-k6-load-testing
description: Convert an existing HAR artifact, or a file-based Playwright HAR recording spec, into a maintainable k6 script with npx har-to-k6, correlation, checks, groups, labels, and environment-based secrets. Use when the scenario and Playwright HAR code already exist or a HAR has already been captured. If the user only has a natural-language scenario, use test-scenario-design first. If the k6 script already exists and needs execution, use k6-load-testing.
---

# HAR To k6 Script Conversion

Use this skill to create a k6 script from an existing HAR source. Do not design the user scenario or generate Playwright scenario code here; use `$test-scenario-design` for that. Do not run load tests here; use `$k6-load-testing` after the script is created.

```text
Receive HAR artifact or Playwright HAR spec
-> Record HAR with npx playwright test when only the spec is provided
-> Generate a draft k6 script with npx har-to-k6
-> Fix correlation, grouping, labels, and errors
-> Hand off to k6-load-testing for execution
```

## Workflow

1. Confirm the input:
   - Use an existing HAR file, or an existing Playwright spec that records HAR.
   - If the user only has a rough scenario or needs Playwright code generated, use `$test-scenario-design` first and return to this skill with its output.
2. Generate HAR when needed:
   - Run the existing Playwright HAR spec with `npx playwright test`.
   - Do not author new scenario steps in this skill except minor mechanical fixes for paths, environment variable names, or HAR output.
   - Use environment variables for credentials, tokens, base URLs, and private test data.
   - If `@playwright/test` is not installed locally, use the npx package invocation in `references/playwright-har.md` instead of changing the scenario.
   - Use `references/playwright-har.md`.
3. Inspect the HAR:
   - Check that it contains the intended user journey and no unrelated browsing.
   - Include enough response data to identify IDs, tokens, cookies, cursors, CSRF values, and business success signals.
   - Redact or replace secrets before sharing raw HAR contents with external tools.
4. Convert the capture:
   - Bootstrap with `npx --yes har-to-k6`.
   - Keep first-party API/backend requests that represent the journey.
   - Remove static assets, analytics, third-party calls, HMR, maps, captcha, and browser-only noise unless explicitly in scope.
   - Treat the har-to-k6 output as a raw draft; scan it for secrets before keeping, sharing, or committing it.
   - Use `references/capture-to-k6.md`.
5. Fix the generated k6 script:
   - Request-to-request parameter passing.
   - Correlation for dynamic IDs, CSRF, cookies, auth tokens, pagination cursors, timestamps, nonces, and ETags.
   - Grouping and stable labels.
   - Secret/session handling.
   - Test data variation.
   - Error handling for failed or unexpected responses.
   - Intentional pacing.
6. Hand off:
   - Provide the generated k6 script path and required environment variables.
   - Recommend `$k6-load-testing` for smoke execution, load profiles, threshold analysis, and result summary.

## Safety Rules

- Prefer dedicated test accounts, test tenants, and cleanup paths.
- Do not commit raw network artifacts containing secrets, cookies, PII, or private URLs.
- Do not hardcode tokens or credentials in k6 scripts.
- Do not keep har-to-k6 raw drafts that contain encoded Basic auth, bearer tokens, session cookies, or private data unless they are clearly marked as local-only artifacts.
- Treat missing correlation values as failures, not as optional warnings.
- Do not install browsers, k6, or dependencies unless the user asks.

## Command Pattern

Example HAR-to-k6 command sequence:

```bash
BASE_URL=http://localhost:3000 npx playwright test tests/e2e/checkout.har.spec.ts
npx --yes har-to-k6 artifacts/checkout.har -o tests/perf/generated.checkout.js
```

If a HAR file already exists, skip Playwright and run only the conversion command. If `npx playwright test` cannot record HAR in the environment, stop and report the tool limitation. Do not switch to another capture method unless the user explicitly asks.

## Final Output

When finishing, report:

- Source HAR artifact or Playwright HAR spec used.
- What was included/excluded from the capture.
- Correlation and error-handling fixes made.
- Generated k6 script path and required environment variables.
- Any tool limitation, such as missing Playwright browser/runtime, failed HAR recording, or unavailable response bodies.
- Recommended `$k6-load-testing` command/profile to run next.
