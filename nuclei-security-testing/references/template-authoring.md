# Template Authoring

## Choose The Input

Prefer inputs in this order:

1. A known-good HTTP request or cURL command.
2. An OpenAPI operation with concrete example values.
3. A HAR request with secrets removed.
4. A prose endpoint description.

Identify the request that changes or exposes security-relevant state. Define the secure expectation before writing matchers.

## Minimal HTTP Template

```yaml
id: application-specific-check

info:
  name: Application Specific Security Check
  author: coding-agent
  severity: medium
  tags: custom,dast

http:
  - raw:
      - |
        POST /api/resource/{{resource_id}}/action HTTP/1.1
        Host: {{Hostname}}
        Authorization: Bearer {{token}}
        Content-Type: application/json

        {"value":"{{test_value}}"}

    matchers-condition: and
    matchers:
      - type: status
        status:
          - 200
      - type: dsl
        dsl:
          - 'contains(content_type, "application/json")'
      - type: word
        part: body
        words:
          - '"securityRelevantResult":true'
```

Pass values without writing secrets into the file:

```bash
nuclei -u "$TARGET" -t check.yaml \
  -V token="$TOKEN" \
  -V resource_id="$RESOURCE_ID" \
  -V test_value="$TEST_VALUE"
```

## Dependent Requests

Use `flow` and an internal extractor when one response provides a value for the next request:

```yaml
flow: http("create") && http("check")

http:
  - id: create
    method: POST
    path:
      - "{{BaseURL}}/api/resources"
    headers:
      Authorization: "Bearer {{token}}"
      Content-Type: application/json
    body: '{"name":"security-test"}'
    matchers:
      - type: status
        status: [201]
        internal: true
    extractors:
      - type: json
        name: resource_id
        internal: true
        json:
          - '.id'

  - id: check
    method: GET
    path:
      - "{{BaseURL}}/api/resources/{{resource_id}}"
    headers:
      Authorization: "Bearer {{token}}"
    matchers:
      - type: status
        status: [200]
```

Do not add creation or deletion steps unless the requested test needs them. Make cleanup explicit when the scenario creates persistent state.

## Matcher Checklist

- Match the unauthorized data, duplicate effect, state transition, or other security impact.
- Combine status, content type, structured values, headers, or response differences when useful.
- Avoid a matcher that also succeeds during the secure behavior.
- Mark prerequisite matchers and extractors `internal: true`.
- Use a negative control when authentication or authorization behavior could be ambiguous.
- Validate YAML before sending any request.

## Community Templates

Use targeted filters rather than an unexplained full scan:

```bash
nuclei -u "$TARGET" -tags cve,misconfig,exposure -severity medium,high,critical -jsonl
```

Use `-fuzz` only when fuzzing templates are intentionally selected. Use `-headless` only when a selected template requires it. Record filters and template versions so results can be reproduced.
