---
name: glossary-builder
description: Create practical business glossaries, domain dictionaries, data item dictionaries, semantic-layer term lists, and terminology tables. Use when the user wants to define business terms, reconcile different meanings across systems or departments, extract glossary candidates from documents, build a business or data glossary, standardize terms for business processes, distinguish business terms from technical data fields, or create glossary entries with definitions, aliases, categories, source documents, source systems, rules, examples, approval status, update dates, and open questions.
---

# Glossary Builder

Create a glossary that helps people use terms consistently. Prefer practical entries tied to real business use over abstract dictionary prose.

## Workflow

1. Fix the artifact type and purpose.
   - Use a business glossary for business concepts, metrics, policies, statuses, and shared vocabulary.
   - Use a data item dictionary for tables, fields, data types, valid values, formats, constraints, and physical data locations.
   - Use a term conflict list when the main problem is disagreement across departments, systems, or reports.
   - Identify the target domain, users, and decisions the glossary must support.
   - State the problem it should solve: inconsistent reports, onboarding gaps, unclear responsibility, cross-system confusion, compliance usage, or decision rules.
   - If unclear, proceed with a stated assumption and include an `確認事項` section.
   - Keep the scope narrow enough to be useful: one process, department, system, dataset, product, or policy area.

2. Gather candidate terms.
   - Extract nouns, metrics, statuses, roles, document names, system fields, approval labels, exception names, and abbreviations.
   - Include terms that are ambiguous across departments or systems, not only unfamiliar words.
   - Record the source for each candidate term: document name, URL, page, section, table, file path, system screen, report name, interviewee, or meeting note.
   - Add likely missing terms when they are necessary to understand the domain, and mark them as inferred.

3. Normalize and group.
   - Choose a canonical term for each concept.
   - Capture aliases, abbreviations, English/Japanese variants, legacy names, and system field names.
   - Split terms when one word has multiple meanings. Merge terms when different words mean the same concept.

4. Write entries.
   - Define each term in business context, not as a generic dictionary definition.
   - Add category and hierarchy when useful: metric, policy, role, status, process, product, customer concept, or data item.
   - State what is included and excluded when that prevents misinterpretation.
   - Connect the term to source systems, data fields, rules, examples, valid values, formulas, and related terms when known.
   - Add approval status and last updated date when the glossary is meant to be maintained.

5. Check for business use.
   - Add the source of truth for terms used in operational judgment.
   - Add constraints and approval rules where terms affect decisions.
   - Identify terms that need stakeholder confirmation before they can be standardized.
   - Capture unresolved issues and change impact when a term is shared across teams or reports.
   - Separate facts from assumptions.

## Output Formats

Use the compact table unless the user asks for another format.

### Compact Glossary

```markdown
| 用語 | 定義 | カテゴリ | 別名・表記揺れ | 利用場面 | 参照元 | 注意点 |
|---|---|---|---|---|---|---|
```

### Business Context Glossary

Use this for semantic layers, cross-system workflows, or data governance.

```markdown
| 用語 | カテゴリ | 標準定義 | 含むもの | 含まないもの | 別名・表記揺れ | 上位語/下位語 | 正とする情報源 | 参照元 | 関連システム/項目 | 判断ルール・制約 | 例 | 承認状態 | 最終更新日 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
```

### Data Item Dictionary

Use this when the user needs technical data fields rather than shared business terminology.

```markdown
| データ項目 | 業務上の意味 | システム/テーブル/項目 | データ型・形式 | 有効値 | 算出式・変換ルール | 利用レポート/業務 | 参照元 | 注意点 |
|---|---|---|---|---|---|---|---|---|
```

### Term Conflict List

Use this when the main problem is inconsistent terminology.

```markdown
| 用語 | 部門/システムAでの意味 | Aの参照元 | 部門/システムBでの意味 | Bの参照元 | 差分 | 確認事項 |
|---|---|---|---|---|---|---|
```

## Entry Rules

- Avoid circular definitions. Do not define `売上` as `売上金額`.
- Avoid vague definitions such as `管理するもの`, `必要な情報`, or `関連データ`.
- Prefer observable criteria: amounts, statuses, dates, actors, events, systems, and approval conditions.
- Include formulas for metrics and derived values.
- Include valid values for statuses, categories, flags, and code-like fields.
- Include a short example when a definition alone may still be misunderstood.
- Use `未承認`, `確認中`, or `承認済み` for approval status when governance matters.
- Use `参照元` for traceability. Prefer `document title > section`, `file path:line`, `URL`, `report name`, `system screen`, or `interview/date`.
- If the source is unknown, write `未確認` instead of inventing authority.
- If a term has operational consequences, include the rule that makes it consequential.
- Keep examples short and realistic.
- Use Japanese terms by default when the user writes in Japanese. Include English names when systems or datasets use them.

## Quality Check

Before finalizing, verify:

- Important ambiguous terms are included.
- Each definition distinguishes the term from neighboring terms.
- The chosen output distinguishes business terminology from technical data fields.
- Categories, hierarchy, valid values, formulas, or examples are present where they materially improve understanding.
- Aliases and system names are captured.
- Source of truth is clear or explicitly marked `未確認`.
- Approval status and update date are present when the glossary is intended for ongoing use.
- Business-useful constraints, exceptions, or approval rules are captured.
- Term conflicts show the observed differences and unresolved questions without forcing a recommendation.
- Open questions are listed separately and are specific enough for a stakeholder to answer.

## Final Response Shape

Lead with the glossary. Then add:

```markdown
## 確認事項
- [Specific unresolved question]

## 次に追加するとよい情報
- [Source document, system field, rule, or stakeholder interview target]
```

Omit empty sections.
