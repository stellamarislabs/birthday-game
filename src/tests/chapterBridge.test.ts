import { describe, expect, it } from "vitest";

import { chapters } from "../content/chapters";
import {
  ACTIVE_CHAPTER_FLOWS,
  CHAPTER_BRIDGE_ROUTES,
  getChapterAvailability,
  getActiveChapterFlow,
  getChapterCompletionLevelId,
  getChapterLaunchLevelId,
  getClosedChapterCount,
} from "../game/systems/ChapterBridge";
import { getLevelAvailability } from "../game/systems/LevelAvailability";
import { createDefaultSaveData } from "../game/systems/SaveManager";
import { getLevelSelectChapterRows } from "../game/ui/LevelSelectMenu";

describe("ChapterBridge", () => {
  it("maps the six player-facing chapters to safe legacy runtime levels", () => {
    expect(CHAPTER_BRIDGE_ROUTES).toEqual([
      { chapterId: 1, legacyLevelId: 1 },
      { chapterId: 2, legacyLevelId: 2 },
      { chapterId: 3, legacyLevelId: 4 },
      { chapterId: 4, legacyLevelId: 5 },
      { chapterId: 5, legacyLevelId: 6 },
      { chapterId: 6, legacyLevelId: 9 },
    ]);
    expect(getChapterLaunchLevelId(99)).toBe(1);
  });

  it("defines active runtime flows for all six chapters", () => {
    expect(ACTIVE_CHAPTER_FLOWS).toEqual([
      {
        chapterId: 1,
        platformerLevelId: 1,
        puzzleLevelId: 1,
        completionLevelId: 1,
        introSceneId: "vn-chapter-1-intro",
        beforePuzzleSceneId: "vn-chapter-1-before-puzzle",
        afterPuzzleSceneId: "vn-chapter-1-after-puzzle",
      },
      {
        chapterId: 2,
        platformerLevelId: 2,
        puzzleLevelId: 3,
        completionLevelId: 3,
        introSceneId: "vn-chapter-2-intro",
        beforePuzzleSceneId: "vn-chapter-2-before-puzzle",
        afterPuzzleSceneId: "vn-chapter-2-after-puzzle",
      },
      {
        chapterId: 3,
        platformerLevelId: 4,
        puzzleLevelId: 4,
        completionLevelId: 4,
        introSceneId: "vn-chapter-3-intro",
        beforePuzzleSceneId: "vn-chapter-3-before-puzzle",
        afterPuzzleSceneId: "vn-chapter-3-after-puzzle",
      },
      {
        chapterId: 4,
        platformerLevelId: 5,
        puzzleLevelId: 5,
        completionLevelId: 5,
        introSceneId: "vn-chapter-4-intro",
        beforePuzzleSceneId: "vn-chapter-4-before-puzzle",
        afterPuzzleSceneId: "vn-chapter-4-after-puzzle",
      },
      {
        chapterId: 5,
        platformerLevelId: 6,
        puzzleLevelId: 6,
        completionLevelId: 8,
        introSceneId: "vn-chapter-5-intro",
        beforePuzzleSceneId: "vn-chapter-5-before-puzzle",
        afterPuzzleSceneId: "vn-chapter-5-after-puzzle",
      },
      {
        chapterId: 6,
        platformerLevelId: 9,
        puzzleLevelId: 10,
        completionLevelId: 10,
        introSceneId: "vn-chapter-6-intro",
        beforePuzzleSceneId: "vn-chapter-6-before-puzzle",
        afterPuzzleSceneId: "vn-chapter-6-after-puzzle",
      },
    ]);
    expect(getActiveChapterFlow(1)?.puzzleLevelId).toBe(1);
    expect(getActiveChapterFlow(2)?.puzzleLevelId).toBe(3);
    expect(getActiveChapterFlow(3)?.puzzleLevelId).toBe(4);
    expect(getActiveChapterFlow(4)?.puzzleLevelId).toBe(5);
    expect(getActiveChapterFlow(5)?.puzzleLevelId).toBe(6);
    expect(getActiveChapterFlow(6)?.puzzleLevelId).toBe(10);
    expect(getChapterCompletionLevelId(2)).toBe(3);
    expect(getChapterCompletionLevelId(4)).toBe(5);
    expect(getChapterCompletionLevelId(5)).toBe(8);
    expect(getChapterCompletionLevelId(6)).toBe(10);
  });

  it("renders six chapter rows for the player-facing Case Archive", () => {
    const rows = getLevelSelectChapterRows(createDefaultSaveData());

    expect(rows).toHaveLength(6);
    expect(rows.map((row) => row.chapterId)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(rows[0]).toMatchObject({
      title: "The Sealed Envelope",
      legacyLevelId: 1,
    });
    expect(rows[0].mainClues).toEqual([
      "The Sealed Envelope",
      "Brass Key",
      "Tram Ticket",
    ]);
  });

  it("unlocks Chapter 1 by default", () => {
    expect(getChapterAvailability(chapters[0], createDefaultSaveData())).toMatchObject({
      playable: true,
      status: "playable",
      label: "Play",
      legacyLevelId: 1,
    });
  });

  it("unlocks Chapter 2 after the Chapter 1 bridge completion condition", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1],
      unlockedLevelIds: [1, 2],
      currentLevelId: 2,
    };

    expect(getChapterAvailability(chapters[0], save)).toMatchObject({
      playable: true,
      status: "completed",
      label: "Completed / Replay",
    });
    expect(getChapterAvailability(chapters[1], save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Next Clue",
      legacyLevelId: 2,
    });
  });

  it("unlocks Chapter 3 after Chapter 2 active completion maps to old Level 3", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 3],
      unlockedLevelIds: [1, 2, 3, 4],
      currentLevelId: 4,
    };

    expect(getChapterAvailability(chapters[1], save)).toMatchObject({
      playable: true,
      status: "completed",
    });
    expect(getChapterAvailability(chapters[2], save)).toMatchObject({
      playable: true,
      status: "playable",
      legacyLevelId: 4,
    });
  });

  it("infers chapter availability from advanced legacy old-level progress", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3],
      unlockedLevelIds: [1, 2, 3, 4],
      currentLevelId: 4,
    };

    expect(getChapterAvailability(chapters[1], save)).toMatchObject({
      playable: true,
      status: "completed",
    });
    expect(getChapterAvailability(chapters[2], save)).toMatchObject({
      playable: true,
      status: "playable",
      legacyLevelId: 4,
    });
  });

  it("unlocks Chapter 4 after Chapter 3 active completion maps to old Level 4", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 3, 4],
      unlockedLevelIds: [1, 2, 3, 4, 5],
      currentLevelId: 5,
    };

    expect(getChapterAvailability(chapters[2], save)).toMatchObject({
      playable: true,
      status: "completed",
    });
    expect(getChapterAvailability(chapters[3], save)).toMatchObject({
      playable: true,
      status: "playable",
      legacyLevelId: 5,
    });
  });

  it("unlocks Chapter 5 after Chapter 4 active completion maps to old Level 5", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 3, 4, 5],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6],
      currentLevelId: 6,
    };

    expect(getChapterAvailability(chapters[3], save)).toMatchObject({
      playable: true,
      status: "completed",
    });
    expect(getChapterAvailability(chapters[4], save)).toMatchObject({
      playable: true,
      status: "playable",
      legacyLevelId: 6,
    });
  });

  it("uses old Level 8 as the Chapter 5 completion threshold during the bridge", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      currentLevelId: 9,
    };

    expect(getChapterAvailability(chapters[4], save)).toMatchObject({
      playable: true,
      status: "completed",
    });
    expect(getChapterAvailability(chapters[5], save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Finale",
      legacyLevelId: 9,
    });
  });

  it("unlocks Chapter 6 after Chapter 5 active completion maps to old Level 8", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 3, 4, 5, 8],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 8, 9],
      currentLevelId: 9,
    };

    expect(getChapterAvailability(chapters[4], save)).toMatchObject({
      playable: true,
      status: "completed",
    });
    expect(getChapterAvailability(chapters[5], save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Finale",
      legacyLevelId: 9,
    });
  });

  it("marks Chapter 6 complete from old final completion and all chapters closed after accepted verdict", () => {
    const oldFinalComplete = {
      ...createDefaultSaveData(),
      completedLevelIds: [10],
      unlockedLevelIds: [1, 10],
      currentLevelId: 10,
    };

    expect(getChapterAvailability(chapters[5], oldFinalComplete)).toMatchObject({
      playable: true,
      status: "completed",
      label: "Completed / Replay Finale",
    });

    const gameCompleted = {
      ...oldFinalComplete,
      gameCompleted: true,
    };

    expect(getClosedChapterCount(chapters, gameCompleted)).toBe(6);
    expect(getChapterAvailability(chapters[5], gameCompleted)).toMatchObject({
      label: "Verdict Accepted. Case Closed.",
    });
  });

  it("keeps legacy 10-level availability available for dev routes", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      currentLevelId: 10,
    };

    expect(getLevelAvailability(10, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Finale",
    });
  });
});
