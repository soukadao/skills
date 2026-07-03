---
name: start-dev-server
description: Start and manage local development servers in tmux with selectable access scope. Use when Codex needs to launch, keep running, inspect, stop, or share a dev server as localhost-only, LAN-accessible via the machine IP address, or publicly accessible through a Cloudflare Tunnel / trycloudflare quick tunnel.
---

# Start Dev Server

## Overview

Use this skill to start development servers in a named `tmux` session and clearly report how the user can access them. Support three exposure modes:

- `local`: bind to localhost for access from this machine only.
- `lan`: bind to all interfaces, discover the machine IP address, and report a same-network URL.
- `public`: bind locally and start `cloudflared tunnel --url http://localhost:<port>` in a second tmux window for temporary external access.

## Workflow

1. Identify the project start command and port from repo context before launching:
   - Inspect `package.json`, framework config, `README`, `Makefile`, `docker-compose.yml`, or existing scripts.
   - Prefer the repo's documented command over generic guesses.
   - If the framework needs explicit host/port flags, include them in `--cmd` instead of relying only on environment variables.
2. Choose the exposure mode:
   - Use the user's requested mode when stated.
   - If unstated, ask briefly when sharing scope matters; otherwise default to `local`.
   - Do not use `public` for secrets, admin consoles, private data, destructive tools, or authenticated local apps unless the user explicitly asks.
3. Start through `scripts/start_dev_server.sh`.
4. Check tmux logs and report:
   - tmux session name
   - local URL
   - LAN URL when applicable
   - Cloudflare Tunnel URL or where to find it in logs when applicable
   - stop command

## Script

Run the bundled script from the skill directory:

```bash
start-dev-server/scripts/start_dev_server.sh \
  --mode local \
  --port 3000 \
  --session dev-server \
  --cmd 'npm run dev -- --host 127.0.0.1 --port 3000'
```

For LAN access:

```bash
start-dev-server/scripts/start_dev_server.sh \
  --mode lan \
  --port 3000 \
  --session dev-server \
  --cmd 'npm run dev -- --host 0.0.0.0 --port 3000'
```

For temporary external access through Cloudflare Quick Tunnel:

```bash
start-dev-server/scripts/start_dev_server.sh \
  --mode public \
  --port 3000 \
  --session dev-server \
  --cmd 'npm run dev -- --host 127.0.0.1 --port 3000'
```

Useful options:

- `--workdir <path>`: project directory; defaults to current directory.
- `--replace`: kill an existing session with the same name before starting.
- `--cmd '<command>'`: command executed in the server tmux window. If omitted, the script tries common package-manager defaults, but explicit commands are preferred.

## Command Patterns

Use framework-native host flags when available:

- Vite: `npm run dev -- --host 127.0.0.1 --port 3000` or `--host 0.0.0.0` for LAN.
- Next.js: `npm run dev -- -H 127.0.0.1 -p 3000` or `-H 0.0.0.0` for LAN.
- Astro/SvelteKit: usually Vite-style `--host` and `--port`.
- Rails: `bin/rails server -b 127.0.0.1 -p 3000` or `-b 0.0.0.0` for LAN.
- Django: `python manage.py runserver 127.0.0.1:8000` or `0.0.0.0:8000` for LAN.

When unsure, inspect the framework's help command or existing project scripts.

## Tmux Operations

Use these commands after launch:

```bash
tmux ls
tmux attach -t <session>
tmux capture-pane -pt <session>:server -S -120
tmux capture-pane -pt <session>:tunnel -S -120
tmux kill-session -t <session>
```

Prefer `tmux capture-pane` for status checks so the server can keep running for the user.

## Cloudflare Tunnel Notes

Use Cloudflare Quick Tunnels for development previews only. Official Cloudflare docs describe `cloudflared tunnel --url http://localhost:<port>` as a testing/development flow that creates a random `trycloudflare.com` URL. If `cloudflared` is missing, tell the user to install it instead of silently switching to another public exposure method.

For production or stable hostnames, use a named Cloudflare Tunnel configured in the user's Cloudflare account rather than this quick-tunnel workflow.
