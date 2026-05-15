import { describe, expect, it } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { buildOverrideFilePath } from "../../devtools/devLevelOverridePlugin";
import { resizeDebugObjectData } from "../game/debug/debugClipboard";
import {
  applyDevLevelOverrides,
  deleteDevLevelOverrideObject,
  emptyDevLevelOverrides,
  isValidDevOverrideLevelId,
  mergeDevLevelOverrideObjects,
  nudgeDevOverrideObject,
  serializeDevLevelOverrides,
  serializeDebugObjectForOverride,
  validateDevLevelOverrideObject,
  validateDevLevelOverridesFile
} from "../game/debug/devLevelOverrides";
import {
  createDevLevelOverrideExport,
  createDevMovingPlatformOverride,
  createDevStaticPlatformOverride,
  describeDevObjectStatus,
  generateDevPlatformId,
  generateDevMovingPlatformId,
  getMovingPlatformPathLength,
  parseDevLevelOverrideImport,
  parseInspectorNumber,
  parseInspectorRectValues,
  parseMovingPlatformInspectorValues,
  snapRect,
  snapValue,
  summarizeDevLevelOverrides,
  validateCheckpointRespawnSupport,
  validateDebugObjectSupport,
  validatePlatformerGeometry
} from "../game/debug/devLevelEditorUtils";
import type { DebugObjectData } from "../game/debug/debugTypes";
import { levelEightGeometry, levelOneGeometry } from "../game/platformer/levelGeometry";

describe("dev level overrides", () => {
  it("validates level ids safely", () => {
    expect(isValidDevOverrideLevelId(1)).toBe(true);
    expect(isValidDevOverrideLevelId(9)).toBe(true);
    expect(isValidDevOverrideLevelId(10)).toBe(true);
    expect(isValidDevOverrideLevelId(0)).toBe(false);
    expect(isValidDevOverrideLevelId(11)).toBe(false);
    expect(isValidDevOverrideLevelId(1.5)).toBe(false);
  });

  it("rejects invalid override values", () => {
    expect(
      validateDevLevelOverrideObject({
        id: "../bad",
        type: "platform",
        x: 0,
        y: 0,
        width: 10,
        height: 10
      })
    ).toBeNull();
    expect(
      validateDevLevelOverrideObject({
        id: "safe",
        type: "platform",
        x: 0,
        y: 0,
        width: -10,
        height: 10
      })
    ).toBeNull();
  });

  it("nudges moving platform anchors while preserving speed", () => {
    const moved = nudgeDevOverrideObject(
      {
        id: "argument-elevator-one",
        type: "moving-platform",
        x: 820,
        y: 1682,
        width: 260,
        height: 32,
        axis: "vertical",
        fromY: 1454,
        toY: 1682,
        speed: 42
      },
      12,
      -32
    );

    expect(moved).toMatchObject({
      x: 832,
      y: 1650,
      fromY: 1422,
      toY: 1650,
      speed: 42
    });
  });

  it("serializes moving platform overrides with anchors", () => {
    const object: DebugObjectData = {
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

    expect(serializeDebugObjectForOverride(object)).toMatchObject({
      id: "argument-elevator-one",
      axis: "vertical",
      fromY: 1454,
      toY: 1682,
      speed: 42
    });
  });

  it("serializes checkpoint respawn overrides", () => {
    const object: DebugObjectData = {
      id: "midpoint-checkpoint",
      type: "checkpoint",
      levelId: 1,
      x: 1424,
      y: 522,
      width: 124,
      height: 140,
      editable: true,
      respawnX: 1488,
      respawnY: 520,
      linkedRespawn: true
    };

    expect(serializeDebugObjectForOverride(object)).toMatchObject({
      id: "midpoint-checkpoint",
      type: "checkpoint",
      x: 1424,
      y: 522,
      respawnX: 1488,
      respawnY: 520
    });
  });

  it("merges checkpoint trigger and respawn overrides by id", () => {
    const overrides = mergeDevLevelOverrideObjects(emptyDevLevelOverrides(1), [
      {
        id: "midpoint-checkpoint",
        type: "checkpoint",
        x: 1432,
        y: 520,
        width: 128,
        height: 144,
        respawnX: 1496,
        respawnY: 516
      }
    ]);
    const result = applyDevLevelOverrides(levelOneGeometry, overrides);

    expect(result.appliedObjectIds).toEqual(["midpoint-checkpoint"]);
    expect(result.geometry.checkpoints[0]).toMatchObject({
      x: 1432,
      y: 520,
      respawnX: 1496,
      respawnY: 516
    });
    expect(levelOneGeometry.checkpoints[0]).toMatchObject({ respawnX: 1367 });
  });

  it("merges static platform overrides by id", () => {
    const overrides = mergeDevLevelOverrideObjects(emptyDevLevelOverrides(1), [
      {
        id: "start-desk",
        type: "platform",
        x: 32,
        y: 444,
        width: 520,
        height: 58
      }
    ]);
    const result = applyDevLevelOverrides(levelOneGeometry, overrides);

    expect(result.appliedObjectIds).toEqual(["start-desk"]);
    expect(result.geometry.platforms[0]).toMatchObject({ x: 32, y: 444 });
    expect(levelOneGeometry.platforms[0]).toMatchObject({ x: 0, y: 610 });
  });

  it("loads old override files as backward-compatible modified objects", () => {
    const overrides = validateDevLevelOverridesFile(
      {
        levelId: 1,
        updatedAt: "2026-05-01T00:00:00.000Z",
        objects: {
          "start-desk": {
            id: "start-desk",
            type: "platform",
            x: 40,
            y: 600,
            width: 560,
            height: 58
          }
        }
      },
      1
    );

    expect(overrides?.objects["start-desk"]).toMatchObject({ x: 40, y: 600 });
    expect(overrides?.addedObjects).toEqual([]);
    expect(overrides?.deletedObjectIds).toEqual([]);
  });

  it("serializes v2 files with modified, added, and deleted platform overrides", () => {
    const serialized = serializeDevLevelOverrides({
      ...emptyDevLevelOverrides(1),
      objects: {
        "start-desk": { id: "start-desk", type: "platform", x: 16, y: 600, width: 560, height: 58 }
      },
      addedObjects: [{ id: "ch1_dev_platform_001", type: "platform", kind: "paper", x: 512, y: 384, width: 160, height: 32 }],
      deletedObjectIds: ["folder-step"]
    });
    const parsed = JSON.parse(serialized) as Record<string, unknown>;

    expect(parsed.version).toBe(2);
    expect(parsed.modifiedObjects).toBeDefined();
    expect(parsed.addedObjects).toBeDefined();
    expect(parsed.deletedObjectIds).toEqual(["folder-step"]);
    expect(parsed.objects).toBeUndefined();
  });

  it("summarizes modified, added, and deleted override state", () => {
    const summary = summarizeDevLevelOverrides({
      ...emptyDevLevelOverrides(1),
      objects: {
        "start-desk": { id: "start-desk", type: "platform", x: 16, y: 600, width: 560, height: 58 }
      },
      addedObjects: [createDevStaticPlatformOverride({ id: "ch1_dev_platform_001", x: 320, y: 416 })],
      deletedObjectIds: ["folder-step"]
    });

    expect(summary.modifiedCount).toBe(1);
    expect(summary.addedCount).toBe(1);
    expect(summary.deletedCount).toBe(1);
    expect(summary.modifiedObjects[0].id).toBe("start-desk");
    expect(summary.addedObjects[0].id).toBe("ch1_dev_platform_001");
    expect(summary.deletedObjectIds).toEqual(["folder-step"]);
  });

  it("exports override JSON with metadata and valid v2 shape", () => {
    const exported = createDevLevelOverrideExport(
      {
        ...emptyDevLevelOverrides(1),
        chapterId: 1,
        chapterTitle: "The Sealed Envelope",
        objects: {
          "start-desk": { id: "start-desk", type: "platform", x: 16, y: 600, width: 560, height: 58 }
        },
        addedObjects: [createDevStaticPlatformOverride({ id: "ch1_dev_platform_001", x: 320, y: 416 })],
        deletedObjectIds: ["folder-step"]
      },
      {
        exportedAt: "2026-05-10T00:00:00.000Z",
        projectTitle: "Maria and the Case of the Missing Heart"
      }
    );
    const parsed = JSON.parse(exported) as Record<string, unknown>;

    expect(parsed.version).toBe(2);
    expect(parsed.levelId).toBe(1);
    expect(parsed.chapterTitle).toBe("The Sealed Envelope");
    expect(parsed.exportedAt).toBe("2026-05-10T00:00:00.000Z");
    expect(parsed.projectTitle).toBe("Maria and the Case of the Missing Heart");
    expect(parsed.modifiedObjects).toBeDefined();
    expect(parsed.addedObjects).toBeDefined();
    expect(parsed.deletedObjectIds).toEqual(["folder-step"]);
    expect(validateDevLevelOverridesFile(parsed, 1)?.objects["start-desk"]).toMatchObject({ x: 16 });
  });

  it("imports valid override JSON and reports level mismatches without saving", () => {
    const result = parseDevLevelOverrideImport(
      JSON.stringify({
        version: 2,
        levelId: 2,
        modifiedObjects: {
          "start-desk": { id: "start-desk", type: "platform", x: 16, y: 600, width: 560, height: 58 }
        },
        addedObjects: [],
        deletedObjectIds: []
      }),
      1,
      validateDevLevelOverridesFile
    );

    expect(result.ok).toBe(true);
    expect(result.ok && result.levelMismatch).toBe(true);
    expect(result.ok && result.summary.modifiedCount).toBe(1);
  });

  it("rejects invalid override imports and TypeScript snippets", () => {
    expect(parseDevLevelOverrideImport("{ nope", 1, validateDevLevelOverridesFile)).toMatchObject({ ok: false });
    expect(parseDevLevelOverrideImport("export const bad = [];", 1, validateDevLevelOverridesFile)).toMatchObject({ ok: false });
    expect(parseDevLevelOverrideImport(JSON.stringify({ levelId: 999, modifiedObjects: {} }), 1, validateDevLevelOverridesFile)).toMatchObject({
      ok: false
    });
  });

  it("adds static platforms from v2 overrides", () => {
    const overrides = {
      ...emptyDevLevelOverrides(1),
      addedObjects: [
        {
          id: "ch1_dev_platform_001",
          type: "platform" as const,
          kind: "paper" as const,
          x: 512,
          y: 384,
          width: 160,
          height: 32,
          label: "Added platform"
        }
      ]
    };
    const result = applyDevLevelOverrides(levelOneGeometry, overrides);

    expect(result.addedObjectIds).toEqual(["ch1_dev_platform_001"]);
    expect(result.geometry.platforms.some((platform) => platform.id === "ch1_dev_platform_001")).toBe(true);
    expect(levelOneGeometry.platforms.some((platform) => platform.id === "ch1_dev_platform_001")).toBe(false);
  });

  it("adds moving platforms from v2 overrides", () => {
    const override = createDevMovingPlatformOverride({
      id: "ch5_dev_moving_platform_001",
      x: 640,
      y: 360,
      axis: "horizontal"
    });
    const result = applyDevLevelOverrides(levelOneGeometry, {
      ...emptyDevLevelOverrides(1),
      addedObjects: [override]
    });

    expect(result.addedObjectIds).toEqual(["ch5_dev_moving_platform_001"]);
    expect(result.geometry.movingPlatforms.some((platform) => platform.id === "ch5_dev_moving_platform_001")).toBe(true);
    expect(result.geometry.movingPlatforms.find((platform) => platform.id === "ch5_dev_moving_platform_001")).toMatchObject({
      axis: "horizontal",
      speed: 32,
      fromX: 520,
      toX: 760,
      fromY: 360,
      toY: 360
    });
    expect(levelOneGeometry.movingPlatforms.some((platform) => platform.id === "ch5_dev_moving_platform_001")).toBe(false);
  });

  it("adds elevator platforms from v2 overrides", () => {
    const override = createDevMovingPlatformOverride({
      id: "ch6_dev_elevator_001",
      x: 640,
      y: 420,
      axis: "vertical"
    });
    const result = applyDevLevelOverrides(levelOneGeometry, {
      ...emptyDevLevelOverrides(1),
      addedObjects: [override]
    });

    expect(result.addedObjectIds).toEqual(["ch6_dev_elevator_001"]);
    expect(result.geometry.movingPlatforms.find((platform) => platform.id === "ch6_dev_elevator_001")).toMatchObject({
      axis: "vertical",
      speed: 28,
      fromX: 640,
      toX: 640,
      fromY: 196,
      toY: 420
    });
  });

  it("round trips added moving platform overrides through serialization", () => {
    const serialized = serializeDevLevelOverrides({
      ...emptyDevLevelOverrides(1),
      addedObjects: [
        createDevMovingPlatformOverride({
          id: "ch1_dev_moving_platform_001",
          x: 640,
          y: 360,
          axis: "horizontal",
          speed: 36
        })
      ]
    });
    const parsed = validateDevLevelOverridesFile(JSON.parse(serialized), 1);

    expect(parsed?.addedObjects[0]).toMatchObject({
      id: "ch1_dev_moving_platform_001",
      type: "moving-platform",
      axis: "horizontal",
      speed: 36,
      fromX: 520,
      toX: 760
    });
  });

  it("deletes base static platforms from v2 overrides", () => {
    const result = applyDevLevelOverrides(levelOneGeometry, {
      ...emptyDevLevelOverrides(1),
      deletedObjectIds: ["folder-step"]
    });

    expect(result.deletedObjectIds).toEqual(["folder-step"]);
    expect(result.geometry.platforms.some((platform) => platform.id === "folder-step")).toBe(false);
    expect(levelOneGeometry.platforms.some((platform) => platform.id === "folder-step")).toBe(true);
  });

  it("skips added platforms that are also deleted", () => {
    const result = applyDevLevelOverrides(levelOneGeometry, {
      ...emptyDevLevelOverrides(1),
      addedObjects: [createDevStaticPlatformOverride({ id: "ch1_dev_platform_001", x: 320, y: 416 })],
      deletedObjectIds: ["ch1_dev_platform_001"]
    });

    expect(result.addedObjectIds).toEqual([]);
    expect(result.geometry.platforms.some((platform) => platform.id === "ch1_dev_platform_001")).toBe(false);
  });

  it("warns but continues for unknown deleted ids", () => {
    const result = applyDevLevelOverrides(levelOneGeometry, {
      ...emptyDevLevelOverrides(1),
      deletedObjectIds: ["missing_platform"]
    });

    expect(result.deletedObjectIds).toEqual([]);
    expect(result.warnings.join("\n")).toContain("missing_platform");
  });

  it("warns and skips added duplicate ids", () => {
    const result = applyDevLevelOverrides(levelOneGeometry, {
      ...emptyDevLevelOverrides(1),
      addedObjects: [createDevStaticPlatformOverride({ id: "start-desk", x: 320, y: 416 })]
    });

    expect(result.addedObjectIds).toEqual([]);
    expect(result.warnings.join("\n")).toContain("start-desk");
  });

  it("rejects invalid added moving platforms", () => {
    const parsed = validateDevLevelOverridesFile(
      {
        version: 2,
        levelId: 1,
        addedObjects: [
          {
            id: "bad_mover",
            type: "moving-platform",
            x: 320,
            y: 320,
            width: 192,
            height: 32,
            axis: "diagonal",
            fromX: 320,
            toX: 500,
            fromY: 320,
            toY: 320,
            speed: 32
          },
          {
            id: "zero_path_mover",
            type: "moving-platform",
            x: 320,
            y: 320,
            width: 192,
            height: 32,
            axis: "horizontal",
            fromX: 320,
            toX: 320,
            fromY: 320,
            toY: 320,
            speed: 32
          }
        ]
      },
      1
    );

    expect(parsed?.addedObjects).toEqual([]);
  });

  it("merges resized static platform dimensions by id", () => {
    const overrides = mergeDevLevelOverrideObjects(emptyDevLevelOverrides(1), [
      {
        id: "start-desk",
        type: "platform",
        x: 0,
        y: 610,
        width: 600,
        height: 72
      }
    ]);
    const result = applyDevLevelOverrides(levelOneGeometry, overrides);

    expect(result.appliedObjectIds).toEqual(["start-desk"]);
    expect(result.geometry.platforms[0]).toMatchObject({ width: 600, height: 72 });
    expect(levelOneGeometry.platforms[0]).toMatchObject({ width: 400, height: 58 });
  });

  it("merges static platform labels by id", () => {
    const overrides = mergeDevLevelOverrideObjects(emptyDevLevelOverrides(1), [
      {
        id: "start-desk",
        type: "platform",
        x: 0,
        y: 610,
        width: 560,
        height: 58,
        kind: "desk",
        label: "Inspector label"
      }
    ]);
    const result = applyDevLevelOverrides(levelOneGeometry, overrides);

    expect(result.geometry.platforms[0]).toMatchObject({ label: "Inspector label", kind: "desk" });
  });

  it("merges moving platform anchor overrides by id", () => {
    const overrides = mergeDevLevelOverrideObjects(emptyDevLevelOverrides(8), [
      {
        id: "argument-elevator-one",
        type: "moving-platform",
        x: 852,
        y: 1650,
        width: 260,
        height: 32,
        axis: "vertical",
        fromY: 1422,
        toY: 1650,
        speed: 42
      }
    ]);
    const result = applyDevLevelOverrides(levelEightGeometry, overrides);

    expect(result.appliedObjectIds).toEqual(["argument-elevator-one"]);
    expect(result.geometry.movingPlatforms[0]).toMatchObject({
      x: 852,
      y: 1650,
      fromY: 1422,
      toY: 1650,
      speed: 42
    });
  });

  it("merges moving platform speed and horizontal path overrides by id", () => {
    const overrides = mergeDevLevelOverrideObjects(emptyDevLevelOverrides(8), [
      {
        id: "argument-elevator-one",
        type: "moving-platform",
        x: 820,
        y: 1682,
        width: 260,
        height: 32,
        axis: "horizontal",
        fromX: 780,
        toX: 940,
        fromY: 1682,
        toY: 1682,
        speed: 18
      }
    ]);
    const result = applyDevLevelOverrides(levelEightGeometry, overrides);

    expect(result.appliedObjectIds).toEqual(["argument-elevator-one"]);
    expect(result.geometry.movingPlatforms[0]).toMatchObject({
      axis: "horizontal",
      fromX: 780,
      toX: 940,
      fromY: 1682,
      toY: 1682,
      speed: 18
    });
  });

  it("resizes moving platform overrides while preserving anchors and speed", () => {
    const object: DebugObjectData = {
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

    expect(serializeDebugObjectForOverride(resizeDebugObjectData(object, 40, 8))).toMatchObject({
      id: "argument-elevator-one",
      width: 300,
      height: 40,
      fromY: 1454,
      toY: 1682,
      speed: 42
    });
  });

  it("ignores unknown override ids safely", () => {
    const overrides = mergeDevLevelOverrideObjects(emptyDevLevelOverrides(1), [
      {
        id: "not-in-level",
        type: "platform",
        x: 1,
        y: 2,
        width: 3,
        height: 4
      }
    ]);
    const result = applyDevLevelOverrides(levelOneGeometry, overrides);

    expect(result.appliedObjectIds).toEqual([]);
    expect(result.ignoredObjectIds).toEqual(["not-in-level"]);
  });

  it("delete selected override removes only that object", () => {
    const overrides = mergeDevLevelOverrideObjects(emptyDevLevelOverrides(1), [
      { id: "start-desk", type: "platform", x: 32, y: 444, width: 520, height: 58 },
      { id: "folder-step", type: "platform", x: 900, y: 360, width: 250, height: 34 }
    ]);

    expect(Object.keys(deleteDevLevelOverrideObject(overrides, "start-desk").objects)).toEqual(["folder-step"]);
  });

  it("deleted resize override restores source dimensions on next merge", () => {
    const resized = mergeDevLevelOverrideObjects(emptyDevLevelOverrides(1), [
      { id: "start-desk", type: "platform", x: 0, y: 462, width: 600, height: 72 }
    ]);
    const deleted = deleteDevLevelOverrideObject(resized, "start-desk");
    const result = applyDevLevelOverrides(levelOneGeometry, deleted);

    expect(result.appliedObjectIds).toEqual([]);
    expect(result.geometry.platforms[0]).toMatchObject({ width: 400, height: 58 });
  });

  it("buildOverrideFilePath keeps writes inside the override folder", () => {
    expect(buildOverrideFilePath("C:/project/dev-level-overrides", 4).replaceAll("\\", "/")).toBe(
      "C:/project/dev-level-overrides/level-4.json"
    );
    expect(buildOverrideFilePath("C:/project/dev-level-overrides", 8).replaceAll("\\", "/")).toBe(
      "C:/project/dev-level-overrides/level-8.json"
    );
    expect(buildOverrideFilePath("C:/project/dev-level-overrides", 10).replaceAll("\\", "/")).toBe(
      "C:/project/dev-level-overrides/level-10.json"
    );
    expect(() => buildOverrideFilePath("C:/project/dev-level-overrides", 999)).toThrow("Invalid level id");
  });

  it("keeps baked Chapter 4 overrides archived outside the normal root loader path", () => {
    const rootOverridePath = resolve("dev-level-overrides", "level-5.json");
    const archivedOverridePath = resolve("dev-level-overrides", "archive", "level-5.baked-20260510.json");

    expect(buildOverrideFilePath(resolve("dev-level-overrides"), 5)).toBe(rootOverridePath);
    expect(existsSync(rootOverridePath)).toBe(false);
    expect(existsSync(archivedOverridePath)).toBe(true);
  });

  it("keeps baked Chapter 1 overrides archived outside the normal root loader path", () => {
    const rootOverridePath = resolve("dev-level-overrides", "level-1.json");
    const archivedOverridePath = resolve("dev-level-overrides", "archive", "level-1.baked-20260510.json");

    expect(buildOverrideFilePath(resolve("dev-level-overrides"), 1)).toBe(rootOverridePath);
    expect(existsSync(rootOverridePath)).toBe(false);
    expect(existsSync(archivedOverridePath)).toBe(true);
  });

  it("keeps baked Chapter 6 overrides archived outside the normal root loader path", () => {
    const rootOverridePath = resolve("dev-level-overrides", "level-9.json");
    const archivedOverridePath = resolve("dev-level-overrides", "archive", "level-9.baked-20260510.json");

    expect(buildOverrideFilePath(resolve("dev-level-overrides"), 9)).toBe(rootOverridePath);
    expect(existsSync(rootOverridePath)).toBe(false);
    expect(existsSync(archivedOverridePath)).toBe(true);
  });

  it("keeps baked Chapter 5 overrides archived outside the normal root loader path", () => {
    const rootOverridePath = resolve("dev-level-overrides", "level-6.json");
    const archivedOverridePath = resolve("dev-level-overrides", "archive", "level-6.baked-20260510.json");

    expect(buildOverrideFilePath(resolve("dev-level-overrides"), 6)).toBe(rootOverridePath);
    expect(existsSync(rootOverridePath)).toBe(false);
    expect(existsSync(archivedOverridePath)).toBe(true);
  });

  it("keeps every active baked chapter override archived outside the normal root loader path", () => {
    const activeBakeArchives = [
      [1, "level-1.baked-20260510.json"],
      [2, "level-2.baked-20260510.json"],
      [4, "level-4.baked-20260510.json"],
      [5, "level-5.baked-20260510.json"],
      [6, "level-6.baked-20260510.json"],
      [9, "level-9.baked-20260510.json"]
    ] as const;

    for (const [levelId, archiveName] of activeBakeArchives) {
      const rootOverridePath = resolve("dev-level-overrides", `level-${levelId}.json`);
      const archivedOverridePath = resolve("dev-level-overrides", "archive", archiveName);

      expect(buildOverrideFilePath(resolve("dev-level-overrides"), levelId)).toBe(rootOverridePath);
      expect(existsSync(rootOverridePath), `root override for active level ${levelId}`).toBe(false);
      expect(existsSync(archivedOverridePath), `archived override for active level ${levelId}`).toBe(true);
    }
  });

  it("keeps remaining root override files limited to legacy dev-only runtime levels", () => {
    const rootOverrideFiles = readdirSync(resolve("dev-level-overrides"), { withFileTypes: true })
      .filter((entry) => entry.isFile() && /^level-\d+\.json$/.test(entry.name))
      .map((entry) => entry.name)
      .sort();

    expect(rootOverrideFiles).toEqual(["level-10.json", "level-3.json", "level-8.json"]);
  });

  it("snaps values and platform rectangles to the grid", () => {
    expect(snapValue(47, 32)).toBe(32);
    expect(snapValue(49, 32)).toBe(64);
    expect(snapRect({ x: 47, y: 49, width: 157, height: 31 }, 32)).toMatchObject({
      x: 32,
      y: 64,
      width: 160,
      height: 32
    });
  });

  it("creates added static platform overrides with optional snap", () => {
    expect(createDevStaticPlatformOverride({ id: "ch1_dev_platform_001", x: 47, y: 49, snap: true })).toMatchObject({
      id: "ch1_dev_platform_001",
      type: "platform",
      kind: "paper",
      x: 32,
      y: 64,
      width: 160,
      height: 32
    });
  });

  it("generates unique chapter-prefixed and fallback platform ids", () => {
    expect(
      generateDevPlatformId({
        levelId: 1,
        chapterId: 1,
        existingIds: ["ch1_dev_platform_001"]
      })
    ).toBe("ch1_dev_platform_002");
    expect(generateDevPlatformId({ levelId: 9, chapterId: null, existingIds: [] })).toBe("level9_dev_platform_001");
  });

  it("generates unique moving platform and elevator ids", () => {
    expect(
      generateDevMovingPlatformId({
        levelId: 6,
        chapterId: 5,
        existingIds: ["ch5_dev_moving_platform_001"],
        variant: "moving-platform"
      })
    ).toBe("ch5_dev_moving_platform_002");
    expect(
      generateDevMovingPlatformId({
        levelId: 9,
        chapterId: 6,
        existingIds: ["ch6_dev_elevator_001"],
        variant: "elevator"
      })
    ).toBe("ch6_dev_elevator_002");
    expect(generateDevMovingPlatformId({ levelId: 8, chapterId: null, existingIds: [], variant: "elevator" })).toBe(
      "level8_dev_elevator_001"
    );
  });

  it("creates moving platform and elevator overrides with snap", () => {
    expect(createDevMovingPlatformOverride({ id: "move", x: 657, y: 369, axis: "horizontal", snap: true })).toMatchObject({
      id: "move",
      type: "moving-platform",
      x: 672,
      y: 384,
      width: 192,
      height: 32,
      axis: "horizontal",
      fromX: 544,
      toX: 800,
      fromY: 384,
      toY: 384,
      speed: 32
    });
    expect(createDevMovingPlatformOverride({ id: "lift", x: 657, y: 433, axis: "vertical", snap: true })).toMatchObject({
      id: "lift",
      type: "moving-platform",
      x: 672,
      y: 448,
      axis: "vertical",
      fromX: 672,
      toX: 672,
      fromY: 224,
      toY: 448,
      speed: 28
    });
  });

  it("parses inspector numeric fields safely", () => {
    expect(parseInspectorNumber("42", "x")).toEqual({ ok: true, value: 42 });
    expect(parseInspectorNumber("", "x")).toMatchObject({ ok: false });
    expect(parseInspectorNumber("nope", "x")).toMatchObject({ ok: false });
    expect(parseInspectorNumber("0", "width", { positive: true })).toMatchObject({ ok: false });
  });

  it("parses inspector rectangles with optional snap", () => {
    expect(
      parseInspectorRectValues(
        {
          x: "47",
          y: "49",
          width: "157",
          height: "31"
        },
        { includeSize: true, snap: true, gridSize: 32 }
      )
    ).toEqual({
      ok: true,
      rect: {
        x: 32,
        y: 64,
        width: 160,
        height: 32
      }
    });

    expect(parseInspectorRectValues({ x: "47", y: "49" }, { snap: false })).toEqual({
      ok: true,
      rect: {
        x: 47,
        y: 49
      }
    });
  });

  it("parses valid moving platform inspector values", () => {
    const parsed = parseMovingPlatformInspectorValues(
      {
        axis: "vertical",
        speed: "22",
        fromX: "320",
        toX: "320",
        fromY: "448",
        toY: "608"
      },
      { x: 320, y: 448, width: 260, height: 32 },
      { worldWidth: 1200, worldHeight: 900 }
    );

    expect(parsed).toMatchObject({
      ok: true,
      fields: {
        axis: "vertical",
        speed: 22,
        fromX: 320,
        toX: 320,
        fromY: 448,
        toY: 608
      }
    });
  });

  it("rejects invalid moving platform path values", () => {
    expect(
      parseMovingPlatformInspectorValues(
        { axis: "diagonal", speed: "22", fromX: "0", toX: "120", fromY: "0", toY: "0" },
        { x: 0, y: 0, width: 260, height: 32 }
      )
    ).toMatchObject({ ok: false });

    expect(
      parseMovingPlatformInspectorValues(
        { axis: "horizontal", speed: "0", fromX: "0", toX: "120", fromY: "0", toY: "0" },
        { x: 0, y: 0, width: 260, height: 32 }
      )
    ).toMatchObject({ ok: false });

    expect(
      parseMovingPlatformInspectorValues(
        { axis: "horizontal", speed: "22", fromX: "40", toX: "44", fromY: "0", toY: "0" },
        { x: 0, y: 0, width: 260, height: 32 }
      )
    ).toMatchObject({ ok: false });
  });

  it("snaps moving platform endpoints and warns outside world bounds", () => {
    const parsed = parseMovingPlatformInspectorValues(
      {
        axis: "horizontal",
        speed: "18",
        fromX: "-5",
        toX: "143",
        fromY: "49",
        toY: "49"
      },
      { x: 0, y: 49, width: 260, height: 32 },
      { snap: true, gridSize: 32, worldWidth: 360, worldHeight: 160 }
    );

    expect(parsed).toMatchObject({
      ok: true,
      fields: {
        fromX: 0,
        toX: 128,
        fromY: 64,
        toY: 64
      }
    });
    expect(parsed.ok && parsed.fields.warning).toContain("outside world bounds");
  });

  it("measures moving platform path length by axis", () => {
    expect(getMovingPlatformPathLength({ axis: "horizontal", fromX: 10, toX: 90, fromY: 20, toY: 20 })).toBe(80);
    expect(getMovingPlatformPathLength({ axis: "vertical", fromX: 10, toX: 10, fromY: 20, toY: 92 })).toBe(72);
  });

  it("validates supported and unsupported selected clues", () => {
    const supportedClue: DebugObjectData = { id: "clue", type: "exhibit", levelId: 1, x: 990, y: 432, width: 72, height: 72, editable: true };
    const unsupportedClue: DebugObjectData = {
      id: "floating-clue",
      type: "exhibit",
      levelId: 1,
      x: 500,
      y: 80,
      width: 72,
      height: 72,
      editable: true
    };
    const supported = validateDebugObjectSupport(supportedClue, levelOneGeometry);
    const unsupported = validateDebugObjectSupport(unsupportedClue, levelOneGeometry);

    expect(supported).toMatchObject({ status: "ok", supported: true });
    expect(unsupported).toMatchObject({ status: "warning", supported: false });
  });

  it("validates exit support and outside-world errors", () => {
    const supportedExitObject: DebugObjectData = { id: "exit", type: "exit", levelId: 1, x: 3410, y: 510, width: 76, height: 110, editable: true };
    const outsideWorldObject: DebugObjectData = {
      id: "bad-exit",
      type: "exit",
      levelId: 1,
      x: 99999,
      y: 394,
      width: 96,
      height: 132,
      editable: true
    };
    const supportedExit = validateDebugObjectSupport(supportedExitObject, levelOneGeometry);
    const outsideWorld = validateDebugObjectSupport(outsideWorldObject, levelOneGeometry);

    expect(supportedExit).toMatchObject({ status: "ok", supported: true });
    expect(outsideWorld.status).toBe("error");
    expect(outsideWorld.messages.join(" ")).toContain("outside world bounds");
  });

  it("validates checkpoint respawn support separately from the trigger", () => {
    const supportedCheckpoint: DebugObjectData = {
      id: "midpoint-checkpoint",
      type: "checkpoint",
      levelId: 1,
      x: 1410,
      y: 520,
      width: 120,
      height: 140,
      editable: true,
      respawnX: 1470,
      respawnY: 316
    };
    const unsupportedCheckpoint: DebugObjectData = {
      id: "bad-checkpoint",
      type: "checkpoint",
      levelId: 1,
      x: 1410,
      y: 520,
      width: 120,
      height: 140,
      editable: true,
      respawnX: 500,
      respawnY: 80
    };
    const supported = validateCheckpointRespawnSupport(supportedCheckpoint, levelOneGeometry);
    const unsupported = validateCheckpointRespawnSupport(unsupportedCheckpoint, levelOneGeometry);

    expect(supported).toMatchObject({ status: "ok", supported: true });
    expect(unsupported).toMatchObject({ status: "warning", supported: false });
  });

  it("reports level-wide duplicate and missing ids", () => {
    const geometry = cloneGeometryForTest(levelOneGeometry);
    geometry.platforms[1].id = "start-desk";
    geometry.platforms[2].id = "";

    const summary = validatePlatformerGeometry(geometry);

    expect(summary.errors).toBeGreaterThanOrEqual(3);
    expect(summary.issues.some((issue) => issue.category === "ids" && issue.message.includes("Duplicate object id: start-desk"))).toBe(true);
    expect(summary.issues.some((issue) => issue.category === "ids" && issue.message.includes("missing an id"))).toBe(true);
  });

  it("reports invalid dimensions and out-of-bounds objects", () => {
    const geometry = cloneGeometryForTest(levelOneGeometry);
    geometry.platforms[0].width = 0;
    geometry.exit.x = geometry.worldWidth + 20;

    const summary = validatePlatformerGeometry(geometry);

    expect(summary.issues.some((issue) => issue.category === "dimensions" && issue.objectId === "start-desk")).toBe(true);
    expect(summary.issues.some((issue) => issue.category === "bounds" && issue.objectId === "case-door")).toBe(true);
  });

  it("reports unsupported and supported clues and exits at level scope", () => {
    const supported = validatePlatformerGeometry(levelOneGeometry);
    const unsupported = cloneGeometryForTest(levelOneGeometry);
    unsupported.exhibits[0].x = 500;
    unsupported.exhibits[0].y = 80;
    unsupported.exit.x = 500;
    unsupported.exit.y = 80;
    const unsupportedSummary = validatePlatformerGeometry(unsupported);

    expect(supported.issues.some((issue) => issue.objectId === "sealed-envelope" && issue.category === "support")).toBe(false);
    expect(unsupportedSummary.issues.some((issue) => issue.objectId === "sealed-envelope" && issue.category === "support")).toBe(true);
    expect(unsupportedSummary.issues.some((issue) => issue.objectId === "case-door" && issue.category === "exit")).toBe(true);
  });

  it("reports unsupported checkpoint respawns at level scope", () => {
    const geometry = cloneGeometryForTest(levelOneGeometry);
    geometry.checkpoints[0].respawnX = 500;
    geometry.checkpoints[0].respawnY = 80;

    const summary = validatePlatformerGeometry(geometry);

    expect(summary.issues.some((issue) => issue.objectId === "midpoint-checkpoint" && issue.objectType === "checkpoint-respawn")).toBe(true);
  });

  it("reports invalid moving platform paths and mobile comfort warnings", () => {
    const geometry = cloneGeometryForTest(levelEightGeometry);
    geometry.movingPlatforms[0].speed = 0;
    geometry.movingPlatforms[0].fromY = 1600;
    geometry.movingPlatforms[0].toY = 1600;
    geometry.movingPlatforms[1].width = 64;
    geometry.movingPlatforms[1].speed = 90;

    const summary = validatePlatformerGeometry(geometry);

    expect(summary.issues.some((issue) => issue.objectId === "argument-elevator-one" && issue.severity === "error")).toBe(true);
    expect(summary.issues.some((issue) => issue.objectId === "argument-elevator-two" && issue.message.includes("narrow"))).toBe(true);
    expect(summary.issues.some((issue) => issue.objectId === "argument-elevator-two" && issue.message.includes("too fast"))).toBe(true);
  });

  it("reports stale deleted override ids when override context is available", () => {
    const summary = validatePlatformerGeometry(levelOneGeometry, {
      baseGeometry: levelOneGeometry,
      overrides: {
        ...emptyDevLevelOverrides(1),
        deletedObjectIds: ["missing-platform"]
      }
    });

    expect(summary.issues.some((issue) => issue.category === "ids" && issue.objectId === "missing-platform")).toBe(true);
  });

  it("describes selected dev object status for inspector display", () => {
    expect(describeDevObjectStatus({ source: "base", dirty: false, hasSavedOverride: false })).toBe("clean");
    expect(describeDevObjectStatus({ source: "base", dirty: true, hasSavedOverride: true })).toBe("dirty unsaved");
    expect(describeDevObjectStatus({ source: "added", dirty: false, hasSavedOverride: true })).toBe("added saved");
    expect(describeDevObjectStatus({ source: "added", dirty: true, hasSavedOverride: false })).toBe("added unsaved");
  });
});

function cloneGeometryForTest<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
