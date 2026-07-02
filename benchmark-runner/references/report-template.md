# Benchmark Report Template

Use this structure for benchmark summaries that need to be shared in an issue, PR, or decision note.

```markdown
## Question

[What decision this benchmark informs.]

## Result

[Winner or inconclusive outcome.] Confidence: [High/Medium/Low].

| Candidate | Metric | Result | Change vs baseline | Notes |
|---|---:|---:|---:|---|
| Baseline | [metric] | [value] | - | [revision/config] |
| Current | [metric] | [value] | [delta] | [revision/config] |

## Workload

- Input/data:
- Command or code path:
- Correctness check:
- Cold/warm/cache state:

## Environment

- Machine/OS:
- Runtime/tool versions:
- Git revisions:
- Command:

## Caveats

- [Variance, missing production data, remote dependency, CI noise, etc.]

## Next Step

1. [Ship, reject, repeat with bigger workload, profile bottleneck, or add CI guard.]
```

For a short final answer, keep only Result, key metrics, caveats, and next step.
