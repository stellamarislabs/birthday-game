export const APP_VIEWPORT_RESIZE_EVENT = "appviewportresize";

export interface VisibleViewportSize {
  width: number;
  height: number;
}

interface ViewportLike {
  width?: number;
  height?: number;
}

interface WindowSizeLike {
  innerWidth: number;
  innerHeight: number;
}

export function resolveVisibleViewportSize(
  visualViewport: ViewportLike | null | undefined,
  windowSize: WindowSizeLike
): VisibleViewportSize {
  const visualWidth = visualViewport?.width;
  const visualHeight = visualViewport?.height;

  return {
    width: Number.isFinite(visualWidth) && visualWidth ? visualWidth : windowSize.innerWidth,
    height: Number.isFinite(visualHeight) && visualHeight ? visualHeight : windowSize.innerHeight
  };
}

export function initResponsiveShell(): void {
  const root = document.documentElement;
  let lastWidth = 0;
  let lastHeight = 0;
  let pendingFrame: number | undefined;

  const updateShellState = () => {
    const isTouchLikely = navigator.maxTouchPoints > 0;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const visibleSize = resolveVisibleViewportSize(window.visualViewport, window);

    root.dataset.input = isTouchLikely ? "touch" : "keyboard";
    root.dataset.orientation = isPortrait ? "portrait" : "landscape";
    root.style.setProperty("--app-width", `${visibleSize.width}px`);
    root.style.setProperty("--app-height", `${visibleSize.height}px`);

    if (Math.abs(visibleSize.width - lastWidth) < 0.5 && Math.abs(visibleSize.height - lastHeight) < 0.5) {
      return;
    }

    lastWidth = visibleSize.width;
    lastHeight = visibleSize.height;
    window.dispatchEvent(
      new CustomEvent<VisibleViewportSize>(APP_VIEWPORT_RESIZE_EVENT, {
        detail: visibleSize
      })
    );
  };

  const scheduleShellStateUpdate = () => {
    if (pendingFrame !== undefined) {
      window.cancelAnimationFrame(pendingFrame);
    }

    pendingFrame = window.requestAnimationFrame(() => {
      pendingFrame = undefined;
      updateShellState();
    });
  };

  updateShellState();
  window.addEventListener("resize", scheduleShellStateUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleShellStateUpdate, { passive: true });
  window.addEventListener("focus", scheduleShellStateUpdate, { passive: true });
  window.addEventListener("pageshow", scheduleShellStateUpdate, { passive: true });
  document.addEventListener("visibilitychange", scheduleShellStateUpdate);
  window.visualViewport?.addEventListener("resize", scheduleShellStateUpdate, { passive: true });
  window.visualViewport?.addEventListener("scroll", scheduleShellStateUpdate, { passive: true });
}
