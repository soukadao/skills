---
name: derive-ideas-from-essence
description: Uncover a problem's essential mechanism by moving between concrete cases and abstraction, turn that mechanism into a change principle, and generate original ideas that follow from it. Use for problem discovery, reframing, product or service concepts, strategy, invention, recurring problems, and requests to identify the essence and create new ideas.
---

# Derive Ideas From Essence

Use this chain:

```text
concrete cases -> essential mechanism -> change principle -> new ideas -> concrete check
```

Treat the essence as the most useful current hypothesis, not as a final truth. Its value is that it explains the cases and reveals what to change.

## 1. Fix The Target

Preserve the user's problem before abstracting it. State:

```text
observed state -> what should change -> what must remain true
```

Do not replace the target with a more meaningful-sounding goal. If one statement permits materially different targets, ask one focused question or present separate branches. Do not invent a numeric success threshold.

## 2. Gather Concrete Cases

Use two to five concrete cases when available. Include a contrast where the problem is absent or weaker. For each case, separate observable facts from interpretation and capture:

```text
actor | goal | trigger | action | result | constraint
```

When evidence is sparse, label constructed cases as illustrations and the essence as a hypothesis.

## 3. Find The Essence

Move upward from surface details and ask:

- What relationship repeats across cases?
- What constraint, imbalance, feedback loop, or tradeoff produces the result?
- Why does the contrasting case behave differently?
- What remains true when names, tools, and settings change?

Generate multiple candidate mechanisms from different frames, such as flow, information, incentives, timing, coordination, environment, or meaning.

Select an essence only when it:

1. explains the concrete cases and the contrast;
2. describes a mechanism rather than renaming the symptom;
3. preserves the user's target;
4. reveals something that can be changed;
5. predicts when the problem should weaken or disappear.

Keep a credible alternative when the cases do not distinguish it. Never combine independent mechanisms into one profound-sounding sentence.

Write the result as:

```text
When [condition], [mechanism] produces [target outcome] because [reason].
```

## 4. Derive A Change Principle

Choose one controllable lever from the mechanism:

```text
Because [mechanism], change [lever] from [current state] to [new state],
so that [target] moves in the desired direction.
```

Use one lever per principle. If another idea depends on a different cause or lever, place it under a separate principle instead of mixing it into the same list.

## 5. Create Ideas

Generate freely before judging. Create several embodiments of the principle by varying:

- who acts and at what moment;
- what is added, removed, limited, combined, delayed, or automated;
- whether the intervention changes an individual action, interface, process, rule, or environment;
- whether the troublesome behavior can be bypassed while preserving the target.

Use a distant analogy when it transfers the same relationship or feedback structure. Do not keep an analogy based only on surface resemblance.

Retain an idea only when it:

- preserves the target and constraints;
- changes the chosen lever or bypasses its mechanism;
- is meaningfully different from the other ideas;
- can be described in a concrete before-and-after situation.

Prefer a few strong ideas over padded variants.

## 6. Descend And Repeat

For each promising idea, instantiate:

```text
Before: what happens now?
Change: what exactly is different?
After: what observable result should differ?
Failure: when would this not work?
```

Return to the original cases. If the idea does not address them, revise the idea, the principle, or the essence. Make a second concrete-abstract-concrete pass when it changes the result materially; otherwise stop.

Do not claim an idea works without evidence. When useful, propose the smallest comparison or experiment that could disconfirm the mechanism.

## Output

Lead with the result, not the hidden working process.

```markdown
## 問題の定義
- 観測された状態:
- 変えたい対象:
- 維持する条件:

## 問題の本質
[Leading mechanism hypothesis]

## こうすればよい
[One change principle]

## アイデア
| アイデア | 具体的な仕組み | 本質から導かれる理由 |
|---|---|---|

## 確認したい仮定
- [Credible alternative, failure condition, or small test]
```

Keep the answer concise. Do not add a long methodology report unless the user asks for it.
