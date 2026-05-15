import type { DevSpawn } from "./debugTypes";
import type { PlatformerLevelGeometry } from "../platformer/levelGeometry";

export type DebugSceneRoute = "platformer" | "puzzle" | "level-select" | "final-verdict" | "vn";

export interface ParsedDebugQuery {
  enabled: boolean;
  scene: DebugSceneRoute | null;
  levelId: number;
  chapterId: number | null;
  checkpointNumber: number | null;
  spawn: { x: number; y: number } | null;
  vnSceneId: string | null;
}

export interface ParseDebugQueryOptions {
  enabled: boolean;
  maxLevel?: number;
  defaultLevel?: number;
}

const VALID_SCENES = new Set<DebugSceneRoute>(["platformer", "puzzle", "level-select", "final-verdict", "vn"]);

export function parseDebugQueryParams(params: URLSearchParams, options: ParseDebugQueryOptions): ParsedDebugQuery {
  const defaultLevel = options.defaultLevel ?? 1;
  const maxLevel = options.maxLevel ?? 10;
  const rawScene = params.get("scene");
  const scene = VALID_SCENES.has(rawScene as DebugSceneRoute) ? (rawScene as DebugSceneRoute) : null;

  return {
    enabled: options.enabled,
    scene: options.enabled ? scene : null,
    levelId: clampLevel(parsePositiveInteger(params.get("level")), defaultLevel, maxLevel),
    chapterId: parsePositiveInteger(params.get("chapter")),
    checkpointNumber: parseCheckpointNumber(params.get("checkpoint")),
    spawn: parseSpawnParam(params.get("spawn")),
    vnSceneId: parseVnSceneId(params.get("id"))
  };
}

export function resolveDevSpawn(query: ParsedDebugQuery, geometry: PlatformerLevelGeometry): DevSpawn | undefined {
  if (!query.enabled || query.scene !== "platformer") {
    return undefined;
  }

  if (query.spawn) {
    return {
      x: query.spawn.x,
      y: query.spawn.y,
      source: "query-spawn"
    };
  }

  if (query.checkpointNumber !== null) {
    const checkpoint = geometry.checkpoints[query.checkpointNumber - 1];
    if (checkpoint) {
      return {
        x: checkpoint.respawnX,
        y: checkpoint.respawnY,
        source: "checkpoint",
        checkpointId: checkpoint.id
      };
    }
  }

  return undefined;
}

function parsePositiveInteger(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

function parseCheckpointNumber(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace(/^cp/, "");
  return parsePositiveInteger(normalized);
}

function parseSpawnParam(value: string | null): { x: number; y: number } | null {
  if (!value) {
    return null;
  }

  const match = value.trim().match(/^x\s*:\s*(-?\d+(?:\.\d+)?)\s*,\s*y\s*:\s*(-?\d+(?:\.\d+)?)$/i);
  if (!match) {
    return null;
  }

  const x = Number(match[1]);
  const y = Number(match[2]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return { x, y };
}

function parseVnSceneId(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function clampLevel(value: number | null, fallback: number, maxLevel: number): number {
  if (value === null || value > maxLevel) {
    return fallback;
  }

  return value;
}
