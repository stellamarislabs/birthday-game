# Maria and the Case of the Missing Heart

**Sprawa Zaginionego Serca**

A browser-based 2D platformer mystery planned as a personal birthday gift for Maria. Maria is the heroine solving a clever, warm, lightly legal-themed case across Warsaw; the final mystery becomes romantic without reducing her to a generic romantic character.

## Stack

- Phaser 3
- TypeScript
- Vite
- Vitest
- Playwright smoke-test scaffold
- Static deployment through `dist/` later

## Current Scope

Parts 1-37 are implemented. Levels 1-10, redesigned tactile puzzle interludes, Visual Novel scenes for Levels 1-10, placeholder VN portraits/background variants, evidence reveals, the final verdict ending, save/progression, settings, credits, visual/audio polish, production deployment preparation, VN pacing/readability QA, and final visual/asset-budget planning are in place. The active puzzle family is Case Mosaic, Case Timeline, Rebuild Puzzle, Witness Lens, Archive Detail Finder, Echo Path, Lantern Sequence, Argument Tower, Case Constellation, and Final Verdict Assembly. Older form-like puzzle modules are retired from runtime routing and left only as archived legacy source for later deletion. Final art, music, photos, voice, and private memories are not added yet.

## Audio

The current build uses small procedural WebAudio sound effects generated in code for UI and progress feedback. There are no external audio files or music. Audio unlocks after user interaction, respects the Mute setting, and fails silently if a browser blocks WebAudio.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run preview
npm run test:all
```

Playwright browsers may need a one-time local install:

```bash
npx playwright install
```

## Developer Level Tuning

In dev/test mode, platformer levels can be opened directly with routes such as:

```bash
http://localhost:5173/?scene=platformer&level=5
http://localhost:5173/?scene=platformer&level=10
http://localhost:5173/?scene=platformer&level=8&checkpoint=2
http://localhost:5173/?scene=platformer&level=8&spawn=x:1450,y:260
http://localhost:5173/?scene=vn&id=vn-level-1-intro
http://localhost:5173/?scene=vn&id=vn-level-5-before-puzzle
http://localhost:5173/?scene=vn&id=vn-level-10-after-puzzle
```

Press F1 in a platformer scene to open the developer tuning overlay. G toggles the grid, H toggles bounds, P toggles labels, C copies Maria's position, Shift+C copies the pointer position, J/T copy selected object data, arrow keys nudge selected objects at runtime, and Ctrl/Cmd+Arrow resizes selected platform-like objects. These tools are dev/test-only and do not write source files or change save progress.

### Saving tuned level coordinates in development

Browsers cannot write TypeScript source files directly. In dev-server mode, the tuning overlay saves JSON override files through a local Vite middleware instead:

1. Start `npm run dev`.
2. Open `http://localhost:5173/?scene=platformer&level=8`.
3. Press F1.
4. Press G and H to show grid and bounds.
5. Click a platform or moving platform.
6. Use Arrow keys, Shift+Arrow, or Alt+Arrow to nudge it.
7. For static platforms, moving platforms, rebuildable platforms, light platforms, and archive doors, use Ctrl/Cmd+Arrow to resize by 1px, Ctrl/Cmd+Shift+Arrow by 10px, or Ctrl/Cmd+Alt+Arrow by 32px.
8. Press S to save the selected object, or Shift+S to save all dirty objects.
9. Reload the page and confirm the position and size persisted.
10. When happy, either keep the generated `dev-level-overrides/level-N.json` file for local tuning or copy the final JSON/TypeScript snippet into the main level geometry.

Level geometry stores rectangle `x/y` as the top-left corner; Phaser draws and collides them from a centered runtime object. Resize keeps source `x/y` fixed and expands width to the right and height downward, with a minimum size of 16x8. Moving platforms and elevators save their movement anchors too, so nudging them shifts the full route rather than only the current rectangle; resizing changes only width/height and preserves the movement path.

Shift+D deletes the selected object's saved override; reload afterward to see the source geometry again.

## Release And Deployment

Build output is generated in `dist/` and can be hosted as a static site.

Recommended local release check:

```bash
npm install
npm run typecheck
npm run test
npm run build
npm run preview
```

The Vite base path defaults to `./` for portable static hosting and itch.io ZIP uploads. Override it only when the hosting target needs a fixed root or subpath:

```bash
VITE_BASE_PATH=/ npm run build
VITE_BASE_PATH=/maria-case-game/ npm run build
```

On PowerShell, set the variable first, for example `$env:VITE_BASE_PATH='/maria-case-game/'; npm run build`.

Deployment targets:

- GitHub Pages: enable Pages with GitHub Actions, run the manual `Deploy GitHub Pages` workflow, and set `base_path` to `/repo-name/` for project pages.
- Vercel: build command `npm run build`, output directory `dist`, usually `VITE_BASE_PATH=/`.
- Netlify: build command `npm run build`, publish directory `dist`, usually `VITE_BASE_PATH=/`.
- itch.io: run `npm run build`, zip the contents of `dist/` with `index.html` at the ZIP root, set the project kind to HTML, and enable browser play.

Before sharing, review `docs/final-release-checklist.md`, `docs/deployment-guide.md`, `docs/visual-style-guide.md`, `docs/asset-budget.md`, `docs/asset-replacement-plan.md`, `CREDITS.md`, and `docs/release-readiness-report.md`.

Production safety notes:

- The developer tuning overlay and dev query routes are disabled outside Vite dev/test mode.
- The dev level-override write endpoint is Vite dev-server middleware only and is not active in production build or preview.
- Do not upload source workspace files, `node_modules/`, or local-only tuning folders as the player package.

## Folder Overview

- `src/game/scenes/` - Phaser scene skeletons.
- `src/game/debug/` - development-only level tuning helpers.
- `src/game/systems/` - pure game-flow, save, and input helpers.
- `src/content/` - story, level, and puzzle data.
- `src/types/` - shared TypeScript contracts.
- `docs/` - product, story, production, QA, and technical source-of-truth documents.
- `.agents/skills/` - repo-scoped Codex workflows for future parts.
- `public/assets/` - placeholder asset folders and pipeline notes.

## Next Step

Next phase can improve visuals with procedural/lightweight assets only, while keeping external images, heavy files, real photos, and private assets out until explicitly approved.
