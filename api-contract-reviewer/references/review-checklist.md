# API Contract Review Checklist

Use this checklist selectively. Focus on the areas relevant to the artifact and user request.

## Operations

- Every public operation has a stable path, HTTP method, operation ID or equivalent identifier, summary, and consumer-facing description.
- Path parameters are declared, required, typed, encoded consistently, and match the literal path template.
- Query parameters define type, allowed values, defaults, empty-value behavior, repeated-value behavior, and interaction rules.
- Header and cookie parameters are documented when clients must send or read them.
- Request body media types, required fields, nullable fields, additional properties, examples, size limits, and validation rules are explicit.
- Success responses include all normal status codes, media types, schemas, examples, headers, and location/continuation links when relevant.
- Error responses include status code semantics, stable machine-readable error codes, human messages, field-level validation errors, retryability, and correlation/request IDs.

## Data Model

- Identifiers have stable format, uniqueness scope, opacity rules, and lifecycle behavior.
- Date/time fields specify timezone, precision, format, and whether client-supplied timestamps are accepted.
- Numbers define precision, scale, minimum, maximum, unit, and currency where relevant.
- Strings define length, encoding, case sensitivity, normalization, and pattern only when enforced.
- Enums specify whether unknown future values may appear and how clients should handle them.
- Nullable, optional, omitted, empty string, empty array, and zero are distinct where the business meaning differs.
- Relationships clarify whether embedded objects are snapshots, live expansions, references, or denormalized copies.

## Behavior

- Create operations define idempotency, duplicate detection, generated IDs, validation order, conflict handling, and partial success.
- Update operations distinguish full replace vs partial update, merge semantics, clearing fields, concurrency control, and version conflicts.
- Delete operations define soft/hard delete, repeated delete behavior, restoration, and dependent resources.
- List operations define pagination style, cursor lifetime, ordering stability, total counts, filtering, sorting, and empty-page behavior.
- Async operations define accepted status, polling or callback contract, terminal states, timeout, cancellation, and failure details.
- Bulk operations define per-item result shape, atomicity, limits, ordering, retries, and partial failure semantics.

## Security And Tenancy

- Security schemes are declared at the right global or operation level.
- Required scopes, roles, tenant context, ownership checks, and cross-resource access rules are explicit.
- 401, 403, 404, and 409 behavior is clear enough that clients can distinguish auth, permission, absence, and conflict when allowed.
- Sensitive fields are omitted, redacted, or access-controlled in examples and schemas.
- Rate limits, quotas, abuse controls, and retry-after headers are documented when clients must react to them.

## Compatibility

- Existing valid requests remain valid unless the change is intentionally breaking and versioned or approved.
- Existing documented response fields remain present, type-compatible, and semantically compatible.
- New fields are additive and clients are expected to ignore unknown response members.
- New enum values, status codes, or error codes are compatible with generated clients and existing error handling.
- Validation has not become stricter without a migration path.
- Default behavior has not changed silently.

## Evidence Quality

- Examples match schemas and include realistic success and error cases.
- Contract examples do not leak secrets, real personal data, or internal-only fields.
- Every finding can point to a path, operation, schema, response example, diff hunk, or runtime observation.
- Every recommended change is either a contract edit, implementation fix, compatibility decision, or test case.
