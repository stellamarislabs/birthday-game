# Asset Replacement Plan

Part 37 documents what should replace current placeholders later. No final assets are added in this part.

## Replacement Table

| Category | Current placeholder | Target final asset | Priority | Can remain procedural? | Format | Size target | Source plan | Risk |
|---|---|---|---|---|---|---|---|---|
| Shared UI | CSS/Phaser panels and borders | Refined case-file frames, button treatments, small seals | High | Partly | SVG/PNG/CSS | 10-150 KB total | Self-created/procedural | Overdecorating UI |
| Title | Phaser rectangles and DOM menu | Title treatment plus subtle case-file/Warsaw background | High | No | WebP/SVG | 300-700 KB background, small SVG title | Self-created or custom | First load weight |
| Case file | Procedural paper panel | Light paper texture and official-looking case seal | Medium | Partly | WebP/PNG/SVG | 100-300 KB | Self-created/procedural | Text readability |
| Maria/player | Rose rectangle | Small Maria sprite with simple idle/run/jump frames | High | No | PNG/WebP sprite sheet | 250-800 KB | Custom/self-created | Animation scope creep |
| Platform tiles | Rectangles by level theme | Small level-family tiles and platform skins | High | Partly | PNG/WebP | 150-500 KB per family | Custom/procedural | Collision readability |
| Clue bundle icons | Generic procedural clue silhouettes | Six chapter clue bundles plus small individual clue icons where useful | High | Partly | SVG/PNG/WebP | 10-80 KB each | Self-created/custom | Inconsistent icon style |
| Checkpoints | Procedural outlined rectangles | Warm checkpoint seal/marker | Medium | Yes | SVG/PNG/CSS | 10-50 KB | Self-created/procedural | Must remain obvious |
| Case doors/exits | Procedural portal rectangles | Case door/court threshold motif | Medium | Partly | SVG/PNG | 50-150 KB | Self-created/custom | Blocking readability |
| VN portraits | CSS monograms/seals | Optional final portrait set if approved | Medium | Yes for now | WebP/PNG | 100-300 KB each | Custom/approved only | Privacy and likeness consent |
| VN backgrounds | CSS gradients/variants | 6 illustrated chapter backdrops | High | Partly | WebP | 300-700 KB each | Custom/AI-generated with checked rights | Total asset weight/style mismatch |
| Puzzle boards | CSS/DOM board frames | Polished board frames and tool tokens | High | Partly | SVG/PNG/CSS | 50-250 KB per puzzle family | Self-created/procedural | Clutter on mobile |
| Puzzle pieces | CSS procedural fragments | Cleaner draggable pieces/tokens/icons | High | Partly | SVG/PNG/CSS | 10-80 KB each or sheeted | Self-created/procedural | Tiny touch targets |
| Evidence reveal | Procedural text panel | Clue filed stamp and small clue display | High | Partly | SVG/PNG | 50-200 KB | Self-created/custom | Repeating reveal copy |
| Final verdict | Text panel | Final court seal supporting the verdict | High | Partly | SVG/PNG/WebP | 100-400 KB | Self-created/custom | Must not compete with verdict |
| Credits | Text-only DOM panel | Small final credits seal/background | Low | Yes | SVG/CSS | 10-100 KB | Self-created/procedural | Unnecessary polish |
| Audio SFX | Procedural WebAudio | Optional tiny compressed sound effects | Low | Yes | OGG/MP3/WebM | 50-150 KB each | Self-created/CC0 | License and autoplay assumptions |
| Music | None | Optional short loop or ending cue | Low | Yes | OGG/MP3/WebM | 2-4 MB each | Commissioned/licensed | License, size, emotional overreach |

## High Priority Replacement Order

1. Opening/main menu office desk background.
2. Menu frame/UI ornament if needed, preferably CSS/SVG/procedural first.
3. Chapter 1 VN background: law office desk / envelope.
4. Chapter 2 VN/platformer background motif: tram route / hidden wall.
5. Chapter 5 and Chapter 6 backgrounds because they define late-game mood.
6. Final court / final verdict background.
7. Puzzle board backgrounds or ornaments.
8. Clue icon bundle.
9. Additional platformer decorative backgrounds.
10. Credits background if needed.

## Medium Priority Replacement Order

1. Platformer level-family tiles and decorative motifs.
2. Case doors and checkpoints.
3. Case Archive chapter-card polish.
4. Settings and UI icons.
5. Evidence reveal stamp.

## Low Priority Replacement Order

1. Credits visuals.
2. Extra decorative props.
3. Advanced transitions.
4. External audio or music.

## Current Placeholder Inventory

- `public/assets/final/opening/` now contains the seven approved opening cinematic WebP frames integrated in Part 49A-R2.
- Platformers use Phaser rectangles, labels, and simple procedural motifs.
- Puzzles use DOM/CSS boards, pieces, stamps, tokens, and pointer drag ghosts.
- VN uses DOM/CSS panels, procedural portrait placeholders, and CSS background variants.
- Evidence reveal and final verdict use Phaser/DOM panels with text and simple borders.
- Audio is procedural WebAudio in code.

## Part 43 Visual Asset Prompt Plan

`docs/visual-asset-prompt-plan.md` is the source of truth for future image-generation prompts and asset batches. Part 43 updates it from the earlier six-chapter bridge plan to the final expanded six-chapter game without adding final assets.

Part 43 planning rules:

- Keep all player-facing text, title, subtitle, case number, clue labels, buttons, and verdict copy rendered by code.
- Generate no readable text, logos, or UI buttons inside background art.
- Prioritize the menu/office desk background, opening office beats, six chapter VN backgrounds, six puzzle board/frame sets, clue bundle icons, and final court support art.
- Give Chapter 5 and Chapter 6 extra art-direction attention because their expanded traversal now carries the restored late-game elevator/floating identity.
- Treat Maria as a back-view, side-view, or silhouette only until a later approved character-art and likeness pass.
- Optimize future backgrounds to WebP and keep individual large images around 300-700 KB where practical.
- Keep CSS/SVG/procedural UI frames and buttons unless a later asset pass deliberately approves reusable 9-slice raster frames.

## Part 48B First Asset Target

The first final raster asset should be the opening/main menu office desk background:

- Intended path: `public/assets/final/opening-main-menu-office-desk.webp`.
- Source: 1920x1080, 16:9.
- Format: optimized WebP after review.
- Size target: ideally 300-700 KB, with about 1 MB as the upper ceiling for a visibly important first-screen image.
- Purpose: establish the final visual style behind `OpeningStartScene` and/or the title menu while leaving clean center/right UI-safe space.
- Composition: warm Warsaw-inspired law office desk near a tall window at dawn, burgundy leather case file, cream sealed envelope, brass key, folded tram ticket, legal books, antique gold desk lamp, deep navy shadows, subtle rose accent, and soft amber light.
- Do not bake readable text, logos, menu buttons, or a menu frame into the image.
- Do not integrate the asset until a later one-asset integration pass can verify desktop and mobile landscape crop, preserve code-rendered UI, update credits, and rerun build/test/e2e checks.

## Part 49A-R2 Opening Cinematic Replacement

The active opening cinematic placeholder/procedural sequence has been replaced by seven approved final WebP frames:

- `public/assets/final/opening/Opening01.webp`
- `public/assets/final/opening/Opening02.webp`
- `public/assets/final/opening/Opening03.webp`
- `public/assets/final/opening/Opening04.webp`
- `public/assets/final/opening/Opening05.webp`
- `public/assets/final/opening/Opening06.webp`
- `public/assets/final/opening/Opening07.webp`

`OpeningCinematicScene` now treats these as a clean movie-style sequence with cover-scaled full-screen images, crossfades, reduced-motion-safe animation behavior, and a small Skip affordance. Part 49A-R3 restores the seven opening captions as code-rendered cinematic intertitle text over the images. VN-style panels, speaker/nameplate UI, character cards, title overlays, parchment dialogue boxes, and large controls should stay out of the opening cinematic unless a later pass explicitly changes direction.

Still pending later asset passes:

- Opening start / main menu background integration.
- Chapter VN backgrounds and any approved portrait strategy.
- Puzzle board/token art.
- Platformer object/background motifs.
- Final court/verdict supporting art.

## Part 49B Case File And First VN Image Replacement

Part 49B integrates the first designed case-file and VN images from `src/assets/final/`:

- `CaseFileFrame01.webp` now replaces the visible first Case File screen after the player chooses Open Case.
- `FirstNovel01.webp`, `FirstNovel02.webp`, and `FirstNovel03.webp` now replace the visible pages for `vn-chapter-1-intro`.

These assets already include their own ornate frame, title text, speaker nameplate, dialogue panel, dialogue text, and Continue label. The runtime therefore hides the old coded case-file paper, old VN dialogue card, speaker portrait/card, speaker nameplate, Skip button, Continue button, and duplicate visible text for these image-backed screens only. Accessibility/status text remains available through scene status and visually hidden metadata.

All other VN scenes still use the existing coded VN layout until their final image groups are approved and integrated in later passes. The opening cinematic, main menu background, platformer geometry, puzzles, final verdict, and save/progression behavior are unchanged.

## Part 49C Chapter 2 VN Image Replacement

Part 49C extends the same image-backed VN system to the next approved Chapter 2 image group:

- `SecondNovel01.webp`, `SecondNovel02.webp`, and `SecondNovel03.webp` replace the visible pages for `vn-chapter-2-intro`.
- `HiddenWallPuzzleNovel01.webp` replaces the visible page for `vn-chapter-2-before-puzzle`.

These are complete designed screenshots with baked title text, frame, speaker nameplate, conversation panel, dialogue text, and Continue label. Runtime UI therefore remains hidden for these mapped scenes: no old coded dialogue card, speaker portrait/card, nameplate, Skip button, Continue button, or duplicate visible text is layered over the art. The underlying VN metadata remains available for status/accessibility and flow tests.

Opening cinematic assets, the Case File frame, `FirstNovel01-03.webp`, the main menu, later VN scenes, platformer geometry, puzzles, final verdict, and save/progression behavior remain unchanged.

## Part 49D Chapter 3 And Chapter 4 Intro VN Image Replacement

Part 49D integrates the next two approved intro VN image groups:

- `ThirdNovel01.webp`, `ThirdNovel02.webp`, and `ThirdNovel03.webp` replace the visible pages for `vn-chapter-3-intro`.
- `ForthNovel01.webp`, `ForthNovel02.webp`, and `ForthNovel03.webp` replace the visible pages for `vn-chapter-4-intro`. The filename spelling is intentionally `ForthNovel` to match the committed assets.

These scenes use the same image-backed VN mode as Parts 49B and 49C. The old coded dialogue card, speaker portrait/card, nameplate, Skip button, Continue button, and duplicate visible text are hidden only for mapped image-backed scenes. Underlying VN metadata remains aligned with the designed screenshots for accessibility/status text and flow tests.

Opening cinematic assets, the Case File frame, First/Second Novel assets, the Hidden Wall pre-puzzle image, the main menu, later VN scenes, platformer geometry, puzzles, final verdict, and save/progression behavior remain unchanged.

## Part 49E Chapter 4 Pre-Puzzle And Chapter 5 Intro VN Image Replacement

Part 49E integrates the next approved VN image-backed scenes:

- `MarginalNotePuzzleNovel01.webp` replaces the visible page for `vn-chapter-4-before-puzzle`.
- `FifthNovel01.webp`, `FifthNovel02.webp`, and `FifthNovel03.webp` replace the visible pages for `vn-chapter-5-intro`.

These scenes continue to use the shared image-backed VN mode. The old coded dialogue card, speaker portrait/card, nameplate, Skip button, Continue button, and duplicate visible text are hidden only for mapped image-backed scenes. Underlying VN metadata remains aligned with the designed screenshots for accessibility/status text and flow tests.

Opening cinematic assets, the Case File frame, earlier First/Second/Third/Forth VN image groups, the Hidden Wall pre-puzzle image, the main menu, later VN scenes, platformer geometry, puzzles, final verdict, and save/progression behavior remain unchanged.

## Part 49F Chapter 6 Intro And Final Seal VN Image Replacement

Part 49F integrates the approved Chapter 6 image-backed VN scenes:

- `SixthNovel01.webp`, `SixthNovel02.webp`, and `SixthNovel03.webp` replace the visible pages for `vn-chapter-6-intro`.
- `TheFinalSealPuzzleNovel01.webp` replaces the visible page for `vn-chapter-6-before-puzzle`.

These scenes continue to use the shared image-backed VN mode. The old coded dialogue card, speaker portrait/card, nameplate, Skip button, Continue button, and duplicate visible text are hidden only for mapped image-backed scenes. Underlying VN metadata remains aligned with the designed screenshots for accessibility/status text and flow tests.

The Chapter 6 intro still routes to runtime Level 9 platformer, and the Final Seal pre-puzzle page still routes to the Final Seal puzzle at runtime Level 10. Opening cinematic assets, Case File frame, earlier VN image groups, main menu, platformer geometry, puzzle mechanics, final verdict text, and save/progression behavior remain unchanged.

## Part 50G Chapter 3 Deposition Order Puzzle Assets

The Chapter 3 Deposition Order / Witness Note puzzle now detects and displays:

- `src/assets/final/puzzles/puzzle03-deposition-bg.webp`
- `src/assets/final/puzzles/puzzle03-witness-note-paper.webp`
- `src/assets/final/puzzles/puzzle03-statement-strip-shell.webp`

These assets are decorative layers only. The statement short labels, statement text, slot labels, archive code, progress, buttons, drag/drop targets, and mobile tap placement remain code-rendered and mechanics-owned by the existing puzzle. Browser QA verified the witness-note paper sits behind the slot/drop-zone layer and the final background does not introduce document scroll in desktop or mobile landscape.

Part 50G-R2 keeps the same assets and mapping, but intentionally disables active rendering of `puzzle03-statement-strip-shell.webp` for the current final build. The strip shell remains available for future experiments, while the live puzzle uses cleaner CSS-rendered parchment strips with antique-gold borders, soft shadows, responsive text sizing, mobile-specific compact spacing, and stronger selected/drag/drop-hover states. A future regenerated warmer strip shell can be re-enabled only if it clearly improves on the CSS treatment.

## Part 50H Chapter 4 Case File Sorting Puzzle Assets

The Chapter 4 Case File Sorting / Archive Corrections puzzle is prepared for these optional final assets:

- `src/assets/final/puzzles/puzzle04-case-file-bg.webp`
- `src/assets/final/puzzles/puzzle04-archive-file-board.webp`
- `src/assets/final/puzzles/puzzle04-document-card-shell.webp`
- `src/assets/final/puzzles/puzzle04-silver-key.webp`

These assets are decorative layers only. The document ids, document titles, labels, roman numerals, slot labels, correction reveal, progress, buttons, drag/drop targets, mobile tap placement, and Silver Key gating remain code-rendered and mechanics-owned by the existing puzzle. The scene background can cover the puzzle panel, the archive board can sit behind the file slots, document shells can sit behind card text, and the Silver Key image can sit inside the existing key button without replacing the button target. If the future assets are missing, the puzzle safely falls back to the current CSS archive/file presentation.

Part 50I verifies the final Chapter 4 puzzle assets in game. The background and archive-board assets use `object-fit: cover`. Part 50I-R1 keeps the document card shell resolver/mapping available but bypasses active visual rendering because the generated shell read as a bright pasted card; the final presentation now uses CSS-rendered parchment document cards with code-rendered titles, labels, and roman numerals. The Silver Key image uses `contain` with multiply blending and light contrast/saturation tuning inside the existing key button. Because the source key artwork has a baked light square background, a transparent-background key export is still the preferred final replacement if more polish time is available.

## Part 50J Chapter 5 Trust Door Light Path Puzzle Assets

The Chapter 5 Trust Door Light Path puzzle is prepared for these optional final assets:

- `src/assets/final/puzzles/puzzle05-trust-light-bg.webp`
- `src/assets/final/puzzles/puzzle05-trust-board.webp`
- `src/assets/final/puzzles/puzzle05-lantern-source.webp`
- `src/assets/final/puzzles/puzzle05-trust-door-target.webp`

These assets are decorative layers only. The question ids, question text, correct-question rule, mirror ids, mirror rotation state, dynamic light path, progress, buttons, and completion routing remain code-rendered and mechanics-owned by the existing puzzle. The scene background can cover the puzzle panel, the trust board image can sit behind the grid cells/mirrors/endpoints/light beam, and the lantern/source and Trust-door/target images can sit inside their existing endpoint elements without replacing the endpoint targets. If the future files are missing, the puzzle safely falls back to the current CSS-rendered Trust Door Light Path presentation.

Part 50K verifies the final Chapter 5 puzzle assets in game. The background uses `cover`, the trust board uses `cover` with a darkened/saturated filter and overlay to preserve the live beam, and the lantern/source plus Trust-door/target images use `contain` inside the existing endpoint elements. A Chapter 5-specific mobile landscape grid-row override keeps the progress strip compact so the board, question tiles, payoff, Reset Light, and File Clue controls remain visible without page scroll.

## Part 50L Chapter 6 Final Seal Puzzle Assets

The Chapter 6 Final Seal / Court of the Heart puzzle is prepared for these optional final assets:

- `src/assets/final/puzzles/puzzle06-final-seal-bg.webp`
- `src/assets/final/puzzles/puzzle06-final-seal-board.webp`
- `src/assets/final/puzzles/puzzle06-final-seal-heart-core.webp`

These assets are decorative layers only. The three tap-rotated ring buttons, ring ids, aligned rotations, clue-light state, progress text, payoff, Reset Seal, Unlock Verdict, final puzzle completion, and routing to `FinalVerdictScene` remain code-rendered and mechanics-owned by the existing puzzle. The scene background can cover the puzzle panel, the final seal board can sit behind the rays/core/rings, and the heart-core image can sit inside the existing core element without replacing the code-rendered center label. If the future files are missing, the puzzle safely falls back to the current CSS-rendered Final Seal presentation.

Part 50M verifies the final Chapter 6 puzzle assets in game. The background uses `cover`, the final-seal board uses `cover` at reduced opacity with a dark/warm overlay so the live rings and rays remain legible, and the heart-core image uses `contain` inside the existing core element. The three rings remain CSS/button-driven, the six clue lights remain state-driven, and Unlock Verdict still routes to the unchanged `FinalVerdictScene`.

## Part 50O Full Visual Flow QA

Part 50O verifies the full visual flow from opening cinematic through final verdict. During the audit, `TheRightQuestionPuzzleNovel01.webp` was found present but not mapped to `vn-chapter-5-before-puzzle`; the scene now uses the shared image-backed VN mode and continues into Trust Door Light Path without showing the old coded VN panel or duplicate text. No platformer geometry, puzzle mechanics, save/progression behavior, routing logic, or final verdict text changed.

## Part 50R Evidence Reveal Image-Backed Readiness

Part 50R prepares post-puzzle Chapter 1-5 reveal screens for optional final image-backed replacement without adding images. Future files should live under `src/assets/final/reveals/`:

- `RevealChapter01.webp`
- `RevealChapter02.webp`
- `RevealChapter03.webp`
- `RevealChapter04.webp`
- `RevealChapter05.webp`

These reveal images should be designed as complete result/interstitial screens with baked result layout and continue affordance, then displayed with `object-fit: contain` on a dark backing so no important text is cropped. When a mapped file exists, `EvidenceRevealScene` suppresses the old Phaser parchment certificate, stamp, title/body text, next-clue panel, and burgundy button only for that mapped chapter. When a file is missing, the current Phaser-rendered reveal remains the fallback.

The two-step reveal behavior remains runtime-owned, not image-owned: first input files/completes the clue or chapter through the existing bridge/save path, and second input opens the Case Archive. Chapter 6 is intentionally excluded because the Final Seal routes directly to `FinalVerdictScene`.

## Part 50S Chapter 1 Reveal Style Anchor

`RevealChapter01.webp` is now present and verified as the Chapter 1 image-backed reveal style anchor. Chapter 1 uses the image-backed reveal path after Case Mosaic, while Chapters 2-5 continue to fall back to the Phaser-rendered reveal until their matching `RevealChapter02.webp` through `RevealChapter05.webp` files are added.

The image-backed reveal uses contained viewport scaling on a dark navy/black backing, suppresses the old Phaser reveal chrome for Chapter 1 only, and preserves the two-step runtime behavior: first input writes Chapter 1 completion, second input opens the Case Archive. Chapter 6 remains excluded and continues to use the Final Seal to FinalVerdictScene boundary.

## Part 50T Chapter 1-5 Reveal Image Verification

`RevealChapter01.webp` through `RevealChapter05.webp` are now present and verified for the Chapter 1-5 post-puzzle reveal screens. Each reveal uses the shared image-backed `EvidenceRevealScene` branch with contained viewport scaling, dark backing, and no old Phaser reveal chrome drawn over the designed screen.

The verified reveal labels are:

- Chapter 1: The Sealed Envelope / Follow the ticket
- Chapter 2: The Golden Stamp and The Red Brick / Go to the river
- Chapter 3: The Witness Note / Open the archive
- Chapter 4: The Marginal Note and The Silver Key / Take the key
- Chapter 5: The Silver Key, The Lantern, and The Blue Ribbon / Read the letter

The two-step runtime behavior remains unchanged for every mapped reveal: first input writes the existing chapter completion through the save bridge, and second input opens the Case Archive. Chapter 6 remains excluded and continues to route from Final Seal to `FinalVerdictScene`.

## Part 38 Procedural Placeholder Upgrades

The following placeholders were improved procedurally and can stay until final assets are approved:

- Shared UI panels, buttons, puzzle frames, and final verdict paper treatment now use CSS-only case-file detailing.
- Title, CaseFileScene, EvidenceRevealScene, FinalVerdictScene, and CreditsScene now have static Phaser decorative motifs and seal hints.
- Platformer clue pickups now have distinct procedural icon silhouettes for all 10 clues.
- Level backdrop motifs are clearer but remain simple static Phaser primitives.
- Puzzle boards received CSS-only board, tool, stamp, lens, archive, constellation, and seal polish.
- VN placeholders remain CSS/procedural with slightly stronger portrait and dialogue-card presentation.

Still needs final art later:

- Opening/menu office-desk background and optional title treatment.
- Maria/player sprite.
- Final six-chapter clue bundle icons, if procedural silhouettes are not enough.
- Final expanded six-chapter VN backgrounds and optional approved portrait strategy.
- Final six chapter puzzle token/frame art.
- Final court seal, if a bespoke asset is desired.

## Implementation Rules For Future Asset Passes

- Replace one visual category at a time.
- Keep procedural fallback visuals until the asset is proven in production preview.
- Add assets under the correct `public/assets/` subfolder.
- Use relative/Vite-safe URLs so GitHub Pages base paths work.
- Add source, license, and purpose to `CREDITS.md` before merging any third-party asset.
- Rebuild and inspect `dist/` size after each asset batch.
- Run mobile landscape smoke tests after each UI/puzzle asset batch.
- Do not add private photos, voice, messages, or Maria likeness assets without explicit approval and privacy review.
