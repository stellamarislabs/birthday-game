import { describe, expect, it } from "vitest";
import {
  OPENING_CINEMATIC_VISUAL_CAPTIONS_VISIBLE,
  openingCinematicBeats,
  openingCinematicImagePaths,
  openingCinematicTotalDurationMs
} from "../content/openingCinematic";
import { resolvePublicAssetPath } from "../game/assets/publicAssetPaths";

describe("opening cinematic content", () => {
  it("defines a short automatic cinematic sequence", () => {
    expect(openingCinematicBeats.length).toBeGreaterThanOrEqual(5);
    expect(openingCinematicBeats.length).toBeLessThanOrEqual(7);
    expect(openingCinematicTotalDurationMs).toBeGreaterThanOrEqual(25_000);
    expect(openingCinematicTotalDurationMs).toBeLessThanOrEqual(45_000);
  });

  it("keeps beat ids unique and captions concise", () => {
    const ids = openingCinematicBeats.map((beat) => beat.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const beat of openingCinematicBeats) {
      expect(beat.caption.trim().length).toBeGreaterThan(0);
      expect(beat.caption.length).toBeLessThanOrEqual(70);
      expect(beat.durationMs).toBeGreaterThanOrEqual(2_500);
      expect(beat.durationMs).toBeLessThanOrEqual(5_000);
    }
  });

  it("starts in Warsaw and ends with Maria seated for the menu reveal", () => {
    expect(openingCinematicBeats[0]).toMatchObject({
      id: "city-wakes",
      visualKey: "city-wakes"
    });
    expect(openingCinematicBeats.at(-2)).toMatchObject({
      id: "she-sits",
      visualKey: "she-sits"
    });
    expect(openingCinematicBeats.at(-1)).toMatchObject({
      id: "menu-reveal",
      visualKey: "menu-reveal"
    });
  });

  it("maps the seven movie beats to final opening WebP frames with cinematic captions", () => {
    expect(openingCinematicBeats).toHaveLength(7);
    expect(openingCinematicImagePaths).toEqual([
      "assets/final/opening/Opening01.webp",
      "assets/final/opening/Opening02.webp",
      "assets/final/opening/Opening03.webp",
      "assets/final/opening/Opening04.webp",
      "assets/final/opening/Opening05.webp",
      "assets/final/opening/Opening06.webp",
      "assets/final/opening/Opening07.webp"
    ]);
    expect(openingCinematicBeats.map((beat) => beat.imagePath)).toEqual([...openingCinematicImagePaths]);
    expect(new Set(openingCinematicBeats.map((beat) => beat.caption)).size).toBe(openingCinematicBeats.length);
    expect(openingCinematicBeats.find((beat) => beat.id === "she-sits")?.caption).not.toBe(
      openingCinematicBeats.find((beat) => beat.id === "menu-reveal")?.caption
    );
    expect(OPENING_CINEMATIC_VISUAL_CAPTIONS_VISIBLE).toBe(true);
  });

  it("resolves opening movie frame paths through the Vite base path", () => {
    expect(resolvePublicAssetPath(openingCinematicImagePaths[0], "/missing-heart/")).toBe(
      "/missing-heart/assets/final/opening/Opening01.webp"
    );
    expect(resolvePublicAssetPath(openingCinematicImagePaths[6], "./")).toBe(
      "./assets/final/opening/Opening07.webp"
    );
  });
});
