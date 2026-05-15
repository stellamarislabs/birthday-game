import { describe, expect, it } from "vitest";
import {
  getVisualNovelChapterSceneByPlacement,
  getVisualNovelSceneByPlacement,
  getVisualNovelSceneSpec,
  visualNovelScenes
} from "../content/vnScenes";
import {
  findVisualNovelSceneId,
  findChapterVisualNovelSceneId,
  getNextVisualNovelLineIndex,
  getVisualNovelTarget,
  getVisualNovelTargetById
} from "../game/systems/VnFlow";
import {
  getKnownVisualNovelBackgroundVariants,
  getVisualNovelBackgroundVariant,
  getVisualNovelBackgroundVariantForLevel,
  getVisualNovelPortrait
} from "../game/systems/VnPresentation";

describe("Visual Novel content", () => {
  const implementedVnLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const allowedSpeakers = ["Narrator", "Maria", "Case File", "Secret Client", "Witness"];
  const validTargetScenes = ["PlatformerScene", "PuzzleScene", "EvidenceRevealScene", "FinalVerdictScene"];

  it("defines the three Level 1 VN scenes", () => {
    expect(getVisualNovelSceneSpec("vn-level-1-intro")).toBeDefined();
    expect(getVisualNovelSceneSpec("vn-level-1-before-puzzle")).toBeDefined();
    expect(getVisualNovelSceneSpec("vn-level-1-after-puzzle")).toBeDefined();
  });

  it("defines active chapter VN scenes for Chapters 1 through 6", () => {
    for (const chapterId of [1, 2, 3, 4, 5, 6]) {
      expect(getVisualNovelSceneSpec(`vn-chapter-${chapterId}-intro`)).toBeDefined();
      expect(getVisualNovelSceneSpec(`vn-chapter-${chapterId}-before-puzzle`)).toBeDefined();
      expect(getVisualNovelSceneSpec(`vn-chapter-${chapterId}-after-puzzle`)).toBeDefined();
    }
  });

  it("uses the final 6-chapter VN titles for the active chapter flow", () => {
    expect(getVisualNovelSceneSpec("vn-chapter-1-intro")?.title).toBe("The First Envelope");
    expect(getVisualNovelSceneSpec("vn-chapter-1-before-puzzle")?.title).toBe("The Envelope Rebuilt");
    expect(getVisualNovelSceneSpec("vn-chapter-1-after-puzzle")?.title).toBe("The Route Begins");
    expect(getVisualNovelSceneSpec("vn-chapter-2-intro")?.title).toBe("The Stamped Route");
    expect(getVisualNovelSceneSpec("vn-chapter-2-before-puzzle")?.title).toBe("The Hidden Wall");
    expect(getVisualNovelSceneSpec("vn-chapter-2-after-puzzle")?.title).toBe("The River Mark");
    expect(getVisualNovelSceneSpec("vn-chapter-3-intro")?.title).toBe("The Running Witness");
    expect(getVisualNovelSceneSpec("vn-chapter-3-before-puzzle")?.title).toBe("The Witness Note");
    expect(getVisualNovelSceneSpec("vn-chapter-3-after-puzzle")?.title).toBe("The Archive Code");
    expect(getVisualNovelSceneSpec("vn-chapter-4-intro")?.title).toBe("The Drawer No One Opened");
    expect(getVisualNovelSceneSpec("vn-chapter-4-before-puzzle")?.title).toBe("The Marginal Note");
    expect(getVisualNovelSceneSpec("vn-chapter-4-after-puzzle")?.title).toBe("No. Given.");
    expect(getVisualNovelSceneSpec("vn-chapter-5-intro")?.title).toBe("The Door of Trust");
    expect(getVisualNovelSceneSpec("vn-chapter-5-before-puzzle")?.title).toBe("The Right Question");
    expect(getVisualNovelSceneSpec("vn-chapter-5-after-puzzle")?.title).toBe("The Letter Released");
    expect(getVisualNovelSceneSpec("vn-chapter-6-intro")?.title).toBe("Before the Verdict");
    expect(getVisualNovelSceneSpec("vn-chapter-6-before-puzzle")?.title).toBe("The Final Seal");
    expect(getVisualNovelSceneSpec("vn-chapter-6-after-puzzle")?.title).toBe("The Verdict Is Ready");
  });

  it("defines intro, pre-puzzle, and post-puzzle VN scenes for Levels 2-5", () => {
    for (const levelId of [2, 3, 4, 5]) {
      expect(getVisualNovelSceneSpec(`vn-level-${levelId}-intro`)).toBeDefined();
      expect(getVisualNovelSceneSpec(`vn-level-${levelId}-before-puzzle`)).toBeDefined();
      expect(getVisualNovelSceneSpec(`vn-level-${levelId}-after-puzzle`)).toBeDefined();
    }
  });

  it("defines intro, pre-puzzle, and post-puzzle VN scenes for Levels 6-10", () => {
    for (const levelId of [6, 7, 8, 9, 10]) {
      expect(getVisualNovelSceneSpec(`vn-level-${levelId}-intro`)).toBeDefined();
      expect(getVisualNovelSceneSpec(`vn-level-${levelId}-before-puzzle`)).toBeDefined();
      expect(getVisualNovelSceneSpec(`vn-level-${levelId}-after-puzzle`)).toBeDefined();
    }
  });

  it("keeps every VN scene non-empty and targetable", () => {
    for (const scene of visualNovelScenes) {
      expect(scene.id).not.toHaveLength(0);
      expect(scene.lines.length).toBeGreaterThan(0);
      expect(scene.nextScene.scene).not.toHaveLength(0);
      expect(validTargetScenes).toContain(scene.nextScene.scene);

      if (scene.skipScene) {
        expect(validTargetScenes).toContain(scene.skipScene.scene);
      }

      for (const line of scene.lines) {
        expect(line.speaker).not.toHaveLength(0);
        expect(line.text).not.toHaveLength(0);
        expect(allowedSpeakers).toContain(line.speaker);
      }
    }
  });

  it("keeps VN scene ids unique", () => {
    const ids = visualNovelScenes.map((scene) => scene.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("maps Level 1 intro VN to PlatformerScene level 1", () => {
    const scene = getVisualNovelSceneByPlacement(1, "before-platformer");

    expect(scene?.id).toBe("vn-level-1-intro");
    expect(scene?.nextScene).toEqual({ scene: "PlatformerScene", data: { levelId: 1 } });
    expect(findVisualNovelSceneId(1, "before-platformer")).toBe("vn-level-1-intro");
  });

  it("maps Chapter 1 VN through the active chapter flow", () => {
    expect(getVisualNovelChapterSceneByPlacement(1, "before-platformer")?.nextScene).toEqual({
      scene: "PlatformerScene",
      data: { levelId: 1, chapterId: 1 }
    });
    expect(getVisualNovelChapterSceneByPlacement(1, "before-puzzle")?.nextScene).toEqual({
      scene: "PuzzleScene",
      data: { levelId: 1, chapterId: 1 }
    });
    expect(getVisualNovelChapterSceneByPlacement(1, "after-puzzle")?.nextScene).toEqual({
      scene: "EvidenceRevealScene",
      data: { levelId: 1, chapterId: 1 }
    });
    expect(findChapterVisualNovelSceneId(1, "before-platformer")).toBe("vn-chapter-1-intro");
    expect(getVisualNovelChapterSceneByPlacement(1, "before-puzzle")?.lines).toHaveLength(1);
    expect(getVisualNovelChapterSceneByPlacement(1, "after-puzzle")?.lines).toHaveLength(1);
  });

  it("maps Chapter 2 VN to old Level 2 platformer and old Level 3 route tile puzzle", () => {
    expect(getVisualNovelChapterSceneByPlacement(2, "before-platformer")?.nextScene).toEqual({
      scene: "PlatformerScene",
      data: { levelId: 2, chapterId: 2 }
    });
    expect(getVisualNovelChapterSceneByPlacement(2, "before-puzzle")?.nextScene).toEqual({
      scene: "PuzzleScene",
      data: { levelId: 3, chapterId: 2 }
    });
    expect(getVisualNovelChapterSceneByPlacement(2, "after-puzzle")?.nextScene).toEqual({
      scene: "EvidenceRevealScene",
      data: { levelId: 3, chapterId: 2 }
    });
    expect(findChapterVisualNovelSceneId(2, "before-puzzle")).toBe("vn-chapter-2-before-puzzle");
    expect(getVisualNovelChapterSceneByPlacement(2, "before-puzzle")?.lines).toHaveLength(1);
    expect(getVisualNovelChapterSceneByPlacement(2, "after-puzzle")?.lines).toHaveLength(1);
  });

  it("maps Chapter 3 VN to old Level 4 river platformer and Witness Lens", () => {
    expect(getVisualNovelChapterSceneByPlacement(3, "before-platformer")?.nextScene).toEqual({
      scene: "PlatformerScene",
      data: { levelId: 4, chapterId: 3 }
    });
    expect(getVisualNovelChapterSceneByPlacement(3, "before-puzzle")?.nextScene).toEqual({
      scene: "PuzzleScene",
      data: { levelId: 4, chapterId: 3 }
    });
    expect(getVisualNovelChapterSceneByPlacement(3, "after-puzzle")?.nextScene).toEqual({
      scene: "EvidenceRevealScene",
      data: { levelId: 4, chapterId: 3 }
    });
    expect(findChapterVisualNovelSceneId(3, "before-puzzle")).toBe("vn-chapter-3-before-puzzle");
    expect(getVisualNovelChapterSceneByPlacement(3, "before-puzzle")?.lines).toHaveLength(1);
    expect(getVisualNovelChapterSceneByPlacement(3, "after-puzzle")?.lines).toHaveLength(1);
  });

  it("maps Chapter 4 VN to old Level 5 archive platformer and Archive Detail Finder", () => {
    expect(getVisualNovelChapterSceneByPlacement(4, "before-platformer")?.nextScene).toEqual({
      scene: "PlatformerScene",
      data: { levelId: 5, chapterId: 4 }
    });
    expect(getVisualNovelChapterSceneByPlacement(4, "before-puzzle")?.nextScene).toEqual({
      scene: "PuzzleScene",
      data: { levelId: 5, chapterId: 4 }
    });
    expect(getVisualNovelChapterSceneByPlacement(4, "after-puzzle")?.nextScene).toEqual({
      scene: "EvidenceRevealScene",
      data: { levelId: 5, chapterId: 4 }
    });
    expect(findChapterVisualNovelSceneId(4, "before-puzzle")).toBe("vn-chapter-4-before-puzzle");
    expect(getVisualNovelChapterSceneByPlacement(4, "before-puzzle")?.lines).toHaveLength(1);
    expect(getVisualNovelChapterSceneByPlacement(4, "after-puzzle")?.lines).toHaveLength(1);
  });

  it("maps Chapter 5 VN to old Level 6 courthouse platformer and Trust Door Light Path", () => {
    expect(getVisualNovelChapterSceneByPlacement(5, "before-platformer")?.nextScene).toEqual({
      scene: "PlatformerScene",
      data: { levelId: 6, chapterId: 5 }
    });
    expect(getVisualNovelChapterSceneByPlacement(5, "before-puzzle")?.nextScene).toEqual({
      scene: "PuzzleScene",
      data: { levelId: 6, chapterId: 5 }
    });
    expect(getVisualNovelChapterSceneByPlacement(5, "after-puzzle")?.nextScene).toEqual({
      scene: "EvidenceRevealScene",
      data: { levelId: 6, chapterId: 5 }
    });
    expect(findChapterVisualNovelSceneId(5, "after-puzzle")).toBe("vn-chapter-5-after-puzzle");
    expect(getVisualNovelChapterSceneByPlacement(5, "before-puzzle")?.lines).toHaveLength(1);
    expect(getVisualNovelChapterSceneByPlacement(5, "after-puzzle")?.lines).toHaveLength(1);
  });

  it("maps Chapter 6 VN to old Level 9 rooftops and old Level 10 final seal", () => {
    expect(getVisualNovelChapterSceneByPlacement(6, "before-platformer")?.nextScene).toEqual({
      scene: "PlatformerScene",
      data: { levelId: 9, chapterId: 6 }
    });
    expect(getVisualNovelChapterSceneByPlacement(6, "before-puzzle")?.nextScene).toEqual({
      scene: "PuzzleScene",
      data: { levelId: 10, chapterId: 6 }
    });
    expect(getVisualNovelChapterSceneByPlacement(6, "after-puzzle")?.nextScene).toEqual({
      scene: "FinalVerdictScene"
    });
    expect(findChapterVisualNovelSceneId(6, "after-puzzle")).toBe("vn-chapter-6-after-puzzle");
    expect(getVisualNovelChapterSceneByPlacement(6, "before-puzzle")?.lines).toHaveLength(1);
    expect(getVisualNovelChapterSceneByPlacement(6, "after-puzzle")?.lines).toHaveLength(1);
  });

  it("maps Level 1 pre-puzzle VN to PuzzleScene level 1", () => {
    const scene = getVisualNovelSceneByPlacement(1, "before-puzzle");

    expect(scene?.id).toBe("vn-level-1-before-puzzle");
    expect(scene?.nextScene).toEqual({ scene: "PuzzleScene", data: { levelId: 1 } });
    expect(findVisualNovelSceneId(1, "before-puzzle")).toBe("vn-level-1-before-puzzle");
  });

  it("maps Level 1 post-puzzle VN to EvidenceRevealScene level 1", () => {
    const scene = getVisualNovelSceneByPlacement(1, "after-puzzle");

    expect(scene?.id).toBe("vn-level-1-after-puzzle");
    expect(scene?.nextScene).toEqual({ scene: "EvidenceRevealScene", data: { levelId: 1 } });
    expect(findVisualNovelSceneId(1, "after-puzzle")).toBe("vn-level-1-after-puzzle");
  });

  it("maps Level 2-9 VN placements to their matching target scenes", () => {
    for (const levelId of [2, 3, 4, 5, 6, 7, 8, 9]) {
      expect(getVisualNovelSceneByPlacement(levelId, "before-platformer")?.nextScene).toEqual({
        scene: "PlatformerScene",
        data: { levelId }
      });
      expect(getVisualNovelSceneByPlacement(levelId, "before-puzzle")?.nextScene).toEqual({
        scene: "PuzzleScene",
        data: { levelId }
      });
      expect(getVisualNovelSceneByPlacement(levelId, "after-puzzle")?.nextScene).toEqual({
        scene: "EvidenceRevealScene",
        data: { levelId }
      });
    }
  });

  it("maps Level 10 VN placements through the final verdict handoff", () => {
    expect(getVisualNovelSceneByPlacement(10, "before-platformer")?.nextScene).toEqual({
      scene: "PlatformerScene",
      data: { levelId: 10 }
    });
    expect(getVisualNovelSceneByPlacement(10, "before-puzzle")?.nextScene).toEqual({
      scene: "PuzzleScene",
      data: { levelId: 10 }
    });
    expect(getVisualNovelSceneByPlacement(10, "after-puzzle")?.nextScene).toEqual({
      scene: "FinalVerdictScene"
    });

    expect(findVisualNovelSceneId(10, "before-final-verdict")).toBeNull();
  });

  it("keeps all VN levels capped at concise scene lengths", () => {
    for (const levelId of implementedVnLevels) {
      for (const placement of ["before-platformer", "before-puzzle", "after-puzzle"] as const) {
        const scene = getVisualNovelSceneByPlacement(levelId, placement);
        expect(scene?.lines.length).toBeGreaterThanOrEqual(3);
        expect(scene?.lines.length).toBeLessThanOrEqual(5);
      }
    }
  });

  it("keeps active chapter VN scenes compressed for the 10-15 minute flow", () => {
    for (const chapterId of [1, 2, 3, 4, 5, 6]) {
      expect(getVisualNovelChapterSceneByPlacement(chapterId, "before-platformer")?.lines.length).toBeLessThanOrEqual(3);
      expect(getVisualNovelChapterSceneByPlacement(chapterId, "before-puzzle")?.lines.length).toBeLessThanOrEqual(2);
      expect(getVisualNovelChapterSceneByPlacement(chapterId, "after-puzzle")?.lines.length).toBeLessThanOrEqual(2);
    }
  });

  it("keeps every VN line short enough for mobile landscape", () => {
    for (const scene of visualNovelScenes) {
      for (const line of scene.lines) {
        expect(line.text.length, `${scene.id}: ${line.text}`).toBeLessThanOrEqual(110);
      }
    }
  });

  it("uses clue filing language instead of old exhibit-admitted language", () => {
    const vnText = JSON.stringify(visualNovelScenes);

    expect(vnText).not.toContain("Exhibit admitted");
    expect(vnText).not.toContain("Final exhibit admitted");
    expect(vnText).toContain("Clue filed.");
    expect(vnText).toContain("Final clue filed.");
  });

  it("keeps active chapter VN scenes free of retired case-title and level-count language", () => {
    const activeChapterText = JSON.stringify(
      visualNovelScenes.filter((scene) => (scene.chapterId ?? 0) > 0)
    );

    expect(activeChapterText).not.toContain("Exhibit admitted");
    expect(activeChapterText).not.toContain("Tenth Exhibit");
    expect(activeChapterText).not.toContain("Sprawa Dziesiątego Dowodu");
    expect(activeChapterText).not.toContain("M/10");
    expect(activeChapterText).not.toContain("The Heart, Freely Given");
  });

  it("threads the final 6-chapter clue continuity through active VN scenes", () => {
    const activeChapterText = JSON.stringify(
      visualNovelScenes.filter((scene) => (scene.chapterId ?? 0) > 0)
    );
    const expectedSignals = [
      "key",
      "ticket",
      "stamp",
      "wall",
      "Vistula",
      "archive code",
      "No. Given.",
      "silver key",
      "Trust",
      "blue ribbon",
      "unfinished letter",
      "final court",
      "verdict"
    ];

    for (const signal of expectedSignals) {
      expect(activeChapterText).toContain(signal);
    }
  });

  it("connects each VN level to the next clue in the case trail", () => {
    const expectedTrailSignals = [
      "tram ticket",
      "validator",
      "hidden route",
      "brass key",
      "Vistula",
      "archive code",
      "silver key",
      "Trust door",
      "lantern",
      "blue ribbon",
      "unfinished letter",
      "final court"
    ];
    const vnText = JSON.stringify(visualNovelScenes);

    for (const signal of expectedTrailSignals) {
      expect(vnText).toContain(signal);
    }
  });

  it("advances line indexes and resolves skip targets safely", () => {
    const spec = getVisualNovelSceneSpec("vn-level-1-intro");

    expect(spec).toBeDefined();
    expect(getNextVisualNovelLineIndex(0, spec?.lines.length ?? 0)).toBe(1);
    expect(getNextVisualNovelLineIndex((spec?.lines.length ?? 1) - 1, spec?.lines.length ?? 0)).toBeNull();
    expect(getVisualNovelTarget(spec!)).toEqual({ scene: "PlatformerScene", data: { levelId: 1 } });
    expect(getVisualNovelTarget(spec!, "skip")).toEqual({ scene: "PlatformerScene", data: { levelId: 1 } });
    expect(getVisualNovelTargetById("missing")).toBeNull();
  });

  it("resolves known speakers to procedural placeholder portraits", () => {
    expect(getVisualNovelPortrait({ speaker: "Maria", text: "Ready." })).toMatchObject({
      speakerId: "maria",
      portraitKey: "maria",
      monogram: "M",
      side: "left"
    });
    expect(getVisualNovelPortrait({ speaker: "Case File", text: "Filed." })).toMatchObject({
      speakerId: "case-file",
      portraitKey: "case-file",
      monogram: "F",
      side: "right"
    });
    expect(getVisualNovelPortrait({ speaker: "Narrator", text: "Quietly." })).toMatchObject({
      speakerId: "narrator",
      portraitKey: "narrator",
      monogram: "N",
      side: "center"
    });
    expect(getVisualNovelPortrait({ speaker: "Secret Client", text: "Soon." })).toMatchObject({
      speakerId: "secret-client",
      portraitKey: "secret-client",
      monogram: "?",
      side: "right"
    });
  });

  it("falls back to the default placeholder for unknown speakers", () => {
    expect(getVisualNovelPortrait({ speaker: "Unexpected Witness", text: "Hello." })).toMatchObject({
      speakerId: "default",
      portraitKey: "default",
      monogram: "?",
      side: "center",
      label: "Unexpected Witness"
    });
  });

  it("maps levels to expected VN background variants", () => {
    const expected = [
      "kancelaria",
      "tram-night",
      "rebuilt-street",
      "vistula",
      "archive",
      "courthouse",
      "garden",
      "argument-tower",
      "rooftops",
      "court-heart"
    ];

    expected.forEach((variant, index) => {
      expect(getVisualNovelBackgroundVariantForLevel(index + 1)).toBe(variant);
    });
  });

  it("resolves explicit, derived, and fallback VN background variants safely", () => {
    expect(getVisualNovelBackgroundVariant({ levelId: 1 })).toBe("kancelaria");
    expect(getVisualNovelBackgroundVariant({ levelId: 1, backgroundVariant: "archive" })).toBe("archive");
    expect(getVisualNovelBackgroundVariant({ levelId: 2, backgroundKey: "garden" })).toBe("garden");
    expect(getVisualNovelBackgroundVariant({ levelId: 99 })).toBe("default-case-file");
    expect(getKnownVisualNovelBackgroundVariants()).toContain("court-heart");
  });
});
