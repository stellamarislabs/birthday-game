import { describe, expect, it } from "vitest";
import { LEVEL_SIX_TRUST_LIGHT_PATH_SPEC as spec } from "../game/puzzles/trustLightPath/trustLightPathContent";
import {
  TRUST_LIGHT_PATH_FINAL_ASSET_FILENAMES,
  getTrustLightPathFinalAsset
} from "../game/puzzles/trustLightPath/trustLightPathFinalAssets";
import {
  checkTrustLightPathAnswer,
  createInitialTrustLightPathState,
  getMirrorConnections,
  getTrustLightPathProgress,
  isCorrectQuestionSelected,
  isLightPathConnected,
  isTrustLightPathSolved,
  resetTrustLightPath,
  rotateMirror,
  selectQuestion
} from "../game/puzzles/trustLightPath/trustLightPathLogic";

function solveMirrors(state = createInitialTrustLightPathState(spec)) {
  let nextState = state;
  for (const mirrorId of ["silver-key", "upper-echo", "trust-arch"]) {
    nextState = rotateMirror(spec, nextState, mirrorId);
  }

  return nextState;
}

describe("Trust Door Light Path logic", () => {
  it("starts with no selected question and an incomplete light path", () => {
    const state = createInitialTrustLightPathState(spec);

    expect(state.selectedQuestionId).toBeNull();
    expect(isCorrectQuestionSelected(spec, state)).toBe(false);
    expect(isLightPathConnected(spec, state)).toBe(false);
    expect(isTrustLightPathSolved(spec, state)).toBe(false);
    expect(getTrustLightPathProgress(spec, state)).toMatchObject({
      questionCorrect: false,
      connected: false,
      litMirrorCount: 0,
      totalMirrorCount: 3,
      payoffVisible: false
    });
  });

  it("wrong question does not activate a solved path", () => {
    const state = selectQuestion(spec, createInitialTrustLightPathState(spec), "who-benefits");

    expect(state.feedback).toBe(spec.wrongQuestionText);
    expect(isCorrectQuestionSelected(spec, state)).toBe(false);
    expect(checkTrustLightPathAnswer(spec, solveMirrors(state))).toMatchObject({
      solved: false,
      reason: "needs-question",
      feedback: spec.wrongQuestionText
    });
  });

  it("correct question activates the lantern without solving the incomplete path", () => {
    const state = selectQuestion(spec, createInitialTrustLightPathState(spec), "what-remains");

    expect(state.feedback).toBe("The lantern wakes.");
    expect(isCorrectQuestionSelected(spec, state)).toBe(true);
    expect(isLightPathConnected(spec, state)).toBe(false);
    expect(checkTrustLightPathAnswer(spec, state)).toMatchObject({
      solved: false,
      reason: "incomplete",
      feedback: spec.incompleteText
    });
  });

  it("rotating a mirror changes its rotation and connection set", () => {
    const state = createInitialTrustLightPathState(spec);
    const mirror = spec.mirrors.find((candidate) => candidate.id === "silver-key");
    expect(mirror).toBeDefined();
    if (!mirror) {
      return;
    }

    const rotated = rotateMirror(spec, state, mirror.id);

    expect(rotated.mirrorRotations[mirror.id]).toBe(180);
    expect(getMirrorConnections(mirror, rotated.mirrorRotations[mirror.id])).toEqual(["east", "west"]);
  });

  it("correct question plus connected light path solves", () => {
    const withQuestion = selectQuestion(spec, createInitialTrustLightPathState(spec), "what-remains");
    const connected = solveMirrors(withQuestion);
    const trustArch = spec.mirrors.find((candidate) => candidate.id === "trust-arch");

    expect(isLightPathConnected(spec, connected)).toBe(true);
    expect(trustArch).toBeDefined();
    if (trustArch) {
      expect(connected.mirrorRotations["trust-arch"]).toBe(0);
      expect(getMirrorConnections(trustArch, connected.mirrorRotations["trust-arch"])).toEqual(["south", "east"]);
    }
    expect(getTrustLightPathProgress(spec, connected)).toMatchObject({
      questionCorrect: true,
      connected: true,
      litMirrorCount: 3,
      payoffVisible: true
    });

    const result = checkTrustLightPathAnswer(spec, connected);

    expect(result).toMatchObject({
      solved: true,
      reason: "correct"
    });
    expect(result.feedback).toContain("The Trust door opens.");
    expect(result.feedback).toContain("unfinished letter");
    expect(isTrustLightPathSolved(spec, result.state)).toBe(true);
  });

  it("reset clears the question and mirror rotations", () => {
    const withQuestion = selectQuestion(spec, createInitialTrustLightPathState(spec), "what-remains");
    const connected = solveMirrors(withQuestion);

    expect(isLightPathConnected(spec, connected)).toBe(true);
    expect(resetTrustLightPath(spec)).toEqual(createInitialTrustLightPathState(spec));
  });

  it("maps optional final art assets without changing question or mirror mechanics", () => {
    expect(TRUST_LIGHT_PATH_FINAL_ASSET_FILENAMES).toEqual({
      background: "puzzle05-trust-light-bg.webp",
      trustBoard: "puzzle05-trust-board.webp",
      lanternSource: "puzzle05-lantern-source.webp",
      trustDoorTarget: "puzzle05-trust-door-target.webp"
    });

    for (const key of ["background", "trustBoard", "lanternSource", "trustDoorTarget"] as const) {
      const asset = getTrustLightPathFinalAsset(key);

      expect(asset.filename).toBe(TRUST_LIGHT_PATH_FINAL_ASSET_FILENAMES[key]);
      if (asset.imageUrl) {
        expect(asset.imageUrl).toContain(TRUST_LIGHT_PATH_FINAL_ASSET_FILENAMES[key]);
      }
    }

    expect(spec.questions.map((question) => question.id)).toEqual(["who-benefits", "receipt", "what-remains"]);
    expect(spec.correctQuestionId).toBe("what-remains");
    expect(spec.mirrors.map((mirror) => [mirror.id, mirror.initialRotation])).toEqual([
      ["silver-key", 90],
      ["upper-echo", 270],
      ["trust-arch", 270]
    ]);
  });
});
