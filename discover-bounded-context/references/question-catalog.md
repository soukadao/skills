# Bounded Context Discovery Question Catalog

Use this catalog to choose the next question. Ask one question at a time and adapt the wording to the user's domain language.

## Priority Order

1. Target and semantic meaning
2. Actor, role, and authority
3. Trigger, precondition, and timing
4. State and lifecycle
5. Rule owner and consistency boundary
6. Observable result and domain event
7. Side effects and integrations
8. Vocabulary conflicts and aliases
9. Ownership, change reason, and organizational clues
10. Deployment or technical decomposition

Do not start with deployment or database questions unless the user explicitly asks for physical architecture. A physical boundary cannot resolve an undefined business meaning.

## Question Families

### Target and Meaning

- What exactly is being created, changed, canceled, approved, or viewed?
- Does this term name an entity, a relationship, an event, a state, or a request?
- Is the action about the business object itself or about a user's relationship to it?
- Does the same word mean something different to another role or department?

### Actor and Authority

- Who performs the action: participant, organizer, administrator, system, or external provider?
- Is the actor acting for themselves or on behalf of another person?
- Who is allowed to perform it, and who is not?
- Who owns the decision when roles disagree?

### Trigger and Timing

- What starts the flow?
- Which states, dates, deadlines, or time zones affect eligibility?
- Is the result immediate, asynchronous, scheduled, retried, or eventually consistent?
- What happens when the same request arrives twice?

### State and Lifecycle

- What are the meaningful states before and after the action?
- Which transitions are valid, and which are terminal?
- Can the action be undone, repeated, or restored?
- Is the state a current snapshot, a historical event, or both?

### Rules and Ownership

- Which business area defines the rule?
- What must be true atomically?
- Which data or decision must remain private to this model?
- Would a rule change for the same reason as the other concepts in this candidate Context?

### Result and Event

- What observable business fact exists after success?
- What is the difference between the request and the fact that it happened?
- What is recorded for audit, reporting, or later processing?
- What is the failure result, and is partial success possible?

### Side Effects and Integration

- Which other business area must react?
- Does the downstream area need a command, a query, or a domain event?
- What translation is required between the two models?
- What happens if the downstream area is unavailable or rejects the message?

### Vocabulary and Context Boundary

- What does this term mean inside each candidate Context?
- Are two terms aliases, or do they represent distinct concepts?
- Which Context publishes the definition or contract?
- What would a domain expert call the concept in each workflow?

## Recommended Question Format

```markdown
### Question
[One answerable decision]

**Recommended answer:** [Current best interpretation]
**Evidence:** [Observed phrase, source, or prior decision]
**Why it matters:** [Boundary, lifecycle, rule, or integration affected]
```

## Context Gap Record

```markdown
| Source phrase | Missing slot | Candidate interpretations | Severity | Next question | Status |
|---|---|---|---|---|---|
```

Use `Unknown` when no interpretation is justified. Use `Assumption` only when proceeding with a clearly stated, reversible default.

## Boundary Review Checklist

- Can each Context explain its key terms without importing another Context's private rules?
- Does each Context own a meaningful business decision or lifecycle?
- Are commands and events named from the perspective of the correct Context?
- Are duplicated concepts intentionally translated rather than accidentally shared?
- Are cross-Context rules expressed as contracts or policies rather than hidden coupling?
- Is the proposed split based on semantic and business evidence rather than only team or database structure?
- Can each boundary claim be traced to a source or explicit decision?
