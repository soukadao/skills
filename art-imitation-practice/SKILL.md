---
name: art-imitation-practice
description: Create private drawing-copy practice assignments and original AI-generated reference image prompts for artists who want to practice imitation, observation, composition, line, value, color, anatomy, objects, backgrounds, or stylized illustration. Use when the user asks for personal art practice themes, copy-drawing exercises, reference images to imitate, daily drawing prompts, style studies, difficulty-scaled exercises, or wants Codex to generate an image for private practice while avoiding direct generation of living artists' styles, copyrighted characters, logos, or recognizable protected works.
---

# Art Imitation Practice

## Overview

Turn a vague desire to practice drawing by imitation into a focused private study task, an original reference image prompt, and a short checklist for what to observe while copying. Favor practice value over spectacle: clear shapes, readable lighting, controlled difficulty, and one primary skill target.

## Safety And Style Boundaries

- Assume the exercise is for private learning unless the user says they plan to publish, sell, post, or present the result.
- Support private study of visual principles from references, but do not generate prompts that directly copy a living artist's style, a current studio's proprietary look, copyrighted characters, logos, or recognizable protected works.
- If the user names a living artist, convert the request into neutral study language such as line confidence, flat color, soft lighting, energetic gesture, dense detail, graphic silhouettes, limited palette, or painterly brush texture before generating a new original reference.
- Public-domain historical movements may be used as broad references, such as ukiyo-e, impressionist, baroque still life, art nouveau poster design, or ink wash. Still make the subject and composition original.
- For private imitation practice, it is fine to invite close copying of the generated reference image. If the user intends to share the result, encourage transformation, attribution of study intent where relevant, and removal of anything too close to a protected source.

## Workflow

1. Identify the practice target.
   - Ask at most one concise question only if the target is unclear and the choice changes the exercise materially.
   - Common targets: gesture, silhouette, face, hands, clothing folds, simple objects, animals, perspective, background, lighting, color, texture, line economy, composition.

2. Set a difficulty level.
   - `easy`: one subject, simple pose, clear contour, limited palette, plain background.
   - `medium`: two to three objects or a full figure, mild perspective, one light source, simple environment.
   - `hard`: layered composition, complex fabric, hands, reflective materials, multiple depth planes, dramatic lighting.

3. Create a practice assignment.
   - Include the subject, visual focus, time box, copy method, and success criteria.
   - Keep the assignment narrow enough to complete in one sitting unless the user asks for a longer study plan.

4. Write an image-generation prompt.
   - Make the image original and copy-friendly.
   - Specify subject, pose or arrangement, camera angle, composition, lighting, palette, background complexity, and medium-like rendering.
   - Ask for clean readable forms when the goal is beginner or copy practice.
   - Include a negative prompt in prose when useful: no text, no watermark, no extra fingers, no clutter, no extreme cropping.

5. Generate the image when the user asked for an image and an image generation tool is available.
   - Use the image-generation tool directly with the prepared prompt.
   - If image generation is unavailable, provide the final prompt for the user to run elsewhere.

6. Provide a copy checklist.
   - Give 3-6 observation points, ordered from big shapes to details.
   - Include a suggested sequence: thumbnail, construction, contour, value, color, detail.
   - Add one reflection question so the user learns from the attempt.

## Practice Modes

- `shape copy`: large silhouettes, negative space, proportions.
- `line study`: contour, line weight, rhythm, simplification.
- `value study`: grayscale, light direction, shadow grouping.
- `color study`: limited palette, warm/cool contrast, saturation control.
- `texture study`: hair, cloth, metal, glass, wood, skin, plants.
- `composition study`: focal point, cropping, balance, depth, leading lines.
- `character pose`: gesture, anatomy, clothing folds, expression.
- `object still life`: everyday objects, ellipses, perspective, material.
- `background study`: room corner, street, cafe table, park path, window view.

## Prompt Pattern

Use this structure for image prompts:

```text
Original reference image for drawing-copy practice. [Subject and action/arrangement].
Focus on [practice target]. [Difficulty constraints].
Composition: [camera angle, crop, focal point, depth].
Lighting: [single source, soft/hard, value pattern].
Palette and rendering: [limited colors, line quality, texture, medium-like look].
Background: [plain/simple/moderate], no text, no watermark, clean readable shapes.
```

## Output Shape

Use concise Japanese when the user writes Japanese. Prefer this format:

````markdown
## 今日のお題
[one sentence]

## 練習条件
- 難易度:
- 時間:
- 観察ポイント:
- 完成の目安:

## 画像生成プロンプト
```text
[prompt]
```

## 模写の手順
1. ...
2. ...
3. ...

## 振り返り
- [question]
````

## Example Assignments

- Easy line study: a ceramic mug with a spoon and folded napkin, three-quarter view, clean contour, single soft shadow.
- Medium value study: a person tying shoelaces by a window, simple clothing folds, strong light and shadow grouping.
- Medium color study: fruit and a glass cup on a small table, limited palette of red, green, cream, and blue-gray.
- Hard composition study: a small bookstore corner with one seated reader, shelves as depth planes, warm lamp light.
- Hard texture study: raincoat, umbrella, wet pavement, and reflected lights, simplified background.
