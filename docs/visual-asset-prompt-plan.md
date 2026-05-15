# Visual Asset Prompt Plan

Part 43 updates the image-generation and final-asset planning source of truth for the final expanded six-chapter game. This document is planning only: it does not add, generate, or integrate image files.

## Purpose

Future visual asset work should use this document before generating or integrating final backgrounds, clue icons, puzzle boards, platformer motifs, final-court support art, or optional UI frame art.

The active player-facing game is now six expanded chapters:

1. The Sealed Envelope
2. The Hidden Wall
3. The River Witness
4. The Archive of Corrections
5. The Door of Trust
6. The Court of the Heart

The underlying story remains a connected clue trail, but final art should be planned as six chapter bundles instead of ten isolated old-level sets. The expanded route structure matters: Chapter 5 now needs courthouse, lantern, vertical/elevator, and blue-ribbon imagery; Chapter 6 now needs rooftops, prior-clue memory, floating ascent, final court, and heart-seal imagery.

All story text, UI labels, title text, case number, clue names, buttons, and final verdict copy should remain rendered by code unless a later part explicitly approves a controlled text-baked prop.

## Master Art Direction

Style target:

Elegant cinematic 2D storybook illustration, romantic legal mystery, warm Warsaw atmosphere, premium hidden-object/adventure-game mood, deep navy shadows, warm parchment, antique gold, burgundy leather, soft amber lights, subtle rose accents, refined legal and court motifs, emotionally warm but not cheesy.

Core visual pillars:

- Warsaw-inspired law office, tram route, rebuilt street, Vistula riverbank, archive, courthouse, lantern path, rooftops, and ceremonial final court.
- Deep midnight navy and blue-black shadows balanced with parchment, ivory, antique gold, brass, burgundy leather, soft silver, and restrained rose warmth.
- Legal/case-file motifs: sealed envelope, brass key, tram ticket, golden stamp, hidden wall, witness note, marginal correction, silver key, Trust door, lantern, blue ribbon, unfinished letter, court seal, scales, and heart.
- Maria is competent and respected. If she appears before character art is approved, use a side view, back view, or silhouette only.

Reusable master prompt fragment:

Elegant cinematic 2D storybook illustration, romantic legal mystery atmosphere, warm Warsaw light, deep navy shadows, antique gold accents, burgundy leather case-file details, parchment paper textures, soft amber glow, refined law office and court motifs, painterly but clean, premium visual novel background, no photorealism, no readable text.

Negative prompt / avoid list:

photorealistic, anime, childish cartoon, neon colors, cyberpunk, horror, cluttered, low resolution, text, watermark, logo, distorted hands, unreadable letters, harsh saturated colors, excessive fantasy magic, generic corporate UI, modern SaaS dashboard look, private photo likeness, UI buttons baked into background.

## Part 48B Final Asset Readiness

Part 48B begins the final asset-generation pipeline as planning only. Do not generate, add, or integrate image files in this pass. The active six-chapter geometry is canonical, active root dev overrides are archived, Part 48A has locked the final wording cleanup, and the remaining release risks are manual timed playthrough, real-device mobile landscape playthrough, placeholder visuals, and the known large bundle warning.

Platformer clean-UI gate: normal player-facing platformer scenes now hide persistent world labels, object ids, story helper names, checkpoint labels, and long control/settings text. Final platformer art prompts should assume a clean playfield with only gameplay objects, brief contextual feedback, and mobile touch controls visible; debug labels remain available through the dev/F1 overlay only.

Final art direction is locked as:

- Elegant cinematic 2D storybook illustration.
- Romantic legal mystery with warm Warsaw atmosphere.
- Premium hidden-object/adventure-game mood.
- Deep navy shadows, warm parchment, antique gold, burgundy leather, soft amber lights, and subtle rose accents.
- Refined legal and court motifs.
- Emotionally warm, but not cheesy.

Avoid:

- Photorealism, anime, childish cartoon, cyberpunk/neon, horror, or excessive fantasy magic.
- Text, logos, menu frames, UI buttons, or watermarks baked into images.
- Unreadable generated writing on props.
- Real-person likeness unless the user provides an approved reference and explicit usage approval.

Final asset pipeline:

1. Generate one image at a time.
2. Review composition, crop, style, text-safety, and UI-safe space.
3. Optimize the approved source to WebP.
4. Keep all title, button, case-file, verdict, and story text rendered by code.
5. Put accepted final assets under `public/assets/final/`.
6. Use descriptive filenames, starting with `opening-main-menu-office-desk.webp`.
7. Integrate one asset per Codex pass.
8. Run typecheck, unit tests, build, and e2e where practical after each integration pass.
9. Check bundle and asset size after each major batch.
10. Avoid preloading every large chapter background.

Browser/static-hosting budget for the first image:

- Source size: 1920x1080, 16:9.
- Final format: optimized WebP.
- Target optimized size: ideally 300-700 KB.
- Acceptable ceiling for a visually important first-screen background: about 1 MB, with a build-size review.
- Avoid 4K and large PNG backgrounds unless transparency is required.
- Keep Vite base-path safety by placing final assets under `public/assets/final/` and referencing them with deployment-safe paths in a later integration pass.

First final asset target:

- Asset name: Opening / main menu office desk background.
- Intended file name: `public/assets/final/opening-main-menu-office-desk.webp`.
- Usage: future background behind `OpeningStartScene` and/or the title menu, if composition and crop work for both.
- Purpose: establish the whole game's final visual style before individual chapter assets.
- Composition: warm Warsaw-inspired law office desk near a tall window at dawn; burgundy leather case file, cream sealed envelope, small brass key, folded tram ticket, legal books, antique gold desk lamp, deep navy shadows, subtle rose accent, and soft amber morning light.
- UI-safe area: clean center/right area for code-rendered title and Start/Open Case buttons.
- Maria presence: avoid detailed face or portrait until character style is locked.
- Must avoid: readable text, logos, menu frames, buttons, watermarks, and detailed real-person likeness.

First final image prompt:

Create a 16:9 cinematic 2D storybook illustration for the opening and main menu background of a romantic legal mystery browser game. The scene shows a warm Warsaw-inspired law office desk near a tall window at dawn, deep navy shadows, antique gold desk lamp, burgundy leather case file, cream sealed envelope, small brass key, folded tram ticket, legal books, subtle rose accent, soft amber morning light, elegant premium visual novel and hidden-object adventure atmosphere. Leave clean UI-safe space in the center/right area for code-rendered title text and Start/Open Case buttons. No readable text, no logos, no menu frame, no buttons, no photorealism, no anime, no childish cartoon, no cyberpunk, no horror, no watermark.

Negative prompt:

photorealistic, anime, childish cartoon, neon colors, cyberpunk, horror, cluttered, low resolution, readable text, watermark, logo, distorted hands, unreadable letters, harsh saturated colors, generic corporate UI, modern SaaS dashboard look, excessive fantasy magic, menu buttons, menu frame

Recommended output: 1920x1080 source, optimized to WebP after approval.

## Part 49A-R2 Opening Cinematic Integration

The first final image integration pass uses the approved seven-frame opening cinematic sequence:

- `public/assets/final/opening/Opening01.webp` - Warsaw wakes quietly.
- `public/assets/final/opening/Opening02.webp` - But some days arrive with a case.
- `public/assets/final/opening/Opening03.webp` - One envelope waits where ordinary papers should be.
- `public/assets/final/opening/Opening04.webp` - A key, a ticket, and a question.
- `public/assets/final/opening/Opening05.webp` - Maria begins the day.
- `public/assets/final/opening/Opening06.webp` - Maria takes her place at the desk.
- `public/assets/final/opening/Opening07.webp` - The case file opens.

These images are now the active `OpeningCinematicScene` visuals. The scene is movie-style and frame-led: VN panels, speaker boxes, character cards, title overlays, menu frames, and large Continue/Skip controls should not be drawn over the frames. Part 49A-R3 restores only the seven code-rendered cinematic captions over the images.

The opening sequence uses public asset URLs instead of importing large WebPs into TypeScript, so Vite/GitHub Pages base-path behavior remains explicit. Crossfades and a subtle slow drift are allowed; reduced-motion mode disables the drift and keeps the transition simple. The main menu background and chapter VN images are not integrated yet.

## Part 49A-R3 Opening Cinematic Caption Overlay

Part 49A-R3 restores the same seven beat captions as visible code-rendered cinematic text over the final images. These captions should feel like movie intertitles, not visual novel UI:

- Use the existing caption text from `src/content/openingCinematic.ts`.
- Render captions in warm ivory serif type with strong navy/black shadow and subtle antique-gold glow.
- Place captions in a lower cinematic-safe area with a subtle lower-screen gradient for readability.
- Do not use a dialogue box, parchment panel, speaker nameplate, character card, title overlay, or large Continue/Skip control.
- Keep the tiny Skip affordance, screen-reader/status text, and reduced-motion-safe behavior.

Future opening art changes should preserve this separation: imagery stays in WebP frames, story captions stay code-rendered, and VN presentation remains reserved for actual visual novel scenes.

## Part 49B Image-Backed Case File And First VN Pages

Part 49B integrates four already-designed WebP screens from `src/assets/final/`:

- `CaseFileFrame01.webp` for the first Case File screen after Open Case.
- `FirstNovel01.webp`, `FirstNovel02.webp`, and `FirstNovel03.webp` for `vn-chapter-1-intro`.

These are complete designed screenshots, not backgrounds. They include visible titles, frames, speaker labels, dialogue panels, dialogue text, and Continue labels inside the image. For these screens, the game should display the image with `object-fit: contain` on a dark background and should not layer duplicate code-rendered title text, speaker names, dialogue cards, Skip/Continue buttons, parchment panels, or old VN portrait cards over the art.

This pass does not change the opening cinematic, main menu background, later VN scenes, puzzle art, platformer art, or final verdict presentation. Future VN image groups should follow the same one-scene-group-at-a-time integration model and preserve hidden accessibility/status text.

## Part 49C Image-Backed Chapter 2 VN Pages

Part 49C integrates the next approved Chapter 2 designed WebP screens from `src/assets/final/`:

- `SecondNovel01.webp`, `SecondNovel02.webp`, and `SecondNovel03.webp` for `vn-chapter-2-intro`.
- `HiddenWallPuzzleNovel01.webp` for `vn-chapter-2-before-puzzle`.

These images are also complete designed screenshots, not neutral backgrounds. They include their own title, frame, page count, speaker nameplate, dialogue panel, dialogue text, and Continue label. The game displays them with contain scaling on a dark background and does not add duplicate VN UI over them. Underlying VN scene text stays in metadata/status for accessibility and tests.

Later VN image groups should continue this one-scene-group-at-a-time approach, keeping unmapped VN scenes on the existing coded VN layout until their final screenshots are approved.

## Part 49D Image-Backed Chapter 3 And Chapter 4 Intro Pages

Part 49D integrates two more approved designed WebP groups from `src/assets/final/`:

- `ThirdNovel01.webp`, `ThirdNovel02.webp`, and `ThirdNovel03.webp` for `vn-chapter-3-intro`.
- `ForthNovel01.webp`, `ForthNovel02.webp`, and `ForthNovel03.webp` for `vn-chapter-4-intro`.

These are complete designed screenshots with baked title, page count, speaker nameplate, dialogue panel, dialogue text, Continue label, and chapter illustration. The runtime continues to show them as contained full-screen images on a dark background and keeps duplicate coded VN UI hidden only for mapped scenes. The `ForthNovel` spelling is deliberate because it matches the current asset filenames.

Later VN image groups remain pending and should continue to be integrated in small batches with matching metadata, route checks, e2e smoke coverage, and release-doc updates.

## Part 49E Image-Backed Chapter 4 Pre-Puzzle And Chapter 5 Intro Pages

Part 49E integrates the next approved designed WebP group from `src/assets/final/`:

- `MarginalNotePuzzleNovel01.webp` for `vn-chapter-4-before-puzzle`.
- `FifthNovel01.webp`, `FifthNovel02.webp`, and `FifthNovel03.webp` for `vn-chapter-5-intro`.

These are complete designed screenshots with baked title, page count, speaker nameplate, dialogue panel, dialogue text, Continue label, and scene illustration. Runtime continues to show them as contained full-screen images on a dark background and keeps duplicate coded VN UI hidden only for mapped scenes.

Later Chapter 5 pre-puzzle and Chapter 6 intro/final-seal VN image groups remain pending for separate scoped passes.

## Part 49F Image-Backed Chapter 6 Intro And Final Seal Pages

Part 49F integrates the Chapter 6 approved designed WebP group from `src/assets/final/`:

- `SixthNovel01.webp`, `SixthNovel02.webp`, and `SixthNovel03.webp` for `vn-chapter-6-intro`.
- `TheFinalSealPuzzleNovel01.webp` for `vn-chapter-6-before-puzzle`.

These are complete designed screenshots with baked title, page count, speaker nameplate, dialogue panel, dialogue text, Continue label, and scene illustration. Runtime continues to show them as contained full-screen images on a dark background and keeps duplicate coded VN UI hidden only for mapped scenes.

The final verdict itself remains code-rendered and unchanged. The remaining VN image-backed gap is the Chapter 5 pre-puzzle Right Question page, if that asset is available and approved.

## Prompt Template

Use this structure for every future image request:

- Asset name:
- Intended file name:
- Usage:
- Chapter:
- Aspect ratio and source size:
- Composition:
- UI-safe area:
- Maria presence:
- Must include:
- Must avoid:
- Prompt draft:
- Optimization target:
- Integration notes:

All prompts should include "no readable text, no logos, no UI buttons" unless a later part deliberately approves a specific text-free texture, seal, or icon where text is impossible.

## Format, Size, And Budget Guidance

- Opening and main menu backgrounds: 16:9, 1920x1080 source, optimized to WebP.
- VN backgrounds: 16:9, 1920x1080 or 1600x900 source, optimized to WebP.
- Platformer background layers: WebP only when useful; procedural and small repeating motifs remain preferred for collision readability.
- Puzzle board backgrounds: 1600x900 or 1280x720 source, optimized to WebP if raster is needed.
- Clue icons: 512x512 source maximum, transparent PNG/WebP or SVG/procedural where possible.
- UI frames/buttons: prefer CSS, SVG, and procedural rendering. Use raster only if it is reusable, text-free, and 9-slice-friendly.
- Avoid 4K exports and raw full-resolution PNGs in the playable package.
- Target individual optimized backgrounds around 300-700 KB where practical.
- Keep any single background above 1 MB only with a deliberate visual reason and a build-size review.
- Avoid WAV audio in production.
- Avoid text baked into images.

GitHub Pages/static hosting notes:

- GitHub Pages is compatible with the final game if assets are optimized and scene-loaded.
- Vite base path must be correct for GitHub Pages project pages.
- Dev editor write endpoints must remain dev-server-only.
- A production asset audit should happen after each major asset batch.
- Do not preload all six chapter background sets at startup.

## Folder And Naming Conventions

Recommended future folder:

- `public/assets/final/`

Recommended naming style:

- `bg_opening_city_wakes.webp`
- `bg_opening_way_to_office.webp`
- `bg_opening_law_office_reveal.webp`
- `bg_opening_maria_approaches_desk.webp`
- `bg_opening_desk_clues.webp`
- `bg_opening_maria_sits_desk.webp`
- `bg_menu_office_desk.webp`
- `opening-main-menu-office-desk.webp`
- `vn_chapter01_sealed_envelope.webp`
- `vn_chapter02_hidden_wall.webp`
- `vn_chapter03_river_witness.webp`
- `vn_chapter04_archive_corrections.webp`
- `vn_chapter05_door_trust.webp`
- `vn_chapter06_court_heart.webp`
- `platformer_chapter05_vertical_ascent_motif.webp`
- `platformer_chapter06_final_court_motif.webp`
- `puzzle_chapter01_envelope_route.webp`
- `puzzle_chapter02_hidden_wall.webp`
- `puzzle_chapter03_witness_lens.webp`
- `puzzle_chapter04_archive_key.webp`
- `puzzle_chapter05_door_trust.webp`
- `puzzle_chapter06_final_case_seal.webp`
- `clue_bundle_chapter01.webp`
- `clue_sealed_envelope.webp`
- `clue_brass_key.webp`
- `clue_tram_ticket.webp`
- `ui_case_frame_9slice.webp`

Do not create these files in this planning part.

Part 48B prefers the descriptive first-asset path `public/assets/final/opening-main-menu-office-desk.webp`. Earlier `bg_menu_office_desk.webp` naming remains historical planning shorthand, but new final committed assets should use clear descriptive names unless a later integration pass chooses otherwise.

## Opening Cinematic Asset Plan

Part 49A-R2 supersedes the earlier planning-only opening notes for the active cinematic: the seven final WebP frames listed above are now integrated as a clean full-screen movie sequence. The older prompt notes below remain useful as historical/source guidance for future replacement variants, but they are no longer the active implementation target.

### 1. Warsaw Wakes Quietly

- Intended file name: `bg_opening_city_wakes.webp`
- Purpose: Establish Warsaw before the case begins.
- Composition: Wide Warsaw-inspired skyline or street with distant tram line, dawn blue-gold atmosphere.
- UI-safe area: Lower center for a short caption.
- Maria presence: None.
- Size/aspect: 1920x1080, 16:9.
- Prompt draft: Elegant cinematic 2D storybook illustration of a Warsaw-inspired city waking quietly at dawn, distant tram line, warm blue-gold morning light, deep navy shadows, antique gold street lamps, romantic legal mystery mood, premium visual novel background, wide 16:9 composition, no people, no readable text, no logos, no UI buttons.
- Performance notes: Keep calm and low-clutter so compression stays clean.

### 2. Way To The Law Office

- Intended file name: `bg_opening_way_to_office.webp`
- Purpose: Move from city atmosphere into Maria's legal world.
- Composition: Warsaw-inspired legal district street, law-office facade, warm lamps fading into morning.
- UI-safe area: Lower third for caption.
- Maria presence: Optional small back-view silhouette.
- Size/aspect: 1920x1080, 16:9.
- Prompt draft: Elegant cinematic 2D storybook illustration of a Warsaw-inspired legal district street in early morning, warm lamps fading into daylight, tram rails and refined old buildings, deep navy shadows, antique gold highlights, subtle burgundy accents, romantic legal mystery mood, wide 16:9 visual novel background, optional small back-view woman silhouette, no readable text, no logos, no UI buttons.
- Performance notes: Avoid crowds, shop signs, and dense facade detail.

### 3. Law Office Reveal

- Intended file name: `bg_opening_law_office_reveal.webp`
- Purpose: Introduce the kancelaria as the emotional home base.
- Composition: Warm law office interior, desk, legal books, folders, lamp, window light.
- UI-safe area: Lower center for caption and center/right for later menu continuity.
- Maria presence: None or implied.
- Size/aspect: 1920x1080, 16:9.
- Prompt draft: Elegant cinematic 2D storybook illustration of a warm Warsaw law office interior in morning light, legal books, case folders, desk lamp, parchment papers, burgundy leather details, antique gold trim, deep navy shadowed corners, romantic legal mystery atmosphere, wide 16:9 premium visual novel background, no readable text, no logos, no UI buttons.
- Performance notes: Can share color design with the menu background.

### 4. Maria Approaches The Desk

- Intended file name: `bg_opening_maria_approaches_desk.webp`
- Purpose: Show Maria arriving without locking a final portrait likeness.
- Composition: Back-view or side silhouette entering the office, desk ahead, soft window light.
- UI-safe area: Lower third.
- Maria presence: Back or side silhouette only, no detailed face.
- Size/aspect: 1920x1080, 16:9.
- Prompt draft: Elegant cinematic 2D storybook illustration of a capable woman lawyer entering a warm Warsaw law office, seen from behind or in soft side silhouette, desk with case papers ahead, morning light through window, deep navy shadows, burgundy leather, antique gold accents, parchment textures, romantic legal mystery mood, wide 16:9, no readable text, no logos, no UI buttons, no detailed face.
- Performance notes: Avoid detailed hands/faces until character art is approved.

### 5. Desk With Envelope, Brass Key, And Tram Ticket

- Intended file name: `bg_opening_desk_clues.webp`
- Purpose: Close-up of the first clue bundle.
- Composition: Desk close-up with sealed cream envelope, small brass key, folded tram ticket, burgundy case file, legal books, lamp glow.
- UI-safe area: Upper or lower clean band for caption.
- Maria presence: None.
- Size/aspect: 1920x1080, 16:9.
- Prompt draft: Elegant cinematic 2D storybook illustration of a warm law office desk in morning light, sealed cream envelope, small brass key, folded tram ticket, burgundy leather case file, legal books, desk lamp, soft amber window glow, deep navy and antique gold palette, romantic legal mystery mood, wide 16:9, no readable text, no logos, no UI buttons.
- Performance notes: Do not bake `16/05` or the case title; render them in code if needed.

### 6. Maria Sits At The Desk

- Intended file name: `bg_opening_maria_sits_desk.webp`
- Purpose: End the cinematic with Maria ready to begin.
- Composition: Maria seated at desk from behind or three-quarter silhouette, envelope and file on desk, office established.
- UI-safe area: Center/right or center-left depending menu frame placement.
- Maria presence: Back/side silhouette only.
- Size/aspect: 1920x1080, 16:9.
- Prompt draft: Elegant cinematic 2D storybook illustration of Maria seated at a warm law office desk, seen from behind or tasteful side silhouette with no detailed face, sealed envelope and case file on the desk, lamp glow, parchment papers, burgundy leather, antique gold details, deep navy shadows, Warsaw morning through window, premium romantic legal mystery mood, wide 16:9, no readable text, no logos, no UI buttons.
- Performance notes: This can bridge into the main menu.

### 7. Main Menu Office Desk Background

- Intended file name: `opening-main-menu-office-desk.webp`
- Purpose: First final background for the opening start screen and/or main menu after the intro lands in the office.
- Composition: Full-screen Warsaw-inspired law office desk background with clean overlay space for code-rendered title/menu frame.
- UI-safe area: Large uncluttered center or right-center space; avoid placing key props under buttons.
- Maria presence: Avoid detailed face/portrait until character style is locked.
- Size/aspect: 1920x1080, 16:9.
- Prompt draft: Create a 16:9 cinematic 2D storybook illustration for the opening and main menu background of a romantic legal mystery browser game. The scene shows a warm Warsaw-inspired law office desk near a tall window at dawn, deep navy shadows, antique gold desk lamp, burgundy leather case file, cream sealed envelope, small brass key, folded tram ticket, legal books, subtle rose accent, soft amber morning light, elegant premium visual novel and hidden-object adventure atmosphere. Leave clean UI-safe space in the center/right area for code-rendered title text and Start/Open Case buttons. No readable text, no logos, no menu frame, no buttons, no photorealism, no anime, no childish cartoon, no cyberpunk, no horror, no watermark.
- Negative prompt: photorealistic, anime, childish cartoon, neon colors, cyberpunk, horror, cluttered, low resolution, readable text, watermark, logo, distorted hands, unreadable letters, harsh saturated colors, generic corporate UI, modern SaaS dashboard look, excessive fantasy magic, menu buttons, menu frame.
- Performance notes: Highest-value reusable background; optimize first and test cover scaling.

## Main Menu Asset Plan

Recommended assets:

- Full-screen menu background: `opening-main-menu-office-desk.webp`.
- Optional foreground desk overlay: only if later parallax/depth is approved.
- Optional title seal/logo frame: prefer CSS/SVG first.
- Optional button frames: keep CSS/procedural unless reusable raster 9-slice art is approved.
- Optional case-file frame asset: use only if CSS/procedural polish is not enough.

Main menu background prompt:

Create a 16:9 cinematic 2D storybook illustration for the opening and main menu background of a romantic legal mystery browser game. The scene shows a warm Warsaw-inspired law office desk near a tall window at dawn, deep navy shadows, antique gold desk lamp, burgundy leather case file, cream sealed envelope, small brass key, folded tram ticket, legal books, subtle rose accent, soft amber morning light, elegant premium visual novel and hidden-object adventure atmosphere. Leave clean UI-safe space in the center/right area for code-rendered title text and Start/Open Case buttons. No readable text, no logos, no menu frame, no buttons, no photorealism, no anime, no childish cartoon, no cyberpunk, no horror, no watermark.

Integration notes:

- Keep title, subtitle, case number, and menu labels in code.
- Keep the current menu frame/buttons/title in CSS/DOM unless a later part specifically approves raster replacements.
- Verify desktop, mobile landscape, and short-height landscape cropping before accepting the asset.

## Final Six-Chapter VN Background Plan

These are 16:9 backgrounds for `VisualNovelScene`. Each should preserve a lower or side area for the dialogue panel and portrait placeholders.

### Chapter 1 - The Sealed Envelope

- Intended file name: `vn_chapter01_sealed_envelope.webp`
- Story: Envelope, brass key, tram ticket, route awakens.
- Backgrounds needed: Kancelaria desk with envelope/key/ticket; optional route-glow close-up.
- Maria presence: Optional desk-side silhouette only.
- UI-safe space: Lower third for dialogue, side area for portrait placeholder.
- Prompt draft: Elegant cinematic 2D storybook illustration of a Warsaw-inspired law office desk at dawn, sealed envelope, brass key, folded tram ticket, burgundy case file, legal books, antique gold lamp, warm amber light, deep navy shadows, romantic legal mystery atmosphere, wide 16:9 visual novel background, no readable text, no logos, no UI buttons.

### Chapter 2 - The Hidden Wall

- Intended file name: `vn_chapter02_hidden_wall.webp`
- Story: Tram ticket, golden stamp, hidden wall/keyhole, repaired wall, Vistula wave mark.
- Backgrounds needed: Tram stop/brass validator; rebuilt street hidden wall.
- Maria presence: Optional back-view silhouette near wall.
- UI-safe space: Lower third and one side.
- Prompt draft: Cinematic 2D storybook illustration of a Warsaw-inspired tram stop leading into a rebuilt old street, brass ticket validator, warm street lamps, hidden brick wall with subtle keyhole, antique gold and burgundy accents, deep navy shadows, legal mystery atmosphere, wide 16:9 visual novel background, no readable text, no logos, no UI buttons.

### Chapter 3 - The River Witness

- Intended file name: `vn_chapter03_river_witness.webp`
- Story: Vistula wave mark, witness note, bridge shadows, archive code.
- Backgrounds needed: Riverbank under bridge; witness silhouette/note handoff.
- Maria presence: Optional distant silhouette; witness should stay indistinct.
- UI-safe space: Lower third.
- Prompt draft: Elegant cinematic 2D illustration of a Warsaw-inspired Vistula riverbank at dusk, bridge shadows, drifting papers, warm city reflections on water, mysterious witness silhouette in the distance, romantic legal mystery mood, deep navy and amber palette, wide 16:9 visual novel background, no readable text, no logos, no UI buttons, no detailed faces.

### Chapter 4 - The Archive Of Corrections

- Intended file name: `vn_chapter04_archive_corrections.webp`
- Story: Archive code, drawer, marginal correction, silver key.
- Backgrounds needed: Archive room; archive desk/file close-up.
- Maria presence: Optional desk-side silhouette.
- UI-safe space: Lower third.
- Prompt draft: Cinematic 2D storybook illustration of an old legal archive room, tall shelves, open drawer, parchment files with no readable writing, marginal-note shapes, small silver key partly hidden in a file spine, warm desk lamp, antique gold accents, deep navy shadows, burgundy leather folders, wide 16:9 visual novel background, no readable text, no logos, no UI buttons.

### Chapter 5 - The Door Of Trust

- Intended file name: `vn_chapter05_door_trust.webp`
- Story: Silver key, courthouse corridor, Trust door, lantern path, elevator/vertical ascent, blue ribbon pages.
- Backgrounds needed: Courthouse corridor/Trust door; lantern path/garden transition; vertical argument/elevator ascent with ribbon pages.
- Maria presence: Optional small silhouette in corridor or on ascent landing.
- UI-safe space: Lower third and one side.
- Prompt draft: Elegant cinematic 2D storybook illustration of a surreal courthouse corridor opening toward a quiet lantern-lit path, silver key motif, warm lantern glow, blue ribbon tied around legal pages, floating platforms and elevator-like ascent implied in the distance, deep navy and antique gold palette, burgundy warmth, romantic legal mystery atmosphere, wide 16:9 visual novel background, no readable text, no logos, no UI buttons.

### Chapter 6 - The Court Of The Heart

- Intended file name: `vn_chapter06_court_heart.webp`
- Story: Rooftops, prior clue memory, floating/elevator ascent, final court, heart seal, verdict.
- Backgrounds needed: Rooftops before verdict; final court of the heart; final verdict certificate background.
- Maria presence: Optional silhouette facing the court seal.
- UI-safe space: Lower third; leave verdict text to FinalVerdictScene code.
- Prompt draft: Cinematic 2D storybook illustration of Warsaw-inspired rooftops before sunrise leading to a luminous ceremonial court in the sky, subtle clue constellation motifs, floating court platforms, heart-shaped legal seal, antique gold light, parchment and burgundy accents, emotional finale atmosphere, wide 16:9 visual novel background, no readable text, no logos, no UI buttons, no excessive fantasy magic.

## Platformer Visual Motif Plan

Final platformer art should enhance readability, not obscure collision. Treat these as background layers, decorative trim, collectibles, and transition objects around retained bridge geometry.

| Chapter | Background motif | Platform style | Interactive object style | Clue object | Exit / transition motif | Performance notes |
|---|---|---|---|---|---|---|
| 1 - The Sealed Envelope | Kancelaria desk, legal folders, route/ticket glow | Desk, file, paper, and book ledges with brass trim | Desk/file reveal marker, route glow | Envelope with brass key/tram ticket bundle | Tram-ticket route line or office threshold | Mostly procedural; one background or small prop sheet is enough. |
| 2 - The Hidden Wall | Tram/city into rebuilt street and hidden wall | Tram platforms, street ledges, brick wall pieces | Brass validator, keyhole gate, rebuild trigger | Golden stamp, red brick/wave mark | Hidden wall opening toward the Vistula | Avoid busy brick textures that hide platform edges. |
| 3 - The River Witness | Vistula bridge shadows, drifting papers | Bridge fragments, floating paper platforms, river stones | Witness silhouette, drifting statement notes | Witness note | Archive code glint or file tag | Keep water reflections static and subtle for mobile. |
| 4 - The Archive of Corrections | Archive shelves, drawers, note margins, file spine | Bookshelves, drawer ledges, archive boxes, file cabinets | Archive key/door gate, drawer marker | Marginal note and silver key | Courthouse index/keyhole glow | Use repeating motifs rather than one huge archive image. |
| 5 - The Door of Trust | Courthouse corridor, lantern path, elevator ascent, ribbon pages | Court platforms, lantern-lit paths, wide legal-page elevators | Trust door, lantern switch, vertical lift | Silver key, lantern, blue ribbon pages | Unfinished letter rising toward rooftops | Keep platforms readable; do not imply three separate pasted levels. |
| 6 - The Court of the Heart | Rooftops, clue memory markers, floating court platforms, final seal | Rooftop ledges, floating gold court slabs, ceremonial platforms | Clue markers, slow floating elevator, final court door | Unfinished letter and heart seal | Final court seal / verdict threshold | Finale should feel ceremonial, not visually noisy or harder than Chapter 5. |

## Final Six-Chapter Puzzle Asset Plan

Puzzle assets should remain mostly CSS/SVG/procedural unless final art clearly improves readability. Prefer small tokens, frame pieces, and board textures over large full-image boards.

### Chapter 1 Puzzle - Envelope Mosaic + Route Reveal

- Assets: envelope pieces, brass key, tram ticket, route glow, case frame.
- Can remain procedural: grid, slots, placed states, progress labels, buttons.
- Could be generated: envelope piece texture sheet, key/ticket clue bundle.
- Prompt draft: Elegant sealed envelope puzzle pieces with burgundy wax seal and antique gold trim, small brass key, folded tram ticket, parchment texture, romantic legal mystery style, clean readable silhouettes, transparent or neutral background, no readable text, no logos.
- Priority: High.
- Size budget: token sheet under 150 KB; icons under 50 KB each.

### Chapter 2 Puzzle - Stamped Route / Hidden Wall Repair

- Assets: golden stamp, tram route board, hidden wall/keyhole, brick repair pieces, Vistula wave mark.
- Can remain procedural: route lines, grid, rotation indicators, feedback glow.
- Could be generated: combined route/wall board or brick texture sheet.
- Prompt draft: Elegant case puzzle board showing a tram route and rebuilt brick wall, brass stamp, hidden keyhole, red brick pieces, antique gold, parchment, burgundy, and deep navy style, no readable text, no logos, no UI buttons.
- Priority: High.
- Size budget: 1280x720 or 1600x900 WebP under 300 KB where practical.

### Chapter 3 Puzzle - Witness Lens

- Assets: witness note paper, evidence lens/magnifier, contradiction stamp, statement strips, archive code reveal.
- Can remain procedural: statement text strips, lens hit states, selected/marked states.
- Could be generated: parchment note texture, magnifier, stamp mark.
- Prompt draft: Premium legal evidence board with witness note, magnifying lens, burgundy contradiction stamp, parchment strips, deep navy and antique gold palette, romantic legal mystery style, no readable text, no logos, no UI buttons.
- Priority: Medium-high.
- Size budget: small transparent assets or SVG preferred; avoid a large board unless reused.

### Chapter 4 Puzzle - Archive Detail Finder

- Assets: archive page, magnifier, bookmark tabs, marginal correction area, silver key reveal.
- Can remain procedural: hidden zones, discovered states, labels, buttons.
- Could be generated: archive page texture and silver-key reveal accent.
- Prompt draft: Old legal archive document puzzle board with magnifier, bookmark tabs, marginal correction area, hidden silver key detail, warm desk lamp, parchment and gold style, deep navy shadows, no readable text, no logos, no UI buttons.
- Priority: High.
- Size budget: page asset under 250 KB; magnifier/key as SVG or small PNG/WebP.

### Chapter 5 Puzzle - Door Of Trust Hybrid

- Assets: question tile, silver key, Trust door, lantern path, blue ribbon pages, optional vertical/elevator motif.
- Can remain procedural: question labels, drop targets, door state, success states.
- Could be generated: courthouse board, key/door/lantern/ribbon token sheet.
- Prompt draft: Ceremonial courthouse puzzle board with silver key, glowing trust door, lantern path, blue ribbon around legal pages, subtle vertical ascent motif, elegant romantic mystery style, antique gold and burgundy accents, deep navy shadows, no readable text, no logos, no UI buttons.
- Priority: High because it unifies the highest-risk chapter.
- Size budget: board under 350 KB; token sheet under 150 KB.

### Chapter 6 Puzzle - Final Case Seal

- Assets: unfinished letter, prior clue constellation, final court seal, six clue tokens, heart seal, verdict unlock glow.
- Can remain procedural: meaning fragment labels, seal slots, validation glow, final verdict text.
- Could be generated: final court seal, heart/scales motif, sky/court board.
- Prompt draft: Elegant final court puzzle board with heart-shaped legal seal, six glowing clue tokens, constellation clues, antique gold glow, burgundy accents, premium visual novel game UI mood, no readable text, no logos, no UI buttons.
- Priority: High.
- Size budget: seal asset can be small SVG/transparent PNG; full board under 400 KB if used.

## Clue Icon Bundle Plan

Icons should be consistent as a set: 512x512 source maximum, transparent background preferred, no readable text, no watermark, no logos, readable silhouette at small sizes.

### Chapter 1 Icons

- Sealed Envelope prompt: Single elegant game icon of a sealed cream envelope with burgundy wax seal and antique gold trim, romantic legal mystery style, clean silhouette, transparent background, no text, no watermark.
- Brass Key prompt: Single elegant game icon of a small brass key with warm antique gold highlights, parchment glow, deep navy shadow, clean silhouette, transparent background, no text, no watermark.
- Tram Ticket prompt: Single elegant game icon of a folded tram ticket with subtle gold route line and parchment texture, no readable writing, burgundy accent, transparent background, no text, no watermark.

### Chapter 2 Icons

- Golden Stamp prompt: Single elegant game icon of an antique golden stamp and brass ticket validator accent, parchment and burgundy details, premium legal mystery style, clean silhouette, transparent background, no text.
- Hidden Wall / Keyhole prompt: Single elegant game icon of a rebuilt brick wall fragment with a subtle keyhole, antique gold edge light, deep navy shadow, clean silhouette, transparent background, no text.
- Red Brick / Wave Mark prompt: Single elegant game icon of a warm red brick with a subtle Vistula wave-mark hint, antique gold edge light, deep navy shadow, clean silhouette, transparent background, no text.

### Chapter 3 Icons

- Witness Note prompt: Single elegant game icon of a folded cream witness note with burgundy evidence-stamp shape but no readable words, antique gold trim, clean silhouette, transparent background, no text.
- Archive Code prompt: Single elegant game icon of a tiny archive tag or file-number marker with no readable writing, parchment and antique gold, deep navy shadow, transparent background, no text.

### Chapter 4 Icons

- Marginal Note prompt: Single elegant game icon of an archive page corner with a small margin mark, bookmark tab, parchment and gold palette, no readable writing, transparent background, no text.
- Silver Key prompt: Single elegant game icon of a refined silver key with soft gold edge light, courthouse motif, deep navy shadow, clean silhouette, transparent background, no text.

### Chapter 5 Icons

- Trust Door prompt: Single elegant game icon of a refined courthouse door opening with a silver key glow, antique gold trim, deep navy and burgundy palette, clean silhouette, transparent background, no readable text.
- Lantern prompt: Single elegant game icon of a warm brass lantern with soft amber glow, quiet garden mood, burgundy and navy accents, clean silhouette, transparent background, no text.
- Blue Ribbon Pages prompt: Single elegant game icon of a blue ribbon tied around parchment legal pages, antique gold accent, deep navy shadow, clean silhouette, transparent background, no readable writing.
- Unfinished Letter Hint prompt: Single elegant game icon of a ribbon-released unfinished letter with no readable writing, warm gold glow, burgundy seal detail, transparent background, no text.

### Chapter 6 Icons

- Unfinished Letter prompt: Single elegant game icon of a cream unfinished letter with constellation glow points and no readable writing, burgundy seal detail, antique gold trim, transparent background, no text.
- Prior Clue Constellation prompt: Single elegant game icon of small clue markers connected by antique-gold constellation lines, deep navy and parchment palette, transparent background, no text.
- Heart Seal prompt: Single elegant game icon of a ceremonial heart-shaped legal seal with subtle scales motif, antique gold and burgundy, parchment glow, clean silhouette, transparent background, no text.

## Final Verdict Visual Plan

The verdict is text-first. Visual assets should support the existing ceremony without altering or competing with the approved verdict.

Recommended assets:

- Final court/certificate background.
- Small final court seal or heart/scales mark.
- Gold verdict border/frame.
- Subtle scales/heart motif.
- Optional parchment document background, text-free.

Prompt draft:

Elegant cinematic 2D storybook background for a final legal verdict scene, ceremonial court of light, parchment certificate space, antique gold border motifs, subtle heart-shaped scales of justice, burgundy ribbon accent, deep navy shadows, warm amber glow, premium romantic legal mystery mood, no readable text, no logo, no watermark.

Rules:

- Do not bake the verdict text into any image.
- Do not add extra romantic copy.
- Keep enough contrast for the code-rendered verdict document.
- Use the final seal/background only after production-preview and mobile readability checks.

## Character And Portrait Plan

Do not generate a detailed Maria portrait yet.

Recommended current approach:

- Opening and VN backgrounds may show Maria as a respectful back-view, side-view, or soft silhouette.
- Avoid detailed facial features, photoreal likeness, private photos, or generated portrait claims.
- Keep the existing procedural portrait system until a later approved character-art pass.

Future options:

- Option A: Keep no character portrait and use monogram/seal placeholders.
- Option B: Create a stylized character portrait only after the user approves references, likeness boundaries, and public/private usage.
- Option C: Use only side/back silhouettes in backgrounds to avoid likeness risk while still making the world feel inhabited.

If generating Maria later, create a separate style sheet first before using her in multiple assets.

## UI Frame And Button Asset Plan

Default recommendation: keep UI frames, buttons, badges, and chips CSS/SVG/procedural.

Possible future raster assets:

- Main menu case-file frame, 9-slice-ready and text-free.
- Shared case panel frame for VN/puzzles, 9-slice-ready and text-free.
- Verdict certificate frame, text-free parchment/gold border.
- Small final seal or stamp mark.
- Optional parchment texture tile if CSS gradients are not enough.

UI frame prompt draft:

Elegant text-free legal case-file UI frame, deep navy leather outer border, burgundy side accents, antique gold trim, parchment inner panel, refined corner ornaments, subtle soft amber glow, premium romantic legal mystery game UI style, transparent center, no words, no logos, no buttons, 9-slice-friendly composition.

Rules:

- Never bake button labels or story text into image frames.
- Keep focus/hover/active states in CSS where possible.
- Use raster UI art only if it is reusable across multiple screens.

## Asset Priority List

High priority:

1. Opening start / main menu office desk background.
2. Menu frame/UI ornament if needed, preferably CSS/SVG/procedural first.
3. Chapter 1 VN background: law office desk / envelope.
4. Chapter 2 VN/platformer background motif: tram route / hidden wall.
5. Chapter 5 and Chapter 6 backgrounds because they define late-game mood.
6. Final court / final verdict background.
7. Puzzle board backgrounds or ornaments.
8. Clue icon bundle.
9. Additional platformer decorative backgrounds.
10. Credits background if needed.

Medium priority:

1. UI frames if CSS/procedural styling is insufficient.
2. Collectibles and interactive object sprites.
3. Credits background or small final case-note seal.

Low priority:

1. Portrait variants.
2. Extra decorative props.
3. Animated overlays.
4. Music-related art.

## Future Integration Loop

For each approved asset:

1. Write the image prompt.
2. Generate the image externally or with the user-approved image workflow.
3. Review composition, UI-safe space, palette, and style consistency.
4. Optimize to WebP before integration.
5. Place under `public/assets/final/...`.
6. Give Codex an integration prompt for that one asset only.
7. Codex registers, loads, and uses it in one scene or one reusable visual layer.
8. Update `CREDITS.md` and asset docs with source, generation method, license/use policy, and purpose.
9. Run typecheck, tests, build, and production preview.
10. Check `dist` size and mobile landscape before repeating.

Do not ask Codex to generate images during planning-only parts.

Future integration direction for the first asset:

1. Place the approved optimized image at `public/assets/final/opening-main-menu-office-desk.webp`.
2. Update the asset registry or scene background path in a dedicated Part 48C integration pass.
3. Use it for `OpeningStartScene` and/or `TitleMenu` only if cover scaling and crop work for both.
4. Preserve code-rendered title text, subtitle, case-file labels, buttons, and focus states.
5. Preserve fullscreen cover scaling and procedural fallback behavior where practical.
6. Check desktop, mobile landscape, and short-height landscape crop before acceptance.
7. Update credits and asset docs with generation/source details.
8. Run typecheck, tests, build, and serial e2e where practical.

## Legacy 10-Level Notes

Old 10-level visual notes remain useful only as source material for retained bridge/dev routes. Do not generate a separate final background for every old level unless a later asset pass explicitly expands scope. Final player-facing art should be organized around the six active chapters and their clue bundles.

Old 10-level labels, old title language, old Polish subtitle language, `M/10`, and museum/exhibit wording should not appear in prompt text, generated image text, UI chrome, or final player-facing asset names.

## Pre-Generation QA Checklist

- Prompt matches the active expanded six-chapter structure.
- Prompt uses current title/clue language where relevant but asks for no readable text inside images.
- Prompt avoids old "Tenth Exhibit", old Polish subtitle, `M/10`, and repeated case-number chrome.
- Prompt has a clear UI-safe area.
- Prompt avoids photorealism, anime, childish cartoon, neon, horror, and heavy fantasy.
- Prompt avoids detailed Maria facial likeness unless approved in a later portrait pass.
- Asset has a target file name, size, and compression budget.
- Asset has an integration note describing whether it replaces a background, icon, board, platformer motif, or optional UI frame.
- `CREDITS.md` update requirements are known before any final asset is committed.
- Build-size impact is estimated before large background batches.
