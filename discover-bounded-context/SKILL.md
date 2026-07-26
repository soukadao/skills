---
name: discover-bounded-context
description: Fact-based interactive domain-analysis workflow for discovering Bounded Contexts from requirements, business documents, user stories, interviews, code, schemas, and event flows. Extract context-specific language, actors, commands, events, states, rules, ownership, and integrations; identify unsupported or conflicting claims; ask one unresolved question at a time; and produce traceable Context Cards, a glossary, a Context Map, source references, and open decisions. Use when modeling a domain from incomplete documentation, clarifying requirements while designing, finding Bounded Context boundaries, or stress-testing a DDD/domain model.
---

# Discover Bounded Context

Discover Bounded Contexts by combining evidence-driven domain analysis with a one-question-at-a-time interview. Treat missing context as a modeling artifact, not as permission to invent business rules.

## Core Objective

Turn incomplete domain material into a traceable, reviewable set of:

- context-specific terms and meanings;
- actors, roles, entities, value objects, commands, events, states, and rules;
- candidate Bounded Contexts and their responsibilities;
- relationships, translations, events, and dependencies between contexts;
- explicit facts, source references, assumptions, unknowns, and open decisions.

Do not treat a Bounded Context as a synonym for a microservice, database, team, or deployment unit. Establish the language and model boundary first; discuss physical architecture only after the source facts and unresolved decisions for the requested scope are recorded.

## Operating Rules

- Ask **one question at a time**. Do not present a questionnaire unless the user explicitly requests a batch.
- Select the next unresolved question using the fixed order in [question-catalog.md](references/question-catalog.md): target and meaning, actor and authority, trigger and timing, state and lifecycle, rule owner and consistency, result and event, side effects and integrations, vocabulary, ownership, and physical architecture only when requested.
- State a source-supported interpretation only when an explicit source supports one interpretation. Otherwise ask the question, list the alternatives, and do not provide a preferred answer. Never present an interpretation as an agreed business rule without a source or user decision.
- If the answer can be found in supplied files, code, schemas, diagrams, or document context, inspect those sources before asking the user.
- Separate `Fact`, `Inferred`, `Assumption`, and `Unknown`. Keep competing interpretations until evidence or a decision resolves them.
- Put only `Fact` items and explicit user decisions in the settled model. Put `Inferred` and `Assumption` items under candidate interpretations, and put `Unknown` items under open questions.
- Preserve source traceability. Link every important term, rule, event, and boundary claim to a document section, file path, line, interview answer, or explicit user decision when available.
- Use evidence statements instead of subjective evaluations. Do not write `可能性が高い`, `自然`, `妥当`, `まずは`, `基本的に`, `〜と考えられる`, or equivalent hedging unless the source explicitly contains that judgment. Replace them with the cited observation, alternatives, and `Unknown` or `Inferred` status.
- Ask for a concrete decision, not approval of the analysis. Do not ask “Does this look right?” when the actual missing decision can be stated directly.
- Use the user's language for domain terms. Introduce English names only when needed for code or integration mapping.
- Do not convert every noun into a class. Model the role, identity, lifecycle, rules, and ownership of each concept.
- Propose a Context boundary only when at least one documented difference exists in vocabulary, rules, lifecycle, transaction scope, ownership, change trigger, or integration contract.
- Keep every unresolved question visible. Do not convert an unsupported interpretation into a fact or an agreed boundary.

## Workflow

### 1. Establish Scope and Evidence

Identify:

- domain and business goal;
- in-scope actors, workflows, systems, and documents;
- desired output: candidate map, validated map, domain model, glossary, or architecture input;
- evidence sources and their authority;
- constraints such as existing teams, systems, compliance, or migration requirements.

If the request is underspecified but exploration is safe, state the missing scope and a reversible assumption before beginning. Ask before proceeding when the missing scope changes the source statements or requested artifact.

### 2. Normalize the Source into Context Units

Before analysis, assign stable source IDs to paragraphs or bullets, such as `R-001`, `R-002`, and `R-003`. Preserve explicit section and bullet identifiers when they exist. Cite these IDs in every extracted fact, rule, event, and boundary claim. If no stable ID can be created, cite an exact quote instead of inventing a requirement number.

Split each paragraph or bullet into one atomic business assertion when it contains multiple independent targets, actions, state transitions, rules, triggers, or outcomes. Preserve the original source ID as the parent ID and assign alphabetic suffixes in source order, such as `R-006a` and `R-006b`. Record causal or dependency links between derived assertions.

For example:

```text
R-006a: 主催者はイベントを中止または延期できる。
R-006b: イベントが中止された場合、参加費を返金する。
R-006b depends on R-006a
```

Capture each atomic statement using this shape:

```text
Derived ID:
Parent source ID / quote:
Depends on:
Actor / role:
Trigger:
Intent / command:
Target:
Preconditions:
Action:
Observable result:
Domain event:
State transition:
Rule / exception:
Time or ordering:
External participant:
Evidence status: Fact | Inferred | Assumption | Unknown
```

Use linguistic signals as clues, not as final decisions:

| Source signal | Modeling clue |
|---|---|
| `AがBをする` | actor, command, target, responsibility |
| `Bされた` | domain event or recorded fact |
| `〜の場合だけ`, `〜してはならない` | invariant, policy, authorization rule |
| `〜になる`, `〜へ進む` | state and transition |
| `AがBを含む` | ownership, composition, aggregate candidate |
| `外部の〜`, `〜と連携する` | context boundary or integration |
| `〜として扱う`, `〜と呼ぶ` | context-specific vocabulary |

### 3. Detect Context Gaps and Conflicts

For each unit, mark missing or conflicting slots. Always check:

- **Actor**: who acts, owns, approves, or receives the result?
- **Target**: what exactly changes—an event, registration, ticket, payment, or another relationship?
- **Authority**: which roles may perform the action?
- **Trigger and timing**: when is it allowed, required, retried, or expired?
- **State**: what states exist and which transitions are valid?
- **Rule owner**: which business area decides eligibility, price, capacity, refund, or approval?
- **Result**: which business fact is created, changed, or rejected?
- **Side effects**: which notification, payment, inventory, or fulfillment action follows?
- **Vocabulary**: does the same term have different meanings in different areas?
- **Source of truth**: which document, system, or role owns the definition?

Queue unresolved slots using the fixed question order. Do not assign subjective severity or confidence labels. Keep the source ID, missing slot, candidate interpretations, and next question in the gap record.

When summarizing a boundary, use this form:

```text
Source-supported observation: [What the cited sources explicitly describe]
Unresolved decision: [What has not been decided]
Evidence status: Fact | Inferred | Assumption | Unknown
```

### 4. Interview One Question at a Time

Maintain a decision queue. For the next unresolved item in the fixed question order, present:

```markdown
### Question
[One concrete question]

**Source-supported interpretation:** [State only when an explicit source supports one interpretation]
**Evidence:** [Source or reasoning]
**Alternatives requiring a decision:** [Other interpretations]
**Impact:** [Specific model field, state, rule, or relationship affected]
```

After the user answers:

1. Record the answer as a decision with its source and date or conversation turn.
2. Promote or revise the affected facts, terms, rules, and context candidates.
3. Remove resolved questions and recompute dependent questions.
4. Show only the next unresolved question in the fixed order unless the user asks for a summary.

For a sentence such as `ユーザーがイベントの参加をキャンセルする`, do not immediately choose a model. First distinguish at least:

- participant cancelling their own registration;
- organizer cancelling the event;
- administrator cancelling someone else's registration.

The first question should identify the target and authority because each interpretation can lead to a different Context and lifecycle.

### 5. Form Context Candidates

Cluster concepts by the model that uses one consistent language and rules. Record source-backed evidence for each candidate using:

1. **Purpose**: what named business outcome or responsibility is stated in the source?
2. **Language**: are key terms unambiguous within the candidate?
3. **Rules**: who owns the decisions and invariants?
4. **Lifecycle**: do the important states and transitions belong together?
5. **Consistency**: what must change atomically?
6. **Ownership**: which role, team, or business capability is accountable?
7. **Change trigger**: which named requirement, event, or policy changes each concept?
8. **Integration**: where is translation or asynchronous communication required?

Documented boundary evidence:

- the same word has different definitions or attributes;
- different actors use the same term for different purposes;
- separate lifecycles or policies govern the concepts;
- the concepts are changed by different named requirements or business events;
- a translation, event, or reconciliation step is already present;
- one area must not directly own another area's decisions.

Documented evidence for keeping concepts together:

- the same terms, rules, and lifecycle are used;
- concepts must remain consistent in one business transaction;
- the same stated rule, lifecycle, and transaction must be applied atomically.

Treat organizational or system boundaries as source facts only. Do not use a team or database boundary as the sole basis for a Context boundary.

### 6. Build the Context Map

For every proposed relationship, record:

```text
Upstream Context:
Downstream Context:
Business meaning of the exchange:
Published language / event / API:
Translation or anti-corruption layer:
Consistency and timing:
Failure or reconciliation behavior:
Evidence:
```

Prefer domain events for facts that have occurred. Do not force shared entities across contexts. A `User` in identity, a `Participant` in event registration, and a `Payer` in payment may refer to the same person while remaining different models.

### 7. Produce and Maintain the Artifacts

Keep these artifacts synchronized after every user answer that resolves or adds a fact.

#### Context Card

```markdown
## [Context name]

- Purpose:
- Business capability / value stream:
- Primary actors and roles:
- Ubiquitous language:
- In-scope concepts:
- Commands / use cases:
- Domain events:
- States and invariants:
- Owned decisions and data:
- Upstream / downstream contexts:
- Translation mechanism:
- Evidence:
- Open questions:
```

#### Term Entry

```markdown
| Term | Context | Meaning | Includes | Excludes | Aliases | Source | Evidence status |
|---|---|---|---|---|---|---|---|
```

#### Decision Log

```markdown
| Decision | Chosen interpretation | Alternatives rejected or retained | Evidence | Impact |
|---|---|---|---|---|
```

#### Context Map

Use a table for traceability. Add a diagram only when the user requests it or when it represents relationships already supported by the table:

```markdown
| Upstream | Downstream | Contract / event | Translation | Consistency | Evidence | Evidence status |
|---|---|---|---|---|---|---|
```

#### Context Candidate

```markdown
| Candidate | Source IDs / quotes | Stated responsibility | Evidence status | Open questions |
|---|---|---|---|---|
```

### 8. Validate Before Closing

Stop the interview when:

- every in-scope scenario has an actor, trigger, action, result, and failure path;
- key terms have a meaning within a named Context;
- every stated rule has an owner or is listed as unknown;
- important state transitions are explicit;
- each Context has a named purpose, listed terms, and at least one command, event, state, or rule;
- Context relationships have contracts, timing, and translation recorded;
- every unknown is listed as an open question or an explicitly accepted assumption;
- remaining unresolved questions are listed for later confirmation.

Replay the original scenarios against the proposed map. If a scenario requires a Context to know another Context's private rules or data, revisit the boundary.

## Output Modes

Select the output mode from the user's request and the available source facts:

- **Interview mode**: one question, source-supported interpretation when available, alternatives, evidence, and impact.
- **Triage mode**: initial candidates, context gaps, source references, and next question.
- **Synthesis mode**: Context Cards, glossary, Context Map, decisions, assumptions, and open questions.
- **Review mode**: challenge boundaries, duplicated terms, hidden coupling, and unowned rules.

When the user supplies only a short sentence, begin in Triage mode and ask the first question in the fixed order. When the user requests a final model or says the interview is complete, switch to Synthesis mode.

## Guardrails

- Do not invent refund, authorization, timing, retention, or notification rules.
- Do not confuse a domain event with a command: `CancelParticipation` is an intent; `ParticipationCanceled` is a recorded fact.
- Do not confuse an event cancellation with cancellation of participation in an event.
- Do not force a single global `User`, `Order`, `Product`, or `Event` model when meanings differ.
- Do not prescribe microservices, databases, or team ownership solely from a Context Map.
- Do not convert competing hypotheses into facts or agreed boundaries.
- Do not use subjective conclusions such as "likely", "natural", "appropriate", or "for now" in place of source evidence. State the observation and ask about the unresolved decision.
- When evidence conflicts, show the conflict and ask which source or domain owner is authoritative.

## Reference Material

Load [question-catalog.md](references/question-catalog.md) when choosing questions, classifying missing context, or reviewing whether an interview has covered the important boundary decisions.
