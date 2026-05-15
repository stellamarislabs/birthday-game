import Phaser from "phaser";
import { PLAYER_HEIGHT } from "./constants";
import {
  PLAYER_SPRITE_CROPS,
  PLAYER_SPRITE_DISPLAY_HEIGHT,
  PLAYER_SPRITE_FOOT_OFFSET_Y,
  PLAYER_SPRITE_MIN_DISPLAY_WIDTH,
  PLAYER_SPRITE_SCALE_X,
  type PlayerSpriteAssets,
  type PlayerSpriteState
} from "./playerSpriteAssets";

const STILL_VELOCITY_EPSILON = 6;
const PLAYER_SPRITE_DEPTH = 31;
const CONTACT_SHADOW_DEPTH = PLAYER_SPRITE_DEPTH - 0.25;

export class PlayerView {
  private readonly sprites: Record<PlayerSpriteState, Phaser.GameObjects.Image> | undefined;
  private readonly edgeShadows: Record<PlayerSpriteState, Phaser.GameObjects.Image> | undefined;
  private readonly contactShadow: Phaser.GameObjects.Ellipse | undefined;
  private lastFacing: 1 | -1 = 1;
  private currentState: PlayerSpriteState = "idle";

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: Phaser.GameObjects.Rectangle,
    assets: PlayerSpriteAssets
  ) {
    if (!assets.isUsable) {
      this.sprites = undefined;
      this.edgeShadows = undefined;
      this.contactShadow = undefined;
      this.player.setVisible(true).setAlpha(1);
      return;
    }

    this.player.setAlpha(0.001);
    this.contactShadow = this.scene.add.ellipse(this.player.x, this.player.y, 42, 10, 0x05070d, 0.34)
      .setDepth(CONTACT_SHADOW_DEPTH)
      .setName("platformer-player-contact-shadow");
    this.edgeShadows = {
      idle: this.createSprite("idle", assets.idle.textureKey, true),
      walk: this.createSprite("walk", assets.walk.textureKey, true),
      jump: this.createSprite("jump", assets.jump.textureKey, true)
    };
    this.sprites = {
      idle: this.createSprite("idle", assets.idle.textureKey),
      walk: this.createSprite("walk", assets.walk.textureKey),
      jump: this.createSprite("jump", assets.jump.textureKey)
    };
    this.update(0);
  }

  update(time: number): void {
    if (!this.sprites) {
      return;
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const grounded = body.blocked.down || body.touching.down;
    const velocityX = body.velocity.x;

    if (Math.abs(velocityX) > STILL_VELOCITY_EPSILON) {
      this.lastFacing = velocityX < 0 ? -1 : 1;
    }

    const nextState: PlayerSpriteState = grounded
      ? Math.abs(velocityX) > STILL_VELOCITY_EPSILON
        ? "walk"
        : "idle"
      : "jump";
    this.currentState = nextState;

    const bob = nextState === "walk" && !this.prefersReducedMotion() ? Math.sin(time / 95) * 1.2 : 0;
    const visualX = this.player.x;
    const visualY = this.player.y + PLAYER_HEIGHT / 2 + PLAYER_SPRITE_FOOT_OFFSET_Y + bob;
    const shadowY = this.player.y + PLAYER_HEIGHT / 2 + 3;

    this.contactShadow
      ?.setPosition(visualX, shadowY)
      .setAlpha(grounded ? 0.34 : 0.16)
      .setScale(Math.abs(velocityX) > STILL_VELOCITY_EPSILON ? 1.08 : 1);

    for (const [state, sprite] of Object.entries(this.sprites) as Array<[PlayerSpriteState, Phaser.GameObjects.Image]>) {
      this.edgeShadows?.[state]
        .setPosition(visualX + this.lastFacing * 1.2, visualY + 1.4)
        .setVisible(state === nextState)
        .setFlipX(this.lastFacing < 0);
      sprite
        .setPosition(visualX, visualY)
        .setVisible(state === nextState)
        .setFlipX(this.lastFacing < 0);
    }
  }

  isActive(): boolean {
    return Boolean(this.sprites);
  }

  getCurrentState(): PlayerSpriteState {
    return this.currentState;
  }

  private createSprite(state: PlayerSpriteState, textureKey: string, isEdgeShadow = false): Phaser.GameObjects.Image {
    const crop = PLAYER_SPRITE_CROPS[state];
    const displayWidth = Math.max(PLAYER_SPRITE_MIN_DISPLAY_WIDTH, PLAYER_SPRITE_DISPLAY_HEIGHT * (crop.width / crop.height)) * PLAYER_SPRITE_SCALE_X;
    const shadowExpansion = isEdgeShadow ? 4 : 0;
    const sprite = this.scene.add.image(this.player.x, this.player.y, textureKey)
      .setOrigin(0.5, 1)
      .setDepth(isEdgeShadow ? PLAYER_SPRITE_DEPTH - 0.15 : PLAYER_SPRITE_DEPTH)
      .setCrop(crop.x, crop.y, crop.width, crop.height)
      .setDisplaySize(displayWidth + shadowExpansion, PLAYER_SPRITE_DISPLAY_HEIGHT + shadowExpansion)
      .setName(`${isEdgeShadow ? "platformer-player-edge-shadow" : "platformer-player-sprite"}:${textureKey}`);
    if (isEdgeShadow) {
      sprite.setTintFill(0x04060b).setAlpha(0.28);
    }
    sprite.disableInteractive();
    return sprite;
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  }
}
