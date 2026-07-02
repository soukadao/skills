# Benchmark Tool Selection

Choose the simplest tool that measures the user's actual decision metric.

## Default choices

| Situation | Prefer | Why |
|---|---|---|
| Compare shell commands, binaries, scripts, build commands, or CLIs | `hyperfine` | Handles warmup, repeated runs, command comparison, and JSON/Markdown export. |
| Benchmark Python functions already covered by pytest | `pytest-benchmark` | Integrates with pytest fixtures, parametrization, statistics, and JSON export. |
| Benchmark JavaScript or TypeScript functions in Node, Bun, Deno, or browsers | `tinybench` | Small API, modern runtimes, and straightforward async support. |
| Need older jsPerf-style JavaScript benchmark suites | Benchmark.js | Mature suite API and statistics for classic JS microbenchmarks. |
| Lightweight local HTTP endpoint benchmark | `autocannon` | Fast Node-based endpoint benchmarking without a full k6 scenario. |
| Full HTTP load, spike, soak, thresholds, scenarios, or CI performance gates | `$k6-load-testing` | Better fit for controlled load profiles and threshold analysis. |
| Browser rendering or frontend interaction timing | Playwright plus browser performance APIs | Needed when real rendering, navigation, or user interaction affects the metric. |
| Memory allocation or CPU profile investigation | Runtime profiler first | Use benchmarks to reproduce the issue, then profilers to explain it. |

## Selection rules

- Prefer an existing project dependency or package-manager command when available.
- Prefer JSON export when results may be compared later.
- Prefer framework-integrated tools when correctness checks and fixtures already live there.
- Use a profiler, trace, or logs when the user asks why performance changed; use benchmarks to quantify how much.
- Use microbenchmarks only when the code path is isolated and the result maps to a real workload.
- Escalate from local benchmark to k6 only when concurrency, arrival rate, thresholds, or multi-step HTTP behavior matters.

## Common commands

```bash
hyperfine --warmup 3 --runs 20 --export-json artifacts/bench.json 'npm run build'
```

```bash
pytest tests/benchmarks --benchmark-json=artifacts/pytest-benchmark.json
```

```bash
npx tinybench ./benchmarks/example.mjs
```

```bash
npx autocannon -d 20 -c 25 http://localhost:3000/api/example
```
