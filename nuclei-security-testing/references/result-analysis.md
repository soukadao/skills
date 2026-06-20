# Result Analysis

## Preserve Evidence

Prefer JSONL plus stored HTTP responses:

```bash
nuclei -u "$TARGET" -t tests/security/nuclei \
  -jsonl -o artifacts/nuclei/results.jsonl \
  -sresp -srd artifacts/nuclei/http
```

Record:

- Nuclei version and template version or commit.
- Target and template paths.
- Command with credentials and tokens redacted.
- Start time, end time, and relevant variables excluding secrets.
- Stored request/response paths.

## Triage JSONL

Inspect stable fields without assuming every template emits optional metadata:

```bash
jq -r '[.info.severity, .["template-id"], .["matched-at"]] | @tsv' results.jsonl
```

For each result, compare the matcher with the intended security invariant. A generic success response may represent normal behavior, an idempotent replay, or a partial operation.

For a race template, treat JSONL as the primary per-response record. Stored-response output can reuse a path when many requests hit the same endpoint, while JSONL retains each matched response.

## Classification

Use `CONFIRMED` only when all applicable conditions hold:

1. The template validated and executed the intended endpoint.
2. Authentication and prerequisite extraction succeeded.
3. The observed behavior differs from the secure expectation.
4. The security-relevant effect is reproducible or durably observable.
5. Evidence contains enough detail to repeat the test.

Use `NOT_REPRODUCED` only when the test was valid and exercised the intended behavior. Use `NEEDS_REVIEW` for ambiguous matchers, partial execution, missing final-state verification, or environmental errors.

## Final Report

Report the following for each test:

```text
Test: <template id and objective>
Status: CONFIRMED | NOT_REPRODUCED | NEEDS_REVIEW | NOT_RUN
Target: <redacted when appropriate>
Template: <path>
Observation: <what the responses and final state showed>
Invariant: <expected secure property>
Evidence: <JSONL and stored HTTP paths>
Reproduction: <command with secrets redacted>
Limitations: <authentication, coverage, timing, or matcher limits>
```

Summarize clean results as bounded evidence: state which templates, endpoints, identities, and invariants were exercised. Never convert an empty JSONL file into a general claim that the application has no vulnerabilities.
