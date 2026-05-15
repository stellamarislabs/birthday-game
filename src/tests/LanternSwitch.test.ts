import { describe, expect, it } from "vitest";
import {
  activateLanternSwitch,
  createLanternSwitchState,
  isLightRevealGroupActive
} from "../game/platformer/LanternSwitch";
import { levelSevenGeometry } from "../game/platformer/levelGeometry";

describe("LanternSwitch", () => {
  it("starts inactive", () => {
    const state = createLanternSwitchState();

    expect(state.activeLanternIds).toEqual([]);
    expect(state.revealedGroupIds).toEqual([]);
  });

  it("activating a lantern marks it active and reveals its group", () => {
    const result = activateLanternSwitch(createLanternSwitchState(), "first-garden-lantern", levelSevenGeometry.lanternSwitches);

    expect(result.activated).toBe(true);
    expect(result.revealedGroupId).toBe("soft-bridge");
    expect(result.state.activeLanternIds).toEqual(["first-garden-lantern"]);
    expect(isLightRevealGroupActive(result.state, "soft-bridge")).toBe(true);
  });

  it("activating the same lantern twice is safe", () => {
    const first = activateLanternSwitch(createLanternSwitchState(), "first-garden-lantern", levelSevenGeometry.lanternSwitches);
    const second = activateLanternSwitch(first.state, "first-garden-lantern", levelSevenGeometry.lanternSwitches);

    expect(second.activated).toBe(false);
    expect(second.state).toEqual(first.state);
  });

  it("handles unknown lantern ids safely", () => {
    const state = createLanternSwitchState();
    const result = activateLanternSwitch(state, "not-a-lantern", levelSevenGeometry.lanternSwitches);

    expect(result.activated).toBe(false);
    expect(result.state).toEqual(state);
  });
});
