import Phaser from "phaser";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";
import { PLATFORM_COLORS } from "../platformer/constants";
import type { BuiltPlatformerLevel, MovingPlatformRuntime } from "../platformer/LevelBuilder";
import type { MovingPlatformSpec, PlatformerLevelGeometry, PlatformSpec, RectSpec } from "../platformer/levelGeometry";
import {
  copyTextToClipboard,
  formatDebugPoint,
  nudgeDebugObjectData,
  resizeDebugObjectData,
  serializeDebugObjectAsJson,
  serializeDebugObjectsAsTypeScript,
  serializeDebugObjectAsTypeScript
} from "./debugClipboard";
import { saveDevLevelOverridesFile } from "./devLevelOverrideClient";
import {
  applyDevLevelOverrides,
  emptyDevLevelOverrides,
  serializeDebugObjectForOverride,
  validateDevLevelOverridesFile,
  type DevLevelOverridesFile
} from "./devLevelOverrides";
import {
  createDevLevelOverrideExport,
  createDevMovingPlatformOverride,
  createDevStaticPlatformOverride,
  DEFAULT_DEV_PLATFORM_HEIGHT,
  DEFAULT_DEV_PLATFORM_WIDTH,
  describeDevObjectStatus,
  DEV_EDITOR_GRID_SIZE,
  generateDevMovingPlatformId,
  generateDevPlatformId,
  parseDevLevelOverrideImport,
  parseInspectorNumber,
  parseInspectorRectValues,
  parseMovingPlatformInspectorValues,
  snapRect,
  snapValue,
  summarizeDevLevelOverrides,
  validateCheckpointRespawnSupport,
  validateDebugObjectSupport,
  validatePlatformerGeometry,
  type DevSupportValidationResult,
  type DevValidationIssue,
  type DevValidationSummary
} from "./devLevelEditorUtils";
import type { DebugObjectData, DebugObjectType, DevSpawn, RuntimeDebugObject } from "./debugTypes";

interface DevLevelEditorOptions {
  scene: Phaser.Scene;
  geometry: PlatformerLevelGeometry;
  baseGeometry?: PlatformerLevelGeometry;
  builtLevel: BuiltPlatformerLevel;
  devSpawn?: DevSpawn;
  appliedOverrideIds?: string[];
  initialOverrides?: DevLevelOverridesFile;
  activeChapterId?: number | null;
  getActiveCheckpointId: () => string | null;
  showHint: (text: string) => void;
}

const GRID_SIZE = DEV_EDITOR_GRID_SIZE;
const DEBUG_DEPTH = 9000;
const MIN_RESIZE_WIDTH = 16;
const MIN_RESIZE_HEIGHT = 8;
const MOVING_HANDLE_RADIUS = 14;
const RESPAWN_HANDLE_RADIUS = 13;

type MovingPathHandle = "start" | "end";

interface DevEditorHistorySnapshot {
  overrides: DevLevelOverridesFile;
  deletedObjectIds: string[];
  dirtyObjectIds: string[];
  selectedObjectId: string | null;
}

interface DevEditorHistoryEntry {
  label: string;
  before: DevEditorHistorySnapshot;
  after: DevEditorHistorySnapshot;
}

export class DevLevelEditor {
  private readonly scene: Phaser.Scene;
  private readonly geometry: PlatformerLevelGeometry;
  private readonly baseGeometry: PlatformerLevelGeometry;
  private readonly builtLevel: BuiltPlatformerLevel;
  private readonly devSpawn?: DevSpawn;
  private readonly activeChapterId: number | null;
  private readonly savedOverrideObjectIds: Set<string>;
  private readonly getActiveCheckpointId: () => string | null;
  private readonly showHint: (text: string) => void;
  private readonly objects: RuntimeDebugObject[] = [];
  private readonly baseObjectData = new Map<string, DebugObjectData>();
  private readonly dirtyObjectIds = new Set<string>();
  private readonly panel: HTMLDivElement;
  private readonly toolbar: HTMLDivElement;
  private readonly inspectorPanel: HTMLDivElement;
  private readonly overrideSummaryPanel: HTMLDivElement;
  private readonly validationPanel: HTMLDivElement;
  private readonly statusPanel: HTMLPreElement;
  private readonly copyPanel: HTMLTextAreaElement;
  private readonly gridGraphics: Phaser.GameObjects.Graphics;
  private readonly boundsGraphics: Phaser.GameObjects.Graphics;
  private readonly pathGraphics: Phaser.GameObjects.Graphics;
  private readonly supportGraphics: Phaser.GameObjects.Graphics;
  private readonly validationGraphics: Phaser.GameObjects.Graphics;
  private readonly labels: Phaser.GameObjects.Text[] = [];
  private readonly validationLabels: Phaser.GameObjects.Text[] = [];
  private readonly checkpointLinkedRespawn = new Map<string, boolean>();
  private currentOverrides: DevLevelOverridesFile;
  private savedOverrides: DevLevelOverridesFile;
  private deletedObjectIds: Set<string>;
  private readonly undoStack: DevEditorHistoryEntry[] = [];
  private readonly redoStack: DevEditorHistoryEntry[] = [];
  private activeDragHistorySnapshot: DevEditorHistorySnapshot | null = null;
  private activeDragHistoryLabel = "";
  private selectedObject: RuntimeDebugObject | null = null;
  private draggingPathHandle: MovingPathHandle | null = null;
  private draggingRespawnMarker = false;
  private overlayVisible = false;
  private gridVisible = false;
  private boundsVisible = false;
  private labelsVisible = false;
  private snapEnabled = false;
  private validationMarkersVisible = false;
  private autoValidate = true;
  private validationSummary: DevValidationSummary | null = null;
  private lastFeedback = "";

  constructor(options: DevLevelEditorOptions) {
    this.scene = options.scene;
    this.geometry = options.geometry;
    this.baseGeometry = options.baseGeometry ?? options.geometry;
    this.builtLevel = options.builtLevel;
    this.devSpawn = options.devSpawn;
    this.activeChapterId = options.activeChapterId ?? null;
    this.currentOverrides = cloneOverrides(options.initialOverrides ?? emptyDevLevelOverrides(options.geometry.levelId));
    this.savedOverrides = cloneOverrides(this.currentOverrides);
    this.deletedObjectIds = new Set(this.currentOverrides.deletedObjectIds);
    for (const data of collectDebugDataFromGeometry(this.baseGeometry)) {
      this.baseObjectData.set(data.id, data);
    }
    this.savedOverrideObjectIds = new Set([
      ...(options.appliedOverrideIds ?? []),
      ...this.currentOverrides.addedObjects.map((object) => object.id)
    ]);
    this.getActiveCheckpointId = options.getActiveCheckpointId;
    this.showHint = options.showHint;

    const panelParts = this.createPanel();
    this.panel = panelParts.panel;
    this.toolbar = panelParts.toolbar;
    this.inspectorPanel = panelParts.inspectorPanel;
    this.overrideSummaryPanel = panelParts.overrideSummaryPanel;
    this.validationPanel = panelParts.validationPanel;
    this.statusPanel = panelParts.statusPanel;
    this.copyPanel = this.createCopyPanel();
    this.gridGraphics = this.scene.add.graphics().setDepth(DEBUG_DEPTH).setVisible(false);
    this.boundsGraphics = this.scene.add.graphics().setDepth(DEBUG_DEPTH + 1).setVisible(false);
    this.pathGraphics = this.scene.add.graphics().setDepth(DEBUG_DEPTH + 2).setVisible(false);
    this.supportGraphics = this.scene.add.graphics().setDepth(DEBUG_DEPTH + 3).setVisible(false);
    this.validationGraphics = this.scene.add.graphics().setDepth(DEBUG_DEPTH + 4).setVisible(false);

    this.registerObjects();
    this.renderInspector();
    this.renderOverrideSummary();
    this.renderValidationPanel();
    this.drawGrid();
    this.drawBounds();
    this.bindInput();

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  update(): void {
    if (this.overlayVisible) {
      this.statusPanel.textContent = this.getPanelText();
    }

    if (this.labelsVisible) {
      this.drawLabels();
    }

    if (this.selectedObject?.data.type === "moving-platform") {
      this.drawMovingPathPreview();
    }

    if (this.selectedObject && isSupportValidatedType(this.selectedObject.data.type)) {
      this.drawSupportMarkers();
    }

    if (this.validationMarkersVisible && this.validationSummary) {
      this.drawValidationMarkers();
    }
  }

  isOverlayVisible(): boolean {
    return this.overlayVisible;
  }

  shouldCaptureMovementInput(): boolean {
    return this.overlayVisible && this.selectedObject !== null;
  }

  destroy(): void {
    this.scene.input.off("pointerdown", this.handlePointerDown, this);
    this.scene.input.off("pointermove", this.handlePointerMove, this);
    this.scene.input.off("pointerup", this.handlePointerUp, this);
    this.scene.input.keyboard?.off("keydown", this.handleKeyDown, this);
    this.panel.remove();
    this.copyPanel.remove();
    this.gridGraphics.destroy();
    this.boundsGraphics.destroy();
    this.pathGraphics.destroy();
    this.supportGraphics.destroy();
    this.validationGraphics.destroy();
    this.clearLabels();
    this.clearValidationLabels();
  }

  private createPanel(): {
    panel: HTMLDivElement;
    toolbar: HTMLDivElement;
    inspectorPanel: HTMLDivElement;
    overrideSummaryPanel: HTMLDivElement;
    validationPanel: HTMLDivElement;
    statusPanel: HTMLPreElement;
  } {
    const panel = document.createElement("div");
    panel.className = "dev-debug-panel";
    panel.dataset.testid = "dev-debug-overlay";
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");

    const toolbar = document.createElement("div");
    toolbar.className = "dev-debug-toolbar";
    toolbar.append(
      this.createToolButton("Undo", () => this.undo(), "dev-undo"),
      this.createToolButton("Redo", () => this.redo(), "dev-redo"),
      this.createToolButton("Add Platform", () => this.addStaticPlatform(), "dev-add-platform"),
      this.createToolButton("Add Moving Platform", () => this.addMovingPlatform("horizontal"), "dev-add-moving-platform"),
      this.createToolButton("Add Elevator", () => this.addMovingPlatform("vertical"), "dev-add-elevator"),
      this.createToolButton("Duplicate", () => this.duplicateSelectedPlatform(), "dev-duplicate-platform"),
      this.createToolButton("Delete Object", () => this.deleteSelectedPlatform(), "dev-delete-object"),
      this.createToolButton("Revert Unsaved", () => this.revertSelectedUnsaved(), "dev-revert-unsaved"),
      this.createToolButton("Revert Override", () => void this.revertSelectedOverride(), "dev-revert-override"),
      this.createToolButton("Save All", () => void this.saveDirtyObjects(), "dev-save-all"),
      this.createToolButton("Reset Level Overrides", () => this.resetLevelOverrides(), "dev-reset-level-overrides"),
      this.createToolButton("Export Overrides", () => void this.exportOverrides(), "dev-export-overrides"),
      this.createToolButton("Import Overrides", () => this.importOverrides(), "dev-import-overrides"),
      this.createToolButton("Snap: Off", () => this.toggleSnap(), "dev-snap-toggle"),
      this.createToolButton("Validate Level", () => this.runLevelValidation("manual"), "dev-validate-level"),
      this.createToolButton("Auto Validate: On", () => this.toggleAutoValidate(), "dev-auto-validate-toggle"),
      this.createToolButton("Markers: Off", () => this.toggleValidationMarkers(), "dev-validation-markers-toggle")
    );

    const inspectorPanel = document.createElement("div");
    inspectorPanel.className = "dev-debug-inspector";
    inspectorPanel.dataset.testid = "dev-object-inspector";

    const overrideSummaryPanel = document.createElement("div");
    overrideSummaryPanel.className = "dev-debug-summary";
    overrideSummaryPanel.dataset.testid = "dev-override-summary";

    const validationPanel = document.createElement("div");
    validationPanel.className = "dev-debug-validation";
    validationPanel.dataset.testid = "dev-validation-panel";

    const statusPanel = document.createElement("pre");
    statusPanel.className = "dev-debug-status";
    statusPanel.dataset.testid = "dev-debug-status";
    panel.append(toolbar, inspectorPanel, overrideSummaryPanel, validationPanel, statusPanel);
    document.querySelector("#game-shell")?.appendChild(panel);
    return { panel, toolbar, inspectorPanel, overrideSummaryPanel, validationPanel, statusPanel };
  }

  private createToolButton(label: string, onClick: () => void, testId: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = "dev-debug-button";
    button.dataset.testid = testId;
    button.addEventListener("pointerdown", (event) => event.stopPropagation());
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    });
    return button;
  }

  private createCopyPanel(): HTMLTextAreaElement {
    const copyPanel = document.createElement("textarea");
    copyPanel.className = "dev-debug-copy-panel";
    copyPanel.dataset.testid = "dev-debug-copy-panel";
    copyPanel.hidden = true;
    copyPanel.readOnly = true;
    copyPanel.setAttribute("aria-label", "Developer debug copy fallback");
    document.querySelector("#game-shell")?.appendChild(copyPanel);
    return copyPanel;
  }

  private renderInspector(errorText = ""): void {
    this.inspectorPanel.replaceChildren();

    const title = document.createElement("div");
    title.className = "dev-debug-inspector-title";
    title.textContent = "Selected Object";
    this.inspectorPanel.append(title);

    if (!this.selectedObject) {
      const empty = document.createElement("p");
      empty.className = "dev-debug-inspector-empty";
      empty.textContent = "No object selected. Click an object to select it.";
      this.inspectorPanel.append(empty);
      return;
    }

    const object = this.selectedObject;
    const source = object.data.source ?? "base";
    const status = this.getObjectStatus(object);
    this.inspectorPanel.append(
      this.createInspectorTextRow("ID", object.data.id, "dev-inspector-id"),
      this.createInspectorTextRow("Type", object.data.type, "dev-inspector-type"),
      this.createInspectorTextRow("Kind", object.data.kind ?? "n/a", "dev-inspector-kind"),
      this.createInspectorTextRow("Source", source, "dev-inspector-source"),
      this.createInspectorTextRow("Status", status, "dev-inspector-status"),
      this.createInspectorInputRow("x", String(Math.round(object.data.x)), false, "number"),
      this.createInspectorInputRow("y", String(Math.round(object.data.y)), false, "number"),
      this.createInspectorInputRow("width", String(Math.round(object.data.width)), object.data.resizable !== true, "number"),
      this.createInspectorInputRow("height", String(Math.round(object.data.height)), object.data.resizable !== true, "number"),
      this.createInspectorInputRow(
        "label",
        object.data.label ?? "",
        !this.canEditLabel(object),
        "text",
        this.canEditLabel(object) ? "" : "read-only until supported for this object"
      )
    );

    if (object.data.type === "moving-platform") {
      const path = movingPathFieldsForInspector(object.data);
      const axis = object.data.axis ?? "horizontal";
      this.inspectorPanel.append(
        this.createInspectorSelectRow("axis", axis, ["horizontal", "vertical"]),
        this.createInspectorInputRow("speed", String(Math.round(object.data.speed ?? 20)), false, "number"),
        this.createInspectorInputRow("fromX", String(Math.round(path.fromX)), axis === "vertical", "number"),
        this.createInspectorInputRow("toX", String(Math.round(path.toX)), axis === "vertical", "number"),
        this.createInspectorInputRow("fromY", String(Math.round(path.fromY)), axis === "horizontal", "number"),
        this.createInspectorInputRow("toY", String(Math.round(path.toY)), axis === "horizontal", "number")
      );
    }

    if (object.data.type === "checkpoint") {
      const linked = this.isCheckpointRespawnLinked(object);
      this.inspectorPanel.append(
        this.createInspectorInputRow("respawnX", String(Math.round(object.data.respawnX ?? object.data.x)), linked, "number"),
        this.createInspectorInputRow("respawnY", String(Math.round(object.data.respawnY ?? object.data.y)), linked, "number"),
        this.createInspectorCheckboxRow("linkedRespawn", linked, (checked) => {
          this.checkpointLinkedRespawn.set(object.data.id, checked);
          object.data.linkedRespawn = checked;
          this.renderInspector();
          this.drawSupportMarkers();
        }),
        this.createInspectorTextRow("Checkpoint #", String(object.data.checkpointIndex ?? "n/a"))
      );
    }

    if (isInteractableDebugType(object.data.type)) {
      this.inspectorPanel.append(
        this.createInspectorTextRow("Name", object.data.name ?? object.data.label ?? "n/a", "dev-inspector-object-name"),
        this.createInspectorTextRow("Required", object.data.required === undefined ? "n/a" : String(object.data.required), "dev-inspector-required")
      );
    }

    if (isExitLikeDebugType(object.data.type)) {
      this.inspectorPanel.append(
        this.createInspectorTextRow("Target Scene", object.data.targetScene ?? "read-only", "dev-inspector-target-scene"),
        this.createInspectorTextRow("Target Level", object.data.targetLevelId === undefined ? "n/a" : String(object.data.targetLevelId), "dev-inspector-target-level")
      );
    }

    const supportValidation = this.getSelectedSupportValidation(object);
    if (supportValidation.length > 0) {
      for (const validation of supportValidation) {
        this.inspectorPanel.append(
          this.createInspectorTextRow(
            validation.label,
            supportValidationLabel(validation.result),
            validation.label === "Support" ? "dev-inspector-support-status" : undefined
          )
        );
      }
    }

    const actions = document.createElement("div");
    actions.className = "dev-debug-inspector-actions";
    actions.append(
      this.createToolButton("Apply", () => this.applyInspectorChanges(), "dev-inspector-apply"),
      this.createToolButton("Revert Unsaved", () => this.revertSelectedUnsaved(), "dev-inspector-revert-unsaved"),
      this.createToolButton("Revert Override", () => void this.revertSelectedOverride(), "dev-inspector-revert-override"),
      this.createToolButton("Delete Object", () => this.deleteSelectedPlatform(), "dev-inspector-delete-object"),
      this.createToolButton("Save All", () => void this.saveDirtyObjects(), "dev-inspector-save-all")
    );
    this.inspectorPanel.append(actions);

    const help = document.createElement("div");
    help.className = "dev-debug-inspector-help";
    help.textContent = `Snap: ${this.snapEnabled ? "On" : "Off"} (${GRID_SIZE}px). Inputs suppress editor shortcuts while focused.`;
    this.inspectorPanel.append(help);

    if (errorText) {
      const error = document.createElement("div");
      error.className = "dev-debug-inspector-error";
      error.dataset.testid = "dev-inspector-error";
      error.textContent = errorText;
      this.inspectorPanel.append(error);
    }
  }

  private renderValidationPanel(): void {
    this.validationPanel.replaceChildren();

    const title = document.createElement("div");
    title.className = "dev-debug-inspector-title";
    title.textContent = "Level Validation";
    this.validationPanel.append(title);

    if (!this.validationSummary) {
      const empty = document.createElement("p");
      empty.className = "dev-debug-inspector-empty";
      empty.textContent = "No validation run yet. Click Validate Level.";
      this.validationPanel.append(empty);
      return;
    }

    const summary = document.createElement("div");
    summary.className = "dev-debug-validation-summary";
    summary.dataset.testid = "dev-validation-summary";
    summary.textContent = `Errors: ${this.validationSummary.errors} | Warnings: ${this.validationSummary.warnings} | Info: ${this.validationSummary.infos}`;
    this.validationPanel.append(summary);

    const list = document.createElement("div");
    list.className = "dev-debug-validation-list";
    list.dataset.testid = "dev-validation-list";
    const issues = this.validationSummary.issues.slice(0, 40);
    if (issues.length === 0) {
      const ok = document.createElement("p");
      ok.className = "dev-debug-inspector-help";
      ok.textContent = "No validation issues found.";
      list.append(ok);
    }
    for (const issue of issues) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `dev-validation-issue dev-validation-issue-${issue.severity}`;
      button.dataset.testid = "dev-validation-issue";
      button.textContent = `${issue.severity.toUpperCase()} ${issue.category}${issue.objectId ? ` ${issue.objectId}` : ""}: ${issue.message}`;
      button.addEventListener("pointerdown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.selectValidationIssue(issue);
      });
      list.append(button);
    }
    if (this.validationSummary.issues.length > issues.length) {
      const more = document.createElement("p");
      more.className = "dev-debug-inspector-help";
      more.textContent = `Showing first ${issues.length} of ${this.validationSummary.issues.length} issues.`;
      list.append(more);
    }
    this.validationPanel.append(list);
  }

  private renderOverrideSummary(): void {
    this.overrideSummaryPanel.replaceChildren();

    const title = document.createElement("div");
    title.className = "dev-debug-inspector-title";
    title.textContent = "Override Summary";
    this.overrideSummaryPanel.append(title);

    const summary = summarizeDevLevelOverrides(this.currentOverrides);
    const counts = document.createElement("div");
    counts.className = "dev-debug-validation-summary";
    counts.dataset.testid = "dev-override-summary-counts";
    counts.textContent = `Modified: ${summary.modifiedCount} | Added: ${summary.addedCount} | Deleted: ${summary.deletedCount} | Dirty: ${
      this.dirtyObjectIds.size > 0 ? "yes" : "no"
    }`;
    this.overrideSummaryPanel.append(counts);

    const validation = document.createElement("div");
    validation.className = "dev-debug-inspector-help";
    validation.textContent = this.validationSummary
      ? `Validation: ${this.validationSummary.errors} errors, ${this.validationSummary.warnings} warnings`
      : "Validation: not run";
    this.overrideSummaryPanel.append(validation);

    this.overrideSummaryPanel.append(
      this.createSummarySection("Modified Objects", summary.modifiedObjects, (object) => [
        this.createToolButton("Select", () => this.selectObjectById(object.id), `dev-summary-select-${object.id}`),
        this.createToolButton("Revert", () => this.revertOverrideById(object.id), `dev-summary-revert-${object.id}`)
      ]),
      this.createSummarySection("Added Objects", summary.addedObjects, (object) => [
        this.createToolButton("Select", () => this.selectObjectById(object.id), `dev-summary-select-${object.id}`),
        this.createToolButton("Remove", () => this.removeAddedObjectById(object.id), `dev-summary-remove-${object.id}`)
      ]),
      this.createDeletedSummarySection(summary.deletedObjectIds)
    );
    this.updateHistoryButtons();
  }

  private createSummarySection(
    title: string,
    objects: Array<{ id: string; type: string; kind?: string; x: number; y: number; width: number; height: number }>,
    actionsForObject: (object: { id: string; type: string; kind?: string; x: number; y: number; width: number; height: number }) => HTMLButtonElement[]
  ): HTMLElement {
    const section = document.createElement("section");
    section.className = "dev-debug-summary-section";
    const heading = document.createElement("h3");
    heading.textContent = `${title} (${objects.length})`;
    section.append(heading);

    if (objects.length === 0) {
      const empty = document.createElement("p");
      empty.className = "dev-debug-inspector-help";
      empty.textContent = "None";
      section.append(empty);
      return section;
    }

    for (const object of objects) {
      const row = document.createElement("div");
      row.className = "dev-debug-summary-row";
      row.dataset.testid = "dev-override-summary-row";
      const text = document.createElement("code");
      text.textContent = `${object.id} (${object.type}${object.kind ? `/${object.kind}` : ""}) x=${Math.round(object.x)} y=${Math.round(
        object.y
      )} w=${Math.round(object.width)} h=${Math.round(object.height)}`;
      const actions = document.createElement("div");
      actions.className = "dev-debug-summary-actions";
      actions.append(...actionsForObject(object));
      row.append(text, actions);
      section.append(row);
    }
    return section;
  }

  private createDeletedSummarySection(deletedObjectIds: string[]): HTMLElement {
    const section = document.createElement("section");
    section.className = "dev-debug-summary-section";
    const heading = document.createElement("h3");
    heading.textContent = `Deleted Objects (${deletedObjectIds.length})`;
    section.append(heading);

    if (deletedObjectIds.length === 0) {
      const empty = document.createElement("p");
      empty.className = "dev-debug-inspector-help";
      empty.textContent = "None";
      section.append(empty);
      return section;
    }

    for (const deletedId of deletedObjectIds) {
      const row = document.createElement("div");
      row.className = "dev-debug-summary-row";
      row.dataset.testid = "dev-override-summary-deleted-row";
      const base = this.baseObjectData.get(deletedId);
      const text = document.createElement("code");
      text.textContent = base ? `${deletedId} (${base.type}${base.kind ? `/${base.kind}` : ""}) hidden` : `${deletedId} hidden`;
      const actions = document.createElement("div");
      actions.className = "dev-debug-summary-actions";
      actions.append(this.createToolButton("Restore", () => this.restoreDeletedObjectById(deletedId), `dev-summary-restore-${deletedId}`));
      row.append(text, actions);
      section.append(row);
    }
    return section;
  }

  private runLevelValidation(source: "manual" | "auto"): void {
    this.validationSummary = validatePlatformerGeometry(this.geometry, {
      activeChapterId: this.activeChapterId,
      baseGeometry: this.baseGeometry,
      overrides: this.currentOverrides
    });
    this.renderValidationPanel();
    this.renderOverrideSummary();
    this.drawValidationMarkers();
    const summaryText = `Validation: ${this.validationSummary.errors} errors, ${this.validationSummary.warnings} warnings, ${this.validationSummary.infos} info`;
    if (source === "manual") {
      this.showCopyFeedback(summaryText);
    } else {
      this.lastFeedback = summaryText;
    }
  }

  private refreshValidationIfAuto(): void {
    if (this.autoValidate) {
      this.runLevelValidation("auto");
    } else if (this.validationSummary) {
      this.drawValidationMarkers();
    }
  }

  private toggleAutoValidate(): void {
    this.autoValidate = !this.autoValidate;
    const button = this.toolbar.querySelector<HTMLButtonElement>('[data-testid="dev-auto-validate-toggle"]');
    if (button) {
      button.textContent = `Auto Validate: ${this.autoValidate ? "On" : "Off"}`;
    }
    this.showCopyFeedback(`Auto validation ${this.autoValidate ? "enabled" : "disabled"}`);
    if (this.autoValidate) {
      this.runLevelValidation("auto");
    }
  }

  private toggleValidationMarkers(): void {
    this.validationMarkersVisible = !this.validationMarkersVisible;
    const button = this.toolbar.querySelector<HTMLButtonElement>('[data-testid="dev-validation-markers-toggle"]');
    if (button) {
      button.textContent = `Markers: ${this.validationMarkersVisible ? "On" : "Off"}`;
    }
    this.drawValidationMarkers();
    this.showCopyFeedback(`Validation markers ${this.validationMarkersVisible ? "shown" : "hidden"}`);
  }

  private selectValidationIssue(issue: DevValidationIssue): void {
    if (issue.objectId) {
      const object = this.objects.find((candidate) => candidate.data.id === issue.objectId);
      if (object) {
        this.selectedObject = object;
        this.scene.cameras.main.centerOn(object.data.x + object.data.width / 2, object.data.y + object.data.height / 2);
        this.renderInspector();
        this.drawBounds();
        this.drawMovingPathPreview();
        this.drawSupportMarkers();
        this.drawLabels();
        this.showCopyFeedback(`Selected validation issue ${issue.objectId}`);
        return;
      }
    }

    if (issue.x !== undefined && issue.y !== undefined) {
      this.scene.cameras.main.centerOn(issue.x + (issue.width ?? 0) / 2, issue.y + (issue.height ?? 0) / 2);
    }
    this.showCopyFeedback(issue.objectId ? `Issue object is not visible/selectable: ${issue.objectId}` : issue.message);
  }

  private captureHistorySnapshot(): DevEditorHistorySnapshot {
    return {
      overrides: cloneOverrides(this.currentOverrides),
      deletedObjectIds: [...this.deletedObjectIds],
      dirtyObjectIds: [...this.dirtyObjectIds],
      selectedObjectId: this.selectedObject?.data.id ?? null
    };
  }

  private recordHistory(label: string, before: DevEditorHistorySnapshot): void {
    const after = this.captureHistorySnapshot();
    if (snapshotsMatch(before, after)) {
      return;
    }
    this.undoStack.push({ label, before, after });
    this.redoStack.length = 0;
    this.updateHistoryButtons();
    this.renderOverrideSummary();
  }

  private undo(): void {
    const entry = this.undoStack.pop();
    if (!entry) {
      this.showCopyFeedback("Nothing to undo");
      return;
    }
    this.redoStack.push(entry);
    this.restoreHistorySnapshot(entry.before);
    this.showCopyFeedback(`Undid ${entry.label}`);
  }

  private redo(): void {
    const entry = this.redoStack.pop();
    if (!entry) {
      this.showCopyFeedback("Nothing to redo");
      return;
    }
    this.undoStack.push(entry);
    this.restoreHistorySnapshot(entry.after);
    this.showCopyFeedback(`Redid ${entry.label}`);
  }

  private restoreHistorySnapshot(snapshot: DevEditorHistorySnapshot): void {
    this.currentOverrides = cloneOverrides(snapshot.overrides);
    this.deletedObjectIds = new Set(snapshot.deletedObjectIds);
    this.dirtyObjectIds.clear();
    for (const id of snapshot.dirtyObjectIds) {
      this.dirtyObjectIds.add(id);
    }
    for (const id of collectOverrideDiffIds(this.currentOverrides, this.savedOverrides)) {
      this.dirtyObjectIds.add(id);
    }
    this.reconcileRuntimeObjectsFromOverrides(snapshot.selectedObjectId);
    this.renderInspector();
    this.renderOverrideSummary();
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.refreshValidationIfAuto();
  }

  private updateHistoryButtons(): void {
    const undoButton = this.toolbar.querySelector<HTMLButtonElement>('[data-testid="dev-undo"]');
    const redoButton = this.toolbar.querySelector<HTMLButtonElement>('[data-testid="dev-redo"]');
    if (undoButton) {
      undoButton.disabled = this.undoStack.length === 0;
      undoButton.textContent = this.undoStack.length > 0 ? `Undo (${this.undoStack[this.undoStack.length - 1].label})` : "Undo";
    }
    if (redoButton) {
      redoButton.disabled = this.redoStack.length === 0;
      redoButton.textContent = this.redoStack.length > 0 ? `Redo (${this.redoStack[this.redoStack.length - 1].label})` : "Redo";
    }
  }

  private selectObjectById(objectId: string): void {
    const object = this.objects.find((candidate) => candidate.data.id === objectId);
    if (!object) {
      this.showCopyFeedback(`Object is not visible/selectable: ${objectId}`);
      return;
    }
    this.selectedObject = object;
    this.scene.cameras.main.centerOn(object.data.x + object.data.width / 2, object.data.y + object.data.height / 2);
    this.renderInspector();
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.showCopyFeedback(`Selected ${objectId}`);
  }

  private revertOverrideById(objectId: string): void {
    const before = this.captureHistorySnapshot();
    const object = this.objects.find((candidate) => candidate.data.id === objectId);
    const objects = { ...this.currentOverrides.objects };
    delete objects[objectId];
    this.currentOverrides = { ...this.currentOverrides, objects };
    if (object?.baseData) {
      this.applyRuntimeSnapshot(object, object.baseData);
      this.markDirty(object);
      this.selectedObject = object;
    } else {
      this.dirtyObjectIds.add(objectId);
    }
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.showCopyFeedback(`Reverted override for ${objectId}. Use Save All to persist.`);
    this.recordHistory(`revert ${objectId}`, before);
  }

  private removeAddedObjectById(objectId: string): void {
    const object = this.objects.find((candidate) => candidate.data.id === objectId);
    if (!object || object.data.source !== "added") {
      this.showCopyFeedback(`Added object is not visible/selectable: ${objectId}`);
      return;
    }
    const before = this.captureHistorySnapshot();
    this.currentOverrides = {
      ...this.currentOverrides,
      addedObjects: this.currentOverrides.addedObjects.filter((candidate) => candidate.id !== objectId),
      deletedObjectIds: this.currentOverrides.deletedObjectIds.filter((candidate) => candidate !== objectId)
    };
    this.deletedObjectIds.delete(objectId);
    this.removeRuntimeObject(object);
    this.dirtyObjectIds.add(objectId);
    this.selectedObject = null;
    this.drawBounds();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.showCopyFeedback(`Removed added ${object.data.type === "moving-platform" ? "moving platform" : "platform"} ${objectId}. Use Save All to persist.`);
    this.recordHistory(`remove ${objectId}`, before);
  }

  private restoreDeletedObjectById(objectId: string): void {
    if (!this.deletedObjectIds.has(objectId)) {
      this.showCopyFeedback(`${objectId} is not deleted.`);
      return;
    }
    const baseData = this.baseObjectData.get(objectId);
    if (!baseData || baseData.type !== "platform") {
      this.showCopyFeedback(`Restore currently supports deleted static platforms only: ${objectId}`);
      return;
    }
    const before = this.captureHistorySnapshot();
    this.deletedObjectIds.delete(objectId);
    this.currentOverrides = {
      ...this.currentOverrides,
      deletedObjectIds: [...this.deletedObjectIds]
    };
    let object = this.objects.find((candidate) => candidate.data.id === objectId);
    if (!object) {
      object = this.createRuntimeStaticPlatform(platformSpecFromDebugData(baseData), "base");
    }
    this.selectedObject = object;
    this.markDirty(object);
    this.drawBounds();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.showCopyFeedback(`Restored deleted platform ${objectId}. Use Save All to persist.`);
    this.recordHistory(`restore ${objectId}`, before);
  }

  private reconcileRuntimeObjectsFromOverrides(selectedObjectId: string | null): void {
    const result = applyDevLevelOverrides(this.baseGeometry, this.currentOverrides);
    const targetData = new Map(collectDebugDataFromGeometry(result.geometry).map((object) => [object.id, object]));
    const visibleIds = new Set(targetData.keys());
    const addedIds = new Set(this.currentOverrides.addedObjects.map((object) => object.id));

    for (const object of [...this.objects]) {
      if (object.data.source === "added" && !visibleIds.has(object.data.id)) {
        this.removeRuntimeObject(object);
        continue;
      }
      if (object.data.type === "platform" && this.deletedObjectIds.has(object.data.id)) {
        this.removeRuntimeObject(object);
        continue;
      }
    }

    for (const data of targetData.values()) {
      if (data.type !== "platform" && data.type !== "moving-platform") {
        continue;
      }
      const object = this.objects.find((candidate) => candidate.data.id === data.id);
      if (!object) {
        if (data.type === "moving-platform") {
          this.createRuntimeMovingPlatform(movingPlatformSpecFromDebugData(data), addedIds.has(data.id) ? "added" : "base");
        } else {
          this.createRuntimeStaticPlatform(platformSpecFromDebugData(data), addedIds.has(data.id) ? "added" : "base");
        }
      }
    }

    for (const object of this.objects) {
      const nextData = targetData.get(object.data.id);
      if (nextData) {
        const previousSource = object.data.source;
        this.applyRuntimeSnapshot(object, { ...object.data, ...nextData, source: previousSource ?? nextData.source });
      }
      object.data.dirty = this.dirtyObjectIds.has(object.data.id);
      object.data.hasOverride =
        this.savedOverrideObjectIds.has(object.data.id) ||
        this.currentOverrides.addedObjects.some((addedObject) => addedObject.id === object.data.id) ||
        this.currentOverrides.objects[object.data.id] !== undefined;
    }

    this.selectedObject = selectedObjectId ? this.objects.find((object) => object.data.id === selectedObjectId) ?? null : null;
  }

  private resetLevelOverrides(): void {
    const confirmed = window.confirm("Reset all dev overrides for this level? This cannot be undone after saving.");
    if (!confirmed) {
      this.showCopyFeedback("Reset cancelled.");
      return;
    }
    const before = this.captureHistorySnapshot();
    this.currentOverrides = {
      ...emptyDevLevelOverrides(this.geometry.levelId),
      chapterId: this.activeChapterId ?? undefined,
      chapterTitle: this.geometry.title
    };
    this.deletedObjectIds.clear();
    this.dirtyObjectIds.clear();
    this.dirtyObjectIds.add("__level_reset__");
    this.reconcileRuntimeObjectsFromOverrides(null);
    this.renderInspector();
    this.renderOverrideSummary();
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.refreshValidationIfAuto();
    this.showCopyFeedback("Reset level overrides in memory. Use Save All to persist.");
    this.recordHistory("reset level overrides", before);
  }

  private async exportOverrides(): Promise<void> {
    const exportText = createDevLevelOverrideExport(
      {
        ...this.currentOverrides,
        version: 2,
        levelId: this.geometry.levelId,
        chapterId: this.activeChapterId ?? undefined,
        chapterTitle: this.geometry.title,
        deletedObjectIds: [...this.deletedObjectIds]
      },
      {
        exportedAt: new Date().toISOString(),
        projectTitle: "Maria and the Case of the Missing Heart"
      }
    );
    const copied = await this.copyText(exportText, "Copied override JSON export");
    if (!copied) {
      this.copyPanel.hidden = false;
      this.copyPanel.readOnly = true;
      this.copyPanel.value = exportText;
      this.copyPanel.focus();
      this.copyPanel.select();
      this.lastFeedback = "Showing override JSON export for manual copy";
    }
  }

  private importOverrides(): void {
    const raw = window.prompt("Paste dev override JSON for this level.");
    if (!raw) {
      this.showCopyFeedback("Import cancelled.");
      return;
    }
    const parsed = parseDevLevelOverrideImport(raw, this.geometry.levelId, validateDevLevelOverridesFile);
    if (!parsed.ok) {
      this.showCopyFeedback(parsed.error);
      return;
    }
    if (parsed.levelMismatch) {
      const confirmed = window.confirm(`Imported override is for level ${parsed.overrides.levelId}. Apply it to current level ${this.geometry.levelId}?`);
      if (!confirmed) {
        this.showCopyFeedback("Import cancelled due to level mismatch.");
        return;
      }
    }
    const summary = parsed.summary;
    const confirmed = window.confirm(
      `Apply imported override to current level?\nModified: ${summary.modifiedCount}\nAdded: ${summary.addedCount}\nDeleted: ${summary.deletedCount}\nThis will remain unsaved until Save All.`
    );
    if (!confirmed) {
      this.showCopyFeedback("Import cancelled.");
      return;
    }

    const before = this.captureHistorySnapshot();
    this.currentOverrides = {
      ...cloneOverrides(parsed.overrides),
      levelId: this.geometry.levelId,
      chapterId: this.activeChapterId ?? parsed.overrides.chapterId,
      chapterTitle: this.geometry.title
    };
    this.deletedObjectIds = new Set(this.currentOverrides.deletedObjectIds);
    this.dirtyObjectIds.clear();
    for (const objectId of [
      ...Object.keys(this.currentOverrides.objects),
      ...this.currentOverrides.addedObjects.map((object) => object.id),
      ...this.currentOverrides.deletedObjectIds
    ]) {
      this.dirtyObjectIds.add(objectId);
    }
    if (this.dirtyObjectIds.size === 0) {
      this.dirtyObjectIds.add("__import_empty__");
    }
    this.reconcileRuntimeObjectsFromOverrides(null);
    this.renderInspector();
    this.renderOverrideSummary();
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.refreshValidationIfAuto();
    this.showCopyFeedback("Imported override JSON in memory. Use Save All to persist.");
    this.recordHistory("import overrides", before);
  }

  private createInspectorTextRow(label: string, value: string, testId?: string): HTMLDivElement {
    const row = document.createElement("div");
    row.className = "dev-debug-inspector-row";
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    const valueElement = document.createElement("code");
    valueElement.textContent = value;
    if (testId) {
      valueElement.dataset.testid = testId;
    }
    row.append(labelElement, valueElement);
    return row;
  }

  private createInspectorSelectRow(fieldName: string, value: string, options: string[]): HTMLLabelElement {
    const row = document.createElement("label");
    row.className = "dev-debug-inspector-row dev-debug-inspector-field";
    const labelElement = document.createElement("span");
    labelElement.textContent = fieldName;
    const select = document.createElement("select");
    select.value = value;
    select.dataset.inspectorField = fieldName;
    select.dataset.testid = `dev-inspector-${fieldName}`;
    for (const optionValue of options) {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      option.selected = optionValue === value;
      select.append(option);
    }
    select.addEventListener("pointerdown", (event) => event.stopPropagation());
    select.addEventListener("keydown", (event) => event.stopPropagation());
    row.append(labelElement, select);
    return row;
  }

  private createInspectorInputRow(
    fieldName: string,
    value: string,
    disabled: boolean,
    type: "number" | "text",
    note = ""
  ): HTMLLabelElement {
    const row = document.createElement("label");
    row.className = "dev-debug-inspector-row dev-debug-inspector-field";
    const labelElement = document.createElement("span");
    labelElement.textContent = fieldName;
    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    input.disabled = disabled;
    input.dataset.inspectorField = fieldName;
    input.dataset.testid = `dev-inspector-${fieldName}`;
    input.addEventListener("pointerdown", (event) => event.stopPropagation());
    input.addEventListener("keydown", (event) => event.stopPropagation());
    row.append(labelElement, input);
    if (note) {
      const noteElement = document.createElement("small");
      noteElement.textContent = note;
      row.append(noteElement);
    }
    return row;
  }

  private createInspectorCheckboxRow(fieldName: string, checked: boolean, onChange: (checked: boolean) => void): HTMLLabelElement {
    const row = document.createElement("label");
    row.className = "dev-debug-inspector-row dev-debug-inspector-field";
    const labelElement = document.createElement("span");
    labelElement.textContent = fieldName;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.dataset.inspectorField = fieldName;
    input.dataset.testid = `dev-inspector-${fieldName}`;
    input.addEventListener("pointerdown", (event) => event.stopPropagation());
    input.addEventListener("keydown", (event) => event.stopPropagation());
    input.addEventListener("change", () => onChange(input.checked));
    row.append(labelElement, input);
    return row;
  }

  private applyInspectorChanges(): void {
    if (!this.selectedObject) {
      this.showCopyFeedback("Select an object first");
      return;
    }

    const object = this.selectedObject;
    const before = this.captureHistorySnapshot();
    const values = this.readInspectorValues();
    const parsed = parseInspectorRectValues(values, {
      includeSize: object.data.resizable === true,
      snap: this.snapEnabled,
      gridSize: GRID_SIZE
    });
    if (!parsed.ok) {
      this.renderInspector(parsed.error);
      this.showCopyFeedback(parsed.error);
      return;
    }

    const labelValue = this.readInspectorField("label")?.trim();
    if (labelValue !== undefined && labelValue.length > 80) {
      this.renderInspector("label must be 80 characters or fewer.");
      this.showCopyFeedback("label must be 80 characters or fewer.");
      return;
    }

    const snapshot: DebugObjectData = {
      ...object.data,
      ...parsed.rect,
      ...(this.canEditLabel(object) && labelValue !== undefined ? { label: labelValue } : {})
    };

    let warningText = "";
    if (object.data.type === "checkpoint") {
      const checkpoint = this.parseCheckpointInspectorValues(object, snapshot);
      if (!checkpoint.ok) {
        this.renderInspector(checkpoint.error);
        this.showCopyFeedback(checkpoint.error);
        return;
      }
      Object.assign(snapshot, checkpoint.values);
    }

    if (object.data.type === "moving-platform") {
      const rect = {
        x: snapshot.x,
        y: snapshot.y,
        width: snapshot.width,
        height: snapshot.height
      };
      const moving = parseMovingPlatformInspectorValues(this.readMovingPlatformInspectorValues(object.data, rect), rect, {
        snap: this.snapEnabled,
        gridSize: GRID_SIZE,
        worldWidth: this.geometry.worldWidth,
        worldHeight: this.geometry.worldHeight
      });
      if (!moving.ok) {
        this.renderInspector(moving.error);
        this.showCopyFeedback(moving.error);
        return;
      }
      Object.assign(snapshot, moving.fields);
      if (moving.fields.warning) {
        warningText = moving.fields.warning;
      }
    }

    const supportError = this.getBlockingSupportValidation(snapshot);
    if (supportError) {
      this.renderInspector(supportError);
      this.showCopyFeedback(supportError);
      return;
    }

    this.applyRuntimeSnapshot(object, snapshot);
    this.captureObjectOverride(object);
    this.markDirty(object);
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    if (warningText) {
      this.showCopyFeedback(`${warningText} Applied inspector changes to ${object.data.id}`);
    } else {
      this.showCopyFeedback(`Applied inspector changes to ${object.data.id}`);
    }
    this.recordHistory(`apply ${object.data.id}`, before);
  }

  private readInspectorValues(): { x: string; y: string; width?: string; height?: string } {
    return {
      x: this.readInspectorField("x") ?? "",
      y: this.readInspectorField("y") ?? "",
      width: this.readInspectorField("width"),
      height: this.readInspectorField("height")
    };
  }

  private readInspectorField(fieldName: string): string | undefined {
    const field = this.inspectorPanel.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-inspector-field="${fieldName}"]`);
    if (!field || field.disabled) {
      return undefined;
    }
    return field.value;
  }

  private readInspectorFieldRaw(fieldName: string): string | undefined {
    const field = this.inspectorPanel.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-inspector-field="${fieldName}"]`);
    return field?.value;
  }

  private readMovingPlatformInspectorValues(object: DebugObjectData, rect: Required<Pick<DebugObjectData, "x" | "y" | "width" | "height">>) {
    const axis = this.readInspectorFieldRaw("axis") ?? object.axis ?? "horizontal";
    const axisChanged = axis !== (object.axis ?? "horizontal");
    const current = movingPathFieldsForInspector({ ...object, ...rect, axis: axis === "vertical" ? "vertical" : "horizontal" });
    if (axisChanged) {
      if (axis === "vertical") {
        current.fromX = rect.x;
        current.toX = rect.x;
        current.fromY = rect.y;
        current.toY = rect.y + GRID_SIZE * 4;
      } else {
        current.fromX = rect.x;
        current.toX = rect.x + GRID_SIZE * 4;
        current.fromY = rect.y;
        current.toY = rect.y;
      }
    }
    return {
      axis,
      speed: this.readInspectorFieldRaw("speed") ?? String(object.speed ?? 20),
      fromX: axisChanged ? String(current.fromX) : this.readInspectorFieldRaw("fromX") ?? String(current.fromX),
      toX: axisChanged ? String(current.toX) : this.readInspectorFieldRaw("toX") ?? String(current.toX),
      fromY: axisChanged ? String(current.fromY) : this.readInspectorFieldRaw("fromY") ?? String(current.fromY),
      toY: axisChanged ? String(current.toY) : this.readInspectorFieldRaw("toY") ?? String(current.toY)
    };
  }

  private parseCheckpointInspectorValues(
    object: RuntimeDebugObject,
    snapshot: DebugObjectData
  ): { ok: true; values: Pick<DebugObjectData, "respawnX" | "respawnY" | "linkedRespawn"> } | { ok: false; error: string } {
    const linkedRespawn = this.isCheckpointRespawnLinked(object);
    if (linkedRespawn) {
      const dx = snapshot.x - object.data.x;
      const dy = snapshot.y - object.data.y;
      return {
        ok: true,
        values: {
          respawnX: (object.data.respawnX ?? object.data.x) + dx,
          respawnY: (object.data.respawnY ?? object.data.y) + dy,
          linkedRespawn
        }
      };
    }

    const respawnX = parseInspectorNumber(this.readInspectorFieldRaw("respawnX") ?? "", "respawnX");
    if (!respawnX.ok) {
      return respawnX;
    }
    const respawnY = parseInspectorNumber(this.readInspectorFieldRaw("respawnY") ?? "", "respawnY");
    if (!respawnY.ok) {
      return respawnY;
    }
    return {
      ok: true,
      values: {
        respawnX: this.snapEnabled ? snapValue(respawnX.value, GRID_SIZE) : respawnX.value,
        respawnY: this.snapEnabled ? snapValue(respawnY.value, GRID_SIZE) : respawnY.value,
        linkedRespawn
      }
    };
  }

  private getObjectStatus(object: RuntimeDebugObject): string {
    return describeDevObjectStatus({
      source: object.data.source,
      dirty: this.dirtyObjectIds.has(object.data.id),
      hasSavedOverride: this.savedOverrideObjectIds.has(object.data.id)
    });
  }

  private isCheckpointRespawnLinked(object: RuntimeDebugObject): boolean {
    if (object.data.type !== "checkpoint") {
      return false;
    }
    if (!this.checkpointLinkedRespawn.has(object.data.id)) {
      this.checkpointLinkedRespawn.set(object.data.id, object.data.linkedRespawn ?? true);
    }
    return this.checkpointLinkedRespawn.get(object.data.id) ?? true;
  }

  private getSelectedSupportValidation(object: RuntimeDebugObject): Array<{ label: string; result: DevSupportValidationResult }> {
    if (object.data.type === "checkpoint") {
      return [
        { label: "Support", result: validateDebugObjectSupport(object.data, this.geometry, { allowAdjacent: false, label: object.data.id }) },
        { label: "Respawn", result: validateCheckpointRespawnSupport(object.data, this.geometry) }
      ];
    }

    if (isSupportValidatedType(object.data.type)) {
      return [{ label: "Support", result: validateDebugObjectSupport(object.data, this.geometry, { allowAdjacent: true, label: object.data.id }) }];
    }

    return [];
  }

  private getBlockingSupportValidation(snapshot: DebugObjectData): string | null {
    if (!isSupportValidatedType(snapshot.type)) {
      return null;
    }
    const validations =
      snapshot.type === "checkpoint"
        ? [
            validateDebugObjectSupport(snapshot, this.geometry, { allowAdjacent: false, label: snapshot.id }),
            validateCheckpointRespawnSupport(snapshot, this.geometry)
          ]
        : [validateDebugObjectSupport(snapshot, this.geometry, { allowAdjacent: true, label: snapshot.id })];
    const error = validations.find((validation) => validation.status === "error");
    return error ? error.messages.join(" ") : null;
  }

  private canEditLabel(object: RuntimeDebugObject): boolean {
    return object.data.type === "platform" || object.data.type === "moving-platform";
  }

  private applyRuntimeSnapshot(object: RuntimeDebugObject, snapshot: DebugObjectData): void {
    const dx = snapshot.x - object.data.x;
    const dy = snapshot.y - object.data.y;
    if ((dx !== 0 || dy !== 0) && object.moveBy) {
      object.moveBy(dx, dy);
    }

    const dWidth = snapshot.width - object.data.width;
    const dHeight = snapshot.height - object.data.height;
    if ((dWidth !== 0 || dHeight !== 0) && object.resizeBy) {
      object.resizeBy(dWidth, dHeight);
    }

    object.data = {
      ...object.data,
      x: snapshot.x,
      y: snapshot.y,
      width: snapshot.width,
      height: snapshot.height,
      kind: snapshot.kind,
      label: snapshot.label,
      respawnX: snapshot.respawnX,
      respawnY: snapshot.respawnY,
      linkedRespawn: snapshot.linkedRespawn,
      axis: snapshot.axis,
      fromX: snapshot.fromX,
      toX: snapshot.toX,
      fromY: snapshot.fromY,
      toY: snapshot.toY,
      speed: snapshot.speed
    };
    this.syncGeometrySpec(object.data);
  }

  private syncGeometrySpec(data: DebugObjectData): void {
    const spec = findRectSpecById(this.geometry, data);
    if (!spec) {
      return;
    }

    spec.x = data.x;
    spec.y = data.y;
    spec.width = data.width;
    spec.height = data.height;
    const labeledSpec = spec as RectSpec & { kind?: string; label?: string };
    labeledSpec.kind = data.kind;
    labeledSpec.label = data.label;

    if (data.type === "moving-platform") {
      const movingSpec = spec as RectSpec & {
        axis?: "horizontal" | "vertical";
        fromX?: number;
        toX?: number;
        fromY?: number;
        toY?: number;
        speed?: number;
      };
      movingSpec.axis = data.axis ?? movingSpec.axis;
      movingSpec.fromX = data.fromX ?? movingSpec.fromX;
      movingSpec.toX = data.toX ?? movingSpec.toX;
      movingSpec.fromY = data.fromY ?? movingSpec.fromY;
      movingSpec.toY = data.toY ?? movingSpec.toY;
      movingSpec.speed = data.speed ?? movingSpec.speed;
    }

    if (data.type === "checkpoint") {
      const checkpointSpec = spec as RectSpec & { respawnX?: number; respawnY?: number };
      checkpointSpec.respawnX = data.respawnX ?? checkpointSpec.respawnX;
      checkpointSpec.respawnY = data.respawnY ?? checkpointSpec.respawnY;
    }
  }

  private bindInput(): void {
    this.scene.input.on("pointerdown", this.handlePointerDown, this);
    this.scene.input.on("pointermove", this.handlePointerMove, this);
    this.scene.input.on("pointerup", this.handlePointerUp, this);
    this.scene.input.keyboard?.on("keydown", this.handleKeyDown, this);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    if (key === "f1") {
      event.preventDefault();
      this.toggleOverlay();
      return;
    }

    if (!this.overlayVisible || key === "escape") {
      return;
    }

    if (isDevEditorTextInput(event.target)) {
      return;
    }

    if ((event.ctrlKey || event.metaKey) && key === "z") {
      event.preventDefault();
      if (event.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
      return;
    }
    if ((event.ctrlKey || event.metaKey) && key === "y") {
      event.preventDefault();
      this.redo();
      return;
    }

    if (key === "g") {
      event.preventDefault();
      this.toggleGrid();
      return;
    }
    if (key === "h") {
      event.preventDefault();
      this.toggleBounds();
      return;
    }
    if (key === "p") {
      event.preventDefault();
      this.toggleLabels();
      return;
    }
    if (key === "x") {
      event.preventDefault();
      this.toggleSnap();
      return;
    }
    if (key === "a" && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.addStaticPlatform();
      return;
    }
    if (key === "c") {
      event.preventDefault();
      void this.copyPoint(event.shiftKey ? "pointer" : "player");
      return;
    }
    if (key === "j") {
      event.preventDefault();
      void this.copySelected("json");
      return;
    }
    if (key === "t") {
      event.preventDefault();
      void this.copySelected("typescript");
      return;
    }
    if (key === "e") {
      event.preventDefault();
      void this.copyAllGeometry();
      return;
    }
    if (key === "s") {
      event.preventDefault();
      void (event.shiftKey ? this.saveDirtyObjects() : this.saveSelectedObject());
      return;
    }
    if (key === "d" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.duplicateSelectedPlatform();
      return;
    }
    if (key === "d" && event.shiftKey) {
      event.preventDefault();
      void this.revertSelectedOverride();
      return;
    }
    if (key === "delete" || key === "backspace") {
      event.preventDefault();
      this.deleteSelectedPlatform();
      return;
    }

    if (event.key.startsWith("Arrow")) {
      if (event.ctrlKey || event.metaKey) {
        this.resizeSelectedFromKey(event);
      } else {
        this.nudgeSelectedFromKey(event);
      }
    }
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.overlayVisible) {
      return;
    }

    const world = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    if (this.isPointerOnRespawnMarker(world.x, world.y)) {
      if (this.selectedObject && this.isCheckpointRespawnLinked(this.selectedObject)) {
        this.showCopyFeedback("Turn Linked Respawn off to drag the respawn marker independently.");
        return;
      }
      this.activeDragHistorySnapshot = this.captureHistorySnapshot();
      this.activeDragHistoryLabel = `move respawn ${this.selectedObject?.data.id ?? ""}`.trim();
      this.draggingRespawnMarker = true;
      this.showCopyFeedback(`Dragging respawn marker for ${this.selectedObject?.data.id}`);
      return;
    }

    const pathHandle = this.findMovingPathHandle(world.x, world.y);
    if (pathHandle) {
      this.activeDragHistorySnapshot = this.captureHistorySnapshot();
      this.activeDragHistoryLabel = `move ${pathHandle} endpoint ${this.selectedObject?.data.id ?? ""}`.trim();
      this.draggingPathHandle = pathHandle;
      this.showCopyFeedback(`Dragging ${pathHandle} endpoint for ${this.selectedObject?.data.id}`);
      return;
    }

    const hit = [...this.objects].reverse().find((object) => pointInObject(world.x, world.y, object.data));
    this.selectedObject = hit ?? null;
    this.renderInspector();
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.overlayVisible || !this.selectedObject) {
      return;
    }

    const world = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    if (this.draggingRespawnMarker) {
      this.moveSelectedRespawnMarker(world.x, world.y);
      return;
    }
    if (this.draggingPathHandle) {
      this.moveSelectedMovingPathHandle(this.draggingPathHandle, world.x, world.y);
    }
  }

  private handlePointerUp(): void {
    if (this.activeDragHistorySnapshot) {
      this.recordHistory(this.activeDragHistoryLabel || "drag edit", this.activeDragHistorySnapshot);
    }
    this.activeDragHistorySnapshot = null;
    this.activeDragHistoryLabel = "";
    this.draggingPathHandle = null;
    this.draggingRespawnMarker = false;
  }

  private isPointerOnRespawnMarker(worldX: number, worldY: number): boolean {
    if (!this.selectedObject || this.selectedObject.data.type !== "checkpoint") {
      return false;
    }
    const respawn = checkpointRespawnPoint(this.selectedObject.data);
    return Phaser.Math.Distance.Between(worldX, worldY, respawn.x, respawn.y) <= RESPAWN_HANDLE_RADIUS;
  }

  private moveSelectedRespawnMarker(worldX: number, worldY: number): void {
    const object = this.selectedObject;
    if (!object || object.data.type !== "checkpoint") {
      return;
    }
    const snapshot: DebugObjectData = {
      ...object.data,
      respawnX: this.snapEnabled ? snapValue(worldX, GRID_SIZE) : Math.round(worldX),
      respawnY: this.snapEnabled ? snapValue(worldY, GRID_SIZE) : Math.round(worldY),
      linkedRespawn: false
    };
    this.checkpointLinkedRespawn.set(object.data.id, false);
    const respawnValidation = validateCheckpointRespawnSupport(snapshot, this.geometry);
    if (respawnValidation.status === "error") {
      this.showCopyFeedback(respawnValidation.messages.join(" "));
      return;
    }

    this.applyRuntimeSnapshot(object, snapshot);
    this.captureObjectOverride(object);
    this.markDirty(object);
    this.drawSupportMarkers();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.lastFeedback = `Moved respawn marker for ${object.data.id}`;
  }

  private findMovingPathHandle(worldX: number, worldY: number): MovingPathHandle | null {
    if (!this.selectedObject || this.selectedObject.data.type !== "moving-platform") {
      return null;
    }

    const endpoints = movingPathHandleCenters(this.selectedObject.data, this.selectedObject.gameObject);
    if (Phaser.Math.Distance.Between(worldX, worldY, endpoints.start.x, endpoints.start.y) <= MOVING_HANDLE_RADIUS) {
      return "start";
    }
    if (Phaser.Math.Distance.Between(worldX, worldY, endpoints.end.x, endpoints.end.y) <= MOVING_HANDLE_RADIUS) {
      return "end";
    }
    return null;
  }

  private moveSelectedMovingPathHandle(handle: MovingPathHandle, worldX: number, worldY: number): void {
    const object = this.selectedObject;
    if (!object || object.data.type !== "moving-platform") {
      return;
    }

    const axis = object.data.axis ?? "horizontal";
    const snapshot: DebugObjectData = { ...object.data };
    if (axis === "vertical") {
      const nextY = this.snapEnabled ? snapValue(worldY - object.data.height / 2, GRID_SIZE) : Math.round(worldY - object.data.height / 2);
      if (handle === "start") {
        snapshot.fromY = nextY;
      } else {
        snapshot.toY = nextY;
      }
      snapshot.fromX = object.data.x;
      snapshot.toX = object.data.x;
    } else {
      const nextX = this.snapEnabled ? snapValue(worldX - object.data.width / 2, GRID_SIZE) : Math.round(worldX - object.data.width / 2);
      if (handle === "start") {
        snapshot.fromX = nextX;
      } else {
        snapshot.toX = nextX;
      }
      snapshot.fromY = object.data.y;
      snapshot.toY = object.data.y;
    }

    const path = parseMovingPlatformInspectorValues(
      {
        axis,
        speed: String(snapshot.speed ?? object.data.speed ?? 20),
        fromX: String(snapshot.fromX ?? object.data.x),
        toX: String(snapshot.toX ?? object.data.x),
        fromY: String(snapshot.fromY ?? object.data.y),
        toY: String(snapshot.toY ?? object.data.y)
      },
      { x: snapshot.x, y: snapshot.y, width: snapshot.width, height: snapshot.height },
      { worldWidth: this.geometry.worldWidth, worldHeight: this.geometry.worldHeight }
    );
    if (!path.ok) {
      this.showCopyFeedback(path.error);
      return;
    }

    Object.assign(snapshot, path.fields);
    this.applyRuntimeSnapshot(object, snapshot);
    this.captureObjectOverride(object);
    this.markDirty(object);
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.renderInspector();
    this.refreshValidationIfAuto();
    if (path.fields.warning) {
      this.showCopyFeedback(path.fields.warning);
    } else {
      this.lastFeedback = `Moved ${handle} endpoint for ${object.data.id}`;
    }
  }

  private toggleOverlay(): void {
    this.overlayVisible = !this.overlayVisible;
    this.panel.hidden = !this.overlayVisible;
    this.panel.setAttribute("aria-hidden", String(!this.overlayVisible));
    this.renderInspector();
    this.statusPanel.textContent = this.getPanelText();

    if (!this.overlayVisible) {
      this.copyPanel.hidden = true;
      this.gridGraphics.setVisible(false);
      this.boundsGraphics.setVisible(false);
      this.pathGraphics.clear();
      this.pathGraphics.setVisible(false);
      this.supportGraphics.clear();
      this.supportGraphics.setVisible(false);
      this.validationGraphics.clear();
      this.validationGraphics.setVisible(false);
      this.clearValidationLabels();
      this.clearLabels();
      this.selectedObject = null;
      this.renderInspector();
      return;
    }

    this.gridGraphics.setVisible(this.gridVisible);
    this.boundsGraphics.setVisible(this.boundsVisible);
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawValidationMarkers();
    if (this.labelsVisible) {
      this.drawLabels();
    }
  }

  private toggleGrid(): void {
    this.gridVisible = !this.gridVisible;
    this.gridGraphics.setVisible(this.gridVisible);
    this.panel.dataset.grid = String(this.gridVisible);
  }

  private toggleBounds(): void {
    this.boundsVisible = !this.boundsVisible;
    this.boundsGraphics.setVisible(this.boundsVisible);
    this.panel.dataset.bounds = String(this.boundsVisible);
  }

  private toggleLabels(): void {
    this.labelsVisible = !this.labelsVisible;
    this.panel.dataset.labels = String(this.labelsVisible);
    if (this.labelsVisible) {
      this.drawLabels();
    } else {
      this.clearLabels();
    }
  }

  private toggleSnap(): void {
    this.snapEnabled = !this.snapEnabled;
    this.panel.dataset.snap = String(this.snapEnabled);
    const button = this.toolbar.querySelector<HTMLButtonElement>('[data-testid="dev-snap-toggle"]');
    if (button) {
      button.textContent = `Snap: ${this.snapEnabled ? "On" : "Off"}`;
    }
    this.renderInspector();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.showCopyFeedback(`Snap ${this.snapEnabled ? "enabled" : "disabled"} (${GRID_SIZE}px)`);
  }

  private nudgeSelectedFromKey(event: KeyboardEvent): void {
    if (!this.selectedObject?.moveBy) {
      return;
    }

    event.preventDefault();
    const before = this.captureHistorySnapshot();
    const step = event.altKey ? GRID_SIZE : event.shiftKey ? 10 : 1;
    const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
    const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
    if (dx === 0 && dy === 0) {
      return;
    }

    this.selectedObject.moveBy(dx, dy);
    if (this.snapEnabled) {
      this.snapSelectedPosition();
    }
    this.markDirty(this.selectedObject);
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.lastFeedback = `Nudged ${this.selectedObject.data.type}:${this.selectedObject.data.id}`;
    this.recordHistory(`move ${this.selectedObject.data.id}`, before);
  }

  private resizeSelectedFromKey(event: KeyboardEvent): void {
    if (!this.selectedObject) {
      return;
    }

    event.preventDefault();
    if (!this.selectedObject.resizeBy) {
      this.showCopyFeedback("Selected object is not resizable");
      return;
    }

    const before = this.captureHistorySnapshot();
    const step = event.altKey ? GRID_SIZE : event.shiftKey ? 10 : 1;
    const dWidth = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
    const dHeight = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
    if (dWidth === 0 && dHeight === 0) {
      return;
    }

    this.selectedObject.resizeBy(dWidth, dHeight);
    if (this.snapEnabled) {
      this.snapSelectedSize();
    }
    this.markDirty(this.selectedObject);
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.lastFeedback = `Resized ${this.selectedObject.data.type}:${this.selectedObject.data.id}`;
    this.recordHistory(`resize ${this.selectedObject.data.id}`, before);
  }

  private snapSelectedPosition(): void {
    if (!this.selectedObject?.moveBy) {
      return;
    }

    const snapped = snapRect(this.selectedObject.data, GRID_SIZE);
    const dx = snapped.x - this.selectedObject.data.x;
    const dy = snapped.y - this.selectedObject.data.y;
    if (dx !== 0 || dy !== 0) {
      this.selectedObject.moveBy(dx, dy);
    }
  }

  private snapSelectedSize(): void {
    if (!this.selectedObject?.resizeBy) {
      return;
    }

    const snapped = snapRect(this.selectedObject.data, GRID_SIZE);
    const dWidth = snapped.width - this.selectedObject.data.width;
    const dHeight = snapped.height - this.selectedObject.data.height;
    if (dWidth !== 0 || dHeight !== 0) {
      this.selectedObject.resizeBy(dWidth, dHeight);
    }
  }

  private addStaticPlatform(): void {
    const before = this.captureHistorySnapshot();
    const position = this.resolveNewPlatformPosition(DEFAULT_DEV_PLATFORM_WIDTH, DEFAULT_DEV_PLATFORM_HEIGHT);
    const id = generateDevPlatformId({
      levelId: this.geometry.levelId,
      chapterId: this.activeChapterId,
      existingIds: this.objects.map((object) => object.data.id)
    });
    const override = createDevStaticPlatformOverride({ id, x: position.x, y: position.y, snap: this.snapEnabled, gridSize: GRID_SIZE });
    const object = this.createRuntimeStaticPlatform(toPlatformSpec(override), "added");

    this.currentOverrides = {
      ...this.currentOverrides,
      addedObjects: [...this.currentOverrides.addedObjects, override],
      deletedObjectIds: this.currentOverrides.deletedObjectIds.filter((deletedId) => deletedId !== id)
    };
    this.deletedObjectIds.delete(id);
    this.selectedObject = object;
    this.markDirty(object);
    this.drawBounds();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.showCopyFeedback(`Added platform ${id}`);
    this.recordHistory(`add ${id}`, before);
  }

  private addMovingPlatform(axis: "horizontal" | "vertical"): void {
    const before = this.captureHistorySnapshot();
    const position = this.resolveNewPlatformPosition(192, 32);
    const id = generateDevMovingPlatformId({
      levelId: this.geometry.levelId,
      chapterId: this.activeChapterId,
      existingIds: this.objects.map((object) => object.data.id),
      variant: axis === "vertical" ? "elevator" : "moving-platform"
    });
    const override = createDevMovingPlatformOverride({
      id,
      x: position.x,
      y: position.y,
      axis,
      snap: this.snapEnabled,
      gridSize: GRID_SIZE
    });
    const object = this.createRuntimeMovingPlatform(movingPlatformSpecFromOverride(override), "added");

    this.currentOverrides = {
      ...this.currentOverrides,
      addedObjects: [...this.currentOverrides.addedObjects, override],
      deletedObjectIds: this.currentOverrides.deletedObjectIds.filter((deletedId) => deletedId !== id)
    };
    this.deletedObjectIds.delete(id);
    this.selectedObject = object;
    this.markDirty(object);
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.showCopyFeedback(`Added ${axis === "vertical" ? "elevator" : "moving platform"} ${id}`);
    this.recordHistory(`add ${id}`, before);
  }

  private duplicateSelectedPlatform(): void {
    if (!this.selectedObject || (this.selectedObject.data.type !== "platform" && this.selectedObject.data.type !== "moving-platform")) {
      this.showCopyFeedback("Duplicate currently supports static and moving platforms only.");
      return;
    }

    const before = this.captureHistorySnapshot();
    const source = this.selectedObject.data;
    const id = generateDevPlatformId({
      levelId: this.geometry.levelId,
      chapterId: this.activeChapterId,
      existingIds: this.objects.map((object) => object.data.id)
    });
    if (source.type === "moving-platform") {
      const movingId = generateDevMovingPlatformId({
        levelId: this.geometry.levelId,
        chapterId: this.activeChapterId,
        existingIds: this.objects.map((object) => object.data.id),
        variant: source.axis === "vertical" ? "elevator" : "moving-platform"
      });
      const offset = GRID_SIZE;
      const rect = this.snapEnabled
        ? snapRect({ x: source.x + offset, y: source.y + offset, width: source.width, height: source.height }, GRID_SIZE)
        : { x: source.x + offset, y: source.y + offset, width: source.width, height: source.height };
      const snapEndpoint = (value: number) => (this.snapEnabled ? snapValue(value, GRID_SIZE) : value);
      const moved = {
        ...source,
        id: movingId,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        fromX: snapEndpoint(source.fromX === undefined ? rect.x : source.fromX + offset),
        toX: snapEndpoint(source.toX === undefined ? rect.x : source.toX + offset),
        fromY: snapEndpoint(source.fromY === undefined ? rect.y : source.fromY + offset),
        toY: snapEndpoint(source.toY === undefined ? rect.y : source.toY + offset),
        label: source.label ?? "Duplicated moving platform"
      };
      const override = serializeDebugObjectForOverride(moved);
      const object = this.createRuntimeMovingPlatform(movingPlatformSpecFromOverride(override), "added");

      this.currentOverrides = {
        ...this.currentOverrides,
        addedObjects: [...this.currentOverrides.addedObjects, override]
      };
      this.selectedObject = object;
      this.markDirty(object);
      this.drawBounds();
      this.drawMovingPathPreview();
      this.drawLabels();
      this.renderInspector();
      this.refreshValidationIfAuto();
      this.showCopyFeedback(`Duplicated moving platform as ${movingId}`);
      this.recordHistory(`duplicate ${movingId}`, before);
      return;
    }

    const rect = this.snapEnabled
      ? snapRect({ x: source.x + GRID_SIZE, y: source.y + GRID_SIZE, width: source.width, height: source.height }, GRID_SIZE)
      : { x: source.x + GRID_SIZE, y: source.y + GRID_SIZE, width: source.width, height: source.height };
    const override = createDevStaticPlatformOverride({
      id,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      label: source.label ?? "Duplicated platform"
    });
    const object = this.createRuntimeStaticPlatform(toPlatformSpec(override), "added");

    this.currentOverrides = {
      ...this.currentOverrides,
      addedObjects: [...this.currentOverrides.addedObjects, override]
    };
    this.selectedObject = object;
    this.markDirty(object);
    this.drawBounds();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.showCopyFeedback(`Duplicated static platform as ${id}`);
    this.recordHistory(`duplicate ${id}`, before);
  }

  private deleteSelectedPlatform(): void {
    if (!this.selectedObject || (this.selectedObject.data.type !== "platform" && this.selectedObject.data.type !== "moving-platform")) {
      this.showCopyFeedback("Delete currently supports static platforms and added moving platforms only.");
      return;
    }
    if (this.selectedObject.data.type === "moving-platform" && this.selectedObject.data.source !== "added") {
      this.showCopyFeedback("Deleting base moving platforms is deferred; duplicate or tune them through overrides for now.");
      return;
    }

    const before = this.captureHistorySnapshot();
    const object = this.selectedObject;
    const deletedId = object.data.id;
    if (object.data.source === "added") {
      this.currentOverrides = {
        ...this.currentOverrides,
        addedObjects: this.currentOverrides.addedObjects.filter((candidate) => candidate.id !== deletedId),
        deletedObjectIds: this.currentOverrides.deletedObjectIds.filter((candidate) => candidate !== deletedId)
      };
      this.deletedObjectIds.delete(deletedId);
    } else {
      const objects = { ...this.currentOverrides.objects };
      delete objects[deletedId];
      this.deletedObjectIds.add(deletedId);
      this.currentOverrides = {
        ...this.currentOverrides,
        objects,
        deletedObjectIds: [...this.deletedObjectIds]
      };
    }

    this.removeRuntimeObject(object);
    this.dirtyObjectIds.add(deletedId);
    this.selectedObject = null;
    this.drawBounds();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.showCopyFeedback(`Deleted ${object.data.type === "moving-platform" ? "moving platform" : "static platform"} ${deletedId}. Use Save All to persist.`);
    this.recordHistory(`delete ${deletedId}`, before);
  }

  private async saveSelectedObject(): Promise<void> {
    if (!this.selectedObject) {
      this.showCopyFeedback("Select an object first");
      return;
    }

    if (!this.isSelectedBaseResetPending()) {
      this.captureObjectOverride(this.selectedObject);
    }
    await this.saveOverrides(this.selectedObject.data.id);
  }

  private async saveDirtyObjects(): Promise<void> {
    if (this.dirtyObjectIds.size === 0) {
      this.showCopyFeedback("No unsaved debug changes");
      return;
    }

    for (const object of this.objects.filter((object) => this.dirtyObjectIds.has(object.data.id))) {
      if (!isBaseResetPending(object, this.currentOverrides)) {
        this.captureObjectOverride(object);
      }
    }
    await this.saveOverrides();
  }

  private async saveOverrides(singleObjectId?: string): Promise<void> {
    const validationError = this.validateVisibleMovingPlatforms();
    if (validationError) {
      this.showCopyFeedback(validationError);
      this.renderInspector(validationError);
      return;
    }
    const supportError = this.validateVisibleSupportErrors();
    if (supportError) {
      this.showCopyFeedback(supportError);
      this.renderInspector(supportError);
      return;
    }

    try {
      const saved = await saveDevLevelOverridesFile(this.geometry.levelId, {
        ...this.currentOverrides,
        version: 2,
        levelId: this.geometry.levelId,
        chapterId: this.activeChapterId ?? undefined,
        updatedAt: new Date().toISOString(),
        deletedObjectIds: [...this.deletedObjectIds]
      });
      this.currentOverrides = cloneOverrides(saved);
      this.savedOverrides = cloneOverrides(saved);
      this.deletedObjectIds = new Set(saved.deletedObjectIds);
      this.savedOverrideObjectIds.clear();
      for (const objectId of Object.keys(saved.objects)) {
        this.savedOverrideObjectIds.add(objectId);
      }
      for (const object of saved.addedObjects) {
        this.savedOverrideObjectIds.add(object.id);
      }

      if (singleObjectId) {
        this.dirtyObjectIds.delete(singleObjectId);
      } else {
        this.dirtyObjectIds.clear();
      }
      for (const object of this.objects) {
        object.data.dirty = this.dirtyObjectIds.has(object.data.id);
      }
      this.refreshOverrideFlags();
      this.updateHistoryButtons();
      this.renderInspector();
      this.renderOverrideSummary();
      this.drawMovingPathPreview();
      this.drawSupportMarkers();
      this.refreshValidationIfAuto();
      this.showCopyFeedback(singleObjectId ? "Saved dev override" : "Saved all dev overrides");
    } catch (error) {
      console.error(error);
      this.showCopyFeedback("Save failed - check console");
    }
  }

  private validateVisibleMovingPlatforms(): string | null {
    for (const object of this.objects) {
      if (object.data.type !== "moving-platform") {
        continue;
      }
      const path = movingPathFieldsForInspector(object.data);
      const parsed = parseMovingPlatformInspectorValues(
        {
          axis: object.data.axis ?? "horizontal",
          speed: String(object.data.speed ?? 20),
          fromX: String(path.fromX),
          toX: String(path.toX),
          fromY: String(path.fromY),
          toY: String(path.toY)
        },
        { x: object.data.x, y: object.data.y, width: object.data.width, height: object.data.height },
        { worldWidth: this.geometry.worldWidth, worldHeight: this.geometry.worldHeight }
      );
      if (!parsed.ok) {
        return `${object.data.id}: ${parsed.error}`;
      }
    }
    return null;
  }

  private validateVisibleSupportErrors(): string | null {
    for (const object of this.objects) {
      if (!this.dirtyObjectIds.has(object.data.id) || !isSupportValidatedType(object.data.type)) {
        continue;
      }
      const error = this.getBlockingSupportValidation(object.data);
      if (error) {
        return error;
      }
    }
    return null;
  }

  private async revertSelectedOverride(): Promise<void> {
    if (!this.selectedObject) {
      this.showCopyFeedback("Select an object first");
      return;
    }

    const before = this.captureHistorySnapshot();
    const object = this.selectedObject;
    const revertedId = object.data.id;
    if (object.data.source === "added") {
      this.deleteSelectedPlatform();
      this.showCopyFeedback(`Revert Override removed added ${object.data.type === "moving-platform" ? "moving platform" : "platform"} ${revertedId}. Use Save All to persist.`);
      return;
    }

    if (!object.baseData) {
      this.showCopyFeedback("No base geometry snapshot available for this object.");
      return;
    }

    const objects = { ...this.currentOverrides.objects };
    delete objects[revertedId];
    this.currentOverrides = { ...this.currentOverrides, objects };
    this.applyRuntimeSnapshot(object, object.baseData);
    object.data.hasOverride = this.savedOverrideObjectIds.has(revertedId);
    this.markDirty(object);
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.showCopyFeedback(`Reverted override for ${revertedId}. Use Save All to persist.`);
    this.recordHistory(`revert ${revertedId}`, before);
  }

  private revertSelectedUnsaved(): void {
    if (!this.selectedObject) {
      this.showCopyFeedback("Select an object first");
      return;
    }

    const before = this.captureHistorySnapshot();
    const object = this.selectedObject;
    const objectId = object.data.id;

    if (object.data.source === "added") {
      const savedAdded = this.savedOverrides.addedObjects.find((candidate) => candidate.id === objectId);
      if (!savedAdded) {
        this.removeRuntimeObject(object);
        this.currentOverrides = {
          ...this.currentOverrides,
          addedObjects: this.currentOverrides.addedObjects.filter((candidate) => candidate.id !== objectId)
        };
        this.dirtyObjectIds.delete(objectId);
        this.selectedObject = null;
        this.drawBounds();
        this.drawMovingPathPreview();
        this.drawSupportMarkers();
        this.drawLabels();
        this.renderInspector();
        this.refreshValidationIfAuto();
        this.showCopyFeedback(`Removed unsaved added platform ${objectId}.`);
        this.recordHistory(`revert unsaved ${objectId}`, before);
        return;
      }

      this.currentOverrides = {
        ...this.currentOverrides,
        addedObjects: this.currentOverrides.addedObjects.map((candidate) => (candidate.id === objectId ? savedAdded : candidate))
      };
      this.applyRuntimeSnapshot(object, { ...object.data, ...savedAdded });
    } else {
      const savedOverride = this.savedOverrides.objects[objectId];
      const target = savedOverride ? { ...object.data, ...savedOverride } : object.baseData;
      if (!target) {
        this.showCopyFeedback("No saved or base state available for this object.");
        return;
      }

      const objects = { ...this.currentOverrides.objects };
      if (savedOverride) {
        objects[objectId] = savedOverride;
      } else {
        delete objects[objectId];
      }
      this.currentOverrides = { ...this.currentOverrides, objects };
      this.applyRuntimeSnapshot(object, target);
    }

    this.dirtyObjectIds.delete(objectId);
    object.data.dirty = false;
    object.data.hasOverride = this.savedOverrideObjectIds.has(objectId);
    this.drawBounds();
    this.drawMovingPathPreview();
    this.drawSupportMarkers();
    this.drawLabels();
    this.renderInspector();
    this.refreshValidationIfAuto();
    this.showCopyFeedback(`Reverted unsaved changes for ${objectId}.`);
    this.recordHistory(`revert unsaved ${objectId}`, before);
  }

  private captureObjectOverride(object: RuntimeDebugObject): void {
    const override = serializeDebugObjectForOverride(object.data);
    if (object.data.source === "added") {
      const nextAdded = this.currentOverrides.addedObjects.filter((candidate) => candidate.id !== override.id);
      this.currentOverrides = { ...this.currentOverrides, addedObjects: [...nextAdded, override] };
      return;
    }

    if (object.baseData && debugObjectMatches(object.data, object.baseData)) {
      const objects = { ...this.currentOverrides.objects };
      delete objects[override.id];
      this.currentOverrides = { ...this.currentOverrides, objects };
      return;
    }

    this.currentOverrides = {
      ...this.currentOverrides,
      objects: {
        ...this.currentOverrides.objects,
        [override.id]: override
      }
    };
  }

  private isSelectedBaseResetPending(): boolean {
    return this.selectedObject ? isBaseResetPending(this.selectedObject, this.currentOverrides) : false;
  }

  private resolveNewPlatformPosition(width = DEFAULT_DEV_PLATFORM_WIDTH, height = DEFAULT_DEV_PLATFORM_HEIGHT): { x: number; y: number } {
    const pointer = this.scene.input.activePointer;
    const camera = this.scene.cameras.main;
    const hasPointer = pointer.x > 0 || pointer.y > 0;
    const world = hasPointer ? camera.getWorldPoint(pointer.x, pointer.y) : { x: camera.scrollX + camera.width / 2, y: camera.scrollY + camera.height / 2 };
    return {
      x: Math.round(world.x - width / 2),
      y: Math.round(world.y - height / 2)
    };
  }

  private createRuntimeStaticPlatform(spec: PlatformSpec, source: "base" | "added"): RuntimeDebugObject {
    this.geometry.platforms.push(spec);
    const rectangle = this.scene.add
      .rectangle(spec.x + spec.width / 2, spec.y + spec.height / 2, spec.width, spec.height, colorForPlatformKind(spec.kind), 0.92)
      .setStrokeStyle(1, PLATFORM_COLORS.gold, 0.58);
    this.scene.physics.add.existing(rectangle, true);
    (rectangle.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
    this.builtLevel.platforms.push(rectangle);
    this.scene.physics.add.collider(this.builtLevel.player, rectangle);

    const runtimeObject = this.buildRuntimeObject("platform", spec, rectangle, true, true, source);
    this.objects.push(runtimeObject);
    return runtimeObject;
  }

  private createRuntimeMovingPlatform(spec: MovingPlatformSpec, source: "base" | "added"): RuntimeDebugObject {
    this.geometry.movingPlatforms.push(spec);
    const rectangle = this.scene.add
      .rectangle(spec.x + spec.width / 2, spec.y + spec.height / 2, spec.width, spec.height, spec.kind === "paper" ? PLATFORM_COLORS.paper : PLATFORM_COLORS.tram, 0.92)
      .setStrokeStyle(2, PLATFORM_COLORS.gold, 0.52);
    this.scene.physics.add.existing(rectangle);
    const body = rectangle.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(spec.width, spec.height);
    const axis = spec.axis ?? "horizontal";
    const direction: 1 | -1 = axis === "vertical" && spec.toY !== undefined && spec.y >= spec.toY ? -1 : 1;
    if (axis === "vertical") {
      body.setVelocityY(direction * spec.speed);
    } else {
      body.setVelocityX(direction * spec.speed);
    }
    const movingPlatform: MovingPlatformRuntime = { spec, body: rectangle, direction };
    this.builtLevel.movingPlatforms.push(movingPlatform);
    this.scene.physics.add.collider(this.builtLevel.player, rectangle);
    const runtimeObject = this.addMovingPlatformObject(movingPlatform, source);
    return runtimeObject;
  }

  private removeRuntimeObject(object: RuntimeDebugObject): void {
    object.gameObject?.destroy();
    if (object.data.type === "moving-platform") {
      this.geometry.movingPlatforms = this.geometry.movingPlatforms.filter((platform) => platform.id !== object.data.id);
      this.builtLevel.movingPlatforms = this.builtLevel.movingPlatforms.filter((platform) => platform.body !== object.gameObject);
    } else {
      this.geometry.platforms = this.geometry.platforms.filter((platform) => platform.id !== object.data.id);
      this.builtLevel.platforms = this.builtLevel.platforms.filter((platform) => platform !== object.gameObject);
    }
    const index = this.objects.indexOf(object);
    if (index >= 0) {
      this.objects.splice(index, 1);
    }
  }

  private async copyPoint(kind: "player" | "pointer"): Promise<void> {
    const point =
      kind === "player"
        ? { x: this.builtLevel.player.x, y: this.builtLevel.player.y }
        : this.scene.cameras.main.getWorldPoint(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
    const copied = await this.copyText(formatDebugPoint(point), `Copied ${kind} position`);
    if (!copied) {
      this.lastFeedback = `Showing ${kind} position for manual copy`;
    }
  }

  private async copySelected(format: "json" | "typescript"): Promise<void> {
    if (!this.selectedObject) {
      this.showCopyFeedback("Select an object first");
      return;
    }

    const text =
      format === "json"
        ? serializeDebugObjectAsJson(this.selectedObject.data)
        : serializeDebugObjectAsTypeScript(this.selectedObject.data);
    await this.copyText(text, `Copied selected ${this.selectedObject.data.type} ${format === "json" ? "JSON" : "TypeScript"}`);
  }

  private async copyAllGeometry(): Promise<void> {
    await this.copyText(
      serializeDebugObjectsAsTypeScript(this.objects.map((object) => object.data)),
      "Copied current debug geometry export"
    );
  }

  private async copyText(text: string, feedback: string): Promise<boolean> {
    const copied = await copyTextToClipboard(text, (fallbackText) => {
      this.copyPanel.value = fallbackText;
      this.copyPanel.hidden = false;
      this.copyPanel.focus();
      this.copyPanel.select();
    });
    this.showCopyFeedback(copied ? feedback : `${feedback} - manual copy panel shown`);
    return copied;
  }

  private showCopyFeedback(text: string): void {
    this.lastFeedback = text;
    this.showHint(text);
    this.statusPanel.textContent = this.getPanelText();
  }

  private markDirty(object: RuntimeDebugObject): void {
    this.dirtyObjectIds.add(object.data.id);
    object.data.dirty = true;
    object.data.hasOverride = this.savedOverrideObjectIds.has(object.data.id);
  }

  private refreshOverrideFlags(): void {
    for (const object of this.objects) {
      object.data.hasOverride =
        this.savedOverrideObjectIds.has(object.data.id) ||
        this.currentOverrides.addedObjects.some((addedObject) => addedObject.id === object.data.id);
    }
  }

  private registerObjects(): void {
    const addedObjectIds = new Set(this.currentOverrides.addedObjects.map((object) => object.id));
    this.geometry.platforms.forEach((spec, index) => {
      this.addRuntimeObject("platform", spec, this.builtLevel.platforms[index], true, true, addedObjectIds.has(spec.id) ? "added" : "base");
    });

    for (const movingPlatform of this.builtLevel.movingPlatforms) {
      this.addMovingPlatformObject(movingPlatform, addedObjectIds.has(movingPlatform.spec.id) ? "added" : "base");
    }
    for (const platform of this.builtLevel.rebuildablePlatforms) {
      this.addRuntimeObject("rebuildable-platform", platform.spec, platform.body, true, true);
    }
    for (const trigger of this.builtLevel.rebuildTriggers) {
      this.addRuntimeObject("rebuild-trigger", trigger.spec, trigger.zone, true);
    }
    for (const platform of this.builtLevel.lightRevealedPlatforms) {
      this.addRuntimeObject("light-platform", platform.spec, platform.body, true, true);
    }
    for (const checkpoint of this.builtLevel.checkpointZones) {
      this.addRuntimeObject("checkpoint", checkpoint.spec, checkpoint.zone, true);
    }

    this.addRuntimeObject("exhibit", this.builtLevel.exhibitSpec, this.builtLevel.exhibit, true);
    this.addRuntimeObject("exit", this.builtLevel.exitSpec, this.builtLevel.exitZone, true);

    for (const key of this.builtLevel.archiveKeys) {
      this.addRuntimeObject("archive-key", key.spec, key.body, true);
    }
    for (const door of this.builtLevel.archiveDoors) {
      this.addRuntimeObject("archive-door", door.spec, door.body, true, true);
    }
    for (const door of this.builtLevel.choiceDoors) {
      this.addRuntimeObject("choice-door", door.spec, door.zone, true);
    }
    for (const lantern of this.builtLevel.lanternSwitches) {
      this.addRuntimeObject("lantern-switch", lantern.spec, lantern.zone, true);
    }
    for (const fragment of this.builtLevel.witnessFragments) {
      this.addRuntimeObject("witness-fragment", fragment.spec, fragment.body, true);
    }
    for (const note of this.builtLevel.tinyDetailNotes) {
      this.addRuntimeObject("tiny-detail-note", note.spec, note.body, true);
    }
    for (const echo of this.builtLevel.echoFragments) {
      this.addRuntimeObject("echo-fragment", echo.spec, echo.body, true);
    }
    for (const fragment of this.builtLevel.quietEvidenceFragments) {
      this.addRuntimeObject("quiet-evidence-fragment", fragment.spec, fragment.body, true);
    }
    for (const fragment of this.builtLevel.argumentFragments) {
      this.addRuntimeObject("argument-fragment", fragment.spec, fragment.body, true);
    }
  }

  private addRuntimeObject(
    type: DebugObjectType,
    spec: RectSpec & { kind?: string; label?: string },
    gameObject: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Zone,
    editable: boolean,
    resizable = false,
    source: "base" | "added" = "base"
  ): void {
    this.objects.push(this.buildRuntimeObject(type, spec, gameObject, editable, resizable, source));
  }

  private buildRuntimeObject(
    type: DebugObjectType,
    spec: RectSpec & { kind?: string; label?: string },
    gameObject: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Zone,
    editable: boolean,
    resizable: boolean,
    source: "base" | "added"
  ): RuntimeDebugObject {
    const baseData = this.baseObjectData.get(spec.id);
    const runtimeObject: RuntimeDebugObject = {
      data: {
        id: spec.id,
        type,
        levelId: this.geometry.levelId,
        source,
        x: spec.x,
        y: spec.y,
        width: spec.width,
        height: spec.height,
        kind: spec.kind,
        label: spec.label,
        name: "name" in spec && typeof spec.name === "string" ? spec.name : undefined,
        required: "required" in spec && typeof spec.required === "boolean" ? spec.required : undefined,
        respawnX: "respawnX" in spec && typeof spec.respawnX === "number" ? spec.respawnX : undefined,
        respawnY: "respawnY" in spec && typeof spec.respawnY === "number" ? spec.respawnY : undefined,
        linkedRespawn: type === "checkpoint" ? true : undefined,
        targetScene: "targetScene" in spec && typeof spec.targetScene === "string" ? spec.targetScene : undefined,
        targetLevelId: "targetLevelId" in spec && typeof spec.targetLevelId === "number" ? spec.targetLevelId : undefined,
        checkpointIndex: baseData?.checkpointIndex,
        editable,
        resizable,
        hasOverride: this.savedOverrideObjectIds.has(spec.id),
        dirty: false
      },
      baseData,
      gameObject
    };

    if (editable) {
      runtimeObject.moveBy = (dx: number, dy: number) => {
        if (runtimeObject.data.type === "checkpoint") {
          runtimeObject.data.linkedRespawn = this.isCheckpointRespawnLinked(runtimeObject);
        }
        runtimeObject.data = nudgeDebugObjectData(runtimeObject.data, dx, dy);
        spec.x = runtimeObject.data.x;
        spec.y = runtimeObject.data.y;
        if (runtimeObject.data.type === "checkpoint") {
          const checkpointSpec = spec as RectSpec & { respawnX?: number; respawnY?: number };
          checkpointSpec.respawnX = runtimeObject.data.respawnX ?? checkpointSpec.respawnX;
          checkpointSpec.respawnY = runtimeObject.data.respawnY ?? checkpointSpec.respawnY;
        }
        gameObject.setPosition(gameObject.x + dx, gameObject.y + dy);
        updatePhysicsBody(gameObject);
      };
    }

    if (resizable) {
      runtimeObject.resizeBy = (dWidth: number, dHeight: number) => {
        runtimeObject.data = resizeDebugObjectData(
          runtimeObject.data,
          dWidth,
          dHeight,
          MIN_RESIZE_WIDTH,
          MIN_RESIZE_HEIGHT
        );
        spec.width = runtimeObject.data.width;
        spec.height = runtimeObject.data.height;
        resizeRuntimeObject(gameObject, runtimeObject.data);
      };
    }

    return runtimeObject;
  }

  private addMovingPlatformObject(movingPlatform: MovingPlatformRuntime, source: "base" | "added" = "base"): RuntimeDebugObject {
    const spec = movingPlatform.spec;
    const baseData = this.baseObjectData.get(spec.id);
    const runtimeObject: RuntimeDebugObject = {
      data: {
        id: spec.id,
        type: "moving-platform",
        levelId: this.geometry.levelId,
        source,
        x: spec.x,
        y: spec.y,
        width: spec.width,
        height: spec.height,
        kind: spec.kind,
        label: spec.label,
        editable: true,
        resizable: true,
        axis: spec.axis ?? "horizontal",
        fromX: spec.fromX,
        toX: spec.toX,
        fromY: spec.fromY,
        toY: spec.toY,
        speed: spec.speed,
        hasOverride: this.savedOverrideObjectIds.has(spec.id),
        dirty: false
      },
      baseData,
      gameObject: movingPlatform.body
    };

    runtimeObject.moveBy = (dx: number, dy: number) => {
      runtimeObject.data = nudgeDebugObjectData(runtimeObject.data, dx, dy);
      spec.x += dx;
      spec.y += dy;
      if (spec.fromX !== undefined) {
        spec.fromX += dx;
      }
      if (spec.toX !== undefined) {
        spec.toX += dx;
      }
      if (spec.fromY !== undefined) {
        spec.fromY += dy;
      }
      if (spec.toY !== undefined) {
        spec.toY += dy;
      }
      movingPlatform.body.setPosition(movingPlatform.body.x + dx, movingPlatform.body.y + dy);
      updatePhysicsBody(movingPlatform.body);
    };

    runtimeObject.resizeBy = (dWidth: number, dHeight: number) => {
      runtimeObject.data = resizeDebugObjectData(runtimeObject.data, dWidth, dHeight, MIN_RESIZE_WIDTH, MIN_RESIZE_HEIGHT);
      spec.width = runtimeObject.data.width;
      spec.height = runtimeObject.data.height;
      resizeRuntimeObject(movingPlatform.body, runtimeObject.data);
    };

    this.objects.push(runtimeObject);
    return runtimeObject;
  }

  private drawGrid(): void {
    this.gridGraphics.clear();
    for (let x = 0; x <= this.geometry.worldWidth; x += GRID_SIZE) {
      const isMajor = x % 128 === 0;
      this.gridGraphics.lineStyle(isMajor ? 1.5 : 1, PHASER_THEME.brassHighlight, isMajor ? 0.2 : 0.08);
      this.gridGraphics.lineBetween(x, 0, x, this.geometry.worldHeight);
    }
    for (let y = 0; y <= this.geometry.worldHeight; y += GRID_SIZE) {
      const isMajor = y % 128 === 0;
      this.gridGraphics.lineStyle(isMajor ? 1.5 : 1, PHASER_THEME.brassHighlight, isMajor ? 0.2 : 0.08);
      this.gridGraphics.lineBetween(0, y, this.geometry.worldWidth, y);
    }
  }

  private drawBounds(): void {
    this.boundsGraphics.clear();
    for (const object of this.objects) {
      const isSelected = object === this.selectedObject;
      const color = isSelected ? 0xffffff : colorForType(object.data.type);
      this.boundsGraphics.lineStyle(isSelected ? 4 : 2, color, isSelected ? 0.95 : 0.72);
      this.boundsGraphics.strokeRect(object.data.x, object.data.y, object.data.width, object.data.height);
    }
  }

  private drawMovingPathPreview(): void {
    this.pathGraphics.clear();
    this.pathGraphics.setVisible(false);
    if (!this.overlayVisible || this.selectedObject?.data.type !== "moving-platform") {
      return;
    }

    const endpoints = movingPathHandleCenters(this.selectedObject.data, this.selectedObject.gameObject);
    this.pathGraphics.setVisible(true);
    this.pathGraphics.lineStyle(4, PHASER_THEME.brassHighlight, 0.86);
    this.pathGraphics.lineBetween(endpoints.start.x, endpoints.start.y, endpoints.end.x, endpoints.end.y);
    this.pathGraphics.lineStyle(1, 0x0b1220, 0.92);
    this.pathGraphics.fillStyle(0x72d8a0, 0.95);
    this.pathGraphics.fillCircle(endpoints.start.x, endpoints.start.y, MOVING_HANDLE_RADIUS);
    this.pathGraphics.strokeCircle(endpoints.start.x, endpoints.start.y, MOVING_HANDLE_RADIUS);
    this.pathGraphics.fillStyle(0xe5b0ad, 0.95);
    this.pathGraphics.fillCircle(endpoints.end.x, endpoints.end.y, MOVING_HANDLE_RADIUS);
    this.pathGraphics.strokeCircle(endpoints.end.x, endpoints.end.y, MOVING_HANDLE_RADIUS);
    this.pathGraphics.fillStyle(0xffffff, 0.9);
    this.pathGraphics.fillCircle(endpoints.current.x, endpoints.current.y, 5);
  }

  private drawValidationMarkers(): void {
    this.validationGraphics.clear();
    this.validationGraphics.setVisible(false);
    this.clearValidationLabels();
    if (!this.overlayVisible || !this.validationMarkersVisible || !this.validationSummary) {
      return;
    }

    this.validationGraphics.setVisible(true);
    const cameraView = this.scene.cameras.main.worldView;
    for (const issue of this.validationSummary.issues) {
      if (issue.x === undefined || issue.y === undefined || issue.width === undefined || issue.height === undefined) {
        continue;
      }
      const rect = new Phaser.Geom.Rectangle(issue.x, issue.y, Math.max(8, issue.width), Math.max(8, issue.height));
      if (!Phaser.Geom.Rectangle.Overlaps(cameraView, rect)) {
        continue;
      }
      const color = validationIssueColor(issue.severity);
      this.validationGraphics.lineStyle(issue.severity === "error" ? 4 : 3, color, issue.severity === "info" ? 0.58 : 0.82);
      this.validationGraphics.strokeRect(rect.x, rect.y, rect.width, rect.height);
      this.validationGraphics.fillStyle(color, 0.14);
      this.validationGraphics.fillRect(rect.x, rect.y, rect.width, rect.height);

      const label = this.scene.add
        .text(rect.x, Math.max(0, rect.y - 18), `${issue.severity}:${issue.objectId ?? issue.category}`, {
          fontFamily: "Consolas, monospace",
          fontSize: "11px",
          color: "#fff9e8",
          backgroundColor: "#0B1220DD",
          padding: { x: 3, y: 2 }
        })
        .setDepth(DEBUG_DEPTH + 5);
      this.validationLabels.push(label);
    }
  }

  private drawSupportMarkers(): void {
    this.supportGraphics.clear();
    this.supportGraphics.setVisible(false);
    const object = this.selectedObject;
    if (!this.overlayVisible || !object || !isSupportValidatedType(object.data.type)) {
      return;
    }

    const validations = this.getSelectedSupportValidation(object);
    const supportValidation = validations[0]?.result;
    const color = supportValidation?.status === "error" ? 0xe5484d : supportValidation?.status === "warning" ? 0xffc857 : 0x72d8a0;
    this.supportGraphics.setVisible(true);
    this.supportGraphics.lineStyle(2, color, 0.7);
    if (supportValidation?.searchRect) {
      this.supportGraphics.strokeRect(
        supportValidation.searchRect.x,
        supportValidation.searchRect.y,
        supportValidation.searchRect.width,
        supportValidation.searchRect.height
      );
    }
    this.supportGraphics.strokeRect(object.data.x, object.data.y, object.data.width, object.data.height);

    if (object.data.type === "checkpoint") {
      const respawn = checkpointRespawnPoint(object.data);
      const triggerCenter = { x: object.data.x + object.data.width / 2, y: object.data.y + object.data.height / 2 };
      const respawnValidation = validations.find((validation) => validation.label === "Respawn")?.result;
      const respawnColor = respawnValidation?.status === "error" ? 0xe5484d : respawnValidation?.status === "warning" ? 0xffc857 : 0x72d8a0;
      this.supportGraphics.lineStyle(2, respawnColor, 0.72);
      this.supportGraphics.lineBetween(triggerCenter.x, triggerCenter.y, respawn.x, respawn.y);
      this.supportGraphics.fillStyle(respawnColor, 0.9);
      this.supportGraphics.fillCircle(respawn.x, respawn.y, RESPAWN_HANDLE_RADIUS);
      this.supportGraphics.lineStyle(1, 0x0b1220, 0.9);
      this.supportGraphics.strokeCircle(respawn.x, respawn.y, RESPAWN_HANDLE_RADIUS);
    }
  }

  private drawLabels(): void {
    this.clearLabels();
    if (!this.overlayVisible || !this.labelsVisible) {
      return;
    }

    const cameraView = this.scene.cameras.main.worldView;
    for (const object of this.objects) {
      if (!Phaser.Geom.Rectangle.Overlaps(cameraView, rectFromData(object.data)) && object !== this.selectedObject) {
        continue;
      }
      const label = this.scene.add
        .text(object.data.x, object.data.y - 16, labelForObject(object.data), {
          fontFamily: "Consolas, monospace",
          fontSize: "11px",
          color: object === this.selectedObject ? THEME_HEX.softIvory : THEME_HEX.mainCream,
          backgroundColor: "#0B1220CC",
          padding: { x: 3, y: 2 }
        })
        .setDepth(DEBUG_DEPTH + 2);
      this.labels.push(label);
    }
  }

  private clearLabels(): void {
    for (const label of this.labels) {
      label.destroy();
    }
    this.labels.length = 0;
  }

  private clearValidationLabels(): void {
    for (const label of this.validationLabels) {
      label.destroy();
    }
    this.validationLabels.length = 0;
  }

  private getPanelText(): string {
    const pointer = this.scene.cameras.main.getWorldPoint(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
    const camera = this.scene.cameras.main;
    const activeCheckpointId = this.getActiveCheckpointId();
    const selected = this.selectedObject ? labelForObject(this.selectedObject.data) : "none";
    const devSpawnText = this.devSpawn
      ? `${this.devSpawn.source} x=${Math.round(this.devSpawn.x)} y=${Math.round(this.devSpawn.y)}${
          this.devSpawn.checkpointId ? ` (${this.devSpawn.checkpointId})` : ""
        }`
      : "none";

    return [
      "DEV LEVEL EDITOR",
      `Level: ${this.geometry.levelId}`,
      `Chapter: ${this.activeChapterId ?? "n/a"} | Title: ${this.geometry.title}`,
      `Scene: ${this.scene.scene.key}`,
      `Player: x=${Math.round(this.builtLevel.player.x)} y=${Math.round(this.builtLevel.player.y)}`,
      `Pointer: x=${Math.round(pointer.x)} y=${Math.round(pointer.y)}`,
      `Camera: x=${Math.round(camera.scrollX)} y=${Math.round(camera.scrollY)}`,
      `Checkpoint: ${activeCheckpointId ?? "none"}`,
      `Dev spawn: ${devSpawnText}`,
      `Selected: ${selected}`,
      `Resizable: ${this.selectedObject?.data.resizable ? "yes" : "no"}`,
      `Selected override: ${this.selectedObject?.data.hasOverride ? "yes" : "no"}`,
      `Dirty: ${this.dirtyObjectIds.size > 0 ? [...this.dirtyObjectIds].join(", ") : "no"}`,
      `Overrides: modified=${Object.keys(this.currentOverrides.objects).length} added=${this.currentOverrides.addedObjects.length} deleted=${this.deletedObjectIds.size}`,
      `Grid: ${GRID_SIZE}px ${this.gridVisible ? "visible" : "hidden"} | Snap: ${this.snapEnabled ? "on" : "off"}`,
      `Bounds: ${this.boundsVisible ? "on" : "off"} | Labels: ${this.labelsVisible ? "on" : "off"}`,
      `Validation: ${
        this.validationSummary
          ? `${this.validationSummary.errors} errors, ${this.validationSummary.warnings} warnings, ${this.validationSummary.infos} info`
          : "not run"
      } | Auto: ${this.autoValidate ? "on" : "off"} | Markers: ${this.validationMarkersVisible ? "on" : "off"}`,
      `History: undo=${this.undoStack.length} redo=${this.redoStack.length}`,
      "Buttons: Undo | Redo | Add Platform | Add Moving Platform | Add Elevator | Duplicate | Delete Object | Save All",
      "Buttons: Reset Level Overrides | Export Overrides | Import Overrides | Snap | Validate Level",
      "Keys: Ctrl/Cmd+Z undo | Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y redo",
      "Keys: A add static | Ctrl/Cmd+D duplicate platform | Delete/Backspace delete added/static | X snap",
      "F1 hide | G grid | H bounds | P labels",
      "C player | Shift+C pointer | J JSON | T TS | E export",
      "S save selected | Shift+S save all dirty | Shift+D revert selected override",
      "Inspector inputs suppress editor shortcuts while focused",
      "Move: Arrows | Shift+Arrows 10px | Alt+Arrows 32px",
      "Resize: Ctrl/Cmd+Arrows | +Shift 10px | +Alt 32px",
      "Click select | R restart | Shift+R here",
      this.lastFeedback ? `Last: ${this.lastFeedback}` : ""
    ]
      .filter(Boolean)
      .join("\n");
  }
}

function collectDebugDataFromGeometry(geometry: PlatformerLevelGeometry): DebugObjectData[] {
  const toData = (
    type: DebugObjectType,
    spec: RectSpec & {
      kind?: string;
      label?: string;
      axis?: "horizontal" | "vertical";
      fromX?: number;
      toX?: number;
      fromY?: number;
      toY?: number;
      speed?: number;
      respawnX?: number;
      respawnY?: number;
      targetScene?: string;
      targetLevelId?: number;
      name?: string;
      required?: boolean;
    },
    editable: boolean,
    resizable = false,
    extra: Partial<DebugObjectData> = {}
  ): DebugObjectData => ({
    id: spec.id,
    type,
    levelId: geometry.levelId,
    source: "base",
    x: spec.x,
    y: spec.y,
    width: spec.width,
    height: spec.height,
    kind: spec.kind,
    label: spec.label,
    editable,
    resizable,
    axis: spec.axis,
    fromX: spec.fromX,
    toX: spec.toX,
    fromY: spec.fromY,
    toY: spec.toY,
    speed: spec.speed,
    respawnX: spec.respawnX,
    respawnY: spec.respawnY,
    targetScene: spec.targetScene,
    targetLevelId: spec.targetLevelId,
    name: spec.name,
    required: spec.required,
    hasOverride: false,
    dirty: false,
    ...extra
  });

  return [
    ...geometry.platforms.map((spec) => toData("platform", spec, true, true)),
    ...geometry.movingPlatforms.map((spec) => toData("moving-platform", spec, true, true)),
    ...geometry.rebuildGroups.flatMap((group) => [
      toData("rebuild-trigger", group.trigger, true),
      ...group.platforms.map((platform) => toData("rebuildable-platform", platform, true, true))
    ]),
    ...geometry.lightRevealGroups.flatMap((group) => group.platforms.map((platform) => toData("light-platform", platform, true, true))),
    ...geometry.checkpoints.map((spec, index) => toData("checkpoint", spec, true, true, { checkpointIndex: index + 1, linkedRespawn: true })),
    ...geometry.exhibits.map((spec) => toData("exhibit", spec, true, true)),
    toData("exit", geometry.exit, true, true),
    ...geometry.archiveKeys.map((spec) => toData("archive-key", spec, true, true)),
    ...geometry.archiveDoors.map((spec) => toData("archive-door", spec, true, true)),
    ...geometry.choiceDoors.map((spec) => toData("choice-door", spec, true, true)),
    ...geometry.lanternSwitches.map((spec) => toData("lantern-switch", spec, true, true)),
    ...geometry.witnessFragments.map((spec) => toData("witness-fragment", spec, true, true)),
    ...geometry.tinyDetailNotes.map((spec) => toData("tiny-detail-note", spec, true, true)),
    ...geometry.echoFragments.map((spec) => toData("echo-fragment", spec, true, true)),
    ...geometry.quietEvidenceFragments.map((spec) => toData("quiet-evidence-fragment", spec, true, true)),
    ...geometry.argumentFragments.map((spec) => toData("argument-fragment", spec, true, true))
  ];
}

function findRectSpecById(geometry: PlatformerLevelGeometry, data: DebugObjectData): (RectSpec & { kind?: string; label?: string }) | null {
  switch (data.type) {
    case "platform":
      return geometry.platforms.find((spec) => spec.id === data.id) ?? null;
    case "moving-platform":
      return geometry.movingPlatforms.find((spec) => spec.id === data.id) ?? null;
    case "rebuild-trigger":
      return geometry.rebuildGroups.map((group) => group.trigger).find((spec) => spec.id === data.id) ?? null;
    case "rebuildable-platform":
      return geometry.rebuildGroups.flatMap((group) => group.platforms).find((spec) => spec.id === data.id) ?? null;
    case "light-platform":
      return geometry.lightRevealGroups.flatMap((group) => group.platforms).find((spec) => spec.id === data.id) ?? null;
    case "checkpoint":
      return geometry.checkpoints.find((spec) => spec.id === data.id) ?? null;
    case "exhibit":
      return geometry.exhibits.find((spec) => spec.id === data.id) ?? null;
    case "exit":
      return geometry.exit.id === data.id ? geometry.exit : null;
    case "archive-key":
      return geometry.archiveKeys.find((spec) => spec.id === data.id) ?? null;
    case "archive-door":
      return geometry.archiveDoors.find((spec) => spec.id === data.id) ?? null;
    case "choice-door":
      return geometry.choiceDoors.find((spec) => spec.id === data.id) ?? null;
    case "lantern-switch":
      return geometry.lanternSwitches.find((spec) => spec.id === data.id) ?? null;
    case "witness-fragment":
      return geometry.witnessFragments.find((spec) => spec.id === data.id) ?? null;
    case "tiny-detail-note":
      return geometry.tinyDetailNotes.find((spec) => spec.id === data.id) ?? null;
    case "echo-fragment":
      return geometry.echoFragments.find((spec) => spec.id === data.id) ?? null;
    case "quiet-evidence-fragment":
      return geometry.quietEvidenceFragments.find((spec) => spec.id === data.id) ?? null;
    case "argument-fragment":
      return geometry.argumentFragments.find((spec) => spec.id === data.id) ?? null;
  }
}

function isBaseResetPending(object: RuntimeDebugObject, overrides: DevLevelOverridesFile): boolean {
  return object.data.source !== "added" && object.baseData !== undefined && debugObjectMatches(object.data, object.baseData) && overrides.objects[object.data.id] === undefined;
}

function debugObjectMatches(a: DebugObjectData, b: DebugObjectData): boolean {
  return (
    Math.round(a.x) === Math.round(b.x) &&
    Math.round(a.y) === Math.round(b.y) &&
    Math.round(a.width) === Math.round(b.width) &&
    Math.round(a.height) === Math.round(b.height) &&
    (a.kind ?? "") === (b.kind ?? "") &&
    (a.label ?? "") === (b.label ?? "") &&
    Math.round(a.respawnX ?? 0) === Math.round(b.respawnX ?? 0) &&
    Math.round(a.respawnY ?? 0) === Math.round(b.respawnY ?? 0) &&
    (a.axis ?? "") === (b.axis ?? "") &&
    Math.round(a.fromX ?? a.x) === Math.round(b.fromX ?? b.x) &&
    Math.round(a.toX ?? a.x) === Math.round(b.toX ?? b.x) &&
    Math.round(a.fromY ?? a.y) === Math.round(b.fromY ?? b.y) &&
    Math.round(a.toY ?? a.y) === Math.round(b.toY ?? b.y) &&
    Math.round(a.speed ?? 0) === Math.round(b.speed ?? 0)
  );
}

function isDevEditorTextInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.closest(".dev-debug-inspector input, .dev-debug-inspector select, .dev-debug-copy-panel") !== null;
}

function movingPathFieldsForInspector(object: DebugObjectData): {
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
} {
  const axis = object.axis ?? "horizontal";
  return {
    fromX: axis === "vertical" ? object.x : object.fromX ?? object.x,
    toX: axis === "vertical" ? object.x : object.toX ?? object.x,
    fromY: axis === "horizontal" ? object.y : object.fromY ?? object.y,
    toY: axis === "horizontal" ? object.y : object.toY ?? object.y
  };
}

function movingPathHandleCenters(
  object: DebugObjectData,
  gameObject?: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Zone
): {
  start: { x: number; y: number };
  end: { x: number; y: number };
  current: { x: number; y: number };
} {
  const path = movingPathFieldsForInspector(object);
  return {
    start: { x: path.fromX + object.width / 2, y: path.fromY + object.height / 2 },
    end: { x: path.toX + object.width / 2, y: path.toY + object.height / 2 },
    current: {
      x: gameObject?.x ?? object.x + object.width / 2,
      y: gameObject?.y ?? object.y + object.height / 2
    }
  };
}

function checkpointRespawnPoint(object: DebugObjectData): { x: number; y: number } {
  return {
    x: object.respawnX ?? object.x + object.width / 2,
    y: object.respawnY ?? object.y + object.height / 2
  };
}

function isSupportValidatedType(type: DebugObjectType): boolean {
  return type === "checkpoint" || isInteractableDebugType(type) || isExitLikeDebugType(type);
}

function isInteractableDebugType(type: DebugObjectType): boolean {
  return (
    type === "exhibit" ||
    type === "archive-key" ||
    type === "choice-door" ||
    type === "lantern-switch" ||
    type === "witness-fragment" ||
    type === "tiny-detail-note" ||
    type === "echo-fragment" ||
    type === "quiet-evidence-fragment" ||
    type === "argument-fragment" ||
    type === "rebuild-trigger"
  );
}

function isExitLikeDebugType(type: DebugObjectType): boolean {
  return type === "exit" || type === "archive-door" || type === "choice-door";
}

function supportValidationLabel(result: DevSupportValidationResult): string {
  const prefix = result.status === "ok" ? "Supported" : result.status === "warning" ? "Warning" : "Error";
  return result.messages.length > 0 ? `${prefix}: ${result.messages.join(" ")}` : prefix;
}

function resizeRuntimeObject(gameObject: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Zone, data: DebugObjectData): void {
  const centerX = data.x + data.width / 2;
  const centerY = data.y + data.height / 2;
  gameObject.setPosition(centerX, centerY);

  const sizableObject = gameObject as Phaser.GameObjects.Rectangle & {
    setSize?: (width: number, height: number) => Phaser.GameObjects.GameObject;
  };
  sizableObject.setSize?.(data.width, data.height);
  updatePhysicsBody(gameObject, data.width, data.height);
}

function updatePhysicsBody(gameObject: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Zone, width?: number, height?: number): void {
  const body = gameObject.body as Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | undefined;
  if (!body) {
    return;
  }

  const editableBody = body as {
    setSize?: (width: number, height: number) => void;
    updateFromGameObject?: () => void;
    reset?: (x: number, y: number) => void;
  };

  if (width !== undefined && height !== undefined && typeof editableBody.setSize === "function") {
    editableBody.setSize(width, height);
  }
  if (typeof editableBody.updateFromGameObject === "function") {
    editableBody.updateFromGameObject();
    return;
  }
  editableBody.reset?.(gameObject.x, gameObject.y);
}

function pointInObject(x: number, y: number, object: DebugObjectData): boolean {
  return x >= object.x && x <= object.x + object.width && y >= object.y && y <= object.y + object.height;
}

function rectFromData(object: DebugObjectData): Phaser.Geom.Rectangle {
  return new Phaser.Geom.Rectangle(object.x, object.y, object.width, object.height);
}

function labelForObject(object: DebugObjectData): string {
  const base = `${object.type}:${object.id} x=${Math.round(object.x)} y=${Math.round(object.y)} w=${Math.round(object.width)} h=${Math.round(
    object.height
  )}${object.source === "added" ? " added" : ""}`;

  if (object.type !== "moving-platform") {
    return base;
  }

  const anchors = [
    object.axis ? `axis=${object.axis}` : "",
    object.fromX !== undefined ? `fromX=${Math.round(object.fromX)}` : "",
    object.toX !== undefined ? `toX=${Math.round(object.toX)}` : "",
    object.fromY !== undefined ? `fromY=${Math.round(object.fromY)}` : "",
    object.toY !== undefined ? `toY=${Math.round(object.toY)}` : "",
    object.speed !== undefined ? `speed=${Math.round(object.speed)}` : ""
  ]
    .filter(Boolean)
    .join(" ");

  return `${base} ${anchors}`;
}

function colorForType(type: DebugObjectType): number {
  switch (type) {
    case "platform":
    case "moving-platform":
      return PHASER_THEME.brassHighlight;
    case "checkpoint":
      return 0x72d8a0;
    case "exhibit":
      return 0xe5b0ad;
    case "exit":
      return 0x9bb8ff;
    case "rebuild-trigger":
    case "rebuildable-platform":
      return 0xb65a4b;
    case "lantern-switch":
    case "light-platform":
      return PHASER_THEME.mainCream;
    default:
      return PHASER_THEME.antiqueGold;
  }
}

function validationIssueColor(severity: DevValidationIssue["severity"]): number {
  switch (severity) {
    case "error":
      return 0xe5484d;
    case "warning":
      return 0xffc857;
    case "info":
      return 0x9bb8ff;
  }
}

function colorForPlatformKind(kind: PlatformSpec["kind"]): number {
  switch (kind) {
    case "desk":
      return PLATFORM_COLORS.desk;
    case "paper":
      return PLATFORM_COLORS.paper;
    case "folder":
      return PLATFORM_COLORS.folder;
    case "tram":
      return PLATFORM_COLORS.tram;
    case "calendar":
      return PLATFORM_COLORS.calendar;
    case "brick":
      return PLATFORM_COLORS.brick;
    case "scaffold":
      return PLATFORM_COLORS.folder;
  }
}

function toPlatformSpec(object: ReturnType<typeof createDevStaticPlatformOverride>): PlatformSpec {
  return {
    id: object.id,
    kind: object.kind ?? "paper",
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    label: object.label
  };
}

function movingPlatformSpecFromOverride(object: ReturnType<typeof createDevMovingPlatformOverride>): MovingPlatformSpec {
  return {
    id: object.id,
    kind: object.kind === "tram" ? "tram" : "paper",
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    axis: object.axis ?? "horizontal",
    fromX: object.fromX ?? object.x,
    toX: object.toX ?? object.x,
    fromY: object.fromY ?? object.y,
    toY: object.toY ?? object.y,
    speed: object.speed ?? 32,
    label: object.label
  };
}

function platformSpecFromDebugData(object: DebugObjectData): PlatformSpec {
  return {
    id: object.id,
    kind: (object.kind as PlatformSpec["kind"]) ?? "paper",
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    label: object.label
  };
}

function movingPlatformSpecFromDebugData(object: DebugObjectData): MovingPlatformSpec {
  return {
    id: object.id,
    kind: object.kind === "tram" ? "tram" : "paper",
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    axis: object.axis ?? "horizontal",
    fromX: object.fromX ?? object.x,
    toX: object.toX ?? object.x,
    fromY: object.fromY ?? object.y,
    toY: object.toY ?? object.y,
    speed: object.speed ?? 32,
    label: object.label
  };
}

function cloneOverrides(overrides: DevLevelOverridesFile): DevLevelOverridesFile {
  return JSON.parse(JSON.stringify(overrides)) as DevLevelOverridesFile;
}

function snapshotsMatch(a: DevEditorHistorySnapshot, b: DevEditorHistorySnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function collectOverrideDiffIds(current: DevLevelOverridesFile, saved: DevLevelOverridesFile): string[] {
  const dirty = new Set<string>();
  const objectIds = new Set([...Object.keys(current.objects), ...Object.keys(saved.objects)]);
  for (const objectId of objectIds) {
    if (JSON.stringify(current.objects[objectId] ?? null) !== JSON.stringify(saved.objects[objectId] ?? null)) {
      dirty.add(objectId);
    }
  }

  const addedIds = new Set([...current.addedObjects.map((object) => object.id), ...saved.addedObjects.map((object) => object.id)]);
  for (const objectId of addedIds) {
    const currentObject = current.addedObjects.find((object) => object.id === objectId) ?? null;
    const savedObject = saved.addedObjects.find((object) => object.id === objectId) ?? null;
    if (JSON.stringify(currentObject) !== JSON.stringify(savedObject)) {
      dirty.add(objectId);
    }
  }

  const deletedIds = new Set([...current.deletedObjectIds, ...saved.deletedObjectIds]);
  for (const objectId of deletedIds) {
    if (current.deletedObjectIds.includes(objectId) !== saved.deletedObjectIds.includes(objectId)) {
      dirty.add(objectId);
    }
  }

  return [...dirty];
}
