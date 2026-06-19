#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 DECK.md {pdf|html|pptx|png|jpeg} [marp options...]" >&2
  exit 2
}

[[ $# -ge 2 ]] || usage
deck=$1
format=$2
shift 2

[[ -f "$deck" ]] || { echo "Deck not found: $deck" >&2; exit 2; }

case "$format" in
  pdf|html|pptx|png|jpeg) ;;
  *) usage ;;
esac

if [[ -x ./node_modules/.bin/marp ]]; then
  marp=(./node_modules/.bin/marp)
elif command -v marp >/dev/null 2>&1; then
  marp=(marp)
else
  marp=(npx --yes @marp-team/marp-cli)
fi

output="${deck%.*}.${format}"
if [[ "$format" == "html" ]]; then
  "${marp[@]}" "$deck" --output "$output" "$@"
else
  "${marp[@]}" "$deck" "--$format" --output "$output" "$@"
fi
echo "$output"
