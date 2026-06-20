---
name: nuclei-security-testing
description: Generate, validate, execute, and interpret targeted Nuclei security tests for running web applications and APIs. Use when Codex needs to turn an HTTP request, cURL command, HAR capture, OpenAPI description, authentication details, or business invariant into Nuclei YAML; run community or custom templates; test race conditions and TOCTOU with Nuclei; preserve request/response evidence; or analyze Nuclei JSONL results. Do not use for source-code-only review or browser DOM exploration.
---

# Nuclei Security Testing

Use Nuclei as the deterministic executor. Inspect the target artifacts, generate narrowly scoped templates, validate them, execute them, and interpret the evidence. Do not build a separate scanner unless a concrete Nuclei limitation blocks the requested test.

## Workflow

1. Establish the test inputs:
   - Target base URL and test objective.
   - A representative HTTP request, cURL command, HAR entry, OpenAPI operation, or endpoint description.
   - Authentication values and dynamic fields such as CSRF tokens, IDs, nonces, or ETags.
   - The expected secure behavior and an observable failure signal.
2. Inspect the local toolchain:
   - Run `command -v nuclei` and `nuclei -version`.
   - Do not install or update Nuclei or its templates unless the user requests it.
   - Record the Nuclei and template versions used when a scan runs.
3. Select the smallest test type that answers the question:
   - Use community templates for known CVEs, exposures, default credentials, and common misconfigurations.
   - Generate a custom HTTP template for application-specific requests and assertions.
   - Generate a flow template for dependent requests and extracted values.
   - Generate a race template for concurrent state mutation or TOCTOU.
4. Create focused YAML in the target project's security-test directory. Keep secrets out of the template and pass them with environment variables or `-V`.
5. Validate before execution:

```bash
nuclei -validate -t path/to/template.yaml
```

6. Execute with machine-readable output and evidence retention:

```bash
nuclei -u "$TARGET" \
  -t path/to/template.yaml \
  -V token="$TOKEN" \
  -jsonl -o results.jsonl \
  -sresp -srd evidence
```

7. Analyze matched and unmatched expectations. A matcher hit is an observation, not automatically a confirmed vulnerability. Confirm the durable effect or security invariant when the test changes state.
8. Report the template path, exact command with secrets redacted, tool versions, result status, evidence paths, and limitations.

## Authoring Rules

- Read [references/template-authoring.md](references/template-authoring.md) when generating or modifying Nuclei YAML.
- Read [references/race-testing.md](references/race-testing.md) for concurrent requests, TOCTOU, duplicate actions, quotas, or one-time tokens.
- Read [references/result-analysis.md](references/result-analysis.md) before classifying findings or preparing the final report.
- Prefer exact matchers tied to security impact. Avoid matching only a generic `200`, page title, or error substring.
- Use internal extractors for values consumed by later requests.
- Preserve a sequential baseline for race tests so concurrent behavior can be compared with normal behavior.
- Treat a clean scan as "no issue observed by these tests," not proof that the target is secure.
- Run active tests only against targets the user is authorized to test.

## Output Status

Use one of these statuses for every test:

- `CONFIRMED`: Reproducible behavior violates the stated security invariant and evidence shows the effect.
- `NOT_REPRODUCED`: The generated test ran successfully but did not observe the failure condition.
- `NEEDS_REVIEW`: Execution, authentication, matcher quality, cleanup, or state verification is incomplete.
- `NOT_RUN`: Nuclei or required target inputs were unavailable; report what was generated and validated instead.

Do not report `NOT_REPRODUCED` when the template failed validation, authentication failed, or the endpoint was not exercised.
