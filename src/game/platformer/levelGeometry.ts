import { PHASER_THEME } from "../../ui/theme";
import { PLATFORM_COLORS } from "./constants";

export interface RectSpec {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlatformSpec extends RectSpec {
  kind: "desk" | "paper" | "folder" | "tram" | "calendar" | "brick" | "scaffold";
  label?: string;
}

export interface MovingPlatformSpec extends RectSpec {
  kind: "tram" | "paper";
  axis?: "horizontal" | "vertical";
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  speed: number;
  label?: string;
}

export interface DecorationSpec extends RectSpec {
  color: number;
  alpha?: number;
}

export interface TutorialHintSpec {
  id: string;
  x: number;
  y: number;
  text: string;
}

export interface ExhibitSpec {
  id: string;
  name: string;
  required: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WitnessFragmentSpec {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TinyDetailNoteSpec {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ArchiveKeySpec {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  feedbackMessage: string;
}

export interface ArchiveDoorSpec extends RectSpec {
  requiresKeyId: string;
  openMessage: string;
}

export interface ChoiceDoorSpec extends RectSpec {
  groupId: string;
  label: "Doubt" | "Fear" | "Distance" | "Hope" | "Trust";
  isCorrectPath: boolean;
  destinationX: number;
  destinationY: number;
  feedbackMessage: string;
}

export interface EchoFragmentSpec {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LanternSwitchSpec extends RectSpec {
  label: string;
  revealGroupId: string;
  feedbackMessage: string;
}

export interface LightRevealedPlatformSpec extends RectSpec {
  groupId: string;
  kind: "paper" | "scaffold";
  label?: string;
}

export interface LightRevealGroupSpec {
  id: string;
  platforms: LightRevealedPlatformSpec[];
}

export interface QuietEvidenceFragmentSpec {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ArgumentFragmentSpec {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CheckpointSpec {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  respawnX: number;
  respawnY: number;
}

export interface ExitSpec {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetScene: "PuzzleScene";
  targetLevelId: number;
}

export interface RebuildablePlatformSpec extends RectSpec {
  kind: "brick" | "paper" | "scaffold";
  groupId: string;
  label?: string;
}

export interface RebuildTriggerSpec extends RectSpec {
  id: string;
  groupId: string;
  message: string;
}

export interface RebuildGroupSpec {
  id: string;
  trigger: RebuildTriggerSpec;
  platforms: RebuildablePlatformSpec[];
}

export interface PlatformerLevelGeometry {
  levelId: number;
  title: string;
  worldWidth: number;
  worldHeight: number;
  playerSpawn: {
    x: number;
    y: number;
  };
  fallRespawnY: number;
  platforms: PlatformSpec[];
  movingPlatforms: MovingPlatformSpec[];
  rebuildGroups: RebuildGroupSpec[];
  decorations: DecorationSpec[];
  tutorialHints: TutorialHintSpec[];
  exhibits: ExhibitSpec[];
  witnessFragments: WitnessFragmentSpec[];
  tinyDetailNotes: TinyDetailNoteSpec[];
  archiveKeys: ArchiveKeySpec[];
  archiveDoors: ArchiveDoorSpec[];
  choiceDoors: ChoiceDoorSpec[];
  echoFragments: EchoFragmentSpec[];
  lanternSwitches: LanternSwitchSpec[];
  lightRevealGroups: LightRevealGroupSpec[];
  quietEvidenceFragments: QuietEvidenceFragmentSpec[];
  argumentFragments: ArgumentFragmentSpec[];
  checkpoints: CheckpointSpec[];
  exit: ExitSpec;
}

export const levelOneGeometry: PlatformerLevelGeometry = {
  levelId: 1,
  title: "The Envelope at the Kancelaria",
  worldWidth: 3600,
  worldHeight: 780,
  playerSpawn: {
    x: 88,
    y: 540
  },
  fallRespawnY: 760,
  platforms: [
    { id: "start-desk", kind: "desk", x: 0, y: 610, width: 400, height: 58, label: "Office entrance desk" },
    { id: "paper-stack-1", kind: "paper", x: 520, y: 570, width: 148, height: 34, label: "Paper stack" },
    { id: "folder-step", kind: "folder", x: 780, y: 520, width: 210, height: 34, label: "Folder stairs" },
    { id: "ch1_bookcase_mid", kind: "folder", x: 1040, y: 450, width: 210, height: 34, label: "Middle file shelf" },
    { id: "ch1_bookcase_upper", kind: "folder", x: 1280, y: 370, width: 150, height: 34, label: "Upper file shelf" },
    { id: "evidence-paper", kind: "paper", x: 1619, y: 197, width: 240, height: 34, label: "Upper evidence shelf" },
    { id: "ch1_upper_shelf_return", kind: "folder", x: 1940, y: 360, width: 230, height: 34, label: "Upper shelf crossing" },
    { id: "ch1_shelf_descent", kind: "paper", x: 2260, y: 450, width: 210, height: 34, label: "Safe shelf descent" },
    { id: "mid-desk", kind: "desk", x: 2520, y: 530, width: 110, height: 48, label: "Desk descent" },
    { id: "ch1_case_file_desk", kind: "desk", x: 2770, y: 610, width: 200, height: 56, label: "Case-file desk" },
    { id: "ch1_route_marker_01", kind: "paper", x: 3049, y: 569, width: 160, height: 28, label: "Glowing tram ticket" },
    { id: "ch1_city_direction_01", kind: "folder", x: 3280, y: 620, width: 280, height: 48, label: "Route line" }
  ],
  movingPlatforms: [
    {
      id: "ch1_dev_elevator_001",
      kind: "paper",
      axis: "vertical",
      x: 1466,
      y: 357,
      width: 102,
      height: 18,
      fromX: 1466,
      toX: 1466,
      fromY: 233,
      toY: 357,
      speed: 28,
      label: "Added elevator"
    }
  ],
  rebuildGroups: [],
  decorations: [
    { id: "folder-a", x: 120, y: 572, width: 72, height: 20, color: PLATFORM_COLORS.folder, alpha: 0.85 },
    { id: "folder-b", x: 260, y: 578, width: 88, height: 18, color: PLATFORM_COLORS.rose, alpha: 0.72 },
    { id: "ch1_bookcase_shelf_glow", x: 1080, y: 410, width: 520, height: 16, color: PLATFORM_COLORS.gold, alpha: 0.18 },
    { id: "ch1_upper_shelf_file_line", x: 1660, y: 308, width: 250, height: 12, color: PLATFORM_COLORS.paper, alpha: 0.2 },
    { id: "stamp-pad", x: 2590, y: 492, width: 76, height: 22, color: PLATFORM_COLORS.ink, alpha: 0.8 },
    { id: "paper-note", x: 1768, y: 308, width: 82, height: 18, color: PLATFORM_COLORS.paper, alpha: 0.9 },
    { id: "ch1_brass_key_glow_01", x: 2890, y: 560, width: 82, height: 14, color: PLATFORM_COLORS.gold, alpha: 0.5 },
    { id: "ch1_tram_ticket_glow_01", x: 3188, y: 538, width: 126, height: 18, color: PLATFORM_COLORS.paper, alpha: 0.48 },
    { id: "ch1_route_line_01", x: 3120, y: 552, width: 420, height: 5, color: PLATFORM_COLORS.gold, alpha: 0.28 },
    { id: "ch1_city_light_01", x: 3420, y: 198, width: 18, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.48 }
  ],
  tutorialHints: [
    {
      id: "movement-hint",
      x: 120,
      y: 478,
      text: "Move: A/D or Arrows   Jump: Space/W/Up"
    },
    {
      id: "envelope-hint",
      x: 2700,
      y: 534,
      text: "Collect the clue before closing the case."
    },
    {
      id: "ch1-shelf-climb-hint",
      x: 1010,
      y: 374,
      text: "Climb the file shelves, then drop back to the case desk."
    },
    {
      id: "ch1-key-ticket-hint",
      x: 2780,
      y: 492,
      text: "The envelope carries a brass key and a folded tram ticket."
    },
    {
      id: "ch1-route-awakens-hint",
      x: 3090,
      y: 500,
      text: "The route begins to glow toward the city."
    }
  ],
  exhibits: [
    {
      id: "sealed-envelope",
      name: "The Sealed Envelope",
      required: true,
      x: 1998,
      y: 261,
      width: 46,
      height: 30
    }
  ],
  witnessFragments: [],
  tinyDetailNotes: [],
  archiveKeys: [],
  archiveDoors: [],
  choiceDoors: [],
  echoFragments: [],
  lanternSwitches: [],
  lightRevealGroups: [],
  quietEvidenceFragments: [],
  argumentFragments: [],
  checkpoints: [
    {
      id: "midpoint-checkpoint",
      x: 1327,
      y: 300,
      width: 54,
      height: 80,
      respawnX: 1367,
      respawnY: 316
    },
    {
      id: "ch1-route-checkpoint",
      x: 2540,
      y: 450,
      width: 54,
      height: 80,
      respawnX: 2580,
      respawnY: 466
    }
  ],
  exit: {
    id: "case-door",
    x: 3410,
    y: 510,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 1
  }
};

export const levelTwoGeometry: PlatformerLevelGeometry = {
  levelId: 2,
  title: "The Tram of Deadlines",
  worldWidth: 5500,
  worldHeight: 980,
  playerSpawn: {
    x: 92,
    y: 658
  },
  fallRespawnY: 960,
  platforms: [
    { id: "tram-stop-start", kind: "tram", x: 0, y: 720, width: 420, height: 54, label: "Tram stop" },
    { id: "calendar-step-1", kind: "calendar", x: 510, y: 672, width: 220, height: 34, label: "Calendar pages" },
    { id: "deadline-platform", kind: "paper", x: 1260, y: 590, width: 190, height: 34, label: "Deadline sign" },
    { id: "midpoint-stop", kind: "tram", x: 1960, y: 680, width: 190, height: 50, label: "Checkpoint stop" },
    { id: "stamp-ledge", kind: "calendar", x: 2210, y: 610, width: 280, height: 34, label: "Golden validator" },
    { id: "exit-stop", kind: "tram", x: 2560, y: 720, width: 260, height: 54, label: "Stamped route" },
    { id: "ch2_rebuilt_street_start", kind: "brick", x: 2920, y: 720, width: 300, height: 54, label: "Rebuilt street" },
    { id: "ch2_scaffold_climb_low", kind: "scaffold", x: 3240, y: 640, width: 230, height: 34, label: "Brick scaffold" },
    { id: "ch2_scaffold_climb_mid", kind: "scaffold", x: 3480, y: 560, width: 200, height: 34, label: "Keyhole climb" },
    { id: "ch2_hidden_wall_floor", kind: "brick", x: 3680, y: 720, width: 420, height: 54, label: "Hidden wall floor" },
    { id: "ch2_wall_descent_step", kind: "scaffold", x: 4830, y: 600, width: 210, height: 34, label: "Wall descent" },
    { id: "ch2_river_mark_ledge", kind: "paper", x: 5000, y: 720, width: 360, height: 44, label: "Wave mark" }
  ],
  movingPlatforms: [
    {
      id: "tram-car-one",
      kind: "tram",
      axis: "horizontal",
      x: 770,
      y: 635,
      width: 200,
      height: 32,
      fromX: 770,
      toX: 1040,
      fromY: 635,
      toY: 635,
      speed: 32,
      label: "Moving tram"
    },
    {
      id: "tram-car-two",
      kind: "tram",
      axis: "horizontal",
      x: 1480,
      y: 620,
      width: 170,
      height: 32,
      fromX: 1480,
      toX: 1780,
      fromY: 620,
      toY: 620,
      speed: 32,
      label: "Late tram"
    },
    {
      id: "ch2_wall_lift",
      kind: "tram",
      axis: "vertical",
      x: 4120,
      y: 720,
      width: 320,
      height: 32,
      fromY: 500,
      toY: 720,
      speed: 20,
      label: "Hidden wall lift"
    }
  ],
  rebuildGroups: [
    {
      id: "ch2_hidden_wall_route",
      trigger: {
        id: "ch2_keyhole_trigger",
        groupId: "ch2_hidden_wall_route",
        x: 4000,
        y: 640,
        width: 72,
        height: 72,
        message: "The brass key turns. The hidden wall opens."
      },
      platforms: [
        {
          id: "ch2_wall_platform_01",
          groupId: "ch2_hidden_wall_route",
          kind: "brick",
          x: 4470,
          y: 500,
          width: 160,
          height: 30,
          label: "Opened wall"
        },
        {
          id: "ch2_wall_platform_02",
          groupId: "ch2_hidden_wall_route",
          kind: "brick",
          x: 4666,
          y: 500,
          width: 150,
          height: 30,
          label: "Rebuilt route"
        }
      ]
    }
  ],
  decorations: [
    { id: "city-light-1", x: 180, y: 130, width: 18, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.55 },
    { id: "city-light-2", x: 360, y: 168, width: 14, height: 14, color: PLATFORM_COLORS.rose, alpha: 0.45 },
    { id: "clock-face-1", x: 640, y: 140, width: 56, height: 56, color: PLATFORM_COLORS.paper, alpha: 0.18 },
    { id: "calendar-page-1", x: 1040, y: 492, width: 68, height: 46, color: PLATFORM_COLORS.paper, alpha: 0.84 },
    { id: "deadline-stamp-bg", x: 2320, y: 544, width: 76, height: 24, color: PLATFORM_COLORS.rose, alpha: 0.72 },
    { id: "city-light-3", x: 2180, y: 160, width: 16, height: 16, color: PLATFORM_COLORS.gold, alpha: 0.5 },
    { id: "ch2_route_line_after_stamp", x: 2520, y: 652, width: 1540, height: 5, color: PLATFORM_COLORS.gold, alpha: 0.24 },
    { id: "ch2_keyhole_shadow", x: 3788, y: 640, width: 34, height: 68, color: PLATFORM_COLORS.ink, alpha: 0.66 },
    { id: "ch2_hidden_wall_glow", x: 3710, y: 672, width: 230, height: 12, color: PLATFORM_COLORS.gold, alpha: 0.22 },
    { id: "ch2_wall_lift_track", x: 4284, y: 500, width: 22, height: 252, color: PLATFORM_COLORS.gold, alpha: 0.18 },
    { id: "ch2_red_brick_marker", x: 4560, y: 460, width: 82, height: 24, color: PLATFORM_COLORS.brick, alpha: 0.86 },
    { id: "ch2_vistula_wave_mark", x: 5100, y: 682, width: 112, height: 8, color: PHASER_THEME.blueRibbon, alpha: 0.55 }
  ],
  tutorialHints: [
    {
      id: "tram-balance-hint",
      x: 120,
      y: 334,
      text: "The city moves fast. Maria keeps her balance."
    },
    {
      id: "stamp-hint",
      x: 2200,
      y: 514,
      text: "Collect the Golden Stamp before closing this route."
    },
    {
      id: "ch2-validator-hint",
      x: 2260,
      y: 530,
      text: "The stamp does not close the file. It opens the route."
    },
    {
      id: "ch2-elevated-route-hint",
      x: 1320,
      y: 428,
      text: "The stamped path climbs above the tram line."
    },
    {
      id: "ch2-keyhole-hint",
      x: 3500,
      y: 596,
      text: "The key from the envelope finally has a lock."
    },
    {
      id: "ch2-wall-lift-hint",
      x: 3980,
      y: 454,
      text: "Ride the opened wall upward; the lift is slow and wide."
    },
    {
      id: "ch2-vistula-hint",
      x: 4460,
      y: 376,
      text: "The repaired wall remembers the river."
    }
  ],
  exhibits: [
    {
      id: "golden-stamp",
      name: "The Golden Stamp",
      required: true,
      x: 2348,
      y: 510,
      width: 42,
      height: 42
    }
  ],
  witnessFragments: [],
  tinyDetailNotes: [],
  archiveKeys: [],
  archiveDoors: [],
  choiceDoors: [],
  echoFragments: [],
  lanternSwitches: [],
  lightRevealGroups: [],
  quietEvidenceFragments: [],
  argumentFragments: [],
  checkpoints: [
    {
      id: "tram-midpoint-checkpoint",
      x: 2020,
      y: 600,
      width: 54,
      height: 80,
      respawnX: 2060,
      respawnY: 616
    },
    {
      id: "ch2-validator-checkpoint",
      x: 2640,
      y: 640,
      width: 54,
      height: 80,
      respawnX: 2680,
      respawnY: 656
    },
    {
      id: "ch2-hidden-wall-checkpoint",
      x: 3928,
      y: 640,
      width: 54,
      height: 80,
      respawnX: 3968,
      respawnY: 656
    }
  ],
  exit: {
    id: "tram-case-door",
    x: 5210,
    y: 610,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 2
  }
};

export const levelThreeGeometry: PlatformerLevelGeometry = {
  levelId: 3,
  title: "The Rebuilt Street",
  worldWidth: 3100,
  worldHeight: 700,
  playerSpawn: {
    x: 92,
    y: 402
  },
  fallRespawnY: 680,
  platforms: [
    { id: "old-town-start", kind: "brick", x: 0, y: 470, width: 480, height: 58, label: "Broken street" },
    { id: "facade-step-one", kind: "paper", x: 560, y: 424, width: 260, height: 34, label: "Cream facade" },
    { id: "lamp-ledge", kind: "scaffold", x: 900, y: 382, width: 250, height: 34, label: "Scaffold" },
    { id: "first-checkpoint-street", kind: "brick", x: 1210, y: 456, width: 340, height: 50, label: "Careful footing" },
    { id: "arch-base", kind: "paper", x: 1710, y: 430, width: 310, height: 36, label: "Half archway" },
    { id: "second-checkpoint-street", kind: "brick", x: 2070, y: 464, width: 360, height: 52, label: "Rebuilt corner" },
    { id: "brick-ledge", kind: "scaffold", x: 2540, y: 382, width: 290, height: 34, label: "Finished path" },
    { id: "exit-street", kind: "brick", x: 2860, y: 466, width: 230, height: 54, label: "Case door street" }
  ],
  movingPlatforms: [],
  rebuildGroups: [
    {
      id: "missing-bridge",
      trigger: {
        id: "missing-bridge-trigger",
        groupId: "missing-bridge",
        x: 1010,
        y: 314,
        width: 68,
        height: 68,
        message: "Bridge rebuilt, piece by piece."
      },
      platforms: [
        {
          id: "rebuilt-bridge-a",
          groupId: "missing-bridge",
          kind: "brick",
          x: 1160,
          y: 346,
          width: 170,
          height: 30,
          label: "New brick"
        },
        {
          id: "rebuilt-bridge-b",
          groupId: "missing-bridge",
          kind: "brick",
          x: 1360,
          y: 342,
          width: 190,
          height: 30,
          label: "New brick"
        }
      ]
    },
    {
      id: "archway-stairs",
      trigger: {
        id: "archway-stairs-trigger",
        groupId: "archway-stairs",
        x: 1940,
        y: 358,
        width: 68,
        height: 68,
        message: "The archway remembers its shape."
      },
      platforms: [
        {
          id: "rebuilt-stair-low",
          groupId: "archway-stairs",
          kind: "scaffold",
          x: 2200,
          y: 370,
          width: 180,
          height: 30,
          label: "Rebuilt step"
        },
        {
          id: "rebuilt-stair-mid",
          groupId: "archway-stairs",
          kind: "scaffold",
          x: 2400,
          y: 290,
          width: 180,
          height: 30,
          label: "Rebuilt step"
        },
        {
          id: "rebuilt-stair-high",
          groupId: "archway-stairs",
          kind: "brick",
          x: 2600,
          y: 244,
          width: 190,
          height: 30,
          label: "Rebuilt step"
        }
      ]
    }
  ],
  decorations: [
    { id: "warm-window-1", x: 150, y: 144, width: 58, height: 78, color: PLATFORM_COLORS.paper, alpha: 0.14 },
    { id: "warm-window-2", x: 338, y: 118, width: 52, height: 92, color: PLATFORM_COLORS.gold, alpha: 0.16 },
    { id: "street-lamp-1", x: 716, y: 282, width: 16, height: 120, color: PLATFORM_COLORS.gold, alpha: 0.48 },
    { id: "brick-stack-1", x: 1234, y: 416, width: 92, height: 24, color: PLATFORM_COLORS.brick, alpha: 0.82 },
    { id: "arch-window", x: 1760, y: 286, width: 86, height: 110, color: PLATFORM_COLORS.paper, alpha: 0.12 },
    { id: "street-lamp-2", x: 2152, y: 294, width: 16, height: 132, color: PLATFORM_COLORS.gold, alpha: 0.5 },
    { id: "finished-brick-stack", x: 2664, y: 346, width: 96, height: 22, color: PLATFORM_COLORS.brick, alpha: 0.8 }
  ],
  tutorialHints: [
    {
      id: "rebuilt-street-hint",
      x: 126,
      y: 338,
      text: "Some paths are built one careful piece at a time."
    },
    {
      id: "rebuild-trigger-hint",
      x: 858,
      y: 250,
      text: "Touch the glowing brick to rebuild the missing path."
    },
    {
      id: "red-brick-hint",
      x: 2484,
      y: 232,
      text: "The Red Brick waits near the finished path."
    }
  ],
  exhibits: [
    {
      id: "red-brick",
      name: "The Red Brick",
      required: true,
      x: 2666,
      y: 190,
      width: 48,
      height: 36
    }
  ],
  witnessFragments: [],
  tinyDetailNotes: [],
  archiveKeys: [],
  archiveDoors: [],
  choiceDoors: [],
  echoFragments: [],
  lanternSwitches: [],
  lightRevealGroups: [],
  quietEvidenceFragments: [],
  argumentFragments: [],
  checkpoints: [
    {
      id: "first-rebuilt-checkpoint",
      x: 1298,
      y: 376,
      width: 56,
      height: 80,
      respawnX: 1328,
      respawnY: 392
    },
    {
      id: "second-rebuilt-checkpoint",
      x: 2198,
      y: 384,
      width: 56,
      height: 80,
      respawnX: 2228,
      respawnY: 400
    }
  ],
  exit: {
    id: "rebuilt-case-door",
    x: 2960,
    y: 356,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 3
  }
};

export const levelFourGeometry: PlatformerLevelGeometry = {
  levelId: 4,
  title: "The Vistula Deposition",
  worldWidth: 5200,
  worldHeight: 960,
  playerSpawn: {
    x: 92,
    y: 668
  },
  fallRespawnY: 940,
  platforms: [
    { id: "riverbank-start", kind: "paper", x: 0, y: 720, width: 460, height: 58, label: "Lower riverbank" },
    { id: "ch3_lower_bank_rise", kind: "paper", x: 500, y: 660, width: 300, height: 34, label: "Riverbank rise" },
    { id: "bridge-fragment-one", kind: "scaffold", x: 1300, y: 610, width: 270, height: 36, label: "Bridge footing" },
    { id: "ch3_bridge_climb_low", kind: "scaffold", x: 1540, y: 540, width: 300, height: 34, label: "Bridge climb" },
    { id: "ch3_bridge_upper_beam", kind: "scaffold", x: 1780, y: 450, width: 210, height: 32, label: "Upper bridge beam" },
    { id: "first-vistula-checkpoint", kind: "scaffold", x: 2060, y: 450, width: 420, height: 52, label: "Upper bridge deck" },
    { id: "ch3_bridge_high_crossing", kind: "scaffold", x: 2510, y: 390, width: 280, height: 32, label: "Bridge overpass" },
    { id: "ch3_bridge_descent_step", kind: "paper", x: 3300, y: 530, width: 210, height: 34, label: "Underpass descent" },
    { id: "ch3_shadow_bank_drop", kind: "scaffold", x: 3499, y: 700, width: 420, height: 52, label: "Bridge shadow" },
    { id: "ch3_archive_code_step", kind: "paper", x: 4400, y: 600, width: 310, height: 34, label: "Archive code" },
    { id: "ch3_after_witness_bank", kind: "scaffold", x: 4700, y: 720, width: 180, height: 54, label: "Archive reference" },
    { id: "exit-riverbank", kind: "scaffold", x: 4960, y: 720, width: 240, height: 54, label: "Case door bank" }
  ],
  movingPlatforms: [
    {
      id: "drifting-paper-one",
      kind: "paper",
      x: 820,
      y: 650,
      width: 280,
      height: 30,
      fromX: 820,
      toX: 980,
      speed: 28,
      label: "Drifting paper"
    },
    {
      id: "drifting-paper-two",
      kind: "paper",
      x: 2820,
      y: 540,
      width: 300,
      height: 30,
      fromX: 2820,
      toX: 2960,
      speed: 28,
      label: "Witness page"
    },
    {
      id: "drifting-paper-three",
      kind: "paper",
      x: 3980,
      y: 650,
      width: 300,
      height: 30,
      fromX: 3980,
      toX: 4060,
      speed: 26,
      label: "Quiet current"
    }
  ],
  rebuildGroups: [],
  decorations: [
    { id: "water-band", x: 0, y: 776, width: 5200, height: 140, color: PLATFORM_COLORS.tram, alpha: 0.48 },
    { id: "water-reflection-1", x: 140, y: 820, width: 180, height: 8, color: PLATFORM_COLORS.gold, alpha: 0.18 },
    { id: "water-reflection-2", x: 820, y: 806, width: 220, height: 8, color: PLATFORM_COLORS.paper, alpha: 0.12 },
    { id: "bridge-silhouette-1", x: 560, y: 232, width: 760, height: 20, color: PLATFORM_COLORS.folder, alpha: 0.16 },
    { id: "ch3_upper_bridge_shadow_01", x: 1850, y: 410, width: 540, height: 18, color: PLATFORM_COLORS.ink, alpha: 0.16 },
    { id: "ch3_bridge_shadow_01", x: 3420, y: 648, width: 560, height: 28, color: PLATFORM_COLORS.ink, alpha: 0.22 },
    { id: "ch3_bridge_arch_01", x: 2480, y: 270, width: 300, height: 22, color: PLATFORM_COLORS.folder, alpha: 0.14 },
    { id: "lantern-one", x: 1720, y: 408, width: 16, height: 104, color: PLATFORM_COLORS.gold, alpha: 0.5 },
    { id: "city-light-river", x: 2380, y: 150, width: 18, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.42 },
    { id: "lantern-two", x: 2700, y: 282, width: 16, height: 118, color: PLATFORM_COLORS.gold, alpha: 0.48 },
    { id: "water-reflection-3", x: 3160, y: 832, width: 210, height: 8, color: PLATFORM_COLORS.rose, alpha: 0.12 },
    { id: "ch3_witness_silhouette_01", x: 3660, y: 596, width: 34, height: 104, color: PLATFORM_COLORS.ink, alpha: 0.42 },
    { id: "ch3_falling_note_01", x: 3730, y: 656, width: 72, height: 20, color: PLATFORM_COLORS.paper, alpha: 0.38 },
    { id: "ch3_archive_code_mark_01", x: 4468, y: 562, width: 116, height: 16, color: PLATFORM_COLORS.gold, alpha: 0.38 },
    { id: "ch3_archive_reference_glow_01", x: 4830, y: 684, width: 136, height: 18, color: PLATFORM_COLORS.paper, alpha: 0.22 }
  ],
  tutorialHints: [
    {
      id: "ch3-wave-arrival-hint",
      x: 124,
      y: 414,
      text: "The Vistula mark becomes a river path."
    },
    {
      id: "vistula-soft-truth-hint",
      x: 124,
      y: 448,
      text: "Some truths arrive softly, like paper on the river."
    },
    {
      id: "witness-fragment-hint",
      x: 1700,
      y: 404,
      text: "Climb the bridge beam; the witness waits below."
    },
    {
      id: "ch3-bridge-shadow-hint",
      x: 3200,
      y: 642,
      text: "Drop under the bridge; the quiet testimony waits there."
    },
    {
      id: "witness-note-hint",
      x: 3500,
      y: 650,
      text: "Find The Witness Note before closing this deposition."
    },
    {
      id: "ch3-archive-code-hint",
      x: 4320,
      y: 548,
      text: "At the bottom, a tiny archive code appears."
    }
  ],
  exhibits: [
    {
      id: "witness-note",
      name: "The Witness Note",
      required: true,
      x: 3860,
      y: 650,
      width: 50,
      height: 36
    }
  ],
  witnessFragments: [
    {
      id: "quiet-statement",
      text: "A quiet statement...",
      x: 1844,
      y: 410,
      width: 46,
      height: 30
    },
    {
      id: "passed-detail",
      text: "A detail others passed by...",
      x: 3370,
      y: 490,
      width: 46,
      height: 30
    },
    {
      id: "between-lines",
      text: "The truth waits between the lines...",
      x: 3768,
      y: 650,
      width: 46,
      height: 30
    },
    {
      id: "ch3-archive-code-corner",
      text: "Archive ref. 16/05-A...",
      x: 4488,
      y: 560,
      width: 48,
      height: 30
    }
  ],
  tinyDetailNotes: [],
  archiveKeys: [],
  archiveDoors: [],
  choiceDoors: [],
  echoFragments: [],
  lanternSwitches: [],
  lightRevealGroups: [],
  quietEvidenceFragments: [],
  argumentFragments: [],
  checkpoints: [
    {
      id: "first-vistula-checkpoint-zone",
      x: 2120,
      y: 370,
      width: 56,
      height: 80,
      respawnX: 2160,
      respawnY: 406
    },
    {
      id: "second-vistula-checkpoint-zone",
      x: 3600,
      y: 620,
      width: 56,
      height: 80,
      respawnX: 3640,
      respawnY: 656
    },
    {
      id: "ch3-after-witness-checkpoint-zone",
      x: 4640,
      y: 520,
      width: 56,
      height: 80,
      respawnX: 4680,
      respawnY: 556
    }
  ],
  exit: {
    id: "vistula-case-door",
    x: 5100,
    y: 610,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 4
  }
};

export const levelFiveGeometry: PlatformerLevelGeometry = {
  levelId: 5,
  title: "The Archive of Tiny Details",
  worldWidth: 5600,
  worldHeight: 1080,
  playerSpawn: {
    x: 92,
    y: 812
  },
  fallRespawnY: 1060,
  platforms: [
    { id: "archive-start-desk", kind: "desk", x: 0, y: 880, width: 500, height: 58, label: "Archive desk" },
    { id: "ch4_lower_file_aisle", kind: "folder", x: 520, y: 820, width: 330, height: 40, label: "Lower file aisle" },
    { id: "ch4_archive_code_drawer", kind: "paper", x: 850, y: 760, width: 330, height: 38, label: "Archive code drawer" },
    { id: "ch4_file_cabinet_climb_low", kind: "folder", x: 1160, y: 680, width: 330, height: 38, label: "File cabinet step" },
    { id: "ch4_file_cabinet_climb_mid", kind: "folder", x: 1540, y: 600, width: 70, height: 38, label: "File cabinet climb" },
    { id: "ch4_file_cabinet_climb_high", kind: "folder", x: 1660, y: 520, width: 360, height: 38, label: "Upper file cabinet" },
    { id: "ch4_upper_archive_path", kind: "folder", x: 1980, y: 440, width: 420, height: 40, label: "Upper archive path" },
    { id: "ch4_upper_index_shelf", kind: "paper", x: 2500, y: 440, width: 270, height: 38, label: "Index shelf" },
    { id: "ch4_drawer_gate_ledge", kind: "paper", x: 2800, y: 520, width: 240, height: 38, label: "Drawer gate" },
    { id: "ch4_lower_correction_floor", kind: "folder", x: 3320, y: 760, width: 380, height: 48, label: "Correction aisle" },
    { id: "ch4_return_file_stack", kind: "folder", x: 3700, y: 660, width: 280, height: 38, label: "Return file stack" },
    { id: "ch4_correction_step", kind: "paper", x: 3980, y: 580, width: 210, height: 36, label: "Correction step" },
    { id: "marginal-note-ledge", kind: "paper", x: 4200, y: 500, width: 240, height: 36, label: "Marginal note" },
    { id: "ch4_file_spine_step", kind: "paper", x: 4480, y: 420, width: 280, height: 36, label: "File spine" },
    { id: "ch4_silver_key_landing", kind: "folder", x: 4740, y: 590, width: 380, height: 42, label: "Silver key" },
    { id: "ch4_courthouse_index", kind: "desk", x: 5120, y: 660, width: 360, height: 54, label: "Courthouse index" }
  ],
  movingPlatforms: [
    {
      id: "sliding-drawer-one",
      kind: "paper",
      x: 3027,
      y: 516,
      width: 128,
      height: 30,
      fromX: 3027,
      toX: 3147,
      speed: 24,
      label: "Sliding drawer"
    },
    {
      id: "ch4_drawer_lift",
      kind: "paper",
      axis: "vertical",
      x: 3256,
      y: 690,
      width: 128,
      height: 32,
      fromY: 540,
      toY: 690,
      speed: 20,
      label: "Archive drawer lift"
    }
  ],
  rebuildGroups: [],
  decorations: [
    { id: "archive-shelf-bg-1", x: 120, y: 280, width: 110, height: 560, color: PLATFORM_COLORS.folder, alpha: 0.14 },
    { id: "archive-shelf-bg-2", x: 410, y: 318, width: 100, height: 470, color: PLATFORM_COLORS.gold, alpha: 0.1 },
    { id: "book-row-one", x: 620, y: 778, width: 170, height: 18, color: PLATFORM_COLORS.rose, alpha: 0.26 },
    { id: "ch4_archive_code_drawer_01", x: 930, y: 728, width: 168, height: 22, color: PLATFORM_COLORS.gold, alpha: 0.24 },
    { id: "ch4_tall_file_cabinet_bg_01", x: 1510, y: 260, width: 150, height: 330, color: PLATFORM_COLORS.folder, alpha: 0.14 },
    { id: "desk-lamp-one", x: 2074, y: 326, width: 18, height: 88, color: PLATFORM_COLORS.gold, alpha: 0.5 },
    { id: "ch4_locked_drawer_marker", x: 2180, y: 402, width: 118, height: 18, color: PLATFORM_COLORS.rose, alpha: 0.34 },
    { id: "drawer-shadow", x: 3060, y: 724, width: 420, height: 18, color: PLATFORM_COLORS.ink, alpha: 0.38 },
    { id: "ch4_lower_aisle_shadow", x: 3380, y: 812, width: 280, height: 12, color: PLATFORM_COLORS.ink, alpha: 0.24 },
    { id: "archive-shelf-bg-3", x: 3900, y: 210, width: 150, height: 440, color: PLATFORM_COLORS.paper, alpha: 0.09 },
    { id: "book-row-two", x: 4268, y: 460, width: 160, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.24 },
    { id: "ch4_no_given_margin_01", x: 4296, y: 472, width: 122, height: 14, color: PLATFORM_COLORS.rose, alpha: 0.32 },
    { id: "ch4_file_spine_glow_01", x: 4598, y: 392, width: 128, height: 16, color: PLATFORM_COLORS.paper, alpha: 0.24 },
    { id: "ch4_silver_key_reveal_01", x: 4862, y: 606, width: 98, height: 18, color: PHASER_THEME.silver, alpha: 0.5 },
    { id: "ch4_courthouse_direction_01", x: 5240, y: 624, width: 142, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.24 }
  ],
  tutorialHints: [
    {
      id: "archive-detail-hint",
      x: 124,
      y: 748,
      text: "Follow the lower files until the archive code appears."
    },
    {
      id: "ch4-archive-code-hint",
      x: 866,
      y: 706,
      text: "The archive code opens the drawer route."
    },
    {
      id: "archive-key-hint",
      x: 1030,
      y: 640,
      text: "Take the archive key before the locked file gate."
    },
    {
      id: "ch4-shelf-climb-hint",
      x: 1450,
      y: 542,
      text: "Climb the file cabinets to reach the upper archive path."
    },
    {
      id: "ch4-file-loop-hint",
      x: 3100,
      y: 506,
      text: "Ride the drawer down, then climb back toward the correction."
    },
    {
      id: "marginal-note-hint",
      x: 4070,
      y: 438,
      text: "The Marginal Note waits where the file becomes clear."
    },
    {
      id: "ch4-no-given-hint",
      x: 4340,
      y: 446,
      text: "The margin simply corrects the file: No. Given."
    },
    {
      id: "ch4-silver-key-hint",
      x: 4740,
      y: 576,
      text: "The silver key does not belong to the archive. It belongs to a door."
    }
  ],
  exhibits: [
    {
      id: "marginal-note",
      name: "The Marginal Note",
      required: true,
      x: 4386,
      y: 446,
      width: 50,
      height: 36
    }
  ],
  witnessFragments: [],
  tinyDetailNotes: [
    {
      id: "margin-detail",
      text: "A detail in the margin...",
      x: 660,
      y: 780,
      width: 46,
      height: 30
    },
    {
      id: "skipped-sentence",
      text: "A sentence everyone skipped...",
      x: 2148,
      y: 400,
      width: 46,
      height: 30
    },
    {
      id: "smallest-note",
      text: "The smallest note changes the case...",
      x: 3600,
      y: 710,
      width: 46,
      height: 30
    },
    {
      id: "ch4-no-given-correction",
      text: "No. Given.",
      x: 4254,
      y: 456,
      width: 46,
      height: 30
    },
    {
      id: "ch4-file-spine-key",
      text: "A silver key waits in the spine...",
      x: 5044,
      y: 554,
      width: 46,
      height: 30
    }
  ],
  archiveKeys: [
    {
      id: "archive-key",
      label: "Archive key",
      x: 1024,
      y: 712,
      width: 42,
      height: 32,
      feedbackMessage: "Archive key found. The locked aisle opens."
    },
    {
      id: "ch4-silver-key-reveal",
      label: "Silver key",
      x: 4974,
      y: 550,
      width: 42,
      height: 32,
      feedbackMessage: "The silver key points to the Courthouse of Echoes."
    }
  ],
  archiveDoors: [
    {
      id: "locked-archive-door",
      requiresKeyId: "archive-key",
      x: 2210,
      y: 320,
      width: 46,
      height: 120,
      openMessage: "The archive door opens for the right detail."
    }
  ],
  choiceDoors: [],
  echoFragments: [],
  lanternSwitches: [],
  lightRevealGroups: [],
  quietEvidenceFragments: [],
  argumentFragments: [],
  checkpoints: [
    {
      id: "first-archive-checkpoint-zone",
      x: 2018,
      y: 360,
      width: 56,
      height: 80,
      respawnX: 2048,
      respawnY: 376
    },
    {
      id: "second-archive-checkpoint-zone",
      x: 3458,
      y: 680,
      width: 56,
      height: 80,
      respawnX: 3488,
      respawnY: 696
    },
    {
      id: "ch4-silver-key-checkpoint-zone",
      x: 4850,
      y: 500,
      width: 56,
      height: 80,
      respawnX: 4880,
      respawnY: 516
    }
  ],
  exit: {
    id: "archive-case-door",
    x: 5300,
    y: 550,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 5
  }
};

export const levelSixGeometry: PlatformerLevelGeometry = {
  levelId: 6,
  title: "The Courthouse of Echoes",
  worldWidth: 7600,
  worldHeight: 1280,
  playerSpawn: {
    x: 92,
    y: 812
  },
  fallRespawnY: 1260,
  platforms: [
    { id: "courthouse-entrance", kind: "paper", x: 0, y: 880, width: 460, height: 58, label: "Courthouse entrance" },
    { id: "ch5_lower_courthouse_corridor", kind: "scaffold", x: 520, y: 820, width: 360, height: 48, label: "Lower court corridor" },
    { id: "echo-column-one", kind: "scaffold", x: 860, y: 760, width: 270, height: 40, label: "Column walk" },
    { id: "paper-brief-step", kind: "paper", x: 1160, y: 690, width: 150, height: 38, label: "Floating brief" },
    { id: "first-choice-floor", kind: "scaffold", x: 1359, y: 620, width: 140, height: 22, label: "First question" },
    { id: "ch5_dev_platform_001", kind: "paper", x: 1361, y: 812, width: 140, height: 22, label: "First question" },
    { id: "hope-checkpoint-floor", kind: "paper", x: 1840, y: 620, width: 270, height: 52, label: "Warmer corridor" },
    { id: "second-choice-floor", kind: "paper", x: 2490, y: 610, width: 140, height: 22, label: "Second question" },
    { id: "ch5_dev_platform_002", kind: "paper", x: 2492, y: 462, width: 140, height: 22, label: "Second question" },
    { id: "ch5_dev_platform_003", kind: "paper", x: 2492, y: 762, width: 140, height: 22, label: "Second question" },
    { id: "trust-checkpoint-floor", kind: "scaffold", x: 2961, y: 620, width: 390, height: 52, label: "Trust room" },
    { id: "silver-key-ledge", kind: "paper", x: 3350, y: 550, width: 200, height: 38, label: "Silver key ledge" },
    { id: "courthouse-exit-floor", kind: "scaffold", x: 3520, y: 619, width: 340, height: 54, label: "Case door hall" },
    { id: "ch5_court_balcony_01", kind: "paper", x: 3890, y: 570, width: 170, height: 18, label: "Upper court balcony" },
    { id: "ch5_trust_door_threshold", kind: "paper", x: 4080, y: 700, width: 330, height: 52, label: "Trust door threshold" },
    { id: "ch5_lantern_path_base", kind: "scaffold", x: 4440, y: 860, width: 270, height: 54, label: "Lantern path" },
    { id: "ch5_elevator_mid_ledge", kind: "folder", x: 5560, y: 640, width: 200, height: 44, label: "Middle court landing" },
    { id: "ch5_argument_rest_01", kind: "folder", x: 5960, y: 480, width: 380, height: 42, label: "Lantern-lit clause" },
    { id: "ch5_argument_rest_02", kind: "paper", x: 6380, y: 440, width: 110, height: 32, label: "Ribbon argument" },
    { id: "ch5_blue_ribbon_pages", kind: "folder", x: 6920, y: 250, width: 260, height: 46, label: "Blue Ribbon pages" },
    { id: "ch5_puzzle_exit_desk", kind: "scaffold", x: 7220, y: 330, width: 340, height: 52, label: "Letter case door" }
  ],
  movingPlatforms: [
    {
      id: "floating-brief-one",
      kind: "paper",
      x: 2171,
      y: 620,
      width: 112,
      height: 30,
      fromX: 2111,
      toX: 2289,
      speed: 28,
      label: "Quiet echo"
    },
    {
      id: "ch5_dev_elevator_001",
      kind: "paper",
      axis: "vertical",
      x: 2376,
      y: 657,
      width: 112,
      height: 32,
      fromX: 2376,
      toX: 2376,
      fromY: 433,
      toY: 757,
      speed: 28,
      label: "Added elevator"
    },
    {
      id: "ch5_elevator_01",
      kind: "paper",
      axis: "vertical",
      x: 5280,
      y: 800,
      width: 260,
      height: 32,
      fromY: 620,
      toY: 800,
      speed: 22,
      label: "Trust lift"
    },
    {
      id: "ch5_elevator_02",
      kind: "paper",
      axis: "vertical",
      x: 5780,
      y: 680,
      width: 170,
      height: 32,
      fromY: 500,
      toY: 680,
      speed: 22,
      label: "Lantern lift"
    },
    {
      id: "ch5_elevator_03",
      kind: "paper",
      axis: "vertical",
      x: 6540,
      y: 400,
      width: 320,
      height: 32,
      fromY: 260,
      toY: 400,
      speed: 20,
      label: "Ribbon lift"
    }
  ],
  rebuildGroups: [],
  decorations: [
    { id: "night-court-silhouette", x: 80, y: 280, width: 260, height: 260, color: PLATFORM_COLORS.folder, alpha: 0.1 },
    { id: "column-bg-one", x: 620, y: 420, width: 42, height: 360, color: PLATFORM_COLORS.paper, alpha: 0.16 },
    { id: "column-bg-two", x: 1010, y: 332, width: 42, height: 390, color: PLATFORM_COLORS.gold, alpha: 0.14 },
    { id: "door-glow-one", x: 1510, y: 562, width: 180, height: 12, color: PLATFORM_COLORS.rose, alpha: 0.22 },
    { id: "warm-court-light", x: 1960, y: 310, width: 22, height: 22, color: PLATFORM_COLORS.gold, alpha: 0.46 },
    { id: "echo-paper-bg", x: 2250, y: 498, width: 120, height: 18, color: PLATFORM_COLORS.paper, alpha: 0.22 },
    { id: "door-glow-two", x: 2580, y: 562, width: 240, height: 12, color: PLATFORM_COLORS.gold, alpha: 0.2 },
    { id: "trust-light", x: 3150, y: 322, width: 24, height: 24, color: PLATFORM_COLORS.gold, alpha: 0.5 },
    { id: "silver-key-glow", x: 3340, y: 482, width: 82, height: 18, color: PHASER_THEME.silver, alpha: 0.42 },
    { id: "ch5_trust_door_glow", x: 4160, y: 632, width: 180, height: 14, color: PLATFORM_COLORS.gold, alpha: 0.32 },
    { id: "ch5_lantern_glow", x: 4540, y: 790, width: 130, height: 20, color: PLATFORM_COLORS.gold, alpha: 0.44 },
    { id: "ch5_lantern_path_reflection", x: 4680, y: 868, width: 420, height: 9, color: PLATFORM_COLORS.paper, alpha: 0.16 },
    { id: "ch5_vertical_column_left", x: 5220, y: 320, width: 34, height: 520, color: PLATFORM_COLORS.folder, alpha: 0.12 },
    { id: "ch5_vertical_column_right", x: 6620, y: 160, width: 32, height: 680, color: PLATFORM_COLORS.paper, alpha: 0.08 },
    { id: "ch5_argument_page_lines", x: 6080, y: 518, width: 130, height: 10, color: PLATFORM_COLORS.gold, alpha: 0.26 },
    { id: "ch5_blue_ribbon_glow", x: 7040, y: 212, width: 146, height: 20, color: PHASER_THEME.blueRibbon, alpha: 0.5 },
    { id: "ch5_unfinished_letter_glow", x: 7000, y: 294, width: 88, height: 18, color: PLATFORM_COLORS.paper, alpha: 0.36 }
  ],
  tutorialHints: [
    {
      id: "choice-door-hint",
      x: 124,
      y: 748,
      text: "Some doors answer only when the right question is asked."
    },
    {
      id: "first-choice-hint",
      x: 1350,
      y: 556,
      text: "Step into a doorway. Wrong echoes return safely."
    },
    {
      id: "silver-key-hint",
      x: 3120,
      y: 476,
      text: "The Silver Key waits after trust is chosen."
    },
    {
      id: "ch5-lantern-path-hint",
      x: 4260,
      y: 768,
      text: "Behind Trust, a lantern lights the next path."
    },
    {
      id: "ch5-elevator-hint",
      x: 5020,
      y: 740,
      text: "Ride the wide pages upward. They move slowly."
    },
    {
      id: "ch5-blue-ribbon-hint",
      x: 6820,
      y: 194,
      text: "The Blue Ribbon releases the unfinished letter."
    }
  ],
  exhibits: [
    {
      id: "silver-key",
      name: "The Silver Key",
      required: true,
      x: 3433,
      y: 506,
      width: 52,
      height: 32
    }
  ],
  witnessFragments: [],
  tinyDetailNotes: [],
  archiveKeys: [],
  archiveDoors: [],
  choiceDoors: [
    {
      id: "door-doubt",
      groupId: "first-choice",
      label: "Doubt",
      isCorrectPath: false,
      x: 1390,
      y: 500,
      width: 78,
      height: 120,
      destinationX: 980,
      destinationY: 696,
      feedbackMessage: "The echo fades. Try listening again."
    },
    {
      id: "door-hope",
      groupId: "first-choice",
      label: "Hope",
      isCorrectPath: true,
      x: 1389,
      y: 690,
      width: 78,
      height: 120,
      destinationX: 1920,
      destinationY: 556,
      feedbackMessage: "A warmer door opens."
    },
    {
      id: "door-fear",
      groupId: "second-choice",
      label: "Fear",
      isCorrectPath: false,
      x: 2520,
      y: 490,
      width: 78,
      height: 120,
      destinationX: 2260,
      destinationY: 476,
      feedbackMessage: "The corridor grows quiet, but it does not close."
    },
    {
      id: "door-trust",
      groupId: "second-choice",
      label: "Trust",
      isCorrectPath: true,
      x: 2510,
      y: 340,
      width: 96,
      height: 120,
      destinationX: 3150,
      destinationY: 556,
      feedbackMessage: "The key turns softly."
    },
    {
      id: "door-distance",
      groupId: "second-choice",
      label: "Distance",
      isCorrectPath: false,
      x: 2510,
      y: 640,
      width: 96,
      height: 120,
      destinationX: 2260,
      destinationY: 476,
      feedbackMessage: "Some paths return until the right one is chosen."
    }
  ],
  echoFragments: [
    {
      id: "difficult-days",
      text: "What remains when days are difficult?",
      x: 990,
      y: 720,
      width: 46,
      height: 30
    },
    {
      id: "fear-quiet",
      text: "What opens when fear becomes quiet?",
      x: 2268,
      y: 580,
      width: 46,
      height: 30
    },
    {
      id: "trust-again",
      text: "What does trust choose again?",
      x: 3138,
      y: 580,
      width: 46,
      height: 30
    }
  ],
  lanternSwitches: [
    {
      id: "ch5_lantern_switch_01",
      label: "Lantern",
      revealGroupId: "ch5_lantern_path",
      x: 4560,
      y: 780,
      width: 56,
      height: 80,
      feedbackMessage: "The lantern lights the pages beyond Trust."
    }
  ],
  lightRevealGroups: [
    {
      id: "ch5_lantern_path",
      platforms: [
        {
          id: "ch5_lantern_bridge_01",
          groupId: "ch5_lantern_path",
          kind: "paper",
          x: 4720,
          y: 820,
          width: 260,
          height: 30,
          label: "Lantern bridge"
        },
        {
          id: "ch5_lantern_bridge_02",
          groupId: "ch5_lantern_path",
          kind: "scaffold",
          x: 4990,
          y: 820,
          width: 270,
          height: 30,
          label: "Lantern bridge"
        }
      ]
    }
  ],
  quietEvidenceFragments: [],
  argumentFragments: [
    {
      id: "ch5_lantern_pages",
      text: "The lantern lights what Trust opens.",
      x: 4660,
      y: 820,
      width: 48,
      height: 30
    },
    {
      id: "ch5_ribbon_releases_letter",
      text: "The Blue Ribbon releases the unfinished letter.",
      x: 7080,
      y: 210,
      width: 48,
      height: 30
    }
  ],
  checkpoints: [
    {
      id: "hope-checkpoint-zone",
      x: 1900,
      y: 540,
      width: 56,
      height: 80,
      respawnX: 1930,
      respawnY: 556
    },
    {
      id: "trust-checkpoint-zone",
      x: 3010,
      y: 540,
      width: 56,
      height: 80,
      respawnX: 3040,
      respawnY: 556
    },
    {
      id: "ch5_elevator_checkpoint_zone",
      x: 5150,
      y: 740,
      width: 56,
      height: 80,
      respawnX: 5180,
      respawnY: 756
    },
    {
      id: "ch5_ribbon_checkpoint_zone",
      x: 6940,
      y: 170,
      width: 56,
      height: 80,
      respawnX: 6970,
      respawnY: 186
    }
  ],
  exit: {
    id: "ch5_blue_ribbon_case_door",
    x: 7280,
    y: 220,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 6
  }
};

export const levelSevenGeometry: PlatformerLevelGeometry = {
  levelId: 7,
  title: "The Garden of Quiet Evidence",
  worldWidth: 3200,
  worldHeight: 680,
  playerSpawn: {
    x: 92,
    y: 402
  },
  fallRespawnY: 660,
  platforms: [
    { id: "garden-path-start", kind: "paper", x: 0, y: 470, width: 520, height: 58, label: "Garden path" },
    { id: "bench-step-one", kind: "scaffold", x: 560, y: 430, width: 320, height: 36, label: "Quiet bench" },
    { id: "first-lantern-base", kind: "paper", x: 900, y: 468, width: 230, height: 52, label: "First lantern" },
    { id: "garden-checkpoint-path", kind: "scaffold", x: 1460, y: 458, width: 360, height: 52, label: "Soft evidence" },
    { id: "flower-step", kind: "paper", x: 1880, y: 410, width: 280, height: 34, label: "Flower stones" },
    { id: "second-lantern-base", kind: "scaffold", x: 2220, y: 458, width: 330, height: 52, label: "Second lantern" },
    { id: "garden-exit-path", kind: "paper", x: 2860, y: 466, width: 300, height: 54, label: "Warm path" }
  ],
  movingPlatforms: [],
  rebuildGroups: [],
  decorations: [
    { id: "garden-water-band", x: 0, y: 526, width: 3200, height: 100, color: PHASER_THEME.deepBlueNavy, alpha: 0.32 },
    { id: "garden-shadow-one", x: 120, y: 130, width: 220, height: 160, color: PLATFORM_COLORS.folder, alpha: 0.09 },
    { id: "garden-light-one", x: 410, y: 168, width: 20, height: 20, color: PLATFORM_COLORS.gold, alpha: 0.38 },
    { id: "flower-cluster-one", x: 650, y: 396, width: 64, height: 14, color: PLATFORM_COLORS.rose, alpha: 0.36 },
    { id: "lantern-glow-one", x: 986, y: 374, width: 90, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.38 },
    { id: "water-reflection-garden", x: 1220, y: 565, width: 210, height: 7, color: PLATFORM_COLORS.paper, alpha: 0.14 },
    { id: "flower-cluster-two", x: 1980, y: 378, width: 84, height: 14, color: PLATFORM_COLORS.rose, alpha: 0.28 },
    { id: "lantern-glow-two", x: 2326, y: 366, width: 96, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.42 },
    { id: "garden-light-two", x: 2800, y: 146, width: 22, height: 22, color: PLATFORM_COLORS.gold, alpha: 0.36 }
  ],
  tutorialHints: [
    {
      id: "quiet-evidence-hint",
      x: 124,
      y: 338,
      text: "Some evidence glows quietly."
    },
    {
      id: "lantern-switch-hint",
      x: 740,
      y: 328,
      text: "Touch a lantern to reveal a softer path."
    },
    {
      id: "lantern-exhibit-hint",
      x: 2580,
      y: 282,
      text: "The Lantern waits where the garden becomes warm."
    }
  ],
  exhibits: [
    {
      id: "lantern",
      name: "The Lantern",
      required: true,
      x: 2736,
      y: 298,
      width: 48,
      height: 42
    }
  ],
  witnessFragments: [],
  tinyDetailNotes: [],
  archiveKeys: [],
  archiveDoors: [],
  choiceDoors: [],
  echoFragments: [],
  lanternSwitches: [
    {
      id: "first-garden-lantern",
      label: "Lantern I",
      revealGroupId: "soft-bridge",
      x: 990,
      y: 388,
      width: 54,
      height: 80,
      feedbackMessage: "A quiet light opens the path."
    },
    {
      id: "second-garden-lantern",
      label: "Lantern II",
      revealGroupId: "warm-steps",
      x: 2340,
      y: 378,
      width: 54,
      height: 80,
      feedbackMessage: "The garden answers softly."
    }
  ],
  lightRevealGroups: [
    {
      id: "soft-bridge",
      platforms: [
        { id: "soft-bridge-low", groupId: "soft-bridge", kind: "paper", x: 1130, y: 412, width: 220, height: 30, label: "Soft bridge" },
        { id: "soft-bridge-high", groupId: "soft-bridge", kind: "paper", x: 1360, y: 408, width: 220, height: 30, label: "Soft bridge" }
      ]
    },
    {
      id: "warm-steps",
      platforms: [
        { id: "warm-step-low", groupId: "warm-steps", kind: "scaffold", x: 2530, y: 396, width: 220, height: 30, label: "Warm step" },
        { id: "warm-step-high", groupId: "warm-steps", kind: "paper", x: 2720, y: 356, width: 230, height: 30, label: "Warm step" }
      ]
    }
  ],
  quietEvidenceFragments: [
    {
      id: "soft-light-hard-day",
      text: "A soft light on a hard day...",
      x: 674,
      y: 390,
      width: 46,
      height: 30
    },
    {
      id: "calm-middle-noise",
      text: "A calm place in the middle of noise...",
      x: 1940,
      y: 368,
      width: 46,
      height: 30
    },
    {
      id: "quiet-evidence",
      text: "Evidence does not always need to be loud...",
      x: 2924,
      y: 426,
      width: 46,
      height: 30
    }
  ],
  argumentFragments: [],
  checkpoints: [
    {
      id: "garden-checkpoint-zone",
      x: 1588,
      y: 378,
      width: 56,
      height: 80,
      respawnX: 1618,
      respawnY: 394
    }
  ],
  exit: {
    id: "garden-case-door",
    x: 3036,
    y: 356,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 7
  }
};

export const levelEightGeometry: PlatformerLevelGeometry = {
  levelId: 8,
  title: "The Tower of Arguments",
  worldWidth: 1200,
  worldHeight: 1900,
  playerSpawn: {
    x: 110,
    y: 1742
  },
  fallRespawnY: 1880,
  platforms: [
    { id: "argument-tower-base", kind: "paper", x: 0, y: 1810, width: 500, height: 58, label: "Tower base" },
    { id: "claim-step", kind: "folder", x: 520, y: 1734, width: 320, height: 36, label: "Claim" },
    { id: "first-checkpoint-argument", kind: "scaffold", x: 80, y: 1458, width: 390, height: 52, label: "First premise" },
    { id: "paragraph-step-one", kind: "paper", x: 520, y: 1372, width: 300, height: 34, label: "Paragraph" },
    { id: "paragraph-step-two", kind: "folder", x: 210, y: 1268, width: 280, height: 34, label: "Clause" },
    { id: "middle-argument-landing", kind: "paper", x: 380, y: 1088, width: 360, height: 42, label: "Reasoning" },
    { id: "second-checkpoint-argument", kind: "scaffold", x: 60, y: 930, width: 400, height: 52, label: "Stronger footing" },
    { id: "final-page-step", kind: "paper", x: 520, y: 846, width: 320, height: 34, label: "Final page" },
    { id: "top-ribbon-landing", kind: "folder", x: 470, y: 660, width: 360, height: 42, label: "Conclusion" },
    { id: "blue-ribbon-ledge", kind: "paper", x: 790, y: 550, width: 320, height: 34, label: "Blue Ribbon" }
  ],
  movingPlatforms: [
    {
      id: "argument-elevator-one",
      kind: "paper",
      axis: "vertical",
      x: 820,
      y: 1682,
      width: 260,
      height: 32,
      fromY: 1454,
      toY: 1682,
      speed: 42,
      label: "Elevator clause"
    },
    {
      id: "argument-elevator-two",
      kind: "paper",
      axis: "vertical",
      x: 690,
      y: 1288,
      width: 260,
      height: 32,
      fromY: 1058,
      toY: 1288,
      speed: 40,
      label: "Rising paragraph"
    },
    {
      id: "argument-elevator-three",
      kind: "paper",
      axis: "vertical",
      x: 860,
      y: 852,
      width: 270,
      height: 32,
      fromY: 630,
      toY: 852,
      speed: 38,
      label: "Final lift"
    }
  ],
  rebuildGroups: [],
  decorations: [
    { id: "tower-shadow-left", x: 60, y: 220, width: 120, height: 1500, color: PLATFORM_COLORS.folder, alpha: 0.08 },
    { id: "tower-shadow-right", x: 1020, y: 160, width: 110, height: 1500, color: PLATFORM_COLORS.paper, alpha: 0.06 },
    { id: "argument-light-one", x: 170, y: 1590, width: 18, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.32 },
    { id: "sticky-note-one", x: 596, y: 1664, width: 82, height: 22, color: PLATFORM_COLORS.rose, alpha: 0.28 },
    { id: "paragraph-lines-one", x: 560, y: 1342, width: 180, height: 8, color: PLATFORM_COLORS.gold, alpha: 0.22 },
    { id: "argument-symbol-one", x: 258, y: 1188, width: 94, height: 16, color: PLATFORM_COLORS.paper, alpha: 0.16 },
    { id: "court-light-below", x: 150, y: 840, width: 24, height: 24, color: PLATFORM_COLORS.gold, alpha: 0.28 },
    { id: "blue-ribbon-glow", x: 866, y: 512, width: 118, height: 18, color: PHASER_THEME.blueRibbon, alpha: 0.52 },
    { id: "top-argument-light", x: 980, y: 410, width: 20, height: 20, color: PLATFORM_COLORS.gold, alpha: 0.36 }
  ],
  tutorialHints: [
    {
      id: "argument-tower-hint",
      x: 106,
      y: 1720,
      text: "A strong argument is built one step at a time."
    },
    {
      id: "elevator-hint",
      x: 642,
      y: 1612,
      text: "Ride the wide clauses upward; they move slowly."
    },
    {
      id: "blue-ribbon-hint",
      x: 660,
      y: 486,
      text: "The Blue Ribbon waits near the top of the argument."
    }
  ],
  exhibits: [
    {
      id: "blue-ribbon",
      name: "The Blue Ribbon",
      required: true,
      x: 900,
      y: 496,
      width: 54,
      height: 38
    }
  ],
  witnessFragments: [],
  tinyDetailNotes: [],
  archiveKeys: [],
  archiveDoors: [],
  choiceDoors: [],
  echoFragments: [],
  lanternSwitches: [],
  lightRevealGroups: [],
  quietEvidenceFragments: [],
  argumentFragments: [
    {
      id: "claim-with-care",
      text: "A claim without care is only noise.",
      x: 612,
      y: 1694,
      width: 48,
      height: 30
    },
    {
      id: "evidence-weight",
      text: "Evidence gives the argument weight.",
      x: 300,
      y: 1228,
      width: 48,
      height: 30
    },
    {
      id: "proof-lived",
      text: "The strongest proof is lived.",
      x: 572,
      y: 620,
      width: 48,
      height: 30
    }
  ],
  checkpoints: [
    {
      id: "first-argument-checkpoint-zone",
      x: 214,
      y: 1378,
      width: 56,
      height: 80,
      respawnX: 244,
      respawnY: 1394
    },
    {
      id: "second-argument-checkpoint-zone",
      x: 214,
      y: 850,
      width: 56,
      height: 80,
      respawnX: 244,
      respawnY: 866
    }
  ],
  exit: {
    id: "argument-case-door",
    x: 1010,
    y: 440,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 8
  }
};

export const levelNineGeometry: PlatformerLevelGeometry = {
  levelId: 9,
  title: "The Rooftops Before the Verdict",
  worldWidth: 9100,
  worldHeight: 1420,
  playerSpawn: {
    x: 92,
    y: 1052
  },
  fallRespawnY: 1400,
  platforms: [
    { id: "rooftop-start", kind: "scaffold", x: 0, y: 1120, width: 500, height: 58, label: "Lower rooftop" },
    { id: "ch6_lower_roof_parapet", kind: "brick", x: 520, y: 1040, width: 280, height: 38, label: "Low parapet" },
    { id: "chimney-step", kind: "brick", x: 820, y: 960, width: 270, height: 38, label: "Chimney path" },
    { id: "ch6_rooftop_climb_low", kind: "brick", x: 1100, y: 870, width: 240, height: 36, label: "Rooftop climb" },
    { id: "ch6_rooftop_climb_high", kind: "brick", x: 1620, y: 700, width: 340, height: 36, label: "Upper chimney" },
    { id: "first-verdict-landing", kind: "paper", x: 1900, y: 610, width: 230, height: 42, label: "First clue echo" },
    { id: "first-rooftop-checkpoint", kind: "scaffold", x: 2740, y: 610, width: 220, height: 52, label: "Prepared footing" },
    { id: "ch6_skyline_drop_step", kind: "paper", x: 3020, y: 700, width: 360, height: 42, label: "Skyline drop" },
    { id: "ch6_lower_roof_gap", kind: "brick", x: 3340, y: 820, width: 280, height: 48, label: "Lower roof gap" },
    { id: "second-rooftop-checkpoint", kind: "scaffold", x: 3700, y: 820, width: 340, height: 52, label: "City lights" },
    { id: "lantern-roof", kind: "paper", x: 4100, y: 780, width: 240, height: 52, label: "Lantern roof" },
    { id: "verdict-lift-landing", kind: "paper", x: 4920, y: 760, width: 100, height: 44, label: "Before verdict" },
    { id: "third-rooftop-checkpoint", kind: "scaffold", x: 5100, y: 760, width: 360, height: 52, label: "Final preparation" },
    { id: "letter-ledge", kind: "paper", x: 5480, y: 660, width: 240, height: 38, label: "Unfinished letter" },
    { id: "verdict-door-roof", kind: "scaffold", x: 5740, y: 760, width: 310, height: 54, label: "Verdict threshold" },
    { id: "ch6_final_court_threshold", kind: "paper", x: 6080, y: 700, width: 300, height: 46, label: "Court threshold" },
    { id: "ch6_clue_memory_balcony", kind: "scaffold", x: 6400, y: 760, width: 330, height: 50, label: "Clue memory" },
    { id: "ch6_ascent_waiting_ledge", kind: "paper", x: 6740, y: 680, width: 390, height: 44, label: "Floating brief" },
    { id: "ch6_court_ascent_landing", kind: "paper", x: 7460, y: 500, width: 310, height: 44, label: "Quiet ascent" },
    { id: "ch6_final_court_landing", kind: "scaffold", x: 8160, y: 300, width: 320, height: 52, label: "Final court" },
    { id: "ch6_heart_seal_platform", kind: "paper", x: 8550, y: 330, width: 170, height: 30, label: "Heart seal" },
    { id: "ch6_final_door_platform", kind: "scaffold", x: 8800, y: 440, width: 260, height: 54, label: "Final door" }
  ],
  movingPlatforms: [
    {
      id: "rooftop-lift-one",
      kind: "paper",
      x: 1341,
      y: 789,
      width: 140,
      height: 18,
      fromX: 1341,
      toX: 1481,
      speed: 26,
      label: "Rooftop lift"
    },
    {
      id: "final-rooftop-lift",
      kind: "paper",
      x: 4379,
      y: 540,
      width: 112,
      height: 18,
      fromX: 4379,
      toX: 4539,
      speed: 26,
      label: "Verdict lift"
    },
    {
      id: "ch6_elevator_01",
      kind: "paper",
      axis: "vertical",
      x: 7150,
      y: 660,
      width: 280,
      height: 32,
      fromY: 500,
      toY: 660,
      speed: 20,
      label: "Floating clue"
    },
    {
      id: "ch6_elevator_02",
      kind: "paper",
      axis: "vertical",
      x: 7800,
      y: 500,
      width: 330,
      height: 32,
      fromY: 300,
      toY: 500,
      speed: 20,
      label: "Court lift"
    }
  ],
  rebuildGroups: [
    {
      id: "rooftop-bridge",
      trigger: {
        id: "rooftop-bridge-trigger",
        groupId: "rooftop-bridge",
        x: 1976,
        y: 470,
        width: 68,
        height: 68,
        message: "The earlier clues rebuild the path."
      },
      platforms: [
        {
          id: "rebuilt-rooftop-bridge-a",
          groupId: "rooftop-bridge",
          kind: "brick",
          x: 2180,
          y: 592,
          width: 250,
          height: 30,
          label: "Rebuilt roof"
        },
        {
          id: "rebuilt-rooftop-bridge-b",
          groupId: "rooftop-bridge",
          kind: "brick",
          x: 2460,
          y: 592,
          width: 250,
          height: 30,
          label: "Rebuilt roof"
        }
      ]
    }
  ],
  decorations: [
    { id: "birthday-sky-band", x: 0, y: 1160, width: 8400, height: 260, color: PHASER_THEME.midnightNavy, alpha: 0.42 },
    { id: "city-light-9-1", x: 160, y: 1200, width: 18, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.34 },
    { id: "city-light-9-2", x: 430, y: 1244, width: 14, height: 14, color: PLATFORM_COLORS.rose, alpha: 0.24 },
    { id: "chimney-one", x: 940, y: 888, width: 42, height: 72, color: PLATFORM_COLORS.folder, alpha: 0.62 },
    { id: "ch6_rooftop_skyline_01", x: 1360, y: 720, width: 420, height: 20, color: PLATFORM_COLORS.paper, alpha: 0.08 },
    { id: "case-paper-sky", x: 1988, y: 572, width: 92, height: 20, color: PLATFORM_COLORS.paper, alpha: 0.2 },
    { id: "rebuilt-roof-glow", x: 2290, y: 552, width: 260, height: 12, color: PLATFORM_COLORS.brick, alpha: 0.22 },
    { id: "warm-window-9-1", x: 3820, y: 906, width: 20, height: 20, color: PLATFORM_COLORS.gold, alpha: 0.28 },
    { id: "lantern-sky-glow", x: 4208, y: 692, width: 92, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.34 },
    { id: "paper-light-bridge", x: 4490, y: 712, width: 180, height: 10, color: PLATFORM_COLORS.paper, alpha: 0.16 },
    { id: "courthouse-distance", x: 5180, y: 288, width: 260, height: 160, color: PLATFORM_COLORS.paper, alpha: 0.08 },
    { id: "final-lantern-glow", x: 5128, y: 688, width: 84, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.32 },
    { id: "unfinished-letter-glow", x: 5576, y: 628, width: 118, height: 18, color: PLATFORM_COLORS.rose, alpha: 0.32 },
    { id: "ch6_court_sky_band", x: 6000, y: 780, width: 2800, height: 280, color: PLATFORM_COLORS.tram, alpha: 0.18 },
    { id: "ch6_court_column_left", x: 8190, y: 118, width: 34, height: 176, color: PLATFORM_COLORS.paper, alpha: 0.18 },
    { id: "ch6_court_column_right", x: 8528, y: 118, width: 34, height: 176, color: PLATFORM_COLORS.paper, alpha: 0.18 },
    { id: "ch6_final_court_beam", x: 8208, y: 142, width: 330, height: 12, color: PLATFORM_COLORS.gold, alpha: 0.18 },
    { id: "ch6_clue_marker_envelope_key_ticket", x: 6120, y: 650, width: 92, height: 24, color: PLATFORM_COLORS.paper, alpha: 0.32 },
    { id: "ch6_clue_marker_stamp_brick", x: 6420, y: 710, width: 86, height: 24, color: PLATFORM_COLORS.brick, alpha: 0.28 },
    { id: "ch6_clue_marker_witness_note", x: 6640, y: 710, width: 92, height: 22, color: PLATFORM_COLORS.paper, alpha: 0.24 },
    { id: "ch6_clue_marker_margin_key", x: 6820, y: 630, width: 90, height: 22, color: PLATFORM_COLORS.gold, alpha: 0.24 },
    { id: "ch6_clue_marker_lantern_ribbon", x: 7020, y: 630, width: 94, height: 22, color: PHASER_THEME.blueRibbon, alpha: 0.28 },
    { id: "ch6_clue_line_constellation", x: 6120, y: 592, width: 1000, height: 8, color: PLATFORM_COLORS.gold, alpha: 0.14 },
    { id: "ch6_floating_paper_trail_01", x: 7114, y: 468, width: 80, height: 18, color: PLATFORM_COLORS.paper, alpha: 0.2 },
    { id: "ch6_floating_paper_trail_02", x: 7818, y: 268, width: 82, height: 18, color: PLATFORM_COLORS.paper, alpha: 0.2 },
    { id: "ch6_heart_seal", x: 8650, y: 252, width: 96, height: 42, color: PLATFORM_COLORS.rose, alpha: 0.4 },
    { id: "ch6_final_door_aura", x: 8830, y: 402, width: 132, height: 22, color: PLATFORM_COLORS.gold, alpha: 0.28 }
  ],
  tutorialHints: [
    {
      id: "rooftop-verdict-hint",
      x: 120,
      y: 992,
      text: "All the clues are beginning to point in one direction."
    },
    {
      id: "synthesis-rebuild-hint",
      x: 1820,
      y: 532,
      text: "Touch the red brick to rebuild the rooftop bridge."
    },
    {
      id: "synthesis-lantern-hint",
      x: 3940,
      y: 690,
      text: "Lanterns reveal the softer route across the city lights."
    },
    {
      id: "unfinished-letter-hint",
      x: 5300,
      y: 614,
      text: "The Unfinished Letter waits before the verdict door."
    },
    {
      id: "ch6_memory_markers_hint",
      x: 6080,
      y: 632,
      text: "The blue ribbon released the letter. Now every clue lines up beneath it."
    },
    {
      id: "ch6_final_court_ascent_hint",
      x: 6740,
      y: 602,
      text: "Ride the floating briefs slowly. This is the last climb, not a test of speed."
    },
    {
      id: "ch6_heart_seal_hint",
      x: 8380,
      y: 224,
      text: "The final court opens when the letter points to the heart."
    }
  ],
  exhibits: [
    {
      id: "unfinished-letter",
      name: "The Unfinished Letter",
      required: true,
      x: 5580,
      y: 610,
      width: 52,
      height: 38
    }
  ],
  witnessFragments: [],
  tinyDetailNotes: [],
  archiveKeys: [],
  archiveDoors: [],
  choiceDoors: [],
  echoFragments: [],
  lanternSwitches: [
    {
      id: "city-light-lantern",
      label: "Rooftop lantern",
      revealGroupId: "city-light-bridge",
      x: 4200,
      y: 700,
      width: 54,
      height: 80,
      feedbackMessage: "A warm line of evidence appears."
    },
    {
      id: "verdict-lantern",
      label: "Verdict lantern",
      revealGroupId: "final-letter-path",
      x: 5210,
      y: 680,
      width: 54,
      height: 80,
      feedbackMessage: "The final path answers softly."
    }
  ],
  lightRevealGroups: [
    {
      id: "city-light-bridge",
      platforms: [
        { id: "city-light-bridge-a", groupId: "city-light-bridge", kind: "paper", x: 4341, y: 740, width: 260, height: 30, label: "Light bridge" },
        { id: "city-light-bridge-b", groupId: "city-light-bridge", kind: "paper", x: 4610, y: 740, width: 270, height: 30, label: "Light bridge" }
      ]
    },
    {
      id: "final-letter-path",
      platforms: [
        { id: "final-letter-path-a", groupId: "final-letter-path", kind: "scaffold", x: 5370, y: 700, width: 90, height: 30, label: "Final light" }
      ]
    }
  ],
  quietEvidenceFragments: [],
  argumentFragments: [
    {
      id: "ch6_clue_marker_envelope",
      text: "Envelope, brass key, tram ticket: the first instruction.",
      x: 6138,
      y: 650,
      width: 48,
      height: 30
    },
    {
      id: "ch6_clue_marker_stamp",
      text: "Golden stamp and red brick: the route and wall remembered.",
      x: 6440,
      y: 710,
      width: 48,
      height: 30
    },
    {
      id: "ch6_clue_marker_witness",
      text: "Witness Note: the heart was not taken by force.",
      x: 6660,
      y: 710,
      width: 48,
      height: 30
    },
    {
      id: "ch6_clue_marker_margin",
      text: "Marginal Note and Silver Key: No. Given.",
      x: 6760,
      y: 630,
      width: 48,
      height: 30
    },
    {
      id: "ch6_clue_marker_lantern",
      text: "Lantern and Blue Ribbon: trust released the unfinished letter.",
      x: 7040,
      y: 630,
      width: 48,
      height: 30
    },
    {
      id: "ch6_clue_marker_heart_seal",
      text: "The final seal waits for the heart, freely given.",
      x: 8600,
      y: 286,
      width: 48,
      height: 30
    }
  ],
  checkpoints: [
    {
      id: "first-rooftop-checkpoint-zone",
      x: 2830,
      y: 530,
      width: 56,
      height: 80,
      respawnX: 2860,
      respawnY: 546
    },
    {
      id: "second-rooftop-checkpoint-zone",
      x: 3780,
      y: 740,
      width: 56,
      height: 80,
      respawnX: 3810,
      respawnY: 756
    },
    {
      id: "third-rooftop-checkpoint-zone",
      x: 6894,
      y: 600,
      width: 56,
      height: 80,
      respawnX: 6920,
      respawnY: 616
    },
    {
      id: "ch6_final_court_checkpoint_zone",
      x: 8236,
      y: 220,
      width: 56,
      height: 80,
      respawnX: 8276,
      respawnY: 236
    }
  ],
  exit: {
    id: "ch6_final_door",
    x: 8860,
    y: 330,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 9
  }
};

export const levelTenGeometry: PlatformerLevelGeometry = {
  levelId: 10,
  title: "The Court of the Heart",
  worldWidth: 4300,
  worldHeight: 760,
  playerSpawn: {
    x: 92,
    y: 462
  },
  fallRespawnY: 740,
  platforms: [
    { id: "heart-court-start", kind: "paper", x: 0, y: 540, width: 540, height: 58, label: "Court steps" },
    { id: "envelope-memory-platform", kind: "paper", x: 610, y: 500, width: 310, height: 36, label: "First clue" },
    { id: "case-memory-landing", kind: "scaffold", x: 1260, y: 540, width: 390, height: 52, label: "Case memory" },
    { id: "first-heart-checkpoint-platform", kind: "paper", x: 1660, y: 540, width: 360, height: 52, label: "First scale" },
    { id: "lantern-verdict-platform", kind: "paper", x: 2220, y: 540, width: 360, height: 52, label: "Warm testimony" },
    { id: "second-heart-checkpoint-platform", kind: "scaffold", x: 3040, y: 540, width: 380, height: 52, label: "Second scale" },
    { id: "freely-given-approach", kind: "paper", x: 3500, y: 500, width: 300, height: 36, label: "Freely given" },
    { id: "heart-collectible-ledge", kind: "paper", x: 3820, y: 430, width: 300, height: 34, label: "Heart clue" },
    { id: "final-case-door-platform", kind: "scaffold", x: 3980, y: 540, width: 290, height: 54, label: "Final case door" }
  ],
  movingPlatforms: [
    {
      id: "memory-cloud-lift",
      kind: "paper",
      x: 940,
      y: 500,
      width: 280,
      height: 32,
      fromX: 940,
      toX: 1120,
      speed: 34,
      label: "Memory lift"
    },
    {
      id: "heart-scale-lift",
      kind: "paper",
      x: 3220,
      y: 500,
      width: 280,
      height: 32,
      fromX: 3220,
      toX: 3400,
      speed: 32,
      label: "Scale lift"
    }
  ],
  rebuildGroups: [
    {
      id: "finale-memory-bridge",
      trigger: {
        id: "finale-memory-bridge-trigger",
        groupId: "finale-memory-bridge",
        x: 1804,
        y: 464,
        width: 68,
        height: 68,
        message: "The old clues make one more gentle bridge."
      },
      platforms: [
        {
          id: "finale-memory-bridge-a",
          groupId: "finale-memory-bridge",
          kind: "paper",
          x: 2020,
          y: 500,
          width: 220,
          height: 30,
          label: "Memory bridge"
        }
      ]
    }
  ],
  decorations: [
    { id: "court-cloud-band", x: 0, y: 626, width: 4300, height: 110, color: PLATFORM_COLORS.tram, alpha: 0.2 },
    { id: "heart-court-light-1", x: 176, y: 214, width: 112, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.12 },
    { id: "heart-court-light-2", x: 720, y: 184, width: 86, height: 18, color: PLATFORM_COLORS.paper, alpha: 0.14 },
    { id: "memory-card-envelope", x: 682, y: 448, width: 74, height: 30, color: PLATFORM_COLORS.paper, alpha: 0.42 },
    { id: "memory-card-stamp", x: 1348, y: 488, width: 72, height: 28, color: PLATFORM_COLORS.gold, alpha: 0.24 },
    { id: "heart-scale-left-pillar", x: 1690, y: 368, width: 28, height: 146, color: PLATFORM_COLORS.paper, alpha: 0.14 },
    { id: "heart-scale-left-beam", x: 1728, y: 372, width: 180, height: 10, color: PLATFORM_COLORS.gold, alpha: 0.16 },
    { id: "memory-card-brick", x: 2064, y: 452, width: 78, height: 24, color: PLATFORM_COLORS.brick, alpha: 0.24 },
    { id: "lantern-heart-glow", x: 2324, y: 492, width: 96, height: 18, color: PLATFORM_COLORS.gold, alpha: 0.32 },
    { id: "witness-note-memory-card", x: 2660, y: 456, width: 92, height: 22, color: PLATFORM_COLORS.paper, alpha: 0.22 },
    { id: "heart-scale-right-pillar", x: 3104, y: 366, width: 28, height: 150, color: PLATFORM_COLORS.paper, alpha: 0.14 },
    { id: "heart-scale-right-beam", x: 3140, y: 370, width: 190, height: 10, color: PLATFORM_COLORS.gold, alpha: 0.16 },
    { id: "blue-ribbon-memory-card", x: 3564, y: 448, width: 86, height: 24, color: PHASER_THEME.blueRibbon, alpha: 0.24 },
    { id: "freely-given-glow", x: 3880, y: 398, width: 128, height: 18, color: PLATFORM_COLORS.rose, alpha: 0.34 },
    { id: "final-door-aura", x: 4072, y: 500, width: 140, height: 24, color: PLATFORM_COLORS.gold, alpha: 0.24 }
  ],
  tutorialHints: [
    {
      id: "court-heart-hint",
      x: 120,
      y: 454,
      text: "The final clue waits where the case becomes the heart."
    },
    {
      id: "memory-envelope-marker",
      x: 590,
      y: 404,
      text: "Envelope: Attention opened the case."
    },
    {
      id: "memory-stamp-marker",
      x: 1210,
      y: 454,
      text: "Stamp: Responsibility kept it moving."
    },
    {
      id: "memory-brick-marker",
      x: 1880,
      y: 424,
      text: "Brick: Patience rebuilt the path."
    },
    {
      id: "memory-witness-marker",
      x: 2390,
      y: 420,
      text: "Witness Note: Truth spoke quietly."
    },
    {
      id: "memory-margin-marker",
      x: 2570,
      y: 468,
      text: "Marginal Note: Small details mattered."
    },
    {
      id: "memory-key-marker",
      x: 2870,
      y: 440,
      text: "Silver Key: Trust opened the door."
    },
    {
      id: "memory-lantern-marker",
      x: 2240,
      y: 456,
      text: "Lantern: Warmth lit the way."
    },
    {
      id: "memory-ribbon-marker",
      x: 3400,
      y: 424,
      text: "Blue Ribbon: The strongest argument was lived."
    },
    {
      id: "memory-letter-marker",
      x: 3650,
      y: 374,
      text: "Unfinished Letter: The final words are waiting."
    }
  ],
  exhibits: [
    {
      id: "heart-freely-given",
      name: "The Heart Seal",
      required: true,
      x: 3902,
      y: 372,
      width: 54,
      height: 42
    }
  ],
  witnessFragments: [],
  tinyDetailNotes: [],
  archiveKeys: [],
  archiveDoors: [],
  choiceDoors: [],
  echoFragments: [],
  lanternSwitches: [
    {
      id: "finale-lantern-switch",
      label: "Final lantern",
      revealGroupId: "finale-light-bridge",
      x: 2324,
      y: 460,
      width: 54,
      height: 80,
      feedbackMessage: "A quiet light gathers the case."
    }
  ],
  lightRevealGroups: [
    {
      id: "finale-light-bridge",
      platforms: [
        { id: "finale-light-bridge-a", groupId: "finale-light-bridge", kind: "paper", x: 2580, y: 500, width: 220, height: 30, label: "Light bridge" },
        { id: "finale-light-bridge-b", groupId: "finale-light-bridge", kind: "paper", x: 2820, y: 500, width: 220, height: 30, label: "Light bridge" }
      ]
    }
  ],
  quietEvidenceFragments: [],
  argumentFragments: [],
  checkpoints: [
    {
      id: "first-heart-court-checkpoint-zone",
      x: 1784,
      y: 460,
      width: 56,
      height: 80,
      respawnX: 1814,
      respawnY: 476
    },
    {
      id: "second-heart-court-checkpoint-zone",
      x: 3164,
      y: 460,
      width: 56,
      height: 80,
      respawnX: 3194,
      respawnY: 476
    }
  ],
  exit: {
    id: "heart-court-final-door",
    x: 4080,
    y: 430,
    width: 76,
    height: 110,
    targetScene: "PuzzleScene",
    targetLevelId: 10
  }
};

export const platformerGeometries = {
  1: levelOneGeometry,
  2: levelTwoGeometry,
  3: levelThreeGeometry,
  4: levelFourGeometry,
  5: levelFiveGeometry,
  6: levelSixGeometry,
  7: levelSevenGeometry,
  8: levelEightGeometry,
  9: levelNineGeometry,
  10: levelTenGeometry
} as const satisfies Record<number, PlatformerLevelGeometry>;

export function getPlatformerGeometry(levelId: number): PlatformerLevelGeometry {
  return platformerGeometries[levelId as keyof typeof platformerGeometries] ?? levelOneGeometry;
}
