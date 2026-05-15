import type {
  FinalSealRing,
  FinalSealRotation,
  FinalVerdictAssemblyCheckResult,
  FinalVerdictAssemblyProgress,
  FinalVerdictAssemblySpec,
  FinalVerdictAssemblyState
} from "./finalVerdictAssemblyTypes";
import { getPuzzleSuccessFeedback } from "../shared/feedback";

const ROTATION_STEPS = [0, 90, 180, 270] as const satisfies readonly FinalSealRotation[];

export function createInitialFinalVerdictAssemblyState(spec: FinalVerdictAssemblySpec): FinalVerdictAssemblyState {
  return {
    ringRotationsById: Object.fromEntries(spec.rings.map((ring) => [ring.id, ring.initialRotation])),
    solved: false,
    feedback: ""
  };
}

export function rotateFinalSealRing(
  spec: FinalVerdictAssemblySpec,
  state: FinalVerdictAssemblyState,
  ringId: string
): FinalVerdictAssemblyState {
  const ring = getFinalSealRing(spec, ringId);
  if (!ring) {
    return cloneState(state);
  }

  return {
    ringRotationsById: {
      ...state.ringRotationsById,
      [ringId]: getNextRotation(state.ringRotationsById[ringId] ?? ring.initialRotation)
    },
    solved: false,
    feedback: ""
  };
}

export function resetFinalVerdictAssembly(spec: FinalVerdictAssemblySpec): FinalVerdictAssemblyState {
  return createInitialFinalVerdictAssemblyState(spec);
}

export function getRingAlignment(
  spec: FinalVerdictAssemblySpec,
  state: FinalVerdictAssemblyState,
  ringId: string
): FinalSealRotation | undefined {
  const ring = getFinalSealRing(spec, ringId);
  if (!ring) {
    return undefined;
  }

  return state.ringRotationsById[ringId] ?? ring.initialRotation;
}

export function isRingAligned(
  spec: FinalVerdictAssemblySpec,
  state: FinalVerdictAssemblyState,
  ringId: string
): boolean {
  const ring = getFinalSealRing(spec, ringId);
  return Boolean(ring && getRingAlignment(spec, state, ringId) === ring.alignedRotation);
}

export function isFinalVerdictAssemblySolved(
  spec: FinalVerdictAssemblySpec,
  state: FinalVerdictAssemblyState
): boolean {
  return spec.rings.every((ring) => isRingAligned(spec, state, ring.id));
}

export function getFinalVerdictAssemblyProgress(
  spec: FinalVerdictAssemblySpec,
  state: FinalVerdictAssemblyState
): FinalVerdictAssemblyProgress {
  const alignedRingIds = spec.rings.filter((ring) => isRingAligned(spec, state, ring.id)).map((ring) => ring.id);
  const litClueIds = spec.rings
    .filter((ring) => alignedRingIds.includes(ring.id))
    .flatMap((ring) => ring.clueIds);

  return {
    alignedRingIds,
    litClueIds,
    litCount: litClueIds.length,
    totalCount: spec.clueMarks.length
  };
}

export function checkFinalVerdictAssemblyAnswer(
  spec: FinalVerdictAssemblySpec,
  state: FinalVerdictAssemblyState
): FinalVerdictAssemblyCheckResult {
  if (!isFinalVerdictAssemblySolved(spec, state)) {
    return makeResult(state, false, spec.incompleteText, "incomplete");
  }

  return makeResult(state, true, getPuzzleSuccessFeedback(spec), "correct");
}

export function getFinalSealRing(spec: FinalVerdictAssemblySpec, ringId: string): FinalSealRing | undefined {
  return spec.rings.find((ring) => ring.id === ringId);
}

function getNextRotation(rotation: FinalSealRotation): FinalSealRotation {
  const currentIndex = ROTATION_STEPS.indexOf(rotation);
  return ROTATION_STEPS[(currentIndex + 1) % ROTATION_STEPS.length];
}

function makeResult(
  state: FinalVerdictAssemblyState,
  solved: boolean,
  feedback: string,
  reason: FinalVerdictAssemblyCheckResult["reason"]
): FinalVerdictAssemblyCheckResult {
  const nextState = {
    ...cloneState(state),
    solved,
    feedback
  };

  return { state: nextState, solved, feedback, reason };
}

function cloneState(state: FinalVerdictAssemblyState): FinalVerdictAssemblyState {
  return {
    ringRotationsById: { ...state.ringRotationsById },
    solved: state.solved,
    feedback: state.feedback
  };
}
