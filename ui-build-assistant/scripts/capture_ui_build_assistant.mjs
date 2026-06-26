#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const DEFAULT_VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const ASSISTANT_CSS = `
.UI_Build_Assistant * {
  outline: 1px solid rgb(0, 0, 0) !important;
  background-color: unset;
}

.UI_Build_Assistant {
  background-color: rgb(245, 255, 245) !important;
}

.UI_Build_Assistant > * {
  background-color: rgb(235, 250, 235) !important;
}

.UI_Build_Assistant > * > * {
  background-color: rgb(225, 245, 225) !important;
}

.UI_Build_Assistant > * > * > * {
  background-color: rgb(215, 240, 215) !important;
}

.UI_Build_Assistant > * > * > * > * {
  background-color: rgb(205, 235, 205) !important;
}

.UI_Build_Assistant > * > * > * > * > * {
  background-color: rgb(195, 230, 195) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * {
  background-color: rgb(185, 225, 185) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * {
  background-color: rgb(175, 220, 175) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * {
  background-color: rgb(165, 215, 165) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * {
  background-color: rgb(155, 210, 155) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(145, 205, 145) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(135, 200, 135) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(125, 195, 125) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(115, 190, 115) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(105, 185, 105) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(95, 180, 95) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * * {
  outline: 1px solid rgb(255, 255, 255) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(85, 175, 85) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(75, 170, 75) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(65, 165, 65) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(55, 160, 55) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(45, 155, 45) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(35, 150, 35) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(25, 145, 25) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(15, 140, 15) !important;
}

.UI_Build_Assistant > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * > * {
  background-color: rgb(5, 135, 5) !important;
}
`;

function usage() {
  return `Usage:
  node ui-build-assistant/scripts/capture_ui_build_assistant.mjs <url> [--out dir] [--viewport name:WIDTHxHEIGHT] [--wait ms] [--full-page] [--assisted-only] [--channel chrome]

Examples:
  node ui-build-assistant/scripts/capture_ui_build_assistant.mjs http://localhost:3000 --out /tmp/ui-build-assistant
  npx -y -p playwright node ui-build-assistant/scripts/capture_ui_build_assistant.mjs http://localhost:3000 --channel chrome
  node ui-build-assistant/scripts/capture_ui_build_assistant.mjs file:///tmp/page.html --viewport mobile:390x844 --full-page
`;
}

function parseViewport(value) {
  const match = value.match(/^([a-zA-Z0-9_-]+):(\d+)x(\d+)$/);
  if (!match) {
    throw new Error("--viewport must use name:WIDTHxHEIGHT, for example desktop:1440x900");
  }
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
    channel: null,
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
      if (!Number.isFinite(args.wait) || args.wait < 0) {
        throw new Error("--wait must be a non-negative number");
      }
    } else if (arg === "--full-page") {
      args.fullPage = true;
    } else if (arg === "--assisted-only") {
      args.assistedOnly = true;
    } else if (arg === "--channel") {
      args.channel = argv[++i];
      if (!args.channel) throw new Error("--channel requires a value, for example chrome");
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

async function loadChromium() {
  try {
    const playwright = await import("playwright");
    return playwright.chromium;
  } catch (error) {
    const pathEntries = (process.env.PATH || "").split(path.delimiter);
    for (const entry of pathEntries) {
      if (!entry.endsWith(`${path.sep}node_modules${path.sep}.bin`)) continue;
      const moduleRoot = path.dirname(entry);
      try {
        const requireFromNpx = createRequire(path.join(moduleRoot, "playwright-loader.cjs"));
        return requireFromNpx("playwright").chromium;
      } catch {
        // Continue searching other npx/npm package bins.
      }
    }

    throw new Error(`Could not load Playwright. Install it with:\n  npm install -D playwright\n\nOr run through npx:\n  npx -y -p playwright node ui-build-assistant/scripts/capture_ui_build_assistant.mjs <url> --channel chrome\n\nOriginal error: ${error.message}`);
  }
}

function safeFileName(value) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "") || "screenshot";
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const body = document.body;
    const doc = document.documentElement;
    const elements = Array.from(document.querySelectorAll("*"));
    const maxDepth = elements.reduce((max, element) => {
      let depth = 0;
      let current = element;
      while (current.parentElement) {
        depth += 1;
        current = current.parentElement;
      }
      return Math.max(max, depth);
    }, 0);

    return {
      title: document.title,
      url: location.href,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      document: { width: doc.scrollWidth, height: doc.scrollHeight },
      horizontalOverflow: Math.max(body?.scrollWidth || 0, doc.scrollWidth || 0) > window.innerWidth,
      elementCount: elements.length,
      maxDepth,
    };
  });
}

async function captureViewport(browser, args, viewport) {
  const consoleMessages = [];
  const failedRequests = [];
  const pageErrors = [];
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on("requestfailed", (request) => {
    failedRequests.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure()?.errorText || "unknown",
    });
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  try {
    await page.goto(args.url, { waitUntil: "networkidle" });
    if (args.wait > 0) await page.waitForTimeout(args.wait);

    const baseName = `${safeFileName(viewport.name)}-${viewport.width}x${viewport.height}`;
    const normalScreenshot = `${baseName}.png`;
    if (!args.assistedOnly) {
      await page.screenshot({ path: path.join(args.out, normalScreenshot), fullPage: args.fullPage });
    }

    await page.addStyleTag({ content: ASSISTANT_CSS });
    await page.evaluate(() => document.body.classList.add("UI_Build_Assistant"));
    const assistedScreenshot = `${baseName}-assisted.png`;
    await page.screenshot({ path: path.join(args.out, assistedScreenshot), fullPage: args.fullPage });

    return {
      viewport,
      normalScreenshot: args.assistedOnly ? null : normalScreenshot,
      assistedScreenshot,
      metrics: await collectMetrics(page),
      consoleMessages,
      failedRequests,
      pageErrors,
    };
  } finally {
    await page.close();
  }
}

function toMarkdown(report) {
  const lines = [];
  lines.push(`# UI Build Assistant capture: ${report.url}`);
  lines.push("");
  lines.push(`- Captured at: ${report.capturedAt}`);
  lines.push(`- Output directory: ${report.out}`);
  lines.push("");

  for (const result of report.results) {
    lines.push(`## ${result.viewport.name} (${result.viewport.width}x${result.viewport.height})`);
    lines.push("");
    if (result.normalScreenshot) lines.push(`- Normal screenshot: \`${result.normalScreenshot}\``);
    lines.push(`- Assisted screenshot: \`${result.assistedScreenshot}\``);
    lines.push(`- Final URL: ${result.metrics.url}`);
    lines.push(`- Page title: ${result.metrics.title || "(empty)"}`);
    lines.push(`- Document size: ${result.metrics.document.width}x${result.metrics.document.height}`);
    lines.push(`- Horizontal overflow: ${result.metrics.horizontalOverflow ? "yes" : "no"}`);
    lines.push(`- Element count: ${result.metrics.elementCount}`);
    lines.push(`- Max DOM depth: ${result.metrics.maxDepth}`);
    lines.push(`- Console warnings/errors: ${result.consoleMessages.length}`);
    lines.push(`- Failed requests: ${result.failedRequests.length}`);
    lines.push(`- Page errors: ${result.pageErrors.length}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const chromium = await loadChromium();
  await fs.mkdir(args.out, { recursive: true });

  const browser = await chromium.launch(args.channel ? { channel: args.channel } : {});
  try {
    const results = [];
    for (const viewport of args.viewports) {
      results.push(await captureViewport(browser, args, viewport));
    }

    const report = {
      url: args.url,
      capturedAt: new Date().toISOString(),
      out: args.out,
      results,
    };

    await fs.writeFile(path.join(args.out, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
    await fs.writeFile(path.join(args.out, "report.md"), toMarkdown(report), "utf8");
    console.log(`Wrote ${path.join(args.out, "report.md")}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
