# k6 Execution

## Baseline Structure

```javascript
import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const PROFILE = __ENV.K6_PROFILE || 'smoke';

const profiles = {
  smoke: {
    scenarios: {
      smoke: { executor: 'constant-vus', vus: 1, duration: '30s' },
    },
  },
  load: {
    scenarios: {
      steady: {
        executor: 'ramping-vus',
        stages: [
          { duration: '2m', target: 10 },
          { duration: '5m', target: 10 },
          { duration: '1m', target: 0 },
        ],
      },
    },
  },
};

export const options = {
  ...(profiles[PROFILE] || profiles.smoke),
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  group('GET /health', () => {
    const res = http.get(`${BASE_URL}/health`, {
      tags: { name: 'GET /health' },
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  });

  sleep(1);
}
```

## Scenario Selection

- Use `constant-vus` for smoke and simple steady user simulation.
- Use `ramping-vus` for gradual load and stress tests.
- Use `constant-arrival-rate` when the requirement is requests or iterations per time unit.
- Use `ramping-arrival-rate` for traffic ramps where arrival rate matters more than user count.
- Keep spike tests short and explicitly bounded.

## Spike Profiles And Delivered Traffic

For event-like traffic spikes, prefer an arrival-rate profile when the requirement comes from observed requests per minute rather than a target number of concurrent users. This works with OSS k6 and local execution:

```javascript
export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1m',
      preAllocatedVUs: 50,
      stages: [
        { duration: '10s', target: 100 },
        { duration: '10s', target: 200 },
        { duration: '50s', target: 200 },
        { duration: '10s', target: 0 },
      ],
    },
  },
};
```

Estimate delivered backend load before running:

```text
expected backend requests per minute =
  target iterations per minute * first-party backend requests per iteration
```

Then verify with target-side evidence, not only k6's own iteration count. Prefer application access logs, reverse-proxy logs, load balancer response counts, or server-side request counters closest to the application work. Treat CDN request count as noisy when static assets or cache behavior are involved, and treat sampled tracing/APM request counts as approximate. If delivered traffic is lower than expected, check edge/auth redirects, filtered endpoints, failed checks, and whether the generated script still calls the intended first-party APIs.

For authenticated staging targets, start with a simple endpoint such as `/health` and disable redirects to confirm the edge/auth behavior before running the full scenario:

```javascript
http.get(`${BASE_URL}/health`, {
  redirects: 0,
  tags: { name: 'GET /health' },
});
```

## Thresholds

Good API defaults:

```javascript
thresholds: {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  checks: ['rate>0.99'],
}
```

Endpoint-specific thresholds:

```javascript
thresholds: {
  'http_req_duration{name:GET /search}': ['p(95)<800'],
  'http_req_duration{name:POST /orders}': ['p(95)<1200'],
}
```

## Commands

Smoke:

```bash
BASE_URL=http://localhost:3000 K6_PROFILE=smoke k6 run tests/perf/api.js
```

Staging load test:

```bash
BASE_URL=https://staging.example.com K6_PROFILE=load k6 run tests/perf/api.js
```

## Environment Variable Names

k6 treats several `K6_*` environment variables as runtime configuration. Avoid using names such as `K6_VUS`, `K6_ITERATIONS`, `K6_DURATION`, or `K6_STAGES` for script-level knobs because they can override `options` and produce warnings or unexpected scenarios.

Use script-specific names instead:

```javascript
export const options = {
  scenarios: {
    smoke: {
      executor: 'shared-iterations',
      vus: Number(__ENV.PERF_VUS || 1),
      iterations: Number(__ENV.PERF_ITERATIONS || 1),
      maxDuration: __ENV.PERF_MAX_DURATION || '30s',
    },
  },
};
```

Command:

```bash
BASE_URL=http://localhost:3000 PERF_VUS=1 PERF_ITERATIONS=1 k6 run tests/perf/api.js
```

## Custom Summary

```javascript
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  return {
    'k6-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
```

## GitHub Actions Pattern

Use smoke for pull requests and reserve heavier load tests for scheduled or manual workflows.

```yaml
name: k6

on:
  pull_request:
  workflow_dispatch:

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grafana/setup-k6-action@v1
      - name: Run k6 smoke test
        env:
          BASE_URL: ${{ secrets.PERF_BASE_URL }}
          K6_PROFILE: smoke
        run: k6 run tests/perf/api.js
```

## Reporting Format

```text
Profile: smoke
Target: http://localhost:3000
Load: 1 VU for 30s
Result: passed
Key metrics: http_req_failed 0.00%, p95 42ms, p99 88ms, 14 req/s
Notes: /search is the slowest endpoint; use a load profile next.
```
