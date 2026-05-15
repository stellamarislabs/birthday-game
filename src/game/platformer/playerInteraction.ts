import { PLAYER_HEIGHT, PLAYER_INTERACTION_HEIGHT } from "./constants";

export interface PlayerInteractionZoneCenter {
  x: number;
  y: number;
}

export function getPlayerInteractionZoneCenter(playerX: number, playerY: number): PlayerInteractionZoneCenter {
  return {
    x: playerX,
    y: playerY + PLAYER_HEIGHT / 2 - PLAYER_INTERACTION_HEIGHT / 2
  };
}
