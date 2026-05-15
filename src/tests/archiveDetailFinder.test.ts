import { describe, expect, it } from "vitest";
import { LEVEL_FIVE_ARCHIVE_DETAIL_FINDER_SPEC } from "../game/puzzles/archiveDetailFinder/archiveDetailFinderContent";
import {
  checkArchiveDetailAnswer,
  createInitialArchiveDetailState,
  getArchiveDetailProgress,
  inspectAt,
  isArchiveDetailComplete,
  isArchiveDetailSolved,
  isArchiveSilverKeyAvailable,
  isDetailDiscovered,
  isDetailMarked,
  markDetail,
  resetArchiveDetailFinder,
  takeArchiveSilverKey
} from "../game/puzzles/archiveDetailFinder/archiveDetailFinderLogic";

const spec = LEVEL_FIVE_ARCHIVE_DETAIL_FINDER_SPEC;

describe("Archive Detail Finder logic", () => {
  it("starts with the correction hidden and key unavailable", () => {
    const state = createInitialArchiveDetailState(spec);

    expect(state.discoveredDetailIds).toEqual([]);
    expect(state.markedDetailIds).toEqual([]);
    expect(state.selectedTool).toBeNull();
    expect(state.keyTaken).toBe(false);
    expect(isArchiveDetailComplete(spec, state)).toBe(false);
    expect(isArchiveSilverKeyAvailable(spec, state)).toBe(false);
    expect(isArchiveDetailSolved(spec, state)).toBe(false);
  });

  it("discovers a detail when inspected inside its generous zone", () => {
    const [detail] = spec.details;
    const state = inspectAt(spec, createInitialArchiveDetailState(spec), detail.x, detail.y);

    expect(isDetailDiscovered(state, detail.id)).toBe(true);
    expect(state.magnifier).toEqual({ x: detail.x, y: detail.y });
  });

  it("does not discover details outside detail zones", () => {
    const state = inspectAt(spec, createInitialArchiveDetailState(spec), 50, 10);

    expect(state.discoveredDetailIds).toEqual([]);
  });

  it("allows discovered details to be marked", () => {
    const detail = spec.details[1];
    const discovered = inspectAt(spec, createInitialArchiveDetailState(spec), detail.x, detail.y);
    const marked = markDetail(discovered, detail.id);

    expect(isDetailMarked(marked, detail.id)).toBe(true);
  });

  it("ignores attempts to mark undiscovered details safely", () => {
    const state = markDetail(createInitialArchiveDetailState(spec), spec.details[2].id);

    expect(state.markedDetailIds).toEqual([]);
    expect(isArchiveDetailSolved(spec, state)).toBe(false);
  });

  it("does not complete the correction while one required zone is missing", () => {
    let state = createInitialArchiveDetailState(spec);

    for (const detail of spec.details.slice(0, 2)) {
      state = inspectAt(spec, state, detail.x, detail.y);
    }

    expect(isArchiveDetailComplete(spec, state)).toBe(false);
    expect(isArchiveSilverKeyAvailable(spec, state)).toBe(false);
    expect(isArchiveDetailSolved(spec, state)).toBe(false);
    expect(checkArchiveDetailAnswer(spec, state).feedback).toBe(spec.incompleteText);
  });

  it("makes the silver key available when all required zones reveal the correction", () => {
    let state = createInitialArchiveDetailState(spec);

    for (const detail of spec.details) {
      state = inspectAt(spec, state, detail.x, detail.y);
    }

    expect(isArchiveDetailComplete(spec, state)).toBe(true);
    expect(isArchiveSilverKeyAvailable(spec, state)).toBe(true);
    expect(isArchiveDetailSolved(spec, state)).toBe(false);
    expect(checkArchiveDetailAnswer(spec, state).feedback).toBe(spec.keyReadyText);
  });

  it("solves only after the silver key is taken", () => {
    let state = createInitialArchiveDetailState(spec);

    for (const detail of spec.details) {
      state = inspectAt(spec, state, detail.x, detail.y);
    }

    const withKey = takeArchiveSilverKey(spec, state);
    const result = checkArchiveDetailAnswer(spec, state);
    const keyResult = checkArchiveDetailAnswer(spec, withKey);

    expect(result.solved).toBe(false);
    expect(keyResult.solved).toBe(true);
    expect(keyResult.feedback).toContain("The margin reveals the truth.");
    expect(keyResult.feedback).toContain("A silver key slips from the file spine.");
  });

  it("cannot take the silver key before the correction is complete", () => {
    const state = takeArchiveSilverKey(spec, createInitialArchiveDetailState(spec));

    expect(state.keyTaken).toBe(false);
    expect(state.feedback).toBe(spec.incompleteText);
    expect(isArchiveDetailSolved(spec, state)).toBe(false);
  });

  it("reset clears discovered details, marked margins, and the key state", () => {
    const detail = spec.details[2];
    const discovered = inspectAt(spec, createInitialArchiveDetailState(spec), detail.x, detail.y);
    const marked = markDetail(discovered, detail.id);

    expect(marked.markedDetailIds).toEqual([detail.id]);
    expect(resetArchiveDetailFinder(spec)).toEqual(createInitialArchiveDetailState(spec));
  });

  it("reports discovered and marked progress", () => {
    const detail = spec.details[2];
    const discovered = inspectAt(spec, createInitialArchiveDetailState(spec), detail.x, detail.y);
    const marked = markDetail(discovered, detail.id);

    expect(getArchiveDetailProgress(spec, marked)).toEqual({
      discoveredCount: 1,
      markedCount: 1,
      totalCount: 3,
      correctionComplete: false,
      keyAvailable: false,
      keyTaken: false
    });
  });

  it("defines the active streamlined Level 5 archive overlay spec", () => {
    expect(spec.title).toBe("Archive Overlay: The Marginal Note");
    expect(spec.instruction).toBe("Inspect the marked margins to reveal the correction.");
    expect(spec.originalLine).toBe("The heart was taken.");
    expect(spec.correctionText).toBe("No. Given.");
    expect(spec.keyLabel).toBe("Silver Key");
    expect(spec.details).toHaveLength(3);
    expect(spec.requiredDetailIds).toEqual(["margin-crossout", "margin-correction", "file-spine"]);
    expect(spec.details).toHaveLength(spec.requiredDetailIds.length);
    expect(spec.details.length).toBeGreaterThanOrEqual(2);
    expect(spec.details.length).toBeLessThanOrEqual(3);
    expect(`${spec.title} ${spec.subtitle} ${spec.instruction} ${spec.successText} ${spec.successFollowUp}`).not.toMatch(/Exhibit|four tiny details|bookmark checklist/i);
  });
});
