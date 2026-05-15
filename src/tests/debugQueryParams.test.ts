import { describe, expect, it } from "vitest";
import { parseDebugQueryParams, resolveDevSpawn } from "../game/debug/debugQueryParams";
import type { PlatformerLevelGeometry } from "../game/platformer/levelGeometry";
import { isDevMode } from "../utils/isDevMode";

describe("debug query params", () => {
  it("parses a platformer level route", () => {
    const query = parseDebugQueryParams(new URLSearchParams("?scene=platformer&level=5"), { enabled: true, maxLevel: 10 });

    expect(query.scene).toBe("platformer");
    expect(query.levelId).toBe(5);
    expect(query.chapterId).toBeNull();
  });

  it("parses a chapter bridge route without replacing legacy level params", () => {
    const query = parseDebugQueryParams(new URLSearchParams("?scene=platformer&chapter=2"), {
      enabled: true,
      maxLevel: 10
    });

    expect(query.scene).toBe("platformer");
    expect(query.chapterId).toBe(2);
    expect(query.levelId).toBe(1);
  });

  it("parses the Level 10 platformer dev route", () => {
    const query = parseDebugQueryParams(new URLSearchParams("?scene=platformer&level=10"), { enabled: true, maxLevel: 10 });

    expect(query.scene).toBe("platformer");
    expect(query.levelId).toBe(10);
  });

  it("parses the final verdict dev route", () => {
    const query = parseDebugQueryParams(new URLSearchParams("?scene=final-verdict"), { enabled: true, maxLevel: 10 });

    expect(query.scene).toBe("final-verdict");
  });

  it("parses a visual novel dev route", () => {
    const query = parseDebugQueryParams(new URLSearchParams("?scene=vn&id=vn-level-1-intro"), {
      enabled: true,
      maxLevel: 10
    });

    expect(query.scene).toBe("vn");
    expect(query.vnSceneId).toBe("vn-level-1-intro");
  });

  it("parses checkpoint route params", () => {
    const query = parseDebugQueryParams(new URLSearchParams("?scene=platformer&level=8&checkpoint=2"), {
      enabled: true,
      maxLevel: 10
    });

    expect(query.checkpointNumber).toBe(2);
  });

  it("parses x/y spawn route params", () => {
    const query = parseDebugQueryParams(new URLSearchParams("?scene=platformer&level=8&spawn=x:1450,y:260"), {
      enabled: true,
      maxLevel: 10
    });

    expect(query.spawn).toEqual({ x: 1450, y: 260 });
  });

  it("falls back safely for invalid params", () => {
    const query = parseDebugQueryParams(new URLSearchParams("?scene=unknown&level=999&checkpoint=nope&spawn=bad"), {
      enabled: true,
      maxLevel: 10
    });

    expect(query.scene).toBeNull();
    expect(query.levelId).toBe(1);
    expect(query.chapterId).toBeNull();
    expect(query.checkpointNumber).toBeNull();
    expect(query.spawn).toBeNull();
  });

  it("does not enable scene routes when dev mode is disabled", () => {
    const query = parseDebugQueryParams(new URLSearchParams("?scene=platformer&level=5"), { enabled: false, maxLevel: 10 });

    expect(query.enabled).toBe(false);
    expect(query.scene).toBeNull();
  });

  it("resolves checkpoint spawn from geometry", () => {
    const geometry = {
      checkpoints: [
        { id: "cp1", x: 0, y: 0, width: 10, height: 10, respawnX: 100, respawnY: 200 },
        { id: "cp2", x: 0, y: 0, width: 10, height: 10, respawnX: 300, respawnY: 400 }
      ]
    } as unknown as PlatformerLevelGeometry;
    const query = parseDebugQueryParams(new URLSearchParams("?scene=platformer&checkpoint=2"), { enabled: true });

    expect(resolveDevSpawn(query, geometry)).toEqual({
      x: 300,
      y: 400,
      source: "checkpoint",
      checkpointId: "cp2"
    });
  });
});

describe("dev mode gate", () => {
  it("is disabled for production-like env", () => {
    expect(isDevMode({ dev: false, mode: "production" })).toBe(false);
  });

  it("is enabled for dev or test env", () => {
    expect(isDevMode({ dev: true, mode: "development" })).toBe(true);
    expect(isDevMode({ dev: false, mode: "test" })).toBe(true);
  });
});
