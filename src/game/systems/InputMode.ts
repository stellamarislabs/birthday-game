export type InputMode = "keyboard" | "touch" | "pointer";

export function detectInputMode(): InputMode {
  if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) {
    return "touch";
  }

  return "keyboard";
}
