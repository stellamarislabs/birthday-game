import { describe, expect, it } from "vitest";
import { isDevMode } from "../utils/isDevMode";

describe("isDevMode", () => {
  it("is disabled for production-like builds", () => {
    expect(isDevMode({ dev: false, mode: "production" })).toBe(false);
  });

  it("is enabled for Vite dev mode", () => {
    expect(isDevMode({ dev: true, mode: "development" })).toBe(true);
  });

  it("is enabled for test mode", () => {
    expect(isDevMode({ dev: false, mode: "test" })).toBe(true);
  });
});
