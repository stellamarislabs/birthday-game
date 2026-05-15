import type {
  ContradictionResult,
  ContradictionState,
  ContradictionStatement,
  ContradictionStatementId
} from "./contradictionTypes";

export const CONTRADICTION_EVIDENCE_TEXT =
  "The witness note says the heart was not taken by force. It was left willingly.";

export const CONTRADICTION_STATEMENTS: readonly ContradictionStatement[] = [
  {
    id: "taken-by-force",
    label: "A",
    text: "The heart was taken by force."
  },
  {
    id: "left-willingly",
    label: "B",
    text: "The heart was left willingly."
  },
  {
    id: "never-real",
    label: "C",
    text: "The heart was never real."
  }
] as const;

export const CORRECT_CONTRADICTION_STATEMENT_ID: ContradictionStatementId = "taken-by-force";

export const CONTRADICTION_COPY = {
  title: "Case Review: The Witness Note",
  instruction: "Read the witness note and identify the statement that contradicts the evidence.",
  submit: "Submit Finding",
  reset: "Clear Selection",
  wrong: "Look again. The quiet truth is already in the note.",
  success: "Contradiction found.",
  reveal: "Maria hears the quiet version of truth.",
  followUp: "She does not need the loudest voice. She follows the clearest evidence."
} as const;

export function createContradictionState(): ContradictionState {
  return {
    evidenceText: CONTRADICTION_EVIDENCE_TEXT,
    statements: CONTRADICTION_STATEMENTS.map((statement) => ({ ...statement })),
    selectedStatementId: null,
    solved: false,
    attempts: 0
  };
}

export function selectContradictionStatement(
  state: ContradictionState,
  statementId: ContradictionStatementId | null
): ContradictionState {
  if (statementId && !state.statements.some((statement) => statement.id === statementId)) {
    return cloneState(state);
  }

  return {
    ...cloneState(state),
    selectedStatementId: statementId,
    solved: false
  };
}

export function resetContradictionState(): ContradictionState {
  return createContradictionState();
}

export function isContradictionCorrect(state: Pick<ContradictionState, "selectedStatementId">): boolean {
  return state.selectedStatementId === CORRECT_CONTRADICTION_STATEMENT_ID;
}

export function submitContradiction(state: ContradictionState): {
  state: ContradictionState;
  result: ContradictionResult;
} {
  const solved = isContradictionCorrect(state);
  const nextState = {
    ...cloneState(state),
    solved,
    attempts: state.attempts + 1
  };

  return {
    state: nextState,
    result: {
      solved,
      feedback: solved ? CONTRADICTION_COPY.success : CONTRADICTION_COPY.wrong
    }
  };
}

function cloneState(state: ContradictionState): ContradictionState {
  return {
    evidenceText: state.evidenceText,
    statements: state.statements.map((statement) => ({ ...statement })),
    selectedStatementId: state.selectedStatementId,
    solved: state.solved,
    attempts: state.attempts
  };
}
