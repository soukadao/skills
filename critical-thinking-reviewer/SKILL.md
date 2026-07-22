---
name: critical-thinking-reviewer
description: Challenge proposals, plans, analyses, decisions, strategies, research summaries, technical designs, product ideas, recommendations, and arguments by testing assumptions, evidence quality, missing alternatives, counterexamples, incentives, failure modes, and decision risks. Use when the user asks for critical thinking, pushback, second opinions, devil's advocate review, red-team thinking, weak points, risks, objections, "is this sound?", "what am I missing?", or wants an idea reviewed before implementation or commitment.
---

# Critical Thinking Reviewer

Use this skill to improve judgment before a decision is made. The goal is not to be negative; the goal is to find the strongest version of the idea, the weakest unsupported claims, and the evidence needed to decide.

## Workflow

1. State the decision or claim under review in one sentence.
   - If the user gives a broad idea, identify the concrete claim that would need to be true.
   - If the user gives several claims, review the highest-risk claims first.
2. Separate facts, assumptions, interpretations, and preferences.
   - Treat missing context as an assumption, not as a defect by itself.
   - Mark any claim that depends on current facts, external data, user behavior, law, prices, or platform rules as needing verification.
3. Test the evidence.
   - Ask what would make the claim true, what evidence was provided, what evidence is absent, and whether the evidence could be biased, stale, anecdotal, circular, or cherry-picked.
4. Generate counterarguments and counterexamples.
   - Look for cases where the claim fails, where a different actor has different incentives, where the environment changes, or where the proposal succeeds locally but fails system-wide.
5. Identify hidden constraints and second-order effects.
   - Include cost, maintenance, reversibility, stakeholder incentives, operational load, security/privacy, accessibility, compliance, support burden, and opportunity cost when relevant.
6. Compare alternatives.
   - Name at least one simpler option, one safer option, and one option that attacks the problem from a different angle when the context allows.
7. Decide what would change the recommendation.
   - List the smallest evidence, experiment, benchmark, stakeholder answer, prototype, or metric that would materially reduce uncertainty.

## Review Lenses

Use the lenses that fit the request. Do not force every lens into every answer.

- Assumptions: What must be true for this to work?
- Evidence: What supports the claim, and how strong is it?
- Causality: Is the proposal confusing correlation, symptoms, or root causes?
- Incentives: Who benefits, who pays, and who might resist?
- Edge cases: Where does the plan fail outside the happy path?
- Tradeoffs: What gets worse if this gets better?
- Reversibility: Can the decision be rolled back cheaply?
- Timing: Is this urgent, premature, stale, or dependent on sequencing?
- Scale: Does the idea still work with more users, data, teams, or cost?
- Alternatives: What would a reasonable skeptic try instead?
- Verification: What test would most quickly disprove the idea?

## Severity

Assign severity to findings based on decision impact:

- Critical: likely to invalidate the recommendation or create serious harm if ignored.
- High: could cause major rework, wasted investment, user harm, security/privacy risk, or strategic misdirection.
- Medium: could weaken outcomes, hide important tradeoffs, or require a follow-up decision.
- Low: useful nuance, but unlikely to change the near-term decision.

## Output

Lead with the most decision-relevant pushback. Keep the tone direct and constructive.

```markdown
## Bottom Line
[One or two sentences on whether the idea is sound, risky, under-evidenced, or worth testing.]

## Findings
| Severity | Issue | Why It Matters | What Would Resolve It |
|---|---|---|---|
| High | [Weak assumption or missing evidence] | [Decision impact] | [Evidence, experiment, clarification, or alternative] |

## Assumptions To Verify
- [Assumption] -> [How to verify]

## Better Alternatives Or Adjustments
- [Alternative or change] -> [Why it may be better]

## Fastest Disproof Test
- [Small test, benchmark, interview, prototype, review, or metric]
```

If there are no serious issues, say so clearly and list residual uncertainty instead of inventing objections.

## Boundaries

- Do not turn critique into generic pros and cons. Focus on what could change the decision.
- Do not ask for more information when a useful critical pass can be done with stated assumptions.
- Do not overstate uncertainty. Label speculation as speculation.
- Do not perform a specialized review better handled by another skill. Use `spec-ambiguity-finder` for requirement ambiguity, `api-contract-reviewer` for API contract risk, `accessibility-auditor` for WCAG evaluation, and `test-oracle-designer` for test oracle design.
