# Capture To k6 Conversion

## Filtering

Keep:

- First-party API calls.
- HTML document requests only when server-rendered pages are part of the load target.
- Auth/session calls when the load profile includes login.
- Polling or streaming calls only when they are core to the journey.

Exclude by default:

- Static assets, fonts, images, source maps, and favicon requests.
- Analytics, ads, tags, maps, social widgets, captcha, and telemetry.
- Browser extension, HMR, dev-server, and local tooling requests.
- Vite development noise such as `/@vite/client`, `/src/*?t=...`, `/node_modules/.vite/*`, and websocket reconnect traffic.
- Duplicate preflight requests unless CORS behavior is part of the test.

Start from `chrome-devtools list_network_requests`, then use `chrome-devtools get_network_request` only for requests that survive filtering.

## SPA Navigation

Single-page apps often update `window.history` and re-render without a document navigation. Treat each UI step as a possible request boundary:

- Re-capture or re-snapshot after each click because DOM handles may become stale.
- Check whether route/query changes trigger the same API calls repeatedly.
- Convert repeated API calls into intentional k6 steps only when they represent real backend work.
- Do not model browser-only URL changes as HTTP requests unless the server receives them.

Example: a tab click may only change `?node=...` in the URL, but the app may still refetch `/api/files` and `/api/document?path=...`. In k6, group that as a business action such as `Switch document section` and keep the labels stable.

## Correlation

Find runtime-generated values and replace hardcoded captures with extraction logic.

Common values:

- CSRF token from HTML, JSON, cookie, or meta tag.
- Auth token or session cookie from login response.
- Resource ID from create response used in update, view, or delete requests.
- Cursor or page token from list response.
- ETag, version, or revision value for concurrency control.
- Signed URL, nonce, timestamp, or anti-replay token.

Rules:

- Extract from the nearest prior response that actually produces the value.
- Fail clearly if extraction returns null or an unexpected shape.
- Do not silently continue with stale captured IDs.
- Keep correlation code near the business step that needs it.

## k6 Grouping

```javascript
import http from 'k6/http';
import { check, group, fail, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  group('Browse catalog', () => {
    const res = http.get(`${BASE_URL}/api/products`, {
      tags: { name: 'GET /api/products' },
    });

    check(res, {
      'products status is 200': (r) => r.status === 200,
      'products has items': (r) => Array.isArray(r.json('items')),
    });
  });

  sleep(1);
}
```

Use labels/tags that are stable across IDs and query strings:

```text
GET /api/products
POST /api/cart/items
POST /api/orders
```

Avoid labels like:

```text
GET /api/products/928374?session=abc
```

## Extract And Reuse IDs

```javascript
const createRes = http.post(`${BASE_URL}/api/cart/items`, JSON.stringify(payload), params);

const itemId = createRes.json('item.id');
if (!itemId) {
  fail(`missing item.id from cart response: status=${createRes.status}`);
}

const viewRes = http.get(`${BASE_URL}/api/cart/items/${itemId}`, {
  tags: { name: 'GET /api/cart/items/:id' },
});
```

## CSRF Token Example

```javascript
const pageRes = http.get(`${BASE_URL}/checkout`, {
  tags: { name: 'GET /checkout' },
});

const csrf = pageRes.html().find('meta[name="csrf-token"]').attr('content');
if (!csrf) {
  fail('missing csrf token on checkout page');
}

const params = {
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrf,
  },
};
```

## Error Handling

Every generated script should check:

- Expected status code.
- Expected content type where relevant.
- Required response fields.
- Business success state.

When a dependency value is missing, fail the iteration with a useful message rather than sending malformed follow-up requests.

## Conversion Checklist

- Dynamic IDs and tokens are extracted.
- Labels hide IDs and volatile query strings.
- Groups match business actions.
- Third-party and static requests are removed.
- Development-server noise is removed.
- SPA route changes are represented by the backend requests they trigger, not by UI state alone.
- Checks validate response content, not just status.
- Secrets are read from environment variables.
- Pacing is intentional and configurable.
