import type Phaser from "phaser";

export interface DevSpawn {
  x: number;
  y: number;
  source: "query-spawn" | "checkpoint" | "preserved-position";
  checkpointId?: string;
}

export type DebugObjectType =
  | "platform"
  | "moving-platform"
  | "rebuildable-platform"
  | "rebuild-trigger"
  | "light-platform"
  | "checkpoint"
  | "exhibit"
  | "exit"
  | "archive-key"
  | "archive-door"
  | "choice-door"
  | "lantern-switch"
  | "witness-fragment"
  | "tiny-detail-note"
  | "echo-fragment"
  | "quiet-evidence-fragment"
  | "argument-fragment";

export interface DebugObjectData {
  id: string;
  type: DebugObjectType;
  levelId: number;
  source?: "base" | "added";
  x: number;
  y: number;
  width: number;
  height: number;
  kind?: string;
  label?: string;
  name?: string;
  required?: boolean;
  editable: boolean;
  resizable?: boolean;
  respawnX?: number;
  respawnY?: number;
  linkedRespawn?: boolean;
  targetScene?: string;
  targetLevelId?: number;
  checkpointIndex?: number;
  axis?: "horizontal" | "vertical";
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  speed?: number;
  hasOverride?: boolean;
  dirty?: boolean;
}

export interface RuntimeDebugObject {
  data: DebugObjectData;
  baseData?: DebugObjectData;
  gameObject?: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Zone;
  moveBy?: (dx: number, dy: number) => void;
  resizeBy?: (dWidth: number, dHeight: number) => void;
}

export interface DebugPoint {
  x: number;
  y: number;
}
