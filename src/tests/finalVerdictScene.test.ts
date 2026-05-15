import { describe, expect, it } from "vitest";
import {
  FINAL_VERDICT_FINAL_ASSET_FILENAME,
  getFinalVerdictFinalAsset
} from "../game/assets/finalVerdictAssets";
import { createFinalVerdictDocumentMarkup } from "../game/scenes/finalVerdictSceneMarkup";
import { storyContent } from "../content/story";

describe("FinalVerdictScene image-backed verdict support", () => {
  it("maps the optional final verdict image asset without requiring it", () => {
    expect(FINAL_VERDICT_FINAL_ASSET_FILENAME).toBe("FinalVerdict01.webp");

    expect(getFinalVerdictFinalAsset({})).toEqual({
      filename: "FinalVerdict01.webp",
      imageUrl: undefined
    });

    expect(
      getFinalVerdictFinalAsset({
        "../../assets/final/finalVerdict/FinalVerdict01.webp": "/assets/FinalVerdict01.fake.webp"
      })
    ).toEqual({
      filename: "FinalVerdict01.webp",
      imageUrl: "/assets/FinalVerdict01.fake.webp"
    });
  });

  it("detects the checked-in final verdict image when it is present", () => {
    const asset = getFinalVerdictFinalAsset();

    expect(asset.filename).toBe("FinalVerdict01.webp");
    expect(asset.imageUrl).toMatch(/FinalVerdict01.*\.webp/);
  });

  it("keeps the code-rendered verdict as the missing-asset fallback", () => {
    const markup = createFinalVerdictDocumentMarkup({ filename: "FinalVerdict01.webp" });

    expect(markup).toContain('data-testid="final-verdict-text"');
    expect(markup).toContain("the Court finds Maria not guilty of stealing it.");
    expect(markup).toContain('data-testid="accept-verdict"');
    expect(markup).not.toContain('data-testid="final-verdict-image"');
  });

  it("uses image-backed verdict markup without duplicate runtime verdict text when the asset exists", () => {
    const markup = createFinalVerdictDocumentMarkup({
      filename: "FinalVerdict01.webp",
      imageUrl: "/assets/FinalVerdict01.fake.webp"
    });

    expect(markup).toContain('data-testid="final-verdict-image-panel"');
    expect(markup).toContain('data-testid="final-verdict-image"');
    expect(markup).toContain('src="/assets/FinalVerdict01.fake.webp"');
    expect(markup).toContain('data-testid="accept-verdict"');
    expect(markup).toContain("final-verdict-image-actions");
    expect(markup).toContain("final-verdict-accept-button");
    expect(markup).not.toContain('data-testid="final-verdict-text"');
    expect(markup).not.toContain("the Court finds Maria not guilty of stealing it.");
  });

  it("leaves the protected final verdict text source unchanged", () => {
    expect(storyContent.finalVerdict).toBe(`VERDICT

In the matter of Maria v. The Missing Heart,
the Court finds Maria not guilty of stealing it.

The evidence shows that the heart was given freely,
intentionally, and with full awareness of the consequences.

Sentence:
endless birthdays, brave days, quiet mornings, ridiculous jokes,
and one person who will keep choosing you.

Happy birthday, Maria.
I love you.`);
  });
});
