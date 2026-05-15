# Six-Chapter Migration Plan

Part 42A planning document. This is a migration plan only: no gameplay, puzzle, content, save, route, test, or file-name changes are implemented here.

## Executive Summary

The current game is a complete 10-level clue trail with 10 platformer slices, 10 tactile puzzle interludes, three VN scenes per level, clue-chain continuity, level select progression, and Level 10 as the final-verdict completion boundary.

The proposed birthday-gift pacing target is a tighter 6-chapter game, roughly 18-22 minutes total, with each chapter about 50% richer than an existing level rather than a long 30+ minute chain. The story should still read as one continuous case:

Envelope -> route/stamp -> hidden wall -> witness -> archive correction -> trust door -> letter -> final court.

Recommended migration approach: introduce a new active chapter layer while keeping old level ids, old puzzle modules, and old geometry archived and dev-addressable during the transition. This protects existing save data, dev routes, puzzle tests, and the tuning overlay while allowing player-facing flow to become 6 chapters.

## Part 42B Status

Part 42B implements the typed future 6-chapter content layer beside the current 10-level runtime. The new planning/runtime-adjacent files are `src/types/ChapterSpec.ts`, `src/content/chapters.ts`, `src/content/chapterPuzzles.ts`, `src/content/chapterVnOutline.ts`, and `src/content/chapterClueChain.ts`.

These files are inactive in gameplay routing for now. The active player flow still reads `src/content/levels.ts`, `src/content/puzzles.ts`, `src/content/vnScenes.ts`, and `src/content/clueChain.ts`; `GameFlow`, `SaveManager`, Level Select, puzzle routing, VN routing, platformer geometry, and final verdict behavior remain on the 10-level structure until a later migration part.

## Part 42C Status

Part 42C switches the player-facing Case Archive to six chapter cards while preserving the old 10-level runtime and dev routes. `src/game/systems/ChapterBridge.ts` owns the temporary chapter availability and launch mapping; `src/game/ui/LevelSelectMenu.ts` now renders chapters from `src/content/chapters.ts` and translates Play/Replay into legacy level launches.

Temporary launch map:

| Chapter | Player-facing title | Legacy runtime launch |
|---|---|---|
| 1 | The Sealed Envelope | Old Level 1 |
| 2 | The Hidden Wall | Old Level 2 |
| 3 | The River Witness | Old Level 4 |
| 4 | The Archive of Corrections | Old Level 5 |
| 5 | The Door of Trust | Old Level 6 |
| 6 | The Court of the Heart | Old Level 9 |

Temporary completion thresholds:

| Chapter | Closed when old save has |
|---|---|
| 1 | Level 1 completed |
| 2 | Level 3 completed |
| 3 | Level 4 completed |
| 4 | Level 5 completed |
| 5 | Level 8 completed |
| 6 | `gameCompleted` or Level 10 completed |

This bridge does not change `saveVersion`, `SaveData`, `GameFlow.FINAL_LEVEL_ID`, `SaveManager` final completion, platformer geometry, active puzzle routing, active VN routing, or final verdict text. Old direct dev/test routes such as `?scene=platformer&level=7`, `?scene=puzzle&level=10`, and `?scene=vn&id=vn-level-10-intro` remain available.

## Part 42D Status

Part 42D converts Chapters 1 and 2 into active chapter-aware flows while keeping the legacy 10-level runtime/dev routes intact. `ChapterBridge.ts` now exposes active flow metadata for the implemented chapters, and PlatformerScene, PuzzleScene, EvidenceRevealScene, and VN scene targets can carry `chapterId` through those routes.

Active early flow map:

| Chapter | Platformer route | Puzzle route | Completion bridge | Notes |
|---|---|---|---|---|
| 1 - The Sealed Envelope | Old Level 1 | Old Level 1 Case Mosaic | Marks old Level 1 complete | Full chapter VN intro, pre-puzzle, post-puzzle, and chapter-aware reveal are active. |
| 2 - The Hidden Wall | Old Level 2 | Old Level 3 Rebuild Puzzle | Marks old Level 3 complete | Safe hybrid: stamped-route context is carried by VN/reveal text and the active puzzle performs the hidden-wall repair. Full Level 2+3 geometry merge is deferred. |

Player-facing Case Archive cards for Chapters 1 and 2 now launch their chapter VN flow instead of directly launching the old platformer. Direct old dev/test routes such as `?scene=platformer&level=1`, `?scene=platformer&level=2`, `?scene=platformer&level=3`, `?scene=puzzle&level=1`, `?scene=puzzle&level=2`, and `?scene=puzzle&level=3` remain available. New bridge dev routes are also available for the implemented chapters via `?scene=platformer&chapter=1`, `?scene=platformer&chapter=2`, `?scene=puzzle&chapter=1`, and `?scene=puzzle&chapter=2`.

## Part 42E Status

Part 42E converts Chapters 3 and 4 into active chapter-aware flows while preserving the legacy 10-level runtime/dev routes. Chapter 3 is a clean carryover from old Level 4: river platformer, Witness Lens puzzle, archive-code reveal, and old Level 4 completion write-through. Chapter 4 uses old Level 5 archive geometry and Archive Detail Finder, with the silver-key reveal moved into VN/reveal content rather than pulling in old Level 6 geometry.

Active middle flow map:

| Chapter | Platformer route | Puzzle route | Completion bridge | Notes |
|---|---|---|---|---|
| 3 - The River Witness | Old Level 4 | Old Level 4 Witness Lens | Marks old Level 4 complete | Full chapter VN intro, pre-puzzle, post-puzzle, and archive-reference reveal are active. |
| 4 - The Archive of Corrections | Old Level 5 | Old Level 5 Archive Detail Finder | Marks old Level 5 complete | Silver key is revealed through story/reveal content; old Level 6 courthouse geometry stays reserved for Chapter 5. |

Direct old dev/test routes such as `?scene=platformer&level=4`, `?scene=platformer&level=5`, `?scene=puzzle&level=4`, `?scene=puzzle&level=5`, and old VN ids for Levels 4-5 remain available. New bridge dev routes are also available for the implemented chapters via `?scene=platformer&chapter=3`, `?scene=platformer&chapter=4`, `?scene=puzzle&chapter=3`, and `?scene=puzzle&chapter=4`.

## Part 42F Status

Part 42F converts Chapters 5 and 6 into active chapter-aware flows while preserving the final verdict completion boundary. Because these are the highest-risk merged chapters, both use safe partial hybrids rather than full geometry/puzzle fusion.

Active final flow map:

| Chapter | Platformer route | Puzzle route | Completion bridge | Notes |
|---|---|---|---|---|
| 5 - The Door of Trust | Old Level 6 | Old Level 6 Echo Path | Marks old Level 8 complete | Courthouse is the playable spine; lantern, garden, and blue ribbon are carried through VN/reveal content. Full Level 7/8 geometry and hybrid puzzle merge are deferred. |
| 6 - The Court of the Heart | Old Level 9 | Old Level 10 Final Verdict Assembly | Final verdict acceptance marks game complete | Rooftops are the playable approach; constellation synthesis is carried through VN, then the final seal routes to FinalVerdictScene through chapter VN. |

FinalVerdictScene remains the only place where `gameCompleted` is marked, and only after Accept Verdict. The approved verdict text is unchanged. Direct old dev/test routes for Levels 6-10 remain available, and chapter bridge routes are available through `?scene=platformer&chapter=5`, `?scene=platformer&chapter=6`, `?scene=puzzle&chapter=5`, and `?scene=puzzle&chapter=6`.

## Part 42G Status

Part 42G cleans the active player-facing assumptions around the six-chapter game. The Case Archive shows six chapter cards and `/6 chapters closed`; old Level 1-10 cards are not shown in the normal player UI. Legacy old levels, puzzle routes, VN ids, and geometry remain retained as bridge/dev/source material rather than being deleted.

## Part 42H Status

Part 42H performs the full six-chapter QA and balancing pass without changing geometry, puzzle mechanics, save schema, assets, or final verdict text. It verifies the active Case Archive language, the chapter unlock ladder, the Chapter 6 verdict boundary, reset/settings behavior, retained old dev routes, chapter dev routes, and dev overlay smoke. Chapter 5 and Chapter 6 remain safe partial hybrids to avoid late-game bloat; full geometry/puzzle fusion and a final saveVersion migration remain future work.

## Part 42H.5 Status

Part 42H.5 adds `docs/six-chapter-expansion-audit.md` as a planning-only audit of the current six-chapter bridge. The audit confirms that the six-chapter structure is correct, but several chapters need richer traversal and clearer clue continuity before final pacing. It recommends a 20-28 minute target, modest expansions for Chapters 1-4, a focused Chapter 5 rebuild using old lantern/elevator/vertical material, and a ceremonial Chapter 6 court approach that restores selected old finale beats without changing the approved final verdict.

## Part 42I Status

Part 42I updates the visual asset and image-generation plan for the final six-chapter game. `docs/visual-asset-prompt-plan.md` is now organized around opening/menu assets, six chapter VN backgrounds, six chapter puzzle boards, clue bundle icons, platformer motifs, and final verdict seal support. No images are generated or integrated in this planning part.

## Part 42J Status

Part 42J begins implementing the expansion audit by enriching only Chapters 1 and 2. Chapter 1 still uses the retained old Level 1 runtime id, but its geometry now has a longer kancelaria-to-route route, visible brass key/tram ticket continuity, a route-awakening ending, and a second checkpoint. Chapter 2 still uses the retained old Level 2 runtime id, but its geometry now runs from tram movement into a rebuilt-street/hidden-wall section with a golden validator, keyhole rebuild trigger, Vistula wave-mark handoff, and three checkpoints.

No save migration, puzzle mechanic change, final verdict edit, asset addition, old route deletion, or Chapters 3-6 geometry change is part of this expansion step.

## Part 42K Status

Part 42K continues the expansion audit by enriching only Chapters 3 and 4. Chapter 3 still uses the retained old Level 4 runtime id, but its geometry now includes stronger Vistula/witness staging, a visible archive-code step after the Witness Note, and an archive-reference handoff. Chapter 4 still uses the retained old Level 5 runtime id, but its geometry now includes clearer archive-code/drawer staging, "No. Given." correction visuals, a file-spine/silver-key reveal pickup, courthouse direction, and an additional checkpoint.

No save migration, puzzle mechanic change, final verdict edit, asset addition, old route deletion, or Chapters 1-2/5-6 geometry change is part of this expansion step.

## Current Structure Audit

### Source-of-truth content

- `docs/story-bible.md` defines the connected 10-clue mystery and final verdict.
- `docs/game-bible.md` still describes the 10-clue structure while pointing to the story bible.
- `docs/level-plan.md` lists Levels 1-10, active puzzle types, target durations, and implementation history.
- `docs/content-style-guide.md` defines clue language, VN rules, puzzle wording rules, and final verdict safety.
- `src/content/levels.ts` defines exactly 10 `LevelSpec` records.
- `src/content/puzzles.ts` defines exactly 10 redesigned legacy puzzle specs retained for bridge/dev routes.
- `src/content/vnScenes.ts` defines 30 VN scenes: intro, before-puzzle, and after-puzzle for Levels 1-10.
- `src/content/clueChain.ts` defines 10 continuity entries. Levels 1-9 point to next clues; Level 10 points to the verdict.
- `src/content/story.ts` owns title, case-file copy, credits, final verdict text, and many fallback UI strings.
- `src/content/openingCinematic.ts` owns 7 opening beats.

### Runtime flow

- `src/game/systems/GameFlow.ts` has `FINAL_LEVEL_ID = 10`; Level 10 puzzle routes to `final-verdict`.
- `src/game/systems/SaveManager.ts` has `FINAL_LEVEL_ID = 10`; `markGameCompleted()` marks Level 10 and `gameCompleted`.
- `src/game/systems/LevelAvailability.ts` has explicit availability branches for Levels 1-10.
- In the original 42A audit, `src/game/ui/LevelSelectMenu.ts` rendered all `levels` and showed `[N]/10 clues filed`; Part 42C now renders 6 chapter cards through the bridge layer.
- `src/game/scenes/PuzzleScene.ts` imports the retained redesigned puzzle modules and has a dedicated old Level 10 final puzzle path used by the Chapter 6 bridge and legacy dev routes.
- `src/game/scenes/EvidenceRevealScene.ts` marks Levels 1-9 complete from reveal; Level 10 is not the normal reveal path.
- `src/game/scenes/FinalVerdictScene.ts` marks game completion only after Accept Verdict and replays Level 10.
- `src/game/platformer/levelGeometry.ts` stores all 10 geometries in one file and exports each geometry plus `platformerGeometries`.

### Tests and QA coupling

The following tests are tightly coupled to 10 levels and would need future updates:

- `src/tests/content.test.ts`: exactly 10 levels, ids 1-10, 10 puzzle types, 10 clue-chain entries, `/10` pacing.
- `src/tests/SaveManager.test.ts`: sequential unlock/completion through Level 10 and game completion on Level 10.
- `src/tests/GameFlow.test.ts`: Level 10 final route, Level 1-10 choices.
- `src/tests/LevelAvailability.test.ts`: explicit Level 1-10 availability and labels.
- `src/tests/platformerGeometry.test.ts`: geometry assertions for Levels 1-10.
- `src/tests/PuzzleRegistry.test.ts`: maps all 10 content levels.
- `src/tests/visualNovelContent.test.ts`: VN scenes for Levels 1-10 and Level 10 final route.
- `tests/e2e/smoke.spec.ts`: dev-route smoke tests and full flow assertions through Level 10.

### Main migration pressure points

- The final verdict is semantically tied to old Level 10.
- Save normalization clamps ids to 1-10.
- Level Select maps directly over `levels`.
- Puzzle routing is one active puzzle type per level id.
- Platformer geometry has useful old segments but no chapter abstraction.
- Dev editor overrides are likely keyed by old level ids and object ids.

## Proposed 6-Level Story Flow

| New chapter | Title | Absorbs old levels | Story purpose | Platformer theme | Main clue(s) | Puzzle purpose | VN purpose | Emotional reveal | Leads next | Duration | Risk |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | The Sealed Envelope | Old Level 1 plus first route beat from old Level 2 | Maria receives Case No. 16/05, the envelope, brass key, tram ticket, and first route. | Kancelaria desk route ending in tram-ticket glow. | Sealed Envelope, Brass Key, Tram Ticket | Rebuild the envelope, then reveal the route/ticket in one compact board. | Establish birthday morning, Maria's competence, and the clue trail premise. | Attention: Maria notices what others miss. | The ticket route seeks a golden stamp and hidden wall. | 2.5-3.5 min | Low-medium |
| 2 | The Hidden Wall | Old Level 2 and old Level 3 | The golden stamp reveals the route; the brass key opens a hidden wall; Maria repairs the wall image. | Tram/city timing into rebuilt street/keyhole. | Golden Stamp, Red Brick | Stamp the route and repair the hidden wall image. Could be one two-phase puzzle. | Show ordered responsibility turning into a physical route and keyhole. | Responsibility plus patience. | Repaired image reveals Vistula wave mark and witness. | 3-4 min | Medium |
| 3 | The River Witness | Old Level 4 plus archive bridge | Maria meets the witness by the Vistula; the note says the heart was not stolen. | Riverbank, bridge shadows, drifting papers, witness trail. | Witness Note | Inspect statements and mark contradiction. | Let the mystery pivot from theft toward voluntary giving. | Truth: Maria hears the quiet version. | Archive code appears at the note bottom. | 2.5-3.5 min | Low |
| 4 | The Archive of Corrections | Old Level 5 plus silver key discovery from old Level 6 | Maria follows the archive code, finds "No. Given.", and discovers the silver key. | Archive drawers, keys, doors, margin notes. | Marginal Note, Silver Key | Find/bookmark the correction and reveal key from file spine. | Reward careful observation and make the silver key feel earned. | Details: small corrections change the whole charge. | Silver key points to the Courthouse of Echoes. | 3-4 min | Medium |
| 5 | The Door of Trust | Old Levels 6, 7, and 8 | Maria uses the silver key, asks the right question, opens Trust, follows lantern light, and receives blue ribbon pages. | Courthouse corridor to garden to argument tower, but simplified. | Silver Key, Lantern, Blue Ribbon | One coherent tactile puzzle: question tile -> key -> lantern path -> ribboned pages. | Turn trust, warmth, and lived promise into one strong middle climax. | Trust and promise: what remains when things are difficult. | Blue ribbon releases the unfinished letter. | 4-5 min | High |
| 6 | The Court of the Heart | Old Levels 9 and 10 | Maria completes the letter, connects all prior meanings, enters final court, assembles seal, and hears verdict. | Rooftops synthesis into ceremonial court. | Unfinished Letter, Heart Freely Given | Finale puzzle may be two phases: constellation synthesis and final seal assembly. | Prepare the verdict without repeating it. | Love: the heart was freely given. | FinalVerdictScene. | 4-5 min | High |

Recommended chapter titles are good as-is. They are short, clue-forward, and easy to scan in Level Select.

## Old-To-New Mapping

| Old level | Current title | New chapter mapping | Disposition | Risk notes |
|---|---|---|---|---|
| 1 | The Envelope at the Kancelaria | Chapter 1 | Keep and extend | Safest base for tutorial. Add route/ticket ending without changing early movement feel. |
| 2 | The Tram of Deadlines | Chapter 1 and Chapter 2 | Merge/rewrite | Split narrative role: ticket route starts Chapter 1, golden stamp/tram traversal anchors Chapter 2. |
| 3 | The Rebuilt Street | Chapter 2 | Keep/merge | Geometry and Rebuild Puzzle are strong. Needs route/stamp handoff integrated. |
| 4 | The Vistula Deposition | Chapter 3 | Keep/expand slightly | Cleanest standalone chapter. Add stronger archive-code bridge. |
| 5 | The Archive of Tiny Details | Chapter 4 | Keep/merge | Archive mechanics fit; silver key reveal should move here from old Level 6 story. |
| 6 | The Courthouse of Echoes | Chapter 5 | Keep/merge | Echo Path becomes the first phase or core spine of Chapter 5. |
| 7 | The Garden of Quiet Evidence | Chapter 5 | Merge/archive active level | Use lantern motif as a segment or puzzle phase, not a separate player-facing level. |
| 8 | The Tower of Arguments | Chapter 5 | Merge/archive active level | Use argument/ribbon payoff carefully; avoid making Chapter 5 too long. |
| 9 | The Rooftops Before the Verdict | Chapter 6 | Keep/merge | Good synthesis route. Shorten or combine with final-court transition. |
| 10 | The Court of the Heart | Chapter 6 | Keep/merge | Final verdict completion currently depends on this id; migrate last and cautiously. |

## Platformer Migration Strategy

### General strategy

- Keep existing geometry data as raw source material.
- Create new active chapter geometry entries only after the chapter content model exists.
- Do not delete old geometries until after full 6-chapter QA.
- Keep direct dev routes for old levels temporarily, preferably behind dev-only archive ids or query params.
- Preserve forgiving platforming: wide platforms, short retries, no precision-heavy merged routes.
- Target 2 checkpoints for most chapters, 3 for Chapters 5 and 6 if routes remain long.

### Chapter 1: The Sealed Envelope

- Reuse mostly old Level 1 geometry.
- Add a small ending extension inspired by old Level 2: tram-ticket glow, tram stop, or route marker.
- Mechanics: intro traversal, one checkpoint, one required envelope/key-ticket clue bundle.
- Remove: moving tram platform complexity from the first chapter.
- Target duration: 2.5-3.5 minutes including VN/puzzle.
- Complexity: low-medium.
- Likely files later: `src/game/platformer/levelGeometry.ts`, `src/content/levels.ts`, `src/content/clueChain.ts`, platformer geometry tests.

### Chapter 2: The Hidden Wall

- Reuse old Level 2 moving-platform language at the start and old Level 3 rebuilt street geometry for the second half.
- Mechanics: one or two gentle moving platforms, then one rebuild trigger/keyhole sequence.
- Remove: duplicate clue pickup if it makes the level feel like two unrelated levels.
- Checkpoints: one near tram midpoint, one before hidden wall/rebuild segment.
- Target duration: 3-4 minutes including VN/puzzle.
- Complexity: medium.
- Dev editor risk: merging object ids from old Levels 2 and 3 can collide unless ids are prefixed by chapter/segment.

### Chapter 3: The River Witness

- Reuse old Level 4 geometry, slightly expanded only if needed.
- Mechanics: drifting paper platforms, optional witness fragments, one required Witness Note.
- Remove: extra gates unless they slow pacing.
- Checkpoints: two.
- Target duration: 2.5-3.5 minutes including VN/puzzle.
- Complexity: low.

### Chapter 4: The Archive of Corrections

- Reuse old Level 5 archive geometry.
- Add silver-key reveal as a platformer or post-puzzle visual, not a separate old Level 6 traversal.
- Mechanics: archive keys/doors, tiny detail notes, required Marginal Note/Silver Key bundle.
- Remove: too many optional notes if they create clutter.
- Checkpoints: two.
- Target duration: 3-4 minutes including VN/puzzle.
- Complexity: medium.

### Chapter 5: The Door of Trust

- Use old Level 6 courthouse as the main platformer spine.
- Add one short garden/lantern segment and one short ribbon/argument-page segment as visual set pieces, not full old Levels 7 and 8.
- Mechanics: choice doors, one lantern reveal path, maybe one short vertical/ribbon lift.
- Remove: full old Level 8 vertical tower route; it risks making the chapter too long.
- Checkpoints: two or three, with the final checkpoint before ribbon/argument payoff.
- Target duration: 4-5 minutes including VN/puzzle.
- Complexity: high.
- Main design warning: Chapter 5 combines three emotional ideas. Keep the story purpose clear: Trust opens, warmth guides, promise holds.

### Chapter 6: The Court of the Heart

- Reuse old Level 9 rooftops as the approach and old Level 10 as the ceremonial court.
- Reduce old Level 9 length before adding the final court portion.
- Mechanics: gentle synthesis of moving, rebuild, and lantern systems; no difficulty spike.
- Remove: repeated memory-marker text if the final puzzle already synthesizes meanings.
- Checkpoints: three only if the route remains long; otherwise two.
- Target duration: 4-5 minutes including finale puzzle and verdict setup.
- Complexity: high.
- FinalVerdictScene must remain the completion boundary.

## Puzzle Migration Strategy

| New chapter | Proposed puzzle | Old modules reused | Modules deprecated from active flow | Rewrite needs | Tests affected | Risk |
|---|---|---|---|---|---|---|
| 1 | Envelope Mosaic plus key/ticket reveal | `caseMosaic` | None immediately | Add key/ticket reveal content and success line. | `caseMosaicPuzzle.test.ts`, content/e2e. | Low |
| 2 | Stamped Route / Hidden Wall Repair | `caseTimeline`, `rebuildPuzzle` | Separate old Level 2/3 active puzzle routes | Either two phases in one puzzle scene or one combined route-repair board. | Timeline, rebuild, registry, e2e. | Medium-high |
| 3 | Witness Lens contradiction | `witnessLens` | None | Adjust clue target from old Level 4 to Chapter 3 and archive-code reveal. | Witness lens, content/e2e. | Low |
| 4 | Archive Detail Finder with Silver Key reveal | `archiveDetailFinder`, visual/key content from `echoPath` | Separate old Level 6 key reveal as active clue | Add final key-reveal state without requiring Echo Path yet. | Archive detail, content/e2e. | Medium |
| 5 | Door of Trust hybrid | `echoPath`, `lanternSequence`, small concept from `argumentTower` | Separate Level 7 and Level 8 active puzzle routes | One coherent board: choose question, apply key, light path, receive ribbon/pages. | Echo, lantern, argument, registry, e2e. | High |
| 6 | Final Case Seal | `caseConstellation`, `finalVerdictAssembly` | Separate Level 9 and Level 10 puzzle routes | Two-phase finale is acceptable if concise: connect meanings, then complete final seal. | Constellation, verdict assembly, flow/e2e. | High |

Recommended puzzle architecture for implementation:

- Do not force all hybrids into `PuzzleScene` in one step.
- Add a new chapter-puzzle registration layer after the chapter content model exists.
- Keep existing pure logic modules where possible.
- If a chapter puzzle has phases, store phase state in the puzzle component only; do not persist partial puzzle progress.
- Preserve tap fallback for every drag/drop action.

## VN Migration Strategy

Current VN structure is 30 scenes. The new structure should be:

- Opening cinematic.
- Chapter 1-6 intro VN.
- Chapter 1-6 pre-puzzle VN.
- Chapter 1-6 post-puzzle VN.
- Final verdict.

That gives 18 chapter VN scenes instead of 30. Keep every scene concise and skippable.

| Chapter | Intro VN purpose | Pre-puzzle VN purpose | Post-puzzle VN purpose |
|---|---|---|---|
| 1 | Establish birthday morning, case file, envelope, key, ticket, and Maria's first read. | Frame rebuilding the envelope and noticing the ticket/key route. | File the first clue and point toward the stamped route. |
| 2 | Move through the tram route into the rebuilt street and hidden wall. | Frame ordering/stamping the route and repairing what the wall remembers. | Reveal Vistula mark and send Maria to the river. |
| 3 | Establish witness by the Vistula and the note's strange warning. | Frame contradiction inspection. | Reveal archive reference and shift the case toward "not stolen." |
| 4 | Establish archive drawer and marginal correction. | Frame finding "No. Given." and hidden key. | File the correction and reveal the silver key for the courthouse. |
| 5 | Establish courthouse, Trust door, lantern, and ribbon as one emotional test. | Frame the question/key/light/ribbon puzzle. | File the Trust/Lantern/Ribbon clue group and release the unfinished letter. |
| 6 | Establish rooftops synthesis and final court. | Frame clue meaning placement and final seal completion. | Keep very short: the verdict is ready. Do not expand or alter the verdict. |

VN implementation notes:

- New scene ids should probably be chapter-based, such as `vn-chapter-1-intro`, while old `vn-level-N-*` ids remain dev-archived temporarily.
- The flow should use chapter ids for active player routes and keep old VN routes available only for direct dev testing until removed.
- Avoid writing new final-romance payoff in Chapter 6 VN; preserve FinalVerdictScene as the emotional landing.

## Save And Progression Migration Strategy

### Option A: Keep internal level ids 1-10, active flow uses 1-6 mapped chapters

Description: Keep `saveVersion = 1`, keep `completedLevelIds` and `unlockedLevelIds`, but reinterpret ids 1-6 as active chapters. Old levels 7-10 remain archived/dev-only.

Pros:

- Least schema risk.
- No localStorage migration needed immediately.
- Fewer changes to `SaveData`.
- Fastest implementation path.

Cons:

- Old saves with completed Level 7-10 may look strange unless normalized for display.
- `FINAL_LEVEL_ID` would still need to change to 6 in active systems, so tests still need real updates.
- Old archived levels and active chapters share the same numeric id concept, which can confuse development.

Recommendation: acceptable as a temporary bridge only, not ideal for final architecture.

### Option B: Migrate to 6 active levels with saveVersion bump

Description: Change active final id to 6, update `SaveManager` and `GameFlow`, bump save version, and migrate old completed/unlocked 1-10 saves to 1-6 chapter progress.

Possible migration mapping:

- Old completed 1 or 2 -> new completed Chapter 1 if old Level 2 complete, otherwise Chapter 1 in progress.
- Old completed 3 -> new Chapter 2 complete.
- Old completed 4 -> new Chapter 3 complete.
- Old completed 5 -> new Chapter 4 complete.
- Old completed 6, 7, or 8 -> new Chapter 5 progress/complete depending cutoff.
- Old completed 9 or 10 -> new Chapter 6 progress/complete; old `gameCompleted` true remains complete.

Pros:

- Clean final player-facing data model.
- Level Select, progress count, final completion, and QA language become honest: 1-6.
- Reduces long-term confusion.

Cons:

- Highest immediate save risk.
- Requires careful migration tests for partial, corrupted, and completed old saves.
- Requires all flow/menu/e2e tests to update together.

Recommendation: best final state, but implement only after chapter content model and Level Select are ready.

### Option C: Introduce chapters as separate layer while old levels remain archived

Description: Add a chapter model as active content (`chapters`, `chapterPuzzles`, `chapterVnScenes`, and perhaps `chapterGeometry`), while old levels remain in code as archived source material. Save can either remain v1 during a bridge period or migrate to a v2 chapter-aware shape later.

Pros:

- Safest incremental development.
- Lets active player UI use 6 chapters without immediately deleting old modules.
- Keeps dev/test routes for old modules during conversion.
- Avoids code churn in a single large PR/part.

Cons:

- Requires a temporary compatibility layer.
- Needs clear naming to avoid two parallel content sources drifting.
- Final cleanup phase is required.

Recommendation: safest overall approach. Use Option C as the migration path, then land in Option B as the final save model once the 6-chapter flow is proven.

### Recommended save plan

Use a two-step save migration:

1. Bridge phase: add chapter abstractions and active 6-chapter UI while preserving old save schema and old level ids internally where possible. Do not delete old save fields.
2. Final phase: bump saveVersion after the 6-chapter flow is stable. Migrate old saves into 6 active chapter progress and preserve `muted`, `reduceMotion`, and `gameCompleted`.

Final migration must include tests for:

- Missing storage.
- Corrupted storage.
- Old v1 new-game save.
- Old v1 partial progress at each old level boundary.
- Old v1 `gameCompleted: true` with Level 10 complete.
- Invalid ids above old Level 10.
- Reset returning to Chapter 1 only.

## Level Select And UI Migration Strategy

Player-facing Level Select should become a 6-card Chapter Archive:

- Header: `Case Archive` can stay.
- Progress: either `[N]/6 clues filed` or `[N]/6 chapters closed`.
- Card labels: `Chapter 1` through `Chapter 6`, with clue names visible.
- Status language: `Next Clue`, `Completed / Replay`, `Finale`, `Verdict Accepted. Case Closed.`
- Old levels 7-10 should not appear in normal player flow.
- Dev-only old-level access should remain through query routes until cleanup, not through the player Level Select.

Recommended card content:

- Chapter number.
- Chapter title.
- Main clue bundle.
- Short lead hint.
- Play/Replay/Locked status.

UI files likely affected later:

- `src/game/ui/LevelSelectMenu.ts`
- `src/game/systems/LevelAvailability.ts`
- `src/game/scenes/LevelSelectScene.ts`
- `src/ui/icons.ts`
- `src/style.css`
- e2e smoke tests for level select and progress states.

## File Impact Analysis

### Content files

- `src/content/levels.ts`: replace or supplement 10 level specs with 6 chapter specs.
- `src/content/puzzles.ts`: replace or supplement 10 puzzle specs with 6 chapter puzzle specs.
- `src/content/vnScenes.ts`: migrate from 30 level scenes to 18 chapter scenes.
- `src/content/clueChain.ts`: migrate from 10 entries to 6 chapter continuity entries or clue-bundle entries.
- `src/content/story.ts`: update `[N]/10` fallback and any active labels.
- `src/content/openingCinematic.ts`: likely unchanged except optional caption references.

### Platformer geometry and systems

- `src/game/platformer/levelGeometry.ts`: create chapter geometry entries from merged old segments.
- `src/game/platformer/LevelBuilder.ts`: likely unchanged if geometry contract stays compatible.
- `src/game/platformer/ArchiveGate.ts`, `ChoiceDoor.ts`, `LanternSwitch.ts`: likely reusable unchanged.
- `src/game/scenes/PlatformerScene.ts`: route by active chapter id, handle archived old direct routes if kept.
- `src/game/debug/DevLevelEditor.ts`: verify override keys/object ids after geometry merges.
- `dev-level-overrides/level-N.json`: archive or remap only after implementation review.

### Puzzle modules/content

- Keep initially: `caseMosaic`, `caseTimeline`, `rebuildPuzzle`, `witnessLens`, `archiveDetailFinder`, `echoPath`, `lanternSequence`, `argumentTower`, `caseConstellation`, `finalVerdictAssembly`.
- Likely create later: chapter-level hybrid wrappers for Chapter 2, 5, and 6.
- `src/game/puzzles/PuzzleRegistry.ts`: add chapter puzzle registrations or route wrappers.
- `src/game/scenes/PuzzleScene.ts`: reduce active route count to 6 after the chapter model exists.

### Flow/progression

- `src/game/systems/GameFlow.ts`: active final id changes from 10 to 6.
- `src/game/systems/SaveManager.ts`: final migration should bump saveVersion and normalize old saves.
- `src/game/systems/LevelAvailability.ts`: replace explicit Level 1-10 branches with chapter-count logic.
- `src/types/SaveData.ts`: only if a final chapter-aware schema is introduced.

### Menus and scenes

- `src/game/ui/LevelSelectMenu.ts`: 6 chapter cards.
- `src/game/ui/TitleMenu.ts`: likely mostly unchanged.
- `src/game/scenes/CaseFileScene.ts`: route to Chapter 1 VN.
- `src/game/scenes/EvidenceRevealScene.ts`: active reveals for Chapters 1-5; Chapter 6 goes to final verdict.
- `src/game/scenes/FinalVerdictScene.ts`: replay finale should target Chapter 6.
- `src/game/scenes/CreditsScene.ts`: likely unchanged except completion wording if referenced.

### Tests

- `src/tests/content.test.ts`
- `src/tests/SaveManager.test.ts`
- `src/tests/GameFlow.test.ts`
- `src/tests/LevelAvailability.test.ts`
- `src/tests/platformerGeometry.test.ts`
- `src/tests/PuzzleRegistry.test.ts`
- `src/tests/visualNovelContent.test.ts`
- Puzzle module tests for reused/hybrid puzzles.
- `tests/e2e/smoke.spec.ts`

### Docs

- `docs/story-bible.md`
- `docs/game-bible.md`
- `docs/level-plan.md`
- `docs/content-style-guide.md`
- `docs/technical-architecture.md`
- `docs/qa-checklist.md`
- `docs/visual-asset-prompt-plan.md`
- `docs/asset-replacement-plan.md`
- `CHANGELOG.md`

## Phased Roadmap

### Part 42B - Implement 6-chapter content model and docs only

- Add chapter content data beside existing level data.
- Add 6-chapter story/puzzle/VN outline docs.
- No runtime routing changes yet.

### Part 42C - Switch Level Select to the 6-chapter bridge

- Introduce bridge chapter availability.
- Keep old dev routes and old `GameFlow` final id.
- Update Level Select to render 6 player-facing chapters.
- Preserve old save schema during the bridge phase.

### Part 42D - Convert Chapter 1 and Chapter 2 gameplay/puzzles/VN

- Build the first two active chapter routes.
- Reuse Level 1, Level 2, and Level 3 material.
- Add chapter smoke tests for early flow.

### Part 42E - Convert Chapter 3 and Chapter 4

- Convert Vistula and Archive chapters.
- Move silver-key discovery into Chapter 4.
- Validate reveal and unlock flow.

### Part 42F - Convert Chapter 5 and Chapter 6

- Build the high-risk hybrid chapters.
- Keep Chapter 5 concise.
- Preserve final verdict text and final completion boundary.

### Part 42G - Archive old levels/modules and clean tests

- Move old 7-10 player-facing routes out of active flow.
- Keep legacy modules only where useful.
- Remove or mark obsolete tests after replacement coverage exists.
- Implemented status: active player-facing routing is now the 6-chapter Case Archive only; old level/VN/puzzle routes remain dev/test-only source material during the save bridge.

### Part 42G Legacy Classification

| Content area | Classification | Policy |
|---|---|---|
| `src/content/chapters.ts`, `chapterPuzzles.ts`, `chapterVnOutline.ts`, `chapterClueChain.ts` | A - active 6-chapter source | Player-facing chapter archive and chapter routing use this layer. |
| `src/content/levels.ts`, `puzzles.ts`, `clueChain.ts` | A/E - retained bridge source | Active chapter wrappers still launch legacy level/puzzle ids and save completion through old level ids. Keep until save migration. |
| Chapter VN scenes `vn-chapter-*` | A - active player flow | Active chapter intro, before-puzzle, and after-puzzle scenes. |
| Old VN scenes `vn-level-*` | B - dev/source material | Retained for debug routes and story reference, hidden from player-facing archive. |
| Platformer geometry for old Levels 1-10 | A/B - retained runtime/dev material | Active chapters reuse old geometry ids; unused direct routes remain useful for debug and comparison. |
| Redesigned puzzle modules | A/B - mixed active/dev | Case Mosaic, Rebuild Puzzle, Witness Lens, Archive Detail Finder, Echo Path, and Final Verdict Assembly are active chapter puzzle backbones; Timeline, Lantern, Argument Tower, and Constellation remain legacy dev/source routes. |
| Retired old form-like puzzle modules | C - archived legacy | Already out of active registry; keep as reference until a later removal pass confirms no imports/tests require them. |
| `SaveManager`, `GameFlow`, `LevelAvailability` old-level constants | E - must keep until save migration | `saveVersion` stays 1 and final completion still uses old Level 10 under the bridge. |

Player-facing cleanup for Part 42G is therefore a route/test/documentation cleanup, not a deletion pass. Deleting legacy material is intentionally deferred until the six-chapter save migration and full QA pass are complete.

### Part 42H - Full 6-chapter QA and balancing

- Desktop and mobile landscape full run.
- Save migration checks.
- Final verdict completion check.
- Dev overlay safety check.

### Part 42H.5 - Six-chapter expansion and continuity audit

- Audit the current active six-chapter bridge for level length, mechanical depth, and clue continuity.
- Identify old elevator, vertical, lantern, moving-platform, and final-court material worth preserving.
- Produce the revised expansion blueprint in `docs/six-chapter-expansion-audit.md`.

### Part 42I - Visual asset plan update for 6-chapter game

- Rewrite `docs/visual-asset-prompt-plan.md` around 6 chapters.
- Update asset priority and background list.

### Part 42J - Expand Chapter 1 and Chapter 2 platformers and clue continuity

- Implement the first expansion-audit gameplay pass for Chapters 1-2 only.
- Keep the existing chapter bridge runtime ids while extending old Level 1 and old Level 2 geometry.
- Add route-awakening, key/ticket, stamp/validator, hidden-wall, rebuild, and Vistula handoff beats without changing save schema or puzzle rules.

### Part 42K - Expand Chapter 3 and Chapter 4 platformers and clue continuity

- Implement the second expansion-audit gameplay pass for Chapters 3-4 only.
- Keep the existing chapter bridge runtime ids while extending old Level 4 and old Level 5 geometry.
- Add river witness, archive-code, margin-correction, silver-key, and courthouse handoff beats without changing save schema or puzzle rules.
- Generate no images in this phase unless separately approved.

## Risks And Mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Breaking save/progression | Current save assumes final id 10. | Use chapter bridge first, then tested saveVersion migration. |
| Dev editor overrides tied to old ids | Merged geometry can invalidate override files. | Prefix new object ids, keep old override files archived, do not auto-apply old overrides to merged chapters. |
| Puzzle registry complexity | Hybrid puzzles can duplicate logic or bloat `PuzzleScene`. | Add wrappers/registrations per chapter; keep pure logic reused and tested. |
| Tests expecting 10 levels | Many tests assert exact Level 1-10 sequences. | Update tests in the same part as runtime route changes, not before. |
| VN flow references old level ids | Current VN scene ids and placements are level-based. | Add chapter scene ids; keep old VN dev routes until cleanup. |
| Final verdict tied to Level 10 | Completion and replay target Level 10. | Migrate finale last; test Accept Verdict and Replay Finale carefully. |
| Archived levels reachable accidentally | Old dev routes could leak into player flow. | Gate archive access behind dev/test query routes only; Level Select shows only 6 chapters. |
| Chapter 5 becomes too long | It absorbs old Levels 6-8. | Make courthouse the spine and use garden/tower as short set pieces. |
| Deleting useful modules too early | Old modules are source material for hybrids. | No deletion until Part 42G cleanup after new QA passes. |
| Emotional pacing becomes rushed | Six chapters can compress too much. | Keep VN concise but use post-puzzle reveals to make each clue transition clear. |
| Asset plan mismatch | Current Part 42 asset plan assumes 10 levels. | Update asset prompt plan only after 6-chapter route is accepted. |

## Recommendation

Proceed with Option C as the migration path:

1. Add a 6-chapter content layer beside the current 10-level layer.
2. Switch player-facing Level Select and GameFlow to active chapters only after content/tests exist.
3. Keep old levels and puzzle modules archived/dev-accessible until all six chapters are playable and QA-clean.
4. Finish with an Option B-style saveVersion migration once the active 6-chapter flow is stable.

This approach is slower than a direct rewrite, but it is the least likely to break save/progression, dev tooling, final verdict flow, or puzzle coverage. It also lets Chapter 5 and Chapter 6 receive the extra design care they need instead of turning the reduction into one risky mega-change.
