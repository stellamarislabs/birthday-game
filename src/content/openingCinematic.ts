export type OpeningVisualKey =
  | "city-wakes"
  | "way-to-office"
  | "law-office"
  | "maria-arrives"
  | "desk-file"
  | "she-sits"
  | "menu-reveal";

export interface OpeningCinematicBeat {
  id: string;
  visualKey: OpeningVisualKey;
  imagePath: string;
  caption: string;
  durationMs: number;
}

export const OPENING_CINEMATIC_VISUAL_CAPTIONS_VISIBLE = true;

export const openingCinematicImagePaths = [
  "assets/final/opening/Opening01.webp",
  "assets/final/opening/Opening02.webp",
  "assets/final/opening/Opening03.webp",
  "assets/final/opening/Opening04.webp",
  "assets/final/opening/Opening05.webp",
  "assets/final/opening/Opening06.webp",
  "assets/final/opening/Opening07.webp"
] as const;

export const openingCinematicBeats: OpeningCinematicBeat[] = [
  {
    id: "city-wakes",
    visualKey: "city-wakes",
    imagePath: openingCinematicImagePaths[0],
    caption: "Warsaw wakes quietly.",
    durationMs: 3600
  },
  {
    id: "way-to-office",
    visualKey: "way-to-office",
    imagePath: openingCinematicImagePaths[1],
    caption: "But some days arrive with a case.",
    durationMs: 3800
  },
  {
    id: "law-office",
    visualKey: "law-office",
    imagePath: openingCinematicImagePaths[2],
    caption: "One envelope waits where ordinary papers should be.",
    durationMs: 3700
  },
  {
    id: "maria-arrives",
    visualKey: "maria-arrives",
    imagePath: openingCinematicImagePaths[3],
    caption: "A key, a ticket, and a question.",
    durationMs: 3600
  },
  {
    id: "desk-file",
    visualKey: "desk-file",
    imagePath: openingCinematicImagePaths[4],
    caption: "Maria begins the day.",
    durationMs: 3900
  },
  {
    id: "she-sits",
    visualKey: "she-sits",
    imagePath: openingCinematicImagePaths[5],
    caption: "She takes her place at the desk.",
    durationMs: 4000
  },
  {
    id: "menu-reveal",
    visualKey: "menu-reveal",
    imagePath: openingCinematicImagePaths[6],
    caption: "The case file awaits for solving.",
    durationMs: 3200
  }
];

export const openingCinematicTotalDurationMs = openingCinematicBeats.reduce((total, beat) => total + beat.durationMs, 0);
