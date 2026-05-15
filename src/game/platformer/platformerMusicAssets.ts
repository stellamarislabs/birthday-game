import { ACTIVE_CHAPTER_FLOWS } from "../systems/ChapterBridge";

export const PLATFORMER_MUSIC_VOLUME = 0.26;

const platformerMusicMp3Urls = import.meta.glob("../../assets/final/music/*.mp3", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

const platformerMusicOggUrls = import.meta.glob("../../assets/final/music/*.ogg", {
  eager: true,
  import: "default",
  query: "?url"
}) as Record<string, string>;

const platformerMusicAssetUrls = {
  ...platformerMusicMp3Urls,
  ...platformerMusicOggUrls
};

export type PlatformerMusicFormat = "mp3" | "ogg";

export type AudioCanPlayResult = "" | "maybe" | "probably";

export type AudioCanPlayType = (mimeType: string) => AudioCanPlayResult;

export interface PlatformerMusicSource {
  format: PlatformerMusicFormat;
  filename: string;
  mimeType: string;
  audioUrl?: string;
}

export interface PlatformerMusicAsset {
  levelId: number;
  chapterId: number;
  basename: string;
  key: string;
  volume: number;
  sources: PlatformerMusicSource[];
}

export interface MusicAssetWithSources {
  sources: PlatformerMusicSource[];
}

const MUSIC_FORMATS: readonly { format: PlatformerMusicFormat; extension: string; mimeType: string }[] = [
  { format: "mp3", extension: "mp3", mimeType: "audio/mpeg" },
  { format: "ogg", extension: "ogg", mimeType: 'audio/ogg; codecs="vorbis"' }
];

const ACTIVE_PLATFORMER_MUSIC: Record<number, { chapterId: number; basename: string }> = {
  1: { chapterId: 1, basename: "Chapter1" },
  2: { chapterId: 2, basename: "Chapter2" },
  4: { chapterId: 3, basename: "Chapter3" },
  5: { chapterId: 4, basename: "Chapter4" },
  6: { chapterId: 5, basename: "Chapter5" },
  9: { chapterId: 6, basename: "Chapter6" }
};

export function getChapterMusicKey(chapterId: number): string {
  return `platformer-chapter-${chapterId}`;
}

export function getPlatformerMusicAsset(
  levelId: number,
  assetUrls: Record<string, string> = platformerMusicAssetUrls
): PlatformerMusicAsset | undefined {
  const mapping = ACTIVE_PLATFORMER_MUSIC[levelId];
  if (!mapping) {
    return undefined;
  }

  return {
    levelId,
    chapterId: mapping.chapterId,
    basename: mapping.basename,
    key: getChapterMusicKey(mapping.chapterId),
    volume: PLATFORMER_MUSIC_VOLUME,
    sources: MUSIC_FORMATS.map(({ format, extension, mimeType }) => {
      const filename = `${mapping.basename}.${extension}`;
      return {
        format,
        filename,
        mimeType,
        audioUrl: assetUrls[`../../assets/final/music/${filename}`]
      };
    })
  };
}

export function getChapterMusicAsset(
  chapterId: number,
  assetUrls: Record<string, string> = platformerMusicAssetUrls
): PlatformerMusicAsset | undefined {
  const mapping = Object.values(ACTIVE_PLATFORMER_MUSIC).find((music) => music.chapterId === chapterId);
  const flow = ACTIVE_CHAPTER_FLOWS.find((chapterFlow) => chapterFlow.chapterId === chapterId);
  if (!mapping || !flow) {
    return undefined;
  }

  return {
    levelId: flow.platformerLevelId,
    chapterId: mapping.chapterId,
    basename: mapping.basename,
    key: getChapterMusicKey(mapping.chapterId),
    volume: PLATFORMER_MUSIC_VOLUME,
    sources: MUSIC_FORMATS.map(({ format, extension, mimeType }) => {
      const filename = `${mapping.basename}.${extension}`;
      return {
        format,
        filename,
        mimeType,
        audioUrl: assetUrls[`../../assets/final/music/${filename}`]
      };
    })
  };
}

export function getChapterMusicAssetForPuzzleLevel(
  levelId: number,
  assetUrls: Record<string, string> = platformerMusicAssetUrls
): PlatformerMusicAsset | undefined {
  const chapterFlow = ACTIVE_CHAPTER_FLOWS.find((flow) => flow.puzzleLevelId === levelId);
  return chapterFlow ? getChapterMusicAsset(chapterFlow.chapterId, assetUrls) : undefined;
}

export function getActivePlatformerMusicAssets(
  assetUrls: Record<string, string> = platformerMusicAssetUrls
): PlatformerMusicAsset[] {
  return Object.keys(ACTIVE_PLATFORMER_MUSIC)
    .map((levelId) => getPlatformerMusicAsset(Number(levelId), assetUrls))
    .filter((asset): asset is PlatformerMusicAsset => Boolean(asset));
}

export function selectPlatformerMusicSource(
  asset: PlatformerMusicAsset | undefined,
  canPlayType: AudioCanPlayType = getBrowserCanPlayType
): PlatformerMusicSource | undefined {
  return selectMusicSource(asset, canPlayType);
}

export function selectMusicSource(
  asset: MusicAssetWithSources | undefined,
  canPlayType: AudioCanPlayType = getBrowserCanPlayType
): PlatformerMusicSource | undefined {
  if (!asset) {
    return undefined;
  }

  const mp3Source = asset.sources.find((source) => source.format === "mp3");
  if (isPlayableSource(mp3Source, canPlayType)) {
    return mp3Source;
  }

  const oggSource = asset.sources.find((source) => source.format === "ogg");
  if (isPlayableSource(oggSource, canPlayType)) {
    return oggSource;
  }

  return undefined;
}

function isPlayableSource(source: PlatformerMusicSource | undefined, canPlayType: AudioCanPlayType): source is PlatformerMusicSource {
  if (!source?.audioUrl) {
    return false;
  }

  return canPlayType(source.mimeType) !== "";
}

function getBrowserCanPlayType(mimeType: string): AudioCanPlayResult {
  if (typeof document === "undefined") {
    return "probably";
  }

  return document.createElement("audio").canPlayType(mimeType) as AudioCanPlayResult;
}
