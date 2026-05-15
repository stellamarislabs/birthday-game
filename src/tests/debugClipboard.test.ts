import { describe, expect, it } from "vitest";
import {
  formatDebugPoint,
  nudgeDebugObjectData,
  resizeDebugObjectData,
  serializeDebugObjectAsJson,
  serializeDebugObjectAsTypeScript
} from "../game/debug/debugClipboard";
import type { DebugObjectData } from "../game/debug/debugTypes";

const platformObject: DebugObjectData = {
  id: "L8_platform_04",
  type: "platform",
  levelId: 8,
  x: 1220,
  y: 360,
  width: 240,
  height: 32,
  editable: true
};

const movingObject: DebugObjectData = {
  id: "argument-elevator-one",
  type: "moving-platform",
  levelId: 8,
  x: 820,
  y: 1682,
  width: 260,
  height: 32,
  editable: true,
  axis: "vertical",
  fromY: 1454,
  toY: 1682,
  speed: 42
};

const checkpointObject: DebugObjectData = {
  id: "midpoint-checkpoint",
  type: "checkpoint",
  levelId: 1,
  x: 1430,
  y: 300,
  width: 54,
  height: 80,
  editable: true,
  respawnX: 1470,
  respawnY: 316,
  linkedRespawn: true
};

describe("debug clipboard helpers", () => {
  it("formats points as rounded JSON", () => {
    expect(formatDebugPoint({ x: 1452.4, y: 313.6 })).toBe('{\n  "x": 1452,\n  "y": 314\n}');
  });

  it("serializes selected object as JSON", () => {
    expect(serializeDebugObjectAsJson(platformObject)).toContain('"id": "L8_platform_04"');
    expect(serializeDebugObjectAsJson(platformObject)).toContain('"type": "platform"');
  });

  it("serializes selected object as TypeScript-like snippet", () => {
    const snippet = serializeDebugObjectAsTypeScript(platformObject);

    expect(snippet).toContain("id: 'L8_platform_04'");
    expect(snippet).toContain("type: 'platform'");
    expect(snippet).toContain("width: 240");
  });

  it("nudges object data by the requested delta", () => {
    expect(nudgeDebugObjectData(platformObject, 10, -4)).toMatchObject({
      x: 1230,
      y: 356
    });
  });

  it("nudges moving object data with anchors", () => {
    expect(nudgeDebugObjectData(movingObject, 12, -32)).toMatchObject({
      x: 832,
      y: 1650,
      fromY: 1422,
      toY: 1650,
      speed: 42
    });
  });

  it("nudges linked checkpoint respawn data with the trigger", () => {
    expect(nudgeDebugObjectData(checkpointObject, 16, 8)).toMatchObject({
      x: 1446,
      y: 308,
      respawnX: 1486,
      respawnY: 324
    });
  });

  it("resizes static platform width and height", () => {
    expect(resizeDebugObjectData(platformObject, 1, 0)).toMatchObject({ width: 241, height: 32 });
    expect(resizeDebugObjectData(platformObject, -1, 0)).toMatchObject({ width: 239, height: 32 });
    expect(resizeDebugObjectData(platformObject, 0, 1)).toMatchObject({ width: 240, height: 33 });
    expect(resizeDebugObjectData(platformObject, 0, -1)).toMatchObject({ width: 240, height: 31 });
  });

  it("respects minimum resize dimensions", () => {
    expect(resizeDebugObjectData(platformObject, -999, -999)).toMatchObject({
      width: 16,
      height: 8
    });
  });

  it("resizes moving platform dimensions without moving anchors or changing speed", () => {
    expect(resizeDebugObjectData(movingObject, 32, 4)).toMatchObject({
      x: 820,
      y: 1682,
      width: 292,
      height: 36,
      fromY: 1454,
      toY: 1682,
      speed: 42
    });
  });

  it("serializes moving object anchors", () => {
    expect(serializeDebugObjectAsJson(movingObject)).toContain('"fromY": 1454');
    expect(serializeDebugObjectAsTypeScript(movingObject)).toContain("speed: 42");
  });

  it("serializes checkpoint respawn fields", () => {
    expect(serializeDebugObjectAsJson(checkpointObject)).toContain('"respawnX": 1470');
    expect(serializeDebugObjectAsTypeScript(checkpointObject)).toContain("respawnY: 316");
  });
});
