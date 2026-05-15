const PWA_HINT_STORAGE_KEY = "missing-heart-pwa-hint-dismissed";

function isTouchLikeDevice(): boolean {
  const hasTouchPoints = navigator.maxTouchPoints > 0;
  const hasCoarsePointer =
    typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;

  return hasTouchPoints || hasCoarsePointer;
}

export function isStandaloneDisplayMode(): boolean {
  const standaloneMedia =
    typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches;
  const fullscreenMedia =
    typeof window.matchMedia === "function" && window.matchMedia("(display-mode: fullscreen)").matches;
  const iosStandalone = Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

  return standaloneMedia || fullscreenMedia || iosStandalone;
}

function wasPwaHintDismissed(): boolean {
  try {
    return window.localStorage.getItem(PWA_HINT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function dismissPwaHint(root: HTMLElement): void {
  try {
    window.localStorage.setItem(PWA_HINT_STORAGE_KEY, "true");
  } catch {
    // Storage can be unavailable in restricted/private browsing; dismissal still works for this page.
  }

  root.remove();
}

export function initPwaOnboarding(): void {
  if (!isTouchLikeDevice() || isStandaloneDisplayMode() || wasPwaHintDismissed()) {
    return;
  }

  const shell = document.getElementById("game-shell");
  if (!shell || document.querySelector("[data-testid='pwa-onboarding']")) {
    return;
  }

  const root = document.createElement("section");
  root.className = "pwa-onboarding";
  root.dataset.testid = "pwa-onboarding";
  root.setAttribute("aria-label", "Best mobile experience");
  root.innerHTML = `
    <div class="pwa-onboarding-card">
      <p class="pwa-onboarding-kicker">Best played from your Home Screen</p>
      <p class="pwa-onboarding-copy">For the smoothest full-screen experience, add this case to your Home Screen, then open it in landscape.</p>
      <div class="pwa-onboarding-steps" aria-label="Add to Home Screen instructions">
        <span>Chrome: tap ⋮ → Add to Home screen</span>
        <span>Safari: tap Share → Add to Home Screen</span>
      </div>
      <button class="pwa-onboarding-dismiss" type="button" data-testid="pwa-onboarding-dismiss">Continue in browser</button>
    </div>
  `;

  root.querySelector<HTMLButtonElement>("[data-testid='pwa-onboarding-dismiss']")?.addEventListener("click", () => {
    dismissPwaHint(root);
  });

  shell.appendChild(root);
}
