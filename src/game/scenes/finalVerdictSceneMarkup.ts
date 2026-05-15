import { storyContent } from "../../content/story";
import { renderUiIcon } from "../../ui/icons";
import type { FinalVerdictFinalAsset } from "../assets/finalVerdictAssets";

export function createFinalVerdictDocumentMarkup(finalAsset: FinalVerdictFinalAsset): string {
  if (finalAsset.imageUrl) {
    return `
      <section class="final-verdict-image-panel" aria-label="Final verdict" data-testid="final-verdict-image-panel">
        <img class="final-verdict-image" src="${escapeAttribute(finalAsset.imageUrl)}" alt="Final verdict" data-testid="final-verdict-image" />
        <div class="menu-actions final-verdict-image-actions">
          <button type="button" class="primary-button final-verdict-accept-button" data-testid="accept-verdict">${renderUiIcon("final-seal")}${storyContent.ui.acceptVerdict}</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="menu-panel final-verdict-panel final-verdict-panel--document" aria-label="Final verdict">
      <div class="final-verdict-seal-mark" aria-hidden="true">
        <span></span>
      </div>
      <p class="menu-kicker">Final verdict</p>
      <pre class="final-verdict-text" data-testid="final-verdict-text">${escapeHtml(storyContent.finalVerdict)}</pre>
      <div class="menu-actions">
        <button type="button" class="primary-button" data-testid="accept-verdict">${renderUiIcon("final-seal")}${storyContent.ui.acceptVerdict}</button>
      </div>
    </section>
  `;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
