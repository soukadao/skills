#!/usr/bin/env tsx

import { pathToFileURL } from "node:url";
import awsShapeCatalog from "../assets/aws-shape-catalog.json" with { type: "json" };
import commonShapeCatalog from "../assets/common-shape-catalog.json" with { type: "json" };

export type Provider = "common" | "aws" | "google";

export interface ShapeCatalog {
  provider: Provider;
  groups: ShapeGroup[];
}

export interface ShapeGroup {
  name: string;
  shapes: Shape[];
}

export interface Shape {
  name: string;
  style: string;
}

export const shapeCatalogs: ShapeCatalog[] = [
  commonShapeCatalog as ShapeCatalog,
  awsShapeCatalog as ShapeCatalog,
];

export interface AvailableShape {
  provider: Provider;
  group: string;
  name: string;
}

export function getShapeStyle(provider: Provider, shapeName: string): string {
  const catalog = shapeCatalogs.find((item) => item.provider === provider);

  if (!catalog) {
    throw new Error(`Provider is not available: ${provider}`);
  }

  for (const group of catalog.groups) {
    const shape = group.shapes.find((item) => item.name === shapeName);

    if (shape) {
      return shape.style;
    }
  }

  throw new Error(`Shape is not available: ${provider}/${shapeName}`);
}

export function listAvailableShapes(provider?: Provider): AvailableShape[] {
  const catalogs = provider
    ? shapeCatalogs.filter((item) => item.provider === provider)
    : shapeCatalogs;

  if (provider && catalogs.length === 0) {
    throw new Error(`Provider is not available: ${provider}`);
  }

  return catalogs.flatMap((catalog) =>
    catalog.groups.flatMap((group) =>
      group.shapes.map((shape) => ({
        provider: catalog.provider,
        group: group.name,
        name: shape.name,
      })),
    ),
  );
}

function parseProvider(value: string): Provider {
  if (value === "common" || value === "aws" || value === "google") {
    return value;
  }

  throw new Error(`Provider is not supported: ${value}`);
}

function printUsage(): void {
  console.log(`Usage:
  tsx shape-catalog.ts list [provider]
  tsx shape-catalog.ts style <provider> <shape-name>

Examples:
  tsx shape-catalog.ts list
  tsx shape-catalog.ts list common
  tsx shape-catalog.ts list aws
  tsx shape-catalog.ts style common arrow
  tsx shape-catalog.ts style aws vpc`);
}

function runCli(args: string[]): void {
  const [command, providerArg, shapeName] = args;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printUsage();
    return;
  }

  if (command === "list") {
    const provider = providerArg ? parseProvider(providerArg) : undefined;
    console.table(listAvailableShapes(provider));
    return;
  }

  if (command === "style") {
    if (!providerArg || !shapeName) {
      throw new Error("style command requires <provider> and <shape-name>.");
    }

    console.log(getShapeStyle(parseProvider(providerArg), shapeName));
    return;
  }

  throw new Error(`Command is not supported: ${command}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    runCli(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    printUsage();
    process.exitCode = 1;
  }
}
