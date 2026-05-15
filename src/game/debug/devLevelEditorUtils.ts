import type { DevLevelOverrideObject, DevLevelOverridesFile } from "./devLevelOverrides";
import type { DebugObjectData } from "./debugTypes";
import type { MovingPlatformSpec, PlatformerLevelGeometry, RectSpec } from "../platformer/levelGeometry";

export const DEV_EDITOR_GRID_SIZE = 32;
export const DEFAULT_DEV_PLATFORM_WIDTH = 160;
export const DEFAULT_DEV_PLATFORM_HEIGHT = 32;
export const DEFAULT_DEV_MOVING_PLATFORM_WIDTH = 192;
export const DEFAULT_DEV_MOVING_PLATFORM_HEIGHT = 32;
export const DEFAULT_DEV_MOVING_PLATFORM_SPEED = 32;
export const DEFAULT_DEV_ELEVATOR_SPEED = 28;
export const DEFAULT_DEV_MOVING_PLATFORM_DISTANCE = 240;
export const DEFAULT_DEV_ELEVATOR_DISTANCE = 224;

export interface DevRectLike {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InspectorRectValues {
  x: string;
  y: string;
  width?: string;
  height?: string;
}

export interface MovingPlatformInspectorValues {
  axis: string;
  speed: string;
  fromX: string;
  toX: string;
  fromY: string;
  toY: string;
}

export interface ParsedInspectorRect {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface ParsedMovingPlatformFields {
  axis: "horizontal" | "vertical";
  speed: number;
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
  warning?: string;
}

export interface DevSupportValidationResult {
  status: "ok" | "warning" | "error";
  supported: boolean;
  messages: string[];
  supportId?: string;
  searchRect?: DevRectLike;
}

export type DevValidationSeverity = "error" | "warning" | "info";

export type DevValidationCategory =
  | "ids"
  | "support"
  | "checkpoint"
  | "exit"
  | "moving-platform"
  | "bounds"
  | "dimensions"
  | "required-object";

export interface DevValidationIssue {
  id: string;
  severity: DevValidationSeverity;
  category: DevValidationCategory;
  objectId?: string;
  objectType?: string;
  message: string;
  suggestedFix?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface DevValidationSummary {
  errors: number;
  warnings: number;
  infos: number;
  issues: DevValidationIssue[];
}

export interface DevLevelValidationOptions {
  activeChapterId?: number | null;
  baseGeometry?: PlatformerLevelGeometry;
  overrides?: DevLevelOverridesFile | null;
}

export interface DevOverrideSummary {
  modifiedCount: number;
  addedCount: number;
  deletedCount: number;
  modifiedObjects: DevLevelOverrideObject[];
  addedObjects: DevLevelOverrideObject[];
  deletedObjectIds: string[];
}

export interface DevOverrideExportMeta {
  projectTitle: string;
  exportedAt: string;
}

export type DevOverrideImportResult =
  | { ok: true; overrides: DevLevelOverridesFile; levelMismatch: boolean; summary: DevOverrideSummary }
  | { ok: false; error: string };

export type InspectorParseResult =
  | { ok: true; rect: ParsedInspectorRect }
  | { ok: false; error: string };

export type MovingPlatformParseResult =
  | { ok: true; fields: ParsedMovingPlatformFields }
  | { ok: false; error: string };

export const MIN_MOVING_PLATFORM_PATH_LENGTH = 8;
export const SUPPORT_VERTICAL_SEARCH = 80;
export const SUPPORT_ADJACENT_GAP = 96;
export const MOBILE_MIN_MOVING_PLATFORM_WIDTH = 96;
export const MOBILE_COMFORT_SPEED = 72;
export const TALL_VERTICAL_LIFT_HEIGHT = 360;

export function snapValue(value: number, gridSize = DEV_EDITOR_GRID_SIZE): number {
  if (!Number.isFinite(value) || gridSize <= 0) {
    return value;
  }

  const snapped = Math.round(value / gridSize) * gridSize;
  return Object.is(snapped, -0) ? 0 : snapped;
}

export function snapRect<T extends DevRectLike>(rect: T, gridSize = DEV_EDITOR_GRID_SIZE): T {
  return {
    ...rect,
    x: snapValue(rect.x, gridSize),
    y: snapValue(rect.y, gridSize),
    width: Math.max(gridSize, snapValue(rect.width, gridSize)),
    height: Math.max(gridSize / 2, snapValue(rect.height, gridSize))
  };
}

export function parseInspectorNumber(
  rawValue: string,
  fieldLabel: string,
  options: { positive?: boolean } = {}
): { ok: true; value: number } | { ok: false; error: string } {
  const trimmed = rawValue.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: `${fieldLabel} is required.` };
  }

  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { ok: false, error: `${fieldLabel} must be a finite number.` };
  }
  if (options.positive && value <= 0) {
    return { ok: false, error: `${fieldLabel} must be greater than 0.` };
  }

  return { ok: true, value };
}

export function parseInspectorRectValues(
  values: InspectorRectValues,
  options: { includeSize?: boolean; snap?: boolean; gridSize?: number } = {}
): InspectorParseResult {
  const x = parseInspectorNumber(values.x, "x");
  if (!x.ok) {
    return x;
  }

  const y = parseInspectorNumber(values.y, "y");
  if (!y.ok) {
    return y;
  }

  const rect: ParsedInspectorRect = {
    x: x.value,
    y: y.value
  };

  if (options.includeSize) {
    const width = parseInspectorNumber(values.width ?? "", "width", { positive: true });
    if (!width.ok) {
      return width;
    }
    const height = parseInspectorNumber(values.height ?? "", "height", { positive: true });
    if (!height.ok) {
      return height;
    }
    rect.width = width.value;
    rect.height = height.value;
  }

  if (!options.snap) {
    return { ok: true, rect };
  }

  const gridSize = options.gridSize ?? DEV_EDITOR_GRID_SIZE;
  return {
    ok: true,
    rect: {
      ...rect,
      x: snapValue(rect.x, gridSize),
      y: snapValue(rect.y, gridSize),
      ...(rect.width !== undefined && rect.height !== undefined
        ? {
            width: Math.max(gridSize, snapValue(rect.width, gridSize)),
            height: Math.max(gridSize / 2, snapValue(rect.height, gridSize))
          }
        : {})
    }
  };
}

export function parseMovingPlatformInspectorValues(
  values: MovingPlatformInspectorValues,
  rect: Required<ParsedInspectorRect>,
  options: {
    snap?: boolean;
    gridSize?: number;
    minPathLength?: number;
    worldWidth?: number;
    worldHeight?: number;
  } = {}
): MovingPlatformParseResult {
  const axis = values.axis === "horizontal" || values.axis === "vertical" ? values.axis : null;
  if (!axis) {
    return { ok: false, error: "axis must be horizontal or vertical." };
  }

  const speed = parseInspectorNumber(values.speed, "speed", { positive: true });
  if (!speed.ok) {
    return speed;
  }

  const fromX = parseInspectorNumber(values.fromX, "fromX");
  if (!fromX.ok) {
    return fromX;
  }
  const toX = parseInspectorNumber(values.toX, "toX");
  if (!toX.ok) {
    return toX;
  }
  const fromY = parseInspectorNumber(values.fromY, "fromY");
  if (!fromY.ok) {
    return fromY;
  }
  const toY = parseInspectorNumber(values.toY, "toY");
  if (!toY.ok) {
    return toY;
  }

  const gridSize = options.gridSize ?? DEV_EDITOR_GRID_SIZE;
  const applySnap = (value: number) => (options.snap ? snapValue(value, gridSize) : value);
  const fields: ParsedMovingPlatformFields = {
    axis,
    speed: speed.value,
    fromX: applySnap(axis === "vertical" ? rect.x : fromX.value),
    toX: applySnap(axis === "vertical" ? rect.x : toX.value),
    fromY: applySnap(axis === "horizontal" ? rect.y : fromY.value),
    toY: applySnap(axis === "horizontal" ? rect.y : toY.value)
  };

  const pathLength = getMovingPlatformPathLength(fields);
  if (pathLength <= (options.minPathLength ?? MIN_MOVING_PLATFORM_PATH_LENGTH)) {
    return { ok: false, error: "moving platform path must be longer than 8px." };
  }

  const warning = getMovingPlatformBoundsWarning(fields, rect, options.worldWidth, options.worldHeight);
  return {
    ok: true,
    fields: {
      ...fields,
      ...(warning ? { warning } : {})
    }
  };
}

export function getMovingPlatformPathLength(fields: Pick<ParsedMovingPlatformFields, "axis" | "fromX" | "toX" | "fromY" | "toY">): number {
  return fields.axis === "vertical" ? Math.abs(fields.toY - fields.fromY) : Math.abs(fields.toX - fields.fromX);
}

export function validateDebugObjectSupport(
  object: Pick<DebugObjectData, "id" | "x" | "y" | "width" | "height">,
  geometry: PlatformerLevelGeometry,
  options: { allowAdjacent?: boolean; label?: string } = {}
): DevSupportValidationResult {
  const messages: string[] = [];
  const outsideWorld = object.x < 0 || object.y < 0 || object.x + object.width > geometry.worldWidth || object.y + object.height > geometry.worldHeight;
  if (outsideWorld) {
    messages.push(`${options.label ?? object.id} is outside world bounds.`);
  }
  if (object.width <= 0 || object.height <= 0) {
    messages.push(`${options.label ?? object.id} must have positive width and height.`);
  }

  const support = findSupportPlatform(object, geometry, { allowAdjacent: options.allowAdjacent ?? true });
  if (!support) {
    messages.push(`${options.label ?? object.id} needs a support platform beneath or adjacent.`);
  }

  if (outsideWorld || object.width <= 0 || object.height <= 0) {
    return {
      status: "error",
      supported: support !== null,
      messages,
      ...(support ? { supportId: support.id } : {}),
      searchRect: createSupportSearchRect(object)
    };
  }

  if (!support) {
    return {
      status: "warning",
      supported: false,
      messages,
      searchRect: createSupportSearchRect(object)
    };
  }

  return {
    status: "ok",
    supported: true,
    messages: [`${options.label ?? object.id} is supported by ${support.id}.`],
    supportId: support.id,
    searchRect: createSupportSearchRect(object)
  };
}

export function validateCheckpointRespawnSupport(
  checkpoint: Pick<DebugObjectData, "id" | "respawnX" | "respawnY">,
  geometry: PlatformerLevelGeometry
): DevSupportValidationResult {
  if (checkpoint.respawnX === undefined || checkpoint.respawnY === undefined) {
    return {
      status: "error",
      supported: false,
      messages: [`${checkpoint.id} is missing respawn coordinates.`]
    };
  }

  return validateDebugObjectSupport(
    {
      id: `${checkpoint.id}:respawn`,
      x: checkpoint.respawnX - 22,
      y: checkpoint.respawnY - 29,
      width: 44,
      height: 58
    },
    geometry,
    { allowAdjacent: false, label: `${checkpoint.id} respawn` }
  );
}

export function validatePlatformerGeometry(
  geometry: PlatformerLevelGeometry,
  options: DevLevelValidationOptions = {}
): DevValidationSummary {
  const issues: DevValidationIssue[] = [];
  const addIssue = (issue: Omit<DevValidationIssue, "id">) => {
    issues.push({
      id: `${issue.category}:${issue.objectId ?? "level"}:${issues.length + 1}`,
      ...issue
    });
  };

  const objects = collectValidationObjects(geometry);
  const ids = new Map<string, ValidationObject[]>();
  for (const object of objects) {
    if (!object.id || object.id.trim().length === 0) {
      addIssue({
        severity: "error",
        category: "ids",
        objectType: object.type,
        message: `${object.type} is missing an id.`,
        suggestedFix: "Assign a stable unique id before saving or baking geometry.",
        ...rectFields(object)
      });
      continue;
    }
    const matches = ids.get(object.id) ?? [];
    matches.push(object);
    ids.set(object.id, matches);
  }
  for (const [id, matches] of ids) {
    if (matches.length > 1) {
      for (const match of matches) {
        addIssue({
          severity: "error",
          category: "ids",
          objectId: id,
          objectType: match.type,
          message: `Duplicate object id: ${id}.`,
          suggestedFix: "Rename one object so every editable geometry item has a unique id.",
          ...rectFields(match)
        });
      }
    }
  }

  for (const object of objects) {
    validateObjectRect(object, geometry, addIssue);
  }

  validateSupportTargets(geometry, addIssue);
  validateMovingPlatforms(geometry, addIssue);
  validateRequiredObjects(geometry, options, addIssue);
  validateOverrideContext(geometry, options, addIssue);

  const errors = issues.filter((issue) => issue.severity === "error").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  const infos = issues.filter((issue) => issue.severity === "info").length;
  return { errors, warnings, infos, issues };
}

function findSupportPlatform(
  object: Pick<DebugObjectData, "x" | "y" | "width" | "height">,
  geometry: PlatformerLevelGeometry,
  options: { allowAdjacent: boolean }
): RectSpec | null {
  const objectBottom = object.y + object.height;
  const objectCenterX = object.x + object.width / 2;
  const platforms = collectSupportPlatforms(geometry);
  for (const platform of platforms) {
    const platformTop = platform.y;
    const verticalDistance = platformTop - objectBottom;
    if (verticalDistance < -24 || verticalDistance > SUPPORT_VERTICAL_SEARCH) {
      continue;
    }
    const overlap = horizontalOverlap(object, platform);
    const overlapRatio = overlap / Math.max(1, Math.min(object.width, platform.width));
    const centerSupported = objectCenterX >= platform.x && objectCenterX <= platform.x + platform.width;
    if (centerSupported || overlapRatio >= 0.3) {
      return platform;
    }
    if (options.allowAdjacent && horizontalGap(object, platform) <= SUPPORT_ADJACENT_GAP) {
      return platform;
    }
  }
  return null;
}

function collectSupportPlatforms(geometry: PlatformerLevelGeometry): RectSpec[] {
  return [
    ...geometry.platforms,
    ...geometry.movingPlatforms,
    ...geometry.rebuildGroups.flatMap((group) => group.platforms),
    ...geometry.lightRevealGroups.flatMap((group) => group.platforms)
  ];
}

function createSupportSearchRect(object: Pick<DebugObjectData, "x" | "y" | "width" | "height">): DevRectLike {
  return {
    x: object.x - SUPPORT_ADJACENT_GAP,
    y: object.y + object.height - 24,
    width: object.width + SUPPORT_ADJACENT_GAP * 2,
    height: SUPPORT_VERTICAL_SEARCH + 24
  };
}

function horizontalOverlap(a: Pick<DebugObjectData, "x" | "width">, b: Pick<RectSpec, "x" | "width">): number {
  return Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
}

function horizontalGap(a: Pick<DebugObjectData, "x" | "width">, b: Pick<RectSpec, "x" | "width">): number {
  if (a.x + a.width < b.x) {
    return b.x - (a.x + a.width);
  }
  if (b.x + b.width < a.x) {
    return a.x - (b.x + b.width);
  }
  return 0;
}

function getMovingPlatformBoundsWarning(
  fields: ParsedMovingPlatformFields,
  rect: Required<ParsedInspectorRect>,
  worldWidth?: number,
  worldHeight?: number
): string | undefined {
  if (worldWidth === undefined || worldHeight === undefined) {
    return undefined;
  }

  const minX = Math.min(fields.fromX, fields.toX);
  const maxX = Math.max(fields.fromX, fields.toX) + rect.width;
  const minY = Math.min(fields.fromY, fields.toY);
  const maxY = Math.max(fields.fromY, fields.toY) + rect.height;
  if (minX < 0 || minY < 0 || maxX > worldWidth || maxY > worldHeight) {
    return "warning: moving platform path extends outside world bounds.";
  }
  return undefined;
}

interface ValidationObject extends RectSpec {
  type: string;
}

function collectValidationObjects(geometry: PlatformerLevelGeometry): ValidationObject[] {
  return [
    ...geometry.platforms.map((object) => validationObject("platform", object)),
    ...geometry.movingPlatforms.map((object) => validationObject("moving-platform", object)),
    ...geometry.rebuildGroups.flatMap((group) => [validationObject("rebuild-trigger", group.trigger), ...group.platforms.map((platform) => validationObject("rebuildable-platform", platform))]),
    ...geometry.lightRevealGroups.flatMap((group) => group.platforms.map((platform) => validationObject("light-platform", platform))),
    ...geometry.checkpoints.map((object) => validationObject("checkpoint", object)),
    ...geometry.exhibits.map((object) => validationObject("exhibit", object)),
    validationObject("exit", geometry.exit),
    ...geometry.archiveKeys.map((object) => validationObject("archive-key", object)),
    ...geometry.archiveDoors.map((object) => validationObject("archive-door", object)),
    ...geometry.choiceDoors.map((object) => validationObject("choice-door", object)),
    ...geometry.lanternSwitches.map((object) => validationObject("lantern-switch", object)),
    ...geometry.witnessFragments.map((object) => validationObject("witness-fragment", object)),
    ...geometry.tinyDetailNotes.map((object) => validationObject("tiny-detail-note", object)),
    ...geometry.echoFragments.map((object) => validationObject("echo-fragment", object)),
    ...geometry.quietEvidenceFragments.map((object) => validationObject("quiet-evidence-fragment", object)),
    ...geometry.argumentFragments.map((object) => validationObject("argument-fragment", object)),
    ...geometry.decorations.map((object) => validationObject("decoration", object))
  ];
}

function validationObject(type: string, object: RectSpec): ValidationObject {
  return { ...object, type };
}

function rectFields(object: Pick<ValidationObject, "x" | "y" | "width" | "height">): Pick<DevValidationIssue, "x" | "y" | "width" | "height"> {
  return { x: object.x, y: object.y, width: object.width, height: object.height };
}

function pointFields(x: number, y: number): Pick<DevValidationIssue, "x" | "y" | "width" | "height"> {
  return { x: x - 12, y: y - 12, width: 24, height: 24 };
}

function validateObjectRect(
  object: ValidationObject,
  geometry: PlatformerLevelGeometry,
  addIssue: (issue: Omit<DevValidationIssue, "id">) => void
): void {
  const values = [object.x, object.y, object.width, object.height];
  if (values.some((value) => !Number.isFinite(value))) {
    addIssue({
      severity: "error",
      category: "dimensions",
      objectId: object.id,
      objectType: object.type,
      message: `${object.id || object.type} has non-finite coordinates or dimensions.`,
      suggestedFix: "Replace NaN/Infinity values with finite numbers.",
      ...rectFields(object)
    });
    return;
  }

  if (object.width <= 0 || object.height <= 0) {
    addIssue({
      severity: "error",
      category: "dimensions",
      objectId: object.id,
      objectType: object.type,
      message: `${object.id || object.type} has non-positive width or height.`,
      suggestedFix: "Set width and height to positive values.",
      ...rectFields(object)
    });
  }

  if (object.x < 0 || object.y < 0 || object.x + object.width > geometry.worldWidth || object.y + object.height > geometry.worldHeight) {
    addIssue({
      severity: "error",
      category: "bounds",
      objectId: object.id,
      objectType: object.type,
      message: `${object.id || object.type} is outside world bounds.`,
      suggestedFix: "Move or resize the object so it fits within the level world.",
      ...rectFields(object)
    });
  }
}

function validateSupportTargets(
  geometry: PlatformerLevelGeometry,
  addIssue: (issue: Omit<DevValidationIssue, "id">) => void
): void {
  const supportTargets: Array<{ type: string; object: RectSpec; label: string; allowAdjacent?: boolean; required?: boolean }> = [
    ...geometry.exhibits.map((object) => ({
      type: "exhibit",
      object,
      label: object.name,
      required: object.required
    })),
    ...geometry.archiveKeys.map((object) => ({ type: "archive-key", object, label: object.label, required: true })),
    ...geometry.archiveDoors.map((object) => ({ type: "archive-door", object, label: object.id, required: true })),
    ...geometry.choiceDoors.map((object) => ({ type: "choice-door", object, label: object.label, required: true })),
    ...geometry.lanternSwitches.map((object) => ({ type: "lantern-switch", object, label: object.label, required: true })),
    ...geometry.witnessFragments.map((object) => ({ type: "witness-fragment", object, label: object.id })),
    ...geometry.tinyDetailNotes.map((object) => ({ type: "tiny-detail-note", object, label: object.id })),
    ...geometry.echoFragments.map((object) => ({ type: "echo-fragment", object, label: object.id })),
    ...geometry.quietEvidenceFragments.map((object) => ({ type: "quiet-evidence-fragment", object, label: object.id })),
    ...geometry.argumentFragments.map((object) => ({ type: "argument-fragment", object, label: object.id })),
    ...geometry.rebuildGroups.map((group) => ({ type: "rebuild-trigger", object: group.trigger, label: group.trigger.id, required: true })),
    { type: "exit", object: geometry.exit, label: geometry.exit.id, required: true }
  ];

  for (const target of supportTargets) {
    const result = validateDebugObjectSupport(target.object, geometry, { allowAdjacent: true, label: target.label });
    if (result.status === "ok") {
      continue;
    }
    addIssue({
      severity: result.status === "error" ? "error" : target.required ? "warning" : "info",
      category: target.type === "exit" || target.type === "archive-door" ? "exit" : "support",
      objectId: target.object.id,
      objectType: target.type,
      message: result.messages.join(" "),
      suggestedFix: "Move the object near a safe standing platform or add support beneath/adjacent to it.",
      ...rectFields(target.object)
    });
  }

  for (const checkpoint of geometry.checkpoints) {
    const trigger = validateDebugObjectSupport(checkpoint, geometry, { allowAdjacent: true, label: `${checkpoint.id} checkpoint` });
    if (trigger.status !== "ok") {
      addIssue({
        severity: trigger.status === "error" ? "error" : "warning",
        category: "checkpoint",
        objectId: checkpoint.id,
        objectType: "checkpoint",
        message: trigger.messages.join(" "),
        suggestedFix: "Place the checkpoint trigger near stable support.",
        ...rectFields(checkpoint)
      });
    }

    const respawn = validateCheckpointRespawnSupport(checkpoint, geometry);
    if (respawn.status !== "ok") {
      addIssue({
        severity: respawn.status === "error" ? "error" : "warning",
        category: "checkpoint",
        objectId: checkpoint.id,
        objectType: "checkpoint-respawn",
        message: respawn.messages.join(" "),
        suggestedFix: "Move the respawn marker above a stable platform.",
        ...pointFields(checkpoint.respawnX, checkpoint.respawnY)
      });
    }
    if (!Number.isFinite(checkpoint.respawnX) || !Number.isFinite(checkpoint.respawnY)) {
      addIssue({
        severity: "error",
        category: "checkpoint",
        objectId: checkpoint.id,
        objectType: "checkpoint-respawn",
        message: `${checkpoint.id} has non-finite respawn coordinates.`,
        suggestedFix: "Set respawnX and respawnY to finite numbers.",
        ...rectFields(checkpoint)
      });
    } else if (checkpoint.respawnX < 0 || checkpoint.respawnY < 0 || checkpoint.respawnX > geometry.worldWidth || checkpoint.respawnY > geometry.worldHeight) {
      addIssue({
        severity: "error",
        category: "bounds",
        objectId: checkpoint.id,
        objectType: "checkpoint-respawn",
        message: `${checkpoint.id} respawn is outside world bounds.`,
        suggestedFix: "Move the respawn point inside the level world.",
        ...pointFields(checkpoint.respawnX, checkpoint.respawnY)
      });
    }
  }

  const spawnSupport = validateDebugObjectSupport(
    { id: "playerSpawn", x: geometry.playerSpawn.x - 20, y: geometry.playerSpawn.y - 56, width: 40, height: 56 },
    geometry,
    { allowAdjacent: false, label: "Player spawn" }
  );
  if (spawnSupport.status !== "ok") {
    addIssue({
      severity: spawnSupport.status === "error" ? "error" : "warning",
      category: "support",
      objectId: "playerSpawn",
      objectType: "player-spawn",
      message: spawnSupport.messages.join(" "),
      suggestedFix: "Move the spawn above a stable starting platform.",
      ...pointFields(geometry.playerSpawn.x, geometry.playerSpawn.y)
    });
  }
}

function validateMovingPlatforms(
  geometry: PlatformerLevelGeometry,
  addIssue: (issue: Omit<DevValidationIssue, "id">) => void
): void {
  for (const platform of geometry.movingPlatforms) {
    const axis = platform.axis ?? "horizontal";
    if (axis !== "horizontal" && axis !== "vertical") {
      addIssue({
        severity: "error",
        category: "moving-platform",
        objectId: platform.id,
        objectType: "moving-platform",
        message: `${platform.id} has invalid axis "${String(platform.axis)}".`,
        suggestedFix: "Use horizontal or vertical.",
        ...rectFields(platform)
      });
      continue;
    }

    if (!Number.isFinite(platform.speed) || platform.speed <= 0) {
      addIssue({
        severity: "error",
        category: "moving-platform",
        objectId: platform.id,
        objectType: "moving-platform",
        message: `${platform.id} has invalid speed.`,
        suggestedFix: "Set speed to a positive finite number.",
        ...rectFields(platform)
      });
    } else if (platform.speed > MOBILE_COMFORT_SPEED) {
      addIssue({
        severity: "warning",
        category: "moving-platform",
        objectId: platform.id,
        objectType: "moving-platform",
        message: `${platform.id} speed ${Math.round(platform.speed)} may be too fast for mobile comfort.`,
        suggestedFix: `Keep moving platform speed at or below about ${MOBILE_COMFORT_SPEED}.`,
        ...rectFields(platform)
      });
    }

    const path = movingPlatformPath(platform);
    if (!path) {
      addIssue({
        severity: "error",
        category: "moving-platform",
        objectId: platform.id,
        objectType: "moving-platform",
        message: `${platform.id} has non-finite path endpoints.`,
        suggestedFix: "Set finite from/to endpoint values.",
        ...rectFields(platform)
      });
      continue;
    }

    const pathLength = getMovingPlatformPathLength(path);
    if (pathLength <= MIN_MOVING_PLATFORM_PATH_LENGTH) {
      addIssue({
        severity: "error",
        category: "moving-platform",
        objectId: platform.id,
        objectType: "moving-platform",
        message: `${platform.id} moving path is too short or zero-length.`,
        suggestedFix: "Separate the start and end endpoints by more than 8px.",
        ...rectFields(platform)
      });
    }
    if (platform.width < MOBILE_MIN_MOVING_PLATFORM_WIDTH) {
      addIssue({
        severity: "warning",
        category: "moving-platform",
        objectId: platform.id,
        objectType: "moving-platform",
        message: `${platform.id} is narrow for mobile platforming.`,
        suggestedFix: `Use at least ${MOBILE_MIN_MOVING_PLATFORM_WIDTH}px width for forgiving moving platforms.`,
        ...rectFields(platform)
      });
    }

    const minX = Math.min(path.fromX, path.toX);
    const maxX = Math.max(path.fromX, path.toX) + platform.width;
    const minY = Math.min(path.fromY, path.toY);
    const maxY = Math.max(path.fromY, path.toY) + platform.height;
    if (minX < 0 || minY < 0 || maxX > geometry.worldWidth || maxY > geometry.worldHeight) {
      addIssue({
        severity: "error",
        category: "bounds",
        objectId: platform.id,
        objectType: "moving-platform",
        message: `${platform.id} path extends outside world bounds.`,
        suggestedFix: "Move endpoints so the full platform stays inside the level world.",
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      });
    }

    if (axis === "vertical" && pathLength > TALL_VERTICAL_LIFT_HEIGHT && !checkpointNearMovingPlatform(platform, geometry)) {
      addIssue({
        severity: "warning",
        category: "moving-platform",
        objectId: platform.id,
        objectType: "moving-platform",
        message: `${platform.id} is a tall vertical lift without an obvious nearby checkpoint.`,
        suggestedFix: "Place a checkpoint near the elevator approach or exit if failures replay too much.",
        ...rectFields(platform)
      });
    }
  }
}

function movingPlatformPath(platform: MovingPlatformSpec): Pick<ParsedMovingPlatformFields, "axis" | "fromX" | "toX" | "fromY" | "toY"> | null {
  const axis = platform.axis ?? "horizontal";
  const path = {
    axis,
    fromX: axis === "vertical" ? platform.x : platform.fromX ?? platform.x,
    toX: axis === "vertical" ? platform.x : platform.toX ?? platform.x,
    fromY: axis === "horizontal" ? platform.y : platform.fromY ?? platform.y,
    toY: axis === "horizontal" ? platform.y : platform.toY ?? platform.y
  };
  return Object.values(path).every((value) => typeof value === "string" || Number.isFinite(value)) ? path : null;
}

function checkpointNearMovingPlatform(platform: MovingPlatformSpec, geometry: PlatformerLevelGeometry): boolean {
  const centerX = platform.x + platform.width / 2;
  const centerY = platform.y + platform.height / 2;
  return geometry.checkpoints.some((checkpoint) => {
    const dx = Math.abs(checkpoint.respawnX - centerX);
    const dy = Math.abs(checkpoint.respawnY - centerY);
    return dx <= 640 && dy <= 420;
  });
}

function validateRequiredObjects(
  geometry: PlatformerLevelGeometry,
  options: DevLevelValidationOptions,
  addIssue: (issue: Omit<DevValidationIssue, "id">) => void
): void {
  if (!geometry.exit?.id) {
    addIssue({
      severity: "error",
      category: "required-object",
      objectType: "exit",
      message: "Level is missing a valid exit.",
      suggestedFix: "Ensure the geometry has one supported exit."
    });
  }
  if (geometry.exhibits.filter((exhibit) => exhibit.required).length === 0) {
    addIssue({
      severity: "warning",
      category: "required-object",
      objectType: "exhibit",
      message: "No required clue/exhibit is declared.",
      suggestedFix: "Confirm this level intentionally has no required clue."
    });
  }
  if (geometry.checkpoints.length === 0) {
    addIssue({
      severity: "warning",
      category: "checkpoint",
      objectType: "checkpoint",
      message: "Level has no checkpoints.",
      suggestedFix: "Add at least one stable checkpoint for authored platformer routes."
    });
  }
  if ((options.activeChapterId === 5 || options.activeChapterId === 6) && geometry.movingPlatforms.length < 2) {
    addIssue({
      severity: "warning",
      category: "moving-platform",
      objectType: "moving-platform",
      message: `Chapter ${options.activeChapterId} is expected to have at least two moving/elevator platforms.`,
      suggestedFix: "Confirm the active chapter route still includes its elevator/floating ascent beat."
    });
  }
}

function validateOverrideContext(
  geometry: PlatformerLevelGeometry,
  options: DevLevelValidationOptions,
  addIssue: (issue: Omit<DevValidationIssue, "id">) => void
): void {
  if (!options.overrides) {
    return;
  }

  const knownIds = new Set([
    ...collectValidationObjects(options.baseGeometry ?? geometry).map((object) => object.id).filter(Boolean),
    ...options.overrides.addedObjects.map((object) => object.id)
  ]);
  for (const deletedId of options.overrides.deletedObjectIds) {
    if (!knownIds.has(deletedId)) {
      addIssue({
        severity: "warning",
        category: "ids",
        objectId: deletedId,
        message: `Deleted override id does not match a known base or added object: ${deletedId}.`,
        suggestedFix: "Remove stale deletedObjectIds entries from the override file if they are no longer needed."
      });
    }
  }
}

export function describeDevObjectStatus(options: {
  source?: "base" | "added";
  dirty?: boolean;
  hasSavedOverride?: boolean;
}): string {
  if (options.source === "added") {
    return options.dirty ? "added unsaved" : options.hasSavedOverride ? "added saved" : "added unsaved";
  }

  if (options.dirty) {
    return "dirty unsaved";
  }

  return options.hasSavedOverride ? "saved override" : "clean";
}

export function generateDevPlatformId(options: {
  levelId: number;
  chapterId?: number | null;
  existingIds: Iterable<string>;
}): string {
  const prefix =
    typeof options.chapterId === "number" && Number.isInteger(options.chapterId)
      ? `ch${options.chapterId}_dev_platform`
      : `level${options.levelId}_dev_platform`;
  const existing = new Set(options.existingIds);

  for (let index = 1; index < 1000; index += 1) {
    const candidate = `${prefix}_${String(index).padStart(3, "0")}`;
    if (!existing.has(candidate)) {
      return candidate;
    }
  }

  return `${prefix}_${Date.now()}`;
}

export function generateDevMovingPlatformId(options: {
  levelId: number;
  chapterId?: number | null;
  existingIds: Iterable<string>;
  variant: "moving-platform" | "elevator";
}): string {
  const suffix = options.variant === "elevator" ? "elevator" : "moving_platform";
  const prefix =
    typeof options.chapterId === "number" && Number.isInteger(options.chapterId)
      ? `ch${options.chapterId}_dev_${suffix}`
      : `level${options.levelId}_dev_${suffix}`;
  const existing = new Set(options.existingIds);

  for (let index = 1; index < 1000; index += 1) {
    const candidate = `${prefix}_${String(index).padStart(3, "0")}`;
    if (!existing.has(candidate)) {
      return candidate;
    }
  }

  return `${prefix}_${Date.now()}`;
}

export function createDevStaticPlatformOverride(options: {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  snap?: boolean;
  gridSize?: number;
}): DevLevelOverrideObject {
  const rect = {
    x: Math.round(options.x),
    y: Math.round(options.y),
    width: options.width ?? DEFAULT_DEV_PLATFORM_WIDTH,
    height: options.height ?? DEFAULT_DEV_PLATFORM_HEIGHT
  };
  const snapped = options.snap ? snapRect(rect, options.gridSize) : rect;

  return {
    id: options.id,
    type: "platform",
    kind: "paper",
    label: options.label ?? "Added platform",
    x: snapped.x,
    y: snapped.y,
    width: snapped.width,
    height: snapped.height
  };
}

export function createDevMovingPlatformOverride(options: {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  axis: "horizontal" | "vertical";
  speed?: number;
  distance?: number;
  label?: string;
  snap?: boolean;
  gridSize?: number;
}): DevLevelOverrideObject {
  const width = options.width ?? DEFAULT_DEV_MOVING_PLATFORM_WIDTH;
  const height = options.height ?? DEFAULT_DEV_MOVING_PLATFORM_HEIGHT;
  const distance =
    options.distance ?? (options.axis === "vertical" ? DEFAULT_DEV_ELEVATOR_DISTANCE : DEFAULT_DEV_MOVING_PLATFORM_DISTANCE);
  const speed = options.speed ?? (options.axis === "vertical" ? DEFAULT_DEV_ELEVATOR_SPEED : DEFAULT_DEV_MOVING_PLATFORM_SPEED);
  const rect = {
    x: Math.round(options.x),
    y: Math.round(options.y),
    width,
    height
  };
  const snapped = options.snap ? snapRect(rect, options.gridSize) : rect;
  const snapEndpoint = (value: number) => (options.snap ? snapValue(value, options.gridSize) : Math.round(value));

  if (options.axis === "vertical") {
    const fromY = snapEndpoint(snapped.y - distance);
    const toY = snapEndpoint(snapped.y);
    return {
      id: options.id,
      type: "moving-platform",
      kind: "paper",
      label: options.label ?? "Added elevator",
      x: snapped.x,
      y: snapped.y,
      width: snapped.width,
      height: snapped.height,
      axis: "vertical",
      fromX: snapped.x,
      toX: snapped.x,
      fromY,
      toY,
      speed
    };
  }

  const fromX = snapEndpoint(snapped.x - distance / 2);
  const toX = snapEndpoint(snapped.x + distance / 2);
  return {
    id: options.id,
    type: "moving-platform",
    kind: "paper",
    label: options.label ?? "Added moving platform",
    x: snapped.x,
    y: snapped.y,
    width: snapped.width,
    height: snapped.height,
    axis: "horizontal",
    fromX,
    toX,
    fromY: snapped.y,
    toY: snapped.y,
    speed
  };
}

export function summarizeDevLevelOverrides(overrides: DevLevelOverridesFile): DevOverrideSummary {
  return {
    modifiedCount: Object.keys(overrides.objects).length,
    addedCount: overrides.addedObjects.length,
    deletedCount: overrides.deletedObjectIds.length,
    modifiedObjects: Object.values(overrides.objects),
    addedObjects: [...overrides.addedObjects],
    deletedObjectIds: [...overrides.deletedObjectIds]
  };
}

export function createDevLevelOverrideExport(
  overrides: DevLevelOverridesFile,
  meta: DevOverrideExportMeta
): string {
  return `${JSON.stringify(
    {
      version: 2,
      levelId: overrides.levelId,
      ...(overrides.chapterId !== undefined ? { chapterId: overrides.chapterId } : {}),
      ...(overrides.chapterTitle !== undefined ? { chapterTitle: overrides.chapterTitle } : {}),
      exportedAt: meta.exportedAt,
      projectTitle: meta.projectTitle,
      modifiedObjects: overrides.objects,
      addedObjects: overrides.addedObjects,
      deletedObjectIds: overrides.deletedObjectIds
    },
    null,
    2
  )}\n`;
}

export function parseDevLevelOverrideImport(
  rawJson: string,
  currentLevelId: number,
  validate: (value: unknown, fallbackLevelId: number) => DevLevelOverridesFile | null
): DevOverrideImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { ok: false, error: "Import must be valid override JSON." };
  }

  const overrides = validate(parsed, currentLevelId);
  if (!overrides) {
    return { ok: false, error: "Import JSON is not a valid dev level override file." };
  }

  return {
    ok: true,
    overrides,
    levelMismatch: overrides.levelId !== currentLevelId,
    summary: summarizeDevLevelOverrides(overrides)
  };
}
