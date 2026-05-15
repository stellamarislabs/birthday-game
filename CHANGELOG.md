# Changelog

## Part 56I - Single-continue image-backed Case Filed reveals

- Changed mapped image-backed Chapter 1-5 Case Filed reveal screens to save completion and open the Case Archive on the first continue input.
- Added a routing guard so duplicate click/Enter input cannot trigger repeated archive transitions from the reveal image.
- Preserved the old two-step Phaser fallback reveal behavior for unmapped/missing reveal images.

## Part 55A-R2 - Extended chapter music across full chapter flow

- Added chapter-level music requests for chapter VN, puzzle, and reveal scenes so each chapter track can continue across the full chapter arc instead of only platformer gameplay.
- Kept platformer and puzzle direct-route fallbacks mapped to the correct active chapter music.
- Preserved opening/menu hub music, final verdict music, Evidence of Love handoff behavior, and duplicate-track prevention through the existing AudioManager key model.

## Part 53C-R2 - Repositioned Evidence of Love vertical notice

- Moved the vertical viewing notice above the `Final file` and `Evidence of Love` copy so it is first in the standalone video page reading order.
- Kept the portrait video as the right-column focus on desktop/landscape and placed the subtle return link after the video in single-column mobile flow.
- Preserved the R2 video source, standalone page behavior, and user-initiated fullscreen fallback logic.

## Part 53C-R1 - Polished Evidence of Love video page hierarchy

- Promoted the vertical viewing instruction into a parchment-and-gold notice beneath the portrait video player.
- De-emphasized `Return to the Case Archive` into a quieter footer link so playback remains the primary action.
- Added a user-initiated optional fullscreen attempt for the video with graceful inline fallback when browser policy blocks fullscreen.

## Part 56H - Repositioned final verdict accept action

- Moved the image-backed Final Verdict `Accept Verdict` action into a bottom-right overlay so the verdict image can use the vertical space previously consumed by the button row.
- Enlarged the contain-safe image presentation for desktop and mobile landscape while preserving fallback text verdict layout.
- Kept the accept/save/Evidence of Love flow unchanged with a touch-friendly burgundy-and-gold overlay CTA.

## Part 56G - Polished Chapter 4 case file sorting feedback

- Added correct and incorrect placement status styling for Chapter 4 document slots using gold confirmation and restrained burgundy warning treatments.
- Removed the solved-state `No. Given.` correction badge from the main board surface so it no longer competes with the Silver Key action.
- Promoted the Silver Key into a clearer `Take the key` CTA while preserving the existing key availability, key-taking, and completion logic.

## Part 56F - Polished Chapter 3 deposition order feedback

- Replaced the Chapter 3 deposition puzzle's player-facing archive margin wording with clearer Archive File copy and updated the revealed code to `16/05-FILE`.
- Added correct and incorrect placement status styling for placed witness-note strips using gold/amber confirmation and restrained burgundy warning treatments.
- Added coverage for the new copy, placement status helper, reset clearing, and e2e placement feedback while preserving the existing strip ids and solution order.

## Part 56E-R2 - Increased main menu title-action spacing

- Increased the title menu's internal vertical gap so the title and action row read as two distinct visual blocks.
- Added a little more short-height landscape panel height to preserve bottom breathing room after widening the title-to-button space.
- Kept the existing desktop look, one-row mobile button layout, subtitle removal, and settings removal intact.

## Part 56E-R1 - Restored mobile landscape menu breathing room

- Added a mobile-landscape minimum height for the title menu panel so it reads as an elegant case-file card instead of a shallow banner.
- Rebalanced short-screen title sizing, ornament spacing, and title-to-button gap to keep the title grand without crowding.
- Preserved the one-row main menu actions while giving the buttons slightly more vertical room and keeping touch targets comfortable.

## Part 56E - De-squeezed mobile landscape main menu

- Tightened the short-height landscape title menu panel padding, frame insets, and decorative spacing so the menu breathes better on phone landscape screens.
- Scaled the main title down more aggressively in mobile landscape and widened its text measure to avoid an oversized stacked title block.
- Kept the three main menu actions in a compact one-row treatment with smaller gaps, readable labels, and comfortable touch-target height.

## Part 56D - Polished main menu visual design

- Softened the main menu title panel with subtler burgundy side ambience, quieter gold trim, and less busy decorative linework.
- Reduced the title scale and shadow weight so the title remains grand without crowding the menu.
- Rebalanced the main menu buttons into a more cohesive burgundy/navy/gold system while preserving all existing actions.

## Part 56C - Simplified main menu title area

- Removed the visible Polish subtitle and `A birthday case file` descriptor from the main menu title panel.
- Removed the matching Phaser subtitle draw call and unused subtitle-specific menu CSS so the remaining title/buttons close up cleanly.
- Added smoke coverage that keeps the main title visible while confirming the removed title-area lines stay absent.

## Part 56B - Master release-candidate QA pass

- Restored the player-facing Polish subtitle source to `Sprawa Zaginionego Serca` so the release identity matches the story bible and content validation.
- Stabilized the Case Archive accessibility live-region after reveal transitions so long smoke runs do not see a blank scene status.
- Gave the five-chapter reveal-flow smoke test the same longer timeout used by other multi-puzzle smoke coverage.
- Gave the six-chapter mobile platformer touch-control smoke test a longer timeout so it can complete all active chapters reliably.
- Ran the release-candidate validation suite across typecheck, unit tests, production build, Playwright smoke coverage, and aggregate checks.

## Part 54C - Refined Evidence of Love bonus screen

- Removed the Case Archive and Credits buttons from the post-verdict Evidence of Love unlock panel, leaving only Open Evidence of Love and Back to Title.
- Polished the bonus panel with a more ceremonial burgundy/navy/gold final-file treatment, stronger primary action hierarchy, and quieter secondary navigation.
- Kept completion saving, base-safe `video.html` navigation, final verdict text, and the Evidence of Love handoff intact.

## Part 56A - Polished platformer-only mobile touch controls

- Restyled the platformer touch controls with burgundy/navy surfaces, antique-gold trim, larger thumb-friendly arrow and JUMP buttons, and clearer pressed feedback.
- Added a compact mobile-only platformer hint that explains movement and jump, auto-hides, and clears on the first touch input.
- Hardened touch cleanup with page-hide and pointer-cancel guards while preserving the existing PlatformerScene-owned lifecycle and keyboard controls.
- Expanded mobile-landscape smoke coverage to verify touch controls appear in platformers and remain absent from opening, VN, puzzle, archive, final verdict, bonus, and credits screens.

## Part 55A-R1 - Added opening/main menu and final verdict music flow

- Added MP3-primary/OGG-fallback support for the shared `OpeningandMainMenu` track.
- Started the shared music from the opening Start action, kept it alive through the opening cinematic, Title menu, and Case Archive, and stopped it at the Chapter 1 VN boundary.
- Reused the same shared track as the final emotional bookend on `FinalVerdictScene`, kept it through the Evidence of Love bonus panel, and stopped it before same-tab `video.html` navigation.
- Preserved the existing chapter-specific platformer music mapping and duplicate-track prevention without adding settings or mute UI.

## Part 55A - Added chapter platformer background music

- Added a runtime-level-to-chapter music registry for the six active platformer levels using the checked-in `Chapter1` through `Chapter6` MP3/OGG music pairs.
- Added browser format selection that prefers MP3 when playable, falls back to OGG when needed, and stays silent if no usable source exists.
- Extended the shared audio manager with a safe looping music lane that respects muted saves, browser gesture unlock, blocked autoplay fallback, and duplicate-track prevention.
- Started chapter music on platformer entry and stopped it on platformer scene shutdown without changing platformer geometry, movement, routing, save schema, or final verdict text.
- Updated credits to reflect the newly used user-provided chapter music files.

## Part 54B - Activated image-backed final verdict screen

- Detected the checked-in `src/assets/final/finalVerdict/FinalVerdict01.webp` asset through the optional final verdict resolver.
- Updated final-verdict e2e coverage to expect the image-backed verdict presentation, suppressed runtime verdict text, and preserved real `Accept Verdict` control.
- Kept the fallback verdict markup and protected code verdict text unchanged for missing-asset safety.

## Part 54A - Prepared optional image-backed final verdict screen

- Added an optional final verdict asset resolver for future `src/assets/final/finalVerdict/FinalVerdict01.webp`, preserving the current code-rendered verdict as the missing-asset fallback.
- Added image-backed `FinalVerdictScene` markup that suppresses the old runtime verdict text only when the final verdict image exists, while keeping a real accessible `Accept Verdict` button.
- Preserved the existing completion save order and Evidence of Love bonus handoff, and added unit coverage for fallback/image-backed verdict markup plus protected verdict text safety.

## Part 53C - Added standalone Evidence of Love video page

- Added `public/video.html` as a standalone portrait-friendly destination for the final Evidence of Love video, without booting Phaser or including the game landscape warning.
- Styled the page with the shared romantic legal mystery palette, a centered 9:16 video frame, mobile portrait layout, and a gentle mobile-landscape note to turn upright.
- Added `public/video-config.js` so the page loads the R2-hosted `https://media.stellamarislabs.net/videos/evidence-of-love.mp4` without committing a video file to the repo.
- Added missing-video fallback copy, a direct `index.html` return link, and unit coverage for static page safety.

## Part 53B - Added Evidence of Love bonus unlock screen

- Replaced the post-accept final verdict panel with a landscape-safe `Evidence of Love Unlocked` bonus screen while preserving the approved verdict text and the existing completion save order.
- Added a base-safe same-tab `video.html` target through the public asset path resolver, plus secondary Case Archive, Credits, and Back to Title actions.
- Updated smoke coverage to confirm Accept Verdict saves completion, does not navigate immediately, and exposes the Evidence of Love button target.

## Part 52F - Removed main menu Settings button

- Removed the visible Settings button from the main menu while preserving Open/Continue Case, Case Archive, and Reset Case actions.
- Left the existing settings/save infrastructure in place for now, but removed main-menu access so player-facing settings no longer appear.
- Updated smoke coverage to assert Settings is absent and that reset flow still works from the cleaned-up main menu.

## Part 52E - Added Final Seal ring controls

- Added dedicated Outer, Middle, and Inner ring control buttons to the Chapter 6 Final Seal puzzle so mobile players can rotate rings without precisely tapping the concentric seal.
- Wired the new controls through the same ring rotation data attribute and handler as direct ring taps, preserving ring order, solution, clue lights, Unlock Verdict behavior, routing, save/progression, and final verdict text.
- Added responsive navy/burgundy/gold styling for the control row and updated smoke coverage to exercise both direct ring tapping and the new control buttons.

## Part 52D - Corrected Trust Arch visual direction

- Added a scoped visual-only rotation offset for the Chapter 5 Trust Arch glyph so its arch faces the same south-east path used by the solved light connection.
- Added coverage documenting the solved Trust Arch rotation and logical south-east connections while preserving the existing one-click mirror solve path, question logic, routing, save/progression, and final verdict text.

## Part 52C - Restyled platformer in-level notices

- Added a reusable Phaser notice view for platformer title, clue/status, hint, checkpoint, and sound messages using navy/burgundy panels, parchment text, antique-gold trim, and subtle amber glow.
- Replaced the old text-object background boxes in `PlatformerScene` while preserving existing message triggers, durations, clue collection, checkpoint activation, routing, and save/progression behavior.
- Added variant styling for clue-collected, checkpoint/progress, and normal hint messages so in-level feedback matches the final romantic legal mystery presentation.

## Part 52B-R1 - Simplified Case Archive cards

- Removed visible clue lists, next-clue hints, and duplicate status badges from Case Archive chapter cards so each card focuses on chapter title and the single action button.
- Tightened the card grid around the simplified content to improve desktop balance and mobile landscape readability without changing unlock, replay, routing, or save behavior.
- Updated smoke coverage to assert the simplified archive no longer renders the removed duplicate card text.

## Part 52B - Fixed mobile landscape image and Case Archive fit

- Updated responsive viewport height tracking to prefer the visible `visualViewport` height so image-backed final screens size to mobile browser chrome instead of the larger layout viewport.
- Tightened final image-backed scene sizing so VN, case-file, and reveal images use contain-safe max viewport dimensions without cropping baked text.
- Added short-landscape Case Archive card rules that keep chapter title, status, and action controls readable while hiding/truncating long clue copy to prevent overlap.

## Part 51J - Rolled out Chapter 6 hybrid platformer visuals

- Applied the hybrid platformer presentation to runtime Level 9 with the rooftop final-court background, heart-fragment clue visuals, final court door art, and shared checkpoint marker when available.
- Replaced Level 9 primitive platform presentation with code-rendered rooftop court ledges, final-seal lift surfaces, rebuilt route styling, lantern fallback markers, and light-revealed platform styling while keeping all bodies and reveal logic authoritative.
- Removed Chapter 6 placeholder decoration clutter from normal presentation without changing geometry, movement, routing, save/progression, final puzzle routing, or final verdict text.

## Part 51I - Rolled out Chapter 5 hybrid platformer visuals

- Applied the hybrid platformer presentation to runtime Level 6 with the courthouse background, blue-ribbon clue visuals, lantern switch art, Trust Door exit, and shared checkpoint marker when available.
- Replaced Level 6 primitive platform presentation with code-rendered courthouse ledges, trust-lift surfaces, choice doors, and light-revealed platform styling while keeping collision bodies and lantern/door logic authoritative.
- Removed Chapter 5 placeholder decoration clutter from normal presentation without changing level geometry, movement, routing, save/progression, or final verdict text.

## Part 51H - Rolled out Chapter 4 hybrid platformer visuals

- Applied the hybrid platformer presentation to runtime Level 5 with the archive background, marginal-note clues, silver key art, archive door art, and shared checkpoint marker when available.
- Replaced Level 5 primitive platform presentation with code-rendered archive drawer, file shelf, parchment folder, and file-lift surfaces while keeping collision bodies, moving platform logic, archive key logic, and door routing authoritative.
- Removed Chapter 4 placeholder decoration clutter from normal presentation without changing level geometry, movement, routing, save/progression, or final verdict text.

## Part 51G - Rolled out Chapter 3 hybrid platformer visuals

- Applied the hybrid platformer presentation to runtime Level 4 with the Vistula background, witness-note clue visuals, archive-code exit, and shared checkpoint marker when available.
- Replaced Level 4 primitive platform presentation with code-rendered damp-stone, bridge-ledger, and drifting note platform surfaces while keeping collision bodies and moving platform logic authoritative.
- Removed Chapter 3 placeholder decoration clutter from normal presentation without changing level geometry, movement, routing, save/progression, or final verdict text.

## Part 51F - Rolled out Chapter 2 hybrid platformer visuals

- Applied the hybrid platformer presentation to runtime Level 2 with the Hidden Wall background, stamp clue, hidden-wall exit, and shared checkpoint marker when available.
- Replaced Level 2 primitive platform presentation with code-rendered brick, stone, tram-route, and rebuild-platform surfaces while keeping collision bodies and rebuild logic authoritative.
- Removed Chapter 2 placeholder decoration clutter from normal presentation without changing level geometry, movement, routing, save/progression, or final verdict text.

## Part 51E - Integrated shared platformer checkpoint marker

- Added shared checkpoint marker asset resolution with PNG preference and WebP fallback across active platformer runtime levels.
- Drew checkpoint art as a non-interactive visual skin while keeping checkpoint zones, activation, respawn behavior, and save/progression unchanged.
- Preserved primitive checkpoint fallback styling when the shared marker asset is missing.

## Part 51D-R5 - Recalibrated Maria platformer body and pickup reach

- Enlarged Maria's platformer collision body and separated clue/interactable pickup reach into a wider invisible interaction zone.
- Increased Maria's display height and horizontal readability while tuning foot alignment against transparent sprite padding.
- Preserved movement constants, platformer geometry, routing, save/progression, and final verdict text.

## Part 52A - Added global non-VN presentation shell

- Added shared navy/burgundy/gold presentation tokens for non-VN backdrops, stage surfaces, frame borders, inset trim, and theatre-case shadows.
- Added a reusable Phaser `drawNonVnPresentationShell` helper and applied it to canvas-only utility/reveal scenes so they no longer rely on separate generic blue rectangle backdrops.
- Brought puzzle, archive, credits, final verdict, evidence-reveal image margins, platformer side treatment, and base app shell into the same romantic legal mystery presentation language without changing gameplay, routing, save/progression, VN content, opening content, or final verdict text.

## Platformer presentation centering correction

- Fixed a mobile landscape canvas alignment issue where Phaser's inline canvas margin combined with CSS grid centering and shifted the active platformer presentation to the right.
- Added e2e coverage that asserts the platformer canvas has balanced left/right viewport margins while preserving the existing full-screen theatre-frame shell.
- Kept platformer geometry, world coordinates, player spawn points, camera follow behavior, save/progression, and final verdict text unchanged.

## Part 51D-R4 - Replaced platformer side-fill art with theatre-frame margins

- Removed the Chapter 1 platformer background image from the outer viewport side margins so level art no longer stretches or repeats outside the active gameplay canvas.
- Added a code-rendered burgundy/navy/gold theatre-frame side treatment for platformer scenes, keeping the centered fixed-resolution gameplay area intact.
- Preserved Maria sprite edge/readability improvements, platformer geometry, hitboxes, camera bounds, routing, save/progression, puzzles, VN/reveal/cinematic assets, and final verdict text.

## Part 51D-R3 - Improved Maria sprite edges and platformer full-bleed framing

- Added a subtle dark edge-shadow companion behind Maria's active sprite to reduce pale fringe on dark platformer backgrounds without changing the 34x54 physics body or movement behavior.
- Filled platformer letterbox side areas with platformer-specific ambience, including the Chapter 1 kancelaria background, so desktop and mobile landscape presentation no longer falls back to empty black side bars.
- Kept platformer geometry, hitboxes, camera bounds, routing, save/progression, puzzles, VN/reveal/cinematic assets, and final verdict text unchanged.

## Part 51D-R2 - Tuned Maria platformer sprite readability

- Increased Maria's visual presentation to a 128px bottom-centered sprite with a wider minimum display width while preserving the unchanged 34x54 player physics body.
- Added a subtle non-interactive contact shadow and raised the sprite depth so Maria remains readable above platform art and dark backgrounds.
- Preserved idle/walk/jump/facing behavior, transparent sprite gating, rectangle fallback, platformer geometry, movement constants, routing, saves, puzzles, and final verdict text.

## Part 51D-R1 - Enabled transparent Maria platformer sprites

- Verified the replacement Maria idle, walk, and jump PNGs have real alpha channels, then enabled the platformer sprite gate.
- Cropped the transparent padding at render time, set Maria to a 92px bottom-centered presentation with a minimum readable width, and kept her aligned to the unchanged 34x54 player body.
- Preserved rectangle fallback behavior for missing/invalid sprite URLs and kept all player physics, movement constants, routing, save/progression, puzzles, and final verdict text unchanged.

## Part 51D - Added safe Maria platformer sprite support

- Added a dedicated Maria platformer sprite resolver for `maria-idle.png`, `maria-walk.png`, and `maria-jump.png` plus regression coverage that preserves the existing 34x54 body and movement constants.
- Added a `PlayerView` visual companion that can bottom-anchor idle/walk/jump sprites to the existing player body with facing-state support, while keeping `PlayerController` and physics behavior unchanged.
- Kept the rectangle fallback active because the current checked-in Maria PNGs are RGB images with baked checkerboard backgrounds rather than true transparency.

## Part 51C-R2 - Converted Chapter 1 platformer to hybrid final presentation

- Kept the Chapter 1 background, envelope clue, and case-door final images active while keeping platform and elevator WebP mappings available but inactive for gameplay surfaces.
- Removed the old Chapter 1 placeholder decoration clutter from normal final presentation and strengthened the dark readability overlay behind gameplay.
- Refined static and moving platform visuals as polished code-rendered kancelaria surfaces aligned to unchanged collision bodies, with moving-platform trim grouped so it follows the elevator body.

## Part 51C-R1 - Cleaned Chapter 1 platformer final-art presentation

- Reduced old primitive platform fills in the Chapter 1 final-art presentation while keeping every physics rectangle and overlap zone authoritative.
- Bypassed active rendering of the Chapter 1 platform and elevator WebP skins where their source padding/aspect made them read as squeezed strips, replacing them with polished code-rendered parchment/leather surfaces that align exactly to existing bodies.
- Softened Chapter 1 decoration, clue, and exit layering so the final background, envelope clue, and case-door art read more naturally without changing pickup, elevator movement, exit routing, player physics, save/progression, or final verdict text.

## Part 51C - Integrated Chapter 1 platformer vertical-slice art

- Verified the Chapter 1 platformer final art assets for background, paper platforms, tutorial elevator, envelope clue, and case-door exit resolve through the safe platformer theme registry.
- Tuned the visual skin scaling so world backgrounds use real cover scaling while platform skins remain exact non-interactive companions to the authoritative collision rectangles.
- Added regression coverage for the Chapter 1 asset resolution path; no platformer geometry, hitboxes, movement, clue logic, exit routing, save/progression, VN/reveal/cinematic assets, puzzles, or final verdict text changed.

## Part 51B - Prepared platformer theme skin foundation

- Added an optional final-art registry for active platformer runtime Levels 1, 2, 4, 5, 6, and 9 under the future `src/assets/final/platformer/` asset root.
- Prepared `PlatformerScene` and `LevelBuilder` to preload and draw non-interactive visual skins only when mapped assets exist, while keeping Phaser rectangles/zones authoritative for physics, pickups, checkpoints, moving platforms, and exits.
- Preserved primitive platformer visuals as the fallback when final platformer art is missing; no geometry, movement constants, save/progression, puzzle logic, VN/reveal assets, or final verdict text changed.

## Part 50T - Verified Chapter 1-5 image-backed reveal screens

- Verified `RevealChapter01.webp` through `RevealChapter05.webp` are detected and used by the Chapter 1-5 post-puzzle `EvidenceRevealScene` flow.
- Updated regression coverage so Chapters 1-5 all assert image-backed reveal display, old UI suppression, no-scroll behavior, and preserved two-step completion/archive routing.
- Confirmed Chapter 6 Final Seal and FinalVerdictScene remain outside the reveal-image batch, with final verdict text unchanged.

## Part 50S - Verified Chapter 1 image-backed reveal style anchor

- Verified `RevealChapter01.webp` is detected and used by the Chapter 1 EvidenceRevealScene flow after Case Mosaic.
- Clamped the image-backed reveal frame to the viewport so desktop and mobile landscape use contained display with no page/body scroll or baked-text cropping.
- Updated regression coverage for Chapter 1 image-backed reveal behavior, Chapter 2 fallback reveal behavior, and the preserved two-step completion/archive flow.

## Part 50R - Prepared optional image-backed EvidenceRevealScene screens

- Added optional Chapter 1-5 reveal image mapping for `RevealChapter01.webp` through `RevealChapter05.webp` under `src/assets/final/reveals/`.
- Prepared `EvidenceRevealScene` to show a contained full-screen image-backed reveal only when a mapped reveal image exists, while preserving the current Phaser reveal fallback when files are missing.
- Preserved the existing two-step reveal flow, Chapter 6 final verdict boundary, save/progression behavior, routing behavior, and final verdict text.

## Part 50O - Full game visual flow QA from opening cinematic to final verdict

- Mapped `TheRightQuestionPuzzleNovel01.webp` to `vn-chapter-5-before-puzzle` so the Chapter 5 pre-puzzle case moment uses the same image-backed VN presentation as the other finished scenes.
- Added regression coverage for the Chapter 5 Right Question image-backed scene and its route into Trust Door Light Path.
- Performed full-flow visual QA without changing platformer geometry, puzzle mechanics, save/progression behavior, routing logic, or final verdict text.

## Part 50M - Verified Final Seal final puzzle assets and verdict routing

- Verified the Chapter 6 Final Seal background, final-seal board, and heart-core assets in game.
- Kept ring rotation, ring alignment, clue-light state, Unlock Verdict behavior, final verdict routing, save/progression, and final verdict text unchanged.
- Confirmed desktop and mobile-landscape layouts remain no-scroll with readable rings, clue lights, puzzle text, solved state, and verdict boundary.

## Part 50L - Prepared Final Seal puzzle for minimal final art assets

- Added optional final asset mapping for the Chapter 6 Final Seal background, seal board, and heart-core images.
- Layered future decorative board/core art behind the existing tap-rotated rings, clue lights, rays, labels, and unlock flow without changing puzzle logic.
- Preserved CSS fallback when those future assets are missing; no ring rotation, clue light logic, routing, save/progression, or final verdict text changed.

## Part 50K - Verified Trust Door Light Path final puzzle assets in-game

- Verified the Chapter 5 Trust Door Light Path background, trust-board, lantern-source, and Trust-door-target assets in game.
- Kept question text, mirror labels/glyphs, mirror rotation, dynamic light path, routing, save/progression, and final verdict text unchanged.
- Tightened the Chapter 5 mobile landscape progress row so the final board art, mirrors, endpoints, and actions remain readable without page scroll.

## Part 50J - Prepared Trust Door Light Path puzzle for minimal final art assets

- Added optional final asset mapping for the Chapter 5 Trust Door Light Path background, trust board, lantern source, and Trust door target images.
- Layered future decorative board/source/target art behind the existing question tiles, mirror controls, endpoints, and dynamic light path without changing puzzle logic.
- Preserved CSS fallback when those future assets are missing; no question text, mirror rotation, light path logic, routing, save/progression, or final verdict text changed.

## Part 50I-R1 - Cleaned Case File Sorting card polish and mobile readability

- Bypassed the bright Chapter 4 document card shell image in active presentation while keeping the asset mapping intact for future use.
- Restyled Case File Sorting document cards with code-rendered parchment surfaces, clearer mobile text, and stronger selected/drag/drop feedback.
- Kept the final archive board, background, and Silver Key image active without changing sorting logic, Silver Key gating, routing, save/progression, or final verdict text.

## Part 50I - Verified Case File Sorting final puzzle assets in-game

- Verified the Chapter 4 Case File Sorting puzzle detects and displays the final background, archive-board, document-shell, and Silver Key assets.
- Kept document titles, labels, roman numerals, correction text, progress, buttons, drag/drop, tap placement, Silver Key gating, routing, save/progression, and final verdict text unchanged.
- Tuned the Silver Key image blend inside the existing key button; a transparent-background key export is still recommended for the cleanest final polish.

## Part 50H - Prepared Case File Sorting puzzle for minimal final art assets

- Added optional final asset mapping for the Chapter 4 Case File Sorting background, archive file board, document card shell, and Silver Key image.
- Layered future decorative board/card/key images inside the existing DOM targets while keeping all document text, slot labels, roman numerals, correction text, buttons, drag/drop, tap placement, and Silver Key logic code-rendered.
- Preserved CSS fallback when those future assets are missing; no puzzle logic, routing, save/progression, or final verdict text changed.

## Part 50G-R2 - Cleaned Deposition Order strip presentation and mobile feedback

- Disabled active rendering of the Chapter 3 statement-strip shell WebP while keeping its resolver/mapping available for future use.
- Replaced the strip shell with a cleaner CSS parchment treatment, larger readable code-rendered text, stronger selected/drag/drop feedback, and tighter phone-landscape strip spacing.
- Preserved the witness-note paper/background, drag/drop, tap placement, ordering, completion, routing, save/progression, and final verdict text.

## Part 50G-R1 - Refined Deposition Order asset layering and drag feedback

- Warmed and blended the Chapter 3 statement-strip shell so it reads as parchment inside the witness-note puzzle instead of a harsh white card.
- Improved code-rendered statement text containment, mobile landscape strip sizing, placed-strip alignment, and selected/drag/drop-hover feedback without changing puzzle mechanics, text, routing, save/progression, or final verdict text.

## Part 50G - Verified Deposition Order final puzzle assets in-game

- Confirmed the Chapter 3 Deposition Order / Witness Note puzzle detects the final background, witness-note paper, and statement strip shell assets.
- Verified the final paper and strip-shell layers preserve code-rendered statement text, drag/drop, mobile tap placement, selected/drop-hover/correct states, archive-code reveal, and no-scroll mobile landscape layout.
- Tuned statement strip text contrast over the final parchment shell without changing puzzle logic, text, routing, save/progression, or final verdict text.

## Part 50F - Prepared Deposition Order puzzle for minimal final art assets

- Added optional final art asset mapping for the Chapter 3 Deposition Order / Witness Note puzzle background, witness-note paper, and statement strip shell.
- Layered future note-paper and statement-shell images behind the existing code-rendered slots, strips, and statement text while preserving drag/drop, tap placement, selected/correct/drop states, and CSS fallback.
- Added tests for expected future asset filenames and stable witness statement ordering; no puzzle mechanics, routing, save/progression, or final verdict text changed.

## Part 50E - Verified Hidden Wall final puzzle assets in-game

- Confirmed the Chapter 2 Route Tile / Hidden Wall puzzle detects the final background, tile shell, keyhole marker, and hidden-wall marker assets.
- Verified the decorative shell and marker layers preserve the dynamic SVG route-line mechanic, tile rotation, locked/connected states, and mobile tap behavior.
- Tuned marker image blending so light marker backgrounds recede behind the route lines without changing puzzle logic, text, routing, save/progression, or final verdict text.

## Part 50D - Prepared Hidden Wall route puzzle for minimal final art assets

- Added optional final art asset mapping for the Chapter 2 Route Tile / Hidden Wall puzzle background, tile shell, hidden-wall marker, and keyhole marker.
- Layered future decorative tile-shell and marker images under the existing dynamic route-line SVG while preserving tile buttons, ids, rotation logic, tap behavior, and CSS fallback.
- Added tests for expected future asset filenames and stable tile marker roles; no puzzle mechanics, routing, save/progression, or final verdict text changed.

## Part 50C - Sliced and tested Case Mosaic envelope piece assets

- Created the six final Chapter 1 Case Mosaic envelope piece WebP assets from `puzzle01-envelope-master.webp`.
- Used equal 3-column by 2-row source regions with a small inward trim on internal guide-line edges, then exported consistent 512px square pieces.
- Confirmed the existing Case Mosaic final-asset mapping detects the new files and added renderer coverage for image-backed piece markup; no puzzle mechanics, drag/drop behavior, routing, save/progression, or final verdict text changed.

## Part 50B - Prepared Case Mosaic envelope pieces for final image art

- Added optional final image asset mapping for the six Chapter 1 Case Mosaic envelope pieces under `src/assets/final/puzzles/`.
- Updated Case Mosaic piece rendering so final WebP art can appear inside the existing interactive piece DOM while preserving CSS/procedural `visualKind` fallback.
- Added tests for expected future asset filenames, piece-id-to-slot mapping, and fallback readiness; no puzzle mechanics, drag/drop behavior, routing, save/progression, or final verdict text changed.

## Part 49F - Integrated Chapter 6 intro and Final Seal VN image assets

- Mapped `vn-chapter-6-intro` to `SixthNovel01.webp`, `SixthNovel02.webp`, and `SixthNovel03.webp` through the existing image-backed VN asset registry.
- Mapped `vn-chapter-6-before-puzzle` to `TheFinalSealPuzzleNovel01.webp`.
- Aligned only the active Chapter 6 intro and pre-puzzle VN metadata with the designed image text while preserving the platformer and Final Seal puzzle handoff routes.
- Updated tests and docs; no opening cinematic, Case File / earlier VN mappings, main menu, gameplay, platformer geometry, puzzle mechanics, final verdict text, save/progression schema, or image files were changed.

## Part 49E - Integrated Chapter 4 Marginal Note and Chapter 5 Door of Trust VN image assets

- Mapped `vn-chapter-4-before-puzzle` to `MarginalNotePuzzleNovel01.webp` through the existing image-backed VN asset registry.
- Mapped `vn-chapter-5-intro` to `FifthNovel01.webp`, `FifthNovel02.webp`, and `FifthNovel03.webp`.
- Aligned only the active Chapter 4 pre-puzzle and Chapter 5 intro VN metadata with the designed image text while preserving puzzle/platformer handoff routes.
- Updated tests and docs; no opening cinematic, Case File / earlier VN mappings, main menu, gameplay, platformer geometry, puzzle mechanics, final verdict text, save/progression schema, or image files were changed.

## Part 49D - Integrated Chapter 3 and Chapter 4 intro VN image assets

- Mapped `vn-chapter-3-intro` to `ThirdNovel01.webp`, `ThirdNovel02.webp`, and `ThirdNovel03.webp` through the existing image-backed VN asset registry.
- Mapped `vn-chapter-4-intro` to `ForthNovel01.webp`, `ForthNovel02.webp`, and `ForthNovel03.webp`, preserving the exact project filename spelling.
- Aligned only the active Chapter 3 and Chapter 4 intro VN metadata with the designed image text while preserving the platformer handoff routes.
- Updated tests and docs; no opening cinematic, Case File / First Novel assets, Second Novel / Hidden Wall assets, main menu, gameplay, platformer geometry, puzzle mechanics, final verdict text, save/progression schema, or image files were changed.

## Part 49C - Integrated Chapter 2 intro and Hidden Wall pre-puzzle VN image assets

- Mapped `vn-chapter-2-intro` to `SecondNovel01.webp`, `SecondNovel02.webp`, and `SecondNovel03.webp` through the existing image-backed VN asset registry.
- Mapped `vn-chapter-2-before-puzzle` to `HiddenWallPuzzleNovel01.webp` and preserved the existing route into the Chapter 2 Route Tile Puzzle.
- Reused the Part 49B image-backed VN mode so these scenes hide the old coded dialogue panel, speaker card/nameplate, Skip button, Continue button, and duplicate text while keeping accessible status/metadata.
- Updated tests and docs; no opening cinematic, Case File / First Novel assets, main menu, gameplay, platformer geometry, puzzle mechanics, final verdict text, save/progression schema, or image files were changed.

## Part 49B - Integrated final Case File Frame and first VN image sequence

- Integrated `CaseFileFrame01.webp` as the visible first Case File screen after `Open Case`, preserving Enter/tap continue behavior and hidden accessibility text without duplicating the old coded case-file paper on top.
- Added a small final-image asset registry and mapped only `vn-chapter-1-intro` to `FirstNovel01.webp`, `FirstNovel02.webp`, and `FirstNovel03.webp`.
- Rendered the first Chapter 1 VN intro in image-backed mode, hiding the old coded VN panel, speaker card/nameplate, Skip button, Continue button, and duplicate text while preserving keyboard/tap advancement into the Chapter 1 platformer.
- Updated tests and docs; no opening cinematic, main menu background, later VN scenes, gameplay, platformer geometry, puzzle mechanics, final verdict text, save/progression schema, or image files were changed.

## Part 49A-R3 - Restored cinematic opening captions over final image sequence

- Restored the seven opening beat captions as elegant code-rendered cinematic intertitles over the final WebP sequence.
- Styled captions with warm ivory serif text, deep shadow, subtle amber glow, and a lower-screen readability gradient instead of VN dialogue panels, speaker nameplates, character cards, or UI frames.
- Added gentle caption fade timing with reduced-motion-safe behavior while preserving the full-screen image sequence and minimal Skip affordance.
- Updated opening content/e2e coverage and asset/readiness/QA docs without changing gameplay, platformer geometry, puzzle mechanics, visual novel chapter scenes, final verdict text, save/progression data, or image files.

## Part 49A-R2 - Integrated final Opening Cinematic WebP sequence as a clean movie-style opening

- Integrated `Opening01.webp` through `Opening07.webp` from `public/assets/final/opening/` into `OpeningCinematicScene` as a full-screen image sequence with crossfades, a subtle reduced-motion-safe drift, and a minimal Skip affordance.
- Hid the old visible opening captions, procedural placeholder visuals, VN-style presentation surfaces, decorative icon UI, and large opening controls during the cinematic; captions remain as screen-reader/status metadata only.
- Added base-path-safe public asset URL handling and regression coverage for the seven-frame mapping, hidden visual captions, image-only cinematic DOM, and first-frame loading.
- Updated asset, QA, architecture, readiness, and changelog docs; no gameplay, platformer geometry, puzzle mechanics, visual novel chapter scenes, final verdict text, save/progression data, or main menu/VN assets were changed.

## Part 48B - Cleaned platformer HUD/text clutter before visual assets

- Hid normal player world labels for platforms, moving platforms, checkpoints, exits, clues/interactables, tutorial hints, and location labels while keeping geometry label data and F1 dev-editor labels intact.
- Removed persistent platformer control and mute/status HUD text from normal gameplay; pause, mute, checkpoint, clue, and exit feedback remain brief and contextual.
- Kept mobile touch controls visible and accessibly labeled, and added tests/docs for the clean player HUD policy.
- No platformer geometry, puzzles, story/VN/final verdict text, dev overrides, save/progression data, or assets were changed.

## Part 48B - Prepared final asset-generation plan and first opening/main menu image prompt

- Locked the final art direction for generated assets around an elegant cinematic 2D storybook romantic legal mystery mood with Warsaw warmth, navy shadows, parchment, antique gold, burgundy leather, amber light, and subtle rose accents.
- Documented the first final asset target, `public/assets/final/opening-main-menu-office-desk.webp`, including the opening/main-menu prompt, negative prompt, UI-safe composition notes, and WebP size budget.
- Updated the asset pipeline, future asset order, first-asset integration strategy, release-readiness notes, and QA checklist for one-image-at-a-time generation and later Part 48C integration.
- Planning-only pass: no images, runtime code, gameplay, platformer geometry, puzzles, story/VN/final verdict text, dev overrides, or save/progression data were changed.

## Part 48A - Final wording cleanup before visual asset generation

- Confirmed the active opening case file uses the number-free clue-trail wording and the opening cinematic has only one `The case file opens.` caption.
- Tightened regression coverage for the approved final verdict text, post-acceptance case-closed line, current Missing Heart credits, active Chapter 6 final-seal naming, and updated AGENTS guidance.
- Updated AGENTS.md to note that active platformer geometry is now canonical and active root dev overrides are archived, while remaining root overrides are legacy/dev-only unless explicitly handled later.
- Left legacy internal package/save-key metadata unchanged to preserve save compatibility.

## Bake-7 - Completed active geometry bake audit and release-readiness QA

- Verified the active six-chapter platformer bake is complete: root overrides for runtime Levels 1, 2, 4, 5, 6, and 9 are absent, and their baked rollback JSON files are preserved under `dev-level-overrides/archive/`.
- Classified the remaining root override files `level-3.json`, `level-8.json`, and `level-10.json` as legacy/dev-only source-material overrides, not active player-facing chapter dependencies.
- Added regression coverage for active override archive status, remaining legacy root override inventory, and validation-clean active canonical geometries; updated release-readiness, level-plan, technical-architecture, and QA docs.
- No geometry, puzzles, story/VN/final verdict text, save/progression schema, assets, or dev routes were changed.

## Bake-6A - Archived baked Chapter 5 dev override and verified canonical geometry

- Verified canonical Chapter 5 / runtime Level 6 geometry keeps the accepted added support platforms, 112px `ch5_dev_elevator_001`, 112px `floating-brief-one`, moved choice doors, and removed obsolete supports, and still exits to PuzzleScene level 6.
- Moved `dev-level-overrides/level-6.json` to `dev-level-overrides/archive/level-6.baked-20260510.json` as rollback/reference so normal dev override loading no longer double-applies Level 6 edits or stale narrow platform values.
- Added a root override path regression and updated Chapter 5 bake QA/release docs; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, archived Level 1/2/4/5/9 overrides, and other chapters remain unchanged.

## Bake-6 - Baked Chapter 5 dev-editor layout overrides into canonical geometry

- Baked only `dev-level-overrides/level-6.json` into Chapter 5 / runtime Level 6 canonical platformer geometry.
- Applied the tuned courthouse corridor, choice-door spine, Silver Key ledge, Trust threshold, lantern descent, light bridge, elevator ascent, ribbon/letter ledge, checkpoint, clue, and fragment edits.
- Reviewed and baked the added static support platforms as intentional route/catch ledges; reviewed and baked `ch5_dev_elevator_001` as a mobile-safer 112px vertical lift instead of the override's 82px width.
- Reviewed the narrow `floating-brief-one` warning and intentionally baked it at 112px width while preserving its center path; removed obsolete static supports `echo-bridge`, `ch5_lantern_lower_catch`, `ch5_elevator_waiting_ledge`, and `ch5_unfinished_letter_ledge` after route review.
- Kept `dev-level-overrides/level-6.json` untouched as rollback/reference; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, archived Level 1/2/4/5/9 overrides, and other chapters remain unchanged.

## Bake-5A - Archived baked Chapter 6 dev override and verified canonical geometry

- Verified canonical Chapter 6 / runtime Level 9 geometry keeps the accepted 112px `final-rooftop-lift`, removed obsolete rooftop supports, validates cleanly without the root override, and still exits to PuzzleScene level 9.
- Moved `dev-level-overrides/level-9.json` to `dev-level-overrides/archive/level-9.baked-20260510.json` as rollback/reference so normal dev override loading no longer double-applies Level 9 edits or stale 70px lift values.
- Added a root override path regression and updated Chapter 6 bake QA/release docs; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, archived Level 1/2/4/5 overrides, and other chapters remain unchanged.

## Bake-5 - Baked Chapter 6 dev-editor layout overrides into canonical geometry

- Baked only `dev-level-overrides/level-9.json` into Chapter 6 / runtime Level 9 canonical platformer geometry.
- Applied the tuned rooftop climb, lowered moving lifts, bridge/lantern/light-platform path, clue-memory balcony, final court, heart seal, checkpoint, and clue-marker edits.
- Reviewed the 70px `final-rooftop-lift` warning and intentionally baked it at 112px width for mobile comfort while preserving its center path; removed obsolete static supports `ch6_rooftop_climb_mid` and `ch6_upper_skyline_path` after route review.
- Kept `dev-level-overrides/level-9.json` untouched as rollback/reference; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, archived Level 1/2/4/5 overrides, and other chapters remain unchanged.

## Bake-4A - Archived baked Chapter 1 dev override and verified canonical geometry

- Verified canonical Chapter 1 / runtime Level 1 geometry keeps the accepted tutorial elevator and supported checkpoint respawn, validates cleanly without the root override, and still exits to PuzzleScene level 1.
- Moved `dev-level-overrides/level-1.json` to `dev-level-overrides/archive/level-1.baked-20260510.json` as rollback/reference so normal dev override loading no longer double-applies Level 1 edits, the old unsupported respawn, or duplicate added elevator.
- Added a root override path regression and updated Chapter 1 bake QA/release docs; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, archived Level 2/4/5 overrides, and other chapters remain unchanged.

## Bake-4 - Baked Chapter 1 dev-editor layout overrides into canonical geometry

- Baked only `dev-level-overrides/level-1.json` into Chapter 1 / runtime Level 1 canonical platformer geometry.
- Applied the tuned office desk route, paper/folder steps, bookcase climb, high evidence shelf, upper return/descent, case-file desk, route marker, sealed-envelope position, and checkpoint edits.
- Reviewed and baked `ch1_dev_elevator_001` as a tutorial-friendly 102px-wide vertical elevator, and resolved the `ch1-route-checkpoint` respawn warning by baking `respawnX: 2580` instead of the override's unsupported `2640`.
- Kept `dev-level-overrides/level-1.json` untouched as rollback/reference; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, archived Level 2/4/5 overrides, and other chapters remain unchanged.

## Bake-3A - Archived baked Chapter 4 dev override and verified canonical geometry

- Verified canonical Chapter 4 / runtime Level 5 geometry keeps the Bake-3 128px drawer/lift widths, validates cleanly without the root override, and still exits to PuzzleScene level 5.
- Moved `dev-level-overrides/level-5.json` to `dev-level-overrides/archive/level-5.baked-20260510.json` as rollback/reference so normal dev override loading no longer double-applies Level 5 edits or stale 80px drawer/lift values.
- Added a root override path regression and updated Chapter 4 bake QA/release docs; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, archived Level 2/4 overrides, and other chapters remain unchanged.

## Bake-3 - Baked Chapter 4 dev-editor layout overrides into canonical geometry

- Baked only `dev-level-overrides/level-5.json` into Chapter 4 / runtime Level 5 canonical platformer geometry.
- Applied the tuned archive route platform, checkpoint, Marginal Note, Silver Key, correction note, and drawer/lift edits; the two 80px drawer/lift moving-platform warnings were intentionally baked at 128px width with centered path/position adjustments for mobile comfort.
- Kept `dev-level-overrides/level-5.json` untouched as rollback/reference; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, archived Level 2/4 overrides, and other chapters remain unchanged.

## Bake-2A - Archived baked Chapter 3 dev override and verified canonical geometry

- Verified canonical Chapter 3 / runtime Level 4 geometry matches the baked Level 4 override footprint, validates cleanly without the root override, and still exits to PuzzleScene level 4.
- Moved `dev-level-overrides/level-4.json` to `dev-level-overrides/archive/level-4.baked-20260510.json` as rollback/reference so normal dev override loading no longer double-applies Level 4 edits or reports stale deleted-id warnings.
- Added a root override path regression and updated Chapter 3 bake QA/release docs; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, and other chapters remain unchanged.

## Bake-2 - Baked Chapter 3 dev-editor layout overrides into canonical geometry

- Baked only `dev-level-overrides/level-4.json` into Chapter 3 / runtime Level 4 canonical platformer geometry.
- Applied the tuned riverbank, bridge footing, upper bridge, high crossing, underpass, witness-shadow, Witness Note, witness-fragment, archive-code, archive-reference, and checkpoint edits, and removed the obsolete `witness-note-ledge` static support after clean validation.
- Kept `dev-level-overrides/level-4.json` untouched as rollback/reference; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, archived Level 2 override, and other chapters remain unchanged.

## Bake-1A - Archived baked Chapter 2 dev override and verified canonical geometry

- Verified canonical Chapter 2 / runtime Level 2 geometry matches the baked Level 2 override footprint, validates cleanly without the root override, and still exits to PuzzleScene level 2.
- Moved `dev-level-overrides/level-2.json` to `dev-level-overrides/archive/level-2.baked-20260510.json` as rollback/reference so normal dev override loading no longer double-applies Level 2 edits or reports stale deleted-id warnings.
- Added a focused Chapter 2 canonical footprint regression and updated bake QA/release docs; puzzles, story/VN/final verdict text, save/progression schema, assets, dev routes, and other chapters remain unchanged.

## Bake-1 - Baked Chapter 2 dev-editor layout overrides into canonical geometry

- Baked only `dev-level-overrides/level-2.json` into Chapter 2 / runtime Level 2 canonical platformer geometry.
- Applied the tuned tram platforms, hidden-wall support route, Golden Stamp placement, keyhole trigger, checkpoint, wall lift, and rebuildable wall platform edits, and removed the obsolete `ch2_overhead_route` and `ch2_upper_wall_crossing` static platforms.
- Kept `dev-level-overrides/level-2.json` untouched as rollback/reference; puzzles, story/VN/final verdict text, save/progression schema, assets, and dev routes remain unchanged.

## Added Chapter 5 and Chapter 6 manual dev-editor polish workflow

- Added `docs/level-polish-workflow.md` with focused Chapter 5 elevator-ascent and Chapter 6 rooftop/floating-ascent polish workflows using the upgraded dev editor.
- Added timed late-chapter playtest criteria, mobile comfort checks, validation-marker usage, and override JSON backup policy before any future geometry bake.
- Documentation-only pass: no runtime code, canonical geometry, override files, gameplay, puzzles, story/VN/final verdict text, save/progression schema, or assets changed.

## Dev-4B - Added moving/elevator platform creation and duplication to dev editor

- Added dev-only Add Moving Platform and Add Elevator controls that create override-authored moving platforms with safe default path, speed, size, and unique ids.
- Extended `addedObjects` override handling so added moving/elevator platforms save, reload, validate, appear in the override summary, and can be tuned through the existing moving-platform inspector and endpoint handles.
- Added moving/elevator duplication and added-object deletion while keeping base moving-platform deletion deferred, canonical geometry untouched, and production editor exposure unchanged.

## Dev-8A - Planned safe bake workflow for dev editor overrides

- Added `docs/dev-editor-bake-plan.md` with override inventory, bake policy, safe/unsafe categories, validation gates, rollback plan, testing plan, and future script recommendations.
- Documented a manual Codex-assisted first bake policy with report-only tooling as the recommended next step.
- Planning-only pass: no runtime code, canonical geometry, override files, gameplay, puzzles, story, final verdict, save/progression, assets, or production behavior changed.

## Dev-7 - Added undo/redo, override summary, reset overrides, and export/import polish to dev editor

- Added dev-only undo/redo for core override-authoring mutations using session snapshots of override state, selected object id, deleted ids, and dirty ids.
- Added an override summary panel with modified/added/deleted counts, per-object selection/revert/remove actions, and deleted static-platform restore support.
- Added reset-current-level overrides, JSON-only override export, and validated JSON-only import while keeping canonical geometry, player saves, puzzles, story, final verdict text, assets, and production player flow unchanged.

## Dev-6.5 - Dev editor workflow QA and polish documentation

- Audited the Dev-2 through Dev-6 editor workflow as an override-authoring pipeline for static platforms, inspector edits, moving-platform tuning, checkpoint respawns, clue/exit support, validation, save/reload, and production gating.
- Added `docs/dev-editor-workflow.md` with the recommended level-polish loop, shortcuts, snap behavior, save/reload behavior, validation colors, production-safety notes, and current limitations.
- Documentation-only pass: no gameplay, puzzle mechanics, story/VN/final verdict text, save/progression schema, canonical geometry, assets, or production player flow changed.

## Dev-6 - Added full dev validation overlay for level authoring

- Added a dev-only level-wide validation overlay with Validate Level, Auto Validate, issue list, summary counts, issue selection, and optional scene markers.
- Added pure validation checks for duplicate/missing ids, invalid dimensions, world bounds, unsupported clues/interactables/exits, unsafe checkpoints/respawns, invalid moving-platform paths, mobile comfort warnings, and stale deleted override ids.
- Added validator and e2e smoke coverage while keeping canonical geometry, gameplay, puzzles, story, final verdict text, save/progression, assets, and production player flow unchanged.

## Dev-5 - Added checkpoint, clue/interactable, and exit editing with support validation

- Added dev-only checkpoint respawn editing with a Linked Respawn toggle, respawn marker visuals, trigger-to-respawn link line, and v2 override persistence for respawn coordinates.
- Added clue/interactable and exit positioning support in the inspector while keeping clue identity, required/progression roles, and exit target routes read-only.
- Added reusable selected-object support validation for clues/interactables, exits, checkpoint triggers, and checkpoint respawns; canonical geometry, gameplay, puzzles, story, final verdict text, save/progression, assets, and production player flow remain unchanged.

## Dev-4 - Added moving platform and elevator editing to dev editor

- Added dev-only moving/elevator platform inspector controls for axis, speed, and from/to path endpoints, with path preview handles and snap-aware endpoint dragging.
- Persisted moving platform speed/path edits through the existing v2 override `modifiedObjects` flow while keeping canonical geometry, gameplay, puzzles, story, final verdict text, save/progression, and production player flow unchanged.
- Added validation and unit coverage for moving platform path parsing, endpoint snapping, invalid speed/axis rejection, near-zero path rejection, world-bounds warnings, and moving-platform override application.

## Dev-3 - Added selected-object property inspector to dev editor

- Added a dev-only selected-object inspector to the F1 editor with id/type/kind/source/status display, numeric x/y and resizable width/height editing, static-platform label editing, and focused-input shortcut safety.
- Split Revert Unsaved, Revert Override, Delete Object, and Save All into clearer editor actions while preserving v2 override persistence for modified, added, and deleted static platform data.
- Added inspector parsing/status tests and updated dev-editor QA/readiness docs; gameplay, puzzle mechanics, story/VN/final verdict text, save/progression, canonical geometry, assets, and production player flow remain unchanged.

## Dev-2 - Added static platform creation, duplication, deletion, and snap-to-grid in dev editor

- Upgraded dev-level override persistence to a backward-compatible v2 shape with `modifiedObjects`, `addedObjects`, and `deletedObjectIds` while keeping old `objects` override files loadable.
- Added dev-only editor controls and shortcuts for adding, duplicating, deleting/hiding, snapping, saving, and reloading static platform overrides without touching canonical level geometry.
- Added override/schema/snap regression coverage and refreshed dev-editor QA/architecture/release docs; gameplay mechanics, platformer canonical geometry, puzzles, story, final verdict text, save/progression, assets, and production player flow remain unchanged.

## Part 47B - Added timed playthrough and real-device QA protocol

- Added `docs/timed-playthrough-protocol.md` with desktop production-preview timing, real iPhone/Android landscape testing, emulator spot-check guidance, chapter timing tables, pass/fail criteria, production-preview checks, helper-route notes, and a manual bug report template.
- Updated release readiness, QA, and pacing docs so timed human playthrough and real-device mobile QA are explicit gates before final visual asset generation unless the remaining risk is knowingly accepted.
- Documentation-only pass: no gameplay mechanics, puzzle mechanics, platformer geometry, VN/story copy, final verdict text, save/progression schema, assets, or dev routes changed.

## Part 47 - Full end-to-end playthrough QA and release readiness check before asset generation

- Audited the active six-chapter flow from opening/case archive through platformers, redesigned puzzles, clue reveals, Final Seal, FinalVerdictScene, and Accept Verdict without changing gameplay mechanics, geometry, save schema, assets, or final verdict text.
- Added a release-spine regression guard for the active chapter route ids, active puzzle ids, opening duration, platformer/puzzle timing metadata, old-module exclusions, and final verdict boundary.
- Updated release readiness, pacing, and QA docs with the current blocker classification: no known code-level blocker, but timed human playthrough and real-device mobile landscape QA remain required before sharing.

## Part 45G-R2 - Full QA pass for redesigned six-puzzle set

- Re-audited the six active redesigned puzzles after the platformer rebuilds: Case Mosaic, Route Tile Puzzle, Deposition Order, Case File Sorting, Trust Door Light Path, and Final Seal.
- Added a set-level content regression guard for puzzle duration targets, payoff terms, instruction brevity, and old-module exclusions while preserving all puzzle mechanics.
- Refreshed puzzle QA/readiness docs; platformer geometry, save/progression schema, dev routes, external assets, and the approved final verdict text remain unchanged.

## Part 46B - Full platformer QA pass across six rebuilt chapters

- Audited the six rebuilt active platformer chapters as one set for pacing metadata, authored vertical route markers, supported exits/checkpoints, and moving/elevator platform forgiveness.
- Tuned the two Chapter 2 tram platforms from speed 38 to speed 32 so the early moving-platform beat stays calmer for mobile landscape play.
- Added aggregate platformer QA regression coverage and updated level/QA/release docs while preserving puzzle mechanics, save/progression schema, dev routes, external assets, and the approved final verdict text.

## Part 46A-6 - Rebuilt Chapter 6 platformer layout with rooftop climbing and final court ascent

- Rebuilt only the active Chapter 6 / old Level 9 platformer route with a lower rooftop start, parapet/chimney climb, upper skyline path, rebuilt rooftop bridge, safe roof-gap descent, rooftop lantern route, supported Unfinished Letter ledge, clue-memory balcony, two wide slow floating court elevators, final court landing, heart seal platform, and supported final door.
- Added/adjusted four stable checkpoints and structural support coverage so the Unfinished Letter, rebuild trigger, rooftop lanterns, clue memory markers, heart seal, final door aura, checkpoint respawns, and Chapter 6 exit have safe standing platforms beneath or adjacent.
- Updated Chapter 6 geometry tests, QA docs, release readiness notes, and changelog while preserving Chapters 1-5, puzzle mechanics, save/progression schema, dev routes, external assets, mobile controls, and the approved final verdict text.

## Part 46A-5 - Rebuilt Chapter 5 platformer layout with courthouse verticality and elevator ascent

- Rebuilt only the active Chapter 5 / old Level 6 platformer route with a lower courthouse corridor, Hope/Trust choice-door spine, supported Silver Key ledge, Trust threshold, lantern descent, revealed light bridge, three wide slow vertical elevators, supported Blue Ribbon pages, unfinished-letter ledge, and supported case-door exit.
- Added/adjusted four stable checkpoints and structural support coverage so the Silver Key, Trust door, lantern switch, lantern-pages fragment, Blue Ribbon / unfinished-letter fragment, checkpoint respawns, and Chapter 5 exit have safe standing platforms beneath or adjacent.
- Updated Chapter 5 geometry tests and QA docs while preserving Chapters 1-4, Chapter 6, puzzle mechanics, save/progression schema, dev routes, external assets, mobile controls, and the approved final verdict text.

## Part 46A-4 - Rebuilt Chapter 4 platformer layout with archive verticality and silver-key destination

- Rebuilt only the active Chapter 4 / old Level 5 platformer route with a lower archive aisle, archive-code drawer, vertical file-cabinet climb, upper archive shelf path, retained archive-key/locked-door beat, slow drawer lift, lower correction aisle, marginal-note/file-spine climb, supported Silver Key landing, and supported courthouse-index exit.
- Added/adjusted three stable checkpoints and structural support coverage so the Marginal Note, archive key, locked door, `No. Given.` correction note, file-spine key note, Silver Key pickup, checkpoint respawns, and Chapter 4 exit have safe standing platforms beneath or adjacent.
- Updated Chapter 4 geometry tests and QA docs while preserving Chapters 1-3, Chapters 5-6, puzzle mechanics, save/progression schema, dev routes, external assets, mobile controls, and the approved final verdict text.

## Part 46A-3 - Rebuilt Chapter 3 platformer layout with river and bridge verticality

- Rebuilt only the active Chapter 3 / old Level 4 platformer route with a lower Vistula bank, three wide slow drifting-paper platforms, bridge climb, upper overpass, under-bridge descent, supported witness-note area, archive-code step, and supported riverbank exit.
- Added/adjusted three stable checkpoints and structural support coverage so the Witness Note, witness silhouette, archive-code marker, archive-code fragment, checkpoint respawns, and Chapter 3 exit have safe standing platforms beneath or adjacent.
- Updated Chapter 3 geometry tests and QA docs while preserving Chapters 1-2, Chapters 4-6, puzzle mechanics, save/progression schema, dev routes, external assets, mobile controls, and the approved final verdict text.

## Part 46A-2 - Rebuilt Chapter 2 platformer layout with vertical hidden-wall route

- Rebuilt only the active Chapter 2 platformer route with a fuller tram/city path, two slow tram platforms, elevated route-sign path, supported golden-stamp ledge, rebuilt-street scaffold climb, supported keyhole floor, slow hidden-wall lift, upper wall crossing, and Vistula wave-mark descent.
- Added/adjusted three safe checkpoints and structural support coverage so the Golden Stamp, keyhole trigger, red-brick/wave clue markers, checkpoint respawns, and Chapter 2 exit have safe standing platforms beneath or adjacent.
- Updated Chapter 2 geometry tests and QA docs while preserving Chapter 1, Chapters 3-6, puzzle mechanics, save/progression schema, dev routes, external assets, mobile controls, and the approved final verdict text.

## Part 46A-1 - Rebuilt Chapter 1 platformer layout and fixed interactable support

- Rebuilt only the active Chapter 1 platformer route with a wider kancelaria desk path, file-stack/bookcase climb, upper shelf crossing, safe descent, final case-file desk, glowing route ledge, and supported case-door exit.
- Moved the Sealed Envelope clue and final checkpoint onto unambiguous static support so the required clue, checkpoint respawns, and exit all have safe standing platforms beneath or adjacent.
- Added Chapter 1 structural geometry tests and QA docs for required-object support while preserving Chapters 2-6, puzzle mechanics, save/progression schema, dev routes, external assets, and the approved final verdict text.

## Part 46A-R2 - Structurally rebuilt platformer chapters for vertical, elevated traversal

- Rebuilt all six active platformer chapter layouts with stronger authored route shapes: Chapter 1 office shelf climb/descent, Chapter 2 tram-to-wall vertical route, Chapter 3 bridge up/down investigation, Chapter 4 archive shelf/drawer loop, Chapter 5 courthouse lantern/elevator ascent, and Chapter 6 rooftop climb into final court.
- Updated active platformer duration metadata to the new 75-150 second chapter targets while preserving puzzle mechanics, save/progression schema, dev routes, external asset policy, mobile touch controls, and the approved final verdict text.
- Expanded geometry regression coverage and platformer QA docs around vertical span, moving/elevator platform requirements, stable checkpoints, clue destinations, and mobile-friendly traversal.

## Part 46A - Enriched platformer chapters with verticality and authored traversal

- Added authored vertical/direction-change beats to active platformer chapters: Chapter 1 file-shelf climb, Chapter 2 hidden-wall lift, Chapter 3 bridge upper/lower movement, and Chapter 4 lower archive aisle/return stack.
- Kept Chapter 5 and Chapter 6 elevator/floating finale structures intact while preserving puzzle mechanics, save/progression schema, dev routes, external asset policy, and the approved final verdict text.
- Added geometry regression coverage for the active six-chapter authored routes and documented the new platformer QA/readiness expectations.

## Part 45G-R2 - Full QA pass for redesigned six-puzzle set

- Added explicit content regression coverage for the six active mechanics-driven chapter puzzle routes: Case Mosaic, Route Tile Puzzle, Deposition Order, Case File Sorting, Trust Door Light Path, and Final Seal.
- Added desktop Playwright completion coverage for all six redesigned puzzles using click/tap fallback, matching the existing mobile-landscape tap-completion smoke.
- Tightened final verdict e2e coverage so Chapter 6 puzzle success opens the verdict without setting `gameCompleted`, while Accept Verdict still marks the case complete.
- Updated puzzle QA, pacing/readiness docs, release readiness notes, and this changelog without changing puzzle mechanics, platformer geometry, save schema, external assets, or approved final verdict text.

## Part 45F-R2 - Implemented Chapter 6 Final Seal Ring / Constellation puzzle

- Replaced the active Chapter 6 token-slot final seal with a three-ring `Final Seal: The Court of the Heart` puzzle: each tap-rotated ring lights two clue marks until all six clues point to the heart.
- Kept the retained `final-verdict-assembly` route/module for compatibility while removing token-slot matching from the active final puzzle logic and e2e tap path.
- Updated tests, e2e selectors, QA/docs, and content metadata while preserving Chapter 1-5 puzzles, save/progression schema, platformer geometry, dev routes, and the approved final verdict text.

## Part 45E-R2 - Implemented Chapter 5 Trust Door Light Path puzzle

- Replaced the active Chapter 5 player-facing Echo Path route with `Trust Door Light Path`, combining the right-question beat with a three-mirror lantern light path to Trust.
- Added pure Trust Light Path logic, DOM renderer, mobile-landscape styling, unit tests, and e2e tap-fallback coverage while retaining old Echo Path as source/legacy material.
- Updated Chapter 5 content/docs so the Trust door, lantern, blue-ribbon pages, and unfinished-letter payoff remain aligned without changing save/progression, platformer geometry, Chapter 1-4/6 puzzles, or final verdict text.

## Part 45D-R2 revised - Replaced Chapter 3 and Chapter 4 puzzles and fixed Case Archive panel layout

- Replaced the active Chapter 3 player-facing puzzle with `Deposition Order: The Witness Note`, a four-strip document reconstruction that reveals the archive code.
- Replaced the active Chapter 4 player-facing puzzle with `Case File Sorting: No. Given.`, a five-document archive-order puzzle that reveals `No. Given.` and requires taking the Silver Key before filing the clue.
- Expanded the Case Archive panel into a responsive 2x3 chapter grid so all six chapter cards, including Chapters 5 and 6, stay inside the frame on desktop and mobile landscape.
- Added pure logic tests, content/registry updates, mobile e2e tap-fallback coverage, QA/docs, and layout assertions while preserving Chapter 1/2/5/6 puzzles, platformer geometry, save/progression schema, dev routes, and final verdict text.

## Part 45D-R2 - Implemented Chapter 4 Archive Overlay / streamlined magnifier puzzle

- Converted active Chapter 4 to `Archive Overlay: The Marginal Note` while keeping the retained `archive-detail-finder` route/module.
- Replaced the old four-detail bookmark checklist with three generous marked margin zones, a clear `No. Given.` correction reveal, and a required Silver Key tap before File Clue.
- Updated archive puzzle logic/tests, mobile e2e tap-fallback coverage, QA/docs, and content metadata while preserving Chapters 1-3 and 5-6 puzzles, save/progression, platformer geometry, and final verdict text.

## Part 45C-R2 - Polished Chapter 1 Case Mosaic and streamlined Chapter 3 Witness Lens

- Kept Chapter 1 as `Case Mosaic: The Sealed Envelope` and added a clearer solved payoff with Brass Key, Tram Ticket, and Glowing Route while preserving the six-piece 3x2 mosaic logic.
- Streamlined Chapter 3 `Witness Lens` so tapping statements inspects them, the Contradiction stamp marks the false line, and the archive code appears after the correct stamp.
- Updated puzzle tests, mobile e2e tap-fallback coverage, QA/docs, and content metadata while preserving Chapter 2 Route Tile Puzzle, Chapters 4-6 puzzles, save/progression, platformer geometry, and final verdict text.

## Part 45B-R2 - Implemented Chapter 2 Route Tile Puzzle

- Restored active Chapter 1 to `Case Mosaic: The Sealed Envelope`, with six envelope pieces, tap/drag placement, and the restored clue payoff.
- Added the new active Chapter 2 `route-tile-puzzle` module: six large tap-to-rotate tiles connect the Stamped Ticket, Golden Stamp, Keyhole, Hidden Wall, and Wave Mark.
- Updated puzzle routing, content metadata, VN handoff copy, tests, e2e selectors, and docs while preserving Chapters 3-6 puzzles, save/progression schema, platformer geometry, dev/source modules, and final verdict text.

## Part 45A-R2 - Planned mechanics-driven puzzle redesign

- Superseded the clue-interaction-only puzzle plan with a mechanics-driven redesign direction for six short real puzzles.
- Restored Chapter 1 Case Mosaic as the intended direction, redesigned Chapter 2 as a route tile puzzle, and planned stronger mechanics for Chapters 4-6 while keeping Chapter 3 Witness Lens.
- Documented mobile/tap-first constraints, image-puzzle variation, and the Part 45B-R2 through Part 45H roadmap without changing runtime code, save/progression, assets, or final verdict text.

## Part 45B - Converted Chapter 1 and Chapter 2 puzzles into short clue interactions

- Converted the active Chapter 1 `case-mosaic` route from a six-piece mosaic into an Open Envelope / Route Glow interaction: tap the envelope, reveal the Brass Key and Tram Ticket, tap the ticket, then file the clue.
- Converted the active Chapter 2 `rebuild-puzzle` route from a rotating repair board into a Hidden Wall / Wave Mark interaction: tap the Brass Key, keyhole, and three wall marks to reveal the Vistula mark.
- Updated active puzzle copy, small VN handoff/status labels, unit tests, mobile e2e selectors, and docs while preserving chapter flow, save/progression schema, Chapters 3-6 puzzles, assets, dev routes, and the approved final verdict text.

## Mobile touch controls and tap-fallback QA pass

- Hardened platformer touch controls so held movement/jump state is cleared on pointer cancel, lost capture, browser blur, tab visibility changes, and scene shutdown.
- Enlarged phone-landscape Left/Right/Jump hit areas while preserving desktop keyboard controls and the fine-pointer desktop touch-control hiding rule.
- Expanded mobile-landscape Playwright coverage across all six chapter platformer routes and added tap-fallback completion smoke for Case Mosaic, Echo Path, and Final Seal.
- Updated QA, architecture, and release-readiness docs; real-device iPhone Safari and Android Chrome full playthroughs remain required before sharing.

## Part 44G.5 - Final wording cleanup before asset generation

- Replaced the opening case-file `Ten clues` line with a number-free clue-trail sentence for the final six-chapter structure.
- Removed the duplicate late opening-cinematic caption and softened active Chapter 6 pre-verdict wording to `Final Seal: The Court of the Heart` / `The Heart Seal`.
- Updated AGENTS guidance, docs, and tests for the current 6-chapter Missing Heart direction while leaving the legacy save key unchanged and preserving the approved final verdict text.

## Part 44F - Mobile/browser QA and responsive polish after pacing simplification

- Added mobile-landscape smoke coverage for Chapter 5 and Chapter 6 platformer routes, including visible touch controls and no document scroll.
- Added viewport coverage for FinalVerdictScene across desktop/laptop sizes and for the portrait rotate fallback.
- Cleaned mobile touch-control labels so left/right controls render readably while preserving platformer input behavior.
- Kept the final verdict certificate action row inside the viewport on smaller desktop/laptop heights without changing the approved verdict text.
- Updated QA, architecture, and release-readiness docs; real-device iPhone Safari/Android Chrome testing remains an explicit manual release gate.

## Part 44E - Simplified Chapter 5 Door of Trust puzzle interaction

- Kept Echo Path as the active Chapter 5 puzzle and focused it into one quick interaction: choose the right question, use the Silver Key on Trust, then open the door.
- Added lantern, blue-ribbon pages, and unfinished-letter payoff to the Echo Path success/reveal continuity without requiring the retained Lantern Sequence or Argument Tower modules in active Chapter 5.
- Updated tests, e2e coverage, and docs for the simplified Door of Trust flow while preserving Chapter 1-4 puzzles, Chapter 6 final seal, save/progression, dev routes, and final verdict text.

## Part 44D - Tuned platformer chapter lengths, checkpoints, and moving-platform feel

- Updated active chapter and platformer duration metadata to match the 10-15 minute birthday-gift target while keeping the expanded six-chapter structure.
- Made active moving-platform sections more forgiving by widening/slowing Chapter 2 tram cars, Chapter 3 drifting papers, the Chapter 4 archive drawer, Chapter 5 elevators, and Chapter 6 floating lifts.
- Moved the Chapter 6 pre-ascent checkpoint closer to the floating final-court climb so missed jumps replay less rooftop traversal.
- Updated geometry/content tests and QA/docs while preserving platformer routes, puzzle mechanics, save/progression, dev routes, assets, VN flow, and final verdict text.

## Part 44C - Compressed VN and clue reveal flow for 10-15 minute target

- Shortened active chapter VN copy so intros are three lines or fewer and retained pre/after puzzle chapter VN scenes are one-line transitions.
- Compressed active routing: Chapters 1 and 3 now skip pre-puzzle VN, Chapters 1-5 route puzzle success directly to concise clue reveals, and Chapter 6 routes the final seal directly to FinalVerdictScene.
- Tightened clue reveal copy and reveal motifs for the active chapter handoffs while preserving platformer geometry, puzzle mechanics, save/progression, and the approved final verdict text.
- Updated tests and documentation for the lighter active story flow while keeping legacy/dev VN routes targetable.

## Part 44B - Simplified Chapter 6 final puzzle into a fast final seal moment

- Reworked the active Level 10/Chapter 6 final puzzle content from ten ordered meaning fragments into six ceremonial clue tokens: Envelope, Wall, Witness, Correction, Trust, and Heart.
- Updated the final puzzle copy to `Final Seal: The Heart, Freely Given`, with a 20-40 second target and the existing drag/drop plus tap-to-place interaction model.
- Preserved the Chapter 6 after-puzzle VN and FinalVerdictScene routing; `gameCompleted` is still marked only after Accept Verdict, and the approved final verdict text is unchanged.
- Updated tests, e2e smoke helpers, and docs to cover the six-token final seal and remove active ten-fragment expectations.

## Part 44A - Locked 10-15 minute scope with richer platformer pacing plan

- Added `docs/final-scope-and-pacing-plan.md` as the new pacing source of truth, superseding the earlier 20-28 minute target with a 10-15 minute birthday-gift scope.
- Documented the final rhythm: richer 60-135 second platformer chapters, faster 20-45 second puzzles/interactions, shorter VN beats, concise clue reveals, and a fast Chapter 6 final seal moment.
- Updated level, content-style, and QA docs with the new scope lock while making no runtime code, geometry, puzzle mechanic, save/progression, asset, or final verdict changes.

## Fixed desktop/mobile adaptive puzzle shell sizing and tray overflow

- Removed the late presentation cap that forced puzzle panels back to a small desktop card and replaced it with the adaptive full-screen puzzle shell sizing.
- Contained the Case Mosaic piece tray as a bounded 2x3 desktop grid so it cannot spill into the progress or action button rows.
- Strengthened desktop and mobile Playwright layout checks for Case Mosaic panel size, tray/action separation, visible slots, visible pieces, and no document scroll.

## Fixed adaptive puzzle layout for desktop and mobile

- Replaced the overly constrained desktop puzzle panel sizing with a viewport-generous adaptive shell so desktop puzzles no longer appear tiny or clip the action footer.
- Preserved the short-landscape compact puzzle mode for mobile while tightening shared board/tray `min-height: 0` behavior across active puzzle layouts.
- Added desktop Case Mosaic Playwright coverage alongside the existing mobile-landscape puzzle viewport checks.

## Mobile-safe responsive puzzle layout pass

- Added a short-landscape responsive puzzle shell so active puzzle panels, boards, trays, feedback, and action buttons stay inside the mobile viewport without enabling page scroll.
- Tightened compact layouts for Case Mosaic, Rebuild Puzzle, Witness Lens, Archive Detail Finder, Echo Path, Final Verdict Assembly, and the retained Case Timeline dev puzzle while preserving drag/drop and tap fallback behavior.
- Added Playwright mobile-landscape coverage for all six active chapter puzzle routes to catch clipped boards, trays, or action buttons.

## Full-screen mobile layout and no-scroll policy pass

- Locked the browser document and game shell to a viewport-sized full-screen app layout using the responsive `--app-height` shell variable.
- Tightened DOM overlays so opening, title/settings/reset, Case Archive, VN, puzzle, final verdict, and credits screens stay inside the visible viewport instead of creating page scroll.
- Added short mobile-landscape compact layouts for the Case Archive, settings/reset, puzzles, and final verdict, plus Playwright no-scroll smoke coverage.

## Opening Start Background Alignment

- Updated the opening start screen to use the same office-desk background image as the main menu, keeping the existing Start overlay and menu scene behavior unchanged.
- Removed the visible opening-start title and replaced the old transparent hit area with one central burgundy/gold Start button that begins the opening cinematic.
- Updated the opening cinematic visual stage to use the shared office-desk background and enlarged the visual novel presentation so scenes occupy much more of the viewport with larger dialogue, portrait, and action surfaces.
- Moved the shared office background to the full opening-cinematic screen layer instead of the inset cinematic stage, and made the VN frame nearly full-screen across desktop and compact landscape layouts.

## Part 43 - Updated visual asset plan for final expanded 6-chapter game

- Rewrote `docs/visual-asset-prompt-plan.md` around the final expanded six-chapter structure, including opening cinematic, main menu, VN backgrounds, platformer motifs, puzzle boards, clue icons, final court/verdict visuals, priority order, and future integration loop.
- Updated supporting visual, asset-budget, replacement, and release-readiness docs so old 10-level visual notes are legacy/source material and Chapter 5-6 late-game traversal needs are reflected.
- Added no image files, external assets, gameplay changes, VN text changes, puzzle changes, save/progression changes, or final verdict changes.

## Part 42O - Full 6-chapter pacing QA after expanded platformers and rewritten continuity

- Rechecked the active six-chapter pacing model after the Chapter 1-6 traversal expansions and Part 42N continuity rewrite.
- Updated chapter duration metadata for Chapters 1-4 to match the final 20-28 minute target pacing and refreshed active chapter notes for the Chapter 2 and Chapter 5 expansion state.
- Documented the Part 42O QA status, remaining real-device/timed-playthrough risks, and preserved saveVersion, dev routes, geometry structure, puzzle mechanics, assets, and final verdict text.

## Part 42N - Rewrote VN and puzzle success text for final 6-chapter continuity

- Rewrote the active `vn-chapter-*` intro, pre-puzzle, and post-puzzle scenes so the six chapters read as one continuous trail from envelope to verdict.
- Updated active puzzle framing and success copy for the envelope, hidden wall, witness note, archive margin, Trust door, and final seal without changing puzzle mechanics.
- Aligned chapter clue reveal/planning copy and content tests around clue-filed language while preserving saveVersion, geometry, dev routes, and the approved final verdict text.

## Part 42M - Rebuilt Chapter 6 finale traversal with rooftops, floating ascent, and final court continuity

- Expanded the active Chapter 6 retained Level 9 platformer from a short rooftop approach into a longer finale route with prior clue memory markers, three wide slow floating elevators, final court staging, heart-seal/final-door payoff, and an extra checkpoint.
- Updated Chapter 6 pacing/content metadata and final puzzle success copy so Unfinished Letter -> prior clues -> final court seal -> verdict continuity is visible without changing the approved final verdict text.
- Added Chapter 6 geometry/content tests and documentation notes while preserving old Level 9-10 dev routes, saveVersion, FinalVerdictScene completion boundary, puzzle mechanics, external assets, and old source material.

## Part 42L - Rebuilt Chapter 5 with elevator/vertical mechanics and Door of Trust continuity

- Expanded the active Chapter 5 retained Level 6 platformer from a short courthouse spine into a longer Door of Trust route with lantern reveal, three wide slow vertical elevators, blue-ribbon pages, unfinished-letter handoff, and extra checkpoints.
- Updated Chapter 5 pacing/content metadata and Echo Path success copy so Silver Key -> Trust Door -> Lantern -> Blue Ribbon -> Unfinished Letter continuity is visible through platformer, puzzle, VN/reveal, and clue-chain surfaces.
- Added Chapter 5 geometry/content tests and documentation notes while preserving old Level 6-8 dev routes, saveVersion, Chapter 6/final verdict behavior, puzzle mechanics, external assets, and old source material.

## Part 42K - Expanded Chapter 3 and Chapter 4 platformers and clue continuity

- Expanded Chapter 3's retained Level 4 platformer route with stronger Vistula/witness staging, a post-note archive-code path, and an archive-reference handoff.
- Expanded Chapter 4's retained Level 5 platformer route with clearer archive-code and "No. Given." staging, optional silver-key pickup, courthouse-index ending, and a third checkpoint.
- Added geometry/content tests and documentation notes while preserving old dev routes, saveVersion, puzzle mechanics, Chapters 1-2 and 5-6 geometry, external assets, and final verdict text.

## Part 42J - Expanded Chapter 1 and Chapter 2 platformers and clue continuity

- Expanded Chapter 1's retained Level 1 platformer route with a safe route-awakening ending, brass key/tram ticket handoff, and a second checkpoint.
- Expanded Chapter 2's retained Level 2 platformer route with a longer tram-to-hidden-wall path, golden validator beat, keyhole rebuild trigger, Vistula wave-mark handoff, and three checkpoints.
- Added geometry/content tests and documentation notes while preserving old dev routes, saveVersion, puzzle mechanics, Chapters 3-6 geometry, external assets, and final verdict text.

## Part 42H.5 - Six-chapter expansion and continuity audit

- Added `docs/six-chapter-expansion-audit.md` with a chapter-by-chapter audit of current six-chapter length, mechanics, clue continuity, puzzle connection, and VN pacing.
- Identified the main expansion needs: richer Chapters 1-2, clearer witness/archive continuity, restored Chapter 5 lantern/elevator/vertical ascent, and a more ceremonial Chapter 6 court approach.
- Updated migration and level-plan docs to reference the new expansion blueprint; no runtime code, geometry, puzzle, save, asset, or final verdict changes were made.

## Part 42I - Updated visual asset plan for final 6-chapter game

- Rewrote `docs/visual-asset-prompt-plan.md` around the active six-chapter game instead of the old 10-level visual plan.
- Updated supporting asset budget, replacement, and visual-style docs to prioritize opening/menu art, six chapter VN backgrounds, six chapter puzzle boards, clue bundle icons, platformer motifs, and final verdict seal support.
- Added no image files, external assets, gameplay changes, VN text changes, puzzle changes, save changes, or final verdict changes.

## Part 42H - Full 6-chapter QA and balancing pass

- Cleaned remaining player-facing navigation prompts to use `Case Archive` language across title, archive, fallback, puzzle, and reveal surfaces.
- Expanded smoke coverage for the six-chapter unlock ladder and the verdict-to-credits-to-archive completion loop.
- Documented the current six-chapter QA status, retained old dev-route policy, save bridge status, and remaining real-device/timed-playthrough risks.

## Part 42G - Archived legacy 10-level player-facing flow and cleaned chapter tests

- Updated player-facing smoke coverage around the 6-chapter Case Archive, chapter bridge routing, Chapter 6 verdict boundary, and retained old dev routes.
- Documented legacy old-level content as bridge/dev/source material rather than deleting modules that active chapter wrappers or debug routes still depend on.
- Confirmed the save bridge remains on `saveVersion` 1 with old completion ids while normal player UI shows `/6 chapters closed`.

## Part 42F - Converted Chapter 5 and Chapter 6 into active chapter flows

- Added chapter-aware VN, platformer, puzzle, and reveal/finale routing for Chapters 5 and 6 while preserving old Level 6-10 dev routes.
- Implemented Chapter 5 as a safe Door of Trust bridge using old Level 6 geometry and Echo Path, with lantern and blue-ribbon continuity in VN/reveal content.
- Implemented Chapter 6 as a finale bridge using old Level 9 rooftops and old Level 10 Final Verdict Assembly, routing through chapter VN to FinalVerdictScene without changing the approved verdict text or completion boundary.

## Part 42E - Converted Chapter 3 and Chapter 4 into active chapter flows

- Added chapter-aware VN, platformer, puzzle, and reveal routing for Chapters 3 and 4 while preserving old Level 4-5 dev routes.
- Implemented Chapter 3 through old Level 4 river geometry and Witness Lens, and Chapter 4 through old Level 5 archive geometry and Archive Detail Finder.
- Moved the silver-key reveal into Chapter 4 story/reveal content without changing save schema, final verdict text, or old Level 6 runtime routes.

## Part 42D - Converted Chapter 1 and Chapter 2 into active chapter flows

- Added chapter-aware VN, platformer, puzzle, and reveal routing for Chapters 1 and 2 while preserving old Level 1-3 dev routes.
- Implemented Chapter 1 through old Level 1 geometry and Case Mosaic, and Chapter 2 as a safe hybrid using old Level 2 geometry plus old Level 3 Rebuild Puzzle.
- Added chapter bridge tests for active flow metadata, Chapter 1-2 VN routes, chapter dev query params, and bridge progression without changing `saveVersion`.

## Part 42C - Switched player-facing Case Archive to 6-chapter bridge

- Updated Level Select to render six chapter cards from the chapter content model instead of the old 10-level player-facing grid.
- Added a ChapterBridge system that maps chapter availability and Play/Replay actions onto safe legacy level routes while preserving the old save schema and dev routes.
- Added bridge tests for chapter rows, unlock/completion inference, Chapter 6 final completion, and legacy 10-level availability.

## Part 42B - Added 6-chapter content model beside existing 10-level runtime

- Added typed future chapter contracts plus six inactive chapter specs for the planned tighter chapter structure.
- Added future chapter puzzle plans, VN outlines, and clue-chain continuity data without switching active gameplay routing.
- Added chapter content tests and documentation notes confirming the current 10-level runtime, save/progression, Level Select, puzzle routes, VN routes, and final verdict flow remain unchanged.

## Part 42A - Six-chapter migration plan

- Added `docs/six-chapter-migration-plan.md` with a planning-only roadmap for reducing the active game from 10 levels to 6 stronger chapters.
- Audited current level, puzzle, VN, save/progression, Level Select, final verdict, dev route, and test coupling before proposing the migration.
- Recommended a staged chapter-layer migration that preserves old level modules and save safety until the 6-chapter flow is proven.

## Opening start background image update

- Added the supplied `mainback.webp` as a separate opening Start screen background.
- Updated only the first opening screen background reference; the later main menu background remains unchanged.
- Updated credits for the user-provided opening background image.

## Opening start button overlay and title text adjustment

- Replaced the separate visible opening Start control with a transparent real HTML button aligned over the baked Start artwork.
- Added a code-rendered opening title reading `Case of the Missing Heart` inside the artwork frame while leaving the global game title unchanged.
- Documented the responsive artboard alignment used to keep the Start hit area usable across desktop and mobile landscape.

## Opening start background alignment

- Reused the current main menu background image on the first OpeningStartScene so the initial browser view matches the title art direction.
- Removed the opening start screen's procedural overlay layer so the shared background art displays without an extra filter.

## Main menu background filter removal

- Removed the full-screen navy vignette overlay from the title menu background so the supplied artwork displays without a blue filter.
- Disabled backdrop blur on the main menu panel so the background art remains sharp behind and around the title frame.

## Part 42 - Visual asset prompt plan for connected clue trail

- Added `docs/visual-asset-prompt-plan.md` as the source of truth for future image-generation prompts, naming, budgets, priorities, and integration notes.
- Planned opening cinematic, main menu, VN background, puzzle board, clue icon, character/silhouette, and UI frame asset categories around the connected clue trail.
- Updated asset budget, replacement, and visual style docs with no generated images, external assets, gameplay changes, VN text changes, or final verdict changes.

## Part 41 - Visual clue-chain continuity pass

- Added a data-driven clue-chain content layer that maps each filed clue to the next clue, location, hint, action label, visual motif, and puzzle success follow-up.
- Updated EvidenceRevealScene and Level Select to show concise next-clue continuity while preserving save/progression and scene routing.
- Added second-line puzzle success feedback for the active redesigned puzzles so solved states visibly point toward the next step without changing puzzle mechanics.

## Part 40 - Connected clue-trail VN and puzzle narrative rewrite

- Rewrote the active VN scenes for Levels 1-10 so the case now follows one continuous clue trail from the sealed envelope to the Court of the Heart.
- Updated opening case file copy, clue descriptions, reveal follow-up lines, and opening cinematic captions to support the missing-heart investigation.
- Reframed active puzzle titles, instructions, feedback, and tests around clue filing/revealing while preserving puzzle mechanics, scene routes, save/progression, and the approved final verdict text.

## Part 39 — Story reframe foundation, new title, and clue language

- Changed the player-facing title to `Maria and the Case of the Missing Heart` and the Polish subtitle to `Sprawa Zaginionego Serca`.
- Added `docs/story-bible.md` as the new narrative source of truth for the connected clue trail, case file, and future VN/puzzle rewrites.
- Reframed obvious player-facing UI/story language from exhibit/admitted wording toward clue/filed wording while leaving internal code symbols stable to protect mechanics and save compatibility.

## Added cinematic opening intro before main menu

- Added a full-screen opening Start scene before the title menu in the normal boot flow.
- Added a lightweight, data-driven in-engine opening cinematic with 7 timed beats, caption chips, procedural Warsaw/office/desk visuals, Maria-at-desk reveal, Skip controls, and reduced-motion timing.
- Updated e2e smoke coverage so normal boot verifies the opening start gate and skip-to-title flow while dev/test routes continue to bypass the opening layer.

## Full visual consistency QA pass

- Audited player-facing UI surfaces against the current main menu art direction and cleaned up remaining fallback copy that still sounded like build scaffolding.
- Harmonized VN background variant colors and platformer label backing colors to shared theme tokens instead of isolated hardcoded prototype tones.
- Updated visual QA docs and release readiness notes with the final consistency pass, including the `16/05` case-number rule and intentional dev-overlay exception.

## Global icon, badge, and chip system redesign

- Added a lightweight semantic UI icon registry with CSS/procedural icons for menu actions, exhibit labels, VN speakers, status chips, settings controls, credits, and final verdict actions.
- Applied the shared icon/chip language to the main menu, Level Select, Settings, Reset confirmation, Credits, VN dialogue controls, and FinalVerdictScene without adding external icon libraries or image assets.
- Added registry tests covering required icon keys, all 10 exhibit mappings, status/speaker fallbacks, and safe icon span rendering.

## Level Select, Settings, and Credits redesign

- Restyled Level Select as an in-world Exhibit Archive with parchment/navy case rows, exhibit chips, admitted/current/locked status treatments, game-complete banner styling, and premium replay/play buttons.
- Restyled Settings and Reset confirmation panels with legal-folder surfaces, gold/burgundy trim, styled seal-like toggles, and a restrained reset warning treatment while preserving persistence and confirmation behavior.
- Restyled Credits as a parchment case note with gold border, soft rose/gold seal motif, and main-menu-compatible actions without inventing credits or adding external assets.

## Evidence reveal and final verdict presentation redesign

- Restyled EvidenceRevealScene as a ceremonial exhibit-admitted certificate with navy legal-folder framing, parchment document surface, gold trim, warm glow, procedural exhibit icon, and a main-menu-compatible Continue affordance.
- Restyled FinalVerdictScene with a grand court-certificate presentation, parchment verdict document, ceremonial seal/heart motif, burgundy/gold primary action, and polished case-closed completion card.
- Preserved evidence reveal meanings, approved final verdict text, final completion text, gameplay logic, puzzle mechanics, VN flow, save/progression behavior, and the no-external-asset policy.

## Puzzle scene presentation redesign

- Restyled the active puzzle presentation layer to match the current main menu art direction with a larger navy legal-folder frame, parchment/gold exhibit surfaces, burgundy warmth, and cinematic puzzle backdrop treatment.
- Harmonized puzzle headers, instruction/feedback bars, action buttons, draggable pieces, drop targets, selected states, success glows, stamps, constellation/seal boards, and puzzle sidecars into one premium case-file exhibit family.
- Preserved puzzle mechanics, puzzle rules, scene flow, VN content, save/progression, final verdict text, external-asset policy, and browser-friendly procedural styling.

## Platformer presentation redesign

- Restyled platformer gameplay presentation to better match the current main menu art direction with navy evening backdrops, antique-gold trims, burgundy/rose warmth, parchment labels, and brass-like highlights.
- Added visual-only platform surface trim, richer level background motifs, case-note world labels, improved exhibit glow, styled checkpoints, doors, keys, fragments, and HUD text shadows without changing collision geometry or gameplay logic.
- Preserved platformer mechanics, level flow, puzzle mechanics, VN flow, save/progression, mobile touch controls, dev/debug tools, and final verdict text.

## Visual Novel presentation redesign

- Restyled VN scenes to match the current main menu art direction with a larger legal-folder frame, cinematic navy overlays, parchment dialogue document, burgundy speaker chip, antique-gold trim, and warmer amber focus states.
- Upgraded placeholder portrait framing with a richer plaque treatment, active-speaker glow, and inactive portrait dim-state styling for future multi-character staging.
- Refined VN Continue/Skip buttons and responsive behavior while preserving VN story content, scene flow, save/progression, puzzle mechanics, gameplay, and final verdict text.

## Full-game visual style harmonization

- Unified DOM and Phaser-facing UI around the current main menu art direction: midnight navy, parchment, antique gold, burgundy leather, warm amber glow, and restrained silver/blue supporting accents.
- Restyled VN panels, dialogue cards, portrait staging, puzzle panels, puzzle feedback bars, Level Select rows, settings subpanels, final/credits panel surfaces, and platformer HUD chips to feel like one romantic legal-mystery interface.
- Replaced remaining player-facing `M/10` case-number marks with the restrained `16/05` case-file mark where a case number is still useful.
- Replaced leftover platformer hardcoded cool blues/silvers with shared theme tokens while preserving gameplay, puzzle logic, VN flow, save/progression, and approved final verdict text.

## Main menu title typography redesign

- Added scoped title lockup classes for the main menu Polish subtitle, main title, and birthday case-file line.
- Restyled the title typography with safe serif fonts, balanced sizing, cream/gold treatment, subtle shadow, a CSS-only crest, and restrained divider marks.
- Preserved the exact title/subtitle/small-line text, background, main frame, buttons, gameplay, puzzle logic, VN flow, save/progression, final verdict text, and no-external-asset policy.

## Main menu button redesign

- Added dedicated main menu button classes for the title screen so button polish stays scoped to `Open the Case`, `Level Select`, `Settings`, and `Reset Case`.
- Redesigned the title buttons with CSS-only premium game UI styling: burgundy primary action, parchment secondary actions, restrained reset styling, gold trim, procedural seal marks, hover/focus glow, pressed states, and disabled states.
- Preserved the title background, main frame, title typography, gameplay, puzzle logic, VN flow, save/progression, final verdict text, and no-external-asset policy.

## Main menu frame redesign

- Redesigned the title menu frame as a lightweight CSS legal-folder/court-plaque panel with deep navy leather, burgundy side accents, antique gold trim, inner rules, corner ornaments, and a subtle crest area.
- Kept the existing title typography, button design, background image, gameplay, puzzle logic, VN flow, save/progression, and final verdict text unchanged.
- Updated the visual style guide with the main menu frame style and lightweight implementation notes.

## Color/style harmonization for title background

- Added a shared TypeScript theme palette for Phaser-rendered UI and aligned CSS variables to the new full-screen title background.
- Recolored menus, shared buttons, panels, puzzle surfaces, VN overlays, Level Select, platformer HUD accents, evidence reveal, credits, and final verdict presentation toward midnight navy, parchment, antique gold, burgundy, and warm rose tones.
- Removed older clashing player-facing blue/cream hardcodes from platformer, puzzle fallback, and Phaser config paths while preserving gameplay, puzzle logic, VN flow, save/progression, and final verdict text.
- Updated the visual style guide with the active romantic legal mystery palette and implementation notes.

## Main menu background image update

- Added the supplied WebP as the main menu background through the title DOM overlay.
- Used CSS `background-size: cover` behavior so the image fills the viewport without stretching or distorting.
- Kept Phaser scale config, gameplay scenes, puzzle logic, VN flow, save/progression, and final verdict text unchanged.
- Updated credits for the user-provided generated title background image.

## Main menu viewport scaling fix

- Removed the desktop `#game-frame` max-width clamp so the game shell and canvas parent fill the browser viewport.
- Enlarged the title menu overlay and panel with responsive viewport-based sizing, larger title type, and larger primary/menu buttons.
- Kept Phaser's fixed 16:9 `FIT` scale mode unchanged to avoid platformer, puzzle, touch-control, and dev-overlay regressions.
- Added Playwright smoke coverage that guards against the title panel shrinking back into a small centered card.

## Part 38 - Lightweight procedural visual upgrade pass

- Polished shared DOM UI with richer case-file panels, warmer button states, subtle inner borders, and reduced-motion-safe transitions.
- Added static Phaser visual motifs to the title, case file, credits, evidence reveal, final verdict, and platformer backdrop scenes without adding external assets.
- Replaced generic platformer exhibit pickup visuals with distinct procedural silhouettes for all 10 exhibits.
- Refined puzzle board styling with CSS-only frame, lens, archive, constellation, seal, tile, and success-state polish while preserving puzzle logic.
- Improved VN placeholder portrait/card styling and final verdict presentation without changing VN dialogue or approved final verdict text.
- Updated visual-style, asset-replacement, QA, release-readiness, and changelog documentation for the procedural placeholder upgrade.
- Added no external images, generated art, portraits, audio, private content, heavy dependencies, gameplay changes, or final verdict text changes.

## Part 37 - Visual style strategy and asset budget plan

- Added `docs/visual-style-guide.md` with the final visual direction, current visual audit, scene priorities, and placeholder/procedural guidance.
- Added `docs/asset-budget.md` with browser/GitHub Pages size targets, recommended formats, loading strategy, current `dist` baseline, and performance mitigations.
- Added `docs/asset-replacement-plan.md` with prioritized replacement categories for UI, VN, platformer, puzzle, evidence reveal, final verdict, and optional audio.
- Updated architecture, deployment, release-readiness, QA, production, and README documentation for the final asset planning phase.
- Added no final art files, external assets, music, photos, generated portraits, private content, gameplay changes, or final verdict text changes.

## Part 36 - VN presentation polish and placeholder portrait system

- Added a lightweight Visual Novel presentation helper for procedural speaker portraits and per-level background variants.
- Updated VisualNovelScene to show an active speaker placeholder portrait, scene mark, and derived background styling without adding image assets.
- Polished VN CSS with subtle level-themed background variants, compact portrait staging, reduced-motion-safe panel entry, and short-height landscape safeguards.
- Added unit coverage for known/unknown speaker portrait resolution and VN background fallback behavior.
- Updated VN smoke coverage to verify the portrait stage and background variant on a dev VN route.
- Preserved dialogue length, VN flow, save/progression behavior, puzzle/platformer mechanics, final verdict text, and the no-external-asset policy.

## Part 35 - Visual Novel QA and pacing pass

- Reviewed all Level 1-10 VN scenes for pacing, tone, replay comfort, and final verdict handoff.
- Trimmed the densest VN lines so dialogue stays quicker and more comfortable on mobile landscape.
- Tightened the VN overlay layout for short-height landscape screens without redesigning the scene system.
- Added VN content guardrail tests for unique scene ids, approved speakers, valid targets, and maximum line length.
- Updated VN QA, style, architecture, level plan, production plan, and README documentation for the completed pacing pass.
- Preserved the approved final verdict text, stateless VN flow, save/progression behavior, puzzle mechanics, and no-external-asset policy.

## Part 34 - Visual Novel scenes for Levels 6-10

- Added data-driven VN intro, pre-puzzle, and post-puzzle scenes for Levels 6-10.
- Reused the existing VisualNovelScene foundation without adding portraits, art, audio, private content, or new dependencies.
- Routed playable Level Select entries for Levels 6-10 through their intro VN scenes while keeping direct platformer and puzzle dev/test routes as bypasses.
- Added a concise Level 10 after-puzzle VN bridge from Final Verdict Assembly into FinalVerdictScene, preserving the approved final verdict text and Accept Verdict completion boundary.
- Expanded VN unit coverage for Level 6-10 content, target scenes, concise line counts, and the Level 10 final verdict handoff.
- Updated Playwright smoke coverage so Level 6-10 VN beats are verified in dev routes, Level Select starts, puzzle completion flows, and the final verdict handoff.

## Part 33 - Visual Novel scenes for Levels 2-5

- Added data-driven VN intro, pre-puzzle, and post-puzzle scenes for Levels 2-5.
- Reused the existing VisualNovelScene foundation without adding portraits, art, audio, private content, or new dependencies.
- Generalized platformer and puzzle completion VN hooks so Levels 1-5 can route through their matching pre-puzzle and post-puzzle scenes.
- Routed playable Level Select entries for Levels 2-5 through their intro VN scenes while keeping direct platformer and puzzle dev/test routes as bypasses.
- Expanded VN unit coverage for Level 2-5 content, target scenes, concise line counts, and no Level 6-10 VN leakage.
- Updated Playwright smoke coverage so Level 2-5 VN beats are verified in dev routes, Level Select starts, and puzzle completion flows.

## Part 32 - Visual Novel layer foundation and Level 1 VN scenes

- Added a lightweight, data-driven VisualNovelScene with speaker names, dialogue lines, Continue, Skip, keyboard controls, touch/mouse controls, and mobile-safe case-file styling.
- Added Level 1 VN content for the intro before the platformer, the moment before the Case Mosaic puzzle, and the post-puzzle beat before the evidence reveal.
- Routed normal Level 1 flow through VN intro -> platformer -> VN pre-puzzle -> Case Mosaic -> VN post-puzzle -> evidence reveal while preserving direct dev/test platformer and puzzle routes.
- Added a dev/test-only `?scene=vn&id=...` route for VN smoke testing.
- Added VN content/flow unit coverage and updated Playwright smoke expectations for the new Level 1 flow.
- Preserved save schema, Level 1 completion/unlock timing, final verdict text, puzzle mechanics, and no-external-asset safety.

## Part 31 - Retired legacy puzzles and full tactile puzzle QA/balancing

- Removed old form-like puzzle types from active PuzzleRegistry and PuzzleScene runtime routing so only the 10 redesigned tactile puzzle types can instantiate in player/dev puzzle routes.
- Narrowed the shared puzzle type contract to the active redesigned family: Case Mosaic, Case Timeline, Rebuild Puzzle, Witness Lens, Archive Detail Finder, Echo Path, Lantern Sequence, Argument Tower, Case Constellation, and Final Verdict Assembly.
- Kept old puzzle source folders as archived legacy code for later deletion instead of deleting blindly during the QA pass.
- Updated registry tests to prove all active Level 1-10 puzzle types resolve correctly and retired puzzle type strings fall back to the unsupported placeholder path.
- Refreshed README, technical architecture, level plan, QA checklist, production plan, game bible, and release-readiness report for the completed tactile puzzle family and next Visual Novel phase.
- Preserved the approved final verdict text, save/progression behavior, Level Select/replay, and dev editor/debug overlay.

## Part 30 - Level 7-10 tactile puzzle redesign

- Added the reusable Lantern Sequence module for Level 7 with typed lantern specs, flame input progress, gentle wrong-state reset, Show Pattern, drag/drop flame interaction, and tap fallback.
- Replaced the active Level 7 pattern-repeat route with `Lantern Sequence: The Lantern`, preserving the calm North -> East -> South -> East light path and Level 7 evidence reveal.
- Added the reusable Argument Tower module for Level 8 with typed tower slots, evidence blocks, tray/placement state, stable-slot checks, reset, and solved-state logic.
- Replaced the active Level 8 argument-builder route with `Argument Tower: The Blue Ribbon`, where players build a stable evidence structure and unlock the Blue Ribbon wrap.
- Added the reusable Case Constellation module for Level 9 with typed exhibit stars, meaning nodes, correct mappings, placement state, progress, and solved-state logic.
- Replaced the active Level 9 evidence-linking route with `Case Constellation: The Unfinished Letter`, where prior exhibit stars complete the synthesis before the finale.
- Added the reusable Final Verdict Assembly module for Level 10 with typed court-seal slots, final meaning fragments, order checks, reset behavior, and solved-state logic.
- Replaced the active Level 10 final-letter route with `Final Verdict Assembly: The Heart, Freely Given`, preserving the approved FinalVerdictScene and game-completion boundary after Accept Verdict.
- Updated PuzzleRegistry, PuzzleScene, content, styles, unit tests, Playwright smoke expectations, and docs while keeping old Level 7-10 puzzle modules as legacy/fallback code.

## Part 29 - Level 5 Archive Detail Finder and Level 6 Echo Path redesign

- Added the reusable Archive Detail Finder module with typed hidden-detail specs, magnifier inspection, bookmark marking, progress checks, reset behavior, and solved-state logic.
- Replaced the active Level 5 memory-match route with `Archive Detail Finder: The Marginal Note`, where players inspect a procedural archive page and bookmark four discovered details.
- Added the reusable Echo Path module with typed prompt/question/door specs, question placement, Trust-door unlocking, Silver Key placement, reset behavior, and solved-state logic.
- Replaced the active Level 6 cross-examination route with `Echo Path: The Silver Key`, where players place the right question and use the Silver Key on the Trust door.
- Updated PuzzleRegistry, PuzzleScene, content, styles, unit tests, Playwright smoke expectations, and docs while keeping memory-match and cross-examination modules as legacy/fallback code.

## Part 28 - Level 3 Rebuild Puzzle and Level 4 Witness Lens redesign

- Added the reusable Rebuild Puzzle module with typed repair specs, draggable pieces, rotation state, slot placement, swap behavior, pure progress checks, and solved-state logic.
- Replaced the active Level 3 reconstruction route with `Rebuild Puzzle: The Red Brick`, where players repair a 3x2 street frame with draggable and rotatable brick pieces.
- Added the reusable Witness Lens module with typed evidence note specs, statement strips, lens inspection, contradiction marking, reset, and solved-state logic.
- Replaced the active Level 4 contradiction route with `Witness Lens: The Witness Note`, where players inspect statements with an evidence lens and mark the contradiction with a stamp.
- Updated PuzzleRegistry, PuzzleScene, content, styles, unit tests, Playwright smoke expectations, and docs while keeping the old reconstruction and contradiction modules as legacy/fallback code.

## Part 27.5 - Drag-and-drop puzzle interaction for Level 1 and Level 2

- Added a shared pointer-event drag/drop helper for DOM puzzle pieces and task tiles.
- Made Level 1 Case Mosaic pieces draggable from tray to board slots, between slots, and back to the tray while preserving tap-to-place fallback.
- Made Level 2 Case Timeline tasks draggable from tray to tram stops, between stops, and back to the tray while preserving tap-to-place fallback.
- Added lifted drag ghosts, drop target highlighting, invalid-drop safety, and touch-action safeguards for mobile browsers.
- Added drag helper unit coverage and updated Playwright smoke tests to exercise one drag in each converted puzzle.

## Part 27 - Case Timeline puzzle and Level 2 redesign

- Added the reusable Case Timeline puzzle system with typed timeline specs, tram stops, task tray state, placement/swap behavior, pure progress checks, and solved-state logic.
- Replaced the active Level 2 calendar-sequence route with `Case Timeline: The Golden Stamp`, where players place four case tasks onto a golden tram-line schedule.
- Added visual/tactile puzzle UI with a timeline board, large task tiles, tap-to-place snapping, placed-task pickup, route glow feedback, and a schedule-sealed stamp.
- Kept the old calendar-sequence module in place as legacy/fallback code for later retirement.
- Added Case Timeline unit coverage and updated Level 2 content, registry, documentation, and Playwright smoke expectations.

## Part 26 REDESIGN v2 - Case Mosaic puzzle foundation and Level 1 redesign

- Added the reusable Case Mosaic puzzle system with typed mosaic specs, pieces, slots, tray state, swap behavior, pure progress checks, and solved-state logic.
- Replaced the Level 1 Case Board route with `Case Mosaic: The Sealed Envelope`, where players reconstruct a 3x2 procedural envelope mosaic.
- Added visual/tactile puzzle UI with a case-frame board, scrambled piece tray, tap-to-place snapping, placed-piece pickup, replacement/swap behavior, progress feedback, and an exhibit-restored stamp.
- Kept Evidence Board, Case Board, document-ordering, and all other old puzzle modules as legacy/fallback code for later conversion or retirement.
- Added Case Mosaic unit coverage and updated Level 1 content, registry, and Playwright smoke expectations.

## Part 26 REDESIGN - Case Board puzzle foundation and Level 1 redesign

- Added the reusable Case Board puzzle system with typed slots, tiles, valid connections, required paths, pure board-state logic, and mobile-friendly DOM UI.
- Replaced the weak Level 1 Evidence Board matching route with `Case Board: The Sealed Envelope`, where players build `Case Start -> The Sealed Envelope -> Attention -> Truth`.
- Added visible board slots, tile tray placement, placed-tile pickup, replacement behavior, lit connection feedback, and gentle incomplete/wrong path feedback.
- Kept the old Evidence Board and other puzzle modules in place as legacy/fallback code for later conversion work.
- Added Case Board unit coverage and updated Level 1 content, registry, and Playwright smoke expectations.

## Part 26 - Evidence Board puzzle foundation and Level 1 conversion

- Added the reusable Evidence Board puzzle system with typed specs, pure tap-to-link logic, data-driven content, and mobile-friendly DOM UI.
- Converted Level 1 to `Evidence Board: The Sealed Envelope`, linking The Sealed Envelope to Attention.
- Kept Levels 2-10 on their existing puzzle modules and preserved the legacy document-ordering module/tests as fallback code.
- Added Evidence Board unit coverage and updated Level 1 Playwright smoke coverage.
- Updated puzzle architecture, level plan, production plan, QA checklist, content style guide, README, and changelog docs for the new puzzle direction.

## Fix - Evidence-linking readability

- Made Level 9 evidence-linking links one-to-one so reusing a meaning moves it instead of creating a hidden duplicate failure.
- Added visible filed-link summaries and "Used by" labels on meaning cards so the current matches are clear without relying on color.

## Part 25 - Deployment preparation and final release package

- Added a `preview` script for production-like local static smoke testing.
- Added configurable Vite base path handling through `VITE_BASE_PATH`, with a relative `./` default for portable builds.
- Added unit coverage for the production/dev mode gate and Vite base-path resolver.
- Added deployment documentation for GitHub Pages, Vercel, Netlify, and itch.io HTML5 ZIP builds.
- Added a practical final release checklist and updated release-readiness documentation.
- Added an optional manual GitHub Pages deployment workflow that runs typecheck, unit tests, and build before publishing `dist`.
- Reviewed privacy, credits, and dev-tool production safety without adding new assets or gameplay scope.

## Part 24 - Visual/audio polish and gift presentation pass

- Polished the title, case file, evidence reveal, final verdict, credits, buttons, focus states, and mobile landscape spacing.
- Added clearer platformer checkpoint, exhibit, and case-door markers using existing Phaser shapes only.
- Added a small procedural WebAudio sound-effect layer for UI/progress feedback with mute support and no external audio files.
- Updated credits and docs to clarify that no external art/audio assets were added.
- Added unit coverage for AudioManager no-op safety, muted state, generated tone playback, and unlock behavior.

## Part 23 - Full-game QA and balancing pass

- Performed a full-game code, content, save/progression, puzzle, e2e, and release-readiness review.
- Tightened save normalization so a malformed partial save cannot claim `gameCompleted` unless Level 10 is actually completed.
- Added regression coverage for readable Polish/opening punctuation and `gameCompleted` normalization.
- Refreshed credits wording to match the current placeholder-shape/core-game build.
- Added the release-readiness report and updated QA/production documentation for the next polish phase.

## Part 22 - Final-letter assembly and verdict ending

- Added the real Level 10 final-letter-assembly puzzle with 10 ordered final words.
- Added pure final-letter ordering logic, reset, submit, feedback, and solved-state tests.
- Registered `final-letter-assembly` in PuzzleRegistry and PuzzleScene.
- Added FinalVerdictScene with the approved verdict text and Accept Verdict flow.
- Added game completion save state while preserving saveVersion 1 and old-save normalization.
- Added Level 10 completed/replay-finale state and a gentle Case Closed banner in Level Select.
- Added a simple CreditsScene with no external assets.
- Added unit and Playwright smoke coverage for the final puzzle, verdict acceptance, credits, game completion, and Level 10 replay state.
- Updated level plan, game bible, technical architecture, production plan, QA checklist, Codex workflow, README, and changelog docs.

## Part 21 - Level 10 finale platformer slice

- Added playable Level 10 geometry for The Court of the Heart.
- Added The Heart, Freely Given as the required Level 10 exhibit.
- Added a ceremonial finale route with two checkpoints, slow familiar moving platforms, one rebuild bridge, and one lantern reveal bridge.
- Added previous-exhibit memory markers using existing hint and decoration systems without adding new progression state.
- Updated Level Select so Level 10 becomes playable after Level 9 completion.
- Added Level 10 final-letter-assembly PuzzleScene placeholder only; the final verdict remains pending for Part 22.
- Extended dev query routes and dev override validation to support Level 10.
- Added Level 10 geometry, availability, save safety, GameFlow, content, dev-tooling, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, Codex workflow, README, and changelog docs.

## Part 20 - Level 9 evidence-linking puzzle

- Added the Level 9 evidence-linking puzzle with six exhibit-to-meaning links.
- Added pure evidence-linking logic for selection, linking, unlinking, reset, submit, and solved-state checks.
- Wired PuzzleRegistry and PuzzleScene so Level 9 now opens the real Evidence Review: The Unfinished Letter puzzle.
- Added the Level 9 evidence reveal follow-up and Level 10 Finale Next / coming-soon progression state.
- Added unit and Playwright smoke coverage for Level 9 puzzle completion and Level 10 locked-finale visibility.

## Part 19.6 - Dev level override persistence and moving platform nudge fix

- Added a dev-only Vite middleware for `GET`, `POST`, and `DELETE` level geometry overrides.
- Added safe JSON override files under `dev-level-overrides/level-N.json`.
- Added dev-only override loading and merging before PlatformerScene builds a level.
- Added S, Shift+S, and Shift+D debug editor shortcuts for saving selected objects, saving dirty objects, and deleting selected overrides.
- Fixed moving/elevator platform nudging so x/y and movement anchors shift together while speed is preserved.
- Added developer resize controls for selected platform-like objects, including saved width/height overrides that persist after reload.
- Updated selected-object copy/export output to include moving platform anchors and speed.
- Added unit coverage for override validation, path safety, merge behavior, deletion, serialization, moving-platform nudges, and resize helpers.
- Updated README, technical architecture, QA checklist, Codex workflow, and changelog documentation.

## Part 19.5 - Developer level tuning overlay

- Added a dev/test-only PlatformerScene tuning overlay toggled with F1.
- Added direct platformer dev routes with optional checkpoint and exact coordinate spawns.
- Added world grid, object bounds, position labels, object selection, and runtime nudging.
- Added clipboard helpers for player/pointer coordinates, selected object JSON/TypeScript snippets, and current debug geometry export.
- Added pure debug query, dev gate, serialization, and nudge tests.
- Added an e2e smoke check for toggling the debug overlay.
- Updated technical architecture, QA checklist, Codex workflow, README, production plan, and changelog docs.

## Part 19 - Level 9 platformer slice

- Added playable Level 9 geometry for The Rooftops Before the Verdict.
- Added The Unfinished Letter as the required Level 9 exhibit.
- Added a long rooftop synthesis route with three checkpoints.
- Reused existing moving platform, rebuild trigger, and lantern reveal mechanics without adding a new system.
- Added Level 9 evidence-linking PuzzleScene placeholder only.
- Updated Level Select so Level 9 becomes playable after Level 8 completion and Level 10 remains unavailable.
- Added Level 9 geometry, availability, save safety, GameFlow, content, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 18 - Level 8 argument-builder puzzle

- Added the real Level 8 argument-builder puzzle interlude.
- Added pure argument-builder prompt, choice selection, reset, submit, and solved-state logic with tests.
- Added mobile-friendly ArgumentBuilderPuzzle DOM UI with three large choice cards.
- Updated PuzzleRegistry and PuzzleScene to resolve `argument-builder`.
- Updated EvidenceRevealScene with Level 8 follow-up copy.
- Level 8 completion now unlocks Level 9 as Coming Soon without making it playable.
- Expanded SaveManager, LevelAvailability, GameFlow, content, registry, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 17 - Level 8 platformer slice

- Added playable Level 8 geometry for The Tower of Arguments.
- Added The Blue Ribbon as the required Level 8 exhibit.
- Added a tall vertical ascent route with two checkpoints and three slow vertical elevator platforms.
- Extended moving platform data and runtime behavior to support vertical elevators while preserving existing horizontal movers.
- Added three optional in-memory argument fragments with short non-private text snippets.
- Updated PlatformerScene camera bounds so tall levels can follow vertical ascent.
- Updated Level Select so Level 8 becomes playable after Level 7 completion and Levels 9-10 remain unavailable.
- Added Level 8 argument-builder PuzzleScene placeholder only.
- Added Level 8 geometry, availability, save safety, GameFlow, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 16 - Level 7 pattern-repeat puzzle

- Added the real Level 7 pattern-repeat puzzle interlude.
- Added pure pattern-repeat lantern sequence, input, reset, wrong-feedback, and solved-state logic with tests.
- Added mobile-friendly PatternRepeatPuzzle DOM UI with labeled lantern buttons, visible progress, and a non-flashing Show Pattern display.
- Updated PuzzleRegistry and PuzzleScene to resolve `pattern-repeat`.
- Updated EvidenceRevealScene with Level 7 follow-up copy.
- Level 7 completion now unlocks Level 8 as Coming Soon without making it playable.
- Expanded SaveManager, LevelAvailability, GameFlow, content, registry, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 15 - Level 7 platformer slice

- Added playable Level 7 geometry for The Garden of Quiet Evidence.
- Added The Lantern as the required Level 7 exhibit.
- Added one checkpoint and a calm low-risk garden route.
- Added two lantern switches that reveal soft light platforms during the current run.
- Added three optional in-memory quiet evidence fragments with short non-private text snippets.
- Added pure LanternSwitch logic and tests for activation and reveal groups.
- Updated LevelBuilder and PlatformerScene to render lantern switches, activate light-revealed platforms, and collect quiet evidence fragments.
- Updated Level Select so Level 7 becomes playable after Level 6 completion and Levels 8-10 remain unavailable.
- Added Level 7 pattern-repeat PuzzleScene placeholder only.
- Added Level 7 geometry, availability, save safety, GameFlow, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Fix - Level 6 choice-door route

- Reordered the Level 6 Hope and Trust doors so the correct route can be reached without crossing a wrong-door trigger first.
- Added geometry coverage to keep required choice doors before wrong-door triggers on the route.

## Fix - Level 4 Witness Note approach

- Lowered the final Witness Note ledge in Level 4 and shifted the last drifting paper platform earlier.
- Added geometry coverage to keep the final Witness Note approach within a forgiving jump arc.

## Part 14 - Level 6 cross-examination puzzle

- Added the real Level 6 cross-examination puzzle interlude.
- Added pure cross-examination prompt, choice selection, reset, submit, and solved-state logic with tests.
- Added mobile-friendly CrossExaminationPuzzle DOM UI.
- Updated PuzzleRegistry and PuzzleScene to resolve `cross-examination`.
- Updated EvidenceRevealScene with Level 6 follow-up copy.
- Level 6 completion now unlocks Level 7 as Coming Soon without making it playable.
- Expanded SaveManager, LevelAvailability, GameFlow, registry, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 13 - Level 6 platformer slice

- Added playable Level 6 geometry for The Courthouse of Echoes.
- Added The Silver Key as the required Level 6 exhibit.
- Added two checkpoints and gentle choice-door navigation with Doubt, Fear, Distance, Hope, and Trust doors.
- Added three optional in-memory echo fragments with short non-private text snippets.
- Added pure ChoiceDoor logic and tests for forward and loop-back door resolution.
- Updated LevelBuilder and PlatformerScene to render labeled choice doors, resolve door destinations, and collect echo fragments.
- Updated Level Select so Level 6 becomes playable after Level 5 completion and Levels 7-10 remain unavailable.
- Added Level 6 cross-examination PuzzleScene placeholder only.
- Added Level 6 geometry, availability, save safety, GameFlow, content, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 12 - Level 5 memory-match puzzle

- Added the real Level 5 memory-match puzzle interlude.
- Added pure memory-match card selection, pair matching, wrong-feedback, reset, and solved-state logic with tests.
- Added mobile-friendly MemoryMatchPuzzle DOM UI.
- Updated PuzzleRegistry and PuzzleScene to resolve `memory-match`.
- Updated EvidenceRevealScene with Level 5 follow-up copy.
- Level 5 completion now unlocks Level 6 as Coming Soon without making it playable.
- Expanded SaveManager, LevelAvailability, GameFlow, content, registry, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 11 - Level 5 platformer slice

- Added playable Level 5 geometry for The Archive of Tiny Details.
- Added The Marginal Note as the required Level 5 exhibit.
- Added two checkpoints and a forgiving archive key/locked-door progression gate.
- Added three optional in-memory tiny-detail notes with short non-private text snippets.
- Added pure ArchiveGate logic and tests for key/door state.
- Updated LevelBuilder and PlatformerScene to render and collect archive keys, open archive doors, and collect tiny-detail notes.
- Updated Level Select so Level 5 becomes playable after Level 4 completion and Levels 6-10 remain unavailable.
- Added Level 5 memory-match PuzzleScene placeholder only.
- Added Level 5 geometry, availability, save safety, GameFlow, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 10 - Level 4 contradiction puzzle

- Added the real Level 4 contradiction review puzzle interlude.
- Added pure contradiction evidence/statement selection logic with tests.
- Added mobile-friendly ContradictionPuzzle DOM UI.
- Updated PuzzleRegistry and PuzzleScene to resolve `contradiction`.
- Updated EvidenceRevealScene with Level 4 follow-up copy.
- Level 4 completion now unlocks Level 5 as Coming Soon without making it playable.
- Expanded SaveManager, LevelAvailability, GameFlow, registry, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 9 - Level 4 platformer slice

- Added playable Level 4 geometry for The Vistula Deposition.
- Added The Witness Note as the required Level 4 exhibit.
- Added two checkpoints and three slow drifting paper platforms using the existing moving-platform runtime.
- Added three optional in-memory witness-note fragments with short non-private text snippets.
- Updated LevelBuilder and PlatformerScene to render and collect optional witness fragments.
- Updated Level Select so Level 4 becomes playable after Level 3 completion and Levels 5-10 remain unavailable.
- Added Level 4 contradiction PuzzleScene placeholder only.
- Added Level 4 geometry, availability, save safety, GameFlow, registry, content, and e2e coverage.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 8 - Level 3 reconstruction puzzle

- Added the real Level 3 reconstruction puzzle interlude.
- Added pure reconstruction piece placement and swap logic with tests.
- Added mobile-friendly ReconstructionPuzzle DOM UI.
- Updated PuzzleRegistry and PuzzleScene to resolve `reconstruction`.
- Updated EvidenceRevealScene with Level 3 follow-up copy.
- Level 3 completion now unlocks Level 4 as Coming Soon without making it playable.
- Expanded SaveManager, LevelAvailability, GameFlow, content, registry, and e2e tests.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 7 - Level 3 platformer slice and pacing update

- Updated the finished-game pacing target to about 15-18 minutes.
- Updated level duration metadata and planning docs for the richer pacing model.
- Added playable Level 3 geometry for The Rebuilt Street.
- Added The Red Brick as the required Level 3 exhibit.
- Added two checkpoints and two rebuild trigger groups with five rebuildable platforms.
- Extended LevelBuilder and PlatformerScene with a small data-driven rebuild platform mechanic.
- Updated Level Select so Level 3 becomes playable after Level 2 completion and Levels 4-10 remain unavailable.
- Added Level 3 reconstruction PuzzleScene placeholder only.
- Added Level 3 geometry, availability, save safety, GameFlow, registry, and e2e coverage.

## Fix - Level 2 moving platform clearance

- Adjusted The Tram of Deadlines geometry so moving tram platforms no longer pass underneath or into static collision platforms.
- Moved The Golden Stamp and deadline decorations to match the corrected route.
- Added a regression test to require safe moving-platform headroom and prevent platform intersection pinning.

## Part 6 - Level 2 calendar-sequence puzzle

- Added the real Level 2 calendar-sequence puzzle interlude.
- Added pure calendar task ordering logic and tests.
- Added a shared order-puzzle helper for reusable Up/Down movement checks.
- Added mobile-friendly CalendarSequencePuzzle DOM UI.
- Updated PuzzleRegistry and PuzzleScene to resolve `calendar-sequence`.
- Updated EvidenceRevealScene with Level 2 reveal copy and completion filing.
- Moved puzzle completion persistence to the evidence reveal continuation moment.
- Level 2 completion now unlocks Level 3 as Coming Soon without making it playable.
- Expanded SaveManager, LevelAvailability, GameFlow, content, registry, and e2e tests.
- Updated level plan, technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 5 - Level 2 platformer slice

- Added playable Level 2 geometry for The Tram of Deadlines.
- Added The Golden Stamp as the required Level 2 exhibit.
- Added two gentle moving tram platforms with endpoint reversal.
- Extended LevelBuilder and PlatformerScene to support data-driven moving platforms and multiple level geometries.
- Updated Level Select so Level 2 becomes playable after Level 1 completion and remains locked before then.
- Added Level 2 calendar-sequence PuzzleScene placeholder only.
- Added development routes for PlatformerScene and PuzzleScene Level 2 smoke testing.
- Added Level 2 geometry, level availability, GameFlow, and save safety tests.
- Updated Playwright smoke tests for Level 2 unlock, launch, touch controls, and placeholder puzzle.
- Updated level plan, technical architecture, production plan, and QA checklist docs.

## Part 4 - Save/progression and level select

- Added progress-aware Title menu with Start/Continue, Level Select, Settings, and Reset Case.
- Added persistent mute and reduce-motion settings through SaveManager.
- Added reset confirmation to avoid accidental progress loss.
- Added LevelSelectScene as the Case File Index.
- Added ComingSoonScene for Level 2 and other unavailable selections.
- Preserved saveVersion 1 and hardened save normalization for partial saves and invalid level IDs.
- Added SaveManager helpers for current level, completion checks, and unlock checks.
- Updated GameFlow for returning-player, level-select, and coming-soon states.
- Added development-only smoke routes for level select and completed-save scenarios.
- Expanded unit and Playwright smoke coverage for persistence, settings, reset, and Level Select.
- Updated technical architecture, production plan, QA checklist, and Codex workflow docs.

## Part 3 - Level 1 document-ordering puzzle

- Added the real Level 1 document-ordering puzzle interlude.
- Added pure puzzle logic for Facts, Evidence, Argument, and Conclusion ordering.
- Added PuzzleRegistry with safe unsupported-puzzle fallback.
- Added mobile-friendly DOM puzzle controls with Up, Down, Reset, and Submit actions.
- Added EvidenceRevealScene showing "Maria notices what others miss."
- Added safe Level 1 completion/unlock behavior through the existing SaveManager.
- Added a development-only `?scene=puzzle&level=1` route for reliable smoke tests.
- Added puzzle logic, registry, and updated GameFlow tests.
- Updated Playwright smoke coverage for wrong answer, correct answer, and evidence reveal.
- Updated architecture, level, production, and QA docs.

## Part 2 - Level 1 platformer vertical slice

- Added playable Level 1 geometry for The Envelope at the Kancelaria.
- Added placeholder office/kancelaria platforms, checkpoint, required Sealed Envelope collectible, and case-door exit.
- Added keyboard movement, jump, restart, mute toggle, and simple pause/resume.
- Added HTML touch controls for mobile browser play.
- Added coyote time, jump buffering, camera follow, and checkpoint respawn.
- Updated PuzzleScene to show the Level 1 evidence review placeholder for Part 3.
- Added platformer geometry tests and expanded smoke tests.
- Updated architecture, level, production, and QA docs for Part 2.

## Part 1 - Project foundation

- Created Phaser/Vite/TypeScript foundation.
- Added project documentation and production workflow docs.
- Added data-driven story, level, and puzzle content.
- Added SaveManager skeleton with safe localStorage handling.
- Added GameFlow skeleton for the future level/puzzle/reveal sequence.
- Added Vitest unit tests and Playwright smoke-test scaffold.
- Added Codex workflow files, repo-scoped skills, asset notes, and CI.
