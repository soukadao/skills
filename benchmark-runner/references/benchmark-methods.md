# Benchmark Methods

Use this reference when the benchmark needs to support a decision, not just produce a number.

## Define the benchmark

- Decision: what action will the result change?
- Unit under test: command, function, endpoint, build, query, or workflow.
- Metric: wall time, throughput, latency percentile, CPU time, memory peak, allocation count, output size, or energy if measurable.
- Meaningful threshold: the smallest change worth caring about.
- Correctness oracle: how to prove both candidates did the same work.
- Workload: input size, data distribution, cache state, concurrency, and expected output.

## Control noise

- Pin or record runtime versions, dependency versions, OS, CPU, and git revisions.
- Close heavy background work when local noise would dominate.
- Prefer plugged-in power and stable thermal conditions for laptop benchmarks.
- Keep the benchmark data local and deterministic unless remote I/O is the thing being measured.
- Run warmups for JIT compilers, imports, caches, database connection pools, and lazy initialization.
- Randomize or alternate candidate order when runs are long enough for drift to matter.
- Separate cold-start, warm-cache, and steady-state paths.

## Interpret results

- Prefer median for skewed timing data and mean for total expected cost when variance is reasonable.
- Inspect standard deviation or relative standard deviation before claiming a small win.
- Treat a result as inconclusive when candidate distributions overlap or the delta is smaller than known noise.
- Check that outputs, side effects, and error handling are equivalent.
- Report both relative and absolute differences; a 50% change on a 2 ms operation may not matter.
- Repeat with a larger or more realistic workload when microbenchmark results conflict with user-visible behavior.

## Red flags

- Single-run timing.
- Fastest-run-only comparison.
- Different compiler modes, flags, dependencies, data, or cache state.
- Measuring setup cost when the question is steady-state, or hiding setup cost when the user pays it.
- Benchmark code that allows dead-code elimination, skipped I/O, memoized results, or changed output.
- Remote services, network retries, rate limits, or shared test environments without noting the noise.
- CI machines used for tiny deltas without enough repetitions or historical baseline.

## Confidence labels

- High: representative workload, repeated runs, low variance, equivalent correctness, and a clear delta above noise.
- Medium: useful workload and repeated runs, but some environmental or workload caveats remain.
- Low: exploratory timing, high variance, weak correctness checks, or a workload that only approximates reality.
