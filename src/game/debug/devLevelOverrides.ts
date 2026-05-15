import type { DebugObjectData, DebugObjectType } from "./debugTypes";
import type { MovingPlatformSpec, PlatformerLevelGeometry, PlatformSpec, RectSpec } from "../platformer/levelGeometry";

export interface DevLevelOverrideObject {
  id: string;
  type: DebugObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  kind?: PlatformSpec["kind"];
  label?: string;
  axis?: "horizontal" | "vertical";
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  speed?: number;
  respawnX?: number;
  respawnY?: number;
}

export interface DevLevelOverridesFile {
  version?: 1 | 2;
  levelId: number;
  chapterId?: number;
  chapterTitle?: string;
  updatedAt?: string;
  /**
   * Backward-compatible in-memory alias for modified existing objects.
   * Version 2 files serialize this field as `modifiedObjects`.
   */
  objects: Record<string, DevLevelOverrideObject>;
  addedObjects: DevLevelOverrideObject[];
  deletedObjectIds: string[];
}

export interface ApplyDevLevelOverridesResult {
  geometry: PlatformerLevelGeometry;
  appliedObjectIds: string[];
  ignoredObjectIds: string[];
  addedObjectIds: string[];
  deletedObjectIds: string[];
  warnings: string[];
}

const VALID_OBJECT_TYPES = new Set<DebugObjectType>([
  "platform",
  "moving-platform",
  "rebuildable-platform",
  "rebuild-trigger",
  "light-platform",
  "checkpoint",
  "exhibit",
  "exit",
  "archive-key",
  "archive-door",
  "choice-door",
  "lantern-switch",
  "witness-fragment",
  "tiny-detail-note",
  "echo-fragment",
  "quiet-evidence-fragment",
  "argument-fragment"
]);

export function isValidDevOverrideLevelId(levelId: number): boolean {
  return Number.isInteger(levelId) && levelId >= 1 && levelId <= 10;
}

export function emptyDevLevelOverrides(levelId: number): DevLevelOverridesFile {
  return {
    version: 2,
    levelId,
    objects: {},
    addedObjects: [],
    deletedObjectIds: []
  };
}

export function validateDevLevelOverrideObject(value: unknown): DevLevelOverrideObject | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = value.id;
  const type = value.type;
  if (typeof id !== "string" || !isSafeObjectId(id)) {
    return null;
  }

  if (typeof type !== "string" || !VALID_OBJECT_TYPES.has(type as DebugObjectType)) {
    return null;
  }

  const x = readFiniteNumber(value.x);
  const y = readFiniteNumber(value.y);
  const width = readPositiveNumber(value.width);
  const height = readPositiveNumber(value.height);
  if (x === null || y === null || width === null || height === null) {
    return null;
  }

  const object: DevLevelOverrideObject = {
    id,
    type: type as DebugObjectType,
    x,
    y,
    width,
    height
  };

  if (value.axis === "horizontal" || value.axis === "vertical") {
    object.axis = value.axis;
  }

  if (type === "platform") {
    const kind = value.kind;
    object.kind = isValidPlatformKind(kind) ? kind : "paper";
    if (typeof value.label === "string" && value.label.trim()) {
      object.label = value.label.slice(0, 80);
    }
  }

  if (type === "moving-platform") {
    const kind = value.kind;
    if (isValidPlatformKind(kind)) {
      object.kind = kind;
    }
    if (typeof value.label === "string" && value.label.trim()) {
      object.label = value.label.slice(0, 80);
    }
  }

  for (const key of ["fromX", "toX", "fromY", "toY"] as const) {
    const parsed = readFiniteNumber(value[key]);
    if (parsed !== null) {
      object[key] = parsed;
    }
  }

  const speed = readPositiveNumber(value.speed);
  if (speed !== null) {
    object.speed = speed;
  }
  const respawnX = readFiniteNumber(value.respawnX);
  if (respawnX !== null) {
    object.respawnX = respawnX;
  }
  const respawnY = readFiniteNumber(value.respawnY);
  if (respawnY !== null) {
    object.respawnY = respawnY;
  }

  return object;
}

export function validateDevLevelOverridesFile(value: unknown, fallbackLevelId: number): DevLevelOverridesFile | null {
  if (!isRecord(value)) {
    return null;
  }

  const levelId = readFiniteNumber(value.levelId) ?? fallbackLevelId;
  if (!isValidDevOverrideLevelId(levelId)) {
    return null;
  }

  const modifiedSource = isRecord(value.modifiedObjects) ? value.modifiedObjects : isRecord(value.objects) ? value.objects : {};

  const objects: Record<string, DevLevelOverrideObject> = {};
  for (const candidate of Object.values(modifiedSource)) {
    const object = validateDevLevelOverrideObject(candidate);
    if (object) {
      objects[object.id] = object;
    }
  }

  const addedObjects: DevLevelOverrideObject[] = [];
  if (Array.isArray(value.addedObjects)) {
    for (const candidate of value.addedObjects) {
      const object = validateAddedPlatformObject(candidate);
      if (object) {
        addedObjects.push(object);
      }
    }
  }

  const deletedObjectIds = Array.isArray(value.deletedObjectIds)
    ? [...new Set(value.deletedObjectIds.filter((id): id is string => typeof id === "string" && isSafeObjectId(id)))]
    : [];

  return {
    version: value.version === 1 ? 1 : 2,
    levelId,
    chapterId: readChapterId(value.chapterId),
    chapterTitle: typeof value.chapterTitle === "string" ? value.chapterTitle : undefined,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
    objects,
    addedObjects,
    deletedObjectIds
  };
}

export function serializeDebugObjectForOverride(object: DebugObjectData): DevLevelOverrideObject {
  const override: DevLevelOverrideObject = {
    id: object.id,
    type: object.type,
    x: Math.round(object.x),
    y: Math.round(object.y),
    width: Math.round(object.width),
    height: Math.round(object.height)
  };

  if (object.axis !== undefined) {
    override.axis = object.axis;
  }
  if (object.fromX !== undefined) {
    override.fromX = Math.round(object.fromX);
  }
  if (object.toX !== undefined) {
    override.toX = Math.round(object.toX);
  }
  if (object.fromY !== undefined) {
    override.fromY = Math.round(object.fromY);
  }
  if (object.toY !== undefined) {
    override.toY = Math.round(object.toY);
  }
  if (object.speed !== undefined) {
    override.speed = Math.round(object.speed);
  }
  if (object.respawnX !== undefined) {
    override.respawnX = Math.round(object.respawnX);
  }
  if (object.respawnY !== undefined) {
    override.respawnY = Math.round(object.respawnY);
  }
  if (object.kind !== undefined && isValidPlatformKind(object.kind)) {
    override.kind = object.kind;
  }
  if (object.label !== undefined) {
    override.label = object.label;
  }

  return override;
}

export function nudgeDevOverrideObject(object: DevLevelOverrideObject, dx: number, dy: number): DevLevelOverrideObject {
  return {
    ...object,
    x: object.x + dx,
    y: object.y + dy,
    fromX: object.fromX === undefined ? undefined : object.fromX + dx,
    toX: object.toX === undefined ? undefined : object.toX + dx,
    fromY: object.fromY === undefined ? undefined : object.fromY + dy,
    toY: object.toY === undefined ? undefined : object.toY + dy,
    respawnX: object.respawnX === undefined ? undefined : object.respawnX + dx,
    respawnY: object.respawnY === undefined ? undefined : object.respawnY + dy
  };
}

export function mergeDevLevelOverrideObjects(
  existing: DevLevelOverridesFile,
  updates: DevLevelOverrideObject[],
  updatedAt = new Date().toISOString()
): DevLevelOverridesFile {
  const objects = { ...existing.objects };
  for (const update of updates) {
    objects[update.id] = update;
  }

  return {
    ...existing,
    version: 2,
    levelId: existing.levelId,
    updatedAt,
    objects,
    addedObjects: [...existing.addedObjects],
    deletedObjectIds: [...existing.deletedObjectIds]
  };
}

export function deleteDevLevelOverrideObject(existing: DevLevelOverridesFile, objectId: string): DevLevelOverridesFile {
  const objects = { ...existing.objects };
  delete objects[objectId];
  return {
    ...existing,
    version: 2,
    levelId: existing.levelId,
    updatedAt: new Date().toISOString(),
    objects,
    addedObjects: [...existing.addedObjects],
    deletedObjectIds: [...existing.deletedObjectIds]
  };
}

export function addDevLevelOverrideObjects(
  existing: DevLevelOverridesFile,
  addedObjects: DevLevelOverrideObject[],
  updatedAt = new Date().toISOString()
): DevLevelOverridesFile {
  const existingAdded = new Map(existing.addedObjects.map((object) => [object.id, object]));
  for (const object of addedObjects) {
    const validObject = validateAddedPlatformObject(object);
    if (validObject) {
      existingAdded.set(validObject.id, validObject);
    }
  }

  return {
    ...existing,
    version: 2,
    updatedAt,
    addedObjects: [...existingAdded.values()],
    deletedObjectIds: existing.deletedObjectIds.filter((id) => !existingAdded.has(id))
  };
}

export function deleteDevLevelObject(existing: DevLevelOverridesFile, objectId: string): DevLevelOverridesFile {
  const objects = { ...existing.objects };
  delete objects[objectId];
  const addedObjects = existing.addedObjects.filter((object) => object.id !== objectId);
  const wasAddedObject = addedObjects.length !== existing.addedObjects.length;
  return {
    ...existing,
    version: 2,
    updatedAt: new Date().toISOString(),
    objects,
    addedObjects,
    deletedObjectIds: wasAddedObject ? existing.deletedObjectIds.filter((id) => id !== objectId) : uniqueStrings([...existing.deletedObjectIds, objectId])
  };
}

export function applyDevLevelOverrides(
  geometry: PlatformerLevelGeometry,
  overrides: DevLevelOverridesFile | null
): ApplyDevLevelOverridesResult {
  const merged = cloneGeometry(geometry);
  if (!overrides || overrides.levelId !== geometry.levelId) {
    return {
      geometry: merged,
      appliedObjectIds: [],
      ignoredObjectIds: overrides ? Object.keys(overrides.objects) : [],
      addedObjectIds: [],
      deletedObjectIds: [],
      warnings: []
    };
  }

  const appliedObjectIds: string[] = [];
  const ignoredObjectIds: string[] = [];
  const addedObjectIds: string[] = [];
  const deletedObjectIds: string[] = [];
  const warnings: string[] = [];
  const baseObjectIds = collectGeometryObjectIds(merged);
  const duplicateBeforeApply = findDuplicateIds([...baseObjectIds, ...overrides.addedObjects.map((object) => object.id)]);
  for (const duplicateId of duplicateBeforeApply) {
    warnings.push(`Duplicate object id ignored: ${duplicateId}`);
  }

  for (const deletedId of overrides.deletedObjectIds) {
    if (deleteStaticPlatformFromGeometry(merged, deletedId)) {
      deletedObjectIds.push(deletedId);
    } else if (!overrides.addedObjects.some((object) => object.id === deletedId)) {
      warnings.push(`Deleted object id not found or not editable in Dev-2: ${deletedId}`);
    }
  }

  for (const override of Object.values(overrides.objects)) {
    if (overrides.deletedObjectIds.includes(override.id)) {
      ignoredObjectIds.push(override.id);
      continue;
    }
    if (applyOneOverride(merged, override)) {
      appliedObjectIds.push(override.id);
    } else {
      ignoredObjectIds.push(override.id);
    }
  }

  const existingIds = new Set(collectGeometryObjectIds(merged));
  for (const added of overrides.addedObjects) {
    if (overrides.deletedObjectIds.includes(added.id)) {
      continue;
    }
    if (existingIds.has(added.id)) {
      warnings.push(`Added object id duplicates existing geometry: ${added.id}`);
      continue;
    }
    if (added.type !== "platform" && added.type !== "moving-platform") {
      warnings.push(`Unsupported added object type ignored: ${added.type}`);
      continue;
    }
    if (added.type === "moving-platform") {
      const platform = toMovingPlatformSpec(added);
      merged.movingPlatforms.push(platform);
      existingIds.add(platform.id);
      addedObjectIds.push(platform.id);
    } else {
      const platform = toPlatformSpec(added);
      merged.platforms.push(platform);
      existingIds.add(platform.id);
      addedObjectIds.push(platform.id);
    }
  }

  return {
    geometry: merged,
    appliedObjectIds,
    ignoredObjectIds,
    addedObjectIds,
    deletedObjectIds,
    warnings
  };
}

export function serializeDevLevelOverrides(file: DevLevelOverridesFile): string {
  const serialized = {
    version: 2,
    levelId: file.levelId,
    ...(file.chapterId !== undefined ? { chapterId: file.chapterId } : {}),
    ...(file.chapterTitle !== undefined ? { chapterTitle: file.chapterTitle } : {}),
    ...(file.updatedAt !== undefined ? { updatedAt: file.updatedAt } : {}),
    modifiedObjects: file.objects,
    addedObjects: file.addedObjects,
    deletedObjectIds: file.deletedObjectIds
  };
  return `${JSON.stringify(serialized, null, 2)}\n`;
}

function applyOneOverride(geometry: PlatformerLevelGeometry, override: DevLevelOverrideObject): boolean {
  switch (override.type) {
    case "platform":
      return applyToRectList(geometry.platforms, override);
    case "moving-platform":
      return applyToRectList(geometry.movingPlatforms, override, true);
    case "rebuild-trigger":
      return applyToRectList(
        geometry.rebuildGroups.map((group) => group.trigger),
        override
      );
    case "rebuildable-platform":
      return applyToRectList(
        geometry.rebuildGroups.flatMap((group) => group.platforms),
        override
      );
    case "light-platform":
      return applyToRectList(
        geometry.lightRevealGroups.flatMap((group) => group.platforms),
        override
      );
    case "checkpoint":
      return applyToRectList(geometry.checkpoints, override, false, true);
    case "exhibit":
      return applyToRectList(geometry.exhibits, override);
    case "exit":
      if (geometry.exit.id !== override.id) {
        return false;
      }
      applyRectFields(geometry.exit, override);
      return true;
    case "archive-key":
      return applyToRectList(geometry.archiveKeys, override);
    case "archive-door":
      return applyToRectList(geometry.archiveDoors, override);
    case "choice-door":
      return applyToRectList(geometry.choiceDoors, override);
    case "lantern-switch":
      return applyToRectList(geometry.lanternSwitches, override);
    case "witness-fragment":
      return applyToRectList(geometry.witnessFragments, override);
    case "tiny-detail-note":
      return applyToRectList(geometry.tinyDetailNotes, override);
    case "echo-fragment":
      return applyToRectList(geometry.echoFragments, override);
    case "quiet-evidence-fragment":
      return applyToRectList(geometry.quietEvidenceFragments, override);
    case "argument-fragment":
      return applyToRectList(geometry.argumentFragments, override);
  }
}

function applyToRectList<T extends RectSpec>(
  objects: T[],
  override: DevLevelOverrideObject,
  includeMovingFields = false,
  includeCheckpointFields = false
): boolean {
  const target = objects.find((object) => object.id === override.id);
  if (!target) {
    return false;
  }

  applyRectFields(target, override);

  if (includeMovingFields) {
    const movingTarget = target as T & {
      axis?: "horizontal" | "vertical";
      fromX?: number;
      toX?: number;
      fromY?: number;
      toY?: number;
      speed?: number;
    };
    movingTarget.axis = override.axis ?? movingTarget.axis;
    movingTarget.fromX = override.fromX ?? movingTarget.fromX;
    movingTarget.toX = override.toX ?? movingTarget.toX;
    movingTarget.fromY = override.fromY ?? movingTarget.fromY;
    movingTarget.toY = override.toY ?? movingTarget.toY;
    movingTarget.speed = override.speed ?? movingTarget.speed;
  }

  if (includeCheckpointFields) {
    const checkpointTarget = target as T & {
      respawnX?: number;
      respawnY?: number;
    };
    checkpointTarget.respawnX = override.respawnX ?? checkpointTarget.respawnX;
    checkpointTarget.respawnY = override.respawnY ?? checkpointTarget.respawnY;
  }

  return true;
}

function applyRectFields(target: RectSpec, override: DevLevelOverrideObject): void {
  target.x = override.x;
  target.y = override.y;
  target.width = override.width;
  target.height = override.height;

  const labeledTarget = target as RectSpec & { kind?: PlatformSpec["kind"]; label?: string };
  if (override.kind !== undefined && isValidPlatformKind(override.kind)) {
    labeledTarget.kind = override.kind;
  }
  if (override.label !== undefined) {
    labeledTarget.label = override.label;
  }
}

function validateAddedPlatformObject(value: unknown): DevLevelOverrideObject | null {
  const object = validateDevLevelOverrideObject(value);
  if (!object || (object.type !== "platform" && object.type !== "moving-platform")) {
    return null;
  }

  if (object.type === "moving-platform") {
    const axis = object.axis;
    if (axis !== "horizontal" && axis !== "vertical") {
      return null;
    }
    if (object.speed === undefined || object.speed <= 0) {
      return null;
    }
    const fromX = object.fromX;
    const toX = object.toX;
    const fromY = object.fromY;
    const toY = object.toY;
    if (![fromX, toX, fromY, toY].every((value) => typeof value === "number" && Number.isFinite(value))) {
      return null;
    }
    const pathLength = axis === "vertical" ? Math.abs((toY ?? 0) - (fromY ?? 0)) : Math.abs((toX ?? 0) - (fromX ?? 0));
    if (pathLength <= 8) {
      return null;
    }
    return {
      ...object,
      kind: object.kind === "tram" ? "tram" : "paper",
      label: object.label ?? "Added moving platform"
    };
  }

  return {
    ...object,
    kind: object.kind ?? "paper",
    label: object.label ?? "Added platform"
  };
}

function toPlatformSpec(object: DevLevelOverrideObject): PlatformSpec {
  return {
    id: object.id,
    kind: object.kind ?? "paper",
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    label: object.label
  };
}

function toMovingPlatformSpec(object: DevLevelOverrideObject): MovingPlatformSpec {
  return {
    id: object.id,
    kind: object.kind === "tram" ? "tram" : "paper",
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    axis: object.axis ?? "horizontal",
    fromX: object.fromX ?? object.x,
    toX: object.toX ?? object.x,
    fromY: object.fromY ?? object.y,
    toY: object.toY ?? object.y,
    speed: object.speed ?? 32,
    label: object.label
  };
}

function deleteStaticPlatformFromGeometry(geometry: PlatformerLevelGeometry, objectId: string): boolean {
  const before = geometry.platforms.length;
  geometry.platforms = geometry.platforms.filter((platform) => platform.id !== objectId);
  return geometry.platforms.length !== before;
}

function collectGeometryObjectIds(geometry: PlatformerLevelGeometry): string[] {
  return [
    ...geometry.platforms.map((object) => object.id),
    ...geometry.movingPlatforms.map((object) => object.id),
    ...geometry.rebuildGroups.flatMap((group) => [group.trigger.id, ...group.platforms.map((platform) => platform.id)]),
    ...geometry.lightRevealGroups.flatMap((group) => group.platforms.map((platform) => platform.id)),
    ...geometry.checkpoints.map((object) => object.id),
    ...geometry.exhibits.map((object) => object.id),
    geometry.exit.id,
    ...geometry.archiveKeys.map((object) => object.id),
    ...geometry.archiveDoors.map((object) => object.id),
    ...geometry.choiceDoors.map((object) => object.id),
    ...geometry.lanternSwitches.map((object) => object.id),
    ...geometry.witnessFragments.map((object) => object.id),
    ...geometry.tinyDetailNotes.map((object) => object.id),
    ...geometry.echoFragments.map((object) => object.id),
    ...geometry.quietEvidenceFragments.map((object) => object.id),
    ...geometry.argumentFragments.map((object) => object.id)
  ];
}

function findDuplicateIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id);
    }
    seen.add(id);
  }
  return [...duplicates];
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

function readChapterId(value: unknown): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 6 ? value : undefined;
}

function cloneGeometry(geometry: PlatformerLevelGeometry): PlatformerLevelGeometry {
  return JSON.parse(JSON.stringify(geometry)) as PlatformerLevelGeometry;
}

function isSafeObjectId(value: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(value);
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readPositiveNumber(value: unknown): number | null {
  const parsed = readFiniteNumber(value);
  return parsed !== null && parsed > 0 ? parsed : null;
}

function isValidPlatformKind(value: unknown): value is PlatformSpec["kind"] {
  return (
    value === "desk" ||
    value === "paper" ||
    value === "folder" ||
    value === "tram" ||
    value === "calendar" ||
    value === "brick" ||
    value === "scaffold"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
