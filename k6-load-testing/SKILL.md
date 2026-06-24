---
name: k6-load-testing
description: Run, tune, and summarize k6 load tests from an existing k6 script. Use when a user wants to execute k6 safely, choose smoke/load/stress/spike/soak profiles, configure thresholds, pass environment variables or secrets, inspect k6 results, troubleshoot failed checks or high latency, verify delivered traffic, or add CI performance gates. Do not use for HAR-to-k6 conversion; use browser-to-k6-load-testing first when no k6 script exists.
---

# k6 Load Testing

Use this skill after a k6 script already exists.

```text
Confirm target and safety limits
-> Inspect k6 script options and required env vars
-> Run smoke first
-> Increase load only when smoke passes
-> Summarize metrics, failures, and next action
```

## Workflow

1. Confirm the script and target:
   - k6 script path, `BASE_URL`, profile, credentials, test data, and environment.
   - Production or production-like targets require explicit user confirmation and bounded load.
2. Inspect the script:
   - Options, scenarios, thresholds, checks, tags, groups, required `__ENV` values, and destructive actions.
   - Use `k6 inspect <script>` when useful.
   - Check that custom environment variables do not collide with k6 runtime variables such as `K6_VUS`, `K6_ITERATIONS`, or `K6_DURATION`.
3. Run safely:
   - Start with smoke.
   - Use explicit environment variables and profile values.
   - Stop on failed checks, high error rate, missing credentials, or unexpected writes.
   - Use `references/k6-execution.md`.
4. Analyze:
   - Pass/fail, threshold failures, p95/p99 latency, error rate, checks, throughput, slow endpoints, and data volume.
   - Compare delivered traffic with target-side logs or infrastructure metrics when available.
5. Report:
   - Command run, target, profile, load, result, key metrics, failure causes, artifacts, and next action.

## Safety Rules

- Do not run meaningful load against production unless the user explicitly confirms target and limits.
- Prefer smoke before load, stress, spike, or soak.
- Do not hardcode credentials or tokens in commands, scripts, summaries, or artifacts.
- Do not continue increasing load when checks, thresholds, or authentication fail.
- Keep destructive or write-heavy scenarios capped and documented.

## Command Pattern

```bash
BASE_URL=http://localhost:3000 K6_PROFILE=smoke k6 run tests/perf/api.js
```

For a heavier profile:

```bash
BASE_URL=https://staging.example.com K6_PROFILE=load k6 run tests/perf/api.js
```

## Final Output

Report:

- Script and profile used.
- Target and load shape.
- Pass/fail and threshold results.
- Key metrics: `http_req_failed`, p95/p99 latency, checks, throughput.
- Any safety limits or tool limitations.
- Recommended next step.
