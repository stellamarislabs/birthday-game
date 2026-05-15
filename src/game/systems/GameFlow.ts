import { assertNever } from "../../utils/assertNever";

export const FIRST_LEVEL_ID = 1;
export const FINAL_LEVEL_ID = 10;

export type GameFlowState =
  | { phase: "title" }
  | { phase: "opening-case-file" }
  | { phase: "level-select" }
  | { phase: "platformer-level"; levelId: number }
  | { phase: "puzzle"; levelId: number }
  | { phase: "evidence-reveal"; levelId: number }
  | { phase: "level-complete"; levelId: number }
  | { phase: "next-level-locked"; levelId: number }
  | { phase: "final-verdict" }
  | { phase: "game-complete" };

export function getInitialGameFlowState(): GameFlowState {
  return { phase: "title" };
}

export function getNextGameFlowState(state: GameFlowState): GameFlowState {
  switch (state.phase) {
    case "title":
      return { phase: "opening-case-file" };
    case "opening-case-file":
      return { phase: "platformer-level", levelId: FIRST_LEVEL_ID };
    case "platformer-level":
      return { phase: "puzzle", levelId: state.levelId };
    case "puzzle":
      if (state.levelId >= FINAL_LEVEL_ID) {
        return { phase: "final-verdict" };
      }

      return { phase: "evidence-reveal", levelId: state.levelId };
    case "evidence-reveal":
      if (state.levelId >= FINAL_LEVEL_ID) {
        return { phase: "final-verdict" };
      }

      return { phase: "level-complete", levelId: state.levelId };
    case "level-complete":
      return { phase: "level-select" };
    case "level-select":
      return state;
    case "next-level-locked":
      return state;
    case "final-verdict":
      return { phase: "game-complete" };
    case "game-complete":
      return { phase: "level-select" };
    default:
      return assertNever(state);
  }
}

export function getTitleDefaultState(hasCompletedLevelOne: boolean): GameFlowState {
  return hasCompletedLevelOne ? { phase: "level-select" } : { phase: "opening-case-file" };
}

export function getLevelSelectChoiceState(levelId: number, isPlayable: boolean): GameFlowState {
  if (isPlayable) {
    return { phase: "platformer-level", levelId };
  }

  return { phase: "next-level-locked", levelId };
}

export function getPuzzlePlaceholderExitState(_levelId: number): GameFlowState {
  return { phase: "level-select" };
}

export function getLevelFlowStates(levelId: number): GameFlowState[] {
  return [
    { phase: "platformer-level", levelId },
    { phase: "puzzle", levelId },
    { phase: "evidence-reveal", levelId }
  ];
}
