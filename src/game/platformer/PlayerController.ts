import Phaser from "phaser";
import {
  COYOTE_TIME_MS,
  JUMP_BUFFER_MS,
  JUMP_SPEED,
  PLAYER_SPEED
} from "./constants";
import type { TouchControls } from "./TouchControls";

interface PlayerKeys {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
}

export class PlayerController {
  private readonly keys: PlayerKeys | null;
  private lastGroundedAt = Number.NEGATIVE_INFINITY;
  private jumpBufferedUntil = Number.NEGATIVE_INFINITY;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: Phaser.GameObjects.Rectangle,
    private readonly touchControls: TouchControls
  ) {
    this.keys = this.scene.input.keyboard
      ? ({
          left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
          right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
          up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
          a: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          d: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
          w: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
          space: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        } satisfies PlayerKeys)
      : null;
  }

  update(time: number): void {
    const body = this.getBody();
    const axis = this.getMoveAxis();

    body.setVelocityX(axis * PLAYER_SPEED);

    if (body.blocked.down || body.touching.down) {
      this.lastGroundedAt = time;
    }

    if (this.didPressJump()) {
      this.jumpBufferedUntil = time + JUMP_BUFFER_MS;
    }

    const canUseCoyoteTime = time - this.lastGroundedAt <= COYOTE_TIME_MS;
    const hasBufferedJump = time <= this.jumpBufferedUntil;

    if (canUseCoyoteTime && hasBufferedJump) {
      body.setVelocityY(-JUMP_SPEED);
      this.jumpBufferedUntil = Number.NEGATIVE_INFINITY;
      this.lastGroundedAt = Number.NEGATIVE_INFINITY;
    }
  }

  stop(): void {
    const body = this.getBody();
    body.setVelocity(0, 0);
  }

  private getMoveAxis(): number {
    const keyboardAxis =
      (this.isDown("left") || this.isDown("a") ? -1 : 0) + (this.isDown("right") || this.isDown("d") ? 1 : 0);
    const touchAxis = this.touchControls.getAxis();

    if (touchAxis !== 0) {
      return touchAxis;
    }

    return Math.sign(keyboardAxis);
  }

  private didPressJump(): boolean {
    const keyPressed =
      this.justDown("space") || this.justDown("up") || this.justDown("w") || this.touchControls.consumeJumpPressed();

    return keyPressed || (this.touchControls.isJumpHeld() && this.getBody().blocked.down);
  }

  private isDown(key: keyof PlayerKeys): boolean {
    return this.keys?.[key].isDown ?? false;
  }

  private justDown(key: keyof PlayerKeys): boolean {
    const keyObject = this.keys?.[key];
    return keyObject ? Phaser.Input.Keyboard.JustDown(keyObject) : false;
  }

  private getBody(): Phaser.Physics.Arcade.Body {
    return this.player.body as Phaser.Physics.Arcade.Body;
  }
}
