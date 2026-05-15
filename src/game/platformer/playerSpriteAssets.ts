export type PlayerSpriteState = "idle" | "walk" | "jump";

export interface PlayerSpriteAsset {
  state: PlayerSpriteState;
  filename: string;
  textureKey: string;
  imageUrl?: string;
}

export interface PlayerSpriteAssets {
  idle: PlayerSpriteAsset;
  walk: PlayerSpriteAsset;
  jump: PlayerSpriteAsset;
  isUsable: boolean;
  transparencyApproved: boolean;
}

export interface PlayerSpriteCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PLAYER_SPRITE_DISPLAY_HEIGHT = 160;
export const PLAYER_SPRITE_SCALE_X = 1.12;
export const PLAYER_SPRITE_MIN_DISPLAY_WIDTH = 72;
export const PLAYER_SPRITE_FOOT_OFFSET_Y = 7;

export const PLAYER_SPRITE_FILENAMES: Record<PlayerSpriteState, string> = {
  idle: "maria-idle.png",
  walk: "maria-walk.png",
  jump: "maria-jump.png"
};

export const PLAYER_SPRITE_TRANSPARENCY_APPROVED = true;

export const PLAYER_SPRITE_CROPS: Record<PlayerSpriteState, PlayerSpriteCrop> = {
  idle: { x: 260, y: 88, width: 450, height: 1340 },
  walk: { x: 160, y: 90, width: 700, height: 1330 },
  jump: { x: 110, y: 80, width: 750, height: 1250 }
};

const finalPlayerSpriteUrls = PLAYER_SPRITE_TRANSPARENCY_APPROVED
  ? (import.meta.glob("../../assets/final/platformer/player/maria-*.png", {
      eager: true,
      import: "default",
      query: "?url"
    }) as Record<string, string>)
  : {};

export function getPlayerSpriteAssets(
  assetUrls: Record<string, string> = finalPlayerSpriteUrls,
  transparencyApproved = PLAYER_SPRITE_TRANSPARENCY_APPROVED
): PlayerSpriteAssets {
  const idle = resolvePlayerSpriteAsset("idle", assetUrls);
  const walk = resolvePlayerSpriteAsset("walk", assetUrls);
  const jump = resolvePlayerSpriteAsset("jump", assetUrls);
  const hasAllUrls = Boolean(idle.imageUrl && walk.imageUrl && jump.imageUrl);

  return {
    idle,
    walk,
    jump,
    isUsable: hasAllUrls && transparencyApproved,
    transparencyApproved
  };
}

export function listExpectedPlayerSpriteFilenames(): string[] {
  return Object.values(PLAYER_SPRITE_FILENAMES);
}

function resolvePlayerSpriteAsset(
  state: PlayerSpriteState,
  assetUrls: Record<string, string>
): PlayerSpriteAsset {
  const filename = PLAYER_SPRITE_FILENAMES[state];

  return {
    state,
    filename,
    textureKey: `platformer-player:${filename}`,
    imageUrl: assetUrls[`../../assets/final/platformer/player/${filename}`]
  };
}
