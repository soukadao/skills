---
name: spec-ambiguity-finder
description: Review specifications, requirements, PRDs, GitHub issues, acceptance criteria, API contracts, UI behavior notes, and meeting notes to find ambiguous, incomplete, conflicting, or untestable requirements before implementation or QA. Use when the user asks to inspect a spec for unclear wording, missing edge cases, undefined actors or states, weak acceptance criteria, implementation risks, or questions to ask stakeholders.
---

# Spec Ambiguity Finder

Use this skill to turn a draft requirement into a focused ambiguity review. The goal is not copyediting; the goal is to expose places where implementers, reviewers, QA, support, or stakeholders could reasonably make different choices.

## Workflow

1. Preserve the stated scope.
   - Identify the product area, user role, operation, data object, and expected business outcome when available.
   - Do not expand the feature beyond the supplied text.
   - If context is missing, review the spec as written and list the assumption.
2. Normalize each requirement into this shape:
   - Actor: who does it or receives the result?
   - Trigger: when does it happen?
   - Preconditions: what must already be true?
   - Action: what changes or is attempted?
   - Result: what observable state, data, event, or message follows?
   - Exception: what happens when it cannot complete?
3. Mark any requirement that cannot be normalized without inventing facts.
4. Classify each ambiguity by type and severity.
5. Write confirmation questions that are answerable by a product owner, designer, engineer, QA lead, security reviewer, or operations owner.
6. Offer a concrete clarification or acceptance criterion when the likely intent is clear.
7. Separate facts from assumptions. Do not present guessed policy, UX, timing, performance, or compliance behavior as decided.

## Ambiguity Types

Use these labels when relevant:

- Actor: user, admin, system, recipient, approver, or owner is undefined.
- Scope: included and excluded flows, platforms, roles, tenants, locales, or environments are unclear.
- Trigger: event, timing, frequency, ordering, or async behavior is unclear.
- Condition: prerequisite, eligibility, permission, feature flag, state, or data condition is missing.
- State: lifecycle states, transitions, retries, cancellation, deletion, archiving, or restoration are undefined.
- Data: required fields, formats, validation, normalization, retention, uniqueness, or source of truth are unclear.
- Boundary: limits such as counts, sizes, date ranges, rate limits, pagination, time zones, or precision are missing.
- Error: failure modes, messages, recovery behavior, partial success, timeout, and retry behavior are unspecified.
- Priority: precedence is unclear when multiple rules, roles, statuses, or constraints apply.
- Integration: API contract, webhook semantics, idempotency, versioning, backward compatibility, or external dependency behavior is unclear.
- Security: authentication, authorization, privacy, audit logging, secrets, abuse prevention, or compliance behavior is unspecified.
- UX: copy, navigation, empty/loading/success/error states, accessibility, responsiveness, or notification channel is unclear.
- Nonfunctional: performance, availability, observability, scalability, localization, browser support, or operational constraints are missing.
- Testability: requirement cannot be verified with an observable outcome.
- Conflict: two statements appear inconsistent or create incompatible obligations.

## Severity

Assign the highest justified severity:

- Blocker: implementation cannot begin or could produce incompatible designs without a decision.
- High: likely to cause rework, data loss, security/privacy risk, broken user flow, or incompatible API behavior.
- Medium: likely to cause inconsistent behavior, QA gaps, support confusion, or product disagreement.
- Low: wording is unclear but the likely implementation is obvious and low risk.

Prefer fewer, higher-signal findings over exhaustive nitpicks. Merge duplicates when the same missing decision affects several lines.

## Review Heuristics

Flag these words and phrases unless they are already defined by measurable criteria:

- "appropriate", "as needed", "normal", "fast", "soon", "near real-time", "simple", "relevant"
- "user", "admin", "stakeholder", "owner", "related people", "system"
- "notify", "sync", "validate", "handle", "support", "manage", "securely", "gracefully"
- "all", "any", "latest", "default", "valid", "invalid", "duplicate"

Also look for missing contrasts:

- Empty vs non-empty data.
- New vs existing object.
- Single vs multiple matching records.
- Authorized vs unauthorized actor.
- Online vs offline or dependency unavailable.
- Success vs partial success vs failure.
- Create vs update vs delete vs restore.
- First use vs repeated use.
- Same tenant vs cross-tenant access.
- Desktop vs mobile, keyboard vs pointer, screen reader vs visual use.

## Output

Start with the findings. Keep summaries brief.

```markdown
## Ambiguities

| Severity | Spec Text | Type | Why It Is Ambiguous | Possible Interpretations | Confirmation Question | Suggested Clarification |
|---|---|---|---|---|---|---|
| High | "Notify related users" | Actor, Trigger, UX | Recipient, channel, and timing are undefined. | Email all workspace members; in-app notify owners only; notify after approval only. | Which roles should receive which notification, through what channel, and when? | After approval succeeds, send an in-app notification to workspace owners and an email to the requester. |

## Missing Acceptance Criteria

- Given [precondition], when [action], then [observable result].

## Assumptions

- [Any assumption used to complete the review.]

## Highest-Priority Questions

1. [Question that blocks implementation or prevents incompatible designs.]
```

If the user asks for a rewrite, add:

```markdown
## Clarified Draft

[Rewrite only the reviewed requirement text. Preserve intended scope and mark unresolved decisions in brackets.]
```

## Question Quality Rules

- Ask for decisions, not explanations of your analysis.
- Make questions concrete enough to answer with a choice, rule, threshold, or owner.
- Combine related questions when one stakeholder decision resolves multiple findings.
- Avoid asking about obvious implementation details unless the spec creates user-visible behavior, data-contract behavior, or operational risk.
- When possible, include the consequence: "If not decided, QA cannot determine whether..."

## Acceptance Criteria Rules

Write acceptance criteria only for behavior that is supported by the supplied spec or explicitly marked as an assumption.

Use observable outcomes:

- UI text, state, navigation, or notification.
- API status, response body, event, webhook, or database-visible state.
- Audit log, metric, alert, or permission decision.
- Error message and recovery path.

Avoid unverifiable language such as "works correctly", "is intuitive", "handles errors", or "is performant" unless paired with specific conditions and measurements.

## Boundaries

- Do not invent final product decisions. Offer candidate clarifications and mark them as suggestions.
- Do not perform a general code review unless implementation code is part of the requested review.
- Do not treat style or grammar as a finding unless it creates a real interpretation risk.
- If the supplied text is too small to review deeply, provide a short ambiguity pass and a minimal set of stakeholder questions.
