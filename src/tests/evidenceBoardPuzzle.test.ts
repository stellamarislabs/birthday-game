import { describe, expect, it } from "vitest";
import {
  LEVEL_ONE_EVIDENCE_BOARD_SPEC,
  getEvidenceBoardSpec
} from "../game/puzzles/evidenceBoard/evidenceBoardContent";
import {
  checkEvidenceBoardAnswer,
  createInitialEvidenceBoardState,
  isEvidenceBoardSolved,
  linkSelectedEvidenceToMeaning,
  resetEvidenceBoard,
  selectEvidence,
  unlinkEvidence
} from "../game/puzzles/evidenceBoard/evidenceBoardLogic";
import type { EvidenceBoardSpec } from "../game/puzzles/evidenceBoard/evidenceBoardTypes";

describe("Evidence Board puzzle logic", () => {
  it("starts with no selected evidence", () => {
    const state = createInitialEvidenceBoardState(LEVEL_ONE_EVIDENCE_BOARD_SPEC);

    expect(state.selectedEvidenceId).toBeNull();
    expect(state.links).toEqual({});
    expect(state.solved).toBe(false);
  });

  it("selecting evidence stores selectedEvidenceId", () => {
    const state = selectEvidence(LEVEL_ONE_EVIDENCE_BOARD_SPEC, createInitialEvidenceBoardState(LEVEL_ONE_EVIDENCE_BOARD_SPEC), "sealed-envelope");

    expect(state.selectedEvidenceId).toBe("sealed-envelope");
  });

  it("linking selected evidence to meaning creates a link", () => {
    const selected = selectEvidence(
      LEVEL_ONE_EVIDENCE_BOARD_SPEC,
      createInitialEvidenceBoardState(LEVEL_ONE_EVIDENCE_BOARD_SPEC),
      "sealed-envelope"
    );
    const linked = linkSelectedEvidenceToMeaning(LEVEL_ONE_EVIDENCE_BOARD_SPEC, selected, "attention");

    expect(linked.links["sealed-envelope"]).toBe("attention");
    expect(linked.selectedEvidenceId).toBeNull();
  });

  it("linking the same evidence again replaces the old link", () => {
    const selected = selectEvidence(
      LEVEL_ONE_EVIDENCE_BOARD_SPEC,
      createInitialEvidenceBoardState(LEVEL_ONE_EVIDENCE_BOARD_SPEC),
      "sealed-envelope"
    );
    const firstLink = linkSelectedEvidenceToMeaning(LEVEL_ONE_EVIDENCE_BOARD_SPEC, selected, "speed");
    const selectedAgain = selectEvidence(LEVEL_ONE_EVIDENCE_BOARD_SPEC, firstLink, "sealed-envelope");
    const changed = linkSelectedEvidenceToMeaning(LEVEL_ONE_EVIDENCE_BOARD_SPEC, selectedAgain, "attention");

    expect(changed.links["sealed-envelope"]).toBe("attention");
  });

  it("prevents duplicate meaning use when the spec disallows it", () => {
    const multiSpec: EvidenceBoardSpec = {
      ...LEVEL_ONE_EVIDENCE_BOARD_SPEC,
      evidenceCards: [
        { id: "first", label: "First" },
        { id: "second", label: "Second" }
      ],
      correctLinks: [
        { evidenceId: "first", meaningId: "attention" },
        { evidenceId: "second", meaningId: "speed" }
      ],
      allowDuplicateMeanings: false
    };
    const firstSelected = selectEvidence(multiSpec, createInitialEvidenceBoardState(multiSpec), "first");
    const firstLinked = linkSelectedEvidenceToMeaning(multiSpec, firstSelected, "attention");
    const secondSelected = selectEvidence(multiSpec, firstLinked, "second");
    const reassigned = linkSelectedEvidenceToMeaning(multiSpec, secondSelected, "attention");

    expect(reassigned.links.first).toBeUndefined();
    expect(reassigned.links.second).toBe("attention");
  });

  it("unlinkEvidence removes a link", () => {
    const selected = selectEvidence(
      LEVEL_ONE_EVIDENCE_BOARD_SPEC,
      createInitialEvidenceBoardState(LEVEL_ONE_EVIDENCE_BOARD_SPEC),
      "sealed-envelope"
    );
    const linked = linkSelectedEvidenceToMeaning(LEVEL_ONE_EVIDENCE_BOARD_SPEC, selected, "attention");

    expect(unlinkEvidence(LEVEL_ONE_EVIDENCE_BOARD_SPEC, linked, "sealed-envelope").links["sealed-envelope"]).toBeUndefined();
  });

  it("does not solve an incomplete board", () => {
    const result = checkEvidenceBoardAnswer(
      LEVEL_ONE_EVIDENCE_BOARD_SPEC,
      createInitialEvidenceBoardState(LEVEL_ONE_EVIDENCE_BOARD_SPEC)
    );

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("incomplete");
    expect(result.feedback).toBe(LEVEL_ONE_EVIDENCE_BOARD_SPEC.incompleteText);
  });

  it("does not solve a wrong link", () => {
    const selected = selectEvidence(
      LEVEL_ONE_EVIDENCE_BOARD_SPEC,
      createInitialEvidenceBoardState(LEVEL_ONE_EVIDENCE_BOARD_SPEC),
      "sealed-envelope"
    );
    const linked = linkSelectedEvidenceToMeaning(LEVEL_ONE_EVIDENCE_BOARD_SPEC, selected, "noise");
    const result = checkEvidenceBoardAnswer(LEVEL_ONE_EVIDENCE_BOARD_SPEC, linked);

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("wrong");
    expect(result.feedback).toBe(LEVEL_ONE_EVIDENCE_BOARD_SPEC.wrongText);
  });

  it("solves the Level 1 board with Sealed Envelope to Attention", () => {
    const selected = selectEvidence(
      LEVEL_ONE_EVIDENCE_BOARD_SPEC,
      createInitialEvidenceBoardState(LEVEL_ONE_EVIDENCE_BOARD_SPEC),
      "sealed-envelope"
    );
    const linked = linkSelectedEvidenceToMeaning(LEVEL_ONE_EVIDENCE_BOARD_SPEC, selected, "attention");
    const result = checkEvidenceBoardAnswer(LEVEL_ONE_EVIDENCE_BOARD_SPEC, linked);

    expect(result.solved).toBe(true);
    expect(result.reason).toBe("correct");
    expect(result.feedback).toBe(LEVEL_ONE_EVIDENCE_BOARD_SPEC.successText);
    expect(isEvidenceBoardSolved(LEVEL_ONE_EVIDENCE_BOARD_SPEC, result.state)).toBe(true);
  });

  it("reset clears state", () => {
    expect(resetEvidenceBoard(LEVEL_ONE_EVIDENCE_BOARD_SPEC)).toEqual(
      createInitialEvidenceBoardState(LEVEL_ONE_EVIDENCE_BOARD_SPEC)
    );
  });
});

describe("Level 1 Evidence Board content", () => {
  it("has one evidence card and three meaning cards", () => {
    expect(LEVEL_ONE_EVIDENCE_BOARD_SPEC.evidenceCards).toHaveLength(1);
    expect(LEVEL_ONE_EVIDENCE_BOARD_SPEC.meaningCards).toHaveLength(3);
  });

  it("links The Sealed Envelope to Attention", () => {
    expect(LEVEL_ONE_EVIDENCE_BOARD_SPEC.correctLinks).toEqual([
      { evidenceId: "sealed-envelope", meaningId: "attention" }
    ]);
  });

  it("is available by level id", () => {
    expect(getEvidenceBoardSpec(1)?.title).toBe("Evidence Board: The Sealed Envelope");
    expect(getEvidenceBoardSpec(2)).toBeUndefined();
  });
});
