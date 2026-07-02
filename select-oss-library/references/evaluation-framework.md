# OSS Library Evaluation Framework

Use this framework to decide whether a library matches the user's situation. Do not let a high aggregate score hide a missing requirement. A candidate that fails a must-have constraint should be rejected, not compensated by popularity or good maintenance.

## Decision Order

1. Define must-have requirements.
2. Reject candidates that fail must-have requirements or unacceptable risks.
3. Compare remaining candidates on tradeoffs that matter to this project.
4. Recommend the smallest dependable option that satisfies the requirements with acceptable long-term risk.
5. Use numeric scoring only as a tie-breaker or when the user explicitly asks for a weighted evaluation.

## Must-Have Fit

Treat these as pass/fail unless the user says otherwise:

| Area | What To Check |
|---|---|
| Required capability | The library directly supports the core use case without substantial custom code. |
| Runtime and platform | Language version, runtime, browser/server/mobile target, OS, framework, and deployment environment are supported. |
| Integration shape | API style, types, build tooling, package manager, bundler, and existing architecture fit the project. |
| License | License is acceptable for the intended use, distribution model, and organization policy. |
| Security | No known unmitigated vulnerability materially affects the intended use. |
| Maintenance | Project is not deprecated, archived, abandoned, or incompatible with maintained dependencies. |

## Tradeoff Criteria

Use these after must-have checks:

| Criterion | How To Compare |
|---|---|
| Functional fit | Required features, API ergonomics, extensibility, edge cases, correctness model, documentation examples. |
| Maintenance health | Recent releases, issue/PR activity, maintainer responsiveness, bus factor, release cadence, deprecation signals. |
| Ecosystem fit | Compatibility with surrounding framework, conventions, plugins, examples, and team familiarity. |
| Security posture | Advisory history, dependency footprint, security policy, vulnerability response, risky transitive dependencies. |
| Operational cost | Bundle size, performance, resource use, observability, upgrade effort, migration cost, support burden. |
| Governance | Ownership, foundation backing, commercial backing, funding, CLA, roadmap clarity. |
| Community signal | Adoption, downloads, credible production users, ecosystem references, tutorials. Treat this as supporting evidence, not proof of fit. |

## Hard Filters

Reject before comparison when any of these are true:

- License conflicts with the user's intended use or organization policy.
- Required runtime, platform, framework, browser, or language version is unsupported.
- The project is deprecated, archived, abandoned, or recommends a different successor.
- A relevant known vulnerability has no available mitigation for the user's use case.
- Must-have functionality is absent or would require substantial custom code.
- The library cannot be installed, built, or operated in the user's environment.

## Evidence Checklist

Prefer primary sources:

- Repository: README, license file, releases, commits, issues, PRs, security policy.
- Official documentation: supported versions, compatibility matrix, migration guides.
- Package registry: latest version, publish date, dependency tree, install stats when meaningful.
- Security sources: GitHub Security Advisories, OSV, npm audit/PyPI advisories/RustSec/etc. as relevant.
- Framework or vendor docs: recommended integrations and compatibility notes.

When using secondary sources such as blog posts or benchmarks, include why they are relevant and whether they match the user's context.

## Transitive Dependency Review

Review nested dependencies when the user asks about dependency impact, when a package has many dependencies, or when the decision is security-sensitive.

Prefer language-agnostic or SBOM-based tools when possible:

| Tool | Best Use | Notes |
|---|---|---|
| OSV-Scanner | Check known vulnerabilities across many ecosystems, lockfiles, vendored deps, and SBOMs. | Good lightweight default for vulnerability checks. |
| Syft + Grype | Generate SBOMs from directories/images, then scan SBOMs or filesystems for vulnerabilities. | Good when comparing package inventories or container contents. |
| Trivy | Scan filesystems, Git repositories, container images, SBOMs, IaC, secrets, licenses, and Kubernetes targets. | Good all-in-one CLI for CI checks. |
| OWASP Dependency-Track | Continuously monitor CycloneDX SBOMs across projects. | Good for portfolio-level tracking, not just one-off selection. |
| ScanCode Toolkit | Deep license, copyright, package, and dependency inventory. | Good for license/compliance-heavy decisions. |
| OWASP Dependency-Check | SCA vulnerability reports for multiple ecosystems. | Useful but check ecosystem coverage and false-positive behavior for the project. |

For npm packages:

```bash
npm view <package> dependencies
npm view <package> dist-tags versions time license engines dist.unpackedSize
mkdir -p /tmp/oss-check && cd /tmp/oss-check
npm init -y
npm install <package> --package-lock-only
npm ls --all --json
npm audit --json
```

Use the generated lockfile or dependency tree to inspect:

- Security advisories affecting direct or transitive packages.
- Transitive packages with no recent release or very old latest publish date.
- Deprecated packages.
- Unexpectedly large dependency count or large installed footprint.
- License conflicts in nested dependencies when license risk matters.
- Duplicate major versions that may increase bundle size or maintenance risk.

Report only decision-relevant findings. Avoid listing every nested package unless the user asks for the full tree.

Suggested nested-risk table:

```markdown
| Candidate | Transitive Dependencies | Security Findings | Stale/Deprecated Findings | Impact |
|---|---:|---|---|---|
| lib-a | 0 | None found in checked sources | None found | Low |
| lib-b | 24 | 1 moderate advisory in transitive package | 3 packages not updated in 3+ years | Needs mitigation before adoption |
```

If using `npm audit`, mention that results depend on the package manager, registry advisory data, and resolved versions at the time of the check.

## Interpreting Signals

- Requirement match beats general quality. A well-maintained library is still wrong if it does not fit the needed use case.
- Recent activity matters more than lifetime stars.
- A small focused library can be preferable to a popular framework when the need is narrow.
- A large dependency graph increases supply-chain and upgrade risk.
- Low issue count can mean stability or low adoption; inspect release history and usage context.
- High download counts can be inflated by transitive dependency use.
- Benchmarks are only decisive when performance is a primary requirement and the workload matches.

## Optional Tie-Breaker Scoring

Use scores only when several candidates pass must-have checks and the tradeoffs are still hard to compare. Keep the score visibly subordinate to the reasoning.

Suggested weights when scoring is useful:

| Criterion | Weight |
|---|---:|
| Functional fit | 35 |
| Maintenance health | 20 |
| Ecosystem fit | 15 |
| Security posture | 15 |
| Operational cost | 10 |
| Community signal | 5 |

Before showing a score table, state:

- Which candidates already passed must-have checks.
- Which weights were used.
- Which assumptions could change the result.

## Output Notes

Prefer Markdown tables over prose-only comparison. Start with a recommendation, then show this minimal table first:

```markdown
| Candidate | Latest Update | License | Supported Versions | Dependencies | Library Size | Transitive Risk |
|---|---|---|---|---|---|---|
| lib-a | YYYY-MM-DD | MIT | Node >=18 / browser | 0 runtime deps | 12 kB min+gzip | Low |
| lib-b | YYYY-MM-DD | Apache-2.0 | Node >=20 | 3 runtime deps | 28 kB min+gzip | Review needed |
```

Use these conventions:

- Latest Update: use latest release date when available; otherwise use latest commit date and label it.
- License: use the package metadata plus repository license file when available.
- Supported Versions: show runtime, framework, or language versions relevant to the user's project.
- Dependencies: show runtime dependencies, not dev-only dependencies, unless dev dependencies affect adoption.
- Library Size: prefer minified + gzip browser size for frontend libraries; otherwise use unpacked package size or installed size and label the metric.
- Transitive Risk: summarize nested dependency concerns such as advisories, deprecated packages, stale packages, license conflicts, or high dependency count.
- Unknown data: write `Unknown` or `Not published`; do not infer exact values.

Add a requirement fit matrix only when the user's requirements are numerous or ambiguous.

Requirement fit matrix:

```markdown
| Candidate | [Must-have requirement] | [Important requirement] | [Constraint] | [Risk tolerance] | Notes |
|---|---|---|---|---|---|
| lib-a | Pass | Pass | Pass | Partial | Meets core needs; watch bundle size. |
| lib-b | Pass | Partial | Pass | Pass | Good fallback if advanced feature is not needed. |
| lib-c | Fail | Pass | Pass | Pass | Reject because it misses a must-have requirement. |
```

Verdict table:

```markdown
| Candidate | Must-Have Fit | Main Strength | Main Risk | Verdict |
|---|---|---|---|---|
| lib-a | Pass | Best framework integration | Larger bundle | Recommended |
| lib-b | Pass | Small and simple | Weaker maintenance signal | Acceptable fallback |
| lib-c | Fail: unsupported runtime | Popular ecosystem option | Cannot run in target environment | Reject |
```

End with a confidence level:

- High: requirements are clear, primary evidence is current, and one candidate clearly fits best.
- Medium: evidence is current but tradeoffs depend on user priorities.
- Low: missing constraints, stale evidence, or candidates are close.
