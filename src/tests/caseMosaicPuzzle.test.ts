import { describe, expect, it } from "vitest";
import { LEVEL_ONE_CASE_MOSAIC_SPEC, getCaseMosaicSpec } from "../game/puzzles/caseMosaic/caseMosaicContent";
import {
  CASE_MOSAIC_PIECE_FINAL_ASSET_FILENAMES,
  getCaseMosaicPieceFinalAsset
} from "../game/puzzles/caseMosaic/caseMosaicFinalAssets";
import { renderPieceArt } from "../game/puzzles/caseMosaic/caseMosaicRenderer";
import {
  checkCaseMosaicAnswer,
  createInitialCaseMosaicState,
  getCaseMosaicProgress,
  getMosaicSlotId,
  isCaseMosaicSolved,
  placeSelectedPieceInSlot,
  resetCaseMosaic,
  selectPiece
} from "../game/puzzles/caseMosaic/caseMosaicLogic";

function placePieceCorrectly(pieceId: string, state = createInitialCaseMosaicState(LEVEL_ONE_CASE_MOSAIC_SPEC)) {
  const piece = LEVEL_ONE_CASE_MOSAIC_SPEC.pieces.find((candidate) => candidate.id === pieceId);
  if (!piece) {
    throw new Error(`Unknown piece ${pieceId}`);
  }

  return placeSelectedPieceInSlot(
    LEVEL_ONE_CASE_MOSAIC_SPEC,
    selectPiece(state, piece.id),
    piece.correctRow,
    piece.correctCol
  );
}

describe("Chapter 1 Case Mosaic logic", () => {
  it("starts with six tray pieces and no solved route shortcut", () => {
    const state = createInitialCaseMosaicState(LEVEL_ONE_CASE_MOSAIC_SPEC);

    expect(state.trayPieceIds).toHaveLength(6);
    expect(state.placedPiecesBySlot).toEqual({});
    expect(state.solved).toBe(false);
  });

  it("places a selected piece into a slot", () => {
    const piece = LEVEL_ONE_CASE_MOSAIC_SPEC.pieces[0];
    const placed = placeSelectedPieceInSlot(
      LEVEL_ONE_CASE_MOSAIC_SPEC,
      selectPiece(createInitialCaseMosaicState(LEVEL_ONE_CASE_MOSAIC_SPEC), piece.id),
      piece.correctRow,
      piece.correctCol
    );

    expect(placed.placedPiecesBySlot[getMosaicSlotId(piece.correctRow, piece.correctCol)]).toBe(piece.id);
    expect(placed.trayPieceIds).not.toContain(piece.id);
  });

  it("stays incomplete until all six envelope pieces are placed", () => {
    const placed = placePieceCorrectly("envelope-seal");
    const result = checkCaseMosaicAnswer(LEVEL_ONE_CASE_MOSAIC_SPEC, placed);

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("incomplete");
    expect(result.feedback).toBe("The envelope is not whole yet.");
  });

  it("does not solve when all slots are filled incorrectly", () => {
    let state = createInitialCaseMosaicState(LEVEL_ONE_CASE_MOSAIC_SPEC);

    const wrongOrder = [
      ...LEVEL_ONE_CASE_MOSAIC_SPEC.pieces.slice(1),
      LEVEL_ONE_CASE_MOSAIC_SPEC.pieces[0]
    ];

    for (const [index, piece] of wrongOrder.entries()) {
      const row = Math.floor(index / LEVEL_ONE_CASE_MOSAIC_SPEC.columns);
      const col = index % LEVEL_ONE_CASE_MOSAIC_SPEC.columns;
      state = placeSelectedPieceInSlot(LEVEL_ONE_CASE_MOSAIC_SPEC, selectPiece(state, piece.id), row, col);
    }

    const result = checkCaseMosaicAnswer(LEVEL_ONE_CASE_MOSAIC_SPEC, state);

    expect(result.solved).toBe(false);
    expect(result.reason).toBe("wrong");
    expect(result.feedback).toBe("The envelope is not whole yet.");
  });

  it("solves only after the six-piece envelope mosaic is correct", () => {
    let state = createInitialCaseMosaicState(LEVEL_ONE_CASE_MOSAIC_SPEC);

    for (const piece of LEVEL_ONE_CASE_MOSAIC_SPEC.pieces) {
      state = placePieceCorrectly(piece.id, state);
    }

    const progress = getCaseMosaicProgress(LEVEL_ONE_CASE_MOSAIC_SPEC, state);
    const result = checkCaseMosaicAnswer(LEVEL_ONE_CASE_MOSAIC_SPEC, state);

    expect(progress.placedCount).toBe(6);
    expect(progress.correctCount).toBe(6);
    expect(progress.currentStep).toBe("route-glowing");
    expect(result.solved).toBe(true);
    expect(result.reason).toBe("correct");
    expect(isCaseMosaicSolved(LEVEL_ONE_CASE_MOSAIC_SPEC, result.state)).toBe(true);
    expect(result.feedback).toContain("The first clue is restored.");
    expect(result.feedback).toContain("A brass key and tram ticket fall from the envelope.");
  });

  it("reset restores the tray and empty board", () => {
    const reset = resetCaseMosaic(LEVEL_ONE_CASE_MOSAIC_SPEC);

    expect(reset.trayPieceIds).toEqual([...LEVEL_ONE_CASE_MOSAIC_SPEC.initialTrayOrder]);
    expect(reset.placedPiecesBySlot).toEqual({});
    expect(reset.solved).toBe(false);
  });
});

describe("Level 1 Case Mosaic content", () => {
  it("uses mosaic reconstruction copy", () => {
    const spec = getCaseMosaicSpec(1);

    expect(spec?.title).toBe("Case Mosaic: The Sealed Envelope");
    expect(spec?.instruction).toBe("Rebuild the envelope to reveal the first route.");
    expect(spec?.successText).toBe("The first clue is restored.");
  });

  it("keeps six envelope pieces active", () => {
    expect(LEVEL_ONE_CASE_MOSAIC_SPEC.pieces).toHaveLength(6);
  });

  it("maps each envelope piece to an optional final image asset without replacing visualKind fallback", () => {
    expect(CASE_MOSAIC_PIECE_FINAL_ASSET_FILENAMES).toEqual({
      "envelope-top-left": "puzzle01-envelope-piece-top-left.webp",
      "envelope-top-flap": "puzzle01-envelope-piece-top-flap.webp",
      "envelope-top-right": "puzzle01-envelope-piece-top-right.webp",
      "envelope-bottom-left": "puzzle01-envelope-piece-bottom-left.webp",
      "envelope-seal": "puzzle01-envelope-piece-seal.webp",
      "envelope-bottom-right": "puzzle01-envelope-piece-bottom-right.webp"
    });

    for (const piece of LEVEL_ONE_CASE_MOSAIC_SPEC.pieces) {
      const finalAsset = getCaseMosaicPieceFinalAsset(piece);

      expect(finalAsset?.filename).toBe(CASE_MOSAIC_PIECE_FINAL_ASSET_FILENAMES[piece.id]);
      expect(finalAsset?.imageUrl).toContain(CASE_MOSAIC_PIECE_FINAL_ASSET_FILENAMES[piece.id]);
      expect(piece.visualKind).toBe(piece.id);
      expect(piece.correctRow).toBeGreaterThanOrEqual(0);
      expect(piece.correctCol).toBeGreaterThanOrEqual(0);
    }
  });

  it("renders final image-backed piece art inside the existing piece markup when assets exist", () => {
    const piece = LEVEL_ONE_CASE_MOSAIC_SPEC.pieces[0];
    const markup = renderPieceArt(piece, "tray");

    expect(markup).toContain("case-mosaic-piece-image");
    expect(markup).toContain(CASE_MOSAIC_PIECE_FINAL_ASSET_FILENAMES[piece.id]);
    expect(markup).toContain(`case-mosaic-piece-art-${piece.visualKind}`);
    expect(markup).toContain("case-mosaic-mark");
  });

  it("keeps piece ids mapped to their target mosaic slots", () => {
    const slotTargets = LEVEL_ONE_CASE_MOSAIC_SPEC.pieces.map((piece) => [
      piece.id,
      getMosaicSlotId(piece.correctRow, piece.correctCol)
    ]);

    expect(slotTargets).toEqual([
      ["envelope-top-left", "r0-c0"],
      ["envelope-top-flap", "r0-c1"],
      ["envelope-top-right", "r0-c2"],
      ["envelope-bottom-left", "r1-c0"],
      ["envelope-seal", "r1-c1"],
      ["envelope-bottom-right", "r1-c2"]
    ]);
  });

  it("keeps the solved payoff connected to the key, ticket, and route", () => {
    expect(LEVEL_ONE_CASE_MOSAIC_SPEC.keyLabel).toBe("Brass Key");
    expect(LEVEL_ONE_CASE_MOSAIC_SPEC.ticketLabel).toBe("Tram Ticket");
    expect(LEVEL_ONE_CASE_MOSAIC_SPEC.routeLabel).toBe("Glowing Route");
    expect(LEVEL_ONE_CASE_MOSAIC_SPEC.successFollowUp).toContain("brass key");
    expect(LEVEL_ONE_CASE_MOSAIC_SPEC.successFollowUp).toContain("tram ticket");
  });

  it("keeps active player-facing copy out of old exhibit language", () => {
    const playerFacingCopy = [
      LEVEL_ONE_CASE_MOSAIC_SPEC.title,
      LEVEL_ONE_CASE_MOSAIC_SPEC.subtitle,
      LEVEL_ONE_CASE_MOSAIC_SPEC.instruction,
      LEVEL_ONE_CASE_MOSAIC_SPEC.successText,
      LEVEL_ONE_CASE_MOSAIC_SPEC.successFollowUp,
      LEVEL_ONE_CASE_MOSAIC_SPEC.incompleteText,
      LEVEL_ONE_CASE_MOSAIC_SPEC.wrongText
    ].join(" ");

    expect(playerFacingCopy).not.toMatch(/Exhibit/i);
  });
});
