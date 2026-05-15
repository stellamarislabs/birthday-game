import { isRingAligned } from "./finalVerdictAssemblyLogic";
import type { FinalSealRing, FinalVerdictAssemblySpec, FinalVerdictAssemblyState } from "./finalVerdictAssemblyTypes";

export const FINAL_SEAL_RING_CONTROL_LABELS: Record<string, string> = {
  outer: "⟳ Outer",
  middle: "⟳ Middle",
  inner: "⟳ Inner"
};

export const FINAL_SEAL_RING_CONTROL_ACCESSIBLE_LABELS: Record<string, string> = {
  outer: "Rotate outer ring",
  middle: "Rotate middle ring",
  inner: "Rotate inner ring"
};

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getRingStateClass(
  spec: FinalVerdictAssemblySpec,
  state: FinalVerdictAssemblyState,
  ring: FinalSealRing
): string {
  return isRingAligned(spec, state, ring.id) ? " is-aligned" : "";
}

export function getRingRotationStyle(state: FinalVerdictAssemblyState, ring: FinalSealRing): string {
  const rotation = state.ringRotationsById[ring.id] ?? ring.initialRotation;
  return `--ring-turn: ${rotation}deg;`;
}

export function getFinalSealRingControlLabel(ring: FinalSealRing): string {
  return FINAL_SEAL_RING_CONTROL_LABELS[ring.id] ?? `⟳ ${ring.label}`;
}

export function getFinalSealRingControlAriaLabel(ring: FinalSealRing): string {
  return FINAL_SEAL_RING_CONTROL_ACCESSIBLE_LABELS[ring.id] ?? `Rotate ${ring.label} ring`;
}
