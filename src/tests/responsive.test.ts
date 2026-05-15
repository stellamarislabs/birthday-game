import { describe, expect, it } from "vitest";
import { resolveVisibleViewportSize } from "../ui/responsive";

describe("responsive viewport sizing", () => {
  it("prefers the real visual viewport size when browser chrome reduces the visible area", () => {
    expect(
      resolveVisibleViewportSize(
        { width: 932, height: 372 },
        { innerWidth: 932, innerHeight: 430 }
      )
    ).toEqual({ width: 932, height: 372 });
  });

  it("falls back to window inner size when visualViewport is unavailable", () => {
    expect(resolveVisibleViewportSize(undefined, { innerWidth: 1366, innerHeight: 768 })).toEqual({
      width: 1366,
      height: 768
    });
  });

  it("ignores unusable visual viewport dimensions", () => {
    expect(
      resolveVisibleViewportSize(
        { width: 0, height: Number.NaN },
        { innerWidth: 932, innerHeight: 430 }
      )
    ).toEqual({ width: 932, height: 430 });
  });
});
