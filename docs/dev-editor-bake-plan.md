# Dev Editor Bake Plan

Dev editor overrides are authoring artifacts. Baking means converting reviewed override JSON into canonical `src/game/platformer/levelGeometry.ts` so the final game no longer depends on local dev override files for accepted level changes.

This plan is intentionally conservative. Do not bake automatically, and do not let the browser editor write TypeScript geometry. The safest current policy is hybrid: use validation/report tooling to summarize proposed changes, then apply small reviewed bakes manually or Codex-assisted.

## Executive Summary

- Current recommendation: hybrid long-term, manual Codex-assisted first.
- Current local override files are legacy-format tuning files, not automatically bake-ready.
- No current override file includes `addedObjects` or `deletedObjectIds`.
- Stale IDs and retained legacy/dev levels are the main bake risks.
- A future bake helper should first be report-only: validate overrides, detect stale IDs, summarize proposed canonical edits, and avoid writing TypeScript.

## Override Inventory

| Path | Level | Active status | Format | Modified | Added | Deleted | Types affected | Bake recommendation | Risks |
| --- | ---: | --- | --- | ---: | ---: | ---: | --- | --- | --- |
| `dev-level-overrides/level-1.json` | 1 | Active Chapter 1 platformer | Legacy `objects` | 2 | 0 | 0 | `platform` | Do not auto-bake. Review manually first. | `exit-desk` is stale/missing from current geometry; `ch1_route_marker_01` conflicts with rebuilt canonical position. Likely pre-rebuild tuning. |
| `dev-level-overrides/level-3.json` | 3 | Retained legacy/dev route, not active six-chapter platformer route | Legacy `objects` | 1 | 0 | 0 | `checkpoint` | Do not bake into active flow. Only bake if intentionally maintaining old Level 3. | Checkpoint position override lacks respawn fields, so baking trigger-only movement could desync respawn safety. |
| `dev-level-overrides/level-8.json` | 8 | Retained legacy/dev route, not active Chapter 5 platformer | Legacy `objects` | 8 | 0 | 0 | `platform`, `moving-platform`, `exit`, `argument-fragment` | Do not bake unless deliberately polishing retained old Level 8. | Several canonical values differ from override; includes moving platform tuning and an exit no-op. Could regress current retained geometry or mobile comfort. |

Current meaningful bake candidates: none without further manual review and playtest approval.

## Current Override Schema

The editor currently accepts both old and v2 override shapes.

Old-compatible shape:

```json
{
  "levelId": 1,
  "objects": {
    "object_id": {
      "id": "object_id",
      "type": "platform",
      "x": 100,
      "y": 200,
      "width": 160,
      "height": 32
    }
  }
}
```

Current v2 authoring shape:

```json
{
  "version": 2,
  "levelId": 1,
  "chapterId": 1,
  "chapterTitle": "The Sealed Envelope",
  "modifiedObjects": {},
  "addedObjects": [],
  "deletedObjectIds": []
}
```

Bake order should mirror runtime override application:

1. Clone canonical geometry mentally or in tooling.
2. Remove approved deleted base objects.
3. Apply approved modified object fields.
4. Insert approved added objects.
5. Validate IDs, dimensions, bounds, support, movement paths, checkpoints, and exits.
6. Run tests and manual smoke checks.

## Bake Policy

Use manual Codex-assisted baking for small reviewed override sets. Use script-assisted reporting when overrides become numerous or hard to review.

Do not use a direct TypeScript rewrite script yet. The geometry file is authored data with meaningful ordering, comments, and chapter structure; an automated writer could cause noisy diffs or subtle placement mistakes.

Recommended policy:

- Bake only after a timed/manual or editor playtest confirms the override is intentional.
- Bake one level or chapter at a time.
- Keep override JSON intact until the canonical bake has passed tests and manual validation.
- Treat retained old route levels separately from active six-chapter platformer routes.
- Never bake stale IDs silently.
- Never bake validation errors.
- Review validation warnings manually before baking.

## What Is Safe To Bake

Safe after validation:

- Static platform `x`, `y`, `width`, `height`, `label`, and `kind` edits.
- Added static platforms with unique IDs and valid dimensions.
- Moving/elevator platform `x`, `y`, `width`, `height`, `axis`, `fromX`, `toX`, `fromY`, `toY`, and `speed` edits.
- Checkpoint `x`, `y`, `width`, `height`, `respawnX`, and `respawnY` edits.
- Clue/interactable `x`, `y`, `width`, and `height` edits where identity and progression role are unchanged.
- Exit/door `x`, `y`, `width`, and `height` edits where target route is unchanged.

Require extra review:

- Deleting base platforms.
- Deleting any platform that may support a required clue, exit, checkpoint, or moving platform landing.
- Moving exits.
- Moving required clues/interactables.
- Moving checkpoints far from their original route beat.
- Moving platform path or speed changes.
- Any override with validation warnings.
- Any override for retained legacy/dev-only routes.

Do not bake:

- Invalid objects.
- Unknown object types.
- Stale IDs that no longer exist in canonical geometry.
- Duplicate IDs.
- Unsupported required interactables.
- Unsupported exits.
- Unsafe checkpoint triggers or respawns.
- Out-of-bounds required objects.
- Experimental local changes not intended for release.
- Save/progression or puzzle-route changes hidden inside geometry fields.

## Applying Modified Objects

For each modified object:

1. Locate the canonical object by ID in `src/game/platformer/levelGeometry.ts`.
2. Confirm the object type matches the override type.
3. Apply only supported fields for that object category.
4. Preserve object order and unrelated fields.
5. Preserve comments and surrounding route structure when possible.
6. If the ID is missing, mark the override stale and do not bake it.

Field-specific notes:

- Static platforms: apply rectangle fields and safe labels/kinds.
- Moving platforms: apply rectangle fields, axis, endpoints, and speed together.
- Checkpoints: apply trigger and respawn values together when available.
- Clues/interactables: apply position/size only; keep clue identity and required/progression fields unchanged.
- Exits: apply position/size only; keep target scene/chapter/puzzle unchanged.

## Applying Added Objects

Added static platforms should be inserted into the canonical `platforms` collection for the correct level.

Rules:

- Preserve generated chapter-prefixed IDs.
- Avoid duplicate IDs across all geometry categories.
- Place objects near related route objects in source order when practical.
- Preserve `label` and `kind` if supported.
- Keep added object dimensions and coordinates snapped or intentionally precise.
- Do not bake unsupported added object types.

If future editors add non-static objects, those object types need explicit bake rules before use.

## Applying Deleted Objects

Preferred policy:

- If a deleted object is a clearly intentional static platform removal, remove it from canonical geometry after validation.
- If deletion affects a moving platform, checkpoint, clue, exit, trigger, door, or required support platform, require explicit review before baking.
- If intent is uncertain, keep the deletion override unbaked or archive it for later review.

Do not delete required clues, exits, checkpoints, or puzzle transition objects unless the user explicitly confirms the design change.

## Moving And Elevator Platform Edits

Before baking moving/elevator edits:

- Axis must be valid.
- Speed must be positive and mobile-safe.
- Path length must be meaningful, not zero-length.
- Start/end endpoints must stay within world bounds or have a clearly intended reason.
- Landing/support areas should exist near both ends.
- Vertical lifts should not create long fall punishment without nearby checkpoints.

Apply axis and endpoints as a coherent set. Avoid partially baking speed without path, or path without speed, unless the override clearly changes only one field.

## Checkpoint Respawn Edits

Checkpoint bakes must protect respawn safety.

Rules:

- Apply trigger `x/y/width/height` and `respawnX/respawnY` together when present.
- If an override moves the trigger but lacks respawn fields, review before baking.
- Respawn point must be inside world bounds.
- Respawn point must have support beneath or adjacent.
- Respawn must not place the player on unstable moving geometry unless deliberately designed and tested.

## Clue And Exit Edits

Clue/interactable and exit bakes are high-impact because they affect progression.

Rules:

- Keep clue identity, required flags, story role, and target scene read-only.
- Keep exit target route unchanged.
- Validate support beneath or adjacent.
- Validate objects are not hidden behind expected touch controls.
- Confirm the route can still be completed after the bake.

## Validation Before Bake

Before any bake:

- Override schema validates.
- No stale IDs in the intended bake set.
- No duplicate IDs.
- No missing IDs.
- No invalid or non-positive dimensions.
- No invalid moving platform axis, speed, or path.
- No unsupported required clues/interactables.
- No unsupported exits.
- No unsafe checkpoint triggers or respawns.
- No out-of-bounds required objects.
- Active chapter geometry tests pass.
- Dev override tests pass.
- E2E route smoke passes if practical.
- Final verdict text remains unchanged.

Validation errors block baking. Validation warnings require manual review.

## Rollback Plan

Before baking:

1. Commit the current state or create a patch backup.
2. Copy the relevant override JSON files.
3. Record the intended bake summary: level, object IDs, field changes, added objects, deleted objects.

During baking:

1. Apply a small, reviewable diff to `levelGeometry.ts`.
2. Do not modify override files yet.
3. Run tests.

If anything fails:

1. Revert only the `levelGeometry.ts` bake diff.
2. Keep override JSON intact.
3. Record the failure reason before retrying.

After accepted bake:

1. Verify canonical geometry behaves correctly without relying on the baked overrides.
2. Archive or clear baked override files only in a separate cleanup pass.
3. Keep a copy of the accepted override JSON until release.

## Testing Plan After Bake

Run:

```bash
npm run typecheck
npm run test
npm run build
npm run test:e2e -- --workers=1 --reporter=line
npm run test:all
```

If `test:all` is unavailable or duplicates the same suite, report that honestly.

Specific checks:

- Active chapter routes load.
- Platformer exits route to the correct puzzles.
- Dev validation overlay reports no critical issues for baked levels.
- Baked changes remain present with override files disabled or cleared.
- Production build does not expose the dev editor or write endpoint.
- Final verdict text is unchanged.
- Save/progression schema and keys are unchanged.

## Script Recommendation

Do not implement a direct TypeScript rewrite tool yet.

Recommended future first script:

- Reads override JSON.
- Validates schema.
- Applies overrides to an in-memory geometry copy.
- Reports stale IDs, duplicate IDs, invalid objects, support warnings, and route risks.
- Prints a human-readable bake summary.
- Optionally generates a proposed patch plan, not a written TypeScript file.

Only consider AST-based TypeScript rewriting after several reviewed bakes prove the required transformations are stable.

## Future Phases

- Dev-8B: report-only override bake validator.
- Dev-8C: manual Codex-assisted bake of one reviewed active chapter.
- Dev-8D: archive or clear accepted override files after canonical verification.
- Dev-8E: optional AST-assisted patch generator for repeated safe field edits.
