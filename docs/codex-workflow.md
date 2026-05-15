# Codex Workflow

- Keep future prompts small and scoped.
- Every major task should read `AGENTS.md` plus relevant docs first.
- Ask for an implementation plan before broad changes.
- Update tests when changing logic.
- Update `CHANGELOG.md` for meaningful changes.
- Update `CREDITS.md` for assets or third-party materials.
- Run typecheck, tests, and build when possible.
- Summarize changed files, commands, failures, risks, and the next step.
- Do not implement unrelated features.
- Development-only smoke routes such as `?scene=puzzle&level=1` through `?scene=puzzle&level=10`, `?scene=platformer&level=1` through `?scene=platformer&level=10`, `?scene=final-verdict`, `?scene=level-select`, `?completeLevel=1` through `?completeLevel=10`, and `?gameCompleted=true` may be used to keep e2e tests stable; do not use them to expose private content beyond the approved verdict text or unfinished gameplay in production.
- Platformer dev routes can include `checkpoint=2` or `spawn=x:1450,y:260`. Use F1 in a dev platformer scene to open the level tuning overlay for grid, bounds, labels, selection, nudging, and coordinate/snippet copy helpers.
- Browser code cannot write source files. Use the Part 19.6 dev override workflow instead: nudge or resize objects in the F1 overlay, press S or Shift+S, reload to verify, then either keep `dev-level-overrides/level-N.json` for local tuning or manually copy final coordinates and dimensions into `src/game/platformer/levelGeometry.ts`.
- For release work, build with `npm run build`, smoke the static output with `npm run preview`, and follow `docs/deployment-guide.md` plus `docs/final-release-checklist.md`. Set `VITE_BASE_PATH` only when the deployment target needs a root or repository subpath.

## Recommended Working Pattern

1. Read the source-of-truth docs.
2. Identify the smallest useful change.
3. Implement behind existing architecture.
4. Add or update focused tests.
5. Run verification commands.
6. Update docs, changelog, and credits when needed.
7. Report honestly, including failed commands.
