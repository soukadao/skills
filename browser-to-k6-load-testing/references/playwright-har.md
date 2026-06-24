# Playwright HAR Spec Execution

Use this reference when a file-based Playwright spec already exists and needs to be run to produce a HAR for k6 conversion. Scenario design and Playwright code generation belong in `$test-scenario-design`.

## Flow

1. Confirm the spec path and expected HAR output path.
2. Run the existing spec with `npx playwright test`.
3. Verify that the HAR file was written and is non-empty.
4. Continue to `npx --yes har-to-k6`.

## Expected Spec Contract

The spec should already:

- Create a browser context with `recordHar`.
- Use `content: 'embed'` and `mode: 'full'` unless there is a reason not to.
- Read base URL, credentials, tokens, and private data from environment variables.
- Execute the intended browser journey.
- Call `await context.close()` so the HAR is written.

Run the spec:

```bash
BASE_URL=http://localhost:3000 BASIC_USER=user BASIC_PASS=pass npx playwright test tests/e2e/journey.har.spec.ts
test -s artifacts/journey.har
npx --yes har-to-k6 artifacts/journey.har -o tests/perf/generated.journey.js
```

If the workspace has no local `@playwright/test` dependency and the spec fails with `Cannot find module '@playwright/test'`, run through an explicit npx package environment:

```bash
BASE_URL=http://localhost:3000 BASIC_USER=user BASIC_PASS=pass \
npx --yes -p @playwright/test -c 'NODE_PATH="$(dirname "$(dirname "$(which playwright)")")" playwright test tests/e2e/journey.har.spec.ts'
test -s artifacts/journey.har
```

## Rules

- Use file-based Playwright specs and `npx playwright test` for HAR recording.
- Use Playwright `httpCredentials` for Basic auth. Do not navigate to URLs containing `user:pass@host`; that can make app-side `fetch` fail because the current page URL includes credentials.
- Do not rewrite scenario semantics in this skill. Return to `$test-scenario-design` when scenario code is missing or wrong.
- Close the HAR-recording context before checking for the HAR file.
- Redact secrets from HAR or generated k6 scripts before sharing them outside the workspace.
- If `npx playwright test` cannot record HAR, report the limitation instead of silently switching capture methods.
