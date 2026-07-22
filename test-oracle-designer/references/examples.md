# Examples

## LLM Summary

Behavior: Summarize a support ticket for an engineer.

Oracle strategy:

- Invariant: includes product, affected user action, error message, observed time, and attempted workaround when present.
- Reject: invents root cause or omits a security/privacy warning.
- Rubric: factual consistency, completeness, actionability, brevity.
- Evidence: source ticket fields and generated summary.

## Search Ranking

Behavior: Return relevant documents for a query.

Oracle strategy:

- Metamorphic: adding a required term filter cannot increase unrelated results.
- Statistical: benchmark NDCG or recall over a labeled query set.
- Invariant: blocked documents and unauthorized tenants never appear.
- Differential: compare old and new rankers on known critical queries.

## API Idempotency

Behavior: Creating a payment with an idempotency key.

Oracle strategy:

- Exact: first request returns `201` and a payment ID for a valid fixture.
- Relational: retrying the same request with the same key returns the same logical payment and does not create a second row.
- Invariant: changing the body with the same key returns a conflict or documented error.
- Evidence: API responses, database rows, emitted events.

## UI Form

Behavior: Save a settings form.

Oracle strategy:

- User-visible assertion: saved values appear after reload.
- Accessibility invariant: validation errors are associated with fields and focus moves to the first invalid field.
- State invariant: failed save preserves user-entered values.
- Flake control: mock time, use stable fixture account, wait for specific success state rather than arbitrary timeout.

## Data Migration

Behavior: Move orders from legacy schema to new schema.

Oracle strategy:

- Reconciliation: source and target order counts match under the migration scope.
- Conservation: total amounts by currency and day match.
- Referential integrity: every migrated line item has a parent order.
- Edge fixtures: cancelled, refunded, zero-value, multi-currency, and timezone-boundary orders are preserved.
