#!/usr/bin/env tsx

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

interface Geometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Cell {
  id: string;
  value: string;
  style: string;
  parent?: string;
  source?: string;
  target?: string;
  vertex: boolean;
  edge: boolean;
  geometry?: Geometry;
  points: Point[];
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

interface Finding {
  severity: "error" | "warning";
  code: string;
  message: string;
}

const MIN_ICON_GROUP_PADDING = 30;
const SERVICE_LABEL_HEIGHT = 32;
const GROUP_BORDER_TOLERANCE = 2;
const EDGE_OVERLAP_TOLERANCE = 2;
const MIN_EDGE_OVERLAP_LENGTH = 12;
const EDGE_ICON_TOUCH_TOLERANCE = 1;
const MIN_GROUP_GAP = 30;
const GROUP_HEADER_HEIGHT = 50;
const MAX_EDGE_WAYPOINTS = 1;
const INTERNET_GATEWAY_TOP_CENTER_X_TOLERANCE = 24;
const INTERNET_GATEWAY_TOP_CENTER_Y_TOLERANCE = 8;

function decodeXml(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseAttributes(input: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const attrPattern = /([\w:-]+)="([^"]*)"/g;
  let match: RegExpExecArray | null;

  while ((match = attrPattern.exec(input))) {
    attributes[match[1]] = decodeXml(match[2]);
  }

  return attributes;
}

function parseNumber(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCells(xml: string): Map<string, Cell> {
  const cells = new Map<string, Cell>();
  const normalizedXml = xml.replace(/<mxCell\b([^>]*)\/>/g, "<mxCell$1></mxCell>");
  const cellPattern = /<mxCell\b([^>]*)>([\s\S]*?)<\/mxCell>/g;
  let match: RegExpExecArray | null;

  while ((match = cellPattern.exec(normalizedXml))) {
    const attrs = parseAttributes(match[1]);
    const body = match[2] ?? "";
    const geometryMatch = body.match(/<mxGeometry\b([^>]*)(?:\/>|>[\s\S]*?<\/mxGeometry>)/);
    const geometryAttrs = geometryMatch ? parseAttributes(geometryMatch[1]) : undefined;
    const points = [...body.matchAll(/<mxPoint\b([^>]*)\/>/g)].map((pointMatch) => {
      const pointAttrs = parseAttributes(pointMatch[1]);
      return {
        x: parseNumber(pointAttrs.x),
        y: parseNumber(pointAttrs.y),
      };
    });

    if (!attrs.id) {
      continue;
    }

    cells.set(attrs.id, {
      id: attrs.id,
      value: attrs.value ?? "",
      style: attrs.style ?? "",
      parent: attrs.parent,
      source: attrs.source,
      target: attrs.target,
      vertex: attrs.vertex === "1",
      edge: attrs.edge === "1",
      points,
      geometry: geometryAttrs
        ? {
            x: parseNumber(geometryAttrs.x),
            y: parseNumber(geometryAttrs.y),
            width: parseNumber(geometryAttrs.width),
            height: parseNumber(geometryAttrs.height),
          }
        : undefined,
    });
  }

  return cells;
}

function absoluteRect(cell: Cell, cells: Map<string, Cell>, seen = new Set<string>()): Rect | undefined {
  if (!cell.geometry) {
    return undefined;
  }

  let x = cell.geometry.x;
  let y = cell.geometry.y;
  const width = cell.geometry.width;
  const height = cell.geometry.height;

  if (cell.parent && !seen.has(cell.parent)) {
    seen.add(cell.parent);
    const parent = cells.get(cell.parent);
    const parentRect = parent ? absoluteRect(parent, cells, seen) : undefined;
    if (parentRect) {
      x += parentRect.x;
      y += parentRect.y;
    }
  }

  return { x, y, width, height };
}

function displayName(cell: Cell): string {
  const text = cell.value.replace(/<br\s*\/?>/gi, " / ").replace(/<[^>]+>/g, "").trim();
  return text ? `${cell.id} (${text})` : cell.id;
}

function styleValue(style: string, key: string): string | undefined {
  const entry = style
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`));

  return entry?.slice(key.length + 1);
}

function isAwsServiceIcon(cell: Cell): boolean {
  if (!cell.vertex) {
    return false;
  }

  const shape = styleValue(cell.style, "shape");
  if (!shape?.startsWith("mxgraph.aws4.")) {
    return false;
  }

  const resourceIcon = styleValue(cell.style, "resIcon");
  if (resourceIcon === "mxgraph.aws4.users" || resourceIcon === "mxgraph.aws4.user") {
    return false;
  }

  return !shape.startsWith("mxgraph.aws4.group") && !shape.startsWith("mxgraph.aws4.illustration_");
}

function isLegendCell(cell: Cell, cells: Map<string, Cell>): boolean {
  return cell.id.startsWith("legend") || parentChain(cell, cells).some((parent) => parent.id.startsWith("legend"));
}

function isPlainLine(edge: Cell): boolean {
  if (!edge.edge) {
    return false;
  }

  const startArrow = styleValue(edge.style, "startArrow");
  const endArrow = styleValue(edge.style, "endArrow");
  return (!startArrow || startArrow === "none") && (!endArrow || endArrow === "none");
}

function isAwsCloudGroup(cell: Cell): boolean {
  return cell.vertex && cell.style.includes("grIcon=mxgraph.aws4.group_aws_cloud");
}

function isAwsRegionGroup(cell: Cell): boolean {
  return cell.vertex && cell.style.includes("grIcon=mxgraph.aws4.group_region");
}

function isAwsVpcGroup(cell: Cell): boolean {
  return cell.vertex && cell.style.includes("grIcon=mxgraph.aws4.group_vpc");
}

function isAwsInternetGatewayIcon(cell: Cell): boolean {
  return isAwsServiceIcon(cell) && styleValue(cell.style, "shape") === "mxgraph.aws4.internet_gateway";
}

function isAwsAvailabilityZoneGroup(cell: Cell): boolean {
  return cell.vertex && normalizedValue(cell).includes("availability zone");
}

function isAwsSubnetGroup(cell: Cell): boolean {
  const value = normalizedValue(cell);
  return cell.vertex && (value.includes("subnet") || cell.style.includes("grIcon=mxgraph.aws4.group_security_group"));
}

function normalizedValue(cell: Cell): string {
  return cell.value
    .replace(/&#xa;/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .trim();
}

function isStyledAwsGroup(cell: Cell): boolean {
  const shape = styleValue(cell.style, "shape");
  return (
    cell.vertex &&
    (cell.style.includes("grIcon=mxgraph.aws4.group_") ||
      shape === "mxgraph.aws4.group" ||
      shape === "mxgraph.aws4.groupCenter")
  );
}

function isAwsLayoutGroup(cell: Cell, cells: Map<string, Cell>): boolean {
  if (!cell.vertex || isAwsServiceIcon(cell)) {
    return false;
  }

  if (isStyledAwsGroup(cell)) {
    return true;
  }

  return hasChildren(cell, cells) && parentChain(cell, cells).some(isStyledAwsGroup);
}

function hasChildren(parent: Cell, cells: Map<string, Cell>): boolean {
  return [...cells.values()].some((cell) => cell.parent === parent.id);
}

function parentChain(cell: Cell, cells: Map<string, Cell>): Cell[] {
  const parents: Cell[] = [];
  const seen = new Set<string>();
  let current = cell;

  while (current.parent && !seen.has(current.parent)) {
    seen.add(current.parent);
    const parent = cells.get(current.parent);
    if (!parent) {
      break;
    }
    parents.push(parent);
    current = parent;
  }

  return parents;
}

function isDescendantOf(cell: Cell, ancestor: Cell, cells: Map<string, Cell>): boolean {
  return parentChain(cell, cells).some((parent) => parent.id === ancestor.id);
}

function expectedVpcForInternetGateway(
  gateway: { cell: Cell; rect: Rect },
  vpcGroups: Array<{ cell: Cell; rect: Rect }>,
  cells: Map<string, Cell>,
): { cell: Cell; rect: Rect } | undefined {
  const descendantVpc = vpcGroups
    .filter((vpc) => isDescendantOf(gateway.cell, vpc.cell, cells))
    .sort((a, b) => area(a.rect) - area(b.rect))[0];
  if (descendantVpc) {
    return descendantVpc;
  }

  if (vpcGroups.length === 1) {
    return vpcGroups[0];
  }

  const gatewayCenter = center(gateway.rect);
  return vpcGroups
    .map((vpc) => ({
      vpc,
      distance: distanceSquared(gatewayCenter, { x: vpc.rect.x + vpc.rect.width / 2, y: vpc.rect.y }),
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.vpc;
}

function isInternetGatewayOnVpcTopCenter(gatewayRect: Rect, vpcRect: Rect): boolean {
  const gatewayCenter = center(gatewayRect);
  const expectedCenterX = vpcRect.x + vpcRect.width / 2;
  return (
    Math.abs(gatewayCenter.x - expectedCenterX) <= INTERNET_GATEWAY_TOP_CENTER_X_TOLERANCE &&
    Math.abs(gatewayCenter.y - vpcRect.y) <= INTERNET_GATEWAY_TOP_CENTER_Y_TOLERANCE
  );
}

function hasAncestorRelation(first: Cell, second: Cell, cells: Map<string, Cell>): boolean {
  return isDescendantOf(first, second, cells) || isDescendantOf(second, first, cells);
}

function serviceRect(cell: Cell, cells: Map<string, Cell>): Rect | undefined {
  const rect = absoluteRect(cell, cells);
  if (!rect) {
    return undefined;
  }

  return {
    x: rect.x,
    y: rect.y,
    width: Math.max(rect.width, 64),
    height: Math.max(rect.height + SERVICE_LABEL_HEIGHT, 96),
  };
}

function iconRect(cell: Cell, cells: Map<string, Cell>): Rect | undefined {
  const rect = absoluteRect(cell, cells);
  if (!rect) {
    return undefined;
  }

  return {
    x: rect.x,
    y: rect.y,
    width: Math.max(rect.width, 64),
    height: Math.max(rect.height, 64),
  };
}

function center(rect: Rect): Point {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function groupBorderRects(group: Rect): Rect[] {
  const thickness = GROUP_BORDER_TOLERANCE * 2;
  return [
    { x: group.x - GROUP_BORDER_TOLERANCE, y: group.y - GROUP_BORDER_TOLERANCE, width: thickness, height: group.height + thickness },
    { x: group.x + group.width - GROUP_BORDER_TOLERANCE, y: group.y - GROUP_BORDER_TOLERANCE, width: thickness, height: group.height + thickness },
    { x: group.x - GROUP_BORDER_TOLERANCE, y: group.y - GROUP_BORDER_TOLERANCE, width: group.width + thickness, height: thickness },
    { x: group.x - GROUP_BORDER_TOLERANCE, y: group.y + group.height - GROUP_BORDER_TOLERANCE, width: group.width + thickness, height: thickness },
  ];
}

function intersectsGroupBorder(item: Rect, group: Rect): boolean {
  return groupBorderRects(group).some((border) => intersects(item, border));
}

function containsWithPadding(container: Rect, item: Rect, padding: number): boolean {
  return (
    item.x >= container.x + padding &&
    item.y >= container.y + padding &&
    item.x + item.width <= container.x + container.width - padding &&
    item.y + item.height <= container.y + container.height - padding
  );
}

function containsWithoutPadding(container: Rect, item: Rect): boolean {
  return (
    item.x >= container.x &&
    item.y >= container.y &&
    item.x + item.width <= container.x + container.width &&
    item.y + item.height <= container.y + container.height
  );
}

function insetRect(rect: Rect, amount: number): Rect {
  return {
    x: rect.x + amount,
    y: rect.y + amount,
    width: Math.max(0, rect.width - amount * 2),
    height: Math.max(0, rect.height - amount * 2),
  };
}

function minDistanceBetweenRects(a: Rect, b: Rect): number {
  if (intersects(a, b)) {
    return 0;
  }

  const horizontalGap = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width), 0);
  const verticalGap = Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height), 0);
  return Math.max(horizontalGap, verticalGap);
}

function groupContentRect(group: Rect): Rect {
  return {
    x: group.x + MIN_ICON_GROUP_PADDING,
    y: group.y + GROUP_HEADER_HEIGHT,
    width: Math.max(0, group.width - MIN_ICON_GROUP_PADDING * 2),
    height: Math.max(0, group.height - GROUP_HEADER_HEIGHT - MIN_ICON_GROUP_PADDING),
  };
}

function area(rect: Rect): number {
  return rect.width * rect.height;
}

function segmentIntersectsRect(a: Point, b: Point, rect: Rect): boolean {
  const minX = Math.min(a.x, b.x);
  const maxX = Math.max(a.x, b.x);
  const minY = Math.min(a.y, b.y);
  const maxY = Math.max(a.y, b.y);

  if (maxX < rect.x || minX > rect.x + rect.width || maxY < rect.y || minY > rect.y + rect.height) {
    return false;
  }

  if (a.x === b.x) {
    return a.x >= rect.x && a.x <= rect.x + rect.width && maxY >= rect.y && minY <= rect.y + rect.height;
  }

  if (a.y === b.y) {
    return a.y >= rect.y && a.y <= rect.y + rect.height && maxX >= rect.x && minX <= rect.x + rect.width;
  }

  return lineIntersectsRect(a, b, rect);
}

function lineIntersectsRect(a: Point, b: Point, rect: Rect): boolean {
  const corners = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ];

  return (
    pointInRect(a, rect) ||
    pointInRect(b, rect) ||
    segmentsIntersect(a, b, corners[0], corners[1]) ||
    segmentsIntersect(a, b, corners[1], corners[2]) ||
    segmentsIntersect(a, b, corners[2], corners[3]) ||
    segmentsIntersect(a, b, corners[3], corners[0])
  );
}

function pointInRect(point: Point, rect: Rect): boolean {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}

function segmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);

  return o1 !== o2 && o3 !== o4;
}

function edgeSegments(edge: Cell, cells: Map<string, Cell>): Array<[Point, Point]> {
  const path = edgePath(edge, cells);
  return pathToSegments(path);
}

function edgeCollisionSegments(edge: Cell, cells: Map<string, Cell>): Array<[Point, Point]> {
  if (edge.style.includes("edgeStyle=orthogonalEdgeStyle") && edge.points.length === 0) {
    return visibleOrthogonalCandidatePaths(edge, cells).flatMap(pathToSegments);
  }

  const path = visibleEdgePath(edge, cells);
  if (!edge.style.includes("edgeStyle=orthogonalEdgeStyle")) {
    return pathToSegments(path);
  }

  return orthogonalCollisionSegments(path, false);
}

function visibleOrthogonalCandidatePaths(edge: Cell, cells: Map<string, Cell>): Point[][] {
  if (!edge.source || !edge.target) {
    return [];
  }

  const source = cells.get(edge.source);
  const target = cells.get(edge.target);
  const sourceRect = source ? absoluteRect(source, cells) : undefined;
  const targetRect = target ? absoluteRect(target, cells) : undefined;

  if (!sourceRect || !targetRect) {
    return [];
  }

  const sourceCenter = center(sourceRect);
  const targetCenter = center(targetRect);
  const sourceIconRect = source && isAwsServiceIcon(source) ? iconRect(source, cells) : undefined;
  const targetIconRect = target && isAwsServiceIcon(target) ? iconRect(target, cells) : undefined;
  const candidatePaths = [
    [sourceCenter, { x: targetCenter.x, y: sourceCenter.y }, targetCenter],
    [sourceCenter, { x: sourceCenter.x, y: targetCenter.y }, targetCenter],
  ];

  return candidatePaths.map((candidatePath) => trimVisiblePath(candidatePath, sourceIconRect, targetIconRect));
}

function trimVisiblePath(path: Point[], sourceIconRect: Rect | undefined, targetIconRect: Rect | undefined): Point[] {
  let visiblePath = path;
  if (sourceIconRect) {
    visiblePath = trimPathStartToRectBoundary(visiblePath, sourceIconRect);
  }

  if (targetIconRect) {
    visiblePath = trimPathEndToRectBoundary(visiblePath, targetIconRect);
  }

  return visiblePath;
}

function visibleDirectEdgePath(edge: Cell, cells: Map<string, Cell>): Point[] {
  if (!edge.source || !edge.target) {
    return [];
  }

  const source = cells.get(edge.source);
  const target = cells.get(edge.target);
  const sourceRect = source ? absoluteRect(source, cells) : undefined;
  const targetRect = target ? absoluteRect(target, cells) : undefined;

  if (!sourceRect || !targetRect) {
    return [];
  }

  const path = [center(sourceRect), center(targetRect)];
  const sourceIconRect = source && isAwsServiceIcon(source) ? iconRect(source, cells) : undefined;
  const targetIconRect = target && isAwsServiceIcon(target) ? iconRect(target, cells) : undefined;
  return trimVisiblePath(path, sourceIconRect, targetIconRect);
}

function visibleEdgePath(edge: Cell, cells: Map<string, Cell>): Point[] {
  let path = edgePath(edge, cells);
  if (path.length < 2) {
    return path;
  }

  const source = edge.source ? cells.get(edge.source) : undefined;
  const sourceRect = source && isAwsServiceIcon(source) ? iconRect(source, cells) : undefined;
  if (sourceRect) {
    path = trimPathStartToRectBoundary(path, sourceRect);
  }

  const target = edge.target ? cells.get(edge.target) : undefined;
  const targetRect = target && isAwsServiceIcon(target) ? iconRect(target, cells) : undefined;
  if (targetRect) {
    path = trimPathEndToRectBoundary(path, targetRect);
  }

  return path;
}

function trimPathStartToRectBoundary(path: Point[], rect: Rect): Point[] {
  const start = path[0];
  if (!pointInRect(start, rect)) {
    return path;
  }

  for (let i = 1; i < path.length; i += 1) {
    if (pointInRect(path[i], rect)) {
      continue;
    }

    const boundary = segmentRectBoundaryIntersection(start, path[i], rect);
    return boundary ? [boundary, ...path.slice(i)] : path;
  }

  return path;
}

function trimPathEndToRectBoundary(path: Point[], rect: Rect): Point[] {
  const end = path[path.length - 1];
  if (!pointInRect(end, rect)) {
    return path;
  }

  for (let i = path.length - 2; i >= 0; i -= 1) {
    if (pointInRect(path[i], rect)) {
      continue;
    }

    const boundary = segmentRectBoundaryIntersection(end, path[i], rect);
    return boundary ? [...path.slice(0, i + 1), boundary] : path;
  }

  return path;
}

function segmentRectBoundaryIntersection(inside: Point, outside: Point, rect: Rect): Point | undefined {
  const dx = outside.x - inside.x;
  const dy = outside.y - inside.y;
  const candidates: Point[] = [];

  for (const x of [rect.x, rect.x + rect.width]) {
    if (dx === 0) {
      continue;
    }
    const t = (x - inside.x) / dx;
    const y = inside.y + t * dy;
    if (t > 0 && t <= 1 && y >= rect.y && y <= rect.y + rect.height) {
      candidates.push({ x, y });
    }
  }

  for (const y of [rect.y, rect.y + rect.height]) {
    if (dy === 0) {
      continue;
    }
    const t = (y - inside.y) / dy;
    const x = inside.x + t * dx;
    if (t > 0 && t <= 1 && x >= rect.x && x <= rect.x + rect.width) {
      candidates.push({ x, y });
    }
  }

  return candidates.sort((a, b) => distanceSquared(inside, a) - distanceSquared(inside, b))[0];
}

function distanceSquared(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function pathToSegments(path: Point[]): Array<[Point, Point]> {
  const segments: Array<[Point, Point]> = [];

  for (let i = 0; i < path.length - 1; i += 1) {
    const start = path[i];
    const end = path[i + 1];
    if (start.x === end.x && start.y === end.y) {
      continue;
    }
    segments.push([start, end]);
  }

  return segments;
}

function orthogonalCollisionSegments(path: Point[], includeHorizontalFirst: boolean): Array<[Point, Point]> {
  const segments: Array<[Point, Point]> = [];

  for (let i = 0; i < path.length - 1; i += 1) {
    const start = path[i];
    const end = path[i + 1];
    if (start.x === end.x || start.y === end.y) {
      segments.push([start, end]);
      continue;
    }

    const verticalFirst = { x: start.x, y: end.y };
    segments.push([start, verticalFirst], [verticalFirst, end]);
    if (includeHorizontalFirst) {
      const horizontalFirst = { x: end.x, y: start.y };
      segments.push([start, horizontalFirst], [horizontalFirst, end]);
    }
  }

  return dedupeSegments(segments);
}

function dedupeSegments(segments: Array<[Point, Point]>): Array<[Point, Point]> {
  const seen = new Set<string>();
  const unique: Array<[Point, Point]> = [];

  for (const segment of segments) {
    const key = segmentKey(segment);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(segment);
  }

  return unique;
}

function segmentKey(segment: [Point, Point]): string {
  const [a, b] = segment;
  const start = `${Math.round(a.x)},${Math.round(a.y)}`;
  const end = `${Math.round(b.x)},${Math.round(b.y)}`;
  return start < end ? `${start}:${end}` : `${end}:${start}`;
}

function overlappingSegmentLength(a: [Point, Point], b: [Point, Point]): number {
  const [a1, a2] = a;
  const [b1, b2] = b;
  const aHorizontal = Math.abs(a1.y - a2.y) <= EDGE_OVERLAP_TOLERANCE;
  const bHorizontal = Math.abs(b1.y - b2.y) <= EDGE_OVERLAP_TOLERANCE;
  const aVertical = Math.abs(a1.x - a2.x) <= EDGE_OVERLAP_TOLERANCE;
  const bVertical = Math.abs(b1.x - b2.x) <= EDGE_OVERLAP_TOLERANCE;

  if (aHorizontal && bHorizontal && Math.abs(a1.y - b1.y) <= EDGE_OVERLAP_TOLERANCE) {
    return rangeOverlapLength(a1.x, a2.x, b1.x, b2.x);
  }

  if (aVertical && bVertical && Math.abs(a1.x - b1.x) <= EDGE_OVERLAP_TOLERANCE) {
    return rangeOverlapLength(a1.y, a2.y, b1.y, b2.y);
  }

  return 0;
}

function rangeOverlapLength(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
  const aMin = Math.min(aStart, aEnd);
  const aMax = Math.max(aStart, aEnd);
  const bMin = Math.min(bStart, bEnd);
  const bMax = Math.max(bStart, bEnd);
  return Math.max(0, Math.min(aMax, bMax) - Math.max(aMin, bMin));
}

function orientation(a: Point, b: Point, c: Point): number {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(value) < 0.00001) {
    return 0;
  }
  return value > 0 ? 1 : 2;
}

function edgePath(edge: Cell, cells: Map<string, Cell>): Point[] {
  if (!edge.source || !edge.target) {
    return [];
  }

  const source = cells.get(edge.source);
  const target = cells.get(edge.target);
  const sourceRect = source ? absoluteRect(source, cells) : undefined;
  const targetRect = target ? absoluteRect(target, cells) : undefined;

  if (!sourceRect || !targetRect) {
    return [];
  }

  const sourceCenter = center(sourceRect);
  const targetCenter = center(targetRect);

  if (edge.points.length > 0) {
    return [sourceCenter, ...edge.points, targetCenter];
  }

  if (edge.style.includes("edgeStyle=orthogonalEdgeStyle")) {
    const midX = sourceCenter.x + (targetCenter.x - sourceCenter.x) / 2;
    return [sourceCenter, { x: midX, y: sourceCenter.y }, { x: midX, y: targetCenter.y }, targetCenter];
  }

  return [sourceCenter, targetCenter];
}

function validate(cells: Map<string, Cell>): Finding[] {
  const findings: Finding[] = [];
  const serviceIcons = [...cells.values()]
    .filter(isAwsServiceIcon)
    .map((cell) => ({ cell, rect: serviceRect(cell, cells) }))
    .filter((item): item is { cell: Cell; rect: Rect } => Boolean(item.rect));
  const awsClouds = [...cells.values()]
    .filter(isAwsCloudGroup)
    .map((cell) => ({ cell, rect: absoluteRect(cell, cells) }))
    .filter((item): item is { cell: Cell; rect: Rect } => Boolean(item.rect));
  const awsGroups = [...cells.values()]
    .filter((cell) => isAwsLayoutGroup(cell, cells))
    .map((cell) => ({ cell, rect: absoluteRect(cell, cells) }))
    .filter((item): item is { cell: Cell; rect: Rect } => Boolean(item.rect));
  const layoutEdges = [...cells.values()].filter((cell) => cell.edge && !isLegendCell(cell, cells));
  const vpcGroups = awsGroups.filter((item) => isAwsVpcGroup(item.cell));
  const internetGateways = serviceIcons
    .filter((item) => isAwsInternetGatewayIcon(item.cell))
    .map((item) => {
      const rect = iconRect(item.cell, cells);
      return rect ? { cell: item.cell, rect } : undefined;
    })
    .filter((item): item is { cell: Cell; rect: Rect } => Boolean(item));

  for (const group of awsGroups) {
    const visualParent = awsGroups
      .filter((candidate) => candidate.cell.id !== group.cell.id)
      .filter((candidate) => !hasAncestorRelation(group.cell, candidate.cell, cells))
      .filter((candidate) => containsWithoutPadding(candidate.rect, group.rect))
      .sort((a, b) => area(a.rect) - area(b.rect))[0];

    if (visualParent) {
      findings.push({
        severity: "error",
        code: "GROUP_VISUALLY_NESTED_WITHOUT_PARENT",
        message: `${displayName(group.cell)} is visually inside ${displayName(visualParent.cell)} but is not its descendant in the draw.io XML.`,
      });
    }
  }

  for (let i = 0; i < awsGroups.length; i += 1) {
    for (let j = i + 1; j < awsGroups.length; j += 1) {
      const first = awsGroups[i];
      const second = awsGroups[j];
      if (hasAncestorRelation(first.cell, second.cell, cells) || containsWithoutPadding(first.rect, second.rect) || containsWithoutPadding(second.rect, first.rect)) {
        continue;
      }

      if (intersects(first.rect, second.rect)) {
        findings.push({
          severity: "error",
          code: "GROUP_OVERLAP",
          message: `${displayName(first.cell)} overlaps ${displayName(second.cell)}. Make one group the parent of the other, or separate sibling groups.`,
        });
        continue;
      }

      const gap = minDistanceBetweenRects(first.rect, second.rect);
      if (gap > 0 && gap < MIN_GROUP_GAP) {
        findings.push({
          severity: "error",
          code: "GROUP_TOO_CLOSE",
          message: `${displayName(first.cell)} is only ${Math.round(gap)}px from ${displayName(second.cell)}; keep at least ${MIN_GROUP_GAP}px between sibling groups.`,
        });
      }
    }
  }

  for (const group of awsGroups) {
    const contentRect = groupContentRect(group.rect);
    for (const child of [...cells.values()].filter((cell) => cell.vertex && cell.parent === group.cell.id)) {
      const childRect = isAwsServiceIcon(child) ? serviceRect(child, cells) : absoluteRect(child, cells);
      if (!childRect) {
        continue;
      }

      if (isAwsVpcGroup(group.cell) && isAwsInternetGatewayIcon(child)) {
        continue;
      }

      if (!containsWithoutPadding(contentRect, childRect)) {
        findings.push({
          severity: "error",
          code: "CHILD_OUTSIDE_GROUP_CONTENT",
          message: `${displayName(child)} is a child of ${displayName(group.cell)} but is outside its content area or overlaps the group title/padding.`,
        });
      }
    }
  }

  if (vpcGroups.length > 0) {
    for (const gateway of internetGateways) {
      const expectedVpc = expectedVpcForInternetGateway(gateway, vpcGroups, cells);
      if (!expectedVpc) {
        continue;
      }

      if (!isInternetGatewayOnVpcTopCenter(gateway.rect, expectedVpc.rect)) {
        const gatewayCenter = center(gateway.rect);
        findings.push({
          severity: "error",
          code: "INTERNET_GATEWAY_NOT_ON_VPC_TOP_CENTER",
          message: `${displayName(gateway.cell)} should be centered on the top border of ${displayName(expectedVpc.cell)}. Expected center near (${Math.round(
            expectedVpc.rect.x + expectedVpc.rect.width / 2,
          )}, ${Math.round(expectedVpc.rect.y)}), but found (${Math.round(gatewayCenter.x)}, ${Math.round(gatewayCenter.y)}).`,
        });
      }
    }
  }

  for (const service of serviceIcons) {
    const visualParent = awsGroups
      .filter((group) => !isDescendantOf(service.cell, group.cell, cells))
      .filter((group) => containsWithoutPadding(groupContentRect(group.rect), service.rect))
      .sort((a, b) => area(a.rect) - area(b.rect))[0];

    if (visualParent) {
      findings.push({
        severity: "error",
        code: "SERVICE_VISUALLY_IN_GROUP_WITHOUT_PARENT",
        message: `${displayName(service.cell)} is visually inside ${displayName(visualParent.cell)} but is not its descendant in the draw.io XML.`,
      });
    }
  }

  for (const group of awsGroups.filter((item) => isAwsRegionGroup(item.cell) || isAwsVpcGroup(item.cell) || isAwsAvailabilityZoneGroup(item.cell) || isAwsSubnetGroup(item.cell))) {
    const requiredParent = isAwsSubnetGroup(group.cell)
      ? awsGroups.find((candidate) => candidate.cell.id !== group.cell.id && isAwsAvailabilityZoneGroup(candidate.cell) && isDescendantOf(group.cell, candidate.cell, cells))
      : isAwsAvailabilityZoneGroup(group.cell)
        ? awsGroups.find((candidate) => candidate.cell.id !== group.cell.id && isAwsVpcGroup(candidate.cell) && isDescendantOf(group.cell, candidate.cell, cells))
        : isAwsVpcGroup(group.cell)
          ? awsGroups.find((candidate) => candidate.cell.id !== group.cell.id && isAwsRegionGroup(candidate.cell) && isDescendantOf(group.cell, candidate.cell, cells))
          : awsGroups.find((candidate) => candidate.cell.id !== group.cell.id && isAwsCloudGroup(candidate.cell) && isDescendantOf(group.cell, candidate.cell, cells));

    if (!requiredParent) {
      const expected = isAwsSubnetGroup(group.cell)
        ? "Availability Zone"
        : isAwsAvailabilityZoneGroup(group.cell)
          ? "VPC"
          : isAwsVpcGroup(group.cell)
            ? "Region"
            : "AWS Cloud";
      findings.push({
        severity: "error",
        code: "AWS_GROUP_PARENT_MISSING",
        message: `${displayName(group.cell)} should be a descendant of an ${expected} group.`,
      });
    }
  }

  for (let i = 0; i < serviceIcons.length; i += 1) {
    for (let j = i + 1; j < serviceIcons.length; j += 1) {
      if (intersects(serviceIcons[i].rect, serviceIcons[j].rect)) {
        findings.push({
          severity: "error",
          code: "SERVICE_ICON_OVERLAP",
          message: `${displayName(serviceIcons[i].cell)} overlaps ${displayName(serviceIcons[j].cell)}.`,
        });
      }
    }
  }

  for (const service of serviceIcons) {
    if (awsClouds.length === 0) {
      findings.push({
        severity: "warning",
        code: "AWS_CLOUD_MISSING",
        message: `${displayName(service.cell)} cannot be checked for AWS Cloud containment because no AWS Cloud group was found.`,
      });
      continue;
    }

    const contained = awsClouds.some((cloud) => containsWithPadding(cloud.rect, service.rect, MIN_ICON_GROUP_PADDING));
    if (!contained) {
      findings.push({
        severity: "error",
        code: "SERVICE_ICON_OUTSIDE_AWS_CLOUD",
        message: `${displayName(service.cell)} is outside AWS Cloud or too close to the AWS Cloud boundary.`,
      });
    }
  }

  for (const service of serviceIcons) {
    for (const group of awsGroups) {
      if (service.cell.id === group.cell.id || !intersects(service.rect, group.rect)) {
        continue;
      }

      if (
        isAwsInternetGatewayIcon(service.cell) &&
        isAwsVpcGroup(group.cell) &&
        isInternetGatewayOnVpcTopCenter(iconRect(service.cell, cells) ?? service.rect, group.rect)
      ) {
        continue;
      }

      if (intersectsGroupBorder(service.rect, group.rect)) {
        findings.push({
          severity: "error",
          code: "SERVICE_ICON_OVERLAPS_GROUP_BORDER",
          message: `${displayName(service.cell)} overlaps the border of ${displayName(group.cell)}.`,
        });
      }
    }
  }

  for (const edge of layoutEdges) {
    if (edge.points.length > MAX_EDGE_WAYPOINTS) {
      findings.push({
        severity: "error",
        code: "EXCESSIVE_EDGE_WAYPOINTS",
        message: `${edge.id} has ${edge.points.length} manual waypoints; use placement or at most ${MAX_EDGE_WAYPOINTS} waypoint to avoid jagged lines.`,
      });
    }

    const segments = edgeCollisionSegments(edge, cells);
    if (segments.length === 0) {
      continue;
    }

    for (const service of serviceIcons) {
      const iconCollisionRect = iconRect(service.cell, cells);
      if (!iconCollisionRect) {
        continue;
      }
      const collisionRect = insetRect(iconCollisionRect, EDGE_ICON_TOUCH_TOLERANCE);

      for (const segment of segments) {
        if (segmentIntersectsRect(segment[0], segment[1], collisionRect)) {
          findings.push({
            severity: "error",
            code: "EDGE_CROSSES_SERVICE_ICON",
            message: `${edge.id} crosses ${displayName(service.cell)}.`,
          });
          break;
        }
      }
    }
  }

  const edges = layoutEdges;
  for (let i = 0; i < edges.length; i += 1) {
    if (isPlainLine(edges[i])) {
      continue;
    }

    const firstSegments = edgeSegments(edges[i], cells);
    for (let j = i + 1; j < edges.length; j += 1) {
      if (isPlainLine(edges[j])) {
        continue;
      }

      const secondSegments = edgeSegments(edges[j], cells);
      let pairHasOverlap = false;

      for (const firstSegment of firstSegments) {
        for (const secondSegment of secondSegments) {
          const overlapLength = overlappingSegmentLength(firstSegment, secondSegment);
          if (overlapLength >= MIN_EDGE_OVERLAP_LENGTH) {
            findings.push({
              severity: "error",
              code: "EDGE_OVERLAP",
              message: `${edges[i].id} overlaps ${edges[j].id} for ${Math.round(overlapLength)}px.`,
            });
            pairHasOverlap = true;
            break;
          }
        }

        if (pairHasOverlap) {
          break;
        }
      }
    }
  }

  return findings;
}

function runCli(args: string[]): void {
  const [filePath] = args;

  if (!filePath) {
    console.error("Missing diagram XML path.");
    process.exitCode = 1;
    return;
  }

  const xml = readFileSync(filePath, "utf8");
  const cells = parseCells(xml);
  const findings = validate(cells);
  const errors = findings.filter((finding) => finding.severity === "error");

  if (findings.length === 0) {
    console.log("OK: no AWS diagram layout issues found.");
    return;
  }

  for (const finding of findings) {
    console.log(`${finding.severity.toUpperCase()} ${finding.code}: ${finding.message}`);
  }

  process.exitCode = errors.length > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    runCli(process.argv.slice(2));
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
