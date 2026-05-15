# Final Scope And Pacing Plan

Part 44A locks the final product direction after the full project audit. This is a planning document only: it does not change gameplay files, level geometry, puzzle mechanics, VN text, save/progression, assets, or the approved final verdict.

## Final Product Target

The final game should be a **10-15 minute birthday gift experience**, including opening, six chapters, puzzles/interactions, clue reveals, and final verdict.

This target should not be achieved by making the platformer chapters tiny. The platformers should still feel like authored chapters with real traversal, clue discovery, and a few memorable mechanics. The time savings should come from reducing friction elsewhere:

- Shorter VN interruptions.
- Faster puzzles and more interactive clue moments.
- Concise clue-filed reveals.
- Less repeated setup between VN, puzzle success, and reveal screens.
- A much faster Chapter 6 final seal puzzle.

Recommended total rhythm:

| Segment | Target |
|---|---:|
| Opening cinematic | 20-30 seconds, skippable |
| Chapter 1 - The Sealed Envelope | 1.5-2 minutes |
| Chapter 2 - The Hidden Wall | 2-2.5 minutes |
| Chapter 3 - The River Witness | 1.5-2 minutes |
| Chapter 4 - The Archive of Corrections | 2-2.5 minutes |
| Chapter 5 - The Door of Trust | 2.5-3 minutes |
| Chapter 6 - The Court of the Heart | 2.5-3 minutes |
| Final verdict | 30-60 seconds |

Expected final runtime: approximately **12-15 minutes** for a normal first playthrough, with skip/replay support for returning players.

## Current Pacing Conflict

Recent expansion work documented a 20-28 minute target so the compressed six-chapter bridge would not feel too small. The final product decision supersedes that target.

The goal is now:

- Keep the six-chapter structure.
- Keep platformers rich enough to feel like chapters.
- Preserve old late-game elevator, vertical, and moving-platform ideas where they create memorable play.
- Reduce VN/puzzle/reveal overhead so the whole experience still lands in one birthday sitting.

Current active structure:

- Active chapter count: 6.
- Active player-facing puzzles: 6.
- Active chapter VN scenes: 18 still exist for dev/test targeting, but the player-facing flow is compressed.
- Active reveal screens: Chapters 1-5 route from puzzle success directly to clue reveal; Chapter 6 routes from final seal directly to final verdict.
- Runtime model: six-chapter player-facing bridge over retained old Level 1-10 ids.

Primary pacing risks:

- Three VN beats per chapter can make the game feel stop-start.
- Full after-puzzle VN plus clue reveal repeats the same emotional beat.
- Chapter 5 and Chapter 6 platformers are valuable, but their current 5-6 minute total targets are too long for a 10-15 minute gift.
- Before Part 44B, Chapter 6 Final Verdict Assembly asked for ten ordered fragments, which risked feeling like homework right before the emotional payoff.

## Recommended Final Flow

Current heavy flow:

1. VN intro.
2. Platformer.
3. VN before puzzle.
4. Puzzle.
5. VN after puzzle.
6. Clue reveal.

Recommended lighter flow:

1. Short chapter intro.
2. Platformer.
3. Optional one-line pre-puzzle setup, only when it materially helps.
4. Puzzle or interactive clue moment.
5. Concise clue-filed reveal.

Rules:

- Keep one short intro VN per chapter.
- Keep pre-puzzle VN only for chapters where the puzzle needs framing.
- Merge most after-puzzle VN content into the clue reveal.
- Do not use both a full after-puzzle VN and a long clue reveal.
- Keep Chapter 6 after-puzzle handoff as a retained dev route only; the active final seal can go straight to FinalVerdictScene.

Scene policy:

| Scene type | Final policy |
|---|---|
| Opening cinematic | Keep, shorten to 20-30 seconds, skippable. |
| Chapter intro VN | Keep, max 3 short lines. |
| Before-puzzle VN | Keep only where needed, max 1-2 short lines; active Chapters 1 and 3 bypass it. |
| After-puzzle VN | Retain as targetable dev scenes, but active Chapters 1-5 merge it into clue reveal. |
| Clue reveal | Keep as emotional handoff, 10-20 seconds. |
| Final verdict | Keep exact approved text unchanged. |

## Platformer Richness Plan

Platformer chapters should carry the largest share of each chapter's playtime. They should be richer than a few jumps and an exit, but not long enough to pull the gift into a 20-30 minute game.

| Chapter | Platformer target | Gameplay beats | Keep / add | Avoid | Checkpoints | Risk |
|---|---:|---|---|---|---:|---|
| 1 - The Sealed Envelope | 75-105s | Kancelaria traversal, file-shelf climb/descent, envelope/key/ticket discovery, route awakening | Gentle tutorial, authored upper/lower office path | Difficult mechanics, moving platforms | 1-2 | Too short if route ending is removed |
| 2 - The Hidden Wall | 105-135s | Tram route, golden stamp, hidden wall/keyhole, wall lift, Vistula handoff | 1-2 forgiving moving-platform beats, compact vertical wall beat | Long route puzzle complexity | 2-3 | Too long if old Level 2 and 3 are both fully represented |
| 3 - The River Witness | 90-120s | Riverbank, drifting papers, upper bridge beam, bridge-shadow descent, witness handoff | One short post-witness transition to archive code | Long empty walking | 2-3 | Too thin if witness is only a pickup |
| 4 - The Archive of Corrections | 105-135s | Shelves, drawers, upper/lower file paths, marginal correction, silver key | One compact exploration loop with drawer lift | Maze feeling, pixel-hunt staging | 2-3 | Too long if key/door path becomes navigation friction |
| 5 - The Door of Trust | 120-150s | Courthouse, Trust door, lantern path, elevator ascent, blue ribbon pages | Trust-door/balcony beat, 2-3 wide elevator/floating beats | Full old Level 6+7+8 paste, long vertical punishment | 3-4 | Highest mobile traversal risk |
| 6 - The Court of the Heart | 120-150s | Rooftop climb, clue memory markers, floating ascent, final court, heart seal | 2 floating/elevator beats, ceremonial final traversal | Hard final challenge, long final route | 3-4 | Too long if finale tries to preserve every old Level 9/10 beat |

Implementation guidance:

- Preserve the best old mechanics by compressing them into signature beats, not full old-level restorations.
- Make platforms wide, slow, and forgiving.
- Use checkpoints to protect mobile players from replaying ceremonial sections.
- Treat clue objects and exits as authored story moments, not generic pickups.

Part 46A-R2 platformer structural rebuild status:

- Chapter 1 now plays as an office route: lower desk traversal, bookcase/file-shelf climb, upper shelf crossing, descent, then the envelope/key/ticket destination.
- Chapter 2 now plays as a city route into a hidden wall: tram movement, elevated route sign, rebuilt street climb, slow wall lift, upper wall crossing, and descent to the Vistula wave mark.
- Chapter 3 now uses river/bridge structure: drifting papers, upper bridge beam, descent into bridge shadow, witness-note destination, and archive-code exit path.
- Chapter 4 now uses archive structure: lower aisle, shelf climb, upper stacks, drawer/lift beat, descent into file aisle, marginal-note/file-spine climb, and silver-key/courthouse handoff.
- Chapter 5 now extends the courthouse into a stronger vertical ascent: Trust balcony, lantern descent, wide slow elevators, ribbon pages, and unfinished-letter destination.
- Chapter 6 now has a real rooftop climb and final ascent: lower rooftops, chimney/roof ledges, rebuilt bridge, clue memory balcony, wide floating lifts, final court, heart seal, and final door.
- Automated geometry coverage now asserts stronger active-route verticality, updated target durations, Chapter 2 wall-lift specs, Chapter 5 elevator coverage, and Chapter 6 rooftop/elevator markers.

## Puzzle Simplification Plan

Puzzles should be a mix of real puzzles and quick interactive clue moments. The player should feel clever, not delayed.

| Chapter | Current puzzle | Final role | Recommendation |
|---|---|---|---|
| 1 | Case Mosaic: The Sealed Envelope | Short real puzzle | Restored in Part 45B-R2 as a 3x2 envelope reconstruction; target 30-45 seconds. |
| 2 | Route Tile Puzzle: The Hidden Wall | Short real puzzle | Implemented in Part 45B-R2 as a tap-to-rotate route board; target 35-60 seconds. |
| 3 | Deposition Order: The Witness Note | Real document puzzle | Implemented in Part 45D-R2 revised as four witness-note strips arranged into a restored deposition; target 30-50 seconds. |
| 4 | Case File Sorting: No. Given. | Real document puzzle | Implemented in Part 45D-R2 revised as five archive documents sorted until the margin reads `"No. Given."` and the Silver Key is taken; target 35-60 seconds. |
| 5 | Trust Door Light Path | Short real puzzle | Implemented in Part 45E-R2 as a correct-question plus tap-to-rotate lantern light path; target 40-60 seconds. |
| 6 | Final Seal: The Court of the Heart | Fast final seal moment | Implemented in Part 45F-R2 as three tap-rotated seal rings that light six clue marks; target 30-50 seconds. |

Part 45G-R2 puzzle readiness status:

- The six active puzzles are now treated as a stable mechanics-driven set for the 10-15 minute target.
- Desktop and mobile-landscape automated QA cover tap/click completion, route handoff, visible actions, and no document scroll for the puzzle layer.
- Post-platformer QA refresh confirms the six active puzzle duration targets still match the final pacing model: Chapter 1 30-45s, Chapter 2 35-60s, Chapter 3 30-50s, Chapter 4 35-60s, Chapter 5 40-60s, and Chapter 6 30-50s.
- The remaining release risk is human-feel validation: one timed desktop playthrough and one real-device mobile landscape playthrough before sharing.

Part 47 end-to-end timing/readiness status:

- The active six-chapter spine, puzzle routing, clue reveal routing, final verdict boundary, Case Archive, and save bridge are intact in automated/unit/e2e coverage.
- The opening cinematic currently totals about 26 seconds.
- Active platformer metadata totals 615-795 seconds, or about 10.25-13.25 minutes before puzzles, VN/reveal taps, and final verdict reading.
- Active puzzle estimates total about 265 seconds, or about 4.4 minutes.
- This means the current game is likely at the upper edge of the 10-15 minute target and may exceed it for a first-time human player. Do not make broad cuts inside the release audit, but treat the timed human production-build playthrough as a required release gate before sharing.
- Final asset generation may begin in scoped passes, but release should wait for real-device mobile QA and the timed full playthrough.

Chapter 6 recommendation:

Part 44B implements the final puzzle as a fast emotional final seal moment instead of asking the player to order ten meaning fragments:

- The active seal uses six chapter clue marks: Envelope, Wall, Witness, Correction, Trust, and Heart.
- The player taps three large seal rings until each ring lights two clue marks and the court seal closes.
- The seal lights as each clue lands, then closes and opens the verdict handoff.
- The title stays `Final Seal: The Court of the Heart` before FinalVerdictScene so the final wording lands in the approved verdict.
- The unfinished letter and heart seal remain ceremonial confirmation rather than a sorting exam.

The final puzzle should feel like the case opening the verdict, not like homework before the birthday message.

Implementation priority:

1. Simplify Chapter 6 final puzzle.
2. Simplify Chapter 5 trust interaction if it still feels like a partial proxy for lantern/ribbon continuity. Implemented in Part 44E, then replaced with Trust Door Light Path in Part 45E-R2.
3. Part 45B-R2 replaces the rejected Chapter 2 keyhole/wall-mark tapping with a real route tile puzzle; verify tile readability and mobile tap rotation.
4. Tune Chapter 4 document-card sizing if real-device players struggle.

## VN And Reveal Simplification Plan

Target writing limits:

- Chapter intro VN: maximum 3 short lines.
- Before-puzzle setup: 0-2 short lines.
- After-puzzle VN: usually removed from active flow and merged into clue reveal.
- Clue reveal: clue name, meaning, next action, one concise emotional beat.
- Chapter 6: no extra romantic explanation before the approved verdict.

Keep:

- One intro VN per chapter.
- Pre-puzzle setup for Chapters 2, 4, 5, and 6 where the puzzle benefits from context.
- Clue reveal as the main post-puzzle handoff for Chapters 1-5.
- Chapter 6 final seal routes directly to FinalVerdictScene in active flow; the short verdict-ready VN remains available for dev routes.

Merge or cut:

- Active Chapters 1-5 now merge `vn-chapter-*-after-puzzle` content into the clue reveal.
- Chapter 1 pre-puzzle is bypassed in active flow and retained as a one-line dev route.
- Chapter 3 pre-puzzle is bypassed in active flow because Deposition Order itself explains the witness note.
- Repeated "Clue filed." lines should not appear in both VN and reveal unless the repetition feels ceremonial rather than redundant.

Reveal-line policy:

- Keep the emotional meaning line.
- Keep the next-action label.
- Shorten any repeated explanation that has already appeared in the puzzle success message.
- Use reveal screens as chapter handoffs, not separate story scenes.

## Chapter-By-Chapter Final Pacing Cut Plan

### Chapter 1 - The Sealed Envelope

- Target total: 1.5-2 minutes.
- Intro VN: 10-15 seconds.
- Platformer: 75-105 seconds.
- Puzzle: 30-45 seconds; active Case Mosaic restores the envelope, then shows the key, tram ticket, and glowing route payoff.
- Reveal: 10-15 seconds.
- Keep the tutorial and route-awakening beat. Cut redundant pre/after puzzle VN friction.

### Chapter 2 - The Hidden Wall

- Target total: 2-2.5 minutes.
- Intro VN: 10-15 seconds.
- Platformer: 105-135 seconds.
- Puzzle: 35-60 seconds; active Route Tile Puzzle connects the stamped route through the hidden wall to the Vistula wave mark.
- Reveal: 10-20 seconds.
- Keep moving tram and hidden wall/keyhole continuity. The active puzzle should remain a direct wall-opening payoff, not a repair-board task.

### Chapter 3 - The River Witness

- Target total: 1.5-2 minutes.
- Intro VN: 10-15 seconds.
- Platformer: 90-120 seconds.
- Puzzle: 30-50 seconds; Deposition Order rebuilds four witness-note strips and reveals the archive code.
- Reveal: 10-15 seconds.
- Keep the river/witness mood. Avoid long bridge walking or repeated witness explanation.

### Chapter 4 - The Archive of Corrections

- Target total: 2-2.5 minutes.
- Intro VN: 10-15 seconds.
- Platformer: 105-135 seconds.
- Puzzle: 30-45 seconds.
- Reveal: 10-20 seconds.
- Keep archive exploration and silver-key reveal. Avoid maze or pixel-hunt feeling.

### Chapter 5 - The Door of Trust

- Target total: 2.5-3 minutes.
- Intro VN: 10-20 seconds.
- Platformer: 120-150 seconds.
- Puzzle/interaction: 30-45 seconds.
- Reveal: 10-20 seconds.
- Keep courthouse, Trust door, lantern path, elevator/vertical ascent, and blue ribbon pages. Use wide, slow elevators with stable ledges and short checkpoint recovery.

### Chapter 6 - The Court of the Heart

- Target total: 2.5-3 minutes, plus final verdict if counted separately.
- Intro VN: 10-20 seconds.
- Platformer: 120-150 seconds.
- Final puzzle: 20-40 seconds.
- Verdict-ready handoff: 5-10 seconds.
- Final verdict: 30-60 seconds.
- Keep rooftops, clue memory, floating ascent, final court, and heart seal. Simplify Final Verdict Assembly into a fast seal moment.

## Technical Implementation Roadmap

### Part 44B - Simplify Chapter 6 final puzzle into a fast final seal moment

Status: implemented.

Goal: replace the ten-fragment ordering feel with a 20-40 second ceremonial seal interaction while preserving final verdict routing and text.

Risk: medium. Puzzle logic and tests change, but save/progression should not.

### Part 44C - Compress VN/reveal flow for the 10-15 minute target

Status: implemented.

Goal: keep one short intro per chapter, reduce pre-puzzle scenes, merge after-puzzle VN into concise clue reveals, and avoid repeated "Clue filed" beats.

Risk: medium. Story flow changes, but gameplay and saves should not.

### Part 44D - Tune platformer chapter lengths without shrinking them

Status: implemented.

Goal: keep platformers rich but concise by trimming empty traversal, tightening checkpoint spacing, and preserving signature mechanics.

Risk: medium-high. Geometry changes require mobile QA.

Part 44D updates active chapter duration metadata to the 10-15 minute scope, widens/slows key moving platforms, preserves the authored clue beats, and moves the Chapter 6 pre-ascent checkpoint closer to the floating court climb. It does not remove platformer chapters, change puzzles, alter saves, or touch the final verdict.

### Part 44E - Simplify Chapter 5 puzzle/interaction while keeping trust/elevator gameplay

Status: implemented.

Goal: make the Door of Trust puzzle better represent question, key, lantern, and ribbon without becoming a second long challenge.

Risk: medium.

Part 45E-R2 supersedes the Part 44E active Echo Path implementation. Chapter 5 now uses Trust Door Light Path: the player chooses the question "What remains when things are difficult?", then rotates three large mirrors/sigils so lantern light travels through the Silver Key relay to the Trust door. The success payoff opens Trust and reveals the blue-ribbon pages and unfinished letter. The retained Echo Path, Lantern Sequence, and Argument Tower modules remain source/legacy material, but the active Chapter 5 flow no longer requires those solves.

### Part 44F - Mobile real-device QA after pacing cuts

Goal: verify no page scroll, touch controls, elevator/floating traversal, drag/drop or tap fallback, and full one-sitting play.

Risk: low implementation risk, high release value.

### Part 44G - Read-only story/content summary after final pacing lock

Goal: produce a final concise content map before asset work.

Risk: low.

### Part 44H - Start final asset generation and integration

Goal: begin one asset at a time after pacing and mechanics are stable.

Risk: medium. Asset size and style consistency must be controlled.

Part 48A status: final pre-asset wording cleanup is the current release gate. Active case-file wording, opening cinematic captions, Chapter 6 pre-verdict seal language, and current AGENTS guidance are guarded before final image generation begins. Legacy package/save-key names remain internal and unchanged until a tested migration is requested.

Part 47B status: `docs/timed-playthrough-protocol.md` is the manual pacing and real-device QA gate. Before treating the game as asset-ready, run one desktop production-preview timed playthrough and one real-phone landscape playthrough, recording total time, chapter times, puzzle times, fun/frustration/mobile comfort scores, and any Chapter 5/6 touch-control issues.

## Risks

| Risk | Why it matters | Mitigation |
|---|---|---|
| Platformers become too short again | The game would feel like a menu/VN/puzzle stack, not a playable adventure | Keep 75-150 second platformer targets and one signature authored traversal beat per chapter |
| Puzzles remain too heavy | The gift may feel like homework | Simplify Chapter 6 first and keep most puzzles under 45 seconds |
| VN/reveal cuts damage emotion | The story could feel abrupt | Move emotional payoff into concise reveal text, not into long scenes |
| Chapter 5/6 mobile traversal frustrates players | Late-game friction would weaken the birthday payoff | Real-device QA and forgiving elevator/checkpoint tuning |
| Old 20-28 minute docs confuse future work | New parts may optimize toward the wrong product | Treat this document as the pacing source of truth after Part 44A |

## Final Recommendation

Continue with the current six-chapter project, but target a shorter, sharper product:

- Platformers should stay authored and memorable.
- Puzzles should become faster and more ceremonial where needed.
- VN should become flavor and motivation, not the main runtime.
- Clue reveals should carry the post-puzzle emotional handoff.
- Final assets should begin after the Part 48A wording guard is green and the Part 47B manual timing/mobile protocol has either passed or been explicitly accepted as a remaining risk.
