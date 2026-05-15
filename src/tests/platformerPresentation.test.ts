import { describe, expect, it } from "vitest";
import { levelOneGeometry, levelSixGeometry } from "../game/platformer/levelGeometry";
import {
  COYOTE_TIME_MS,
  GRAVITY_Y,
  JUMP_BUFFER_MS,
  JUMP_SPEED,
  PLAYER_HEIGHT,
  PLAYER_INTERACTION_HEIGHT,
  PLAYER_INTERACTION_WIDTH,
  PLAYER_SPEED,
  PLAYER_WIDTH
} from "../game/platformer/constants";
import { getPlayerInteractionZoneCenter } from "../game/platformer/playerInteraction";
import {
  getPlayerSpriteAssets,
  listExpectedPlayerSpriteFilenames,
  PLAYER_SPRITE_CROPS,
  PLAYER_SPRITE_DISPLAY_HEIGHT,
  PLAYER_SPRITE_FILENAMES,
  PLAYER_SPRITE_FOOT_OFFSET_Y,
  PLAYER_SPRITE_MIN_DISPLAY_WIDTH,
  PLAYER_SPRITE_SCALE_X,
  PLAYER_SPRITE_TRANSPARENCY_APPROVED
} from "../game/platformer/playerSpriteAssets";
import { PLAYER_WORLD_LABELS_VISIBLE, PLATFORMER_PLAYER_HUD_POLICY } from "../game/platformer/presentationPolicy";
import {
  ACTIVE_PLATFORMER_THEME_LEVEL_IDS,
  getPlatformerThemeAssets,
  listExpectedPlatformerThemeFilenames,
  SHARED_CHECKPOINT_MARKER_FILENAMES
} from "../game/platformer/platformerThemeAssets";

describe("platformer clean player presentation", () => {
  it("hides persistent player-facing labels while preserving geometry label data for dev tools", () => {
    expect(PLAYER_WORLD_LABELS_VISIBLE).toBe(false);
    expect(PLATFORMER_PLAYER_HUD_POLICY.showPersistentControlHint).toBe(false);
    expect(PLATFORMER_PLAYER_HUD_POLICY.showPersistentSoundStatus).toBe(false);

    expect(levelOneGeometry.platforms.some((platform) => Boolean(platform.label))).toBe(true);
    expect(levelSixGeometry.choiceDoors.map((door) => door.label)).toEqual(
      expect.arrayContaining(["Doubt", "Hope", "Fear", "Trust", "Distance"])
    );
  });
});

describe("platformer Maria sprite visual companion", () => {
  it("lists the standalone Maria sprite images while preserving movement constants", () => {
    expect(listExpectedPlayerSpriteFilenames()).toEqual(["maria-idle.png", "maria-walk.png", "maria-jump.png"]);
    expect(PLAYER_SPRITE_FILENAMES).toEqual({
      idle: "maria-idle.png",
      walk: "maria-walk.png",
      jump: "maria-jump.png"
    });
    expect(PLAYER_SPRITE_DISPLAY_HEIGHT).toBeGreaterThan(PLAYER_HEIGHT);
    expect(PLAYER_SPRITE_DISPLAY_HEIGHT).toBeGreaterThanOrEqual(150);
    expect(PLAYER_SPRITE_DISPLAY_HEIGHT).toBeLessThanOrEqual(170);
    expect(PLAYER_SPRITE_SCALE_X).toBeGreaterThanOrEqual(1.1);
    expect(PLAYER_SPRITE_SCALE_X).toBeLessThanOrEqual(1.18);
    expect(PLAYER_SPRITE_MIN_DISPLAY_WIDTH).toBeGreaterThan(PLAYER_WIDTH);
    expect(PLAYER_SPRITE_FOOT_OFFSET_Y).toBeGreaterThanOrEqual(0);
    expect(PLAYER_SPRITE_FOOT_OFFSET_Y).toBeLessThanOrEqual(10);
    expect(PLAYER_SPRITE_CROPS.idle.height).toBeGreaterThan(PLAYER_SPRITE_CROPS.idle.width);

    expect(PLAYER_WIDTH).toBe(44);
    expect(PLAYER_HEIGHT).toBe(72);
    expect(PLAYER_INTERACTION_WIDTH).toBeGreaterThan(PLAYER_WIDTH);
    expect(PLAYER_INTERACTION_HEIGHT).toBeGreaterThan(PLAYER_HEIGHT);
    expect(PLAYER_SPEED).toBe(235);
    expect(JUMP_SPEED).toBe(470);
    expect(GRAVITY_Y).toBe(1040);
    expect(COYOTE_TIME_MS).toBe(120);
    expect(JUMP_BUFFER_MS).toBe(140);
  });

  it("keeps pickup reach separate from the platform collision body", () => {
    const center = getPlayerInteractionZoneCenter(240, 420);

    expect(PLAYER_INTERACTION_WIDTH).toBe(86);
    expect(PLAYER_INTERACTION_HEIGHT).toBe(112);
    expect(center.x).toBe(240);
    expect(center.y).toBe(420 + PLAYER_HEIGHT / 2 - PLAYER_INTERACTION_HEIGHT / 2);
    expect(center.y).toBeLessThan(420);
  });

  it("falls back to the rectangle player when Maria sprites are missing", () => {
    const assets = getPlayerSpriteAssets({}, true);

    expect(assets.idle.filename).toBe("maria-idle.png");
    expect(assets.idle.imageUrl).toBeUndefined();
    expect(assets.walk.imageUrl).toBeUndefined();
    expect(assets.jump.imageUrl).toBeUndefined();
    expect(assets.isUsable).toBe(false);
  });

  it("activates checked-in Maria sprites after transparency approval", () => {
    const assets = getPlayerSpriteAssets({
      "../../assets/final/platformer/player/maria-idle.png": "/assets/maria-idle.png",
      "../../assets/final/platformer/player/maria-walk.png": "/assets/maria-walk.png",
      "../../assets/final/platformer/player/maria-jump.png": "/assets/maria-jump.png"
    });

    expect(PLAYER_SPRITE_TRANSPARENCY_APPROVED).toBe(true);
    expect(assets.idle.imageUrl).toBe("/assets/maria-idle.png");
    expect(assets.walk.imageUrl).toBe("/assets/maria-walk.png");
    expect(assets.jump.imageUrl).toBe("/assets/maria-jump.png");
    expect(assets.isUsable).toBe(true);
  });

  it("can activate Maria sprites once transparent exports are approved", () => {
    const assets = getPlayerSpriteAssets(
      {
        "../../assets/final/platformer/player/maria-idle.png": "/assets/maria-idle.png",
        "../../assets/final/platformer/player/maria-walk.png": "/assets/maria-walk.png",
        "../../assets/final/platformer/player/maria-jump.png": "/assets/maria-jump.png"
      },
      true
    );

    expect(assets.isUsable).toBe(true);
  });
});

describe("platformer final art theme registry", () => {
  it("defines optional theme entries for the active six runtime levels", () => {
    expect(ACTIVE_PLATFORMER_THEME_LEVEL_IDS).toEqual([1, 2, 4, 5, 6, 9]);

    for (const levelId of ACTIVE_PLATFORMER_THEME_LEVEL_IDS) {
      const theme = getPlatformerThemeAssets(levelId);

      expect(theme?.levelId).toBe(levelId);
      expect(theme?.background?.filename).toMatch(/^chapter\d\d-platformer-bg\.webp$/);
      expect(theme?.exitDoor?.filename).toMatch(/^chapter\d\d-exit-.+\.webp$/);
    }
  });

  it("lists future filenames without requiring the files to exist yet", () => {
    expect(listExpectedPlatformerThemeFilenames()).toEqual(
      expect.arrayContaining([
        "chapter01-platformer-bg.webp",
        "chapter01-platform-static-paper.webp",
        "chapter01-platform-moving-elevator.webp",
        "chapter01-clue-envelope.webp",
        "chapter01-exit-case-door.webp",
        "checkpoint-marker-brass.png",
        "checkpoint-marker-brass.webp",
        "chapter02-platformer-bg.webp",
        "chapter02-platform-moving-tram.webp",
        "chapter03-clue-witness-note.webp",
        "chapter04-clue-silver-key.webp",
        "chapter05-lantern-switch.webp",
        "chapter06-exit-final-court-door.webp"
      ])
    );
  });

  it("maps the shared checkpoint marker across active runtime levels with PNG preferred over WebP", () => {
    expect(SHARED_CHECKPOINT_MARKER_FILENAMES).toEqual(["checkpoint-marker-brass.png", "checkpoint-marker-brass.webp"]);

    for (const levelId of ACTIVE_PLATFORMER_THEME_LEVEL_IDS) {
      const pngTheme = getPlatformerThemeAssets(levelId, {
        "../../assets/final/platformer/checkpoint-marker-brass.png": "/assets/checkpoint-marker-brass.png",
        "../../assets/final/platformer/checkpoint-marker-brass.webp": "/assets/checkpoint-marker-brass.webp"
      });
      const webpTheme = getPlatformerThemeAssets(levelId, {
        "../../assets/final/platformer/checkpoint-marker-brass.webp": "/assets/checkpoint-marker-brass.webp"
      });

      expect(pngTheme?.checkpoint?.filename).toBe("checkpoint-marker-brass.png");
      expect(pngTheme?.checkpoint?.imageUrl).toBe("/assets/checkpoint-marker-brass.png");
      expect(webpTheme?.checkpoint?.filename).toBe("checkpoint-marker-brass.webp");
      expect(webpTheme?.checkpoint?.imageUrl).toBe("/assets/checkpoint-marker-brass.webp");
    }
  });

  it("treats missing platformer final art as a safe fallback", () => {
    const theme = getPlatformerThemeAssets(1, {});

    expect(theme?.background?.filename).toBe("chapter01-platformer-bg.webp");
    expect(theme?.background?.imageUrl).toBeUndefined();
    expect(theme?.staticPlatforms.paper?.imageUrl).toBeUndefined();
    expect(theme?.movingPlatforms.elevator?.imageUrl).toBeUndefined();
    expect(theme?.clues.primary?.imageUrl).toBeUndefined();
    expect(theme?.checkpoint?.imageUrl).toBeUndefined();
  });

  it("resolves Vite asset URLs only when matching files are present", () => {
    const theme = getPlatformerThemeAssets(1, {
      "../../assets/final/platformer/chapter01-platformer-bg.webp": "/assets/chapter01-platformer-bg.webp",
      "../../assets/final/platformer/chapter01-clue-envelope.webp": "/assets/chapter01-clue-envelope.webp"
    });

    expect(theme?.background?.imageUrl).toBe("/assets/chapter01-platformer-bg.webp");
    expect(theme?.clues.primary?.imageUrl).toBe("/assets/chapter01-clue-envelope.webp");
    expect(theme?.exitDoor?.imageUrl).toBeUndefined();
  });

  it("resolves the Chapter 1 vertical-slice platformer art when files are present", () => {
    const theme = getPlatformerThemeAssets(1);

    expect(theme?.background?.imageUrl).toContain("chapter01-platformer-bg.webp");
    expect(theme?.staticPlatforms.paper?.imageUrl).toContain("chapter01-platform-static-paper.webp");
    expect(theme?.movingPlatforms.elevator?.imageUrl).toContain("chapter01-platform-moving-elevator.webp");
    expect(theme?.clues.primary?.imageUrl).toContain("chapter01-clue-envelope.webp");
    expect(theme?.exitDoor?.imageUrl).toContain("chapter01-exit-case-door.webp");
    expect(theme?.checkpoint?.filename).toBe("checkpoint-marker-brass.webp");
    expect(theme?.checkpoint?.imageUrl).toContain("checkpoint-marker-brass.webp");
  });

  it("resolves the Chapter 2 hidden-wall platformer art when files are present", () => {
    const theme = getPlatformerThemeAssets(2);

    expect(theme?.background?.imageUrl).toContain("chapter02-platformer-bg.webp");
    expect(theme?.clues.primary?.imageUrl).toContain("chapter02-clue-stamp.webp");
    expect(theme?.exitDoor?.imageUrl).toContain("chapter02-exit-hidden-wall.webp");
    expect(theme?.staticPlatforms.brick?.imageUrl).toBeUndefined();
    expect(theme?.movingPlatforms.tram?.imageUrl).toBeUndefined();
    expect(theme?.checkpoint?.filename).toBe("checkpoint-marker-brass.webp");
    expect(theme?.checkpoint?.imageUrl).toContain("checkpoint-marker-brass.webp");
  });

  it("resolves the Chapter 3 Vistula platformer art when files are present", () => {
    const theme = getPlatformerThemeAssets(4);

    expect(theme?.background?.imageUrl).toContain("chapter03-platformer-bg.webp");
    expect(theme?.clues.primary?.imageUrl).toContain("chapter03-clue-witness-note.webp");
    expect(theme?.exitDoor?.imageUrl).toContain("chapter03-exit-archive-code.webp");
    expect(theme?.staticPlatforms.scaffold?.imageUrl).toBeUndefined();
    expect(theme?.movingPlatforms.paper?.imageUrl).toBeUndefined();
    expect(theme?.checkpoint?.filename).toBe("checkpoint-marker-brass.webp");
    expect(theme?.checkpoint?.imageUrl).toContain("checkpoint-marker-brass.webp");
  });

  it("resolves the Chapter 4 archive platformer art when files are present", () => {
    const theme = getPlatformerThemeAssets(5);

    expect(theme?.background?.imageUrl).toContain("chapter04-platformer-bg.webp");
    expect(theme?.clues.primary?.imageUrl).toContain("chapter04-clue-marginal-note.webp");
    expect(theme?.clues.secondary?.imageUrl).toContain("chapter04-clue-silver-key.webp");
    expect(theme?.exitDoor?.imageUrl).toContain("chapter04-exit-archive-door.webp");
    expect(theme?.staticPlatforms.folder?.imageUrl).toBeUndefined();
    expect(theme?.movingPlatforms.elevator?.imageUrl).toBeUndefined();
    expect(theme?.movingPlatforms.paper?.imageUrl).toBeUndefined();
    expect(theme?.checkpoint?.filename).toBe("checkpoint-marker-brass.webp");
    expect(theme?.checkpoint?.imageUrl).toContain("checkpoint-marker-brass.webp");
  });

  it("resolves the Chapter 5 courthouse platformer art when files are present", () => {
    const theme = getPlatformerThemeAssets(6);

    expect(theme?.background?.imageUrl).toContain("chapter05-platformer-bg.webp");
    expect(theme?.clues.primary?.imageUrl).toContain("chapter05-clue-blue-ribbon.webp");
    expect(theme?.interactables.lanternSwitch?.imageUrl).toContain("chapter05-lantern-switch.webp");
    expect(theme?.exitDoor?.imageUrl).toContain("chapter05-exit-trust-door.webp");
    expect(theme?.staticPlatforms.scaffold?.imageUrl).toBeUndefined();
    expect(theme?.movingPlatforms.elevator?.imageUrl).toBeUndefined();
    expect(theme?.movingPlatforms.paper?.imageUrl).toBeUndefined();
    expect(theme?.checkpoint?.filename).toBe("checkpoint-marker-brass.webp");
    expect(theme?.checkpoint?.imageUrl).toContain("checkpoint-marker-brass.webp");
  });

  it("resolves the Chapter 6 final-court platformer art when files are present", () => {
    const theme = getPlatformerThemeAssets(9);

    expect(theme?.background?.imageUrl).toContain("chapter06-platformer-bg.webp");
    expect(theme?.clues.primary?.imageUrl).toContain("chapter06-clue-heart-fragment.webp");
    expect(theme?.exitDoor?.imageUrl).toContain("chapter06-exit-final-court-door.webp");
    expect(theme?.staticPlatforms.scaffold?.imageUrl).toBeUndefined();
    expect(theme?.movingPlatforms.elevator?.imageUrl).toBeUndefined();
    expect(theme?.movingPlatforms.paper?.imageUrl).toBeUndefined();
    expect(theme?.checkpoint?.filename).toBe("checkpoint-marker-brass.webp");
    expect(theme?.checkpoint?.imageUrl).toContain("checkpoint-marker-brass.webp");
  });
});
