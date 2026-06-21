---
name: test-commit-revert
description: Apply Test && Commit || Revert (TCR) to coding work through tiny, verified increments. Use when the user asks for TCR, test-commit-revert, test-and-commit, always-green development, or implementation where every passing change must be committed and every failing change discarded.
---

# Test Commit Revert

Keep the repository green by repeating one strict loop:

```text
make one tiny change -> run verification -> commit on success, restore on failure
```

Treat a failed increment as information. Restore it instead of debugging by piling more changes onto it, then attempt a smaller or structurally easier increment.

## Preflight

1. Locate the repository root and inspect `git status --short`.
2. Identify the files likely to change and the repository's test commands from its own documentation and configuration.
3. Refuse to start a strict TCR cycle when a target file already differs from `HEAD`; committing that file could include pre-existing work. Leave unrelated dirty files untouched.
4. Run the selected verification command before editing. Stop if the baseline is red and report the existing failure separately.
5. Define the verification command and one observable outcome for the next increment.

Never use `git reset --hard`, `git clean`, broad checkout/restore commands, or a stash that includes user work.

## Choose An Increment

Select one change that can plausibly pass immediately. Prefer, in order:

1. Add a passing characterization or regression test without changing behavior.
2. Add the smallest passing test and a deliberately minimal implementation.
3. Replace a fake or narrow implementation with a better passing implementation.
4. Make a hard behavior change easy through a behavior-preserving refactor.

Keep one intent per increment. If the change needs several explanations joined by "and", reduce it further.

## Run One TCR Cycle

1. Record the exact contents and existence of every file the increment may modify. Use this as the cycle-local checkpoint.
2. Make only the planned change.
3. Inspect the diff. Remove unrelated edits before testing.
4. Run the predefined verification command without changing its scope after seeing the result.
5. Follow exactly one branch:
   - **Pass:** stage only the increment's explicit paths, inspect the staged diff, and commit it.
   - **Fail:** restore the checkpointed contents, remove only files created by this increment, and verify that the pre-cycle state is restored.
6. Start a new cycle. Never combine a failed increment with the next attempt.

Use the repository's commit convention. When none exists, use a lowercase conventional prefix such as `test:`, `refactor:`, `feat:`, or `fix:` followed by a concrete action.

## Verification Scope

Use the fastest command that fully protects the increment's contract. A focused test is sufficient only when repository guidance permits it and the affected behavior is isolated. Run broader required checks before declaring the overall request complete.

Do not weaken, skip, delete, or rewrite a valid failing test merely to obtain a green result. Changing an incorrect test expectation must be its own justified increment.

## Failure Strategy

After a revert, choose one response:

- Split the increment into a smaller observable behavior.
- Add a characterization test first.
- Perform a behavior-preserving refactor that makes the change local.
- Replace an assumption with a repository inspection or focused experiment.

If the same approach fails twice, do not repeat it unchanged. Explain the learned constraint and choose a different increment.

## Completion

Finish only when:

- Every retained increment has a passing verification result and its own commit.
- The final required test suite passes.
- `git status --short` contains no new uncommitted changes from the TCR work.
- Pre-existing unrelated changes remain untouched.

Report the commit hashes and verification commands. Also report any pre-existing changes or tests that prevented strict TCR execution.
