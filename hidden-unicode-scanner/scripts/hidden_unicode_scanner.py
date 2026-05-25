#!/usr/bin/env python3

import argparse
import subprocess
import sys
import unicodedata
from pathlib import Path

SUSPICIOUS_CODEPOINT_RANGES = (
    (0x00AD, 0x00AD, "SOFT HYPHEN"),
    (0x034F, 0x034F, "COMBINING GRAPHEME JOINER"),
    (0x061C, 0x061C, "ARABIC LETTER MARK"),
    (0x115F, 0x115F, "HANGUL CHOSEONG FILLER"),
    (0x1160, 0x1160, "HANGUL JUNGSEONG FILLER"),
    (0x200B, 0x200B, "ZERO WIDTH SPACE"),
    (0x200C, 0x200C, "ZERO WIDTH NON-JOINER"),
    (0x200D, 0x200D, "ZERO WIDTH JOINER"),
    (0x200E, 0x200E, "LEFT-TO-RIGHT MARK"),
    (0x200F, 0x200F, "RIGHT-TO-LEFT MARK"),
    (0x202A, 0x202A, "LEFT-TO-RIGHT EMBEDDING"),
    (0x202B, 0x202B, "RIGHT-TO-LEFT EMBEDDING"),
    (0x202C, 0x202C, "POP DIRECTIONAL FORMATTING"),
    (0x202D, 0x202D, "LEFT-TO-RIGHT OVERRIDE"),
    (0x202E, 0x202E, "RIGHT-TO-LEFT OVERRIDE"),
    (0x2060, 0x2060, "WORD JOINER"),
    (0x2066, 0x2066, "LEFT-TO-RIGHT ISOLATE"),
    (0x2067, 0x2067, "RIGHT-TO-LEFT ISOLATE"),
    (0x2068, 0x2068, "FIRST STRONG ISOLATE"),
    (0x2069, 0x2069, "POP DIRECTIONAL ISOLATE"),
    (0x3164, 0x3164, "HANGUL FILLER"),
    (0xFE00, 0xFE0F, "VARIATION SELECTOR"),
    (0xFEFF, 0xFEFF, "BOM / ZERO WIDTH NO-BREAK SPACE"),
    (0xFFA0, 0xFFA0, "HALFWIDTH HANGUL FILLER"),
    (0xE0100, 0xE01EF, "VARIATION SELECTOR SUPPLEMENT"),
    (0xE0001, 0xE0001, "LANGUAGE TAG"),
    (0xE0020, 0xE007F, "TAG CHARACTER"),
)

ALLOWED_CONTROL_CODEPOINTS = {
    0x0009,
    0x000A,
    0x000D,
}


def describe_suspicious_char(char: str) -> str | None:
    code_point = ord(char)

    for start, end, label in SUSPICIOUS_CODEPOINT_RANGES:
        if start <= code_point <= end:
            if start == end:
                return label

            unicode_name = unicodedata.name(char, "")
            if unicode_name:
                return f"{label} / {unicode_name}"
            return label

    category = unicodedata.category(char)
    if category == "Cf":
        unicode_name = unicodedata.name(char, "FORMAT CHARACTER")
        return f"FORMAT CHARACTER / {unicode_name}"

    if category == "Cc" and code_point not in ALLOWED_CONTROL_CODEPOINTS:
        unicode_name = unicodedata.name(char, "CONTROL CHARACTER")
        return f"CONTROL CHARACTER / {unicode_name}"

    return None


def is_inside_git_repo() -> bool:
    result = subprocess.run(
        ["git", "rev-parse", "--is-inside-work-tree"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return result.returncode == 0


def should_use_gitignore() -> bool:
    return is_inside_git_repo() and Path(".gitignore").exists()


def is_git_ignored(path: Path, use_gitignore: bool) -> bool:
    if not use_gitignore:
        return False

    result = subprocess.run(
        ["git", "check-ignore", str(path)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return result.returncode == 0


def is_under_git_dir(path: Path) -> bool:
    return ".git" in path.parts


def is_text_file(path: Path) -> bool:
    try:
        with path.open("rb") as f:
            chunk = f.read(4096)

        if b"\x00" in chunk:
            return False

        chunk.decode("utf-8")
        return True

    except Exception:
        return False


def iter_files(paths, use_gitignore: bool):
    for raw in paths:
        path = Path(raw)

        if not path.exists():
            print(f"[WARN] Not found: {path}", file=sys.stderr)
            continue

        if is_under_git_dir(path):
            continue

        if path.is_file():
            if not is_git_ignored(path, use_gitignore):
                yield path
            continue

        if path.is_dir():
            for file in path.rglob("*"):
                if is_under_git_dir(file):
                    continue

                if not file.is_file():
                    continue

                if is_git_ignored(file, use_gitignore):
                    continue

                yield file


def scan_file(path: Path) -> bool:
    if not is_text_file(path):
        return False

    found = False

    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"[WARN] Skipped {path}: {e}", file=sys.stderr)
        return False

    for line_no, line in enumerate(text.splitlines(), start=1):
        for col_no, char in enumerate(line, start=1):
            description = describe_suspicious_char(char)
            if description:
                print(
                    f"{path}:{line_no}:{col_no} "
                    f"U+{ord(char):04X} "
                    f"{description}"
                )
                found = True

    return found


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="hidden-unicode-scanner",
        description="Detect invisible or suspicious Unicode characters.",
    )

    parser.add_argument(
        "paths",
        nargs="*",
        help="Files or directories to scan.",
    )

    args = parser.parse_args()

    use_gitignore = should_use_gitignore()

    found_any = False
    scanned = 0

    for file in iter_files(args.paths, use_gitignore):
        scanned += 1
        if scan_file(file):
            found_any = True

    print(f"\nScanned files: {scanned}")

    if found_any:
        print("Suspicious Unicode characters detected.")
        return 1

    print("No suspicious Unicode characters found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
