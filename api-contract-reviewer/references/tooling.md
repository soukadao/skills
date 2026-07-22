# API Contract Tooling

Use tools as evidence generators, not as replacements for review judgment.

## oasdiff

Use oasdiff when comparing two OpenAPI specs.

Primary use:

```bash
oasdiff breaking old-openapi.yaml new-openapi.yaml
oasdiff changelog old-openapi.yaml new-openapi.yaml
```

Common review flow:

1. Confirm both specs represent the intended base and proposed versions.
2. Run `oasdiff breaking` to identify compatibility risks.
3. Run `oasdiff changelog` when the user also wants non-breaking changes summarized.
4. Review each result against the API's compatibility policy.
5. Add human findings for business semantics that oasdiff cannot know, such as permission boundary changes, altered defaults, or changed ordering.

Interpretation notes:

- Treat `ERR` and `WARN` findings as review triggers, not automatic release blockers unless the project policy says so.
- If specs are generated from code, remember that a clean diff can still miss undocumented runtime behavior.
- If specs are hand-written, remember that a detected change might reflect documentation catching up with existing behavior.

Official sources:

- https://github.com/oasdiff/oasdiff
- https://www.oasdiff.com/docs/breaking-changes

## Schemathesis

Use Schemathesis when an OpenAPI or GraphQL schema and a runnable API target are available.

Primary use:

```bash
schemathesis run openapi.yaml --url http://localhost:8000
```

Common review flow:

1. Confirm target environment, credentials, allowed methods, rate limits, and cleanup constraints.
2. Prefer local, staging, or disposable environments over production.
3. Limit state-changing operations unless the user explicitly scopes test data and cleanup.
4. Run with the schema and base URL.
5. Translate failures into contract findings:
   - undocumented status code;
   - response body does not match declared schema;
   - server error for generated valid or invalid input;
   - missing validation boundary in the schema;
   - auth or state setup not represented in the contract.

Interpretation notes:

- Schemathesis generates edge cases from the schema. It cannot know all business invariants unless the schema expresses them.
- Failing generated inputs often indicate either an implementation bug or an underspecified contract.
- Passing tests do not prove the API contract is complete.

Official sources:

- https://schemathesis.readthedocs.io/
- https://github.com/schemathesis/schemathesis

## OpenAPI Baseline

Use the OpenAPI Specification as the source of vocabulary for paths, operations, parameters, request bodies, responses, components, and security requirements.

Official sources:

- https://spec.openapis.org/oas/
- https://swagger.io/specification/
