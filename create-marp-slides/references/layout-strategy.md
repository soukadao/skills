# Flexible Layout And Image Strategy

Use this as a selection guide, not as a required template library.

## Choose An Image Mode

### Text-led

Use when the claim itself is the visual, the subject is abstract, or suitable imagery would be generic. Create interest through scale, placement, contrast, and negative space.

### Occasional imagery

Use images on the cover, section breaks, key evidence, and closing slide. Keep working slides quieter. This is a strong default for business and technical decks.

### Image-led

Use when photography, product visuals, places, people, or artifacts are central to the story. Allow fewer words, larger crops, and more full-bleed or split-image slides.

### Diagram/data-led

Use when relationships, systems, processes, or quantitative evidence carry the argument. Generate sharp SVG/PNG assets and keep surrounding decoration minimal.

## Choose A Composition Per Message

- **Cover:** full-bleed image, quiet split image, or oversized typography.
- **Statement:** one dominant sentence with large negative space.
- **Split image:** text on one side, image on the other; let Marp manage the split width.
- **Comparison:** unequal columns when one side is preferred or more important; equal columns only for neutral comparison.
- **Process:** timeline, staircase, path, or sequential frames; do not automatically use five identical cards.
- **Evidence:** one chart, number, quote, screenshot, or artifact with a conclusion title.
- **Architecture:** diagram-first layout with a short explanatory legend.
- **Code:** focused excerpt with the relevant lines emphasized; avoid full files.
- **Quote:** a short quotation with source and generous breathing room.
- **Section break:** strong visual reset with little text.
- **Closing:** restate the desired action or takeaway; do not merely write "Thank you."

Use 3-6 composition types in a typical deck. Repeat enough to feel coherent but not enough to feel mechanical.

## Select Images

1. Define the visual's role: atmosphere, evidence, explanation, contrast, sequence, or scale.
2. Prefer user-provided brand and product assets.
3. Search or generate only after defining subject, mood, aspect ratio, negative-space location, and color temperature.
4. Avoid literal stock-photo cliches, unrelated abstract technology imagery, visible logos, and identifiable people when permissions are unclear.
5. Download remote assets locally and record source, creator, and license.
6. Choose Web-compatible PNG, JPEG, WebP, or SVG. Preserve aspect ratio.

## Compose Background Images

Use full bleed for emotional or section-level emphasis:

```markdown
![bg cover brightness:0.38 saturate:0.8](assets/hero.jpg)
```

Use split backgrounds when text needs a clean reading area:

```markdown
![bg right:46% cover](assets/product.jpg)
```

Use `contain` for diagrams and screenshots that must not be cropped:

```markdown
![bg right:52% contain](assets/architecture.svg)
```

Inspect crops in PDF, HTML, and image output. A split background already reduces the content region; large compensating padding often causes narrow or vertical text.

## Derive A Palette

- Start from the brand, subject matter, or a dominant visual rather than a fashionable default.
- Use one neutral background, one primary text color, and one accent as the starting set.
- Derive muted and surface colors from those anchors.
- Use an accent only for focus or meaning.
- Test contrast after overlays and image filters are applied.

## Create Sequence Rhythm

Alternate:

- sparse and dense;
- light and dark;
- image-led and text-led;
- statement and evidence;
- wide overview and close detail.

Do not alternate mechanically. Use a visual reset where the story changes direction or the audience needs attention restored.

## Avoid Template Lock-in

- Do not require every class from the foundation theme.
- Do not reuse the sample deck's image, palette, or composition by default.
- Do not make cards, gradients, colored lines, or geometric shapes a signature unless the project calls for them.
- Do not force source material into a layout that weakens the message.
- Create a new deck-specific class when the content has a genuinely different visual need.
