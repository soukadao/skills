---
name: test-oracle-designer
description: "Design reliable test oracles: the explicit pass/fail criteria, expected outcomes, invariants, metamorphic relations, examples, tolerances, and evidence needed to decide whether hard-to-test behavior is correct. Use when testing LLM outputs, recommendations, search/ranking, UI behavior, data transformations, analytics, API behavior, workflows, migrations, simulations, or business rules where simple exact expected values are missing, brittle, subjective, probabilistic, or expensive to compute. Also use when reviewing weak assertions, flaky tests, golden files, snapshot tests, acceptance criteria, or evaluation rubrics."
---

# Test Oracle Designer

Design the mechanism that decides whether behavior is correct. Treat "what should the test assert?" as the main deliverable, not an afterthought.

## Intake

Identify the object under test:

- behavior or decision being evaluated;
- input space and important variations;
- observable outputs, side effects, logs, state changes, or user-visible results;
- correctness standard, business rule, policy, or user expectation;
- risk of false positives, false negatives, flaky checks, and overfitting.

If the user only provides a vague feature, first restate the behavior as testable claims. Do not invent a single exact expected output when the domain has many valid outputs.

## Workflow

1. Classify the oracle problem.
   - Exact expected value, invariant, relational/metamorphic, reference implementation, statistical tolerance, human rubric, approval/golden artifact, or differential comparison.
   - Use `references/oracle-patterns.md` for selection guidance.
2. Define correctness claims.
   - Split behavior into claims that can be checked independently.
   - Separate must-hold properties from quality preferences and diagnostic signals.
3. Choose oracle types.
   - Prefer deterministic, local, cheap checks for safety and core correctness.
   - Add sampled, statistical, human, or model-graded checks only when exact checks are not enough.
4. Specify evidence.
   - For each claim, name the observable evidence: value, state, event, trace, screenshot, log, database row, metric, diff, or reviewer judgment.
5. Add tolerances and boundaries.
   - Define acceptable ranges, ordering rules, timing windows, precision, randomness seeds, locale/timezone, and fixture stability.
6. Design failure interpretation.
   - Explain what a failure likely means, when it might be a false alarm, and what to inspect next.
7. Produce executable test guidance.
   - Convert oracle decisions into assertions, fixtures, property checks, golden files, review rubrics, or monitoring checks.

## Oracle Quality Rules

- A good oracle fails when the important behavior is wrong and passes when acceptable variation occurs.
- Avoid snapshots or golden files as the only oracle unless the artifact is intentionally reviewed and stable.
- Avoid LLM-as-judge for facts that can be checked by code, schema, database state, or deterministic rules.
- Use human review for subjective quality, but make the rubric observable and bounded.
- For probabilistic systems, test distributions, invariants, monotonicity, guardrails, and regression against fixed seeds; do not require identical output unless determinism is guaranteed.
- For UI tests, assert user-observable behavior and accessibility-relevant state before implementation details.
- For data pipelines, assert conservation, uniqueness, referential integrity, reconciliation totals, and known edge-case rows.
- For APIs, assert status code semantics, schema conformance, error shape, idempotency, and state transition evidence.

## Common Weak Oracles

Flag these as risks:

- Assertions that only check "no error" or "response exists".
- Snapshots that cover too much unrelated output.
- Exact string checks for generated text where many outputs are acceptable.
- Tests that assert implementation details instead of user-visible outcomes.
- Metrics with no baseline, tolerance, sample size, or time window.
- Golden files that are updated without explaining why the behavior change is acceptable.
- Human approval with no rubric, examples, or rejection criteria.

## References

- Read `references/oracle-patterns.md` when choosing oracle types.
- Read `references/rubric-template.md` when designing human or LLM-assisted evaluation.
- Read `references/examples.md` when the user wants concrete examples across domains.

## Output

Use this shape by default:

```markdown
## Behavior Under Test
- ...

## Oracle Strategy
| Claim | Oracle Type | Evidence | Pass Criteria | Failure Meaning |
|---|---|---|---|---|

## Test Cases Or Checks
- ...

## Tolerances And Fixtures
- ...

## Risks
- False positives:
- False negatives:
- Flake risks:
```

Keep the result practical enough that another engineer can implement the assertions or review rubric without rediscovering the correctness standard.
