# Game Bible

The current narrative source of truth for future VN, puzzle, and level-flow rewrites is `docs/story-bible.md`.

## Emotional Thesis

Maria is intelligent, observant, brave, warm, disciplined, funny, and deeply loved. The game admires her as a complete person, not as a generic romantic prize.

## Story Summary

Maria receives a mysterious case file: something priceless has disappeared somewhere in Warsaw. A trail of clues is hidden across Warsaw. At first, the mystery appears legal and procedural; over time, each clue becomes more personal. The final accusation is that Maria stole the missing heart, but the verdict finds her not guilty because the heart was freely, intentionally, and lovingly given.

Current player-facing title: Maria and the Case of the Missing Heart.
Current Polish subtitle: Sprawa Zaginionego Serca.

## Tone

Elegant, clever, warm, romantic, gently funny, and lightly legal-themed. Legal language should work as metaphor, not homework.

## Target Player Experience

Maria should feel seen, respected, amused, and loved. The game should be easy to complete, never frustrating, and polished enough to feel intentional. The finished playtime target is now about 18-22 minutes, with later chapters slightly richer while staying compact and replayable.

## Maria Character Description

Maria is the heroine: observant, disciplined, capable, warm, funny, and brave. She solves the case through attention, kindness, and judgment.

## Six-Chapter / 10-Clue Structure

The player-facing game now uses six chapters while preserving the 10-clue mystery as the underlying story trail. Each chapter groups one or more clues, one platforming focus, one short puzzle interlude, and one emotional reveal. The clues progress from legal mystery toward personal romantic proof.

Part 40 updates the active VN scenes, opening case file copy, puzzle framing, and clue descriptions so each clue explicitly leads to the next clue in one continuous case trail.

Part 41 adds visible clue-to-clue continuity through the active clue-chain data, EvidenceRevealScene next-clue card, Level Select lead hints, and two-line puzzle success feedback.

Parts 42C through 42H make the Case Archive player-facing as six chapters. Old level ids, old routes, and old geometry remain retained behind the bridge for save compatibility, dev routing, and source material.

## Final Twist

Maria is accused of stealing the missing heart. The court finds her not guilty because the heart was freely given.

## Final Verdict Text

Implemented in Part 22 as the text shown by `FinalVerdictScene`; in the current six-chapter bridge it is reached through Chapter 6 and the simplified six-token Final Seal puzzle.

VERDICT

In the matter of Maria v. The Missing Heart,
the Court finds Maria not guilty of stealing it.

The evidence shows that the heart was given freely,
intentionally, and with full awareness of the consequences.

Sentence:
endless birthdays, brave days, quiet mornings, ridiculous jokes,
and one person who will keep choosing you.

Happy birthday, Maria.
I love you.

## What The Game Must Never Become

- Generic.
- Frustrating.
- Mocking.
- Legally dry.
- Mechanically bloated.
- Too hard on mobile.
- Full of unrelated puzzle mechanics.
