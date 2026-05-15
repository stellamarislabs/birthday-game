# Mechanics-Driven Puzzle Redesign Plan

Part 45A-R2 planning document. This supersedes the earlier clue-interaction-only direction from Part 45A.

This is a design plan only. It does not change runtime code, active puzzle files, story text, save/progression, assets, or the approved final verdict.

## Executive Summary

The earlier clue-interaction plan moved too far away from actual puzzles. It correctly identified that the game should avoid homework-like puzzle friction, but it overcorrected by turning several chapters into simple clue taps. That direction does not create enough play, surprise, or satisfaction after platforming.

New product rule:

**Platformer = the main game. Puzzle = the mystery payoff.**

Each chapter should still end with a short, real puzzle. The player should have a clear goal, manipulate a small visual system, notice a simple mechanic, get a small "aha" moment, and then see the next clue reveal itself.

Target puzzle duration:

- Normal target: 30-60 seconds.
- Chapter 3 can be slightly shorter if the deduction lands cleanly.
- Chapter 6 should stay elegant and not become a hard finale exam.

The active future direction is:

- Chapter 1: keep and polish Case Mosaic.
- Chapter 2: replace simple wall tapping with a route tile puzzle.
- Chapter 3: replace Witness Lens with Deposition Order, a document-reconstruction puzzle.
- Chapter 4: replace Archive Detail Finder with Case File Sorting, a document-order puzzle that reveals `No. Given.` and the Silver Key.
- Chapter 5: replace/simple-choice feel with a Trust Door light path puzzle.
- Chapter 6: replace token-slot matching with a final seal ring or constellation puzzle.

Part 45B's "open envelope only" and "tap key/cracks only" direction is rejected as the long-term design. Future implementation should treat it as a temporary branch to revise, not as the final puzzle style.

## Why The Previous Direction Was Rejected

The clue-interaction approach made the clue payoff quick, but too little of it felt like puzzle play.

Problems with that direction:

- It reduced the player's role to tapping obvious objects.
- It removed the small mental challenge that makes a puzzle memorable.
- It made the post-platformer moment feel like a UI confirmation instead of a playable mystery beat.
- It flattened differences between chapters: open, tap, light, file.
- Chapter 1 lost one of the better old ideas: reconstructing the sealed envelope.
- Chapter 2 became too passive for a chapter about route, stamp, key, wall, and river mark.

What should remain from the clue-interaction thinking:

- Short duration.
- Mobile-first tap completion.
- No precision-only dragging.
- No page scroll.
- No long instruction text.
- Strong visual payoff.
- Direct clue continuity.

What must come back:

- Real mechanics.
- A small "aha" moment.
- Consequences the player can observe.
- A clear solved state earned through interaction, not just clicking through.

## Puzzle Design Principles

Use these principles for every redesigned active puzzle.

1. Clear goal

The player should understand the goal within five seconds.

2. Clear tools

Interactive objects must look interactive. If it can be rotated, placed, stamped, aligned, or connected, it should advertise that visually.

3. Clear consequences

Every player action should visibly change the board: a route connects, a line lights, a clue mark appears, a seal turns, a document layer aligns.

4. Mechanics first

The solution should come from understanding one simple mechanic, not from guessing a correct UI option.

5. One strong mechanic per puzzle

Do not combine three minigames into one chapter puzzle.

6. Short but satisfying

Average first-time completion should be 30-60 seconds, with no punishment loop.

7. Low dexterity

The challenge should be observation, alignment, connection, or deduction, not precise finger control.

8. Story-connected

The action should explain the clue. Reconstruct the envelope. Connect the route. Stamp the contradiction. Align the correction. Route light to Trust. Align the final seal.

9. Mobile-friendly

Tap fallback must complete every puzzle. Drag may be optional polish, never required.

10. Visual payoff

Every solved puzzle should transform the board in a satisfying way and clearly reveal the next clue.

## Current Direction Versus New Direction

| Chapter | Earlier Part 45A direction | Part 45A-R2 direction |
|---|---|---|
| 1 | Replace mosaic with opening envelope | Keep and polish Case Mosaic |
| 2 | Tap key/keyhole/cracks | Replace with route tile puzzle |
| 3 | Keep Witness Lens, streamline | Replaced by Deposition Order document reconstruction |
| 4 | Magnifier/tap key interaction | Replaced by Case File Sorting document order puzzle |
| 5 | Question + key door interaction | Question unlocks Trust light path puzzle |
| 6 | Tap six clue tokens | Final seal ring or constellation puzzle |

## Six-Puzzle Plan

### Chapter 1 - The Sealed Envelope

Decision: keep and polish Case Mosaic.

Current puzzle:

- Case Mosaic envelope reconstruction.

Why keep it:

- It is visual.
- It is tactile.
- It is simple.
- It naturally fits the sealed envelope clue.
- It gives the player a real puzzle with a clear finished image.
- It is one of the older puzzle directions that felt closer to fun.

Target duration: 30-45 seconds.

Mechanic:

- Simple 3x2 image reconstruction / jigsaw-style placement.

Player action:

1. Six envelope pieces appear in a tray.
2. Player places pieces into a 3x2 envelope frame.
3. Tap fallback works: tap piece, tap slot.
4. Drag can remain optional for desktop/touch flourish.
5. When the image is whole, the wax seal glows.
6. Brass Key and Tram Ticket appear.
7. Route glow appears as the solved payoff.

Recommended improvements:

- Keep the 3x2 board.
- Make each piece visually clearer and less samey.
- Make correct placement feedback immediate.
- Reduce tray friction and prevent overflow.
- Use large mobile-safe pieces.
- Avoid extra post-solve steps.
- File Clue only after the solved image reveals the key/ticket route.

Story payoff:

- The envelope becomes whole and reveals the first route.
- Maria notices what others miss.
- The tram ticket points to Chapter 2.

Avoid:

- Replacing the puzzle with just opening the envelope.
- Tiny jigsaw pieces.
- A tray that crowds the footer.
- Long instruction text.
- Any strict drag-only requirement.

Implementation note:

- Future Part 45B-R2 should restore or preserve the mosaic as the active Chapter 1 mechanic if the temporary clue-interaction implementation is still present.
- The retained `caseMosaic` module is still the natural home for this puzzle.

### Chapter 2 - The Hidden Wall

New puzzle: Route Tile Puzzle: The Hidden Wall.

Goal:

- Connect the stamped tram route to the hidden wall and Vistula wave mark.

Target duration: 35-60 seconds.

Mechanic:

- Small route/pipe/tile connection puzzle.

Player action:

1. A wall/ticket board shows route tiles.
2. Start and end anchors are clear:
   - Tram Ticket
   - Golden Stamp
   - Keyhole
   - Hidden Wall
   - Wave Mark
3. Player rotates or swaps 4-6 large route tiles.
4. The route must connect from the ticket through the stamp and keyhole to the wave mark.
5. When connected, the route glows.
6. The keyhole lights, the hidden wall opens, and the Vistula mark appears.

Preferred mobile implementation:

- Use 4 large rotatable tiles if 5-6 tiles feel cramped.
- Tap tile to rotate 90 degrees.
- Optional swap mode only if it remains easy.
- No tiny rotation handles.
- No precision dragging required.

Story payoff:

- The stamp reveals the route.
- The key opens the wall.
- The wall points to the Vistula.

Why this is better than the rejected direction:

- It is still a real puzzle.
- It represents the story physically.
- It turns "route" into a mechanic instead of a line of text.
- It avoids the old generic wall-jigsaw repair board.

Avoid:

- Six-piece wall jigsaw with rotation unless it feels clearly better than route tiles.
- Generic repair board.
- Too many pieces.
- Hidden keyhole taps as the whole puzzle.
- Strict tiny rotation targets.

Likely implementation reuse:

- Retain the `rebuild-puzzle` route id for save/bridge compatibility if practical.
- The active internals can become route-tile logic instead of repair-piece logic.
- Pure logic should validate route connectivity, not exact decorative placement.

### Chapter 3 - The River Witness

Puzzle: Deposition Order: The Witness Note.

Decision: replace Witness Lens as the active player-facing puzzle.

Goal:

- Rebuild the witness note statement from four torn strips.

Target duration: 30-50 seconds.

Mechanic:

- Document reconstruction / deposition ordering.

Player action:

1. Four statement strips appear in a tray.
2. Player places them into a vertical witness note.
3. Tap fallback is primary: tap strip, tap line slot.
4. Optional drag/drop remains a tactile flourish.
5. Correct order reveals the archive code at the bottom of the note.

Recommended improvements:

- Keep the strips large and readable.
- Make the selected strip and target slot obvious.
- Allow safe swaps/replacements.
- Reveal the archive code only after the statement reads correctly.

Story payoff:

- The witness statement becomes coherent.
- The archive code points Maria toward the archive.

Avoid:

- Tool-management friction.
- Tiny document targets.
- More than four strips.
- A quiz-like multiple-choice feel.

Likely implementation reuse:

- Use the new `depositionOrder` module for active Chapter 3.
- Keep `witnessLens` as retained legacy/source material.

### Chapter 4 - The Archive of Corrections

New puzzle: Case File Sorting: No. Given.

Goal:

- Sort the archive documents so margin marks align into `No. Given.` and release the silver key.

Target duration: 35-60 seconds.

Preferred mechanic:

- Case-file document ordering.

Player action:

1. Five archive document cards appear in a tray.
2. Player arranges them into the file order.
3. Tap fallback is primary: tap document, tap file slot.
4. Correct order aligns the margin marks.
5. The correction resolves: `No. Given.`
6. The Silver Key appears and must be taken before filing the clue.

Story payoff:

- The case changes from "taken" to "given."
- Small details change the charge.
- The silver key points to the courthouse.

Avoid:

- Pixel hunting.
- Four hidden tiny details.
- Long bookmark lists.
- Too much reading.
- Drag precision as the only input.

Likely implementation reuse:

- `archiveDetailFinder` can remain the route/module.
- Active logic should shift toward alignment or 2-3 generous reveal states.
- Existing magnifier affordances can be reused if overlay alignment is too costly.

### Chapter 5 - The Door of Trust

New puzzle: Trust Door Light Path.

Goal:

- Open the Trust door and reveal the blue ribbon pages.

Target duration: 40-60 seconds.

Mechanic:

- Question choice unlocks a small light-path / circuit puzzle.

Player action:

1. Three question tiles appear.
2. Player chooses:
   - "What remains when things are difficult?"
3. Correct question activates the Silver Key or lantern source.
4. Player routes a simple light path to the Trust door by rotating 2-3 large mirrors, sigils, or lantern plates.
5. When light reaches Trust, the door opens.
6. Lantern lights and blue ribbon pages appear.

Why this is better than a choice-only puzzle:

- The right question still matters.
- The player then solves a visible spatial mechanic.
- Trust opens through action, not just selecting an answer.

Story payoff:

- Trust opens only after the right question.
- The lantern and blue ribbon release the unfinished letter.

Avoid:

- Separate lantern sequence.
- Argument tower blocks.
- Long multi-phase hybrid.
- Strict tiny rotations.
- A dry form-like "choose the correct answer" screen.

Likely implementation reuse:

- `echoPath` can remain the active route/module.
- The current question/key state can become phase one.
- Add one small light-path mechanic as phase two, still within one puzzle.
- Keep tap-to-rotate as primary mobile input.

### Chapter 6 - The Court of the Heart

New puzzle: Final Seal Ring Puzzle.

Goal:

- Open the final verdict seal.

Target duration: 30-50 seconds.

Preferred mechanic options:

Option A - Ring rotation:

1. Court seal has three concentric rings.
2. Each ring contains clue marks.
3. Player rotates rings by tapping left/right controls or tapping the ring.
4. Rings align into a heart/scales shape.
5. Six clue lights ignite.
6. Verdict opens.

Option B - Constellation path:

1. Six clue nodes surround the seal.
2. Player connects a simple path:
   - Envelope -> Wall -> Witness -> Correction -> Trust -> Heart
3. Large snap zones avoid precision drawing.
4. Path completion closes the seal.

Option C - Three seal plates:

1. Player taps/rotates three large seal plates.
2. Each plate lights two clue marks.
3. All six lights complete the seal.

Preferred direction:

- Use ring rotation if the UI can remain stable on mobile.
- Use constellation path if ring controls prove fragile.
- Use three seal plates as the safest fallback.

Story payoff:

- All clues align.
- The final court opens.
- The verdict is ready.

Player-facing title:

- `Final Seal: The Court of the Heart`

Avoid:

- Ten ordered fragments.
- Exact token-slot matching as the primary challenge.
- Long final challenge.
- Spoiling "freely given" before the verdict.
- Using `The Heart, Freely Given` before FinalVerdictScene unless separately approved.

Logic safety:

- Puzzle success may route to FinalVerdictScene.
- Puzzle success must not mark `gameCompleted`.
- `gameCompleted` remains tied to Accept Verdict.
- Final verdict text remains unchanged.

## Keep / Replace Matrix

| Chapter | Current puzzle | User feedback problem | Decision | New mechanic | Duration | Complexity | Mobile risk | Code likely reused | Image-puzzle based |
|---|---|---|---|---|---:|---|---|---|---|
| 1 | Case Mosaic / temporary Open Envelope | Tapping only is too simple; original mosaic was better | Keep/polish Case Mosaic | 3x2 envelope reconstruction | 30-45s | Medium | Low-medium | `caseMosaic` | Yes |
| 2 | Hidden Wall tap interaction / older repair board | Tapping key/cracks is too passive; repair board was too generic | Replace | Route tile / pipe connection puzzle | 35-60s | Medium-high | Medium | `rebuildPuzzle` route or new route-tile internals | Yes |
| 3 | Witness Lens | Tool-management and quiz feel | Replace | Deposition Order: rebuild four witness-note strips | 30-50s | Medium | Low | `depositionOrder`; old `witnessLens` retained legacy/source | Yes |
| 4 | Archive Detail Finder | Pixel-hunt/bookmark risk | Replace | Case File Sorting: arrange five archive documents, reveal `No. Given.`, take Silver Key | 35-60s | Medium | Low-medium | `caseFileSorting`; old `archiveDetailFinder` retained legacy/source | Yes |
| 5 | Echo Path | Choice-only can feel like a form | Replace/simplify | Correct question unlocks Trust light path | 40-60s | Medium-high | Medium | `trustLightPath`; old `echoPath` retained legacy/source | No |
| 6 | Final Seal token placement | Token-slot matching is not climactic enough | Replace/simplify | Ring rotation or constellation path | 30-50s | Medium-high | Medium | `finalVerdictAssembly` | Yes |

## Image Puzzle Variation Plan

Image-puzzle variants should appear, but not every chapter should use the same pattern.

Chapter 1:

- Image reconstruction.
- Envelope mosaic.
- The player makes the clue whole.

Chapter 2:

- Route image / pipe tile puzzle.
- The player connects the clue path.

Chapter 4:

- Document overlay or magnifier image reveal.
- The player makes the hidden correction legible.

Chapter 6:

- Final seal ring / constellation image puzzle.
- The player aligns all clues into one final court symbol.

Avoid repetition:

- Chapter 1 should feel like assembling an object.
- Chapter 2 should feel like connecting a route.
- Chapter 4 should feel like aligning evidence layers.
- Chapter 6 should feel like ceremonial synthesis.

Non-image-puzzle chapters:

- Chapter 3 = deduction / lens / stamp.
- Chapter 5 = light path / door circuit.

## Technical Implementation Strategy

Recommended strategy:

- Keep `PuzzleScene` and active chapter routing.
- Replace active puzzle internals one chapter pair or one chapter at a time.
- Keep old modules/dev routes until final cleanup.
- Use pure logic modules for each redesigned puzzle.
- Keep DOM overlays for puzzle UI unless a Phaser-only implementation is clearly safer.
- Keep tap fallback as the primary mobile path.
- Use drag only where it improves feel.
- Keep no-scroll layout.
- Preserve existing completion routing and save bridge ids until a save migration is explicitly approved.

Do not build a large new puzzle engine yet.

Why not a huge puzzle engine:

- The game only needs six short puzzles.
- Each chapter needs a distinct mechanic.
- A generic engine may flatten the puzzles or take longer than hand-polishing six focused modules.

Recommended implementation pattern:

1. Define a small pure logic state machine per puzzle.
2. Render one puzzle-specific DOM component.
3. Keep test ids stable and explicit.
4. Add unit tests for solved/unsolved/reset states.
5. Add mobile e2e tap completion where practical.
6. Verify no page scroll and visible action buttons.

## Mobile / UX Strategy

Global rules:

- Phone target is landscape.
- No body/page scroll.
- All puzzle targets must fit inside the viewport.
- Tap targets should be large enough for thumbs.
- No drag-only completion.
- No precision-only rotations or drawing.
- No tiny hidden zones.
- Instructions should be one short sentence.
- Wrong/incomplete feedback should be gentle and immediate.
- Reset should be secondary.
- Primary action should always be visible.

Per-chapter mobile notes:

| Chapter | Primary mobile input | Key mobile risk | Design response |
|---|---|---|---|
| 1 | Tap piece, tap slot | Pieces/tray crowding | Keep 3x2, large pieces, bounded tray |
| 2 | Tap tile to rotate | Too many tiles | Prefer 4 large tiles, max 6 |
| 3 | Tap statement, tap stamp | Feeling like multiple choice | Make lens hints visual and stamp tactile |
| 4 | Tap/nudge overlays or magnifier zones | Pixel hunting or drag precision | Use obvious guides and snap alignment |
| 5 | Tap question, tap/rotate light mirrors | Multi-phase bloat | Keep 2-3 mirrors only |
| 6 | Tap/rotate rings or connect large nodes | Final puzzle too hard | Use generous snap/alignment and few states |

## Testing Strategy

For each future implementation:

- Initial state is unsolved.
- Main mechanic changes visible state.
- Wrong/incomplete state does not solve.
- Solved state is reachable in the intended number of actions.
- Reset restores initial state.
- Tap fallback completes the puzzle.
- Drag, if present, is optional.
- Success routes to the expected reveal or final scene.
- No active puzzle copy uses old exhibit language.
- Final verdict text remains unchanged.

Chapter-specific test expectations:

Chapter 1:

- Six envelope pieces exist.
- Pieces can be placed by tap.
- Solved envelope reveals key/ticket route.
- No envelope-open-only shortcut is the final active solve.

Chapter 2:

- Route tiles start disconnected.
- Tapping rotates tiles.
- Connected route lights ticket/stamp/keyhole/wave path.
- Puzzle solves through route connectivity, not simple key tapping.

Chapter 3:

- Statements can be inspected by tap.
- Stamp can mark the contradiction.
- Wrong stamp does not solve.
- Archive code appears only after correct stamp.

Chapter 4:

- Overlay or magnifier states reveal correction fragments.
- "No. Given." appears only after correct alignment/reveal.
- Silver Key appears after the correction.

Chapter 5:

- Correct question unlocks the light source.
- Light path starts incomplete.
- Rotating 2-3 mirrors/sigils can connect light to Trust.
- Door opens only after question plus light path.

Chapter 6:

- Seal rings/plates/nodes start unaligned.
- Player can rotate/connect with tap.
- All six clue lights ignite after alignment/path completion.
- Puzzle success does not mark `gameCompleted`.
- Accept Verdict marks `gameCompleted`.

E2E/mobile:

- Mobile landscape opens each puzzle with no document scroll.
- Required objects and primary action are inside viewport.
- Chapter 1 and Chapter 2 get updated e2e after R2 implementation.
- Chapter 6 e2e still confirms final verdict text and Accept Verdict boundary.

## Future Implementation Roadmap

### Part 45B-R2 - Implement Chapter 2 Route Tile Puzzle While Keeping Chapter 1 Case Mosaic

Status: implemented.

Goal:

- Reverse the over-simple Chapter 1 direction by keeping/preserving Case Mosaic.
- Replace Chapter 2's key/crack tap interaction with a small route tile puzzle.

Tasks:

- Ensure Chapter 1 active puzzle is Case Mosaic again or remains Case Mosaic if already restored.
- Implement Chapter 2 route tile logic: rotate/connect route from ticket to stamp to keyhole to wave mark.
- Keep Chapter 1 and Chapter 2 routing/save boundaries unchanged.
- Add unit tests and mobile e2e for Chapter 2 route solve.

Implemented notes:

- Active Chapter 1 is back to `Case Mosaic: The Sealed Envelope`.
- Active old Level 3 / Chapter 2 puzzle content now uses `route-tile-puzzle`.
- The old `rebuildPuzzle` source remains retained for legacy/dev reference, but active Chapter 2 no longer uses the tap-only hidden-wall interaction.

Risk: medium. This touches early puzzle identity and e2e selectors.

### Part 45C-R2 - Polish Chapter 1 Case Mosaic And Chapter 3 Witness Lens

Status: implemented.

Goal:

- Make Chapter 1 feel tactile, clear, and premium.
- Make Chapter 3 more immediate while preserving deduction.

Tasks:

- Improve envelope piece readability and feedback.
- Keep tap-to-place and optional drag.
- Streamline Witness Lens so statement inspection and stamping are fast.
- Add/update e2e tap completion for both.

Implemented notes:

- Chapter 1 still uses the six-piece 3x2 Case Mosaic and now shows a stronger solved payoff: restored-clue glow, Brass Key, Tram Ticket, and Glowing Route before filing.
- Chapter 3 keeps Witness Lens but makes tap-to-inspect the default path, keeps the Contradiction stamp as the tactile action, and reveals the archive code after the correct stamp.

Risk: low-medium.

### Part 45D-R2 Revised - Replace Chapter 3 And Chapter 4 Document Puzzles

Goal:

- Replace the active Chapter 3 Witness Lens with a deposition-order document puzzle.
- Replace the active Chapter 4 Archive Detail Finder / Archive Overlay with a case-file sorting puzzle.
- Fix the Case Archive panel so all six chapter cards fit inside the player-facing frame.

Tasks:

- The active old Level 4 / Chapter 3 puzzle content now uses `deposition-order`.
- The player places four witness-note strips in deposition order; the correct statement reveals archive code `16/05-MARGIN`.
- The active old Level 5 / Chapter 4 puzzle content now uses `case-file-sorting`.
- The player sorts five archive documents; the correct file order reveals `No. Given.` and makes the Silver Key available before filing the clue.
- Old `witnessLens` and `archiveDetailFinder` modules remain retained as legacy/source material and dev-route candidates where practical.
- Case Archive uses a larger responsive 2x3 grid so Chapter 5 and Chapter 6 cards do not escape the frame.

Status: complete in Part 45D-R2 revised. Remaining risk is real-device mobile feel, especially whether five archive cards remain comfortably tappable on the shortest landscape phones.

### Part 45E-R2 - Implement Chapter 5 Trust Door Light Path Puzzle

Status: implemented.

Goal:

- Preserve the right-question story beat but add a real spatial light mechanic.

Tasks:

- Keep three question tiles.
- Correct question activates Silver Key/lantern source.
- Add 2-3 rotatable light mirrors/sigils.
- Light reaching Trust opens the door and reveals lantern/ribbon pages.

Implemented notes:

- Active old Level 6 / Chapter 5 puzzle content now uses `trust-light-path`.
- The player chooses the right question, then taps three large mirrors/sigils to route lantern light through the Silver Key relay to the Trust door.
- Trust opening reveals the blue-ribbon pages and unfinished letter in the success payoff.
- Old `echoPath`, `lanternSequence`, and `argumentTower` modules remain retained source/legacy material; they are not required in the active Chapter 5 player flow.

Risk: medium-high. Remaining risk is real-device mobile fit and whether the compact light board still feels readable on shortest landscape phones.

### Part 45F-R2 - Implement Chapter 6 Final Seal Ring / Constellation Puzzle

Goal:

- Make the final puzzle feel like ceremonial synthesis with a real mechanic.

Tasks:

- Choose ring rotation, constellation path, or three seal plates.
- Preserve title `Final Seal: The Court of the Heart`.
- Avoid "freely given" spoiler before verdict.
- Preserve FinalVerdictScene and `gameCompleted` boundary.

Implemented notes:

- Active old Level 10 / Chapter 6 puzzle content keeps the `finalVerdictAssembly` route for compatibility but now uses three tap-rotated seal rings instead of token-slot placement.
- The rings light the six clue marks: Envelope, Wall, Witness, Correction, Trust, and Heart.
- Success copy remains concise: `The final seal closes.` / `The verdict is ready.`
- The puzzle still routes directly to `FinalVerdictScene`; `gameCompleted` remains tied only to Accept Verdict.

Risk: medium. Remaining risk is real-device mobile feel and whether the final seal reads as ceremonial enough before final asset work.

### Part 45G - Full Puzzle QA And Playtest Pass

Goal:

- Verify all six puzzles feel like short real puzzles, not forms or homework.

Tasks:

- Desktop QA.
- Mobile landscape QA.
- Tap-only completion QA.
- Timed full playthrough.
- Check clue reveals.
- Check final verdict boundary.

Risk: low implementation risk, high design value.

Implemented notes for Part 45G-R2:

- Added regression coverage that locks the six player-facing chapter puzzle routes to the mechanics-driven set: Case Mosaic, Route Tile Puzzle, Deposition Order, Case File Sorting, Trust Door Light Path, and Final Seal.
- Added desktop click/tap completion coverage for all six active puzzles, matching the existing mobile-landscape tap fallback smoke path.
- Verified the Chapter 6 final seal handoff still opens `FinalVerdictScene` while `gameCompleted` remains tied to Accept Verdict.
- No runtime puzzle mechanics were replaced during this QA pass; remaining risk is subjective real-device feel and timed human playthrough pacing.
- Post-46B refresh: the puzzle set was re-audited after the platformer rebuilds and remains the active mechanics-driven layer. Additional content coverage now checks target duration bands, payoff terms, concise instructions, and exclusion of old Witness Lens / Archive Detail Finder / Echo Path / ten-fragment final-puzzle language from active chapter puzzle copy.

### Part 45H - Resume Final Asset Generation

Goal:

- Start final image generation only after the active puzzle layer is stable.

Tasks:

- Generate/integrate one approved asset at a time.
- Keep images text-free.
- Re-test after each asset integration.

Risk: asset quality and performance.

## Acceptance Criteria For The R2 Direction

This plan is successful only if:

- The previous "all clue interactions" direction is clearly superseded.
- Chapter 1 Case Mosaic is kept and polished.
- Chapter 2 becomes a route tile puzzle.
- Chapter 3 becomes a Deposition Order document reconstruction puzzle.
- Chapter 4 becomes a Case File Sorting document-order puzzle.
- Chapter 5 becomes a Trust Door light path puzzle.
- Chapter 6 becomes a final seal ring/constellation/plate puzzle.
- Image-puzzle variation is intentional, not repetitive.
- Tap fallback and mobile landscape remain first-class.
- No page scroll is required.
- Save/progression and final verdict boundaries are preserved.

## Final Recommendation

Proceed with the mechanics-driven puzzle redesign before final asset work.

The first implementation should be Part 45B-R2: keep Chapter 1 Case Mosaic and implement Chapter 2 as a real route tile puzzle. That will correct the over-simple clue-interaction direction while preserving the 10-15 minute birthday-gift scope.
