#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  start_dev_server.sh --mode local|lan|public --port PORT [--session NAME] [--workdir DIR] [--cmd COMMAND] [--replace]

Examples:
  start_dev_server.sh --mode local --port 3000 --cmd 'npm run dev -- --host 127.0.0.1 --port 3000'
  start_dev_server.sh --mode lan --port 3000 --cmd 'npm run dev -- --host 0.0.0.0 --port 3000'
  start_dev_server.sh --mode public --port 3000 --cmd 'npm run dev -- --host 127.0.0.1 --port 3000'
USAGE
}

mode=""
port=""
session="dev-server"
workdir="$PWD"
cmd=""
replace=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      mode="${2:-}"
      shift 2
      ;;
    --port)
      port="${2:-}"
      shift 2
      ;;
    --session)
      session="${2:-}"
      shift 2
      ;;
    --workdir)
      workdir="${2:-}"
      shift 2
      ;;
    --cmd)
      cmd="${2:-}"
      shift 2
      ;;
    --replace)
      replace=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ "$mode" != "local" && "$mode" != "lan" && "$mode" != "public" ]]; then
  echo "--mode must be one of: local, lan, public" >&2
  exit 2
fi

if [[ ! "$port" =~ ^[0-9]+$ ]]; then
  echo "--port must be a number" >&2
  exit 2
fi

if [[ ! -d "$workdir" ]]; then
  echo "--workdir does not exist: $workdir" >&2
  exit 2
fi

if ! command -v tmux >/dev/null 2>&1; then
  echo "tmux is required but was not found." >&2
  exit 1
fi

if [[ "$mode" == "public" ]] && ! command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared is required for --mode public but was not found." >&2
  echo "Install it first, for example: brew install cloudflared" >&2
  exit 1
fi

if tmux has-session -t "$session" 2>/dev/null; then
  if [[ "$replace" -eq 1 ]]; then
    tmux kill-session -t "$session"
  else
    echo "tmux session already exists: $session" >&2
    echo "Use --replace to restart it, or choose another --session." >&2
    exit 1
  fi
fi

default_command() {
  if [[ -f package.json ]]; then
    if command -v jq >/dev/null 2>&1; then
      if jq -e '.scripts.dev' package.json >/dev/null 2>&1; then
        echo "npm run dev"
        return
      fi
      if jq -e '.scripts.start' package.json >/dev/null 2>&1; then
        echo "npm start"
        return
      fi
    elif grep -q '"dev"[[:space:]]*:' package.json; then
      echo "npm run dev"
      return
    elif grep -q '"start"[[:space:]]*:' package.json; then
      echo "npm start"
      return
    fi
  fi
  if [[ -f Makefile ]] && grep -qE '^dev:' Makefile; then
    echo "make dev"
    return
  fi
  echo ""
}

if [[ -z "$cmd" ]]; then
  cmd="$(cd "$workdir" && default_command)"
fi

if [[ -z "$cmd" ]]; then
  echo "No --cmd supplied and no common default command was detected." >&2
  exit 2
fi

case "$mode" in
  local|public) bind_host="127.0.0.1" ;;
  lan) bind_host="0.0.0.0" ;;
esac

shell_quote() {
  printf "%q" "$1"
}

server_script="cd $(shell_quote "$workdir") && export HOST=$(shell_quote "$bind_host") BIND_HOST=$(shell_quote "$bind_host") PORT=$(shell_quote "$port") && exec bash -lc $(shell_quote "$cmd")"

tmux new-session -d -s "$session" -n server "$server_script"

if [[ "$mode" == "public" ]]; then
  tunnel_script="cloudflared tunnel --url http://localhost:${port}"
  tmux new-window -t "$session" -n tunnel "$tunnel_script"
fi

lan_ips() {
  if command -v ipconfig >/dev/null 2>&1; then
    for iface in en0 en1 en2; do
      ipconfig getifaddr "$iface" 2>/dev/null || true
    done
  fi
  if command -v hostname >/dev/null 2>&1; then
    hostname -I 2>/dev/null | tr ' ' '\n' || true
  fi
  if command -v ifconfig >/dev/null 2>&1; then
    ifconfig 2>/dev/null | awk '/inet / && $2 != "127.0.0.1" { print $2 }'
  fi
}

echo "Started tmux session: $session"
echo "Server window: $session:server"
echo "Mode: $mode"
echo "Command: $cmd"
echo "Local URL: http://localhost:$port"

if [[ "$mode" == "lan" ]]; then
  first_ip="$(lan_ips | awk 'NF && $1 !~ /^169\\.254\\./ { print; exit }')"
  if [[ -n "$first_ip" ]]; then
    echo "LAN URL: http://$first_ip:$port"
  else
    echo "LAN URL: could not determine IP address; inspect network settings."
  fi
fi

if [[ "$mode" == "public" ]]; then
  echo "Tunnel window: $session:tunnel"
  echo "Public URL: wait for a trycloudflare.com URL in the tunnel logs:"
  echo "  tmux capture-pane -pt $session:tunnel -S -120"
fi

echo "Attach: tmux attach -t $session"
echo "Stop: tmux kill-session -t $session"
