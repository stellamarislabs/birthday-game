# Visual Style Guide

Part 37 defines the final visual direction before any heavy art is added. This guide protects the game from becoming too large, inconsistent, or hard to deploy on static browser hosts.

## Current Visual Audit

The current build is intentionally procedural and lightweight.

- Title screen: Phaser rectangles, lines, seals, and DOM menu controls. It already reads as a legal birthday case file. It needs a final title treatment and a stronger first-screen background later.
- CaseFileScene: Phaser paper panel and text. It is acceptable for now and should keep the paper-file framing. Later polish can add a refined case-file texture or seal.
- Level Select, Settings, Credits: DOM/CSS panels. These are functional and readable. They need icon polish and a slightly richer case-index visual treatment, not large images.
- Platformer chapters 1-6: Phaser placeholder rectangles, simple labels, procedural motifs, and retained legacy route visuals. Gameplay readability is good, but Maria, clues, doors, checkpoints, platforms, and chapter location motifs need final visual identity.
- Puzzle screens for the 6 active chapters: DOM/CSS procedural puzzle boards, draggable pieces, stamps, tokens, and success states. They are tactile and visually distinct enough for now. Later art should polish board frames and tokens without replacing the core interaction.
- VN scenes: DOM/CSS case-file panel, procedural portrait placeholders, and CSS background variants. These should remain lightweight until final portrait/background decisions are approved.
- EvidenceRevealScene: Phaser text panel with procedural borders. It needs a final clue-filed seal or stamp treatment later.
- FinalVerdictScene: DOM verdict text over a Phaser panel. It should remain text-first. A final court seal can support it, but must not compete with the approved verdict text.
- Dev editor/debug overlay: intentionally utilitarian. It should remain procedural and development-only.

## Recommended Final Direction

Recommended style: **storybook-polished 2D with elegant illustrated UI and soft pixel-inspired shapes**.

This fits the existing Phaser rectangle language while allowing final art to feel warmer and more intentional. It supports mobile readability, small file sizes, and consistent asset production.

Use:

- Dark navy base.
- Cream paper surfaces.
- Warm gold framing.
- Subtle rose accents for Maria, attention, warmth, and emotional beats.
- Soft silver accents for the Silver Key and courthouse moments.
- Controlled blue accent for the Blue Ribbon and Level 8 argument structure.
- Warsaw-inspired silhouettes and motifs, not literal photorealistic cityscapes.

## Current Color System

The active UI palette is now calibrated to the full-screen title background: romantic legal mystery, Warsaw evening, burgundy leather, parchment paper, and antique brass.

Core colors:

- Midnight Navy `#0B1220` for large scene backgrounds and the Phaser boot canvas.
- Deep Blue-Navy `#121C2E` and Panel Navy `#182338` for elevated dark panels.
- Main Cream `#F1E3C8`, Soft Parchment `#E6D3B0`, and Muted Warm Text `#BFAE92` for readable text and paper surfaces.
- Antique Gold `#C79A3B`, Deep Gold `#A87722`, and Brass Highlight `#E2B45B` for borders, focus states, completion marks, and legal-seal accents.
- Burgundy `#6B1F24`, Rich Wine Red `#7E2A30`, and Rose Accent `#9B3A46` for primary actions, Maria/player accents, and restrained emotional emphasis.
- Soft Silver `#D5D8DE` and Blue Ribbon `#365B8C` are reserved supporting tones for the Silver Key and Blue Ribbon motifs.

Implementation notes:

- CSS uses global semantic variables in `src/style.css` for DOM menus, panels, buttons, VN overlays, puzzles, and credits.
- Phaser scenes use `src/ui/theme.ts` so canvas-rendered menus, platformer HUD, puzzle fallbacks, evidence reveals, VN backplates, credits, and final verdict scenes share the same palette.
- Primary actions use burgundy/wine surfaces with gold trim and cream text.
- Completed, selected, and success states use gold/brass glow rather than neon color.
- Locked, disabled, and dev-only states stay muted but readable.
- Level-specific procedural motifs may still use controlled supporting tones, but they should stay within the evening/navy/parchment/brass/burgundy family.

## Full-Game Harmonization

The current main menu is the visual source of truth for the rest of the game. Other screens should feel like extensions of the same Warsaw evening case file, not separate prototypes.

Applied style rules:

- VN scenes use legal-record framing: navy leather panels, parchment dialogue cards, burgundy speaker chips, antique-gold trim, and the restrained `16/05` case mark only where useful.
- Platformer HUD elements use compact navy/gold chips so labels read as in-world case notes rather than raw floating debug text.
- Platformer decorative motifs should use shared `PHASER_THEME` colors instead of scene-local cool blues or one-off grays.
- Puzzle scenes use the same case-file clue language: navy outer panels, parchment or leather interaction surfaces, burgundy selection accents, and gold hover/drop feedback.
- Case Archive rows should read as chapter case cards with gold file edges and restrained burgundy accents.
- Settings, credits, evidence reveal, and final verdict panels stay text-first, but their surfaces should use the same plaque/paper/shadow system as the main menu.

Avoid repeating old case marks. If a case number is needed in decorative UI, use `16/05` sparingly. Do not use `M/10` or add extra `10` marks to the title lockup.

## Visual Novel Presentation

VN scenes should feel like premium legal-romantic case-file pages placed over the same cinematic Warsaw evening world as the main menu.

Current implementation rules:

- Use a large midnight-navy legal-folder frame with antique-gold trim, inner rules, burgundy warmth, and restrained amber glow.
- Use a parchment dialogue document for spoken text so body copy is warm, readable, and distinct from the outer frame.
- Use a burgundy/gold speaker chip and a small gold line counter; both should support hierarchy without becoming louder than the dialogue.
- Placeholder portraits remain procedural. They use a plaque-like leather frame, monogram/seal mark, active-speaker glow, and an inactive dim state for future staging.
- Continue is the primary VN action with burgundy/gold styling. Skip stays visible and secondary.
- Background variants stay procedural and lightweight, using navy overlays, warm highlights, and subtle scene motifs instead of external images.
- On narrow/mobile layouts, portrait and metadata elements collapse before text becomes cramped.

Do not add real portraits, private photos, heavy font files, or raster VN backgrounds until an explicit asset plan approves them.

## Puzzle Presentation

Puzzle scenes should feel like interactive clues inside a luxurious legal case file, not separate app-like mini-games.

Current implementation rules:

- Use a midnight-navy outer clue frame with antique-gold trim, burgundy warmth, inner rules, and a soft cinematic backdrop behind the puzzle panel.
- Use parchment, leather, and dark legal-folder surfaces for puzzle boards, trays, sidecars, and evidence objects.
- Treat puzzle titles and subtitles like clue labels: cream/gold hierarchy, refined dividers, and compact instructions.
- Use the same button family as the main menu: burgundy/gold for primary actions, navy or parchment secondary actions, and restrained reset/danger states.
- Use gold/amber for selected, hovered, valid drop, completed, and solved states. Use restrained burgundy only for wrong, unstable, or contradiction states.
- Keep every tactile object readable first: envelope pieces, timeline tasks, brick pieces, witness strips, magnifier/bookmarks, key/question tiles, lantern/flame, argument blocks, constellation stars, and verdict fragments should all remain easy touch targets.
- Keep each puzzle's motif distinct while staying in the same clue family: tram routes, archive pages, courthouse doors, lantern glow, argument tower, constellation sky, and final seal should share palette and frame language.

Do not add external puzzle art, heavy effects, particles, or decorative clutter until a final asset pass approves them.

## Evidence Reveal And Final Verdict Presentation

Evidence reveals and the final verdict should be the ceremonial payoff layer of the case-file experience.

Current implementation rules:

- Evidence reveals use a shared clue-certificate layout: cinematic navy backdrop, navy legal-folder outer frame, parchment certificate surface, antique-gold border, burgundy or level-appropriate accent, and a procedural clue icon/seal.
- The reveal hierarchy is: `CLUE FILED`, clue name, emotional reveal line, optional follow-up line, and a clear Continue affordance.
- Level-specific accents stay restrained: silver for the Silver Key, blue for the Blue Ribbon, warm gold for the Lantern, burgundy/rose for emotional/legal seals.
- The final verdict uses a grand court-certificate treatment: parchment verdict document inside a navy/gold frame, ceremonial heart/seal motif, burgundy ribbon warmth, and the existing main-menu button family.
- The completion state uses a final seal card for `Case closed. Love confirmed.` with replay, level select, credits, and title options in the same visual language.
- Keep all reveal and verdict text readable before decoration; the final verdict text is approved content and must remain unchanged.

Do not add external images, music, private photos, or extra romantic copy to the verdict layer without explicit approval.

## Secondary Menu Presentation

Level Select, Settings, reset confirmation, and Credits should feel like in-world case-file UI rather than generic app menus.

Current implementation rules:

- Level Select is the `Case Archive`: each row is a legal case card with an clue chip, title, clue name, status chip, and playable/replay action.
- Completed levels use a filed-clue gold seal treatment; playable next levels use a burgundy/gold active-case highlight; locked or coming-soon levels use muted brass/navy sealed-file styling.
- Game-completed Level Select state uses a restrained `Verdict Accepted. Case Closed.` banner rather than a loud success alert.
- Settings are `Case Preferences`: navy legal-folder subpanel, gold trim, and seal-like toggle switches that preserve the existing mute and reduce-motion behavior.
- Reset confirmation is a sealed warning document: restrained burgundy emphasis, clear destructive action, and obvious cancel action.
- Credits are a final case note: parchment document surface, gold border, soft rose/gold seal motif, and honest project/asset/dependency lines from current content.

Do not invent credits, add case numbers repeatedly, or introduce external menu art without an explicit asset approval.

## Platformer Presentation

Platformer scenes should stay collision-readable while sharing the main menu's premium Warsaw evening case-file world.

Current implementation rules:

- Keep actual collision rectangles unchanged. Add decorative trim, glows, labels, and motifs as visual-only Phaser shapes.
- Platforms use antique-gold top trim, subtle shadows, paper/document linework, brass rivets, or masonry marks depending on platform type.
- Level backgrounds remain procedural and lightweight, with navy evening bases, warm lamp glows, gold horizon lines, parchment/file shapes, silver courthouse/key accents, blue-ribbon restraint, and final-court seal echoes.
- HUD and world helper text use compact case-note chips: navy or parchment backing, cream/gold text, warm shadow, and no raw floating debug labels.
- Clues, keys, checkpoints, fragments, and case doors should read as intentional in-world objects with gold/cream/burgundy framing and generous readability.
- Player presentation can be lightly styled through color and stroke only until a real sprite pass is approved.

Gameplay readability wins over decoration. Do not hide platforms, exits, checkpoints, or collectibles behind atmospheric details.

Avoid:

- Photorealistic art.
- Heavy 3D scenes.
- Mixed AI art styles.
- Copyrighted or trademarked visuals.
- Busy fantasy UI.
- Huge full-resolution backgrounds.
- Real photos or private personal materials without explicit approval.

## Scene Priorities

High priority visual polish:

- Title screen title treatment and first impression.
- Maria/player sprite and basic animation pose language.
- Clue bundle icons for the 6 active chapters.
- VN background variants for Chapters 1-6.
- Puzzle board frames/tokens for the 6 active chapter puzzles.
- Final verdict seal.

Medium priority visual polish:

- Platformer level background motifs.
- Checkpoints and case doors.
- Case Archive chapter rows.
- Settings, mute, and reduce-motion icons.
- Credits presentation.

Low priority visual polish:

- Extra decorative props.
- Advanced particles.
- Music visualization.
- Complex scene transitions.

## What Should Remain Procedural

Keep these procedural unless there is a strong reason to replace them:

- Core collision platforms and debug overlays.
- Basic panel borders, focus states, and responsive DOM layout.
- Small glow/highlight states for puzzles.
- Simple fallback shapes for missing assets.
- Procedural WebAudio effects until licensed audio is deliberately approved.

## Visual Consistency Rules

- Every final asset should look like it belongs to the same illustrated case-file world.
- Keep UI text readable before decoration.
- Do not rely on color alone. Icons, labels, shapes, and motion states should carry meaning too.
- Preserve large mobile touch targets.
- Final assets should enhance the procedural structure, not require redesigning gameplay.
- Use subtle motion and respect Reduce Motion.

## Asset Source Policy

Preferred source order:

1. Self-created vector/bitmap art.
2. Procedural CSS/Phaser shapes.
3. Commissioned/custom art with clear rights.
4. AI-generated art only if usage rights are checked and style consistency is controlled.
5. CC0 or clearly permissive third-party assets with credits.

Do not use unclear assets, copyrighted music, ripped sprites, trademarked characters, real portraits, private photos, private messages, or sensitive personal materials without explicit approval.

## Part 38 Procedural Upgrade Pass

Part 38 improves the current placeholder presentation without adding final assets.

Implemented lightweight choices:

- Shared DOM panels now use richer case-file framing, subtle inner borders, warmer button states, and reduced-motion-safe transitions.
- Title, case file, credits, evidence reveal, and final verdict scenes gained static Phaser motifs: city-light dots, file-paper lines, legal seal hints, and a restrained verdict seal.
- Platformer clue pickups now use distinct procedural silhouettes for the envelope, stamp, brick, notes, silver key, lantern, blue ribbon, unfinished letter, and heart instead of one generic envelope shape.
- Platformer backdrops received small static level motifs such as tram rails, brick lines, archive lamp glow, courthouse silver accents, lantern glow, rooftop constellation hints, and final court seal echoes.
- Puzzle boards received CSS-only frame polish, stronger draggable tile affordance, better document/lens/bookmark/seal treatment, and success-state glow reinforcement.
- VN portrait placeholders and dialogue cards received subtle procedural detailing while keeping the text short, readable, and asset-free.

Keep these as upgraded placeholders. Future final art should replace or complement them one category at a time, preserving readability and interaction targets.

Part 38 still avoids:

- External images.
- Generated character art or portraits.
- Audio/music.
- Heavy particles, shaders, or animation systems.
- Gameplay, puzzle logic, VN text, or final verdict text changes.

## Main Menu Frame

The active title menu frame is a lightweight DOM/CSS plaque layered over the full-screen Warsaw evening background.

Style rules:

- Use a deep navy/leather center panel so the title and buttons stay readable over the cinematic background.
- Use restrained burgundy side accents to echo the leather case file and roses in the title art.
- Use antique gold borders, inset rules, corner ornaments, and a small procedural crest area for the court/case-file mood.
- Keep the effect CSS-only: gradients, borders, shadows, and pseudo-elements, with no raster frame texture or external asset.
- Keep the buttons and title/logo typography separable from the frame so they can be redesigned in later passes without replacing the panel.
- On desktop the frame should read as a premium legal folder/court plaque, not a small card; on mobile landscape it should widen and compress without covering the whole background.

## Main Menu Buttons

The active title buttons are DOM/CSS controls using dedicated `.main-menu-button` classes so their presentation can evolve without changing puzzle, VN, or settings buttons.

Style rules:

- `Open the Case` / `Continue Case` is the primary action: burgundy leather fill, antique gold trim, cream text, stronger glow, and a small procedural seal mark.
- Secondary actions use parchment surfaces with warm ink text and gold borders so they feel like case-file tabs rather than generic app buttons.
- `Reset Case` stays restrained: burgundy/navy with gold trim and muted warning color, clear but not aggressive.
- Hover and focus states use amber/gold glow with a visible outline; active state presses the button down subtly.
- Disabled buttons remain readable and visibly sealed/locked through muted opacity, desaturation, and reduced seal contrast.
- The implementation remains CSS-only: no icon package, no external art, no raster button texture.

## Main Menu Title Typography

The active title lockup uses existing safe serif fonts and CSS-only decoration.

Style rules:

- Keep the exact title content: `Maria and the Case of the Missing Heart`.
- Keep the exact Polish subtitle content: `Sprawa Zaginionego Serca`.
- Keep the exact small line content: `A birthday case file`.
- Use a large balanced Georgia/Palatino-style serif title with cream-to-gold treatment, soft shadow, and no external font file.
- Use the Polish subtitle as a small gold legal heading above the title with a thin divider.
- Use a subtle procedural crest above the main title and a restrained gold/rose divider below it.
- Use `16/05` only if a future pass deliberately adds a case-number badge; do not add `10` or `M/10` to the main title lockup.
- Mobile landscape must compress the crest, divider, and title scale before hiding controls or clipping text.

## Global Icons, Badges, And Chips

Small UI marks now use a single lightweight legal-romantic icon and chip language.

Implementation rules:

- Use `src/ui/icons.ts` for semantic icon keys and exhibit/status/speaker mappings.
- Render icons as CSS-only spans with `.ui-icon` and a modifier such as `.ui-icon--scales`, `.ui-icon--folder`, or `.ui-icon--final-seal`.
- Do not add external icon libraries or raster icon assets for small UI marks unless a later asset pass deliberately approves them.
- Keep linework simple, antique-gold/cream/burgundy compatible, and readable at small sizes.
- Use parchment or navy chips with gold trim for clue labels, status tags, VN speaker chips, and small HUD-style labels.
- Completed states should feel like an admitted gold seal; locked states should use muted brass; selected/playable states should use warm amber glow; wrong/error states should use restrained burgundy.
- Icons should clarify UI meaning without cluttering rows, buttons, or VN dialogue.
- If a case number is ever needed in chip chrome, use `16/05` sparingly and do not reintroduce repeated `M/10` markings.

## Full Visual Consistency QA Pass

The full consistency pass treats the current main menu as the source of truth for all player-facing screens.

Applied cleanup:

- Fallback puzzle and unavailable-route copy should now read as sealed case-file states rather than old build placeholders.
- VN background variants use the shared navy/parchment/gold/burgundy palette variables instead of drifting toward unrelated purple/cool prototype tones.
- Platformer HUD and world labels should use shared theme tokens for their backing panels instead of isolated hardcoded colors.
- CaseFileScene, ComingSoonScene, PuzzleScene fallback surfaces, VN, puzzles, Level Select, Settings, Credits, EvidenceRevealScene, and FinalVerdictScene should all preserve the same court-file material language.

Intentional exceptions:

- Dev/debug overlays remain utilitarian and dev/test-only.
- Internal legacy helper names may still include words like `placeholder` for unsupported or retired routes, but visible player copy should avoid build-scaffolding language.
- Final art is still procedural/lightweight until a later approved asset pass.

## Opening Cinematic

The opening layer should feel like a short premium storybook prologue before the menu becomes interactive.

Style rules:

- Start screen uses one clear burgundy/gold `Start` action, a restrained birthday case-file label, and no full menu controls.
- Cinematic beats use full-screen procedural navy/gold/burgundy visuals, warm desk/law-office motifs, and concise caption chips.
- Motion should be gentle: fade/settle transitions, no heavy particles, no video files, and no shader effects.
- Maria may appear as a simple respectful silhouette/desk presence only until a later approved character art pass.
- The final beat should settle in the law office with Maria at the desk and the case file visible, then hand off to the existing main menu.
- Reduced Motion should keep the same story order but shorten/simplify transition motion.
- Do not add private photos, voice, music, or external images for the opening.

## Part 43 Final Asset Prompt Direction

`docs/visual-asset-prompt-plan.md` is the prompt source of truth for later generated or custom final images. Part 43 refreshes that plan after the Chapter 1-6 expansion work, so final art now reflects the richer platformer pacing, Chapter 5 elevator/vertical identity, Chapter 6 rooftop/floating/final-court finale, and the Part 42N continuity copy. No assets are added in Part 43.

Future final images should follow this master direction:

- Elegant cinematic 2D storybook illustration.
- Romantic legal mystery mood with warm Warsaw light.
- Deep navy shadows, parchment, antique gold, burgundy leather, brass highlights, and subtle rose accents.
- Painterly but clean visual novel/adventure game polish.
- No photorealism, anime, childish cartoon, neon, horror, heavy fantasy, watermarks, logos, or readable AI-generated writing.
- No title text, menu labels, case numbers, or clue names baked into images unless a later part explicitly approves a controlled prop.
- Maria can appear only as a respectful side/back silhouette until a later approved portrait or likeness pass.
- Chapter 5 visuals should connect courthouse, Trust door, lantern path, vertical ascent, blue ribbon pages, and the unfinished letter as one chapter.
- Chapter 6 visuals should connect rooftops, prior clue memory markers, floating ascent, final court, heart seal, and verdict readiness as one ceremonial finale.

Prompted art should leave clear UI-safe areas for code-rendered panels, buttons, VN dialogue, and puzzle controls. The first final image priority is the opening/menu law-office desk background because it can anchor the title screen and cinematic reveal while keeping the rest of the game procedural.

## Part 48B First Final Background Direction

The first final asset target is the opening/main-menu office desk background. Use `docs/visual-asset-prompt-plan.md` as the exact prompt source, and keep this pass as planning only until the generated image is reviewed externally.

Locked requirements:

- 16:9, 1920x1080 source, optimized to WebP.
- Intended path after approval: `public/assets/final/opening-main-menu-office-desk.webp`.
- Warm Warsaw-inspired law office desk near a tall window at dawn.
- Burgundy leather case file, cream sealed envelope, small brass key, folded tram ticket, legal books, antique gold desk lamp, deep navy shadows, subtle rose accent, and soft amber morning light.
- Clean center/right UI-safe area for code-rendered title and Start/Open Case buttons.
- No readable text, logos, menu frames, buttons, watermarks, photorealism, anime, childish cartoon, cyberpunk/neon, horror, or detailed real-person likeness.
