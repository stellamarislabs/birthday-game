import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));

function readProjectFile(path: string): string {
  return readFileSync(resolve(root, path), "utf8");
}

describe("PWA install support", () => {
  it("ships a web app manifest with landscape app metadata and install icons", () => {
    const manifest = JSON.parse(readProjectFile("public/manifest.webmanifest"));

    expect(manifest.name).toBe("Maria and the Case of the Missing Heart");
    expect(manifest.short_name).toBe("Missing Heart");
    expect(manifest.start_url).toBe("./");
    expect(manifest.scope).toBe("./");
    expect(["fullscreen", "standalone"]).toContain(manifest.display);
    expect(manifest.orientation).toBe("landscape");
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: "icons/icon-192.png", sizes: "192x192", type: "image/png" }),
        expect.objectContaining({ src: "icons/icon-512.png", sizes: "512x512", type: "image/png" })
      ])
    );
  });

  it("links PWA metadata only from the main game page", () => {
    const indexHtml = readProjectFile("index.html");
    const videoHtml = readProjectFile("public/video.html");

    expect(indexHtml).toContain('rel="manifest" href="manifest.webmanifest"');
    expect(indexHtml).toContain('name="theme-color"');
    expect(indexHtml).toContain('name="apple-mobile-web-app-capable"');
    expect(indexHtml).toContain('name="mobile-web-app-capable"');
    expect(videoHtml).not.toContain("manifest.webmanifest");
    expect(videoHtml).not.toContain("rotate-overlay");
  });

  it("uses a minimal service worker without caching the external Evidence of Love video", () => {
    const serviceWorker = readProjectFile("public/sw.js");

    expect(serviceWorker).toContain('CACHE_NAME = "missing-heart-pwa-v1"');
    expect(serviceWorker).toContain('self.addEventListener("fetch"');
    expect(serviceWorker).not.toContain("media.stellamarislabs.net");
    expect(serviceWorker).not.toContain("evidence-of-love.mp4");
  });

  it("includes the mobile Home Screen onboarding copy", () => {
    const onboardingSource = readProjectFile("src/ui/pwaOnboarding.ts");

    expect(onboardingSource).toContain("Best played from your Home Screen");
    expect(onboardingSource).toContain("Continue in browser");
    expect(onboardingSource).toContain("display-mode: standalone");
  });
});
