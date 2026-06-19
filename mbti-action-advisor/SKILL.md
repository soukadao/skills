---
name: mbti-action-advisor
description: Infer practical everyday actions, suitable environments, habits, communication styles, learning approaches, work tendencies, and decision strategies from MBTI personality types. Use when the user provides an MBTI type such as INTJ, ENFP, ISTP, or asks how to choose better daily behavior, routines, study methods, relationships, career direction, or task fit from MBTI/personality tendencies.
---

# MBTI Action Advisor

Use this skill to turn an MBTI type into cautious, practical daily-life guidance. Treat MBTI as a reflection prompt and working hypothesis, not a diagnosis, fixed identity, or deterministic prediction.

## Workflow

1. Normalize the MBTI input.
   - Accept uppercase/lowercase and common forms such as `INTJ-A` or `enfp`.
   - If the type is missing or invalid, ask for a valid 4-letter type.
   - Ignore `-A/-T` unless the user explicitly asks about it.

2. State uncertainty clearly.
   - Say the advice is tendency-based and should be adjusted by experience, values, health, culture, current stress, and environment.
   - Avoid claims like "this type cannot do this" or "this type is always good at that."

3. Infer from dimensions before type stereotypes.
   - `I/E`: energy recovery, social load, and feedback rhythm.
   - `S/N`: concrete facts and routines versus possibilities and meaning.
   - `T/F`: decision criteria, conflict style, and emotional processing.
   - `J/P`: planning, flexibility, closure, and ambiguity tolerance.

4. Map the type to everyday support.
   - Recommend actions for routines, learning, work/task choice, communication, relationships, stress recovery, and decision-making.
   - Explain each recommendation with 1-2 concrete behavioral reasons.
   - Include "works better if..." conditions instead of rigid labels.

5. Convert insight into next actions.
   - Give small actions the user can try today, this week, and when stressed.
   - Include friction points and countermeasures: over-planning, context switching, conflict avoidance, boredom, perfectionism, people-pleasing, isolation, impulsive decisions, or analysis paralysis.

6. Tailor to the user's situation.
   - If they ask daily life, emphasize habits, schedule design, energy management, and home/work boundaries.
   - If they ask relationships, emphasize communication scripts, repair actions, and conflict prevention.
   - If they ask learning or work, emphasize task fit, environment, feedback loops, and sustainable growth.
   - If they ask software development or another domain, apply the same behavior-first guidance to that domain.

## Output Shape

Prefer concise Japanese when the user writes Japanese.

For a single MBTI type, use:

```markdown
## 要約
...

## 向いていそうな行動・環境
| 領域 | おすすめ | 理由 | 試し方 |
|---|---|---|---|

## 今日からの行動
- ...

## ストレス時の注意点
- ...
```

For comparing multiple types, use one table and a short section per type. Do not over-explain all 16 types unless asked.

## Reference

Read [references/type-patterns.md](references/type-patterns.md) when the user provides a specific type, asks for daily action recommendations, wants task/career fit, or wants a type comparison.
