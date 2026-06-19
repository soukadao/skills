---
name: create-marp-slides
description: Create, revise, render, and visually verify flexible Marp presentations from briefs, notes, reports, technical designs, or existing Markdown. Use for Marp or Markdown slides, custom themes, image-led decks, speaker notes, diagrams, or export to HTML, PDF, PPTX, PNG, and JPEG. Provides a reusable design foundation while allowing each deck to vary its art direction, imagery, palette, typography, composition, and slide sequence.
---

# Create Marp Slides

Create maintainable Markdown presentations with a shared quality foundation and deck-specific art direction. Preserve freedom of composition; do not turn every request into the same template.

## Set The Freedom Boundary

Keep these foundations stable unless the user or brand requires otherwise:

- use 16:9 by default and maintain safe outer margins;
- establish a clear type hierarchy and readable Japanese line breaks;
- keep normal text contrast at 4.5:1 or better and large text at 3:1 or better;
- give each slide one dominant message and one obvious visual entry point;
- record image sources and licenses, use alt text, and avoid distortion;
- render and visually inspect every slide before delivery.

Vary these deliberately for each deck:

- palette, font family, scale, tone, and visual references;
- photography, illustration, diagrams, charts, or text-only treatment;
- full-bleed, split-image, asymmetric, centered, editorial, or technical composition;
- slide count, pacing, density, section rhythm, and use of dark/light slides;
- custom classes, transitions, speaker notes, and output formats.

## Load The Right References

- Read `references/design-principles.md` before designing a deck or theme.
- Read `references/layout-strategy.md` when selecting imagery, creative direction, or slide compositions.
- Read `references/marp-guide.md` for directives, background images, notes, custom themes, and CLI options.
- Read `references/research.md` when advising on ecosystem choices or advanced applications.

## Workflow

### 1. Understand The Presentation

Read all source material and nearby project instructions. Determine the audience, purpose, speaking time, language, desired action, required evidence, delivery environment, output formats, and available brand or image assets.

Infer minor defaults. Ask only when the audience, objective, or brand constraints cannot be discovered safely.

### 2. Choose A Creative Direction

Define the audience outcome and outline the story before styling. Then write a short art-direction brief containing:

- three visual adjectives, such as `quiet / architectural / precise`;
- one hierarchy strategy, such as `large statements + sparse evidence`;
- an image strategy: none, occasional, section-led, or image-led;
- a palette and typography rationale tied to the subject or supplied brand;
- 3-6 composition types to create rhythm across the deck.

Do not default to the last deck's palette, image, or layout. Do not decorate before the story and hierarchy are clear.

### 3. Build From The Foundation

Copy `assets/foundation-theme.css` beside the deck and rename its theme identifier. Customize its design tokens first:

```css
:root {
  --slide-bg: #f7f7f5;
  --slide-ink: #172033;
  --slide-muted: #5d6879;
  --slide-accent: #3568d4;
  --slide-surface: #ffffff;
  --slide-dark: #101827;
  --slide-font: -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif;
}
```

The asset supplies typography, spacing, dark, statement, quote, code, compact, and image-overlay foundations. Treat these as primitives, not mandatory layouts. Add deck-specific classes only when the content needs them.

### 4. Select Visuals And Compositions

Choose the role of each visual before selecting it: atmosphere, evidence, comparison, sequence, scale, or explanation. Prefer user assets; otherwise use a suitably licensed source or generate a purpose-built visual. Save external assets locally for reproducible rendering.

Use Marp background syntax as needed:

```markdown
![bg cover brightness:0.42](assets/hero.jpg)
![bg right:44% cover](assets/detail.jpg)
![width:620px](assets/diagram.svg)
```

For split backgrounds, let Marp calculate the remaining content width; avoid duplicating that split with large manual padding. Inspect every crop after rendering.

Vary compositions across the sequence. Do not repeat equal card grids, centered text, or the same image treatment on every slide.

### 5. Author The Deck

Use valid Marp frontmatter and `---` slide separators:

```markdown
---
marp: true
theme: project-theme
size: 16:9
paginate: true
title: Presentation title
---

<!-- _class: lead -->

# Presentation title

Audience-facing promise
```

Keep titles action-oriented. Prefer concise evidence, small comparisons, meaningful diagrams, and short code excerpts over paragraphs. Put delivery cues and supporting detail in speaker-note comments. Never invent facts, metrics, quotes, or citations; label placeholders.

### 6. Check And Render

Run the structural checker:

```bash
python3 <skill-dir>/scripts/check_deck.py path/to/slides.md
```

Render with the bundled wrapper:

```bash
<skill-dir>/scripts/render.sh path/to/slides.md pdf --theme path/to/theme.css
<skill-dir>/scripts/render.sh path/to/slides.md html --theme path/to/theme.css
<skill-dir>/scripts/render.sh path/to/slides.md pptx --theme path/to/theme.css
```

Add `--allow-local-files` only for trusted local resources that require it. Standard Marp PPTX output uses image-based slides; use a native PowerPoint workflow when editable objects are required.

### 7. Visually Verify

Render all pages to images and inspect them at overview and full size. Check clipping, hierarchy, presentation-distance legibility, contrast, Japanese wrapping, alignment, image crop and quality, citations, page numbers, and sequence rhythm.

Revise and render again until the output is clean. Report source, theme, export, and asset paths together with any unresolved placeholders.
