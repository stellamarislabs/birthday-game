export interface PointerDragDropOptions {
  root: HTMLElement;
  draggableSelector: string;
  dropTargetSelector: string;
  dragDataAttribute: string;
  dropDataAttribute: string;
  dragThreshold?: number;
  onDrop: (dragId: string, dropId: string | null) => void;
}

interface ActiveDrag {
  dragId: string;
  source: HTMLElement;
  pointerId: number;
  startX: number;
  startY: number;
  ghost: HTMLElement | null;
  currentDropTarget: HTMLElement | null;
  hasDragged: boolean;
}

const DEFAULT_DRAG_THRESHOLD = 6;

export function createPointerDragDrop(options: PointerDragDropOptions): () => void {
  let activeDrag: ActiveDrag | null = null;
  let suppressClick = false;

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    const source = (event.target as HTMLElement | null)?.closest<HTMLElement>(options.draggableSelector);
    if (!source || !options.root.contains(source)) {
      return;
    }

    const dragId = source.dataset[options.dragDataAttribute];
    if (!dragId) {
      return;
    }

    activeDrag = {
      dragId,
      source,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      ghost: null,
      currentDropTarget: null,
      hasDragged: false
    };

    source.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) {
      return;
    }

    const threshold = options.dragThreshold ?? DEFAULT_DRAG_THRESHOLD;
    if (!activeDrag.hasDragged && !isDragDistancePastThreshold(activeDrag.startX, activeDrag.startY, event.clientX, event.clientY, threshold)) {
      return;
    }

    if (!activeDrag.hasDragged) {
      beginDrag(options.root, activeDrag);
      suppressClick = true;
    }

    event.preventDefault();
    moveGhost(activeDrag, event.clientX, event.clientY);
    updateDropTarget(options, activeDrag, event.clientX, event.clientY);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) {
      return;
    }

    const finishedDrag = activeDrag;
    activeDrag = null;
    finishedDrag.source.releasePointerCapture?.(event.pointerId);

    if (finishedDrag.hasDragged) {
      event.preventDefault();
      const dropId = finishedDrag.currentDropTarget?.dataset[options.dropDataAttribute] ?? null;
      cleanupDrag(options.root, finishedDrag);
      options.onDrop(finishedDrag.dragId, dropId);
      return;
    }

    cleanupDrag(options.root, finishedDrag);
  };

  const onPointerCancel = (event: PointerEvent) => {
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) {
      return;
    }

    const canceledDrag = activeDrag;
    activeDrag = null;
    cleanupDrag(options.root, canceledDrag);
  };

  const onClickCapture = (event: MouseEvent) => {
    if (!suppressClick) {
      return;
    }

    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  };

  options.root.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", onPointerUp, { passive: false });
  window.addEventListener("pointercancel", onPointerCancel);
  options.root.addEventListener("click", onClickCapture, true);

  return () => {
    if (activeDrag) {
      cleanupDrag(options.root, activeDrag);
      activeDrag = null;
    }

    options.root.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerCancel);
    options.root.removeEventListener("click", onClickCapture, true);
  };
}

export function getPointerDragDistance(startX: number, startY: number, currentX: number, currentY: number): number {
  return Math.hypot(currentX - startX, currentY - startY);
}

export function isDragDistancePastThreshold(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  threshold: number
): boolean {
  return getPointerDragDistance(startX, startY, currentX, currentY) >= threshold;
}

function beginDrag(root: HTMLElement, activeDrag: ActiveDrag): void {
  activeDrag.hasDragged = true;
  activeDrag.source.classList.add("is-drag-source");
  root.classList.add("is-dragging-puzzle-item");
  root.querySelectorAll<HTMLElement>("[data-drop-id]").forEach((target) => {
    target.classList.add("is-drop-available");
  });

  const ghost = activeDrag.source.cloneNode(true) as HTMLElement;
  ghost.classList.add("puzzle-drag-ghost");
  ghost.removeAttribute("id");
  ghost.setAttribute("aria-hidden", "true");
  document.body.appendChild(ghost);
  activeDrag.ghost = ghost;
}

function moveGhost(activeDrag: ActiveDrag, clientX: number, clientY: number): void {
  if (!activeDrag.ghost) {
    return;
  }

  activeDrag.ghost.style.left = `${clientX}px`;
  activeDrag.ghost.style.top = `${clientY}px`;
}

function updateDropTarget(
  options: PointerDragDropOptions,
  activeDrag: ActiveDrag,
  clientX: number,
  clientY: number
): void {
  activeDrag.currentDropTarget?.classList.remove("is-drop-hover");

  const element = document.elementFromPoint(clientX, clientY);
  const target = element?.closest<HTMLElement>(options.dropTargetSelector) ?? null;
  activeDrag.currentDropTarget = target && options.root.contains(target) ? target : null;
  activeDrag.currentDropTarget?.classList.add("is-drop-hover");
}

function cleanupDrag(root: HTMLElement, activeDrag: ActiveDrag): void {
  activeDrag.source.classList.remove("is-drag-source");
  activeDrag.currentDropTarget?.classList.remove("is-drop-hover");
  activeDrag.ghost?.remove();
  root.classList.remove("is-dragging-puzzle-item");
  root.querySelectorAll<HTMLElement>(".is-drop-available").forEach((target) => {
    target.classList.remove("is-drop-available");
  });
}
