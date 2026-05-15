export const UI_ICON_KEYS = [
  "scales",
  "case-file",
  "folder",
  "settings",
  "reset",
  "heart",
  "key",
  "envelope",
  "stamp",
  "brick",
  "witness-note",
  "marginal-note",
  "lantern",
  "ribbon",
  "letter",
  "final-seal",
  "lock",
  "check",
  "play",
  "sound",
  "mute",
  "reduce-motion",
  "credits-book",
  "speaker",
  "narrator",
  "secret-client"
] as const;

export type UiIconKey = (typeof UI_ICON_KEYS)[number];

const UI_ICON_KEY_SET = new Set<string>(UI_ICON_KEYS);

export const EXHIBIT_ICON_BY_LEVEL_ID: Record<number, UiIconKey> = {
  1: "envelope",
  2: "stamp",
  3: "brick",
  4: "witness-note",
  5: "marginal-note",
  6: "key",
  7: "lantern",
  8: "ribbon",
  9: "letter",
  10: "heart"
};

export function isUiIconKey(value: string): value is UiIconKey {
  return UI_ICON_KEY_SET.has(value);
}

export function getExhibitIconKey(levelId: number): UiIconKey {
  return EXHIBIT_ICON_BY_LEVEL_ID[levelId] ?? "case-file";
}

export function getStatusIconKey(status: string): UiIconKey {
  if (status === "completed") {
    return "check";
  }

  if (status === "playable") {
    return "play";
  }

  return "lock";
}

export function getSpeakerIconKey(speakerId: string): UiIconKey {
  if (speakerId === "maria") {
    return "heart";
  }

  if (speakerId === "case-file") {
    return "case-file";
  }

  if (speakerId === "narrator") {
    return "narrator";
  }

  if (speakerId === "secret-client") {
    return "secret-client";
  }

  return "speaker";
}

export function renderUiIcon(key: UiIconKey, extraClass = ""): string {
  const className = ["ui-icon", `ui-icon--${key}`, extraClass].filter(Boolean).join(" ");
  return `<span class="${className}" data-icon="${key}" aria-hidden="true"></span>`;
}
