#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

function usage() {
  return `Usage:
  node scripts/capture_viewports.mjs <url> [--out dir] [--viewport name:WIDTHxHEIGHT] [--wait ms] [--full-page]

Requires Playwright:
  npm install -D playwright

Examples:
  node scripts/capture_viewports.mjs http://localhost:3000 --out /tmp/frontend-qa
  node scripts/capture_viewports.mjs http://localhost:3000 --viewport tablet:768x1024 --full-page
`;
}

function parseViewport(value) {
  const match = value.match(/^([a-zA-Z0-9_-]+):(\d+)x(\d+)$/);
  if (!match) throw new Error("--viewport must use name:WIDTHxHEIGHT, for example tablet:768x1024");
  return { name: match[1], width: Number(match[2]), height: Number(match[3]) };
}

function parseArgs(argv) {
  const args = {
    url: null,
    out: "frontend-qa-artifacts",
    viewports: [],
    wait: 1000,
    fullPage: false,
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

async function loadPlaywright() {
  try {
    const playwright = await import("playwright");
    return playwright.chromium;
  } catch (error) {
    throw new Error(`Could not load Playwright. Install it with:\n  npm install -D playwright\n\nOriginal error: ${error.message}`);
  }
}

function safeFileName(value) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "");
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
    const screenshot = `${safeFileName(viewport.name)}-${viewport.width}x${viewport.height}.png`;
    await page.screenshot({ path: path.join(args.out, screenshot), fullPage: args.fullPage });

    const metrics = await page.evaluate(() => {
      const body = document.body;
      const doc = document.documentElement;
      const horizontalOverflow = Math.max(body?.scrollWidth || 0, doc.scrollWidth || 0) > window.innerWidth;
      const textLikeElements = Array.from(document.querySelectorAll("button, a, input, textarea, select, [role='button'], [role='tab'], [role='menuitem'], h1, h2, h3, p, label, th, td"));
      const overflowingElements = textLikeElements
        .filter((element) => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
        .slice(0, 50)
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          text: (element.innerText || element.getAttribute("aria-label") || element.getAttribute("value") || "").trim().slice(0, 120),
          className: typeof element.className === "string" ? element.className : "",
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
        }));

      return {
        title: document.title,
        url: location.href,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: { width: doc.scrollWidth, height: doc.scrollHeight },
        horizontalOverflow,
        overflowingElements,
      };
    });

    return {
      viewport,
      screenshot,
      metrics,
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
  lines.push(`# Frontend QA capture: ${report.url}`);
  lines.push("");
  lines.push(`- Captured at: ${report.capturedAt}`);
  lines.push(`- Output directory: ${report.out}`);
  lines.push("");

  for (const result of report.results) {
    lines.push(`## ${result.viewport.name} (${result.viewport.width}x${result.viewport.height})`);
    lines.push("");
    lines.push(`- Screenshot: \`${result.screenshot}\``);
    lines.push(`- Final URL: ${result.metrics.url}`);
    lines.push(`- Page title: ${result.metrics.title || "(empty)"}`);
    lines.push(`- Document size: ${result.metrics.document.width}x${result.metrics.document.height}`);
    lines.push(`- Horizontal overflow: ${result.metrics.horizontalOverflow ? "yes" : "no"}`);
    lines.push(`- Potential text overflow elements: ${result.metrics.overflowingElements.length}`);
    lines.push(`- Console warnings/errors: ${result.consoleMessages.length}`);
    lines.push(`- Failed requests: ${result.failedRequests.length}`);
    lines.push(`- Page errors: ${result.pageErrors.length}`);
    lines.push("");

    if (result.metrics.overflowingElements.length > 0) {
      lines.push("### Potential Overflow");
      lines.push("");
      for (const item of result.metrics.overflowingElements.slice(0, 10)) {
        lines.push(`- \`${item.tag}\` ${item.text ? `- ${item.text}` : ""}`);
      }
      lines.push("");
    }

    if (result.consoleMessages.length > 0) {
      lines.push("### Console Messages");
      lines.push("");
      for (const message of result.consoleMessages.slice(0, 10)) {
        lines.push(`- ${message.type}: ${message.text}`);
      }
      lines.push("");
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const chromium = await loadPlaywright();
  await fs.mkdir(args.out, { recursive: true });

  const browser = await chromium.launch();
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
  console.error("");
  console.error(usage());
  process.exit(1);
});
