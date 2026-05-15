import type { LanternSwitchSpec } from "./levelGeometry";

export interface LanternSwitchState {
  activeLanternIds: string[];
  revealedGroupIds: string[];
}

export interface LanternActivationResult {
  state: LanternSwitchState;
  activated: boolean;
  revealedGroupId: string | null;
  feedbackMessage: string | null;
}

export function createLanternSwitchState(): LanternSwitchState {
  return {
    activeLanternIds: [],
    revealedGroupIds: []
  };
}

export function activateLanternSwitch(
  state: LanternSwitchState,
  lanternId: string,
  lanterns: readonly LanternSwitchSpec[]
): LanternActivationResult {
  const lantern = lanterns.find((candidate) => candidate.id === lanternId);
  if (!lantern) {
    return {
      state: cloneState(state),
      activated: false,
      revealedGroupId: null,
      feedbackMessage: null
    };
  }

  if (state.activeLanternIds.includes(lanternId)) {
    return {
      state: cloneState(state),
      activated: false,
      revealedGroupId: lantern.revealGroupId,
      feedbackMessage: null
    };
  }

  return {
    state: {
      activeLanternIds: unique([...state.activeLanternIds, lanternId]),
      revealedGroupIds: unique([...state.revealedGroupIds, lantern.revealGroupId])
    },
    activated: true,
    revealedGroupId: lantern.revealGroupId,
    feedbackMessage: lantern.feedbackMessage
  };
}

export function isLightRevealGroupActive(state: LanternSwitchState, groupId: string): boolean {
  return state.revealedGroupIds.includes(groupId);
}

function cloneState(state: LanternSwitchState): LanternSwitchState {
  return {
    activeLanternIds: [...state.activeLanternIds],
    revealedGroupIds: [...state.revealedGroupIds]
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
