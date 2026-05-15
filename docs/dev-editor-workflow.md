# Dev Level Editor Workflow

This guide covers the current F1 dev editor after Dev-2 through Dev-7. The editor is an override-authoring tool for level polish. It writes JSON files under `dev-level-overrides/` through the Vite dev server and does not edit `src/game/platformer/levelGeometry.ts` directly.

Use the editor to try layout fixes quickly, then later bake keeper changes into canonical geometry manually or with a separate Codex-assisted pass.

## Open The Editor

1. Start the dev server with `npm run dev`.
2. Open a platformer dev route, for example:
   - `?scene=platformer&chapter=1`
   - `?scene=platformer&chapter=5`
   - `?scene=platformer&level=1`
3. Press `F1`.
4. Confirm the `DEV LEVEL EDITOR` panel appears.

The editor is gated to dev/test mode. Production preview should not open it, and the write endpoint should not exist in production preview.

## Recommended Level Polish Loop

1. Open the target chapter or retained level route.
2. Press `F1`.
3. Turn on `Markers` if you want validation issue outlines in the scene.
4. Use `Validate Level` before editing to see the baseline.
5. Add or adjust support platforms first.
6. Move clues, exits, and checkpoints onto safe support.
7. Tune moving/elevator platform endpoints and speed.
8. Run `Validate Level` again.
9. Check the override summary panel so modified/added/deleted objects match what you meant to change.
10. Export override JSON if you want a manual backup before a risky pass.
11. Use `Save All`.
12. Reload the same route.
13. Confirm the override survived reload.
14. Playtest the route normally.
15. Later, bake keeper override changes into canonical TypeScript geometry in a separate pass.

## Core Tools

- `Add Platform` creates a static platform near the pointer or camera center.
- `Add Moving Platform` creates a horizontal moving platform near the pointer or camera center.
- `Add Elevator` creates a vertical moving platform near the pointer or camera center.
- `Undo` / `Redo` restore session editor snapshots. They do not write to disk until `Save All`.
- `Duplicate` duplicates the selected static or moving/elevator platform.
- `Delete Object` hides a selected static platform through `deletedObjectIds`, removes an added static platform, or removes an added moving/elevator platform.
- `Revert Unsaved` returns the selected object to the last saved override state, or to base if no saved override exists.
- `Revert Override` removes the selected object's override and returns base objects to canonical geometry. For added platforms, it behaves like removing that added override.
- `Save All` writes current dirty override data to `dev-level-overrides/level-N.json`.
- `Snap` toggles 32px snap for new platforms, duplicate offsets, nudging, resize, inspector apply, moving endpoints, and checkpoint respawn edits.
- `Validate Level` scans the current override-applied geometry.
- `Auto Validate` refreshes validation after editor mutations.
- `Markers` toggles validation outlines in the scene.
- `Reset Level Overrides` clears all current-level modified/added/deleted override state after confirmation. It is undoable before saving.
- `Export Overrides` copies the current override JSON to the clipboard, or shows a copyable fallback panel.
- `Import Overrides` accepts override JSON only, validates it, previews counts, asks for confirmation, and keeps imported data unsaved until `Save All`.

The override summary panel lists Modified Objects, Added Objects, and Deleted Objects. Visible modified/added objects can be selected from the panel. Deleted base static platforms can be restored from the summary because they are hidden in the scene.

## Shortcuts

- `F1`: toggle editor overlay.
- `Ctrl/Cmd+Z`: undo the last session editor action.
- `Ctrl/Cmd+Shift+Z` / `Ctrl/Cmd+Y`: redo.
- `G`: toggle 32px grid.
- `H`: toggle object bounds.
- `P`: toggle object labels.
- `X`: toggle snap-to-grid.
- `A`: add static platform.
- `Ctrl/Cmd+D`: duplicate selected static platform.
- `Delete` / `Backspace`: delete selected static platform through override.
- `S`: save selected object override.
- `Shift+S`: save all dirty overrides.
- `Shift+D`: revert selected override.
- `Arrow keys`: nudge selected object by 1px.
- `Shift+Arrow`: nudge by 10px.
- `Alt+Arrow`: nudge by 32px.
- `Ctrl/Cmd+Arrow`: resize selected resizable object by 1px.
- `Ctrl/Cmd+Shift+Arrow`: resize by 10px.
- `Ctrl/Cmd+Alt+Arrow`: resize by 32px.
- `C`: copy player position.
- `Shift+C`: copy pointer world position.
- `J`: copy selected object JSON.
- `T`: copy selected object TypeScript snippet.
- `E`: export current debug geometry text.
- `R`: restart route.
- `Shift+R`: restart at current player position.

Inspector inputs suppress editor shortcuts while focused. Typing in x/y/width/height/path/respawn fields should not move, delete, duplicate, save, or snap the selected object.

## Static Platform Workflow

1. Click `Add Platform` or press `A`.
2. Select the new platform.
3. Move it with arrow keys or edit `x`/`y` in the inspector.
4. Resize it with `Ctrl/Cmd+Arrow` or edit `width`/`height`.
5. Use `Duplicate` for repeated ledges.
6. Use `Delete Object` to remove unwanted added platforms or hide base static platforms.
7. Run validation.
8. Save and reload.

Static platforms can be added, duplicated, and deleted. Moving/elevator platforms can be added and duplicated; only added moving/elevator platforms can be deleted from the editor. Base moving platform deletion remains deferred for safety.

## Property Inspector Workflow

Select an object to inspect:

- ID, type, kind, source, and status.
- x/y for supported visible objects.
- width/height for resizable objects.
- label for static platforms where safe.
- moving platform axis/speed/path fields.
- checkpoint respawn fields.
- clue/exit support and read-only identity/target fields.

Use `Apply` after numeric edits. Invalid numbers, invalid dimensions, invalid moving paths, outside-world blocking errors, and unsafe checkpoint respawn errors are rejected before save.

## Moving And Elevator Platform Workflow

1. Open a route with moving/elevator platforms, such as Chapter 5 or Chapter 6.
2. Click `Add Moving Platform` for a horizontal mover, or `Add Elevator` for a vertical lift.
3. The new platform appears immediately, is selected, and shows path handles.
4. Edit `axis`, `speed`, and active path endpoints in the inspector.
5. Drag the green/red endpoint handles for visual tuning.
6. Use snap when aligning elevators to ledges.
7. Use `Duplicate` or `Ctrl/Cmd+D` to copy selected moving/elevator platforms.
8. Delete added moving/elevator platforms with `Delete Object`; base moving platform deletion remains deferred.
9. Run validation to catch invalid axis, non-positive speed, zero-length paths, outside-world endpoints, too-fast movers, or narrow mobile-risky platforms.
10. Save and reload.

## Checkpoint Workflow

1. Select a checkpoint.
2. Keep `linkedRespawn` on when moving the checkpoint and respawn together.
3. Turn `linkedRespawn` off to edit the respawn point independently.
4. Drag the respawn marker or edit `respawnX` / `respawnY`.
5. Validate trigger support and respawn support.
6. Save and reload.

Checkpoint order/index is read-only.

## Clue, Interactable, Exit Workflow

Clues/interactables and exits can be moved and resized where supported. Their identity, required/progression role, and exit target route stay read-only.

Use validation to confirm:

- clues/interactables have a safe platform beneath or adjacent
- exits/doors have support
- objects remain inside world bounds
- required objects are not left floating after support-platform edits

## Validation

Validation colors:

- Red: error
- Yellow: warning
- Blue/gray: info

The validator checks missing/duplicate ids, invalid dimensions, world bounds, unsupported clues/interactables, unsupported exits/doors, unsafe checkpoints/respawns, invalid moving paths, mobile moving-platform comfort warnings, stale deleted override ids, and lightweight required-object expectations.

Validation is a generous design heuristic, not a proof that the route is beatable. It does not do full pathfinding, jump reachability, or timing analysis. Warnings should guide level polish but do not block normal dev saves; hard schema problems are still rejected by the inspector/save path.

## Save And Override Files

The v2 override format stores:

- `modifiedObjects`: existing object coordinate/size/path/respawn changes
- `addedObjects`: editor-authored static platforms and moving/elevator platforms
- `deletedObjectIds`: hidden source static platform ids

Older override files with an `objects` map still load as modified objects.

Override files are authoring artifacts. Review them before sharing builds, and bake keeper changes later if you want canonical geometry to carry them.

For bake policy, use `docs/dev-editor-bake-plan.md`. The current recommendation is manual Codex-assisted baking for small reviewed changes, with future report-only tooling to validate stale IDs, support warnings, and proposed canonical edits. Keep override JSON intact until baked geometry has passed tests and manual validation.

## Undo, Reset, Export, And Import

Undo/redo records lightweight session snapshots of the current override JSON, selected object id, deleted ids, and dirty ids. It covers core editor mutations such as add, duplicate, delete, move, resize, inspector Apply, revert, reset, import, moving endpoint edits, and checkpoint respawn marker edits. Saving writes the current override state; undoing after a save marks objects dirty again if the in-memory override differs from the last saved file.

`Reset Level Overrides` clears only the active level/chapter override state. It does not delete canonical geometry, player progress, or other level override files. Use `Save All` to persist the reset.

`Export Overrides` exports JSON only. It is meant for backup, review, or handoff, not for source-code baking.

`Import Overrides` accepts JSON only. It rejects invalid JSON and invalid override shapes, warns on level-id mismatches, and applies the imported data to the current level in memory only after confirmation. Imported data stays dirty until `Save All`.

## Production Safety

- The editor appears only in dev/test mode.
- Production preview should not respond to `F1`.
- Production preview should not expose `/__dev/level-overrides/:levelId`.
- Production builds should not include dev editor UI strings or endpoint strings.
- The editor does not touch player localStorage save/progression.

## Known Limitations

- Base moving platform deletion is deferred.
- Checkpoint, clue, and exit creation/deletion is deferred.
- Exit target routes and clue identities are read-only.
- Import uses a simple paste prompt rather than a full multi-line import panel.
- Validation is heuristic and does not prove reachability.
- Saved overrides are not automatically baked into `levelGeometry.ts`.

## Current Recommendation

Use the current editor for level polish and keep exported JSON backups before larger tuning sessions. The next tooling decision is whether to plan a safe bake workflow for reviewed override JSON or pause tooling and use the current editor for final level polish.
