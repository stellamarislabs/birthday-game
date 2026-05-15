import type { EchoPathSpec } from "./echoPathTypes";

export const LEVEL_SIX_ECHO_PATH_SPEC: EchoPathSpec = {
  levelId: 6,
  title: "Echo Path: The Door of Trust",
  subtitle: "Ask the question that opens the right door.",
  instruction: "Place the question that opens trust, then use the silver key.",
  exhibitName: "The Silver Key",
  prompt: "How do you know this love is real?",
  questions: [
    {
      id: "who-benefits",
      text: "Who benefits?",
      description: "A clever question, but not the one this door needs."
    },
    {
      id: "receipt",
      text: "Where is the receipt?",
      description: "Too small for what the heart is asking."
    },
    {
      id: "what-remains",
      text: "What remains when things are difficult?",
      description: "The question that reaches trust."
    }
  ],
  doors: [
    { id: "doubt", label: "Doubt" },
    { id: "fear", label: "Fear" },
    { id: "trust", label: "Trust" }
  ],
  correctQuestionId: "what-remains",
  correctDoorId: "trust",
  keyLabel: "Silver Key",
  successText: "The Trust door opens.",
  successFollowUp: "The lantern lights the pages beyond it. The blue ribbon releases the unfinished letter.",
  successRevealSteps: [
    { label: "Lantern path", detail: "Warm light appears beyond Trust." },
    { label: "Blue ribbon pages", detail: "The bound pages loosen." },
    { label: "Unfinished letter", detail: "The letter rises toward the rooftops." }
  ],
  readyText: "The silver key is ready. Open the Trust door.",
  incompleteText: "The echo has not found the right question yet.",
  wrongText: "The echo has not found the right question yet.",
  revealText: "Real love is proven by choosing each other again.",
  optionalFollowUp: "Not once, not only on easy days, but again and again.",
  estimatedSeconds: 40
};

export const echoPathSpecs = [LEVEL_SIX_ECHO_PATH_SPEC] as const satisfies readonly EchoPathSpec[];

export function getEchoPathSpec(levelId: number): EchoPathSpec | undefined {
  return echoPathSpecs.find((spec) => spec.levelId === levelId);
}
