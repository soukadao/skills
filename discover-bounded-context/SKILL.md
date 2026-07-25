---
name: discover-bounded-context
description: Interactive domain-analysis workflow for discovering Bounded Contexts from requirements, business documents, user stories, interviews, code, schemas, and event flows. Extract context-specific language, actors, commands, events, states, rules, ownership, and integrations; detect missing or conflicting context; ask one high-impact question at a time with a recommended answer; and produce traceable Context Cards, a glossary, a Context Map, assumptions, and unresolved decisions. Use when modeling a domain from incomplete documentation, clarifying requirements while designing, finding Bounded Context boundaries, or stress-testing a DDD/domain model.
---

# Discover Bounded Context

Discover Bounded Contexts by combining evidence-driven domain analysis with a one-question-at-a-time interview. Treat missing context as a modeling artifact, not as permission to invent business rules.

## Core Objective

Turn incomplete domain material into a traceable, reviewable set of:

- context-specific terms and meanings;
- actors, roles, entities, value objects, commands, events, states, and rules;
- candidate Bounded Contexts and their responsibilities;
- relationships, translations, events, and dependencies between contexts;
- explicit assumptions, confidence levels, evidence, and open decisions.

Do not treat a Bounded Context as a synonym for a microservice, database, team, or deployment unit. Establish the language and model boundary first; discuss physical architecture only after the domain boundary is sufficiently understood.

## Operating Rules

- Ask **one question at a time**. Do not present a questionnaire unless the user explicitly requests a batch.
- Select the highest-impact unresolved question: prioritize ambiguity that could change the target, actor authority, lifecycle, rule owner, or Context boundary.
- State a recommended answer for every question, explain the evidence, and describe the consequence of choosing it. Let the user provide a different answer.
- If the answer can be found in supplied files, code, schemas, diagrams, or document context, inspect those sources before asking the user.
- Separate `Fact`, `Inferred`, `Assumption`, and `Unknown`. Keep competing interpretations until evidence or a decision resolves them.
- Preserve source traceability. Link every important term, rule, event, and boundary claim to a document section, file path, line, interview answer, or explicit user decision when available.
- Ask for a concrete decision, not approval of the analysis. Do not ask “Does this look right?” when the actual missing decision can be stated directly.
- Use the user's language for domain terms. Introduce English names only when needed for code or integration mapping.
- Do not convert every noun into a class. Model the role, identity, lifecycle, rules, and ownership of each concept.
- Prefer a small number of cohesive contexts. Split only when language, purpose, rules, lifecycle, ownership, consistency, or change reasons materially differ.
- Keep unresolved low-impact questions visible in the output instead of blocking progress unnecessarily.

## Workflow

### 1. Establish Scope and Evidence

Identify:

- domain and business goal;
- in-scope actors, workflows, systems, and documents;
- desired output: candidate map, validated map, domain model, glossary, or architecture input;
- evidence sources and their authority;
- constraints such as existing teams, systems, compliance, or migration requirements.

If the request is underspecified but exploration is safe, state a narrow assumption and begin. Ask before proceeding only when the missing scope would produce materially different models.

### 2. Normalize the Source into Context Units

Break prose, scenarios, and event flows into atomic statements. Capture each statement using this shape:

```text
Source:
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

Classify each gap as `Blocker`, `High`, `Medium`, or `Low`. Ask about Blocker and High gaps first.

### 4. Interview One Question at a Time

Maintain a decision queue. For the highest-priority item, present:

```markdown
### Question
[One concrete question]

**Recommended answer:** [Best current interpretation]
**Evidence:** [Source or reasoning]
**Why it matters:** [Model or boundary consequence]
```

After the user answers:

1. Record the answer as a decision with its source and date or conversation turn.
2. Promote or revise the affected facts, terms, rules, and context candidates.
3. Remove resolved questions and recompute dependent questions.
4. Show only the next highest-impact question unless the user asks for a summary.

For a sentence such as `ユーザーがイベントの参加をキャンセルする`, do not immediately choose a model. First distinguish at least:

- participant cancelling their own registration;
- organizer cancelling the event;
- administrator cancelling someone else's registration.

The recommended first question should identify the target and authority because each interpretation can lead to a different Context and lifecycle.

### 5. Form Context Candidates

Cluster concepts by the model that can use one consistent language and rules. For each candidate, evaluate:

1. **Purpose**: what business outcome does it optimize or protect?
2. **Language**: are key terms unambiguous within the candidate?
3. **Rules**: who owns the decisions and invariants?
4. **Lifecycle**: do the important states and transitions belong together?
5. **Consistency**: what must change atomically?
6. **Ownership**: which role, team, or business capability is accountable?
7. **Change reason**: would the same business change affect all concepts?
8. **Integration**: where is translation or asynchronous communication required?

Strong split signals:

- the same word has different definitions or attributes;
- different actors use the same term for different purposes;
- separate lifecycles or policies govern the concepts;
- the concepts change for different business reasons;
- a translation, event, or reconciliation step is already present;
- one area must not directly own another area's decisions.

Strong merge signals:

- the same terms, rules, and lifecycle are used;
- concepts must remain consistent in one business transaction;
- splitting would create constant synchronous coordination without a meaningful model boundary.

Treat organizational or system boundaries as evidence, not proof. A team or database boundary can be a useful clue but cannot replace semantic and business evidence.

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

Keep these artifacts synchronized after every meaningful answer.

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
- Confidence: High | Medium | Low
- Open questions:
```

#### Term Entry

```markdown
| Term | Context | Meaning | Includes | Excludes | Aliases | Source | Status |
|---|---|---|---|---|---|---|---|
```

#### Decision Log

```markdown
| Decision | Chosen interpretation | Alternatives rejected or retained | Evidence | Impact |
|---|---|---|---|---|
```

#### Context Map

Use a table for traceability and a compact diagram when helpful:

```markdown
| Upstream | Downstream | Contract / event | Translation | Consistency | Evidence |
|---|---|---|---|---|---|
```

### 8. Validate Before Closing

Stop the interview when:

- every in-scope scenario has an actor, trigger, action, result, and failure path;
- key terms have a meaning within a named Context;
- high-impact rules have an owner;
- important state transitions are explicit;
- each Context has a coherent purpose and language;
- Context relationships have contracts, timing, and translation recorded;
- no high-impact unknown remains hidden as an assumption;
- remaining low-impact questions are listed for later confirmation.

Replay the original scenarios against the proposed map. If a scenario requires a Context to know another Context's private rules or data, revisit the boundary.

## Output Modes

Choose the smallest useful output for the current stage:

- **Interview mode**: one question, recommendation, evidence, and impact.
- **Triage mode**: initial candidates, context gaps, confidence, and next question.
- **Synthesis mode**: Context Cards, glossary, Context Map, decisions, assumptions, and open questions.
- **Review mode**: challenge boundaries, duplicated terms, hidden coupling, and unowned rules.

When the user supplies only a short sentence, begin in Triage mode and ask the first high-impact question. When the user requests a final model or says the interview is complete, switch to Synthesis mode.

## Guardrails

- Do not invent refund, authorization, timing, retention, or notification rules.
- Do not confuse a domain event with a command: `CancelParticipation` is an intent; `ParticipationCanceled` is a recorded fact.
- Do not confuse an event cancellation with cancellation of participation in an event.
- Do not force a single global `User`, `Order`, `Product`, or `Event` model when meanings differ.
- Do not prescribe microservices, databases, or team ownership solely from a Context Map.
- Do not hide uncertainty behind polished diagrams. Mark provisional boundaries and competing hypotheses.
- When evidence conflicts, show the conflict and ask which source or domain owner is authoritative.

## Reference Material

Load [question-catalog.md](references/question-catalog.md) when choosing questions, classifying missing context, or reviewing whether an interview has covered the important boundary decisions.
