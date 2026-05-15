# Final Release Checklist

Use this checklist on the exact build and hosting target that will be shared.

## Build

- [ ] `npm install` completed on a clean checkout.
- [ ] `npm run typecheck` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run preview` opens the built game locally.
- [ ] `dist/index.html` exists.
- [ ] Built JS/CSS/assets are present under `dist/`.

## Desktop Smoke Test

- [ ] Title screen loads.
- [ ] Open/Continue Case works.
- [ ] Level Select opens.
- [ ] Settings opens and closes.
- [ ] Credits opens and returns.
- [ ] Reset Case shows confirmation.
- [ ] One platformer level can be started.
- [ ] One puzzle can be played.

## Mobile Smoke Test

- [ ] Phone browser opens the deployed URL.
- [ ] Landscape layout is readable.
- [ ] Touch controls are usable in at least one platformer.
- [ ] Puzzle cards/buttons are comfortable to tap.
- [ ] Final verdict text is readable.
- [ ] Mute and Reduce Motion are accessible.

## Full Game Completion

- [ ] Levels 1-10 can be reached through intended progression.
- [ ] Puzzles 1-10 can be solved.
- [ ] FinalVerdictScene appears after the Level 10 puzzle.
- [ ] Accept Verdict marks the case completed.
- [ ] Level 10 can be replayed after completion.

## Save, Reset, Replay

- [ ] Progress persists after reload.
- [ ] Settings persist after reload.
- [ ] Completed levels remain replayable.
- [ ] Reset Case requires confirmation.
- [ ] Reset clears progress without crashing.

## Credits And License

- [ ] CREDITS.md matches the actual build.
- [ ] In-game credits match CREDITS.md.
- [ ] No copyrighted music, ripped sprites, trademarked characters, or unclear assets are present.
- [ ] Procedural/in-code audio is documented if present.

## Privacy

- [ ] No private photos, voice, addresses, work secrets, or personal memories are included.
- [ ] Approved personal content is limited to Maria's first name, Alper credit, and the approved verdict/gift text.
- [ ] No secrets or API keys are present.
- [ ] No debug coordinates or local machine paths appear in production UI.

## Dev Tools Disabled In Production

- [ ] Production preview does not show the debug overlay.
- [ ] F1 does not open the level tuning overlay in production preview.
- [ ] Dev query routes do not bypass progression in production.
- [ ] The dev override write endpoint is not available in production preview.

## Deployment Target

- [ ] Hosting target chosen: GitHub Pages, Vercel, Netlify, or itch.io.
- [ ] `VITE_BASE_PATH` matches the final URL.
- [ ] Share URL loads on desktop.
- [ ] Share URL loads on phone.
- [ ] Final share link has been checked from a fresh browser profile or private window.
