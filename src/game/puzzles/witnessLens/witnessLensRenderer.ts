import type { WitnessLensSpec, WitnessLensState, WitnessStatement } from "./witnessLensTypes";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getStatement(spec: WitnessLensSpec, statementId: string): WitnessStatement | undefined {
  return spec.statements.find((statement) => statement.id === statementId);
}

export function getStatementStateClass(state: WitnessLensState, statement: WitnessStatement): string {
  const classes: string[] = [];

  if (state.inspectedStatementId === statement.id) {
    classes.push("is-inspected");
  }

  if (state.markedStatementId === statement.id) {
    classes.push("is-marked");
  }

  return classes.length > 0 ? ` ${classes.join(" ")}` : "";
}
