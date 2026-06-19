# Marp Guide

## Contents

- Authoring model
- Directives and syntax
- Images and layouts
- Notes and presentation features
- Themes
- CLI recipes
- Constraints

## Authoring Model

Marp uses CommonMark-compatible Markdown, with horizontal rulers (`---`) separating slides. Enable Marp with `marp: true` in YAML frontmatter. Marp Core includes `default`, `gaia`, and `uncover` themes.

Use global directives in frontmatter and local directives in HTML comments. Prefix a local directive with `_` to apply it only to the current slide.

```markdown
---
marp: true
theme: gaia
size: 16:9
paginate: true
header: Product review
footer: Confidential
---

<!-- _paginate: false -->
<!-- _class: lead -->
```

Common directives include `theme`, `size`, `paginate`, `header`, `footer`, `class`, `backgroundColor`, `backgroundImage`, and `color`. Marp CLI also recognizes metadata such as `title`, `description`, `author`, `keywords`, `url`, and `image`.

## Directives And Syntax

Use fragmented lists sparingly for progressive reveal in the interactive HTML template:

```markdown
* First reveal
* Second reveal

1) First numbered reveal
2) Second numbered reveal
```

Use `<!-- fit -->` after a heading marker to auto-fit a large heading:

```markdown
# <!-- fit --> A short statement that fills the slide
```

Math is supported through KaTeX syntax. Inline math uses `$...$`; display math uses `$$...$$`.

Raw HTML is disabled unless Marp CLI receives `--html`. Avoid it for portable decks when ordinary Markdown and CSS are sufficient.

## Images And Layouts

Use Marp image keywords for background and sizing:

```markdown
![bg cover](hero.jpg)
![bg right:42% contain](diagram.svg)
![width:560px](chart.png)
```

Useful keywords include `bg`, `cover`, `contain`, `left`, `right`, `vertical`, and percentage splits. Brightness and opacity filters can improve text contrast, for example `![bg brightness:0.45](photo.jpg)`.

Prefer Web-compatible images such as PNG, JPEG, WebP, or SVG. Local files may require `--allow-local-files`. Use meaningful alt text for non-decorative images. Do not rely on a PDF file as an `<img>` source.

## Notes And Presentation Features

Marp treats HTML comments as speaker notes. Keep directive comments distinct from prose notes.

```markdown
<!--
Explain why this metric changed.
Pause for questions before moving on.
-->
```

The default `bespoke` HTML template supports keyboard navigation, fullscreen, overview, presenter view, fragments, an optional progress bar, and slide transitions. These interactive features do not all translate to static PDF or PPTX.

## Themes

A custom theme is CSS with a theme declaration:

```css
/* @theme acme */
@import 'default';

section {
  width: 1280px;
  height: 720px;
}
```

Use `--theme theme.css` to override a theme directly, or `--theme-set ./themes` to register themes for selection through the Markdown `theme` directive. Keep fonts available in the render environment; Web fonts make offline and CI builds less reproducible.

## CLI Recipes

Prefer a project-pinned dependency for reproducibility:

```bash
npm install --save-dev @marp-team/marp-cli
npx marp slides.md --pdf --theme theme.css --allow-local-files
npx marp slides.md --html --theme theme.css
npx marp slides.md --pptx --theme theme.css
npx marp --watch slides.md
npx marp --preview slides.md
npx marp --server ./slides
```

Marp CLI can output HTML, PDF, PPTX, PNG, JPEG, and text. Browser-backed formats require a supported browser. The current CLI supports Chrome/Chromium, Edge, and early-stage Firefox support; use `--browser-path` when auto-detection fails.

Use `marp.config.mjs` or an equivalent supported config file when a project repeatedly needs theme sets, engine plugins, HTML enablement, or local file access. Pin CLI versions in CI rather than depending on whatever `npx` resolves later.

## Constraints

- Standard PPTX output is presentation-compatible but slide contents are rendered as images, not native editable shapes.
- Interactive fragments, presenter behavior, and transitions are primarily HTML concerns.
- Mermaid requires preprocessing, a plugin/custom engine, or conversion to an image. A fenced Mermaid block alone is not a guarantee of rendered diagrams.
- Rendering can differ by browser, installed fonts, remote asset availability, and CLI/Core version.
- `--html` and `--allow-local-files` expand the trust boundary; do not enable them casually for untrusted content.

## Primary Sources

- Marp overview: https://marp.app/
- Marp CLI documentation: https://github.com/marp-team/marp-cli
- Marpit directives: https://marpit.marp.app/directives
- Marpit image syntax: https://marpit.marp.app/image-syntax
- Marpit theme CSS: https://marpit.marp.app/theme-css
