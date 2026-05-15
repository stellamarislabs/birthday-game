export interface ChoiceDoorState {
  lastDoorId: string | null;
  lastResolvedAt: number;
}

export interface ChoiceDoorChoice {
  id: string;
  label: string;
  isCorrectPath: boolean;
  destination: {
    x: number;
    y: number;
  };
  feedbackMessage: string;
}

export interface ChoiceDoorResolution {
  doorId: string;
  label: string;
  isCorrectPath: boolean;
  destination: {
    x: number;
    y: number;
  };
  feedbackMessage: string;
}

export function createChoiceDoorState(): ChoiceDoorState {
  return {
    lastDoorId: null,
    lastResolvedAt: Number.NEGATIVE_INFINITY
  };
}

export function resolveChoiceDoor(
  doors: ChoiceDoorChoice[],
  doorId: string,
  now: number,
  state: ChoiceDoorState,
  cooldownMs = 650
): { state: ChoiceDoorState; resolution: ChoiceDoorResolution | null } {
  if (state.lastDoorId === doorId && now - state.lastResolvedAt < cooldownMs) {
    return { state: { ...state }, resolution: null };
  }

  const door = doors.find((candidate) => candidate.id === doorId);
  if (!door) {
    return { state: { ...state }, resolution: null };
  }

  return {
    state: {
      lastDoorId: doorId,
      lastResolvedAt: now
    },
    resolution: {
      doorId: door.id,
      label: door.label,
      isCorrectPath: door.isCorrectPath,
      destination: { ...door.destination },
      feedbackMessage: door.feedbackMessage
    }
  };
}
