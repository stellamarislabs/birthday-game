# Technical Architecture

## Phaser Scene Architecture

- `BootScene` performs minimal startup and moves to preload.
- `PreloadScene` is reserved for future asset loading.
- `OpeningStartScene` shows the first full-screen Start gate before the title menu during normal boot.
- `OpeningCinematicScene` plays the automatic data-driven opening cinematic and then hands off to the title menu.
- `TitleScene` shows the title and starts the opening case file.
- `CaseFileScene` shows the opening premise and then enters the Level 1 VN/platformer flow.
- `PlatformerScene` hosts retained legacy platformer slices used by the six active chapter wrappers and by dev/test old-level routes.
- `PuzzleScene` routes the six active chapter puzzle wrappers while retaining old Level 1-10 puzzle dev/test routes.
- `VisualNovelScene` displays short data-driven dialogue scenes for story moments. The active player flow uses chapter VN scenes; old level VN scenes remain dev/test/source material.
- `FinalVerdictScene` displays the approved verdict text after Chapter 6 completes the simplified final seal puzzle.
- `CreditsScene` provides a simple text credits flow without external assets.
- `LevelSelectScene` shows the progress-aware six-chapter Case Archive.
- `ComingSoonScene` handles unavailable future selections without starting unfinished gameplay.

Scenes should stay thin. Story, level, puzzle, save, and flow data live outside scene classes.

## Fixed-Resolution Responsive Scaling

The internal game resolution is `960x540` for a 16:9 landscape layout. Phaser uses `Scale.FIT` and `CENTER_BOTH`, while CSS lets `#game-shell` and `#game-frame` fill the browser viewport. The canvas keeps its aspect ratio inside that viewport so platformer and puzzle coordinates remain stable. The title menu DOM overlay uses viewport-based sizing so the main screen feels full-screen instead of being capped to a small centered card.

## Full-Screen App Shell And No-Scroll Policy

The browser document is treated as a full-screen game shell, not a scrollable web page. `html`, `body`, `#game-shell`, `#game-frame`, and `#game-container` fill the viewport, use the `--app-height` runtime CSS variable backed by `window.innerHeight`, and hide document overflow. This protects mobile browser emulators and dynamic browser chrome from creating accidental page scroll.

Player-facing DOM overlays are mounted inside `#game-shell` as fixed, viewport-sized layers with their own responsive constraints. Opening start, opening cinematic, title/settings/reset, Case Archive, VN, puzzle overlays, final verdict, and credits must fit within the visible game viewport. Short mobile landscape uses compact layouts: the Case Archive switches to a 3x2 chapter grid, title settings/reset panels become side-by-side, puzzle panels reduce spacing, and the final verdict document uses a compact certificate layout with action buttons kept visible.

Puzzle overlays use adaptive layout modes instead of one universal scale. Desktop/large-landscape screens give the puzzle panel a generous viewport-relative width and height so the board, tray, progress, feedback, and action footer are readable together; later presentation polish rules must preserve that sizing and not re-cap puzzle panels to a small fixed card. Short mobile landscape switches to a compact shell that fixes the puzzle panel to the viewport, compresses title/instruction/footer rows, hides nonessential subtitles, and uses `minmax(0, 1fr)` plus `min-height: 0` on board/tray regions so they shrink rather than clipping. Active puzzle boards then get puzzle-specific compact sizing for board slots, trays, final-seal fragments, archive details, witness statements, and Trust Light Path mirrors while preserving drag/drop and tap fallback behavior.

Page-level scrolling is not allowed in normal player-facing screens. Dev/debug panels may keep internal scrolling because they are tooling surfaces. Final verdict and credits should fit without page scroll; if future content becomes too long, use a contained in-panel solution or pagination rather than allowing the document to scroll.

## Landscape-First Mobile Strategy

Mobile is supported with a landscape-first layout. A simple portrait overlay exists now as a placeholder. Touch controls and the game canvas use `touch-action: none` to prevent browser panning during gameplay, while buttons and form controls keep normal tap behavior. Future mobile work should preserve large hit areas, avoid precision-heavy play, and verify no document scroll is introduced after UI, VN, puzzle, or final-art changes.

Part 44F adds mobile/browser QA coverage around this shell without changing the scene architecture: e2e now checks mobile-landscape Chapter 5 and Chapter 6 platformer routes for visible touch controls and no document scroll, verifies FinalVerdictScene across desktop/laptop viewport sizes, and confirms the portrait rotate overlay remains non-scrollable. Real iPhone Safari and Android Chrome checks remain manual release gates.

The mobile touch-control overlay is owned by `TouchControls.ts` and is intentionally separate from Phaser keyboard input. Platformer scenes create the DOM Left, Right, and Jump buttons for chapter/dev platformer routes, while `PlayerController.ts` continues to merge keyboard, coyote-time, jump-buffer, and touch state. The buttons use pointer capture for hold behavior, `touch-action: none` to block page panning, and global blur/visibility guards so a lost browser focus cannot leave Maria walking or jumping. Desktop keyboard controls remain the primary desktop input; CSS hides the touch overlay for fine-pointer desktop devices.

Normal player-facing platformer presentation is deliberately clean before final asset work. `LevelBuilder` preserves geometry label data for tooling, but player world labels are hidden by `PLAYER_WORLD_LABELS_VISIBLE`; platform names, object ids, checkpoint labels, clue names, and long tutorial/helper labels belong to the F1 dev editor rather than the normal playfield. `PlatformerScene` also keeps persistent control and sound-status text disabled by default, using only brief feedback for actions such as mute, pause, checkpoint, clue pickup, and exits. Touch controls remain visible on mobile with concise Left, Right, and Jump labels and accessible button names.

Part 51B adds a safe optional platformer final-art skin layer without changing the accepted gameplay geometry. `platformerThemeAssets.ts` maps active runtime Levels 1, 2, 4, 5, 6, and 9 to future WebP filenames under `src/assets/final/platformer/`; `PlatformerScene` preloads only mapped files that actually exist, and `LevelBuilder` draws image skins only when a texture is available. Arcade rectangles and zones remain the authoritative collision, pickup, checkpoint, moving-platform, and exit objects, while future backgrounds, platform skins, clue skins, lantern/door skins, and checkpoint skins are non-interactive visual companions with primitive rendering as the fallback.

Part 51C verifies the first platformer vertical slice on Chapter 1 / runtime Level 1. `chapter01-platformer-bg.webp`, `chapter01-platform-static-paper.webp`, `chapter01-platform-moving-elevator.webp`, `chapter01-clue-envelope.webp`, and `chapter01-exit-case-door.webp` now resolve through the same registry and render as non-interactive skins over the existing primitive gameplay layer. Backgrounds use cover-style scaling; platform skins keep exact display bounds so the accepted collision rectangles remain visually aligned and authoritative.

Part 51C-R1 keeps the same Chapter 1 registry mapping but refines the active presentation after visual QA. Because the platform and elevator WebP exports contain too much vertical padding for thin gameplay bodies, Chapter 1 now uses code-rendered parchment/leather platform surfaces for those bodies while retaining the final asset mapping for future regeneration. Primitive rectangles are still the physics objects, but their normal fills are reduced in final-art mode so they no longer dominate the scene. The envelope clue and case-door art remain non-interactive skins with softened primitive backing.

Part 51C-R2 formalizes Chapter 1 as a hybrid final platformer presentation. The Chapter 1 background, clue envelope, and case-door images remain optional non-interactive skins when they resolve, while the static and moving platform WebPs stay mapped but are not actively used for gameplay surfaces. Level 1 release presentation skips the old ambient placeholder decoration pass and uses polished code-rendered kancelaria platform surfaces aligned exactly to the unchanged collision rectangles. The moving platform uses a grouped procedural visual so its brass trim, parchment inset, and shadow follow the authoritative moving body together.

Part 51D adds a safe Maria player sprite companion layer without changing the authoritative 34x54 Arcade body or movement constants. `playerSpriteAssets.ts` resolves the expected standalone `maria-idle.png`, `maria-walk.png`, and `maria-jump.png` files under `src/assets/final/platformer/player/`, and `PlayerView.ts` can attach bottom-centered idle/walk/jump images to the existing player rectangle with facing-state support. The currently checked-in PNGs are RGB images with a baked checkerboard background, so `PLAYER_SPRITE_TRANSPARENCY_APPROVED` remains false and the runtime keeps the old rectangle fallback until true-transparent exports replace those files.

Part 51D-R1/51D-R2 enables that player sprite layer after the Maria PNGs were replaced with true-alpha exports. The visual layer still follows the same 34x54 player body, uses render-time crops to remove transparent padding from each standalone image, displays Maria at a 128px bottom-centered height with a minimum readable width and subtle contact shadow, and chooses idle/walk/jump/facing states from existing Arcade body velocity and grounded state. Missing sprite URLs still fall back to the rectangle player, and no platformer geometry, hitbox, movement, checkpoint, clue, exit, save, or final-verdict behavior changes.

Part 51D-R3 keeps that gameplay separation and improves presentation only: Maria now renders with a subtle dark edge-shadow companion behind the active sprite to reduce pale fringe on dark backgrounds, and platformer scenes fill letterboxed viewport side areas with platformer-specific ambience instead of empty black bars. Part 51D-R4 refines that shell treatment so the outer margins no longer reuse level background art; they render as code-designed burgundy/navy theatre-frame panels with antique-gold inner trim. A follow-up centering correction keeps the CSS grid shell as the single centering authority by neutralizing Phaser's inline canvas margins, preventing mobile landscape from double-centering the canvas to the right. The Phaser world, camera bounds, fixed 960x540 internal resolution, platform coordinates, player spawn points, and player body remain unchanged.

Part 52A introduces a shared non-VN presentation shell for the rest of the game. CSS tokens such as `--presentation-backdrop`, `--presentation-stage-surface`, `--presentation-grid`, and `--presentation-frame-shadow` define the reusable navy/burgundy/gold theatre-case treatment used by puzzle overlays, archive/credits/final-verdict overlays, evidence-reveal image margins, and the base app shell. Canvas-only scenes use `drawNonVnPresentationShell` from `src/game/presentation/presentationShell.ts` so Level Select, Credits, Coming Soon, fallback Evidence Reveal, and Final Verdict share the same backdrop language without changing routing, text, save data, platformer geometry, or puzzle logic.

Puzzle completion on phones must not depend on drag precision. The shared pointer drag/drop helper may stay as the richer interaction, but every active puzzle should preserve its tap fallback: tap an item/token, tap a target/slot, or tap-to-rotate where that is the mechanic, then press the visible primary action. Mobile e2e now smoke-tests tap completion for Chapter 1 Case Mosaic, Chapter 2 Route Tile Puzzle, Chapter 3 Deposition Order, Chapter 4 Case File Sorting, Trust Door Light Path, and the tap-rotated Final Seal rings in addition to viewport-fit checks for all six active puzzle layouts. Real-device drag feel remains a manual release gate.

## Data-Driven Content

- `src/content/story.ts` owns title, opening case file, verdict, and UI copy.
- `src/content/levels.ts` owns the retained legacy 10-level source material.
- `src/content/puzzles.ts` owns retained old-level puzzle specs used by bridge/dev routes.
- `src/content/vnScenes.ts` owns both chapter VN scenes and retained old-level VN scenes.
- `src/content/clueChain.ts` owns the retained 10-clue continuity data used by old-level reveal/dev routes.
- `src/content/chapters.ts` owns the active 6-chapter content model used by the player-facing Case Archive.
- `src/content/chapterPuzzles.ts`, `src/content/chapterVnOutline.ts`, and `src/content/chapterClueChain.ts` own chapter puzzle, VN, and clue-chain plans. As of Part 42F, all six chapters use this layer for active chapter reveal/routing metadata while legacy 10-level routes remain available for dev/testing.
- `src/types/` owns shared contracts.

Part 42B adds `src/types/ChapterSpec.ts` for the 6-chapter model. Part 42C adds `src/game/systems/ChapterBridge.ts`, which keeps player-facing chapter availability separate from legacy old-level runtime availability. Parts 42D through 42F add active chapter flow metadata for Chapters 1-6, Part 42G hides old player-facing level assumptions, and Part 42H verifies the six-chapter bridge. `GameFlow` and `SaveManager` still use the 10-level save/final boundary; old level data, geometry, puzzle modules, and dev routes remain addressable.

## Chapter Archive Bridge

Part 42C makes Level Select player-facing as a six-card Case Archive. The cards use `chapters.ts`, show `[N]/6 chapters closed`, and launch chapter-aware flows through `ChapterBridge.ts` while the platformer geometry and save write-through still use retained old level ids.

Temporary launch map:

| Chapter | Legacy runtime level |
|---|---|
| 1 | Level 1 |
| 2 | Level 2 |
| 3 | Level 4 |
| 4 | Level 5 |
| 5 | Level 6 |
| 6 | Level 9 |

Temporary completion mapping reads the existing old save schema only: Chapter 1 closes at old Level 1, Chapter 2 at old Level 3, Chapter 3 at old Level 4, Chapter 4 at old Level 5, Chapter 5 at old Level 8, and Chapter 6 at old Level 10 or `gameCompleted`. If `gameCompleted` is true, the Case Archive treats all six chapters as closed. No save version bump or schema migration happens in this bridge.

Part 42D active flow metadata:

| Chapter | Chapter VN | Platformer | Puzzle | Completion write-through |
|---|---|---|---|---|
| 1 | `vn-chapter-1-intro`, `vn-chapter-1-before-puzzle`, `vn-chapter-1-after-puzzle` | old Level 1 | old Level 1 `case-mosaic` route, 3x2 envelope reconstruction | old Level 1 complete |
| 2 | `vn-chapter-2-intro`, `vn-chapter-2-before-puzzle`, `vn-chapter-2-after-puzzle` | old Level 2 | old Level 3 completion route, now `route-tile-puzzle` | old Level 3 complete |
| 3 | `vn-chapter-3-intro`, `vn-chapter-3-before-puzzle`, `vn-chapter-3-after-puzzle` | old Level 4 | old Level 4 Deposition Order | old Level 4 complete |
| 4 | `vn-chapter-4-intro`, `vn-chapter-4-before-puzzle`, `vn-chapter-4-after-puzzle` | old Level 5 | old Level 5 Case File Sorting | old Level 5 complete |
| 5 | `vn-chapter-5-intro`, `vn-chapter-5-before-puzzle`, `vn-chapter-5-after-puzzle` | old Level 6 | old Level 6 Trust Door Light Path | old Level 8 complete |
| 6 | `vn-chapter-6-intro`, `vn-chapter-6-before-puzzle`, `vn-chapter-6-after-puzzle` | old Level 9 | old Level 10 Final Seal | Accept Verdict marks `gameCompleted` |

The scene data bridge is deliberately small: `PlatformerScene`, `PuzzleScene`, and `EvidenceRevealScene` accept an optional `chapterId`, and `VisualNovelSceneSpec` can identify chapter-owned scenes. When `chapterId` is absent, legacy level flow behaves as before. Dev/test query routes still support `?scene=platformer&level=N` and `?scene=puzzle&level=N`; implemented chapter bridge routes also support `?scene=platformer&chapter=1|2|3|4|5|6` and `?scene=puzzle&chapter=1|2|3|4|5|6`.

Chapter 6 is special because it preserves the final boundary: `PuzzleScene` routes the active chapter final puzzle directly to `FinalVerdictScene`. `FinalVerdictScene` still owns the approved verdict copy and only calls `SaveManager.markGameCompleted()` after Accept Verdict.
Part 44C compresses the active chapter flow without deleting the retained VN scene ids. In active flow, Chapter 1 and Chapter 3 platformer exits bypass the before-puzzle VN and open the puzzle directly; Chapters 2, 4, 5, and 6 keep a one-line pre-puzzle VN. Active Chapters 1-5 route puzzle success directly to `EvidenceRevealScene`, and active Chapter 6 routes final-seal success directly to `FinalVerdictScene`. The `vn-chapter-*-after-puzzle` scenes remain short and targetable for dev/testing, but they are no longer part of the normal chapter route.

Part 42J expands the Chapter 1 and Chapter 2 platformer slices inside the retained bridge ids rather than introducing new chapter geometry files. Old Level 1 now serves Chapter 1 as a longer kancelaria route with a route-awakening ending, a visible brass-key/tram-ticket handoff, and a second checkpoint. Old Level 2 now serves Chapter 2 as a longer tram-to-hidden-wall route with retained moving platforms, a golden validator/stamp beat, a keyhole-triggered rebuild group, a Vistula wave-mark handoff, and three checkpoints. The bridge mapping, save write-through ids, dev routes, and `saveVersion` remain unchanged.

Part 42K expands the Chapter 3 and Chapter 4 platformer slices inside the retained bridge ids. Old Level 4 now serves Chapter 3 as a longer River Witness route with retained drifting-paper platforms, stronger bridge/witness visual staging, a post-note archive-code section, and an archive-reference handoff. Old Level 5 now serves Chapter 4 as a longer Archive of Corrections route with retained archive key/door gating, clearer archive-code and "No. Given." staging, an optional silver-key pickup using the existing in-memory archive-key pickup path, a courthouse-index ending, and a third checkpoint. The bridge mapping, completion ids, dev routes, and `saveVersion` remain unchanged.

Part 42L expands the Chapter 5 platformer slice inside retained old Level 6. The early courthouse choice-door spine remains intact, then the route continues into a Trust-door threshold, one old-Level-7-style lantern switch with light-revealed platforms, three old-Level-8-style vertical moving platforms, blue-ribbon page staging, an unfinished-letter handoff, and extra checkpoints before/after the elevator ascent. Old Level 7 and old Level 8 geometries remain retained and addressable through dev/test routes; their source material is reused by pattern, not pasted wholesale. Part 45E-R2 changes the active old Level 6 puzzle to Trust Door Light Path, and Chapter 5 still completes through the old Level 8 bridge id without changing `saveVersion` or `gameCompleted`.

Part 42M expands the Chapter 6 finale platformer slice inside retained old Level 9. The old rooftop synthesis route remains intact, then continues into prior-clue memory markers, three wide slow vertical floating platforms, final court staging, a heart-seal/final-door payoff, and an extra final-court checkpoint. Old Level 10 geometry remains retained and addressable through dev/test routes; its ceremonial memory-marker ideas are reused by pattern while the active final puzzle is now the Part 45F-R2 three-ring Final Seal. After Part 44C, active Chapter 6 routes from the final seal directly to `FinalVerdictScene`, and only Accept Verdict marks `gameCompleted`.

Part 42O verifies the expanded six-chapter bridge after the final continuity rewrite. No routing, save, geometry, or puzzle-mechanic migration is performed in this QA pass. The active duration metadata now targets roughly 20-28 minutes total: Chapter 1 3-4 minutes, Chapter 2 4-5 minutes, Chapter 3 3.5-4.5 minutes, Chapter 4 4-5 minutes, Chapter 5 5-6 minutes, and Chapter 6 5-6 minutes. `saveVersion` remains 1 and all chapter completion still writes through the retained old level ids until a separate save migration is approved.

Part 44D supersedes the Part 42O runtime metadata with the 10-15 minute gift target while preserving the richer platformer routes. The geometry pass stayed small: it widened/slowed the active tram, drifting-paper, archive-drawer, Chapter 5 elevator, and Chapter 6 floating-platform specs, and moved the Chapter 6 third checkpoint to the pre-ascent ledge so failures in the final climb replay less rooftop. No route wrapper, save schema, puzzle mechanic, dev route, or final verdict text changes were part of that pass.

Part 46A-R2 structurally rebuilds the active platformer geometries inside the retained old level ids instead of adding new route wrappers. The current active duration metadata targets Chapter 1 at 75-105 seconds, Chapter 2 at 105-135 seconds, Chapter 3 at 90-120 seconds, Chapter 4 at 105-135 seconds, and Chapters 5-6 at 120-150 seconds. The rebuilt routes increase world height/width where needed, preserve Phaser camera bounds through the existing `worldWidth`/`worldHeight` geometry fields, and keep touch controls screen-fixed through the existing `TouchControls.ts` DOM overlay. Chapter 5 and Chapter 6 now use longer vertical worlds with stable ledges around elevator/floating-platform transitions; checkpoints remain static-ground respawn points rather than moving-platform spawns. Save write-through ids, puzzle routes, dev routes, old level geometry exports, and the final verdict boundary remain unchanged.

Part 44E simplified the active Chapter 5 puzzle while keeping the same Echo Path module and chapter bridge. Part 45E-R2 supersedes that active route with `trustLightPath/`: select the correct question, rotate three large mirrors/sigils so the lantern light travels through the Silver Key relay to Trust, then show blue-ribbon pages and the unfinished letter as success/reveal continuity. Old Echo Path, old Level 7 Lantern Sequence, and old Level 8 Argument Tower modules remain retained source material, but active Chapter 5 no longer requires those separate puzzle solves.

Part 45D-R2 revised replaces the active Chapter 3 and Chapter 4 puzzle modules without changing platformer geometry, completion ids, or save schema. Chapter 3 / old Level 4 now uses `depositionOrder/`: four witness-note strips are placed into a vertical deposition statement, and the correct order reveals the archive code. Chapter 4 / old Level 5 now uses `caseFileSorting/`: five archive documents are placed into file order, the margin reads `No. Given.`, and the Silver Key must be taken before filing the clue. The old `witnessLens/` and `archiveDetailFinder/` modules remain retained for legacy/source material and possible dev routes.

## Visual Novel Layer

Part 32 adds a lightweight VN layer, Part 33 extends it through Level 5, Part 34 extends it through Level 10, and Part 35 adds pacing/readability guardrails. `src/types/VisualNovel.ts` defines `VisualNovelSceneSpec`, scene placements, dialogue lines, and scene targets. `src/content/vnScenes.ts` stores the Level 1-10 intro, pre-puzzle, and post-puzzle scenes. `src/game/systems/VnFlow.ts` keeps target lookup and line advancement testable outside Phaser.

`VisualNovelScene` renders a DOM overlay with a case-file styled panel, title, speaker chip, dialogue text, Continue, Skip, and line counter. Enter/Space advance the line; Escape/S skip to the target scene. Text is instant in Part 32, so reduce-motion does not need a typewriter override yet. Future typewriter or portrait work should keep the same data-driven scene contract and disable animation when reduceMotion is enabled.

Part 35 keeps VN text instant and stateless, trims the densest dialogue lines, and adds mobile-landscape CSS tightening for short-height screens so the dialogue panel does not need to grow into a large cutscene surface.

Part 36 adds `src/game/systems/VnPresentation.ts` as the pure presentation mapping for the VN layer. It resolves known speakers to procedural placeholder portraits and derives a background variant from an explicit scene setting or the scene `levelId`. `VisualNovelScene` renders a compact active portrait stage and a level-themed CSS background using those helpers. These are CSS/procedural placeholders only: no real portraits, generated character art, external images, music, voice, or private photos are loaded.

Known speaker placeholders are Maria, Case File, Narrator, and Secret Client, with a default fallback for unknown speakers. Known level background variants are kancelaria, tram-night, rebuilt-street, vistula, archive, courthouse, garden, argument-tower, rooftops, and court-heart, with `default-case-file` as the safe fallback. The panel entry animation is small and disabled when the VN overlay has `data-reduce-motion="true"`.

Normal Level 1 flow is:

Title/CaseFile -> VN `vn-level-1-intro` -> PlatformerScene level 1 -> VN `vn-level-1-before-puzzle` -> PuzzleScene level 1 -> VN `vn-level-1-after-puzzle` -> EvidenceRevealScene level 1.

Normal Level 2-9 flow starts from Level Select:

LevelSelectScene -> VN `vn-level-N-intro` -> PlatformerScene level N -> VN `vn-level-N-before-puzzle` -> PuzzleScene level N -> VN `vn-level-N-after-puzzle` -> EvidenceRevealScene level N.

Normal Level 10 flow starts from Level Select:

LevelSelectScene -> VN `vn-level-10-intro` -> PlatformerScene level 10 -> VN `vn-level-10-before-puzzle` -> PuzzleScene level 10 -> VN `vn-level-10-after-puzzle` -> FinalVerdictScene.

Level Select replay keeps the existing low-risk Level 1 behavior and starts PlatformerScene level 1 directly. For Levels 2-10, replay can show the intro VN again; Skip keeps replay fast.

Direct dev/test routes still bypass the VN layer for QA: `?scene=platformer&level=N` opens the platformer and `?scene=puzzle&level=N` opens the puzzle. Dev/test mode also supports `?scene=vn&id=vn-level-1-intro` through `?scene=vn&id=vn-level-10-after-puzzle` for dialogue smoke testing.

Active chapter flow after Part 44C is intentionally lighter than the retained old-level flow: short chapter intro VN, platformer, optional one-line pre-puzzle VN, puzzle, concise clue reveal for Chapters 1-5, and direct final verdict handoff for Chapter 6. This reduces story UI friction without changing platformer geometry, puzzle mechanics, save schema, or final verdict text.

VN scenes are stateless in Parts 32-34. They do not mark levels complete, unlock levels, or change the save schema. Evidence reveal remains the Level 1-9 completion boundary, and `FinalVerdictScene` remains the Level 10 completion boundary after Accept Verdict.

## Opening Cinematic Layer

The normal boot flow is:

BootScene -> PreloadScene -> OpeningStartScene -> OpeningCinematicScene -> TitleScene.

Dev/test routes still bypass the opening layer so direct QA routes remain fast. `OpeningStartScene` is a DOM/CSS start gate with one real `Start` button and no save/progression side effects. The current opening art includes a baked visual Start button, so the scene overlays a transparent accessible HTML `<button>` on top of that visual button using a responsive 16:9 artboard aligned to the covered background image. `OpeningCinematicScene` reads `src/content/openingCinematic.ts`, auto-plays 7 timed beats, and then starts `TitleScene`. As of Part 49A-R2/R3, the active cinematic renders the seven public WebP frames in `public/assets/final/opening/` as a clean full-screen movie sequence with crossfades, visible code-rendered cinematic captions, a small Skip affordance, and reduced-motion-safe behavior. It does not render VN panels, speaker boxes, title overlays, character cards, parchment dialogue boxes, or procedural placeholder panels over the final frames.

The cinematic is stateless. It does not add "seen intro" persistence and does not change `saveVersion`. Returning to title from inside the game starts `TitleScene` directly, which keeps replay and settings flows fast. Skip is available from the cinematic via button, Enter, or Escape and lands cleanly at `TitleScene`. Reduced Motion shortens/simplifies beat timing and disables the longer visual transform transition.

## SaveManager Architecture

`SaveManager` uses localStorage when available and falls back to in-memory operation when storage is missing or blocked. It accepts injected storage for tests, safely parses stored JSON, and resets to default data when corrupted.

Part 4 keeps `saveVersion` at `1`. Part 22 adds a backward-compatible `gameCompleted` boolean while preserving the same save version because old saves normalize missing values to `false`. The save fields are now `completedLevelIds`, `unlockedLevelIds`, `currentLevelId`, `gameCompleted`, `muted`, `reduceMotion`, and `lastUpdatedAt`. Partial save objects, corrupted JSON, missing storage, invalid level IDs, and missing `gameCompleted` must normalize safely.

Part 44G.5 leaves the internal legacy save key `maria-tenth-exhibit-save` unchanged. It is not player-facing, and changing it without a migration would make existing browser progress appear to disappear.

## GameFlow State Machine

`GameFlow` models the future sequence:

Title -> Opening Case File -> Platformer Level N -> Puzzle N -> Evidence Reveal N -> Next Level -> Final Verdict.

It is pure TypeScript and covered by unit tests.

For the completed core loop, returning players default from Title to Level Select. Selecting completed Levels 1-10 replays them. Solving Level 10 routes through `vn-level-10-after-puzzle` and then to `FinalVerdictScene`; accepting the verdict marks Level 10 complete and `gameCompleted: true`, then offers Replay Finale, Level Select, Credits, and Back to Title.

## Future Platformer Module Plan

The platformer code lives in `src/game/platformer/`:

- `constants.ts` stores movement and visual constants.
- `levelGeometry.ts` stores deterministic Level 1 layout data.
- `LevelBuilder.ts` creates Phaser placeholder shapes from geometry.
- `PlayerController.ts` owns keyboard/touch movement, coyote time, and jump buffering.
- `CheckpointSystem.ts` owns in-memory checkpoint respawn.
- `TouchControls.ts` owns the HTML touch-control overlay.

Part 5 extends the same architecture to multiple platformer geometries. `levelGeometry.ts` now exposes Levels 1-10 keyed by `levelId`. Level 2 adds gentle moving tram platforms through data-driven moving platform specs with start/end points and positive speed. Level 4 reuses that same moving-platform runtime for slow drifting paper platforms. `LevelBuilder` builds those moving platforms as Arcade bodies, while `PlatformerScene` updates their movement and reuses the same player, checkpoint, collectible, exit, touch, and keyboard systems.

Moving-platform timing must remain forgiving. If Arcade carrying behavior needs future polish, level geometry should keep platforms wide and gaps safe enough that the level stays birthday-gift friendly.

Part 7 adds Level 3 rebuild groups to `levelGeometry.ts`. Each group has a glowing trigger and one or more initially inactive rebuildable platforms. `LevelBuilder` renders rebuildable platforms as faint outlined static bodies with collision disabled. `PlatformerScene` activates a group when Maria overlaps the trigger, enables the matching platform bodies, brightens their placeholder art, and keeps the group active through checkpoint respawns. This is a small platformer mechanic, not the future reconstruction puzzle system.

Part 9 adds optional Level 4 witness-note fragments to `levelGeometry.ts`. These are in-memory pickups only: `LevelBuilder` renders small note rectangles, `PlatformerScene` hides each fragment after collection, and no save schema changes are made. The fragments guide the player and provide short witness-copy feedback, but they do not block level completion.

Part 11 adds Level 5 archive progression to `levelGeometry.ts`: `archiveKeys`, `archiveDoors`, and `tinyDetailNotes`. `ArchiveGate.ts` keeps pure in-memory key/door state testable. `LevelBuilder` renders key and door placeholder rectangles, while `PlatformerScene` opens matching doors after key collection. Tiny-detail notes reuse the optional pickup pattern and do not affect save/progression.

Part 13 adds Level 6 choice-door navigation to `levelGeometry.ts`: `choiceDoors` and `echoFragments`. `ChoiceDoor.ts` keeps pure door resolution testable. `LevelBuilder` renders labeled symbolic doorway zones, while `PlatformerScene` teleports Maria to forward or loop-back destinations with gentle feedback. Echo fragments reuse optional pickup behavior and do not affect save/progression.

Part 15 adds Level 7 lantern-switch navigation to `levelGeometry.ts`: `lanternSwitches`, `lightRevealGroups`, and `quietEvidenceFragments`. `LanternSwitch.ts` keeps pure reveal state testable. `LevelBuilder` renders glowing lantern zones and initially inactive soft platforms, while `PlatformerScene` activates a lantern, enables the matching platforms, and keeps them active during the run. Quiet evidence fragments reuse optional pickup behavior and do not affect save/progression.

Part 17 extends moving platforms with optional vertical ranges for Level 8 elevators. Horizontal movers keep their existing `fromX`/`toX` behavior; vertical elevators use `axis: "vertical"` with `fromY`/`toY`. `PlatformerScene` also uses full world-height camera bounds so the camera can follow the tower ascent. Level 8 argument fragments reuse the optional pickup pattern and do not affect save/progression. Hazards were intentionally skipped for Part 17 to avoid a late-game difficulty spike before the vertical route is proven stable.

Part 42L reuses those same vertical moving-platform specs in the active Chapter 5 bridge route. Chapter 5 elevators are intentionally wide and slow, with static ledges and checkpoints around the vertical section so missed jumps stay recoverable on mobile. If Arcade carry behavior needs future polish, tune platform width, speed, and landing spacing before introducing any new moving-platform system.

Part 42M reuses the same vertical moving-platform specs in the active Chapter 6 bridge route. Chapter 6 floating platforms are wider and slower than the old late-game tower, with static ledges before/after the ascent and a final-court checkpoint so the finale stays ceremonial rather than difficult. No new moving-platform system is introduced.

Part 19 adds Level 9 as a mechanic synthesis route. It composes the existing moving platform, rebuild group, and lantern reveal systems in one longer rooftop level without introducing new runtime mechanics. The Unfinished Letter is the required clue. Optional evidence fragments were intentionally skipped for Part 19 because the project does not yet have a generic evidence-fragment pickup system; adding one would be extra architecture for a non-blocking detail.

Part 21 adds Level 10 as a ceremonial finale platformer route. It reuses the existing moving platform, rebuild group, and lantern reveal systems lightly, then presents previous clues as non-required memory markers using existing hint and decoration data. Part 44G.5 softens the required clue label to The Heart Seal before the verdict, and the exit targets PuzzleScene level 10. No final verdict or real final-letter puzzle is implemented in this part.

Part 19.5 adds a developer-only level tuning overlay under `src/game/debug/`. `debugQueryParams.ts` parses direct scene routes and optional platformer spawns, `debugClipboard.ts` keeps copy/serialization helpers pure and tested, and `DevLevelEditor.ts` owns the runtime Phaser grid, bounds, labels, selection, and nudging. `PlatformerScene` only creates this editor when `isDevMode()` is true. Runtime edits update the current scene objects only and never write source files or save data.

Part 19.6 adds dev-only coordinate override persistence. Browsers cannot write TypeScript source files directly, so the editor saves tuned coordinates through a Vite dev-server middleware at `/__dev/level-overrides/:levelId`. The middleware is registered only for `serve`, validates level ids and object payloads, and writes pretty JSON to `dev-level-overrides/level-N.json` using fixed filenames only. PlatformerScene fetches these overrides in dev/test mode, merges them with cloned base geometry via `applyDevLevelOverrides`, and then builds the scene. Production builds ignore this endpoint and do not load override files.

Moving platform debug nudges now shift the whole movement path: current `x/y`, `fromX/toX`, and `fromY/toY` move by the same delta while speed and axis are preserved. This keeps horizontal movers and vertical elevators traveling along their newly shifted route instead of snapping back to their original anchors.

Selected platform-like debug objects can also be resized in the overlay. Source geometry uses top-left rectangle coordinates, while Phaser rectangles/zones are positioned at their centers, so resize keeps source `x/y` fixed, expands width to the right and height downward, then recenters the runtime object and updates its Arcade body. Resizable objects are static platforms, moving/elevator platforms, rebuildable platforms, light-revealed platforms, and archive doors. Minimum debug resize dimensions are 16px wide and 8px high. Moving/elevator resize changes only `width` and `height`; it preserves `fromX/toX/fromY/toY`, axis, and speed.

## Active Puzzle Module Plan

The puzzle code lives in `src/game/puzzles/`:

- `PuzzleRegistry.ts` resolves the retained redesigned puzzle types used by active chapter wrappers and legacy dev routes, and safely falls back for unsupported or retired legacy types.
- `caseMosaic/` owns the retained Level 1 puzzle route. Part 45B-R2 restores the active player-facing mechanic as a 3x2 sealed-envelope reconstruction with tap-to-place and optional drag/drop. Part 45C-R2 adds the visible solved payoff for Brass Key, Tram Ticket, and Glowing Route without changing the six-piece answer logic.
- `caseMosaic/caseMosaicTypes.ts` keeps the six envelope piece specs and board/tray state; some transitional envelope-interaction fields remain internal compatibility only and are not the active solve path.
- `caseMosaic/caseMosaicContent.ts` stores the active Level 1 sealed-envelope copy: open the envelope, reveal the Brass Key and Tram Ticket, then inspect the route.
- `caseMosaic/caseMosaicLogic.ts` owns pure `openEnvelope`, `inspectTicket`, reset, progress, and solved-state checks while retaining older piece helpers as source/compatibility structure.
- `caseMosaic/CaseMosaicPuzzle.ts` renders the mobile-friendly DOM clue interaction with a large envelope tap target, key/ticket reveal, route glow, reset, feedback, and File Clue action.
- `caseTimeline/` owns the Level 2 Case Timeline puzzle system introduced in Part 27.
- `caseTimeline/caseTimelineTypes.ts` defines timeline specs, tram stops, task tiles, correct sequence, tray state, placed slots, progress, and state.
- `caseTimeline/caseTimelineContent.ts` stores data-driven timeline specs. Part 27 adds only the Level 2 Golden Stamp tram timeline.
- `caseTimeline/caseTimelineLogic.ts` owns pure selected-task, tap-to-place, slot replacement, placed-task movement, swap, tray restoration, reset, progress, completion, and solved-state checks.
- `caseTimeline/CaseTimelinePuzzle.ts` renders the mobile-friendly DOM tram-line UI with four stops, task tray, lit route segments, progress text, and a schedule-sealed stamp.
- `rebuildPuzzle/` owns the retained old Level 3 puzzle route used by active Chapter 2. Part 45B changes the active player-facing mechanic from a six-piece rotating repair board into a short Hidden Wall / Wave Mark clue interaction.
- `rebuildPuzzle/rebuildPuzzleTypes.ts` keeps legacy repair data for compatibility and adds key-selected, key-turned, activated-wall-mark, and wave-mark-revealed state.
- `routeTilePuzzle/` owns the active old Level 3 / Chapter 2 puzzle route introduced in Part 45B-R2.
- `routeTilePuzzle/routeTilePuzzleTypes.ts` defines rotatable route tiles, directions, rotations, start/target anchors, route progress, and solved state.
- `routeTilePuzzle/routeTilePuzzleContent.ts` stores the Chapter 2 Hidden Wall content: connect Stamped Ticket, Golden Stamp, Keyhole, Hidden Wall, and Wave Mark.
- `routeTilePuzzle/routeTilePuzzleLogic.ts` owns pure tap-to-rotate state, locked tile handling, route connection traversal, reset, progress, and answer checks.
- `routeTilePuzzle/RouteTilePuzzle.ts` renders the mobile-friendly DOM route board with six large tiles, tap rotation, route glow feedback, reset, and File Clue.
- `rebuildPuzzle/rebuildPuzzleContent.ts` remains retained source/legacy material for the older hidden-wall interaction.
- `rebuildPuzzle/rebuildPuzzleLogic.ts` owns pure `selectKey`, `useKeyOnWall`, `activateWallMark`, reset, progress, and solved-state checks while retaining older repair helpers as source/compatibility structure.
- `rebuildPuzzle/RebuildPuzzle.ts` renders the mobile-friendly DOM clue interaction with a large key, keyhole, wall marks, Vistula Wave Mark reveal, reset, feedback, and File Clue action.
- `depositionOrder/` owns the active old Level 4 / Chapter 3 puzzle introduced in Part 45D-R2 revised.
- `depositionOrder/depositionOrderTypes.ts` defines witness strips, line slots, correct order, progress, and state.
- `depositionOrder/depositionOrderContent.ts` stores the four-line witness statement and archive-code payoff.
- `depositionOrder/depositionOrderLogic.ts` owns pure strip selection, slot placement, swaps, tray restoration, reset, progress, and solved-state checks.
- `depositionOrder/DepositionOrderPuzzle.ts` renders the mobile-friendly DOM deposition note with tap-to-place fallback, optional shared drag/drop, visible line progress, and archive-code reveal.
- `witnessLens/` owns the retained Level 4 Witness Lens puzzle introduced in Part 28. It is no longer the active Chapter 3 player-facing puzzle after Part 45D-R2 revised.
- `witnessLens/witnessLensTypes.ts` defines the evidence note, statement strips, lens/stamp tools, inspected statement, marked statement, and solved state.
- `witnessLens/witnessLensContent.ts` stores the Level 4 Witness Note contradiction content and lens hints.
- `witnessLens/witnessLensLogic.ts` owns pure inspect, mark, clear, reset, completion, and solved-state checks.
- `witnessLens/WitnessLensPuzzle.ts` renders the mobile-friendly DOM evidence board with tap-to-inspect statements as the primary path, optional draggable lens/stamp tools, contradiction-stamp feedback, and a visible archive-code payoff after the correct mark.
- `caseFileSorting/` owns the active old Level 5 / Chapter 4 puzzle introduced in Part 45D-R2 revised.
- `caseFileSorting/caseFileSortingTypes.ts` defines archive document cards, file slots, correct order, Silver Key state, progress, and state.
- `caseFileSorting/caseFileSortingContent.ts` stores the five-document file order, `No. Given.` correction, and Silver Key payoff.
- `caseFileSorting/caseFileSortingLogic.ts` owns pure document selection, slot placement, swaps, reset, order correctness, Silver Key pickup, progress, and solved-state checks.
- `caseFileSorting/CaseFileSortingPuzzle.ts` renders the mobile-friendly DOM archive file with tap-to-place fallback, optional shared drag/drop, correction reveal, and required Silver Key pickup before filing.
- `archiveDetailFinder/` owns the retained Level 5 archive puzzle route/source material. It is no longer the active Chapter 4 player-facing puzzle after Part 45D-R2 revised.
- `archiveDetailFinder/archiveDetailFinderTypes.ts` defines archive pages, generous marked margin zones, magnifier position, discovered/marked margin state, correction completion, Silver Key state, progress, and solved state.
- `archiveDetailFinder/archiveDetailFinderContent.ts` stores the Level 5 Marginal Note content: original line, three marked margin zones, the `"No. Given."` correction, and Silver Key payoff.
- `archiveDetailFinder/archiveDetailFinderLogic.ts` owns pure magnifier movement, hit-zone inspection, discovered/marked margin state, reset, correction completion, Silver Key pickup, progress, and solved-state checks.
- `archiveDetailFinder/ArchiveDetailFinderPuzzle.ts` renders the mobile-friendly DOM archive page with optional draggable magnifier/bookmark tools, tap fallback on large margin zones, a visible `"No. Given."` correction reveal, and a tappable Silver Key before File Clue.
- `trustLightPath/` owns the active old Level 6 / Chapter 5 puzzle introduced in Part 45E-R2. It combines the correct question with a tap-to-rotate three-mirror lantern path from Lantern through the Silver Key relay to Trust, then reveals the blue-ribbon pages and unfinished letter.

- `echoPath/` owns the retained Level 6 Echo Path puzzle introduced in Part 29 and simplified in Part 44E. It is no longer the active Chapter 5 player-facing puzzle after Part 45E-R2, but remains source/legacy material.
- `echoPath/echoPathTypes.ts` defines the echo prompt, question tiles, courthouse doors, Silver Key state, selected question/key state, and solved state.
- `echoPath/echoPathContent.ts` stores the Level 6 Silver Key content: the correct question is "What remains when things are difficult?" and the correct door is Trust.
- `echoPath/echoPathLogic.ts` owns pure question placement, Trust-door unlocking, key placement, reset, completion, and solved-state checks.
- `echoPath/EchoPathPuzzle.ts` renders the mobile-friendly DOM courthouse board with draggable question tiles, a draggable Silver Key, large door targets, wrong-echo feedback, and tap fallback.
- `lanternSequence/` owns the Level 7 Lantern Sequence puzzle introduced in Part 30.
- `lanternSequence/lanternSequenceTypes.ts` defines the lantern ids, flame input sequence, preview state, current attempt, feedback, and solved state.
- `lanternSequence/lanternSequenceContent.ts` stores the Level 7 Lantern content: the correct quiet pattern is North -> East -> South -> East.
- `lanternSequence/lanternSequenceLogic.ts` owns pure lantern input, gentle wrong-state reset, progress, next expected lantern, reset, and solved-state checks.
- `lanternSequence/LanternSequencePuzzle.ts` renders the mobile-friendly DOM garden board with a draggable flame token, large lantern drop targets, Show Pattern, tap fallback, progress text, and a softly completed path.
- `argumentTower/` owns the Level 8 Argument Tower puzzle introduced in Part 30.
- `argumentTower/argumentTowerTypes.ts` defines tower slots, evidence blocks, correct slot mapping, tray state, placed blocks, progress, and solved state.
- `argumentTower/argumentTowerContent.ts` stores the Level 8 Blue Ribbon content with correct blocks Evidence, Patience, Showing Up, and Promise plus two decoys.
- `argumentTower/argumentTowerLogic.ts` owns pure block selection, placement, occupied-slot replacement, tray restoration, reset, stable-slot checks, progress, completion, and solved-state checks.
- `argumentTower/ArgumentTowerPuzzle.ts` renders the mobile-friendly DOM tower board with draggable blocks, large structure slots, tap fallback, stable/unstable visual states, and a Blue Ribbon completion wrap.
- `caseConstellation/` owns the Level 9 Case Constellation puzzle introduced in Part 30.
- `caseConstellation/caseConstellationTypes.ts` defines clue stars, meaning nodes, correct mappings, tray state, placed stars, progress, and solved state.
- `caseConstellation/caseConstellationContent.ts` stores the Level 9 Unfinished Letter synthesis content with eight prior clue stars mapped to their meanings.
- `caseConstellation/caseConstellationLogic.ts` owns pure star selection, node placement, occupied-node replacement, tray restoration, reset, correct-node checks, progress, completion, and solved-state checks.
- `caseConstellation/CaseConstellationPuzzle.ts` renders the mobile-friendly DOM night-sky board with draggable clue stars, generous meaning nodes, tap fallback, glowing correct lines, and a completed-letter state.
- `finalVerdictAssembly/` owns the Level 10 Final Seal puzzle. The folder name remains for route compatibility.
- `finalVerdictAssembly/finalVerdictAssemblyTypes.ts` defines final seal rings, ring rotations, six clue marks, lit-clue progress, and solved state.
- `finalVerdictAssembly/finalVerdictAssemblyContent.ts` stores the Level 10 Heart content with six active clue marks: Envelope, Wall, Witness, Correction, Trust, and Heart.
- `finalVerdictAssembly/finalVerdictAssemblyLogic.ts` owns pure ring rotation, ring alignment, lit-clue progress, reset, completion, and solved-state checks.
- `finalVerdictAssembly/FinalVerdictAssemblyPuzzle.ts` renders the mobile-friendly DOM court-seal board with three large tap-rotated seal rings, six clue lights, and a verdict-ready state that routes active Chapter 6 directly to `FinalVerdictScene`.
- `shared/dragDrop.ts` owns the small pointer-event drag/drop helper used by the redesigned DOM puzzles. It creates a lifted ghost after a short movement threshold, highlights `[data-drop-id]` targets, reports the dropped item id to the owning puzzle, and leaves all puzzle state changes to each puzzle's pure placement logic.
- `shared/orderPuzzleLogic.ts` owns small reusable order movement helpers.

## Retired Puzzle Modules

Part 31 retires the older form-like and abandoned puzzle routes from runtime registration. The source folders remain in `src/game/puzzles/` as archived legacy code for reference and for safe later removal, but `PuzzleRegistry` and `PuzzleScene` no longer import or instantiate them. Retired types now resolve to the unsupported placeholder path if requested directly.

Retired folders are `documentOrdering/`, `calendarSequence/`, `reconstruction/`, `contradiction/`, `memoryMatch/`, `crossExamination/`, `patternRepeat/`, `argumentBuilder/`, `evidenceLinking/`, `finalLetterAssembly/`, `evidenceBoard/`, and `caseBoard/`. Their existing pure tests may remain temporarily as legacy regression coverage, but they no longer represent active player routes.

Part 3 implements the original Level 1 `document-ordering` puzzle. Part 6 implements the Level 2 `calendar-sequence` puzzle. Part 8 implements the Level 3 `reconstruction` puzzle. Part 10 implements the Level 4 `contradiction` puzzle. Part 12 implements the Level 5 `memory-match` puzzle. Part 14 implements the Level 6 `cross-examination` puzzle. Part 16 implements the Level 7 `pattern-repeat` puzzle. Part 18 implements the Level 8 `argument-builder` puzzle. Part 20 implements the Level 9 `evidence-linking` puzzle. Part 22 implements the Level 10 `final-letter-assembly` puzzle and final verdict.

Part 26 redesign v2 moved the puzzle-layer redesign to `Case Mosaic Puzzle`. Part 45B-R2 restores active Level 1/Chapter 1 to Case Mosaic after the rejected open-envelope-only branch. The puzzle uses six procedural envelope fragments, tap-to-place fallback, optional drag/drop, and a clear restored-clue payoff.

Level 1 uses a 3x2 sealed-envelope mosaic with six procedural visual fragments: top-left corner, top flap, top-right corner, bottom-left body, rose seal, and bottom-right body. The final image is made from CSS shapes only; no external art is loaded. The board reports placed/correct progress, gives gentle incomplete/wrong feedback, and shows an clue-restored stamp on success before routing to `EvidenceRevealScene` level 1.

Part 27 adds `Case Timeline: The Golden Stamp` for Level 2. Players tap task tiles and place them onto four tram-line stops: Start, Review, Prepare, and Submit. Correct neighboring stops light the golden route, and solving the full Read -> Check -> Prepare -> Submit sequence seals the schedule before routing to `EvidenceRevealScene` level 2. This keeps Level 2 thematically tied to deadlines and responsibility without turning it into a list-ordering form.

Part 27.5 makes drag-and-drop the primary interaction for Level 1 Case Mosaic and Level 2 Case Timeline while preserving tap-to-select/tap-to-place as the accessibility and mobile fallback. The DOM puzzle items use pointer events rather than native HTML5 drag/drop so mouse and touch share the same path. Dragged items lift into a ghost preview, valid slots or tray targets highlight, invalid drops leave state unchanged, and successful drops call the same pure `select` + `place` or `remove` logic as the fallback path.

Part 28 converted Level 3 and Level 4 to distinct tactile puzzle mechanics. Part 45B-R2 replaces active old Level 3 / Chapter 2 with `route-tile-puzzle`: tap six large route tiles to rotate a stamped path from the ticket through the keyhole and hidden wall to the Vistula wave mark. The older `rebuildPuzzle` source remains retained, while active routing and save/progression behavior are preserved. Part 45D-R2 revised replaces active old Level 4 / Chapter 3 with `deposition-order`: place four witness-note strips in order, reveal the archive code, and file the Witness Note clue. The older `witnessLens` source remains retained but is no longer active player flow.

Part 29 converts Level 5 and Level 6 to distinct tactile mechanics. Part 45D-R2 revised replaces active old Level 5 / Chapter 4 with `case-file-sorting`: arrange five archive documents, align the margin to reveal `"No. Given."`, then take the Silver Key before filing the clue. The older `archiveDetailFinder` source remains retained but is no longer active player flow. Part 45E-R2 replaces active old Level 6 / Chapter 5 with `trust-light-path`: choose the question that opens Trust, tap-rotate three mirrors/sigils to carry lantern light through the Silver Key relay, and file the clue after Trust opens. The older `echoPath` source remains retained, and this change does not alter save schema or platformer flow.

Part 30 converts Levels 7-10 to the final redesigned tactile puzzle set. Level 7 routes to `lantern-sequence`, a calm flame path with Show Pattern and tap fallback. Level 8 routes to `argument-tower`, a block-stacking structure puzzle for the Blue Ribbon. Level 9 routes to `case-constellation`, a synthesis board where prior clue stars snap to meaning nodes. Level 10 routes to `final-verdict-assembly`, which Part 45F-R2 simplifies into a ceremonial three-ring final seal puzzle while preserving the existing Accept Verdict save/completion boundary.

Puzzle interludes should be short, readable in 5 seconds, solvable in 20-40 seconds, and friendly to mobile taps. Future redesign work should build a coherent family of tactile case-file puzzles rather than converting every level to the same image mosaic or returning to unrelated form-like mini-games.

After Part 31, the old Level 10 final-letter-assembly puzzle is archived legacy code only. The active Level 10 route is `final-verdict-assembly`, which now uses tap-rotated seal rings and six clue lights around a court seal and still reaches `FinalVerdictScene` only after the seal is solved and the short VN handoff completes.

`FinalVerdictScene` uses `storyContent.finalVerdict` as the single source of approved final text. It does not mark progress on scene entry; only Accept Verdict calls `SaveManager.markGameCompleted()`, which marks Level 10 complete and sets `gameCompleted` true. After acceptance, the scene shows "Case closed. Love confirmed." and provides Replay Finale, Level Select, Credits, and Back to Title.

## Clue Chain Continuity

Part 41 adds `src/content/clueChain.ts` as a pure data layer for visible continuity. Each level entry records the filed clue, solved meaning, next clue, next location, next hint text, next action label, visual motif, and puzzle-success follow-up. `EvidenceRevealScene` resolves that data by `levelId` and shows a compact next-clue panel for Levels 1-9 after the clue-filed certificate. Level 10 has no next clue in the chain and continues to route through `FinalVerdictScene` after the final VN handoff.

The clue-chain data does not change save/progression, VN flow, puzzle routing, or level geometry. Puzzle modules may use each spec's optional `successFollowUp` as a second feedback line, but solved-state logic and answer validation remain unchanged.

After Part 31, the old Level 9 evidence-linking puzzle is archived legacy code only. The active Level 9 route is `case-constellation`, which maps eight prior clue stars to meaning nodes, routes to `EvidenceRevealScene` level 9 when solved, and still unlocks Level 10 without starting the final verdict.

After Part 31, the old Level 8 argument-builder puzzle is archived legacy code only. The active Level 8 route is `argument-tower`, where players build a stable four-slot evidence structure and route to `EvidenceRevealScene` level 8 on success.

After Part 31, the old Level 7 pattern-repeat puzzle is archived legacy code only. The active Level 7 route is `lantern-sequence`, which keeps the same non-flashing memory principle but makes the flame token and lantern path tactile with drag/drop plus tap fallback.

In development, `?scene=puzzle&level=1` can open the Level 1 puzzle directly for smoke testing without brittle platformer traversal.

Development smoke routes also support `?scene=platformer&level=1`, `?scene=platformer&level=2`, `?scene=platformer&level=3`, `?scene=platformer&level=4`, `?scene=platformer&level=5`, `?scene=platformer&level=6`, `?scene=platformer&level=7`, `?scene=platformer&level=8`, `?scene=platformer&level=9`, `?scene=platformer&level=10`, `?scene=puzzle&level=2`, `?scene=puzzle&level=3`, `?scene=puzzle&level=4`, `?scene=puzzle&level=5`, `?scene=puzzle&level=6`, `?scene=puzzle&level=7`, `?scene=puzzle&level=8`, `?scene=puzzle&level=9`, `?scene=puzzle&level=10`, `?scene=vn&id=vn-level-1-intro`, `?scene=vn&id=vn-level-5-before-puzzle`, `?scene=vn&id=vn-level-10-after-puzzle`, `?scene=final-verdict`, `?scene=level-select`, `?completeLevel=1` through `?completeLevel=10`, and `?gameCompleted=true`. These routes are development-only helpers and must not expose private content beyond the approved verdict text.

Part 42G confirms the active player-facing route policy:

- The Case Archive renders only 6 chapter cards from `src/content/chapters.ts`.
- Player-facing progress is chapter-based (`N/6 chapters closed`).
- Active chapter Play/Replay routes go through `src/game/systems/ChapterBridge.ts`, which maps chapters onto retained legacy runtime ids during the bridge.
- Chapter dev routes such as `?scene=platformer&chapter=6` and `?scene=puzzle&chapter=6` are supported for QA.
- Old routes such as `?scene=platformer&level=10`, `?scene=puzzle&level=7`, and `?scene=vn&id=vn-level-10-after-puzzle` are retained as dev/test/source-material routes only. They must not appear in player-facing UI.
- `SaveManager` still uses `saveVersion = 1`, old completed level ids, and old Level 10 as the final completion boundary. Final chapter save migration remains a separate future part.

Platformer dev routes also accept `checkpoint` and `spawn` parameters: `?scene=platformer&level=8&checkpoint=2` starts at the second checkpoint respawn point, and `?scene=platformer&level=8&spawn=x:1450,y:260` starts at an exact world coordinate. Direct platformer dev routes are scene-only helpers and avoid changing persistent progress.

When a platformer dev route is open, F1 toggles the level editor overlay. G toggles a 32px world grid, H toggles bounds, P toggles labels, X toggles snap-to-grid, A adds a static platform, Ctrl/Cmd+D duplicates the selected static platform, Delete/Backspace deletes the selected static platform through an override, C copies the player position, Shift+C copies the pointer world position, J/T copy selected object JSON/TypeScript snippets, E exports the current debug registry, arrow keys nudge the selected object by 1px, Shift+Arrow nudges by 10px, Alt+Arrow nudges by 32px, Ctrl/Cmd+Arrow resizes selected resizable objects by 1px, Ctrl/Cmd+Shift+Arrow resizes by 10px, Ctrl/Cmd+Alt+Arrow resizes by 32px, R restarts, and Shift+R restarts at the current player position. The overlay is compiled into the app but gated by `import.meta.env.DEV` or test mode and should not appear in production play.

Part 19.6 adds S to save the selected debug object override, Shift+S to save all dirty objects, and Shift+D to delete the selected object's saved override. Deleting an override restores the base source geometry on the next reload/rebuild. These controls call the dev-server middleware only; they do not use localStorage and do not touch SaveManager.

Dev-2 upgrades the dev override file format to a backward-compatible v2 schema. Old files with an `objects` map still load as modified existing objects. New saves serialize modified existing objects as `modifiedObjects`, newly authored static platforms as `addedObjects`, and hidden source static platforms as `deletedObjectIds`. Override application clones canonical TypeScript geometry, filters deleted static platform ids, applies modified-object rectangle overrides, appends validated added static platforms, and warns on duplicate or unknown ids without touching `src/game/platformer/levelGeometry.ts`. Added platforms are editor-authored override data only; keeper geometry should be baked manually in a later Codex-assisted pass.

The Dev-2 editor deliberately limits creation, duplication, and true deletion to static platforms. Moving platforms, checkpoints, clues, exits, triggers, and other interactables can still be selected and coordinate-tuned where previous editor support allowed, but they cannot be added, duplicated, or deleted in this phase. The Vite write middleware remains `serve`-only, production builds do not depend on `dev-level-overrides/`, and save/progression localStorage is unrelated to editor overrides.

Dev-3 adds a selected-object inspector inside the same F1 editor overlay. The inspector shows selected id, type, kind, source, status, x/y, width/height for resizable objects, and label for static platforms. Applying values updates the live Phaser object and the in-memory v2 override state; Save All persists that state through the existing dev-server endpoint. The editor also receives a read-only base-geometry snapshot so Revert Override can return visible base objects to canonical geometry before saving, while Revert Unsaved returns to the last saved override state without deleting that saved override. Delete Object remains the Dev-2 static-platform hide/remove action and is intentionally separate from both revert actions.

Inspector input focus suppresses editor shortcuts so typing numbers or text cannot accidentally nudge, delete, duplicate, save, or snap a selected object. The inspector remains gated by `import.meta.env.DEV` or test mode with the rest of the editor; production preview does not expose the F1 editor or the write endpoint.

Dev-4 adds moving-platform and elevator tuning to the selected-object inspector. Moving platforms expose editable `axis`, `speed`, `fromX`, `toX`, `fromY`, and `toY` fields in addition to the existing rectangle fields, and v2 overrides persist those fields through `modifiedObjects`. When a moving platform is selected, the editor draws a dev-only path preview from the start endpoint to the end endpoint, with green/red endpoint handles and a current-position marker. Dragging handles edits the active endpoint, constrains movement to the selected axis, respects the 32px snap toggle, updates the live runtime spec/body path, and marks the object dirty. Static platform add/duplicate/delete remains unchanged; moving-platform duplication/deletion is intentionally deferred so this phase stays focused on path and speed tuning.

Moving-platform validation rejects invalid axes, non-positive speeds, non-finite endpoints, and paths shorter than 8px before apply/save. The editor warns if a platform path extends outside world bounds. These checks protect the authoring override JSON, not player save data. Production builds still do not load the editor UI or expose the dev write middleware.

Dev-4B extends `addedObjects` so dev-authored moving/elevator platforms can live in override JSON alongside static platforms. `Add Moving Platform` creates a horizontal mover, `Add Elevator` creates a vertical lift, and duplicated moving/elevator platforms copy axis, speed, endpoints, size, and label into a new unique override id. Added moving platforms are appended to `geometry.movingPlatforms`, registered in the same runtime movement/collision list as canonical moving platforms, selected immediately, and editable through the Dev-4 inspector and endpoint handles. Added moving/elevator platforms can be removed through the added-object deletion path; deletion of base moving platforms remains deferred for production safety.

Dev-5 extends the same inspector to checkpoints, clues/interactables, and exits. Checkpoints expose editable `respawnX`/`respawnY` fields plus a Linked Respawn toggle. Linked mode moves the respawn marker by the same delta when the checkpoint trigger moves; unlinked mode allows the respawn marker to be edited numerically or dragged independently. The editor draws the checkpoint trigger, respawn marker, and a link line in dev mode only.

Clue/interactable identity, required/progression role, and exit target routes remain read-only, but their rectangles can be positioned and sized through the existing v2 `modifiedObjects` override flow. Dev-5 also adds reusable support validation helpers for selected checkpoints, checkpoint respawns, clues/interactables, and exits. The heuristic checks world bounds, positive dimensions, and whether a support platform sits beneath or adjacent within a generous search area; unsupported objects warn in the inspector, while outside-world or invalid-size objects block apply/save.

Dev-6 adds a full dev-only validation overlay on top of the same runtime/override-applied geometry. The pure validator returns a `DevValidationSummary` with `DevValidationIssue` entries containing severity, category, object id/type, message, optional suggested fix, and an optional marker rectangle. It checks missing/duplicate ids, non-finite or non-positive dimensions, world bounds, unsupported clues/interactables, unsupported exits/doors, checkpoint trigger/respawn support, player spawn support, moving-platform axis/speed/path validity, mobile comfort warnings, stale deleted override ids, and lightweight required-object expectations.

The validation overlay adds Validate Level, Auto Validate, and Show Validation Markers controls to the F1 editor. Auto validation refreshes after editor mutations without blocking normal authoring saves for heuristic warnings; hard schema problems are still rejected by the existing inspector/save validation paths. Marker drawing and issue-list selection are editor-only helpers and do not implement pathfinding or full jump reachability. Production builds still do not expose the F1 editor, validation markers, or the override write middleware.

Dev-6.5 documents the post-Dev-6 editor workflow in `docs/dev-editor-workflow.md`. The recommended polish loop is: open a dev platformer route, press F1, validate the baseline, edit support/platform/checkpoint/clue/exit/moving-platform data through overrides, save all dirty overrides, reload the same route, playtest, then later bake keeper override changes into canonical geometry in a separate pass. The next tooling gap is workflow safety rather than object coverage: undo/redo, an override summary panel, reset-current-level controls, and export/import polish should come before heavier editor sessions or a geometry bake pass.

Dev-7 adds that workflow-safety layer without changing canonical geometry. The editor records lightweight session snapshots of the v2 override state, selected object id, deleted ids, and dirty ids before mutating actions, then restores those snapshots for Ctrl/Cmd+Z undo and Ctrl/Cmd+Shift+Z / Ctrl/Cmd+Y redo. Undo/redo covers core override-authoring operations such as add, duplicate, delete, move, resize, inspector Apply, revert, reset, import, moving endpoint edits, and checkpoint respawn marker edits; disk writes still happen only through Save All.

The Dev-7 override summary panel displays modified, added, and deleted counts plus per-object rows. Visible modified/added objects can be selected or reverted from the panel, and deleted base static platforms can be restored by removing their ids from `deletedObjectIds`. Reset Level Overrides clears only the active level's in-memory `modifiedObjects`, `addedObjects`, and `deletedObjectIds` after confirmation and remains undoable before saving. Export Overrides produces JSON only with version, level/chapter metadata, current override data, project title, and timestamp. Import Overrides accepts JSON only, validates it with the same override schema, warns on level-id mismatch, previews summary counts, and applies imported data as unsaved dirty override state until Save All.

Dev-8A documents the safe bake workflow for converting reviewed override JSON into canonical `levelGeometry.ts`. The recommended policy is hybrid, with manual Codex-assisted baking first and future report-only validation tooling before any automated TypeScript rewrite. The bake plan itself changes no runtime code, canonical geometry, override files, gameplay, save data, or production behavior.

## HTML/CSS Overlay Plan

Use HTML/CSS for menus, rotate prompt, credits, accessibility/status text, and any UI that benefits from responsive layout. Keep real-time gameplay in Phaser.

Part 4 adds DOM overlays for the Title menu, settings, reset confirmation, and Level Select. They use large buttons for touch and clean up on scene shutdown.

`src/ui/icons.ts` provides the shared semantic icon registry for DOM overlays and other lightweight UI surfaces. It maps menu actions, all 10 clue ids, status chips, and VN speakers to CSS-only `.ui-icon` classes. The icons are procedural spans styled in `src/style.css`, so the game does not depend on external icon packs or raster UI images. Unknown clue/speaker/status cases resolve to safe case-file, speaker, or lock fallbacks.

## Audio Unlock Plan

Part 24 adds `src/game/systems/AudioManager.ts` as a small procedural WebAudio sound-effect layer. It generates short in-code tones for UI clicks, clue collection, checkpoints, puzzle completion, and final verdict acceptance. No external audio assets are loaded.

Audio waits for a user gesture before attempting to unlock, respects the saved `muted` flag, updates when Settings or the platformer M shortcut changes mute, and fails as a no-op if WebAudio is unavailable or blocked. There is no background music in this pass.

## Asset Pipeline Plan

Use `public/assets/` with separated audio, fonts, images, and sprites. Track every third-party asset in `CREDITS.md` before release.

Part 37 adds the final asset planning docs:

- `docs/visual-style-guide.md` defines the recommended storybook-polished 2D art direction, palette, scene priorities, and what should remain procedural.
- `docs/asset-budget.md` defines browser/static-hosting size targets, current build baseline, recommended formats, lazy-loading guidance, and GitHub Pages constraints.
- `docs/asset-replacement-plan.md` lists placeholder categories, final asset targets, priorities, format guidance, estimated size targets, source plans, and implementation risks.

Part 42I updates `docs/visual-asset-prompt-plan.md` and supporting asset docs for the active six-chapter game. Future final art should be organized around opening/menu assets, six chapter VN backgrounds, six chapter puzzle/frame sets, chapter clue bundles, platformer motifs, and final verdict seal support rather than ten isolated level image sets.

Future asset loading should stay scene-scoped. `PreloadScene` should load only small shared UI assets needed immediately. `PlatformerScene` should load only the selected level's art. `PuzzleScene` should load only the active puzzle board/token assets. `VisualNovelScene` should load only the current level or scene background and approved portrait assets. `EvidenceRevealScene` and `FinalVerdictScene` should load their small stamp/seal assets only when reached. Procedural fallback visuals should remain available for missing optional assets.

Part 48B prepares the first final visual asset target without adding files: `public/assets/final/opening-main-menu-office-desk.webp`, a 1920x1080 optimized WebP for the opening start screen and/or title menu. Part 49A-R2 integrates the separate seven-frame opening cinematic sequence under `public/assets/final/opening/` without changing the main menu background or VN images. Future asset passes should keep title/menu text and buttons in DOM/code, use fullscreen cover scaling, check desktop and mobile-landscape crops, update credits/source notes, and avoid turning `PreloadScene` into a large-background preload bucket.

Part 50R prepares `EvidenceRevealScene` for optional Chapter 1-5 image-backed reveal screens under `src/assets/final/reveals/`. The scene uses an `import.meta.glob` resolver so missing reveal files keep the current Phaser certificate/stamp fallback. When a mapped `RevealChapter0N.webp` exists, only that chapter reveal hides the old Phaser chrome and displays a contained full-screen image on a dark backing, while preserving the two-step Enter/tap/click flow: first input writes the existing clue/chapter completion state and status text, second input opens the Case Archive. Chapter 6 remains outside this reveal batch and continues from the Final Seal puzzle directly to `FinalVerdictScene`.

The current production build is still asset-light: public assets contain only folder notes, and the latest measured `dist/` output is about 1.8 MB uncompressed. Final art passes should recheck `dist/` size after each batch.

## Static Deployment Plan

Build with `npm run build` and deploy the generated `dist/` folder as a static site. `vite.config.ts` resolves the static base path from `VITE_BASE_PATH` and falls back to `./` for portable builds. Use `VITE_BASE_PATH=/` for root deployments, or `VITE_BASE_PATH=/repo-name/` for GitHub Pages project pages when absolute subpath URLs are preferred. `npm run preview` serves the built output locally for production-like smoke testing.

The optional GitHub Pages workflow is manual-only (`workflow_dispatch`) and runs typecheck, unit tests, and build before uploading `dist/`. Repository Pages settings must still be configured by the owner. Vercel, Netlify, and itch.io deployments are documented in `docs/deployment-guide.md`.

Production builds must not depend on dev-level override files. The override write middleware is registered only for Vite `serve`, and runtime overlay/dev-route checks depend on `isDevMode()`, which is false for production-like mode.

Bake-7 status: all active player-facing platformer routes now use canonical baked geometry for runtime Levels 1, 2, 4, 5, 6, and 9. Their reviewed dev-editor override JSON files are archived under `dev-level-overrides/archive/` as rollback/reference material, and normal dev override loading ignores those archived paths because it only reads exact root files such as `dev-level-overrides/level-N.json`. Remaining root override files for Levels 3, 8, and 10 are legacy/dev-only source-material overrides for retained old direct routes; they are not active six-chapter platformer dependencies and should be handled in a separate legacy override decision pass rather than baked into the active release.

## Risks And Mitigations

- Scope creep: keep each part small and update docs/changelog.
- Mobile frustration: use wide platforms, generous timing, and large touch targets.
- Save compatibility: preserve `saveVersion` and document migrations before schema changes.
- Asset licensing: add no unclear assets and audit credits before release.
- Tone drift: read the game bible before story or copy changes.
