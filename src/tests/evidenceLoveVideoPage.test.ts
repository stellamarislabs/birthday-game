import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const VIDEO_PAGE_PATH = "public/video.html";
const VIDEO_CONFIG_PATH = "public/video-config.js";
const EVIDENCE_VIDEO_URL = "https://media.stellamarislabs.net/videos/evidence-of-love.mp4";

describe("Evidence of Love video page", () => {
  it("ships a standalone public video page", () => {
    expect(existsSync(VIDEO_PAGE_PATH)).toBe(true);

    const html = readFileSync(VIDEO_PAGE_PATH, "utf8");
    expect(html).toContain("<title>Evidence of Love</title>");
    expect(html).toContain("<script src=\"video-config.js\"></script>");
    expect(html).not.toContain("src/main.ts");
    expect(html).not.toContain("game-container");
    expect(html).not.toContain("rotate-overlay");
    expect(html).not.toContain("Landscape first");
  });

  it("loads the R2-hosted portrait video from config and has graceful missing-video copy", () => {
    expect(existsSync(VIDEO_CONFIG_PATH)).toBe(true);

    const html = readFileSync(VIDEO_PAGE_PATH, "utf8");
    const config = readFileSync(VIDEO_CONFIG_PATH, "utf8");

    expect(html).toContain("<video controls playsinline preload=\"metadata\"");
    expect(html).toContain("const videoSource = window.EVIDENCE_VIDEO_SRC || \"\";");
    expect(html).toContain("source.src = videoSource;");
    expect(html).not.toContain("assets/video/evidence-of-love.mp4");
    expect(config).toContain(`window.EVIDENCE_VIDEO_SRC = "${EVIDENCE_VIDEO_URL}";`);
    expect(config).toContain('window.EVIDENCE_VIDEO_POSTER = "";');
    expect(config).toContain('window.EVIDENCE_VIDEO_BACKUP_URL = "";');
    expect(html).toContain("The final video file is not available yet.");
    expect(html).toContain("Please check the final media file and try again.");
  });

  it("keeps a direct return link to the game entry page", () => {
    const html = readFileSync(VIDEO_PAGE_PATH, "utf8");

    expect(html).toContain("href=\"index.html\"");
    expect(html).toContain("Return to the Case Archive");
    expect(html).toContain("class=\"return-link\"");
    expect(html).not.toContain("class=\"return-link primary-button\"");
    expect(html).not.toContain("class=\"primary-button return-link\"");
  });

  it("promotes vertical viewing guidance and supports safe fullscreen attempts", () => {
    const html = readFileSync(VIDEO_PAGE_PATH, "utf8");
    const warningIndex = html.indexOf("Best watched vertically");
    const kickerIndex = html.indexOf("<p class=\"kicker\">Final file</p>");
    const videoIndex = html.indexOf("<section class=\"video-card\"");
    const returnIndex = html.indexOf("<nav class=\"return-nav\"");

    expect(html).toContain("Best watched vertically");
    expect(html).toContain("Please turn your phone upright for the best experience.");
    expect(html).toContain("class=\"orientation-note\"");
    expect(warningIndex).toBeGreaterThan(-1);
    expect(kickerIndex).toBeGreaterThan(warningIndex);
    expect(videoIndex).toBeGreaterThan(kickerIndex);
    expect(returnIndex).toBeGreaterThan(videoIndex);
    expect(html).toContain("requestFullscreenIfAvailable");
    expect(html).toContain("video.requestFullscreen");
    expect(html).toContain("video.webkitEnterFullscreen");
    expect(html).toContain("Use the fullscreen button if you prefer.");
    expect(html).toContain("request.catch(showFullscreenHint)");
  });

  it("remains a local fallback page without changing the in-game external handoff", () => {
    const html = readFileSync(VIDEO_PAGE_PATH, "utf8");

    expect(html).toContain("<script src=\"video-config.js\"></script>");
    expect(html).toContain("href=\"index.html\"");
    expect(html).not.toContain("https://evidence.stellamarislabs.net");
  });
});
