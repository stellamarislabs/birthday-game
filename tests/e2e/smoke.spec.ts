import { expect, test } from "@playwright/test";

async function clickViewportCenter(page: import("@playwright/test").Page): Promise<void> {
  const viewport = page.viewportSize() ?? { width: 1280, height: 720 };
  await page.mouse.click(viewport.width / 2, viewport.height / 2);
}

async function continueVisualNovel(page: import("@playwright/test").Page): Promise<void> {
  const imageBackedPage = page.locator('[data-testid="vn-image-backed-page"]');
  if ((await imageBackedPage.count()) > 0) {
    const scene = page.locator('[data-testid="visual-novel-scene"]');
    const totalPages = Number((await scene.getAttribute("data-page-count")) ?? "1");
    for (let index = 0; index < totalPages; index += 1) {
      await expect(imageBackedPage).toBeVisible();
      await clickViewportCenter(page);
    }
    return;
  }

  const counter = page.locator('[data-testid="vn-line-counter"]');
  await expect(counter).toBeVisible();
  const counterText = (await counter.textContent()) ?? "1 / 1";
  const totalLines = Number(counterText.split("/")[1]?.trim() ?? "1");

  for (let index = 0; index < totalLines; index += 1) {
    await page.locator('[data-testid="vn-continue"]').click({ force: true });
  }
}

async function expectImageBackedVisualNovel(page: import("@playwright/test").Page): Promise<void> {
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-image-backed", "true");
  await expect(page.locator('[data-testid="vn-image-backed-page"]')).toBeVisible();
  await expect(page.locator('[data-testid="vn-dialogue-card"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="vn-continue"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="vn-skip"]')).toHaveCount(0);
}

async function expectImageBackedFinalVerdict(page: import("@playwright/test").Page): Promise<void> {
  await expect(page.locator('[data-testid="final-verdict-overlay"]')).toBeVisible();
  await expect(page.locator('[data-testid="final-verdict-image-panel"]')).toBeVisible();
  await expect(page.locator('[data-testid="final-verdict-image"]')).toHaveAttribute("src", /FinalVerdict01.*\.webp/);
  await expect(page.locator('[data-testid="final-verdict-text"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="accept-verdict"]')).toBeVisible();
  await expect(page.locator('[data-testid="accept-verdict"]')).toBeInViewport();
}

async function revealTitleFromOpening(page: import("@playwright/test").Page): Promise<void> {
  await expect(page.locator('[data-testid="opening-start"]')).toBeVisible();
  await expect(page.locator('[data-testid="opening-start-title"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start the case" })).toBeVisible();
  await page.getByRole("button", { name: "Start the case" }).click();
  await expect(page.locator('[data-testid="opening-cinematic"]')).toBeVisible();
  await page.locator('[data-testid="opening-skip"]').click();
  await expect(page.locator('[data-testid="title-menu"]')).toBeVisible();
}

async function openTitleViaOpening(page: import("@playwright/test").Page, path = "/"): Promise<void> {
  await page.goto(path);
  await revealTitleFromOpening(page);
}

async function solveFinalVerdictAssembly(page: import("@playwright/test").Page): Promise<void> {
  await page.locator('[data-testid="submit-final-verdict-assembly"]').click();
  await expect(page.locator('[data-testid="final-verdict-assembly-feedback"]')).toContainText(
    "The seal is not complete yet.",
  );

  for (const [ringId, taps] of [
    ["outer", 1],
    ["middle", 2],
    ["inner", 3],
  ] as const) {
    await expect(page.locator(`[data-testid="final-seal-ring-control-${ringId}"]`)).toBeVisible();
    for (let index = 0; index < taps; index += 1) {
      if (ringId === "outer") {
        const ring = page.locator(`[data-testid="final-seal-ring-${ringId}"]`);
        const ringBox = await ring.boundingBox();
        expect(ringBox).not.toBeNull();
        await ring.click({
          position: {
            x: Math.max(8, (ringBox?.width ?? 80) - 14),
            y: (ringBox?.height ?? 80) / 2,
          },
        });
      } else {
        await page.locator(`[data-testid="final-seal-ring-control-${ringId}"]`).click();
      }
    }
  }

  await expect(page.locator('[data-testid="verdict-assembly-progress"]')).toContainText("All six clues point to the heart.");
  await expect(page.locator('[data-testid="final-seal-payoff"]')).toContainText("The verdict is ready.");
  await page.locator('[data-testid="submit-final-verdict-assembly"]').click();
}

async function solveTrustLightPath(page: import("@playwright/test").Page): Promise<void> {
  await page.locator('[data-testid="submit-trust-light-path"]').click();
  await expect(page.locator('[data-testid="trust-light-path-feedback"]')).toContainText(
    "The echo has not found the right question yet.",
  );

  await page.locator('[data-testid="trust-question-what-remains"]').click();
  for (const mirrorId of ["silver-key", "upper-echo", "trust-arch"] as const) {
    await page.locator(`[data-testid="trust-mirror-${mirrorId}"]`).click();
  }

  await expect(page.locator('[data-testid="trust-light-path-progress"]')).toContainText("Light reaches Trust.");
  await expect(page.locator('[data-testid="trust-light-payoff"]')).toContainText("unfinished letter");
  await page.locator('[data-testid="submit-trust-light-path"]').click();
}

async function solveCaseMosaic(page: import("@playwright/test").Page): Promise<void> {
  await page.locator('[data-testid="submit-case-mosaic"]').click();
  await expect(page.locator('[data-testid="case-mosaic-feedback"]')).toContainText("The envelope is not whole yet.");

  for (const [pieceId, row, col] of [
    ["envelope-top-left", 0, 0],
    ["envelope-top-flap", 0, 1],
    ["envelope-top-right", 0, 2],
    ["envelope-bottom-left", 1, 0],
    ["envelope-seal", 1, 1],
    ["envelope-bottom-right", 1, 2],
  ] as const) {
    await page.locator(`[data-testid="case-mosaic-piece-${pieceId}"]`).click();
    await page.locator(`[data-testid="case-mosaic-slot-${row}-${col}"]`).click();
  }

  await expect(page.locator('[data-testid="case-mosaic-progress"]')).toContainText("Aligned: 6 / 6");
  await expect(page.locator('[data-testid="case-mosaic-payoff"]')).toContainText("Brass Key");
  await expect(page.locator('[data-testid="case-mosaic-payoff"]')).toContainText("Tram Ticket");
  await expect(page.locator('[data-testid="case-mosaic-payoff"]')).toContainText("Glowing Route");
  await page.locator('[data-testid="submit-case-mosaic"]').click();
}

async function solveRouteTilePuzzle(page: import("@playwright/test").Page): Promise<void> {
  await page.locator('[data-testid="submit-route-tile-puzzle"]').click();
  await expect(page.locator('[data-testid="route-tile-feedback"]')).toContainText("The route has not reached the wall yet.");

  for (const tileId of ["golden-stamp", "keyhole", "hidden-wall", "vistula-route"] as const) {
    await page.locator(`[data-testid="route-tile-${tileId}"]`).click();
  }

  await expect(page.locator('[data-testid="route-tile-progress"]')).toContainText("The route reaches the wall.");
  await expect(page.locator('[data-testid="route-tile-wave-reveal"]')).toContainText("Vistula wave mark revealed");
  await page.locator('[data-testid="submit-route-tile-puzzle"]').click();
}

async function solveDepositionOrder(page: import("@playwright/test").Page): Promise<void> {
  await page.locator('[data-testid="submit-deposition-order"]').click();
  await expect(page.locator('[data-testid="deposition-order-feedback"]')).toContainText(
    "The statement does not read clearly yet.",
  );

  await page.locator('[data-testid="deposition-strip-left-willingly"]').click();
  await page.locator('[data-testid="deposition-slot-line-1"]').click();
  await expect(page.locator('[data-testid="deposition-slot-line-1"]')).toHaveClass(/is-incorrect/);
  await page.locator('[data-testid="reset-deposition-order"]').click();
  await expect(page.locator('[data-testid="deposition-slot-line-1"]')).not.toHaveClass(/is-incorrect/);

  for (const [stripId, slotId] of [
    ["not-force", "line-1"],
    ["left-willingly", "line-2"],
    ["false-accusation", "line-3"],
    ["archive-margin", "line-4"],
  ]) {
    await page.locator(`[data-testid="deposition-strip-${stripId}"]`).click();
    await page.locator(`[data-testid="deposition-slot-${slotId}"]`).click();
  }

  await expect(page.locator('[data-testid="deposition-slot-line-1"]')).toHaveClass(/is-correct/);
  await expect(page.locator('[data-testid="deposition-order-progress"]')).toContainText("Lines placed: 4 / 4");
  await expect(page.locator('[data-testid="deposition-archive-code"]')).toContainText("16/05-FILE");
  await page.locator('[data-testid="submit-deposition-order"]').click();
}

async function solveCaseFileSorting(page: import("@playwright/test").Page): Promise<void> {
  await page.locator('[data-testid="submit-case-file-sorting"]').click();
  await expect(page.locator('[data-testid="case-file-sorting-feedback"]')).toContainText(
    "The file order still hides the correction.",
  );

  await page.locator('[data-testid="case-file-document-witness-note"]').click();
  await page.locator('[data-testid="case-file-slot-file-1"]').click();
  await expect(page.locator('[data-testid="case-file-slot-file-1"]')).toHaveClass(/is-incorrect/);
  await page.locator('[data-testid="reset-case-file-sorting"]').click();
  await expect(page.locator('[data-testid="case-file-slot-file-1"]')).not.toHaveClass(/is-incorrect/);

  for (const [documentId, slotId] of [
    ["route-reference", "file-1"],
    ["witness-note", "file-2"],
    ["original-charge", "file-3"],
    ["margin-correction", "file-4"],
    ["key-receipt", "file-5"],
  ]) {
    await page.locator(`[data-testid="case-file-document-${documentId}"]`).click();
    await page.locator(`[data-testid="case-file-slot-${slotId}"]`).click();
  }

  await expect(page.locator('[data-testid="case-file-slot-file-1"]')).toHaveClass(/is-correct/);
  await expect(page.locator('[data-testid="case-file-sorting-progress"]')).toContainText("Correction aligned.");
  await expect(page.locator('[data-testid="case-file-correction"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="case-file-key-cta"]')).toContainText("Take the key");
  await page.locator('[data-testid="submit-case-file-sorting"]').click();
  await expect(page.locator('[data-testid="case-file-sorting-feedback"]')).toContainText("Take the silver key");
  await page.locator('[data-testid="case-file-silver-key"]').click();
  await expect(page.locator('[data-testid="case-file-sorting-progress"]')).toContainText("Silver Key taken.");
  await page.locator('[data-testid="submit-case-file-sorting"]').click();
}

async function expectImageBackedEvidenceReveal(
  page: import("@playwright/test").Page,
  {
    chapterId,
    expectedStatus,
    expectedCompletedLevelId
  }: { chapterId: number; expectedStatus: string; expectedCompletedLevelId: number }
): Promise<void> {
  await expect(page.locator("#scene-status")).toContainText(expectedStatus);
  await expect(page.locator('[data-testid="evidence-reveal-image-backed"]')).toBeVisible();
  await expect(page.locator('[data-testid="evidence-reveal-image-backed"]')).toHaveAttribute("data-phase", "initial");
  await expect(page.locator('[data-testid="evidence-reveal-image-backed-page"] img')).toHaveAttribute(
    "src",
    new RegExp(`RevealChapter0${chapterId}.*\\.webp`)
  );
  await expect(page.getByText("FILED IN THE CASE RECORD")).toHaveCount(0);
  await expectNoDocumentScroll(page);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="level-select-menu"]')).toBeVisible();
  await expect(page.locator("#scene-status")).toContainText("Case Archive");
  await expect(page.locator('[data-testid="evidence-reveal-image-backed"]')).toHaveCount(0);
  const saveAfterSingleContinue = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("maria-tenth-exhibit-save") ?? "{}")
  );
  expect(saveAfterSingleContinue.completedLevelIds).toContain(expectedCompletedLevelId);
  await expectNoDocumentScroll(page);
}

async function expectNoDocumentScroll(page: import("@playwright/test").Page): Promise<void> {
  const metrics = await page.evaluate(() => ({
    bodyScrollHeight: document.body.scrollHeight,
    bodyScrollWidth: document.body.scrollWidth,
    docScrollHeight: document.documentElement.scrollHeight,
    docScrollWidth: document.documentElement.scrollWidth,
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    bodyOverflow: window.getComputedStyle(document.body).overflow,
    documentOverflow: window.getComputedStyle(document.documentElement).overflow
  }));

  expect(metrics.bodyOverflow).toBe("hidden");
  expect(metrics.documentOverflow).toBe("hidden");
  expect(Math.max(metrics.bodyScrollHeight, metrics.docScrollHeight)).toBeLessThanOrEqual(metrics.innerHeight + 2);
  expect(Math.max(metrics.bodyScrollWidth, metrics.docScrollWidth)).toBeLessThanOrEqual(metrics.innerWidth + 2);
}

async function expectBoxesInsideContainer(
  page: import("@playwright/test").Page,
  itemSelector: string,
  containerSelector: string,
  minimumCount = 1,
): Promise<void> {
  const result = await page.evaluate(
    ({ itemSelector, containerSelector, minimumCount }) => {
      const container = document.querySelector(containerSelector);
      const items = Array.from(document.querySelectorAll(itemSelector));
      if (!container || items.length < minimumCount) {
        return { ok: false, count: items.length, failures: ["missing"] };
      }

      const containerBox = container.getBoundingClientRect();
      const failures = items
        .map((item, index) => {
          const box = item.getBoundingClientRect();
          const inside =
            box.left >= containerBox.left - 2 &&
            box.top >= containerBox.top - 2 &&
            box.right <= containerBox.right + 2 &&
            box.bottom <= containerBox.bottom + 2;
          return inside ? null : `item ${index} outside container`;
        })
        .filter(Boolean);

      return { ok: failures.length === 0, count: items.length, failures };
    },
    { itemSelector, containerSelector, minimumCount },
  );

  expect(result.count, `${itemSelector} count`).toBeGreaterThanOrEqual(minimumCount);
  expect(result.ok, `${itemSelector} should stay inside ${containerSelector}: ${result.failures.join(", ")}`).toBe(true);
}

async function expectBoxesInsideViewport(
  page: import("@playwright/test").Page,
  selector: string,
  minimumCount = 1,
): Promise<void> {
  const locator = page.locator(selector);
  const count = await locator.count();
  expect(count, `${selector} should exist`).toBeGreaterThanOrEqual(minimumCount);
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  for (let index = 0; index < count; index += 1) {
    const box = await locator.nth(index).boundingBox();
    expect(box, `${selector} item ${index} should have a layout box`).not.toBeNull();
    if (!box || !viewport) {
      continue;
    }

    expect(box.x, `${selector} item ${index} left edge`).toBeGreaterThanOrEqual(-2);
    expect(box.y, `${selector} item ${index} top edge`).toBeGreaterThanOrEqual(-2);
    expect(box.x + box.width, `${selector} item ${index} right edge`).toBeLessThanOrEqual(viewport.width + 2);
    expect(box.y + box.height, `${selector} item ${index} bottom edge`).toBeLessThanOrEqual(viewport.height + 2);
  }
}

async function expectTouchControlsUsable(page: import("@playwright/test").Page): Promise<void> {
  await expect(page.locator('[data-testid="touch-controls"]')).toBeVisible();
  await expect(page.locator('[data-testid="touch-controls-hint"]')).toBeVisible();

  for (const testId of ["touch-left", "touch-right", "touch-jump"] as const) {
    const selector = `[data-testid="${testId}"]`;
    await expectBoxesInsideViewport(page, selector);
    const metrics = await page.locator(selector).evaluate((element) => {
      const box = element.getBoundingClientRect();
      const styles = window.getComputedStyle(element);
      return {
        ariaLabel: element.getAttribute("aria-label"),
        width: box.width,
        height: box.height,
        touchAction: styles.touchAction
      };
    });

    expect(metrics.ariaLabel, `${testId} should have an accessible label`).toBeTruthy();
    expect(metrics.width, `${testId} width`).toBeGreaterThanOrEqual(testId === "touch-jump" ? 84 : 56);
    expect(metrics.height, `${testId} height`).toBeGreaterThanOrEqual(56);
    expect(metrics.touchAction, `${testId} should not pan the browser`).toBe("none");
  }
}

async function expectNoTouchControls(page: import("@playwright/test").Page): Promise<void> {
  await expect(page.locator('[data-testid="touch-controls"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="touch-controls-hint"]')).toHaveCount(0);
}

async function expectPlatformerCanvasCentered(page: import("@playwright/test").Page): Promise<void> {
  const margins = await page.locator("#game-container canvas").evaluate((canvas) => {
    const box = canvas.getBoundingClientRect();
    return {
      left: box.left,
      right: window.innerWidth - box.right,
      computedMarginLeft: window.getComputedStyle(canvas).marginLeft,
      computedMarginRight: window.getComputedStyle(canvas).marginRight
    };
  });

  expect(Math.abs(margins.left - margins.right), `platformer canvas side margins: ${JSON.stringify(margins)}`).toBeLessThanOrEqual(2);
  expect(margins.computedMarginLeft).toBe("0px");
  expect(margins.computedMarginRight).toBe("0px");
}

async function expectPuzzleFitsMobileViewport(
  page: import("@playwright/test").Page,
  required: {
    root: string;
    reset: string;
    submit: string;
    targets: string;
    targetCount?: number;
    items: string;
    itemCount?: number;
  },
): Promise<void> {
  await expect(page.locator(required.root)).toBeVisible();
  await expectBoxesInsideViewport(page, ".puzzle-panel");
  await expectBoxesInsideViewport(page, required.reset);
  await expectBoxesInsideViewport(page, required.submit);
  await expectBoxesInsideViewport(page, required.targets, required.targetCount ?? 1);
  await expectBoxesInsideViewport(page, required.items, required.itemCount ?? 1);
  await expectNoDocumentScroll(page);
}

test("page loads opening start and can reveal the title scene", async ({ page }) => {
  await openTitleViaOpening(page);

  await expect(page).toHaveTitle("Maria and the Case of the Missing Heart");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator("#scene-status")).toContainText("Maria and the Case of the Missing Heart");
  await expect(page.locator('[data-testid="title-menu"]')).toContainText("Maria and the Case of the Missing Heart");
  await expect(page.locator('[data-testid="title-menu"]')).not.toContainText("Sprawa Zaginionego Serca");
  await expect(page.locator('[data-testid="title-menu"]')).not.toContainText("A birthday case file");
  await expect(page.locator('[data-testid="title-level-select"]')).toContainText("Case Archive");
});

test("opening start button supports keyboard activation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-testid="opening-start"]')).toBeVisible();
  const startButton = page.getByRole("button", { name: "Start the case" });
  await startButton.focus();
  await page.keyboard.press("Space");
  await expect(page.locator('[data-testid="opening-cinematic"]')).toBeVisible();
});

test("opening cinematic uses final movie frames with elegant captions", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start the case" }).click();
  await expect(page.locator('[data-testid="opening-cinematic"]')).toBeVisible();

  const activeFrame = page.locator(".opening-cinematic-frame.is-active").first();
  const caption = page.locator('[data-testid="opening-cinematic-caption"]');
  await expect(activeFrame).toBeVisible();
  await expect(activeFrame).toHaveAttribute("src", /assets\/final\/opening\/Opening01\.webp/);
  await expect(page.locator(".opening-cinematic-frame")).toHaveCount(2);
  await expect(caption).toBeVisible();
  await expect(caption).toContainText("Warsaw wakes quietly.");
  await expect(caption).toHaveClass(/is-visible/);
  await expect(page.locator(".opening-city-line, .opening-office-window, .opening-desk, .opening-case-file, .opening-maria")).toHaveCount(0);
  await expect(page.locator(".vn-dialogue-panel, .vn-speaker, .vn-portrait, .opening-caption-panel")).toHaveCount(0);

  await expect(page.locator('[data-testid="opening-cinematic"]')).toHaveAttribute("data-beat", "way-to-office", { timeout: 6_000 });
  await expect(caption).toContainText("But some days arrive with a case.");
  await expect(caption).toHaveClass(/is-visible/);
  await expect(page.locator('[data-testid="opening-skip"]')).toBeVisible();
});

test("mobile landscape player-facing overlays do not create document scroll", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-landscape", "No-scroll viewport coverage is scoped to mobile landscape.");

  await page.goto("/");
  await expect(page.locator('[data-testid="opening-start"]')).toBeVisible();
  await expectNoTouchControls(page);
  await expect(page.getByRole("button", { name: "Start the case" })).toBeInViewport();
  await expectNoDocumentScroll(page);

  await page.getByRole("button", { name: "Start the case" }).click();
  await expect(page.locator('[data-testid="opening-cinematic"]')).toBeVisible();
  await expectNoTouchControls(page);
  await expect(page.locator('[data-testid="opening-skip"]')).toBeInViewport();
  await expectNoDocumentScroll(page);

  await page.locator('[data-testid="opening-skip"]').click();
  await expect(page.locator('[data-testid="title-menu"]')).toBeVisible();
  await expectNoTouchControls(page);
  await expect(page.locator('[data-testid="title-primary"]')).toBeInViewport();
  await expect(page.locator('[data-testid="title-level-select"]')).toBeInViewport();
  await expect(page.locator('[data-testid="title-settings"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="settings-panel"]')).toHaveCount(0);
  await expectNoDocumentScroll(page);
});

test("mobile landscape chapter, VN, puzzle, verdict, and credits screens stay inside the viewport", async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-landscape", "No-scroll viewport coverage is scoped to mobile landscape.");

  await page.goto("/?scene=level-select&completeLevel=8");
  await expect(page.locator('[data-testid="level-select-menu"]')).toBeVisible();
  await expectNoTouchControls(page);
  await expect(page.locator('[data-testid="level-select-back"]')).toBeInViewport();
  await expectBoxesInsideContainer(page, '[data-testid^="chapter-row-"]', '[data-testid="level-select-menu"]', 6);
  await expectBoxesInsideViewport(page, '[data-testid="chapter-row-5"]');
  await expectBoxesInsideViewport(page, '[data-testid="chapter-row-6"]');
  await expectNoDocumentScroll(page);

  await page.goto("/?scene=vn&id=vn-chapter-1-intro");
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toBeVisible();
  await expectNoTouchControls(page);
  await expect(page.locator('[data-testid="vn-image-backed-page"]')).toBeInViewport();
  await expectNoDocumentScroll(page);

  await page.goto("/?scene=puzzle&chapter=1");
  await expect(page.locator(".puzzle-panel")).toBeVisible();
  await expectNoTouchControls(page);
  await expect(page.locator(".puzzle-actions button").last()).toBeInViewport();
  await expectNoDocumentScroll(page);

  await page.goto("/?scene=final-verdict");
  await expect(page.locator('[data-testid="final-verdict-overlay"]')).toBeVisible();
  await expectNoTouchControls(page);
  await expect(page.locator('[data-testid="accept-verdict"]')).toBeInViewport();
  await expectNoDocumentScroll(page);

  await page.locator('[data-testid="accept-verdict"]').click();
  await expect(page).toHaveURL(/scene=final-verdict/);
  await expect(page.locator('[data-testid="evidence-love-unlocked"]')).toBeVisible();
  await expect(page.locator('[data-testid="case-closed-message"]')).toContainText("Case closed. Love confirmed.");
  await expect(page.locator('[data-testid="evidence-love-title"]')).toContainText("Evidence of Love Unlocked");
  await expectNoTouchControls(page);
  await expect(page.locator('[data-testid="open-evidence-love"]')).toBeInViewport();
  await expect(page.locator('[data-testid="open-evidence-love"]')).toHaveAttribute("data-video-target", /video\.html$/);
  await expect(page.locator('[data-testid="final-back-title"]')).toBeInViewport();
  await expect(page.locator('[data-testid="final-level-select"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="final-credits"]')).toHaveCount(0);
  await expectNoDocumentScroll(page);

  await page.locator('[data-testid="final-back-title"]').click();
  await expect(page.locator('[data-testid="title-menu"]')).toBeVisible();
  await expectNoTouchControls(page);
  await expectNoDocumentScroll(page);
});

test("mobile landscape active puzzle layouts keep boards, trays, and actions inside the viewport", async ({
  page
}, testInfo) => {
  test.setTimeout(75_000);
  test.skip(testInfo.project.name !== "mobile-landscape", "Puzzle viewport coverage is scoped to mobile landscape.");

  const puzzles = [
    {
      route: "/?scene=puzzle&chapter=1",
      root: '[data-testid="case-mosaic-puzzle"]',
      reset: '[data-testid="reset-case-mosaic"]',
      submit: '[data-testid="submit-case-mosaic"]',
      targets: '[data-testid^="case-mosaic-slot-"]',
      targetCount: 6,
      items: '[data-testid^="case-mosaic-piece-"]',
      itemCount: 6
    },
    {
      route: "/?scene=puzzle&chapter=2",
      root: '[data-testid="route-tile-puzzle"]',
      reset: '[data-testid="reset-route-tile-puzzle"]',
      submit: '[data-testid="submit-route-tile-puzzle"]',
      targets: '[data-testid^="route-tile-"]',
      targetCount: 6,
      items: '[data-testid^="route-tile-"]',
      itemCount: 6
    },
    {
      route: "/?scene=puzzle&chapter=3",
      root: '[data-testid="deposition-order-puzzle"]',
      reset: '[data-testid="reset-deposition-order"]',
      submit: '[data-testid="submit-deposition-order"]',
      targets: '[data-testid^="deposition-slot-"]',
      targetCount: 4,
      items: '[data-testid^="deposition-strip-"]',
      itemCount: 4
    },
    {
      route: "/?scene=puzzle&chapter=4",
      root: '[data-testid="case-file-sorting-puzzle"]',
      reset: '[data-testid="reset-case-file-sorting"]',
      submit: '[data-testid="submit-case-file-sorting"]',
      targets: '[data-testid^="case-file-slot-"]',
      targetCount: 5,
      items: '[data-testid^="case-file-document-"]',
      itemCount: 5
    },
    {
      route: "/?scene=puzzle&chapter=5",
      root: '[data-testid="trust-light-path-puzzle"]',
      reset: '[data-testid="reset-trust-light-path"]',
      submit: '[data-testid="submit-trust-light-path"]',
      targets: '[data-testid^="trust-mirror-"], [data-testid="trust-light-target"]',
      targetCount: 4,
      items: ".trust-question-tile, [data-testid^=\"trust-mirror-\"]",
      itemCount: 4
    },
    {
      route: "/?scene=puzzle&chapter=6",
      root: '[data-testid="final-verdict-assembly-puzzle"]',
      reset: '[data-testid="reset-final-verdict-assembly"]',
      submit: '[data-testid="submit-final-verdict-assembly"]',
      targets: ".final-seal-ring",
      targetCount: 3,
      items: '[data-testid^="final-seal-clue-"]',
      itemCount: 6
    }
  ];

  for (const puzzle of puzzles) {
    await page.goto(puzzle.route);
    await expectPuzzleFitsMobileViewport(page, puzzle);
  }
});

test("mobile landscape platformer chapters keep touch controls usable", async ({
  page
}, testInfo) => {
  test.setTimeout(75_000);
  test.skip(testInfo.project.name !== "mobile-landscape", "Platformer touch-control coverage is scoped to mobile landscape.");

  for (const [chapter, expectedScene, expectedTitle] of [
    [1, "platformer-level-1", "The Envelope at the Kancelaria"],
    [2, "platformer-level-2", "The Tram of Deadlines"],
    [3, "platformer-level-4", "The Vistula Deposition"],
    [4, "platformer-level-5", "The Archive of Tiny Details"],
    [5, "platformer-level-6", "The Courthouse of Echoes"],
    [6, "platformer-level-9", "The Rooftops Before the Verdict"]
  ] as const) {
    await page.goto(`/?scene=platformer&chapter=${chapter}`);

    await expect(page.locator("body")).toHaveAttribute("data-scene", expectedScene);
    await expect(page.locator("#scene-status")).toContainText(expectedTitle);
    await expectTouchControlsUsable(page);
    await expectPlatformerCanvasCentered(page);
    await expectNoDocumentScroll(page);

    await page.locator('[data-testid="touch-right"]').click();
    await page.locator('[data-testid="touch-jump"]').click();
    await expectNoDocumentScroll(page);
  }
});

test("mobile landscape key puzzle tap fallbacks complete without drag", async ({
  page
}, testInfo) => {
  test.setTimeout(75_000);
  test.skip(testInfo.project.name !== "mobile-landscape", "Tap-fallback completion coverage is scoped to mobile landscape.");

  await page.goto("/?scene=puzzle&chapter=1");
  await expect(page.locator('[data-testid="case-mosaic-puzzle"]')).toBeVisible();
  await expectNoTouchControls(page);
  await solveCaseMosaic(page);
  await expect(page.locator("#scene-status")).toContainText("Maria notices what others miss.");
  await expectNoDocumentScroll(page);

  await page.goto("/?scene=puzzle&chapter=2&completeLevel=1");
  await expect(page.locator('[data-testid="route-tile-puzzle"]')).toBeVisible();
  await solveRouteTilePuzzle(page);
  await expect(page.locator("#scene-status")).toContainText("Responsibility and patience reveal the path.");
  await expectNoDocumentScroll(page);

  await page.goto("/?scene=puzzle&chapter=3&completeLevel=3");
  await expect(page.locator('[data-testid="deposition-order-puzzle"]')).toBeVisible();
  await solveDepositionOrder(page);
  await expect(page.locator("#scene-status")).toContainText("Maria hears the quiet version of truth.");
  await expectNoDocumentScroll(page);

  await page.goto("/?scene=puzzle&chapter=4&completeLevel=4");
  await expect(page.locator('[data-testid="case-file-sorting-puzzle"]')).toBeVisible();
  await solveCaseFileSorting(page);
  await expect(page.locator("#scene-status")).toContainText("Small details change the charge.");
  await expectNoDocumentScroll(page);

  await page.goto("/?scene=puzzle&chapter=5&completeLevel=5");
  await expect(page.locator('[data-testid="trust-light-path-puzzle"]')).toBeVisible();
  await solveTrustLightPath(page);
  await expect(page.locator("#scene-status")).toContainText("Trust is proven by what remains.");
  await expectNoDocumentScroll(page);

  await page.goto("/?scene=puzzle&chapter=6&completeLevel=8");
  await expect(page.locator('[data-testid="final-verdict-assembly-puzzle"]')).toBeVisible();
  await solveFinalVerdictAssembly(page);
  await expect(page.locator("#scene-status")).toContainText("VERDICT");
  await expect(page.locator('[data-testid="accept-verdict"]')).toBeInViewport();
  await expectNoDocumentScroll(page);
});

  test("desktop redesigned puzzle set completes with click and tap fallback", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  test.skip(testInfo.project.name !== "chromium", "Desktop completion coverage is scoped to desktop Chromium.");

  await page.setViewportSize({ width: 1366, height: 768 });

  for (const puzzleRoute of [
    {
      path: "/?scene=puzzle&chapter=1",
      testId: "case-mosaic-puzzle",
      solve: solveCaseMosaic,
      expectedStatus: "Maria notices what others miss."
    },
    {
      path: "/?scene=puzzle&chapter=2&completeLevel=1",
      testId: "route-tile-puzzle",
      solve: solveRouteTilePuzzle,
      expectedStatus: "Responsibility and patience reveal the path."
    },
    {
      path: "/?scene=puzzle&chapter=3&completeLevel=3",
      testId: "deposition-order-puzzle",
      solve: solveDepositionOrder,
      expectedStatus: "Maria hears the quiet version of truth."
    },
    {
      path: "/?scene=puzzle&chapter=4&completeLevel=4",
      testId: "case-file-sorting-puzzle",
      solve: solveCaseFileSorting,
      expectedStatus: "Small details change the charge."
    },
    {
      path: "/?scene=puzzle&chapter=5&completeLevel=5",
      testId: "trust-light-path-puzzle",
      solve: solveTrustLightPath,
      expectedStatus: "Trust is proven by what remains."
    },
    {
      path: "/?scene=puzzle&chapter=6&completeLevel=8",
      testId: "final-verdict-assembly-puzzle",
      solve: solveFinalVerdictAssembly,
      expectedStatus: "VERDICT"
    }
  ] as const) {
    await page.goto(puzzleRoute.path);
    await expect(page.locator(`[data-testid="${puzzleRoute.testId}"]`)).toBeVisible();
    await expectNoDocumentScroll(page);
    await puzzleRoute.solve(page);
    await expect(page.locator("#scene-status")).toContainText(puzzleRoute.expectedStatus);
    await expectNoDocumentScroll(page);
  }
  });

  test("Chapter 1-5 image-backed evidence reveals complete and open archive with one continue", async ({ page }) => {
    test.setTimeout(90_000);

    for (const revealRoute of [
      {
        path: "/?scene=puzzle&chapter=1",
        testId: "case-mosaic-puzzle",
        solve: solveCaseMosaic,
        chapterId: 1,
        expectedStatus: "Maria notices what others miss.",
        expectedCompletedLevelId: 1
      },
      {
        path: "/?scene=puzzle&chapter=2&completeLevel=1",
        testId: "route-tile-puzzle",
        solve: solveRouteTilePuzzle,
        chapterId: 2,
        expectedStatus: "Responsibility and patience reveal the path.",
        expectedCompletedLevelId: 3
      },
      {
        path: "/?scene=puzzle&chapter=3&completeLevel=3",
        testId: "deposition-order-puzzle",
        solve: solveDepositionOrder,
        chapterId: 3,
        expectedStatus: "Maria hears the quiet version of truth.",
        expectedCompletedLevelId: 4
      },
      {
        path: "/?scene=puzzle&chapter=4&completeLevel=4",
        testId: "case-file-sorting-puzzle",
        solve: solveCaseFileSorting,
        chapterId: 4,
        expectedStatus: "Small details change the charge.",
        expectedCompletedLevelId: 5
      },
      {
        path: "/?scene=puzzle&chapter=5&completeLevel=5",
        testId: "trust-light-path-puzzle",
        solve: solveTrustLightPath,
        chapterId: 5,
        expectedStatus: "Trust is proven by what remains.",
        expectedCompletedLevelId: 8
      }
    ] as const) {
      await page.goto(revealRoute.path);
      await expect(page.locator(`[data-testid="${revealRoute.testId}"]`)).toBeVisible();
      await revealRoute.solve(page);
      await expectImageBackedEvidenceReveal(page, revealRoute);
    }
  });

  test("desktop Case Mosaic uses available space and keeps actions visible", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop puzzle sizing is covered in desktop Chromium.");

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/?scene=puzzle&chapter=1");
  await expect(page.locator('[data-testid="case-mosaic-puzzle"]')).toBeVisible();

  const panelBox = await page.locator(".puzzle-panel").boundingBox();
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  expect(panelBox).not.toBeNull();
  expect(panelBox?.width ?? 0).toBeGreaterThan(1000);
  expect((panelBox?.width ?? 0) / viewportWidth).toBeGreaterThan(0.82);
  expect(panelBox?.height ?? 0).toBeGreaterThan(650);

  const contentsBox = await page.locator(".case-mosaic-tray").boundingBox();
  const actionsBox = await page.locator(".puzzle-actions").boundingBox();
  expect(contentsBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  expect((contentsBox?.y ?? 0) + (contentsBox?.height ?? 0)).toBeLessThanOrEqual(actionsBox?.y ?? 0);

  await expectBoxesInsideViewport(page, '[data-testid="reset-case-mosaic"]');
  await expectBoxesInsideViewport(page, '[data-testid="submit-case-mosaic"]');
  await expectBoxesInsideViewport(page, '[data-testid^="case-mosaic-slot-"]', 6);
  await expectBoxesInsideViewport(page, '[data-testid^="case-mosaic-piece-"]', 6);
  await expectNoDocumentScroll(page);
});

test("final verdict and portrait fallback remain viewport-safe", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Viewport resize coverage is covered in desktop Chromium.");

  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1024, height: 600 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/?scene=final-verdict");

    await expectImageBackedFinalVerdict(page);
    await expectNoDocumentScroll(page);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("#rotate-overlay")).toBeVisible();
  await expectNoDocumentScroll(page);
});

test("case file starts the active Chapter 1 flow", async ({ page }) => {
  await openTitleViaOpening(page);

  await page.locator('[data-testid="title-primary"]').click();
  await expect(page.locator("#scene-status")).toContainText("Case No. 16/05");
  await expect(page.locator('[data-testid="case-file-final-frame"]')).toBeVisible();
  await expect(page.locator('[data-testid="case-file-final-frame"] img')).toHaveAttribute("src", /CaseFileFrame01.*\.webp/);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toBeVisible();
  await expect(page.locator("#scene-status")).toContainText("The First Envelope");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /FirstNovel01.*\.webp/);
  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "2");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /FirstNovel02.*\.webp/);
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /FirstNovel03.*\.webp/);
  await clickViewportCenter(page);

  await expect(page.locator("#scene-status")).toContainText("The Envelope at the Kancelaria");
  await expect(page.locator('[data-testid="touch-controls"]')).toBeAttached();
});

test("Chapter 2 image-backed VN assets route into platformer and Hidden Wall puzzle", async ({ page }) => {
  await page.goto("/?scene=vn&id=vn-chapter-2-intro");
  await expect(page.locator("#scene-status")).toContainText("The Stamped Route");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-count", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /SecondNovel01.*\.webp/);
  await expectNoDocumentScroll(page);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "2");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /SecondNovel02.*\.webp/);
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /SecondNovel03.*\.webp/);
  await clickViewportCenter(page);
  await expect(page.locator("body")).toHaveAttribute("data-scene", "platformer-level-2");

  await page.goto("/?scene=vn&id=vn-chapter-2-before-puzzle");
  await expect(page.locator("#scene-status")).toContainText("The Hidden Wall");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-count", "1");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute(
    "src",
    /HiddenWallPuzzleNovel01.*\.webp/
  );
  await expectNoDocumentScroll(page);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="route-tile-puzzle"]')).toBeVisible();
  await expect(page.locator("#scene-status")).toContainText("Route Tile Puzzle");
});

test("Chapter 3 and Chapter 4 intro image-backed VN assets route into their platformers", async ({ page }) => {
  await page.goto("/?scene=vn&id=vn-chapter-3-intro");
  await expect(page.locator("#scene-status")).toContainText("The Running Witness");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-count", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /ThirdNovel01.*\.webp/);
  await expectNoDocumentScroll(page);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "2");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /ThirdNovel02.*\.webp/);
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /ThirdNovel03.*\.webp/);
  await clickViewportCenter(page);
  await expect(page.locator("body")).toHaveAttribute("data-scene", "platformer-level-4");

  await page.goto("/?scene=vn&id=vn-chapter-4-intro");
  await expect(page.locator("#scene-status")).toContainText("The Drawer No One Opened");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-count", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /ForthNovel01.*\.webp/);
  await expectNoDocumentScroll(page);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "2");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /ForthNovel02.*\.webp/);
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /ForthNovel03.*\.webp/);
  await clickViewportCenter(page);
  await expect(page.locator("body")).toHaveAttribute("data-scene", "platformer-level-5");
});

test("Chapter 4 pre-puzzle and Chapter 5 intro image-backed VN assets route correctly", async ({ page }) => {
  await page.goto("/?scene=vn&id=vn-chapter-4-before-puzzle");
  await expect(page.locator("#scene-status")).toContainText("The Marginal Note");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-count", "1");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute(
    "src",
    /MarginalNotePuzzleNovel01.*\.webp/
  );
  await expectNoDocumentScroll(page);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="case-file-sorting-puzzle"]')).toBeVisible();
  await expect(page.locator("#scene-status")).toContainText("Case File Sorting");

  await page.goto("/?scene=vn&id=vn-chapter-5-intro");
  await expect(page.locator("#scene-status")).toContainText("The Door of Trust");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-count", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /FifthNovel01.*\.webp/);
  await expectNoDocumentScroll(page);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "2");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /FifthNovel02.*\.webp/);
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /FifthNovel03.*\.webp/);
  await clickViewportCenter(page);
  await expect(page.locator("body")).toHaveAttribute("data-scene", "platformer-level-6");

  await page.goto("/?scene=vn&id=vn-chapter-5-before-puzzle");
  await expect(page.locator("#scene-status")).toContainText("The Right Question");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-count", "1");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute(
    "src",
    /TheRightQuestionPuzzleNovel01.*\.webp/
  );
  await expectNoDocumentScroll(page);
  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="trust-light-path-puzzle"]')).toBeVisible();
});

test("Chapter 6 intro and Final Seal pre-puzzle image-backed VN assets route correctly", async ({ page }) => {
  await page.goto("/?scene=vn&id=vn-chapter-6-intro");
  await expect(page.locator("#scene-status")).toContainText("Before the Verdict");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-count", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /SixthNovel01.*\.webp/);
  await expectNoDocumentScroll(page);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "2");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /SixthNovel02.*\.webp/);
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-index", "3");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute("src", /SixthNovel03.*\.webp/);
  await clickViewportCenter(page);
  await expect(page.locator("body")).toHaveAttribute("data-scene", "platformer-level-9");

  await page.goto("/?scene=vn&id=vn-chapter-6-before-puzzle");
  await expect(page.locator("#scene-status")).toContainText("The Final Seal");
  await expectImageBackedVisualNovel(page);
  await expect(page.locator('[data-testid="visual-novel-scene"]')).toHaveAttribute("data-page-count", "1");
  await expect(page.locator('[data-testid="vn-image-backed-page"] img')).toHaveAttribute(
    "src",
    /TheFinalSealPuzzleNovel01.*\.webp/
  );
  await expectNoDocumentScroll(page);

  await clickViewportCenter(page);
  await expect(page.locator('[data-testid="final-verdict-assembly-puzzle"]')).toBeVisible();
  await expect(page.locator("#scene-status")).toContainText("Final Seal");
});

test("Case Archive shows six player-facing chapters, not the old level grid", async ({ page }) => {
  await page.goto("/?scene=level-select");

  await expect(page.locator('[data-testid="level-select-menu"]')).toBeVisible();
  await expect(page.locator("#scene-status")).toContainText("Case Archive");
  await expect(page.locator('[data-testid^="chapter-row-"]')).toHaveCount(6);
  await expectBoxesInsideContainer(page, '[data-testid^="chapter-row-"]', '[data-testid="level-select-menu"]', 6);
  await expectBoxesInsideViewport(page, '[data-testid="chapter-row-5"]');
  await expectBoxesInsideViewport(page, '[data-testid="chapter-row-6"]');
  await expectBoxesInsideViewport(page, '[data-testid="level-select-back"]');
  await expectNoDocumentScroll(page);
  await expect(page.locator(".level-select-summary")).toContainText("0/6 chapters closed");
  await expect(page.locator('[data-testid="chapter-row-1"]')).toContainText("Play");
  await expect(page.locator('[data-testid="chapter-row-2"]')).toContainText("Locked");
  await expect(page.locator("body")).not.toContainText("Clues:");
  await expect(page.locator(".level-status-chip")).toHaveCount(0);
  await expect(page.locator('[data-testid="level-row-7"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="level-select-10"]')).toHaveCount(0);
});

test("chapter availability follows the six-chapter save bridge", async ({ page }) => {
  await page.goto("/?scene=level-select&completeLevel=1");
  await expect(page.locator(".level-select-summary")).toContainText("1/6 chapters closed");
  await expect(page.locator('[data-testid="chapter-select-1"]')).toContainText("Replay");
  await expect(page.locator('[data-testid="chapter-select-2"]')).toContainText("Next Clue");
  await expect(page.locator('[data-testid="chapter-select-3"]')).toContainText("Locked");
  await expect(page.locator('[data-testid="chapter-row-1"]')).not.toContainText("Completed / Replay");

  await page.goto("/?scene=level-select&completeLevel=3");
  await expect(page.locator(".level-select-summary")).toContainText("2/6 chapters closed");
  await expect(page.locator('[data-testid="chapter-select-2"]')).toContainText("Replay");
  await expect(page.locator('[data-testid="chapter-select-3"]')).toContainText("Next Clue");
  await expect(page.locator('[data-testid="chapter-row-2"]')).not.toContainText("Completed / Replay");

  await page.goto("/?scene=level-select&completeLevel=4");
  await expect(page.locator(".level-select-summary")).toContainText("3/6 chapters closed");
  await expect(page.locator('[data-testid="chapter-select-3"]')).toContainText("Replay");
  await expect(page.locator('[data-testid="chapter-select-4"]')).toContainText("Next Clue");
  await expect(page.locator('[data-testid="chapter-row-3"]')).not.toContainText("Completed / Replay");

  await page.goto("/?scene=level-select&completeLevel=5");
  await expect(page.locator('[data-testid="chapter-select-4"]')).toContainText("Replay");
  await expect(page.locator('[data-testid="chapter-select-5"]')).toContainText("Next Clue");
  await expect(page.locator('[data-testid="chapter-row-4"]')).not.toContainText("Completed / Replay");

  await page.goto("/?scene=level-select&completeLevel=8");
  await expect(page.locator('[data-testid="chapter-select-5"]')).toContainText("Replay");
  await expect(page.locator('[data-testid="chapter-select-6"]')).toContainText("Finale");
  await expect(page.locator('[data-testid="chapter-row-5"]')).not.toContainText("Completed / Replay");
});

test("chapter cards route through chapter-aware VN before legacy runtime levels", async ({ page }) => {
  await page.goto("/?scene=level-select&completeLevel=1");

  await page.locator('[data-testid="chapter-select-2"]').click();
  await expect(page.locator("#scene-status")).toContainText("The Stamped Route");
  await continueVisualNovel(page);
  await expect(page.locator("#scene-status")).toContainText("The Tram of Deadlines");
  await expect(page.locator("body")).toHaveAttribute("data-scene", "platformer-level-2");
});

test("middle chapter cards route to their active chapter flows", async ({ page }) => {
  for (const [chapterId, completionGate, chapterTitle, expectedRuntime] of [
    [3, 3, "The Running Witness", "platformer-level-4"],
    [4, 4, "The Drawer No One Opened", "platformer-level-5"],
    [5, 5, "The Door of Trust", "platformer-level-6"],
  ] as const) {
    await page.goto(`/?scene=level-select&completeLevel=${completionGate}`);
    await page.locator(`[data-testid="chapter-select-${chapterId}"]`).click();
    await expect(page.locator("#scene-status")).toContainText(chapterTitle);
    await continueVisualNovel(page);
    await expect(page.locator("body")).toHaveAttribute("data-scene", expectedRuntime);
  }
});

test("Chapter 6 card opens the finale chapter route", async ({ page }) => {
  await page.goto("/?scene=level-select&completeLevel=8");

  await page.locator('[data-testid="chapter-select-6"]').click();
  await expect(page.locator("#scene-status")).toContainText("Before the Verdict");
  await continueVisualNovel(page);
  await expect(page.locator("#scene-status")).toContainText("The Rooftops Before the Verdict");
  await expect(page.locator("body")).toHaveAttribute("data-scene", "platformer-level-9");
});

test("chapter dev routes remain available", async ({ page }) => {
  await page.goto("/?scene=platformer&chapter=6");
  await expect(page.locator("#scene-status")).toContainText("The Rooftops Before the Verdict");
  await expect(page.locator("body")).toHaveAttribute("data-scene", "platformer-level-9");

  await page.goto("/?scene=puzzle&chapter=6");
  await expect(page.locator('[data-testid="final-verdict-assembly-puzzle"]')).toBeVisible();
  await expect(page.locator("#scene-status")).toContainText("Final Seal: The Court of the Heart");
});

test("legacy old-level dev routes stay available but are not player-facing", async ({ page }) => {
  await page.goto("/?scene=platformer&level=10");
  await expect(page.locator("#scene-status")).toContainText("The Court of the Heart");
  await expect(page.locator("body")).toHaveAttribute("data-scene", "platformer-level-10");

  await page.goto("/?scene=puzzle&level=7");
  await expect(page.locator('[data-testid="lantern-sequence-puzzle"]')).toBeVisible();

  await page.goto("/?scene=vn&id=vn-level-10-after-puzzle");
  await expect(page.locator("#scene-status")).toContainText("Before the Verdict");
  await continueVisualNovel(page);
  await expectImageBackedFinalVerdict(page);
});

test("Chapter 6 final puzzle reaches the unchanged verdict boundary", async ({ page }) => {
  test.setTimeout(45_000);

  await page.goto("/?scene=puzzle&chapter=6&completeLevel=8");

  await expect(page.locator('[data-testid="final-verdict-assembly-puzzle"]')).toBeVisible();
  await solveFinalVerdictAssembly(page);

  await expect(page.locator("#scene-status")).toContainText("VERDICT");
  await expectImageBackedFinalVerdict(page);
  const saveBeforeAccept = await page.evaluate(() => JSON.parse(localStorage.getItem("maria-tenth-exhibit-save") ?? "{}"));
  expect(saveBeforeAccept.gameCompleted).not.toBe(true);

  await page.locator('[data-testid="accept-verdict"]').click();
  await expect(page).toHaveURL(/scene=puzzle&chapter=6&completeLevel=8/);
  await expect(page.locator('[data-testid="evidence-love-unlocked"]')).toBeVisible();
  await expect(page.locator('[data-testid="case-closed-message"]')).toContainText("Case closed. Love confirmed.");
  await expect(page.locator('[data-testid="evidence-love-title"]')).toContainText("Evidence of Love Unlocked");
  await expect(page.locator('[data-testid="open-evidence-love"]')).toHaveAttribute("data-video-target", /video\.html$/);
  await expect(page.locator('[data-testid="final-back-title"]')).toBeVisible();
  await expect(page.locator('[data-testid="final-level-select"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="final-credits"]')).toHaveCount(0);
  const saveAfterAccept = await page.evaluate(() => JSON.parse(localStorage.getItem("maria-tenth-exhibit-save") ?? "{}"));
  expect(saveAfterAccept.gameCompleted).toBe(true);

  await page.locator('[data-testid="final-back-title"]').click();
  await expect(page.locator('[data-testid="title-menu"]')).toBeVisible();
});

test("Chapter 5 Trust Door Light Path stays a quick trust-door puzzle", async ({ page }) => {
  await page.goto("/?scene=puzzle&chapter=5&completeLevel=5");

  await expect(page.locator('[data-testid="trust-light-path-puzzle"]')).toBeVisible();
  await expect(page.locator('[data-testid="trust-question-what-remains"]')).toBeVisible();
  await expect(page.locator('[data-testid="trust-light-source"]')).toContainText("Lantern");
  await expect(page.locator('[data-testid="trust-light-target"]')).toContainText("Trust Door");
  await expect(page.locator('[data-testid^="trust-mirror-"]')).toHaveCount(3);

  await solveTrustLightPath(page);

  await expect(page.locator("#scene-status")).toContainText("Trust is proven by what remains.");
  await expect(page.locator("body")).not.toContainText("Exhibit admitted");
});

test("main menu hides settings and reset returns to Chapter 1 baseline", async ({ page }) => {
  await openTitleViaOpening(page, "/?completeLevel=1");

  await expect(page.locator('[data-testid="title-settings"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="settings-panel"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="title-primary"]')).toContainText("Continue Case");
  await expect(page.locator('[data-testid="title-level-select"]')).toBeEnabled();

  await page.locator('[data-testid="title-reset"]').click();
  await expect(page.locator('[data-testid="reset-confirmation"]')).toBeVisible();
  await page.locator('[data-testid="reset-confirm"]').click();
  await expect(page.locator('[data-testid="title-primary"]')).toContainText("Open the Case");
});

test("normal platformer route keeps persistent instruction and settings text out of player UI", async ({ page }, testInfo) => {
  await page.goto("/?scene=platformer&chapter=1");

  await expect(page.locator("#scene-status")).toContainText("The Envelope at the Kancelaria");
  await expect(page.getByText("R: restart")).toHaveCount(0);
  await expect(page.getByText("Sound ready")).toHaveCount(0);
  await expect(page.getByText("Muted")).toHaveCount(0);
  await expect(page.locator('[data-testid="dev-debug-overlay"]')).toBeHidden();

  if (testInfo.project.name === "chromium") {
    const touchControlStyles = await page.locator('[data-testid="touch-controls"]').evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        opacity: styles.opacity,
        pointerEvents: styles.pointerEvents
      };
    });
    expect(touchControlStyles.opacity).toBe("0");
    expect(touchControlStyles.pointerEvents).toBe("none");
  }
});

test("dev level tuning overlay still works on retained old platformer routes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "F1 debug overlay shortcut is covered in desktop Chromium.");

  await page.goto("/?scene=platformer&level=1");

  await expect(page.locator("#scene-status")).toContainText("The Envelope at the Kancelaria");
  await page.keyboard.press("F1");

  const overlay = page.locator('[data-testid="dev-debug-overlay"]:visible');
  await expect(overlay).toBeVisible();
  await expect(overlay).toContainText("DEV LEVEL EDITOR");
  await expect(overlay).toContainText("Level: 1");
  await expect(page.locator('[data-testid="dev-undo"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-redo"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-add-platform"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-add-moving-platform"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-add-elevator"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-duplicate-platform"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-delete-object"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-revert-unsaved"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-reset-level-overrides"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-export-overrides"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-import-overrides"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-snap-toggle"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-validate-level"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-auto-validate-toggle"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-validation-markers-toggle"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-override-summary"]')).toBeVisible();
  await expect(page.locator('[data-testid="dev-override-summary-counts"]')).toContainText("Modified:");
  const initialOverrideSummary = (await page.locator('[data-testid="dev-override-summary-counts"]').textContent()) ?? "";
  const initialAddedCount = Number(initialOverrideSummary.match(/Added:\s*(\d+)/)?.[1] ?? 0);
  await expect(page.locator('[data-testid="dev-object-inspector"]')).toContainText("No object selected");
  await page.locator('[data-testid="dev-add-elevator"]').click();
  await expect(page.locator('[data-testid="dev-inspector-type"]')).toContainText("moving-platform");
  await expect(page.locator('[data-inspector-field="axis"]')).toHaveValue("vertical");
  await expect(page.locator('[data-inspector-field="speed"]')).toHaveValue("28");
  await expect(page.locator('[data-testid="dev-override-summary-counts"]')).toContainText(`Added: ${initialAddedCount + 1}`);
  await page.locator('[data-testid="dev-inspector-delete-object"]').click();
  await expect(page.locator('[data-testid="dev-object-inspector"]')).toContainText("No object selected");
  await page.locator('[data-testid="dev-validate-level"]').click();
  await expect(page.locator('[data-testid="dev-validation-summary"]')).toContainText("Errors:");
  await page.locator('[data-testid="dev-validation-markers-toggle"]').click();
  await expect(page.locator('[data-testid="dev-debug-status"]')).toContainText("Markers: on");

  await page.keyboard.press("F1");
  await expect(overlay).toBeHidden();
});
