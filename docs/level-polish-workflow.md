# Chapter 5 And Chapter 6 Level Polish Workflow

This workflow is for manual level polish with the dev editor. It is an override-authoring process only: do not edit `src/game/platformer/levelGeometry.ts`, do not bake overrides, and do not change puzzles, story, final verdict text, save/progression, or assets during this pass.

Use this guide before final visual asset work to reduce the remaining feel risks around Chapter 5 elevators, Chapter 6 rooftop/floating ascent, mobile landscape comfort, and the 10-15 minute total runtime target.

## Setup

1. Start the dev server with `npm run dev`.
2. Open the chapter route:
   - Chapter 5: `?scene=platformer&chapter=5`
   - Chapter 6: `?scene=platformer&chapter=6`
3. Press F1 to open the dev editor.
4. Turn validation markers on.
5. Click `Validate Level`.
6. Keep `Snap` on for broad placement and endpoint tuning. Turn it off only for small final adjustments.
7. Use Undo and Redo freely during the session.
8. After a good tuning pass, click `Save All`, reload the same route, replay the edited section, then export an override backup.

Red validation issues are blockers for this polish pass. Yellow warnings are review items: resolve them when they match a real support, checkpoint, bounds, or mobile-comfort problem, but do not overfit the route to the heuristic.

## General Polish Rules

- Play the baseline route once before editing if possible.
- Fix validation errors before adding new traversal.
- Prefer moving, widening, or adding helper static platforms before adding more elevators.
- Add a new elevator only when the route still feels too flat or needs a clear authored ascent beat.
- Keep platforms wide, slow, and forgiving for touch controls.
- Avoid blind jumps, late precision spikes, long fall punishment, and respawns on moving platforms.
- Use checkpoint edits to reduce replay friction, not to skip required clues.
- After every meaningful change, validate, save, reload, and replay the edited section.

## Chapter 5 - The Door Of Trust

Route: `?scene=platformer&chapter=5`

Focus areas:

- Courthouse corridor.
- Trust threshold.
- Lantern descent.
- Light bridge.
- Three vertical elevators.
- Blue ribbon / unfinished letter ledge.
- Final exit.

Target feel:

- The strongest platformer chapter.
- Medium difficulty, but forgiving.
- The elevator ascent should feel deliberate rather than stressful.
- Platformer time target: about 120-150 seconds, or close by feel.

### Chapter 5 Checklist

1. Open the route, press F1, turn validation markers on, and click `Validate Level`.
2. Fix any red validation errors before subjective tuning.
3. Play from the start through the final exit once before editing if practical.
4. Check the courthouse corridor and Trust threshold:
   - Route direction is clear.
   - No required object floats or sits inside geometry.
   - The Trust door area has safe standing support.
5. Check lantern descent and light bridge:
   - Descent has safe landings.
   - The bridge route is readable on desktop and mobile landscape.
   - There is no long fall punishment before the elevator section.
6. Check each vertical elevator:
   - Platform is wide enough for touch play.
   - Speed is slow enough to board without precision timing.
   - Start and end endpoints are reachable.
   - Endpoint handles align with safe ledges.
   - Landing after the lift is stable and visible.
   - Falling does not force too much replay.
7. Check checkpoints:
   - One checkpoint before the elevator section.
   - One checkpoint after the elevator section.
   - Respawn markers are supported.
   - Respawns do not place Maria on an unstable moving platform.
8. Check clue/interactable and exit support:
   - Silver Key.
   - Trust door.
   - Lantern switch.
   - Blue ribbon / unfinished letter.
   - Final exit.
9. If a section feels too harsh, first try:
   - Widening elevator platforms.
   - Slowing elevator speed.
   - Moving endpoints closer to safe ledges.
   - Adding a helper static platform or catch ledge.
10. Add a new elevator only if the chapter still feels too flat or lacks a clear ascent beat after smaller tuning.
11. Validate again, save, reload, replay, and export a Chapter 5 backup.

## Chapter 6 - The Court Of The Heart

Route: `?scene=platformer&chapter=6`

Focus areas:

- Lower rooftops.
- Parapet/chimney climb.
- Upper skyline route.
- Safe roof-gap descent.
- Clue-memory balcony.
- Floating court elevators.
- Final court landing.
- Heart seal platform.
- Final door.

Target feel:

- Ceremonial rooftop climb.
- Satisfying final ascent.
- Easier and calmer than Chapter 5.
- No stressful final platforming spike.
- Platformer time target: about 120-150 seconds, or close by feel.

### Chapter 6 Checklist

1. Open the route, press F1, turn validation markers on, and click `Validate Level`.
2. Fix any red validation errors before subjective tuning.
3. Play from the start through the final door once before editing if practical.
4. Check the rooftop climb:
   - The route genuinely goes up, not only right.
   - Next platforms are visible before committing to jumps.
   - No blind jumps.
   - Landings are safe and wide enough for touch controls.
5. Check the upper skyline and descent:
   - Direction changes are readable.
   - The roof-gap descent feels intentional, not like a mistake.
   - There is a supported landing before the next required object.
6. Check floating court elevators:
   - Movement is slow and ceremonial.
   - Platforms are wide enough.
   - Endpoint handles are placed near safe ledges.
   - There is no precision timing.
   - The ascent feels final, not punishing.
7. Check checkpoints:
   - One checkpoint after the first rooftop climb.
   - One checkpoint before the floating ascent.
   - One checkpoint after the floating ascent.
   - Respawn markers are supported and do not skip required clue moments in a broken way.
8. Check clue/final-object support:
   - Unfinished letter.
   - Clue memory markers.
   - Heart seal.
   - Final door.
9. If the chapter feels too hard, first try:
   - Larger landing ledges.
   - Slower floating elevators.
   - Shorter endpoint travel.
   - A helper static platform before or after a moving platform.
10. Add a new elevator only if the final ascent feels too flat or too short after smaller tuning.
11. Validate again, save, reload, replay, and export a Chapter 6 backup.

## Timed Playtest Template

Use this table after each good polish session. Run desktop first, then real mobile landscape when available.

| Chapter | Desktop time | Mobile time | Fun 1-5 | Frustration 1-5 | Touch comfort 1-5 | Notes |
|---|---:|---:|---:|---:|---:|---|
| Chapter 5 - The Door Of Trust |  |  |  |  |  |  |
| Chapter 6 - The Court Of The Heart |  |  |  |  |  |  |
| Full game total time |  |  |  |  |  |  |

Pass criteria:

- Chapter 5 platformer: 120-150 seconds, or feels close without filler.
- Chapter 6 platformer: 120-150 seconds, or feels close without filler.
- Full game: 10-15 minutes target.
- No section feels impossible.
- No mobile section feels unfair.
- Chapter 6 feels easier than Chapter 5.
- Frustration should ideally be 1-2.
- Touch comfort should ideally be 4-5.

## Override Backup Policy

- Export override JSON after each good polish session.
- Suggested backup names:
  - `chapter-5-elevator-polish-YYYYMMDD.json`
  - `chapter-6-rooftop-polish-YYYYMMDD.json`
- If you are about to make a risky edit, export a before-state backup first, such as `chapter-5-elevator-polish-YYYYMMDD-before-big-edit.json`.
- Do not bake these overrides yet.
- Keep canonical geometry untouched until final manual approval.
- Keep backups outside `dev-level-overrides/` or clearly label them as handoff backups so they are not mistaken for active runtime overrides.
- After `Save All`, reload the same route and confirm the edited state persists before treating a backup as good.

## Final Session Checklist

- Red validation errors are cleared or explicitly documented.
- Chapter-specific clue/interactable, checkpoint, elevator, and exit support has been checked.
- Desktop timing has been recorded.
- Mobile landscape timing has been recorded when a real device is available.
- Chapter 5 elevator feel is comfortable.
- Chapter 6 rooftop/floating ascent feels ceremonial and easier than Chapter 5.
- `Save All` and reload have been verified.
- Override JSON backup has been exported.
- No canonical geometry bake has been performed.
