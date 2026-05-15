export const storyContent = {
  title: "Maria and the Case of the Missing Heart",
  subtitle: "Sprawa Zaginionego Serca",
  openingCaseFile: {
    caseNumber: "Case No. 16/05",
    caseTitle: "The City v. The Missing Heart",
    salutation: "Applicant Maria,",
    body: [
      "A priceless heart has gone missing somewhere in Warsaw.",
      "A trail of clues is hidden across Warsaw.",
      "Follow the evidence carefully.",
      "Do not trust the loudest answer."
    ],
    signature: ["Signed,", "A Secret Client"]
  },
  credits: {
    title: "Credits",
    lines: [
      "Made with love by Alper",
      "For Maria",
      "Maria and the Case of the Missing Heart",
      "User-provided final art and chapter music are used with permission; sound effects are generated in code.",
      "Built with Phaser, Vite, TypeScript, Vitest, and Playwright."
    ]
  },
  finalVerdict: `VERDICT

In the matter of Maria v. The Missing Heart,
the Court finds Maria not guilty of stealing it.

The evidence shows that the heart was given freely,
intentionally, and with full awareness of the consequences.

Sentence:
endless birthdays, brave days, quiet mornings, ridiculous jokes,
and one person who will keep choosing you.

Happy birthday, Maria.
I love you.`,
  ui: {
    titlePrompt: "Press Enter or Tap to Open the Case",
    continuePrompt: "Press Enter or Tap to Continue",
    placeholderLevel: "This case file is sealed from the current route.",
    futureEvidenceReveal: "This clue record is sealed from the current route.",
    levelReady: "The Envelope at the Kancelaria",
    openingStartTitle: "Case of the Missing Heart",
    exhibitCollected: "Clue collected: The Sealed Envelope",
    checkpointActivated: "Checkpoint activated",
    respawned: "Back to the last safe point",
    findEnvelopeFirst: "Find the Sealed Envelope first.",
    restartHint: "R: restart   M: mute   Esc: pause",
    puzzleTitle: "Case Review: The Sealed Envelope",
    puzzlePlaceholder: "This clue review is sealed from the current route.",
    partTwoComplete: "The first clue is safely in the file.",
    exhibitAdmitted: "Clue filed.",
    levelOneReveal: "Maria notices what others miss.",
    levelOneRevealFollowUp: "The tram ticket inside turns attention into the first route across the city.",
    partThreeComplete: "The next case file is still sealed.",
    levelTwoPuzzleTitle: "Case Review: The Golden Stamp",
    levelTwoPuzzlePlaceholder: "The Golden Stamp review is sealed from this route.",
    levelTwoPuzzleComingSoon: "The Golden Stamp review is sealed from this route.",
    levelTwoRevealFollowUp: "The golden stamp turns a moving day into a route toward a hidden wall.",
    levelThreePuzzleTitle: "Case Review: The Red Brick",
    levelThreePuzzlePlaceholder: "The Red Brick review is sealed from this route.",
    levelThreePuzzleComingSoon: "The Red Brick review is sealed from this route.",
    levelThreeRevealFollowUp: "The repaired image marks the Vistula, where the next witness waits.",
    levelFourPuzzleTitle: "Case Review: The Witness Note",
    levelFourPuzzlePlaceholder: "Deposition Order is available for Level 4.",
    levelFourPuzzleComingSoon: "Level 4 puzzle is available in this build.",
    levelFourRevealFollowUp: "The witness note carries an archive reference, small enough to miss.",
    levelFivePuzzleTitle: "Case Review: The Marginal Note",
    levelFivePuzzlePlaceholder: "Case File Sorting is available for Level 5.",
    levelFivePuzzleComingSoon: "Level 5 puzzle is available in this build.",
    levelFiveRevealFollowUp: "The corrected margin releases a silver key from the file spine.",
    levelSixPuzzleTitle: "Case Review: The Silver Key",
    levelSixPuzzlePlaceholder: "Trust Door Light Path is available for Level 6.",
    levelSixPuzzleComingSoon: "Level 6 puzzle is available in this build.",
    levelSixRevealFollowUp: "Behind the Trust door, a lantern waits with a steadier kind of proof.",
    levelSevenPuzzleTitle: "Case Review: The Lantern",
    levelSevenPuzzlePlaceholder: "Lantern Sequence is available for Level 7.",
    levelSevenPuzzleComingSoon: "Level 7 puzzle is available in this build.",
    levelSevenRevealFollowUp: "The lantern path leads to pages tied with a blue ribbon.",
    levelEightPuzzleTitle: "Case Review: The Blue Ribbon",
    levelEightPuzzlePlaceholder: "Argument Tower is available for Level 8.",
    levelEightPuzzleComingSoon: "Level 8 puzzle is available in this build.",
    levelEightRevealFollowUp: "When the argument holds, it releases the unfinished letter.",
    levelNinePuzzleTitle: "Case Review: The Unfinished Letter",
    levelNinePuzzlePlaceholder: "Case Constellation is available for Level 9.",
    levelNinePuzzleComingSoon: "Level 9 puzzle is available in this build.",
    levelNineRevealFollowUp: "The completed letter opens the final court above the city.",
    levelTenPuzzleTitle: "Case Review: The Heart Seal",
    levelTenPuzzlePlaceholder: "Final Seal is available from the final court.",
    levelTenPuzzleComingSoon: "The final verdict is available in this build.",
    acceptVerdict: "Accept Verdict",
    caseClosed: "Case closed. Love confirmed.",
    evidenceLoveUnlocked: "Evidence of Love Unlocked",
    evidenceLoveBody: "One last file has been added to the case.",
    evidenceLovePrompt: "Open it when you are ready.",
    evidenceLoveNote: "A separate final file will open.",
    openEvidenceLove: "Open Evidence of Love",
    replayFinale: "Replay Finale",
    levelSelect: "Case Archive",
    credits: "Credits",
    backToTitle: "Back to Title"
  }
} as const;
