import Phaser from "phaser";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import { PLATFORM_COLORS, PLAYER_HEIGHT, PLAYER_INTERACTION_HEIGHT, PLAYER_INTERACTION_WIDTH, PLAYER_WIDTH } from "./constants";
import { getPlayerInteractionZoneCenter } from "./playerInteraction";
import { PLAYER_WORLD_LABELS_VISIBLE } from "./presentationPolicy";
import { getPlatformerThemeAssets, type PlatformerThemeAsset, type PlatformerThemeAssets } from "./platformerThemeAssets";
import type {
  ArgumentFragmentSpec,
  ArchiveDoorSpec,
  ArchiveKeySpec,
  CheckpointSpec,
  ChoiceDoorSpec,
  EchoFragmentSpec,
  ExhibitSpec,
  ExitSpec,
  LanternSwitchSpec,
  LightRevealedPlatformSpec,
  MovingPlatformSpec,
  PlatformSpec,
  PlatformerLevelGeometry,
  QuietEvidenceFragmentSpec,
  RebuildGroupSpec,
  RebuildTriggerSpec,
  RebuildablePlatformSpec,
  TinyDetailNoteSpec,
  WitnessFragmentSpec
} from "./levelGeometry";

type PlatformerSkin = Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle | Phaser.GameObjects.Container;

export interface MovingPlatformRuntime {
  spec: MovingPlatformSpec;
  body: Phaser.GameObjects.Rectangle;
  direction: 1 | -1;
  skin?: PlatformerSkin;
}

export interface RebuildablePlatformRuntime {
  spec: RebuildablePlatformSpec;
  body: Phaser.GameObjects.Rectangle;
  skin?: PlatformerSkin;
}

export interface RebuildTriggerRuntime {
  spec: RebuildTriggerSpec;
  zone: Phaser.GameObjects.Zone;
  marker: Phaser.GameObjects.Rectangle;
}

export interface WitnessFragmentRuntime {
  spec: WitnessFragmentSpec;
  body: Phaser.GameObjects.Rectangle;
  skin?: Phaser.GameObjects.Image;
}

export interface TinyDetailNoteRuntime {
  spec: TinyDetailNoteSpec;
  body: Phaser.GameObjects.Rectangle;
  skin?: Phaser.GameObjects.Image;
}

export interface ArchiveKeyRuntime {
  spec: ArchiveKeySpec;
  body: Phaser.GameObjects.Rectangle;
  skin?: Phaser.GameObjects.Image;
}

export interface ArchiveDoorRuntime {
  spec: ArchiveDoorSpec;
  body: Phaser.GameObjects.Rectangle;
  skin?: Phaser.GameObjects.Image;
}

export interface ChoiceDoorRuntime {
  spec: ChoiceDoorSpec;
  zone: Phaser.GameObjects.Zone;
  marker: Phaser.GameObjects.Rectangle;
}

export interface EchoFragmentRuntime {
  spec: EchoFragmentSpec;
  body: Phaser.GameObjects.Rectangle;
  skin?: Phaser.GameObjects.Image;
}

export interface LanternSwitchRuntime {
  spec: LanternSwitchSpec;
  zone: Phaser.GameObjects.Zone;
  marker: Phaser.GameObjects.Rectangle;
  skin?: Phaser.GameObjects.Image;
}

export interface LightRevealedPlatformRuntime {
  spec: LightRevealedPlatformSpec;
  body: Phaser.GameObjects.Rectangle;
  skin?: PlatformerSkin;
}

export interface QuietEvidenceFragmentRuntime {
  spec: QuietEvidenceFragmentSpec;
  body: Phaser.GameObjects.Rectangle;
  skin?: Phaser.GameObjects.Image;
}

export interface ArgumentFragmentRuntime {
  spec: ArgumentFragmentSpec;
  body: Phaser.GameObjects.Rectangle;
  skin?: Phaser.GameObjects.Image;
}

export interface BuiltPlatformerLevel {
  platforms: Phaser.GameObjects.Rectangle[];
  movingPlatforms: MovingPlatformRuntime[];
  rebuildablePlatforms: RebuildablePlatformRuntime[];
  rebuildTriggers: RebuildTriggerRuntime[];
  witnessFragments: WitnessFragmentRuntime[];
  tinyDetailNotes: TinyDetailNoteRuntime[];
  archiveKeys: ArchiveKeyRuntime[];
  archiveDoors: ArchiveDoorRuntime[];
  choiceDoors: ChoiceDoorRuntime[];
  echoFragments: EchoFragmentRuntime[];
  lanternSwitches: LanternSwitchRuntime[];
  lightRevealedPlatforms: LightRevealedPlatformRuntime[];
  quietEvidenceFragments: QuietEvidenceFragmentRuntime[];
  argumentFragments: ArgumentFragmentRuntime[];
  player: Phaser.GameObjects.Rectangle;
  playerInteractionZone: Phaser.GameObjects.Rectangle;
  exhibit: Phaser.GameObjects.Rectangle;
  exhibitSkin?: Phaser.GameObjects.Image;
  exhibitSpec: ExhibitSpec;
  checkpointZones: Array<{ zone: Phaser.GameObjects.Zone; spec: CheckpointSpec }>;
  exitZone: Phaser.GameObjects.Zone;
  exitSpec: ExitSpec;
}

const PLATFORMER_DEPTHS = {
  background: -100,
  backgroundArt: -90,
  decorativeProp: -40,
  platformSkin: 3,
  primitiveBody: 2,
  interactableSkin: 8,
  player: 20,
  hud: 50
} as const;

interface ImageSkinCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class LevelBuilder {
  private activeTheme?: PlatformerThemeAssets;

  constructor(private readonly scene: Phaser.Scene, theme?: PlatformerThemeAssets) {
    this.activeTheme = theme;
  }

  build(geometry: PlatformerLevelGeometry): BuiltPlatformerLevel {
    this.activeTheme ??= getPlatformerThemeAssets(geometry.levelId);
    this.drawBackdrop(geometry);

    const platforms = geometry.platforms.map((platform) => this.createPlatform(platform));
    const movingPlatforms = geometry.movingPlatforms.map((platform) => this.createMovingPlatform(platform));
    const lightRevealedPlatforms = geometry.lightRevealGroups.flatMap((group) =>
      group.platforms.map((platform) => this.createLightRevealedPlatform(platform))
    );
    const rebuildablePlatforms = geometry.rebuildGroups.flatMap((group) =>
      group.platforms.map((platform) => this.createRebuildablePlatform(platform))
    );
    const rebuildTriggers = geometry.rebuildGroups.map((group) => this.createRebuildTrigger(group));
    this.drawDecorations(geometry);
    this.drawHints(geometry);

    const player = this.scene.add.rectangle(
      geometry.playerSpawn.x,
      geometry.playerSpawn.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      PLATFORM_COLORS.rose
    ).setStrokeStyle(2, PLATFORM_COLORS.gold, 0.78).setDepth(PLATFORMER_DEPTHS.player);
    player.setName("Maria placeholder");
    this.scene.physics.add.existing(player);

    const playerBody = player.body as Phaser.Physics.Arcade.Body;
    playerBody.setSize(PLAYER_WIDTH, PLAYER_HEIGHT);
    playerBody.setCollideWorldBounds(false);

    const interactionCenter = getPlayerInteractionZoneCenter(player.x, player.y);
    const playerInteractionZone = this.scene.add.rectangle(
      interactionCenter.x,
      interactionCenter.y,
      PLAYER_INTERACTION_WIDTH,
      PLAYER_INTERACTION_HEIGHT,
      PLATFORM_COLORS.gold,
      0
    ).setName("Maria interaction reach").setVisible(false);
    this.scene.physics.add.existing(playerInteractionZone);
    const interactionBody = playerInteractionZone.body as Phaser.Physics.Arcade.Body;
    interactionBody.setSize(PLAYER_INTERACTION_WIDTH, PLAYER_INTERACTION_HEIGHT);
    interactionBody.setAllowGravity(false);
    interactionBody.setImmovable(true);

    const exhibitSpec = geometry.exhibits[0];
    const { body: exhibit, skin: exhibitSkin } = this.createExhibit(exhibitSpec);
    const witnessFragments = geometry.witnessFragments.map((fragment) => this.createWitnessFragment(fragment));
    const tinyDetailNotes = geometry.tinyDetailNotes.map((note) => this.createTinyDetailNote(note));
    const archiveKeys = geometry.archiveKeys.map((key) => this.createArchiveKey(key));
    const archiveDoors = geometry.archiveDoors.map((door) => this.createArchiveDoor(door));
    const choiceDoors = geometry.choiceDoors.map((door) => this.createChoiceDoor(door));
    const echoFragments = geometry.echoFragments.map((fragment) => this.createEchoFragment(fragment));
    const lanternSwitches = geometry.lanternSwitches.map((lantern) => this.createLanternSwitch(lantern));
    const quietEvidenceFragments = geometry.quietEvidenceFragments.map((fragment) => this.createQuietEvidenceFragment(fragment));
    const argumentFragments = geometry.argumentFragments.map((fragment) => this.createArgumentFragment(fragment));

    const checkpointZones = geometry.checkpoints.map((checkpoint, index) => {
      this.drawCheckpoint(checkpoint, index + 1);
      return {
        spec: checkpoint,
        zone: this.createZone(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height)
      };
    });
    const exitZone = this.createZone(geometry.exit.x, geometry.exit.y, geometry.exit.width, geometry.exit.height);
    this.drawExit(geometry.exit);

    return {
      platforms,
      movingPlatforms,
      rebuildablePlatforms,
      rebuildTriggers,
      witnessFragments,
      tinyDetailNotes,
      archiveKeys,
      archiveDoors,
      choiceDoors,
      echoFragments,
      lanternSwitches,
      lightRevealedPlatforms,
      quietEvidenceFragments,
      argumentFragments,
      player,
      playerInteractionZone,
      exhibit,
      exhibitSkin,
      exhibitSpec,
      checkpointZones,
      exitZone,
      exitSpec: geometry.exit
    };
  }

  private drawBackdrop(geometry: PlatformerLevelGeometry): void {
    this.scene.add.rectangle(geometry.worldWidth / 2, geometry.worldHeight / 2, geometry.worldWidth, geometry.worldHeight, PLATFORM_COLORS.navy)
      .setDepth(PLATFORMER_DEPTHS.background);
    const backgroundSkin = this.createImageSkin(
      this.activeTheme?.background,
      geometry.worldWidth / 2,
      geometry.worldHeight / 2,
      geometry.worldWidth,
      geometry.worldHeight,
      PLATFORMER_DEPTHS.backgroundArt,
      "cover"
    );
    backgroundSkin?.setName(`platformer-background-skin:${geometry.levelId}`);
    if (this.isChapterOneFinalArtActive()) {
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight / 2,
        geometry.worldWidth,
        geometry.worldHeight,
        PHASER_THEME.midnightNavy,
        0.28
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 1);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight - 58,
        geometry.worldWidth,
        116,
        PHASER_THEME.midnightNavy,
        0.18
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 2);
      return;
    }
    if (this.isChapterTwoFinalArtActive()) {
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight / 2,
        geometry.worldWidth,
        geometry.worldHeight,
        PHASER_THEME.midnightNavy,
        0.34
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 1);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight - 92,
        geometry.worldWidth,
        184,
        PHASER_THEME.deepBlueNavy,
        0.18
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 2);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        94,
        geometry.worldWidth,
        2,
        PHASER_THEME.brassHighlight,
        0.12
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 3);
      return;
    }
    if (this.isChapterThreeFinalArtActive()) {
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight / 2,
        geometry.worldWidth,
        geometry.worldHeight,
        PHASER_THEME.midnightNavy,
        0.32
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 1);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight - 108,
        geometry.worldWidth,
        216,
        PHASER_THEME.deepBlueNavy,
        0.26
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 2);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight - 188,
        geometry.worldWidth,
        3,
        PHASER_THEME.blueRibbon,
        0.12
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 3);
      return;
    }
    if (this.isChapterFourFinalArtActive()) {
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight / 2,
        geometry.worldWidth,
        geometry.worldHeight,
        PHASER_THEME.midnightNavy,
        0.34
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 1);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight - 96,
        geometry.worldWidth,
        192,
        PHASER_THEME.leatherBrown,
        0.22
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 2);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        118,
        geometry.worldWidth,
        3,
        PHASER_THEME.brassHighlight,
        0.12
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 3);
      return;
    }
    if (this.isChapterFiveFinalArtActive()) {
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight / 2,
        geometry.worldWidth,
        geometry.worldHeight,
        PHASER_THEME.midnightNavy,
        0.36
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 1);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight - 120,
        geometry.worldWidth,
        240,
        PHASER_THEME.deepBlueNavy,
        0.24
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 2);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        132,
        geometry.worldWidth,
        3,
        PHASER_THEME.brassHighlight,
        0.12
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 3);
      return;
    }
    if (this.isChapterSixFinalArtActive()) {
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight / 2,
        geometry.worldWidth,
        geometry.worldHeight,
        PHASER_THEME.midnightNavy,
        0.38
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 1);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight - 128,
        geometry.worldWidth,
        256,
        PHASER_THEME.deepBlueNavy,
        0.24
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 2);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        138,
        geometry.worldWidth,
        3,
        PHASER_THEME.brassHighlight,
        0.14
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 3);
      this.scene.add.rectangle(
        geometry.worldWidth / 2,
        geometry.worldHeight - 252,
        geometry.worldWidth,
        2,
        PHASER_THEME.silver,
        0.1
      ).setDepth(PLATFORMER_DEPTHS.backgroundArt + 3);
      return;
    }
    this.scene.add.rectangle(geometry.worldWidth / 2, 42, geometry.worldWidth, 84, PHASER_THEME.midnightNavy, 0.34);
    this.scene.add.rectangle(geometry.worldWidth / 2, geometry.worldHeight - 54, geometry.worldWidth, 108, PHASER_THEME.deepBlueNavy, 0.2);
    this.scene.add.rectangle(geometry.worldWidth / 2, 92, geometry.worldWidth, 2, PLATFORM_COLORS.gold, 0.12);

    for (let x = 84; x < geometry.worldWidth; x += 210) {
      const y = 72 + ((x / 210) % 3) * 28;
      this.scene.add.circle(x, y, 2.5, PLATFORM_COLORS.gold, 0.34);
      this.scene.add.rectangle(x + 46, y + 16, 48, 3, PLATFORM_COLORS.paper, 0.08);
      this.scene.add.circle(x + 98, y + 58, 12, PLATFORM_COLORS.gold, 0.025);
    }

    if (geometry.levelId === 2) {
      this.scene.add.rectangle(geometry.worldWidth / 2, 520, geometry.worldWidth, 4, PLATFORM_COLORS.gold, 0.18);
      this.scene.add.rectangle(geometry.worldWidth / 2, 548, geometry.worldWidth, 2, PLATFORM_COLORS.rose, 0.12);
      for (let x = 120; x < geometry.worldWidth; x += 180) {
        this.scene.add.rectangle(x, 112 + ((x / 180) % 2) * 34, 18, 18, PLATFORM_COLORS.gold, 0.18);
        this.scene.add.rectangle(x + 70, 166, 42, 8, PLATFORM_COLORS.rose, 0.12);
        this.scene.add.circle(x + 24, 520, 5, PLATFORM_COLORS.gold, 0.18);
        this.scene.add.rectangle(x + 18, 452, 58, 122, PHASER_THEME.deepBlueNavy, 0.18);
        this.scene.add.rectangle(x + 18, 426, 64, 4, PLATFORM_COLORS.gold, 0.08);
      }
    } else if (geometry.levelId === 3) {
      for (let x = 110; x < geometry.worldWidth; x += 230) {
        this.scene.add.rectangle(x, 128, 74, 104, PLATFORM_COLORS.paper, 0.1);
        this.scene.add.rectangle(x + 34, 260, 22, 120, PLATFORM_COLORS.gold, 0.12);
        this.scene.add.rectangle(x + 70, 206, 92, 16, PLATFORM_COLORS.brick, 0.16);
        this.scene.add.rectangle(x + 69, 224, 92, 2, PLATFORM_COLORS.gold, 0.12);
        this.scene.add.circle(x + 34, 316, 24, PLATFORM_COLORS.gold, 0.045);
      }
    } else if (geometry.levelId === 4) {
      this.scene.add.rectangle(geometry.worldWidth / 2, 585, geometry.worldWidth, 120, PLATFORM_COLORS.tram, 0.42);
      for (let x = 120; x < geometry.worldWidth; x += 260) {
        this.scene.add.rectangle(x, 150, 18, 18, PLATFORM_COLORS.gold, 0.18);
        this.scene.add.rectangle(x + 70, 560, 130, 6, PLATFORM_COLORS.paper, 0.12);
        this.scene.add.rectangle(x + 130, 222, 112, 14, PLATFORM_COLORS.folder, 0.12);
        this.scene.add.rectangle(x + 94, 584, 120, 3, PLATFORM_COLORS.gold, 0.08);
        this.scene.add.line(x + 26, 472, 0, 0, 154, 46, PLATFORM_COLORS.gold, 0.07).setOrigin(0, 0);
      }
    } else if (geometry.levelId === 5) {
      for (let x = 120; x < geometry.worldWidth; x += 240) {
        this.scene.add.rectangle(x, 122, 86, 230, PLATFORM_COLORS.folder, 0.1);
        this.scene.add.rectangle(x + 42, 188, 66, 10, PLATFORM_COLORS.gold, 0.12);
        this.scene.add.rectangle(x + 42, 242, 72, 10, PLATFORM_COLORS.paper, 0.12);
        this.scene.add.rectangle(x + 42, 296, 58, 10, PLATFORM_COLORS.rose, 0.1);
        this.scene.add.circle(x + 92, 344, 22, PLATFORM_COLORS.gold, 0.08);
        this.scene.add.rectangle(x - 48, 374, 118, 8, PLATFORM_COLORS.gold, 0.08);
      }
    } else if (geometry.levelId === 6) {
      for (let x = 120; x < geometry.worldWidth; x += 300) {
        this.scene.add.rectangle(x, 128, 44, 246, PLATFORM_COLORS.paper, 0.11);
        this.scene.add.rectangle(x + 64, 202, 92, 12, PLATFORM_COLORS.gold, 0.1);
        this.scene.add.rectangle(x + 130, 150, 18, 18, PLATFORM_COLORS.gold, 0.16);
        this.scene.add.rectangle(x + 22, 304, 84, 4, PHASER_THEME.silver, 0.12);
        this.scene.add.rectangle(x + 64, 304, 10, 140, PLATFORM_COLORS.gold, 0.08);
        this.scene.add.circle(x + 22, 304, 30, PHASER_THEME.silver, 0.035);
      }
    } else if (geometry.levelId === 7) {
      this.scene.add.rectangle(geometry.worldWidth / 2, 585, geometry.worldWidth, 110, PHASER_THEME.deepBlueNavy, 0.28);
      for (let x = 120; x < geometry.worldWidth; x += 260) {
        this.scene.add.rectangle(x, 138, 120, 160, PLATFORM_COLORS.folder, 0.08);
        this.scene.add.rectangle(x + 78, 190, 20, 20, PLATFORM_COLORS.gold, 0.16);
        this.scene.add.rectangle(x + 126, 560, 150, 6, PLATFORM_COLORS.paper, 0.1);
        this.scene.add.circle(x + 78, 190, 34, PLATFORM_COLORS.gold, 0.05);
        this.scene.add.circle(x + 78, 190, 58, PLATFORM_COLORS.gold, 0.025);
      }
    } else if (geometry.levelId === 8) {
      this.scene.add.rectangle(geometry.worldWidth / 2, geometry.worldHeight - 140, geometry.worldWidth, 260, PHASER_THEME.midnightNavy, 0.36);
      for (let y = 260; y < geometry.worldHeight; y += 260) {
        this.scene.add.rectangle(110, y, 52, 190, PLATFORM_COLORS.paper, 0.08);
        this.scene.add.rectangle(1040, y + 60, 52, 190, PLATFORM_COLORS.folder, 0.08);
        this.scene.add.rectangle(935, y + 18, 120, 8, PLATFORM_COLORS.gold, 0.11);
        this.scene.add.rectangle(210, y + 112, 96, 10, PLATFORM_COLORS.rose, 0.09);
        this.scene.add.rectangle(1018, y + 8, 14, 198, PHASER_THEME.blueRibbon, 0.12);
        this.scene.add.rectangle(1018, y + 8, 30, 198, PLATFORM_COLORS.gold, 0.035);
      }
    } else if (geometry.levelId === 9) {
      this.scene.add.rectangle(geometry.worldWidth / 2, 680, geometry.worldWidth, 190, PHASER_THEME.midnightNavy, 0.36);
      for (let x = 120; x < geometry.worldWidth; x += 240) {
        this.scene.add.rectangle(x, 690 + ((x / 240) % 2) * 18, 18, 18, PLATFORM_COLORS.gold, 0.2);
        this.scene.add.rectangle(x + 76, 720, 12, 12, PLATFORM_COLORS.rose, 0.12);
        this.scene.add.rectangle(x + 122, 246, 120, 12, PLATFORM_COLORS.paper, 0.08);
        this.scene.add.rectangle(x + 168, 540, 42, 74, PLATFORM_COLORS.folder, 0.16);
        this.scene.add.line(x + 40, 168, 0, 0, 56, 34, PLATFORM_COLORS.gold, 0.1).setOrigin(0, 0);
        this.scene.add.circle(x + 40, 168, 3, PLATFORM_COLORS.gold, 0.28);
        this.scene.add.circle(x + 96, 202, 2, PLATFORM_COLORS.paper, 0.18);
      }
    } else if (geometry.levelId === 10) {
      this.scene.add.rectangle(geometry.worldWidth / 2, 650, geometry.worldWidth, 170, PLATFORM_COLORS.tram, 0.2);
      for (let x = 130; x < geometry.worldWidth; x += 260) {
        this.scene.add.rectangle(x, 166 + ((x / 260) % 2) * 24, 128, 14, PLATFORM_COLORS.paper, 0.08);
        this.scene.add.rectangle(x + 58, 218, 18, 18, PLATFORM_COLORS.gold, 0.16);
        this.scene.add.rectangle(x + 124, 616, 150, 8, PLATFORM_COLORS.paper, 0.1);
        this.scene.add.rectangle(x + 174, 486, 54, 82, PLATFORM_COLORS.gold, 0.08);
        this.scene.add.circle(x + 58, 218, 38, PLATFORM_COLORS.rose, 0.04);
        this.scene.add.circle(x + 58, 218, 62, PLATFORM_COLORS.gold, 0.025);
      }
    } else {
      for (let x = 160; x < geometry.worldWidth; x += 360) {
        this.scene.add.rectangle(x, 96, 190, 18, PLATFORM_COLORS.paper, 0.12);
        this.scene.add.rectangle(x + 46, 126, 120, 12, PLATFORM_COLORS.gold, 0.12);
      }
    }

    const locationLabel =
      geometry.levelId === 2
        ? "Warsaw tram route, after hours"
        : geometry.levelId === 3
          ? "Old Town street, rebuilding itself"
        : geometry.levelId === 4
            ? "Vistula riverbank, dusk testimony"
            : geometry.levelId === 5
              ? "Archive of tiny details"
              : geometry.levelId === 6
                ? "Courthouse corridor of echoes"
                : geometry.levelId === 7
                  ? "Garden of quiet evidence"
                  : geometry.levelId === 8
                    ? "Tower of arguments"
                    : geometry.levelId === 9
                      ? "Rooftops before the verdict"
                      : geometry.levelId === 10
                        ? "Court of the Heart"
                        : "Kancelaria after hours";

    this.drawWorldLabel(42, 38, locationLabel, 18, "gold");
  }

  private createPlatform(platform: PlatformSpec): Phaser.GameObjects.Rectangle {
    const color = getPlatformColor(platform.kind);
    const chapterOneFinalArt = this.isChapterOneFinalArtActive();
    const chapterTwoFinalArt = this.isChapterTwoFinalArtActive();
    const chapterThreeFinalArt = this.isChapterThreeFinalArtActive();
    const chapterFourFinalArt = this.isChapterFourFinalArtActive();
    const chapterFiveFinalArt = this.isChapterFiveFinalArtActive();
    const chapterSixFinalArt = this.isChapterSixFinalArtActive();
    const finalArtPlatform = chapterOneFinalArt || chapterTwoFinalArt || chapterThreeFinalArt || chapterFourFinalArt || chapterFiveFinalArt || chapterSixFinalArt;
    const rectangle = this.scene.add
      .rectangle(
        platform.x + platform.width / 2,
        platform.y + platform.height / 2,
        platform.width,
        platform.height,
        color,
        finalArtPlatform ? 0.015 : 1
      )
      .setStrokeStyle(1, PLATFORM_COLORS.gold, finalArtPlatform ? 0.08 : platform.kind === "paper" ? 0.58 : 0.36)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);

    if (chapterOneFinalArt) {
      this.createChapterOnePlatformSurface(platform);
    } else if (chapterTwoFinalArt) {
      this.createChapterTwoPlatformSurface(platform);
    } else if (chapterThreeFinalArt) {
      this.createChapterThreePlatformSurface(platform);
    } else if (chapterFourFinalArt) {
      this.createChapterFourPlatformSurface(platform);
    } else if (chapterFiveFinalArt) {
      this.createChapterFivePlatformSurface(platform);
    } else if (chapterSixFinalArt) {
      this.createChapterSixPlatformSurface(platform);
    } else {
      this.createPlatformSkin(platform, this.activeTheme?.staticPlatforms[platform.kind]);
      this.decoratePlatformSurface(platform);
    }

    this.scene.physics.add.existing(rectangle, true);
    (rectangle.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();

    if (platform.label) {
      this.drawWorldLabel(platform.x + 14, platform.y - 28, platform.label, 15, platform.kind === "paper" ? "paper" : "cream");
    }

    return rectangle;
  }

  private createMovingPlatform(platform: MovingPlatformSpec): MovingPlatformRuntime {
    const color = platform.kind === "paper" ? PLATFORM_COLORS.paper : PLATFORM_COLORS.tram;
    const chapterOneFinalArt = this.isChapterOneFinalArtActive();
    const chapterTwoFinalArt = this.isChapterTwoFinalArtActive();
    const chapterThreeFinalArt = this.isChapterThreeFinalArtActive();
    const chapterFourFinalArt = this.isChapterFourFinalArtActive();
    const chapterFiveFinalArt = this.isChapterFiveFinalArtActive();
    const chapterSixFinalArt = this.isChapterSixFinalArtActive();
    const finalArtPlatform = chapterOneFinalArt || chapterTwoFinalArt || chapterThreeFinalArt || chapterFourFinalArt || chapterFiveFinalArt || chapterSixFinalArt;
    const rectangle = this.scene.add
      .rectangle(
        platform.x + platform.width / 2,
        platform.y + platform.height / 2,
        platform.width,
        platform.height,
        color,
        finalArtPlatform ? 0.015 : 1
      )
      .setStrokeStyle(2, PLATFORM_COLORS.gold, finalArtPlatform ? 0.08 : 0.52)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    const skin = chapterOneFinalArt
      ? this.createChapterOneMovingPlatformSurface(platform)
      : chapterTwoFinalArt
        ? this.createChapterTwoMovingPlatformSurface(platform)
        : chapterThreeFinalArt
          ? this.createChapterThreeMovingPlatformSurface(platform)
          : chapterFourFinalArt
            ? this.createChapterFourMovingPlatformSurface(platform)
            : chapterFiveFinalArt
              ? this.createChapterFiveMovingPlatformSurface(platform)
              : chapterSixFinalArt
                ? this.createChapterSixMovingPlatformSurface(platform)
                : this.createPlatformSkin(platform, this.getMovingPlatformAsset(platform));
    if (!finalArtPlatform) {
      this.decoratePlatformSurface(platform, 0.82);
    }

    this.scene.physics.add.existing(rectangle);
    const body = rectangle.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(platform.width, platform.height);
    const axis = platform.axis ?? "horizontal";
    const direction = axis === "vertical" && platform.toY !== undefined && platform.y >= platform.toY ? -1 : 1;

    if (axis === "vertical") {
      body.setVelocityY(direction * platform.speed);
    } else {
      body.setVelocityX(direction * platform.speed);
    }

    if (platform.label) {
      this.drawWorldLabel(axis === "vertical" ? platform.x : (platform.fromX ?? platform.x), platform.y - 28, platform.label, 15, "cream");
    }

    return {
      spec: platform,
      body: rectangle,
      direction,
      skin
    };
  }

  private createRebuildablePlatform(platform: RebuildablePlatformSpec): RebuildablePlatformRuntime {
    const chapterTwoFinalArt = this.isChapterTwoFinalArtActive();
    const chapterSixFinalArt = this.isChapterSixFinalArtActive();
    const finalArtRebuildable = chapterTwoFinalArt || chapterSixFinalArt;
    const rectangle = this.scene.add
      .rectangle(
        platform.x + platform.width / 2,
        platform.y + platform.height / 2,
        platform.width,
        platform.height,
        getPlatformColor(platform.kind),
        finalArtRebuildable ? 0.04 : 0.18
      )
      .setStrokeStyle(2, PLATFORM_COLORS.gold, finalArtRebuildable ? 0.18 : 0.46)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    const skin = chapterTwoFinalArt
      ? this.createChapterTwoRebuildablePlatformSurface(platform)
      : chapterSixFinalArt
        ? this.createChapterSixRebuildablePlatformSurface(platform)
      : this.createPlatformSkin(platform, this.activeTheme?.staticPlatforms[platform.kind], 0.18);
    if (!finalArtRebuildable) {
      this.decoratePlatformSurface(platform, 0.32);
    }

    this.scene.physics.add.existing(rectangle, true);
    const body = rectangle.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();
    body.enable = false;

    if (platform.label) {
      this.drawWorldLabel(platform.x + 12, platform.y - 28, platform.label, 15, "gold");
    }

    return { spec: platform, body: rectangle, skin };
  }

  private createLightRevealedPlatform(platform: LightRevealedPlatformSpec): LightRevealedPlatformRuntime {
    const chapterFiveFinalArt = this.isChapterFiveFinalArtActive();
    const chapterSixFinalArt = this.isChapterSixFinalArtActive();
    const finalArtLightPlatform = chapterFiveFinalArt || chapterSixFinalArt;
    const rectangle = this.scene.add
      .rectangle(
        platform.x + platform.width / 2,
        platform.y + platform.height / 2,
        platform.width,
        platform.height,
        getPlatformColor(platform.kind),
        finalArtLightPlatform ? 0.04 : 0.16
      )
      .setStrokeStyle(2, PLATFORM_COLORS.gold, finalArtLightPlatform ? 0.16 : 0.42)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    const skin = chapterFiveFinalArt
      ? this.createChapterFiveLightPlatformSurface(platform)
      : chapterSixFinalArt
        ? this.createChapterSixLightPlatformSurface(platform)
      : this.createPlatformSkin(platform, this.activeTheme?.staticPlatforms[platform.kind], 0.16);
    if (!finalArtLightPlatform) {
      this.decoratePlatformSurface(platform, 0.3);
    }

    this.scene.physics.add.existing(rectangle, true);
    const body = rectangle.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();
    body.enable = false;

    if (platform.label) {
      this.drawWorldLabel(platform.x + 12, platform.y - 28, platform.label, 15, "gold");
    }

    return { spec: platform, body: rectangle, skin };
  }

  private createRebuildTrigger(group: RebuildGroupSpec): RebuildTriggerRuntime {
    const trigger = group.trigger;
    const zone = this.createZone(trigger.x, trigger.y, trigger.width, trigger.height);
    const chapterTwoFinalArt = this.isChapterTwoFinalArtActive();
    const chapterSixFinalArt = this.isChapterSixFinalArtActive();
    const finalArtTrigger = chapterTwoFinalArt || chapterSixFinalArt;
    const marker = this.scene.add
      .rectangle(
        trigger.x + trigger.width / 2,
        trigger.y + trigger.height / 2,
        trigger.width - 18,
        trigger.height - 18,
        PLATFORM_COLORS.brick,
        finalArtTrigger ? 0.28 : 0.72
      )
      .setStrokeStyle(2, PLATFORM_COLORS.gold, finalArtTrigger ? 0.68 : 0.85)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.4);

    if (chapterTwoFinalArt || chapterSixFinalArt) {
      const centerX = trigger.x + trigger.width / 2;
      const centerY = trigger.y + trigger.height / 2;
      this.scene.add.circle(centerX, centerY, trigger.width * 0.62, chapterSixFinalArt ? PHASER_THEME.silver : PLATFORM_COLORS.gold, chapterSixFinalArt ? 0.075 : 0.08)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.8);
      this.scene.add.rectangle(centerX, centerY, trigger.width * 0.44, trigger.height * 0.12, PHASER_THEME.brassHighlight, 0.52)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.2);
      this.scene.add.rectangle(centerX, centerY - trigger.height * 0.14, trigger.width * 0.18, trigger.height * 0.34, chapterSixFinalArt ? PHASER_THEME.blueRibbon : PHASER_THEME.midnightNavy, chapterSixFinalArt ? 0.34 : 0.62)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.1);
    }

    this.drawWorldLabel(trigger.x - 16, trigger.y - 32, "Rebuild", 15, "cream");

    return { spec: trigger, zone, marker };
  }

  private drawDecorations(geometry: PlatformerLevelGeometry): void {
    const hidePlaceholderDecorations =
      (this.isChapterOneFinalArtActive() && geometry.levelId === 1) ||
      (this.isChapterTwoFinalArtActive() && geometry.levelId === 2) ||
      (this.isChapterThreeFinalArtActive() && geometry.levelId === 4) ||
      (this.isChapterFourFinalArtActive() && geometry.levelId === 5) ||
      (this.isChapterFiveFinalArtActive() && geometry.levelId === 6) ||
      (this.isChapterSixFinalArtActive() && geometry.levelId === 9);
    if (hidePlaceholderDecorations) {
      return;
    }
    for (const decoration of geometry.decorations) {
      this.scene.add.rectangle(
        decoration.x + decoration.width / 2,
        decoration.y + decoration.height / 2,
        decoration.width,
        decoration.height,
        decoration.color,
        decoration.alpha ?? 1
      ).setDepth(PLATFORMER_DEPTHS.decorativeProp);
    }
  }

  private drawHints(geometry: PlatformerLevelGeometry): void {
    for (const hint of geometry.tutorialHints) {
      this.drawWorldLabel(hint.x, hint.y, hint.text, 18, "cream", 360);
    }
  }

  private createExhibit(exhibit: ExhibitSpec): { body: Phaser.GameObjects.Rectangle; skin?: Phaser.GameObjects.Image } {
    const centerX = exhibit.x + exhibit.width / 2;
    const centerY = exhibit.y + exhibit.height / 2;
    const chapterOneFinalArt = this.isChapterOneFinalArtActive();
    const chapterTwoFinalArt = this.isChapterTwoFinalArtActive();
    const chapterThreeFinalArt = this.isChapterThreeFinalArtActive();
    const chapterFourFinalArt = this.isChapterFourFinalArtActive();
    const chapterFiveFinalArt = this.isChapterFiveFinalArtActive();
    const chapterSixFinalArt = this.isChapterSixFinalArtActive();
    const finalArtExhibit = chapterOneFinalArt || chapterTwoFinalArt || chapterThreeFinalArt || chapterFourFinalArt || chapterFiveFinalArt || chapterSixFinalArt;
    this.scene.add
      .rectangle(
        centerX,
        centerY,
        exhibit.width + 24,
        exhibit.height + 18,
        PLATFORM_COLORS.gold,
        finalArtExhibit ? 0.1 : 0.24
      )
      .setStrokeStyle(1, PLATFORM_COLORS.gold, finalArtExhibit ? 0.2 : 0.42)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 1);
    this.scene.add.circle(centerX, centerY, Math.max(exhibit.width, exhibit.height) * 0.86, PLATFORM_COLORS.gold, 0.1);
    this.scene.add.circle(centerX, centerY, Math.max(exhibit.width, exhibit.height) * 0.56, PLATFORM_COLORS.rose, 0.035);
    const body = this.scene.add
      .rectangle(centerX, centerY, exhibit.width, exhibit.height, getExhibitFill(exhibit.name), finalArtExhibit ? 0.02 : 1)
      .setStrokeStyle(2, PLATFORM_COLORS.gold, finalArtExhibit ? 0.12 : 1)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    const skin = this.createImageSkin(
      this.activeTheme?.clues.primary,
      centerX,
      centerY,
      finalArtExhibit ? Math.max(exhibit.width * (chapterTwoFinalArt ? 1.85 : chapterThreeFinalArt ? 1.72 : chapterFourFinalArt ? 1.78 : chapterFiveFinalArt ? 1.72 : chapterSixFinalArt ? 1.8 : 1.65), 76) : exhibit.width,
      finalArtExhibit ? Math.max(exhibit.height * (chapterTwoFinalArt ? 1.85 : chapterThreeFinalArt ? 1.72 : chapterFourFinalArt ? 1.78 : chapterFiveFinalArt ? 1.72 : chapterSixFinalArt ? 1.8 : 1.65), 52) : exhibit.height,
      PLATFORMER_DEPTHS.interactableSkin,
      "contain"
    );
    skin?.setAlpha(finalArtExhibit ? 0.94 : 1);
    if (!skin || !finalArtExhibit) {
      this.drawExhibitMotif(exhibit, centerX, centerY);
    }
    this.drawWorldLabel(exhibit.x - 40, exhibit.y - 38, exhibit.name, 16, "gold");
    this.scene.physics.add.existing(body, true);
    return { body, skin };
  }

  private drawExhibitMotif(exhibit: ExhibitSpec, centerX: number, centerY: number): void {
    const motif = getExhibitMotif(exhibit.name);
    const width = exhibit.width;
    const height = exhibit.height;

    if (motif === "stamp") {
      this.scene.add.circle(centerX, centerY, Math.min(width, height) * 0.28, PLATFORM_COLORS.rose, 0.72).setStrokeStyle(2, PLATFORM_COLORS.gold, 0.8);
      this.scene.add.rectangle(centerX, centerY + height * 0.26, width * 0.58, 4, PLATFORM_COLORS.gold, 0.65);
      return;
    }

    if (motif === "brick") {
      this.scene.add.rectangle(centerX, centerY, width * 0.74, height * 0.5, PLATFORM_COLORS.brick, 0.95).setStrokeStyle(2, PLATFORM_COLORS.paper, 0.52);
      this.scene.add.rectangle(centerX, centerY, width * 0.68, 3, PLATFORM_COLORS.gold, 0.45);
      this.scene.add.rectangle(centerX - width * 0.18, centerY - height * 0.13, 3, height * 0.18, PLATFORM_COLORS.gold, 0.38);
      this.scene.add.rectangle(centerX + width * 0.2, centerY + height * 0.13, 3, height * 0.18, PLATFORM_COLORS.gold, 0.38);
      return;
    }

    if (motif === "key") {
      this.scene.add.circle(centerX - width * 0.22, centerY, height * 0.18, PHASER_THEME.silver, 0.9).setStrokeStyle(2, PLATFORM_COLORS.paper, 0.7);
      this.scene.add.rectangle(centerX + width * 0.08, centerY, width * 0.5, 6, PHASER_THEME.silver, 0.9);
      this.scene.add.rectangle(centerX + width * 0.32, centerY + 9, 5, 16, PHASER_THEME.silver, 0.85);
      return;
    }

    if (motif === "lantern") {
      this.scene.add.circle(centerX, centerY, height * 0.34, PLATFORM_COLORS.gold, 0.18);
      this.scene.add.rectangle(centerX, centerY, width * 0.42, height * 0.58, PLATFORM_COLORS.gold, 0.65).setStrokeStyle(2, PLATFORM_COLORS.paper, 0.7);
      this.scene.add.circle(centerX, centerY, height * 0.16, PHASER_THEME.softIvory, 0.86);
      this.scene.add.rectangle(centerX, centerY - height * 0.39, width * 0.36, 4, PLATFORM_COLORS.gold, 0.75);
      return;
    }

    if (motif === "ribbon") {
      this.scene.add.rectangle(centerX, centerY, width * 0.64, height * 0.2, PHASER_THEME.blueRibbon, 0.9).setStrokeStyle(2, PLATFORM_COLORS.paper, 0.42);
      this.scene.add.triangle(centerX - width * 0.23, centerY + height * 0.22, 0, 0, 18, 0, 9, 18, PHASER_THEME.blueRibbon, 0.86);
      this.scene.add.triangle(centerX + width * 0.23, centerY + height * 0.22, 0, 0, 18, 0, 9, 18, PHASER_THEME.blueRibbon, 0.86);
      return;
    }

    if (motif === "heart") {
      this.scene.add.circle(centerX - width * 0.12, centerY - height * 0.05, height * 0.17, PLATFORM_COLORS.rose, 0.9);
      this.scene.add.circle(centerX + width * 0.12, centerY - height * 0.05, height * 0.17, PLATFORM_COLORS.rose, 0.9);
      this.scene.add.triangle(centerX, centerY + height * 0.07, 0, 0, width * 0.46, 0, width * 0.23, height * 0.34, PLATFORM_COLORS.rose, 0.9).setOrigin(0.5);
      return;
    }

    this.scene.add.rectangle(centerX, centerY, width * 0.7, height * 0.58, PLATFORM_COLORS.envelope, 0.86).setStrokeStyle(2, PLATFORM_COLORS.gold, 0.78);
    this.scene.add.rectangle(centerX, centerY, width * 0.58, 2, PLATFORM_COLORS.rose, 0.65);

    if (motif === "note" || motif === "letter") {
      this.scene.add.rectangle(centerX, centerY - height * 0.16, width * 0.42, 3, PLATFORM_COLORS.ink, 0.52);
      this.scene.add.rectangle(centerX, centerY + height * 0.02, width * 0.46, 3, PLATFORM_COLORS.ink, 0.42);
      this.scene.add.rectangle(centerX - width * 0.16, centerY + height * 0.18, width * 0.18, 3, PLATFORM_COLORS.rose, 0.5);
    }
  }

  private createWitnessFragment(fragment: WitnessFragmentSpec): WitnessFragmentRuntime {
    const chapterThreeFinalArt = this.isChapterThreeFinalArtActive();
    const centerX = fragment.x + fragment.width / 2;
    const centerY = fragment.y + fragment.height / 2;
    const note = this.scene.add
      .rectangle(
        centerX,
        centerY,
        fragment.width,
        fragment.height,
        PLATFORM_COLORS.paper,
        chapterThreeFinalArt ? 0.04 : 0.92
      )
      .setStrokeStyle(2, PLATFORM_COLORS.gold, chapterThreeFinalArt ? 0.12 : 0.78)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    if (chapterThreeFinalArt) {
      this.scene.add.circle(centerX, centerY, Math.max(fragment.width, fragment.height) * 0.82, PHASER_THEME.blueRibbon, 0.08)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 1);
      this.scene.add.circle(centerX, centerY, Math.max(fragment.width, fragment.height) * 0.56, PLATFORM_COLORS.gold, 0.055)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.9);
    }
    const skin = this.createImageSkin(
      this.activeTheme?.clues.primary,
      centerX,
      centerY,
      chapterThreeFinalArt ? Math.max(fragment.width * 1.55, 58) : fragment.width,
      chapterThreeFinalArt ? Math.max(fragment.height * 1.55, 42) : fragment.height,
      PLATFORMER_DEPTHS.interactableSkin,
      "contain"
    );
    skin?.setAlpha(chapterThreeFinalArt ? 0.9 : 1);
    this.drawWorldLabel(fragment.x - 24, fragment.y - 32, "Fragment", 14, "cream");
    this.scene.physics.add.existing(note, true);
    return { spec: fragment, body: note, skin };
  }

  private createTinyDetailNote(noteSpec: TinyDetailNoteSpec): TinyDetailNoteRuntime {
    const chapterFourFinalArt = this.isChapterFourFinalArtActive();
    const centerX = noteSpec.x + noteSpec.width / 2;
    const centerY = noteSpec.y + noteSpec.height / 2;
    const note = this.scene.add
      .rectangle(
        centerX,
        centerY,
        noteSpec.width,
        noteSpec.height,
        PLATFORM_COLORS.paper,
        chapterFourFinalArt ? 0.035 : 0.94
      )
      .setStrokeStyle(2, PLATFORM_COLORS.rose, chapterFourFinalArt ? 0.1 : 0.75)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    if (chapterFourFinalArt) {
      this.scene.add.circle(centerX, centerY, Math.max(noteSpec.width, noteSpec.height) * 0.82, PLATFORM_COLORS.gold, 0.06)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 1);
      this.scene.add.circle(centerX, centerY, Math.max(noteSpec.width, noteSpec.height) * 0.52, PLATFORM_COLORS.rose, 0.045)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.9);
    }
    const skin = this.createImageSkin(
      this.activeTheme?.clues.primary,
      centerX,
      centerY,
      chapterFourFinalArt ? Math.max(noteSpec.width * 1.58, 58) : noteSpec.width,
      chapterFourFinalArt ? Math.max(noteSpec.height * 1.58, 42) : noteSpec.height,
      PLATFORMER_DEPTHS.interactableSkin,
      "contain"
    );
    skin?.setAlpha(chapterFourFinalArt ? 0.92 : 1);
    this.drawWorldLabel(noteSpec.x - 18, noteSpec.y - 32, "Detail", 14, "cream");
    this.scene.physics.add.existing(note, true);
    return { spec: noteSpec, body: note, skin };
  }

  private createArchiveKey(key: ArchiveKeySpec): ArchiveKeyRuntime {
    const chapterFourFinalArt = this.isChapterFourFinalArtActive();
    const centerX = key.x + key.width / 2;
    const centerY = key.y + key.height / 2;
    const isSilverKey = key.label.toLowerCase().includes("silver");
    const keyBody = this.scene.add
      .rectangle(centerX, centerY, key.width, key.height, PLATFORM_COLORS.gold, chapterFourFinalArt ? 0.035 : 0.94)
      .setStrokeStyle(2, PLATFORM_COLORS.paper, chapterFourFinalArt ? 0.12 : 0.86)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    const skin = this.createImageSkin(
      isSilverKey ? this.activeTheme?.clues.secondary : undefined,
      centerX,
      centerY,
      chapterFourFinalArt ? Math.max(key.width * 1.9, 66) : key.width,
      chapterFourFinalArt ? Math.max(key.height * 1.9, 42) : key.height,
      PLATFORMER_DEPTHS.interactableSkin,
      "contain"
    );
    skin?.setAlpha(chapterFourFinalArt ? 0.94 : 1);
    this.scene.add.circle(centerX, centerY, Math.max(key.width, key.height) * (chapterFourFinalArt ? 1 : 0.74), isSilverKey ? PHASER_THEME.silver : PLATFORM_COLORS.gold, chapterFourFinalArt ? 0.08 : 0.12)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 1);
    if (!skin && chapterFourFinalArt) {
      this.drawArchiveKeyFallback(key, centerX, centerY, isSilverKey);
    }
    this.drawWorldLabel(key.x - 26, key.y - 34, key.label, 14, "gold");
    this.scene.physics.add.existing(keyBody, true);
    return { spec: key, body: keyBody, skin };
  }

  private createArchiveDoor(door: ArchiveDoorSpec): ArchiveDoorRuntime {
    const chapterFourFinalArt = this.isChapterFourFinalArtActive();
    const centerX = door.x + door.width / 2;
    const centerY = door.y + door.height / 2;
    const doorBody = this.scene.add
      .rectangle(centerX, centerY, door.width, door.height, PLATFORM_COLORS.gold, chapterFourFinalArt ? 0.08 : 0.76)
      .setStrokeStyle(2, PLATFORM_COLORS.paper, chapterFourFinalArt ? 0.16 : 0.75)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    const skin = this.createImageSkin(
      this.activeTheme?.exitDoor,
      centerX,
      centerY,
      chapterFourFinalArt ? door.width * 1.28 : door.width,
      chapterFourFinalArt ? door.height * 1.12 : door.height,
      PLATFORMER_DEPTHS.interactableSkin,
      "contain"
    );
    skin?.setAlpha(chapterFourFinalArt ? 0.9 : 1);
    this.scene.add.rectangle(centerX, centerY, door.width - 12, door.height - 14, PHASER_THEME.deepBlueNavy, chapterFourFinalArt ? 0.18 : 0.42)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.7);
    if (chapterFourFinalArt) {
      this.scene.add.rectangle(centerX, centerY + door.height * 0.08, Math.max(8, door.width - 16), 3, PHASER_THEME.brassHighlight, 0.48)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.2);
      this.scene.add.circle(centerX, centerY, Math.max(door.width, door.height) * 0.46, PLATFORM_COLORS.gold, 0.06)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.9);
    }
    this.drawWorldLabel(door.x - 28, door.y - 32, "Locked", 14, "cream");
    this.scene.physics.add.existing(doorBody, true);
    (doorBody.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
    return { spec: door, body: doorBody, skin };
  }

  private createChoiceDoor(door: ChoiceDoorSpec): ChoiceDoorRuntime {
    const zone = this.createZone(door.x, door.y, door.width, door.height);
    const chapterFiveFinalArt = this.isChapterFiveFinalArtActive();
    const centerX = door.x + door.width / 2;
    const centerY = door.y + door.height / 2;
    const marker = this.scene.add
      .rectangle(
        centerX,
        centerY,
        door.width,
        door.height,
        door.isCorrectPath ? PLATFORM_COLORS.gold : PLATFORM_COLORS.ink,
        chapterFiveFinalArt ? (door.isCorrectPath ? 0.2 : 0.16) : door.isCorrectPath ? 0.44 : 0.5
      )
      .setStrokeStyle(2, door.isCorrectPath ? PLATFORM_COLORS.paper : PLATFORM_COLORS.rose, chapterFiveFinalArt ? 0.28 : 0.75);
    if (chapterFiveFinalArt) {
      this.drawChapterFiveChoiceDoorSurface(door, centerX, centerY);
    }
    this.drawWorldLabel(centerX, door.y + 18, door.label, 15, "cream").setOrigin(0.5);
    return { spec: door, zone, marker };
  }

  private createEchoFragment(fragment: EchoFragmentSpec): EchoFragmentRuntime {
    const chapterFiveFinalArt = this.isChapterFiveFinalArtActive();
    const centerX = fragment.x + fragment.width / 2;
    const centerY = fragment.y + fragment.height / 2;
    const echo = this.scene.add
      .rectangle(
        centerX,
        centerY,
        fragment.width,
        fragment.height,
        PLATFORM_COLORS.paper,
        chapterFiveFinalArt ? 0.035 : 0.9
      )
      .setStrokeStyle(2, PLATFORM_COLORS.gold, chapterFiveFinalArt ? 0.1 : 0.66)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    if (chapterFiveFinalArt) {
      this.scene.add.circle(centerX, centerY, Math.max(fragment.width, fragment.height) * 0.82, PHASER_THEME.blueRibbon, 0.08)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 1);
      this.scene.add.circle(centerX, centerY, Math.max(fragment.width, fragment.height) * 0.52, PLATFORM_COLORS.gold, 0.045)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.9);
    }
    const skin = this.createImageSkin(
      this.activeTheme?.clues.primary,
      centerX,
      centerY,
      chapterFiveFinalArt ? Math.max(fragment.width * 1.58, 58) : fragment.width,
      chapterFiveFinalArt ? Math.max(fragment.height * 1.58, 42) : fragment.height,
      PLATFORMER_DEPTHS.interactableSkin,
      "contain"
    );
    skin?.setAlpha(chapterFiveFinalArt ? 0.92 : 1);
    this.drawWorldLabel(fragment.x - 20, fragment.y - 32, "Echo", 14, "cream");
    this.scene.physics.add.existing(echo, true);
    return { spec: fragment, body: echo, skin };
  }

  private createLanternSwitch(lantern: LanternSwitchSpec): LanternSwitchRuntime {
    const zone = this.createZone(lantern.x, lantern.y, lantern.width, lantern.height);
    const chapterFiveFinalArt = this.isChapterFiveFinalArtActive();
    const chapterSixFinalArt = this.isChapterSixFinalArtActive();
    const finalArtLantern = chapterFiveFinalArt || chapterSixFinalArt;
    const centerX = lantern.x + lantern.width / 2;
    const centerY = lantern.y + lantern.height / 2;
    const marker = this.scene.add
      .rectangle(
        centerX,
        centerY,
        lantern.width - 8,
        lantern.height - 12,
        PLATFORM_COLORS.gold,
        finalArtLantern ? 0.08 : 0.46
      )
      .setStrokeStyle(2, PLATFORM_COLORS.paper, finalArtLantern ? 0.2 : 0.78)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    const skin = this.createImageSkin(
      this.activeTheme?.interactables.lanternSwitch,
      centerX,
      centerY,
      finalArtLantern ? lantern.width * 1.25 : lantern.width,
      finalArtLantern ? lantern.height * 1.15 : lantern.height,
      PLATFORMER_DEPTHS.interactableSkin,
      "contain"
    );
    skin?.setAlpha(finalArtLantern ? 0.95 : 1);
    this.scene.add.circle(centerX, centerY, Math.max(lantern.width, lantern.height) * (finalArtLantern ? 0.6 : 0.45), chapterSixFinalArt ? PHASER_THEME.silver : PLATFORM_COLORS.gold, finalArtLantern ? 0.14 : 0.1)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 1);
    if (!skin && chapterFiveFinalArt) {
      this.drawChapterFiveLanternFallback(lantern, centerX, centerY);
    } else if (!skin && chapterSixFinalArt) {
      this.drawChapterSixLanternFallback(lantern, centerX, centerY);
    }
    this.drawWorldLabel(centerX, lantern.y - 28, lantern.label, 14, "gold").setOrigin(0.5);
    return { spec: lantern, zone, marker, skin };
  }

  private createQuietEvidenceFragment(fragment: QuietEvidenceFragmentSpec): QuietEvidenceFragmentRuntime {
    const evidence = this.scene.add
      .rectangle(
        fragment.x + fragment.width / 2,
        fragment.y + fragment.height / 2,
        fragment.width,
        fragment.height,
        PLATFORM_COLORS.gold,
        0.72
      )
      .setStrokeStyle(2, PLATFORM_COLORS.paper, 0.72);
    this.drawWorldLabel(fragment.x - 38, fragment.y - 32, "Quiet evidence", 13, "cream");
    this.scene.physics.add.existing(evidence, true);
    return { spec: fragment, body: evidence };
  }

  private createArgumentFragment(fragment: ArgumentFragmentSpec): ArgumentFragmentRuntime {
    const chapterFiveFinalArt = this.isChapterFiveFinalArtActive();
    const chapterSixFinalArt = this.isChapterSixFinalArtActive();
    const finalArtArgument = chapterFiveFinalArt || chapterSixFinalArt;
    const centerX = fragment.x + fragment.width / 2;
    const centerY = fragment.y + fragment.height / 2;
    const argument = this.scene.add
      .rectangle(
        centerX,
        centerY,
        fragment.width,
        fragment.height,
        PHASER_THEME.blueRibbon,
        finalArtArgument ? 0.04 : 0.72
      )
      .setStrokeStyle(2, PLATFORM_COLORS.gold, finalArtArgument ? 0.1 : 0.72)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody);
    if (finalArtArgument) {
      this.scene.add.circle(centerX, centerY, Math.max(fragment.width, fragment.height) * 0.9, chapterSixFinalArt ? PLATFORM_COLORS.rose : PHASER_THEME.blueRibbon, chapterSixFinalArt ? 0.085 : 0.1)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 1);
      this.scene.add.circle(centerX, centerY, Math.max(fragment.width, fragment.height) * 0.54, PLATFORM_COLORS.gold, 0.05)
        .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.9);
    }
    const skin = this.createImageSkin(
      this.activeTheme?.clues.primary,
      centerX,
      centerY,
      finalArtArgument ? Math.max(fragment.width * (chapterSixFinalArt ? 1.75 : 1.62), 60) : fragment.width,
      finalArtArgument ? Math.max(fragment.height * (chapterSixFinalArt ? 1.75 : 1.62), 42) : fragment.height,
      PLATFORMER_DEPTHS.interactableSkin,
      "contain"
    );
    skin?.setAlpha(finalArtArgument ? 0.94 : 1);
    this.drawWorldLabel(fragment.x - 38, fragment.y - 32, "Argument", 13, "cream");
    this.scene.physics.add.existing(argument, true);
    return { spec: fragment, body: argument, skin };
  }

  private drawExit(exit: ExitSpec): void {
    const centerX = exit.x + exit.width / 2;
    const centerY = exit.y + exit.height / 2;
    const chapterOneFinalArt = this.isChapterOneFinalArtActive();
    const chapterTwoFinalArt = this.isChapterTwoFinalArtActive();
    const chapterThreeFinalArt = this.isChapterThreeFinalArtActive();
    const chapterFourFinalArt = this.isChapterFourFinalArtActive();
    const chapterFiveFinalArt = this.isChapterFiveFinalArtActive();
    const chapterSixFinalArt = this.isChapterSixFinalArtActive();
    const finalArtExit = chapterOneFinalArt || chapterTwoFinalArt || chapterThreeFinalArt || chapterFourFinalArt || chapterFiveFinalArt || chapterSixFinalArt;
    this.scene.add.rectangle(centerX, centerY + exit.height * 0.26, exit.width + 24, 14, PLATFORM_COLORS.gold, finalArtExit ? 0.16 : 0.14)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 2);
    this.scene.add.circle(centerX, centerY, Math.max(exit.width, exit.height) * 0.82, PLATFORM_COLORS.gold, finalArtExit ? 0.06 : 0.08)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 2);
    const skin = this.createImageSkin(
      this.activeTheme?.exitDoor,
      centerX,
      centerY,
      chapterOneFinalArt ? exit.width * 1.18 : chapterTwoFinalArt ? exit.width * 1.28 : chapterThreeFinalArt ? exit.width * 1.24 : chapterFourFinalArt ? exit.width * 1.22 : chapterFiveFinalArt ? exit.width * 1.28 : chapterSixFinalArt ? exit.width * 1.34 : exit.width,
      chapterOneFinalArt ? exit.height * 1.12 : chapterTwoFinalArt ? exit.height * 1.18 : chapterThreeFinalArt ? exit.height * 1.16 : chapterFourFinalArt ? exit.height * 1.18 : chapterFiveFinalArt ? exit.height * 1.2 : chapterSixFinalArt ? exit.height * 1.22 : exit.height,
      PLATFORMER_DEPTHS.interactableSkin,
      "contain"
    );
    skin?.setAlpha(finalArtExit ? 0.96 : 1);
    if (!skin || !finalArtExit) {
      this.scene.add.rectangle(centerX, centerY, exit.width + 30, exit.height + 28, PLATFORM_COLORS.portal, 0.14);
      this.scene.add.rectangle(centerX, centerY, exit.width, exit.height, PLATFORM_COLORS.portal, 0.34).setStrokeStyle(2, PLATFORM_COLORS.gold, 0.72);
      this.scene.add.rectangle(centerX, centerY, exit.width - 22, exit.height - 20, PHASER_THEME.deepBlueNavy, 0.88);
      this.scene.add.rectangle(centerX, exit.y + 18, exit.width - 38, 4, PLATFORM_COLORS.gold, 0.5);
    }
    this.drawWorldLabel(exit.x - 30, exit.y - 40, "Case door", 17, "gold");
  }

  private drawCheckpoint(checkpoint: CheckpointSpec, index: number): void {
    const centerX = checkpoint.x + checkpoint.width / 2;
    const centerY = checkpoint.y + checkpoint.height / 2;
    const markerWidth = Math.min(58, Math.max(36, checkpoint.width * 0.86));
    const markerHeight = Math.min(82, Math.max(54, checkpoint.height * 0.92));
    const skin = this.createImageSkin(
      this.activeTheme?.checkpoint,
      centerX,
      centerY,
      markerWidth,
      markerHeight,
      PLATFORMER_DEPTHS.interactableSkin - 0.2,
      "contain"
    );

    this.scene.add.circle(centerX, centerY, Math.max(checkpoint.width, checkpoint.height) * 0.46, PLATFORM_COLORS.gold, skin ? 0.1 : 0.08)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 1);

    this.scene.add
      .rectangle(
        centerX,
        centerY,
        checkpoint.width - 10,
        checkpoint.height - 16,
        PLATFORM_COLORS.checkpoint,
        skin ? 0.06 : 0.2
      )
      .setStrokeStyle(2, PLATFORM_COLORS.gold, skin ? 0.22 : 0.52)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.5);
    this.scene.add.rectangle(centerX, centerY + checkpoint.height * 0.34, checkpoint.width - 22, 3, PLATFORM_COLORS.gold, skin ? 0.34 : 0.48)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.1);
    this.drawWorldLabel(checkpoint.x - 8, checkpoint.y - 30, `Checkpoint ${index}`, 13, "gold");
  }

  private decoratePlatformSurface(
    platform: { x: number; y: number; width: number; height: number; kind: PlatformSpec["kind"] | MovingPlatformSpec["kind"] },
    alpha = 1
  ): void {
    const centerX = platform.x + platform.width / 2;
    const topY = platform.y + 2;
    const bottomY = platform.y + platform.height - 3;
    const trimWidth = Math.max(10, platform.width - 12);
    const trimAlpha = Math.min(0.7, 0.34 * alpha + 0.18);

    this.scene.add.rectangle(centerX, platform.y + platform.height + 3, Math.max(6, platform.width - 8), 5, PHASER_THEME.midnightNavy, 0.14 * alpha);
    this.scene.add.rectangle(centerX, topY, trimWidth, 2, PLATFORM_COLORS.gold, trimAlpha);

    if (platform.kind === "paper" || platform.kind === "calendar") {
      const lineColor = platform.kind === "paper" ? PLATFORM_COLORS.folder : PLATFORM_COLORS.rose;
      for (let offset = 12; offset < platform.height - 6; offset += 12) {
        this.scene.add.rectangle(centerX, platform.y + offset, Math.max(18, platform.width - 24), 1, lineColor, 0.12 * alpha);
      }
      return;
    }

    if (platform.kind === "brick") {
      for (let offset = 14; offset < platform.width - 10; offset += 38) {
        this.scene.add.rectangle(platform.x + offset, platform.y + platform.height / 2, 2, Math.max(6, platform.height - 8), PLATFORM_COLORS.gold, 0.14 * alpha);
      }
      this.scene.add.rectangle(centerX, platform.y + platform.height / 2, trimWidth, 1, PLATFORM_COLORS.gold, 0.16 * alpha);
      return;
    }

    if (platform.width > 84) {
      this.scene.add.circle(platform.x + 16, bottomY, 3, PLATFORM_COLORS.gold, 0.34 * alpha);
      this.scene.add.circle(platform.x + platform.width - 16, bottomY, 3, PLATFORM_COLORS.gold, 0.34 * alpha);
    }

    if (platform.kind === "tram") {
      this.scene.add.rectangle(centerX, bottomY, trimWidth, 2, PHASER_THEME.silver, 0.16 * alpha);
    }
  }

  private drawWorldLabel(
    x: number,
    y: number,
    text: string,
    fontSize: number,
    tone: "cream" | "gold" | "paper",
    wrapWidth?: number
  ): Phaser.GameObjects.Text {
    const isPaper = tone === "paper";
    const label = this.scene.add.text(x, y, text, {
      fontFamily: "Georgia, serif",
      fontSize: `${fontSize}px`,
      color: isPaper ? THEME_HEX.warmInkBrown : tone === "gold" ? THEME_HEX.brassHighlight : THEME_HEX.mainCream,
      backgroundColor: isPaper
        ? `${THEME_HEX.softIvory}D9`
        : tone === "gold"
          ? `${THEME_HEX.midnightNavy}D9`
          : `${THEME_HEX.deepBlueNavy}D9`,
      padding: { x: 9, y: 5 },
      wordWrap: wrapWidth ? { width: wrapWidth, useAdvancedWrap: true } : undefined
    });

    label.setShadow(0, 2, isPaper ? THEME_HEX.mutedWarmText : THEME_HEX.darkRedShadow, 3, false, true);
    label.setVisible(PLAYER_WORLD_LABELS_VISIBLE);
    return label;
  }

  private createPlatformSkin(
    platform: { id: string; x: number; y: number; width: number; height: number },
    asset: PlatformerThemeAsset | undefined,
    alpha = 1
  ): Phaser.GameObjects.Image | undefined {
    const skin = this.createImageSkin(
      asset,
      platform.x + platform.width / 2,
      platform.y + platform.height / 2,
      platform.width,
      platform.height,
      PLATFORMER_DEPTHS.platformSkin,
      "stretch"
    );
    skin?.setName(`platformer-platform-skin:${platform.id}`).setAlpha(alpha);
    return skin;
  }

  private createChapterOnePlatformSurface(platform: PlatformSpec): void {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const shadowHeight = Math.min(10, Math.max(5, platform.height * 0.2));
    const edgeInset = Math.min(14, Math.max(6, platform.width * 0.05));

    this.scene.add.rectangle(centerX, platform.y + platform.height + 5, Math.max(8, platform.width - 8), shadowHeight, PHASER_THEME.midnightNavy, 0.34)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody + 0.15);

    const isPaper = platform.kind === "paper";
    const fill = platform.kind === "desk"
      ? PHASER_THEME.leatherBrown
      : isPaper
        ? PHASER_THEME.softParchment
        : PHASER_THEME.burgundy;
    const insetFill = platform.kind === "desk"
      ? PLATFORM_COLORS.desk
      : isPaper
        ? PHASER_THEME.softIvory
        : PLATFORM_COLORS.folder;
    const fillAlpha = isPaper ? 0.88 : 0.82;
    const insetAlpha = isPaper ? 0.36 : 0.32;
    this.scene.add.rectangle(centerX, centerY, platform.width, platform.height, fill, fillAlpha)
      .setStrokeStyle(2, PHASER_THEME.antiqueGold, 0.68)
      .setDepth(PLATFORMER_DEPTHS.platformSkin);
    this.scene.add.rectangle(centerX, centerY - platform.height * 0.15, Math.max(8, platform.width - edgeInset * 2), Math.max(4, platform.height * 0.48), insetFill, insetAlpha)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.05);
    this.scene.add.rectangle(centerX, platform.y + 5, Math.max(8, platform.width - edgeInset), 4, PHASER_THEME.softIvory, isPaper ? 0.26 : 0.14)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.09);
    if (isPaper && platform.width > 84) {
      this.scene.add.rectangle(centerX, centerY + platform.height * 0.08, Math.max(18, platform.width - 34), 1, PHASER_THEME.warmInkBrown, 0.22)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    }
    if (platform.width > 110) {
      const rivetY = Math.min(platform.y + platform.height - 5, platform.y + 18);
      this.scene.add.circle(platform.x + 18, rivetY, 2.4, PHASER_THEME.brassHighlight, 0.48)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.13);
      this.scene.add.circle(platform.x + platform.width - 18, rivetY, 2.4, PHASER_THEME.brassHighlight, 0.48)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.13);
    }
    this.drawChapterOneWalkableEdge(platform, isPaper ? 0.62 : 0.7);
  }

  private createChapterOneMovingPlatformSurface(platform: MovingPlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const shadow = this.scene.add.rectangle(
      0,
      platform.height / 2 + 4,
      Math.max(10, platform.width - 12),
      6,
      PHASER_THEME.midnightNavy,
      0.3
    );
    const body = this.scene.add.rectangle(
      0,
      0,
      platform.width,
      platform.height,
      PHASER_THEME.leatherBrown,
      0.9
    ).setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.86)
      .setDepth(0.02);
    const inset = this.scene.add.rectangle(
      0,
      -Math.max(2, platform.height * 0.16),
      Math.max(12, platform.width - 12),
      Math.max(3, platform.height * 0.28),
      PHASER_THEME.softParchment,
      0.34
    );
    const topEdge = this.scene.add.rectangle(
      0,
      -platform.height / 2 + 2,
      Math.max(10, platform.width - 8),
      3,
      PHASER_THEME.brassHighlight,
      0.78
    );
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, inset, topEdge])
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-platform-skin:${platform.id}`);
    return skin;
  }

  private createChapterTwoPlatformSurface(platform: PlatformSpec): void {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const inset = Math.min(18, Math.max(8, platform.width * 0.05));
    const shadowHeight = Math.min(12, Math.max(6, platform.height * 0.22));
    const isBrickLike = platform.kind === "brick" || platform.kind === "scaffold";
    const isTram = platform.kind === "tram";
    const fill = isTram
      ? PHASER_THEME.leatherBrown
      : isBrickLike
        ? PLATFORM_COLORS.brick
        : PHASER_THEME.softParchment;
    const insetFill = isTram
      ? PLATFORM_COLORS.desk
      : isBrickLike
        ? PHASER_THEME.warmInkBrown
        : PHASER_THEME.softIvory;
    const strokeAlpha = isBrickLike ? 0.74 : 0.62;

    this.scene.add.rectangle(centerX, platform.y + platform.height + 5, Math.max(8, platform.width - 8), shadowHeight, PHASER_THEME.midnightNavy, 0.34)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody + 0.15);
    this.scene.add.rectangle(centerX, centerY, platform.width, platform.height, fill, isBrickLike ? 0.78 : 0.82)
      .setStrokeStyle(2, PHASER_THEME.antiqueGold, strokeAlpha)
      .setDepth(PLATFORMER_DEPTHS.platformSkin);
    this.scene.add.rectangle(centerX, centerY - platform.height * 0.16, Math.max(10, platform.width - inset * 2), Math.max(4, platform.height * 0.42), insetFill, isBrickLike ? 0.22 : 0.3)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.04);
    this.scene.add.rectangle(centerX, platform.y + 3, Math.max(8, platform.width - 8), 3, PHASER_THEME.brassHighlight, 0.72)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.12);

    if (isBrickLike) {
      this.drawChapterTwoBrickCourse(platform, 0.2);
    } else if (isTram) {
      this.drawChapterTwoRouteRail(platform, 0.32);
    } else {
      this.scene.add.rectangle(centerX, centerY + platform.height * 0.08, Math.max(18, platform.width - 34), 1, PHASER_THEME.warmInkBrown, 0.18)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    }

    if (platform.width > 128) {
      this.scene.add.circle(platform.x + 20, platform.y + platform.height - 9, 2.6, PHASER_THEME.brassHighlight, 0.5)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
      this.scene.add.circle(platform.x + platform.width - 20, platform.y + platform.height - 9, 2.6, PHASER_THEME.brassHighlight, 0.5)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
    }
  }

  private createChapterTwoMovingPlatformSurface(platform: MovingPlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const shadow = this.scene.add.rectangle(0, platform.height / 2 + 5, Math.max(10, platform.width - 14), 7, PHASER_THEME.midnightNavy, 0.34);
    const body = this.scene.add.rectangle(0, 0, platform.width, platform.height, PHASER_THEME.leatherBrown, 0.9)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.84);
    const routeLine = this.scene.add.rectangle(0, -platform.height / 2 + 3, Math.max(10, platform.width - 10), 3, PHASER_THEME.brassHighlight, 0.78);
    const lowerRail = this.scene.add.rectangle(0, platform.height / 2 - 5, Math.max(12, platform.width - 18), 2, PHASER_THEME.silver, 0.28);
    const centerRoute = this.scene.add.rectangle(0, 0, Math.max(12, platform.width - 32), 1, PHASER_THEME.softIvory, 0.22);
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, routeLine, lowerRail, centerRoute])
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-platform-skin:${platform.id}`);
    return skin;
  }

  private createChapterTwoRebuildablePlatformSurface(platform: RebuildablePlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const body = this.scene.add.rectangle(0, 0, platform.width, platform.height, PLATFORM_COLORS.brick, 0.78)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.8);
    const glow = this.scene.add.rectangle(0, -platform.height / 2 + 3, Math.max(10, platform.width - 8), 3, PHASER_THEME.brassHighlight, 0.86);
    const mortar = this.scene.add.rectangle(0, 0, Math.max(12, platform.width - 20), 1, PHASER_THEME.softIvory, 0.18);
    const shadow = this.scene.add.rectangle(0, platform.height / 2 + 4, Math.max(8, platform.width - 10), 6, PHASER_THEME.midnightNavy, 0.28);
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, glow, mortar])
      .setAlpha(0.22)
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-rebuildable-skin:${platform.id}`);
    return skin;
  }

  private drawChapterTwoBrickCourse(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    for (let y = platform.y + 12; y < platform.y + platform.height - 6; y += 13) {
      this.scene.add.rectangle(centerX, y, Math.max(12, platform.width - 20), 1, PHASER_THEME.softIvory, alpha * 0.62)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    }
    for (let x = platform.x + 24; x < platform.x + platform.width - 10; x += 46) {
      this.scene.add.rectangle(x, platform.y + platform.height * 0.52, 2, Math.max(7, platform.height - 12), PHASER_THEME.warmInkBrown, alpha)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.09);
    }
  }

  private drawChapterTwoRouteRail(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    this.scene.add.rectangle(centerX, platform.y + platform.height - 9, Math.max(12, platform.width - 22), 2, PHASER_THEME.silver, alpha)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    this.scene.add.rectangle(centerX, platform.y + platform.height - 15, Math.max(12, platform.width - 42), 1, PHASER_THEME.softIvory, alpha * 0.54)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
  }

  private createChapterThreePlatformSurface(platform: PlatformSpec): void {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const isStone = platform.kind === "scaffold";
    const isPaper = platform.kind === "paper";
    const edgeInset = Math.min(18, Math.max(8, platform.width * 0.05));
    const fill = isStone ? PHASER_THEME.leatherBrown : PHASER_THEME.softParchment;
    const insetFill = isStone ? PHASER_THEME.warmInkBrown : PHASER_THEME.softIvory;

    this.scene.add.rectangle(centerX, platform.y + platform.height + 5, Math.max(8, platform.width - 8), Math.min(12, Math.max(6, platform.height * 0.22)), PHASER_THEME.midnightNavy, 0.36)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody + 0.15);
    this.scene.add.rectangle(centerX, centerY, platform.width, platform.height, fill, isStone ? 0.78 : 0.82)
      .setStrokeStyle(2, isStone ? PHASER_THEME.brassHighlight : PHASER_THEME.antiqueGold, isStone ? 0.62 : 0.58)
      .setDepth(PLATFORMER_DEPTHS.platformSkin);
    this.scene.add.rectangle(centerX, centerY - platform.height * 0.15, Math.max(10, platform.width - edgeInset * 2), Math.max(4, platform.height * 0.42), insetFill, isStone ? 0.2 : 0.28)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.04);
    this.scene.add.rectangle(centerX, platform.y + 3, Math.max(8, platform.width - 8), 3, isStone ? PHASER_THEME.brassHighlight : PHASER_THEME.softIvory, isStone ? 0.7 : 0.52)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.12);
    this.scene.add.rectangle(centerX, platform.y + platform.height - 4, Math.max(8, platform.width - 12), 2, PHASER_THEME.blueRibbon, isStone ? 0.14 : 0.1)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.1);

    if (isStone) {
      this.drawChapterThreeStoneCourses(platform, 0.18);
    } else if (isPaper) {
      this.drawChapterThreePaperLines(platform, 0.18);
    }

    if (platform.width > 132) {
      this.scene.add.circle(platform.x + 22, platform.y + platform.height - 9, 2.5, PHASER_THEME.brassHighlight, 0.44)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
      this.scene.add.circle(platform.x + platform.width - 22, platform.y + platform.height - 9, 2.5, PHASER_THEME.brassHighlight, 0.44)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
    }
  }

  private createChapterThreeMovingPlatformSurface(platform: MovingPlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const shadow = this.scene.add.rectangle(0, platform.height / 2 + 5, Math.max(10, platform.width - 14), 7, PHASER_THEME.midnightNavy, 0.36);
    const body = this.scene.add.rectangle(0, 0, platform.width, platform.height, PHASER_THEME.leatherBrown, 0.86)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.74);
    const paperInset = this.scene.add.rectangle(0, -Math.max(2, platform.height * 0.1), Math.max(12, platform.width - 18), Math.max(4, platform.height * 0.36), PHASER_THEME.softParchment, 0.28);
    const topEdge = this.scene.add.rectangle(0, -platform.height / 2 + 3, Math.max(10, platform.width - 10), 3, PHASER_THEME.brassHighlight, 0.72);
    const riverLine = this.scene.add.rectangle(0, platform.height / 2 - 5, Math.max(12, platform.width - 24), 2, PHASER_THEME.blueRibbon, 0.24);
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, paperInset, topEdge, riverLine])
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-platform-skin:${platform.id}`);
    return skin;
  }

  private drawChapterThreeStoneCourses(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    for (let y = platform.y + 13; y < platform.y + platform.height - 6; y += 14) {
      this.scene.add.rectangle(centerX, y, Math.max(12, platform.width - 22), 1, PHASER_THEME.softIvory, alpha * 0.45)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    }
    for (let x = platform.x + 28; x < platform.x + platform.width - 10; x += 52) {
      this.scene.add.rectangle(x, platform.y + platform.height * 0.52, 2, Math.max(7, platform.height - 12), PHASER_THEME.midnightNavy, alpha)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.09);
    }
  }

  private drawChapterThreePaperLines(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    for (let offset = 13; offset < platform.height - 6; offset += 12) {
      this.scene.add.rectangle(centerX, platform.y + offset, Math.max(18, platform.width - 30), 1, PHASER_THEME.warmInkBrown, alpha)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    }
  }

  private createChapterFourPlatformSurface(platform: PlatformSpec): void {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const isDesk = platform.kind === "desk";
    const isFolder = platform.kind === "folder";
    const isPaper = platform.kind === "paper";
    const edgeInset = Math.min(18, Math.max(8, platform.width * 0.05));
    const fill = isDesk
      ? PHASER_THEME.leatherBrown
      : isFolder
        ? PLATFORM_COLORS.desk
        : PHASER_THEME.deepGold;
    const insetFill = isFolder || isDesk ? PHASER_THEME.warmInkBrown : PHASER_THEME.softIvory;

    this.scene.add.rectangle(centerX, platform.y + platform.height + 5, Math.max(8, platform.width - 8), Math.min(12, Math.max(6, platform.height * 0.22)), PHASER_THEME.midnightNavy, 0.36)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody + 0.15);
    this.scene.add.rectangle(centerX, centerY, platform.width, platform.height, fill, isPaper ? 0.72 : 0.84)
      .setStrokeStyle(2, PHASER_THEME.antiqueGold, isPaper ? 0.62 : 0.68)
      .setDepth(PLATFORMER_DEPTHS.platformSkin);
    this.scene.add.rectangle(centerX, centerY - platform.height * 0.15, Math.max(10, platform.width - edgeInset * 2), Math.max(4, platform.height * 0.42), insetFill, isPaper ? 0.18 : 0.24)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.04);
    this.scene.add.rectangle(centerX, platform.y + 3, Math.max(8, platform.width - 8), 3, PHASER_THEME.brassHighlight, 0.72)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.12);
    this.scene.add.rectangle(centerX, platform.y + platform.height - 4, Math.max(8, platform.width - 12), 2, PLATFORM_COLORS.rose, isFolder || isDesk ? 0.16 : 0.1)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.1);

    if (isFolder || isDesk) {
      this.drawChapterFourArchiveDrawerLines(platform, isDesk ? 0.2 : 0.26);
    } else {
      this.drawChapterFourParchmentLines(platform, 0.2);
    }

    if (platform.width > 128) {
      this.scene.add.circle(platform.x + 22, platform.y + platform.height - 9, 2.7, PHASER_THEME.brassHighlight, 0.52)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
      this.scene.add.circle(platform.x + platform.width - 22, platform.y + platform.height - 9, 2.7, PHASER_THEME.brassHighlight, 0.52)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
    }
  }

  private createChapterFourMovingPlatformSurface(platform: MovingPlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const shadow = this.scene.add.rectangle(0, platform.height / 2 + 5, Math.max(10, platform.width - 14), 7, PHASER_THEME.midnightNavy, 0.36);
    const body = this.scene.add.rectangle(0, 0, platform.width, platform.height, PHASER_THEME.leatherBrown, 0.88)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.78);
    const parchmentInset = this.scene.add.rectangle(0, -Math.max(2, platform.height * 0.1), Math.max(12, platform.width - 18), Math.max(4, platform.height * 0.34), PHASER_THEME.softParchment, 0.26);
    const topEdge = this.scene.add.rectangle(0, -platform.height / 2 + 3, Math.max(10, platform.width - 10), 3, PHASER_THEME.brassHighlight, 0.76);
    const drawerHandle = this.scene.add.rectangle(0, platform.height / 2 - 7, Math.max(16, platform.width * 0.34), 3, PHASER_THEME.softIvory, 0.28);
    const sideRailLeft = this.scene.add.rectangle(-platform.width / 2 + 8, 0, 3, Math.max(8, platform.height - 10), PHASER_THEME.brassHighlight, 0.38);
    const sideRailRight = this.scene.add.rectangle(platform.width / 2 - 8, 0, 3, Math.max(8, platform.height - 10), PHASER_THEME.brassHighlight, 0.38);
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, parchmentInset, topEdge, drawerHandle, sideRailLeft, sideRailRight])
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-platform-skin:${platform.id}`);
    return skin;
  }

  private drawChapterFourArchiveDrawerLines(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    this.scene.add.rectangle(centerX, platform.y + platform.height * 0.52, Math.max(16, platform.width - 24), 1, PHASER_THEME.softIvory, alpha)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    this.scene.add.rectangle(centerX, platform.y + platform.height * 0.68, Math.max(20, platform.width * 0.32), 2, PHASER_THEME.brassHighlight, alpha * 1.2)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.1);
    for (let x = platform.x + 34; x < platform.x + platform.width - 10; x += 78) {
      this.scene.add.rectangle(x, platform.y + platform.height * 0.54, 2, Math.max(7, platform.height - 14), PHASER_THEME.midnightNavy, alpha * 0.7)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.09);
    }
  }

  private drawChapterFourParchmentLines(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    for (let offset = 13; offset < platform.height - 6; offset += 12) {
      this.scene.add.rectangle(centerX, platform.y + offset, Math.max(18, platform.width - 30), 1, PHASER_THEME.warmInkBrown, alpha)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    }
    this.scene.add.rectangle(platform.x + Math.min(34, platform.width * 0.18), centerY, 2, Math.max(8, platform.height - 12), PLATFORM_COLORS.rose, alpha * 0.9)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.09);
  }

  private drawArchiveKeyFallback(key: ArchiveKeySpec, centerX: number, centerY: number, isSilverKey: boolean): void {
    const color = isSilverKey ? PHASER_THEME.silver : PHASER_THEME.brassHighlight;
    this.scene.add.circle(centerX - key.width * 0.18, centerY, Math.max(5, key.height * 0.18), color, 0.9)
      .setStrokeStyle(2, PHASER_THEME.softIvory, 0.58)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin);
    this.scene.add.rectangle(centerX + key.width * 0.08, centerY, Math.max(18, key.width * 0.62), 5, color, 0.92)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin);
    this.scene.add.rectangle(centerX + key.width * 0.34, centerY + 7, 5, 13, color, 0.88)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin);
  }

  private createChapterFivePlatformSurface(platform: PlatformSpec): void {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const isStone = platform.kind === "scaffold" || platform.kind === "folder";
    const isPaper = platform.kind === "paper";
    const edgeInset = Math.min(18, Math.max(8, platform.width * 0.05));
    const fill = isStone ? PHASER_THEME.deepBlueNavy : PHASER_THEME.leatherBrown;
    const insetFill = isStone ? PHASER_THEME.panelNavy : PHASER_THEME.softParchment;

    this.scene.add.rectangle(centerX, platform.y + platform.height + 5, Math.max(8, platform.width - 8), Math.min(12, Math.max(6, platform.height * 0.22)), PHASER_THEME.midnightNavy, 0.38)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody + 0.15);
    this.scene.add.rectangle(centerX, centerY, platform.width, platform.height, fill, isStone ? 0.86 : 0.8)
      .setStrokeStyle(2, PHASER_THEME.antiqueGold, isStone ? 0.68 : 0.6)
      .setDepth(PLATFORMER_DEPTHS.platformSkin);
    this.scene.add.rectangle(centerX, centerY - platform.height * 0.14, Math.max(10, platform.width - edgeInset * 2), Math.max(4, platform.height * 0.42), insetFill, isStone ? 0.26 : 0.24)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.04);
    this.scene.add.rectangle(centerX, platform.y + 3, Math.max(8, platform.width - 8), 3, PHASER_THEME.brassHighlight, 0.74)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.12);
    this.scene.add.rectangle(centerX, platform.y + platform.height - 4, Math.max(8, platform.width - 12), 2, isPaper ? PHASER_THEME.blueRibbon : PHASER_THEME.silver, isPaper ? 0.18 : 0.16)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.1);

    if (isStone) {
      this.drawChapterFiveCourtStoneLines(platform, 0.18);
    } else {
      this.drawChapterFiveParchmentLines(platform, 0.18);
    }

    if (platform.width > 128) {
      this.scene.add.circle(platform.x + 22, platform.y + platform.height - 9, 2.7, PHASER_THEME.brassHighlight, 0.5)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
      this.scene.add.circle(platform.x + platform.width - 22, platform.y + platform.height - 9, 2.7, PHASER_THEME.brassHighlight, 0.5)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
    }
  }

  private createChapterFiveMovingPlatformSurface(platform: MovingPlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const shadow = this.scene.add.rectangle(0, platform.height / 2 + 5, Math.max(10, platform.width - 14), 7, PHASER_THEME.midnightNavy, 0.38);
    const body = this.scene.add.rectangle(0, 0, platform.width, platform.height, PHASER_THEME.leatherBrown, 0.88)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.78);
    const courtInset = this.scene.add.rectangle(0, -Math.max(2, platform.height * 0.1), Math.max(12, platform.width - 18), Math.max(4, platform.height * 0.34), PHASER_THEME.deepBlueNavy, 0.26);
    const topEdge = this.scene.add.rectangle(0, -platform.height / 2 + 3, Math.max(10, platform.width - 10), 3, PHASER_THEME.brassHighlight, 0.78);
    const blueTrace = this.scene.add.rectangle(0, platform.height / 2 - 6, Math.max(12, platform.width - 26), 2, PHASER_THEME.blueRibbon, 0.3);
    const sideRailLeft = this.scene.add.rectangle(-platform.width / 2 + 8, 0, 3, Math.max(8, platform.height - 10), PHASER_THEME.silver, 0.22);
    const sideRailRight = this.scene.add.rectangle(platform.width / 2 - 8, 0, 3, Math.max(8, platform.height - 10), PHASER_THEME.silver, 0.22);
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, courtInset, topEdge, blueTrace, sideRailLeft, sideRailRight])
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-platform-skin:${platform.id}`);
    return skin;
  }

  private createChapterFiveLightPlatformSurface(platform: LightRevealedPlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const body = this.scene.add.rectangle(0, 0, platform.width, platform.height, PHASER_THEME.leatherBrown, 0.82)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.84);
    const glow = this.scene.add.rectangle(0, -platform.height / 2 + 3, Math.max(10, platform.width - 8), 3, PHASER_THEME.brassHighlight, 0.9);
    const blueTrace = this.scene.add.rectangle(0, platform.height / 2 - 5, Math.max(12, platform.width - 20), 2, PHASER_THEME.blueRibbon, 0.28);
    const shadow = this.scene.add.rectangle(0, platform.height / 2 + 4, Math.max(8, platform.width - 10), 6, PHASER_THEME.midnightNavy, 0.3);
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, glow, blueTrace])
      .setAlpha(0.18)
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-light-platform-skin:${platform.id}`);
    return skin;
  }

  private drawChapterFiveChoiceDoorSurface(door: ChoiceDoorSpec, centerX: number, centerY: number): void {
    const fill = door.isCorrectPath ? PHASER_THEME.leatherBrown : PHASER_THEME.deepBlueNavy;
    const glowColor = door.isCorrectPath ? PHASER_THEME.brassHighlight : PHASER_THEME.blueRibbon;
    this.scene.add.circle(centerX, centerY, Math.max(door.width, door.height) * 0.56, glowColor, door.isCorrectPath ? 0.08 : 0.045)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 1);
    this.scene.add.rectangle(centerX, centerY, door.width, door.height, fill, 0.82)
      .setStrokeStyle(2, PHASER_THEME.antiqueGold, door.isCorrectPath ? 0.7 : 0.48)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.4);
    this.scene.add.rectangle(centerX, centerY + door.height * 0.06, Math.max(8, door.width - 18), Math.max(8, door.height - 22), PHASER_THEME.midnightNavy, 0.42)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.3);
    this.scene.add.rectangle(centerX, door.y + 10, Math.max(8, door.width - 18), 3, PHASER_THEME.brassHighlight, 0.55)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.2);
    this.scene.add.circle(centerX + door.width * 0.22, centerY + door.height * 0.08, 2.5, PHASER_THEME.brassHighlight, 0.62)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.1);
  }

  private drawChapterFiveLanternFallback(lantern: LanternSwitchSpec, centerX: number, centerY: number): void {
    this.scene.add.rectangle(centerX, centerY, lantern.width * 0.42, lantern.height * 0.56, PHASER_THEME.leatherBrown, 0.86)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.78)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin);
    this.scene.add.circle(centerX, centerY + lantern.height * 0.05, lantern.height * 0.16, PHASER_THEME.softIvory, 0.82)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin + 0.05);
    this.scene.add.rectangle(centerX, centerY - lantern.height * 0.34, lantern.width * 0.34, 4, PHASER_THEME.brassHighlight, 0.76)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin + 0.05);
  }

  private drawChapterFiveCourtStoneLines(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    this.scene.add.rectangle(centerX, platform.y + platform.height * 0.52, Math.max(16, platform.width - 24), 1, PHASER_THEME.softIvory, alpha)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    for (let x = platform.x + 36; x < platform.x + platform.width - 10; x += 86) {
      this.scene.add.rectangle(x, platform.y + platform.height * 0.54, 2, Math.max(7, platform.height - 14), PHASER_THEME.midnightNavy, alpha * 0.74)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.09);
    }
  }

  private drawChapterFiveParchmentLines(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    for (let offset = 13; offset < platform.height - 6; offset += 12) {
      this.scene.add.rectangle(centerX, platform.y + offset, Math.max(18, platform.width - 30), 1, PHASER_THEME.softIvory, alpha)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    }
  }

  private createChapterSixPlatformSurface(platform: PlatformSpec): void {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const isStone = platform.kind === "scaffold" || platform.kind === "brick";
    const isPaper = platform.kind === "paper";
    const edgeInset = Math.min(18, Math.max(8, platform.width * 0.05));
    const fill = isStone ? PHASER_THEME.midnightNavy : PHASER_THEME.leatherBrown;
    const insetFill = isStone ? PHASER_THEME.deepBlueNavy : PHASER_THEME.softParchment;

    this.scene.add.rectangle(centerX, platform.y + platform.height + 5, Math.max(8, platform.width - 8), Math.min(13, Math.max(6, platform.height * 0.24)), PHASER_THEME.midnightNavy, 0.4)
      .setDepth(PLATFORMER_DEPTHS.primitiveBody + 0.15);
    this.scene.add.rectangle(centerX, centerY, platform.width, platform.height, fill, isStone ? 0.88 : 0.82)
      .setStrokeStyle(2, isStone ? PHASER_THEME.silver : PHASER_THEME.antiqueGold, isStone ? 0.56 : 0.62)
      .setDepth(PLATFORMER_DEPTHS.platformSkin);
    this.scene.add.rectangle(centerX, centerY - platform.height * 0.14, Math.max(10, platform.width - edgeInset * 2), Math.max(4, platform.height * 0.42), insetFill, isStone ? 0.24 : 0.26)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.04);
    this.scene.add.rectangle(centerX, platform.y + 3, Math.max(8, platform.width - 8), 3, PHASER_THEME.brassHighlight, 0.76)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.12);
    this.scene.add.rectangle(centerX, platform.y + platform.height - 4, Math.max(8, platform.width - 12), 2, isPaper ? PLATFORM_COLORS.rose : PHASER_THEME.silver, isPaper ? 0.16 : 0.18)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.1);

    if (isStone) {
      this.drawChapterSixRooftopStoneLines(platform, 0.18);
    } else {
      this.drawChapterSixVerdictPaperLines(platform, 0.18);
    }

    if (platform.width > 128) {
      this.scene.add.circle(platform.x + 22, platform.y + platform.height - 9, 2.7, PHASER_THEME.brassHighlight, 0.52)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
      this.scene.add.circle(platform.x + platform.width - 22, platform.y + platform.height - 9, 2.7, PHASER_THEME.brassHighlight, 0.52)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.14);
    }
  }

  private createChapterSixMovingPlatformSurface(platform: MovingPlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const shadow = this.scene.add.rectangle(0, platform.height / 2 + 5, Math.max(10, platform.width - 14), 7, PHASER_THEME.midnightNavy, 0.4);
    const body = this.scene.add.rectangle(0, 0, platform.width, platform.height, PHASER_THEME.deepBlueNavy, 0.88)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.76);
    const sealInset = this.scene.add.rectangle(0, -Math.max(2, platform.height * 0.1), Math.max(12, platform.width - 18), Math.max(4, platform.height * 0.34), PHASER_THEME.leatherBrown, 0.25);
    const topEdge = this.scene.add.rectangle(0, -platform.height / 2 + 3, Math.max(10, platform.width - 10), 3, PHASER_THEME.brassHighlight, 0.82);
    const clueTrace = this.scene.add.rectangle(0, platform.height / 2 - 6, Math.max(12, platform.width - 26), 2, PHASER_THEME.silver, 0.24);
    const sideRailLeft = this.scene.add.rectangle(-platform.width / 2 + 8, 0, 3, Math.max(8, platform.height - 10), PHASER_THEME.brassHighlight, 0.32);
    const sideRailRight = this.scene.add.rectangle(platform.width / 2 - 8, 0, 3, Math.max(8, platform.height - 10), PHASER_THEME.brassHighlight, 0.32);
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, sealInset, topEdge, clueTrace, sideRailLeft, sideRailRight])
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-platform-skin:${platform.id}`);
    return skin;
  }

  private createChapterSixRebuildablePlatformSurface(platform: RebuildablePlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const body = this.scene.add.rectangle(0, 0, platform.width, platform.height, PHASER_THEME.midnightNavy, 0.84)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.82);
    const glow = this.scene.add.rectangle(0, -platform.height / 2 + 3, Math.max(10, platform.width - 8), 3, PHASER_THEME.brassHighlight, 0.9);
    const silverTrace = this.scene.add.rectangle(0, platform.height / 2 - 5, Math.max(12, platform.width - 18), 2, PHASER_THEME.silver, 0.24);
    const shadow = this.scene.add.rectangle(0, platform.height / 2 + 4, Math.max(8, platform.width - 10), 6, PHASER_THEME.midnightNavy, 0.32);
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, glow, silverTrace])
      .setAlpha(0.2)
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-rebuildable-skin:${platform.id}`);
    return skin;
  }

  private createChapterSixLightPlatformSurface(platform: LightRevealedPlatformSpec): PlatformerSkin | undefined {
    const centerX = platform.x + platform.width / 2;
    const centerY = platform.y + platform.height / 2;
    const body = this.scene.add.rectangle(0, 0, platform.width, platform.height, PHASER_THEME.deepBlueNavy, 0.82)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.84);
    const glow = this.scene.add.rectangle(0, -platform.height / 2 + 3, Math.max(10, platform.width - 8), 3, PHASER_THEME.brassHighlight, 0.92);
    const blueTrace = this.scene.add.rectangle(0, platform.height / 2 - 5, Math.max(12, platform.width - 20), 2, PHASER_THEME.blueRibbon, 0.26);
    const shadow = this.scene.add.rectangle(0, platform.height / 2 + 4, Math.max(8, platform.width - 10), 6, PHASER_THEME.midnightNavy, 0.32);
    const skin = this.scene.add.container(centerX, centerY, [shadow, body, glow, blueTrace])
      .setAlpha(0.18)
      .setDepth(PLATFORMER_DEPTHS.platformSkin)
      .setName(`platformer-light-platform-skin:${platform.id}`);
    return skin;
  }

  private drawChapterSixLanternFallback(lantern: LanternSwitchSpec, centerX: number, centerY: number): void {
    this.scene.add.rectangle(centerX, centerY, lantern.width * 0.44, lantern.height * 0.56, PHASER_THEME.midnightNavy, 0.88)
      .setStrokeStyle(2, PHASER_THEME.brassHighlight, 0.78)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin);
    this.scene.add.circle(centerX, centerY + lantern.height * 0.04, lantern.height * 0.16, PHASER_THEME.softIvory, 0.82)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin + 0.05);
    this.scene.add.circle(centerX, centerY + lantern.height * 0.04, lantern.height * 0.28, PHASER_THEME.brassHighlight, 0.12)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin - 0.05);
    this.scene.add.rectangle(centerX, centerY - lantern.height * 0.34, lantern.width * 0.34, 4, PHASER_THEME.silver, 0.62)
      .setDepth(PLATFORMER_DEPTHS.interactableSkin + 0.05);
  }

  private drawChapterSixRooftopStoneLines(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    this.scene.add.rectangle(centerX, platform.y + platform.height * 0.52, Math.max(16, platform.width - 24), 1, PHASER_THEME.softIvory, alpha * 0.74)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    for (let x = platform.x + 38; x < platform.x + platform.width - 10; x += 88) {
      this.scene.add.rectangle(x, platform.y + platform.height * 0.54, 2, Math.max(7, platform.height - 14), PHASER_THEME.panelNavy, alpha * 0.78)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.09);
    }
  }

  private drawChapterSixVerdictPaperLines(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    for (let offset = 13; offset < platform.height - 6; offset += 12) {
      this.scene.add.rectangle(centerX, platform.y + offset, Math.max(18, platform.width - 30), 1, PHASER_THEME.softIvory, alpha)
        .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.08);
    }
    this.scene.add.rectangle(platform.x + Math.min(34, platform.width * 0.18), platform.y + platform.height / 2, 2, Math.max(8, platform.height - 12), PLATFORM_COLORS.rose, alpha * 0.76)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.09);
  }

  private drawChapterOneWalkableEdge(
    platform: { x: number; y: number; width: number; height: number },
    alpha: number
  ): void {
    const centerX = platform.x + platform.width / 2;
    this.scene.add.rectangle(centerX, platform.y + 2, Math.max(8, platform.width - 8), 3, PHASER_THEME.brassHighlight, alpha)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.12);
    this.scene.add.rectangle(centerX, platform.y + platform.height - 2, Math.max(8, platform.width - 10), 2, PHASER_THEME.warmInkBrown, 0.28)
      .setDepth(PLATFORMER_DEPTHS.platformSkin + 0.12);
  }

  private createImageSkin(
    asset: PlatformerThemeAsset | undefined,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    depth: number,
    fit: "cover" | "contain" | "stretch",
    crop?: ImageSkinCrop
  ): Phaser.GameObjects.Image | undefined {
    if (!asset?.imageUrl || !this.scene.textures.exists(asset.textureKey)) {
      return undefined;
    }

    const image = this.scene.add.image(centerX, centerY, asset.textureKey)
      .setDepth(depth)
      .setName(`platformer-skin:${asset.filename}`);
    const source = this.scene.textures.get(asset.textureKey).getSourceImage() as HTMLImageElement | HTMLCanvasElement;
    const sourceWidth = source.width;
    const sourceHeight = source.height;
    const cropWidth = crop ? crop.width * sourceWidth : sourceWidth;
    const cropHeight = crop ? crop.height * sourceHeight : sourceHeight;

    if (crop) {
      image.setCrop(
        Math.round(crop.x * sourceWidth),
        Math.round(crop.y * sourceHeight),
        Math.round(cropWidth),
        Math.round(cropHeight)
      );
    }

    if (fit === "stretch") {
      image.setDisplaySize(width, height);
      image.disableInteractive();
      return image;
    }

    const scale = fit === "cover"
      ? Math.max(width / cropWidth, height / cropHeight)
      : Math.min(width / cropWidth, height / cropHeight);

    image.setScale(scale);
    image.disableInteractive();
    return image;
  }

  private getMovingPlatformAsset(platform: MovingPlatformSpec): PlatformerThemeAsset | undefined {
    if (platform.axis === "vertical") {
      return this.activeTheme?.movingPlatforms.elevator ?? this.activeTheme?.movingPlatforms[platform.kind];
    }

    return this.activeTheme?.movingPlatforms[platform.kind];
  }

  private isChapterOneFinalArtActive(): boolean {
    return this.activeTheme?.levelId === 1 && Boolean(this.activeTheme.background?.imageUrl);
  }

  private isChapterTwoFinalArtActive(): boolean {
    return this.activeTheme?.levelId === 2 && Boolean(this.activeTheme.background?.imageUrl);
  }

  private isChapterThreeFinalArtActive(): boolean {
    return this.activeTheme?.levelId === 4 && Boolean(this.activeTheme.background?.imageUrl);
  }

  private isChapterFourFinalArtActive(): boolean {
    return this.activeTheme?.levelId === 5 && Boolean(this.activeTheme.background?.imageUrl);
  }

  private isChapterFiveFinalArtActive(): boolean {
    return this.activeTheme?.levelId === 6 && Boolean(this.activeTheme.background?.imageUrl);
  }

  private isChapterSixFinalArtActive(): boolean {
    return this.activeTheme?.levelId === 9 && Boolean(this.activeTheme.background?.imageUrl);
  }

  private createZone(x: number, y: number, width: number, height: number): Phaser.GameObjects.Zone {
    const zone = this.scene.add.zone(x + width / 2, y + height / 2, width, height);
    this.scene.physics.add.existing(zone, true);
    (zone.body as Phaser.Physics.Arcade.StaticBody).setSize(width, height);
    return zone;
  }
}

function getPlatformColor(kind: PlatformSpec["kind"]): number {
  switch (kind) {
    case "desk":
      return PLATFORM_COLORS.desk;
    case "paper":
      return PLATFORM_COLORS.paper;
    case "folder":
      return PLATFORM_COLORS.folder;
    case "tram":
      return PLATFORM_COLORS.tram;
    case "calendar":
      return PLATFORM_COLORS.calendar;
    case "brick":
      return PLATFORM_COLORS.brick;
    case "scaffold":
      return PLATFORM_COLORS.folder;
  }
}

type ExhibitMotif = "envelope" | "stamp" | "brick" | "note" | "key" | "lantern" | "ribbon" | "letter" | "heart";

function getExhibitMotif(name: string): ExhibitMotif {
  const normalized = name.toLowerCase();

  if (normalized.includes("stamp")) {
    return "stamp";
  }

  if (normalized.includes("brick")) {
    return "brick";
  }

  if (normalized.includes("key")) {
    return "key";
  }

  if (normalized.includes("lantern")) {
    return "lantern";
  }

  if (normalized.includes("ribbon")) {
    return "ribbon";
  }

  if (normalized.includes("heart")) {
    return "heart";
  }

  if (normalized.includes("letter")) {
    return "letter";
  }

  if (normalized.includes("note")) {
    return "note";
  }

  return "envelope";
}

function getExhibitFill(name: string): number {
  switch (getExhibitMotif(name)) {
    case "stamp":
      return PLATFORM_COLORS.gold;
    case "brick":
      return PLATFORM_COLORS.brick;
    case "key":
      return PHASER_THEME.silver;
    case "lantern":
      return PHASER_THEME.leatherBrown;
    case "ribbon":
      return PHASER_THEME.blueRibbon;
    case "heart":
      return PLATFORM_COLORS.rose;
    case "note":
    case "letter":
    case "envelope":
      return PLATFORM_COLORS.envelope;
  }
}
