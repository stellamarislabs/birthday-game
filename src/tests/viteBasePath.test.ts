import { describe, expect, it } from "vitest";
import { resolveViteBasePath } from "../../devtools/viteBasePath";

describe("resolveViteBasePath", () => {
  it("defaults to a relative static base path", () => {
    expect(resolveViteBasePath({})).toBe("./");
  });

  it("uses a root base path when requested", () => {
    expect(resolveViteBasePath({ VITE_BASE_PATH: "/" })).toBe("/");
  });

  it("uses a GitHub Pages repository subpath when requested", () => {
    expect(resolveViteBasePath({ VITE_BASE_PATH: "/maria-case-game/" })).toBe("/maria-case-game/");
  });

  it("falls back safely for empty values", () => {
    expect(resolveViteBasePath({ VITE_BASE_PATH: "   " })).toBe("./");
  });
});
