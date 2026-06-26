---
name: ask-clarifying-questions
description: Ask concise clarifying questions before acting when a user request, task, spec, implementation instruction, file operation, design choice, or external action contains ambiguity that could cause rework, data loss, wrong scope, unwanted side effects, or a result the user cannot easily undo. Use when the user asks the agent to ask questions if anything is unclear, when requirements are incomplete, when multiple reasonable interpretations exist, or when a Claude Code-style AskUserQuestion workflow is desired. Prefer freeform clarification when exact intent matters; use options as helpful hypotheses, not as constraints on the user's real answer.
---

# Ask Clarifying Questions

## Overview

Use this skill to decide whether to pause and ask the user for clarification before continuing. The goal is to prevent risky guesses while avoiding unnecessary back-and-forth for details that can be discovered, inferred safely, or handled with a stated assumption.

## Decision Rule

Ask a question only when all of these are true:

- The missing answer materially changes the plan, output, scope, or side effects.
- The answer cannot be reliably discovered from local files, conversation context, tool output, or stable public facts.
- A wrong assumption would be costly, unsafe, user-visible, hard to undo, or likely to waste meaningful time.

Do not ask when the ambiguity is low risk. Instead, choose a reasonable default, state the assumption briefly, and continue.

## Workflow

1. Restate the actionable intent in one sentence for yourself.
2. Identify the decisions that are not yet specified.
3. Classify each missing decision:
   - Blocking: cannot proceed without likely doing the wrong thing.
   - Risky: can proceed, but the assumption should be visible.
   - Non-blocking: can infer, discover, or use the project default.
4. Ask only the blocking questions before acting.
5. Keep working on independent, reversible discovery while waiting only if that does not commit to the ambiguous decision.
6. After the user answers, reflect the decision in the plan or implementation and continue.

## Question Shape

Make every question easy to answer by including three parts:

1. The unclear point: what is missing or conflicting.
2. The consequence: what changes based on the answer.
3. The requested decision: what the user should choose or provide now.

Use this pattern:

```text
[Unclear point]. [Consequence]. [Requested decision]?
```

Examples:

- "The output destination is unclear. Overwriting can replace existing work, while a new file preserves it. Which output method should I use?"
- "The target environment is not specified. Production changes external state, while staging is safer for verification. Which environment should I deploy to?"
- "Two files define the schema differently. The choice changes nullable fields and migration behavior. Which source should I treat as authoritative?"

## What To Ask

Prioritize questions about:

- Scope: what is included, excluded, or highest priority.
- Target: which file, branch, environment, page, account, user group, data set, or artifact to change.
- Destructive or external actions: deleting, overwriting, deploying, sending, publishing, charging, contacting, or modifying production-like systems.
- Product decisions: behavior, copy, visual direction, business rule, acceptance criteria, or stakeholder preference.
- Security and privacy: credentials, permissions, personal data, retention, logging, or disclosure.
- Success criteria: how the user will judge the result when several valid outcomes exist.

Avoid asking about:

- Details that are already present in files, error logs, docs, or prior conversation.
- Implementation choices where the repository clearly has an existing pattern.
- Preferences that are easy to adjust later and not central to the request.
- Questions that only ask the user to confirm the agent's analysis instead of choosing a concrete direction.

## Answer Mode

Ask at most 3 questions at a time. Use 1 question whenever possible.

Write questions that can be answered with a concrete choice, value, threshold, owner, or yes/no decision. Include the consequence when it helps the user understand why the question matters.

Choose the answer mode based on how much precision the user likely needs:

- **Freeform first**: Use when the user may have a specific intent, wording, business rule, visual direction, acceptance criterion, policy, data source, URL, ID, name, or requirement that options could distort.
- **Options as hypotheses**: Use when the answer set is naturally limited and the options help the user understand the decision space.
- **Yes/no**: Use only for a truly binary decision, especially permission for a specific reversible or irreversible action.
- **Multiple select**: Use only when several choices can validly be selected together.

Do not force a user into options when the point of the question is to capture their original intent accurately. A slightly slower freeform answer is better than a fast answer that loses nuance.

When using options, frame them as suggested directions, not as the complete answer space. Make it explicit that the user can choose the closest option or provide a more exact answer.

When offering options:

- Make labels short, distinct, and action-oriented.
- Put the recommended option first and append `(Recommended)` to its label.
- Explain the trade-off in each option description.
- Treat `Other` or free text as a first-class path for the user's real answer, not as an exception or fallback.
- Do not add an `Other` option when the tool already provides one automatically; mention in the question text that the user can choose the closest option or specify a different answer if needed.
- Use `multiSelect` only when multiple choices can validly be selected together.
- Avoid false choices. If one option would be unsafe or outside scope, do not present it as equivalent.

Good:

- "Which environment should I deploy to: staging or production? This changes external state."
- "Should `orders.csv` be overwritten in place, or should I create a new output file?"
- "For mobile, should the sidebar collapse into a drawer or remain visible below the header?"
- "The exact empty-state copy is not specified. If you have preferred wording, provide it directly; otherwise I can use one of these directions."

Bad:

- "Can you clarify?"
- "What do you want?"
- "Is my understanding correct?"
- "Pick one of these options" when the user likely has a more precise answer.

## Using Input Tools

When a structured user-input tool is available and appropriate, use it for short blocking questions. Provide concise labels and options when the answer set is naturally limited.

For a Claude Code-style `AskUserQuestion` tool:

- Use it to gather preferences, clarify ambiguity, decide implementation direction, or offer choices during execution.
- Ask 1-4 questions per call, but prefer fewer.
- Provide 2-4 options per question only when structured choices fit the decision. If exact intent matters more than speed, ask directly in plain text or use a freeform-capable path.
- Use a short `header` that names the decision, such as `Destination`, `Environment`, `Scope`, or `Source`.
- Remember that the user can choose `Other` and type custom text. Phrase the question so custom text is welcome when the provided options are only approximate.
- If the tool supports option previews, use `preview` only when comparing concrete artifacts such as UI mockups, code snippets, diagrams, or configuration examples. Do not use previews for simple preference questions where labels and descriptions are enough.

If the tool supports auto-resolution and the question is helpful but non-blocking, set a reasonable default and continue after the timeout. Do not use auto-resolution for irreversible, destructive, production, security, privacy, financial, or user-contacting decisions.

When no structured input tool is available, ask the question directly in plain text and wait only if the answer is blocking.

## Proceeding With Assumptions

When continuing without a question, make the assumption visible only if it affects the result:

```markdown
Assumption: I will keep changes scoped to the existing component and avoid altering routes.
```

Do not list obvious assumptions or turn every minor choice into ceremony.

## Response Pattern

For blocking ambiguity, respond with only the question and enough context to answer it:

```markdown
Before I change this, which file should be treated as the source of truth: `schema.sql` or the migration history? They disagree on the nullable fields.
```

When using a choice-based question, shape it like this:

```markdown
Question: The output destination is unclear. Overwriting can replace existing work, while a new file preserves it. Which output method is closest to what you want? If none match, specify the exact destination.

Options:
- New file (Recommended): Create a separate output file and leave existing files unchanged.
- Overwrite: Update the existing file in place.
- Draft only: Prepare the content but do not write a file yet.
```

When precision matters more than speed, use a freeform question instead:

```markdown
The acceptance criterion for "fast" is not defined, and choosing a number for you could change the implementation and tests. What exact response-time target should I use?
```

For multiple blocking questions:

```markdown
I need two decisions before editing:

1. Should the export include archived records?
2. Should I overwrite `report.xlsx` or create a dated copy?
```

For non-blocking ambiguity:

```markdown
I will assume the existing design tokens are preferred and keep the changes within the current component.
```

## Plan Approval Boundary

Use clarifying questions to choose requirements or approaches before finalizing a plan. Do not use this skill to ask "Is this plan okay?", "Should I proceed?", "Does the plan look good?", or similar approval questions. Use the environment's plan-approval mechanism when one exists.

If the user cannot see the plan in the current UI, do not reference "the plan" inside a clarifying question. Ask about the concrete decision instead:

- Good: "Which authentication approach should I design around: OAuth, email magic links, or username/password?"
- Bad: "Does this plan for authentication look good?"

## Boundaries

- Do not use this skill to avoid doing discoverable work. Inspect local context first when feasible.
- Do not ask broad brainstorming questions when the user requested execution.
- Do not ask for permission for ordinary reversible edits inside the requested scope.
- Do ask before irreversible operations or external side effects unless the user explicitly requested that exact action.
- Keep questions short, specific, and tied to the next decision needed.
