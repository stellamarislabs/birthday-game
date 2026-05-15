# Codex Guidance

## Project Summary

`Maria and the Case of the Missing Heart` (`Sprawa Zaginionego Serca`) is a meaningful birthday gift browser game for Maria. The active player-facing game is now a short 6-chapter romantic legal mystery with platformer chapters and puzzle interludes across Warsaw.

Target final length: 10-15 minutes.

Old 10-level content may remain as legacy/dev-only source material during the bridge. Do not treat the current project as a 10-level player-facing game.

## Stack

- Phaser 3
- TypeScript
- Vite
- Vitest
- Playwright smoke tests where practical
- localStorage for save/progression
- HTML/CSS overlays for menus, rotate prompt, credits, and UI

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run test:all
```

## Folder Map

- `src/game/scenes/` - Phaser scenes.
- `src/game/systems/` - pure game systems such as save and flow.
- `src/content/` - story, chapter, level, VN, and puzzle data.
- `src/types/` - shared contracts.
- `src/tests/` - unit tests.
- `tests/e2e/` - Playwright smoke tests.
- `docs/` - durable project documentation.
- `public/assets/` - asset folders and pipeline notes.
- `.agents/skills/` - repo-scoped Codex workflows.

## Source-Of-Truth Docs

Always read these before major edits:

- `docs/story-bible.md`
- `docs/final-scope-and-pacing-plan.md`
- `docs/level-plan.md`
- `docs/technical-architecture.md`
- `docs/content-style-guide.md`
- `docs/qa-checklist.md`

Also read `docs/content-style-guide.md` before story, dialogue, UI copy, final-verdict, or Maria-related content changes.

## Current Product Rules

- Active title: `Maria and the Case of the Missing Heart`.
- Active subtitle: `Sprawa Zaginionego Serca`.
- Active structure: 6 chapters.
- Target length: 10-15 minutes.
- Use `Chapter`, `Clue`, `Evidence`, `Case Archive`, `Case file`, `Verdict`, `Trust`, and `Given`.
- Avoid player-facing exhibit/museum wording, old title language, old Polish subtitle language, and `M/10` progress markers.
- The final twist remains that the heart was freely given, but do not spoil the approved verdict early.
- The approved final verdict text must not change.
- Active platformer geometry has been baked into canonical `src/game/platformer/levelGeometry.ts`; active root dev overrides are archived.
- Remaining root dev override files, if any, are legacy/dev-only unless explicitly handled in a future pass.
- Legacy package/save-key names may still contain old internal naming. Do not change them without a tested migration.

## Coding Standards

- Keep Phaser scenes thin.
- Keep story and level text in `src/content/`, not hardcoded in scene classes where practical.
- Keep deterministic logic outside Phaser where possible.
- Prefer small, reusable mechanics over one-off systems.
- Preserve the fixed internal resolution and responsive scaling.
- Keep changes scoped to the prompt.

## Testing Expectations

- Update tests when changing logic or player-facing content.
- Run `npm run typecheck`, `npm run test`, and `npm run build` when possible.
- Run `npm run test:e2e` when Playwright browsers are available and the change affects boot, layout, or scene flow.
- Report failed commands honestly.

## Do-Not Rules

- Do not add new chapters unless explicitly asked.
- Do not add external assets unless explicitly asked.
- Do not hardcode story text inside scene classes when a content file is appropriate.
- Do not create one-off mechanics for every chapter.
- Do not make the game frustrating or precision-heavy.
- Do not change `saveVersion` or save keys without an explicit migration plan.
- Do not alter the approved final verdict text.
- Do not add copyrighted music, ripped sprites, trademarked characters, or unclear assets.
- Do not add Maria's private photos/messages/audio to a public repo unless intentionally approved.

## Emotional Tone Rules

- Preserve the emotional tone.
- Maria is capable, respected, warm, funny, disciplined, observant, brave, and heroic.
- Legal language should be elegant and playful, not dry.
- Romance should be earned, concise, and mystery-forward.

## Mobile And Landscape Constraints

- Preserve mobile browser playability.
- Use landscape-first layout.
- Keep touch targets large.
- Avoid precision-heavy platforming.
- Keep puzzle tap fallback reliable.
- Keep player-facing screens full-screen with no page/body scrolling.

## Save Compatibility Rules

- Preserve `saveVersion`.
- Preserve the existing save key unless a migration is explicitly requested and tested.
- Keep corrupted localStorage and missing localStorage safe.
- Add tests for save/progression changes.

## Asset And License Rules

- Do not generate or add final images unless explicitly asked.
- Update `CREDITS.md` for any asset/library/license changes.
- Track source links and license names for third-party art, fonts, music, and sounds.
- Prefer clearly permissive or CC0 assets unless the user explicitly chooses otherwise.
- Avoid baked text in generated images; render text in code whenever possible.

## Changelog

Update `CHANGELOG.md` for every meaningful change.
