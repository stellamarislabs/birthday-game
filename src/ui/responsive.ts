export function initResponsiveShell(): void {
  const root = document.documentElement;

  const updateShellState = () => {
    const isTouchLikely = navigator.maxTouchPoints > 0;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    root.dataset.input = isTouchLikely ? "touch" : "keyboard";
    root.dataset.orientation = isPortrait ? "portrait" : "landscape";
    const visualHeight = window.visualViewport?.height;
    const appHeight = Number.isFinite(visualHeight) && visualHeight ? visualHeight : window.innerHeight;

    root.style.setProperty("--app-height", `${appHeight}px`);
  };

  updateShellState();
  window.addEventListener("resize", updateShellState, { passive: true });
  window.addEventListener("orientationchange", updateShellState, { passive: true });
  window.visualViewport?.addEventListener("resize", updateShellState, { passive: true });
  window.visualViewport?.addEventListener("scroll", updateShellState, { passive: true });
}
