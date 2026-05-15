import type {
  EvidenceLinkingExhibit,
  EvidenceLinkingExhibitId,
  EvidenceLinkingMeaning,
  EvidenceLinkingMeaningId,
  EvidenceLinkingResult,
  EvidenceLinkingState
} from "./evidenceLinkingTypes";

export const EVIDENCE_LINKING_EXHIBITS: readonly EvidenceLinkingExhibit[] = [
  { id: "sealed-envelope", text: "The Sealed Envelope" },
  { id: "golden-stamp", text: "The Golden Stamp" },
  { id: "red-brick", text: "The Red Brick" },
  { id: "witness-note", text: "The Witness Note" },
  { id: "lantern", text: "The Lantern" },
  { id: "blue-ribbon", text: "The Blue Ribbon" }
] as const;

export const EVIDENCE_LINKING_MEANINGS: readonly EvidenceLinkingMeaning[] = [
  { id: "attention", label: "A", text: "Attention" },
  { id: "responsibility", label: "B", text: "Responsibility" },
  { id: "patience", label: "C", text: "Patience" },
  { id: "truth", label: "D", text: "Truth" },
  { id: "warmth", label: "E", text: "Warmth" },
  { id: "lived-promise", label: "F", text: "A promise lived through actions" }
] as const;

export const CORRECT_EVIDENCE_LINKS: Record<EvidenceLinkingExhibitId, EvidenceLinkingMeaningId> = {
  "sealed-envelope": "attention",
  "golden-stamp": "responsibility",
  "red-brick": "patience",
  "witness-note": "truth",
  lantern: "warmth",
  "blue-ribbon": "lived-promise"
};

export const EVIDENCE_LINKING_COPY = {
  title: "Case Review: The Unfinished Letter",
  kicker: "Evidence linking",
  instruction: "Link each clue to what it quietly proved.",
  submit: "Submit Links",
  reset: "Reset Links",
  wrong: "One link feels uncertain. Review the clues again.",
  success: "The case begins to make sense.",
  reveal: "Every clue points to the same conclusion: Maria is deeply loved for who she is.",
  followUp: "Not because of one perfect moment, but because of every small truth the case has carried."
} as const;

export function createEvidenceLinkingState(): EvidenceLinkingState {
  return {
    exhibits: EVIDENCE_LINKING_EXHIBITS.map((exhibit) => ({ ...exhibit })),
    meanings: EVIDENCE_LINKING_MEANINGS.map((meaning) => ({ ...meaning })),
    selectedExhibitId: null,
    links: {},
    solved: false,
    attempts: 0
  };
}

export function selectEvidenceLinkingExhibit(
  state: EvidenceLinkingState,
  exhibitId: EvidenceLinkingExhibitId | null
): EvidenceLinkingState {
  if (exhibitId && !state.exhibits.some((exhibit) => exhibit.id === exhibitId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedExhibitId: exhibitId,
    solved: false
  };
}

export function linkSelectedExhibitToMeaning(
  state: EvidenceLinkingState,
  meaningId: EvidenceLinkingMeaningId
): EvidenceLinkingState {
  if (!state.selectedExhibitId || !state.meanings.some((meaning) => meaning.id === meaningId)) {
    return cloneState(state);
  }

  const links = { ...state.links };
  for (const [linkedExhibitId, linkedMeaningId] of Object.entries(links)) {
    if (linkedMeaningId === meaningId && linkedExhibitId !== state.selectedExhibitId) {
      delete links[linkedExhibitId as EvidenceLinkingExhibitId];
    }
  }
  links[state.selectedExhibitId] = meaningId;

  return {
    ...cloneState(state),
    selectedExhibitId: null,
    links,
    solved: false
  };
}

export function unlinkEvidenceLinkingExhibit(
  state: EvidenceLinkingState,
  exhibitId: EvidenceLinkingExhibitId
): EvidenceLinkingState {
  const links = { ...state.links };
  delete links[exhibitId];

  return {
    ...cloneState(state),
    links,
    selectedExhibitId: state.selectedExhibitId === exhibitId ? null : state.selectedExhibitId,
    solved: false
  };
}

export function resetEvidenceLinkingState(): EvidenceLinkingState {
  return createEvidenceLinkingState();
}

export function isEvidenceLinkingCorrect(state: Pick<EvidenceLinkingState, "links">): boolean {
  return Object.entries(CORRECT_EVIDENCE_LINKS).every(
    ([exhibitId, meaningId]) => state.links[exhibitId as EvidenceLinkingExhibitId] === meaningId
  );
}

export function submitEvidenceLinking(state: EvidenceLinkingState): {
  state: EvidenceLinkingState;
  result: EvidenceLinkingResult;
} {
  const solved = isEvidenceLinkingCorrect(state);
  const nextState = {
    ...cloneState(state),
    solved,
    attempts: state.attempts + 1
  };

  return {
    state: nextState,
    result: {
      solved,
      feedback: solved ? EVIDENCE_LINKING_COPY.success : EVIDENCE_LINKING_COPY.wrong
    }
  };
}

function cloneState(state: EvidenceLinkingState): EvidenceLinkingState {
  return {
    exhibits: state.exhibits.map((exhibit) => ({ ...exhibit })),
    meanings: state.meanings.map((meaning) => ({ ...meaning })),
    selectedExhibitId: state.selectedExhibitId,
    links: { ...state.links },
    solved: state.solved,
    attempts: state.attempts
  };
}
