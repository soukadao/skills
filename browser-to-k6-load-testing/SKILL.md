---
name: browser-to-k6-load-testing
description: End-to-end workflow for designing load-test scenarios, driving a browser with chrome-devtools CLI, capturing DevTools network requests, converting browser captures into maintainable k6 scripts, fixing request correlation and error handling, running k6 safely, and summarizing performance results. Use when a user wants to create k6 load tests from real browser user journeys, record Chrome DevTools network requests, translate captured traffic to k6, group and label requests, handle dynamic parameters, or add CI performance gates.
---

# Browser To k6 Load Testing

Use this skill for the full browser-to-k6 workflow:

```text
Design scenario
-> Run browser journey with chrome-devtools CLI
-> Capture network requests
-> Convert capture to k6
-> Fix correlation, grouping, labels, and errors
-> Run and summarize k6
```

## Workflow

1. Design the scenario:
   - Objective, target environment, user role, journey steps, traffic model, test data, acceptance criteria, and safety limits.
   - Use `references/scenario-design.md`.
2. Create or run the browser journey:
   - Use `chrome-devtools` CLI for browser operation, snapshots, clicks, typing, and network capture.
   - Use `references/devtools-capture.md`.
3. Capture network requests:
   - Prefer `chrome-devtools list_network_requests` and `chrome-devtools get_network_request` when available.
   - Include enough response data to identify IDs, tokens, cookies, cursors, CSRF values, and business success signals.
4. Convert the capture:
   - Keep first-party API/backend requests that represent the journey.
   - Remove static assets, analytics, third-party calls, HMR, maps, captcha, and browser-only noise unless explicitly in scope.
   - Use `references/capture-to-k6.md`.
5. Fix the generated k6 script:
   - Request-to-request parameter passing.
   - Correlation for dynamic IDs, CSRF, cookies, auth tokens, pagination cursors, timestamps, nonces, and ETags.
   - Grouping and stable labels.
   - Secret/session handling.
   - Test data variation.
   - Error handling for failed or unexpected responses.
   - Intentional pacing.
6. Run k6 safely:
   - Start with smoke.
   - Increase load only after checks and thresholds pass.
   - Use explicit target and load limits in commands.
   - Use `references/k6-execution.md`.
7. Summarize:
   - Profile, target, load, pass/fail, threshold failures, p95/p99 latency, error rate, throughput, artifacts, and next action.

## Safety Rules

- Do not point meaningful load at production unless the user explicitly confirms the target and limits.
- Prefer dedicated test accounts, test tenants, and cleanup paths.
- Do not commit raw network artifacts containing secrets, cookies, PII, or private URLs.
- Do not hardcode tokens or credentials in k6 scripts.
- Treat missing correlation values as failures, not as optional warnings.
- Do not install browsers, k6, or dependencies unless the user asks.

## Command Pattern

Example capture-to-k6 command sequence:

```bash
chrome-devtools new_page 'http://localhost:3000/checkout'
chrome-devtools list_network_requests --output-format json
BASE_URL=http://localhost:3000 K6_PROFILE=smoke k6 run tests/perf/checkout.js
```

For an already-open page:

```bash
chrome-devtools navigate_page 'http://localhost:3000/checkout'
chrome-devtools take_snapshot
BASE_URL=http://localhost:3000 K6_PROFILE=smoke k6 run tests/perf/checkout.js
```

## Final Output

When finishing, report:

- Scenario covered and source capture artifact.
- What was included/excluded from the capture.
- Correlation and error-handling fixes made.
- k6 command run and profile used.
- Any tool limitation, such as missing `k6` or unavailable response bodies.
- Result summary and any remaining risk.
