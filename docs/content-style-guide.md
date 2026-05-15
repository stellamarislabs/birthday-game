# Content Style Guide

## Writing Style

Write with elegance, warmth, sincerity, and gentle humor. The game can be romantic without becoming overly sugary.

## Legal Language

Use legal language as metaphor and play. Keep it light, readable, and emotionally connected. Avoid procedural dryness or jokes that require obscure legal knowledge.

## Maria

Maria should be portrayed as intelligent, capable, respected, warm, and heroic. She solves the case because she is observant, disciplined, kind, and brave.

## Avoid

- Cringe.
- Over-explaining.
- Melodrama.
- Generic romance.
- Jokes at Maria's expense.
- Private content in the public repo unless explicitly approved.

## Core Twist

Preserve the twist: Maria did not steal the heart. It was freely given.

## Part 39 Story Foundation

- Use `docs/story-bible.md` as the narrative source of truth for the connected clue trail.
- Player-facing title: Maria and the Case of the Missing Heart.
- Polish subtitle: Sprawa Zaginionego Serca.
- Use "clue" as the primary collectible/story term and "evidence" as the secondary legal term.
- Avoid museum/exhibition language in player-facing copy.

## Part 40 Connected Trail Rules

- Every VN scene should make the current clue feel connected to the next clue.
- Pre-puzzle scenes should frame what the clue needs Maria to inspect, repair, order, or assemble.
- Post-puzzle beats should include the ritual "Clue filed." where appropriate, but active chapter flow should usually carry that beat in the clue reveal instead of a separate VN scene.
- Puzzle instructions should describe what the clue unlocks or reveals, not just how to operate the mechanic.
- Keep the final romantic confirmation reserved for the approved FinalVerdictScene.

## Part 41 Clue Continuity UI Rules

- Reveal-screen next-clue hints should answer what Maria discovered and where it points next.
- Puzzle success follow-ups should be one concise sentence, never a new story scene.
- Level Select lead hints should stay short enough to scan and should not spoil the final verdict.
- Level 10 continuity should point to hearing the verdict, not to another clue.

## Part 42N Final Six-Chapter Copy Rules

- Active `vn-chapter-*` scenes should carry one clean chain: envelope -> key/ticket -> stamp/wall -> witness/archive code -> "No. Given." -> silver key -> Trust door -> lantern/blue ribbon -> unfinished letter -> final court.
- Active puzzle instructions should name what the clue reveals, not just the input mechanic.
- Active puzzle success copy should use one earned discovery sentence plus one next-clue handoff sentence.
- Evidence reveals should use "Clue filed." and the active chapter clue names; Chapter 6 should stay focused on the verdict handoff.
- Do not reintroduce "Exhibit admitted", "Tenth Exhibit", `M/10`, or the old Polish title in active player-facing text.
- Keep Chapter 6 after-puzzle VN short and ceremonial. FinalVerdictScene remains the emotional payoff.

## Part 44A Final Scope Copy Rules

- The final product target is a 10-15 minute birthday gift, so story text should be warm and precise rather than expansive.
- Keep one short intro VN per chapter where possible, with a target of no more than three concise lines.
- Use pre-puzzle VN only when the puzzle needs story framing; otherwise let the puzzle instruction carry the setup.
- Merge most after-puzzle VN beats into the clue reveal so the player does not hear the same discovery twice.
- Clue reveals should be the main emotional handoff after puzzles: clue name, meaning, next action, and one clear emotional sentence.
- Chapter 6 must not overexplain before the verdict. The final verdict text remains the emotional payoff and must stay unchanged.
- Future puzzle copy should support faster 20-45 second interactions; Chapter 6 especially should read as a final seal moment, not a ten-step exam.
- Before FinalVerdictScene, prefer "The Heart Seal" or "The Final Seal" over "The Heart, Freely Given" so the approved verdict keeps its reveal.

## Part 44C VN Compression Rules

- Active chapter intro VN scenes should be no more than three concise lines.
- Active pre-puzzle VN should be no more than one or two lines and should be bypassed when the puzzle instruction already frames the action.
- Active after-puzzle VN content should usually be merged into the clue reveal; retained after-puzzle VN scenes exist for dev/test routes and must stay very short.
- Chapter 6 should route from the final seal to FinalVerdictScene without extra romantic explanation. The approved verdict remains the emotional payoff.

## Part 48A Final Wording Cleanup Rules

- The active opening case file should say "A trail of clues is hidden across Warsaw." It should not say "Ten clues."
- The opening cinematic should use "Maria takes her place at the desk." for the desk beat and reserve "The case file opens." for the menu reveal beat only.
- Active Chapter 6 pre-verdict copy should use "The Heart Seal", "The Final Seal", "Court Seal", or "Court of the Heart"; do not use "The Heart, Freely Given" before FinalVerdictScene.
- Internal legacy package/save-key names may remain until a tested migration is requested. Do not surface them to players.

## Case Mosaic Writing Rules

- Mosaic pieces should name concrete clue fragments or visual details.
- Instructions should describe reconstructing the clue, not choosing an answer.
- Feedback should sound like a gentle case restoration, not a school quiz.
- Wrong or incomplete mosaics should guide attention without scolding.
- Keep Level 1-3 mosaics especially light; the puzzle teaches placement, snapping, and visual reconstruction before it asks for real synthesis.
- Prefer "restore the clue", "rebuild the case image", and "place the pieces" language over generic matching-game language.
- Avoid private memories, overly intimate details, or final-verdict spoilers before the intended ending.

## Case Timeline Writing Rules

- Timeline tasks should sound calm, capable, and procedural without becoming office homework.
- Use "place tasks", "tram stops", "seal the schedule", and "calm order" language instead of generic list-ordering language.
- Feedback should reassure the player that the schedule is not ready yet, not imply failure under pressure.
- The Golden Stamp should represent graceful responsibility, not stress, punishment, or racing a deadline.
- Keep task labels short enough for mobile cards and avoid obscure legal-process details.

## Rebuild Puzzle Writing Rules

- Rebuild copy should frame repair as patience and care, not failure correction.
- Piece labels should describe visible brick, path, arch, or lamp fragments.
- Rotation hints should stay gentle and tactile: "some pieces still need care" is better than "wrong rotation."
- Avoid making the Red Brick feel like an engineering test; the meaning is strong things assembled patiently.

## Witness Lens Writing Rules

- Witness Lens copy should feel investigative, calm, and evidence-led.
- Statement strips should stay short enough to compare quickly on mobile.
- Lens hints may name whether a statement contradicts, matches, or is unsupported by the note.
- Avoid turning the contradiction into a quiz; the player should feel they inspected evidence and marked the line.

## Archive Detail Finder Writing Rules

- Archive detail copy should reward observation and intimacy without using private memories.
- Detail labels should feel like marginal discoveries, not answer cards.
- Use "inspect", "bookmark", "margin", "tiny detail", and "archive page" language instead of matching or memory-game language.
- Hidden zones should be hinted gently; the puzzle should never feel like pixel hunting.
- Feedback should suggest that more details are waiting, not that Maria missed something obvious.

## Echo Path Writing Rules

- Echo Path copy should make the correct question feel thoughtful and emotionally precise.
- Door labels should stay symbolic and short: Doubt, Fear, Trust.
- The Silver Key should represent trust opening through the right question, not a quiz answer.
- Wrong choices should echo gently without sarcasm, punishment, or legal trivia.
- Avoid final-verdict spoilers; keep the focus on choosing each other again.

## Lantern Sequence Writing Rules

- Lantern copy should feel calm, warm, and safe rather than stressful or memory-test harsh.
- Use "light", "garden path", "softly", and "quiet pattern" language instead of speed, score, or failure language.
- Show Pattern should provide a readable non-flashing clue, especially for reduce-motion comfort.

## Argument Tower Writing Rules

- Argument Tower copy should frame evidence as a structure that can stand, not as a debate to win.
- Block labels should be short and concrete enough for mobile tiles.
- Wrong feedback should describe instability gently rather than scolding the player for choosing a decoy.

## Case Constellation Writing Rules

- Constellation copy should feel synthesizing and close to the finale.
- Clue stars should name prior case objects clearly; meaning nodes should use the established final meaning words.
- Avoid making the synthesis feel like a matching worksheet; the language should emphasize stars, lines, and the unfinished letter completing.

## Final Verdict Assembly Writing Rules

- Final assembly copy should feel ceremonial, earned, and concise.
- Do not alter or expand the approved final verdict text.
- Use "seal", "verdict", "clue token", and "unlock" language instead of quiz/order-list language.
- The active Part 44B final puzzle uses six clue-object tokens: Envelope, Wall, Witness, Correction, Trust, and Heart.
- Do not reintroduce a ten-fragment ordering task into the active Chapter 6 flow.
- The active Chapter 6 puzzle title should be `Final Seal: The Court of the Heart` before the verdict.
- Avoid final private content beyond the approved verdict message.

## Visual Novel Writing Rules

- VN scenes should be short story breaths, not long cutscenes.
- Keep each line readable on mobile landscape and avoid paragraphs that crowd the dialogue panel.
- Use speaker names consistently: Narrator, Maria, Case File, and later carefully introduced placeholders.
- Let Maria sound observant, capable, and lightly amused; do not make her passive or generic.
- Legal language should remain elegant metaphor, not procedural homework.
- VN scenes may add warmth and mystery, but they should not reveal the final verdict early.
- Do not add private photos, voice, personal messages, or intimate memories without explicit approval.
- Intro scenes may orient the setting; pre-puzzle scenes should focus on the clue; post-puzzle scenes should give a small emotional breath before the evidence reveal.
- Keep replay kindness in mind: every VN scene must be skippable and should earn its few lines.
- Level 10 VN should stay especially concise and ceremonial. It should lead into the approved verdict instead of repeating or expanding the emotional payoff.
- Part 35 pacing guardrail: keep every VN line comfortably under roughly 110 characters unless there is a deliberate mobile-tested exception.
- Avoid relying on "Clue filed" alone for emotion. Use it as a ritual beat, then let Maria or the narrator add one concise meaning line.
- VN portraits are placeholders only until a later approved art pass. Use speaker identity, monograms, seals, and procedural styling rather than real photos, private images, generated character art, or external portrait assets.
- VN backgrounds should support mood with simple procedural variants. They should never compete with dialogue readability or imply new story locations beyond the existing level setting.
