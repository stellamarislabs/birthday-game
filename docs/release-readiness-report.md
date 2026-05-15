# Release Readiness Report

## Current Status

The core birthday-game loop is implemented end to end:

- The normal player-facing Case Archive is now a six-chapter game: The Sealed Envelope, The Hidden Wall, The River Witness, The Archive of Corrections, The Door of Trust, and The Court of the Heart.
- Retained Levels 1-10 platformer routes still exist as bridge/dev/source material and are reachable through chapter wrappers or dev/test routes.
- The active chapter puzzle wrappers use the redesigned tactile puzzle family while old Level 1-10 puzzle routes remain available for dev/testing.
- Active chapter VN scenes are implemented with placeholder portrait/background presentation; old level VN scenes remain available for dev/testing.
- Part 37 visual strategy and asset-budget planning are documented before final art production.
- Evidence reveals, FinalVerdictScene, Case Archive, settings, reset confirmation, credits, save/progression, and `gameCompleted` are implemented.
- Full visual consistency QA has aligned visible player-facing fallback copy, VN background tones, HUD label colors, and secondary UI chrome with the current main menu art direction.
- The developer level tuning overlay and dev override persistence remain available in dev/test mode.
- Dev-2 upgrades that tooling into a small dev-only level editor for static platform add/duplicate/delete/snap workflows. The editor writes only `dev-level-overrides/` JSON through the Vite serve middleware; it does not edit canonical geometry, player saves, puzzles, story, or production runtime behavior.
- Dev-3 adds a dev-only selected-object property inspector for precise x/y/size/label tuning, dirty/source/status display, focused-input shortcut safety, and clearer Revert Unsaved / Revert Override / Delete Object separation. It remains an override authoring tool and is not part of production player flow.
- Dev-4 adds dev-only moving platform/elevator path tuning with editable axis/speed/from-to fields, path preview handles, snap-aware endpoint movement, and v2 override persistence. Moving-platform duplication/deletion remains deferred; production player flow remains editor-free.
- Dev-5 adds dev-only checkpoint respawn editing, clue/interactable and exit positioning support, selected-object support validation, and linked checkpoint respawn markers while keeping clue identity and exit targets read-only.
- Dev-6 adds a dev-only level-wide validation overlay for unsupported objects, checkpoint/respawn safety, ids, dimensions, bounds, and moving-platform authoring issues.
- Dev-6.5 adds `docs/dev-editor-workflow.md` as the recommended level-polish workflow and confirms the next tooling need is workflow safety polish, not broader object editing.
- Dev-7 adds dev-only undo/redo, an override summary panel, reset current level overrides, JSON override export, and validated JSON import. These tools remain override-authoring safety features only and do not edit canonical geometry, player saves, puzzles, story, or production player flow.
- No final external art files, audio files, fonts, photos, voice, private messages, or personal assets have been added.

## Current Six-Puzzle Readiness

The current active chapter puzzle set is:

- Chapter 1: `Case Mosaic: The Sealed Envelope`.
- Chapter 2: `Route Tile Puzzle: The Hidden Wall`.
- Chapter 3: `Deposition Order: The Witness Note`.
- Chapter 4: `Case File Sorting: No. Given.`.
- Chapter 5: `Trust Door Light Path`.
- Chapter 6: `Final Seal: The Court of the Heart`.

Part 45G-R2 adds regression coverage for the full set: desktop click/tap completion, mobile-landscape tap fallback completion, no document scroll, clue-reveal/final-verdict routing, and the boundary that `gameCompleted` is written only after Accept Verdict. The remaining puzzle-layer release risk is real-device feel and timed human playthrough pacing rather than known routing or save bugs.

Post-46B puzzle QA refresh confirms the redesigned puzzle layer still fits the final 10-15 minute pacing model after the platformer rebuilds. New content coverage checks target duration bands, payoff terms, concise instructions, and prevents active Chapter 3-6 puzzle copy from drifting back to Witness Lens, Archive Detail Finder, Echo Path, ten-fragment final-puzzle, or pre-verdict "The Heart, Freely Given" language.

Puzzle asset polish is proceeding one chapter at a time without changing mechanics. Chapter 1 Case Mosaic now uses sliced final envelope-piece art. Chapter 2 Hidden Wall detects and displays its final decorative background, tile shell, and marker assets while preserving dynamic route-line SVG logic. Chapter 3 Deposition Order now detects its final background, witness-note paper, and statement strip shell assets; the current build displays the background and witness-note paper but intentionally bypasses the strip-shell image in favor of cleaner CSS-rendered parchment strips. Part 50I-R1 verifies Chapter 4 Case File Sorting with its final background, archive-board, document-shell resolver, and Silver Key assets while keeping document sorting, drag/drop, mobile tap placement, Silver Key gating, text, routing, save/progression, and final verdict behavior unchanged. The document-shell image is intentionally bypassed in active presentation for readability, with CSS-rendered parchment cards used instead. Part 50K verifies Chapter 5 Trust Door Light Path with its final decorative background, trust board, lantern-source, and Trust-door-target art while keeping question selection, mirror rotation, dynamic light path, text, routing, save/progression, and final verdict behavior unchanged; a mobile progress-row adjustment keeps the final art layout no-scroll in landscape. Part 50M verifies Chapter 6 Final Seal with its final decorative background, seal-board, and heart-core art while keeping the tap-rotated rings, clue lights, Unlock Verdict flow, FinalVerdictScene routing, save/progression, and approved final verdict text unchanged; desktop and mobile-landscape checks remain no-scroll and readable. The Silver Key source has a baked light background; CSS blending reduces the square, but a transparent-background key export remains recommended.

## Current Platformer Readiness

Part 46A-R2 structurally rebuilds the active six chapter platformer routes while preserving the 10-15 minute target, puzzle mechanics, save/progression schema, dev routes, and final verdict boundary:

- Chapter 1 now has lower desk traversal, a bookcase/file-shelf climb, upper shelf crossing, descent, and envelope/key/ticket destination.
- Chapter 2 now has tram movement, elevated route signage, rebuilt street climb, a slow hidden-wall lift, upper wall crossing, and Vistula wave-mark handoff.
- Chapter 3 now has drifting papers, upper bridge beam, bridge-shadow descent, witness-note destination, and archive-code exit path.
- Chapter 4 now has lower archive aisle, shelf climb, upper stacks, drawer/lift beat, lower file aisle, marginal-note/file-spine climb, and silver-key/courthouse handoff.
- Chapter 5 now has Trust balcony, lantern descent, wide slow elevators, blue-ribbon pages, unfinished-letter destination, and generous checkpoints.
- Chapter 6 now has a fuller lower-rooftop climb through parapets/chimneys, an upper skyline path, a safe roof-gap descent, clue-memory synthesis, wide floating court ascent, final court, heart seal, and final door.

Automated geometry coverage now verifies stronger active-route verticality, updated duration metadata, Chapter 2 wall-lift specs, Chapter 5 elevator coverage, Chapter 6 rooftop climb/descent, supported clue-memory/final-court objects, and Chapter 6 floating elevator markers. Remaining platformer risk is still human feel: one timed desktop playthrough and one real-device mobile landscape playthrough are required before sharing.

`docs/level-polish-workflow.md` now provides the focused manual dev-editor workflow for the highest-risk late platformer feel checks: Chapter 5 elevator ascent, Chapter 6 rooftop/floating ascent, mobile landscape comfort, validation-marker cleanup, timing notes, and override JSON backup policy before any future geometry bake.

Bake-4 folds the audited Chapter 1 / runtime Level 1 dev-editor override into canonical platformer geometry. The baked source now includes the tuned office desk route, paper/folder steps, bookcase climb, high evidence shelf, upper return/descent, case-file desk, route marker, sealed-envelope position, and checkpoint positions. The added `ch1_dev_elevator_001` was reviewed as tutorial-friendly and necessary for the high shelf route, so it was baked as a 102px-wide, speed-28 vertical elevator. The `ch1-route-checkpoint` respawn warning was resolved by baking `respawnX: 2580` instead of the override's unsupported `2640`, so canonical validation reports 0 errors and 0 warnings. Bake-4A archives the baked override at `dev-level-overrides/archive/level-1.baked-20260510.json`, preserving rollback data while removing root `dev-level-overrides/level-1.json` from normal dev override loading so the old checkpoint respawn and duplicate added-elevator state no longer double-apply.

Bake-5 folds the audited Chapter 6 / runtime Level 9 dev-editor override into canonical platformer geometry. The baked source now includes the tuned lower rooftops, rooftop lift, bridge trigger, first/third checkpoint respawns, lower roof gap, lantern path, light bridges, Unfinished Letter ledge, clue-memory balcony, two floating court elevators, final court landing, heart seal platform, and clue marker positions. The audit warning for the 70px `final-rooftop-lift` was reviewed as a mobile-comfort risk; it was intentionally baked at 112px width with the same center path. The obsolete `ch6_rooftop_climb_mid` and `ch6_upper_skyline_path` static supports were removed after review. Bake-5A archives the baked override at `dev-level-overrides/archive/level-9.baked-20260510.json`, preserving rollback data while removing root `dev-level-overrides/level-9.json` from normal dev override loading so the stale 70px editor state no longer double-applies.

Bake-6 folds the audited Chapter 5 / runtime Level 6 dev-editor override into canonical platformer geometry. The baked source now includes the tuned courthouse corridor, moved Hope/Trust choice-door spine, Silver Key ledge, Trust threshold, lantern descent, light bridge, elevator ascent, blue-ribbon / unfinished-letter handoff, checkpoint respawns, and clue/fragment placements. The added static platforms were reviewed as intentional support/catch ledges and baked. The saved override's 82px `ch5_dev_elevator_001` and narrow `floating-brief-one` warnings were reviewed as mobile-comfort risks; both were intentionally baked at 112px width with centered path adjustments. The obsolete static supports `echo-bridge`, `ch5_lantern_lower_catch`, `ch5_elevator_waiting_ledge`, and `ch5_unfinished_letter_ledge` were removed after route review. Bake-6A archives the baked override at `dev-level-overrides/archive/level-6.baked-20260510.json`, preserving rollback data while removing root `dev-level-overrides/level-6.json` from normal dev override loading so the stale narrow editor state no longer double-applies.

Bake-7 verifies active geometry bake completion. Root override files for active runtime Levels 1, 2, 4, 5, 6, and 9 are absent, and archived rollback files exist for each baked active level. Active canonical geometry validates with 0 errors / 0 warnings in automated coverage and no longer depends on root dev-editor override JSON. The remaining root override files are `dev-level-overrides/level-3.json`, `dev-level-overrides/level-8.json`, and `dev-level-overrides/level-10.json`; these are classified as legacy/dev-only source-material overrides for old direct runtime routes, not active six-chapter platformer dependencies. Recommendation: do not bake them into the active release; decide in a separate follow-up whether to keep them in root for old route polish or move them to `dev-level-overrides/archive/legacy/`.

Bake-1 folds the audited Chapter 2 / runtime Level 2 dev-editor override into canonical platformer geometry. The baked source now includes the tuned tram platforms, hidden-wall/keyhole route support, wall lift dimensions, Golden Stamp placement, checkpoint update, rebuilt wall platforms, and removal of the obsolete `ch2_overhead_route` / `ch2_upper_wall_crossing` static route pieces. Bake-1A archives the baked override at `dev-level-overrides/archive/level-2.baked-20260510.json`, preserving rollback data while removing root `dev-level-overrides/level-2.json` from normal dev override loading.

Bake-2 folds the audited Chapter 3 / runtime Level 4 dev-editor override into canonical platformer geometry. The baked source now includes the tuned lower riverbank, bridge footing, upper bridge, high crossing, underpass descent, witness-shadow floor, Witness Note placement, witness-fragment positions, archive-code step, archive-reference bank, and checkpoint respawns. The obsolete `witness-note-ledge` static support has been removed after the override-applied geometry validated with 0 apply warnings, 0 validation errors, and 0 validation warnings. Bake-2A archives the baked override at `dev-level-overrides/archive/level-4.baked-20260510.json`, preserving rollback data while removing root `dev-level-overrides/level-4.json` from normal dev override loading.

Bake-3 folds the audited Chapter 4 / runtime Level 5 dev-editor override into canonical platformer geometry. The baked source now includes the tuned archive desk, narrowed file-cabinet climb, upper archive path, drawer gate, correction floor, marginal-note/file-spine route, Silver Key landing, checkpoint respawns, Marginal Note, Silver Key, and correction-note positions. The two audit warnings for 80px moving platforms were reviewed as mobile-comfort risks; `sliding-drawer-one` and `ch4_drawer_lift` were intentionally baked at 128px width with centered path/position adjustments, so canonical validation reports 0 errors and 0 warnings. Bake-3A archives the baked override at `dev-level-overrides/archive/level-5.baked-20260510.json`, preserving rollback data while removing root `dev-level-overrides/level-5.json` from normal dev override loading so the stale 80px editor state no longer double-applies.

## Part 47 End-To-End Readiness Audit

The current active player-facing spine is intact:

Opening start -> opening cinematic -> title/menu -> case file / Case Archive -> Chapter 1 platformer -> Case Mosaic -> Chapter 1 reveal -> Chapters 2-5 platformer/puzzle/reveal chain -> Chapter 6 platformer -> Final Seal -> FinalVerdictScene -> Accept Verdict -> Case closed.

Release-spine inspection confirms:

- The Case Archive exposes six chapters and routes them through `ACTIVE_CHAPTER_FLOWS`.
- Active platformer ids are `1, 2, 4, 5, 6, 9`; active puzzle ids are `1, 3, 4, 5, 6, 10`.
- Chapter 3 no longer uses Witness Lens, Chapter 4 no longer uses Archive Detail Finder, Chapter 5 no longer uses Echo Path, and Chapter 6 no longer requires the old ten-fragment/token placement flow in the active chapter path.
- Chapters 1-5 puzzle success routes to concise clue reveals; Chapter 6 puzzle success routes to `FinalVerdictScene`.
- `gameCompleted` is still written only after the player accepts the final verdict.
- The approved final verdict text remains unchanged.

Timing assessment:

| Segment | Current estimate |
|---|---:|
| Opening cinematic | about 26 seconds |
| Active platformers, metadata sum | 10.25-13.25 minutes |
| Active puzzles, metadata sum | about 4.4 minutes |
| VN intros / pre-puzzle lines / clue reveals / verdict reading | human-speed dependent |

The release target remains a 10-15 minute gift. The current metadata puts platformers plus puzzle targets at roughly 14.7-18.1 minutes before human reading variance. Automated tests prove routing and interaction coverage, not true playtime. This makes timing the main release uncertainty: a practiced or fast-reading run may still sit near the target, but a first-time human playthrough can plausibly exceed 15 minutes unless route completion is faster than the conservative metadata.

Readiness classification after Part 47:

- Critical blockers: none known.
- High blockers: none known from automated route, save, puzzle, or final-verdict coverage.
- Medium blockers before sharing: one timed human desktop playthrough on a production build; one real-device mobile landscape playthrough on iPhone Safari and Android Chrome; subjective Chapter 5/6 elevator/floating-platform feel; final total runtime if the timed pass exceeds 15 minutes.
- Low/non-blocking: known large Phaser bundle warning; retained legacy/dev routes and old save key naming; historical docs/source notes still reference older project phases where relevant; no final visual/audio assets yet.

Final asset generation can begin in scoped passes only if the remaining manual risk is explicitly accepted. The gift should not be shared as release-ready until the timed human pass and real-device mobile pass are complete.

## Part 47B Timed Playthrough And Real-Device QA Protocol

Part 47B adds `docs/timed-playthrough-protocol.md` as the manual release gate for pacing and real-device feel before final visual asset generation.

Current manual status:

- Timed desktop production-preview playthrough: not completed yet.
- Real iPhone Safari landscape playthrough: not completed yet.
- Real Android Chrome landscape playthrough: not completed yet.
- Optional browser-emulator spot checks: automated coverage exists, but it is not a substitute for real devices.

The protocol requires:

- Reset save through the player UI before official runs.
- Start timing when pressing Start / Open Case.
- Stop timing after Accept Verdict and the Case Closed state.
- Record opening, chapter, platformer, puzzle, reveal, final verdict, total time, fun score, frustration score, mobile comfort, and notes.
- Test production preview with console/network checks and dev-tool safety checks.
- Use dev helper routes only for spot checks, never as a replacement for the official timed flow.

Remaining risks before final asset generation:

- Total runtime may exceed the 10-15 minute target.
- Chapter 5 elevator touch feel may still be weaker on real phones than in emulation.
- Chapter 6 rooftop/floating ascent may still feel different on real phones than in automated smoke tests.
- iPhone Safari and Android Chrome may expose viewport, browser chrome, touch, or no-scroll quirks.
- The known large Phaser bundle warning remains.
- Placeholder visuals remain until the asset pass begins.

Asset work recommendation: proceed to final visual asset generation only after one timed desktop playthrough and one real-phone landscape playthrough, or after knowingly accepting those risks for a limited art-planning pass.

## Part 48B Final Asset Readiness Plan

Part 48B prepares the first final visual asset pass without generating or integrating images. The first target is `public/assets/final/opening-main-menu-office-desk.webp`, a 1920x1080 optimized WebP background for the opening start screen and/or main menu.

Readiness status:

- Final art direction is locked as elegant cinematic 2D storybook illustration for a romantic legal mystery, with warm Warsaw atmosphere, premium hidden-object mood, deep navy shadows, parchment, antique gold, burgundy leather, soft amber light, and subtle rose accents.
- The first prompt and negative prompt are documented in `docs/visual-asset-prompt-plan.md`.
- Asset pipeline rules remain one image at a time: generate externally, review, optimize to WebP, integrate in a separate Codex pass, keep UI/story text rendered by code, update credits, and rerun build/test/e2e checks.
- Browser budget remains conservative: target 300-700 KB for the optimized opening/menu background, accept up to about 1 MB only after build-size review, and avoid 4K or large PNG backgrounds.
- No image files, runtime code, story text, puzzle mechanics, platformer geometry, dev overrides, or save/progression data are changed in Part 48B.

Remaining risk after this planning pass: final image quality, desktop/mobile crop, title/button contrast, asset size after optimization, and the existing timed-playthrough / real-device mobile QA gates.

## Part 48B Platformer HUD/Text Cleanup

Normal platformer gameplay now hides persistent world labels and debug-like helper text so final backgrounds and object art can read cinematically. Geometry `label` data remains intact for the dev editor and future tooling, but platform names, object ids, checkpoint labels, clue/interactable names, and long tutorial labels are not shown in the normal player playfield.

Persistent sound and keyboard-control HUD text is also disabled in normal platformer play. Mute, pause, checkpoint, clue, and exit feedback remain brief and contextual, while mobile landscape keeps the concise Left, Right, and Jump touch controls. The F1 dev overlay remains the place for labels, object inspection, validation markers, and editor diagnostics.

No geometry, puzzles, story/VN/final verdict text, dev override files, save/progression schema, or assets changed in this cleanup pass. Remaining visual-readiness risk is now focused on actual final art quality, platformer object readability after assets land, and the existing timed-playthrough / real-device mobile QA gates.

## Part 49A-R2 Opening Cinematic Asset Integration

The active opening cinematic now uses the seven approved WebP frames in `public/assets/final/opening/`:

- `Opening01.webp` through `Opening07.webp` are mapped to the existing seven opening beats in order.
- The active scene is movie-style and frame-led: VN panels, speaker nameplates, character cards, title overlays, procedural placeholder panels, and large controls are hidden from the cinematic.
- Part 49A-R3 restores the seven captions as visible code-rendered cinematic intertitles while keeping matching accessible/status text.
- Crossfades and a subtle slow drift provide motion; reduced-motion mode disables the drift and uses simpler transitions.
- Asset loading is scene-scoped and base-path-safe through public URLs, with a dark fallback if a frame fails.

No main menu background, VN scene images, platformer visuals, puzzle art, gameplay, geometry, story/final verdict text, save/progression schema, or dev routes changed in this pass.

Remaining visual-readiness risks: subjective crop/composition on real devices, future main menu/VN/puzzle/platformer art integration, and the existing timed desktop plus real-device mobile landscape release gates.

## Part 49A-R3 Opening Cinematic Captions

The opening cinematic remains a full-screen seven-frame WebP movie sequence, but the seven beat captions are visible again as code-rendered cinematic intertitles. The captions use the existing opening content, including the fixed desk beat "Maria takes her place at the desk." and a single final "The case file opens." beat.

Presentation policy:

- Captions are large warm-ivory serif text with strong deep-shadow readability support and a subtle lower-screen gradient.
- Captions fade in shortly after each image and fade before the next crossfade.
- Reduced-motion mode removes the drift/zoom and keeps caption transitions simple.
- VN dialogue panels, speaker nameplates, character cards, parchment boxes, title overlays, and large controls remain absent from the opening cinematic.

No images were generated, edited, or recompressed, and no gameplay, geometry, puzzle, VN chapter, final verdict, save/progression, main menu, or chapter asset integration changed in this pass.

## Part 49B Case File And First VN Image Integration

Part 49B integrates the first designed case-file and VN image-backed screens:

- `src/assets/final/CaseFileFrame01.webp` is the visible first Case File screen after Open Case.
- `src/assets/final/FirstNovel01.webp`, `FirstNovel02.webp`, and `FirstNovel03.webp` are the visible pages for `vn-chapter-1-intro`.
- The underlying active `vn-chapter-1-intro` text now matches those three images: `Case No. 16/05 — The Missing Heart.`, the narrator birthday-envelope line, and Maria's key/ticket/warning line.
- Image-backed screens use contained full-screen image display on a dark background so baked title, frame, panel, speaker, dialogue, counter, and Continue text are not cropped.
- The old coded CaseFile paper and old VN dialogue card, speaker portrait/nameplate, Skip button, Continue button, and duplicate visible text are hidden only for these image-backed screens.
- Other VN scenes still use the existing coded VN layout.

Opening cinematic, main menu background, platformer geometry, puzzles, final verdict text, save/progression schema, and legacy/dev routes are unchanged.

## Part 49C Chapter 2 VN Image Integration

Part 49C integrates the next Chapter 2 image-backed VN screens:

- `src/assets/final/SecondNovel01.webp`, `SecondNovel02.webp`, and `SecondNovel03.webp` are the visible pages for `vn-chapter-2-intro`.
- `src/assets/final/HiddenWallPuzzleNovel01.webp` is the visible page for `vn-chapter-2-before-puzzle`.
- The underlying Chapter 2 intro metadata remains aligned with the designed images: the tram ticket moving-light line, the stamped-route wall line, and Maria's key-turn line.
- The Hidden Wall pre-puzzle metadata remains aligned with the designed image: `Turn the tiles until the stamped route reaches the wall.`
- These scenes use the existing image-backed VN mode, so the old coded dialogue card, speaker portrait/nameplate, Skip button, Continue button, and duplicate visible text are hidden only for mapped image-backed scenes.
- Continue/Enter/tap still routes `vn-chapter-2-intro` to Chapter 2 platformer and `vn-chapter-2-before-puzzle` to the Route Tile Puzzle.

Opening cinematic, Case File / First Novel assets, main menu background, platformer geometry, puzzles, final verdict text, save/progression schema, and legacy/dev routes are unchanged.

## Part 49D Chapter 3 And Chapter 4 Intro VN Image Integration

Part 49D integrates two more image-backed intro VN groups:

- `src/assets/final/ThirdNovel01.webp`, `ThirdNovel02.webp`, and `ThirdNovel03.webp` are the visible pages for `vn-chapter-3-intro`.
- `src/assets/final/ForthNovel01.webp`, `ForthNovel02.webp`, and `ForthNovel03.webp` are the visible pages for `vn-chapter-4-intro`; the `ForthNovel` spelling matches the committed asset names.
- The underlying Chapter 3 intro metadata is aligned with the designed images: the Vistula witness-note handoff, the witness line about asking correct questions, and Maria noticing there is more to the case.
- The underlying Chapter 4 intro metadata is aligned with the designed images: the archive drawer, the smaller-than-the-question clue, and Maria committing to read the documents carefully.
- The existing image-backed VN mode hides the old coded dialogue card, speaker portrait/nameplate, Skip button, Continue button, and duplicate visible text only for mapped image-backed scenes.
- Continue/Enter/tap still routes `vn-chapter-3-intro` to Chapter 3 platformer and `vn-chapter-4-intro` to Chapter 4 platformer.

Opening cinematic, Case File / First Novel assets, Second Novel / Hidden Wall assets, main menu background, platformer geometry, puzzles, final verdict text, save/progression schema, and legacy/dev routes are unchanged.

## Part 49E Chapter 4 Pre-Puzzle And Chapter 5 Intro VN Image Integration

Part 49E integrates the next image-backed VN scenes:

- `src/assets/final/MarginalNotePuzzleNovel01.webp` is the visible page for `vn-chapter-4-before-puzzle`.
- `src/assets/final/FifthNovel01.webp`, `FifthNovel02.webp`, and `FifthNovel03.webp` are the visible pages for `vn-chapter-5-intro`.
- The underlying Chapter 4 pre-puzzle metadata is aligned with the designed image: `The original case says the heart was taken. But the details say otherwise.`
- The underlying Chapter 5 intro metadata is aligned with the designed images: the silver-key courthouse line, the Trust-door question line, and Maria's key/question line.
- The existing image-backed VN mode hides the old coded dialogue card, speaker portrait/nameplate, Skip button, Continue button, and duplicate visible text only for mapped image-backed scenes.
- Continue/Enter/tap still routes `vn-chapter-4-before-puzzle` to the Chapter 4 Case File Sorting puzzle and `vn-chapter-5-intro` to Chapter 5 platformer.

Opening cinematic, Case File / earlier VN image assets, main menu background, platformer geometry, puzzles, final verdict text, save/progression schema, and legacy/dev routes are unchanged.

## Part 31 Puzzle Redesign QA Status

Part 31 retired old form-like puzzle types from active runtime routing and confirmed the then-current tactile puzzle map:

- Level 1: Case Mosaic.
- Level 2: Case Timeline.
- Level 3: Rebuild Puzzle.
- Level 4: Witness Lens.
- Level 5: Archive Detail Finder.
- Level 6: Echo Path.
- Level 7: Lantern Sequence.
- Level 8: Argument Tower.
- Level 9: Case Constellation.
- Level 10: Final Seal.

This section is historical. Parts 45B-R2 through 45G-R2 supersede the active chapter puzzle family with the current six-puzzle set above while retaining old source/dev routes where documented.

## Part 25 Release Package Status

Part 25 prepared the production deployment package without adding gameplay/content scope:

- Added `npm run preview` for production-like static smoke testing.
- Added `VITE_BASE_PATH` support in Vite with a portable `./` default.
- Added deployment documentation for GitHub Pages, Vercel, Netlify, and itch.io HTML5 ZIP.
- Added `docs/final-release-checklist.md` for final share-link QA.
- Added an optional manual GitHub Pages workflow that runs typecheck, unit tests, and build before publishing `dist/`.
- Hardened PlatformerScene so debug editor and dev override client code are dynamically loaded only in dev/test mode.
- Verified production build output and production-preview dev-write safety.

## Build And Test Results

Bake-1A Chapter 2 override archive verification:

- Canonical Level 2 was checked against the archived Bake-1 override before archiving: all 18 modified object values matched, `ch2_overhead_route` and `ch2_upper_wall_crossing` were absent from canonical geometry, Chapter 2 validation reported 0 errors / 0 warnings, and the exit still targets `PuzzleScene` level 2.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 692 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-2 Chapter 3 canonical geometry verification:

- Canonical Level 4 was checked against `dev-level-overrides/level-4.json` after baking: all 13 modified object values matched, `witness-note-ledge` was absent from canonical geometry, Chapter 3 validation reported 0 errors / 0 warnings, and the exit still targets `PuzzleScene` level 4.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 693 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-2A Chapter 3 override archive verification:

- Canonical Level 4 was checked against the archived Bake-2 override before archiving: all 13 modified object values matched, `witness-note-ledge` was absent from canonical geometry, Chapter 3 validation reported 0 errors / 0 warnings, and the exit still targets `PuzzleScene` level 4.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 693 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-3 Chapter 4 canonical geometry verification:

- Canonical Level 5 was baked from `dev-level-overrides/level-5.json` with all 22 modified object edits applied, except `sliding-drawer-one` and `ch4_drawer_lift` were intentionally widened from the override's 80px warning width to 128px for mobile comfort while preserving their center/path relationship. Chapter 4 validation reports 0 errors / 0 warnings, and the exit still targets `PuzzleScene` level 5.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 694 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-3A Chapter 4 override archive verification:

- Canonical Level 5 was checked after archiving the root override: `sliding-drawer-one` and `ch4_drawer_lift` remain 128px wide in canonical geometry, Chapter 4 validation reports 0 errors / 0 warnings, the exit still targets `PuzzleScene` level 5, root `dev-level-overrides/level-5.json` is absent, and `dev-level-overrides/archive/level-5.baked-20260510.json` is preserved for rollback.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 695 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-4 Chapter 1 canonical geometry verification:

- Canonical Level 1 was baked from `dev-level-overrides/level-1.json` with all 14 modified object edits applied. The added `ch1_dev_elevator_001` was baked as a 102px-wide, speed-28 vertical tutorial elevator, and the checkpoint support warning was resolved by baking `ch1-route-checkpoint.respawnX` at `2580` instead of the override's unsupported `2640`. Chapter 1 validation reports 0 errors / 0 warnings, and the exit still targets `PuzzleScene` level 1.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 696 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-4A Chapter 1 override archive verification:

- Canonical Level 1 was checked after archiving the root override: `ch1_dev_elevator_001` remains canonical with width 102, speed 28, and vertical travel from `fromY: 233` to `toY: 357`; `ch1-route-checkpoint.respawnX` remains 2580; Chapter 1 validation reports 0 errors / 0 warnings; root `dev-level-overrides/level-1.json` is absent; and `dev-level-overrides/archive/level-1.baked-20260510.json` is preserved for rollback.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 697 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-5 Chapter 6 canonical geometry verification:

- Canonical Level 9 was baked from `dev-level-overrides/level-9.json` with all 30 modified object edits applied, except `final-rooftop-lift` was intentionally widened from the override's 70px warning width to 112px for mobile comfort while preserving its center path. The obsolete `ch6_rooftop_climb_mid` and `ch6_upper_skyline_path` static supports were removed after review. Chapter 6 validation reports 0 errors / 0 warnings, and the exit still targets `PuzzleScene` level 9.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 698 tests. The first sandboxed runs hit `spawn EPERM` while starting esbuild/Vite workers; two intermediate geometry-support assertions were corrected before the passing run.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation with a longer timeout; 35 passed and 9 expected skips. The first escalated e2e attempt timed out before returning results.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-5A Chapter 6 override archive verification:

- Canonical Level 9 was checked after archiving the root override: `final-rooftop-lift` remains canonical with width 112, `x/fromX: 4379`, and `toX: 4539`; `ch6_rooftop_climb_mid` and `ch6_upper_skyline_path` remain absent; Chapter 6 validation reports 0 errors / 0 warnings; root `dev-level-overrides/level-9.json` is absent; and `dev-level-overrides/archive/level-9.baked-20260510.json` is preserved for rollback.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 699 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation with a longer timeout; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-6 Chapter 5 canonical geometry verification:

- Canonical Level 6 was baked from `dev-level-overrides/level-6.json` with all 35 modified object edits applied. Added platforms `ch5_dev_platform_001`, `ch5_dev_platform_002`, and `ch5_dev_platform_003` were reviewed as intentional choice-door support/catch ledges and baked. Added elevator `ch5_dev_elevator_001` was intentionally widened from the override's 82px warning width to 112px with its center path preserved at `x/fromX/toX: 2376`. `floating-brief-one` was intentionally widened from the narrow override value to 112px with centered path values `x: 2171`, `fromX: 2111`, and `toX: 2289`. Obsolete supports `echo-bridge`, `ch5_lantern_lower_catch`, `ch5_elevator_waiting_ledge`, and `ch5_unfinished_letter_ledge` were removed after route review. Chapter 5 validation reports 0 errors / 0 warnings, and the exit still targets `PuzzleScene` level 6.
- Bake-6A archived root `dev-level-overrides/level-6.json` to `dev-level-overrides/archive/level-6.baked-20260510.json`; canonical Level 6 was rechecked after archiving and keeps the 112px `ch5_dev_elevator_001`, 112px `floating-brief-one`, baked added supports, moved choice doors, removed obsolete support IDs, and 0 error / 0 warning validation without the root override.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 701 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed with 47 test files / 701 tests. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Bake-7 active bake completion audit:

- Active baked root overrides are absent for runtime Levels 1, 2, 4, 5, 6, and 9. Archived rollback files are present for all six active runtime levels under `dev-level-overrides/archive/`.
- Remaining root overrides are limited to `level-3.json`, `level-8.json`, and `level-10.json`. Inventory: `level-3.json` has one modified checkpoint and no additions/deletions; `level-8.json` has eight modified old argument-tower objects and no additions/deletions; `level-10.json` has eight modified old finale-platformer objects and one deleted static support id. All three are retained legacy/dev-only old runtime route overrides and are not active player-facing platformer dependencies.
- Recommendation: do not bake legacy root overrides into the active release. Keep them as old-route polish for now, or use a separate follow-up to archive them under `dev-level-overrides/archive/legacy/` if reducing root-folder ambiguity becomes more important than preserving old dev-route tuning in place.
- Release risk classification after automated QA: no critical/high automated blockers found. Medium risks remain manual only: timed desktop production-preview playthrough, real-device mobile landscape playthrough, Chapter 5 elevator feel, Chapter 6 rooftop/floating ascent feel, possible runtime over 15 minutes, placeholder visuals, and the known large bundle warning. Low risks: legacy root override files, stale historical docs/internal metadata, and retained old route/source-material noise.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 704 tests. The first sandboxed run hit `spawn EPERM` while starting esbuild/Vite workers.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed with 47 test files / 704 tests. The first sandboxed run hit the same `spawn EPERM` worker limitation.

Part 42H verification:

- `npm run typecheck`: passed.
- `npm run test`: passed after sandbox escalation; 43 test files, 572 tests.
- `npm run build`: passed; Vite emitted the known large single-bundle warning.
- `npm run test:e2e`: passed after sandbox escalation; 25 passed, 1 intentionally skipped mobile-landscape F1 debug-overlay shortcut test.
- `npm run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.

Part 42H QA changes also expanded smoke coverage for all six chapter card routes, the six-chapter unlock ladder, title-menu Case Archive label, Chapter 6 verdict boundary, Credits navigation after verdict acceptance, retained old dev routes, chapter dev routes, settings persistence, reset behavior, and dev overlay smoke.

Part 42O verification:

- `npm run typecheck`: passed.
- `npm run test`: passed after sandbox escalation; 43 test files, 595 tests.
- `npm run build`: passed; Vite emitted the known large single-bundle warning.
- `npm run test:e2e`: passed after sandbox escalation; 25 passed, 1 intentionally skipped mobile-landscape F1 debug-overlay shortcut test.
- `npm run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.

Part 42O QA status aligns the expanded chapter metadata to the final 20-28 minute target and confirms the active six-chapter flow, clue continuity, Chapter 5/6 elevator/floating traversal data, save bridge, dev route policy, and final verdict boundary remain the core release surface.

Part 44D QA status supersedes the old 20-28 minute duration metadata with the 10-15 minute gift target while keeping the expanded platformer chapters. The active geometry now favors wider/slower moving platforms, safer Chapter 5 elevators, easier Chapter 6 floating lifts, and a closer pre-ascent checkpoint before the final court climb. Remaining release risk is still subjective timing and real-device mobile feel, not save/progression or final verdict integrity.

Part 44F mobile/browser QA status:

- Added automated mobile-landscape smoke coverage for the active Chapter 5 and Chapter 6 platformer routes, including visible/readable touch controls and no document scroll.
- Added automated viewport coverage for FinalVerdictScene at 1920x1080, 1366x768, and 1024x600, with Accept Verdict kept in view and key approved verdict lines checked.
- Added automated portrait fallback coverage so a narrow portrait viewport shows the rotate overlay without returning page scroll.
- Cleaned the visible mobile left/right control labels so they render as readable text while keeping the same pointer/touch behavior.
- Polished the final verdict certificate layout so the action row stays inside the visible panel on smaller desktop/laptop heights without changing the verdict text.
- Existing e2e coverage still verifies mobile-landscape no-scroll behavior for opening, title/settings, Case Archive, VN, all six active puzzles, final verdict, credits, chapter routes, dev routes, Chapter 5 Trust Door Light Path, and Chapter 6 Final Seal.

Part 44F does not replace a true device pass. Real-device iPhone Safari and Android Chrome landscape testing is still outstanding, especially drag/drop feel, tap fallback confidence, Chapter 5 elevator timing, Chapter 6 floating-platform timing, and one timed full gift playthrough.

Mobile touch-control QA pass:

- Hardened the platformer touch overlay so Left, Right, and Jump release on pointer cancel, lost capture, browser blur, and tab visibility loss.
- Increased phone-landscape touch button hit areas while preserving the desktop keyboard path and fine-pointer desktop hiding behavior.
- Expanded mobile-landscape e2e coverage so all six active chapter platformer routes expose touch controls inside the viewport with no document scroll.
- Added tap-fallback completion smoke for all six active puzzles on mobile landscape: Case Mosaic, Route Tile Puzzle, Deposition Order, Case File Sorting, Trust Door Light Path, and Final Seal.
- Verification passed: `npm run typecheck`, `npm run test` (600 tests), `npm run build`, `npm run test:e2e` (34 passed, 8 expected skips), and `npm run test:all`. The build still emits the known large Phaser bundle warning.
- Real-device iPhone Safari and Android Chrome playthroughs remain outstanding before sharing; automated tests cover visibility, no-scroll, and key tap fallback, not full human feel.

Part 45G-R2 full puzzle QA verification:

- `npm run typecheck`: passed.
- `npm run test`: passed after sandbox escalation; 47 test files, 626 tests.
- `npm run build`: passed after sandbox escalation; Vite emitted the known large single-bundle warning.
- `npm run test:e2e`: passed after sandbox escalation; 35 passed, 9 expected skips.
- `npm run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- New coverage locks the active six-puzzle set, completes all six redesigned puzzles on desktop by click/tap fallback, completes all six on mobile landscape by tap fallback, and verifies Chapter 6 puzzle success does not set `gameCompleted` before Accept Verdict.

Dev-7 dev editor safety verification:

- `npm run typecheck`: passed.
- `npm run test`: passed after sandbox escalation; 47 test files, 684 tests.
- `npm run build`: passed after sandbox escalation; Vite emitted the known large single-bundle warning.
- `npm run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed, 9 expected skips.
- `npm run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- The initial non-escalated Vitest, build, e2e, and test:all attempts hit sandbox `spawn EPERM` while starting esbuild/browser worker processes; reruns outside the sandbox completed successfully.
- New coverage verifies override summary/export/import helpers and keeps the dev overlay smoke aligned with the added Undo, Redo, Reset, Export, Import, and Override Summary controls.

Part 46A platformer enrichment verification:

- `npm run typecheck`: passed.
- `npm run test`: passed after sandbox escalation; 47 test files, 628 tests.
- `npm run build`: passed after sandbox escalation; Vite emitted the known large single-bundle warning.
- `npm run test:e2e -- --reporter=line`: passed after sandbox escalation; 35 passed, 9 expected skips. An earlier e2e run timed out before reporting, then the longer line-reporter rerun completed successfully.
- `npm run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- New geometry coverage confirms the six active chapter platformer routes each include a vertical or direction-change traversal beat, and Chapter 2's added hidden-wall lift remains wide/slow and separate from the horizontal tram-platform checks.

Part 46A-R2 structural platformer rebuild verification:

- `npm run typecheck`: passed.
- `npm run test`: passed after sandbox escalation; 47 test files, 628 tests. The first run surfaced stale pacing/dev-override expectations, which were updated to the new rebuilt geometry and rerun green.
- `npm run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm run test:e2e`: passed on rerun after sandbox escalation; 35 passed, 9 expected project-scope skips. The first run had one transient desktop Case Mosaic route assertion while the same mobile path passed; rerun was clean.
- `npm run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- New coverage locks the Part 46A-R2 duration metadata, stronger active-route verticality, Chapter 2 wall-lift dimensions, Chapter 5 elevator requirements, Chapter 6 rooftop climb markers, and retained dev-override merge behavior against the rebuilt Level 1 base geometry.

Part 46A-6 Chapter 6 rooftop/final-court rebuild verification:

- Chapter 6 / old Level 9 geometry now has a taller, more authored rooftop route with a real lower-roof climb, upper skyline path, safe descent, clue-memory balcony, two wide slow floating court elevators, and supported final court / heart seal / final door staging.
- New structural coverage verifies rooftop climb height, post-climb descent, floating elevator specs, Unfinished Letter support, rebuild trigger support, lantern switch support, clue memory marker support, heart-seal/final-door support, checkpoint respawns, and the retained PuzzleScene level 9 exit.
- Puzzle mechanics, save/progression schema, old dev routes, and the FinalVerdictScene Accept Verdict completion boundary remain unchanged.

Part 46B full platformer QA verification:

- The rebuilt six-chapter platformer set is classified as structurally good against the current authored-route targets: Chapter 1 office tutorial, Chapter 2 tram-to-hidden-wall route, Chapter 3 river/bridge investigation, Chapter 4 archive shelf/drawer route, Chapter 5 courthouse/elevator ascent, and Chapter 6 rooftop/final-court climb.
- Added aggregate geometry QA coverage for the active six-chapter pacing metadata, authored vertical route markers, supported exits/checkpoints, and moving/elevator platform forgiveness.
- Small tuning fix: Chapter 2's two tram platforms were slowed from speed 38 to speed 32 for calmer mobile landscape timing.
- Remaining release risk is manual feel, not known structural breakage: perform one timed desktop platformer pass and one real-device mobile landscape pass, focusing on Chapter 5 elevators and Chapter 6 rooftop/floating ascent.

Part 47 end-to-end release-readiness verification:

- `npm run typecheck`: initial PowerShell `npm.ps1` shim was blocked by local execution policy; `npm.cmd run typecheck` passed.
- `npm run test`: initial sandbox run hit the known `spawn EPERM` esbuild/Vite restriction; escalated `npm.cmd run test` passed with 47 test files and 645 tests.
- `npm run build`: initial sandbox run hit the known `spawn EPERM` esbuild/Vite restriction; escalated `npm.cmd run build` passed. Vite still emits the known large single-bundle warning.
- `npm run test:e2e -- --workers=1 --reporter=line`: initial sandbox run hit `spawn EPERM`; escalated serial e2e passed with 35 passed and 9 expected project-scope skips.
- `npm run test:all`: initial sandbox run hit `spawn EPERM` during Vitest; escalated `npm.cmd run test:all` passed. It reran typecheck, unit tests, and build successfully with the same known large bundle warning.
- New Part 47 regression coverage keeps the release spine explicit: six active chapter ids, active platformer/puzzle bridge ids, opening duration ceiling, platformer/puzzle timing metadata, active old-module exclusions, and final verdict boundary.

Part 48A wording cleanup status:

- Active opening case-file copy is guarded as "A trail of clues is hidden across Warsaw." and does not use "Ten clues."
- Opening cinematic captions are guarded so only the menu reveal says "The case file opens"; the desk beat says "Maria takes her place at the desk."
- Active Chapter 6 pre-verdict copy is guarded around `Final Seal: The Court of the Heart` / `The Heart Seal` language and does not reveal `The Heart, Freely Given` before FinalVerdictScene.
- AGENTS.md now describes the current six-chapter Missing Heart project, records that active platformer geometry is canonical with active root overrides archived, and warns against changing legacy package/save-key names without a tested migration.
- Legacy `maria-tenth-exhibit` package/save-key metadata remains internal and unchanged; this avoids accidental save-progress loss before a future migration pass.
- Verification passed: `npm.cmd run typecheck`, `npm.cmd run test` after sandbox escalation (47 test files, 704 tests), `npm.cmd run build` after sandbox escalation, serial `npm.cmd run test:e2e -- --workers=1 --reporter=line` after sandbox escalation (35 passed, 9 expected skips), and `npm.cmd run test:all` after sandbox escalation. The known large Phaser bundle warning remains non-blocking.

Dev-2 dev editor tooling verification:

- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files and 658 tests.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected project-scope skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- Production bundle scan found no `__dev/level-overrides`, `DEV LEVEL EDITOR`, or dev-editor button selectors in `dist/`.

Dev-3 selected-object inspector verification:

- Added the F1 selected-object inspector for id/type/kind/source/status, x/y, resizable width/height, and static-platform label edits.
- Added utility coverage for inspector numeric parsing, positive dimension rejection, snap-applied inspector values, exact no-snap values, source/status wording, and platform label override application.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files and 662 tests.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected project-scope skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- Production bundle scan found no `__dev/level-overrides`, `DEV LEVEL EDITOR`, or `dev-object-inspector` strings in `dist/assets/*.js`.

Dev-4 moving platform/elevator editor verification:

- Added editable moving-platform inspector fields for axis, speed, from/to endpoints, with dev-only path preview handles and snap-aware endpoint dragging.
- Added validation coverage for valid horizontal/vertical moving edits, invalid axis, non-positive speed, near-zero path rejection, snap-applied endpoint values, world-bounds warnings, and moving-platform speed/path override persistence.
- Moving-platform duplicate/delete remains intentionally deferred; static platform Dev-2 add/duplicate/delete behavior remains the supported object lifecycle workflow for now.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files and 667 tests.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected project-scope skips. The first escalated e2e attempt timed out before results; the longer serial rerun completed green.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- Production bundle scan found no `DEV LEVEL EDITOR`, `dev-object-inspector`, `dev-inspector-axis`, or `__dev/level-overrides` strings in `dist/assets/*.js`.

Dev-5 checkpoint, clue/interactable, and exit editor verification:

- Added checkpoint `respawnX`/`respawnY` editing with a Linked Respawn toggle, dev-only trigger-to-respawn visual markers, and v2 override persistence for checkpoint respawn coordinates.
- Added selected-object support validation for clues/interactables, exits, checkpoint triggers, and checkpoint respawn positions using a generous support-platform heuristic.
- Kept clue identity/progression roles and exit target routes read-only; Dev-2 static platform workflows, Dev-3 inspector workflows, and Dev-4 moving-platform workflows remain in place.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files and 674 tests.
- `npm.cmd run build`: passed after sandbox escalation; Vite still emits the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation; 35 passed and 9 expected project-scope skips.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- Production bundle scan found no `DEV LEVEL EDITOR`, `dev-object-inspector`, `dev-inspector-respawnX`, or `__dev/level-overrides` strings in `dist/assets/*.js`.

Dev-6 validation overlay verification:

- Added a dev-only level-wide validator and F1 overlay controls for Validate Level, Auto Validate, and validation markers.
- Added unit coverage for duplicate/missing ids, invalid dimensions, out-of-bounds objects, unsupported clues/exits/checkpoint respawns, invalid moving-platform paths, mobile comfort warnings, and stale deleted override ids.
- Added e2e smoke coverage that verifies validation controls are visible, Validate Level populates the summary, and marker toggling updates dev status.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run test`: passed after sandbox escalation; 47 test files, 680 tests.
- `npm.cmd run build`: passed; Vite emitted the known large single-bundle warning.
- `npm.cmd run test:e2e -- --workers=1 --reporter=line`: passed after sandbox escalation with a longer timeout; 35 passed and 9 expected project-scope skips. The first 3-minute attempt timed out before reporting results.
- `npm.cmd run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- Production bundle scan found no `DEV LEVEL EDITOR`, `dev-validation-panel`, `dev-validate-level`, or `__dev/level-overrides` strings in `dist/assets/*.js`.

Dev-6.5 dev editor workflow QA:

- Audited the Dev-2 through Dev-6 editor workflow from source, tests, local override fixtures, and existing e2e smoke coverage.
- Added `docs/dev-editor-workflow.md` covering the recommended polish loop, shortcuts, snap behavior, save/reload behavior, Revert Unsaved versus Revert Override versus Delete Object, validation colors, production safety, and limitations.
- No runtime code changed in Dev-6.5. Typecheck/test/build/e2e were not rerun for this docs-only pass; Dev-6 remains the latest runtime verification baseline.
- Recommended next tooling step is Dev-7: undo/redo, override summary, reset current level overrides, and export/import polish before a serious bake workflow.

Part 43 verification:

- `npm run typecheck`: passed.
- `npm run test`: passed after sandbox escalation; 43 test files, 595 tests.
- `npm run build`: passed; Vite emitted the known large single-bundle warning.

Part 43 is a documentation-only visual asset planning pass. It adds no source image files, external assets, gameplay logic, puzzle mechanics, VN text, save/progression changes, or final verdict changes.

Earlier release-package verification:

Final Part 25 verification:

- `npm run typecheck`: passed.
- `npm run test`: passed after sandbox escalation; 25 test files, 345 tests.
- `npm run build`: passed; `dist/index.html`, bundled JS/CSS, and asset notes were generated.
- `npm run test:e2e`: passed after sandbox escalation; 55 passed, 1 intentionally skipped mobile-landscape F1 debug-overlay shortcut test.
- `npm run test:all`: passed after sandbox escalation; typecheck, unit tests, and build all completed.
- `npm run preview`: production preview smoke passed on `http://127.0.0.1:4174/`; title HTML returned 200 and the dev override write endpoint rejected POST with 404.

Notes:

- Non-escalated Vitest/Playwright/preview attempts can fail in this Codex sandbox with `spawn EPERM` when Vite/esbuild/Playwright spawn child processes. Escalated reruns passed.
- One intermediate e2e rerun accidentally reused a production preview server on port 4173, so dev-route tests correctly failed as production-disabled. The preview process was stopped and the final configured e2e run passed.
- Vite reports the expected large chunk warning because Phaser and the full game ship in one static app bundle. This is non-blocking for the current private gift build.

## Production Build Output

The latest production build generated:

- `dist/index.html`
- `dist/assets/index-*.css`
- `dist/assets/index-*.js`
- `dist/assets/README.md`

Part 37 measured the existing build before adding final assets:

- `dist/` total: about 1.8 MB uncompressed.
- Public asset files: about 665 bytes, consisting only of asset-folder notes.
- No final image/audio/font assets are present yet.

The final production JS bundle was scanned for `DEV LEVEL TUNING`, `__dev/level-overrides`, `dev-level-overrides`, and local `C:\Users` paths. No matches were found after the Part 25 dev-tool bundling hardening.

## Deployment Target Readiness

- GitHub Pages: ready via manual workflow or manual `dist/` publishing. Set `base_path`/`VITE_BASE_PATH` to `/repo-name/` for project pages.
- Vercel: ready as a Vite/static site with build command `npm run build` and output directory `dist`.
- Netlify: ready with build command `npm run build` and publish directory `dist`.
- itch.io: ready to test as an HTML5 ZIP by zipping the contents of `dist/` with `index.html` at ZIP root.

Recommended fastest sharing option: Vercel or Netlify, because both can deploy `dist/` from the repo with minimal base-path risk. itch.io is also straightforward if you want an explicitly game-like sharing page.

## Privacy And Credits Review

Reviewed source/docs/public asset notes for privacy and release hygiene.

Approved personal content present:

- Maria's first name.
- The romantic final verdict text approved in the game bible.
- The intended "Made with love by Alper" credit.
- General Warsaw/legal/birthday case-file framing.

Not found in production UI/content:

- Private photos.
- Voice recordings.
- Personal addresses.
- Sensitive legal/work details.
- API keys or secrets.
- Local machine paths in production bundle output.
- Unclear external art/audio/font assets.

CREDITS.md states that the build uses placeholder Phaser shapes, DOM/CSS UI, and procedural WebAudio tones generated in code. No external final art/audio assets are included.

## Known Limitations

- Real-device mobile testing remains outstanding; Part 44F adds emulator/e2e coverage but does not claim iPhone Safari or Android Chrome device testing.
- A full human end-to-end playthrough on the final production build remains outstanding.
- A timed human pacing pass remains outstanding after the six platformer rebuilds and six-puzzle QA pass. Use `docs/timed-playthrough-protocol.md` to record the required desktop and mobile timings. Part 47 metadata suggests the full game is likely near or above the 15-minute ceiling unless player movement and puzzle solves are faster than conservative targets.
- Focused manual Chapter 5 and Chapter 6 polish remains recommended before final sharing. Use `docs/level-polish-workflow.md` to tune elevator/floating-platform feel through dev-editor overrides, record late-chapter timing, and export backups without changing canonical geometry.
- The player-facing flow has migrated to 6 chapters, but `saveVersion` remains 1 and the bridge still stores completion through retained old level ids until a future save migration.
- Old level, puzzle, VN, and geometry routes remain available as dev/test/source material; they are intentionally hidden from the normal Case Archive rather than deleted.
- Visuals are still procedural/placeholder, though Part 38 upgraded UI frames, level motifs, clue silhouettes, puzzle boards, VN presentation, and final verdict seal treatment without adding external assets.
- Player-facing visual chrome is now broadly harmonized around the main menu style; remaining art risk is final asset quality, not UI palette fragmentation.
- Final visual asset production is not started yet; Part 48B now documents the first opening/main-menu office desk background prompt, budget, future asset order, and one-asset-at-a-time integration loop.
- There is no background music, voice, final art, photos, or private memory content.
- The built JS bundle is large due to Phaser and no code-splitting.
- `dev-level-overrides/level-8.json` exists locally and should be intentionally included or excluded based on the deployment plan; production runtime does not depend on it.
- Dev editor v2 override files may contain `modifiedObjects`, `addedObjects`, and `deletedObjectIds`. These files are authoring artifacts and should be reviewed/baked intentionally before sharing; production builds still do not expose the write endpoint.
- The Chapter 2 baked override is archived at `dev-level-overrides/archive/level-2.baked-20260510.json` and root `dev-level-overrides/level-2.json` is absent, so normal dev override loading should no longer double-apply Level 2 or emit stale deleted-id warnings for the now-canonical removed platforms.
- The Chapter 3 baked override is archived at `dev-level-overrides/archive/level-4.baked-20260510.json` and root `dev-level-overrides/level-4.json` is absent, so normal dev override loading should no longer double-apply Level 4 or emit stale deleted-id warnings for the now-canonical removed `witness-note-ledge`.
- Dev-4B allows moving/elevator platform creation and duplication through dev-only `addedObjects`. These are useful for level polish but still require validation, save/reload QA, and later manual bake review before becoming canonical release geometry.
- Real-device drag/drop testing for all redesigned puzzles remains outstanding; tap fallback and desktop/mobile-landscape Playwright smoke coverage reduce but do not remove this risk.

## Release Blockers

No code-level blocker is currently known.

Release risk: medium until one timed desktop playthrough and one real mobile landscape playthrough pass on the production build or live share URL using `docs/timed-playthrough-protocol.md`. The active Case Archive is now six chapters, with legacy old-level routes retained for dev/test only; the remaining migration risk is the old save bridge and any later deletion/archive pass. The redesigned puzzle family is automated-smoke-tested around the chapter flow, and Part 48A has cleaned the final pre-asset wording guardrails, but real-device touch drag, Chapter 5/6 elevator feel, and the 10-15 minute runtime ceiling remain the main open release risks. After those pass, risk is low for a private gift deployment with placeholder/procedural visuals.

## Non-Blocking Polish Ideas

- Fold any keeper dev override coordinates into `src/game/platformer/levelGeometry.ts` before a public release, or keep them out of the player package.
- Time the full game on desktop and shorten late routes if the run exceeds the intended gift-session length.
- Add final credited/approved visual assets later if desired.
- Follow `docs/visual-style-guide.md`, `docs/asset-budget.md`, and `docs/asset-replacement-plan.md` before adding final art.
- Add licensed/credited music later only if the license is certain.
- Consider code-splitting Phaser/app chunks before a public wider release.

## Next Phase

Recommended next work is to generate the first opening/main-menu office desk image externally from the Part 48B prompt, review composition/style/text safety, optimize it to WebP, then run Part 48C to integrate it into `OpeningStartScene` and/or the title menu. The timed desktop playthrough and real-device mobile landscape pass remain release gates before final sharing.

## Part 49F Chapter 6 VN Image Integration

Part 49F maps the approved Chapter 6 image-backed VN screens into the existing final asset registry:

- `vn-chapter-6-intro` now displays `SixthNovel01.webp`, `SixthNovel02.webp`, and `SixthNovel03.webp`, then routes to the Chapter 6 platformer at runtime Level 9.
- `vn-chapter-6-before-puzzle` now displays `TheFinalSealPuzzleNovel01.webp`, then routes to the Final Seal puzzle at runtime Level 10.

The shared image-backed VN renderer suppresses the old coded dialogue card, speaker/nameplate UI, Skip button, Continue button, and duplicate visible text only for these mapped scenes. The final verdict scene and approved verdict copy remain unchanged; `gameCompleted` remains tied to accepting the verdict. Remaining release risk is still manual real-device mobile landscape review and timed full-playthrough pacing.

## Part 50O Full Visual Flow QA

Part 50O audits the visual flow from opening cinematic through FinalVerdictScene across desktop and mobile-landscape viewports. The pass found one image-backed VN mapping gap: `TheRightQuestionPuzzleNovel01.webp` existed but `vn-chapter-5-before-puzzle` was still using the coded VN layout. That scene is now mapped through the shared image-backed VN renderer, suppressing old VN chrome and routing into Trust Door Light Path. Opening cinematic, Case File frame, other image-backed VN scenes, active platformers, all six puzzles, final verdict routing, save/progression, and approved final verdict text remain unchanged. Remaining release risks are real-device mobile browser QA, a timed full playthrough, and the known large bundle warning.

## Part 50R Evidence Reveal Image-Backed Readiness

Part 50R prepares Chapter 1-5 post-puzzle evidence reveals for optional final image-backed screens without adding reveal art. `EvidenceRevealScene` now checks for `RevealChapter01.webp` through `RevealChapter05.webp` in `src/assets/final/reveals/`; missing files preserve the existing Phaser-rendered reveal certificate fallback, so current runtime behavior is unchanged until art is added.

When a future mapped reveal image exists, the scene displays the image full-screen with contained scaling on a dark backing and hides the old Phaser reveal chrome only for that mapped chapter. The existing two-step flow remains intact: first Enter/tap/click marks the chapter/clue closed through the current completion bridge and status text, and second Enter/tap/click opens the Case Archive. Chapter 6 remains excluded and continues to route through FinalVerdictScene with the approved verdict text unchanged.

## Part 50S Chapter 1 Reveal Verification

`RevealChapter01.webp` is present in `src/assets/final/reveals/` and verified as the Chapter 1 style-anchor reveal. The Chapter 1 post-Case-Mosaic reveal now uses the image-backed path, with the old Phaser certificate/stamp/title/body/next-clue/button chrome suppressed so no duplicate runtime UI is layered over the designed screen.

Desktop 1366x768 and mobile landscape 932x430 checks confirmed contained viewport display, dark backing, readable baked text, no document/body scroll, first input completing Chapter 1 through the existing save bridge, and second input opening the Case Archive. Chapter 2 was spot-checked as still using the Phaser fallback while its reveal image is absent. Chapter 6 and the approved final verdict text remain unchanged.

## Part 50T Chapter 1-5 Reveal Verification

`RevealChapter01.webp` through `RevealChapter05.webp` are present in `src/assets/final/reveals/` and verified as image-backed post-puzzle reveal screens for Chapters 1-5. Desktop 1366x768 and mobile landscape 932x430 checks confirmed each reveal is centered, contained, readable, no-scroll, and free of duplicated old Phaser reveal chrome.

Each reveal preserves the existing two-step completion/archive behavior: first Enter/tap/click marks the corresponding chapter completion through the current save bridge, and second Enter/tap/click opens the Case Archive. Chapter 6 remains outside the reveal-image batch and continues from Final Seal to `FinalVerdictScene`; the approved final verdict text remains unchanged.
