# Oracle Patterns

Use the smallest oracle that can catch the important failure.

## Exact Expected Value

Use when the output has one correct value.

Examples:

- currency calculation;
- parser output for a fixed input;
- API status code for a known invalid request;
- database migration row count for a controlled fixture.

Watch out for hidden variables such as timezone, locale, current date, generated IDs, random seeds, and external service state.

## Invariant Oracle

Use when many outputs are valid but certain properties must always hold.

Examples:

- list items are unique;
- totals reconcile;
- unauthorized users never see another tenant's data;
- generated text does not include forbidden claims;
- UI action preserves focus and does not lose unsaved input.

Prefer invariants for broad input spaces and generated outputs.

## Relational Or Metamorphic Oracle

Use when the exact output is hard to know but changing the input should change the output in a predictable way.

Examples:

- sorting ascending then descending reverses order for distinct keys;
- adding a filter cannot increase result count;
- increasing a price cannot decrease tax when all else is fixed;
- translating prompt wording without changing intent should preserve required facts;
- retrying an idempotent request does not create a duplicate resource.

This is often the best pattern for search, recommendations, ranking, generated text, and complex calculations.

## Reference Implementation Oracle

Use when a trusted slower or simpler implementation exists.

Examples:

- compare optimized SQL result to a simple query on a small fixture;
- compare new serializer to old serializer during migration;
- compare custom validation to a standards library.

Document the trust boundary. A reference implementation can share the same bug if it uses the same assumptions.

## Differential Oracle

Use when several implementations, providers, versions, or environments should agree.

Examples:

- old API vs new API for backwards-compatible endpoints;
- browser A vs browser B for layout-critical behavior;
- production read-only sample vs staging migration result;
- multiple LLM models judged against the same rubric.

Good for regression detection, weaker for proving which side is correct.

## Statistical Or Tolerance Oracle

Use for nondeterministic, approximate, or performance behavior.

Examples:

- p95 latency remains under a threshold for a defined load profile;
- recommendation diversity stays within a target band;
- OCR confidence exceeds a threshold on a benchmark set;
- generated classifier accuracy is measured over a labeled sample.

Always specify sample size, dataset, seed when possible, aggregation window, confidence expectations, and acceptable variance.

## Golden Artifact Oracle

Use when the output is large and manually reviewable.

Examples:

- generated PDF visual rendering;
- compiled design tokens;
- API schema snapshot;
- generated code file.

Golden artifacts are useful only when changes are reviewed intentionally. Pair them with focused assertions to avoid noisy approvals.

## Human Rubric Oracle

Use when correctness depends on judgment, usefulness, tone, domain policy, or user intent.

Examples:

- support reply quality;
- summarization usefulness;
- UX copy clarity;
- sales recommendation appropriateness.

Use a rubric with explicit pass/fail anchors and examples. Do not ask a reviewer to "check if it looks good" without criteria.

## LLM-Assisted Oracle

Use only when deterministic checks and human review are insufficient or too expensive.

Good uses:

- preliminary triage before human review;
- rubric-based evaluation of generated text;
- detecting missing required facts when exact phrasing varies.

Bad uses:

- verifying arithmetic, schema conformance, access control, or facts that can be checked directly;
- judging without the source of truth in context;
- replacing final review for high-risk decisions.

Require a rubric, examples, and spot checks against human judgment.
