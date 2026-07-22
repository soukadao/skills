# Local Development Troubleshooting Checklists

Use only the sections relevant to the observed failure.

## JavaScript and TypeScript

- Identify the package manager from lockfiles and `packageManager` in `package.json`.
- Check the runtime pin: `.node-version`, `.nvmrc`, `mise.toml`, `.tool-versions`, `volta`, or `engines.node`.
- Prefer frozen/locked installs in CI-like situations and normal installs for local repair only when the repo expects it.
- For `node-gyp`, native module, or binary download failures, check Node version, architecture, Python, compiler tools, and proxy/certificate settings.
- For Vite/Next/Nuxt dev-server failures, check env vars, port conflicts, generated route/build caches, and framework version compatibility.
- For monorepos, inspect workspace config before running commands from a subdirectory.

## Python

- Identify the environment tool: uv, Poetry, Pipenv, requirements files, pyproject, conda, tox, hatch, or raw venv.
- Check Python version pins in `.python-version`, `runtime.txt`, `pyproject.toml`, `tox.ini`, CI, or docs.
- Verify the active interpreter and virtual environment before installing dependencies.
- For import errors, distinguish missing install, wrong interpreter, editable package issue, and changed working directory.
- For compiled dependency failures, check Python version support, wheel availability, system libraries, and compiler tooling.

## Docker and Compose

- Prefer `docker compose` over legacy `docker-compose` unless the repo requires the legacy command.
- Inspect compose profiles, override files, env files, named volumes, healthchecks, exposed ports, and service names.
- For service startup failures, read container logs for the first failing service rather than restarting everything repeatedly.
- For database readiness problems, check healthchecks and connection strings before adding sleeps.
- Ask before deleting named volumes or running prune commands; they can destroy local data.

## Databases and Local Services

- Identify whether the app expects Docker, a locally installed service, a remote dev service, or an embedded database.
- Check host, port, database name, username, password variable names, SSL mode, and socket paths.
- Verify migrations and seed data expectations separately from connectivity.
- For test failures, check whether the test database is isolated from the development database.

## Environment Variables and Secrets

- Compare required variable names against `.env.example`, docs, schema validators, config loaders, and runtime error messages.
- Do not expose secret values. Mention missing names, not values.
- Check shell export behavior, dotenv file location, prefix requirements, and framework-specific public/private variable naming.
- Verify that dev servers were restarted after env changes.

## Ports and Processes

- Use `lsof -nP -iTCP:<port> -sTCP:LISTEN` for a specific port.
- Prefer changing the app's configured port when another intentional service owns the port.
- Kill a process only when it is clearly stale or user-owned and safe to stop.
- Check IPv4/IPv6 binding differences when a service appears reachable on one host but not another.

## Certificates, Proxies, and Network

- Check whether the failure is DNS, TLS trust, proxy authentication, package registry access, or blocked outbound network.
- Inspect repository-specific registry config before changing global config.
- Prefer project-local config over global config changes.
- For corporate certificates, avoid disabling TLS verification as a fix; identify the missing trust configuration.

## Permissions and Filesystem

- Check file ownership when package managers or Docker previously ran with elevated privileges.
- Prefer repairing ownership of the specific project path over broad system changes.
- Check case-sensitive path mismatches, generated-file permissions, long paths, symlink behavior, and watched-file limits.
