import type { PuzzleSpec } from "../types/PuzzleSpec";

export const puzzles = [
  {
    id: "puzzle-1",
    levelId: 1,
    type: "case-mosaic",
    title: "Case Mosaic: The Sealed Envelope",
    instruction: "Rebuild the envelope to reveal the first route.",
    estimatedSeconds: 40,
    emotionalPurpose: "Shows Maria's attention by letting the player rebuild the first clue into a whole envelope.",
    mobileUxNotes: "Use large mosaic slots and pieces, bounded tray layout, optional drag, and tap piece-to-slot fallback."
  },
  {
    id: "puzzle-2",
    levelId: 2,
    type: "case-timeline",
    title: "Case Timeline: The Golden Stamp",
    instruction: "Put the tram route in order so the validator can stamp the ticket.",
    estimatedSeconds: 35,
    emotionalPurpose: "Connects responsibility to graceful calm by letting the player seal a clear schedule.",
    mobileUxNotes: "Use large tap-to-place task tiles, clear tram stops, route glow feedback, and no dragging requirement."
  },
  {
    id: "puzzle-3",
    levelId: 3,
    type: "route-tile-puzzle",
    title: "Route Tile Puzzle: The Hidden Wall",
    instruction: "Turn the tiles until the stamped route reaches the wall.",
    estimatedSeconds: 45,
    emotionalPurpose: "Makes the stamped ticket, keyhole, hidden wall, and river mark connect through one readable route.",
    mobileUxNotes: "Use six large tap-to-rotate tiles, visible route glow, no dragging requirement, and action buttons inside the puzzle shell."
  },
  {
    id: "puzzle-4",
    levelId: 4,
    type: "deposition-order",
    title: "Deposition Order: The Witness Note",
    instruction: "Arrange the note strips so the witness statement makes sense.",
    estimatedSeconds: 40,
    emotionalPurpose: "Lets Maria reconstruct testimony instead of choosing from answer cards.",
    mobileUxNotes: "Use four large paper strips, vertical note slots, optional drag/drop, and tap strip-to-slot fallback."
  },
  {
    id: "puzzle-5",
    levelId: 5,
    type: "case-file-sorting",
    title: "Case File Sorting: No. Given.",
    instruction: "Arrange the documents so the margin marks line up.",
    estimatedSeconds: 50,
    emotionalPurpose: "Turns the archive correction into a legal-file ordering puzzle that reveals the silver key.",
    mobileUxNotes: "Use five large document cards, clear file slots, optional drag/drop, tap card-to-slot fallback, and visible key pickup."
  },
  {
    id: "puzzle-6",
    levelId: 6,
    type: "trust-light-path",
    title: "Trust Door Light Path",
    instruction: "Choose the right question, then turn the mirrors until the light reaches Trust.",
    estimatedSeconds: 50,
    emotionalPurpose: "Turns the right question into lantern light that physically opens Trust and releases the unfinished letter.",
    mobileUxNotes: "Use large question tiles, tap-to-rotate mirrors, visible light path feedback, and no drag requirement."
  },
  {
    id: "puzzle-7",
    levelId: 7,
    type: "lantern-sequence",
    title: "Lantern Sequence: The Lantern",
    instruction: "Carry the light through the garden pattern to reveal the next clue.",
    estimatedSeconds: 35,
    emotionalPurpose: "Creates a soft reset around warmth, calm, and home through a gentle flame path.",
    mobileUxNotes: "Use a draggable flame token, large lantern drop targets, Show Pattern, and tap fallback."
  },
  {
    id: "puzzle-8",
    levelId: 8,
    type: "argument-tower",
    title: "Argument Tower: The Blue Ribbon",
    instruction: "Build the argument that can stand and release the letter.",
    estimatedSeconds: 45,
    emotionalPurpose: "Shows that the strongest argument is a structure built from actions and promise.",
    mobileUxNotes: "Use draggable evidence blocks, large tower slots, stable/unstable states, and tap fallback."
  },
  {
    id: "puzzle-9",
    levelId: 9,
    type: "case-constellation",
    title: "Case Constellation: The Unfinished Letter",
    instruction: "Place the clues where they belong so the unfinished letter can speak.",
    estimatedSeconds: 60,
    emotionalPurpose: "Makes the accumulated evidence form one beautiful synthesis before the finale.",
    mobileUxNotes: "Use draggable clue stars, large meaning nodes, generous snapping, and tap fallback."
  },
  {
    id: "puzzle-10",
    levelId: 10,
    type: "final-verdict-assembly",
    title: "Final Seal: The Court of the Heart",
    instruction: "Rotate the seal rings until the clues point to the heart.",
    estimatedSeconds: 40,
    emotionalPurpose: "Ceremonially aligns the six chapter clues into the final court seal before the approved verdict opens.",
    mobileUxNotes: "Use three large tap-to-rotate seal rings, six visible clue lights, no drag requirement, and a clear Unlock Verdict action."
  }
] as const satisfies readonly PuzzleSpec[];
