import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { shouldShowPwaInstallGuidance } from "../ui/pwaOnboarding";

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
    const indexHtml = readProjectFile("index.html");

    expect(onboardingSource).toContain("Best played from your Home Screen");
    expect(onboardingSource).toContain("Continue in browser");
    expect(onboardingSource).toContain("display-mode: standalone");
    expect(indexHtml).toContain('data-testid="rotate-pwa-guidance"');
    expect(indexHtml).toContain('data-testid="rotate-landscape-note"');
    expect(indexHtml).toContain("Best full-screen experience");
    expect(indexHtml).toContain("For the smoothest full-screen experience");
    expect(indexHtml).toContain("After adding it, open the case in landscape.");
    expect(indexHtml).toContain("Or rotate your device to continue in browser.");
    expect(indexHtml.indexOf('data-testid="rotate-pwa-guidance"')).toBeLessThan(
      indexHtml.indexOf('data-testid="rotate-landscape-note"')
    );
    expect(indexHtml.indexOf("Best full-screen experience")).toBeLessThan(
      indexHtml.indexOf("Landscape first")
    );
  });

  it("shows install guidance for touch browser mode but suppresses standalone and desktop contexts", () => {
    expect(shouldShowPwaInstallGuidance(true, false)).toBe(true);
    expect(shouldShowPwaInstallGuidance(true, true)).toBe(false);
    expect(shouldShowPwaInstallGuidance(false, false)).toBe(false);
  });
});
