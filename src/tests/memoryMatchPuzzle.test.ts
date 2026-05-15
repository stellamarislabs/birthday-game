import { describe, expect, it } from "vitest";
import {
  MEMORY_MATCH_CARDS,
  MEMORY_MATCH_PAIRS,
  createMemoryMatchState,
  isMemoryMatchSolved,
  resetMemoryMatchState,
  selectMemoryMatchCard
} from "../game/puzzles/memoryMatch/memoryMatchLogic";

describe("memory-match puzzle logic", () => {
  it("starts with eight cards", () => {
    const state = createMemoryMatchState();

    expect(MEMORY_MATCH_CARDS).toHaveLength(8);
    expect(state.cards).toHaveLength(8);
  });

  it("has four pairs", () => {
    expect(MEMORY_MATCH_PAIRS).toEqual(["warmth", "attention", "patience", "joy"]);
  });

  it("selecting one card stores it as selected", () => {
    const state = selectMemoryMatchCard(createMemoryMatchState(), "quiet-smile");

    expect(state.selectedCardIds).toEqual(["quiet-smile"]);
    expect(state.matchedPairIds).toEqual([]);
  });

  it("selecting a matching pair marks the pair as matched", () => {
    const first = selectMemoryMatchCard(createMemoryMatchState(), "quiet-smile");
    const second = selectMemoryMatchCard(first, "warmth");

    expect(second.selectedCardIds).toEqual([]);
    expect(second.matchedPairIds).toEqual(["warmth"]);
    expect(second.feedback).toBe("");
  });

  it("selecting a non-matching pair does not mark a pair as matched", () => {
    const first = selectMemoryMatchCard(createMemoryMatchState(), "quiet-smile");
    const second = selectMemoryMatchCard(first, "attention");

    expect(second.selectedCardIds).toEqual([]);
    expect(second.matchedPairIds).toEqual([]);
  });

  it("non-matching selection shows gentle feedback", () => {
    const first = selectMemoryMatchCard(createMemoryMatchState(), "hard-day");
    const second = selectMemoryMatchCard(first, "joy");

    expect(second.feedback).toBe("These details belong to different pages.");
  });

  it("matched cards cannot be unmatched accidentally", () => {
    const matched = selectMemoryMatchCard(selectMemoryMatchCard(createMemoryMatchState(), "quiet-smile"), "warmth");
    const selectedAgain = selectMemoryMatchCard(matched, "quiet-smile");

    expect(selectedAgain.matchedPairIds).toEqual(["warmth"]);
    expect(selectedAgain.selectedCardIds).toEqual([]);
  });

  it("reset clears selections and matches", () => {
    const matched = selectMemoryMatchCard(selectMemoryMatchCard(createMemoryMatchState(), "quiet-smile"), "warmth");
    const reset = resetMemoryMatchState();

    expect(matched.matchedPairIds).toEqual(["warmth"]);
    expect(reset.selectedCardIds).toEqual([]);
    expect(reset.matchedPairIds).toEqual([]);
  });

  it("solved state is true only when all four pairs are matched", () => {
    let state = createMemoryMatchState();

    expect(isMemoryMatchSolved(state)).toBe(false);
    state = selectMemoryMatchCard(selectMemoryMatchCard(state, "quiet-smile"), "warmth");
    state = selectMemoryMatchCard(selectMemoryMatchCard(state, "careful-note"), "attention");
    state = selectMemoryMatchCard(selectMemoryMatchCard(state, "hard-day"), "patience");
    state = selectMemoryMatchCard(selectMemoryMatchCard(state, "tiny-joke"), "joy");

    expect(state.solved).toBe(true);
    expect(state.feedback).toBe("Details matched.");
    expect(isMemoryMatchSolved(state)).toBe(true);
  });
});
