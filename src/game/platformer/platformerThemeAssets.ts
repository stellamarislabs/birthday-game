import type { MovingPlatformSpec, PlatformSpec } from "./levelGeometry";

export type PlatformerThemeAssetKey =
  | "background"
  | "staticPlatform"
  | "movingPlatform"
  | "primaryClue"
  | "secondaryClue"
  | "lanternSwitch"
  | "exitDoor"
  | "checkpoint";

export interface PlatformerThemeAsset {
  filename: string;
  textureKey: string;
  imageUrl?: string;
}

export interface PlatformerThemeAssetConfig {
  levelId: number;
  background?: string;
  staticPlatforms?: Partial<Record<PlatformSpec["kind"], string>>;
  movingPlatforms?: Partial<Record<MovingPlatformSpec["kind"] | "elevator", string>>;
  clues?: {
    primary?: string;
    secondary?: string;
  };
  interactables?: {
    lanternSwitch?: string;
  };
  exitDoor?: string;
  checkpoint?: string;
}

export interface PlatformerThemeAssets {
  levelId: number;
  background?: PlatformerThemeAsset;
  staticPlatforms: Partial<Record<PlatformSpec["kind"], PlatformerThemeAsset>>;
  movingPlatforms: Partial<Record<MovingPlatformSpec["kind"] | "elevator", PlatformerThemeAsset>>;
  clues: {
    primary?: PlatformerThemeAsset;
    secondary?: PlatformerThemeAsset;
  };
  interactables: {
    lanternSwitch?: PlatformerThemeAsset;
  };
  exitDoor?: PlatformerThemeAsset;
  checkpoint?: PlatformerThemeAsset;
}

export const ACTIVE_PLATFORMER_THEME_LEVEL_IDS = [1, 2, 4, 5, 6, 9] as const;
export const SHARED_CHECKPOINT_MARKER_FILENAMES = ["checkpoint-marker-brass.png", "checkpoint-marker-brass.webp"] as const;

export const PLATFORMER_THEME_ASSET_CONFIGS: Record<number, PlatformerThemeAssetConfig> = {
  1: {
    levelId: 1,
    background: "chapter01-platformer-bg.webp",
    staticPlatforms: {
      paper: "chapter01-platform-static-paper.webp"
    },
    movingPlatforms: {
      elevator: "chapter01-platform-moving-elevator.webp",
      paper: "chapter01-platform-moving-elevator.webp"
    },
    clues: {
      primary: "chapter01-clue-envelope.webp"
    },
    exitDoor: "chapter01-exit-case-door.webp",
    checkpoint: "checkpoint-marker-brass.png"
  },
  2: {
    levelId: 2,
    background: "chapter02-platformer-bg.webp",
    staticPlatforms: {
      brick: "chapter02-platform-static-brick.webp"
    },
    movingPlatforms: {
      tram: "chapter02-platform-moving-tram.webp"
    },
    clues: {
      primary: "chapter02-clue-stamp.webp"
    },
    exitDoor: "chapter02-exit-hidden-wall.webp",
    checkpoint: "checkpoint-marker-brass.png"
  },
  4: {
    levelId: 4,
    background: "chapter03-platformer-bg.webp",
    staticPlatforms: {
      scaffold: "chapter03-platform-static-river-stone.webp"
    },
    movingPlatforms: {
      paper: "chapter03-platform-moving-bridge.webp"
    },
    clues: {
      primary: "chapter03-clue-witness-note.webp"
    },
    exitDoor: "chapter03-exit-archive-code.webp",
    checkpoint: "checkpoint-marker-brass.png"
  },
  5: {
    levelId: 5,
    background: "chapter04-platformer-bg.webp",
    staticPlatforms: {
      folder: "chapter04-platform-static-archive-drawer.webp"
    },
    movingPlatforms: {
      elevator: "chapter04-platform-moving-file-lift.webp",
      paper: "chapter04-platform-moving-file-lift.webp"
    },
    clues: {
      primary: "chapter04-clue-marginal-note.webp",
      secondary: "chapter04-clue-silver-key.webp"
    },
    exitDoor: "chapter04-exit-archive-door.webp",
    checkpoint: "checkpoint-marker-brass.png"
  },
  6: {
    levelId: 6,
    background: "chapter05-platformer-bg.webp",
    staticPlatforms: {
      scaffold: "chapter05-platform-static-courthouse.webp"
    },
    movingPlatforms: {
      elevator: "chapter05-platform-moving-trust-lift.webp",
      paper: "chapter05-platform-moving-trust-lift.webp"
    },
    clues: {
      primary: "chapter05-clue-blue-ribbon.webp"
    },
    interactables: {
      lanternSwitch: "chapter05-lantern-switch.webp"
    },
    exitDoor: "chapter05-exit-trust-door.webp",
    checkpoint: "checkpoint-marker-brass.png"
  },
  9: {
    levelId: 9,
    background: "chapter06-platformer-bg.webp",
    staticPlatforms: {
      scaffold: "chapter06-platform-static-rooftop-court.webp"
    },
    movingPlatforms: {
      elevator: "chapter06-platform-moving-final-seal.webp",
      paper: "chapter06-platform-moving-final-seal.webp"
    },
    clues: {
      primary: "chapter06-clue-heart-fragment.webp"
    },
    exitDoor: "chapter06-exit-final-court-door.webp",
    checkpoint: "checkpoint-marker-brass.png"
  }
};

const finalPlatformerAssetUrls = import.meta.glob("../../assets/final/platformer/*.{png,webp}", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

export function getPlatformerThemeAssets(
  levelId: number,
  assetUrls: Record<string, string> = finalPlatformerAssetUrls
): PlatformerThemeAssets | undefined {
  const config = PLATFORMER_THEME_ASSET_CONFIGS[levelId];
  if (!config) {
    return undefined;
  }

  return {
    levelId,
    background: resolvePlatformerThemeAsset(config.background, assetUrls),
    staticPlatforms: resolveAssetMap(config.staticPlatforms, assetUrls),
    movingPlatforms: resolveAssetMap(config.movingPlatforms, assetUrls),
    clues: {
      primary: resolvePlatformerThemeAsset(config.clues?.primary, assetUrls),
      secondary: resolvePlatformerThemeAsset(config.clues?.secondary, assetUrls)
    },
    interactables: {
      lanternSwitch: resolvePlatformerThemeAsset(config.interactables?.lanternSwitch, assetUrls)
    },
    exitDoor: resolvePlatformerThemeAsset(config.exitDoor, assetUrls),
    checkpoint: resolvePlatformerThemeAsset(config.checkpoint, assetUrls)
  };
}

export function listExpectedPlatformerThemeFilenames(): string[] {
  const filenames = new Set<string>();

  for (const config of Object.values(PLATFORMER_THEME_ASSET_CONFIGS)) {
    collectFilename(filenames, config.background);
    for (const filename of Object.values(config.staticPlatforms ?? {})) {
      collectFilename(filenames, filename);
    }
    for (const filename of Object.values(config.movingPlatforms ?? {})) {
      collectFilename(filenames, filename);
    }
    collectFilename(filenames, config.clues?.primary);
    collectFilename(filenames, config.clues?.secondary);
    collectFilename(filenames, config.interactables?.lanternSwitch);
    collectFilename(filenames, config.exitDoor);
    collectFilename(filenames, config.checkpoint);
  }
  for (const filename of SHARED_CHECKPOINT_MARKER_FILENAMES) {
    collectFilename(filenames, filename);
  }

  return [...filenames].sort();
}

function resolveAssetMap<Key extends string>(
  filenames: Partial<Record<Key, string>> | undefined,
  assetUrls: Record<string, string>
): Partial<Record<Key, PlatformerThemeAsset>> {
  const assets: Partial<Record<Key, PlatformerThemeAsset>> = {};

  for (const [key, filename] of Object.entries(filenames ?? {}) as Array<[Key, string]>) {
    assets[key] = resolvePlatformerThemeAsset(filename, assetUrls);
  }

  return assets;
}

function resolvePlatformerThemeAsset(
  filename: string | undefined,
  assetUrls: Record<string, string>
): PlatformerThemeAsset | undefined {
  if (!filename) {
    return undefined;
  }
  const resolvedFilename = resolveExistingFilename(filename, assetUrls);

  return {
    filename: resolvedFilename,
    textureKey: `platformer-final:${resolvedFilename}`,
    imageUrl: assetUrls[`../../assets/final/platformer/${resolvedFilename}`]
  };
}

function resolveExistingFilename(filename: string, assetUrls: Record<string, string>): string {
  if (assetUrls[`../../assets/final/platformer/${filename}`]) {
    return filename;
  }

  if (SHARED_CHECKPOINT_MARKER_FILENAMES.includes(filename as (typeof SHARED_CHECKPOINT_MARKER_FILENAMES)[number])) {
    return SHARED_CHECKPOINT_MARKER_FILENAMES.find((candidate) => {
      return Boolean(assetUrls[`../../assets/final/platformer/${candidate}`]);
    }) ?? filename;
  }

  return filename;
}

function collectFilename(filenames: Set<string>, filename: string | undefined): void {
  if (filename) {
    filenames.add(filename);
  }
}
