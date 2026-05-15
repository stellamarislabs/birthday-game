import { getExhibitStar, isNodeCorrect } from "./caseConstellationLogic";
import type { CaseConstellationSpec, CaseConstellationState } from "./caseConstellationTypes";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getPlacedStar(spec: CaseConstellationSpec, state: CaseConstellationState, nodeId: string) {
  const starId = state.placedStarsByNodeId[nodeId];
  return starId ? getExhibitStar(spec, starId) : undefined;
}

export function getNodeStateClass(spec: CaseConstellationSpec, state: CaseConstellationState, nodeId: string): string {
  const classes: string[] = [];
  if (state.placedStarsByNodeId[nodeId]) {
    classes.push("is-filled");
  }
  if (isNodeCorrect(spec, state, nodeId)) {
    classes.push("is-correct");
  } else if (state.placedStarsByNodeId[nodeId]) {
    classes.push("is-wrong");
  }
  return classes.length > 0 ? ` ${classes.join(" ")}` : "";
}
