# chrome-devtools CLI Capture

Use `chrome-devtools` CLI to operate a browser and capture network requests for k6 conversion.

## Startup

Check the CLI:

```bash
chrome-devtools --help
chrome-devtools status
```

The CLI uses a background `chrome-devtools-mcp` daemon. The first tool call can start the daemon automatically and later commands reuse the same browser state. Use manual control only when needed:

```bash
chrome-devtools start --headless --isolated --redactNetworkHeaders=true --usageStatistics=false
chrome-devtools status
chrome-devtools stop
```

Headless is enabled by default. Isolated is enabled by default unless `--userDataDir` is provided. Use `--redactNetworkHeaders=true` unless raw headers are explicitly needed. Be careful with cookies, auth headers, and private URLs.

## Basic Capture Flow

Open the target:

```bash
chrome-devtools new_page 'http://localhost:3000/checkout'
```

Or navigate the selected page:

```bash
chrome-devtools navigate_page --type url --url 'http://localhost:3000/checkout'
```

Take a UI snapshot and identify clickable elements:

```bash
chrome-devtools take_snapshot
```

Click or type through the scenario:

```bash
chrome-devtools click <uid> --includeSnapshot
chrome-devtools fill <uid> 'value' --includeSnapshot
chrome-devtools press_key Enter --includeSnapshot
```

List captured network requests:

```bash
chrome-devtools list_network_requests --output-format json
```

Get request and response details:

```bash
chrome-devtools get_network_request --reqid <id> --output-format json
```

For large bodies, write request/response bodies to files:

```bash
chrome-devtools get_network_request --reqid <id> --requestFilePath artifacts/request.network-request --responseFilePath artifacts/response.network-response
```

## Useful Filters

Filter by resource type when supported:

```bash
chrome-devtools list_network_requests --resourceTypes fetch xhr --output-format json
```

Use preserved requests when a navigation clears the list:

```bash
chrome-devtools list_network_requests --includePreservedRequests --output-format json
```

## Conversion Notes

- Treat `list_network_requests` as the source of truth for what the browser actually requested.
- Use `get_network_request` for request bodies, response bodies, headers, status, and timing.
- Exclude static assets, dev-server traffic, analytics, third-party requests, and browser-only noise before generating k6.
- Keep raw network artifacts out of commits if they include secrets, cookies, PII, or private URLs.

## Troubleshooting

If the CLI hangs or fails to connect:

- Run `chrome-devtools stop`.
- Retry the command.
- For verbose troubleshooting, run the failing command with `DEBUG=*`.

In a sandboxed agent environment, `chrome-devtools` may need to run outside the filesystem or process sandbox because it starts a background daemon and Chrome process. If commands fail with `connect ENOENT /tmp/chrome-devtools-mcp-*.sock`, rerun the same `chrome-devtools` command with the required execution approval rather than switching tools.
