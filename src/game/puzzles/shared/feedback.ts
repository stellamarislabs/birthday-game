export interface PuzzleSuccessCopy {
  successText: string;
  successFollowUp?: string;
}

export function getPuzzleSuccessFeedback(spec: PuzzleSuccessCopy): string {
  return spec.successFollowUp ? `${spec.successText}\n${spec.successFollowUp}` : spec.successText;
}
