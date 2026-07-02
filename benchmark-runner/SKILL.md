---
name: benchmark-runner
description: Design, run, compare, and report reproducible software benchmarks for CLI commands, functions, builds, scripts, libraries, local services, and before/after performance changes. Use when a user asks to benchmark code, compare implementations, check a performance regression, choose a benchmark tool, interpret benchmark results, create a repeatable benchmark plan, or summarize timing/throughput/memory results. For substantial HTTP load tests from an existing k6 script, use k6-load-testing instead.
---

# Benchmark Runner

Use this skill to turn a performance question into a benchmark that is fair enough to support a decision.

```text
Define the decision
-> Choose the smallest representative workload
-> Select the measurement tool
-> Run warmup and repeated measurements
-> Compare against a baseline
-> Report the result and caveats
```

## Workflow

1. State the decision:
   - What is being compared, what metric matters, and what change would be meaningful.
   - Prefer task-level metrics such as wall time, throughput, latency percentile, memory peak, output size, or build duration.
2. Select the benchmark shape:
   - CLI/process benchmark: prefer `hyperfine`.
   - Python function benchmark: prefer `pytest-benchmark`.
   - JavaScript/TypeScript function benchmark: prefer `tinybench` or Benchmark.js.
   - HTTP endpoint smoke or lightweight service benchmark: use `autocannon` when k6 is unnecessary; use `$k6-load-testing` for full load profiles.
   - Read `references/tool-selection.md` when the tool is not obvious.
3. Control noise:
   - Record runtime versions, machine context, command, dataset, environment variables, and git revisions.
   - Use warmup runs for JIT, caches, imports, database pools, or startup paths.
   - Avoid comparing cold and warm paths unless that is the real user experience.
   - Read `references/benchmark-methods.md` for setup and interpretation rules.
4. Run the benchmark:
   - Start with a quick smoke run to confirm correctness and stable output.
   - Increase repetitions only after the command is correct and non-destructive.
   - Keep benchmark inputs realistic but small enough to run repeatedly.
5. Compare:
   - Prefer median or mean plus variance, not a single fastest run.
   - Treat differences smaller than noise as inconclusive.
   - Use `scripts/compare_hyperfine.py` for two hyperfine JSON files when available.
6. Report:
   - Include the exact commands, target revisions, environment, key metrics, percent change, confidence level, caveats, and next action.
   - Use `references/report-template.md` for longer summaries.

## Safety And Validity Rules

- Do not benchmark destructive commands against real data unless the user explicitly approves the target and rollback plan.
- Do not install new benchmarking tools globally when `npx`, project dev dependencies, package-manager scripts, or existing local tools are enough.
- Do not claim a winner when results overlap within variance, when correctness differs, or when the workload does not match the user's real case.
- When the task is choosing an OSS library, do not make the final adoption recommendation from benchmark results alone. Return measured performance, confidence, caveats, and selection-relevant tradeoffs so `$select-oss-library` can integrate them with license, maintenance, API fit, security, and ecosystem risk.
- Do not compare debug builds against optimized builds unless that is the intended scenario.
- Do not hide failed checks, changed outputs, throttling, retries, GC pressure, cache effects, or thermal/battery constraints.

## Command Patterns

CLI comparison:

```bash
hyperfine --warmup 3 --runs 20 --export-json artifacts/bench.json \
  'command-a --input fixtures/sample.json' \
  'command-b --input fixtures/sample.json'
```

Before/after comparison:

```bash
python3 benchmark-runner/scripts/compare_hyperfine.py \
  artifacts/baseline.hyperfine.json artifacts/current.hyperfine.json
```

## Output

For quick results, report:

- Benchmark question and workload.
- Commands and environment.
- Baseline vs current metrics.
- Percent change and whether it is meaningful.
- Correctness checks performed.
- Caveats and next step.
