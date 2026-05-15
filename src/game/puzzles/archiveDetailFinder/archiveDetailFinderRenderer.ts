import {
  isDetailDiscovered,
  isDetailMarked
} from "./archiveDetailFinderLogic";
import type { ArchiveDetail, ArchiveDetailState } from "./archiveDetailFinderTypes";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getDetailStateClass(state: ArchiveDetailState, detail: ArchiveDetail): string {
  const classes: string[] = [];

  if (isDetailDiscovered(state, detail.id)) {
    classes.push("is-discovered");
  }

  if (isDetailMarked(state, detail.id)) {
    classes.push("is-marked");
  }

  return classes.length > 0 ? ` ${classes.join(" ")}` : "";
}
