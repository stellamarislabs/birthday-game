export interface ArchiveGateState {
  collectedKeyIds: string[];
  openedDoorIds: string[];
}

export function createArchiveGateState(): ArchiveGateState {
  return {
    collectedKeyIds: [],
    openedDoorIds: []
  };
}

export function collectArchiveKey(
  state: ArchiveGateState,
  keyId: string,
  doors: Array<{ id: string; requiresKeyId: string }>
): ArchiveGateState {
  const collectedKeyIds = unique([...state.collectedKeyIds, keyId]);
  const openedDoorIds = unique([
    ...state.openedDoorIds,
    ...doors.filter((door) => door.requiresKeyId === keyId).map((door) => door.id)
  ]);

  return {
    collectedKeyIds,
    openedDoorIds
  };
}

export function isArchiveDoorOpen(state: ArchiveGateState, doorId: string): boolean {
  return state.openedDoorIds.includes(doorId);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
