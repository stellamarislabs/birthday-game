import { getPuzzleSuccessFeedback } from "../shared/feedback";
import type {
  TrustLightDirection,
  TrustLightPathCheckResult,
  TrustLightPathProgress,
  TrustLightPathSpec,
  TrustLightPathState,
  TrustMirrorRotation,
  TrustMirrorSpec
} from "./trustLightPathTypes";

const DIRECTIONS: TrustLightDirection[] = ["north", "east", "south", "west"];

const DIRECTION_OFFSETS: Record<TrustLightDirection, { row: number; col: number }> = {
  north: { row: -1, col: 0 },
  east: { row: 0, col: 1 },
  south: { row: 1, col: 0 },
  west: { row: 0, col: -1 }
};

const OPPOSITE_DIRECTION: Record<TrustLightDirection, TrustLightDirection> = {
  north: "south",
  east: "west",
  south: "north",
  west: "east"
};

export function createInitialTrustLightPathState(spec: TrustLightPathSpec): TrustLightPathState {
  const mirrorRotations = Object.fromEntries(
    spec.mirrors.map((mirror) => [mirror.id, mirror.initialRotation])
  ) as Record<string, TrustMirrorRotation>;

  return {
    selectedQuestionId: null,
    mirrorRotations,
    litMirrorIds: getLitMirrorIds(spec, mirrorRotations),
    solved: false,
    feedback: ""
  };
}

export function selectQuestion(
  spec: TrustLightPathSpec,
  state: TrustLightPathState,
  questionId: string
): TrustLightPathState {
  if (!spec.questions.some((question) => question.id === questionId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedQuestionId: questionId,
    solved: false,
    feedback: questionId === spec.correctQuestionId ? "The lantern wakes." : spec.wrongQuestionText
  };
}

export function isCorrectQuestionSelected(spec: TrustLightPathSpec, state: TrustLightPathState): boolean {
  return state.selectedQuestionId === spec.correctQuestionId;
}

export function rotateMirror(
  spec: TrustLightPathSpec,
  state: TrustLightPathState,
  mirrorId: string
): TrustLightPathState {
  const mirror = getTrustMirror(spec, mirrorId);
  if (!mirror) {
    return cloneState(state);
  }

  const mirrorRotations = {
    ...state.mirrorRotations,
    [mirrorId]: nextRotation(state.mirrorRotations[mirrorId] ?? mirror.initialRotation)
  };

  return {
    ...cloneState(state),
    mirrorRotations,
    litMirrorIds: getLitMirrorIds(spec, mirrorRotations),
    solved: false,
    feedback: ""
  };
}

export function getMirrorConnections(
  mirror: TrustMirrorSpec,
  rotation: TrustMirrorRotation
): [TrustLightDirection, TrustLightDirection] {
  const rotationSteps = rotation / 90;
  return mirror.baseConnections.map((direction) => rotateDirection(direction, rotationSteps)) as [
    TrustLightDirection,
    TrustLightDirection
  ];
}

export function isLightPathConnected(spec: TrustLightPathSpec, state: TrustLightPathState): boolean {
  return getLitMirrorIds(spec, state.mirrorRotations).length === spec.mirrors.length && reachesTarget(spec, state.mirrorRotations);
}

export function isTrustLightPathSolved(spec: TrustLightPathSpec, state: TrustLightPathState): boolean {
  return isCorrectQuestionSelected(spec, state) && isLightPathConnected(spec, state) && state.solved;
}

export function resetTrustLightPath(spec: TrustLightPathSpec): TrustLightPathState {
  return createInitialTrustLightPathState(spec);
}

export function getTrustLightPathProgress(
  spec: TrustLightPathSpec,
  state: TrustLightPathState
): TrustLightPathProgress {
  const connected = isLightPathConnected(spec, state);

  return {
    questionCorrect: isCorrectQuestionSelected(spec, state),
    connected,
    litMirrorCount: state.litMirrorIds.length,
    totalMirrorCount: spec.mirrors.length,
    payoffVisible: connected && isCorrectQuestionSelected(spec, state)
  };
}

export function checkTrustLightPathAnswer(
  spec: TrustLightPathSpec,
  state: TrustLightPathState
): TrustLightPathCheckResult {
  if (!isCorrectQuestionSelected(spec, state)) {
    const nextState = {
      ...cloneState(state),
      solved: false,
      feedback: spec.wrongQuestionText
    };

    return {
      state: nextState,
      solved: false,
      feedback: spec.wrongQuestionText,
      reason: "needs-question"
    };
  }

  if (!isLightPathConnected(spec, state)) {
    const nextState = {
      ...cloneState(state),
      solved: false,
      feedback: spec.incompleteText
    };

    return {
      state: nextState,
      solved: false,
      feedback: spec.incompleteText,
      reason: "incomplete"
    };
  }

  const feedback = getPuzzleSuccessFeedback(spec);
  const nextState = {
    ...cloneState(state),
    solved: true,
    feedback
  };

  return {
    state: nextState,
    solved: true,
    feedback,
    reason: "correct"
  };
}

export function getLitMirrorIds(
  spec: TrustLightPathSpec,
  mirrorRotations: Record<string, TrustMirrorRotation>
): string[] {
  const litMirrorIds: string[] = [];
  let row = spec.source.row + DIRECTION_OFFSETS[spec.source.direction].row;
  let col = spec.source.col + DIRECTION_OFFSETS[spec.source.direction].col;
  let incomingDirection = OPPOSITE_DIRECTION[spec.source.direction];
  const visited = new Set<string>();

  while (true) {
    const mirror = getMirrorAt(spec, row, col);
    if (!mirror || visited.has(mirror.id)) {
      return litMirrorIds;
    }

    const connections = getMirrorConnections(mirror, mirrorRotations[mirror.id] ?? mirror.initialRotation);
    if (!connections.includes(incomingDirection)) {
      return litMirrorIds;
    }

    litMirrorIds.push(mirror.id);
    visited.add(mirror.id);

    const outgoingDirection = connections.find((direction) => direction !== incomingDirection);
    if (!outgoingDirection) {
      return litMirrorIds;
    }

    row += DIRECTION_OFFSETS[outgoingDirection].row;
    col += DIRECTION_OFFSETS[outgoingDirection].col;
    incomingDirection = OPPOSITE_DIRECTION[outgoingDirection];

    if (row === spec.target.row && col === spec.target.col) {
      return incomingDirection === spec.target.direction ? litMirrorIds : [];
    }
  }
}

export function getTrustMirror(spec: TrustLightPathSpec, mirrorId: string): TrustMirrorSpec | undefined {
  return spec.mirrors.find((mirror) => mirror.id === mirrorId);
}

function reachesTarget(
  spec: TrustLightPathSpec,
  mirrorRotations: Record<string, TrustMirrorRotation>
): boolean {
  const litMirrorIds = getLitMirrorIds(spec, mirrorRotations);
  return litMirrorIds.length === spec.mirrors.length;
}

function getMirrorAt(spec: TrustLightPathSpec, row: number, col: number): TrustMirrorSpec | undefined {
  return spec.mirrors.find((mirror) => mirror.row === row && mirror.col === col);
}

function rotateDirection(direction: TrustLightDirection, rotationSteps: number): TrustLightDirection {
  const index = DIRECTIONS.indexOf(direction);
  return DIRECTIONS[(index + rotationSteps) % DIRECTIONS.length];
}

function nextRotation(rotation: TrustMirrorRotation): TrustMirrorRotation {
  if (rotation === 0) {
    return 90;
  }

  if (rotation === 90) {
    return 180;
  }

  if (rotation === 180) {
    return 270;
  }

  return 0;
}

function cloneState(state: TrustLightPathState): TrustLightPathState {
  return {
    selectedQuestionId: state.selectedQuestionId,
    mirrorRotations: { ...state.mirrorRotations },
    litMirrorIds: [...state.litMirrorIds],
    solved: state.solved,
    feedback: state.feedback
  };
}
