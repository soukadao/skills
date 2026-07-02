---
name: select-oss-library
description: Evaluate and select OSS/open-source libraries, packages, SDKs, frameworks, or components for a software project. Use when the user asks to compare libraries, choose a dependency, replace an existing library, assess OSS health, license risk, maintenance activity, ecosystem fit, security posture, or tradeoffs between candidates. Also use for Japanese requests such as OSSライブラリ選定, OOSライブラリ選定, ライブラリ比較, 技術選定, or 依存パッケージ評価.
---

# Select OSS Library

Use this skill to make a defensible library recommendation by first testing whether each candidate actually matches the user's requirements, then comparing only the remaining tradeoffs.

## Workflow

1. Clarify the decision context only when missing information would materially change the recommendation.
   - Project language, runtime, framework, package manager, target platforms, and deployment environment.
   - Required capabilities, non-goals, constraints, current dependencies, and deadline.
   - License constraints, commercial use, copyleft tolerance, and internal approval process.
   - Risk tolerance for immature, unmaintained, or single-maintainer projects.
2. Discover candidates.
   - Include user-provided candidates first.
   - Add credible alternatives from official ecosystems, package registries, framework docs, and reputable project lists.
   - Avoid long candidate lists. Prefer 3-6 serious options unless the user asks for a market scan.
3. Verify current facts.
   - Search current sources for repository activity, release dates, supported versions, known security advisories, license, package metadata, and deprecation status.
   - Inspect direct and transitive dependencies when dependency risk could affect the recommendation.
   - Prefer language-agnostic or SBOM-based tools for nested dependency risk when the project spans multiple ecosystems. See `references/evaluation-framework.md`.
   - Prefer primary sources: project repository, official docs, package registry, release notes, security advisory database, and license file.
   - State the date of the check for facts likely to change.
4. Apply hard filters before comparison.
   - Reject candidates that cannot satisfy required runtime/platform support, license policy, security minimums, maintenance requirements, or must-have features.
   - Explain rejections briefly so the user can challenge assumptions.
5. Compare surviving candidates against the user's actual decision criteria using `references/evaluation-framework.md`.
   - Use Markdown tables for comparisons by default.
   - Start with the minimal comparison columns: latest update date, license, supported versions, dependencies, and library size.
   - Add requirement-fit columns only when they clarify the decision.
   - Use numeric scoring only when the user asks for it or when many acceptable candidates remain and the weighting assumptions are explicit.
   - When performance is a deciding factor, use `$benchmark-runner` after hard-filtering candidates. Pass the surviving candidates, representative workload, correctness requirements, runtime constraints, and meaningful decision threshold. Treat benchmark results as one input to the final recommendation, not as the recommendation itself.
6. Recommend one option, or a ranked shortlist when the decision depends on unresolved constraints.
7. Provide implementation guidance.
   - Installation command, minimal usage shape, integration risks, migration notes, and validation steps.
   - Mention lockfile, dependency review, license review, security scan, and proof-of-concept tests when appropriate.

## Research Rules

- Browse or otherwise verify facts that may have changed: releases, stars, downloads, maintainers, advisories, CVEs, licenses, roadmap status, performance claims, and compatibility.
- Do not rely on popularity alone. Treat popularity as one signal among project fit, maintenance, correctness, and operational risk.
- Distinguish facts from judgment. Use phrases such as "I infer" or "This suggests" for conclusions drawn from evidence.
- If only stale or incomplete evidence is available, say so and reduce confidence.
- Do not recommend a library with a license conflict unless the user explicitly accepts that risk.

## Output

For quick decisions, use this shape:

```markdown
## Recommendation

Choose [library]. It best fits [top reasons]. Confidence: [High/Medium/Low].

## Comparison

| Candidate | Latest Update | License | Supported Versions | Dependencies | Library Size | Transitive Risk |
|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... |

## Why Not The Others

- [Library]: [specific tradeoff or disqualifier].

## Next Steps

1. [Install or spike step].
2. [Validation step].
3. [Approval or rollout step].

## Sources Checked

- [Source name] - checked [YYYY-MM-DD]
```

For high-stakes or enterprise decisions, add:

- Decision context and assumptions.
- Hard filters and rejected candidates.
- Requirement fit matrix.
- License/security notes.
- Migration and rollback plan.
- Open questions that could change the recommendation.

## Boundaries

- Do not produce legal advice. For license-sensitive decisions, identify risk and recommend legal or compliance review.
- Do not claim a project is secure only because no advisory was found. Say that no relevant advisory was found in the checked sources.
- Do not overfit to benchmark numbers unless the benchmark matches the user's workload, runtime, hardware, and data shape.
