---
name: local-dev-troubleshooter
description: Diagnose and resolve local development environment failures. Use when Codex needs to debug install, build, test, dev-server, Docker/Compose, database, environment variable, port conflict, dependency, package manager, language runtime, or toolchain problems on a user's machine or in a local repository.
---

# Local Dev Troubleshooter

## Workflow

Use a small, evidence-driven loop. Prefer the repository's documented setup commands over guessed commands.

1. Establish the failing command, exact error, working directory, OS/shell, and whether the failure is new or persistent.
2. Inspect project setup files before changing anything: README, AGENTS.md, package manager files, lockfiles, Docker files, env examples, Makefile, task runners, language runtime files, and CI config.
3. Reproduce the failure with the narrowest relevant command. Capture the first meaningful error and avoid chasing downstream noise.
4. Classify the failure before fixing it:
   - Missing tool or wrong runtime version
   - Dependency install or lockfile mismatch
   - Environment variable or secret missing
   - Port, socket, or background process conflict
   - Database, cache, queue, or Docker service unavailable
   - Build cache, generated artifact, or stale state problem
   - Test fixture, migration, seed, or external service assumption
   - Network, certificate, proxy, permission, or filesystem issue
5. Make the smallest reversible fix that matches the evidence. Do not delete lockfiles, dependency directories, volumes, databases, or caches unless the user requested cleanup or the evidence clearly points there.
6. Verify with the original failing command, then one adjacent command when useful, such as a test, typecheck, health check, or dev-server request.
7. Report the root cause, the fix, the commands run, and any residual risk or manual step.

## Investigation Commands

Use these as starting points, adapting to the repository.

```bash
pwd
git status --short
rg --files -g 'README*' -g 'AGENTS.md' -g 'package.json' -g 'pnpm-lock.yaml' -g 'yarn.lock' -g 'package-lock.json' -g 'Dockerfile*' -g 'docker-compose*.yml' -g '.env*' -g 'Makefile' -g 'mise.toml' -g '.tool-versions' -g '.node-version' -g '.python-version'
```

For port conflicts:

```bash
lsof -nP -iTCP -sTCP:LISTEN
```

For background dev servers, do not leave sessions running unless the user needs them. If a server must stay running, tell the user the URL and process/session state.

## Fix Discipline

- Prefer documented commands such as `make setup`, `pnpm install`, `docker compose up`, or `mise install` when present.
- Prefer package-manager consistency. If a lockfile exists, use the matching package manager unless repository docs say otherwise.
- Check version managers before installing global tools: mise, asdf, nvm, volta, pyenv, rbenv, rustup, goenv.
- Treat `.env` and secrets carefully. Read examples and variable names, but do not print secret values in the final answer.
- Avoid broad cleanup commands as first-line fixes: `rm -rf node_modules`, `docker system prune`, deleting volumes, resetting databases, or reinstalling toolchains.
- If dependency installation changes lockfiles, inspect the diff and explain why it changed.
- When a fix requires a destructive or high-blast-radius action, ask before running it.

## Reference Routing

Read `references/checklists.md` when the failure involves a specific ecosystem, a vague local setup problem, or a recurring issue such as ports, Docker, env vars, package managers, databases, or certificates.
