#!/usr/bin/env python3
"""Compare two hyperfine JSON result files."""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path


def load_results(path: Path) -> dict[str, dict[str, float | str]]:
    data = json.loads(path.read_text())
    results = data.get("results")
    if not isinstance(results, list):
        raise ValueError(f"{path} does not look like a hyperfine JSON export")

    by_command: dict[str, dict[str, float | str]] = {}
    for index, item in enumerate(results):
        if not isinstance(item, dict):
            continue
        command = str(item.get("command") or f"result-{index + 1}")
        by_command[command] = item
    return by_command


def metric_value(result: dict[str, float | str], metric: str) -> float:
    value = result.get(metric)
    if not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f"Missing numeric metric '{metric}' for {result.get('command')}")
    return float(value)


def format_seconds(value: float) -> str:
    if value < 1:
        return f"{value * 1000:.2f} ms"
    return f"{value:.3f} s"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("baseline", type=Path, help="Baseline hyperfine JSON")
    parser.add_argument("current", type=Path, help="Current hyperfine JSON")
    parser.add_argument(
        "--metric",
        default="mean",
        choices=["mean", "median", "min", "max"],
        help="Metric to compare (default: mean)",
    )
    args = parser.parse_args()

    baseline = load_results(args.baseline)
    current = load_results(args.current)
    commands = sorted(set(baseline) & set(current))

    if not commands and len(baseline) == 1 and len(current) == 1:
        commands = [next(iter(baseline))]
        current = {commands[0]: next(iter(current.values()))}

    if not commands:
        print("No matching commands found between the two files.", file=sys.stderr)
        print("Use identical command labels or compare one-result files.", file=sys.stderr)
        return 2

    print(f"| Command | Baseline {args.metric} | Current {args.metric} | Change |")
    print("|---|---:|---:|---:|")
    for command in commands:
        before = metric_value(baseline[command], args.metric)
        after = metric_value(current[command], args.metric)
        change = ((after - before) / before) * 100 if before else float("inf")
        print(
            f"| `{command}` | {format_seconds(before)} | "
            f"{format_seconds(after)} | {change:+.1f}% |"
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
