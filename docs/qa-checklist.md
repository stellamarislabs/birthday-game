# QA Checklist

## Desktop Launch Checks

- App loads in Chrome, Edge, and Firefox where practical.
- Title screen appears.
- Enter opens the case file.
- Continue opens the placeholder level or current next scene.
- Canvas stays centered and scaled.

## Part 42C Chapter Archive Bridge Checks

- Level Select / Case Archive shows 6 chapter cards, not the old 10-level player-facing grid.
- Progress reads `[N]/6 chapters closed`.
- Chapter 1 is playable on a fresh save and launches old Level 1 during the bridge.
- Chapter 2 unlocks after the Chapter 1 bridge completion condition and launches old Level 2.
- Chapter 3 launches old Level 4, Chapter 4 launches old Level 5, Chapter 5 launches old Level 6, and Chapter 6 launches old Level 9.
- Completed/replay states are inferred from old completed level ids without changing `saveVersion`.
- Game completed saves show `Verdict Accepted. Case Closed.` and all 6 chapters closed.
- Main menu Case Archive button opens the 6-chapter Case Archive.
- Back to Title still works.
- Reset Case still clears the old save schema normally.
- Direct dev/test routes for old Levels 1-10 still work, including platformer, puzzle, and VN routes.
- Final verdict text remains unchanged.

## Part 42D Chapter 1-2 Active Flow Checks

- Case Archive Chapter 1 launches `vn-chapter-1-intro`, then old Level 1 platformer, the retained `case-mosaic` route as a 3x2 Case Mosaic, and a Chapter 1 clue-filed reveal. The short chapter pre/post puzzle VN scenes remain targetable for dev routes.
- Completing Chapter 1 marks the old Level 1 bridge completion and unlocks Chapter 2 without changing `saveVersion`.
- Case Archive Chapter 2 launches `vn-chapter-2-intro`, then old Level 2 platformer, one-line Chapter 2 pre-puzzle VN, the old Level 3 completion route as `Route Tile Puzzle: The Hidden Wall`, and a Chapter 2 clue-filed reveal.
- Completing Chapter 2 marks the old Level 3 bridge completion and makes Chapter 3 the next visible bridge chapter.
- Chapter 2 reveal says the opened wall points toward the Vistula; the full old Level 2+3 geometry merge is intentionally deferred.
- Direct legacy dev routes still work for `?scene=platformer&level=1`, `?scene=platformer&level=2`, `?scene=platformer&level=3`, `?scene=puzzle&level=1`, `?scene=puzzle&level=2`, and `?scene=puzzle&level=3`.
- Chapter bridge dev routes work for `?scene=platformer&chapter=1`, `?scene=platformer&chapter=2`, `?scene=puzzle&chapter=1`, and `?scene=puzzle&chapter=2`.
- Reset Case returns the player-facing Case Archive to Chapter 1 available only.
- Final verdict text remains unchanged.

## Part 42J Chapter 1-2 Expansion QA

- Chapter 1 no longer ends immediately after the original kancelaria route; it includes a safe route-awakening ending section.
- Chapter 1 shows the envelope-to-brass-key/tram-ticket handoff through visible clue decorations and concise hint copy.
- Chapter 1 has at least two checkpoints and remains tutorial-friendly with no enemies, precision jumps, or difficult moving platforms.
- Chapter 1 still routes through the Chapter 1 VN, open-envelope clue interaction, and clue-filed reveal without changing saveVersion.
- Chapter 2 keeps the forgiving tram/moving-platform beat and extends into a rebuilt-street/hidden-wall route.
- Chapter 2 includes a golden validator/stamp moment, keyhole rebuild trigger, red-brick/wall reveal, Vistula wave-mark handoff, and at least three checkpoints.
- Chapter 2 moving platforms remain slow enough for desktop keyboard and mobile touch play, with no impossible jumps or long punishment loops.
- Chapter 2 still routes through Chapter 2 VN, the route tile puzzle bridge, and the Chapter 2 clue-filed reveal pointing to the Vistula.
- Direct legacy dev routes for old Levels 1-3 and chapter dev routes for Chapters 1-2 remain available.
- Final verdict text, save schema, Case Archive progress, and Chapters 3-6 geometry remain unchanged.

## Part 42E Chapter 3-4 Active Flow Checks

- Case Archive Chapter 3 launches `vn-chapter-3-intro`, then old Level 4 platformer, old Level 4 Deposition Order, and a Chapter 3 clue-filed reveal. The short chapter pre/post puzzle VN scenes remain targetable for dev routes.
- Completing Chapter 3 marks the old Level 4 bridge completion and unlocks Chapter 4 without changing `saveVersion`.
- Chapter 3 reveal says an archive code appears in the corner of the note.
- Case Archive Chapter 4 launches `vn-chapter-4-intro`, then old Level 5 platformer, one-line Chapter 4 pre-puzzle VN, old Level 5 Case File Sorting, and a Chapter 4 clue-filed reveal.
- Completing Chapter 4 marks the old Level 5 bridge completion and makes Chapter 5 the next visible bridge chapter.
- Chapter 4 reveal moves the silver-key story beat into the archive without using old Level 6 geometry yet.
- Direct legacy dev routes still work for `?scene=platformer&level=4`, `?scene=platformer&level=5`, `?scene=puzzle&level=4`, `?scene=puzzle&level=5`, `?scene=vn&id=vn-level-4-intro`, and `?scene=vn&id=vn-level-5-intro`.
- Chapter bridge dev routes work for `?scene=platformer&chapter=3`, `?scene=platformer&chapter=4`, `?scene=puzzle&chapter=3`, and `?scene=puzzle&chapter=4`.
- Reset Case returns the player-facing Case Archive to Chapter 1 available only.
- Final verdict text remains unchanged.

## Part 42K Chapter 3-4 Expansion QA

- Chapter 3 no longer feels like only a short river crossing; it includes riverbank traversal, drifting paper movement, witness staging, required note pickup, and a post-witness archive-code path.
- Chapter 3 bridge-shadow, witness silhouette, archive-code mark, and archive-reference handoff are visible without external assets.
- Chapter 3 optional witness fragments remain in-memory only and include an archive-code corner clue.
- Chapter 3 checkpoints keep recovery short and the level remains calm, investigative, and enemy-free.
- Chapter 3 still routes through Chapter 3 VN, Deposition Order, and the Chapter 3 clue-filed reveal without changing saveVersion.
- Chapter 4 keeps the archive key/door route and adds clearer archive-code drawer, margin correction, file-spine, silver-key, and courthouse-index beats.
- Chapter 4 optional silver-key pickup uses the existing in-memory archive-key pickup path and does not add save data or a second required collectible.
- Chapter 4 has at least three checkpoints and avoids maze pressure, pixel hunting, enemies, or hard jumps.
- Chapter 4 still routes through Chapter 4 VN, Case File Sorting, and the Chapter 4 clue-filed reveal without changing saveVersion.
- Direct legacy dev routes for old Levels 4-5 and chapter dev routes for Chapters 3-4 remain available.
- Final verdict text, save schema, Case Archive progress, Chapters 1-2 geometry, and Chapters 5-6 geometry remain unchanged.

## Part 42L Chapter 5 Door Of Trust Expansion QA

- Chapter 5 no longer feels like a short flat courthouse route; it continues from courthouse choice doors into Trust door, lantern path, vertical ascent, and blue-ribbon pages.
- The silver-key-to-Trust-door continuity is visible before the lantern section.
- The lantern switch reveals the Chapter 5 lantern bridge and gives clear feedback without requiring color alone.
- Chapter 5 includes at least two wide, slow vertical elevators; the implemented route has three.
- Elevator landings are generous, no precision jumps are required, and missed jumps do not create long punishment loops.
- Checkpoints are available after the choice-door section, before the elevator ascent, and near the blue-ribbon payoff.
- Blue Ribbon / unfinished letter handoff is visible through hints, decorations, argument fragments, Trust Door Light Path success copy, VN, and the Chapter 5 clue-filed reveal.
- Chapter 5 still routes through `vn-chapter-5-intro`, old Level 6 platformer, one-line `vn-chapter-5-before-puzzle`, old Level 6 Trust Door Light Path, and the Chapter 5 clue-filed reveal.
- Completing Chapter 5 unlocks Chapter 6 through the existing old Level 8 bridge completion and does not mark `gameCompleted`.
- Direct legacy dev routes for old Levels 6-8 and chapter dev route `?scene=platformer&chapter=5` remain available.
- Final verdict text, saveVersion, Chapter 6 geometry, and external assets remain unchanged.

## Part 42M Chapter 6 Finale Traversal QA

- Chapter 6 no longer feels like a short right-walk finale; it continues from rooftops into clue memory markers, floating ascent, final court, heart seal, and final door.
- Prior clue memory markers are optional and readable: envelope/key/ticket, stamp/brick, witness note, marginal note/silver key, lantern/blue ribbon, and heart seal.
- Chapter 6 includes at least two wide, slow floating/elevator platforms; the implemented route has three.
- The floating ascent is slower/easier than Chapter 5, with generous static ledges and no precision jumps.
- Checkpoints cover the rooftop route and the final court approach; missed jumps do not create a long punishment loop.
- The final court and heart-seal payoff are visible before the final door.
- Chapter 6 still routes through `vn-chapter-6-intro`, old Level 9 platformer, one-line `vn-chapter-6-before-puzzle`, old Level 10 Final Seal, and then directly to FinalVerdictScene.
- Chapter 6 does not mark `gameCompleted` before Accept Verdict in FinalVerdictScene.
- Direct legacy dev routes for old Levels 9-10 and chapter dev route `?scene=platformer&chapter=6` remain available.
- Final verdict text, saveVersion, old Level 10 geometry, and external assets remain unchanged.

## Part 42N Six-Chapter Continuity Copy QA

- Active `vn-chapter-1-*` scenes clearly establish the envelope, brass key, tram ticket, and first route.
- Active `vn-chapter-2-*` scenes clearly connect tram ticket, golden stamp, hidden wall, brass key, and Vistula wave mark.
- Active `vn-chapter-3-*` scenes clearly connect Vistula, witness note, voluntary leaving, contradiction, and archive code.
- Active `vn-chapter-4-*` scenes clearly connect archive code, marginal correction "No. Given.", silver key, and courthouse handoff.
- Active `vn-chapter-5-*` scenes clearly connect silver key, Trust door, right question, lantern path, blue ribbon pages, and unfinished letter.
- Active `vn-chapter-6-*` scenes clearly connect unfinished letter, prior clues, final court, final clue, and verdict readiness without spoiling or expanding the approved verdict.
- Active puzzle instructions and success feedback support the same clue chain without changing mechanics.
- Evidence reveal copy uses "Clue filed." and never "Exhibit admitted."
- Active player-facing copy contains no "Tenth Exhibit", `M/10`, or old title language.
- FinalVerdictScene text remains exactly unchanged.

## Part 42O Full Six-Chapter Pacing QA Results

- Active player-facing flow remains six chapters only; old 10-level cards are not exposed in the Case Archive.
- Chapter duration metadata after Part 42O targeted a 20-28 minute run: 3-4m, 4-5m, 3.5-4.5m, 4-5m, 5-6m, and 5-6m. Part 44A supersedes this with a 10-15 minute final gift target while keeping platformer chapters authored and mechanically richer.
- Chapters 1-4 are no longer classified as tiny bridge fragments because each has expanded geometry, clue-object continuity, and appropriate checkpoint coverage.
- Chapter 5 retains the strongest middle-chapter mechanical identity with Trust doors, lantern reveal, three wide slow vertical elevators, blue-ribbon pages, and the unfinished-letter handoff.
- Chapter 6 retains ceremonial finale pacing with rooftops, prior clue memory markers, three wide slow floating platforms, final court, heart seal, and FinalVerdictScene handoff.
- Active VN scenes and puzzle success text support the final six-chapter clue chain without "Exhibit admitted", "Tenth Exhibit", `M/10`, or old title language.
- Save/progression remains on the documented bridge: `saveVersion = 1`, old level completion ids, and game completion only after Accept Verdict.
- Old dev/test routes and chapter dev routes remain available; dev editor/debug overlay remains dev/test-gated.
- Automated unit, build, and Playwright smoke coverage verify the chapter ladder, routing, final verdict boundary, reset/settings, and dev routes.
- Remaining manual release checks: one timed desktop production-build playthrough, one real-device mobile landscape playthrough focused on Chapter 5/6 elevators, and real-device drag/drop QA for active puzzles.

## Part 43 Visual Asset Planning QA

- `docs/visual-asset-prompt-plan.md` reflects the final expanded six-chapter game, not the old 10-level player-facing structure.
- Opening cinematic and main menu assets are planned without baked title, buttons, logos, or readable text.
- VN background plans exist for Chapters 1-6 and reserve UI-safe space for dialogue and portrait placeholders.
- Platformer motif plans exist for Chapters 1-6 and protect collision readability, especially Chapter 5 elevators and Chapter 6 floating ascent.
- Puzzle asset plans exist for all six active chapter puzzles and favor procedural/CSS/SVG where raster art is not needed.
- Clue icon bundles are organized by chapter and avoid text inside icons.
- Final court/verdict visual support is text-free and must not compete with the approved verdict.
- Browser asset budget, WebP optimization, scene-scoped loading, Vite base-path safety, and GitHub Pages constraints are documented.
- No image files, external assets, gameplay logic, VN text, puzzle mechanics, save/progression, or final verdict text are changed in this planning part.

## Part 49A-R2 Opening Cinematic Movie QA

- `Opening01.webp` through `Opening07.webp` exist in `public/assets/final/opening/`.
- Opening cinematic starts after the opening Start button.
- Opening cinematic displays the seven final WebP frames full-screen with cover scaling and no distortion.
- Cinematic captions are code-rendered, readable, and use the seven opening beat captions exactly once in order.
- Dialogue panels, speaker nameplates, title overlays, character cards, procedural placeholder panels, parchment boxes, and large controls do not appear over the frames.
- A small Skip affordance remains visible and works by pointer and keyboard where supported.
- Reduced-motion mode disables the subtle drift/zoom and keeps transitions simple.
- The final opening frame routes to the title/main menu.
- Desktop and mobile landscape have no document/body scroll during the cinematic.
- Asset URLs remain base-path-safe in dev and production preview.
- Main menu background, visual novel chapter images, platformer geometry, puzzle mechanics, final verdict text, and save/progression data remain unchanged.

## Part 49A-R3 Opening Caption QA

- Visible opening captions are:
  `Warsaw wakes quietly.`;
  `But some days arrive with a case.`;
  `One envelope waits where ordinary papers should be.`;
  `A key, a ticket, and a question.`;
  `Maria begins the day.`;
  `Maria takes her place at the desk.`;
  `The case file opens.`
- `The case file opens.` appears only once in the opening beat captions.
- Caption text remains readable over bright and dark frames on desktop and mobile landscape.
- Caption placement stays below the skip affordance and inside the viewport without page/body scroll.
- Captions fade gently in normal motion and remain simple in reduced-motion mode.
- Opening remains movie-style: no VN dialogue panel, speaker nameplate, character card, title/menu frame, or large Continue button.

## Part 49B Case File And First VN Image QA

- Open Case shows `CaseFileFrame01.webp` as the primary full-screen Case File visual.
- The old coded Case File paper/text/prompt is not visibly duplicated over the designed image.
- Enter and tap/click still advance from the Case File screen to `vn-chapter-1-intro`.
- `vn-chapter-1-intro` shows `FirstNovel01.webp`, then `FirstNovel02.webp`, then `FirstNovel03.webp`.
- Enter and tap/click advance each image-backed VN page.
- After `FirstNovel03.webp`, the scene routes to Chapter 1 platformer.
- The image-backed VN scene does not show the old coded dialogue card, speaker portrait/card, speaker nameplate, Skip button, Continue button, or duplicate visible text.
- Other VN scenes without image mappings still use the existing coded VN layout.
- Image-backed screens use contain scaling with no important baked text clipped on desktop or mobile landscape.
- Opening cinematic, main menu background, platformer geometry, puzzles, final verdict text, and save/progression remain unchanged.

## Part 49C Chapter 2 VN Image QA

- `vn-chapter-2-intro` shows `SecondNovel01.webp`, then `SecondNovel02.webp`, then `SecondNovel03.webp`.
- Enter and tap/click advance each Chapter 2 intro image-backed VN page.
- After `SecondNovel03.webp`, the scene routes to Chapter 2 platformer.
- `vn-chapter-2-before-puzzle` shows `HiddenWallPuzzleNovel01.webp` as a one-page image-backed VN scene.
- Enter and tap/click after `HiddenWallPuzzleNovel01.webp` route to the Chapter 2 Route Tile Puzzle / Hidden Wall puzzle.
- The image-backed Chapter 2 VN scenes do not show the old coded dialogue card, speaker portrait/card, speaker nameplate, Skip button, Continue button, or duplicate visible text.
- Other VN scenes without image mappings still use the existing coded VN layout.
- Image-backed Chapter 2 screens use contain scaling with no important baked title, counter, dialogue panel, or Continue label clipped on desktop or mobile landscape.
- Opening cinematic, Case File / First Novel screens, main menu background, platformer geometry, puzzles, final verdict text, and save/progression remain unchanged.

## Part 49D Chapter 3 And Chapter 4 Intro VN Image QA

- `vn-chapter-3-intro` shows `ThirdNovel01.webp`, then `ThirdNovel02.webp`, then `ThirdNovel03.webp`.
- Enter and tap/click advance each Chapter 3 intro image-backed VN page.
- After `ThirdNovel03.webp`, the scene routes to Chapter 3 platformer.
- `vn-chapter-4-intro` shows `ForthNovel01.webp`, then `ForthNovel02.webp`, then `ForthNovel03.webp`.
- Enter and tap/click advance each Chapter 4 intro image-backed VN page.
- After `ForthNovel03.webp`, the scene routes to Chapter 4 platformer.
- The image-backed Chapter 3 and Chapter 4 intro VN scenes do not show the old coded dialogue card, speaker portrait/card, speaker nameplate, Skip button, Continue button, or duplicate visible text.
- Other VN scenes without image mappings still use the existing coded VN layout.
- Image-backed Chapter 3 and Chapter 4 intro screens use contain scaling with no important baked title, counter, dialogue panel, or Continue label clipped on desktop or mobile landscape.
- Opening cinematic, Case File / First Novel screens, Second Novel / Hidden Wall screens, main menu background, platformer geometry, puzzles, final verdict text, and save/progression remain unchanged.

## Part 49E Chapter 4 Pre-Puzzle And Chapter 5 Intro VN Image QA

- `vn-chapter-4-before-puzzle` shows `MarginalNotePuzzleNovel01.webp` as a one-page image-backed VN scene.
- Enter and tap/click after `MarginalNotePuzzleNovel01.webp` route to the Chapter 4 Case File Sorting puzzle.
- `vn-chapter-5-intro` shows `FifthNovel01.webp`, then `FifthNovel02.webp`, then `FifthNovel03.webp`.
- Enter and tap/click advance each Chapter 5 intro image-backed VN page.
- After `FifthNovel03.webp`, the scene routes to Chapter 5 platformer.
- The image-backed Chapter 4 pre-puzzle and Chapter 5 intro VN scenes do not show the old coded dialogue card, speaker portrait/card, speaker nameplate, Skip button, Continue button, or duplicate visible text.
- Other VN scenes without image mappings still use the existing coded VN layout.
- Image-backed Chapter 4 pre-puzzle and Chapter 5 intro screens use contain scaling with no important baked title, counter, dialogue panel, or Continue label clipped on desktop or mobile landscape.
- Opening cinematic, Case File / earlier VN image screens, main menu background, platformer geometry, puzzles, final verdict text, and save/progression remain unchanged.

## Part 42F Chapter 5-6 Active Flow Checks

- Case Archive Chapter 5 launches `vn-chapter-5-intro`, then old Level 6 platformer, Chapter 5 pre-puzzle VN, old Level 6 Trust Door Light Path, Chapter 5 post-puzzle VN, and a Chapter 5 clue-filed reveal.
- Completing Chapter 5 marks the old Level 8 bridge completion and unlocks Chapter 6 without changing `saveVersion`.
- Chapter 5 reveal says the blue ribbon releases an unfinished letter above the rooftops.
- Case Archive Chapter 6 launches `vn-chapter-6-intro`, then old Level 9 platformer, Chapter 6 pre-puzzle VN, old Level 10 Final Seal, Chapter 6 post-puzzle VN, and FinalVerdictScene.
- Chapter 6 does not use a normal EvidenceRevealScene; the final puzzle/VN leads to the verdict.
- Accept Verdict still marks `gameCompleted` and displays `Case closed. Love confirmed.`
- Replay Finale, Case Archive, Credits, and Back to Title still work from the accepted verdict state.
- Direct legacy dev routes still work for old Levels 6-10 platformer, puzzle, and VN routes.
- Chapter bridge dev routes work for `?scene=platformer&chapter=5`, `?scene=platformer&chapter=6`, `?scene=puzzle&chapter=5`, and `?scene=puzzle&chapter=6`.
- Final verdict text remains exactly unchanged.

## Mobile Launch Checks

- App loads on mobile browser.
- Landscape layout is usable.
- Touch interactions trigger scene transitions.
- No essential text is too small.

## Mobile No-Scroll Full-Screen Checks

- Opening start screen fills the viewport and has no document/page scroll.
- Opening cinematic fills the viewport and has no document/page scroll.
- Main menu has no document/page scroll.
- Settings panel and reset confirmation keep close/cancel/confirm buttons visible without document/page scroll.
- Case Archive shows exactly 6 chapters in a compact full-screen layout on mobile landscape with no document/page scroll.
- VN scenes use a full-screen game layout, keep Continue/Skip visible, and do not create document/page scroll.
- Active puzzle scenes keep board, tray, feedback, and action buttons within the viewport with no document/page scroll.
- Platformer gameplay does not pan or scroll the browser page while moving, jumping, or using touch controls.
- Evidence/clue reveal remains a Phaser full-screen scene with no document/page scroll.
- FinalVerdictScene keeps the approved verdict text and Accept Verdict button visible with no document/page scroll.
- Credits fit in the viewport with no document/page scroll; future longer credits should use a contained panel or pagination, not body scroll.
- Browser resize and mobile landscape emulation do not create horizontal overflow.
- Dev editor/debug overlay may scroll internally, but it must remain dev/test-only and must not affect player-facing no-scroll behavior.

## Mobile Puzzle Full-Screen Checks

- Open each active chapter puzzle on an iPhone landscape emulator: Chapter 1 Case Mosaic, Chapter 2 Route Tile Puzzle, Chapter 3 Deposition Order, Chapter 4 Case File Sorting, Chapter 5 Trust Door Light Path, and Chapter 6 Final Seal.
- The browser document has no page scroll and no horizontal overflow on every puzzle route.
- The puzzle shell, board, tray/items, feedback, Reset, and Submit/primary action are visible inside the viewport.
- Chapter 1 shows all six mosaic slots, all six envelope pieces, Reset, File Clue, progress, and feedback without scrolling.
- Chapter 2 shows all six route tiles, the route story markers, Vistula wave payoff, Reset, File Clue, progress, and feedback without scrolling.
- Chapter 3 keeps the witness note, tools, statement strips, Reset/Submit controls, and feedback visible and tappable.
- Chapter 4 keeps the archive page, marked margin zones, magnifier/bookmark tools, Silver Key, Reset/File Clue controls, and feedback visible and tappable.
- Chapter 5 keeps question tiles, question slot, doors, silver key, Reset/Submit controls, and feedback visible and tappable.
- Chapter 6 keeps all three seal rings, all six clue lights, Reset/Unlock controls, and feedback accessible without page scroll.
- Drag/drop remains usable where practical, and tap-to-place fallback can complete the puzzle on touch screens.

## Part 44E Chapter 5 Simplified Door Of Trust Puzzle QA

- Active Chapter 5 puzzle shows `Trust Door Light Path`.
- The puzzle is solvable in about 30-45 seconds by placing `What remains when things are difficult?` and using the Silver Key on `Trust`.
- Wrong question or key-before-question attempts give gentle feedback and do not solve.
- The Silver Key cannot solve on Doubt or Fear.
- Success copy includes the Trust door opening, lantern-lit pages, blue ribbon, and unfinished letter.
- No separate Lantern Sequence or Argument Tower solve is required in the active Chapter 5 flow.
- Tap fallback completes the puzzle on mobile landscape; drag/drop remains usable where practical.
- Chapter 5 puzzle success routes to the concise Chapter 5 clue reveal and unlocks Chapter 6 through the existing bridge without marking `gameCompleted`.
- Old Level 7 Lantern Sequence and old Level 8 Argument Tower dev/source routes remain available.

## Puzzle Responsive QA

- Desktop 1366x768: Case Mosaic is not a tiny centered card; the panel uses the available viewport generously.
- Desktop 1920x1080: active puzzle panels remain centered and readable without absurd stretching.
- Desktop and mobile landscape both keep Reset and Submit/primary action buttons visible without page scroll.
- Board, tray/items, progress, feedback, and action footer remain inside the puzzle shell on browser resize.
- Chapter 1 Case Mosaic specifically shows all six slots, all six pieces, tray, progress, and action buttons on desktop and mobile landscape.
- Final Seal specifically keeps all three seal rings and six clue lights accessible on desktop and mobile landscape.
- Drag/drop and tap fallback still work after resizing.

## Landscape/Portrait Checks

- Landscape shows the game frame comfortably.
- Portrait shows rotate prompt or a clear fallback.
- Orientation changes do not crash Phaser.

## Keyboard Checks

- Enter advances from title and case file.
- Level 1 supports ArrowLeft/A, ArrowRight/D, Space/ArrowUp/W, R restart, M mute toggle, and Escape pause/resume.
- Movement controls must stay forgiving and remappable if needed.

## Touch Checks

- Tap advances from title and case file.
- Level 1 shows large left, right, and jump touch controls.
- Touch controls should allow holding movement while tapping jump.
- No puzzle relies on hover.

## Level 1 Vertical Slice Checks

- Player can move left and right.
- Player can jump onto wide platforms.
- Falling below the office platforms respawns at spawn or checkpoint.
- Midpoint checkpoint activates.
- The Sealed Envelope can be collected.
- Exit refuses completion before the envelope is collected.
- Exit transitions to the Level 1 Case Mosaic PuzzleScene after the envelope is collected.

## Level 2 Platformer Checks

- Level 2 remains locked before Level 1 completion.
- Level 2 becomes playable from Level Select after Level 1 completion.
- Level 2 shows The Tram of Deadlines scene status.
- Moving tram platforms move slowly and predictably between endpoints.
- Moving platforms reverse cleanly and do not require precision timing.
- Falling respawns at spawn or checkpoint.
- The Golden Stamp can be collected.
- Exit refuses completion before The Golden Stamp is collected.
- Exit transitions to PuzzleScene level 2.
- PuzzleScene level 2 is the Case Timeline puzzle.

## Level 2 Case Timeline Checks

- Case Timeline puzzle shows "Case Timeline: The Golden Stamp."
- Puzzle looks like a tram/timeline board, not a list-ordering form.
- Timeline shows four stops: Start, Review, Prepare, and Submit.
- Tray shows four task tiles: Read the Case, Check the Evidence, Prepare the Note, Submit Before Deadline.
- Tapping a task and then a stop places/snaps the task into that stop.
- Tapping a placed task picks it back up for moving.
- Dragging a task from the tray to a stop places/snaps the task into that stop.
- Dragging a placed task to another stop moves or swaps it safely.
- Dropping outside the timeline/tray returns safely without duplicating or losing the task.
- Dragging a placed task back to the tray returns it to the tray.
- Placing into an occupied stop swaps or replaces safely.
- Reset Timeline returns all tasks to the scrambled tray and clears the timeline.
- Progress shows placed and in-order task counts.
- Submitting before completing the timeline gives "The case is not ready to stamp yet."
- Submitting a complete but wrong timeline gives "The case is not ready to stamp yet."
- Correct sequence Read -> Check -> Prepare -> Submit shows "The schedule is sealed."
- Correct sequence shows route glow/stamp success feedback or equivalent schedule-sealed feedback.
- Correct order transitions to evidence reveal.
- Evidence reveal displays "Maria carries responsibility with grace."
- Continuing from reveal marks Level 2 completed.
- Level 3 appears as the next playable clue after Part 7.
- Levels 4-10 remain locked.
- The puzzle does not feel like a stressful deadline simulator and does not require dragging, typing, timers, score, legal trivia, or tiny targets.

## Legacy Level 2 Calendar-Sequence Checks

- The old calendar-sequence module is archived legacy code, not an active runtime route.
- Direct registry resolution of `calendar-sequence` falls back to the unsupported placeholder path.

## Level 3 Platformer Checks

- Level 3 remains locked before Level 2 completion.
- Level 3 becomes playable from Level Select after Level 2 completion.
- Level 3 shows The Rebuilt Street scene status.
- Rebuild triggers are easy to notice and activate.
- Rebuilt platforms become visibly solid and stay active after checkpoint respawns.
- Rebuilt platforms do not trap Maria or create low collision ceilings.
- Two checkpoints activate and respawn correctly.
- The Red Brick can be collected.
- Exit refuses completion before The Red Brick is collected.
- Exit transitions to PuzzleScene level 3.
- PuzzleScene level 3 is the Rebuild Puzzle.

## Level 3 Rebuild Puzzle Checks

- Rebuild Puzzle shows "Rebuild Puzzle: The Red Brick."
- Rebuild Puzzle shows six large repair pieces and a 3x2 frame.
- Dragging a brick piece to a slot snaps it into place.
- Tap-to-select and tap-slot fallback still works.
- Rotate button and `R` shortcut rotate selected pieces through 0/90/180/270.
- Wrong rotation or wrong arrangement gives "The path is close, but some pieces still need care."
- Correct arrangement shows "The street is restored."
- Correct arrangement transitions to evidence reveal.
- Evidence reveal displays "Strong things are built patiently, piece by piece."
- Continuing from reveal marks Level 3 completed.
- Level 4 appears as the next playable clue after Level 3 completion.
- Drag/touch interaction is forgiving and does not require pixel-perfect placement.
- The puzzle does not require tiny pieces, typing, timers, score, or legal trivia.

## Level 4 Platformer Checks

- Level 4 remains locked before Level 3 completion.
- Level 4 becomes playable from Level Select after Level 3 completion.
- Level 4 shows The Vistula Deposition scene status.
- Drifting paper platforms move slowly and predictably.
- Drifting platforms do not require precision timing or create low collision gaps.
- Optional witness-note fragments can be collected without affecting progression.
- Two checkpoints activate and respawn correctly.
- The Witness Note can be collected.
- Exit refuses completion before The Witness Note is collected.
- Exit transitions to PuzzleScene level 4.
- PuzzleScene level 4 is the Deposition Order puzzle.
- Level 5 remains locked or coming soon, not playable.

## Level 4 Deposition Order Puzzle Checks

- Deposition Order puzzle shows `Deposition Order: The Witness Note`.
- Deposition Order puzzle shows four large statement strips and four note-line slots.
- Final Chapter 3 puzzle art assets are detected: `puzzle03-deposition-bg.webp`, `puzzle03-witness-note-paper.webp`, and `puzzle03-statement-strip-shell.webp`.
- The final background is decorative only and does not interfere with the board, actions, or progress/status areas.
- The witness-note paper sits behind the line slots and archive-code area without obscuring code-rendered labels or slot content.
- The statement strip shell mapping remains available for future use, but the current build intentionally bypasses the shell image and uses CSS-rendered parchment strips for a cleaner final presentation.
- The CSS-rendered strips should feel integrated with the witness note, with no bright pasted-on card look in the tray, note slots, or drag ghost.
- Selected strips visibly lift/glow, the drag ghost remains bright and readable, and valid/drop-hover note lines show a clear gold response.
- In mobile landscape, all four tray strips remain visible, readable, and tappable without document scroll.
- Statement text remains readable on desktop and mobile landscape; no statement text is baked or duplicated by the art layer.
- Tapping a strip then a note-line slot places it as the primary fallback.
- Optional drag/drop can place strips, but precision dragging is not required.
- Drag/drop shows selected, drop-hover, placed, and correct states over the final art layers.
- Wrong or missing order gives `The statement does not read clearly yet.`
- Correct order reveals archive code `16/05-MARGIN`.
- Correct answer shows `The witness statement is restored.`
- Correct answer transitions to evidence reveal.
- Evidence reveal displays "Maria hears the quiet version of truth."
- Continuing from reveal marks Level 4 completed.
- Level 5 appears as the next playable clue after Part 11.
- Levels 6-10 remain locked.
- The puzzle does not require legal trivia, typing, tiny text, timers, score, or trick answers.

## Level 5 Platformer Checks

- Level 5 remains locked before Level 4 completion.
- Level 5 becomes playable from Level Select after Level 4 completion.
- Level 5 shows The Archive of Tiny Details scene status.
- Archive key is easy to find before the locked aisle.
- Locked archive door blocks the main route until the key is collected.
- Door opens clearly and does not trap Maria.
- Optional tiny-detail notes can be collected without affecting progression.
- Two checkpoints activate and respawn correctly.
- The Marginal Note can be collected.
- Exit refuses completion before The Marginal Note is collected.
- Exit transitions to PuzzleScene level 5.
- PuzzleScene level 5 is the Case File Sorting puzzle.
- Level 6 remains locked or coming soon, not playable.

## Level 5 Case File Sorting Checks

- Case File Sorting shows `Case File Sorting: No. Given.`
- Archive document cards, file slots, correction reveal, Silver Key, and action buttons are visible and large enough for touch.
- Future Chapter 4 puzzle art assets are mapped as optional decorative layers: `puzzle04-case-file-bg.webp`, `puzzle04-archive-file-board.webp`, `puzzle04-document-card-shell.webp`, and `puzzle04-silver-key.webp`.
- Missing Chapter 4 final puzzle art assets fall back to the existing CSS-rendered archive/file presentation without broken images or changed hitboxes.
- If final assets are present, the archive board image sits behind the file slots and the Silver Key image sits inside the existing key button target; the document card shell resolver may remain available but active presentation should use clean CSS parchment cards if the generated shell hurts readability.
- Document titles, labels, roman numerals, slot labels, correction text, buttons, and progress/status text remain code-rendered and readable.
- Final Chapter 4 asset QA should confirm the background and archive-board art improve the legal archive mood without obscuring slots or labels.
- Final Chapter 4 asset QA should confirm the document shell art remains behind code-rendered text, appears in the drag ghost, and does not reduce desktop or mobile readability.
- Final Chapter 4 asset QA should confirm the document cards do not read as bright pasted image cards, card text remains readable on mobile landscape, and the Silver Key image remains inside the existing key button/action. The current key source has a light baked background, so transparent-background regeneration remains preferred if the blend treatment still reads as a square.
- Tapping a document then a file slot places it as the primary fallback.
- Optional drag/drop can place documents, but precision dragging is not required.
- The active puzzle uses five document cards, not hidden tiny details or a bookmark checklist.
- The correction reveal displays `No. Given.` after the file is sorted in the correct order.
- The Silver Key appears only after the correction is visible.
- Tapping the Silver Key is required before filing the clue.
- Reset clears revealed zones, correction state, and Silver Key state.
- Incomplete attempts give `The correction is not complete yet.`
- Pressing File Clue before taking the key asks the player to take the Silver Key.
- Correct completion transitions to evidence reveal.
- Evidence reveal displays the Chapter 4 clue handoff: `Small details change the charge.` and the Courthouse of Echoes next clue.
- Continuing from reveal marks Level 5 completed.
- Level 6 appears as the next playable clue after Part 13.
- Levels 7-10 remain locked.
- The puzzle does not require private memories, typing, precise pixel hunting, timers, or score penalties.

## Level 6 Platformer Checks

- Level 6 remains locked before Level 5 completion.
- Level 6 becomes playable from Level Select after Level 5 completion.
- Level 6 shows The Courthouse of Echoes scene status.
- Door labels include Doubt, Fear, Distance, Hope, and Trust.
- Hope and Trust move Maria forward.
- Doubt, Fear, and Distance loop safely without resetting the whole level.
- Wrong doors do not remove The Silver Key if already collected.
- Optional echo fragments can be collected without affecting progression.
- Two checkpoints activate and respawn correctly.
- The Silver Key can be collected.
- Exit refuses completion before The Silver Key is collected.
- Exit transitions to PuzzleScene level 6.
- PuzzleScene level 6 is the Trust Door Light Path puzzle.
- Level 7 remains locked or coming soon, not playable.

## Level 6 Trust Door Light Path Checks

- Trust Door Light Path shows the correct question, lantern source, three mirror/sigil controls, and Trust door target.
- Choosing a wrong question gives gentle feedback and does not activate the light.
- Choosing "What remains when things are difficult?" wakes the lantern.
- Tapping mirrors/sigils rotates the light path without requiring drag precision.
- If final assets are present, the decorative background and trust board sit behind the live grid, mirrors, endpoints, and dynamic light beam without obscuring mirror state.
- If final assets are present, the lantern/source and Trust-door/target images stay inside the existing endpoint elements and do not replace the endpoint state targets.
- Question text, mirror labels, progress text, Reset Light, and File Clue remain code-rendered, readable, and tappable on desktop and mobile landscape.
- With final assets present, mobile landscape keeps the Trust board, question tiles, payoff card, compact progress strip, Reset Light, File Clue, and feedback visible without page/body scroll.
- The light path starts incomplete and only solves when it reaches Trust.
- Reset clears the selected question and mirror rotations.
- Wrong or incomplete state gives either "The echo has not found the right question yet." or "The light has not reached Trust yet."
- Correct completion shows "The Trust door opens." and the blue-ribbon/unfinished-letter payoff, then transitions to evidence reveal.
- Evidence reveal displays "Real love is proven by choosing each other again."
- Continuing from reveal marks Level 6 completed.
- Level 7 appears as the next playable clue after Part 15.
- Levels 8-10 remain locked.
- The puzzle does not require legal trivia, typing, precise dragging, timers, or trick questions.

## Level 7 Platformer Checks

- Level 7 remains locked before Level 6 completion.
- Level 7 becomes playable from Level Select after Level 6 completion.
- Level 7 shows The Garden of Quiet Evidence scene status.
- Lantern switches are easy to notice and activate.
- Activating each lantern reveals its matching bridge or warm step.
- Revealed platforms stay solid during the current run.
- Lantern logic does not rely on color only; labels and platform visibility change too.
- Optional quiet evidence fragments can be collected without affecting progression.
- At least one checkpoint activates and respawns correctly.
- The Lantern can be collected.
- Exit refuses completion before The Lantern is collected.
- Exit transitions to PuzzleScene level 7.
- PuzzleScene level 7 is the Lantern Sequence puzzle.

## Level 7 Lantern Sequence Puzzle Checks

- Lantern Sequence shows "Lantern Sequence: The Lantern."
- Flame token and four large labeled lantern drop targets are visible.
- Dragging the flame token to a lantern inputs that lantern.
- Tapping lanterns in order works as fallback.
- Show Pattern displays the North, East, South, East sequence without fast flashing.
- Progress indicator updates from 0 / 4 through the sequence.
- Wrong input gives "The lights fade gently. Try the pattern again."
- Correct sequence shows "The garden answers softly."
- Solving transitions to EvidenceRevealScene level 7.
- Evidence reveal displays "Maria is warmth, calm, and home."
- Continuing from reveal marks Level 7 completed.
- Level 8 appears as the next playable clue after Part 17.
- Levels 9-10 remain locked.
- The puzzle does not use timers, score penalties, color-only memory, audio dependency, typing, or stressful speed.

## Level 8 Platformer Checks

- Level 8 remains locked before Level 7 completion.
- Level 8 becomes playable from Level Select after Level 7 completion.
- Level 8 shows The Tower of Arguments scene status.
- Camera follows the vertical ascent without trapping the player off-screen.
- At least three elevator platforms move slowly and predictably.
- Elevator platforms are wide enough for mobile-friendly landings.
- Falling does not create a long punishment loop; checkpoints provide recovery.
- Two checkpoints activate and respawn correctly.
- Optional argument fragments can be collected without affecting progression.
- The Blue Ribbon can be collected.
- Exit refuses completion before The Blue Ribbon is collected.
- Exit transitions to PuzzleScene level 8.
- PuzzleScene level 8 is the Argument Tower puzzle.

## Level 8 Argument Tower Puzzle Checks

- Argument Tower shows "Argument Tower: The Blue Ribbon."
- Tower frame shows Foundation, Support Left, Support Right, and Top slots.
- Tray shows Evidence, Patience, Showing Up, Promise, Words Only, and Coincidence blocks.
- Dragging a block to a tower slot snaps it into place.
- Tapping a block and then a slot works as fallback.
- Wrong blocks can occupy a slot but do not stabilize it.
- Reset clears the tower and restores the tray.
- Wrong or incomplete towers give "The tower does not stand on the strongest evidence yet."
- Correct answer shows "Argument accepted."
- Correct answer transitions to evidence reveal.
- Evidence reveal displays "The strongest argument is not spoken once. It is lived."
- Continuing from reveal marks Level 8 completed.
- Level 9 appears as the next playable clue after Part 19.
- Level 10 remains locked until Level 9 is completed.
- The puzzle does not require legal trivia, typing, timers, score, or physics precision.

## Level 9 Platformer Checks

- Level 9 remains locked before Level 8 completion.
- Level 9 becomes playable from Level Select after Level 8 completion.
- Level 9 shows The Rooftops Before the Verdict scene status.
- The route reuses moving platforms, rebuild triggers, and lantern reveal platforms.
- Reused mechanics appear one at a time and do not create confusing overlaps.
- Moving rooftop platforms are slow, wide, and predictable.
- Rebuild trigger reveals a rooftop bridge and does not trap Maria.
- Lantern switches reveal their matching light paths and do not rely on color only.
- Three checkpoints activate and respawn correctly.
- The Unfinished Letter can be collected.
- Exit refuses completion before The Unfinished Letter is collected.
- Exit transitions to PuzzleScene level 9.
- PuzzleScene level 9 is the Case Constellation puzzle.
- Level 10 remains locked until the Level 9 puzzle is completed.

## Level 9 Case Constellation Puzzle Checks

- Case Constellation shows "Case Constellation: The Unfinished Letter."
- Night-sky board shows clue stars and meaning nodes around the unfinished letter.
- Dragging a star near a meaning node snaps it into that node.
- Tapping a star and then a node works as fallback.
- Wrong star/node pairs remain visible but do not light the correct line.
- Reset clears the constellation.
- Wrong or incomplete constellations give "Some clues do not point to the right truth yet."
- Correct constellation shows "The letter is complete."
- Correct completion transitions to EvidenceRevealScene level 9.
- Evidence reveal displays the Level 9 clue-filed reveal and points Maria toward the final court.
- Continuing from reveal marks Level 9 completed.
- Level 10 appears as the playable finale platformer.
- The final verdict is not shown yet.
- The puzzle does not require line drawing, typing, timers, tiny UI, or private memories.

## Level 10 Finale Platformer Checks

- Level 10 remains locked before Level 9 completion.
- Level 10 becomes playable from Level Select after Level 9 completion.
- Level 10 shows The Court of the Heart scene status.
- The route feels ceremonial and easier than Level 9.
- Familiar moving, rebuild, and lantern reveal mechanics appear gently and do not create an exam-like difficulty spike.
- Previous-clue memory markers are optional, readable, and do not affect save/progression.
- Two checkpoints activate and respawn correctly.
- The Heart Seal can be collected.
- Exit refuses completion before The Heart Seal is collected.
- Exit transitions to PuzzleScene level 10.
- PuzzleScene level 10 is the Final Seal puzzle.
- Dev route `?scene=platformer&level=10` opens the level in development/test mode.
- Dev editor grid, bounds, labels, nudge/resize, and override persistence work for Level 10 objects.

## Level 10 Final Seal Checks

- Final Seal shows "Final Seal: The Court of the Heart."
- Seal board shows three large tap-rotated rings and six clue lights.
- Tapping a ring rotates it by one quarter turn.
- The active clue marks are Envelope, Wall, Witness, Correction, Trust, and Heart.
- If final assets are present, the decorative background and seal board sit behind the live rings, rays, clue lights, and dynamic solved states without obscuring ring labels.
- If final assets are present, the heart-core image stays inside the existing core element and does not replace ring, clue-light, or Unlock Verdict state targets.
- Ring labels, clue lights, progress text, Reset Seal, Unlock Verdict, and final-verdict routing remain code-rendered, readable, and tappable on desktop and mobile landscape.
- With final assets present, confirm the board art remains subdued enough that the live ring outlines, ring numbers, solved glow, and all six clue-light states are still readable.
- With final assets present, confirm the final verdict text appears only after solving the seal, `gameCompleted` remains false before Accept Verdict, and `Case closed. Love confirmed.` appears only after acceptance.
- Incomplete seal gives "The seal is not complete yet."
- Correct seal gives "The final seal closes. The verdict is ready."
- Correct completion transitions to FinalVerdictScene, not EvidenceRevealScene.
- The puzzle does not require typing, timers, penalties, tiny controls, or private memories.

## Final Verdict Checks

- FinalVerdictScene displays the approved verdict text exactly.
- Accept Verdict marks Level 10 completed.
- Accept Verdict marks the game completed.
- "Case closed. Love confirmed." appears after accepting the verdict.
- Replay Finale starts Level 10 again.
- Level Select shows a gentle game-completed state such as "Verdict Accepted. Case Closed."
- Level 10 appears as Completed / Replay Finale.
- Credits are accessible from the final completion options.
- Credits mention Made with love by Alper, For Maria, the project title, and that no final external art/audio assets were added yet.

## Level 1 Case Mosaic Checks

- Level 1 puzzle shows "Case Mosaic: The Sealed Envelope."
- Puzzle feels like rebuilding the first clue, not a passive clue confirmation.
- All six envelope pieces are visible and accessible.
- All six 3x2 board slots are visible and accessible.
- Tap fallback works: tap piece, tap slot.
- Optional drag/drop works where practical.
- Reset returns all pieces to the tray.
- Progress shows placed and aligned counts.
- Submitting before the envelope is whole gives "The envelope is not whole yet."
- Correct interaction shows "The first clue is restored."
- Correct solution shows the restored envelope and clue-restored feedback.
- Correct completion transitions to EvidenceRevealScene level 1.
- Evidence reveal displays "Maria notices what others miss."
- Continuing from reveal marks Level 1 completed and unlocks Level 2.
- The puzzle does not require drag-only input, typing, timers, score, legal trivia, or tiny targets.

## Level 3 Route Tile Hidden Wall Checks

- Level 3 puzzle route shows "Route Tile Puzzle: The Hidden Wall."
- Puzzle feels like connecting the stamped route, not tapping a keyhole confirmation.
- All six route tiles are visible and large enough to tap.
- Tapping a route tile rotates it by 90 degrees.
- Locked start/target tiles do not rotate.
- The route must connect Stamped Ticket -> Golden Stamp -> Keyhole -> Hidden Wall -> Wave Mark.
- Reset restores the initial disconnected route.
- Submitting before the route reaches the wall gives "The route has not reached the wall yet."
- Correct interaction shows "The wall remembers the river."
- Correct solution reveals the Vistula wave mark.
- Correct completion transitions to Chapter 2 EvidenceRevealScene.
- Evidence reveal displays "Responsibility and patience reveal the path."
- The puzzle does not require dragging, typing, timers, score, legal trivia, or tiny targets.

## Legacy Level 1 Document-Ordering Checks

- The old document-ordering module is archived legacy code, not an active runtime route.
- Direct registry resolution of `document-ordering` falls back to the unsupported placeholder path.

## Save/Load Checks

- Default save is created.
- Corrupted localStorage does not crash.
- Missing localStorage does not crash.
- Completed and unlocked levels persist once progression is integrated.
- Partial localStorage save data normalizes safely.
- Invalid level IDs are ignored or clamped safely.
- Returning after Level 1 completion shows progress-aware title UI.
- Level 1 can be replayed from the Case File Index.
- Completed levels can be replayed from the Case File Index.
- The next implemented platformer appears only after the previous real puzzle completion.
- Accepting the final verdict persists Level 10 completion and `gameCompleted`.
- Old saves without `gameCompleted` normalize safely with `gameCompleted` false.
- Reset Case requires confirmation before clearing progress.

## Settings Checks

- Mute persists after reload.
- Reduce Motion persists after reload.
- Settings can be opened from TitleScene.
- Settings changes do not require a full page reload.

## Content Proofreading Checks

- Maria is portrayed as capable, respected, warm, and heroic.
- Polish subtitle displays correctly.
- Legal language is playful and elegant.
- Final verdict text remains exact.

## Accessibility Checks

- Critical UI text has an accessible equivalent.
- Reduced-motion setting is respected once animations exist.
- Puzzles avoid color-only information.
- Touch targets are large enough.

## Performance Checks

- App boots quickly.
- No expensive effects are added without testing.
- Asset sizes are audited before release.

## Developer Level Tuning Overlay Checks

- Normal production-style play does not show the debug overlay.
- `?scene=platformer&level=5` opens Level 5 directly in dev/test mode.
- `?scene=platformer&level=8&checkpoint=2` starts near checkpoint 2 without changing saved progress.
- `?scene=platformer&level=8&spawn=x:1450,y:260` starts at that world coordinate without changing saved progress.
- F1 shows and hides the DEV LEVEL TUNING panel.
- G toggles the 32px world grid.
- H toggles object bounds.
- P toggles object labels.
- Moving the player updates player x/y in the panel.
- Moving the pointer updates pointer x/y in the panel.
- C copies the current player coordinate JSON.
- Shift+C copies the current pointer coordinate JSON.
- Clicking a platform selects it and highlights it.
- Arrow keys nudge a selected platform by 1px.
- Shift+Arrow nudges a selected object by 10px.
- Alt+Arrow nudges a selected object by one 32px grid step.
- J copies selected object JSON and T copies a TypeScript-like snippet.
- E copies the current debug registry as a TypeScript-like export.
- Hiding the overlay leaves normal keyboard and touch gameplay usable.
- Select a static platform, nudge it, press S, reload, and verify the moved position persists from `dev-level-overrides/level-N.json`.
- Select a static platform, resize width with Ctrl/Cmd+ArrowRight, resize height with Ctrl/Cmd+ArrowDown, and verify visual bounds and collision size update immediately.
- Save the resized static platform with S, reload, and verify width/height persist from `dev-level-overrides/level-N.json`.
- Select a moving platform or elevator, nudge it, verify its whole path shifts and it keeps moving predictably.
- Save the moving platform override, reload, and verify its current position and movement anchors remain shifted.
- Select a moving platform or elevator, resize width, verify it still moves on the same path, save it, reload, and verify resized dimensions persist.
- Press Shift+S after multiple nudges and verify all dirty debug objects are saved.
- Press Shift+D on a selected saved override, reload, and verify the object returns to source geometry.
- Confirm invalid dev override endpoint payloads do not write files.
- Confirm production build has no visible overlay and no filesystem write behavior.

## Birthday Gift Emotional QA Checks

- The game feels personal without exposing private content unintentionally.
- Difficulty never distracts from the gift.
- Humor is affectionate, not at Maria's expense.
- The final twist feels sincere rather than gimmicky.

## Part 23 Full-Game QA Pass

- Automated coverage should verify all 10 puzzle routes, Level Select progression, final verdict acceptance, credits, settings persistence, and reset confirmation.
- Unit coverage should verify all puzzle logic modules, PuzzleRegistry mappings, LevelAvailability, GameFlow, platformer geometry, SaveManager corrupted/partial saves, and dev editor override helpers.
- Production build should keep the dev override middleware disabled and the debug overlay hidden unless running dev/test mode.
- The approved final verdict text must remain unchanged.
- Polish subtitle and opening case punctuation should render correctly as `Sprawa Zaginionego Serca`, `Case No. 16/05`, and readable em dashes.
- Current automated QA does not replace a hands-on full playthrough on physical mobile hardware; verify touch controls, landscape layout, and late-level platform reachability manually before deployment.
- Release-readiness findings live in `docs/release-readiness-report.md`.

## Part 24 Visual/Audio Polish Checks

- Title screen feels like a polished birthday case file and shows `Open the Case` / `Continue Case` clearly.
- Title, Case File, Evidence Reveal, Final Verdict, Credits, Settings, and Level Select panels remain readable on desktop and mobile landscape.
- Puzzle panels keep large cards/buttons, clear focus states, and no drag-only or tiny interactions.
- Platformer checkpoints, clues, and case doors are visually easier to identify without changing progression rules.
- Procedural WebAudio tones unlock only after user interaction and never require external files.
- Mute setting disables procedural tones and persists after reload.
- No autoplay music, copyrighted audio, external sprites, private photos, voice, or personal memories are introduced.
- CREDITS.md and in-game credits state that sound effects are generated in code and no external art/audio assets were added.
- Final verdict text remains exactly approved.
- Production build does not show the dev overlay by default; dev routes and override persistence still work in dev/test.
- Manual mobile QA should confirm final verdict text, Level Select rows, puzzle panels, and touch controls are comfortable on the target device.

## Part 25 Deployment And Release Package Checks

- `npm run preview` exists and serves the built `dist/` output.
- `VITE_BASE_PATH` is documented for root hosting and GitHub Pages subpaths.
- `docs/deployment-guide.md` covers GitHub Pages, Vercel, Netlify, and itch.io HTML5 ZIP deployment.
- `docs/final-release-checklist.md` exists and can be followed by a non-Codex release pass.
- `dist/index.html` exists after build and bundled assets are present.
- Production preview loads the title screen.
- Production preview does not show the dev level editor by default.
- F1 does not open the dev level editor in production preview.
- Dev query routes and `?completeLevel` helpers do not change production progress.
- The `/__dev/level-overrides/` write endpoint is not available in production preview.
- CREDITS.md accurately states that no external final art/audio assets are included.
- Privacy review confirms no photos, voice, personal addresses, work secrets, API keys, or local machine paths are exposed in production UI.
- GitHub Pages workflow, if used, is run manually and uses the correct `base_path`.
- Vercel and Netlify use `dist` as the output/publish directory.
- itch.io ZIP contains the contents of `dist/` with `index.html` at ZIP root.
- Real desktop and phone share-link smoke tests are completed before sending the gift link.

## Part 26 Case Mosaic Redesign Checks

- `case-mosaic` resolves through PuzzleRegistry.
- Level 1 routes to Case Mosaic.
- Levels 2-10 continue using existing puzzle behavior until their conversion parts.
- Case Mosaic logic prevents a piece from existing in two slots at once.
- Case Mosaic logic supports piece selection, placement, replacement, swap, removal, reset, progress, incomplete state, wrong state, and solved state.
- Current progress is shown as text, not only color.
- The solved board visibly restores a procedural clue image.
- Board slots and tray pieces remain large enough on mobile landscape.
- Save/progression remains unchanged; completion still happens through EvidenceRevealScene.

## Manual Case Mosaic QA

- Open `?scene=puzzle&level=1`.
- Confirm the puzzle looks like a visual mosaic, not a matching form.
- Select a piece.
- Place it into a slot.
- Drag a piece from the tray to a slot.
- Drag a placed piece between slots.
- Drop a dragged piece outside the board and confirm it returns safely.
- Drag a placed piece back to the tray.
- Swap two pieces.
- Reset the board.
- Complete the correct envelope.
- Confirm success glow/stamp.
- Confirm reveal appears.
- Confirm Level 1 completion/unlock still works.
- Confirm mobile landscape layout is readable.
- Confirm touch placement works.

## Manual Case Timeline QA

- Open `?scene=puzzle&level=2`.
- Confirm the puzzle looks like a tram/timeline board, not a form.
- Select a task.
- Place it into a timeline stop.
- Drag a task from the tray to a stop.
- Drag a placed task between stops.
- Drop a dragged task outside the timeline and confirm it returns safely.
- Drag a placed task back to the tray.
- Swap two tasks.
- Reset the timeline.
- Complete the correct Read -> Check -> Prepare -> Submit sequence.
- Confirm route glow/stamp success feedback.
- Confirm reveal appears.
- Confirm Level 2 completion/unlock still works.
- Confirm mobile landscape layout is readable.
- Confirm touch placement works.

## Manual Level 7-10 Redesigned Puzzle QA

- Open `?scene=puzzle&level=7`, drag the flame to lanterns, confirm tap fallback, wrong input fade, Show Pattern, and correct North -> East -> South -> East solve.
- Open `?scene=puzzle&level=8`, drag blocks into tower slots, confirm wrong blocks look unstable, tap fallback works, reset works, and correct Evidence / Patience / Showing Up / Promise structure solves.
- Open `?scene=puzzle&level=9`, drag clue stars to meaning nodes, confirm wrong pairs stay visible without solving, tap fallback works, reset works, and all eight correct placements solve.
- Open `?scene=puzzle&level=10`, tap-rotate final seal rings, confirm incomplete feedback, reset works, correct alignment unlocks FinalVerdictScene, Accept Verdict persists game completion.
- On mobile landscape, confirm all four redesigned puzzle layouts remain readable and touch drag does not require pixel-perfect drops.

## Part 31 Full Redesigned Puzzle QA

- PuzzleRegistry maps the retained redesigned puzzle types to implemented registrations for active chapter wrappers and legacy dev/test routes.
- Retired puzzle types resolve to the unsupported placeholder path rather than old form-like UIs.
- Direct dev/test routes `?scene=puzzle&level=1` through `?scene=puzzle&level=10` open the redesigned puzzle for that level.
- Each redesigned puzzle supports drag/drop as the primary interaction where relevant and tap fallback for completion.
- Each redesigned puzzle has large targets, reset behavior, wrong/incomplete feedback, and success feedback.
- Level 10 Final Seal routes to FinalVerdictScene, and `gameCompleted` is set only after Accept Verdict.
- Automated Playwright smoke covers all 10 redesigned puzzle routes on desktop and mobile-landscape projects; real-device drag QA remains a manual release check.

## Part 32 Visual Novel QA

- Normal new-case flow shows the Level 1 intro VN after the opening case file and before PlatformerScene level 1.
- Level 1 platformer completion shows the pre-puzzle VN before Case Mosaic.
- Level 1 Case Mosaic success shows the post-puzzle VN before EvidenceRevealScene level 1.
- Continue advances VN lines with button click, text-panel click, Enter, and Space.
- Skip moves to the same target scene without marking progress.
- VN text remains readable on desktop and mobile landscape.
- Direct dev/test route `?scene=platformer&level=1` still opens the platformer directly.
- Direct dev/test route `?scene=puzzle&level=1` still opens the puzzle directly.
- Dev/test routes `?scene=vn&id=vn-level-1-intro`, `?scene=vn&id=vn-level-1-before-puzzle`, and `?scene=vn&id=vn-level-1-after-puzzle` open the expected VN scenes.
- Level 1 completion/unlock still happens from EvidenceRevealScene, not from VN.
- VN scenes do not add external assets, private content, photos, voice, music, or final art.

## Part 33 Level 2-5 Visual Novel QA

- Level 2 intro VN appears from Level Select before The Tram of Deadlines.
- Level 3 intro VN appears from Level Select before The Rebuilt Street.
- Level 4 intro VN appears from Level Select before The Vistula Deposition.
- Level 5 intro VN appears from Level Select before The Archive of Tiny Details.
- Levels 2-5 platformer completion shows the matching before-puzzle VN before the redesigned puzzle.
- Levels 2-5 puzzle completion shows the matching after-puzzle VN before EvidenceRevealScene.
- Continue and Skip work on all Level 2-5 VN scenes.
- Text remains short and readable on desktop and mobile landscape.
- Direct dev/test routes `?scene=platformer&level=2` through `?scene=platformer&level=5` still bypass VN.
- Direct dev/test routes `?scene=puzzle&level=2` through `?scene=puzzle&level=5` still bypass VN.
- Dev/test VN routes such as `?scene=vn&id=vn-level-2-intro` and `?scene=vn&id=vn-level-5-before-puzzle` open the expected VN scenes.
- Level 2-5 completion/unlock still happens from EvidenceRevealScene, not from VN.

## Part 34 Level 6-10 Visual Novel QA

- Level 6 intro VN appears from Level Select before The Courthouse of Echoes.
- Level 7 intro VN appears from Level Select before The Garden of Quiet Evidence.
- Level 8 intro VN appears from Level Select before The Tower of Arguments.
- Level 9 intro VN appears from Level Select before The Rooftops Before the Verdict.
- Level 10 intro VN appears from Level Select before The Court of the Heart.
- Levels 6-10 platformer completion shows the matching before-puzzle VN before the redesigned puzzle.
- Levels 6-9 puzzle completion shows the matching after-puzzle VN before EvidenceRevealScene.
- Level 10 Final Seal completion shows `vn-level-10-after-puzzle` before FinalVerdictScene.
- Continue and Skip work on all Level 6-10 VN scenes.
- Text remains short and readable on desktop and mobile landscape.
- Direct dev/test routes `?scene=platformer&level=6` through `?scene=platformer&level=10` still bypass VN.
- Direct dev/test routes `?scene=puzzle&level=6` through `?scene=puzzle&level=10` still bypass before-puzzle VN.
- Dev/test VN routes such as `?scene=vn&id=vn-level-6-intro` and `?scene=vn&id=vn-level-10-after-puzzle` open the expected VN scenes.
- Level 6-9 completion/unlock still happens from EvidenceRevealScene, not from VN.
- Level 10 game completion still happens only after Accept Verdict in FinalVerdictScene.
- Approved final verdict text is unchanged.

## Part 35 Visual Novel Pacing QA

- All VN scene IDs are unique.
- Each Level 1-10 has before-platformer, before-puzzle, and after-puzzle VN scenes.
- Every VN line has a non-empty approved speaker and concise text.
- Dialogue lines stay short enough for mobile landscape; current automated guardrail is 110 characters per line.
- Continue works from the button and dialogue card.
- Enter and Space advance VN lines.
- Skip goes to the same target scene without marking completion.
- Text remains instant; reduceMotion state is recorded on the VN overlay and no typewriter animation is active yet.
- Short-height mobile landscape view keeps the VN panel, buttons, speaker, and line counter readable without covering platformer touch controls.
- Level 10 after-puzzle VN remains ceremonial and routes to FinalVerdictScene.
- FinalVerdictScene still displays the approved verdict text unchanged.
- VN scenes remain stateless and do not alter saveVersion, completed levels, unlocked levels, or gameCompleted.
- Direct dev/test routes for platformer, puzzle, and VN scenes still work.

## Part 36 Visual Novel Presentation QA

- VN dev routes show a procedural active speaker portrait placeholder.
- Maria, Case File, Narrator, and Secret Client resolve to known placeholders; unknown speakers use a safe default.
- VN scenes derive the expected background variant from their level unless an explicit background is provided.
- Portraits are CSS/procedural only; no real photos, generated character art, external assets, voice, or music are added.
- Active speaker chip and portrait styling agree with the current line speaker.
- Continue and Skip still work from button, keyboard, touch, and dialogue card.
- Mobile landscape keeps the portrait stage compact enough that dialogue remains readable.
- Short-height landscape can shrink the portrait stage without covering text or buttons.
- Reduce Motion disables the small panel-entry animation.
- Level 10 after-puzzle VN still routes to FinalVerdictScene, and the approved final verdict text remains unchanged.

## Part 37 Visual Asset And Performance QA

- `docs/visual-style-guide.md`, `docs/asset-budget.md`, and `docs/asset-replacement-plan.md` exist and are reviewed before adding final assets.
- Production build size is checked after every major asset batch.
- Initial load stays under the documented 5-10 MB target where practical.
- Full game asset total stays under the documented 30-50 MB target unless intentionally approved.
- Large backgrounds are resized and compressed, preferably WebP.
- No huge raw PNG files are committed to the player package.
- No WAV audio is shipped in production.
- No uncredited external art, fonts, music, or sound effects are present.
- No private photos, private messages, voice recordings, addresses, work secrets, or personal sensitive materials are included.
- Maria likeness/portrait assets are not used publicly without explicit consent and privacy review.
- GitHub Pages `VITE_BASE_PATH` is checked for project-page subpaths.
- Production preview loads all assets without 404s.
- Dev editor/debug overlay remains production-gated.
- Optional final assets have procedural or graceful fallback visuals where practical.
- Mobile landscape is checked after replacing any UI, VN, puzzle, or platformer visual category.

## Part 38 Procedural Visual Polish QA

- Title screen loads with procedural case papers, legal seal motif, and city-light details without external images.
- CaseFileScene, CreditsScene, EvidenceRevealScene, and FinalVerdictScene remain readable after added procedural motifs.
- Approved FinalVerdictScene text is unchanged.
- Level Select, settings, VN, puzzle, and menu buttons keep large tap targets and visible focus/hover states.
- Platformer clue pickups are visually distinct for all 10 clues and still collect normally.
- Platformer level motifs do not hide hazards, platforms, exits, checkpoints, or touch controls.
- Puzzle boards for Levels 1-10 remain readable after frame/glow polish, and drag/drop/tap fallback still works.
- VN portrait placeholders and dialogue panels stay readable in mobile landscape and short-height landscape.
- Reduce Motion remains acceptable; no new heavy animation is required to understand the UI.
- Dev editor/debug overlay remains dev/test-only and readable.
- Production build contains no new external images, audio, fonts, or heavy dependencies.
- Automated visual snapshot tests are not introduced in Part 38; existing Playwright smoke verifies boot, VN, puzzle, flow, and final verdict routes, while subjective visual polish remains a manual QA check.

## Evidence Reveal And Final Verdict Presentation QA

- EvidenceRevealScene opens with a ceremonial clue-filed certificate layout.
- Reveal screen displays the clue name, emotional reveal, optional follow-up, and Continue affordance.
- Continuing once from EvidenceRevealScene marks the level complete and shows the filed-case state.
- Continuing again returns to Level Select without changing unrelated save data.
- Reveal text remains readable on desktop and mobile landscape.
- Level-specific reveal accents remain subtle and do not overpower the text.
- FinalVerdictScene displays the approved final verdict text unchanged.
- Accept Verdict marks `gameCompleted` and shows `Case closed. Love confirmed.`
- Replay Finale, Level Select, Credits, and Back to Title buttons still work after accepting.
- Final verdict document fits without page scroll; if future copy ever outgrows the viewport, use a contained in-panel or paginated scene solution.
- No external images, private photos, voice, music, or new heavy dependencies are added for the reveal/verdict presentation.

## Secondary Menu Presentation QA

- Level Select opens as a Case Archive, not a plain list/grid.
- Completed levels show a clear admitted/replay state.
- Current playable levels show a clear burgundy/gold play/next state.
- Locked or coming-soon levels remain readable but visibly sealed/disabled.
- Game-completed save shows the `Verdict Accepted. Case Closed.` marker.
- Replay buttons for completed levels still start the intended level/VN flow.
- Settings panel opens from the title menu and keeps Mute and Reduce Motion toggles tappable.
- Mute and Reduce Motion settings persist after toggling.
- Reset confirmation remains clear, requires explicit confirmation, and Cancel closes it safely.
- Credits screen shows only current approved credits/content and no invented asset claims.
- Back/Level Select/Credits navigation buttons still work.
- Mobile landscape keeps Level Select and Credits inside the full-screen scene; future longer credits should use a contained panel or pagination instead of page scroll.

## Global Icon, Badge, And Chip QA

- Main menu buttons show consistent procedural icons and no duplicated old pseudo-icon marks.
- Level Select clue chips show the correct icon for each of the 10 clues.
- Completed, playable, locked, and coming-soon status chips have distinct icon/state treatments.
- Settings mute, sound, reduce-motion, close, reset, and cancel controls keep readable icons and labels.
- VN speaker chips show the expected speaker icon and remain readable in mobile landscape.
- VN Continue/Skip icons do not crowd the dialogue buttons.
- Credits and final verdict action buttons use the shared icon style.
- Unknown icon/speaker/status fallbacks remain safe and do not break rendering.
- Icons are CSS/procedural only; no external icon library, raster icon file, or heavy dependency is added.
- Chips remain readable and do not reduce mobile tap targets.

## Full Visual Consistency QA

- Title, CaseFileScene, VN, platformer, puzzle, evidence reveal, final verdict, Level Select, Settings, Reset confirmation, and Credits all use the main-menu art direction.
- No player-facing fallback screen says old build-scaffolding phrases such as `placeholder`, `future part`, or `Part 6`.
- Decorative case-number chrome uses `16/05` sparingly and does not reintroduce `M/10`.
- Buttons keep consistent primary, secondary, disabled, and reset/danger treatments.
- Panels/cards use navy, parchment, burgundy, antique gold trim, and warm shadows consistently.
- VN background variants stay inside the shared palette and do not drift into random purple/cyan prototype tones.
- Platformer HUD labels use themed chip-like backing and remain readable without covering play.
- Puzzle fallback/unavailable screens read like sealed case files instead of development placeholders.
- Dev/debug overlays remain readable but intentionally utilitarian and production-gated.
- FinalVerdictScene text remains exactly unchanged.
- Mobile landscape remains usable for main menu, VN, one puzzle, Level Select, and FinalVerdictScene.

## Opening Cinematic QA

- Normal boot opens `OpeningStartScene`, not the full title menu.
- Start button launches `OpeningCinematicScene`.
- Cinematic auto-plays without requiring clicks for each beat.
- Beat captions remain concise and readable on desktop and mobile landscape.
- Skip button works from the cinematic and lands cleanly on the title menu.
- Enter/Escape skip behavior does not corrupt save/progression.
- Reduced Motion uses simplified timing/motion and still reaches the title menu.
- Cinematic ends in the law office/desk beat with Maria seated before menu reveal.
- Returning to title from in-game routes opens the normal title menu directly.
- Dev/test routes for platformer, puzzle, VN, level select, and final verdict still bypass the opening.
- No video file, music, voice, private photos, external images, or heavy assets are added for the opening.

## Part 40 Connected Clue-Trail Narrative QA

- Opening case file uses the missing-heart setup, 10 hidden clues, and "Do not trust the loudest answer."
- VN scenes for Levels 1-10 form one continuous trail from envelope to final court.
- Every level has before-platformer, before-puzzle, and after-puzzle VN scenes with concise mobile-safe lines.
- VN post-puzzle scenes use "Clue filed." or "Final clue filed." instead of old admitted wording.
- Puzzle titles, instructions, wrong/incomplete feedback, and success feedback support the connected clue trail without changing mechanics.
- Level Select and UI labels use Case Archive, Next Clue, Clue filed, and clue language in player-facing copy.
- Player-facing copy does not reintroduce the old title, old Polish subtitle, old case-number chrome, or museum/exhibition language.
- FinalVerdictScene text remains exactly unchanged.
- Save/progression schema, puzzle routes, platformer geometry, and final completion flow remain unchanged.

## Part 41 Visual Clue-Chain Continuity QA

- `src/content/clueChain.ts` has entries for Levels 1-10.
- Levels 1-9 have next clue names, next locations, next hints, next labels, and visual motifs.
- Level 10 has no next clue and keeps the verdict handoff.
- EvidenceRevealScene displays the filed clue, solved meaning, and a compact next-clue panel for Levels 1-9.
- EvidenceRevealScene does not route Level 10 or change the final verdict text.
- Puzzle success feedback adds one concise next-clue line without changing answer validation or solved-state logic.
- Level Select lead hints remain brief and do not clutter mobile landscape.
- Save/progression schema, platformer geometry, VN flow, and final completion flow remain unchanged.

## Part 42G Six-Chapter Legacy Cleanup QA

- Case Archive shows exactly 6 chapter cards and no old 10-level player-facing grid.
- Progress text uses `/6 chapters closed`, not `/10`.
- Chapter 1 is playable by default.
- Chapter 2 unlocks after Chapter 1 bridge completion; Chapter 6 unlocks after Chapter 5 bridge completion.
- Chapter 6 puzzle/VN reaches FinalVerdictScene, and Accept Verdict still marks `gameCompleted`.
- FinalVerdictScene text remains exactly unchanged.
- Old dev/test routes remain intentionally available: `?scene=platformer&level=10`, `?scene=puzzle&level=7`, and `?scene=vn&id=vn-level-10-after-puzzle`.
- Chapter dev/test routes remain available: `?scene=platformer&chapter=6` and `?scene=puzzle&chapter=6`.
- Save data still uses `saveVersion = 1`; reset returns to the Chapter 1 baseline.
- Dev editor/debug overlay still appears only on dev/test platformer routes and remains production-gated.
- Legacy old-level modules are retained only as bridge/dev/source material and are not exposed in normal player UI.

## Part 42H Full Six-Chapter QA Results

- Active player-facing navigation uses `Case Archive` language and shows exactly 6 chapter cards.
- Chapter unlock smoke now covers the bridge ladder from Chapter 1 through Chapter 6 using old completion ids.
- Chapter route smoke covers all six chapter cards: Chapter 1, Chapter 2, Chapters 3-5, and Chapter 6 finale approach.
- Chapter 1 starts through chapter VN, then retained old Level 1 platformer runtime.
- Chapter 6 opens through chapter VN, reaches the retained final puzzle, then routes directly to FinalVerdictScene.
- Accept Verdict still marks `gameCompleted`; Credits and Case Archive navigation still work after acceptance.
- Reset still returns to the Chapter 1 baseline while settings persistence remains covered.
- Retained old dev routes remain intentionally available for old platformer, puzzle, and VN ids, and chapter dev routes remain available.
- Dev debug overlay smoke remains covered on retained old platformer routes.
- Player-facing stale `Level Select` / `Case File Index` prompts were cleaned to `Case Archive`.
- FinalVerdictScene text remains exactly unchanged.
- No platformer geometry, puzzle rules, save schema, external assets, or final verdict copy were changed in this QA pass.
- Remaining manual release checks: one timed human desktop playthrough, real-device mobile landscape drag/tap QA, and subjective pacing review for Chapter 5/6 safe hybrids.

## Part 44A Final 10-15 Minute Scope QA

- Full first playthrough target is 10-15 minutes, including opening, six chapters, puzzles/interactions, reveals, and final verdict.
- Platformer chapters should feel richer than a few jumps and an exit; the time cut should come from VN, puzzle, and reveal friction.
- Opening cinematic target is 20-30 seconds and remains skippable.
- Chapter 1 target is 1.5-2 minutes total, with 60-90 seconds of platforming.
- Chapter 2 target is 2-2.5 minutes total, with 90-120 seconds of platforming.
- Chapter 3 target is 1.5-2 minutes total, with 75-105 seconds of platforming.
- Chapter 4 target is 2-2.5 minutes total, with 90-120 seconds of platforming.
- Chapter 5 target is 2.5-3 minutes total, with 105-135 seconds of platforming and retained trust/lantern/elevator beats.
- Chapter 6 target is 2.5-3 minutes total, with 105-135 seconds of platforming and a fast 20-40 second final seal puzzle.
- Real-puzzle candidates now active: Chapter 1 Case Mosaic, Chapter 2 Route Tile Puzzle, Chapter 3 Deposition Order, Chapter 4 Case File Sorting, Chapter 5 Trust Door Light Path, and Chapter 6 Final Seal.
- Simplification candidates: Chapter 6 Final Verdict Assembly, plus any Chapter 5 light-path readability issues found on real devices.
- VN pacing target: one short intro per chapter, optional 1-2 line pre-puzzle setup, and most after-puzzle VN content merged into clue reveal.
- Clue reveals should stay concise and should not repeat a full after-puzzle VN scene.
- FinalVerdictScene text remains exactly unchanged.
- Final scope QA must include one timed desktop playthrough and one real-device mobile landscape playthrough after Parts 44B-44F.

## Part 44B Final Seal QA

- Chapter 6 active puzzle shows `Final Seal: The Court of the Heart`.
- Active final puzzle uses three tap-rotated seal rings that light Envelope, Wall, Witness, Correction, Trust, and Heart.
- Active pre-verdict player-facing content does not say `The Heart, Freely Given`.
- No active Chapter 6 puzzle flow requires ten ordered fragments.
- Seal starts unaligned and unsolved; aligning one ring lights two clue marks.
- Incomplete seal gives `The seal is not complete yet.`
- Correct three-ring seal gives `The final seal closes.` and `The verdict is ready.`
- Reset returns all rings to their initial rotations.
- Tap-to-rotate completion works on desktop and mobile landscape.
- Unlock Verdict button stays visible on desktop and mobile landscape.
- Chapter 6 puzzle success routes directly to FinalVerdictScene.
- Puzzle success does not mark `gameCompleted`.
- Accept Verdict in FinalVerdictScene marks `gameCompleted`.
- Final verdict text remains exactly unchanged.

## Part 44C VN And Reveal Compression QA

- Active chapter intro VN scenes are no more than three concise lines.
- Active pre-puzzle VN scenes are no more than one line where retained.
- Active Chapter 1 and Chapter 3 skip pre-puzzle VN and open their puzzles directly after platformer completion.
- Active Chapters 1-5 route puzzle success directly to concise clue reveals.
- Active Chapter 6 routes final-seal success directly to FinalVerdictScene.
- Retained `vn-chapter-*-after-puzzle` scenes are still targetable by dev routes and stay short.
- Clue reveal copy is concise and does not duplicate a full after-puzzle VN scene.
- FinalVerdictScene text remains exactly unchanged.

## Part 44D Platformer Pacing And Feel QA

- Active chapter duration metadata matches the 10-15 minute target: Chapters 1/3 1.5-2m, Chapters 2/4 2-2.5m, Chapters 5/6 2.5-3m.
- Chapter 1 still feels like a complete tutorial chapter with route-awakening handoff and two checkpoints.
- Chapter 2 tram platforms are wide/slow enough for mobile landscape, and stamp/keyhole/wall/Vistula continuity remains clear.
- Chapter 3 drifting-paper platforms are wider/slower and keep the witness-note/archive-code path calm.
- Chapter 4 sliding drawer and archive gate route remain readable, with marginal-note and silver-key clarity intact.
- Chapter 5 elevators are wide, slow, predictable, and supported by checkpoints before and after the vertical/ribbon section.
- Chapter 6 floating platforms are wider/slower than Chapter 5, and the pre-ascent checkpoint respawns near the floating court climb.
- No active platformer introduces precision jumps, blind jumps, long fall punishment, or required moving-platform timing spikes.
- Old level and chapter dev routes still load, and the dev editor/debug overlay remains available in dev/test mode.
- Final verdict text, saveVersion, puzzle mechanics, VN routing, and external asset policy remain unchanged.

## Part 46A-R2 Structural Platformer Rebuild QA

- Play every active chapter platformer from the Case Archive and from chapter dev routes.
- Chapter 1 should feel like a law-office route: lower desk traversal, bookcase/file-shelf climb, upper shelf crossing, descent to desk, envelope/key/ticket destination, and no difficult timing.
- Chapter 2 should feel like a tram route into a hidden-wall set piece: moving tram, elevated route sign, rebuilt street climb, wide slow wall lift, upper wall crossing, descent, keyhole/wave-mark destination.
- Chapter 3 should feel like river/bridge investigation: drifting papers, upper bridge beam, descent into bridge shadow, witness-note destination, archive-code exit path, and calm timing.
- Chapter 4 should feel like an archive route: lower aisle, shelf climb, upper stacks, drawer/lift beat, lower file aisle descent, marginal-note/file-spine climb, Silver Key/courthouse handoff.
- Chapter 5 should feel like the strongest platformer chapter but still forgiving: Trust balcony, lantern descent, wide slow elevators, blue-ribbon pages, unfinished-letter destination, and short checkpoint recovery.
- Chapter 6 should feel like climbing rooftops into the final court: lower rooftop climb, rebuilt bridge, clue memory descent, wide floating ascent, final court, heart seal, and final door.
- Confirm no active chapter is only a straight rightward route; each should include at least one up/down or direction-change beat and at least two authored traversal beats.
- Confirm checkpoints are on stable ground and appear before/after demanding traversal, not on moving platforms.
- Confirm the Chapter 2 wall lift, Chapter 5 elevators, and Chapter 6 floating lifts are slow, wide, predictable, and do not require precise touch timing.
- On mobile landscape, confirm touch controls do not cover required clue destinations and the camera keeps upcoming landings visible during vertical sections.
- Confirm platformer exits still route to the existing active puzzle for the chapter and do not change save/progression or final verdict behavior.
- Remaining manual release checks: one timed desktop platformer pass and one real-device mobile landscape platformer pass, especially Chapters 5 and 6.

## Part 46B Full Platformer Playtest And Pacing QA

- Chapter 1 classification: good tutorial route. Verify the office/kancelaria shelf climb, safe descent, supported envelope/case-file destination, and Case Mosaic transition still feel clear within roughly 75-105 seconds.
- Chapter 2 classification: good after small tuning. Verify the tram platforms now feel calmer at mobile speed, the rebuilt-street climb and hidden-wall lift are readable, the keyhole/wave destination is supported, and the Route Tile Puzzle transition works.
- Chapter 3 classification: good calm investigation route. Verify the drifting papers remain forgiving, bridge upper/lower travel is understandable, the Witness Note/archive-code destination is supported, and the Deposition Order transition works.
- Chapter 4 classification: good exploratory archive route. Verify the shelf/file-cabinet climb, drawer/lift descent, marginal-note/Silver Key destination, and Case File Sorting transition remain clear without becoming maze-like.
- Chapter 5 classification: good but highest mobile-risk chapter. Verify Trust route, lantern descent, three elevator ascent, blue-ribbon/unfinished-letter payoff, checkpoints, and Trust Door Light Path transition on desktop and mobile landscape.
- Chapter 6 classification: good ceremonial finale route. Verify the rooftop climb feels like real climbing, the clue-memory balcony and floating court ascent are readable, final court/heart seal support is clear, and Final Seal transition works without `gameCompleted`.
- Across all chapters, verify every required clue/interactable, checkpoint respawn, and exit has static support beneath or adjacent and is reachable with touch controls.
- Across all moving/elevator platforms, verify width, speed, landing space, and camera framing remain forgiving; focus on Chapter 2 trams, Chapter 3 drifting papers, Chapter 4 drawer lift, Chapter 5 elevators, and Chapter 6 floating court elevators.
- Automated coverage now checks the six active routes as a set for pacing metadata, vertical route markers, exit/checkpoint support, and moving-platform forgiveness.
- Real-device manual QA still required before sharing: one timed desktop platformer pass and one iPhone Safari / Android Chrome landscape pass, with special attention to Chapter 5 elevator feel and Chapter 6 rooftop/floating ascent feel.

## Part 46A-1 Chapter 1 Platformer Support QA

- Chapter 1 starts safely on the lower office desk and does not require immediate precision jumping.
- Chapter 1 includes the intended office traversal: lower desk route, paper/file-stack steps, bookcase/file-shelf climb, upper shelf crossing, safe shelf descent, final case-file desk, glowing route ledge, and case-door exit.
- The Sealed Envelope required clue is reachable and has a safe standing platform beneath or adjacent to it.
- The Chapter 1 case-door exit is reachable and has a safe standing platform beneath or adjacent to it.
- Checkpoint respawns are on stable static ground, not inside/under platforms and not too close to an edge.
- The midpoint checkpoint does not skip the required clue, and the final checkpoint still leaves the sealed envelope ahead of the player.
- Chapter 1 has meaningful verticality and does not feel like a simple rightward hallway.
- No Chapter 1 jump is blind, tiny, or precision-heavy; mobile landscape touch controls should be enough for the shelf climb and final route ledges.
- Chapter 1 exits to `Case Mosaic: The Sealed Envelope`; the puzzle, save/progression schema, Chapters 2-6, and final verdict text remain unchanged.

## Part 46A-2 Chapter 2 Platformer Support QA

- Chapter 2 starts safely on the tram/city path and does not require immediate precision jumping.
- Chapter 2 includes the intended hidden-wall traversal: forgiving moving tram platforms, elevated route-sign path, supported golden-stamp ledge, rebuilt street scaffold climb, supported keyhole/hidden-wall floor, slow wall lift, upper wall crossing, descent, Vistula wave-mark ledge, and case-door exit.
- The Golden Stamp, keyhole/hidden wall trigger, red-brick marker, Vistula wave marker, checkpoints, and Chapter 2 case-door exit are reachable and have safe standing platforms beneath or adjacent to them.
- Chapter 2 includes at least two stable checkpoints: after the tram/moving platform beat and before/at the rebuilt wall climb, with respawns on static ground.
- Moving tram platforms and the hidden-wall lift are wide, slow, predictable, and forgiving for mobile landscape touch controls.
- Chapter 2 is not a simple horizontal path; the player moves right, climbs, changes elevation, rides the wall lift, crosses an upper path, and descends into the clue destination.
- No unsupported required interactables, impossible jumps, blind jumps, fast timing sections, or long punishment loops are present.
- Chapter 2 final exit still routes through the active `Route Tile Puzzle: The Hidden Wall` bridge without changing save/progression, Chapter 1, Chapters 3-6, puzzle mechanics, or final verdict text.

## Part 46A-3 Chapter 3 Platformer Support QA

- Chapter 3 starts safely on the lower Vistula riverbank and does not require immediate precision jumping.
- Chapter 3 includes the intended river/bridge traversal: slow drifting-paper platforms, bridge footing, bridge climb, upper bridge beam, high overpass, underpass descent, bridge-shadow witness floor, supported Witness Note ledge, archive-code step, final riverbank, and case-door exit.
- The Witness Note, archive-code corner, witness silhouette, archive-code marker, checkpoints, and Chapter 3 case-door exit are reachable and have safe standing platforms beneath or adjacent to them.
- Chapter 3 includes at least two stable checkpoints, with the current active route using three static-ground respawns: after the bridge climb, at the witness-shadow floor, and before the final archive-reference bank.
- Drifting/floating paper platforms are wide, slow, predictable, and forgiving for mobile landscape touch controls.
- Chapter 3 is not a simple horizontal path; the player crosses the river, climbs to the bridge, crosses above, descends under the bridge, and then climbs gently toward the archive-code handoff.
- No unsupported required interactables, impossible jumps, blind jumps, fast timing sections, or long punishment loops are present.
- Chapter 3 final exit still routes through the active `Deposition Order: The Witness Note` bridge without changing save/progression, Chapters 1-2, Chapters 4-6, puzzle mechanics, or final verdict text.

## Part 46A-4 Chapter 4 Platformer Support QA

- Chapter 4 starts safely in the lower archive aisle and does not require immediate precision jumping.
- Chapter 4 includes the intended archive traversal: lower file aisle, archive-code drawer, vertical file-cabinet climb, upper archive path, retained archive-key/locked-door beat, drawer gate ledge, slow drawer lift, lower correction aisle, marginal-note ledge, file-spine step, Silver Key landing, courthouse-index desk, and case-door exit.
- The Marginal Note, archive key, locked archive door, `No. Given.` correction note, file-spine Silver Key note, Silver Key pickup, checkpoints, and Chapter 4 case-door exit are reachable and have safe standing platforms beneath or adjacent to them.
- Chapter 4 includes at least two stable checkpoints, with the current active route using three static-ground respawns: on the upper archive path, in the correction aisle, and by the Silver Key landing.
- The drawer/lift beat is wide, slow, predictable, and forgiving for mobile landscape touch controls.
- Chapter 4 is not a simple horizontal path or confusing maze; the player moves right, climbs shelves, crosses the upper archive, descends into correction, then climbs to the marginal-note/file-spine clue destination.
- No unsupported required interactables, impossible jumps, blind jumps, fast timing sections, or long punishment loops are present.
- Chapter 4 final exit still routes through the active `Case File Sorting: No. Given.` bridge without changing save/progression, Chapters 1-3, Chapters 5-6, puzzle mechanics, or final verdict text.

## Part 46A-5 Chapter 5 Platformer Support QA

- Chapter 5 starts safely in the lower courthouse corridor and does not require immediate precision jumping.
- Chapter 5 includes the intended courthouse/trust traversal: lower corridor, column climb, Hope/Trust choice-door spine, supported Silver Key ledge, Trust threshold, lantern descent, lantern switch, revealed light bridge, elevator waiting ledge, three wide slow vertical elevators, upper ribbon pages, unfinished-letter ledge, and case-door exit.
- The Silver Key, Trust door, lantern switch, lantern-pages fragment, Blue Ribbon / unfinished-letter fragment, checkpoints, and Chapter 5 case-door exit are reachable and have safe standing platforms beneath or adjacent to them.
- Chapter 5 includes at least three stable checkpoints, with the current active route using four static-ground respawns: after the first correct door, at Trust, before the elevator ascent, and by the ribbon/letter destination.
- Elevators are wide, slow, predictable, and forgiving for mobile landscape touch controls; respawns stay on static ledges rather than moving platforms.
- Chapter 5 is not a simple horizontal path or confusing maze; the player moves through courthouse doors, descends into lantern light, then rises through a vertical court/page ascent to the blue-ribbon payoff.
- No unsupported required interactables, impossible jumps, blind jumps, fast timing sections, or long punishment loops are present.
- Chapter 5 final exit still routes through the active `Trust Door Light Path` bridge without changing save/progression, Chapters 1-4, Chapter 6, puzzle mechanics, or final verdict text.

## Part 46A-6 Chapter 6 Platformer Support QA

- Chapter 6 starts safely on the lower rooftops and does not require immediate precision jumping.
- Chapter 6 includes the intended finale traversal: lower rooftop start, parapet/chimney climb, upper skyline path, rebuilt rooftop bridge, safe roof-gap descent, rooftop lantern route, Unfinished Letter ledge, clue-memory balcony, floating court ascent, final court landing, heart seal platform, and final door.
- The Unfinished Letter, rooftop rebuild trigger, rooftop lanterns, clue memory markers, heart seal, final door aura, checkpoints, and Chapter 6 final door are reachable and have safe standing platforms beneath or adjacent to them.
- Chapter 6 includes at least three stable checkpoints, with the current active route using four static-ground respawns: after the first rooftop climb, after the roof-gap descent, before the floating court ascent, and at the final court.
- Floating/elevator platforms are wide, slow, predictable, and easier than Chapter 5; respawns stay on static ledges rather than moving platforms.
- Chapter 6 is not a simple horizontal path; the player climbs rooftops, crosses the skyline, descends briefly, gathers clue memories, then rises ceremonially into the final court.
- No unsupported required interactables, impossible jumps, blind jumps, hard timing sections, stressful final challenge, or long punishment loops are present.
- Chapter 6 final exit still routes through the active `Final Seal: The Court of the Heart` bridge, FinalVerdictScene remains reachable, and `gameCompleted` remains tied only to Accept Verdict.

## Part 44F Mobile Browser QA And Responsive Polish

- Desktop browser smoke: verify opening, Case Archive, puzzles, final verdict, and credits at 1366x768, 1440x900/1920x1080 where practical, and 1024x600.
- Mobile landscape smoke: verify opening, main menu, Case Archive, VN, puzzles, platformers, clue reveal, final verdict, and credits at 844x390, 932x430, and 915x412 where practical.
- Portrait fallback: rotate prompt or safe fallback appears, and the browser document still does not scroll.
- Full-screen shell: `html`/`body` remain non-scrollable; no player-facing screen requires page scroll to reach controls.
- Chapter 5 platformer: touch controls are visible/readable, elevators remain forgiving, checkpoints before/after the vertical section feel safe, and no page scroll occurs while touching controls.
- Chapter 6 platformer: touch controls are visible/readable, floating platforms remain easier than Chapter 5, the final court approach is clear, and no page scroll occurs while touching controls.
- Puzzle QA: all six active puzzles show board/tray/actions on mobile landscape, Reset and Submit/Open buttons stay visible, and tap fallback can complete the interaction.
- Chapter 5 puzzle: question tiles, lantern source, mirror/sigil controls, Trust door, success reveal, and action buttons fit mobile landscape.
- Chapter 6 puzzle: three final-seal rings, six clue lights, and Unlock Verdict action fit mobile landscape.
- VN/reveal QA: Continue/Skip/action buttons stay visible, text is not clipped, and reveal screens fit without page scroll.
- Final verdict QA: approved verdict text is readable, Accept Verdict stays visible, and `gameCompleted` is set only after Accept Verdict.
- Dev tooling: chapter dev routes still load, retained old dev routes still load, and the dev editor/debug overlay remains dev/test-only.
- Real-device manual QA still required before sharing: iPhone Safari landscape, Android Chrome landscape, drag/drop feel, platformer touch timing, reset/settings, and one timed full playthrough.

## Mobile Touch-Only Completion QA

- Phone target is mobile landscape; portrait should show the rotate fallback without document scroll.
- Every active chapter platformer route exposes visible Left, Right, and Jump controls inside the viewport.
- Touch buttons are large enough for thumbs, use `touch-action: none`, and do not trigger document panning while held or tapped.
- Holding Left/Right and tapping Jump should work together; browser focus loss or tab visibility changes should release any held movement state.
- Desktop keyboard controls remain available and are not hidden or removed by the touch-control overlay.
- Chapter 1 tutorial jumps remain comfortable with touch.
- Chapter 2 tram/moving platforms remain forgiving with touch controls.
- Chapter 3 drifting-paper platforms remain wide/slow enough for touch.
- Chapter 4 archive gates/doors remain readable and do not need precision timing.
- Chapter 5 elevator/vertical route remains playable with touch, with safe checkpoints before/after the vertical section.
- Chapter 6 floating/final-court route remains easier than Chapter 5 and avoids a final precision spike.
- Active puzzles must be completable by tap fallback without drag: tap item/token, tap slot/target, then use the visible primary action.
- Chapter 1 Case Mosaic, Chapter 2 Route Tile Puzzle, Chapter 5 Trust Door Light Path, and Chapter 6 Final Seal tap fallback are automated-smoke-tested on mobile landscape; all active puzzles still require real-device manual touch completion before release.

## Part 45B-R2 Chapter 1-2 Mechanics-Driven Puzzle QA

- Chapter 1 puzzle takes about 30-45 seconds in a normal playthrough.
- Chapter 1 feels like reconstructing the sealed envelope, not tapping through a clue confirmation.
- Chapter 1 works by tap fallback: tap piece -> tap slot -> File Clue.
- Chapter 1 drag/drop remains optional where practical.
- Chapter 1 mobile landscape shows all six slots, all six pieces, Reset, File Clue, progress, and feedback without page scroll.
- Chapter 2 puzzle takes about 35-60 seconds in a normal playthrough.
- Chapter 2 feels like a real route-connection puzzle, not a form or keyhole confirmation.
- Chapter 2 works by tap only: rotate Golden Stamp, Keyhole, Hidden Wall, and Vistula Route tiles until the path connects, then File Clue.
- Chapter 2 mobile landscape shows all route tiles, story markers, wave reveal, Reset, File Clue, progress, and feedback without page scroll.
- Chapter 2 solved route glow and Vistula wave reveal are clear.
- Chapter 1 and Chapter 2 clue reveals still route correctly and update old bridge completion ids normally.
- Chapters 3-6 puzzle mechanics, save/progression schema, and final verdict text remain unchanged.
- VN Continue/Skip, clue reveal action, final verdict Accept, Case Archive, Settings, Reset, Credits, and post-verdict buttons must remain visible and tappable.
- Real-device release gate remains: one full iPhone Safari landscape playthrough and one Android Chrome landscape playthrough, including Chapter 5 elevators, Chapter 6 floating platforms, puzzle tap fallback, settings/reset, and final verdict acceptance.

## Part 45C-R2 Chapter 1 And Historical Chapter 3 Puzzle Polish QA

- Chapter 1 remains `Case Mosaic: The Sealed Envelope`; it is not replaced by an open-envelope-only interaction.
- Chapter 1 still has six envelope pieces and a 3x2 board.
- Chapter 1 works by tap fallback: tap piece -> tap slot -> File Clue.
- Chapter 1 optional drag/drop remains usable where practical.
- Chapter 1 solved state clearly shows the restored clue payoff: Brass Key, Tram Ticket, and Glowing Route.
- Chapter 1 mobile landscape keeps all six slots, all six pieces, Reset, File Clue, progress, feedback, and solved payoff inside the viewport.
- Historical note: Part 45D-R2 revised supersedes the active Chapter 3 Witness Lens route with `Deposition Order: The Witness Note`.
- Chapter 2 Route Tile Puzzle remains unchanged.
- Chapters 4-6 puzzle mechanics, save/progression schema, and final verdict text remain unchanged.

## Part 45D-R2 Historical Chapter 4 Archive Overlay QA

- Historical note: Part 45D-R2 revised supersedes the active Chapter 4 Archive Overlay route with `Case File Sorting: No. Given.`
- The retained archive source route showed `Archive Overlay: The Marginal Note`.
- The original line `The heart was taken.` is visible as the archive page premise.
- The active puzzle uses three large marked margin zones; it does not require four hidden tiny details.
- Tap fallback completes the reveal path: tap each marked margin zone, tap the Silver Key, then File Clue.
- Optional magnifier/bookmark drag tools remain usable where practical but are not required for mobile completion.
- Revealing all marked zones displays `No. Given.` clearly.
- The Silver Key is hidden before correction completion and becomes visible/tappable after `No. Given.` appears.
- The puzzle does not solve before the Silver Key is taken.
- Reset clears marked zones, correction reveal, Silver Key state, progress, and feedback.
- Desktop and mobile landscape keep archive page, marked zones, Silver Key, Reset, File Clue, progress, and feedback inside the viewport without page scroll.
- Chapter 4 puzzle success routes to the Chapter 4 clue reveal and unlocks Chapter 5 through the existing bridge.
- Chapter 1-3 and Chapter 5-6 puzzle mappings, save/progression schema, platformer geometry, and final verdict text remain unchanged.

## Part 45D-R2 Revised Chapter 3-4 Document Puzzle And Case Archive QA

- Case Archive shows all six chapter cards inside the panel on desktop; Chapter 5 and Chapter 6 are not clipped or outside the frame.
- Case Archive shows all six chapter cards or makes all six reachable inside the panel on mobile landscape without page/body scroll.
- Case Archive header, progress text, chapter actions, and Back button remain visible and tappable.
- Chapter 3 active puzzle shows `Deposition Order: The Witness Note`.
- Chapter 3 no longer uses Witness Lens in normal player flow.
- Chapter 3 works by tap fallback: tap statement strip, tap line slot, repeat for four lines, then File Clue.
- Chapter 3 correct order is: `The heart was not taken by force.` -> `It was left willingly.` -> `The loudest accusation is false.` -> `Check the archive margin.`
- Chapter 3 wrong or incomplete order gives gentle feedback and does not solve.
- Chapter 3 solved state reveals archive code `16/05-MARGIN`.
- Chapter 3 puzzle success routes to the Chapter 3 clue reveal and unlocks Chapter 4 through the existing bridge.
- Chapter 4 active puzzle shows `Case File Sorting: No. Given.`
- Chapter 4 no longer uses Archive Detail Finder / Archive Overlay in normal player flow.
- Chapter 4 works by tap fallback: tap archive document, tap file slot, repeat for five documents, take the Silver Key, then File Clue.
- Chapter 4 correct order is: Route Reference -> Witness Note -> Original Charge -> Margin Correction -> Key Receipt.
- Chapter 4 wrong or incomplete order gives gentle feedback and does not solve.
- Chapter 4 solved order reveals `No. Given.` and makes the Silver Key visible/tappable.
- Chapter 4 puzzle does not solve before the Silver Key is taken.
- Chapter 4 puzzle success routes to the Chapter 4 clue reveal and unlocks Chapter 5 through the existing bridge.
- Desktop and mobile landscape keep both document puzzles' trays, slots, reset/file buttons, progress, feedback, and payoff text inside the viewport without page/body scroll.
- Chapter 1 Case Mosaic, Chapter 2 Route Tile Puzzle, Chapter 5 Trust Door Light Path, and Chapter 6 Final Seal remain unchanged.
- Save/progression schema, platformer geometry, dev routes, and final verdict text remain unchanged.

## Part 45E-R2 Chapter 5 Trust Door Light Path QA

- Chapter 5 active puzzle shows `Trust Door Light Path`.
- Chapter 5 no longer uses Echo Path in the normal player-facing puzzle flow.
- Correct question is `What remains when things are difficult?`.
- Wrong question gives gentle feedback and does not solve.
- Correct question activates the lantern light.
- Three large mirror/sigil controls rotate by tap; no drag precision is required.
- The light path starts incomplete and must reach Trust before the puzzle solves.
- Solved state shows the Trust door opening, blue-ribbon pages, and unfinished-letter payoff.
- Chapter 5 puzzle success routes to the Chapter 5 clue reveal and unlocks Chapter 6 through the existing bridge.
- Chapter 5 puzzle does not mark `gameCompleted`.
- Desktop and mobile landscape keep questions, light board, mirrors, Trust door, Reset/File buttons, progress, feedback, and payoff text inside the viewport without page/body scroll.
- Chapter 1-4 and Chapter 6 puzzle mappings remain unchanged.
- Save/progression schema, platformer geometry, dev routes, and final verdict text remain unchanged.

## Part 45F-R2 Chapter 6 Final Seal Ring QA

- Chapter 6 active puzzle shows `Final Seal: The Court of the Heart`.
- Chapter 6 no longer uses token-slot matching in the normal player-facing final puzzle.
- Three large seal rings rotate by tap; no drag precision is required.
- The six clue marks are Envelope, Wall, Witness, Correction, Trust, and Heart.
- Each aligned ring lights two clue marks and updates the progress readout.
- Incomplete alignment gives `The seal is not complete yet.` and does not route onward.
- Full alignment shows `The final seal closes.` and `The verdict is ready.`
- Unlock Verdict routes to FinalVerdictScene.
- Puzzle success does not mark `gameCompleted`; Accept Verdict still marks `gameCompleted`.
- Desktop and mobile landscape keep the rings, clue lights, Reset/Unlock buttons, feedback, and payoff text inside the viewport without page/body scroll.
- Chapter 1-5 puzzle mappings remain unchanged.
- Save/progression schema, platformer geometry, dev routes, and final verdict text remain unchanged.

## Part 45G-R2 Full Six-Puzzle QA

- Chapter 1 Case Mosaic goal is clear within the first few seconds: rebuild the envelope, then file the restored clue.
- Chapter 1 solved payoff clearly shows Brass Key, Tram Ticket, and Glowing Route before routing to the Chapter 1 clue reveal.
- Chapter 2 Route Tile Puzzle goal is clear: rotate the stamped route until it reaches the hidden wall and Vistula wave mark.
- Chapter 2 solved route glow and wave-mark payoff are visible before routing to the Chapter 2 clue reveal.
- Chapter 3 Deposition Order feels like reconstructing witness testimony, not a multiple-choice quiz.
- Chapter 3 archive code appears only after the four strips are in the correct statement order.
- Chapter 4 Case File Sorting feels like arranging an archive file, and `No. Given.` plus the Silver Key payoff are clear.
- Chapter 4 still requires taking the Silver Key before File Clue can route onward.
- Chapter 5 Trust Door Light Path reads as question unlocks lantern light, then mirrors guide the light to Trust.
- Chapter 5 Trust door, blue-ribbon pages, and unfinished-letter payoff are visible before the Chapter 5 clue reveal.
- Chapter 6 Final Seal feels ceremonial and keeps the active pre-verdict title `Final Seal: The Court of the Heart`.
- Chapter 6 puzzle success routes to FinalVerdictScene but does not set `gameCompleted`; Accept Verdict still sets `gameCompleted`.
- Desktop 1366x768 completion is covered for all six redesigned puzzles by click/tap fallback.
- Mobile landscape completion is covered for all six redesigned puzzles by tap fallback, with no document scroll.
- Remaining manual QA: real iPhone Safari and Android Chrome landscape completion, drag/drop feel, one timed full playthrough, and subjective puzzle pacing.

## Part 45G-R2 Post-Platformer Puzzle QA Refresh

- Chapter 1 classification: good. Confirm six mosaic pieces/slots are visible, tap fallback places all pieces, Brass Key / Tram Ticket / Glowing Route payoff appears, and File Clue routes to Chapter 1 reveal.
- Chapter 2 classification: good. Confirm route rotation is obvious, start/end markers are readable, solved route glow and Vistula wave payoff appear, and File Clue routes to Chapter 2 reveal.
- Chapter 3 classification: good. Confirm four witness strips are readable, slot order feels like reconstructing testimony, archive code appears only after the correct order, and File Clue routes to Chapter 3 reveal.
- Chapter 4 classification: good. Confirm five archive cards fit, sorting feels fair, `No. Given.` appears clearly, the Silver Key must be taken before File Clue, and Chapter 4 reveal/unlock remains intact.
- Chapter 5 classification: good but highest mobile puzzle-fit risk. Confirm the right question unlocks the lantern, three mirror/sigil taps visibly change the light path, Trust opens, and the blue-ribbon/unfinished-letter payoff is readable.
- Chapter 6 classification: good. Confirm ring hit targets are comfortable, clue lights progress visibly, the title stays `Final Seal: The Court of the Heart`, Unlock Verdict appears, and puzzle success does not set `gameCompleted`.
- Automated coverage now checks active puzzle duration bands, payoff terms, concise instructions, old-module exclusions, desktop completion, mobile-landscape tap fallback, no document scroll, and the Accept Verdict completion boundary.
- Remaining manual QA: real-device iPhone Safari and Android Chrome landscape touch completion, drag/drop feel where optional, and one timed full 10-15 minute playthrough.

## Part 47 Full End-To-End Release Readiness QA

- Start from a fresh save and verify the player-facing flow: Opening Start -> Opening Cinematic -> Title -> Case File / Case Archive -> Chapter 1 through Chapter 6 -> Final Seal -> FinalVerdictScene -> Accept Verdict -> Case closed.
- Confirm the Case Archive shows exactly six chapters, all cards are reachable without page/body scroll, Chapter 1 is unlocked by default, and chapters unlock sequentially after clue reveals.
- Confirm every active platformer loads through the chapter bridge, collects its required clue, reaches a supported exit, and routes to the expected active puzzle.
- Confirm every active puzzle loads, is solvable by tap fallback, keeps actions visible on desktop/mobile landscape, routes correctly after solve, and does not fall back to Witness Lens, Archive Detail Finder, Echo Path, or the old ten-fragment final puzzle in the active flow.
- Confirm Chapter 6 Final Seal success opens FinalVerdictScene without setting `gameCompleted`, and Accept Verdict sets `gameCompleted` plus the Case Closed state.
- Confirm the approved final verdict text is unchanged and the active pre-verdict player-facing copy does not use `The Heart, Freely Given` as a title before the verdict.
- Confirm save/progression still handles fresh save, replay, reset, settings persistence, corrupted save fallback, and completed-game Case Archive labels.
- Confirm desktop 1366x768, desktop 1920x1080 where practical, small laptop 1024x600, mobile landscape 844x390, mobile landscape 932x430, and portrait rotate fallback stay no-scroll.
- Timing pass: measure one full human desktop playthrough on a production build. Current metadata is upper-edge: platformers alone target about 10.25-13.25 minutes and puzzles add about 4.4 minutes, so the timed pass decides whether a follow-up pacing trim is needed.
- Real-device pass: complete one iPhone Safari landscape run and one Android Chrome landscape run before sharing, with special attention to Chapter 5 elevators, Chapter 6 rooftop/floating ascent, puzzle tap fallback, optional drag feel, final verdict Accept, reset, settings, and credits.
- Current Part 47 blocker classification: no known critical/high code blocker; medium release risks remain timed runtime, real-device mobile completion, and subjective late-chapter touch feel; low risks include known bundle warning, retained legacy/dev routes, stale docs/old naming, and placeholder visuals.

## Part 48A Final Wording Cleanup QA

- Opening case file says "A trail of clues is hidden across Warsaw." and does not say "Ten clues."
- Opening cinematic has exactly one "The case file opens." caption; the desk beat says "Maria takes her place at the desk."
- Active Chapter 6 puzzle title remains `Final Seal: The Court of the Heart`.
- Active Chapter 6 pre-verdict copy uses Heart Seal / Final Seal language and does not say `The Heart, Freely Given` before FinalVerdictScene.
- AGENTS.md describes the current six-chapter Missing Heart project, not the old 10-level direction.
- Credits use `Maria and the Case of the Missing Heart`.
- The approved final verdict text remains unchanged.
- Existing save key/package legacy metadata remains internal and unchanged until a tested migration is requested.

## Part 48B Final Asset Generation Readiness QA

- Confirm no image files were generated, added, or integrated during the planning pass.
- Confirm the first final asset target is `public/assets/final/opening-main-menu-office-desk.webp`.
- Confirm the first prompt requests a 16:9, 1920x1080 cinematic 2D storybook law-office desk background with a clean center/right UI-safe area.
- Confirm the prompt forbids readable text, logos, watermarks, menu frames, menu buttons, photorealism, anime, childish cartoon, cyberpunk/neon, horror, and excessive fantasy magic.
- Confirm the optimized WebP target is 300-700 KB where practical, with about 1 MB as the review ceiling for this visually important first-screen background.
- Confirm all title, subtitle, case-file copy, Start/Open Case buttons, and final verdict text remain rendered by code, not baked into imagery.
- Before Part 48C integration, review the generated image for desktop crop, mobile landscape crop, short-height crop, title/button readability, clean prop placement, absence of AI text, and absence of watermarks/logos.
- During Part 48C integration, update credits/source notes, preserve procedural fallback where practical, run typecheck/test/build/e2e where practical, and check build size.

## Part 48B Platformer Clean UI QA

- Open Chapter 1 normal gameplay and confirm there is no platform, story-point, object-id, or long helper-label clutter in the playfield.
- Open Chapter 2 normal gameplay and confirm there is no platform, story-point, object-id, or long helper-label clutter in the playfield.
- Open Chapter 3 normal gameplay and confirm there is no platform, story-point, object-id, or long helper-label clutter in the playfield.
- Open Chapter 4 normal gameplay and confirm there is no platform, story-point, object-id, or long helper-label clutter in the playfield.
- Open Chapter 5 normal gameplay and confirm there is no platform, story-point, object-id, or long helper-label clutter in the playfield.
- Open Chapter 6 normal gameplay and confirm there is no platform, story-point, object-id, or long helper-label clutter in the playfield.
- Confirm sound/settings/control instruction text is not persistently visible during gameplay.
- Confirm brief checkpoint, clue, pause, mute, and exit feedback still appears only when relevant.
- Confirm mobile landscape still shows usable Left, Right, and Jump touch controls inside the viewport.
- Confirm `?scene=platformer&chapter=1`, F1, selected-object inspection, label toggle, and validation markers still work in dev/test.
- Confirm production preview still does not expose the dev editor or dev override write endpoint.

## Part 51B Platformer Theme Skin Foundation QA

- Active runtime levels 1, 2, 4, 5, 6, and 9 have optional platformer theme entries under `src/assets/final/platformer/`.
- Missing final platformer art falls back to the existing Phaser primitive rendering with no broken images or console missing-asset errors.
- Future platformer skins are non-interactive visual layers; existing Arcade rectangles/zones remain authoritative for platform collisions, moving/elevator platforms, checkpoints, clue pickups, lantern/rebuild state, archive doors, and exits.
- Moving-platform skins, when present, follow the existing moving platform body without changing speed, axis, range, or player collision.
- Collected clue/interactable skins, when present, hide with their existing gameplay body.
- Chapter 1 fallback QA: movement, the vertical elevator, clue pickup, exit routing, touch controls, and no-scroll mobile landscape behavior remain unchanged.

## Part 47B Timed Playthrough And Real-Device QA

- Use `docs/timed-playthrough-protocol.md` for the official timing sheet, pass/fail gates, real-device checklist, production-preview checklist, helper routes, and bug report template.
- Desktop timed run: use production preview where possible, reset save through the UI, start timer at Start / Open Case, stop after Accept Verdict and Case Closed, and record chapter/platformer/puzzle/reveal times.
- Mobile timed run: complete touch-only in landscape on real iPhone Safari if possible and real Android Chrome if possible; emulator checks are only supplemental.
- Runtime gate: ideal 10-15 minutes, acceptable stretch up to 16 minutes if smooth, fail over 18 minutes for a first-time playthrough.
- Puzzle gate: no normal puzzle should feel like homework or take more than 90 seconds; all six active puzzles must remain tappable without drag precision.
- Platformer gate: no chapter should feel like a few jumps and done; Chapter 5 elevators and Chapter 6 rooftop/floating ascent must be comfortable on a real phone.
- Mobile gate: no page/body scroll, no hidden required controls, no clipped final verdict Accept button, no browser-chrome obstruction of critical actions.
- Production preview gate: run `npm run build`, run `npm run preview`, reset save, complete a full run, check console/network errors, confirm F1/dev editor does not open, and confirm no dev write endpoint is exposed.
- Bug reports should include device/browser, viewport/orientation, chapter/scene, issue type, repro steps, expected/actual result, screenshot/video, severity, and release-blocking yes/no.
- Do not count dev helper route spot checks as the official timed playthrough.

## Dev-2 Level Editor QA

- Open a dev platformer route such as `?scene=platformer&chapter=1` or `?scene=platformer&level=1`.
- Press F1 and confirm the `DEV LEVEL EDITOR` overlay appears only in dev/test mode.
- Confirm Add Platform, Duplicate, Delete Object, Revert Override, Save All, and Snap controls are visible.
- Add a static platform with the toolbar or A shortcut; it should appear immediately, be selectable, collide with the player, and show as dirty.
- Toggle Snap and confirm added platforms, duplicates, movement, and resizing round to the 32px grid.
- Select a static platform, duplicate it with the toolbar or Ctrl/Cmd+D, and confirm the duplicate has a unique `chN_dev_platform_###` or `levelN_dev_platform_###` id.
- Delete an added static platform and Save All; reload the same dev route and confirm it remains gone from the override file.
- Delete a base static platform and Save All; reload and confirm it is hidden by `deletedObjectIds` without editing canonical geometry.
- Move or resize a platform, save selected or save all, reload, and confirm the modified coordinates persist through `modifiedObjects`.
- Try Duplicate/Delete on a non-static object such as a checkpoint, exit, or clue; the editor should reject it with a clear message.
- Use Shift+D / Revert Override on a modified base object and confirm reload restores source geometry.
- Confirm old v1-style override files with an `objects` map still load.
- Confirm production preview does not open the F1 editor and `/__dev/level-overrides/:levelId` is unavailable.

## Dev-3 Selected-Object Inspector QA

- Open a dev platformer route such as `?scene=platformer&chapter=1`.
- Press F1 and confirm the selected-object inspector appears below the toolbar.
- With nothing selected, confirm the inspector says `No object selected`.
- Select a static platform and confirm the inspector shows id, type, kind, source, status, x, y, width, height, label, and dirty state.
- Change x/y, press Apply, and confirm the object moves while staying selected.
- Change width/height on a resizable static platform, press Apply, and confirm the object resizes.
- Toggle Snap, enter off-grid values, press Apply, and confirm inspector values round to the current 32px grid.
- Enter invalid numeric values and confirm Apply rejects them with an inspector error instead of saving invalid overrides.
- Save All, reload the same dev route, and confirm inspector-applied values persist.
- Edit a newly added platform through the inspector, Save All, reload, and confirm the added platform keeps its dimensions and label.
- Use Revert Unsaved and confirm the selected object returns to the last saved override state or base state without deleting a saved override.
- Use Revert Override on a base object and confirm it returns to canonical geometry in the current scene, then Save All to persist removing the override.
- Use Delete Object and confirm it remains distinct from Revert Override: static base platforms are hidden through `deletedObjectIds`, added static platforms are removed from `addedObjects`, and non-static objects are rejected.
- Focus an inspector input and press Arrow, Backspace, A, X, S, and Delete; these keys should edit the input or do nothing, not move/delete/save/toggle the selected object.
- Select a moving platform and confirm path/speed fields are editable as part of Dev-4.
- Select a checkpoint and confirm respawn fields are editable as part of Dev-5.
- Confirm production preview still does not open the F1 editor and `/__dev/level-overrides/:levelId` is unavailable.

## Dev-4 Moving Platform And Elevator Editor QA

- Open a dev route with moving platforms, such as `?scene=platformer&chapter=5` or `?scene=platformer&chapter=6`.
- Press F1, select a moving/elevator platform, and confirm the inspector shows `axis`, `speed`, `fromX`, `toX`, `fromY`, and `toY`.
- Click Add Moving Platform and confirm a horizontal mover appears immediately, is selected, shows path handles, and appears under Added Objects.
- Click Add Elevator and confirm a vertical lift appears immediately, is selected, shows path handles, and appears under Added Objects.
- Confirm horizontal movers enable `fromX`/`toX` while anchoring `fromY`/`toY` to the platform y position.
- Confirm vertical elevators enable `fromY`/`toY` while anchoring `fromX`/`toX` to the platform x position.
- Change speed and endpoint values, press Apply, and confirm the path preview updates.
- Drag the green/red endpoint handles and confirm the selected platform path updates without changing unrelated objects.
- Toggle Snap and confirm endpoint dragging and numeric Apply snap to the 32px grid.
- Duplicate a selected moving/elevator platform and confirm the duplicate receives a unique id, copied path fields, a slight offset, and dirty added-object status.
- Delete an added moving/elevator platform and confirm it disappears from the scene and Added Objects list.
- Try deleting a base moving platform and confirm the editor rejects it with a clear deferred-deletion message.
- Confirm invalid axis, non-positive speed, and near-zero path length are rejected with an inspector/editor message.
- Save All, reload the same dev route, and confirm moving-platform `axis`, `speed`, and endpoint changes persist from `dev-level-overrides/level-N.json`.
- Save All, reload, and confirm added moving/elevator platforms persist from `addedObjects`.
- Confirm static platform Add/Duplicate/Delete/Snap behavior from Dev-2 still works.
- Confirm inspector x/y/width/height editing and focused-input shortcut suppression from Dev-3 still work.
- Confirm production preview still does not open the F1 editor and `/__dev/level-overrides/:levelId` is unavailable.

## Dev-5 Checkpoint, Clue, And Exit Editor QA

- Open a dev platformer route such as `?scene=platformer&chapter=1`.
- Press F1 and select a checkpoint.
- Confirm the inspector shows `respawnX`, `respawnY`, `linkedRespawn`, checkpoint index, trigger support status, and respawn support status.
- Move the checkpoint with Linked Respawn on and confirm the respawn marker moves by the same delta.
- Turn Linked Respawn off, move the checkpoint, and confirm the respawn marker stays in place.
- Edit `respawnX`/`respawnY` numerically or drag the respawn marker while unlinked, then confirm the marker and support status update.
- Toggle Snap and confirm checkpoint and respawn edits snap to the 32px grid.
- Save All, reload the same dev route, and confirm checkpoint trigger and respawn coordinates persist through `modifiedObjects`.
- Select a clue/interactable object and confirm identity, required/story role, and type are read-only while x/y/size tuning remains available where supported.
- Move a clue/interactable and confirm the inspector reports Supported or Needs support using the selected-object support heuristic.
- Select an exit/door and confirm target route fields are read-only while x/y/size tuning and support validation are available.
- Move an exit/door, Save All, reload, and confirm the position persists without changing its target route.
- Confirm unsupported selected clues, exits, and checkpoint respawns warn in the inspector; outside-world or invalid-size edits should be rejected before apply/save.
- Confirm static platform Dev-2, inspector Dev-3, and moving-platform Dev-4 workflows still work.
- Confirm production preview still does not open the F1 editor and `/__dev/level-overrides/:levelId` is unavailable.

## Dev-6 Validation Overlay QA

- Open a dev platformer route such as `?scene=platformer&chapter=1`.
- Press F1 and confirm Validate Level, Auto Validate, and Markers controls are visible.
- Click Validate Level and confirm the validation summary shows Errors, Warnings, and Info counts.
- Toggle Markers on and confirm red/yellow/blue validation outlines can appear in the scene when issues exist.
- Click an issue in the list and confirm the editor selects or focuses the related visible object when possible.
- Move a required clue/interactable away from support and confirm validation warns that support is needed.
- Move the clue/interactable back above or beside a platform and confirm validation clears after refresh.
- Move an exit/door away from support and confirm validation reports an exit support warning.
- Move a checkpoint respawn point off support and confirm validation reports a checkpoint respawn warning.
- Edit a moving platform into a zero-length path and confirm validation reports a moving-platform error; restore it and confirm the error clears.
- Confirm duplicate/missing ids and non-positive dimensions are reported by unit coverage or a safe test fixture.
- Confirm Auto Validate refreshes after Add Platform, Duplicate, Delete Object, inspector Apply, moving endpoint edits, and checkpoint/clue/exit edits without making editing laggy.
- Confirm validation warnings do not block ordinary dev saves, while inspector/schema errors still block invalid object data.
- Confirm Dev-2 static platform tools, Dev-3 inspector tools, Dev-4 moving-platform tools, and Dev-5 checkpoint/clue/exit tools still work.
- Confirm production preview still does not open the F1 editor and `/__dev/level-overrides/:levelId` is unavailable.

## Dev-6.5 Dev Editor Workflow QA

- Read `docs/dev-editor-workflow.md` before extended level-polish work.
- Open a dev platformer route, press F1, run Validate Level, toggle Markers, and confirm the baseline issue list is understandable.
- Add a static platform, select it, move it, resize it, duplicate it, delete the duplicate, Save All, reload, and confirm the saved override state is clear.
- Select a base platform, edit x/y/width/height through the inspector, apply, Save All, reload, then use Revert Override to confirm base-geometry recovery remains distinct from Delete Object.
- Focus an inspector input and press Arrow, Backspace, A, X, S, and Delete; shortcuts must stay suppressed while typing.
- Select a moving/elevator platform, edit speed and path endpoints, drag endpoint handles, toggle Snap, validate, Save All, reload, and confirm the tuned path persists.
- Select a checkpoint, move it with Linked Respawn on, turn Linked Respawn off, edit or drag the respawn marker independently, validate support, Save All, and reload.
- Select a clue/interactable and an exit/door, move each onto and off of support, and confirm selected-object validation plus level-wide validation update clearly.
- Confirm validation warnings guide editing without blocking normal saves, while invalid schema values still fail before save.
- Confirm production preview does not open the F1 editor, does not expose `/__dev/level-overrides/:levelId`, and does not include dev editor/validation strings in the production bundle.
- Treat remaining gaps as known limitations: no moving-platform duplicate/delete, no checkpoint/clue/exit creation/deletion, no target-route/clue-identity editing, no polished multi-line import panel, and no automatic geometry bake.

## Dev-7 Undo/Redo And Override Safety QA

- Open a dev platformer route such as `?scene=platformer&chapter=1`.
- Press F1 and confirm Undo, Redo, Reset Level Overrides, Export Overrides, Import Overrides, and the Override Summary panel are visible.
- Add a static platform, then use Undo to remove it and Redo to restore it.
- Move or resize a selected platform, then use Undo and Redo to confirm coordinates and inspector values restore correctly.
- Delete a base static platform and confirm it appears under Deleted Objects in the override summary.
- Restore the deleted base static platform from the summary and confirm it reappears without editing canonical geometry.
- Duplicate a static platform and confirm the Added Objects summary count updates.
- Remove an added platform from the summary and confirm it disappears from the scene and override state.
- Use Reset Level Overrides, confirm the prompt, and verify modified/added/deleted counts clear in memory; Undo should restore the previous override state before saving.
- Export Overrides and confirm the copied/fallback JSON includes `version`, `levelId`, `modifiedObjects`, `addedObjects`, and `deletedObjectIds`.
- Import valid override JSON if safe to do in a disposable test route; confirm it previews counts, stays unsaved until Save All, and can be undone before saving.
- Try invalid import text or a TypeScript snippet and confirm it is rejected.
- Focus an inspector input and press Ctrl/Cmd+Z, Ctrl/Cmd+Y, Backspace, Arrow, A, X, S, and Delete; shortcuts should not mutate the selected object while typing.
- Save/reload still persists modified, added, deleted/restored, and imported override states.
- Confirm Dev-2 through Dev-6 workflows still work: static platform tools, inspector Apply/Revert/Delete, moving path editing, checkpoint/clue/exit editing, and validation overlay.
- Confirm production preview still does not open the F1 editor and `/__dev/level-overrides/:levelId` remains unavailable.

## Dev-8A Bake Workflow Planning QA

- Read `docs/dev-editor-bake-plan.md` before any override-to-geometry bake.
- Inventory current override files and classify them as active, legacy/dev-only, stale, or experimental.
- Confirm no bake proceeds with stale IDs, duplicate IDs, invalid dimensions, unsupported required objects, unsafe checkpoints, or invalid moving paths.
- Confirm deleted platform overrides are reviewed for support impact before removal from canonical geometry.
- Back up or commit the current state before baking.
- Keep override JSON intact until canonical geometry has passed tests and manual validation.
- After any future bake, run typecheck, tests, build, serial e2e if practical, and validate active platformer routes.
- Confirm final verdict text, save/progression schema, puzzles, and production dev-editor safety remain unchanged.

## Bake-6 Chapter 5 Canonical Geometry QA

- Confirm only Chapter 5 / runtime Level 6 geometry was baked from `dev-level-overrides/level-6.json`.
- Confirm the baked override is preserved at `dev-level-overrides/archive/level-6.baked-20260510.json` for rollback/reference.
- Confirm root `dev-level-overrides/level-6.json` is absent so normal dev mode no longer double-applies the baked Level 6 override or stale narrow `ch5_dev_elevator_001` / `floating-brief-one` values.
- Confirm the added static platforms `ch5_dev_platform_001`, `ch5_dev_platform_002`, and `ch5_dev_platform_003` are canonical route/catch supports for the moved choice-door layout.
- Confirm `ch5_dev_elevator_001` was reviewed and intentionally baked as a 112px-wide, speed-28 vertical elevator instead of the override's 82px width, with path values centered at `x/fromX/toX: 2376`.
- Confirm `floating-brief-one` was reviewed and intentionally baked at 112px width with centered path values `x: 2171`, `fromX: 2111`, and `toX: 2289`.
- Confirm deleted support IDs `echo-bridge`, `ch5_lantern_lower_catch`, `ch5_elevator_waiting_ledge`, and `ch5_unfinished_letter_ledge` are absent from canonical Level 6 static platforms and were plain obsolete route supports.
- Confirm moved choice doors `door-doubt`, `door-hope`, `door-fear`, `door-trust`, and `door-distance` still make visual sense and keep the Hope/Trust route clear.
- Open Chapter 5 normally and verify the courthouse corridor, choice-door spine, Silver Key ledge, Trust threshold, lantern descent, light bridge, elevator ascent, blue-ribbon / unfinished-letter ledge, and final exit work without needing new override edits.
- Open `?scene=platformer&chapter=5`, press F1, and run Validate Level.
- Confirm there is no stale 82px `ch5_dev_elevator_001` warning and no stale narrow `floating-brief-one` warning from the archived Level 6 override.
- Confirm there are no critical validation errors for Chapter 5 canonical geometry.
- Confirm `ch5_dev_elevator_001` and `floating-brief-one` are the canonical 112px widths in the editor/inspector.
- Confirm added supports exist once and the deleted supports are not needed.
- Confirm the elevator checkpoint respawns onto supported lantern/light-bridge route geometry and does not create a long recovery loop.
- Confirm the final exit still routes to the active Trust Door Light Path puzzle bridge.
- Confirm archived `dev-level-overrides/archive/level-6.baked-20260510.json` exists for rollback.
- If Chapter 5 behaves incorrectly, move the archived override back to `dev-level-overrides/level-6.json`, revert the Bake-6/Bake-6A geometry/test/doc changes as needed, and rerun tests.

## Bake-7 Active Geometry Completion QA

- Confirm active root override files are absent: `level-1.json`, `level-2.json`, `level-4.json`, `level-5.json`, `level-6.json`, and `level-9.json`.
- Confirm archived baked rollback files exist for active runtime Levels 1, 2, 4, 5, 6, and 9 under `dev-level-overrides/archive/`.
- Confirm remaining root override files are only `level-3.json`, `level-8.json`, and `level-10.json`.
- Classify `level-3.json` as legacy/dev-only old Rebuilt Street checkpoint tuning, not an active player-facing platformer dependency.
- Classify `level-8.json` as legacy/dev-only old Argument Tower platform/elevator/exit tuning, not an active player-facing platformer dependency.
- Classify `level-10.json` as legacy/dev-only old final platformer tuning, not an active Chapter 6 platformer dependency; active Chapter 6 uses runtime Level 9 platformer and Level 10 puzzle/final-verdict routing.
- Do not bake or delete legacy overrides during the active bake completion audit.
- Confirm all active canonical platformer geometries validate with 0 errors / 0 warnings.
- Confirm Chapter 1 exits to Case Mosaic.
- Confirm Chapter 2 exits to Route Tile Puzzle.
- Confirm Chapter 3 exits to Deposition Order.
- Confirm Chapter 4 exits to Case File Sorting.
- Confirm Chapter 5 exits to Trust Door Light Path.
- Confirm Chapter 6 exits to Final Seal and Final Seal reaches `FinalVerdictScene`.
- Confirm final puzzle success does not mark `gameCompleted`; only Accept Verdict does.
- Confirm production preview still does not expose the F1 editor or `/__dev/level-overrides/:levelId` write endpoint.
- Manual release gates remain: one desktop production-preview timed full playthrough, one real-phone landscape playthrough, Chapter 5 elevator feel, Chapter 6 rooftop/floating ascent feel, all puzzles on a real phone, 10-15 minute runtime target, and final verdict emotional pacing.

## Bake-5 Chapter 6 Canonical Geometry QA

- Confirm only Chapter 6 / runtime Level 9 geometry was baked from `dev-level-overrides/level-9.json`.
- Confirm the baked override is preserved at `dev-level-overrides/archive/level-9.baked-20260510.json` for rollback/reference.
- Confirm root `dev-level-overrides/level-9.json` is absent so normal dev mode no longer double-applies the baked Level 9 override or stale 70px `final-rooftop-lift` values.
- Confirm the saved override's 70px warning for `final-rooftop-lift` was reviewed and intentionally baked at 112px width for mobile comfort, with center path preserved by `x/fromX: 4379` and `toX: 4539`.
- Confirm deleted rooftop platform IDs `ch6_rooftop_climb_mid` and `ch6_upper_skyline_path` are absent from canonical Level 9 static platforms and were plain obsolete route supports.
- Open Chapter 6 normally and verify the rooftop climb, lower roof gap, clue-memory balcony, floating ascent, final court landing, heart seal, and final door work without needing new override edits.
- Open `?scene=platformer&chapter=6`, press F1, and run Validate Level.
- Confirm there is no stale 70px `final-rooftop-lift` warning from the archived Level 9 override.
- Confirm Validate Level reports no critical errors for Chapter 6 canonical geometry.
- Confirm `final-rooftop-lift` is the canonical 112px width in the editor/inspector.
- Confirm `final-rooftop-lift` feels mobile-safe and ceremonial rather than precision-heavy.
- Confirm the deleted rooftop platforms are not needed for clue memory markers, lantern switches, checkpoints, heart seal, final door, or the exit.
- Confirm the Unfinished Letter, clue memory markers, final court, heart seal, checkpoint respawns, and final door remain supported.
- Confirm the exit still routes to the active Final Seal puzzle bridge and the Final Seal still reaches `FinalVerdictScene`.
- Confirm game completion still happens only after accepting the final verdict.
- Confirm archived `dev-level-overrides/archive/level-9.baked-20260510.json` exists for rollback.
- If Chapter 6 behaves incorrectly, move the archived override back to `dev-level-overrides/level-9.json`, revert the Bake-5/Bake-5A geometry/test/doc changes as needed, and rerun tests.

## Bake-4 Chapter 1 Canonical Geometry QA

- Confirm only Chapter 1 / runtime Level 1 geometry was baked from `dev-level-overrides/level-1.json`.
- Confirm the baked override is preserved at `dev-level-overrides/archive/level-1.baked-20260510.json` for rollback/reference.
- Confirm root `dev-level-overrides/level-1.json` is absent so normal dev mode no longer double-applies the baked Level 1 override, old checkpoint respawn, or duplicate added elevator.
- Confirm `ch1_dev_elevator_001` was reviewed and intentionally baked as a tutorial-friendly vertical elevator: 102px wide, speed 28, vertical travel from `fromY: 233` to `toY: 357`.
- Confirm the `ch1-route-checkpoint` respawn warning was resolved by baking `respawnX: 2580` instead of the override's unsupported `2640`.
- Open Chapter 1 normally and verify the tutorial route works without needing new override edits.
- Open `?scene=platformer&chapter=1`, press F1, and run Validate Level.
- Confirm there is no old checkpoint respawn warning and no duplicate added elevator from the archived Level 1 override.
- Confirm `ch1_dev_elevator_001` is canonical, visible once, and still mobile-safe enough for Chapter 1.
- Confirm the lower office route, paper/folder steps, bookcase climb, tutorial elevator, high evidence shelf, safe descent, case-file desk, glowing route ledge, and case-door exit read clearly.
- Confirm the sealed envelope, case-file desk, checkpoint respawns, route marker, and exit remain supported.
- Confirm the elevator does not add confusing timing pressure for a tutorial chapter and remains comfortable on mobile landscape.
- Confirm the exit still routes to the active Case Mosaic puzzle bridge.
- Confirm archived `dev-level-overrides/archive/level-1.baked-20260510.json` exists for rollback.
- If Chapter 1 behaves incorrectly, move the archived override back to `dev-level-overrides/level-1.json`, revert the Bake-4/Bake-4A geometry/test/doc changes as needed, and rerun tests.

## Bake-1 Chapter 2 Canonical Geometry QA

- Confirm only Chapter 2 / runtime Level 2 geometry was baked from `dev-level-overrides/level-2.json`.
- Confirm the baked override is preserved at `dev-level-overrides/archive/level-2.baked-20260510.json` for rollback/reference.
- Confirm root `dev-level-overrides/level-2.json` is absent so normal dev mode no longer double-applies the baked Level 2 override.
- Open `?scene=platformer&chapter=2` and verify the route works without needing any new override edits.
- Open the Chapter 2 dev route `?scene=platformer&chapter=2`, press F1, and run Validate Level.
- Confirm there are no stale deleted-id warnings from the archived Level 2 override.
- Confirm Validate Level reports no critical errors for Chapter 2 canonical geometry.
- Confirm the two tram moving platforms and the hidden-wall lift still move slowly and read clearly.
- Confirm the Golden Stamp is supported and reachable.
- Confirm the keyhole trigger / hidden wall floor is supported and reachable.
- Confirm the Vistula wave mark ledge and exit are supported.
- Confirm the exit still routes to the active Route Tile Puzzle bridge.
- If Chapter 2 behaves incorrectly, move the archived override back to `dev-level-overrides/level-2.json`, revert the Bake-1/Bake-1A geometry/test/doc changes as needed, and rerun tests.

## Bake-2 Chapter 3 Canonical Geometry QA

- Confirm only Chapter 3 / runtime Level 4 geometry was baked from `dev-level-overrides/level-4.json`.
- Confirm the baked override is preserved at `dev-level-overrides/archive/level-4.baked-20260510.json` for rollback/reference.
- Confirm root `dev-level-overrides/level-4.json` is absent so normal dev mode no longer double-applies the baked Level 4 override.
- Confirm `witness-note-ledge` is absent from canonical Level 4 static platforms.
- Open Chapter 3 normally and verify the route works without needing new override edits.
- Open `?scene=platformer&chapter=3`, press F1, and run Validate Level.
- Confirm there are no stale deleted-id warnings from the archived Level 4 override.
- Confirm Validate Level reports no critical errors for Chapter 3 canonical geometry.
- Confirm the lower Vistula bank, drifting paper platforms, bridge footing/climb, upper bridge route, under-bridge descent, and witness-shadow floor read as one continuous route.
- Confirm the Witness Note, archive-code step, witness fragments, checkpoint respawns, and final exit remain supported.
- Confirm the exit still routes to the active Deposition Order puzzle bridge.
- Confirm archived `dev-level-overrides/archive/level-4.baked-20260510.json` exists for rollback.
- If Chapter 3 behaves incorrectly, move the archived override back to `dev-level-overrides/level-4.json`, revert the Bake-2/Bake-2A geometry/test/doc changes as needed, and rerun tests.

## Bake-3 Chapter 4 Canonical Geometry QA

- Confirm only Chapter 4 / runtime Level 5 geometry was baked from `dev-level-overrides/level-5.json`.
- Confirm the baked override is preserved at `dev-level-overrides/archive/level-5.baked-20260510.json` for rollback/reference.
- Confirm root `dev-level-overrides/level-5.json` is absent so normal dev mode no longer double-applies the baked Level 5 override or stale 80px drawer/lift values.
- Confirm the saved override's 80px warnings for `sliding-drawer-one` and `ch4_drawer_lift` were reviewed and intentionally baked at 128px width for mobile comfort, with centers/path endpoints preserved.
- Open Chapter 4 normally and verify the archive shelf/file-cabinet climb works without needing new override edits.
- Open `?scene=platformer&chapter=4`, press F1, and run Validate Level.
- Confirm there are no stale 80px drawer/lift warnings from the archived Level 5 override.
- Confirm the drawer/lift route works and does not feel too narrow on mobile landscape.
- Confirm `sliding-drawer-one` and `ch4_drawer_lift` are comfortable 128px traversal platforms.
- Confirm the Marginal Note, archive key, Silver Key, `No. Given.` correction note, file-spine key note, checkpoint respawns, locked archive door, and exit remain supported.
- Confirm the exit still routes to the active Case File Sorting puzzle bridge.
- Confirm archived `dev-level-overrides/archive/level-5.baked-20260510.json` exists for rollback.
- If Chapter 4 behaves incorrectly, move the archived override back to `dev-level-overrides/level-5.json`, revert the Bake-3/Bake-3A geometry/test/doc changes as needed, and rerun tests.

## Chapter 5 And Chapter 6 Manual Polish Workflow QA

- Read `docs/level-polish-workflow.md` before polishing the late platformer chapters.
- Chapter 5 route: open `?scene=platformer&chapter=5`, press F1, enable validation markers, click Validate Level, and clear red validation errors before tuning.
- Chapter 5 focus: courthouse corridor, Trust threshold, lantern descent, light bridge, three vertical elevators, blue ribbon / unfinished letter ledge, and final exit.
- Chapter 5 elevator checks: wide enough, slow enough, reachable endpoints, safe start/end ledges, visible landings, no long fall punishment, and checkpoint coverage before and after the elevator section.
- Chapter 5 object support checks: Silver Key, Trust door, lantern switch, blue ribbon / unfinished letter, and final exit.
- Chapter 6 route: open `?scene=platformer&chapter=6`, press F1, enable validation markers, click Validate Level, and clear red validation errors before tuning.
- Chapter 6 focus: lower rooftops, parapet/chimney climb, upper skyline route, safe roof-gap descent, clue-memory balcony, floating court elevators, final court landing, heart seal platform, and final door.
- Chapter 6 rooftop checks: true vertical climb, no blind jumps, clear next-platform visibility, safe landings, and a final ascent that feels ceremonial rather than stressful.
- Chapter 6 checkpoint checks: after first rooftop climb, before floating ascent, after floating ascent, with supported respawn markers.
- Chapter 6 object support checks: unfinished letter, clue memory markers, heart seal, and final door.
- Record the timing table from `docs/level-polish-workflow.md` for Chapter 5, Chapter 6, and full game total time.
- Pass criteria: Chapter 5 and Chapter 6 platformers each feel close to 120-150 seconds, the full game remains near 10-15 minutes, no mobile section feels unfair, and Chapter 6 is easier than Chapter 5.
- Export override JSON backups after each good polish session using names like `chapter-5-elevator-polish-YYYYMMDD.json` and `chapter-6-rooftop-polish-YYYYMMDD.json`.
- Do not bake overrides or change canonical geometry until the polished state has manual approval.

## Part 49F Chapter 6 Intro And Final Seal VN Image QA

- Open `?scene=vn&id=vn-chapter-6-intro` and confirm `SixthNovel01.webp`, `SixthNovel02.webp`, and `SixthNovel03.webp` advance in order by tap/click/Enter.
- Confirm the Chapter 6 intro uses image-backed mode with no old coded dialogue card, speaker/nameplate UI, Skip button, Continue button, or duplicate visible text.
- After `SixthNovel03.webp`, confirm the flow enters Chapter 6 platformer runtime Level 9.
- Open `?scene=vn&id=vn-chapter-6-before-puzzle` and confirm `TheFinalSealPuzzleNovel01.webp` appears as a single image-backed page.
- After `TheFinalSealPuzzleNovel01.webp`, confirm the flow enters the Final Seal puzzle at runtime Level 10.
- Confirm the final verdict text appears only after the Final Seal puzzle flow and remains unchanged.
- Confirm desktop and mobile-landscape layouts use contained images, dark backing, no body/document scroll, and no cropped baked title/counter/dialogue/Continue text.
- Confirm previously integrated image-backed VN scenes still work and unmapped VN scenes still use the coded VN layout.

## Part 50O Full Visual Flow QA

- Start from the opening cinematic and verify `Opening01.webp` through `Opening07.webp` show cinematic captions without VN dialogue panels or speaker nameplates.
- Open Case and confirm `CaseFileFrame01.webp` displays without duplicate code-rendered case-file text.
- Confirm all mapped image-backed VN scenes use contained images with no old coded VN panel, no speaker-card/nameplate leakage, no big Continue/Skip button, and no cropped baked text.
- Confirm `vn-chapter-5-before-puzzle` uses `TheRightQuestionPuzzleNovel01.webp` and continues into Trust Door Light Path.
- Confirm active platformer chapter routes load after their intro VN scenes and preserve clean gameplay HUD/no-scroll behavior.
- Complete all six active puzzles from their chapter/pre-puzzle routes and confirm visual polish remains intact in flow, not only through direct puzzle URLs.
- Confirm Final Seal success opens FinalVerdictScene, `gameCompleted` is false before Accept Verdict, and `Case closed. Love confirmed.` appears only after acceptance.
- Record any console errors, failed asset requests, mobile landscape clipping, old UI leakage, pacing concerns, and real-device follow-up risks before release.

## Part 50R Evidence Reveal Image-Backed QA

- With `RevealChapter01.webp` through `RevealChapter05.webp` absent, confirm Chapter 1-5 reveals still use the existing Phaser certificate/stamp fallback.
- Confirm the fallback reveal still has the same two-step behavior: first Enter/tap/click changes to the chapter-closed status and writes completion; second Enter/tap/click opens the Case Archive.
- After a reveal image is added for a chapter, confirm only that mapped chapter uses the image-backed reveal screen and no old Phaser certificate, stamp, title/body text, next-clue panel, or burgundy button is duplicated over it.
- Confirm image-backed reveal screens use contained scaling on a dark backing and do not crop baked text on desktop or mobile landscape.
- Confirm keyboard Enter and pointer/tap/click both work in fallback and image-backed modes.
- Confirm Chapter 6 remains outside the reveal-image batch: Final Seal success still routes to FinalVerdictScene and the final verdict text remains unchanged.

## Part 50S Chapter 1 Reveal Style Anchor QA

- Confirm `src/assets/final/reveals/RevealChapter01.webp` is detected by the reveal asset resolver.
- Complete Chapter 1 Case Mosaic and confirm the reveal uses `[data-testid="evidence-reveal-image-backed"]` with `RevealChapter01.webp`.
- Confirm old Phaser reveal chrome is not duplicated over the image-backed Chapter 1 reveal.
- Confirm desktop 1366x768 and mobile landscape 932x430 show the reveal contained, centered, readable, and no-scroll.
- Confirm first Enter/tap/click changes status to `Chapter 1 closed.` and stores completed level id 1.
- Confirm second Enter/tap/click opens the Case Archive.
- Complete Chapter 2 Route Tile while `RevealChapter02.webp` is absent and confirm the old Phaser reveal fallback remains.
- Confirm Chapter 6 Final Seal and FinalVerdictScene remain untouched and final verdict text remains unchanged.

## Part 50T Chapter 1-5 Reveal Image QA

- Confirm `RevealChapter01.webp` through `RevealChapter05.webp` are all detected by the reveal asset resolver.
- Complete or direct-route to each Chapter 1-5 puzzle and confirm the post-puzzle reveal uses `[data-testid="evidence-reveal-image-backed"]`.
- Confirm each reveal image source matches its chapter: `RevealChapter01.webp`, `RevealChapter02.webp`, `RevealChapter03.webp`, `RevealChapter04.webp`, and `RevealChapter05.webp`.
- Confirm old Phaser reveal chrome is not duplicated over any mapped reveal.
- Confirm desktop 1366x768 and mobile landscape 932x430 show every reveal contained, centered, readable, and no-scroll.
- Confirm first Enter/tap/click changes status to `Chapter N closed.` and writes the existing completion id: Chapter 1 -> 1, Chapter 2 -> 3, Chapter 3 -> 4, Chapter 4 -> 5, Chapter 5 -> 8.
- Confirm second Enter/tap/click opens the Case Archive for every Chapter 1-5 reveal.
- Confirm Chapter 6 Final Seal and FinalVerdictScene remain untouched and final verdict text remains unchanged.

## Part 51C Chapter 1 Platformer Vertical-Slice Art QA

- Confirm `chapter01-platformer-bg.webp`, `chapter01-platform-static-paper.webp`, `chapter01-platform-moving-elevator.webp`, `chapter01-clue-envelope.webp`, and `chapter01-exit-case-door.webp` are detected by the platformer theme asset resolver.
- Open `?scene=platformer&chapter=1` and confirm the background appears behind the level without missing-asset console errors.
- Confirm static paper platform skins align with their existing collision rectangles and do not move or resize hitboxes.
- Confirm the tutorial elevator skin appears on the existing moving platform and follows its body during movement.
- Confirm the envelope clue skin appears, remains aligned with the existing clue object, and hides with the clue after collection.
- Confirm the case-door exit skin appears at the existing exit marker and the exit still routes to the Chapter 1 Case Mosaic puzzle.
- Confirm the primitive gameplay layer remains available as fallback and the player placeholder rectangle, HUD, touch controls, checkpoints, clue pickup, and exit routing remain unchanged.
- Confirm desktop 1366x768 and mobile landscape around 932x430 have no document/body scroll and keep platforms, clue, exit, and touch controls readable.
- Confirm Chapters 2-6 remain on primitive/fallback platformer presentation until their own final-art passes.

## Part 51C-R1 Chapter 1 Platformer Skin Cleanup QA

- Confirm Chapter 1 still detects all five platformer final-art assets even though the platform/elevator exports are not forced as active surfaces.
- Confirm old primitive platform fills are reduced in Chapter 1 final-art mode and no longer dominate the scene as flat brown/gold blocks.
- Confirm static platforms use polished parchment/leather code-rendered surfaces aligned to the unchanged collision rectangles.
- Confirm the tutorial elevator uses the polished moving-platform surface, follows the existing body, and does not expose the old flat primitive block.
- Confirm the envelope clue image appears as an in-world object, keeps a subtle glow/backing, and hides after collection.
- Confirm the case-door image appears as the destination, keeps a subtle glow/backing, and still routes into Case Mosaic after the clue is collected.
- Confirm the Chapter 1 background remains darkened enough that the player placeholder, platforms, clue, and exit are readable.
- Confirm desktop 1366x768 and mobile landscape around 932x430 remain no-scroll and mechanically unchanged.

## Part 51C-R2 Chapter 1 Hybrid Platformer Presentation QA

- Confirm Chapter 1 still detects `chapter01-platformer-bg.webp`, `chapter01-platform-static-paper.webp`, `chapter01-platform-moving-elevator.webp`, `chapter01-clue-envelope.webp`, and `chapter01-exit-case-door.webp`.
- Confirm the Chapter 1 background image remains active, while old ambient placeholder bars/rectangles from the decoration pass are absent in normal final presentation.
- Confirm `chapter01-platform-static-paper.webp` and `chapter01-platform-moving-elevator.webp` remain mapped but are not actively used as gameplay platform surfaces.
- Confirm static platforms use polished code-rendered kancelaria surfaces with brass top edges, subtle shadow, and exact collision alignment.
- Confirm the moving/elevator platform uses a grouped procedural document-lift surface and all trim/shadow details follow the moving body.
- Confirm old primitive body fills are nearly invisible and do not dominate the release presentation.
- Confirm the clue envelope and case-door skins remain usable, clear, non-interactive, and aligned to unchanged overlap zones.
- Confirm player movement, platform collisions, clue pickup, exit routing, touch controls, and no-scroll mobile landscape behavior remain unchanged.

## Part 51D Maria Platformer Sprite Support QA

- Confirm `maria-idle.png`, `maria-walk.png`, and `maria-jump.png` resolve through `playerSpriteAssets.ts`.
- Confirm the checked-in PNGs have true transparency before enabling `PLAYER_SPRITE_TRANSPARENCY_APPROVED`; if they show checkerboard/white/black backgrounds, keep the rectangle fallback.
- Confirm the player physics body remains 34x54 and movement constants, gravity, jump speed, coyote time, and jump buffer are unchanged.
- When transparent sprite exports are approved, confirm Maria is bottom-center anchored with her feet aligned to the player body bottom and readable at platformer scale.
- Confirm idle, walk, jump, and left/right facing states update from existing body velocity/grounded state without changing `PlayerController`.
- Confirm all active platformer levels still boot, touch controls remain visible, clue pickup and exit routing still work, and final verdict text remains unchanged.

## Part 51D-R1 Transparent Maria Sprite Activation QA

- Confirm `maria-idle.png`, `maria-walk.png`, and `maria-jump.png` are PNG color type 6 with transparent corner alpha and no visible checkerboard/white/black backing in-game.
- Confirm `PLAYER_SPRITE_TRANSPARENCY_APPROVED` is enabled and all three player sprite URLs preload before platformer construction.
- Confirm Maria replaces the visible rectangle while the 34x54 physics body remains authoritative and fallback rectangle behavior remains available for missing URLs.
- Confirm Maria's render-time crops remove transparent padding, display height is 128px with a minimum readable width, origin is bottom-center, contact shadow is subtle, and feet align with platform tops.
- Confirm the active Maria sprite has no visible white/checkerboard box, the subtle dark edge shadow reduces pale fringe without a cartoon glow, and platformer viewport side areas use the burgundy/navy/gold theatre-frame treatment rather than repeated level background art or empty black bars.
- Confirm platformer canvas left/right viewport margins are balanced in mobile landscape; Phaser inline canvas margins must not combine with CSS grid centering and shift the gameplay frame.
- Confirm idle/walk/jump states, left/right facing, reduced-motion-safe walk bob, and last-facing idle behavior work from existing velocity/grounded state.
- Confirm Chapter 1 and at least one later moving-platform chapter remain playable on desktop and mobile landscape with no scroll or missing-asset console errors.

## Part 52A Global Non-VN Presentation Shell QA

- Confirm puzzle overlays, Case Archive, Credits, Final Verdict, fallback Evidence Reveal, Coming Soon, and platformer outer framing use the shared navy/burgundy/gold presentation language instead of plain blue or empty black outer fields.
- Confirm image-backed VN scenes and opening cinematic content remain visually and behaviorally unchanged.
- Confirm the shared shell does not crop puzzle boards, reveal images, archive cards, final verdict text, touch controls, or platformer gameplay.
- Confirm desktop and mobile landscape retain no document/body scroll.
- Confirm platformer geometry, hitboxes, physics, puzzle logic, save/progression, and final verdict text remain unchanged.
