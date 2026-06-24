---
name: test-scenario-design
description: Create clear, reusable test scenario specifications and, when browser capture is needed, generate file-based Playwright code that records a HAR with recordHar. Use when a user describes what they want to test in natural language and needs scenario design before E2E tests, browser automation, HAR capture for k6 conversion, manual QA scripts, acceptance tests, regression tests, or other scenario-based validation.
---

# Test Scenario Design And HAR Code Generation

Use this skill to turn an intent such as "test the checkout flow" or "make a scenario for this task app" into:

1. A concrete scenario specification.
2. When the downstream target is browser capture or k6 conversion, a file-based Playwright spec that records HAR.

Do not convert HAR to k6 here. Hand the HAR spec or recorded HAR to `$browser-to-k6-load-testing`.

## Workflow

1. Identify the purpose:
   - Feature, workflow, bug, risk, or release gate being validated.
   - Primary user role and target environment.
2. Define scope:
   - In-scope screens, actions, data, and expected outcomes.
   - Out-of-scope behavior and destructive actions to avoid.
3. Write the journey:
   - Use concrete user steps in order.
   - Include exact clicks, typed values, selections, navigation, and waits only when they matter.
   - Prefer observable UI text, labels, roles, or business events over implementation details.
4. Add validation:
   - Page-level expectations.
   - Data/state expectations.
   - Error and edge cases when relevant.
5. Add execution notes:
   - Required accounts, credentials, fixtures, cleanup, rate/safety limits, and privacy constraints.
   - Downstream target such as Playwright, k6, manual QA, API test, or CI gate.
6. Generate Playwright HAR code when browser capture is the downstream path:
   - Create a file-based spec, usually `tests/e2e/<journey>.har.spec.ts`.
   - Use `browser.newContext({ recordHar: ... })` with embedded content and full mode.
   - Read base URLs, credentials, tokens, and private test data from environment variables.
   - Close the browser context so the HAR is written.
   - For Basic authentication, use Playwright `httpCredentials`; do not put `user:pass@` in the URL because it can break app-side `fetch` calls.
   - Keep the code focused on reproducing the user journey, not on load generation.

## Output Template

```markdown
## Objective

## Target And Preconditions

## Primary Scenario

## Test Data

## Expected Results

## Negative Or Edge Cases

## Safety And Cleanup

## Downstream Notes

## Playwright HAR Spec
```

## Scenario Quality Rules

- Keep each scenario focused on one user goal.
- Make steps actionable enough that a tester or automation tool can execute them.
- Keep credentials, tokens, private user data, and production-only data out of the scenario text.
- Mark destructive or costly actions explicitly.
- Prefer stable UI anchors such as visible labels, button names, roles, URLs, or business states.
- Include acceptance criteria that can be checked without reading the implementation.
- If information is missing, make conservative assumptions and list them under preconditions or downstream notes.

## Playwright HAR Code Rules

When generating Playwright code for HAR capture:

- Prefer `npx playwright test <spec>` as the execution path.
- Use `tests/e2e/<journey>.har.spec.ts` for the spec and `artifacts/<journey>.har` for the HAR by default.
- Use `recordHar: { path, content: 'embed', mode: 'full' }`.
- Call `await context.close()` before expecting the HAR file to exist.
- Use `httpCredentials` only from environment variables when Basic authentication is needed.
- Keep `BASE_URL` free of embedded credentials such as `https://user:pass@example.com`.
- Do not hardcode usernames, passwords, bearer tokens, cookies, private data, or production-only values.
- Prefer stable locators such as roles, labels, placeholders, visible text, and test IDs.
- Avoid destructive actions unless the user explicitly asks for them and cleanup is defined.
- Include only enough assertions to keep the recording on the intended path.
- Wrap the journey in `try/finally` when possible so `context.close()` still runs after an assertion failure.

Basic pattern:

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const BASIC_USER = process.env.BASIC_USER || '';
const BASIC_PASS = process.env.BASIC_PASS || '';

test('record journey HAR', async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: BASIC_USER && BASIC_PASS
      ? { username: BASIC_USER, password: BASIC_PASS }
      : undefined,
    recordHar: {
      path: 'artifacts/journey.har',
      content: 'embed',
      mode: 'full',
    },
  });

  try {
    const page = await context.newPage();
    await page.goto(BASE_URL);
    await expect(page).toHaveURL(/./);

    // Add scenario steps here.
  } finally {
    await context.close();
  }
});
```

Include the suggested command, but do not run conversion in this skill:

```bash
BASE_URL=https://example.com BASIC_USER=user BASIC_PASS=pass npx playwright test tests/e2e/journey.har.spec.ts
```

If the workspace has no local `@playwright/test` dependency and `npx playwright test` fails to import it, use an explicit npx package invocation:

```bash
BASE_URL=https://example.com BASIC_USER=user BASIC_PASS=pass \
npx --yes -p @playwright/test -c 'NODE_PATH="$(dirname "$(dirname "$(which playwright)")")" playwright test tests/e2e/journey.har.spec.ts'
```

## Load-Test Additions

When the downstream target is a load test, also include:

- Traffic model: smoke, load, stress, spike, or soak.
- User model: virtual users for behavior realism, arrival rate for throughput targets.
- Journey mix if multiple journeys are involved.
- Safety limits for production-like environments.
- Success thresholds or SLOs when known.

Use smoke by default when no load profile is specified.
