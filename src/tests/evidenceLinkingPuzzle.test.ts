import { describe, expect, it } from "vitest";
import {
  CORRECT_EVIDENCE_LINKS,
  EVIDENCE_LINKING_COPY,
  createEvidenceLinkingState,
  isEvidenceLinkingCorrect,
  linkSelectedExhibitToMeaning,
  resetEvidenceLinkingState,
  selectEvidenceLinkingExhibit,
  submitEvidenceLinking,
  unlinkEvidenceLinkingExhibit
} from "../game/puzzles/evidenceLinking/evidenceLinkingLogic";
import type { EvidenceLinkingState } from "../game/puzzles/evidenceLinking/evidenceLinkingTypes";

describe("evidence-linking puzzle", () => {
  it("starts with six exhibits and six meanings", () => {
    const state = createEvidenceLinkingState();

    expect(state.exhibits).toHaveLength(6);
    expect(state.meanings).toHaveLength(6);
  });

  it("starts with no selected exhibit and no links", () => {
    const state = createEvidenceLinkingState();

    expect(state.selectedExhibitId).toBeNull();
    expect(state.links).toEqual({});
  });

  it("selecting an exhibit stores selected exhibit id", () => {
    expect(selectEvidenceLinkingExhibit(createEvidenceLinkingState(), "sealed-envelope").selectedExhibitId).toBe("sealed-envelope");
  });

  it("linking selected exhibit to a meaning creates a link", () => {
    const selected = selectEvidenceLinkingExhibit(createEvidenceLinkingState(), "sealed-envelope");
    const linked = linkSelectedExhibitToMeaning(selected, "attention");

    expect(linked.links["sealed-envelope"]).toBe("attention");
    expect(linked.selectedExhibitId).toBeNull();
  });

  it("changing a link updates that exhibit meaning", () => {
    const selected = selectEvidenceLinkingExhibit(createEvidenceLinkingState(), "sealed-envelope");
    const firstLink = linkSelectedExhibitToMeaning(selected, "truth");
    const selectedAgain = selectEvidenceLinkingExhibit(firstLink, "sealed-envelope");
    const changed = linkSelectedExhibitToMeaning(selectedAgain, "attention");

    expect(changed.links["sealed-envelope"]).toBe("attention");
  });

  it("keeps meaning links one-to-one by moving a reused meaning to the latest exhibit", () => {
    const firstSelected = selectEvidenceLinkingExhibit(createEvidenceLinkingState(), "sealed-envelope");
    const firstLinked = linkSelectedExhibitToMeaning(firstSelected, "attention");
    const secondSelected = selectEvidenceLinkingExhibit(firstLinked, "golden-stamp");
    const reassigned = linkSelectedExhibitToMeaning(secondSelected, "attention");

    expect(reassigned.links["sealed-envelope"]).toBeUndefined();
    expect(reassigned.links["golden-stamp"]).toBe("attention");
  });

  it("unlinking an exhibit removes the link", () => {
    const selected = selectEvidenceLinkingExhibit(createEvidenceLinkingState(), "red-brick");
    const linked = linkSelectedExhibitToMeaning(selected, "patience");

    expect(unlinkEvidenceLinkingExhibit(linked, "red-brick").links["red-brick"]).toBeUndefined();
  });

  it("recognizes the correct mapping", () => {
    expect(isEvidenceLinkingCorrect(withLinks(CORRECT_EVIDENCE_LINKS))).toBe(true);
  });

  it("does not solve incomplete mapping", () => {
    const state = withLinks({ "sealed-envelope": "attention" });

    expect(isEvidenceLinkingCorrect(state)).toBe(false);
    expect(submitEvidenceLinking(state).result).toEqual({
      solved: false,
      feedback: EVIDENCE_LINKING_COPY.wrong
    });
  });

  it("does not solve wrong mapping", () => {
    const state = withLinks({
      ...CORRECT_EVIDENCE_LINKS,
      lantern: "truth"
    });

    expect(submitEvidenceLinking(state).result).toEqual({
      solved: false,
      feedback: EVIDENCE_LINKING_COPY.wrong
    });
  });

  it("reset clears all links", () => {
    const state = withLinks(CORRECT_EVIDENCE_LINKS);

    expect(resetEvidenceLinkingState()).toMatchObject({
      links: {},
      selectedExhibitId: null,
      solved: false
    });
    expect(state.links).not.toEqual({});
  });

  it("solved state is detected only when all mappings are correct", () => {
    const submission = submitEvidenceLinking(withLinks(CORRECT_EVIDENCE_LINKS));

    expect(submission.state.solved).toBe(true);
    expect(submission.result).toEqual({
      solved: true,
      feedback: EVIDENCE_LINKING_COPY.success
    });
  });
});

function withLinks(links: EvidenceLinkingState["links"]): EvidenceLinkingState {
  return {
    ...createEvidenceLinkingState(),
    links: { ...links }
  };
}
