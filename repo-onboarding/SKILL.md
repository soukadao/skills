---
name: repo-onboarding
description: Quickly understand an unfamiliar software repository before making changes. Use when asked to inspect a new codebase, summarize repository structure, find setup or test commands, identify important files, explain architecture, prepare a first-pass implementation plan, or orient a developer before coding.
---

# Repo Onboarding

Use this skill to build a practical first mental model of a repository. The goal is not exhaustive documentation; the goal is to help the next action become obvious and safe.

## Workflow

1. Confirm the working directory and repository state.
   - Run `pwd`, `git status --short`, and `git rev-parse --show-toplevel` when available.
   - Notice dirty files, but do not revert or modify anything for onboarding.

2. Map the top level.
   - Prefer `rg --files` for file discovery.
   - Inspect the root file list, package manifests, lockfiles, config files, docs, and obvious entry points.
   - Ignore dependency/build output directories such as `node_modules`, `vendor`, `dist`, `build`, `.next`, `.turbo`, `.git`, and coverage artifacts.

3. Identify the stack and commands.
   - Read manifests such as `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, `composer.json`, `Makefile`, `justfile`, `Taskfile.yml`, `Dockerfile`, `docker-compose.yml`, and CI configs.
   - Extract install, dev, build, lint, typecheck, test, and deploy commands when present.
   - Distinguish commands that are explicit in files from commands inferred from framework conventions.

4. Find the application shape.
   - Locate runtime entry points, routing, API handlers, data models, persistence layers, shared libraries, tests, and configuration boundaries.
   - For monorepos, identify packages/apps and the workspace tool before summarizing individual projects.
   - For generated or framework-heavy repos, explain the framework convention briefly instead of listing every generated file.

5. Read selectively.
   - Read only enough source to explain the main data flow and where a likely change would happen.
   - Prefer key files over broad summaries: entry point, main app component/server, route registry, schema/model definitions, and test examples.
   - If README and code disagree, call out the mismatch and prefer code for current behavior.

6. Stop before implementation unless the user explicitly asks to continue.
   - Do not edit files during onboarding.
   - If the user asked for a plan, produce the plan after the orientation.
   - If the user asked to implement something, use the onboarding findings to choose a narrow first edit.

## Output

Keep the result concise and actionable. Include file links when referencing local files.

```markdown
**Repository Snapshot**
- Purpose:
- Stack:
- Shape:

**How To Run**
- Install:
- Develop:
- Test:
- Build:

**Key Files**
- [file](absolute/path:line): why it matters

**Architecture Notes**
- Main flow:
- Data/config boundaries:
- Tests:

**Watch Outs**
- Dirty worktree, missing docs, risky commands, generated files, or unclear ownership.

**Best Next Step**
- The single most useful next file, command, or question.
```

Omit empty sections rather than filling them with guesses.

## Quality Bar

- Separate facts from inferences.
- Mention uncertainty explicitly.
- Prefer three to eight key files over a long directory listing.
- Do not invent commands that are not supported by repository files unless clearly labeled as inferred.
- Do not run expensive, destructive, networked, deployment, migration, or credential-requiring commands as part of onboarding.
