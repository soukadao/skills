# Race And TOCTOU Testing

## Define The Invariant

State the property that concurrent requests must not violate, for example:

- A one-time token produces at most one successful state change.
- A coupon is applied no more than once.
- A balance never becomes negative.
- Inventory never falls below zero.
- Only one approval, refund, or role transition is committed.

Identify how to observe the durable state after the concurrent requests. Response codes alone are usually insufficient.

## Establish A Baseline

Run the state-changing request sequentially against fresh test data. Record the expected first response, expected duplicate response, and final state. Do not classify a race result without this comparison.

## Generate A Race Template

```yaml
id: one-time-action-race

info:
  name: One-Time Action Race Test
  author: coding-agent
  severity: high
  tags: race,toctou,custom

http:
  - raw:
      - |
        POST /api/actions/{{action_id}}/consume HTTP/1.1
        Host: {{Hostname}}
        Authorization: Bearer {{token}}
        Content-Type: application/json

        {"confirmation":true}

    race: true
    race_count: 20

    matchers-condition: and
    matchers:
      - type: status
        status: [200]
      - type: word
        part: body
        words:
          - '"consumed":true'
```

Pass a fresh `action_id` for each repetition. Start with a small `race_count`, then increase only when the result is inconclusive.

## Verify The Final State

Create a separate verification request or template when the attack response does not prove the durable effect:

```yaml
id: one-time-action-state

info:
  name: One-Time Action Final State
  author: coding-agent
  severity: info
  tags: race,verification,custom

http:
  - method: GET
    path:
      - "{{BaseURL}}/api/actions/{{action_id}}"
    headers:
      Authorization: "Bearer {{token}}"
    matchers:
      - type: regex
        part: body
        regex:
          - '"consumptionCount":(?:[2-9]|[1-9][0-9]+)'
```

Match the violated invariant rather than the expected value. Do not use a substring check for numeric equality: a check for `1` can also match `10`. Prefer an exact structured assertion or a boundary-aware regular expression.

## Interpret Carefully

Nuclei can coordinate requests with `race: true`, but its normal finding model does not provide a complete business-state assertion engine. Inspect stored responses when the number of successful responses matters. Confirm the final state through an API or other observable interface.

Use `NEEDS_REVIEW` when:

- Requests were concurrent but no durable state was checked.
- The target returned several successes that may be idempotent aliases of one operation.
- Rate limiting, authentication expiry, or test-data reuse affected the batch.
- The race window may require tighter synchronization than Nuclei provided.

Escalate to a specialized race tool only after documenting the specific synchronization or aggregation limitation encountered.
