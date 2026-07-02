---
name: inventive-idea-generator
description: Generate, expand, and evaluate innovative ideas for products, services, research, strategy, business models, operations, or creative projects. Use when the user asks for 革新的なアイディア, 新規事業案, 発明, breakthrough ideas, ideation, concept generation, TRIZ-like invention, trend-informed ideas, analogy-based ideas, or ways to turn a problem/opportunity into original actionable concepts.
---

# Inventive Idea Generator

Create ideas that are both non-obvious and usable. Prefer structured divergence followed by explicit convergence over a single brainstorm list.

## Workflow

1. Fix the challenge in one sentence:

```text
For [actor], create/change [thing] so that [desired outcome], while preserving [constraints].
```

If the actor, outcome, or constraints are unclear, proceed with labeled assumptions unless the ambiguity would make the result unusable.

2. Gather input signals:

- User facts: goals, users, pains, assets, constraints, unfair advantages.
- Frictions: expensive, slow, risky, boring, confusing, wasteful, inaccessible, delayed, fragmented.
- Optional external signals: trends, papers, patents, competitor moves, regulations, adjacent domains.

For external research or API/library selection, read `references/tooling.md`.

3. Generate with at least four lenses:

- Inversion: make the current failure impossible, unnecessary, or self-correcting.
- Constraint removal: remove one scarce resource, step, permission, skill, device, or dependency.
- Contradiction: satisfy two opposing needs at once instead of trading them off.
- Analogy transfer: borrow a mechanism from a distant domain with the same underlying relationship.
- Unbundling/rebundling: separate, recombine, sequence, or make modular what is currently fixed.
- Data/AI leverage: turn latent traces, predictions, simulation, or personalization into a new capability.
- Business model shift: change who pays, when value is captured, risk sharing, ownership, or distribution.
- Ritual/environment shift: change timing, defaults, context, social proof, or physical/digital surroundings.

4. Shape raw ideas into concepts:

```text
Name:
User:
Core mechanism:
What changes from today:
Why now:
Why it is non-obvious:
Smallest test:
```

5. Evaluate without killing novelty too early:

- Novelty: Is it more than a feature tweak or obvious automation?
- Mechanism fit: Does it attack the actual bottleneck, contradiction, or unmet desire?
- Feasibility path: Is there a small version that can be tried soon?
- Defensibility: Does it create data, network, workflow, brand, switching, or distribution advantage?
- Risk: What must be true for it to work, and what could disprove it?

Use qualitative labels (`high`, `medium`, `low`) unless the user asks for numeric scoring.

## Quality Bar

Reject ideas that are only:

- generic AI wrapper concepts without a specific workflow advantage;
- "marketplace", "dashboard", "community", or "app" with no distinctive mechanism;
- trend-chasing without a concrete user behavior change;
- impossible to test except by building the full product;
- renamed versions of the user's original idea.

Keep weird ideas when the mechanism is strong. Convert them into smaller experiments instead of normalizing them away.

## Output

Lead with the strongest concepts, then explain the selection logic briefly.

```markdown
## 前提
[Assumptions and challenge framing]

## 有望アイディア
| アイディア | 仕組み | 新しさ | 最小検証 |
|---|---|---|---|

## もう一段攻めた案
| アイディア | 何が常識外れか | 成立条件 |
|---|---|---|

## 捨てた方向性
- [Rejected direction]: [why]

## 次に試すこと
1. [small test]
2. [research/API/prototype step if useful]
```

For Japanese requests, answer in Japanese unless the user asks otherwise.
