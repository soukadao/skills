#!/usr/bin/env node

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";

const DEFAULT_VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean);

function assistantCss() {
  const rules = [
    ".UI_Build_Assistant * { outline: 1px solid rgb(0, 0, 0) !important; background-color: unset; }",
    ".UI_Build_Assistant { background-color: rgb(245, 255, 245) !important; }",
  ];

  for (let depth = 1; depth <= 24; depth += 1) {
    const green = Math.max(135, 255 - depth * 5);
    rules.push(`.UI_Build_Assistant ${"> * ".repeat(depth).trim()} { background-color: rgb(${245 - depth * 10}, ${green}, ${245 - depth * 10}) !important; }`);
  }

  rules.push(".UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * * { outline: 1px solid rgb(255, 255, 255) !important; }");
  return rules.join("\n");
}

function usage() {
  return `Usage:
  node ui-build-assistant/scripts/capture_ui_build_assistant_cdp.mjs <url> [--out dir] [--viewport name:WIDTHxHEIGHT] [--wait ms] [--full-page] [--assisted-only]

Uses Chrome DevTools Protocol directly. No Playwright dependency is required.

Examples:
  node ui-build-assistant/scripts/capture_ui_build_assistant_cdp.mjs http://localhost:3000 --out /tmp/ui-build-assistant
  CHROME_PATH=/path/to/chrome node ui-build-assistant/scripts/capture_ui_build_assistant_cdp.mjs file:///tmp/page.html --viewport mobile:390x844
`;
}

function parseViewport(value) {
  const match = value.match(/^([a-zA-Z0-9_-]+):(\d+)x(\d+)$/);
  if (!match) throw new Error("--viewport must use name:WIDTHxHEIGHT, for example desktop:1440x900");
  return { name: match[1], width: Number(match[2]), height: Number(match[3]) };
}

function parseArgs(argv) {
  const args = {
    url: null,
    out: "ui-build-assistant-artifacts",
    viewports: [],
    wait: 1000,
    fullPage: false,
    assistedOnly: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--") && !args.url) {
      args.url = arg;
    } else if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--viewport") {
      args.viewports.push(parseViewport(argv[++i] || ""));
    } else if (arg === "--wait") {
      args.wait = Number(argv[++i]);
      if (!Number.isFinite(args.wait) || args.wait < 0) throw new Error("--wait must be a non-negative number");
    } else if (arg === "--full-page") {
      args.fullPage = true;
    } else if (arg === "--assisted-only") {
      args.assistedOnly = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.url) throw new Error("Missing URL");
  if (args.viewports.length === 0) args.viewports = DEFAULT_VIEWPORTS;
  return args;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    if (await exists(candidate)) return candidate;
  }
  throw new Error("Chrome was not found. Set CHROME_PATH=/path/to/chrome and try again.");
}

function waitForDevTools(child) {
  return new Promise((resolve, reject) => {
    let stderr = "";
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for DevTools endpoint.\n${stderr}`)), 10000);

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });

    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited before DevTools was ready: ${code}\n${stderr}`));
    });
  });
}

class Cdp {
  constructor(webSocketUrl) {
    this.nextId = 1;
    this.callbacks = new Map();
    this.events = [];
    this.socket = new WebSocket(webSocketUrl);
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.callbacks.has(message.id)) {
        const { resolve, reject } = this.callbacks.get(message.id);
        this.callbacks.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result || {});
      } else {
        this.events.push(message);
      }
    });
  }

  async send(method, params = {}, sessionId = null) {
    await this.ready;
    const id = this.nextId++;
    this.socket.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
    });
  }

  close() {
    this.socket.close();
  }
}

function safeFileName(value) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "") || "screenshot";
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForLoad(cdp, timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const state = await cdp.send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
    if (state.result?.value === "complete") return;
    await delay(100);
  }
}

async function capture(cdp, args, viewport) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width < 600,
  });
  await cdp.send("Page.navigate", { url: args.url });
  await waitForLoad(cdp);
  if (args.wait > 0) await delay(args.wait);

  const baseName = `${safeFileName(viewport.name)}-${viewport.width}x${viewport.height}`;
  const screenshots = {};

  if (!args.assistedOnly) {
    const normal = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: args.fullPage,
    });
    screenshots.normal = `${baseName}.png`;
    await fs.writeFile(path.join(args.out, screenshots.normal), Buffer.from(normal.data, "base64"));
  }

  await cdp.send("Runtime.evaluate", {
    expression: `
      (() => {
        const style = document.createElement("style");
        style.textContent = ${JSON.stringify(assistantCss())};
        document.documentElement.appendChild(style);
        document.body.classList.add("UI_Build_Assistant");
      })();
    `,
  });

  const assisted = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: args.fullPage,
  });
  screenshots.assisted = `${baseName}-assisted.png`;
  await fs.writeFile(path.join(args.out, screenshots.assisted), Buffer.from(assisted.data, "base64"));

  const metrics = await cdp.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `
      (() => {
        const body = document.body;
        const doc = document.documentElement;
        return {
          title: document.title,
          url: location.href,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          document: { width: doc.scrollWidth, height: doc.scrollHeight },
          horizontalOverflow: Math.max(body?.scrollWidth || 0, doc.scrollWidth || 0) > window.innerWidth
        };
      })();
    `,
  });

  return { viewport, screenshots, metrics: metrics.result?.value || {} };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const chromePath = await findChrome();
  const profileDir = await fs.mkdtemp(path.join(os.tmpdir(), "ui-build-assistant-chrome-"));
  await fs.mkdir(args.out, { recursive: true });

  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  const browserWs = await waitForDevTools(chrome);
  const cdp = new Cdp(browserWs);

  try {
    await cdp.send("Target.setDiscoverTargets", { discover: true });
    const target = await cdp.send("Target.createTarget", { url: "about:blank" });
    const attached = await cdp.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    const pageCdp = {
      send: (method, params = {}) => cdp.send(method, params, sessionId),
    };

    await pageCdp.send("Page.enable");
    await pageCdp.send("Runtime.enable");

    const results = [];
    for (const viewport of args.viewports) {
      results.push(await capture(pageCdp, args, viewport));
    }

    const report = { url: args.url, capturedAt: new Date().toISOString(), out: args.out, results };
    await fs.writeFile(path.join(args.out, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(`Wrote ${path.join(args.out, "report.json")}`);
  } finally {
    cdp.close();
    chrome.kill();
    await fs.rm(profileDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
