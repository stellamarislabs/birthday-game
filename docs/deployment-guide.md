# Deployment Guide

This project builds to a static Vite site in `dist/`. Do not deploy the dev server, source workspace, or `dev-level-overrides/` folder as player-facing content.

## Production Build

```bash
npm install
npm run typecheck
npm run test
npm run build
npm run preview
```

`npm run preview` serves the built `dist/` folder locally with production-mode Vite behavior. Use it for final smoke testing before uploading.

## Base Path

The Vite build defaults to a relative base path (`./`) so the game can run from static hosts and itch.io ZIP uploads. You can override it with `VITE_BASE_PATH`:

```bash
VITE_BASE_PATH=/ npm run build
VITE_BASE_PATH=/maria-case-game/ npm run build
```

On PowerShell:

```powershell
$env:VITE_BASE_PATH="/maria-case-game/"
npm run build
```

Use `/` for root deployments such as most Vercel or Netlify sites. Use `/repo-name/` for GitHub Pages project pages if the site is served below a repository path. A blank page or asset 404s after deployment usually means the base path does not match the hosting URL.

## GitHub Pages

Manual deployment:

1. Confirm the repository Pages settings are configured for GitHub Actions.
2. Run the manual `Deploy GitHub Pages` workflow.
3. Set `base_path` to the served path, usually `/repo-name/` for project pages or `/` for a user/organization page.
4. Open the generated Pages URL and run the release smoke checklist.

Local manual artifact option:

```bash
VITE_BASE_PATH=/repo-name/ npm run build
```

Then upload or publish the generated `dist/` folder using your chosen Pages process.

Before adding final assets, review `docs/asset-budget.md`. For GitHub Pages, keep the first load under roughly 5-10 MB where practical, prefer WebP for large backgrounds, avoid WAV audio, and do not preload every level/VN/puzzle asset on the title screen. If assets 404 after deployment, check both the uploaded `dist/` contents and the configured Vite base path.

## Vercel

Recommended settings:

- Framework preset: Vite or Other Static Site.
- Install command: `npm install` or Vercel default.
- Build command: `npm run build`.
- Output directory: `dist`.
- Environment variable: `VITE_BASE_PATH=/` if you want absolute root paths.

After deployment, check the share URL, title screen, settings, credits, and one playable route.

## Netlify

Recommended settings:

- Build command: `npm run build`.
- Publish directory: `dist`.
- Environment variable: `VITE_BASE_PATH=/` for root hosting.

If deploying under a subpath, set `VITE_BASE_PATH` to that subpath with leading and trailing slashes.

## itch.io HTML5 ZIP

1. Run `npm run build`.
2. Zip the contents of `dist/` so `index.html` is at the ZIP root.
3. Create or edit an itch.io project.
4. Set project kind to HTML.
5. Upload the ZIP.
6. Enable "This file will be played in the browser."
7. Test the embedded game frame and fullscreen/landscape behavior.

Do not zip the parent workspace or source files.

## Production Dev-Tool Safety

- The level tuning overlay is gated by `import.meta.env.DEV` or test mode.
- Dev query routes are gated the same way.
- The level-override write middleware is a Vite `serve` plugin only and is not active in production builds or preview.
- Pressing F1 in production preview should not open the debug editor.

Final asset passes must not depend on `dev-level-overrides/` or the local Vite write middleware. GitHub Pages cannot write tuned geometry files at runtime.

## Cache And Versioning

Vite fingerprints built JavaScript and CSS files. After a deployment, refresh with cache disabled if a browser appears to load an older build. Player save data is stored in `localStorage` and is scoped per domain/origin, so localhost progress will not carry to the live share URL.

## Troubleshooting

- Blank page after deploy: check `VITE_BASE_PATH`.
- Asset 404s: check the base path and that `dist/` contents were uploaded, not an empty parent folder.
- Game frame too small or large: inspect the host embed/container CSS, especially on itch.io.
- Audio is silent: WebAudio unlocks only after user gesture and respects the Mute setting.
- Progress is missing on live URL: expected if the origin changed.
- Large first load after art pass: inspect `dist/` size, compress large images, and defer level-specific assets.
