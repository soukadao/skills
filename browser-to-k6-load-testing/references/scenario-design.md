# Scenario Design

## Output Template

```markdown
## Objective

## Target And Scope

## User Journeys

## Traffic Model

## Test Data And State

## Acceptance Criteria

## Safety Limits

## Observability

## Implementation Notes
```

## Workload Models

Smoke:

- Verify script, auth, environment, and assertions.
- 1 to 2 virtual users.
- 30 seconds to 2 minutes.

Load:

- Validate expected normal or peak traffic.
- Gradual ramp-up, steady state, ramp-down.
- Acceptance criteria based on SLOs or release requirements.

Stress:

- Find saturation point and failure mode.
- Step load above expected peak.
- Requires clear abort conditions.

Spike:

- Test sudden traffic bursts.
- Low baseline, rapid jump, short peak, rapid return.

Soak:

- Detect long-running issues.
- Moderate steady load over a long duration.
- Avoid unbounded writes or data growth.

## Arrival Rate vs Virtual Users

Use arrival rate when the requirement is throughput, such as "100 requests per second" or "500 checkouts per minute".

Use virtual users when the requirement is user behavior, such as "50 logged-in users browsing and checking out".

If unclear, start with virtual users for journey realism and document the observed throughput.

## Journey Mix

Represent realistic traffic as weighted journeys:

```text
Browse catalog: 60%
Search: 20%
View item: 15%
Checkout: 5%
```

Keep destructive or expensive operations capped even if their percentage is low.
