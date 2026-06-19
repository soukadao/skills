# Ecosystem Research And Applications

## Contents

- Findings from existing skills
- Recommended scope
- Practical use cases
- Advanced applications
- Selection guidance
- Sources

## Findings From Existing Skills

### SkillsMP: `slides` by tarosky

This skill converts analysis Markdown in a market-research workflow into a Marp deck and exports HTML with Marp CLI. Its strength is a narrow, repeatable input/output contract. Its limitation is that it is coupled to one repository's staged analysis files and does not describe general visual QA, broad export choices, or presentation design.

Source: https://skillsmp.com/skills/tarosky-market-research-claude-skills-slides-skill-md

### SkillsMP: `design-to-slides` by iAli61

This skill turns a technical design document into Marp source, separate speaker notes, and Mermaid-derived diagrams. It deliberately delegates PDF/PPTX export to another skill. Its strength is separation of authoring artifacts and diagram workflows. Its limitation for a general Marp skill is the dependency chain and technical-design-specific scope.

Source: https://skillsmp.com/ja/skills/iali61-mermaid-to-excalidraw-github-skills-design-to-slides-skill-md

### Anthropic presentation skill

Anthropic's PPTX skill emphasizes render-and-inspect workflows, thumbnails, overflow detection, and editable PowerPoint internals. Although it does not target Marp, its strongest transferable lesson is that successful file generation is not sufficient: visual inspection is mandatory.

Source: https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md

### Scientific and architecture skills

Scientific slide skills emphasize citations, audience fit, and design principles. Architecture presentation tools commonly expose executive, technical, stakeholder, and procurement modes and vary slide count by meeting purpose. These are useful patterns for turning the same sources into audience-specific narratives rather than mechanically summarizing documents.

Sources:

- https://github.com/K-Dense-AI/claude-scientific-skills/blob/main/scientific-skills/scientific-slides/SKILL.md
- https://github.com/tractorjuice/arc-kit

## Recommended Scope

A useful general Marp skill should own the complete authoring loop:

1. infer audience and outcome;
2. design a narrative and slide budget;
3. create maintainable Marp Markdown;
4. handle themes, notes, images, and diagrams;
5. export requested formats;
6. inspect rendered pages and iterate.

Avoid coupling the skill to one project folder layout. Keep specialized diagram generation and truly editable PPTX generation as explicit adjacent workflows.

## Practical Use Cases

- Engineering proposals, architecture reviews, incident reviews, and RFC briefings
- Research summaries and literature reviews with citations
- Sales proposals, product roadmaps, and executive decision memos
- Courses, conference talks, internal training, and workshops
- Recurring reports generated from version-controlled Markdown or data pipelines
- Static HTML presentations published through GitHub Pages or other hosting

## Advanced Applications

- Store the deck, theme, and assets in Git for reviewable content changes.
- Render automatically in GitHub Actions or another CI service using a pinned CLI or official Marp container.
- Build organization-wide brand themes with layout classes for title, section, comparison, quote, code, and appendix slides.
- Pre-generate charts and diagrams as SVG for crisp, portable output.
- Convert speaker notes to scripts, handouts, captions, or narrated video through a separate pipeline.
- Use CLI watch/preview mode for local authoring and server mode for browsing a collection of decks.
- Publish HTML for interactive delivery and PDF for archival distribution from the same source.

## Selection Guidance

Choose Marp when text-first authoring, Git diffs, automation, reproducibility, and multi-format output matter. Choose native PowerPoint tooling when collaborators must edit individual objects, complex animations are central, or an existing corporate `.pptx` template is mandatory. Choose web-native systems such as Slidev when application components and richer runtime interactivity matter more than simple Markdown portability.

## Sources

- Marp project and official tool family: https://github.com/marp-team/marp
- Marp CLI: https://github.com/marp-team/marp-cli
- Author-maintained CLI starter: https://github.com/yhatt/marp-cli-example
- Community themes: https://github.com/rnd195/marp-community-themes
- Agent Skills examples: https://github.com/anthropics/skills
