---
name: deploy-cloudflare-temporarily
description: Deploy and verify Cloudflare Workers through Wrangler temporary preview accounts without requiring prior Cloudflare signup or login. Use when an unauthenticated agent needs a disposable public Worker or website for a demo, preview, integration test, or build-deploy-verify loop; when the user asks for `wrangler deploy --temporary`, a temporary Cloudflare account, or a claimable deployment; or when ordinary Wrangler deployment stops at interactive signup or authentication.
---

# Deploy Cloudflare Temporarily

Use Wrangler's temporary preview account to deploy, test, iterate, and return a claim URL. Treat the deployment as disposable until the user claims it.

## Check Eligibility

- Retrieve the latest Cloudflare Wrangler documentation before relying on flags, supported resources, limits, or expiry periods. These can change.
- Require Wrangler **4.101.0 or later**. This is the first release that includes `--temporary`; Wrangler 4.100.0 and earlier cannot use temporary preview accounts.
- Inspect the project's package manifest, lockfile, and already resolved Wrangler binary without modifying dependencies. Prefer the project-local binary, such as `./node_modules/.bin/wrangler --version`, or the repository's existing package-manager script.
- Do not use a command that may download a missing package merely to check its version. In particular, do not use `npx --yes`, `wrangler@latest`, or an install command.
- Compare the resolved semantic version with `4.101.0`; do not infer support merely from a v4 major version or a permissive version range in `package.json`.
- If Wrangler is not already installed, cannot be resolved, or is older than 4.101.0, stop. Tell the user that temporary deployment cannot be executed with the current project environment and that Wrangler 4.101.0 or later is required.
- Never install or update Wrangler, and never modify `package.json` or a lockfile, as part of this skill. Dependency changes are outside this skill's responsibility.
- Store the verified project-pinned invocation as `<WRANGLER>` and use that exact invocation for every later command. Recognize that `--temporary` may be hidden from normal help output.

## Choose the Account Mode

1. Inspect authentication non-destructively with `<WRANGLER> whoami` and check whether `CLOUDFLARE_API_TOKEN` is set without printing its value.
2. If valid Cloudflare credentials already exist, do not use `--temporary`. Deploy normally to the authenticated account only when that matches the user's request.
3. If no credentials exist and the goal is a disposable or claimable preview, use the temporary workflow.
4. Never log out, delete stored credentials, or unset environment credentials merely to force temporary mode. Explain the conflict if the user explicitly requires a temporary account from an authenticated environment.

Temporary accounts are for unauthenticated use and may be unavailable outside Cloudflare's public compliance region.

## Prepare and Validate

1. Read the project scripts and Wrangler configuration. Preserve its package manager and existing conventions.
2. Confirm the Worker entry point, name, build command, bindings, and `compatibility_date`. Do not invent production routes or custom domains for a disposable preview.
3. Run the relevant unit tests, type checks, and build. Run `<WRANGLER> deploy --dry-run` when supported by the project.
4. Do not place secrets in `wrangler.jsonc`, command arguments, source files, or output. Temporary deployments do not make secret handling disposable.

Fix local failures before creating a remote deployment.

## Deploy and Iterate

Run from the Worker project directory:

```text
<WRANGLER> deploy --temporary
```

- Running the command accepts the Cloudflare terms and privacy notice presented by Wrangler. Do not run it unless the user has requested the deployment.
- Capture the deployed URL, claim URL, and exact claim expiry from Wrangler output. Do not expose API tokens or temporary account files.
- Treat the claim URL like a sensitive bearer link: give it only to the user and never commit it, paste it into public logs, or include it in source files.
- Reuse the active temporary account for subsequent supported Wrangler commands and redeployments during its claim window. Do not create a new project or account for each iteration.
- Re-run the same tests after code changes, redeploy with `<WRANGLER> deploy --temporary`, and verify again.

## Verify Remotely

1. Request the deployed URL with `curl --fail-with-body --silent --show-error <DEPLOYED_URL>` or a more appropriate HTTP test.
2. Check status, response body, headers, and application behavior against the request. Exercise a small representative set of endpoints for APIs.
3. If verification fails, inspect build/deploy output, fix the code or configuration, redeploy, and repeat. Do not call the deployment complete merely because Wrangler returned a URL.
4. Avoid destructive or high-volume tests against the public endpoint.

## Hand Off

Report:

- the public deployment URL and what was verified;
- that the deployment and associated temporary resources are disposable until claimed;
- the claim URL and the exact remaining claim deadline shown by Wrangler;
- that claiming transfers supported Workers and associated resources to the user's signed-in or newly created Cloudflare account;
- that unclaimed resources are automatically deleted after the claim window.

Do not claim the account on the user's behalf because the flow requires the user's Cloudflare identity. Do not describe an unclaimed deployment as permanent or production-ready.

## Handle Failures

- **Already authenticated:** Remove `--temporary` and use the existing account only if appropriate. Do not alter authentication state automatically.
- **Unsupported flag or command:** Confirm the resolved version and current Cloudflare documentation, then report that temporary deployment cannot be executed in the current project environment. Do not change dependencies.
- **Expired account:** Explain that the old deployment may have been deleted, create a new temporary deployment if still requested, and return its new URLs and deadline.
- **Unsupported binding or resource:** Do not silently remove it. Report the unsupported capability and use local development or an authenticated Cloudflare account if the user's goal permits.
- **Missing claim URL:** Treat the workflow as incomplete. Preserve the deploy output, verify the Wrangler version, and do not promise that the account can be claimed.
