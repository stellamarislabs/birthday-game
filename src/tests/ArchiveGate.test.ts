import { describe, expect, it } from "vitest";
import { collectArchiveKey, createArchiveGateState, isArchiveDoorOpen } from "../game/platformer/ArchiveGate";

const doors = [
  { id: "locked-archive-door", requiresKeyId: "archive-key" },
  { id: "future-door", requiresKeyId: "future-key" }
];

describe("ArchiveGate", () => {
  it("starts with closed doors and no collected keys", () => {
    const state = createArchiveGateState();

    expect(state.collectedKeyIds).toEqual([]);
    expect(state.openedDoorIds).toEqual([]);
    expect(isArchiveDoorOpen(state, "locked-archive-door")).toBe(false);
  });

  it("collecting the matching key opens the door", () => {
    const state = collectArchiveKey(createArchiveGateState(), "archive-key", doors);

    expect(state.collectedKeyIds).toEqual(["archive-key"]);
    expect(state.openedDoorIds).toEqual(["locked-archive-door"]);
    expect(isArchiveDoorOpen(state, "locked-archive-door")).toBe(true);
  });

  it("collecting the same key twice is safe", () => {
    const once = collectArchiveKey(createArchiveGateState(), "archive-key", doors);
    const twice = collectArchiveKey(once, "archive-key", doors);

    expect(twice.collectedKeyIds).toEqual(["archive-key"]);
    expect(twice.openedDoorIds).toEqual(["locked-archive-door"]);
  });
});
