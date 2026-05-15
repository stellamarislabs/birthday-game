# Production Plan

## Part 1: Foundation

Create project setup, docs, content data, type definitions, save skeleton, flow skeleton, tests, and a bootable title/case-file/placeholder flow.

Definition of done: typecheck, unit tests, and build pass when dependencies are installed; no full gameplay implemented.

## Part 2: First Playable Platformer Vertical Slice

Implement Level 1 only with movement, keyboard controls, touch-control placeholders, basic collision, one checkpoint, one collectible clue, and transition to placeholder puzzle.

Status: implemented as the first playable vertical slice.

Definition of done: Level 1 is playable, forgiving, and short; tests cover pure logic.

## Part 3: First Puzzle Interlude

Implement the document-ordering puzzle for Level 1 only.

Status: implemented for Level 1 with a real document-ordering puzzle and evidence reveal.

Definition of done: puzzle is readable in 5 seconds, solvable in 20-40 seconds, mobile-friendly, and connected to the first clue.

## Part 4: Save/Progression Integration

Connect level completion, puzzle completion, unlocks, resume, mute, and reduce-motion flags.

Status: implemented for the first completed Level 1 loop with Title progress awareness, settings persistence, reset confirmation, and Level Select.

Definition of done: corrupted storage and missing storage are safe; progression is tested.

## Part 5: Level 2 Platformer Slice

Implement Level 2, The Tram of Deadlines, as a playable platformer level only.

Status: implemented with the Golden Stamp collectible, checkpoint, two gentle moving tram platforms, and a placeholder calendar-sequence puzzle handoff.

Definition of done: Level 2 platformer is playable, Level 2 puzzle remains placeholder only, Level 3 remains locked, and existing Level 1/save/progression behavior still passes tests.

## Part 6: Level 2 Calendar-Sequence Puzzle

Implement the real Level 2 calendar-sequence puzzle interlude only.

Status: implemented with a real calendar-sequence puzzle, Level 2 evidence reveal, Level 2 completion persistence, and Level 3 coming-soon unlock.

Definition of done: puzzle is readable in 5 seconds, solvable in 20-40 seconds, marks Level 2 complete only after success, and unlocks Level 3 as coming soon.

## Part 7: Level 3 Platformer Slice

Implement Level 3, The Rebuilt Street, as a playable platformer level only.

Status: implemented with The Red Brick collectible, two checkpoints, two rebuild trigger groups, and a reconstruction puzzle placeholder.

Definition of done: Level 3 platformer is playable, The Red Brick collectible is required, checkpoint behavior works, and the reconstruction puzzle remains placeholder only.

## Part 8: Level 3 Reconstruction Puzzle

Implement the real Level 3 reconstruction puzzle interlude only.

Status: implemented with a six-piece reconstruction puzzle, Level 3 evidence reveal, Level 3 completion persistence, and Level 4 coming-soon unlock.

Definition of done: puzzle is readable in 5 seconds, solvable in 20-40 seconds, marks Level 3 complete only after success, and unlocks Level 4 as coming soon.

## Part 9: Level 4 Platformer Slice

Implement Level 4, The Vistula Deposition, as a playable platformer level only.

Status: implemented with The Witness Note collectible, two checkpoints, three slow drifting paper platforms, optional witness-note fragments, and a contradiction puzzle placeholder.

Definition of done: Level 4 platformer is playable, The Witness Note collectible is required, witness-note traversal works, and the contradiction puzzle remains placeholder only.

## Part 10: Level 4 Contradiction Puzzle

Implement the real Level 4 contradiction puzzle interlude only.

Status: implemented with a three-statement contradiction review, Level 4 evidence reveal, Level 4 completion persistence, and Level 5 coming-soon unlock.

Definition of done: puzzle is readable in 5 seconds, solvable in 20-40 seconds, marks Level 4 complete only after success, and unlocks Level 5 as coming soon.

## Part 11: Level 5 Platformer Slice

Implement Level 5, The Archive of Tiny Details, as a playable platformer level only.

Status: implemented with The Marginal Note collectible, two checkpoints, archive key/door progression, optional tiny-detail notes, and a memory-match puzzle placeholder.

Definition of done: Level 5 platformer is playable, The Marginal Note collectible is required, switch/key/door behavior works, and the memory-match puzzle remains placeholder only.

## Part 12: Level 5 Memory-Match Puzzle

Implement the real Level 5 memory-match puzzle interlude only.

Status: implemented with an eight-card memory-match puzzle, Level 5 evidence reveal, Level 5 completion persistence, and Level 6 coming-soon unlock.

Definition of done: puzzle is readable in 5 seconds, solvable in 20-40 seconds, marks Level 5 complete only after success, and unlocks Level 6 as coming soon.

## Part 13: Level 6 Platformer Slice

Implement Level 6, The Courthouse of Echoes, as a playable platformer level only.

Status: implemented with The Silver Key collectible, two checkpoints, choice-door navigation, optional echo fragments, and a cross-examination puzzle placeholder.

Definition of done: Level 6 platformer is playable, The Silver Key collectible is required, choice-door navigation works gently, and the cross-examination puzzle remains placeholder only.

## Part 14: Level 6 Cross-Examination Puzzle

Implement the real Level 6 cross-examination puzzle interlude only.

Status: implemented with a one-question cross-examination puzzle, Level 6 evidence reveal, Level 6 completion persistence, and Level 7 coming-soon unlock.

Definition of done: puzzle is readable in 5 seconds, solvable in 20-40 seconds, marks Level 6 complete only after success, and unlocks Level 7 as coming soon.

## Part 15: Level 7 Platformer Slice

Implement Level 7, The Garden of Quiet Evidence, as a playable platformer level only.

Status: implemented with The Lantern collectible, one checkpoint, lantern-switch reveal platforms, optional quiet evidence fragments, and a pattern-repeat puzzle placeholder.

Definition of done: Level 7 platformer is playable, The Lantern collectible is required, lantern-switch traversal works gently, and the pattern-repeat puzzle remains placeholder only.

## Part 16: Level 7 Pattern-Repeat Puzzle

Implement the real Level 7 pattern-repeat puzzle interlude only.

Status: implemented with a four-lantern pattern-repeat puzzle, Level 7 evidence reveal, Level 7 completion persistence, and Level 8 coming-soon unlock.

Definition of done: puzzle is readable in 5 seconds, solvable in 20-40 seconds, marks Level 7 complete only after success, and unlocks Level 8 as coming soon.

## Part 17: Level 8 Platformer Slice

Implement Level 8, The Tower of Arguments, as a playable platformer level only.

Status: implemented with The Blue Ribbon collectible, two checkpoints, three slow vertical elevators, optional argument fragments, and an argument-builder puzzle placeholder.

Definition of done: Level 8 platformer is playable, The Blue Ribbon collectible is required, vertical ascent remains safe and forgiving, and the argument-builder puzzle remains placeholder only.

## Part 18: Level 8 Argument-Builder Puzzle

Implement the real Level 8 argument-builder puzzle interlude only.

Status: implemented with a one-question argument-builder puzzle, Level 8 evidence reveal, Level 8 completion persistence, and Level 9 coming-soon unlock.

Definition of done: puzzle is readable in 5 seconds, solvable in 20-40 seconds, marks Level 8 complete only after success, and unlocks Level 9 as coming soon.

## Part 19: Level 9 Platformer Slice

Implement Level 9, The Rooftops Before the Verdict, as a playable platformer level only.

Status: implemented with The Unfinished Letter collectible, three checkpoints, moving platforms, a rebuild trigger, lantern reveal paths, and an evidence-linking puzzle placeholder.

Definition of done: Level 9 is the exam/synthesis platformer slice, combines prior mechanics safely, requires The Unfinished Letter, and keeps the evidence-linking puzzle as a placeholder.

## Part 19.5: Developer Level Tuning Overlay

Implement a developer-only platformer tuning overlay for inspecting coordinates, bounds, checkpoints, and runtime level objects.

Status: implemented as a dev/test-only tool with direct platformer spawn routes, F1 overlay, grid, bounds, labels, object selection, runtime nudging, and coordinate/snippet copy helpers.

Definition of done: the tool speeds coordinate tuning without appearing in production play, changing save schema, or writing source files automatically.

## Part 20: Level 9 Evidence-Linking Puzzle

Implement the real Level 9 evidence-linking puzzle interlude only.

Status: implemented with a six-link evidence-linking puzzle, Level 9 evidence reveal, Level 9 completion persistence, and Level 10 finale platformer unlock.

Definition of done: puzzle is readable in 5 seconds, solvable in 20-40 seconds, marks Level 9 complete only after success, and prepares Level 10 for the final playable slice.

## Part 21: Level 10 Finale Platformer Slice

Implement Level 10, The Court of the Heart, as a playable finale platformer level only.

Status: implemented with a ceremonial finale route, two checkpoints, familiar light/rebuild/moving mechanics, previous-clue memory markers, The Heart Seal collectible, and handoff to the Level 10 puzzle.

Definition of done: Level 10 is ceremonial, easier than Level 9, requires The Heart Seal, and hands off to the final-letter-assembly puzzle.

## Part 22: Final Letter Assembly And Verdict

Implement the real Level 10 final-letter-assembly puzzle and final verdict ending.

Status: implemented with a 10-word final-letter ordering puzzle, FinalVerdictScene, game completion save state, Level 10 replay state, and simple credits scene.

Definition of done: Level 10 completion and whole-game completion happen only after the final puzzle succeeds and the verdict lands cleanly.

## Part 23: Full-Game QA And Balancing Pass

Perform full-game QA, balancing review, mobile/readability inspection, save/progression regression checks, dev-tool regression checks, and release-readiness documentation.

Status: implemented with a contained save-normalization fix, content/credits proofreading, expanded regression tests, updated QA documentation, and a release-readiness report.

Definition of done: core flows, puzzles, saves, dev tooling, typecheck, unit tests, build, and e2e smoke tests are verified or honestly documented with remaining manual-device risks.

## Part 24: Visual/Audio Polish And Gift Presentation Pass

Improve presentation, readability, small procedural feedback sounds, credits hygiene, and release polish without adding new gameplay, story arcs, external assets, or private content.

Status: implemented with polished DOM/Phaser presentation details, clearer platformer markers, procedural WebAudio tones, mute-aware audio behavior, updated credits, and focused AudioManager tests.

Definition of done: the game feels more coherent and gift-like while preserving final verdict text, save/progression, mobile playability, dev tooling, and no-external-asset safety.

## Future Level Production

Produce the second half of the game and finale traversal.

Definition of done: Levels 6-10 are complete, Level 9 is the hardest, Level 10 is celebratory and easier.

## Final Verdict And Ending

Implement the final letter assembly, verdict scene, ending flow, and birthday message.

Definition of done: the final twist lands clearly and preserves the exact verdict text.

## Polish, Mobile QA, Credits, Deploy

Add final assets, audio if desired, credits, mobile testing, accessibility checks, performance pass, and deployment.

Part 25 status: production deployment preparation is implemented with a preview script, configurable static base path, deployment guide, final release checklist, optional manual GitHub Pages workflow, privacy/credits review, and production dev-tool safety documentation.

Next focus: final real-device QA on the production build, then optional personal gift customization planning.

Definition of done: `dist/` is ready to deploy, credits are complete, mobile landscape play is verified, and emotional QA passes.

## Puzzle Redesign Phase

The puzzle layer is being redesigned into a coherent family of tactile case-file puzzles. The platformer levels remain unchanged; the interlude layer evolves away from unrelated form-like mini-games into visual, mobile-friendly manipulation puzzles connected to each exhibit theme.

### Part 26: Case Mosaic Foundation And Level 1 Redesign

Status: implemented with a reusable Case Mosaic module, data-driven Level 1 sealed-envelope mosaic content, pure tap-to-place/swap logic, mobile-friendly DOM board UI, visual procedural envelope pieces, and Level 1 routing to Case Mosaic. The earlier Evidence Board and Case Board modules remain as legacy/fallback code only.

Definition of done: Level 1 uses the new board, old puzzle modules remain available for Levels 2-10, save/progression is unchanged, and focused tests/smoke coverage pass.

### Part 27: Case Timeline And Level 2 Redesign

Status: implemented with a reusable Case Timeline module, data-driven Level 2 Golden Stamp timeline content, pure tap-to-place/swap sequencing logic, mobile-friendly DOM tram-line UI, route glow feedback, and Level 2 routing to Case Timeline. The old calendar-sequence module remains as legacy/fallback code.

Definition of done: Level 2 uses the new tram timeline, Level 1 Case Mosaic remains intact, Levels 3-10 keep their existing puzzle modules, save/progression is unchanged, and focused tests/smoke coverage pass.

### Part 27.5: Drag-And-Drop Puzzle Interaction Revision

Status: implemented with a shared pointer-event drag/drop helper for the redesigned DOM puzzles, drag-first interaction for Level 1 Case Mosaic and Level 2 Case Timeline, highlighted drop targets, lifted ghost previews, invalid-drop safety, tray return support, and preserved tap-to-place fallback.

Definition of done: Level 1 and Level 2 feel more tactile without becoming drag-only, mobile completion remains possible through touch drag or tap fallback, and save/progression remains unchanged.

### Part 28: Level 3 Rebuild Puzzle And Level 4 Witness Lens

Status: implemented with a reusable Rebuild Puzzle module for Level 3 and a reusable Witness Lens module for Level 4. Level 3 now repairs a 3x2 Red Brick street frame with draggable/rotatable pieces; Level 4 now uses a draggable evidence lens and contradiction stamp with tap fallback. The old reconstruction and contradiction modules remain as legacy/fallback code.

Definition of done: Levels 1-2 redesigned puzzles remain intact, Levels 3-4 use distinct tactile mechanics, Levels 5-10 keep their existing puzzle modules, save/progression is unchanged, and focused tests/smoke coverage pass.

### Part 29: Convert Level 5 And Level 6

Status: implemented with a reusable Archive Detail Finder module for Level 5 and a reusable Echo Path module for Level 6. Level 5 now uses a draggable magnifier and bookmark tab to find generous hidden detail zones on a procedural archive page. Level 6 now uses draggable question tiles, a glowing Trust door, and a draggable Silver Key. Old memory-match and cross-examination modules remain as legacy/fallback code.

Definition of done: Levels 1-4 redesigned puzzles remain intact, Levels 5-6 use distinct tactile mechanics, Levels 7-10 keep their existing puzzle modules, save/progression is unchanged, and focused tests/smoke coverage pass.

### Part 30: Convert Levels 7-10

Status: implemented with reusable Lantern Sequence, Argument Tower, Case Constellation, and Final Verdict Assembly modules. Level 7 now uses a calm flame-and-lantern sequence, Level 8 builds a stable argument tower, Level 9 completes a synthesis constellation of prior exhibits, and Level 10 assembles the ceremonial final seal before routing to the existing FinalVerdictScene. Old pattern-repeat, argument-builder, evidence-linking, and final-letter-assembly modules remain as legacy/fallback code.

Definition of done: Levels 1-6 redesigned puzzles remain intact, Levels 7-10 use distinct tactile mechanics with tap fallback, final verdict text and completion flow remain unchanged, and focused tests/smoke coverage pass.

### Part 31: Retire Old Puzzle Modules

Status: implemented by removing old form-like puzzle types from active PuzzleRegistry/PuzzleScene runtime routing, narrowing the content puzzle type list to the 10 redesigned tactile puzzles, and keeping old source folders only as archived legacy code for later deletion. Full puzzle smoke coverage now exercises the redesigned Level 1-10 routes.

Definition of done at the time: all 10 then-active levels routed to redesigned tactile puzzles, retired puzzle types fell back safely as unsupported, save/final-verdict/dev-tool behavior remained unchanged, and typecheck/unit/build/e2e verification passed. After Part 42G, those old level routes are retained as legacy dev/test routes behind the 6-chapter player-facing archive.

### Part 32: Visual Novel Layer

Status: implemented with a lightweight data-driven VisualNovelScene, typed VN content, Level 1 intro/pre-puzzle/post-puzzle scenes, normal Level 1 flow insertion, and dev/test VN routes.

Definition of done: Level 1 story beats enrich the flow without changing save schema, puzzle mechanics, final verdict text, direct QA routes, or Levels 2-10.

### Part 33: Expand VN Scenes To Levels 2-5

Status: implemented with concise data-driven intro, pre-puzzle, and post-puzzle VN scenes for Levels 2-5. Level Select routes playable Levels 2-5 through their intro scenes, while direct platformer/puzzle dev routes still bypass VN for QA.

Definition of done: Levels 1-5 now have VN story beats without changing save schema, puzzle mechanics, final verdict text, external assets, or Levels 6-10.

### Part 34: Expand VN Scenes To Levels 6-10

Status: implemented with concise data-driven intro, pre-puzzle, and post-puzzle VN scenes for Levels 6-10. Level 10 now uses a short post-puzzle VN bridge into FinalVerdictScene while preserving the approved verdict text and Accept Verdict completion boundary.

Definition of done: Levels 1-10 now have VN story beats without changing save schema, puzzle mechanics, final verdict text, or external asset policy.

### Part 35: VN QA And Pacing Pass

Status: implemented with a full Level 1-10 VN pacing and readability pass, small dialogue trims, mobile-landscape panel tightening, stronger VN content guardrail tests, and updated QA documentation.

Definition of done: VN scenes remain concise, skippable, stateless, mobile-safe, and supportive of the final verdict rather than competing with it.

### Part 36: VN Presentation Polish

Status: implemented with procedural placeholder portrait slots, per-level CSS background variants, speaker layout polish, short-height mobile safeguards, and pure presentation helper tests. No real portraits, photos, generated character art, external assets, voice, or music were added.

Definition of done: VN scenes feel more visually structured while remaining concise, skippable, stateless, mobile-safe, and compatible with existing platformer, puzzle, save, and final verdict flow.

### Part 37: Final Visual Style Strategy

Status: implemented with a current visual audit, final art direction, browser/GitHub Pages asset budget, loading strategy, license/privacy policy, performance risk notes, and a prioritized asset replacement plan.

Definition of done: final polish now has a documented visual direction and size budget before any heavy art, music, external assets, generated portraits, or private photos are added.

### Part 38: Final Art Placeholder Upgrade Pass

Next focus: improve visuals using procedural or lightweight self-created assets only: UI frames, exhibit icons, level motifs, puzzle board polish, and final verdict seal. Do not add external images yet.

### Later: Puzzle QA And Balancing

Continue hands-on puzzle QA for readability, mobile drag comfort, clue clarity, emotional tone, and full-game pacing after the VN foundation lands.
