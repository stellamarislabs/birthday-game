import type { EvidenceBoardCard, EvidenceBoardSpec, EvidenceBoardState } from "./evidenceBoardTypes";

export function getCardDescription(card: EvidenceBoardCard): string {
  return card.description ? `<span>${escapeHtml(card.description)}</span>` : "";
}

export function getLinkedMeaningLabel(spec: EvidenceBoardSpec, state: EvidenceBoardState, evidenceId: string): string {
  const meaningId = state.links[evidenceId];

  return meaningId ? spec.meaningCards.find((card) => card.id === meaningId)?.label ?? meaningId : "";
}

export function getEvidenceLinkedToMeaningLabel(
  spec: EvidenceBoardSpec,
  state: EvidenceBoardState,
  meaningId: string
): string {
  const linkedEvidenceId = Object.entries(state.links).find(([, linkedMeaningId]) => linkedMeaningId === meaningId)?.[0];

  return linkedEvidenceId ? spec.evidenceCards.find((card) => card.id === linkedEvidenceId)?.label ?? linkedEvidenceId : "";
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
