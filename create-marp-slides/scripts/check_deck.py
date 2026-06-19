#!/usr/bin/env python3
"""Perform lightweight structural checks on a Marp Markdown deck."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


IMAGE_RE = re.compile(r"!\[[^\]]*\]\(([^)\s]+)(?:\s+['\"][^'\"]*['\"])?\)")
FENCE_RE = re.compile(r"^\s*(```|~~~)")


def split_slides(text: str) -> list[str]:
    lines = text.splitlines()
    start = 0
    if lines and lines[0].strip() == "---":
        for index in range(1, len(lines)):
            if lines[index].strip() == "---":
                start = index + 1
                break

    slides: list[list[str]] = [[]]
    in_fence = False
    fence = ""
    for line in lines[start:]:
        match = FENCE_RE.match(line)
        if match:
            marker = match.group(1)
            if not in_fence:
                in_fence, fence = True, marker
            elif marker == fence:
                in_fence = False
        if line.strip() == "---" and not in_fence:
            slides.append([])
        else:
            slides[-1].append(line)
    return ["\n".join(slide) for slide in slides]


def visible_lines(slide: str) -> list[str]:
    without_comments = re.sub(r"<!--.*?-->", "", slide, flags=re.DOTALL)
    return [line for line in without_comments.splitlines() if line.strip()]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("deck", type=Path)
    parser.add_argument("--max-lines", type=int, default=14)
    parser.add_argument("--max-chars", type=int, default=900)
    args = parser.parse_args()

    if not args.deck.is_file():
        parser.error(f"deck not found: {args.deck}")

    text = args.deck.read_text(encoding="utf-8")
    warnings: list[str] = []
    if not text.startswith("---\n") or not re.search(r"(?m)^marp:\s*true\s*$", text):
        warnings.append("frontmatter should start the file and contain `marp: true`")

    slides = split_slides(text)
    for number, slide in enumerate(slides, 1):
        lines = visible_lines(slide)
        chars = sum(len(line) for line in lines)
        if not lines:
            warnings.append(f"slide {number}: no visible content")
        if len(lines) > args.max_lines:
            warnings.append(
                f"slide {number}: {len(lines)} visible lines may overflow (limit {args.max_lines})"
            )
        if chars > args.max_chars:
            warnings.append(
                f"slide {number}: {chars} visible characters may be too dense (limit {args.max_chars})"
            )
        if re.search(r"(?m)^```mermaid\s*$", slide):
            warnings.append(f"slide {number}: Mermaid needs preprocessing or a configured engine")

    for raw_target in IMAGE_RE.findall(text):
        target = raw_target.strip("<>")
        if re.match(r"^(?:https?:|data:|#)", target):
            continue
        path = (args.deck.parent / target).resolve()
        if not path.exists():
            warnings.append(f"missing local image: {target}")

    print(f"{args.deck}: {len(slides)} slides")
    if warnings:
        for warning in warnings:
            print(f"WARN: {warning}")
        return 1
    print("OK: no structural warnings")
    return 0


if __name__ == "__main__":
    sys.exit(main())
