export type ContradictionStatementId = "taken-by-force" | "left-willingly" | "never-real";

export interface ContradictionStatement {
  id: ContradictionStatementId;
  label: "A" | "B" | "C";
  text: string;
}

export interface ContradictionState {
  evidenceText: string;
  statements: ContradictionStatement[];
  selectedStatementId: ContradictionStatementId | null;
  solved: boolean;
  attempts: number;
}

export interface ContradictionResult {
  solved: boolean;
  feedback: string;
}
