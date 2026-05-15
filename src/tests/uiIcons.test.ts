import { describe, expect, it } from "vitest";
import {
  EXHIBIT_ICON_BY_LEVEL_ID,
  getExhibitIconKey,
  getSpeakerIconKey,
  getStatusIconKey,
  isUiIconKey,
  renderUiIcon,
  UI_ICON_KEYS
} from "../ui/icons";

describe("global UI icon registry", () => {
  it("contains every semantic icon used by menus, VN, puzzles, HUD, and verdict UI", () => {
    expect(UI_ICON_KEYS).toEqual(
      expect.arrayContaining([
        "scales",
        "case-file",
        "folder",
        "settings",
        "reset",
        "heart",
        "key",
        "envelope",
        "stamp",
        "brick",
        "witness-note",
        "marginal-note",
        "lantern",
        "ribbon",
        "letter",
        "final-seal",
        "lock",
        "check",
        "play",
        "sound",
        "mute",
        "reduce-motion",
        "credits-book",
        "speaker",
        "narrator",
        "secret-client"
      ])
    );
    expect(new Set(UI_ICON_KEYS).size).toBe(UI_ICON_KEYS.length);
  });

  it("maps all 10 exhibits to intentional lightweight icons", () => {
    expect(Object.keys(EXHIBIT_ICON_BY_LEVEL_ID).map(Number).sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ]);

    expect(getExhibitIconKey(1)).toBe("envelope");
    expect(getExhibitIconKey(2)).toBe("stamp");
    expect(getExhibitIconKey(3)).toBe("brick");
    expect(getExhibitIconKey(4)).toBe("witness-note");
    expect(getExhibitIconKey(5)).toBe("marginal-note");
    expect(getExhibitIconKey(6)).toBe("key");
    expect(getExhibitIconKey(7)).toBe("lantern");
    expect(getExhibitIconKey(8)).toBe("ribbon");
    expect(getExhibitIconKey(9)).toBe("letter");
    expect(getExhibitIconKey(10)).toBe("heart");
    expect(getExhibitIconKey(99)).toBe("case-file");
  });

  it("maps status chips to completed, playable, and locked icon states", () => {
    expect(getStatusIconKey("completed")).toBe("check");
    expect(getStatusIconKey("playable")).toBe("play");
    expect(getStatusIconKey("locked")).toBe("lock");
    expect(getStatusIconKey("coming-soon")).toBe("lock");
  });

  it("maps known VN speakers and unknown speakers to safe portrait chip icons", () => {
    expect(getSpeakerIconKey("maria")).toBe("heart");
    expect(getSpeakerIconKey("case-file")).toBe("case-file");
    expect(getSpeakerIconKey("narrator")).toBe("narrator");
    expect(getSpeakerIconKey("secret-client")).toBe("secret-client");
    expect(getSpeakerIconKey("unknown")).toBe("speaker");
  });

  it("renders safe CSS-only icon spans", () => {
    expect(isUiIconKey("final-seal")).toBe(true);
    expect(isUiIconKey("unknown")).toBe(false);
    expect(renderUiIcon("final-seal", "verdict-mark")).toBe(
      '<span class="ui-icon ui-icon--final-seal verdict-mark" data-icon="final-seal" aria-hidden="true"></span>'
    );
  });
});
