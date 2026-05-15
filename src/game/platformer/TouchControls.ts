interface TouchControlState {
  left: boolean;
  right: boolean;
  jumpHeld: boolean;
}

type TouchControlName = keyof TouchControlState;

export class TouchControls {
  private readonly root: HTMLDivElement;
  private readonly cleanupCallbacks: Array<() => void> = [];
  private hintHideTimer?: number;
  private readonly state: TouchControlState = {
    left: false,
    right: false,
    jumpHeld: false
  };
  private jumpPressed = false;

  constructor() {
    this.root = document.createElement("div");
    this.root.className = "touch-controls";
    this.root.dataset.testid = "touch-controls";
    this.root.setAttribute("role", "group");
    this.root.setAttribute("aria-label", "Platformer touch controls");
    this.root.innerHTML = `
      <div class="touch-controls-hint" data-testid="touch-controls-hint" aria-live="polite">
        Guide Maria through the case. Move with ◀ ▶ and tap JUMP to reach the clues.
      </div>
      <div class="touch-cluster touch-cluster-left" aria-label="Movement controls">
        <button class="touch-button touch-button-arrow" type="button" data-testid="touch-left" aria-label="Move left">◀</button>
        <button class="touch-button touch-button-arrow" type="button" data-testid="touch-right" aria-label="Move right">▶</button>
      </div>
      <div class="touch-cluster touch-cluster-right" aria-label="Jump controls">
        <button class="touch-button touch-button-jump" type="button" data-testid="touch-jump" aria-label="Jump">JUMP</button>
      </div>
    `;

    (document.getElementById("game-shell") ?? document.body).appendChild(this.root);
    this.bindButton("touch-left", "left");
    this.bindButton("touch-right", "right");
    this.bindButton("touch-jump", "jumpHeld");
    this.bindGlobalReleaseGuards();
    this.showIntroHintIfUseful();
  }

  getAxis(): number {
    if (this.state.left === this.state.right) {
      return 0;
    }

    return this.state.left ? -1 : 1;
  }

  isJumpHeld(): boolean {
    return this.state.jumpHeld;
  }

  consumeJumpPressed(): boolean {
    const wasPressed = this.jumpPressed;
    this.jumpPressed = false;
    return wasPressed;
  }

  destroy(): void {
    this.resetState();
    this.hideIntroHint();
    for (const cleanup of this.cleanupCallbacks) {
      cleanup();
    }
    this.cleanupCallbacks.length = 0;
    this.root.remove();
  }

  private bindButton(testId: string, control: TouchControlName): void {
    const button = this.root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`);
    if (!button) {
      return;
    }

    const press = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      this.hideIntroHint();
      button.setPointerCapture?.(event.pointerId);
      this.state[control] = true;

      if (control === "jumpHeld") {
        this.jumpPressed = true;
      }
    };
    const release = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (button.hasPointerCapture?.(event.pointerId)) {
        button.releasePointerCapture?.(event.pointerId);
      }
      this.state[control] = false;
    };
    const cancelControl = () => {
      this.state[control] = false;
    };
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", cancelControl);
    button.addEventListener("contextmenu", preventContextMenu);

    this.cleanupCallbacks.push(() => {
      button.removeEventListener("pointerdown", press);
      button.removeEventListener("pointerup", release);
      button.removeEventListener("pointercancel", release);
      button.removeEventListener("lostpointercapture", cancelControl);
      button.removeEventListener("contextmenu", preventContextMenu);
    });
  }

  private bindGlobalReleaseGuards(): void {
    const releaseAll = () => {
      this.resetState();
    };
    const releaseForPointerCancel = () => {
      releaseAll();
    };
    const releaseWhenHidden = () => {
      if (document.visibilityState === "hidden") {
        releaseAll();
      }
    };

    window.addEventListener("blur", releaseAll);
    window.addEventListener("pagehide", releaseAll);
    document.addEventListener("pointercancel", releaseForPointerCancel);
    document.addEventListener("visibilitychange", releaseWhenHidden);

    this.cleanupCallbacks.push(() => {
      window.removeEventListener("blur", releaseAll);
      window.removeEventListener("pagehide", releaseAll);
      document.removeEventListener("pointercancel", releaseForPointerCancel);
      document.removeEventListener("visibilitychange", releaseWhenHidden);
    });
  }

  private resetState(): void {
    this.state.left = false;
    this.state.right = false;
    this.state.jumpHeld = false;
    this.jumpPressed = false;
  }

  private showIntroHintIfUseful(): void {
    if (!this.isTouchLikeDevice()) {
      return;
    }

    this.root.classList.add("touch-controls--hint-visible");
    this.hintHideTimer = window.setTimeout(() => this.hideIntroHint(), 4200);
  }

  private hideIntroHint(): void {
    if (this.hintHideTimer !== undefined) {
      window.clearTimeout(this.hintHideTimer);
      this.hintHideTimer = undefined;
    }

    this.root.classList.remove("touch-controls--hint-visible");
  }

  private isTouchLikeDevice(): boolean {
    const hasTouchPoints = navigator.maxTouchPoints > 0;
    const hasCoarsePointer =
      typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;

    return hasTouchPoints || hasCoarsePointer;
  }
}
