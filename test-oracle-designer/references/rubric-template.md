# Rubric Template

Use this when correctness involves judgment.

## Rubric Shape

```markdown
## Evaluation Target
- Output:
- Intended user:
- Source of truth:
- Risk if wrong:

## Must Pass
| Criterion | Pass | Fail | Evidence |
|---|---|---|---|

## Quality Bands
| Score | Meaning | Observable Anchor |
|---:|---|---|
| 3 | Good | ... |
| 2 | Acceptable | ... |
| 1 | Poor | ... |
| 0 | Invalid | ... |

## Automatic Rejects
- ...

## Examples
| Input | Good Output | Bad Output | Reason |
|---|---|---|---|
```

## Rubric Rules

- Keep must-pass criteria separate from nice-to-have quality.
- Include source material needed to judge the output.
- Define automatic rejects for safety, privacy, policy, factuality, or business-critical failures.
- Use examples that cover borderline cases.
- Avoid vague criteria such as "natural", "good", "appropriate", or "high quality" unless anchored to observable traits.
- For LLM-assisted grading, require the grader to cite evidence from the input and output.
- Calibrate with a small set of human-reviewed examples before trusting aggregate scores.

## Useful Criteria Categories

- factual consistency with source;
- completeness of required points;
- absence of prohibited content;
- correct tone, audience, and formality;
- actionable specificity;
- no unsupported claims;
- privacy and security compliance;
- clear handling of uncertainty;
- preservation of user intent;
- correct formatting constraints.
