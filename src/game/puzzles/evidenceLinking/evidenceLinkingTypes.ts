export type EvidenceLinkingExhibitId =
  | "sealed-envelope"
  | "golden-stamp"
  | "red-brick"
  | "witness-note"
  | "lantern"
  | "blue-ribbon";

export type EvidenceLinkingMeaningId = "attention" | "responsibility" | "patience" | "truth" | "warmth" | "lived-promise";

export interface EvidenceLinkingExhibit {
  id: EvidenceLinkingExhibitId;
  text: string;
}

export interface EvidenceLinkingMeaning {
  id: EvidenceLinkingMeaningId;
  label: string;
  text: string;
}

export type EvidenceLinkingLinks = Partial<Record<EvidenceLinkingExhibitId, EvidenceLinkingMeaningId>>;

export interface EvidenceLinkingState {
  exhibits: EvidenceLinkingExhibit[];
  meanings: EvidenceLinkingMeaning[];
  selectedExhibitId: EvidenceLinkingExhibitId | null;
  links: EvidenceLinkingLinks;
  solved: boolean;
  attempts: number;
}

export interface EvidenceLinkingResult {
  solved: boolean;
  feedback: string;
}
