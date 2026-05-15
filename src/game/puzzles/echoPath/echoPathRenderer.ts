import {
  isCorrectQuestionPlaced,
  isDoorUnlocked
} from "./echoPathLogic";
import type { EchoDoor, EchoPathSpec, EchoPathState, EchoQuestion } from "./echoPathTypes";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getQuestionStateClass(state: EchoPathState, question: EchoQuestion): string {
  const classes: string[] = [];

  if (state.selectedQuestionId === question.id) {
    classes.push("is-selected");
  }

  if (state.placedQuestionId === question.id) {
    classes.push("is-placed");
  }

  return classes.length > 0 ? ` ${classes.join(" ")}` : "";
}

export function getDoorStateClass(spec: EchoPathSpec, state: EchoPathState, door: EchoDoor): string {
  const classes: string[] = [];

  if (isDoorUnlocked(spec, state, door.id)) {
    classes.push("is-unlocked");
  } else if (state.placedQuestionId && !isCorrectQuestionPlaced(spec, state)) {
    classes.push("is-echoing");
  }

  if (state.keyPlacedDoorId === door.id) {
    classes.push("is-open");
  }

  return classes.length > 0 ? ` ${classes.join(" ")}` : "";
}
