import { describe, expect, it } from "vitest";
import { getPointerDragDistance, isDragDistancePastThreshold } from "../game/puzzles/shared/dragDrop";

describe("puzzle drag/drop helpers", () => {
  it("measures pointer drag distance", () => {
    expect(getPointerDragDistance(10, 20, 13, 24)).toBe(5);
  });

  it("keeps small pointer movement below drag threshold", () => {
    expect(isDragDistancePastThreshold(0, 0, 3, 4, 6)).toBe(false);
  });

  it("activates drag once pointer movement reaches threshold", () => {
    expect(isDragDistancePastThreshold(0, 0, 6, 8, 10)).toBe(true);
  });
});
