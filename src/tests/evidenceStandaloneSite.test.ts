import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const STANDALONE_PAGE_PATH = "evidence-site/index.html";
const EVIDENCE_VIDEO_URL = "https://media.stellamarislabs.net/videos/evidence-of-love.mp4";
const GAME_RETURN_URL = "https://game.stellamarislabs.net";

describe("standalone Evidence of Love site export", () => {
  it("ships a self-contained static Evidence of Love page", () => {
    expect(existsSync(STANDALONE_PAGE_PATH)).toBe(true);

    const html = readFileSync(STANDALONE_PAGE_PATH, "utf8");

    expect(html).toContain("<title>Evidence of Love</title>");
    expect(html).toContain("Evidence of Love");
    expect(html).toContain("Final file");
    expect(html).toContain("Best watched vertically");
    expect(html).toContain("Please turn your phone upright for the best experience.");
    expect(html).toContain("<style>");
    expect(html).toContain("<script>");
  });

  it("uses the R2-hosted video and links back to the game domain", () => {
    const html = readFileSync(STANDALONE_PAGE_PATH, "utf8");

    expect(html).toContain(`<a class="return-link" href="${GAME_RETURN_URL}">Return to the Case Archive</a>`);
    expect(html).toContain(`const EVIDENCE_VIDEO_SRC = "${EVIDENCE_VIDEO_URL}";`);
    expect(html).toContain("<video controls playsinline preload=\"metadata\"");
    expect(html).toContain("source.src = EVIDENCE_VIDEO_SRC;");
    expect(html).not.toContain("assets/video/evidence-of-love.mp4");
  });

  it("does not depend on the game shell, PWA manifest, or Vite build", () => {
    const html = readFileSync(STANDALONE_PAGE_PATH, "utf8");

    expect(html).not.toContain("manifest.webmanifest");
    expect(html).not.toContain("video-config.js");
    expect(html).not.toContain("src/main.ts");
    expect(html).not.toContain("game-container");
    expect(html).not.toContain("rotate-overlay");
    expect(html).not.toContain("Landscape First");
    expect(html).not.toContain("Landscape first");
  });

  it("preserves user-initiated fullscreen fallback behavior", () => {
    const html = readFileSync(STANDALONE_PAGE_PATH, "utf8");

    expect(html).toContain("requestFullscreenIfAvailable");
    expect(html).toContain("video.requestFullscreen");
    expect(html).toContain("video.webkitEnterFullscreen");
    expect(html).toContain("request.catch(showFullscreenHint)");
    expect(html).toContain("Use the fullscreen button if you prefer.");
    expect(html).not.toContain("autoplay");
  });
});
