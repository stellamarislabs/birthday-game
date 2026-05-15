import type {
  VisualNovelBackgroundVariant,
  VisualNovelLine,
  VisualNovelPortraitKey,
  VisualNovelPortraitSide,
  VisualNovelSceneSpec
} from "../../types/VisualNovel";

export interface VisualNovelPortraitPresentation {
  speakerId: string;
  label: string;
  portraitKey: VisualNovelPortraitKey;
  monogram: string;
  side: VisualNovelPortraitSide;
  description: string;
}

const defaultPortrait: VisualNovelPortraitPresentation = {
  speakerId: "default",
  label: "Unknown",
  portraitKey: "default",
  monogram: "?",
  side: "center",
  description: "Default case-file portrait placeholder"
};

const portraitBySpeaker = new Map<string, VisualNovelPortraitPresentation>([
  [
    "maria",
    {
      speakerId: "maria",
      label: "Maria",
      portraitKey: "maria",
      monogram: "M",
      side: "left",
      description: "Rose and gold Maria monogram placeholder"
    }
  ],
  [
    "case-file",
    {
      speakerId: "case-file",
      label: "Case File",
      portraitKey: "case-file",
      monogram: "F",
      side: "right",
      description: "Legal seal and case-file placeholder"
    }
  ],
  [
    "narrator",
    {
      speakerId: "narrator",
      label: "Narrator",
      portraitKey: "narrator",
      monogram: "N",
      side: "center",
      description: "Quiet narrator mark placeholder"
    }
  ],
  [
    "secret-client",
    {
      speakerId: "secret-client",
      label: "Secret Client",
      portraitKey: "secret-client",
      monogram: "?",
      side: "right",
      description: "Anonymous dark-gold seal placeholder"
    }
  ]
]);

const levelBackgroundVariants = new Map<number, VisualNovelBackgroundVariant>([
  [1, "kancelaria"],
  [2, "tram-night"],
  [3, "rebuilt-street"],
  [4, "vistula"],
  [5, "archive"],
  [6, "courthouse"],
  [7, "garden"],
  [8, "argument-tower"],
  [9, "rooftops"],
  [10, "court-heart"]
]);

const validBackgroundVariants = new Set<VisualNovelBackgroundVariant>([
  "default-case-file",
  "kancelaria",
  "tram-night",
  "rebuilt-street",
  "vistula",
  "archive",
  "courthouse",
  "garden",
  "argument-tower",
  "rooftops",
  "court-heart"
]);

export function getVisualNovelPortrait(line: VisualNovelLine): VisualNovelPortraitPresentation {
  const requestedSpeakerId = normalizeSpeakerId(line.speakerId ?? line.speaker);
  const base = portraitBySpeaker.get(requestedSpeakerId) ?? defaultPortrait;

  return {
    ...base,
    label: line.speaker || base.label,
    portraitKey: line.portraitKey ?? base.portraitKey,
    side: line.side ?? base.side
  };
}

export function getVisualNovelBackgroundVariant(spec: Pick<VisualNovelSceneSpec, "backgroundVariant" | "backgroundKey" | "levelId">): VisualNovelBackgroundVariant {
  if (spec.backgroundVariant) {
    return spec.backgroundVariant;
  }

  if (spec.backgroundKey && validBackgroundVariants.has(spec.backgroundKey as VisualNovelBackgroundVariant)) {
    return spec.backgroundKey as VisualNovelBackgroundVariant;
  }

  return (spec.levelId ? levelBackgroundVariants.get(spec.levelId) : undefined) ?? "default-case-file";
}

export function getVisualNovelBackgroundVariantForLevel(levelId: number): VisualNovelBackgroundVariant {
  return levelBackgroundVariants.get(levelId) ?? "default-case-file";
}

export function getKnownVisualNovelBackgroundVariants(): VisualNovelBackgroundVariant[] {
  return Array.from(validBackgroundVariants);
}

export function normalizeSpeakerId(speaker: string): string {
  return speaker.trim().toLowerCase().replace(/\s+/g, "-");
}
