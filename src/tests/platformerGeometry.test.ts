import { describe, expect, it } from "vitest";
import {
  levelEightGeometry,
  levelFiveGeometry,
  levelFourGeometry,
  levelNineGeometry,
  levelOneGeometry,
  levelSevenGeometry,
  levelSixGeometry,
  levelTenGeometry,
  levelThreeGeometry,
  levelTwoGeometry
} from "../game/platformer/levelGeometry";
import { levels } from "../content/levels";
import { GRAVITY_Y, JUMP_SPEED, PLAYER_HEIGHT, PLAYER_WIDTH } from "../game/platformer/constants";
import { validatePlatformerGeometry } from "../game/debug/devLevelEditorUtils";
import { getActiveChapterFlow } from "../game/systems/ChapterBridge";

type RectLike = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const getPlatformVerticalSpread = (platforms: { y: number }[]) => {
  const yValues = platforms.map((platform) => platform.y);
  return Math.max(...yValues) - Math.min(...yValues);
};

const getTraversalVerticalSpread = (geometry: {
  platforms: { y: number }[];
  movingPlatforms: { y: number }[];
  rebuildGroups: Array<{ platforms: { y: number }[] }>;
  lightRevealGroups: Array<{ platforms: { y: number }[] }>;
}) =>
  getPlatformVerticalSpread([
    ...geometry.platforms,
    ...geometry.movingPlatforms,
    ...geometry.rebuildGroups.flatMap((group) => group.platforms),
    ...geometry.lightRevealGroups.flatMap((group) => group.platforms),
  ]);

const getSafeSupportPlatforms = (geometry: {
  platforms: RectLike[];
  rebuildGroups: Array<{ platforms: RectLike[] }>;
  lightRevealGroups: Array<{ platforms: RectLike[] }>;
}) => [
  ...geometry.platforms,
  ...geometry.rebuildGroups.flatMap((group) => group.platforms),
  ...geometry.lightRevealGroups.flatMap((group) => group.platforms),
];

const hasSafeStaticSupport = (
  rect: RectLike,
  platforms: RectLike[],
  options: { horizontalMargin?: number; maxVerticalGap?: number } = {},
) => {
  const horizontalMargin = options.horizontalMargin ?? 40;
  const maxVerticalGap = options.maxVerticalGap ?? 70;
  const rectBottom = rect.y + rect.height;
  const rectCenterX = rect.x + rect.width / 2;

  return platforms.some((platform) => {
    const platformTop = platform.y;
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;
    const hasHorizontalSupport =
      rect.x < platformRight + horizontalMargin &&
      rect.x + rect.width > platformLeft - horizontalMargin &&
      rectCenterX >= platformLeft - horizontalMargin &&
      rectCenterX <= platformRight + horizontalMargin;
    const verticalGap = platformTop - rectBottom;

    return hasHorizontalSupport && verticalGap >= -8 && verticalGap <= maxVerticalGap;
  });
};

const playerRectAt = (x: number, y: number): RectLike => ({
  x: x - PLAYER_WIDTH / 2,
  y: y - PLAYER_HEIGHT / 2,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
});

const LEGACY_DEV_ROUTE_MINIMUM_HEADROOM = 62;

describe("Active six-chapter authored platformer routes", () => {
  it("gives every active chapter a vertical or direction-change traversal beat", () => {
    const activeChapterBeats = [
      { geometry: levelOneGeometry, expectedIds: ["ch1_bookcase_upper"] },
      { geometry: levelTwoGeometry, expectedIds: ["ch2_wall_lift"] },
      { geometry: levelFourGeometry, expectedIds: ["ch3_bridge_upper_beam", "ch3_shadow_bank_drop"] },
      { geometry: levelFiveGeometry, expectedIds: ["ch4_lower_file_aisle", "ch4_return_file_stack"] },
      { geometry: levelSixGeometry, expectedIds: ["ch5_dev_elevator_001", "ch5_court_balcony_01"] },
      { geometry: levelNineGeometry, expectedIds: ["ch6_rooftop_climb_high", "ch6_elevator_01"] }
    ];

    for (const { geometry, expectedIds } of activeChapterBeats) {
      const platformIds = new Set([
        ...geometry.platforms.map((platform) => platform.id),
        ...geometry.movingPlatforms.map((platform) => platform.id)
      ]);

      expect(getPlatformVerticalSpread(geometry.platforms)).toBeGreaterThanOrEqual(120);
      expect(expectedIds.every((id) => platformIds.has(id))).toBe(true);
    }
  });

  it("keeps the rebuilt platformer set paced as six authored mini-levels", () => {
    const activeChapterQA = [
      {
        label: "Chapter 1",
        levelId: 1,
        geometry: levelOneGeometry,
        target: { min: 75, max: 105 },
        minVerticalSpread: 250,
        minCheckpoints: 2,
        routeIds: ["ch1_bookcase_upper", "ch1_shelf_descent", "ch1_case_file_desk"],
      },
      {
        label: "Chapter 2",
        levelId: 2,
        geometry: levelTwoGeometry,
        target: { min: 105, max: 135 },
        minVerticalSpread: 220,
        minCheckpoints: 3,
        routeIds: ["ch2_rebuilt_street_start", "ch2_wall_lift", "ch2_river_mark_ledge"],
      },
      {
        label: "Chapter 3",
        levelId: 4,
        geometry: levelFourGeometry,
        target: { min: 90, max: 120 },
        minVerticalSpread: 300,
        minCheckpoints: 3,
        routeIds: ["drifting-paper-one", "ch3_bridge_upper_beam", "ch3_shadow_bank_drop"],
      },
      {
        label: "Chapter 4",
        levelId: 5,
        geometry: levelFiveGeometry,
        target: { min: 105, max: 135 },
        minVerticalSpread: 360,
        minCheckpoints: 3,
        routeIds: ["ch4_file_cabinet_climb_high", "ch4_drawer_lift", "ch4_silver_key_landing"],
      },
      {
        label: "Chapter 5",
        levelId: 6,
        geometry: levelSixGeometry,
        target: { min: 120, max: 150 },
        minVerticalSpread: 520,
        minCheckpoints: 4,
        routeIds: ["ch5_trust_door_threshold", "ch5_elevator_02", "ch5_blue_ribbon_pages"],
      },
      {
        label: "Chapter 6",
        levelId: 9,
        geometry: levelNineGeometry,
        target: { min: 120, max: 150 },
        minVerticalSpread: 600,
        minCheckpoints: 4,
        routeIds: ["ch6_rooftop_climb_high", "ch6_elevator_02", "ch6_final_court_landing"],
      },
    ];

    for (const chapter of activeChapterQA) {
      const level = levels.find((candidate) => candidate.id === chapter.levelId);
      const platformIds = new Set([
        ...chapter.geometry.platforms.map((platform) => platform.id),
        ...chapter.geometry.movingPlatforms.map((platform) => platform.id),
      ]);

      expect(level?.targetDurationSeconds, `${chapter.label} pacing metadata`).toEqual(chapter.target);
      expect(getTraversalVerticalSpread(chapter.geometry), `${chapter.label} vertical spread`).toBeGreaterThanOrEqual(
        chapter.minVerticalSpread,
      );
      expect(chapter.geometry.checkpoints.length, `${chapter.label} checkpoint count`).toBeGreaterThanOrEqual(
        chapter.minCheckpoints,
      );
      expect(chapter.routeIds.every((id) => platformIds.has(id)), `${chapter.label} authored route markers`).toBe(true);
      expect(chapter.geometry.exit.targetScene, `${chapter.label} platformer exit`).toBe("PuzzleScene");
    }
  });

  it("keeps active chapter exits and checkpoint respawns on safe support", () => {
    const activeGeometries = [
      { label: "Chapter 1", geometry: levelOneGeometry },
      { label: "Chapter 2", geometry: levelTwoGeometry },
      { label: "Chapter 3", geometry: levelFourGeometry },
      { label: "Chapter 4", geometry: levelFiveGeometry },
      { label: "Chapter 5", geometry: levelSixGeometry },
      { label: "Chapter 6", geometry: levelNineGeometry },
    ];

    for (const { label, geometry } of activeGeometries) {
      const supportPlatforms = getSafeSupportPlatforms(geometry);

      expect(hasSafeStaticSupport(geometry.exit, supportPlatforms, { maxVerticalGap: 16 }), `${label} exit support`).toBe(
        true,
      );

      for (const checkpoint of geometry.checkpoints) {
        expect(
          hasSafeStaticSupport(
            playerRectAt(checkpoint.respawnX, checkpoint.respawnY),
            supportPlatforms,
          ),
          `${label} checkpoint ${checkpoint.id} support`,
        ).toBe(true);
      }
    }
  });

  it("keeps every baked active chapter validation-clean without root overrides", () => {
    const activeGeometries = [
      { label: "Chapter 1", chapterId: 1, geometry: levelOneGeometry },
      { label: "Chapter 2", chapterId: 2, geometry: levelTwoGeometry },
      { label: "Chapter 3", chapterId: 3, geometry: levelFourGeometry },
      { label: "Chapter 4", chapterId: 4, geometry: levelFiveGeometry },
      { label: "Chapter 5", chapterId: 5, geometry: levelSixGeometry },
      { label: "Chapter 6", chapterId: 6, geometry: levelNineGeometry },
    ];

    for (const { label, chapterId, geometry } of activeGeometries) {
      const validation = validatePlatformerGeometry(geometry, { activeChapterId: chapterId });

      expect(validation.errors, `${label} validation errors`).toBe(0);
      expect(validation.warnings, `${label} validation warnings`).toBe(0);
    }
  });

  it("keeps rebuilt moving and elevator platform beats wide and forgiving", () => {
    const movingAudits = [
      { label: "Chapter 2 tram and wall lift", geometry: levelTwoGeometry, minMovingPlatforms: 3, minWidth: 170 },
      { label: "Chapter 3 drifting papers", geometry: levelFourGeometry, minMovingPlatforms: 3, minWidth: 260 },
      { label: "Chapter 4 drawer route", geometry: levelFiveGeometry, minMovingPlatforms: 2, minWidth: 128 },
      { label: "Chapter 5 courthouse elevators", geometry: levelSixGeometry, minMovingPlatforms: 4, minWidth: 112 },
      { label: "Chapter 6 floating court elevators", geometry: levelNineGeometry, minMovingPlatforms: 2, minWidth: 70 },
    ];

    for (const { label, geometry, minMovingPlatforms, minWidth } of movingAudits) {
      expect(geometry.movingPlatforms.length, `${label} count`).toBeGreaterThanOrEqual(minMovingPlatforms);

      for (const movingPlatform of geometry.movingPlatforms) {
        const axis = movingPlatform.axis ?? "horizontal";
        const fromX = movingPlatform.fromX ?? movingPlatform.x;
        const toX = movingPlatform.toX ?? movingPlatform.x;
        const fromY = movingPlatform.fromY ?? movingPlatform.y;
        const toY = movingPlatform.toY ?? movingPlatform.y;

        expect(movingPlatform.width, `${movingPlatform.id} width`).toBeGreaterThanOrEqual(minWidth);
        expect(movingPlatform.speed, `${movingPlatform.id} speed`).toBeLessThanOrEqual(34);
        expect(movingPlatform.speed, `${movingPlatform.id} speed`).toBeGreaterThan(0);

        if (axis === "vertical") {
          expect(Math.abs(toY - fromY), `${movingPlatform.id} vertical travel`).toBeGreaterThan(0);
        } else {
          expect(Math.abs(toX - fromX), `${movingPlatform.id} horizontal travel`).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("Level 1 platformer geometry", () => {
  it("exists for the first playable vertical slice", () => {
    expect(levelOneGeometry.levelId).toBe(1);
    expect(levelOneGeometry.title).toBe("The Envelope at the Kancelaria");
  });

  it("has one required exhibit", () => {
    expect(levelOneGeometry.exhibits.filter((exhibit) => exhibit.required)).toHaveLength(1);
    expect(levelOneGeometry.exhibits[0].name).toBe("The Sealed Envelope");
  });

  it("has at least one checkpoint", () => {
    expect(levelOneGeometry.checkpoints.length).toBeGreaterThanOrEqual(1);
  });

  it("is expanded into a complete opening chapter with a route-awakening handoff", () => {
    const hintCopy = levelOneGeometry.tutorialHints.map((hint) => hint.text).join(" ");
    const decorationIds = levelOneGeometry.decorations.map((decoration) => decoration.id);
    const platformIds = levelOneGeometry.platforms.map((platform) => platform.id);

    expect(levelOneGeometry.worldWidth).toBeGreaterThanOrEqual(2600);
    expect(levelOneGeometry.checkpoints.length).toBeGreaterThanOrEqual(2);
    expect(hintCopy).toContain("brass key");
    expect(hintCopy).toContain("tram ticket");
    expect(hintCopy).toContain("route begins to glow");
    expect(decorationIds).toEqual(expect.arrayContaining([
      "ch1_brass_key_glow_01",
      "ch1_tram_ticket_glow_01",
      "ch1_route_line_01",
    ]));
    expect(platformIds).toEqual(expect.arrayContaining([
      "ch1_bookcase_upper",
      "ch1_upper_shelf_return",
      "ch1_shelf_descent",
      "ch1_case_file_desk",
    ]));
    expect(levelOneGeometry.platforms.some((platform) => platform.id.startsWith("ch1_route_marker"))).toBe(true);
    expect(getPlatformVerticalSpread(levelOneGeometry.platforms)).toBeGreaterThanOrEqual(250);
  });

  it("keeps the Bake-4 Chapter 1 layout canonical without the dev override", () => {
    const platformsById = new Map(levelOneGeometry.platforms.map((platform) => [platform.id, platform]));
    const checkpointsById = new Map(levelOneGeometry.checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
    const tutorialElevator = levelOneGeometry.movingPlatforms.find((platform) => platform.id === "ch1_dev_elevator_001");
    const sealedEnvelope = levelOneGeometry.exhibits.find((exhibit) => exhibit.id === "sealed-envelope");
    const validation = validatePlatformerGeometry(levelOneGeometry, { activeChapterId: 1 });

    expect(platformsById.get("start-desk")).toMatchObject({ width: 400 });
    expect(platformsById.get("paper-stack-1")).toMatchObject({ width: 148 });
    expect(platformsById.get("folder-step")).toMatchObject({ width: 210 });
    expect(platformsById.get("ch1_bookcase_mid")).toMatchObject({ x: 1040, y: 450, width: 210 });
    expect(platformsById.get("ch1_bookcase_upper")).toMatchObject({ x: 1280, y: 370, width: 150 });
    expect(platformsById.get("evidence-paper")).toMatchObject({ x: 1619, y: 197, width: 240 });
    expect(platformsById.get("ch1_upper_shelf_return")).toMatchObject({ x: 1940, y: 360, width: 230 });
    expect(platformsById.get("ch1_shelf_descent")).toMatchObject({ x: 2260, y: 450, width: 210 });
    expect(platformsById.get("mid-desk")).toMatchObject({ x: 2520, y: 530, width: 110 });
    expect(platformsById.get("ch1_case_file_desk")).toMatchObject({ x: 2770, y: 610, width: 200 });
    expect(platformsById.get("ch1_route_marker_01")).toMatchObject({ x: 3049, y: 569, width: 160, height: 28 });
    expect(tutorialElevator).toMatchObject({
      axis: "vertical",
      x: 1466,
      y: 357,
      width: 102,
      height: 18,
      fromX: 1466,
      toX: 1466,
      fromY: 233,
      toY: 357,
      speed: 28
    });
    expect(sealedEnvelope).toMatchObject({ x: 1998, y: 261 });
    expect(checkpointsById.get("midpoint-checkpoint")).toMatchObject({ x: 1327, y: 300, respawnX: 1367, respawnY: 316 });
    expect(checkpointsById.get("ch1-route-checkpoint")).toMatchObject({ x: 2540, y: 450, respawnX: 2580, respawnY: 466 });
    expect(levelOneGeometry.exit).toMatchObject({ targetScene: "PuzzleScene", targetLevelId: 1 });
    expect(validation.errors).toBe(0);
    expect(validation.warnings).toBe(0);
  });

  it("keeps every required Chapter 1 object on or beside safe static support", () => {
    const requiredEnvelope = levelOneGeometry.exhibits.find((exhibit) => exhibit.required);

    expect(requiredEnvelope).toBeDefined();
    expect(hasSafeStaticSupport(requiredEnvelope!, levelOneGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(levelOneGeometry.exit, levelOneGeometry.platforms, { maxVerticalGap: 12 })).toBe(true);

    for (const checkpoint of levelOneGeometry.checkpoints) {
      expect(
        hasSafeStaticSupport(
          playerRectAt(checkpoint.respawnX, checkpoint.respawnY),
          levelOneGeometry.platforms,
        ),
      ).toBe(true);
    }
  });

  it("keeps the Chapter 1 route on the active Case Mosaic puzzle", () => {
    expect(getActiveChapterFlow(1)).toMatchObject({
      platformerLevelId: 1,
      puzzleLevelId: 1,
      completionLevelId: 1,
    });
  });

  it("has one exit targeting the Level 1 puzzle placeholder", () => {
    expect(levelOneGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelOneGeometry.exit.targetLevelId).toBe(1);
  });

  it("has a player spawn and positive world dimensions", () => {
    expect(levelOneGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelOneGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelOneGeometry.worldWidth).toBeGreaterThan(0);
    expect(levelOneGeometry.worldHeight).toBeGreaterThan(0);
  });

  it("has valid platform dimensions", () => {
    for (const platform of levelOneGeometry.platforms) {
      expect(platform.width).toBeGreaterThan(0);
      expect(platform.height).toBeGreaterThan(0);
      expect(platform.x).toBeGreaterThanOrEqual(0);
      expect(platform.y).toBeGreaterThanOrEqual(0);
    }
  });

  it("keeps Level 1 target duration in the final gift range", () => {
    const levelOne = levels.find((level) => level.id === 1);

    expect(levelOne?.targetDurationSeconds).toEqual({ min: 75, max: 105 });
  });
});

describe("Level 2 platformer geometry", () => {
  it("exists for The Tram of Deadlines", () => {
    expect(levelTwoGeometry.levelId).toBe(2);
    expect(levelTwoGeometry.title).toBe("The Tram of Deadlines");
  });

  it("has a player spawn and positive world dimensions", () => {
    expect(levelTwoGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelTwoGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelTwoGeometry.worldWidth).toBeGreaterThan(0);
    expect(levelTwoGeometry.worldHeight).toBeGreaterThan(0);
  });

  it("has at least one checkpoint", () => {
    expect(levelTwoGeometry.checkpoints.length).toBeGreaterThanOrEqual(1);
  });

  it("is expanded into a tram-to-hidden-wall chapter route", () => {
    const hintCopy = levelTwoGeometry.tutorialHints.map((hint) => hint.text).join(" ");
    const decorationIds = levelTwoGeometry.decorations.map((decoration) => decoration.id);
    const platformIds = levelTwoGeometry.platforms.map((platform) => platform.id);

    expect(levelTwoGeometry.worldWidth).toBeGreaterThanOrEqual(3600);
    expect(levelTwoGeometry.checkpoints.length).toBeGreaterThanOrEqual(3);
    expect(platformIds).toEqual(expect.arrayContaining([
      "ch2_rebuilt_street_start",
      "ch2_scaffold_climb_mid",
      "ch2_hidden_wall_floor",
      "ch2_wall_descent_step",
      "ch2_river_mark_ledge",
    ]));
    expect(platformIds).not.toContain("ch2_overhead_route");
    expect(platformIds).not.toContain("ch2_upper_wall_crossing");
    expect(decorationIds).toEqual(expect.arrayContaining([
      "ch2_keyhole_shadow",
      "ch2_red_brick_marker",
      "ch2_vistula_wave_mark",
    ]));
    expect(hintCopy).toContain("stamp");
    expect(hintCopy).toContain("key from the envelope");
    expect(hintCopy).toContain("river");
    expect(getTraversalVerticalSpread(levelTwoGeometry)).toBeGreaterThanOrEqual(220);
  });

  it("has exactly one required Golden Stamp exhibit", () => {
    const requiredExhibits = levelTwoGeometry.exhibits.filter((exhibit) => exhibit.required);

    expect(requiredExhibits).toHaveLength(1);
    expect(requiredExhibits[0]?.name).toBe("The Golden Stamp");
  });

  it("has at least two valid horizontal moving tram platforms", () => {
    const horizontalTramPlatforms = levelTwoGeometry.movingPlatforms.filter((platform) =>
      (platform.axis ?? "horizontal") === "horizontal"
    );

    expect(horizontalTramPlatforms.length).toBeGreaterThanOrEqual(2);

    for (const platform of horizontalTramPlatforms) {
      expect(platform.width).toBeGreaterThan(0);
      expect(platform.height).toBeGreaterThan(0);
      expect(platform.axis ?? "horizontal").toBe("horizontal");
      expect(platform.toX ?? platform.x).toBeGreaterThan(platform.fromX ?? platform.x);
      expect(platform.speed).toBeGreaterThan(0);
    }
  });

  it("adds a wide vertical hidden-wall lift for the authored wall reveal", () => {
    const wallLift = levelTwoGeometry.movingPlatforms.find((platform) => platform.id === "ch2_wall_lift");

    expect(wallLift).toBeDefined();
    expect(wallLift).toMatchObject({
      axis: "vertical",
      width: 320,
      speed: 20,
      fromY: 500,
      toY: 720
    });
  });

  it("keeps every required Chapter 2 clue, keyhole, checkpoint, and exit supported", () => {
    const requiredStamp = levelTwoGeometry.exhibits.find((exhibit) => exhibit.required);
    const keyholeTrigger = levelTwoGeometry.rebuildGroups.find((group) => group.id === "ch2_hidden_wall_route")?.trigger;
    const redBrickMarker = levelTwoGeometry.decorations.find((decoration) => decoration.id === "ch2_red_brick_marker");
    const waveMark = levelTwoGeometry.decorations.find((decoration) => decoration.id === "ch2_vistula_wave_mark");
    const supportPlatforms = [
      ...levelTwoGeometry.platforms,
      ...levelTwoGeometry.rebuildGroups.flatMap((group) => group.platforms),
    ];

    expect(requiredStamp).toBeDefined();
    expect(keyholeTrigger).toBeDefined();
    expect(redBrickMarker).toBeDefined();
    expect(waveMark).toBeDefined();
    expect(hasSafeStaticSupport(requiredStamp!, levelTwoGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(keyholeTrigger!, levelTwoGeometry.platforms, { maxVerticalGap: 20 })).toBe(true);
    expect(hasSafeStaticSupport(redBrickMarker!, supportPlatforms, { maxVerticalGap: 44 })).toBe(true);
    expect(hasSafeStaticSupport(waveMark!, levelTwoGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(levelTwoGeometry.exit, levelTwoGeometry.platforms, { maxVerticalGap: 12 })).toBe(true);

    for (const checkpoint of levelTwoGeometry.checkpoints) {
      expect(
        hasSafeStaticSupport(
          playerRectAt(checkpoint.respawnX, checkpoint.respawnY),
          levelTwoGeometry.platforms,
        ),
      ).toBe(true);
    }
  });

  it("keeps the active Chapter 2 flow on the Route Tile Puzzle bridge", () => {
    expect(getActiveChapterFlow(2)).toMatchObject({
      platformerLevelId: 2,
      puzzleLevelId: 3,
      completionLevelId: 3,
    });
  });

  it("adds a hidden-wall rebuild beat without replacing the tram platform beat", () => {
    const rebuildablePlatforms = levelTwoGeometry.rebuildGroups.flatMap((group) => group.platforms);

    expect(levelTwoGeometry.movingPlatforms.length).toBeGreaterThanOrEqual(2);
    expect(levelTwoGeometry.rebuildGroups.length).toBeGreaterThanOrEqual(1);
    expect(rebuildablePlatforms.length).toBeGreaterThanOrEqual(2);

    for (const group of levelTwoGeometry.rebuildGroups) {
      expect(group.id).toMatch(/^ch2_/);
      expect(group.trigger.id).toMatch(/^ch2_/);
      expect(group.trigger.message).toContain("hidden wall");

      for (const platform of group.platforms) {
        expect(platform.id).toMatch(/^ch2_/);
        expect(platform.groupId).toBe(group.id);
        expect(platform.width).toBeGreaterThanOrEqual(150);
        expect(platform.height).toBeGreaterThan(0);
      }
    }
  });

  it("validates the baked Chapter 2 geometry without dev overrides", () => {
    const summary = validatePlatformerGeometry(levelTwoGeometry, { activeChapterId: 2 });

    expect(summary.errors).toBe(0);
    expect(summary.warnings).toBe(0);
  });

  it("keeps the Bake-1A Chapter 2 footprint canonical without the root level-2 override", () => {
    const platformIds = levelTwoGeometry.platforms.map((platform) => platform.id);
    const movingPlatformIds = levelTwoGeometry.movingPlatforms.map((platform) => platform.id);
    const rebuildPlatformIds = levelTwoGeometry.rebuildGroups.flatMap((group) =>
      group.platforms.map((platform) => platform.id),
    );
    const checkpointIds = levelTwoGeometry.checkpoints.map((checkpoint) => checkpoint.id);
    const exhibitIds = levelTwoGeometry.exhibits.map((exhibit) => exhibit.id);

    expect(platformIds).toEqual(expect.arrayContaining([
      "stamp-ledge",
      "ch2_hidden_wall_floor",
      "ch2_wall_descent_step",
      "ch2_river_mark_ledge",
    ]));
    expect(platformIds).not.toEqual(expect.arrayContaining(["ch2_overhead_route", "ch2_upper_wall_crossing"]));
    expect(movingPlatformIds).toEqual(expect.arrayContaining(["tram-car-one", "tram-car-two", "ch2_wall_lift"]));
    expect(rebuildPlatformIds).toEqual(expect.arrayContaining(["ch2_wall_platform_01", "ch2_wall_platform_02"]));
    expect(checkpointIds).toContain("ch2-hidden-wall-checkpoint");
    expect(exhibitIds).toContain("golden-stamp");
    expect(levelTwoGeometry.exit).toMatchObject({ targetScene: "PuzzleScene", targetLevelId: 2 });
  });

  it("keeps moving tram platforms clear of static platform ceilings", () => {
    const minimumHeadroom = PLAYER_HEIGHT + 8;

    for (const movingPlatform of levelTwoGeometry.movingPlatforms) {
      const isVertical = (movingPlatform.axis ?? "horizontal") === "vertical";
      const movingRange = {
        left: movingPlatform.fromX ?? movingPlatform.x,
        right: (movingPlatform.toX ?? movingPlatform.x) + movingPlatform.width,
        top: isVertical ? Math.min(movingPlatform.fromY ?? movingPlatform.y, movingPlatform.toY ?? movingPlatform.y) : movingPlatform.y,
        bottom: isVertical
          ? Math.max(movingPlatform.fromY ?? movingPlatform.y, movingPlatform.toY ?? movingPlatform.y) + movingPlatform.height
          : movingPlatform.y + movingPlatform.height
      };

      for (const staticPlatform of levelTwoGeometry.platforms) {
        const staticRange = {
          left: staticPlatform.x,
          right: staticPlatform.x + staticPlatform.width,
          top: staticPlatform.y,
          bottom: staticPlatform.y + staticPlatform.height
        };
        const overlapsHorizontally = movingRange.left < staticRange.right && movingRange.right > staticRange.left;
        const intersectsVertically = movingRange.top < staticRange.bottom && movingRange.bottom > staticRange.top;

        expect(intersectsVertically && overlapsHorizontally).toBe(false);

        if (overlapsHorizontally && staticRange.bottom <= movingRange.top) {
          expect(movingRange.top - staticRange.bottom).toBeGreaterThanOrEqual(minimumHeadroom);
        }
      }
    }
  });

  it("has one exit targeting PuzzleScene level 2", () => {
    expect(levelTwoGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelTwoGeometry.exit.targetLevelId).toBe(2);
  });

  it("keeps Level 2 target duration in the intended range", () => {
    const levelTwo = levels.find((level) => level.id === 2);

    expect(levelTwo?.targetDurationSeconds).toEqual({ min: 105, max: 135 });
  });
});

describe("Level 3 platformer geometry", () => {
  it("exists for The Rebuilt Street", () => {
    expect(levelThreeGeometry.levelId).toBe(3);
    expect(levelThreeGeometry.title).toBe("The Rebuilt Street");
  });

  it("has a player spawn and positive world dimensions", () => {
    expect(levelThreeGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelThreeGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelThreeGeometry.worldWidth).toBeGreaterThan(0);
    expect(levelThreeGeometry.worldHeight).toBeGreaterThan(0);
  });

  it("has two checkpoints for the richer route", () => {
    expect(levelThreeGeometry.checkpoints.length).toBeGreaterThanOrEqual(2);
  });

  it("has exactly one required Red Brick exhibit", () => {
    const requiredExhibits = levelThreeGeometry.exhibits.filter((exhibit) => exhibit.required);

    expect(requiredExhibits).toHaveLength(1);
    expect(requiredExhibits[0]?.name).toBe("The Red Brick");
  });

  it("has at least two rebuild groups and three rebuildable platforms", () => {
    const rebuildablePlatforms = levelThreeGeometry.rebuildGroups.flatMap((group) => group.platforms);

    expect(levelThreeGeometry.rebuildGroups.length).toBeGreaterThanOrEqual(2);
    expect(rebuildablePlatforms.length).toBeGreaterThanOrEqual(3);
  });

  it("has valid rebuild trigger and platform data", () => {
    for (const group of levelThreeGeometry.rebuildGroups) {
      expect(group.trigger.groupId).toBe(group.id);
      expect(group.trigger.width).toBeGreaterThan(0);
      expect(group.trigger.height).toBeGreaterThan(0);
      expect(group.trigger.message.length).toBeGreaterThan(0);
      expect(group.platforms.length).toBeGreaterThan(0);

      for (const platform of group.platforms) {
        expect(platform.groupId).toBe(group.id);
        expect(platform.width).toBeGreaterThan(0);
        expect(platform.height).toBeGreaterThan(0);
        expect(platform.x).toBeGreaterThanOrEqual(0);
        expect(platform.y).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("keeps rebuilt platforms from creating low collision ceilings", () => {
    const minimumHeadroom = LEGACY_DEV_ROUTE_MINIMUM_HEADROOM;

    for (const rebuildablePlatform of levelThreeGeometry.rebuildGroups.flatMap((group) => group.platforms)) {
      const rebuiltRange = {
        left: rebuildablePlatform.x,
        right: rebuildablePlatform.x + rebuildablePlatform.width,
        top: rebuildablePlatform.y,
        bottom: rebuildablePlatform.y + rebuildablePlatform.height
      };

      for (const staticPlatform of levelThreeGeometry.platforms) {
        const staticRange = {
          left: staticPlatform.x,
          right: staticPlatform.x + staticPlatform.width,
          top: staticPlatform.y,
          bottom: staticPlatform.y + staticPlatform.height
        };
        const overlapsHorizontally = rebuiltRange.left < staticRange.right && rebuiltRange.right > staticRange.left;
        const intersectsVertically = rebuiltRange.top < staticRange.bottom && rebuiltRange.bottom > staticRange.top;

        expect(intersectsVertically && overlapsHorizontally).toBe(false);

        if (overlapsHorizontally && rebuiltRange.bottom <= staticRange.top) {
          expect(staticRange.top - rebuiltRange.bottom).toBeGreaterThanOrEqual(minimumHeadroom);
        }
      }
    }
  });

  it("has one exit targeting PuzzleScene level 3", () => {
    expect(levelThreeGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelThreeGeometry.exit.targetLevelId).toBe(3);
  });

  it("keeps Level 3 target duration in the updated intended range", () => {
    const levelThree = levels.find((level) => level.id === 3);

    expect(levelThree?.targetDurationSeconds).toEqual({ min: 90, max: 120 });
  });
});

describe("Level 4 platformer geometry", () => {
  it("exists for The Vistula Deposition", () => {
    expect(levelFourGeometry.levelId).toBe(4);
    expect(levelFourGeometry.title).toBe("The Vistula Deposition");
  });

  it("has a player spawn and positive world dimensions", () => {
    expect(levelFourGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelFourGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelFourGeometry.worldWidth).toBeGreaterThan(0);
    expect(levelFourGeometry.worldHeight).toBeGreaterThan(0);
  });

  it("has two checkpoints for the Vistula route", () => {
    expect(levelFourGeometry.checkpoints.length).toBeGreaterThanOrEqual(2);
  });

  it("is expanded into a river-to-witness-to-archive-code chapter route", () => {
    const hintCopy = levelFourGeometry.tutorialHints.map((hint) => hint.text).join(" ");
    const decorationIds = levelFourGeometry.decorations.map((decoration) => decoration.id);
    const platformIds = levelFourGeometry.platforms.map((platform) => platform.id);

    expect(levelFourGeometry.worldWidth).toBeGreaterThanOrEqual(5000);
    expect(levelFourGeometry.checkpoints.length).toBeGreaterThanOrEqual(3);
    expect(platformIds).toEqual(expect.arrayContaining([
      "ch3_lower_bank_rise",
      "ch3_bridge_climb_low",
      "ch3_bridge_upper_beam",
      "ch3_bridge_high_crossing",
      "ch3_bridge_descent_step",
      "ch3_shadow_bank_drop",
      "ch3_archive_code_step",
      "ch3_after_witness_bank",
    ]));
    expect(platformIds).not.toContain("witness-note-ledge");
    expect(decorationIds).toEqual(expect.arrayContaining([
      "ch3_bridge_shadow_01",
      "ch3_witness_silhouette_01",
      "ch3_archive_code_mark_01",
    ]));
    expect(hintCopy).toContain("Vistula mark");
    expect(hintCopy).toContain("Witness Note");
    expect(hintCopy).toContain("archive code");
    expect(getPlatformVerticalSpread(levelFourGeometry.platforms)).toBeGreaterThanOrEqual(320);
  });

  it("has exactly one required Witness Note exhibit", () => {
    const requiredExhibits = levelFourGeometry.exhibits.filter((exhibit) => exhibit.required);

    expect(requiredExhibits).toHaveLength(1);
    expect(requiredExhibits[0]?.name).toBe("The Witness Note");
  });

  it("has at least three valid drifting platforms", () => {
    expect(levelFourGeometry.movingPlatforms.length).toBeGreaterThanOrEqual(3);

    for (const platform of levelFourGeometry.movingPlatforms) {
      expect(platform.kind).toBe("paper");
      expect(platform.width).toBeGreaterThan(0);
      expect(platform.height).toBeGreaterThan(0);
      expect(platform.axis ?? "horizontal").toBe("horizontal");
      expect(platform.toX ?? platform.x).toBeGreaterThan(platform.fromX ?? platform.x);
      expect(platform.speed).toBeGreaterThan(0);
    }
  });

  it("keeps drifting platforms clear of low static-platform gaps", () => {
    const minimumHeadroom = PLAYER_HEIGHT + 8;

    for (const movingPlatform of levelFourGeometry.movingPlatforms) {
      const movingRange = {
        left: movingPlatform.fromX ?? movingPlatform.x,
        right: (movingPlatform.toX ?? movingPlatform.x) + movingPlatform.width,
        top: movingPlatform.y,
        bottom: movingPlatform.y + movingPlatform.height
      };

      for (const staticPlatform of levelFourGeometry.platforms) {
        const staticRange = {
          left: staticPlatform.x,
          right: staticPlatform.x + staticPlatform.width,
          top: staticPlatform.y,
          bottom: staticPlatform.y + staticPlatform.height
        };
        const overlapsHorizontally = movingRange.left < staticRange.right && movingRange.right > staticRange.left;
        const intersectsVertically = movingRange.top < staticRange.bottom && movingRange.bottom > staticRange.top;

        expect(intersectsVertically && overlapsHorizontally).toBe(false);

        if (overlapsHorizontally) {
          const verticalGap =
            movingRange.bottom <= staticRange.top
              ? staticRange.top - movingRange.bottom
              : movingRange.top - staticRange.bottom;
          expect(verticalGap).toBeGreaterThanOrEqual(minimumHeadroom);
        }
      }
    }
  });

  it("has optional witness-note fragments with unique ids and an archive-code handoff", () => {
    const ids = levelFourGeometry.witnessFragments.map((fragment) => fragment.id);

    expect(levelFourGeometry.witnessFragments.length).toBeGreaterThanOrEqual(4);
    expect(ids).toContain("ch3-archive-code-corner");
    expect(new Set(ids).size).toBe(ids.length);

    for (const fragment of levelFourGeometry.witnessFragments) {
      expect(fragment.text.length).toBeGreaterThan(0);
      expect(fragment.width).toBeGreaterThan(0);
      expect(fragment.height).toBeGreaterThan(0);
      expect(fragment.x).toBeGreaterThanOrEqual(0);
      expect(fragment.y).toBeGreaterThanOrEqual(0);
    }
  });

  it("keeps required Chapter 3 witness, archive-code, checkpoint, and exit objects supported", () => {
    const requiredWitnessNote = levelFourGeometry.exhibits.find((exhibit) => exhibit.required);
    const archiveCode = levelFourGeometry.witnessFragments.find((fragment) => fragment.id === "ch3-archive-code-corner");
    const witnessSilhouette = levelFourGeometry.decorations.find((decoration) => decoration.id === "ch3_witness_silhouette_01");
    const archiveCodeMark = levelFourGeometry.decorations.find((decoration) => decoration.id === "ch3_archive_code_mark_01");

    expect(requiredWitnessNote).toBeDefined();
    expect(archiveCode).toBeDefined();
    expect(witnessSilhouette).toBeDefined();
    expect(archiveCodeMark).toBeDefined();
    expect(hasSafeStaticSupport(requiredWitnessNote!, levelFourGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(archiveCode!, levelFourGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(witnessSilhouette!, levelFourGeometry.platforms, { maxVerticalGap: 24 })).toBe(true);
    expect(hasSafeStaticSupport(archiveCodeMark!, levelFourGeometry.platforms, { maxVerticalGap: 24 })).toBe(true);
    expect(hasSafeStaticSupport(levelFourGeometry.exit, levelFourGeometry.platforms, { maxVerticalGap: 12 })).toBe(true);

    for (const checkpoint of levelFourGeometry.checkpoints) {
      expect(
        hasSafeStaticSupport(
          playerRectAt(checkpoint.respawnX, checkpoint.respawnY),
          levelFourGeometry.platforms,
        ),
      ).toBe(true);
    }
  });

  it("keeps the archive-code handoff within a forgiving jump arc", () => {
    const finalDrift = levelFourGeometry.movingPlatforms.find((platform) => platform.id === "drifting-paper-three");
    const archiveStep = levelFourGeometry.platforms.find((platform) => platform.id === "ch3_archive_code_step");
    const maxJumpHeight = (JUMP_SPEED * JUMP_SPEED) / (2 * GRAVITY_Y);

    expect(finalDrift).toBeDefined();
    expect(archiveStep).toBeDefined();

    if (!finalDrift || !archiveStep) {
      return;
    }

    const climbHeight = finalDrift.y - archiveStep.y;
    const horizontalGap = archiveStep.x - ((finalDrift.toX ?? finalDrift.x) + finalDrift.width);

    expect(climbHeight).toBeGreaterThan(0);
    expect(climbHeight).toBeLessThanOrEqual(maxJumpHeight - 24);
    expect(horizontalGap).toBeLessThanOrEqual(48);
  });

  it("keeps the active Chapter 3 flow on the Deposition Order bridge", () => {
    expect(getActiveChapterFlow(3)).toMatchObject({
      platformerLevelId: 4,
      puzzleLevelId: 4,
      completionLevelId: 4,
    });
  });

  it("has one exit targeting PuzzleScene level 4", () => {
    expect(levelFourGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelFourGeometry.exit.targetLevelId).toBe(4);
  });

  it("keeps the Bake-2A Chapter 3 footprint canonical without the root level-4 override", () => {
    const platformIds = levelFourGeometry.platforms.map((platform) => platform.id);
    const movingPlatformIds = levelFourGeometry.movingPlatforms.map((platform) => platform.id);
    const checkpointIds = levelFourGeometry.checkpoints.map((checkpoint) => checkpoint.id);
    const exhibitIds = levelFourGeometry.exhibits.map((exhibit) => exhibit.id);
    const witnessFragmentIds = levelFourGeometry.witnessFragments.map((fragment) => fragment.id);
    const summary = validatePlatformerGeometry(levelFourGeometry, { activeChapterId: 3 });

    expect(platformIds).toEqual(expect.arrayContaining([
      "riverbank-start",
      "bridge-fragment-one",
      "ch3_bridge_upper_beam",
      "ch3_bridge_high_crossing",
      "ch3_bridge_descent_step",
      "ch3_shadow_bank_drop",
      "ch3_archive_code_step",
      "ch3_after_witness_bank",
    ]));
    expect(platformIds).not.toContain("witness-note-ledge");
    expect(movingPlatformIds).toEqual(expect.arrayContaining([
      "drifting-paper-one",
      "drifting-paper-two",
      "drifting-paper-three",
    ]));
    expect(checkpointIds).toEqual(expect.arrayContaining([
      "first-vistula-checkpoint-zone",
      "second-vistula-checkpoint-zone",
      "ch3-after-witness-checkpoint-zone",
    ]));
    expect(exhibitIds).toContain("witness-note");
    expect(witnessFragmentIds).toEqual(expect.arrayContaining([
      "quiet-statement",
      "between-lines",
      "ch3-archive-code-corner",
    ]));
    expect(levelFourGeometry.exit).toMatchObject({ targetScene: "PuzzleScene", targetLevelId: 4 });
    expect(summary.errors).toBe(0);
    expect(summary.warnings).toBe(0);
  });

  it("keeps Level 4 target duration in the updated intended range", () => {
    const levelFour = levels.find((level) => level.id === 4);

    expect(levelFour?.targetDurationSeconds).toEqual({ min: 90, max: 120 });
  });
});

describe("Level 5 platformer geometry", () => {
  it("exists for The Archive of Tiny Details", () => {
    expect(levelFiveGeometry.levelId).toBe(5);
    expect(levelFiveGeometry.title).toBe("The Archive of Tiny Details");
  });

  it("has a player spawn and positive world dimensions", () => {
    expect(levelFiveGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelFiveGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelFiveGeometry.worldWidth).toBeGreaterThan(0);
    expect(levelFiveGeometry.worldHeight).toBeGreaterThan(0);
  });

  it("has two checkpoints for the archive route", () => {
    expect(levelFiveGeometry.checkpoints.length).toBeGreaterThanOrEqual(2);
  });

  it("is expanded into an archive-correction-to-silver-key chapter route", () => {
    const hintCopy = levelFiveGeometry.tutorialHints.map((hint) => hint.text).join(" ");
    const decorationIds = levelFiveGeometry.decorations.map((decoration) => decoration.id);
    const platformIds = levelFiveGeometry.platforms.map((platform) => platform.id);

    expect(levelFiveGeometry.worldWidth).toBeGreaterThanOrEqual(5400);
    expect(levelFiveGeometry.worldHeight).toBeGreaterThanOrEqual(1000);
    expect(levelFiveGeometry.checkpoints.length).toBeGreaterThanOrEqual(3);
    expect(platformIds).toEqual(expect.arrayContaining([
      "ch4_file_cabinet_climb_low",
      "ch4_file_cabinet_climb_mid",
      "ch4_file_cabinet_climb_high",
      "ch4_upper_archive_path",
      "ch4_drawer_gate_ledge",
      "ch4_lower_correction_floor",
      "marginal-note-ledge",
      "ch4_file_spine_step",
      "ch4_silver_key_landing",
      "ch4_courthouse_index",
    ]));
    expect(decorationIds).toEqual(expect.arrayContaining([
      "ch4_archive_code_drawer_01",
      "ch4_no_given_margin_01",
      "ch4_silver_key_reveal_01",
      "ch4_courthouse_direction_01",
    ]));
    expect(hintCopy).toContain("archive code");
    expect(hintCopy).toContain("No. Given.");
    expect(hintCopy).toContain("silver key");
    expect(getPlatformVerticalSpread(levelFiveGeometry.platforms)).toBeGreaterThanOrEqual(420);
  });

  it("uses a simple drawer route between the upper archive and lower correction area", () => {
    const slidingDrawer = levelFiveGeometry.movingPlatforms.find((platform) => platform.id === "sliding-drawer-one");
    const drawerLift = levelFiveGeometry.movingPlatforms.find((platform) => platform.id === "ch4_drawer_lift");
    const upperPath = levelFiveGeometry.platforms.find((platform) => platform.id === "ch4_upper_archive_path");
    const correctionFloor = levelFiveGeometry.platforms.find((platform) => platform.id === "ch4_lower_correction_floor");

    expect(slidingDrawer).toBeDefined();
    expect(drawerLift).toBeDefined();
    expect(upperPath).toBeDefined();
    expect(correctionFloor).toBeDefined();
    expect(slidingDrawer).toMatchObject({
      x: 3027,
      y: 516,
      width: 128,
      fromX: 3027,
      toX: 3147,
      speed: 24
    });
    expect(drawerLift).toMatchObject({
      axis: "vertical",
      x: 3256,
      y: 690,
      width: 128,
      fromY: 540,
      toY: 690,
      speed: 20
    });
    expect((correctionFloor?.y ?? 0) - (upperPath?.y ?? 0)).toBeGreaterThanOrEqual(300);
  });

  it("keeps the Bake-3 Chapter 4 layout canonical without the dev override", () => {
    const platformsById = new Map(levelFiveGeometry.platforms.map((platform) => [platform.id, platform]));
    const checkpointsById = new Map(levelFiveGeometry.checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
    const slidingDrawer = levelFiveGeometry.movingPlatforms.find((platform) => platform.id === "sliding-drawer-one");
    const drawerLift = levelFiveGeometry.movingPlatforms.find((platform) => platform.id === "ch4_drawer_lift");
    const marginalNote = levelFiveGeometry.exhibits.find((exhibit) => exhibit.id === "marginal-note");
    const silverKey = levelFiveGeometry.archiveKeys.find((key) => key.id === "ch4-silver-key-reveal");
    const noGivenCorrection = levelFiveGeometry.tinyDetailNotes.find((note) => note.id === "ch4-no-given-correction");
    const fileSpineKey = levelFiveGeometry.tinyDetailNotes.find((note) => note.id === "ch4-file-spine-key");
    const validation = validatePlatformerGeometry(levelFiveGeometry, { activeChapterId: 4 });

    expect(platformsById.get("archive-start-desk")).toMatchObject({ width: 500 });
    expect(platformsById.get("ch4_file_cabinet_climb_mid")).toMatchObject({ x: 1540, width: 70 });
    expect(platformsById.get("ch4_upper_archive_path")).toMatchObject({ width: 420 });
    expect(platformsById.get("ch4_drawer_gate_ledge")).toMatchObject({ width: 240 });
    expect(platformsById.get("ch4_lower_correction_floor")).toMatchObject({ width: 380 });
    expect(platformsById.get("marginal-note-ledge")).toMatchObject({ width: 240 });
    expect(platformsById.get("ch4_silver_key_landing")).toMatchObject({ y: 590, height: 42 });
    expect(slidingDrawer).toMatchObject({ x: 3027, y: 516, width: 128, fromX: 3027, toX: 3147, speed: 24 });
    expect(drawerLift).toMatchObject({ x: 3256, y: 690, width: 128, fromY: 540, toY: 690, speed: 20 });
    expect(checkpointsById.get("first-archive-checkpoint-zone")).toMatchObject({ x: 2018, respawnX: 2048 });
    expect(checkpointsById.get("second-archive-checkpoint-zone")).toMatchObject({ x: 3458, respawnX: 3488 });
    expect(checkpointsById.get("ch4-silver-key-checkpoint-zone")).toMatchObject({ x: 4850, y: 500, respawnX: 4880, respawnY: 516 });
    expect(marginalNote).toMatchObject({ x: 4386, y: 446 });
    expect(silverKey).toMatchObject({ x: 4974, y: 550 });
    expect(noGivenCorrection).toMatchObject({ x: 4254, y: 456 });
    expect(fileSpineKey).toMatchObject({ x: 5044, y: 554 });
    expect(levelFiveGeometry.exit).toMatchObject({ targetScene: "PuzzleScene", targetLevelId: 5 });
    expect(validation.errors).toBe(0);
    expect(validation.warnings).toBe(0);
  });

  it("has exactly one required Marginal Note exhibit", () => {
    const requiredExhibits = levelFiveGeometry.exhibits.filter((exhibit) => exhibit.required);

    expect(requiredExhibits).toHaveLength(1);
    expect(requiredExhibits[0]?.name).toBe("The Marginal Note");
  });

  it("has a locked archive door, its archive key, and a silver-key reveal pickup", () => {
    expect(levelFiveGeometry.archiveKeys.length).toBeGreaterThanOrEqual(2);
    expect(levelFiveGeometry.archiveDoors).toHaveLength(1);

    const key = levelFiveGeometry.archiveKeys.find((candidate) => candidate.id === "archive-key");
    const silverKey = levelFiveGeometry.archiveKeys.find((candidate) => candidate.id === "ch4-silver-key-reveal");
    const [door] = levelFiveGeometry.archiveDoors;

    expect(key?.id).toBe("archive-key");
    expect(key?.width).toBeGreaterThan(0);
    expect(key?.height).toBeGreaterThan(0);
    expect(key?.feedbackMessage.length).toBeGreaterThan(0);
    expect(door?.requiresKeyId).toBe(key?.id);
    expect(door?.width).toBeGreaterThan(0);
    expect(door?.height).toBeGreaterThan(0);
    expect(door?.openMessage.length).toBeGreaterThan(0);
    expect(silverKey?.label).toBe("Silver key");
    expect(silverKey?.feedbackMessage).toContain("Courthouse of Echoes");
  });

  it("keeps required Chapter 4 archive objects, checkpoints, and exit supported", () => {
    const requiredMarginalNote = levelFiveGeometry.exhibits.find((exhibit) => exhibit.required);
    const archiveKey = levelFiveGeometry.archiveKeys.find((candidate) => candidate.id === "archive-key");
    const silverKey = levelFiveGeometry.archiveKeys.find((candidate) => candidate.id === "ch4-silver-key-reveal");
    const [door] = levelFiveGeometry.archiveDoors;
    const noGivenCorrection = levelFiveGeometry.tinyDetailNotes.find((note) => note.id === "ch4-no-given-correction");
    const fileSpineKey = levelFiveGeometry.tinyDetailNotes.find((note) => note.id === "ch4-file-spine-key");

    expect(requiredMarginalNote).toBeDefined();
    expect(archiveKey).toBeDefined();
    expect(silverKey).toBeDefined();
    expect(door).toBeDefined();
    expect(noGivenCorrection).toBeDefined();
    expect(fileSpineKey).toBeDefined();
    expect(hasSafeStaticSupport(requiredMarginalNote!, levelFiveGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(archiveKey!, levelFiveGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(silverKey!, levelFiveGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(door!, levelFiveGeometry.platforms, { maxVerticalGap: 12 })).toBe(true);
    expect(hasSafeStaticSupport(noGivenCorrection!, levelFiveGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(fileSpineKey!, levelFiveGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(levelFiveGeometry.exit, levelFiveGeometry.platforms, { maxVerticalGap: 12 })).toBe(true);

    for (const checkpoint of levelFiveGeometry.checkpoints) {
      expect(
        hasSafeStaticSupport(
          playerRectAt(checkpoint.respawnX, checkpoint.respawnY),
          levelFiveGeometry.platforms,
        ),
      ).toBe(true);
    }
  });

  it("has optional tiny-detail notes with unique ids and correction/key details", () => {
    const ids = levelFiveGeometry.tinyDetailNotes.map((note) => note.id);

    expect(levelFiveGeometry.tinyDetailNotes.length).toBeGreaterThanOrEqual(5);
    expect(ids).toEqual(expect.arrayContaining(["ch4-no-given-correction", "ch4-file-spine-key"]));
    expect(new Set(ids).size).toBe(ids.length);

    for (const note of levelFiveGeometry.tinyDetailNotes) {
      expect(note.text.length).toBeGreaterThan(0);
      expect(note.width).toBeGreaterThan(0);
      expect(note.height).toBeGreaterThan(0);
      expect(note.x).toBeGreaterThanOrEqual(0);
      expect(note.y).toBeGreaterThanOrEqual(0);
    }
  });

  it("has one exit targeting PuzzleScene level 5", () => {
    expect(levelFiveGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelFiveGeometry.exit.targetLevelId).toBe(5);
  });

  it("keeps the active Chapter 4 flow on the Case File Sorting bridge", () => {
    expect(getActiveChapterFlow(4)).toMatchObject({
      platformerLevelId: 5,
      puzzleLevelId: 5,
      completionLevelId: 5,
    });
  });

  it("keeps Level 5 target duration in the updated intended range", () => {
    const levelFive = levels.find((level) => level.id === 5);

    expect(levelFive?.targetDurationSeconds).toEqual({ min: 105, max: 135 });
  });
});

describe("Level 6 platformer geometry", () => {
  it("exists for The Courthouse of Echoes", () => {
    expect(levelSixGeometry.levelId).toBe(6);
    expect(levelSixGeometry.title).toBe("The Courthouse of Echoes");
  });

  it("has a player spawn and positive world dimensions", () => {
    expect(levelSixGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelSixGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelSixGeometry.worldWidth).toBeGreaterThan(0);
    expect(levelSixGeometry.worldHeight).toBeGreaterThan(0);
  });

  it("has two checkpoints for the courthouse route", () => {
    expect(levelSixGeometry.checkpoints.length).toBeGreaterThanOrEqual(2);
  });

  it("extends the courthouse into the Chapter 5 lantern and ribbon ascent", () => {
    expect(levelSixGeometry.worldWidth).toBeGreaterThanOrEqual(7400);
    expect(levelSixGeometry.worldHeight).toBeGreaterThanOrEqual(1200);

    const platformIds = levelSixGeometry.platforms.map((platform) => platform.id);

    expect(platformIds).toEqual(
      expect.arrayContaining([
        "ch5_lower_courthouse_corridor",
        "ch5_trust_door_threshold",
        "ch5_lantern_path_base",
        "ch5_dev_platform_001",
        "ch5_dev_platform_002",
        "ch5_dev_platform_003",
        "ch5_elevator_mid_ledge",
        "ch5_blue_ribbon_pages"
      ])
    );
    expect(getPlatformVerticalSpread(levelSixGeometry.platforms)).toBeGreaterThanOrEqual(600);
  });

  it("keeps the Bake-6 Chapter 5 layout canonical without the dev override", () => {
    const platformIds = levelSixGeometry.platforms.map((platform) => platform.id);
    const platformsById = new Map(levelSixGeometry.platforms.map((platform) => [platform.id, platform]));
    const movingPlatformsById = new Map(levelSixGeometry.movingPlatforms.map((platform) => [platform.id, platform]));
    const choiceDoorsById = new Map(levelSixGeometry.choiceDoors.map((door) => [door.id, door]));
    const checkpointsById = new Map(levelSixGeometry.checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
    const validation = validatePlatformerGeometry(levelSixGeometry, { activeChapterId: 5 });

    expect(platformIds).toEqual(
      expect.arrayContaining([
        "ch5_dev_platform_001",
        "ch5_dev_platform_002",
        "ch5_dev_platform_003",
        "silver-key-ledge",
        "ch5_trust_door_threshold",
        "ch5_lantern_path_base",
        "ch5_blue_ribbon_pages",
        "ch5_puzzle_exit_desk"
      ])
    );
    expect(platformIds).not.toEqual(expect.arrayContaining([
      "echo-bridge",
      "ch5_lantern_lower_catch",
      "ch5_elevator_waiting_ledge",
      "ch5_unfinished_letter_ledge"
    ]));
    expect(platformsById.get("first-choice-floor")).toMatchObject({ x: 1359, y: 620, width: 140, height: 22 });
    expect(platformsById.get("ch5_dev_platform_001")).toMatchObject({ x: 1361, y: 812, width: 140, height: 22 });
    expect(platformsById.get("ch5_dev_platform_002")).toMatchObject({ x: 2492, y: 462, width: 140, height: 22 });
    expect(platformsById.get("ch5_dev_platform_003")).toMatchObject({ x: 2492, y: 762, width: 140, height: 22 });
    expect(movingPlatformsById.get("floating-brief-one")).toMatchObject({
      x: 2171,
      width: 112,
      fromX: 2111,
      toX: 2289,
      speed: 28
    });
    expect(movingPlatformsById.get("ch5_dev_elevator_001")).toMatchObject({
      axis: "vertical",
      x: 2376,
      width: 112,
      fromX: 2376,
      toX: 2376,
      fromY: 433,
      toY: 757,
      speed: 28
    });
    expect(choiceDoorsById.get("door-hope")).toMatchObject({ x: 1389, y: 690 });
    expect(choiceDoorsById.get("door-trust")).toMatchObject({ x: 2510, y: 340 });
    expect(checkpointsById.get("trust-checkpoint-zone")).toMatchObject({ x: 3010, respawnX: 3040 });
    expect(checkpointsById.get("ch5_elevator_checkpoint_zone")).toMatchObject({ x: 5150, respawnX: 5180 });
    expect(levelSixGeometry.exit).toMatchObject({ targetScene: "PuzzleScene", targetLevelId: 6 });
    expect(validation.errors).toBe(0);
    expect(validation.warnings).toBe(0);
  });

  it("adds a lantern reveal path after the Trust door", () => {
    expect(levelSixGeometry.lanternSwitches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "ch5_lantern_switch_01",
          revealGroupId: "ch5_lantern_path"
        })
      ])
    );

    const revealGroup = levelSixGeometry.lightRevealGroups.find((group) => group.id === "ch5_lantern_path");

    expect(revealGroup?.platforms.length).toBeGreaterThanOrEqual(2);
    expect(revealGroup?.platforms.every((platform) => platform.groupId === "ch5_lantern_path")).toBe(true);
  });

  it("reuses forgiving vertical elevator mechanics for the trust ascent", () => {
    const verticalElevators = levelSixGeometry.movingPlatforms.filter((platform) => platform.axis === "vertical");

    expect(verticalElevators.length).toBeGreaterThanOrEqual(2);

    for (const elevator of verticalElevators) {
      expect(elevator.id.startsWith("ch5_elevator_") || elevator.id === "ch5_dev_elevator_001").toBe(true);
      expect(elevator.width).toBeGreaterThanOrEqual(112);
      expect(elevator.speed).toBeLessThanOrEqual(28);
      expect(elevator.fromY).toBeDefined();
      expect(elevator.toY).toBeDefined();
      expect(elevator.fromY ?? 0).toBeLessThan(elevator.toY ?? 0);
    }
  });

  it("places checkpoints before and after the elevator ascent", () => {
    const checkpointIds = levelSixGeometry.checkpoints.map((checkpoint) => checkpoint.id);

    expect(levelSixGeometry.checkpoints.length).toBeGreaterThanOrEqual(3);
    expect(checkpointIds).toEqual(
      expect.arrayContaining(["ch5_elevator_checkpoint_zone", "ch5_ribbon_checkpoint_zone"])
    );
  });

  it("makes the blue ribbon and unfinished letter handoff visible in level metadata", () => {
    const hintText = levelSixGeometry.tutorialHints.map((hint) => hint.text).join(" ");
    const fragmentText = levelSixGeometry.argumentFragments.map((fragment) => fragment.text).join(" ");
    const decorationIds = levelSixGeometry.decorations.map((decoration) => decoration.id);

    expect(hintText).toContain("Blue Ribbon");
    expect(hintText).toContain("unfinished letter");
    expect(fragmentText).toContain("The Blue Ribbon releases the unfinished letter.");
    expect(decorationIds).toEqual(
      expect.arrayContaining(["ch5_blue_ribbon_glow", "ch5_unfinished_letter_glow"])
    );
  });

  it("has exactly one required Silver Key exhibit", () => {
    const requiredExhibits = levelSixGeometry.exhibits.filter((exhibit) => exhibit.required);

    expect(requiredExhibits).toHaveLength(1);
    expect(requiredExhibits[0]?.name).toBe("The Silver Key");
  });

  it("keeps required Chapter 5 trust, lantern, ribbon, checkpoint, and exit objects supported", () => {
    const requiredSilverKey = levelSixGeometry.exhibits.find((exhibit) => exhibit.required);
    const trustDoor = levelSixGeometry.choiceDoors.find((door) => door.id === "door-trust");
    const lanternSwitch = levelSixGeometry.lanternSwitches.find((switchSpec) => switchSpec.id === "ch5_lantern_switch_01");
    const lanternPages = levelSixGeometry.argumentFragments.find((fragment) => fragment.id === "ch5_lantern_pages");
    const ribbonLetter = levelSixGeometry.argumentFragments.find((fragment) => fragment.id === "ch5_ribbon_releases_letter");
    const supportPlatforms = getSafeSupportPlatforms(levelSixGeometry);

    expect(requiredSilverKey).toBeDefined();
    expect(trustDoor).toBeDefined();
    expect(lanternSwitch).toBeDefined();
    expect(lanternPages).toBeDefined();
    expect(ribbonLetter).toBeDefined();
    expect(hasSafeStaticSupport(requiredSilverKey!, supportPlatforms)).toBe(true);
    expect(hasSafeStaticSupport(trustDoor!, supportPlatforms, { maxVerticalGap: 12 })).toBe(true);
    expect(hasSafeStaticSupport(lanternSwitch!, supportPlatforms, { maxVerticalGap: 12 })).toBe(true);
    expect(hasSafeStaticSupport(lanternPages!, supportPlatforms)).toBe(true);
    expect(hasSafeStaticSupport(ribbonLetter!, supportPlatforms)).toBe(true);
    expect(hasSafeStaticSupport(levelSixGeometry.exit, supportPlatforms, { maxVerticalGap: 12 })).toBe(true);

    for (const checkpoint of levelSixGeometry.checkpoints) {
      expect(
        hasSafeStaticSupport(
          playerRectAt(checkpoint.respawnX, checkpoint.respawnY),
          supportPlatforms,
        ),
      ).toBe(true);
    }
  });

  it("has two choice-door groups with the required symbolic labels", () => {
    const labels = levelSixGeometry.choiceDoors.map((door) => door.label);
    const groupIds = new Set(levelSixGeometry.choiceDoors.map((door) => door.groupId));

    expect(groupIds.size).toBeGreaterThanOrEqual(2);
    expect(labels).toEqual(expect.arrayContaining(["Doubt", "Fear", "Distance", "Hope", "Trust"]));
  });

  it("has valid forward and loop-back choice-door data", () => {
    expect(levelSixGeometry.choiceDoors.some((door) => door.isCorrectPath)).toBe(true);
    expect(levelSixGeometry.choiceDoors.some((door) => !door.isCorrectPath)).toBe(true);

    for (const door of levelSixGeometry.choiceDoors) {
      expect(door.width).toBeGreaterThan(0);
      expect(door.height).toBeGreaterThan(0);
      expect(door.destinationX).toBeGreaterThanOrEqual(0);
      expect(door.destinationY).toBeGreaterThanOrEqual(0);
      expect(door.feedbackMessage.length).toBeGreaterThan(0);
    }
  });

  it("keeps the moved Hope and Trust choice doors visually distinct from the return doors", () => {
    const doorHope = levelSixGeometry.choiceDoors.find((door) => door.id === "door-hope");
    const doorDoubt = levelSixGeometry.choiceDoors.find((door) => door.id === "door-doubt");
    const doorTrust = levelSixGeometry.choiceDoors.find((door) => door.id === "door-trust");
    const doorFear = levelSixGeometry.choiceDoors.find((door) => door.id === "door-fear");
    const doorDistance = levelSixGeometry.choiceDoors.find((door) => door.id === "door-distance");

    expect(doorHope).toBeDefined();
    expect(doorDoubt).toBeDefined();
    expect(doorTrust).toBeDefined();
    expect(doorFear).toBeDefined();
    expect(doorDistance).toBeDefined();
    expect(doorHope).toMatchObject({ isCorrectPath: true, x: 1389, y: 690 });
    expect(doorDoubt).toMatchObject({ isCorrectPath: false, x: 1390, y: 500 });
    expect(doorTrust).toMatchObject({ isCorrectPath: true, x: 2510, y: 340 });
    expect(doorFear).toMatchObject({ isCorrectPath: false, x: 2520, y: 490 });
    expect(doorDistance).toMatchObject({ isCorrectPath: false, x: 2510, y: 640 });
  });

  it("has three optional echo fragments with unique ids", () => {
    const ids = levelSixGeometry.echoFragments.map((fragment) => fragment.id);

    expect(levelSixGeometry.echoFragments).toHaveLength(3);
    expect(new Set(ids).size).toBe(ids.length);

    for (const fragment of levelSixGeometry.echoFragments) {
      expect(fragment.text.length).toBeGreaterThan(0);
      expect(fragment.width).toBeGreaterThan(0);
      expect(fragment.height).toBeGreaterThan(0);
      expect(fragment.x).toBeGreaterThanOrEqual(0);
      expect(fragment.y).toBeGreaterThanOrEqual(0);
    }
  });

  it("has one exit targeting PuzzleScene level 6", () => {
    expect(levelSixGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelSixGeometry.exit.targetLevelId).toBe(6);
  });

  it("keeps Level 6 target duration in the updated intended range", () => {
    const levelSix = levels.find((level) => level.id === 6);

    expect(levelSix?.targetDurationSeconds).toEqual({ min: 120, max: 150 });
  });
});

describe("Level 7 platformer geometry", () => {
  it("exists for The Garden of Quiet Evidence", () => {
    expect(levelSevenGeometry.levelId).toBe(7);
    expect(levelSevenGeometry.title).toBe("The Garden of Quiet Evidence");
  });

  it("has a player spawn and positive world dimensions", () => {
    expect(levelSevenGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelSevenGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelSevenGeometry.worldWidth).toBeGreaterThan(0);
    expect(levelSevenGeometry.worldHeight).toBeGreaterThan(0);
  });

  it("has at least one checkpoint for the calm route", () => {
    expect(levelSevenGeometry.checkpoints.length).toBeGreaterThanOrEqual(1);
  });

  it("has exactly one required Lantern exhibit", () => {
    const requiredExhibits = levelSevenGeometry.exhibits.filter((exhibit) => exhibit.required);

    expect(requiredExhibits).toHaveLength(1);
    expect(requiredExhibits[0]?.name).toBe("The Lantern");
  });

  it("has at least two lantern switches and two light-revealed platforms", () => {
    const revealedPlatforms = levelSevenGeometry.lightRevealGroups.flatMap((group) => group.platforms);

    expect(levelSevenGeometry.lanternSwitches.length).toBeGreaterThanOrEqual(2);
    expect(revealedPlatforms.length).toBeGreaterThanOrEqual(2);
  });

  it("has valid lantern switch and reveal group data", () => {
    const groupIds = new Set(levelSevenGeometry.lightRevealGroups.map((group) => group.id));

    for (const lantern of levelSevenGeometry.lanternSwitches) {
      expect(lantern.width).toBeGreaterThan(0);
      expect(lantern.height).toBeGreaterThan(0);
      expect(groupIds.has(lantern.revealGroupId)).toBe(true);
      expect(lantern.feedbackMessage.length).toBeGreaterThan(0);
    }

    for (const group of levelSevenGeometry.lightRevealGroups) {
      expect(group.platforms.length).toBeGreaterThan(0);

      for (const platform of group.platforms) {
        expect(platform.groupId).toBe(group.id);
        expect(platform.width).toBeGreaterThan(0);
        expect(platform.height).toBeGreaterThan(0);
        expect(platform.x).toBeGreaterThanOrEqual(0);
        expect(platform.y).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("has three optional quiet evidence fragments with unique ids", () => {
    const ids = levelSevenGeometry.quietEvidenceFragments.map((fragment) => fragment.id);

    expect(levelSevenGeometry.quietEvidenceFragments).toHaveLength(3);
    expect(new Set(ids).size).toBe(ids.length);

    for (const fragment of levelSevenGeometry.quietEvidenceFragments) {
      expect(fragment.text.length).toBeGreaterThan(0);
      expect(fragment.width).toBeGreaterThan(0);
      expect(fragment.height).toBeGreaterThan(0);
      expect(fragment.x).toBeGreaterThanOrEqual(0);
      expect(fragment.y).toBeGreaterThanOrEqual(0);
    }
  });

  it("has one exit targeting PuzzleScene level 7", () => {
    expect(levelSevenGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelSevenGeometry.exit.targetLevelId).toBe(7);
  });

  it("keeps Level 7 target duration in the updated intended range", () => {
    const levelSeven = levels.find((level) => level.id === 7);

    expect(levelSeven?.targetDurationSeconds).toEqual({ min: 75, max: 90 });
  });
});

describe("Level 8 platformer geometry", () => {
  it("exists for The Tower of Arguments", () => {
    expect(levelEightGeometry.levelId).toBe(8);
    expect(levelEightGeometry.title).toBe("The Tower of Arguments");
  });

  it("has a player spawn and positive tall-world dimensions", () => {
    expect(levelEightGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelEightGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelEightGeometry.worldWidth).toBeGreaterThan(0);
    expect(levelEightGeometry.worldHeight).toBeGreaterThan(900);
    expect(levelEightGeometry.worldHeight).toBeGreaterThan(levelEightGeometry.worldWidth);
  });

  it("has two checkpoints for the vertical ascent", () => {
    expect(levelEightGeometry.checkpoints.length).toBeGreaterThanOrEqual(2);
  });

  it("has exactly one required Blue Ribbon exhibit", () => {
    const requiredExhibits = levelEightGeometry.exhibits.filter((exhibit) => exhibit.required);

    expect(requiredExhibits).toHaveLength(1);
    expect(requiredExhibits[0]?.name).toBe("The Blue Ribbon");
  });

  it("has at least three valid vertical elevator platforms", () => {
    const verticalElevators = levelEightGeometry.movingPlatforms.filter((platform) => platform.axis === "vertical");

    expect(verticalElevators.length).toBeGreaterThanOrEqual(3);

    for (const platform of verticalElevators) {
      expect(platform.width).toBeGreaterThanOrEqual(240);
      expect(platform.height).toBeGreaterThan(0);
      expect(platform.fromY).toBeDefined();
      expect(platform.toY).toBeDefined();
      expect(platform.toY ?? platform.y).toBeGreaterThan(platform.fromY ?? platform.y);
      expect(platform.speed).toBeGreaterThan(0);
      expect(platform.speed).toBeLessThanOrEqual(48);
    }
  });

  it("has three optional argument fragments with unique ids", () => {
    const ids = levelEightGeometry.argumentFragments.map((fragment) => fragment.id);

    expect(levelEightGeometry.argumentFragments).toHaveLength(3);
    expect(new Set(ids).size).toBe(ids.length);

    for (const fragment of levelEightGeometry.argumentFragments) {
      expect(fragment.text.length).toBeGreaterThan(0);
      expect(fragment.width).toBeGreaterThan(0);
      expect(fragment.height).toBeGreaterThan(0);
      expect(fragment.x).toBeGreaterThanOrEqual(0);
      expect(fragment.y).toBeGreaterThanOrEqual(0);
    }
  });

  it("has one exit targeting PuzzleScene level 8", () => {
    expect(levelEightGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelEightGeometry.exit.targetLevelId).toBe(8);
  });

  it("keeps Level 8 target duration in the updated intended range", () => {
    const levelEight = levels.find((level) => level.id === 8);

    expect(levelEight?.targetDurationSeconds).toEqual({ min: 100, max: 130 });
  });
});

describe("Level 9 platformer geometry", () => {
  it("exists for The Rooftops Before the Verdict", () => {
    expect(levelNineGeometry.levelId).toBe(9);
    expect(levelNineGeometry.title).toBe("The Rooftops Before the Verdict");
  });

  it("has a player spawn and positive world dimensions", () => {
    expect(levelNineGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelNineGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelNineGeometry.worldWidth).toBeGreaterThanOrEqual(9000);
    expect(levelNineGeometry.worldHeight).toBeGreaterThanOrEqual(1400);
  });

  it("has checkpoints for the rooftop, ascent, and final court route", () => {
    expect(levelNineGeometry.checkpoints.length).toBeGreaterThanOrEqual(3);
    expect(levelNineGeometry.checkpoints.map((checkpoint) => checkpoint.id)).toContain("ch6_final_court_checkpoint_zone");
    expect(levelNineGeometry.checkpoints.find((checkpoint) => checkpoint.id === "third-rooftop-checkpoint-zone")).toMatchObject({
      respawnX: 6920,
      respawnY: 616
    });
  });

  it("keeps the Bake-5 Chapter 6 layout canonical without the dev override", () => {
    const platformIds = levelNineGeometry.platforms.map((platform) => platform.id);
    const movingPlatformsById = new Map(levelNineGeometry.movingPlatforms.map((platform) => [platform.id, platform]));
    const checkpointsById = new Map(levelNineGeometry.checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
    const validation = validatePlatformerGeometry(levelNineGeometry, { activeChapterId: 6 });

    expect(platformIds).toEqual(
      expect.arrayContaining([
        "rooftop-start",
        "ch6_rooftop_climb_low",
        "ch6_rooftop_climb_high",
        "first-rooftop-checkpoint",
        "ch6_lower_roof_gap",
        "ch6_clue_memory_balcony",
        "ch6_final_court_landing",
        "ch6_heart_seal_platform",
        "ch6_final_door_platform"
      ])
    );
    expect(platformIds).not.toContain("ch6_rooftop_climb_mid");
    expect(platformIds).not.toContain("ch6_upper_skyline_path");
    expect(movingPlatformsById.get("final-rooftop-lift")).toMatchObject({
      x: 4379,
      y: 540,
      width: 112,
      height: 18,
      fromX: 4379,
      toX: 4539,
      speed: 26
    });
    expect(movingPlatformsById.get("ch6_elevator_01")).toMatchObject({ x: 7150, width: 280, speed: 20 });
    expect(movingPlatformsById.get("ch6_elevator_02")).toMatchObject({ x: 7800, width: 330, speed: 20 });
    expect(checkpointsById.get("first-rooftop-checkpoint-zone")).toMatchObject({ x: 2830, respawnX: 2860 });
    expect(checkpointsById.get("third-rooftop-checkpoint-zone")).toMatchObject({ x: 6894, respawnX: 6920 });
    expect(levelNineGeometry.exit).toMatchObject({ targetScene: "PuzzleScene", targetLevelId: 9 });
    expect(validation.errors).toBe(0);
    expect(validation.warnings).toBe(0);
  });

  it("turns the finale opening into a real rooftop climb with a later descent", () => {
    const start = levelNineGeometry.platforms.find((platform) => platform.id === "rooftop-start");
    const low = levelNineGeometry.platforms.find((platform) => platform.id === "ch6_rooftop_climb_low");
    const high = levelNineGeometry.platforms.find((platform) => platform.id === "ch6_rooftop_climb_high");
    const checkpoint = levelNineGeometry.platforms.find((platform) => platform.id === "first-rooftop-checkpoint");
    const rebuiltBridge = levelNineGeometry.rebuildGroups.find((group) => group.id === "rooftop-bridge");
    const drop = levelNineGeometry.platforms.find((platform) => platform.id === "ch6_lower_roof_gap");

    expect(start).toBeDefined();
    expect(low).toBeDefined();
    expect(high).toBeDefined();
    expect(checkpoint).toBeDefined();
    expect(rebuiltBridge).toBeDefined();
    expect(drop).toBeDefined();
    expect(getPlatformVerticalSpread(levelNineGeometry.platforms)).toBeGreaterThanOrEqual(800);
    expect(start!.y - high!.y).toBeGreaterThanOrEqual(400);
    expect(low!.y).toBeGreaterThan(high!.y);
    expect(drop!.y).toBeGreaterThan(checkpoint!.y);
    expect(rebuiltBridge!.trigger.y).toBeLessThan(checkpoint!.y);
  });

  it("has exactly one required Unfinished Letter exhibit", () => {
    const requiredExhibits = levelNineGeometry.exhibits.filter((exhibit) => exhibit.required);

    expect(requiredExhibits).toHaveLength(1);
    expect(requiredExhibits[0]?.name).toBe("The Unfinished Letter");
  });

  it("reuses at least three prior mechanic families", () => {
    const reusedFamilies = [
      levelNineGeometry.movingPlatforms.length > 0,
      levelNineGeometry.rebuildGroups.length > 0,
      levelNineGeometry.lanternSwitches.length > 0 && levelNineGeometry.lightRevealGroups.length > 0,
      levelNineGeometry.archiveKeys.length > 0 || levelNineGeometry.archiveDoors.length > 0,
      levelNineGeometry.choiceDoors.length > 0
    ].filter(Boolean);

    expect(reusedFamilies.length).toBeGreaterThanOrEqual(3);
  });

  it("has valid moving platform data", () => {
    expect(levelNineGeometry.movingPlatforms.length).toBeGreaterThanOrEqual(2);

    for (const platform of levelNineGeometry.movingPlatforms) {
      expect(platform.width).toBeGreaterThanOrEqual(96);
      expect(platform.height).toBeGreaterThan(0);
      expect(platform.speed).toBeGreaterThan(0);
      expect(platform.speed).toBeLessThanOrEqual(44);

      if ((platform.axis ?? "horizontal") === "vertical") {
        expect(platform.toY ?? platform.y).toBeGreaterThan(platform.fromY ?? platform.y);
      } else {
        expect(platform.toX ?? platform.x).toBeGreaterThan(platform.fromX ?? platform.x);
      }
    }
  });

  it("adds forgiving Chapter 6 floating elevators for the final ascent", () => {
    const chapterSixElevators = levelNineGeometry.movingPlatforms.filter((platform) =>
      platform.id.startsWith("ch6_elevator_")
    );

    expect(chapterSixElevators.length).toBeGreaterThanOrEqual(2);
    for (const elevator of chapterSixElevators) {
      expect(elevator.axis).toBe("vertical");
      expect(elevator.width).toBeGreaterThanOrEqual(280);
      expect(elevator.speed).toBeLessThanOrEqual(22);
      expect(elevator.toY ?? elevator.y).toBeGreaterThan(elevator.fromY ?? elevator.y);
    }
  });

  it("has valid rebuild trigger and platform data", () => {
    const rebuildablePlatforms = levelNineGeometry.rebuildGroups.flatMap((group) => group.platforms);

    expect(levelNineGeometry.rebuildGroups.length).toBeGreaterThanOrEqual(1);
    expect(rebuildablePlatforms.length).toBeGreaterThanOrEqual(2);

    for (const group of levelNineGeometry.rebuildGroups) {
      expect(group.trigger.groupId).toBe(group.id);
      expect(group.trigger.message.length).toBeGreaterThan(0);

      for (const platform of group.platforms) {
        expect(platform.groupId).toBe(group.id);
        expect(platform.width).toBeGreaterThan(0);
        expect(platform.height).toBeGreaterThan(0);
      }
    }
  });

  it("has valid lantern switch and light reveal data", () => {
    const groupIds = new Set(levelNineGeometry.lightRevealGroups.map((group) => group.id));
    const revealedPlatforms = levelNineGeometry.lightRevealGroups.flatMap((group) => group.platforms);

    expect(levelNineGeometry.lanternSwitches.length).toBeGreaterThanOrEqual(2);
    expect(revealedPlatforms.length).toBeGreaterThanOrEqual(3);

    for (const lantern of levelNineGeometry.lanternSwitches) {
      expect(groupIds.has(lantern.revealGroupId)).toBe(true);
      expect(lantern.feedbackMessage.length).toBeGreaterThan(0);
    }

    for (const group of levelNineGeometry.lightRevealGroups) {
      for (const platform of group.platforms) {
        expect(platform.groupId).toBe(group.id);
        expect(platform.width).toBeGreaterThan(0);
        expect(platform.height).toBeGreaterThan(0);
      }
    }
  });

  it("extends Chapter 6 into final court and heart-seal continuity", () => {
    const platformIds = levelNineGeometry.platforms.map((platform) => platform.id);
    const decorationIds = levelNineGeometry.decorations.map((decoration) => decoration.id);
    const hintText = levelNineGeometry.tutorialHints.map((hint) => hint.text).join(" ");

    expect(platformIds).toEqual(
      expect.arrayContaining([
        "ch6_lower_roof_parapet",
        "ch6_rooftop_climb_high",
        "first-rooftop-checkpoint",
        "ch6_lower_roof_gap",
        "ch6_final_court_threshold",
        "ch6_clue_memory_balcony",
        "ch6_final_court_landing",
        "ch6_heart_seal_platform",
        "ch6_final_door_platform"
      ])
    );
    expect(decorationIds).toEqual(expect.arrayContaining(["ch6_heart_seal", "ch6_final_door_aura"]));
    expect(hintText).toContain("blue ribbon released the letter");
    expect(hintText).toContain("final court");
    expect(hintText).toContain("heart");
  });

  it("keeps required Chapter 6 letter, memory, final-court, checkpoint, and exit objects supported", () => {
    const requiredLetter = levelNineGeometry.exhibits.find((exhibit) => exhibit.required);
    const rebuildTrigger = levelNineGeometry.rebuildGroups.find((group) => group.id === "rooftop-bridge")?.trigger;
    const cityLantern = levelNineGeometry.lanternSwitches.find((lantern) => lantern.id === "city-light-lantern");
    const verdictLantern = levelNineGeometry.lanternSwitches.find((lantern) => lantern.id === "verdict-lantern");
    const memoryMarkers = levelNineGeometry.argumentFragments.filter((fragment) =>
      fragment.id.startsWith("ch6_clue_marker_")
    );
    const heartSeal = levelNineGeometry.decorations.find((decoration) => decoration.id === "ch6_heart_seal");
    const finalDoorAura = levelNineGeometry.decorations.find((decoration) => decoration.id === "ch6_final_door_aura");

    expect(requiredLetter).toBeDefined();
    expect(rebuildTrigger).toBeDefined();
    expect(cityLantern).toBeDefined();
    expect(verdictLantern).toBeDefined();
    expect(memoryMarkers.length).toBeGreaterThanOrEqual(6);
    expect(heartSeal).toBeDefined();
    expect(finalDoorAura).toBeDefined();
    expect(hasSafeStaticSupport(requiredLetter!, levelNineGeometry.platforms)).toBe(true);
    expect(hasSafeStaticSupport(rebuildTrigger!, levelNineGeometry.platforms, { maxVerticalGap: 80 })).toBe(true);
    expect(hasSafeStaticSupport(cityLantern!, levelNineGeometry.platforms, { maxVerticalGap: 12 })).toBe(true);
    expect(hasSafeStaticSupport(verdictLantern!, levelNineGeometry.platforms, { maxVerticalGap: 12 })).toBe(true);
    expect(hasSafeStaticSupport(heartSeal!, levelNineGeometry.platforms, { maxVerticalGap: 40 })).toBe(true);
    expect(hasSafeStaticSupport(finalDoorAura!, levelNineGeometry.platforms, { maxVerticalGap: 24 })).toBe(true);
    expect(hasSafeStaticSupport(levelNineGeometry.exit, levelNineGeometry.platforms, { maxVerticalGap: 12 })).toBe(true);

    for (const marker of memoryMarkers) {
      expect(hasSafeStaticSupport(marker, levelNineGeometry.platforms)).toBe(true);
    }

    for (const checkpoint of levelNineGeometry.checkpoints) {
      expect(
        hasSafeStaticSupport(
          playerRectAt(checkpoint.respawnX, checkpoint.respawnY),
          levelNineGeometry.platforms,
        ),
      ).toBe(true);
    }
  });

  it("adds optional clue memory markers without changing required collection", () => {
    const markerFragments = levelNineGeometry.argumentFragments.filter((fragment) =>
      fragment.id.startsWith("ch6_clue_marker_")
    );
    const decorationMarkers = levelNineGeometry.decorations.filter((decoration) =>
      decoration.id.startsWith("ch6_clue_marker_")
    );
    const markerText = markerFragments.map((fragment) => fragment.text).join(" ");

    expect(markerFragments.length).toBeGreaterThanOrEqual(6);
    expect(decorationMarkers.length).toBeGreaterThanOrEqual(5);
    expect(markerText).toContain("Envelope");
    expect(markerText).toContain("Witness Note");
    expect(markerText).toContain("Silver Key");
    expect(markerText).toContain("Blue Ribbon");
    expect(markerText).toContain("freely given");
  });

  it("has one exit targeting PuzzleScene level 9", () => {
    expect(levelNineGeometry.exit.id).toBe("ch6_final_door");
    expect(levelNineGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelNineGeometry.exit.targetLevelId).toBe(9);
  });

  it("keeps Level 9 target duration in the updated intended range", () => {
    const levelNine = levels.find((level) => level.id === 9);

    expect(levelNine?.targetDurationSeconds).toEqual({ min: 120, max: 150 });
  });
});

describe("Level 10 platformer geometry", () => {
  it("exists for The Court of the Heart", () => {
    expect(levelTenGeometry.levelId).toBe(10);
    expect(levelTenGeometry.title).toBe("The Court of the Heart");
  });

  it("has a player spawn and positive world dimensions", () => {
    expect(levelTenGeometry.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(levelTenGeometry.playerSpawn.y).toBeGreaterThanOrEqual(0);
    expect(levelTenGeometry.worldWidth).toBeGreaterThan(0);
    expect(levelTenGeometry.worldHeight).toBeGreaterThan(0);
  });

  it("has two checkpoints for the ceremonial finale route", () => {
    expect(levelTenGeometry.checkpoints.length).toBeGreaterThanOrEqual(2);
  });

  it("has exactly one required Heart Seal exhibit", () => {
    const requiredExhibits = levelTenGeometry.exhibits.filter((exhibit) => exhibit.required);

    expect(requiredExhibits).toHaveLength(1);
    expect(requiredExhibits[0]?.name).toBe("The Heart Seal");
  });

  it("reuses familiar mechanics lightly", () => {
    const reusedFamilies = [
      levelTenGeometry.movingPlatforms.length > 0,
      levelTenGeometry.rebuildGroups.length > 0,
      levelTenGeometry.lanternSwitches.length > 0 && levelTenGeometry.lightRevealGroups.length > 0
    ].filter(Boolean);

    expect(reusedFamilies.length).toBeGreaterThanOrEqual(1);
    expect(levelTenGeometry.movingPlatforms.length).toBeGreaterThanOrEqual(1);
    expect(levelTenGeometry.rebuildGroups.length).toBeGreaterThanOrEqual(1);
    expect(levelTenGeometry.lanternSwitches.length).toBeGreaterThanOrEqual(1);
  });

  it("has valid moving platform data for the finale", () => {
    for (const platform of levelTenGeometry.movingPlatforms) {
      expect(platform.width).toBeGreaterThanOrEqual(260);
      expect(platform.height).toBeGreaterThan(0);
      expect(platform.axis ?? "horizontal").toBe("horizontal");
      expect(platform.toX ?? platform.x).toBeGreaterThan(platform.fromX ?? platform.x);
      expect(platform.speed).toBeGreaterThan(0);
      expect(platform.speed).toBeLessThanOrEqual(38);
    }
  });

  it("has valid finale rebuild and light reveal data", () => {
    const lightGroupIds = new Set(levelTenGeometry.lightRevealGroups.map((group) => group.id));

    for (const group of levelTenGeometry.rebuildGroups) {
      expect(group.trigger.groupId).toBe(group.id);
      expect(group.trigger.message.length).toBeGreaterThan(0);
      expect(group.platforms.length).toBeGreaterThan(0);
    }

    for (const lantern of levelTenGeometry.lanternSwitches) {
      expect(lightGroupIds.has(lantern.revealGroupId)).toBe(true);
      expect(lantern.feedbackMessage.length).toBeGreaterThan(0);
    }
  });

  it("has non-required previous-exhibit memory markers with unique ids", () => {
    const markers = levelTenGeometry.tutorialHints.filter((hint) => hint.id.startsWith("memory-"));
    const markerIds = markers.map((marker) => marker.id);

    expect(markers.length).toBeGreaterThanOrEqual(9);
    expect(new Set(markerIds).size).toBe(markerIds.length);

    for (const marker of markers) {
      expect(marker.text.length).toBeGreaterThan(0);
      expect(marker.x).toBeGreaterThanOrEqual(0);
      expect(marker.y).toBeGreaterThanOrEqual(0);
      expect(marker.text.toLowerCase()).not.toContain("private");
    }
  });

  it("has one exit targeting PuzzleScene level 10", () => {
    expect(levelTenGeometry.exit.targetScene).toBe("PuzzleScene");
    expect(levelTenGeometry.exit.targetLevelId).toBe(10);
  });

  it("keeps Level 10 target duration in the intended finale range", () => {
    const levelTen = levels.find((level) => level.id === 10);

    expect(levelTen?.targetDurationSeconds).toEqual({ min: 120, max: 150 });
  });
});
