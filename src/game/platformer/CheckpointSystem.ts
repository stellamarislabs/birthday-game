import type { CheckpointSpec } from "./levelGeometry";

export class CheckpointSystem {
  private activeRespawnPoint: Phaser.Math.Vector2;
  private activeCheckpointId: string | null = null;

  constructor(initialRespawnPoint: Phaser.Math.Vector2) {
    this.activeRespawnPoint = initialRespawnPoint.clone();
  }

  activate(checkpoint: CheckpointSpec): boolean {
    if (this.activeCheckpointId === checkpoint.id) {
      return false;
    }

    this.activeCheckpointId = checkpoint.id;
    this.activeRespawnPoint = new Phaser.Math.Vector2(checkpoint.respawnX, checkpoint.respawnY);
    return true;
  }

  getRespawnPoint(): Phaser.Math.Vector2 {
    return this.activeRespawnPoint.clone();
  }

  getActiveCheckpointId(): string | null {
    return this.activeCheckpointId;
  }
}
