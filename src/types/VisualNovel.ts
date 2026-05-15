export type VisualNovelPlacement = "before-platformer" | "before-puzzle" | "after-puzzle" | "before-final-verdict";

export type VisualNovelBackgroundVariant =
  | "default-case-file"
  | "kancelaria"
  | "tram-night"
  | "rebuilt-street"
  | "vistula"
  | "archive"
  | "courthouse"
  | "garden"
  | "argument-tower"
  | "rooftops"
  | "court-heart";

export type VisualNovelPortraitKey = "maria" | "case-file" | "narrator" | "secret-client" | "default";

export type VisualNovelPortraitSide = "left" | "right" | "center";

export interface VisualNovelSceneTarget {
  scene: string;
  data?: Record<string, unknown>;
}

export interface VisualNovelLine {
  speaker: string;
  text: string;
  speakerId?: string;
  portraitKey?: VisualNovelPortraitKey;
  side?: VisualNovelPortraitSide;
  emotion?: string;
  emphasis?: string;
}

export interface VisualNovelSceneSpec {
  id: string;
  levelId?: number;
  chapterId?: number;
  placement: VisualNovelPlacement;
  title?: string;
  backgroundVariant?: VisualNovelBackgroundVariant;
  backgroundKey?: string;
  characters?: string[];
  lines: VisualNovelLine[];
  nextScene: VisualNovelSceneTarget;
  skipScene?: VisualNovelSceneTarget;
}
