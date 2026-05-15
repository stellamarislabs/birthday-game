import type { MusicTrackRequest } from "../systems/AudioManager";
import {
  type AudioCanPlayType,
  type PlatformerMusicSource,
  PLATFORMER_MUSIC_VOLUME,
  selectMusicSource
} from "../platformer/platformerMusicAssets";

const openingMainMenuMusicMp3Urls = import.meta.glob("../../assets/final/music/OpeningandMainMenu.mp3", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

const openingMainMenuMusicOggUrls = import.meta.glob("../../assets/final/music/OpeningandMainMenu.ogg", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

const openingMainMenuMusicAssetUrls = {
  ...openingMainMenuMusicMp3Urls,
  ...openingMainMenuMusicOggUrls
};

export const OPENING_MAIN_MENU_MUSIC_BASENAME = "OpeningandMainMenu";
export const OPENING_MAIN_MENU_MUSIC_KEY = "opening-main-menu";
export const OPENING_MAIN_MENU_MUSIC_VOLUME = PLATFORMER_MUSIC_VOLUME;

export interface OpeningMainMenuMusicAsset {
  basename: typeof OPENING_MAIN_MENU_MUSIC_BASENAME;
  key: typeof OPENING_MAIN_MENU_MUSIC_KEY;
  volume: number;
  sources: PlatformerMusicSource[];
}

export interface OpeningMainMenuMusicPlayer {
  playMusic: (track: MusicTrackRequest | undefined) => boolean;
  stopMusic: () => void;
}

export function getOpeningMainMenuMusicAsset(
  assetUrls: Record<string, string> = openingMainMenuMusicAssetUrls
): OpeningMainMenuMusicAsset {
  return {
    basename: OPENING_MAIN_MENU_MUSIC_BASENAME,
    key: OPENING_MAIN_MENU_MUSIC_KEY,
    volume: OPENING_MAIN_MENU_MUSIC_VOLUME,
    sources: [
      {
        format: "mp3",
        filename: `${OPENING_MAIN_MENU_MUSIC_BASENAME}.mp3`,
        mimeType: "audio/mpeg",
        audioUrl: assetUrls[`../../assets/final/music/${OPENING_MAIN_MENU_MUSIC_BASENAME}.mp3`]
      },
      {
        format: "ogg",
        filename: `${OPENING_MAIN_MENU_MUSIC_BASENAME}.ogg`,
        mimeType: 'audio/ogg; codecs="vorbis"',
        audioUrl: assetUrls[`../../assets/final/music/${OPENING_MAIN_MENU_MUSIC_BASENAME}.ogg`]
      }
    ]
  };
}

export function requestOpeningMainMenuMusic(
  player: OpeningMainMenuMusicPlayer,
  canPlayType?: AudioCanPlayType,
  assetUrls?: Record<string, string>
): boolean {
  const asset = getOpeningMainMenuMusicAsset(assetUrls);
  const source = selectMusicSource(asset, canPlayType);

  return player.playMusic(
    source
      ? {
          key: asset.key,
          audioUrl: source.audioUrl,
          volume: asset.volume
        }
      : undefined
  );
}

export function stopOpeningMainMenuMusic(player: OpeningMainMenuMusicPlayer): void {
  player.stopMusic();
}
