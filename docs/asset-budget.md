# Asset Budget

Part 37 sets the asset budget for the final polish phase. The goal is a browser-friendly gift build that deploys cleanly on GitHub Pages, Vercel, Netlify, and itch.io.

## Current Baseline

Measured from the existing `dist/` folder before adding final assets:

- Total `dist/` size: about 1.8 MB uncompressed.
- JavaScript bundle: about 1.72 MB uncompressed.
- CSS bundle: about 81 KB uncompressed.
- Public asset files: only `public/assets/README.md`, about 665 bytes.
- No final images, fonts, audio files, photos, or private assets are present.

Vite still emits the known large-chunk warning because Phaser and the app ship in one JS bundle. This is acceptable for the current private gift build, but should be watched if final assets or code-splitting are added later.

## Budget Targets

Recommended targets:

- Initial load target: under 5-10 MB total transfer.
- Full game asset target: under 30-50 MB.
- Individual large background: ideally 300-700 KB.
- Maximum large background: around 1 MB unless strongly justified.
- Small UI icon: under 10-50 KB.
- Sprite sheet: under 250-800 KB per sheet, depending on frames.
- Sound effect: under 50-150 KB each if external audio is later approved.
- Music track: under 2-4 MB each if music is later approved.
- Avoid WAV in production.
- Avoid committing full-resolution source PSD/PNG exports to the playable package.

## Recommended Formats

- Large backgrounds: WebP, sized to the game presentation needs.
- UI icons: optimized SVG or PNG. Prefer SVG for simple vector marks.
- Sprite sheets: optimized PNG or WebP, with trimmed transparent padding.
- Portraits: WebP or optimized PNG if final portraits are approved later.
- Audio: OGG, MP3, or WebM audio. Do not use WAV in production.
- Fonts: avoid custom fonts unless truly needed. If added, use WOFF2 and subset if possible.

## Part 43 Prompt Budget Guidance

`docs/visual-asset-prompt-plan.md` defines the future image-generation brief for the connected clue trail. It keeps the same budget targets while adding prompt-level guardrails before any final art is generated.

Part 43 asset planning targets:

- Opening/menu backgrounds: generate at 1920x1080 source and optimize to WebP before committing.
- VN backgrounds: generate at 1920x1080 or 1600x900 source and optimize to WebP.
- Puzzle board backgrounds: prefer 1600x900 or 1280x720 source, and only use raster boards where procedural CSS/SVG cannot deliver the intended polish.
- Clue icons: 512x512 source maximum, optimized SVG/PNG/WebP, no readable text.
- UI frames/buttons: CSS/SVG/procedural first; raster only if reusable and 9-slice-friendly.
- No 4K exports, raw full-resolution source files, baked UI text, or unreadable AI-generated writing should enter the playable package.
- Part 43 organizes final art around the expanded six player-facing chapters, not ten separate level background sets.
- Chapter 5 and Chapter 6 may need extra late-game visual support, but those should be small motif layers, VN backgrounds, or puzzle-board assets rather than many separate full-screen backgrounds loaded up front.

Future asset batches should start with one high-value image, then rebuild and inspect `dist/` size before continuing.

## Part 48B First Asset Budget

The first final asset target is `public/assets/final/opening-main-menu-office-desk.webp`, an opening/main menu office desk background. This pass only prepares the budget and prompt; it does not add the file.

Budget rules for this first background:

- Source size: 1920x1080, 16:9.
- Final playable format: optimized WebP.
- Target optimized size: ideally 300-700 KB.
- Acceptable ceiling: about 1 MB only if the visual quality justifies it and the next build-size review accepts the cost.
- Avoid 4K exports.
- Avoid PNG for the large background unless transparency becomes a hard requirement, which is not expected here.
- Keep title, Start/Open Case buttons, case text, and logos out of the image. Those must stay rendered by code.
- Load the final background only where needed in a later integration pass; do not expand PreloadScene into a catch-all large-background loader.

## Part 49A-R2 Opening Cinematic Asset Budget

Part 49A-R2 adds the first final raster assets to the playable package: seven WebP frames for the opening cinematic under `public/assets/final/opening/`.

| Asset | Dimensions | Size |
|---|---:|---:|
| `Opening01.webp` | 1672x941 | 192,454 bytes |
| `Opening02.webp` | 1672x941 | 141,528 bytes |
| `Opening03.webp` | 1672x941 | 95,422 bytes |
| `Opening04.webp` | 1672x941 | 93,666 bytes |
| `Opening05.webp` | 1672x941 | 112,384 bytes |
| `Opening06.webp` | 1672x941 | 141,820 bytes |
| `Opening07.webp` | 1672x941 | 126,736 bytes |

Total opening cinematic image weight is about 904 KB uncompressed on disk. Each frame is below the single-background budget ceiling, and the sequence uses public asset URLs rather than bundling the WebPs into JavaScript. `OpeningCinematicScene` preloads the seven images for the cinematic only and falls back to a dark cinematic background if an image fails.

## Loading Strategy

Do not preload all final assets at startup.

- Boot/PreloadScene: load only small shared UI assets that appear immediately, such as a logo mark, shared buttons, or a tiny stamp.
- Title/CaseFile: load first-screen background/title treatment only if needed.
- PlatformerScene: load chapter-specific or retained legacy route art for the selected chapter/route, not all backgrounds.
- PuzzleScene: load puzzle-specific board/token art for the selected chapter puzzle.
- VisualNovelScene: load VN background and portrait assets for the active chapter scene only.
- EvidenceRevealScene: load small clue/stamp art for the current chapter/reveal.
- FinalVerdictScene: load final seal/court assets only near the finale.

Every scene should keep a procedural fallback if an optional image fails to load. This preserves deploy safety and avoids blank screens.

## GitHub Pages And Static Hosting Notes

- GitHub Pages is static hosting. It serves the built files from `dist/`.
- The dev override write endpoint does not exist on GitHub Pages and must remain dev-server-only.
- `localStorage` progress is scoped per browser, device, and domain. Localhost progress does not carry to a deployed GitHub Pages URL.
- Use the correct `VITE_BASE_PATH` for GitHub Pages project pages, usually `/repo-name/`.
- A blank page or missing assets after deploy usually means the base path is wrong.
- Production builds should not expose dev endpoints, local filesystem paths, or `dev-level-overrides/` write behavior.

## Performance Risks

- Huge AI-generated backgrounds.
- Too many uncompressed PNG files.
- WAV audio or long uncompressed loops.
- Loading all six chapter backgrounds or retained legacy backgrounds at startup.
- Adding heavy particle systems or shader effects.
- Large DOM overlays plus canvas effects on mobile.
- Mobile memory pressure from oversized images.
- GitHub Pages base-path mistakes.
- Player confusion when localStorage progress differs between localhost and live URL.

## Mitigations

- Resize assets to display size before committing.
- Use WebP for large backgrounds.
- Use optimized SVG/PNG for small UI marks.
- Lazy-load by scene.
- Keep procedural fallback art.
- Limit particles, shadows, and filters on mobile.
- Test on production preview and at least one real mobile device before sharing.
- Check `dist/` size after every major asset pass.
- Update `CREDITS.md` before committing any third-party asset.

## Manual Size Check

PowerShell:

```powershell
npm run build
(Get-ChildItem -Recurse dist -File | Measure-Object -Property Length -Sum).Sum
Get-ChildItem -Recurse dist -File | Sort-Object Length -Descending | Select-Object Name,Length
```

Use this as a rough uncompressed build-size check. Browser transfer size may be smaller because static hosts use compression.
