import type { MusicTrackRequest } from "../systems/AudioManager";
import {
  type AudioCanPlayType,
  getChapterMusicAsset,
  getChapterMusicAssetForPuzzleLevel,
  getPlatformerMusicAsset,
  selectPlatformerMusicSource
} from "./platformerMusicAssets";

export interface PlatformerMusicPlayer {
  playMusic: (track: MusicTrackRequest | undefined) => boolean;
  stopMusic: () => void;
}

export function requestPlatformerMusicForLevel(
  levelId: number,
  player: PlatformerMusicPlayer,
  canPlayType?: AudioCanPlayType,
  assetUrls?: Record<string, string>
): boolean {
  const asset = getPlatformerMusicAsset(levelId, assetUrls);
  const source = selectPlatformerMusicSource(asset, canPlayType);
  return player.playMusic(
    asset && source
      ? {
          key: asset.key,
          audioUrl: source.audioUrl,
          volume: asset.volume
        }
      : undefined
  );
}

export function requestChapterMusicForChapter(
  chapterId: number | undefined,
  player: PlatformerMusicPlayer,
  canPlayType?: AudioCanPlayType,
  assetUrls?: Record<string, string>
): boolean {
  const asset = typeof chapterId === "number" ? getChapterMusicAsset(chapterId, assetUrls) : undefined;
  const source = selectPlatformerMusicSource(asset, canPlayType);
  return player.playMusic(
    asset && source
      ? {
          key: asset.key,
          audioUrl: source.audioUrl,
          volume: asset.volume
        }
      : undefined
  );
}

export function requestChapterMusicForPuzzle(
  chapterId: number | undefined,
  levelId: number,
  player: PlatformerMusicPlayer,
  canPlayType?: AudioCanPlayType,
  assetUrls?: Record<string, string>
): boolean {
  const asset =
    typeof chapterId === "number"
      ? getChapterMusicAsset(chapterId, assetUrls)
      : getChapterMusicAssetForPuzzleLevel(levelId, assetUrls);
  const source = selectPlatformerMusicSource(asset, canPlayType);
  return player.playMusic(
    asset && source
      ? {
          key: asset.key,
          audioUrl: source.audioUrl,
          volume: asset.volume
        }
      : undefined
  );
}

export function stopPlatformerMusic(player: PlatformerMusicPlayer): void {
  player.stopMusic();
}
