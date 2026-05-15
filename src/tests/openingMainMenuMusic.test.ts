import { describe, expect, it, vi } from "vitest";
import {
  getOpeningMainMenuMusicAsset,
  OPENING_MAIN_MENU_MUSIC_KEY,
  OPENING_MAIN_MENU_MUSIC_VOLUME,
  requestOpeningMainMenuMusic,
  stopOpeningMainMenuMusic
} from "../game/audio/openingMainMenuMusic";
import { type AudioCanPlayType, selectMusicSource } from "../game/platformer/platformerMusicAssets";

const fakeOpeningMusicUrls = {
  "../../assets/final/music/OpeningandMainMenu.mp3": "/assets/OpeningandMainMenu.fake.mp3",
  "../../assets/final/music/OpeningandMainMenu.ogg": "/assets/OpeningandMainMenu.fake.ogg"
};

const canPlayAll: AudioCanPlayType = () => "probably";
const canPlayOggOnly: AudioCanPlayType = (mimeType) => (mimeType.includes("ogg") ? "probably" : "");
const canPlayNothing: AudioCanPlayType = () => "";

describe("opening and main menu music", () => {
  it("maps the shared opening/menu track to MP3 and OGG sources", () => {
    const asset = getOpeningMainMenuMusicAsset(fakeOpeningMusicUrls);

    expect(asset).toMatchObject({
      basename: "OpeningandMainMenu",
      key: OPENING_MAIN_MENU_MUSIC_KEY,
      volume: OPENING_MAIN_MENU_MUSIC_VOLUME
    });
    expect(asset.sources).toEqual([
      expect.objectContaining({
        format: "mp3",
        filename: "OpeningandMainMenu.mp3",
        audioUrl: "/assets/OpeningandMainMenu.fake.mp3"
      }),
      expect.objectContaining({
        format: "ogg",
        filename: "OpeningandMainMenu.ogg",
        audioUrl: "/assets/OpeningandMainMenu.fake.ogg"
      })
    ]);
  });

  it("detects the checked-in opening/menu MP3 and OGG assets", () => {
    const asset = getOpeningMainMenuMusicAsset();

    expect(asset.sources.some((source) => source.format === "mp3" && source.audioUrl?.endsWith(".mp3"))).toBe(true);
    expect(asset.sources.some((source) => source.format === "ogg" && source.audioUrl?.endsWith(".ogg"))).toBe(true);
  });

  it("prefers MP3 and falls back to OGG safely", () => {
    const asset = getOpeningMainMenuMusicAsset(fakeOpeningMusicUrls);

    expect(selectMusicSource(asset, canPlayAll)).toMatchObject({
      format: "mp3",
      audioUrl: "/assets/OpeningandMainMenu.fake.mp3"
    });
    expect(selectMusicSource(asset, canPlayOggOnly)).toMatchObject({
      format: "ogg",
      audioUrl: "/assets/OpeningandMainMenu.fake.ogg"
    });
    expect(selectMusicSource(getOpeningMainMenuMusicAsset({}), canPlayAll)).toBeUndefined();
    expect(selectMusicSource(asset, canPlayNothing)).toBeUndefined();
  });

  it("requests the opening/menu track without stacking a different music key", () => {
    const player = { playMusic: vi.fn(() => true), stopMusic: vi.fn() };

    expect(requestOpeningMainMenuMusic(player, canPlayAll, fakeOpeningMusicUrls)).toBe(true);

    expect(player.playMusic).toHaveBeenCalledWith({
      key: OPENING_MAIN_MENU_MUSIC_KEY,
      audioUrl: "/assets/OpeningandMainMenu.fake.mp3",
      volume: OPENING_MAIN_MENU_MUSIC_VOLUME
    });
  });

  it("uses silent fallback when the opening/menu track cannot be played", () => {
    const player = { playMusic: vi.fn(() => false), stopMusic: vi.fn() };

    expect(requestOpeningMainMenuMusic(player, canPlayNothing, fakeOpeningMusicUrls)).toBe(false);
    expect(player.playMusic).toHaveBeenCalledWith(undefined);
  });

  it("stops the shared opening/menu track at the chapter VN boundary", () => {
    const player = { playMusic: vi.fn(() => true), stopMusic: vi.fn() };

    stopOpeningMainMenuMusic(player);

    expect(player.stopMusic).toHaveBeenCalledOnce();
  });
});
