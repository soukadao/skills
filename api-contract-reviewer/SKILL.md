---
name: api-contract-reviewer
description: Review HTTP API contracts, especially OpenAPI/Swagger specifications, API design notes, request/response examples, cURL captures, and before/after API changes. Use when asked to find API contract ambiguity, breaking changes, implementation/spec drift, missing error behavior, pagination/filtering/sorting gaps, authentication or authorization contract issues, versioning risks, client compatibility risks, or contract-test opportunities. Use for PR review, release readiness, consumer/provider handoff, and API test planning; pair with Schemathesis or oasdiff when an executable OpenAPI artifact or two spec versions are available.
---

# API Contract Reviewer

Review API contracts as promises made to consumers. Prefer concrete compatibility risk, missing behavior, and testable clarification over general API style advice.

## Intake

Identify the review mode first:

- **Single contract review**: one OpenAPI/Swagger file, API spec, endpoint list, or examples.
- **Change review**: old and new OpenAPI specs, PR diff, migration note, or proposed API change.
- **Implementation drift review**: contract plus cURL, HAR, logs, test output, or live responses.
- **Test planning**: contract plus a request to create contract, fuzz, boundary, or regression tests.

Record assumptions about API audience, stability level, auth model, versioning policy, and whether existing clients must remain compatible. If those are unknown, review conservatively and list questions that could change severity.

## Workflow

1. Confirm the artifact shape.
   - Detect OpenAPI version, file format, base URL/server model, auth schemes, and whether examples are real or illustrative.
   - For non-OpenAPI inputs, infer endpoints cautiously and mark inferred contract elements.
2. Check contract completeness.
   - Review paths, methods, operation IDs, parameters, request bodies, responses, schemas, examples, security, headers, rate limits, pagination, filtering, sorting, idempotency, and error behavior.
   - Use `references/review-checklist.md` for the detailed checklist.
3. Check compatibility.
   - For before/after specs, identify breaking, risky, and documentation-only changes.
   - Use `references/tooling.md` for oasdiff when machine-readable specs are available.
4. Check consumer usability.
   - Ask whether a client can generate code, validate inputs, handle errors, retry safely, page through results, and recover from partial failure using only the contract.
5. Map findings to tests.
   - Separate manual clarification questions from executable checks.
   - Use Schemathesis for schema-derived API behavior checks when a runnable API and OpenAPI schema are available.
6. Report with evidence.
   - Include endpoint, method, field/schema, severity, consumer impact, evidence, recommended clarification, and validation step.

## Review Heuristics

Treat these as likely high severity for stable or external APIs:

- Removing an endpoint, method, response field, enum value, media type, auth option, or documented success status.
- Adding a required request field, required parameter, stricter validation, new auth requirement, or narrower type/range.
- Changing response type, nullability, identifier format, date/time format, pagination contract, error envelope, or status code semantics.
- Making previously idempotent or safe behavior state-changing.
- Returning undocumented errors or omitting machine-readable error codes.
- Leaving tenant, user, resource ownership, or permission boundaries ambiguous.

Treat these as review questions rather than facts unless evidence is provided:

- Whether unknown fields are ignored or rejected.
- Whether omitted optional fields default to a specific value.
- Whether timestamps are UTC, local time, or offset-aware.
- Whether list ordering is stable.
- Whether duplicate create/update requests are safe.
- Whether rate limits, retries, and eventual consistency are part of the contract.

## Tool Use

Use tools only when the inputs support them:

- Read `references/tooling.md` before running oasdiff or Schemathesis.
- Prefer oasdiff for old-vs-new OpenAPI compatibility checks.
- Prefer Schemathesis for executable contract testing against a running API.
- Do not run tests against production or state-changing endpoints without explicit scope, credentials, rate limits, and cleanup guidance.
- Do not treat tool output as complete. Tools can miss business rules, authorization semantics, backwards-compatibility expectations, and documentation ambiguity.

## Output

Use this structure unless the user asks for a different format:

```markdown
## Summary
- Overall risk:
- Main consumer impact:

## Findings
| Severity | Endpoint | Issue | Evidence | Recommended Change | Validation |
|---|---|---|---|---|---|

## Breaking Or Compatibility Risks
- ...

## Contract Test Opportunities
- ...

## Questions
- ...
```

Keep findings specific and testable. If no serious issues are found, say that clearly and note residual risk such as missing runtime evidence or absent old-spec comparison.
