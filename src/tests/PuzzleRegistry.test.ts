import { describe, expect, it } from "vitest";
import { puzzles } from "../content/puzzles";
import { resolvePuzzleRegistration } from "../game/puzzles/PuzzleRegistry";

const activePuzzleTypes = [
  ["case-mosaic", "Case Mosaic: The Sealed Envelope"],
  ["case-timeline", "Case Timeline: The Golden Stamp"],
  ["route-tile-puzzle", "Route Tile Puzzle: The Hidden Wall"],
  ["rebuild-puzzle", "The Hidden Wall"],
  ["deposition-order", "Deposition Order: The Witness Note"],
  ["witness-lens", "Witness Lens: The Witness Note"],
  ["case-file-sorting", "Case File Sorting: No. Given."],
  ["archive-detail-finder", "Archive Overlay: The Marginal Note"],
  ["trust-light-path", "Trust Door Light Path"],
  ["echo-path", "Echo Path: The Door of Trust"],
  ["lantern-sequence", "Lantern Sequence: The Lantern"],
  ["argument-tower", "Argument Tower: The Blue Ribbon"],
  ["case-constellation", "Case Constellation: The Unfinished Letter"],
  ["final-verdict-assembly", "Final Seal: The Court of the Heart"]
] as const;

const retiredPuzzleTypes = [
  "document-ordering",
  "calendar-sequence",
  "reconstruction",
  "contradiction",
  "memory-match",
  "cross-examination",
  "pattern-repeat",
  "argument-builder",
  "evidence-linking",
  "final-letter-assembly",
  "evidence-board",
  "case-board"
] as const;

describe("PuzzleRegistry", () => {
  it.each(activePuzzleTypes)("resolves active redesigned puzzle type %s", (type, title) => {
    expect(resolvePuzzleRegistration(type)).toEqual({
      type,
      title,
      kind: type
    });
  });

  it("maps all 10 content levels to active redesigned puzzle types", () => {
    expect(puzzles.map((puzzle) => [puzzle.levelId, puzzle.type])).toEqual([
      [1, "case-mosaic"],
      [2, "case-timeline"],
      [3, "route-tile-puzzle"],
      [4, "deposition-order"],
      [5, "case-file-sorting"],
      [6, "trust-light-path"],
      [7, "lantern-sequence"],
      [8, "argument-tower"],
      [9, "case-constellation"],
      [10, "final-verdict-assembly"]
    ]);
  });

  it.each(retiredPuzzleTypes)("treats retired puzzle type %s as unsupported at runtime", (type) => {
    expect(resolvePuzzleRegistration(type)).toEqual({
      type: "unsupported",
      requestedType: type,
      title: "Puzzle placeholder"
    });
  });

  it("handles unknown puzzle types safely", () => {
    expect(resolvePuzzleRegistration("not-real")).toEqual({
      type: "unsupported",
      requestedType: "not-real",
      title: "Puzzle placeholder"
    });
  });
});
