---
name: commit-message
description: Use when preparing Git commits, staging related changes in focused chunks, or writing commit messages that follow the required lowercase conventional prefix format.
---

# Code Commit

## Commit Scope

- Group changes made for the same reason or intent into one commit.
- Do not split commits based only on file count or implementation steps.
- Separate changes made for different reasons or intents into different commits.
- Keep each commit independently revertible.
- Always use hunk-based staging with `git add --patch` to group changes into small, focused commits. When one file contains different intents, separate the relevant hunks; keep related hunks together when splitting them would break dependencies or make a commit incomplete.

## Commit Message

### Prefix

- build
- chore
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test

### Message

- Phrase the message as an action the commit performs, using a concrete verb such as add, change, remove, or their equivalent.
- Write the message text in the same language as the conversation unless the user specifies otherwise. Keep the prefix in the required lowercase English form.

### Message Example

```bash
# <prefix>: <message>

git commit -m "foo: some message" # fails(reason: no matched prefix)
git commit -m "Fix: some message" # fails(reason: prefix is lower case)
git commit -m ": some message"    # fails(reason: prefix empty)
git commit -m "fix:"              # fails(reason: message empty)
git commit -m "fix: SomeMessage"  # fails(reason: message is lower case)
git commit -m "fix: some message" # passes
```
