import { describe, expect, it, vi } from "vitest";
import {
  requestChapterMusicForChapter,
  requestChapterMusicForPuzzle,
  requestPlatformerMusicForLevel,
  stopPlatformerMusic
} from "../game/platformer/platformerMusic";
import {
  type AudioCanPlayType,
  getChapterMusicAsset,
  getChapterMusicAssetForPuzzleLevel,
  getActivePlatformerMusicAssets,
  getPlatformerMusicAsset,
  PLATFORMER_MUSIC_VOLUME,
  selectPlatformerMusicSource
} from "../game/platformer/platformerMusicAssets";

const fakeMusicUrls = {
  "../../assets/final/music/Chapter1.mp3": "/assets/Chapter1.fake.mp3",
  "../../assets/final/music/Chapter1.ogg": "/assets/Chapter1.fake.ogg",
  "../../assets/final/music/Chapter2.mp3": "/assets/Chapter2.fake.mp3",
  "../../assets/final/music/Chapter2.ogg": "/assets/Chapter2.fake.ogg",
  "../../assets/final/music/Chapter3.mp3": "/assets/Chapter3.fake.mp3",
  "../../assets/final/music/Chapter3.ogg": "/assets/Chapter3.fake.ogg",
  "../../assets/final/music/Chapter4.mp3": "/assets/Chapter4.fake.mp3",
  "../../assets/final/music/Chapter4.ogg": "/assets/Chapter4.fake.ogg",
  "../../assets/final/music/Chapter5.mp3": "/assets/Chapter5.fake.mp3",
  "../../assets/final/music/Chapter5.ogg": "/assets/Chapter5.fake.ogg",
  "../../assets/final/music/Chapter6.mp3": "/assets/Chapter6.fake.mp3",
  "../../assets/final/music/Chapter6.ogg": "/assets/Chapter6.fake.ogg"
};

const canPlayAll: AudioCanPlayType = () => "probably";
const canPlayOggOnly: AudioCanPlayType = (mimeType) => (mimeType.includes("ogg") ? "probably" : "");
const canPlayNothing: AudioCanPlayType = () => "";

describe("platformer music assets", () => {
  it.each([
    [1, 1, "Chapter1"],
    [2, 2, "Chapter2"],
    [4, 3, "Chapter3"],
    [5, 4, "Chapter4"],
    [6, 5, "Chapter5"],
    [9, 6, "Chapter6"]
  ])("maps runtime Level %i to Chapter %i music", (levelId, chapterId, basename) => {
    const asset = getPlatformerMusicAsset(levelId, fakeMusicUrls);

    expect(asset).toMatchObject({
      levelId,
      chapterId,
      basename,
      key: `platformer-chapter-${chapterId}`,
      volume: PLATFORMER_MUSIC_VOLUME
    });
    expect(asset?.sources).toEqual([
      expect.objectContaining({
        format: "mp3",
        filename: `${basename}.mp3`,
        audioUrl: `/assets/${basename}.fake.mp3`
      }),
      expect.objectContaining({
        format: "ogg",
        filename: `${basename}.ogg`,
        audioUrl: `/assets/${basename}.fake.ogg`
      })
    ]);
  });

  it.each([
    [1, 1, "Chapter1"],
    [2, 2, "Chapter2"],
    [3, 4, "Chapter3"],
    [4, 5, "Chapter4"],
    [5, 6, "Chapter5"],
    [6, 9, "Chapter6"]
  ])("maps Chapter %i music for full chapter flow", (chapterId, platformerLevelId, basename) => {
    expect(getChapterMusicAsset(chapterId, fakeMusicUrls)).toMatchObject({
      levelId: platformerLevelId,
      chapterId,
      basename,
      key: `platformer-chapter-${chapterId}`,
      volume: PLATFORMER_MUSIC_VOLUME
    });
  });

  it.each([
    [1, 1, "Chapter1"],
    [3, 2, "Chapter2"],
    [4, 3, "Chapter3"],
    [5, 4, "Chapter4"],
    [6, 5, "Chapter5"],
    [10, 6, "Chapter6"]
  ])("maps active puzzle Level %i back to Chapter %i music", (puzzleLevelId, chapterId, basename) => {
    expect(getChapterMusicAssetForPuzzleLevel(puzzleLevelId, fakeMusicUrls)).toMatchObject({
      chapterId,
      basename,
      key: `platformer-chapter-${chapterId}`
    });
  });

  it("detects all checked-in platformer music files in both formats", () => {
    const assets = getActivePlatformerMusicAssets();

    expect(assets.map((asset) => asset.basename)).toEqual([
      "Chapter1",
      "Chapter2",
      "Chapter3",
      "Chapter4",
      "Chapter5",
      "Chapter6"
    ]);
    expect(
      assets.every((asset) =>
        asset.sources.some((source) => source.format === "mp3" && source.audioUrl?.endsWith(".mp3"))
      )
    ).toBe(true);
    expect(
      assets.every((asset) =>
        asset.sources.some((source) => source.format === "ogg" && source.audioUrl?.endsWith(".ogg"))
      )
    ).toBe(true);
  });

  it("prefers MP3 when both MP3 and OGG are available and playable", () => {
    const asset = getPlatformerMusicAsset(1, fakeMusicUrls);

    expect(selectPlatformerMusicSource(asset, canPlayAll)).toMatchObject({
      format: "mp3",
      filename: "Chapter1.mp3",
      audioUrl: "/assets/Chapter1.fake.mp3"
    });
  });

  it("falls back to OGG when MP3 is unavailable or not playable", () => {
    const assetWithoutMp3 = getPlatformerMusicAsset(1, {
      "../../assets/final/music/Chapter1.ogg": "/assets/Chapter1.fake.ogg"
    });

    expect(selectPlatformerMusicSource(assetWithoutMp3, canPlayAll)).toMatchObject({
      format: "ogg",
      filename: "Chapter1.ogg",
      audioUrl: "/assets/Chapter1.fake.ogg"
    });

    const asset = getPlatformerMusicAsset(1, fakeMusicUrls);
    expect(selectPlatformerMusicSource(asset, canPlayOggOnly)).toMatchObject({
      format: "ogg",
      filename: "Chapter1.ogg",
      audioUrl: "/assets/Chapter1.fake.ogg"
    });
  });

  it("keeps missing, inactive, and unsupported music fallback safe", () => {
    expect(getPlatformerMusicAsset(3, fakeMusicUrls)).toBeUndefined();
    expect(selectPlatformerMusicSource(getPlatformerMusicAsset(1, {}), canPlayAll)).toBeUndefined();
    expect(selectPlatformerMusicSource(getPlatformerMusicAsset(1, fakeMusicUrls), canPlayNothing)).toBeUndefined();
  });

  it.each([
    [1, "/assets/Chapter1.fake.mp3"],
    [2, "/assets/Chapter2.fake.mp3"],
    [4, "/assets/Chapter3.fake.mp3"],
    [5, "/assets/Chapter4.fake.mp3"],
    [6, "/assets/Chapter5.fake.mp3"],
    [9, "/assets/Chapter6.fake.mp3"]
  ])("requests MP3 music when entering active runtime Level %i", (levelId, audioUrl) => {
    const player = { playMusic: vi.fn(() => true), stopMusic: vi.fn() };

    expect(requestPlatformerMusicForLevel(levelId, player, canPlayAll, fakeMusicUrls)).toBe(true);
    expect(player.playMusic).toHaveBeenCalledWith(
      expect.objectContaining({
        audioUrl,
        volume: PLATFORMER_MUSIC_VOLUME
      })
    );
  });

  it.each([
    [1, "/assets/Chapter1.fake.mp3"],
    [2, "/assets/Chapter2.fake.mp3"],
    [3, "/assets/Chapter3.fake.mp3"],
    [4, "/assets/Chapter4.fake.mp3"],
    [5, "/assets/Chapter5.fake.mp3"],
    [6, "/assets/Chapter6.fake.mp3"]
  ])("requests MP3 music when entering Chapter %i VN", (chapterId, audioUrl) => {
    const player = { playMusic: vi.fn(() => true), stopMusic: vi.fn() };

    expect(requestChapterMusicForChapter(chapterId, player, canPlayAll, fakeMusicUrls)).toBe(true);
    expect(player.playMusic).toHaveBeenCalledWith(
      expect.objectContaining({
        key: `platformer-chapter-${chapterId}`,
        audioUrl,
        volume: PLATFORMER_MUSIC_VOLUME
      })
    );
  });

  it("uses chapter id first and puzzle-level fallback for puzzle music", () => {
    const player = { playMusic: vi.fn(() => true), stopMusic: vi.fn() };

    expect(requestChapterMusicForPuzzle(5, 1, player, canPlayAll, fakeMusicUrls)).toBe(true);
    expect(player.playMusic).toHaveBeenLastCalledWith(expect.objectContaining({ audioUrl: "/assets/Chapter5.fake.mp3" }));

    expect(requestChapterMusicForPuzzle(undefined, 10, player, canPlayAll, fakeMusicUrls)).toBe(true);
    expect(player.playMusic).toHaveBeenLastCalledWith(expect.objectContaining({ audioUrl: "/assets/Chapter6.fake.mp3" }));
  });

  it("does not request broken music when no playable source is available", () => {
    const player = { playMusic: vi.fn(() => false), stopMusic: vi.fn() };

    expect(requestPlatformerMusicForLevel(1, player, canPlayNothing, fakeMusicUrls)).toBe(false);
    expect(player.playMusic).toHaveBeenCalledWith(undefined);
  });

  it("stops platformer music when leaving the scene", () => {
    const player = { playMusic: vi.fn(() => true), stopMusic: vi.fn() };

    stopPlatformerMusic(player);

    expect(player.stopMusic).toHaveBeenCalledOnce();
  });
});
