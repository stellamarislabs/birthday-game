export type CrossExaminationChoiceId = "who-benefits" | "what-remains" | "receipt";

export interface CrossExaminationChoice {
  id: CrossExaminationChoiceId;
  label: "A" | "B" | "C";
  text: string;
}

export interface CrossExaminationState {
  promptText: string;
  choices: CrossExaminationChoice[];
  selectedChoiceId: CrossExaminationChoiceId | null;
  solved: boolean;
  attempts: number;
}

export interface CrossExaminationResult {
  solved: boolean;
  feedback: string;
}
