import type { TrustLightPathSpec } from "./trustLightPathTypes";

export const LEVEL_SIX_TRUST_LIGHT_PATH_SPEC: TrustLightPathSpec = {
  levelId: 6,
  title: "Trust Door Light Path",
  subtitle: "Guide the lantern light to Trust.",
  instruction: "Choose the right question, then turn the mirrors until the light reaches Trust.",
  exhibitName: "The Silver Key, The Lantern, and The Blue Ribbon",
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
      description: "The question that lights the lantern."
    }
  ],
  correctQuestionId: "what-remains",
  rows: 2,
  columns: 4,
  source: {
    label: "Lantern",
    row: 1,
    col: 0,
    direction: "east"
  },
  target: {
    label: "Trust Door",
    row: 0,
    col: 3,
    direction: "west"
  },
  relayLabel: "Silver Key Relay",
  mirrors: [
    {
      id: "silver-key",
      label: "Silver Key",
      row: 1,
      col: 1,
      kind: "straight",
      baseConnections: ["west", "east"],
      initialRotation: 90
    },
    {
      id: "upper-echo",
      label: "Echo Mirror",
      row: 1,
      col: 2,
      kind: "corner",
      baseConnections: ["west", "north"],
      initialRotation: 270
    },
    {
      id: "trust-arch",
      label: "Trust Arch",
      row: 0,
      col: 2,
      kind: "corner",
      baseConnections: ["south", "east"],
      initialRotation: 270
    }
  ],
  successText: "The Trust door opens.",
  successFollowUp: "The lantern lights the blue-ribbon pages. The unfinished letter is released.",
  incompleteText: "The light has not reached Trust yet.",
  wrongQuestionText: "The echo has not found the right question yet.",
  revealText: "Trust is proven by what remains.",
  estimatedSeconds: 50
};

export const trustLightPathSpecs = [
  LEVEL_SIX_TRUST_LIGHT_PATH_SPEC
] as const satisfies readonly TrustLightPathSpec[];

export function getTrustLightPathSpec(levelId: number): TrustLightPathSpec | undefined {
  return trustLightPathSpecs.find((spec) => spec.levelId === levelId);
}
