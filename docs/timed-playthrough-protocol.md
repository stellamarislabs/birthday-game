# Timed Playthrough And Real-Device QA Protocol

Part 47B creates the manual protocol for proving the current six-chapter game feels right before final visual asset generation. This is a QA document only. It does not change gameplay, story, save data, assets, or the approved final verdict.

## Purpose

Automated tests verify routing, no-scroll layout, puzzle tap fallback, save boundaries, and final-verdict safety. They cannot prove human pacing, real phone comfort, or emotional flow.

Use this protocol to answer:

- Does the complete game land near the 10-15 minute birthday-gift target?
- Does the first playthrough feel warm, playable, and complete rather than rushed or padded?
- Are Chapter 5 elevators comfortable on a real phone?
- Is Chapter 6 rooftop/floating ascent ceremonial rather than frustrating?
- Are all six puzzles comfortable by touch in real mobile browsers?
- Does the verdict still land emotionally after a full run?

## Test Builds

Preferred final timing surface:

```powershell
npm run build
npm run preview
```

If PowerShell blocks the `npm` shim, use:

```powershell
npm.cmd run build
npm.cmd run preview
```

Use the preview URL printed by Vite, usually `http://localhost:4173/`.

Production preview is preferred because it uses the built `dist/` output and disables dev-only runtime behavior. The dev server is acceptable only for exploratory spot checks.

## Reset Before Each Run

For official timed runs, reset through the player UI:

1. Open the game.
2. Go to Settings.
3. Use Reset Case.
4. Confirm the Case Archive shows only Chapter 1 available.
5. Start the run from the normal opening flow.

Do not use direct dev routes for the official timed run, because they skip the real player flow.

## Desktop Timed Playthrough

Use a desktop browser, preferably Chrome or Edge first. Firefox is a useful second pass if time allows.

Setup:

- Use production preview if possible.
- Use a fresh reset save.
- Use keyboard for platformers.
- Use mouse/tap fallback or drag where natural for puzzles.
- Keep devtools open only if you are checking console/network errors; otherwise avoid slowing the run.

Timer rules:

- Start timer when pressing Start / Open Case on the opening start screen.
- Use lap markers at each chapter boundary.
- Stop timer after pressing Accept Verdict and seeing the Case Closed state.
- Do not skip scenes on the first official timing pass unless the intended player is expected to skip them.
- If a mistake happens, continue naturally and note it rather than restarting.

Record:

- Total time.
- Opening cinematic time.
- Chapter-by-chapter time.
- Platformer time per chapter.
- Puzzle solve time per chapter.
- Reveal/final-verdict reading time.
- Any frustration moments.
- Any places where story feels too fast, too slow, or repetitive.
- Any places where controls feel bad.
- Any console, network, or asset-load errors.

## Mobile Landscape Timed Playthrough

Run at least one real phone pass before treating the gift as release-ready.

Target devices:

- iPhone Safari landscape.
- Android Chrome landscape.

Setup:

- Use a production preview URL reachable from the phone, or a deployed staging URL.
- Reset save on that phone/browser before the run.
- Lock or maintain landscape orientation.
- Use touch-only completion.
- Do not use keyboard, mouse, trackpad, or desktop remote controls.
- Do not use dev helper routes for the official mobile timed run.

Timer rules:

- Start when tapping Start / Open Case.
- Stop after tapping Accept Verdict and seeing the Case Closed state.
- Record chapter laps the same way as desktop.
- If mobile browser chrome changes viewport height, keep playing and note whether it causes clipping or scroll.

Record:

- Total time.
- Chapter-by-chapter time.
- Puzzle comfort.
- Platformer comfort.
- Touch-control comfort.
- No-scroll / viewport issues.
- Any accidental page panning or browser gestures.
- Any clipped text/buttons.
- Any puzzle that feels drag-only or too precise.
- Any platformer section that feels too hard with thumbs.

## Optional Browser Emulator Spot Check

Useful viewports:

- iPhone landscape: 844x390.
- Larger iPhone landscape: 932x430.
- Android landscape: 915x412 or similar.

Emulator checks are useful for layout and no-scroll regressions, but they are not a substitute for real devices. A mouse-driven mobile viewport cannot prove thumb comfort, browser chrome behavior, touch timing, or real Safari/Chrome quirks.

## Chapter Timing Template

Use one row per official run.

| Segment | VN / intro | Platformer | Puzzle | Reveal / verdict | Total | Fun 1-5 | Frustration 1-5 | Mobile comfort 1-5 | Notes |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Opening cinematic |  | n/a | n/a | n/a |  |  |  |  |  |
| 1. The Sealed Envelope |  |  |  |  |  |  |  |  |  |
| 2. The Hidden Wall |  |  |  |  |  |  |  |  |  |
| 3. The River Witness |  |  |  |  |  |  |  |  |  |
| 4. The Archive of Corrections |  |  |  |  |  |  |  |  |  |
| 5. The Door of Trust |  |  |  |  |  |  |  |  |  |
| 6. The Court of the Heart |  |  |  |  |  |  |  |  |  |
| Final verdict reading / accept | n/a | n/a | n/a |  |  |  |  |  |  |
| Total game |  |  |  |  |  |  |  |  |  |

Scoring guidance:

- Fun 5: memorable and smooth.
- Fun 3: acceptable but not special.
- Fun 1: dull, confusing, or actively unpleasant.
- Frustration 1: no frustration.
- Frustration 3: noticeable friction but recoverable.
- Frustration 5: likely release blocker.
- Mobile comfort 5: easy with thumbs.
- Mobile comfort 3: playable with care.
- Mobile comfort 1: not acceptable on phone.

## Target Pass / Fail Criteria

Runtime:

- Ideal: 10-15 minutes total.
- Acceptable stretch: up to 16 minutes if the game feels smooth and not padded.
- Fail: over 18 minutes for a first-time playthrough.

Chapter pacing:

- No chapter should feel like filler.
- No chapter should feel like only a few jumps.
- No puzzle should feel like homework.
- No normal puzzle solve should take more than 90 seconds.
- No platformer section should feel frustrating on phone.

Mobile:

- Must be completable touch-only in landscape.
- No page/body scroll.
- No required control hidden.
- No drag-only puzzle completion.
- Chapter 5 elevators must be playable.
- Chapter 6 final ascent must be playable.

Story:

- Player understands each clue handoff.
- VN and reveals do not feel excessive.
- Chapter 6 does not spoil the final verdict before the verdict scene.
- Final verdict remains readable and emotionally lands after the full flow.

Production:

- No console errors during normal play.
- No failed network/asset requests.
- No dev write endpoint is available in production preview.
- F1/debug editor does not open in production preview.

## Real-Device Checklist

### iPhone Safari Landscape

- Opening/menu works.
- Case Archive shows all six chapters and Chapter 1 starts correctly.
- Touch platformer controls are visible and usable.
- Chapter 1 tutorial jumps are comfortable.
- Chapter 2 tram/moving platforms are comfortable.
- Chapter 3 drifting-paper platforms are comfortable.
- Chapter 4 archive/drawer movement is comfortable.
- Chapter 5 elevators are playable and not stressful.
- Chapter 6 rooftop/floating ascent is playable and ceremonial.
- All six puzzles are tappable without keyboard/mouse.
- Puzzles can be completed without drag precision.
- Final verdict is readable.
- Accept Verdict is visible and tappable.
- No page/body scroll appears.
- No critical button is clipped or hidden by browser chrome.
- Settings, reset, credits, and replay paths still work.

### Android Chrome Landscape

- Opening/menu works.
- Case Archive shows all six chapters and Chapter 1 starts correctly.
- Touch platformer controls are visible and usable.
- Chapter 1 tutorial jumps are comfortable.
- Chapter 2 tram/moving platforms are comfortable.
- Chapter 3 drifting-paper platforms are comfortable.
- Chapter 4 archive/drawer movement is comfortable.
- Chapter 5 elevators are playable and not stressful.
- Chapter 6 rooftop/floating ascent is playable and ceremonial.
- All six puzzles are tappable without keyboard/mouse.
- Puzzles can be completed without drag precision.
- Final verdict is readable.
- Accept Verdict is visible and tappable.
- No page/body scroll appears.
- No critical button is clipped or hidden by browser chrome.
- Settings, reset, credits, and replay paths still work.

### Desktop Browser

- Keyboard controls work in platformers.
- Mouse drag works where offered.
- Tap/click fallback works for all puzzles.
- No layout clipping at 1366x768.
- No layout clipping at 1920x1080 if practical.
- No layout clipping at 1024x600 if practical.
- Final verdict is readable and Accept Verdict is visible.
- Case Archive remains six chapters.
- Credits and settings work.

## Production Preview Checklist

1. Run `npm run build`.
2. Run `npm run preview`.
3. Open the preview URL.
4. Reset save from the game UI.
5. Complete a full normal run.
6. Check browser console for errors.
7. Check network panel for failed asset requests.
8. Confirm the known large bundle warning is build-only and not a runtime failure.
9. Confirm F1 does not open the dev editor in production preview.
10. Confirm any dev write endpoint returns 404 or is unavailable in preview.
11. Confirm no player-facing flow depends on `dev-level-overrides/`.
12. If testing GitHub Pages or a subpath, build with the intended `VITE_BASE_PATH` and verify no asset 404s.

PowerShell base-path example:

```powershell
$env:VITE_BASE_PATH="/repo-name/"
npm.cmd run build
```

## Safe Helper Routes For Spot Checks

These helpers are useful for targeted QA on the dev server or test mode. They are not substitutes for the official timed run.

- `?scene=level-select`
- `?scene=level-select&completeLevel=8`
- `?scene=platformer&chapter=1` through `?scene=platformer&chapter=6`
- `?scene=puzzle&chapter=1` through `?scene=puzzle&chapter=6`
- `?scene=final-verdict`
- `?completeLevel=1`, `?completeLevel=3`, `?completeLevel=4`, `?completeLevel=5`, `?completeLevel=8`
- `?gameCompleted=true`

For platformer spot checks, dev routes also support checkpoint/spawn parameters such as:

- `?scene=platformer&chapter=5&checkpoint=2`
- `?scene=platformer&level=9&spawn=x:1450,y:260`

Use these only to isolate bugs. Always confirm fixes in the normal player flow afterward.

## Bug Report Template

```text
Title:

Device/browser:
Viewport/orientation:
Build URL or preview URL:
Chapter/scene:
Issue type: platformer / puzzle / VN / save / layout / audio / performance / story / other

Steps to reproduce:
1.
2.
3.

Expected:

Actual:

Screenshot/video:

Severity: Critical / High / Medium / Low
Blocking release? Yes / No

Notes:
```

Severity definitions:

- Critical: cannot finish the game, final verdict unreachable, save/progression broken.
- High: mobile blocks completion, unsolvable puzzle, impossible platformer section, missing required control.
- Medium: frustrating, ugly, clipped, confusing, or likely to hurt first-time feel.
- Low: polish issue, typo, minor visual inconsistency, non-blocking dev-only noise.

## Decision After The Run

After one desktop timed run and at least one real phone landscape run:

- If total time is 10-15 minutes and no High/Critical mobile bugs appear, final asset generation can continue.
- If total time is 16 minutes or less and the run feels smooth, asset work may continue with a noted pacing risk.
- If total time is over 18 minutes, do a small pacing triage before final asset generation.
- If Chapter 5 or Chapter 6 is frustrating on a phone, fix those sections before final art.
- If any puzzle needs drag precision on mobile, fix tap fallback before final art.
