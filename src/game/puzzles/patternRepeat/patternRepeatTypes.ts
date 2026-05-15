export type PatternRepeatLanternId = "north" | "east" | "south" | "west";

export interface PatternRepeatLantern {
  id: PatternRepeatLanternId;
  label: string;
}

export interface PatternRepeatState {
  lanterns: PatternRepeatLantern[];
  targetSequence: PatternRepeatLanternId[];
  inputSequence: PatternRepeatLanternId[];
  sequenceVisible: boolean;
  solved: boolean;
  feedback: string;
}

