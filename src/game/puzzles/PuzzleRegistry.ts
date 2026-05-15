import { LEVEL_FIVE_ARCHIVE_DETAIL_FINDER_SPEC } from "./archiveDetailFinder/archiveDetailFinderContent";
import { LEVEL_EIGHT_ARGUMENT_TOWER_SPEC } from "./argumentTower/argumentTowerContent";
import { LEVEL_FIVE_CASE_FILE_SORTING_SPEC } from "./caseFileSorting/caseFileSortingContent";
import { LEVEL_NINE_CASE_CONSTELLATION_SPEC } from "./caseConstellation/caseConstellationContent";
import { LEVEL_ONE_CASE_MOSAIC_SPEC } from "./caseMosaic/caseMosaicContent";
import { LEVEL_TWO_CASE_TIMELINE_SPEC } from "./caseTimeline/caseTimelineContent";
import { LEVEL_FOUR_DEPOSITION_ORDER_SPEC } from "./depositionOrder/depositionOrderContent";
import { LEVEL_SIX_ECHO_PATH_SPEC } from "./echoPath/echoPathContent";
import { LEVEL_TEN_FINAL_VERDICT_ASSEMBLY_SPEC } from "./finalVerdictAssembly/finalVerdictAssemblyContent";
import { LEVEL_SEVEN_LANTERN_SEQUENCE_SPEC } from "./lanternSequence/lanternSequenceContent";
import { LEVEL_THREE_REBUILD_PUZZLE_SPEC } from "./rebuildPuzzle/rebuildPuzzleContent";
import { LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC } from "./routeTilePuzzle/routeTilePuzzleContent";
import { LEVEL_SIX_TRUST_LIGHT_PATH_SPEC } from "./trustLightPath/trustLightPathContent";
import { LEVEL_FOUR_WITNESS_LENS_SPEC } from "./witnessLens/witnessLensContent";

export interface CaseMosaicRegistration {
  type: "case-mosaic";
  title: string;
  kind: "case-mosaic";
}

export interface CaseTimelineRegistration {
  type: "case-timeline";
  title: string;
  kind: "case-timeline";
}

export interface RebuildPuzzleRegistration {
  type: "rebuild-puzzle";
  title: string;
  kind: "rebuild-puzzle";
}

export interface RouteTilePuzzleRegistration {
  type: "route-tile-puzzle";
  title: string;
  kind: "route-tile-puzzle";
}

export interface WitnessLensRegistration {
  type: "witness-lens";
  title: string;
  kind: "witness-lens";
}

export interface DepositionOrderRegistration {
  type: "deposition-order";
  title: string;
  kind: "deposition-order";
}

export interface ArchiveDetailFinderRegistration {
  type: "archive-detail-finder";
  title: string;
  kind: "archive-detail-finder";
}

export interface CaseFileSortingRegistration {
  type: "case-file-sorting";
  title: string;
  kind: "case-file-sorting";
}

export interface EchoPathRegistration {
  type: "echo-path";
  title: string;
  kind: "echo-path";
}

export interface TrustLightPathRegistration {
  type: "trust-light-path";
  title: string;
  kind: "trust-light-path";
}

export interface LanternSequenceRegistration {
  type: "lantern-sequence";
  title: string;
  kind: "lantern-sequence";
}

export interface ArgumentTowerRegistration {
  type: "argument-tower";
  title: string;
  kind: "argument-tower";
}

export interface CaseConstellationRegistration {
  type: "case-constellation";
  title: string;
  kind: "case-constellation";
}

export interface FinalVerdictAssemblyRegistration {
  type: "final-verdict-assembly";
  title: string;
  kind: "final-verdict-assembly";
}

export interface UnsupportedPuzzle {
  type: "unsupported";
  requestedType: string;
  title: string;
}

export type PuzzleRegistration =
  | CaseMosaicRegistration
  | CaseTimelineRegistration
  | RouteTilePuzzleRegistration
  | RebuildPuzzleRegistration
  | WitnessLensRegistration
  | DepositionOrderRegistration
  | ArchiveDetailFinderRegistration
  | CaseFileSortingRegistration
  | TrustLightPathRegistration
  | EchoPathRegistration
  | LanternSequenceRegistration
  | ArgumentTowerRegistration
  | CaseConstellationRegistration
  | FinalVerdictAssemblyRegistration
  | UnsupportedPuzzle;

export function resolvePuzzleRegistration(puzzleType: string): PuzzleRegistration {
  if (puzzleType === "case-mosaic") {
    return {
      type: "case-mosaic",
      title: LEVEL_ONE_CASE_MOSAIC_SPEC.title,
      kind: "case-mosaic"
    };
  }

  if (puzzleType === "case-timeline") {
    return {
      type: "case-timeline",
      title: LEVEL_TWO_CASE_TIMELINE_SPEC.title,
      kind: "case-timeline"
    };
  }

  if (puzzleType === "route-tile-puzzle") {
    return {
      type: "route-tile-puzzle",
      title: LEVEL_THREE_ROUTE_TILE_PUZZLE_SPEC.title,
      kind: "route-tile-puzzle"
    };
  }

  if (puzzleType === "rebuild-puzzle") {
    return {
      type: "rebuild-puzzle",
      title: LEVEL_THREE_REBUILD_PUZZLE_SPEC.title,
      kind: "rebuild-puzzle"
    };
  }

  if (puzzleType === "witness-lens") {
    return {
      type: "witness-lens",
      title: LEVEL_FOUR_WITNESS_LENS_SPEC.title,
      kind: "witness-lens"
    };
  }

  if (puzzleType === "deposition-order") {
    return {
      type: "deposition-order",
      title: LEVEL_FOUR_DEPOSITION_ORDER_SPEC.title,
      kind: "deposition-order"
    };
  }

  if (puzzleType === "archive-detail-finder") {
    return {
      type: "archive-detail-finder",
      title: LEVEL_FIVE_ARCHIVE_DETAIL_FINDER_SPEC.title,
      kind: "archive-detail-finder"
    };
  }

  if (puzzleType === "case-file-sorting") {
    return {
      type: "case-file-sorting",
      title: LEVEL_FIVE_CASE_FILE_SORTING_SPEC.title,
      kind: "case-file-sorting"
    };
  }

  if (puzzleType === "echo-path") {
    return {
      type: "echo-path",
      title: LEVEL_SIX_ECHO_PATH_SPEC.title,
      kind: "echo-path"
    };
  }

  if (puzzleType === "trust-light-path") {
    return {
      type: "trust-light-path",
      title: LEVEL_SIX_TRUST_LIGHT_PATH_SPEC.title,
      kind: "trust-light-path"
    };
  }

  if (puzzleType === "lantern-sequence") {
    return {
      type: "lantern-sequence",
      title: LEVEL_SEVEN_LANTERN_SEQUENCE_SPEC.title,
      kind: "lantern-sequence"
    };
  }

  if (puzzleType === "argument-tower") {
    return {
      type: "argument-tower",
      title: LEVEL_EIGHT_ARGUMENT_TOWER_SPEC.title,
      kind: "argument-tower"
    };
  }

  if (puzzleType === "case-constellation") {
    return {
      type: "case-constellation",
      title: LEVEL_NINE_CASE_CONSTELLATION_SPEC.title,
      kind: "case-constellation"
    };
  }

  if (puzzleType === "final-verdict-assembly") {
    return {
      type: "final-verdict-assembly",
      title: LEVEL_TEN_FINAL_VERDICT_ASSEMBLY_SPEC.title,
      kind: "final-verdict-assembly"
    };
  }

  return {
    type: "unsupported",
    requestedType: puzzleType,
    title: "Puzzle placeholder"
  };
}
