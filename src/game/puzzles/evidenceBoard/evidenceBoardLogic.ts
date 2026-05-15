import type {
  EvidenceBoardCheckResult,
  EvidenceBoardSpec,
  EvidenceBoardState
} from "./evidenceBoardTypes";

export function createInitialEvidenceBoardState(_spec: EvidenceBoardSpec): EvidenceBoardState {
  return {
    selectedEvidenceId: null,
    links: {},
    conclusionChoiceId: null,
    solved: false,
    feedback: ""
  };
}

export function selectEvidence(
  spec: EvidenceBoardSpec,
  state: EvidenceBoardState,
  evidenceId: string
): EvidenceBoardState {
  if (!spec.evidenceCards.some((card) => card.id === evidenceId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedEvidenceId: evidenceId,
    solved: false,
    feedback: ""
  };
}

export function linkSelectedEvidenceToMeaning(
  spec: EvidenceBoardSpec,
  state: EvidenceBoardState,
  meaningId: string
): EvidenceBoardState {
  if (!state.selectedEvidenceId || !spec.meaningCards.some((card) => card.id === meaningId)) {
    return cloneState(state);
  }

  const links = { ...state.links };
  if (spec.allowDuplicateMeanings !== true) {
    for (const [evidenceId, linkedMeaningId] of Object.entries(links)) {
      if (linkedMeaningId === meaningId && evidenceId !== state.selectedEvidenceId) {
        delete links[evidenceId];
      }
    }
  }

  links[state.selectedEvidenceId] = meaningId;

  return {
    ...cloneState(state),
    selectedEvidenceId: null,
    links,
    solved: false,
    feedback: ""
  };
}

export function unlinkEvidence(_spec: EvidenceBoardSpec, state: EvidenceBoardState, evidenceId: string): EvidenceBoardState {
  const links = { ...state.links };
  delete links[evidenceId];

  return {
    ...cloneState(state),
    selectedEvidenceId: state.selectedEvidenceId === evidenceId ? null : state.selectedEvidenceId,
    links,
    solved: false,
    feedback: ""
  };
}

export function selectConclusionChoice(
  spec: EvidenceBoardSpec,
  state: EvidenceBoardState,
  choiceId: string
): EvidenceBoardState {
  if (!spec.conclusionQuestion?.choices.some((choice) => choice.id === choiceId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    conclusionChoiceId: choiceId,
    solved: false,
    feedback: ""
  };
}

export function checkEvidenceBoardAnswer(
  spec: EvidenceBoardSpec,
  state: EvidenceBoardState
): EvidenceBoardCheckResult {
  if (!isEvidenceBoardComplete(spec, state)) {
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

  if (!linksAreCorrect(spec, state) || !conclusionIsCorrect(spec, state)) {
    const feedback = spec.conclusionQuestion?.wrongText ?? spec.wrongText;
    const nextState = {
      ...cloneState(state),
      solved: false,
      feedback
    };

    return {
      state: nextState,
      solved: false,
      feedback,
      reason: "wrong"
    };
  }

  const feedback = spec.conclusionQuestion?.successText ?? spec.successText;
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

export function resetEvidenceBoard(spec: EvidenceBoardSpec): EvidenceBoardState {
  return createInitialEvidenceBoardState(spec);
}

export function isEvidenceBoardComplete(spec: EvidenceBoardSpec, state: EvidenceBoardState): boolean {
  const allLinksPresent = spec.correctLinks.every((link) => state.links[link.evidenceId] !== undefined);
  const conclusionComplete = spec.conclusionQuestion ? state.conclusionChoiceId !== null : true;

  return allLinksPresent && conclusionComplete;
}

export function isEvidenceBoardSolved(spec: EvidenceBoardSpec, state: EvidenceBoardState): boolean {
  return isEvidenceBoardComplete(spec, state) && linksAreCorrect(spec, state) && conclusionIsCorrect(spec, state);
}

function linksAreCorrect(spec: EvidenceBoardSpec, state: EvidenceBoardState): boolean {
  return spec.correctLinks.every((link) => state.links[link.evidenceId] === link.meaningId);
}

function conclusionIsCorrect(spec: EvidenceBoardSpec, state: EvidenceBoardState): boolean {
  if (!spec.conclusionQuestion) {
    return true;
  }

  return state.conclusionChoiceId === spec.conclusionQuestion.correctChoiceId;
}

function cloneState(state: EvidenceBoardState): EvidenceBoardState {
  return {
    selectedEvidenceId: state.selectedEvidenceId,
    links: { ...state.links },
    conclusionChoiceId: state.conclusionChoiceId,
    solved: state.solved,
    feedback: state.feedback
  };
}
