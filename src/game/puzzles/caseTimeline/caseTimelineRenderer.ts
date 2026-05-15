import { getOrderedSlots, getTask } from "./caseTimelineLogic";
import type { CaseTimelineSpec, CaseTimelineState, TimelineSlot, TimelineTask } from "./caseTimelineTypes";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getTrayTasks(spec: CaseTimelineSpec, state: CaseTimelineState): TimelineTask[] {
  return state.trayTaskIds
    .map((taskId) => getTask(spec, taskId))
    .filter((task): task is TimelineTask => Boolean(task));
}

export function getPlacedTask(
  spec: CaseTimelineSpec,
  state: CaseTimelineState,
  slotId: string
): TimelineTask | undefined {
  return getTask(spec, state.placedTasksBySlotId[slotId]);
}

export function getSlotStateClass(spec: CaseTimelineSpec, state: CaseTimelineState, slot: TimelineSlot): string {
  const task = getPlacedTask(spec, state, slot.id);

  if (task?.id === spec.correctSequence[slot.orderIndex]) {
    return " is-correct";
  }

  if (task) {
    return " is-filled";
  }

  return "";
}

export function isTimelineSegmentLit(spec: CaseTimelineSpec, state: CaseTimelineState, segmentIndex: number): boolean {
  const orderedSlots = getOrderedSlots(spec);
  const leftSlot = orderedSlots[segmentIndex];
  const rightSlot = orderedSlots[segmentIndex + 1];

  if (!leftSlot || !rightSlot) {
    return false;
  }

  return (
    state.placedTasksBySlotId[leftSlot.id] === spec.correctSequence[leftSlot.orderIndex] &&
    state.placedTasksBySlotId[rightSlot.id] === spec.correctSequence[rightSlot.orderIndex]
  );
}

export function renderTaskIcon(task: TimelineTask): string {
  return `
    <span class="case-timeline-task-icon case-timeline-task-icon-${escapeHtml(task.visualKind ?? "case-file")}" aria-hidden="true">
      <span class="case-timeline-icon-mark"></span>
    </span>
  `;
}
