import { PHASER_THEME } from "../../ui/theme";

export const PLAYER_WIDTH = 44;
export const PLAYER_HEIGHT = 72;
export const PLAYER_INTERACTION_WIDTH = 86;
export const PLAYER_INTERACTION_HEIGHT = 112;
export const PLAYER_SPEED = 235;
export const JUMP_SPEED = 470;
export const GRAVITY_Y = 1040;
export const COYOTE_TIME_MS = 120;
export const JUMP_BUFFER_MS = 140;
export const RESPAWN_DELAY_MS = 280;

export const PLATFORM_COLORS = {
  desk: PHASER_THEME.leatherBrown,
  paper: PHASER_THEME.mainCream,
  folder: PHASER_THEME.deepGold,
  tram: PHASER_THEME.panelNavy,
  calendar: PHASER_THEME.softParchment,
  brick: PHASER_THEME.richWineRed,
  rebuild: PHASER_THEME.brassHighlight,
  rose: PHASER_THEME.roseAccent,
  gold: PHASER_THEME.antiqueGold,
  navy: PHASER_THEME.midnightNavy,
  ink: PHASER_THEME.deepBlueNavy,
  envelope: PHASER_THEME.softParchment,
  checkpoint: PHASER_THEME.roseAccent,
  portal: PHASER_THEME.brassHighlight
} as const;
