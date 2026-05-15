# Six-Chapter Expansion And Continuity Audit

Part 42H.5 planning document. This is an audit and blueprint only: no gameplay, geometry, puzzle, VN, save, asset, or final-verdict implementation changes are made here.

## Part 42J Implementation Status

Part 42J implements the first slice of this blueprint for Chapters 1 and 2. Chapter 1 now expands old Level 1 into a longer opening route with a route-awakening ending, visible brass-key/tram-ticket handoff objects, and a second checkpoint. Chapter 2 now expands old Level 2 into a longer tram-to-hidden-wall route with retained gentle moving tram platforms, a golden validator beat, hidden-wall/keyhole set dressing, a rebuild trigger, Vistula wave-mark handoff, and three total checkpoints.

The implementation deliberately keeps the active chapter bridge and old dev routes intact: Chapter 1 still launches old Level 1 geometry and Case Mosaic, while Chapter 2 still launches old Level 2 geometry and the old Level 3 Rebuild Puzzle through the chapter flow. No puzzle mechanics, save schema, Chapters 3-6 geometry, assets, or final verdict text changed in Part 42J.

## Part 42K Implementation Status

Part 42K implements the second slice of this blueprint for Chapters 3 and 4. Chapter 3 now expands old Level 4 into a fuller River Witness route with retained drifting paper platforms, a stronger bridge-shadow/witness silhouette moment, a required Witness Note, a post-witness archive-code path, and an archive-reference handoff. Chapter 4 now expands old Level 5 into a fuller Archive of Corrections route with retained archive key/door gating, clearer archive-code/drawer and "No. Given." staging, an optional silver-key pickup from the file spine, a courthouse-index ending, and a third checkpoint before the final reveal.

The implementation deliberately keeps the bridge and save mapping intact: Chapter 3 still launches old Level 4 geometry and Witness Lens, while Chapter 4 still launches old Level 5 geometry and Archive Detail Finder. No puzzle mechanics, save schema, Chapters 1-2 or 5-6 geometry, assets, or final verdict text changed in Part 42K.

## Part 42O QA Status

Part 42O performs the post-expansion pacing and release-safety pass after Parts 42J-42N. Automated coverage verifies the six-chapter Case Archive, chapter unlock ladder, chapter VN routing, active puzzle handoffs, Chapter 5/6 elevator/floating-platform geometry data, old dev routes, settings/reset, dev overlay smoke, and the Chapter 6 final verdict boundary.

The active duration metadata now matches the final pacing target:

| Chapter | Target total duration | Current QA classification | Notes |
|---|---:|---|---|
| 1 - The Sealed Envelope | 3-4m | Good tutorial chapter | Expanded route-awakening ending and second checkpoint prevent the opening from feeling tiny. |
| 2 - The Hidden Wall | 4-5m | Good early traversal chapter | Retains forgiving tram movement and now carries stamp/keyhole/wall/Vistula continuity in one route. |
| 3 - The River Witness | 3.5-4.5m | Good investigative chapter | River/witness/archive-code staging is coherent and remains calm. |
| 4 - The Archive of Corrections | 4-5m | Good exploratory chapter | Archive key/door route plus "No. Given." and silver-key handoff read as one correction sequence. |
| 5 - The Door of Trust | 5-6m | Strong middle chapter, mobile risk to manually time | Choice doors, lantern reveal, and vertical elevators restore the late-game mechanical identity. |
| 6 - The Court of the Heart | 5-6m | Strong finale chapter, mobile risk to manually time | Rooftops, clue markers, floating ascent, final court, and heart seal support the ceremonial ending. |

No full human timed playthrough was performed during this automated QA pass. The remaining release risks are a real-device mobile landscape traversal of Chapter 5/6 elevators, real-device puzzle drag/drop across the active puzzle set, and one timed desktop production-build playthrough to confirm the 20-28 minute target in human hands.

## Executive Summary

The active player-facing game is now correctly organized as six chapters, but several chapters still use the safest bridge route from the old 10-level structure. That makes the flow stable, but it also explains the current pacing problem: some chapters are structurally complete while feeling mechanically thin, and the late-game elevator, vertical ascent, lantern, argument, and ceremonial finale material is not yet fully present in the active six-chapter route.

The recommended direction is to keep the six-chapter structure and expand selected chapters by about 50-80% where the bridge is too thin. The target total game length should move from the current compressed bridge toward roughly 20-28 minutes, including VN, platformer traversal, puzzles, reveals, and the final verdict.

Priority expansion work:

- Chapter 1 needs a short route-awakening ending so it feels like a complete opening chapter, not only a tutorial.
- Chapter 2 should join tram movement, golden stamp, hidden wall, and rebuild beats in the platformer flow.
- Chapter 3 is the cleanest carryover, but needs stronger witness and archive-code staging.
- Chapter 4 is mostly solid, but the silver key should become a visible discovery moment, not only reveal copy.
- Chapter 5 needs the largest expansion: old Level 7 lantern path and old Level 8 vertical elevator/tower mechanics should return as concise set pieces inside one coherent Door of Trust chapter.
- Chapter 6 should use old Level 9 rooftops plus a lighter old Level 10 court approach so the finale feels ceremonial before the verdict.

The approved final verdict remains the emotional payoff. Expansion should build anticipation and evidence, not add extra romantic explanation before the verdict.

## Current Chapter Audit

| Chapter | Current active source | Current length signals | Current mechanics | Classification | Clue and puzzle continuity | Useful old material to restore | Expansion risk |
|---|---|---:|---|---|---|---|---|
| 1 - The Sealed Envelope | Old Level 1 platformer, old Level 1 Case Mosaic | 2200w x 640h, 1 checkpoint | Tutorial jumps, one required clue, no moving/rebuild/light mechanics | Too short, mechanically thin, good tutorial base | Envelope clue works, but key/ticket route is mostly VN/reveal rather than playable discovery | A small old Level 2-inspired tram-ticket glow/route ending, second checkpoint | Low; avoid adding tram timing too early |
| 2 - The Hidden Wall | Old Level 2 platformer, old Level 3 Rebuild Puzzle | 2400w x 640h, 1 checkpoint; puzzle carries wall repair | Two moving tram platforms; hidden wall is not platformer-present yet | Mechanically thin for merged chapter, story continuity weak | Puzzle repairs wall, but platformer mostly remains tram route; golden stamp -> wall -> wave mark could be clearer | Old Level 3 rebuild triggers, keyhole/wall set piece, a validator/stamp beat | Medium; merge should not become two pasted levels |
| 3 - The River Witness | Old Level 4 platformer, old Level 4 Witness Lens | 3300w x 700h, 2 checkpoints | Drifting paper platforms, witness fragments, one required note | Acceptable, needs stronger story staging | Witness Note and contradiction puzzle fit well; archive code should be more visibly earned | Existing river/witness fragments, bridge shadow staging | Low; preserve simplicity and avoid overextending |
| 4 - The Archive of Corrections | Old Level 5 platformer, old Level 5 Archive Detail Finder | 3500w x 720h, 2 checkpoints | Archive key/door route, tiny-detail notes, one moving platform | Acceptable, continuity needs silver-key moment | Marginal Note puzzle fits; silver key is story/reveal content rather than traversal payoff | Old Level 5 keys/doors plus a short silver-key reveal from old Level 6 story | Medium; avoid pixel-hunt or extra lock complexity |
| 5 - The Door of Trust | Expanded old Level 6 platformer, old Level 6 Echo Path | 5900w x 980h, 4 checkpoints after Part 42L | Choice doors, lantern reveal, three vertical elevators, echo/argument fragments | Implemented expansion; needs timed QA | Trust question now leads through lantern, vertical ribbon ascent, and unfinished-letter handoff; Echo Path success copy supports the same chain | Old Level 7 lantern switches; old Level 8 vertical elevators and ribbon ascent | Medium-high; verify moving-platform carry feel and mobile recovery |
| 6 - The Court of the Heart | Expanded old Level 9 platformer, old Level 10 Final Verdict Assembly | 7400w x 980h, 4 checkpoints after Part 42M | Rooftop synthesis, rebuild trigger, lantern reveals, clue memory markers, three slow vertical floating platforms, final court/heart seal approach | Implemented expansion; needs timed QA | Rooftop synthesis now leads through prior clue markers, ceremonial floating ascent, final court, and a heart-seal/final-door handoff before the retained final puzzle | Old Level 10 remains intact as dev/source material; its memory-marker/final-court ideas are reused by pattern in old Level 9 | Medium-high; verify final ascent stays easier than Chapter 5 on mobile |

## Lost Old Mechanics Audit

| Old source | Valuable mechanic or layout idea | What it did well | Recommended six-chapter reuse | Risk | Mobile suitability |
|---|---|---|---|---|---|
| Old Level 2 | Slow horizontal moving tram platforms | Introduced timing without pressure | Chapter 2 city/tram section before the hidden wall | Low | Good if platforms stay wide and slow |
| Old Level 3 | Rebuild triggers and appearing safe paths | Made repair tactile inside platforming | Chapter 2 hidden wall/keyhole section; optional light reprise in Chapter 6 | Medium | Good if rebuilt paths do not create low ceilings |
| Old Level 4 | Drifting paper platforms and witness fragments | Made investigation feel physical | Chapter 3 riverbank, drifting notes, bridge shadow | Low | Good if paper platforms are generous |
| Old Level 5 | Archive key/door route and tiny-detail pickups | Created exploration without combat | Chapter 4 archive drawer/correction route | Medium | Good if door/key objects are visually clear |
| Old Level 6 | Choice doors with safe loopbacks | Turned trust into a navigational choice | Chapter 5 courthouse spine | Medium | Good because wrong doors do not punish heavily |
| Old Level 7 | Lantern switches and revealed platforms | Strong calm continuity from Trust to warmth | Chapter 5 lantern garden transition | Low-medium | Good if reveal state is obvious without color alone |
| Old Level 8 | Vertical elevators and tower ascent | The strongest lost mechanical identity; made late game feel bigger | Chapter 5 ribbon/pages ascent, with 2-3 elevators rather than the full old tower | High | Suitable if elevators are wide, slow, and checkpointed |
| Old Level 9 | Mechanic synthesis: moving platforms, rebuild, lantern reveals | Felt like all prior clues combining | Chapter 6 rooftop synthesis | Medium | Good if mechanics appear one at a time |
| Old Level 10 | Ceremonial final court traversal with clue memory markers | Made the final approach emotionally earned and easier than Level 9 | Chapter 6 final court approach before final puzzle | Medium | Good if kept mostly horizontal with optional gentle lifts |
| Dev checkpoint pattern | Checkpoints every 15-25 seconds | Kept platforming birthday-friendly | All expanded chapters | Low | Essential for mobile comfort |

## Revised Six-Chapter Structure

### Chapter 1 - The Sealed Envelope

- Story role: tutorial and inciting case moment.
- Platformer setting: kancelaria desk route, papers, case-file ledges, and a small tram-ticket glow at the end.
- Gameplay beats: safe movement tutorial; envelope discovery; route-awakening ending with a short second section.
- Reused old mechanics: old Level 1 base plus a small old Level 2-inspired route marker, not moving tram timing.
- Clue discovery: the sealed envelope opens into brass key and tram ticket.
- Puzzle connection: Case Mosaic restores the envelope and reveals the route bundle.
- VN purpose: establish Maria's birthday, the envelope, and why careful reading matters.
- Emotional reveal: Maria notices what others miss.
- Next-chapter handoff: the tram ticket begins writing a route that needs a golden stamp.
- Target platformer duration: 90-120 seconds.
- Target total chapter duration: 3-4 minutes.
- Recommended checkpoints: 2.
- Difficulty target: tutorial, no punishment loops.
- Implementation risk: low.

### Chapter 2 - The Hidden Wall

- Story role: turn the route into a physical path through Warsaw.
- Platformer setting: tram/deadline route into a rebuilt street and hidden wall.
- Gameplay beats: moving tram platforms; golden validator/stamp moment; brass key/keyhole moment; wall repair/rebuild beat.
- Reused old mechanics: old Level 2 moving platforms plus selected old Level 3 rebuild triggers.
- Clue discovery: Golden Stamp seals the route, Red Brick reveals the Vistula wave mark.
- Puzzle connection: Hidden Wall Repair should feel like the platformer wall opening, not a separate image task.
- VN purpose: connect responsibility, order, and patient repair.
- Emotional reveal: responsibility and patience reveal the path.
- Next-chapter handoff: repaired wall shows a wave mark pointing toward the Vistula.
- Target platformer duration: 120-180 seconds.
- Target total chapter duration: 4-5 minutes.
- Recommended checkpoints: 2-3.
- Difficulty target: easy-medium; moving platforms should be slow and wide.
- Implementation risk: medium.

### Chapter 3 - The River Witness

- Story role: pivot the case from "stolen" toward "left willingly."
- Platformer setting: Vistula riverbank, bridge shadows, drifting papers, nervous witness trail.
- Gameplay beats: riverbank traversal; drifting paper platforms; bridge-shadow witness encounter; archive-code reveal.
- Reused old mechanics: old Level 4 moving paper platforms and witness fragments.
- Clue discovery: the Witness Note says the heart was not taken by force.
- Puzzle connection: Witness Lens marks the contradiction and reveals the archive code.
- VN purpose: keep the witness brief, uneasy, and evidence-led.
- Emotional reveal: Maria hears the quiet version of truth.
- Next-chapter handoff: archive reference appears on the note.
- Target platformer duration: 120-150 seconds.
- Target total chapter duration: 3.5-4.5 minutes.
- Recommended checkpoints: 2.
- Difficulty target: easy-medium; investigation over precision.
- Implementation risk: low.

### Chapter 4 - The Archive of Corrections

- Story role: prove the case changes because of a tiny correction.
- Platformer setting: archive drawers, shelves, legal file spines, margin-note light.
- Gameplay beats: archive key/door route; shelf exploration; margin-note search feeling; silver-key discovery.
- Reused old mechanics: old Level 5 archive keys/doors and tiny-detail notes; silver-key story beat from old Level 6.
- Clue discovery: the Marginal Note corrects the charge to "No. Given." and reveals the Silver Key.
- Puzzle connection: Archive Detail Finder should end with the silver key sliding from the file spine.
- VN purpose: reward Maria's attention to small details.
- Emotional reveal: small details change the whole charge.
- Next-chapter handoff: the silver key points to the Courthouse of Echoes.
- Target platformer duration: 120-180 seconds.
- Target total chapter duration: 4-5 minutes.
- Recommended checkpoints: 2-3.
- Difficulty target: medium but calm; no pixel hunting.
- Implementation risk: medium.

### Chapter 5 - The Door of Trust

- Story role: middle climax where trust, warmth, and lived promise become one sequence.
- Platformer setting: courthouse corridor into lantern garden, then vertical ribbon/pages ascent.
- Gameplay beats: choice doors; Trust route; lantern reveal path; elevator/vertical ascent toward blue-ribbon pages; unfinished-letter release.
- Reused old mechanics: old Level 6 choice doors, old Level 7 lantern switches, selected old Level 8 vertical elevators.
- Clue discovery: Silver Key opens Trust, Lantern lights the path, Blue Ribbon releases the letter.
- Puzzle connection: Door of Trust puzzle can remain Echo Path initially, but success should visibly imply lantern and ribbon. Later, a hybrid can add a short lantern/ribbon phase.
- VN purpose: connect the right question, the key, the lantern, and the ribbon without overexplaining.
- Emotional reveal: real love is proven by what remains and what is chosen again.
- Next-chapter handoff: the blue ribbon releases the unfinished letter above the rooftops.
- Target platformer duration: 180-240 seconds.
- Target total chapter duration: 5-6 minutes.
- Recommended checkpoints: 3.
- Difficulty target: medium, forgiving; no long vertical punishment loop.
- Implementation risk: high.
- Part 42L status: implemented in the retained Level 6 bridge geometry with one lantern reveal path, three wide slow vertical elevators, blue-ribbon/unfinished-letter handoff objects, and four total checkpoints. Old Levels 7 and 8 remain intact as dev/source material.

### Chapter 6 - The Court of the Heart

- Story role: finale synthesis and ceremonial approach to verdict.
- Platformer setting: rooftops before sunrise rising into the Court of the Heart.
- Gameplay beats: rooftop synthesis; prior clue memory markers; floating/elevator ascent; final court approach; heart seal/final door.
- Reused old mechanics: old Level 9 synthesis route plus old Level 10 ceremonial court route and memory markers.
- Clue discovery: the Unfinished Letter completes, then the Heart, Freely Given becomes the final clue.
- Puzzle connection: Final Case Seal should complete the court seal and route to the approved verdict.
- VN purpose: prepare the verdict briefly; do not repeat the emotional payoff.
- Emotional reveal: the heart was freely given.
- Next-chapter handoff: no next chapter; final verdict opens.
- Target platformer duration: 180-240 seconds.
- Target total chapter duration: 5-6 minutes.
- Recommended checkpoints: 3.
- Difficulty target: easy-medium, ceremonial, easier than Chapter 5.
- Implementation risk: high.
- Part 42M status: implemented in the retained Level 9 bridge geometry with optional clue memory markers, three wide slow vertical floating platforms, final court staging, a heart-seal/final-door payoff, and four total checkpoints. Old Level 10 remains intact as dev/source material and the approved verdict boundary remains unchanged.

## Continuity Rebuild Plan

| Chapter | Current continuity gap | VN fix direction | Puzzle success fix direction | Evidence/reveal fix direction | Platformer object/visual fix direction |
|---|---|---|---|---|---|
| 1 | Key and tram ticket are not strongly playable after the envelope | Make intro/outro point from envelope to route without extra exposition | Add/keep a line that key and ticket fall from the restored envelope | Next hint should emphasize the glowing tram ticket | Add a route marker or ticket glow at the exit |
| 2 | Golden stamp, keyhole, wall, and Vistula mark are split across text/puzzle | Let intro carry ticket -> validator -> wall; pre-puzzle focuses on keyhole/wall image | Success should name both wall memory and Vistula wave mark | Reveal should show Golden Stamp and Red Brick as one filed chapter clue group | Add validator/stamp beat and a wall/keyhole section before exit |
| 3 | Witness moment can feel like normal pickup traversal | Intro should stage the witness as nervous and brief | Success should reveal archive code, not only contradiction | Next hint should make archive reference visible | Add bridge-shadow or witness silhouette marker and an archive-code clue pickup/exit sign |
| 4 | Silver key is not physically earned enough | Post-puzzle should make "No. Given." and file-spine key one clear beat | Success should mention the silver key sliding free | Reveal should connect the key to the Courthouse of Echoes | Add a silver-key glint near final archive drawer or exit |
| 5 | Lantern and blue ribbon are mostly non-playable in active bridge | Intro/pre-puzzle should name key -> Trust -> lantern -> ribbon as one route | Success should not stop at Trust; it should imply light and ribboned pages | Reveal should make unfinished-letter release clear | Add lantern reveal path and elevator/ribbon ascent using old Levels 7-8 |
| 6 | Final court is mostly puzzle/VN, while platformer stays rooftops | Intro should frame rooftops as all prior places glowing below | Success should say final seal closes and verdict unlocks | No normal next clue; route to verdict | Add a short old Level 10-style court approach after rooftop synthesis |

## Puzzle Connection Audit

| Chapter | Active puzzle state | Connection score | Concern | Recommendation |
|---|---|---|---|---|
| 1 | Case Mosaic restores envelope | Strong | Route/key/ticket reveal could be more visible | Keep mechanics; strengthen success/reveal art or copy when final assets arrive |
| 2 | Rebuild Puzzle handles hidden wall; Case Timeline is bypassed in active chapter | Medium | Golden stamp and tram route are mostly setup, while puzzle is wall repair | Add a small stamped-route prelude in VN/platformer or a two-phase wrapper later |
| 3 | Witness Lens contradiction | Strong | Archive code can feel like a text-only afterthought | Add a visible archive-code success line/mark and platformer handoff |
| 4 | Archive Detail Finder | Strong | Silver key reveal is not a direct puzzle object yet | Add silver-key reveal to success state or post-puzzle reveal art; keep magnifier logic |
| 5 | Echo Path only | Medium-low for merged chapter | Does not yet include lantern/ribbon interaction | Keep Echo Path now; later add one short lantern/ribbon result, not three separate minigames |
| 6 | Final Verdict Assembly only | Medium | Case Constellation/unfinished-letter synthesis is mostly VN, not puzzle | Consider a two-phase finale after traversal is stable: constellation summary, then final seal |

## VN And Story Pacing Audit

| Chapter | Intro VN | Pre-puzzle VN | Post-puzzle VN | Rewrite direction |
|---|---|---|---|---|
| 1 | Establishes case well | Frames envelope restoration | Points to route | Keep concise; add one concrete image of key/ticket glow if needed |
| 2 | Needs to bind tram, stamp, wall, and keyhole | Should focus on what the wall needs Maria to repair | Should reveal wave mark | Stronger physical chain: ticket -> stamp -> keyhole -> wall -> river |
| 3 | Works as mystery pivot | Frames evidence inspection | Sends to archive | Keep Maria active and observant; avoid making witness melodramatic |
| 4 | Works but needs silver-key payoff | Frames "No. Given." clearly | Sends to courthouse | Make key discovery feel like evidence, not a surprise prop |
| 5 | Carries too much because geometry/puzzle bridge is partial | Should frame the sequence as one Door of Trust test | Should release unfinished letter | After geometry expansion, trim VN so platformer carries lantern/ribbon visually |
| 6 | Works as finale setup | Frames seal and letter | Routes to verdict | Keep it ceremonial and short; do not restate the verdict emotionally |

## Level Length And Checkpoint Plan

| Chapter | Recommended world shape | Target platformer time | Target total chapter time | Checkpoints | Mechanic beats | Difficulty | Mobile risk | Old geometry source |
|---|---|---:|---:|---:|---|---|---|---|
| 1 | 2200-2600w x 540-650h | 90-120s | 3-4m | 2 | Tutorial movement; envelope; route-awakens ending | Intro | Low | Old Level 1 plus small old Level 2-inspired ending |
| 2 | 3200-4200w x 540-700h | 120-180s | 4-5m | 2-3 | Moving tram; validator/stamp; keyhole; rebuild/wall | Easy-medium | Medium | Old Level 2 plus selected old Level 3 |
| 3 | 3000-3600w x 540-700h | 120-150s | 3.5-4.5m | 2 | Drifting papers; bridge/witness; archive code | Easy-medium | Low | Old Level 4 |
| 4 | 3200-4200w x 540-760h | 120-180s | 4-5m | 2-3 | Archive keys/doors; margin notes; silver key | Medium | Medium | Old Level 5 plus silver-key story beat |
| 5 | 4300-5600w, 1100-1500h if vertical | 180-240s | 5-6m | 3 | Choice doors; lantern reveal; elevator/ribbon ascent | Medium | High | Old Level 6, selected old Level 7, selected old Level 8 |
| 6 | 4200-5400w, 900-1300h if ascent | 180-240s | 5-6m | 3 | Rooftop synthesis; floating/elevator ascent; final court | Easy-medium | Medium | Old Level 9 plus selected old Level 10 |

Checkpoint guidance: place checkpoints after each distinct story/mechanic beat, not only after distance. On mobile, each checkpoint should cap recovery time at roughly 15-25 seconds.

## Implementation Roadmap

### Part 42J - Expand Chapter 1 and Chapter 2 platformers and clue continuity

- Add meaningful traversal length without increasing early difficulty.
- Add route/key/ticket continuity in Chapter 1.
- Merge tram movement, golden stamp, hidden wall, keyhole, and rebuild beat in Chapter 2.
- Restore a moving-platform beat in Chapter 2 while keeping it safe.

### Part 42K - Expand Chapter 3 and Chapter 4 platformers and clue continuity

- Strengthen witness staging and archive-code handoff.
- Make archive exploration and the "No. Given." correction more physical.
- Add a visible silver-key reveal without pulling in the full courthouse route.

### Part 42L - Rebuild Chapter 5 with elevator/vertical mechanics

- Build one coherent route: courthouse -> Trust door -> lantern garden -> vertical ribbon/pages ascent.
- Reuse old Level 8 elevator mechanics selectively.
- Keep Chapter 5 to 5-6 minutes total and avoid pasting old Levels 6-8 in full.
- Status: implemented. Follow-up QA should time the route on desktop and mobile and adjust elevator spacing/speed only if playtesting finds missed-platform frustration.

### Part 42M - Rebuild Chapter 6 finale traversal

- Combine rooftops synthesis with a short Court of the Heart approach.
- Reuse old Level 10 memory markers and gentle final mechanics.
- Keep the final chapter ceremonial and easier than Chapter 5.
- Status: implemented. Follow-up QA should time the expanded route, verify the floating ascent on mobile, and confirm Chapter 6 still routes to FinalVerdictScene only after the final puzzle/VN bridge.

### Part 42N - Rewrite VN/puzzle success text based on final continuity

- Apply text changes only after platformer structure is stable.
- Tighten VN around what the player now sees directly.
- Keep final verdict text unchanged.

### Part 42O - Full 6-chapter pacing QA

- Time a human playthrough on desktop.
- Test mobile landscape movement and puzzle tap/drag.
- Tune checkpoint spacing, platform widths, and late-chapter pacing.

## Risks And Mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Returning to 10-level pacing | The game could become too long for a birthday gift | Keep six chapters and target 20-28 minutes total |
| Chapter 5 bloat | It absorbs three old levels and can become confusing | Use old Level 6 as spine, old Level 7 as one lantern beat, old Level 8 as one vertical ascent |
| Elevator frustration on mobile | Vertical movement can punish missed jumps | Use wide slow elevators, generous landings, and three checkpoints |
| Story over-explanation | VN could compensate for missing visual beats with too much text | Expand visuals/objects first, then trim VN |
| Puzzle hybrid overbuild | New multi-phase puzzles can create a risky new system | Start with success-state/reveal continuity; only add wrapper phases after traversal is stable |
| Save bridge fragility | Current completion still writes through old level ids | Do not change saveVersion during expansion parts |
| Dev override conflicts | Old geometry ids may not fit new chapter wrappers | Prefix new chapter object ids and keep old overrides dev-only |
| Final payoff dilution | Extra romantic text before verdict weakens the ending | Keep Chapter 6 VN short and let FinalVerdictScene carry the emotional reveal |

## Final Recommendation

Proceed with a measured expansion, not a structural rollback. The six-chapter format is right for the gift, but the active bridge should be enriched so each chapter feels like a real chapter:

1. Expand Chapters 1-4 modestly with clearer clue objects and one or two extra traversal beats.
2. Rebuild Chapter 5 as the major restored-mechanics chapter, using lantern and vertical elevator material carefully.
3. Rebuild Chapter 6 as a ceremonial synthesis chapter that uses the old finale approach without adding difficulty.
4. Rewrite VN and puzzle success text only after the expanded platformer structure is stable.
5. Preserve the final verdict exactly and keep completion after Accept Verdict.
