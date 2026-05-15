import { describe, expect, it } from "vitest";
import { createChoiceDoorState, resolveChoiceDoor } from "../game/platformer/ChoiceDoor";

const doors = [
  {
    id: "door-hope",
    label: "Hope",
    isCorrectPath: true,
    destination: { x: 100, y: 200 },
    feedbackMessage: "A warmer door opens."
  },
  {
    id: "door-doubt",
    label: "Doubt",
    isCorrectPath: false,
    destination: { x: 20, y: 200 },
    feedbackMessage: "The echo fades. Try listening again."
  }
];

describe("ChoiceDoor", () => {
  it("resolves a correct door to its forward destination", () => {
    const result = resolveChoiceDoor(doors, "door-hope", 1000, createChoiceDoorState());

    expect(result.resolution).toMatchObject({
      doorId: "door-hope",
      isCorrectPath: true,
      destination: { x: 100, y: 200 }
    });
  });

  it("resolves a wrong door to its loop-back destination", () => {
    const result = resolveChoiceDoor(doors, "door-doubt", 1000, createChoiceDoorState());

    expect(result.resolution).toMatchObject({
      doorId: "door-doubt",
      isCorrectPath: false,
      destination: { x: 20, y: 200 }
    });
  });

  it("handles an unknown door id safely", () => {
    const result = resolveChoiceDoor(doors, "not-real", 1000, createChoiceDoorState());

    expect(result.resolution).toBeNull();
  });

  it("uses a cooldown so the same door does not immediately retrigger", () => {
    const first = resolveChoiceDoor(doors, "door-doubt", 1000, createChoiceDoorState());
    const second = resolveChoiceDoor(doors, "door-doubt", 1100, first.state);

    expect(first.resolution?.doorId).toBe("door-doubt");
    expect(second.resolution).toBeNull();
  });
});
