export type ArgumentBuilderChoiceId = "coincidence" | "repeated-actions" | "impossible";

export interface ArgumentBuilderChoice {
  id: ArgumentBuilderChoiceId;
  label: "A" | "B" | "C";
  text: string;
}

export interface ArgumentBuilderState {
  promptText: string;
  choices: ArgumentBuilderChoice[];
  selectedArgumentId: ArgumentBuilderChoiceId | null;
  solved: boolean;
  attempts: number;
}

export interface ArgumentBuilderResult {
  solved: boolean;
  feedback: string;
}
