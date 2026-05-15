import Phaser from "phaser";
import { storyContent } from "../../content/story";
import { setSceneStatus } from "../../ui/sceneStatus";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import type { DevLevelEditor } from "../debug/DevLevelEditor";
import type { DevSpawn } from "../debug/debugTypes";
import type { DevLevelOverridesFile } from "../debug/devLevelOverrides";
import { collectArchiveKey, createArchiveGateState, type ArchiveGateState } from "../platformer/ArchiveGate";
import { CheckpointSystem } from "../platformer/CheckpointSystem";
import { createChoiceDoorState, resolveChoiceDoor, type ChoiceDoorState } from "../platformer/ChoiceDoor";
import { GRAVITY_Y, PLAYER_HEIGHT, RESPAWN_DELAY_MS } from "../platformer/constants";
import {
  activateLanternSwitch,
  createLanternSwitchState,
  type LanternSwitchState
} from "../platformer/LanternSwitch";
import { LevelBuilder, type BuiltPlatformerLevel } from "../platformer/LevelBuilder";
import { getPlatformerGeometry, type CheckpointSpec, type PlatformerLevelGeometry } from "../platformer/levelGeometry";
import { PLATFORMER_PLAYER_HUD_POLICY } from "../platformer/presentationPolicy";
import { PlatformerNoticeView, type PlatformerNoticeVariant } from "../platformer/PlatformerNoticeView";
import { getPlayerSpriteAssets, type PlayerSpriteAsset, type PlayerSpriteAssets } from "../platformer/playerSpriteAssets";
import { getPlayerInteractionZoneCenter } from "../platformer/playerInteraction";
import { requestChapterMusicForChapter, requestPlatformerMusicForLevel } from "../platformer/platformerMusic";
import { getPlatformerThemeAssets, type PlatformerThemeAsset, type PlatformerThemeAssets } from "../platformer/platformerThemeAssets";
import { PlayerController } from "../platformer/PlayerController";
import { PlayerView } from "../platformer/PlayerView";
import { TouchControls } from "../platformer/TouchControls";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { getAudioManager } from "../systems/AudioManager";
import { SaveManager } from "../systems/SaveManager";
import { getActiveChapterFlow } from "../systems/ChapterBridge";
import { findChapterVisualNovelSceneId, findVisualNovelSceneId } from "../systems/VnFlow";

const PLATFORMER_DEV_TOOLS_ENABLED = import.meta.env.DEV || import.meta.env.MODE === "test";
interface PlatformerSceneData {
  levelId?: number;
  chapterId?: number;
  devRoute?: boolean;
  devSpawn?: DevSpawn;
}

export class PlatformerScene extends Phaser.Scene {
  private geometry!: PlatformerLevelGeometry;
  private baseGeometry!: PlatformerLevelGeometry;
  private builtLevel!: BuiltPlatformerLevel;
  private checkpointSystem!: CheckpointSystem;
  private playerController!: PlayerController;
  private touchControls!: TouchControls;
  private saveManager!: SaveManager;
  private statusText!: PlatformerNoticeView;
  private titleCard!: PlatformerNoticeView;
  private hintText!: PlatformerNoticeView;
  private mutedText!: PlatformerNoticeView;
  private hintHideEvent?: Phaser.Time.TimerEvent;
  private restartKey?: Phaser.Input.Keyboard.Key;
  private shiftKey?: Phaser.Input.Keyboard.Key;
  private muteKey?: Phaser.Input.Keyboard.Key;
  private pauseKey?: Phaser.Input.Keyboard.Key;
  private devEditor?: DevLevelEditor;
  private devRoute = false;
  private devSpawn?: DevSpawn;
  private activeChapterId: number | null = null;
  private isLevelReady = false;
  private appliedDevOverrideIds: string[] = [];
  private activeDevOverrides?: DevLevelOverridesFile;
  private hasRequiredExhibit = false;
  private isRespawning = false;
  private isCompleting = false;
  private isPaused = false;
  private muted = false;
  private lastExitHintAt = Number.NEGATIVE_INFINITY;
  private readonly activatedRebuildGroups = new Set<string>();
  private readonly collectedWitnessFragments = new Set<string>();
  private readonly collectedTinyDetailNotes = new Set<string>();
  private readonly collectedEchoFragments = new Set<string>();
  private readonly collectedQuietEvidenceFragments = new Set<string>();
  private readonly collectedArgumentFragments = new Set<string>();
  private archiveGateState: ArchiveGateState = createArchiveGateState();
  private choiceDoorState: ChoiceDoorState = createChoiceDoorState();
  private lanternSwitchState: LanternSwitchState = createLanternSwitchState();
  private activeTheme?: PlatformerThemeAssets;
  private playerSpriteAssets?: PlayerSpriteAssets;
  private playerView?: PlayerView;

  constructor() {
    super("PlatformerScene");
  }

  create(data: PlatformerSceneData): void {
    this.isLevelReady = false;
    void this.createLevel(data);
  }

  private async createLevel(data: PlatformerSceneData): Promise<void> {
    const levelId = data.levelId ?? 1;
    this.activeChapterId = typeof data.chapterId === "number" ? data.chapterId : null;
    this.devRoute = data.devRoute === true && PLATFORMER_DEV_TOOLS_ENABLED;
    this.devSpawn = this.devRoute ? data.devSpawn : undefined;
    this.devEditor = undefined;
    this.appliedDevOverrideIds = [];
    this.activeDevOverrides = undefined;
    this.geometry = await this.getGeometryForLevel(levelId);
    this.activatedRebuildGroups.clear();
    this.collectedWitnessFragments.clear();
    this.collectedTinyDetailNotes.clear();
    this.collectedEchoFragments.clear();
    this.collectedQuietEvidenceFragments.clear();
    this.collectedArgumentFragments.clear();
    this.archiveGateState = createArchiveGateState();
    this.choiceDoorState = createChoiceDoorState();
    this.lanternSwitchState = createLanternSwitchState();
    this.hasRequiredExhibit = false;
    this.isRespawning = false;
    this.isCompleting = false;
    this.isPaused = false;
    this.saveManager = new SaveManager();
    const save = this.devRoute ? this.saveManager.load() : this.saveManager.setCurrentLevel(this.geometry.levelId);
    this.muted = save.muted;
    getAudioManager().setMuted(this.muted);
    this.activeTheme = getPlatformerThemeAssets(this.geometry.levelId);
    this.playerSpriteAssets = getPlayerSpriteAssets();
    await this.preloadPlatformerThemeAssets(this.activeTheme);
    await this.preloadPlayerSpriteAssets(this.playerSpriteAssets);
    if (!requestChapterMusicForChapter(this.activeChapterId ?? undefined, getAudioManager())) {
      requestPlatformerMusicForLevel(this.geometry.levelId, getAudioManager());
    }

    this.cameras.main.setBackgroundColor(THEME_HEX.midnightNavy);
    this.physics.world.gravity.y = GRAVITY_Y;
    this.physics.world.setBounds(0, 0, this.geometry.worldWidth, this.geometry.worldHeight);

    this.touchControls = new TouchControls();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.touchControls.destroy();
    });

    const builder = new LevelBuilder(this, this.activeTheme);
    this.builtLevel = builder.build(this.geometry);
    const initialSpawn = this.devSpawn ?? {
      x: this.geometry.playerSpawn.x,
      y: this.geometry.playerSpawn.y
    };
    this.builtLevel.player.setPosition(initialSpawn.x, initialSpawn.y);
    const playerBody = this.builtLevel.player.body as Phaser.Physics.Arcade.Body;
    playerBody.reset(initialSpawn.x, initialSpawn.y);
    this.syncPlayerInteractionZone();
    this.checkpointSystem = new CheckpointSystem(new Phaser.Math.Vector2(initialSpawn.x, initialSpawn.y));
    this.playerController = new PlayerController(this, this.builtLevel.player, this.touchControls);
    this.playerView = new PlayerView(this, this.builtLevel.player, this.playerSpriteAssets);

    this.physics.add.collider(this.builtLevel.player, this.builtLevel.platforms);
    for (const movingPlatform of this.builtLevel.movingPlatforms) {
      this.physics.add.collider(this.builtLevel.player, movingPlatform.body);
    }
    for (const rebuildablePlatform of this.builtLevel.rebuildablePlatforms) {
      this.physics.add.collider(this.builtLevel.player, rebuildablePlatform.body);
    }
    for (const lightPlatform of this.builtLevel.lightRevealedPlatforms) {
      this.physics.add.collider(this.builtLevel.player, lightPlatform.body);
    }
    for (const door of this.builtLevel.archiveDoors) {
      this.physics.add.collider(this.builtLevel.player, door.body);
    }
    this.physics.add.overlap(this.builtLevel.playerInteractionZone, this.builtLevel.exhibit, () => this.collectExhibit());
    for (const fragment of this.builtLevel.witnessFragments) {
      this.physics.add.overlap(this.builtLevel.playerInteractionZone, fragment.body, () => this.collectWitnessFragment(fragment.spec.id));
    }
    for (const note of this.builtLevel.tinyDetailNotes) {
      this.physics.add.overlap(this.builtLevel.playerInteractionZone, note.body, () => this.collectTinyDetailNote(note.spec.id));
    }
    for (const echo of this.builtLevel.echoFragments) {
      this.physics.add.overlap(this.builtLevel.playerInteractionZone, echo.body, () => this.collectEchoFragment(echo.spec.id));
    }
    for (const fragment of this.builtLevel.quietEvidenceFragments) {
      this.physics.add.overlap(this.builtLevel.playerInteractionZone, fragment.body, () => this.collectQuietEvidenceFragment(fragment.spec.id));
    }
    for (const fragment of this.builtLevel.argumentFragments) {
      this.physics.add.overlap(this.builtLevel.playerInteractionZone, fragment.body, () => this.collectArgumentFragment(fragment.spec.id));
    }
    for (const key of this.builtLevel.archiveKeys) {
      this.physics.add.overlap(this.builtLevel.playerInteractionZone, key.body, () => this.collectArchiveKey(key.spec.id));
    }
    for (const door of this.builtLevel.choiceDoors) {
      this.physics.add.overlap(this.builtLevel.player, door.zone, () => this.resolveChoiceDoor(door.spec.id));
    }

    for (const checkpoint of this.builtLevel.checkpointZones) {
      this.physics.add.overlap(this.builtLevel.player, checkpoint.zone, () => this.activateCheckpoint(checkpoint.spec));
    }

    for (const trigger of this.builtLevel.rebuildTriggers) {
      this.physics.add.overlap(this.builtLevel.playerInteractionZone, trigger.zone, () => this.activateRebuildGroup(trigger.spec.groupId));
    }
    for (const lantern of this.builtLevel.lanternSwitches) {
      this.physics.add.overlap(this.builtLevel.playerInteractionZone, lantern.zone, () => this.activateLantern(lantern.spec.id));
    }

    this.physics.add.overlap(this.builtLevel.player, this.builtLevel.exitZone, () => this.tryExitLevel());

    this.cameras.main.setBounds(0, 0, this.geometry.worldWidth, Math.max(this.geometry.worldHeight, GAME_HEIGHT));
    this.cameras.main.startFollow(this.builtLevel.player, true, 0.08, 0.08);

    this.createHud();
    this.bindSceneKeys();

    if (PLATFORMER_DEV_TOOLS_ENABLED) {
      const { DevLevelEditor } = await import("../debug/DevLevelEditor");
      this.devEditor = new DevLevelEditor({
        scene: this,
        geometry: this.geometry,
        baseGeometry: this.baseGeometry,
        builtLevel: this.builtLevel,
        devSpawn: this.devSpawn,
        appliedOverrideIds: this.appliedDevOverrideIds,
        initialOverrides: this.activeDevOverrides,
        activeChapterId: this.activeChapterId,
        getActiveCheckpointId: () => this.checkpointSystem.getActiveCheckpointId(),
        showHint: (text) => this.showHint(text)
      });
    }

    setSceneStatus(
      `platformer-level-${this.geometry.levelId}`,
      `${this.geometry.title}. Collect ${this.geometry.exhibits[0]?.name ?? "the clue"} and reach the case door.`
    );
    this.isLevelReady = true;
  }

  private preloadPlatformerThemeAssets(theme: PlatformerThemeAssets | undefined): Promise<void> {
    const assets = this.collectPlatformerThemeAssets(theme).filter(
      (asset) => asset.imageUrl && !this.textures.exists(asset.textureKey)
    );

    if (assets.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      for (const asset of assets) {
        this.load.image(asset.textureKey, asset.imageUrl);
      }
      this.load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
      this.load.start();
    });
  }

  private collectPlatformerThemeAssets(theme: PlatformerThemeAssets | undefined): PlatformerThemeAsset[] {
    if (!theme) {
      return [];
    }

    return [
      theme.background,
      ...Object.values(theme.staticPlatforms),
      ...Object.values(theme.movingPlatforms),
      theme.clues.primary,
      theme.clues.secondary,
      theme.interactables.lanternSwitch,
      theme.exitDoor,
      theme.checkpoint
    ].filter((asset): asset is PlatformerThemeAsset => Boolean(asset));
  }

  private preloadPlayerSpriteAssets(assets: PlayerSpriteAssets | undefined): Promise<void> {
    if (!assets?.isUsable) {
      return Promise.resolve();
    }

    const spriteAssets: PlayerSpriteAsset[] = [assets.idle, assets.walk, assets.jump];
    const unloadedAssets = spriteAssets.filter((asset) => asset.imageUrl && !this.textures.exists(asset.textureKey));

    if (unloadedAssets.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      for (const asset of unloadedAssets) {
        this.load.image(asset.textureKey, asset.imageUrl);
      }
      this.load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
      this.load.start();
    });
  }

  update(time: number): void {
    if (!this.isLevelReady) {
      return;
    }

    this.devEditor?.update();

    if (this.handleSceneShortcuts()) {
      return;
    }

    if (this.isPaused || this.isRespawning || this.isCompleting) {
      return;
    }

    this.updateMovingPlatforms();
    if (this.devEditor?.shouldCaptureMovementInput()) {
      return;
    }

    this.playerController.update(time);
    this.keepPlayerInsideHorizontalBounds();
    this.syncPlayerInteractionZone();
    this.playerView?.update(time);

    if (this.builtLevel.player.y > this.geometry.fallRespawnY) {
      this.respawnPlayer();
    }
  }

  private createHud(): void {
    this.titleCard = new PlatformerNoticeView(this, {
      x: GAME_WIDTH / 2,
      y: 74,
      variant: "title",
      text: this.geometry.title,
      depth: 50
    });

    this.time.delayedCall(2200, () => {
      this.titleCard.setVisible(false);
    });

    this.statusText = new PlatformerNoticeView(this, {
      x: 28,
      y: 24,
      originX: 0,
      originY: 0,
      variant: "status",
      text: "Clue: missing",
      depth: 50
    });

    this.mutedText = new PlatformerNoticeView(this, {
      x: GAME_WIDTH - 28,
      y: 24,
      originX: 1,
      originY: 0,
      variant: "sound",
      text: this.muted ? "Muted" : "Sound ready",
      depth: 50
    });
    this.mutedText.setVisible(PLATFORMER_PLAYER_HUD_POLICY.showPersistentSoundStatus);

    this.hintText = new PlatformerNoticeView(this, {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - 116,
      variant: "hint",
      text: PLATFORMER_PLAYER_HUD_POLICY.showPersistentControlHint ? storyContent.ui.restartHint : "",
      depth: 50
    });
    this.hintText.setVisible(PLATFORMER_PLAYER_HUD_POLICY.showPersistentControlHint);
  }

  private bindSceneKeys(): void {
    this.restartKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.shiftKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.muteKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.pauseKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  private handleSceneShortcuts(): boolean {
    if (this.restartKey && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.restartForDebug(PLATFORMER_DEV_TOOLS_ENABLED && this.shiftKey?.isDown === true);
      return true;
    }

    if (this.muteKey && Phaser.Input.Keyboard.JustDown(this.muteKey)) {
      this.muted = !this.muted;
      this.saveManager.setMuted(this.muted);
      getAudioManager().setMuted(this.muted);
      const muteMessage = this.muted ? "Muted" : "Sound ready";
      this.mutedText.setText(muteMessage);
      if (PLATFORMER_PLAYER_HUD_POLICY.showPersistentSoundStatus) {
        this.mutedText.setVisible(true);
      }
      this.showHint(muteMessage, 1400);
    }

    if (this.pauseKey && Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.playerController.stop();
        this.physics.world.pause();
        this.showHint("Paused", 0);
      } else {
        this.physics.world.resume();
        this.hideHint();
      }
      return true;
    }

    return false;
  }

  private restartForDebug(preservePosition: boolean): void {
    const devSpawn = preservePosition
      ? {
          x: this.builtLevel.player.x,
          y: this.builtLevel.player.y,
          source: "preserved-position" as const
        }
      : this.devSpawn;
    this.scene.restart({ levelId: this.geometry.levelId, chapterId: this.activeChapterId ?? undefined, devRoute: this.devRoute, devSpawn });
  }

  private async getGeometryForLevel(levelId: number): Promise<PlatformerLevelGeometry> {
    const baseGeometry = getPlatformerGeometry(levelId);
    this.baseGeometry = baseGeometry;
    if (!PLATFORMER_DEV_TOOLS_ENABLED) {
      return baseGeometry;
    }

    const [{ applyDevLevelOverrides }, { fetchDevLevelOverrides }] = await Promise.all([
      import("../debug/devLevelOverrides"),
      import("../debug/devLevelOverrideClient")
    ]);
    const overrides = await fetchDevLevelOverrides(baseGeometry.levelId);
    this.activeDevOverrides = overrides;
    const result = applyDevLevelOverrides(baseGeometry, overrides);
    this.appliedDevOverrideIds = result.appliedObjectIds;
    return result.geometry;
  }

  private collectExhibit(): void {
    if (this.hasRequiredExhibit) {
      return;
    }

    this.hasRequiredExhibit = true;
    this.statusText.setText(`Clue: ${this.builtLevel.exhibitSpec.name}`);
    this.showHint(`Clue collected: ${this.builtLevel.exhibitSpec.name}`);
    getAudioManager().playExhibit();

    const body = this.builtLevel.exhibit.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = false;
    this.builtLevel.exhibit.setVisible(false);
    this.builtLevel.exhibitSkin?.setVisible(false);
  }

  private collectWitnessFragment(fragmentId: string): void {
    if (this.collectedWitnessFragments.has(fragmentId)) {
      return;
    }

    const fragment = this.builtLevel.witnessFragments.find((candidate) => candidate.spec.id === fragmentId);
    if (!fragment) {
      return;
    }

    this.collectedWitnessFragments.add(fragmentId);
    this.showHint(fragment.spec.text);

    const body = fragment.body.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = false;
    fragment.body.setVisible(false);
    fragment.skin?.setVisible(false);
  }

  private collectTinyDetailNote(noteId: string): void {
    if (this.collectedTinyDetailNotes.has(noteId)) {
      return;
    }

    const note = this.builtLevel.tinyDetailNotes.find((candidate) => candidate.spec.id === noteId);
    if (!note) {
      return;
    }

    this.collectedTinyDetailNotes.add(noteId);
    this.showHint(note.spec.text);

    const body = note.body.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = false;
    note.body.setVisible(false);
    note.skin?.setVisible(false);
  }

  private collectEchoFragment(fragmentId: string): void {
    if (this.collectedEchoFragments.has(fragmentId)) {
      return;
    }

    const fragment = this.builtLevel.echoFragments.find((candidate) => candidate.spec.id === fragmentId);
    if (!fragment) {
      return;
    }

    this.collectedEchoFragments.add(fragmentId);
    this.showHint(fragment.spec.text);

    const body = fragment.body.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = false;
    fragment.body.setVisible(false);
    fragment.skin?.setVisible(false);
  }

  private collectQuietEvidenceFragment(fragmentId: string): void {
    if (this.collectedQuietEvidenceFragments.has(fragmentId)) {
      return;
    }

    const fragment = this.builtLevel.quietEvidenceFragments.find((candidate) => candidate.spec.id === fragmentId);
    if (!fragment) {
      return;
    }

    this.collectedQuietEvidenceFragments.add(fragmentId);
    this.showHint(fragment.spec.text);

    const body = fragment.body.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = false;
    fragment.body.setVisible(false);
    fragment.skin?.setVisible(false);
  }

  private collectArgumentFragment(fragmentId: string): void {
    if (this.collectedArgumentFragments.has(fragmentId)) {
      return;
    }

    const fragment = this.builtLevel.argumentFragments.find((candidate) => candidate.spec.id === fragmentId);
    if (!fragment) {
      return;
    }

    this.collectedArgumentFragments.add(fragmentId);
    this.showHint(fragment.spec.text);

    const body = fragment.body.body as Phaser.Physics.Arcade.StaticBody;
    body.enable = false;
    fragment.body.setVisible(false);
    fragment.skin?.setVisible(false);
  }

  private collectArchiveKey(keyId: string): void {
    const key = this.builtLevel.archiveKeys.find((candidate) => candidate.spec.id === keyId);
    if (!key || this.archiveGateState.collectedKeyIds.includes(keyId)) {
      return;
    }

    this.archiveGateState = collectArchiveKey(
      this.archiveGateState,
      keyId,
      this.builtLevel.archiveDoors.map((door) => door.spec)
    );

    const keyBody = key.body.body as Phaser.Physics.Arcade.StaticBody;
    keyBody.enable = false;
    key.body.setVisible(false);
    key.skin?.setVisible(false);

    this.showHint(key.spec.feedbackMessage);
    this.openArchiveDoorsForKey(keyId);
  }

  private openArchiveDoorsForKey(keyId: string): void {
    for (const door of this.builtLevel.archiveDoors.filter((candidate) => candidate.spec.requiresKeyId === keyId)) {
      const body = door.body.body as Phaser.Physics.Arcade.StaticBody;
      body.enable = false;
      door.body.setFillStyle(PHASER_THEME.brassHighlight, 0.18).setStrokeStyle(2, PHASER_THEME.antiqueGold, 0.28);
      this.showHint(door.spec.openMessage);
    }
  }

  private resolveChoiceDoor(doorId: string): void {
    const result = resolveChoiceDoor(
      this.builtLevel.choiceDoors.map((door) => ({
        id: door.spec.id,
        label: door.spec.label,
        isCorrectPath: door.spec.isCorrectPath,
        destination: {
          x: door.spec.destinationX,
          y: door.spec.destinationY
        },
        feedbackMessage: door.spec.feedbackMessage
      })),
      doorId,
      this.time.now,
      this.choiceDoorState
    );
    this.choiceDoorState = result.state;

    if (!result.resolution) {
      return;
    }

    this.showHint(result.resolution.feedbackMessage);
    this.playerController.stop();
    this.builtLevel.player.setPosition(result.resolution.destination.x, result.resolution.destination.y);
    const body = this.builtLevel.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    this.syncPlayerInteractionZone();

    const door = this.builtLevel.choiceDoors.find((candidate) => candidate.spec.id === doorId);
    door?.marker.setFillStyle(
      result.resolution.isCorrectPath ? PHASER_THEME.brassHighlight : PHASER_THEME.roseAccent,
      result.resolution.isCorrectPath ? 0.62 : 0.42
    );
  }

  private activateCheckpoint(checkpoint: CheckpointSpec): void {
    if (this.checkpointSystem.activate(checkpoint)) {
      this.showHint(storyContent.ui.checkpointActivated);
      getAudioManager().playCheckpoint();
    }
  }

  private activateRebuildGroup(groupId: string): void {
    if (this.activatedRebuildGroups.has(groupId)) {
      return;
    }

    const group = this.geometry.rebuildGroups.find((candidate) => candidate.id === groupId);
    if (!group) {
      return;
    }

    this.activatedRebuildGroups.add(groupId);
    this.showHint(group.trigger.message);

    for (const platform of this.builtLevel.rebuildablePlatforms.filter((candidate) => candidate.spec.groupId === groupId)) {
      const body = platform.body.body as Phaser.Physics.Arcade.StaticBody;
      body.enable = true;
      platform.body.setAlpha(0.92).setStrokeStyle(2, PHASER_THEME.antiqueGold, 0.86);
      platform.skin?.setAlpha(0.92);
      body.updateFromGameObject();
    }

    const trigger = this.builtLevel.rebuildTriggers.find((candidate) => candidate.spec.groupId === groupId);
    trigger?.marker.setFillStyle(PHASER_THEME.brassHighlight, 0.82);
  }

  private activateLantern(lanternId: string): void {
    const result = activateLanternSwitch(this.lanternSwitchState, lanternId, this.geometry.lanternSwitches);
    this.lanternSwitchState = result.state;

    if (!result.activated || !result.revealedGroupId) {
      return;
    }

    if (result.feedbackMessage) {
      this.showHint(result.feedbackMessage);
    }

    for (const platform of this.builtLevel.lightRevealedPlatforms.filter(
      (candidate) => candidate.spec.groupId === result.revealedGroupId
    )) {
      const body = platform.body.body as Phaser.Physics.Arcade.StaticBody;
      body.enable = true;
      platform.body.setAlpha(0.92).setStrokeStyle(2, PHASER_THEME.antiqueGold, 0.9);
      platform.skin?.setAlpha(0.92);
      body.updateFromGameObject();
    }

    const lantern = this.builtLevel.lanternSwitches.find((candidate) => candidate.spec.id === lanternId);
    lantern?.marker.setFillStyle(PHASER_THEME.brassHighlight, 0.8);
  }

  private tryExitLevel(): void {
    if (this.isCompleting) {
      return;
    }

    if (!this.hasRequiredExhibit) {
      if (this.time.now - this.lastExitHintAt > 1200) {
        this.lastExitHintAt = this.time.now;
        this.showHint(`Find ${this.builtLevel.exhibitSpec.name} first.`);
      }
      return;
    }

    this.isCompleting = true;
    this.playerController.stop();
    this.showHint("Evidence secured. Opening review...");
    getAudioManager().playPuzzleSuccess();
    this.time.delayedCall(500, () => {
      if (this.activeChapterId !== null) {
        if (shouldBypassChapterPrePuzzle(this.activeChapterId)) {
          const activeFlow = getActiveChapterFlow(this.activeChapterId);
          this.scene.start(this.builtLevel.exitSpec.targetScene, {
            levelId: activeFlow?.puzzleLevelId ?? this.builtLevel.exitSpec.targetLevelId,
            chapterId: this.activeChapterId
          });
          return;
        }

        const chapterVisualNovelSceneId = findChapterVisualNovelSceneId(this.activeChapterId, "before-puzzle");
        if (chapterVisualNovelSceneId) {
          this.scene.start("VisualNovelScene", { sceneId: chapterVisualNovelSceneId });
          return;
        }
      }

      const visualNovelSceneId = findVisualNovelSceneId(this.geometry.levelId, "before-puzzle");
      if (visualNovelSceneId) {
        this.scene.start("VisualNovelScene", { sceneId: visualNovelSceneId });
        return;
      }

      this.scene.start(this.builtLevel.exitSpec.targetScene, { levelId: this.builtLevel.exitSpec.targetLevelId });
    });
  }

  private respawnPlayer(): void {
    if (this.isRespawning) {
      return;
    }

    this.isRespawning = true;
    this.playerController.stop();
    this.showHint(storyContent.ui.respawned);

    this.time.delayedCall(RESPAWN_DELAY_MS, () => {
      const respawnPoint = this.checkpointSystem.getRespawnPoint();
      this.builtLevel.player.setPosition(respawnPoint.x, respawnPoint.y);
      const body = this.builtLevel.player.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      this.syncPlayerInteractionZone();
      this.isRespawning = false;
    });
  }

  private keepPlayerInsideHorizontalBounds(): void {
    const halfWidth = this.builtLevel.player.width / 2;
    const minX = halfWidth;
    const maxX = this.geometry.worldWidth - halfWidth;

    if (this.builtLevel.player.x < minX) {
      this.builtLevel.player.x = minX;
    } else if (this.builtLevel.player.x > maxX) {
      this.builtLevel.player.x = maxX;
    }

    if (this.builtLevel.player.y < PLAYER_HEIGHT / 2) {
      this.builtLevel.player.y = PLAYER_HEIGHT / 2;
    }
  }

  private syncPlayerInteractionZone(): void {
    const center = getPlayerInteractionZoneCenter(this.builtLevel.player.x, this.builtLevel.player.y);
    this.builtLevel.playerInteractionZone.setPosition(center.x, center.y);
    const body = this.builtLevel.playerInteractionZone.body as Phaser.Physics.Arcade.Body;
    body.reset(center.x, center.y);
    body.setVelocity(0, 0);
  }

  private showHint(text: string, durationMs = 2400): void {
    this.hintHideEvent?.remove(false);
    this.hintHideEvent = undefined;
    this.hintText.setVariant(this.getHintVariant(text));
    this.hintText.setText(text);
    this.hintText.setVisible(text.trim().length > 0);
    if (durationMs > 0 && text.trim().length > 0) {
      this.hintHideEvent = this.time.delayedCall(durationMs, () => this.hideHint());
    }
  }

  private hideHint(): void {
    this.hintHideEvent?.remove(false);
    this.hintHideEvent = undefined;
    this.hintText.setText("");
    this.hintText.setVisible(false);
  }

  private getHintVariant(text: string): PlatformerNoticeVariant {
    if (text.startsWith("Clue collected:")) {
      return "clue";
    }

    if (text === storyContent.ui.checkpointActivated || text === storyContent.ui.respawned) {
      return "checkpoint";
    }

    if (text === "Muted" || text === "Sound ready" || text === "Paused") {
      return "sound";
    }

    return "hint";
  }

  private updateMovingPlatforms(): void {
    for (const movingPlatform of this.builtLevel.movingPlatforms) {
      const body = movingPlatform.body.body as Phaser.Physics.Arcade.Body;
      const axis = movingPlatform.spec.axis ?? "horizontal";

      if (axis === "vertical") {
        const top = movingPlatform.body.y - movingPlatform.spec.height / 2;
        const fromY = movingPlatform.spec.fromY ?? movingPlatform.spec.y;
        const toY = movingPlatform.spec.toY ?? movingPlatform.spec.y;

        if (movingPlatform.direction === 1 && top >= toY) {
          movingPlatform.direction = -1;
        } else if (movingPlatform.direction === -1 && top <= fromY) {
          movingPlatform.direction = 1;
        }

        body.setVelocityX(0);
        body.setVelocityY(movingPlatform.direction * movingPlatform.spec.speed);
        movingPlatform.skin?.setPosition(movingPlatform.body.x, movingPlatform.body.y);
        continue;
      }

      const left = movingPlatform.body.x - movingPlatform.spec.width / 2;
      const fromX = movingPlatform.spec.fromX ?? movingPlatform.spec.x;
      const toX = movingPlatform.spec.toX ?? movingPlatform.spec.x;

      if (movingPlatform.direction === 1 && left >= toX) {
        movingPlatform.direction = -1;
      } else if (movingPlatform.direction === -1 && left <= fromX) {
        movingPlatform.direction = 1;
      }

      body.setVelocityY(0);
      body.setVelocityX(movingPlatform.direction * movingPlatform.spec.speed);
      movingPlatform.skin?.setPosition(movingPlatform.body.x, movingPlatform.body.y);
    }
  }
}

function shouldBypassChapterPrePuzzle(chapterId: number): boolean {
  return chapterId === 1 || chapterId === 3;
}
