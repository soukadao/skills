#!/usr/bin/env node

import fs from "node:fs/promises";
import process from "node:process";

function usage() {
  return `Usage:
  node scripts/axe_scan.mjs <url> [--out results.json] [--markdown results.md] [--viewport 1280x720] [--wait 1000]

Requires packages resolvable from the current working directory:
  npm install -D playwright @axe-core/playwright

Examples:
  node scripts/axe_scan.mjs http://localhost:3000 --out /tmp/axe.json --markdown /tmp/axe.md
  node scripts/axe_scan.mjs https://example.com --viewport 390x844
`;
}

function parseArgs(argv) {
  const args = {
    url: null,
    out: null,
    markdown: null,
    viewport: { width: 1280, height: 720 },
    wait: 1000,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--") && !args.url) {
      args.url = arg;
      continue;
    }
    if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--markdown") {
      args.markdown = argv[++i];
    } else if (arg === "--viewport") {
      const value = argv[++i] || "";
      const match = value.match(/^(\d+)x(\d+)$/);
      if (!match) throw new Error("--viewport must use WIDTHxHEIGHT, for example 1280x720");
      args.viewport = { width: Number(match[1]), height: Number(match[2]) };
    } else if (arg === "--wait") {
      args.wait = Number(argv[++i]);
      if (!Number.isFinite(args.wait) || args.wait < 0) throw new Error("--wait must be a non-negative number");
    } else if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.url) throw new Error("Missing URL");
  return args;
}

async function loadDependencies() {
  try {
    const playwright = await import("playwright");
    const axe = await import("@axe-core/playwright");
    return { chromium: playwright.chromium, AxeBuilder: axe.default || axe.AxeBuilder };
  } catch (error) {
    throw new Error(
      `Could not load Playwright or axe-core. Install dependencies with:\n  npm install -D playwright @axe-core/playwright\n\nOriginal error: ${error.message}`,
    );
  }
}

function summarize(results, args) {
  return {
    url: args.url,
    scannedAt: new Date().toISOString(),
    viewport: args.viewport,
    violationCount: results.violations.length,
    incompleteCount: results.incomplete.length,
    violations: results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      tags: violation.tags,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        html: node.html,
        failureSummary: node.failureSummary,
      })),
    })),
    incomplete: results.incomplete.map((item) => ({
      id: item.id,
      impact: item.impact,
      tags: item.tags,
      description: item.description,
      help: item.help,
      helpUrl: item.helpUrl,
      nodeCount: item.nodes.length,
    })),
  };
}

function escapePipes(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function toMarkdown(summary) {
  const lines = [];
  lines.push(`# axe scan: ${summary.url}`);
  lines.push("");
  lines.push(`- Scanned at: ${summary.scannedAt}`);
  lines.push(`- Viewport: ${summary.viewport.width}x${summary.viewport.height}`);
  lines.push(`- Violations: ${summary.violationCount}`);
  lines.push(`- Incomplete checks: ${summary.incompleteCount}`);
  lines.push("");
  lines.push("> Automated results are supporting evidence only. Manually verify findings before using them in an accessibility audit report.");
  lines.push("");

  if (summary.violations.length === 0) {
    lines.push("No axe violations found.");
    lines.push("");
  } else {
    lines.push("## Violations");
    lines.push("");
    lines.push("| Impact | Rule | Nodes | Help |");
    lines.push("|---|---|---:|---|");
    for (const violation of summary.violations) {
      lines.push(
        `| ${escapePipes(violation.impact)} | ${escapePipes(violation.id)} | ${violation.nodes.length} | ${escapePipes(violation.help)} |`,
      );
    }
    lines.push("");

    for (const violation of summary.violations) {
      lines.push(`### ${violation.id} (${violation.impact || "unknown"})`);
      lines.push("");
      lines.push(`- Help: ${violation.help}`);
      lines.push(`- URL: ${violation.helpUrl}`);
      lines.push(`- Tags: ${violation.tags.join(", ")}`);
      lines.push("");
      for (const [index, node] of violation.nodes.entries()) {
        lines.push(`${index + 1}. Target: \`${node.target.join(" ")}\``);
        lines.push("");
        lines.push("```html");
        lines.push(node.html);
        lines.push("```");
        if (node.failureSummary) {
          lines.push("");
          lines.push("```text");
          lines.push(node.failureSummary);
          lines.push("```");
        }
        lines.push("");
      }
    }
  }

  if (summary.incomplete.length > 0) {
    lines.push("## Incomplete Checks");
    lines.push("");
    lines.push("| Impact | Rule | Nodes | Help |");
    lines.push("|---|---|---:|---|");
    for (const item of summary.incomplete) {
      lines.push(`| ${escapePipes(item.impact)} | ${escapePipes(item.id)} | ${item.nodeCount} | ${escapePipes(item.help)} |`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { chromium, AxeBuilder } = await loadDependencies();
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({ viewport: args.viewport });
    await page.goto(args.url, { waitUntil: "networkidle" });
    if (args.wait > 0) await page.waitForTimeout(args.wait);

    const results = await new AxeBuilder({ page }).analyze();
    const summary = summarize(results, args);
    const json = `${JSON.stringify(summary, null, 2)}\n`;

    if (args.out) {
      await fs.writeFile(args.out, json, "utf8");
    } else {
      process.stdout.write(json);
    }

    if (args.markdown) {
      await fs.writeFile(args.markdown, toMarkdown(summary), "utf8");
    }

    process.exitCode = summary.violationCount > 0 ? 2 : 0;
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
