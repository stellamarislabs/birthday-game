# Credits

This project is made as a personal birthday gift.

User-provided generated final images and chapter background music have been added for the game flow. No fonts, photos, private messages, or personal recordings have been added.

The current build otherwise uses Phaser shapes, DOM/CSS UI, and small procedural WebAudio tones generated in code.

## Art Assets

- `src/assets/title/main-menu-background.webp`
  - Purpose: Main menu background.
  - Source: User-provided generated image from `ChatGPT Image May 3, 2026, 11_21_50 PM.webp`.
  - License/permission: User supplied the image for this project.
  - Notes: No real portrait, private photo, external asset pack, music, or audio file.
- `src/assets/title/opening-start-background.webp`
  - Purpose: First opening Start screen background.
  - Source: User-provided generated image from `mainback.webp`.
  - License/permission: User supplied the image for this project.
  - Notes: Used only for the opening Start gate; the main menu background remains separate.

## Music Assets

- `src/assets/final/music/OpeningandMainMenu.mp3` / `src/assets/final/music/OpeningandMainMenu.ogg`
  - Purpose: Shared opening cinematic, main menu, Case Archive, Final Verdict, and Evidence of Love bonus background music.
  - Source: User-provided audio files.
  - License/permission: User supplied the files for this project.
  - Notes: Music starts after the opening Start action, returns for the final verdict flow, prefers MP3 for browser compatibility, keeps OGG as fallback, and stops before Chapter story or video-page playback.
- `src/assets/final/music/Chapter1.mp3` / `src/assets/final/music/Chapter1.ogg`
- `src/assets/final/music/Chapter2.mp3` / `src/assets/final/music/Chapter2.ogg`
- `src/assets/final/music/Chapter3.mp3` / `src/assets/final/music/Chapter3.ogg`
- `src/assets/final/music/Chapter4.mp3` / `src/assets/final/music/Chapter4.ogg`
- `src/assets/final/music/Chapter5.mp3` / `src/assets/final/music/Chapter5.ogg`
- `src/assets/final/music/Chapter6.mp3` / `src/assets/final/music/Chapter6.ogg`
  - Purpose: Chapter-specific platformer background music for active Chapters 1-6.
  - Source: User-provided audio files.
  - License/permission: User supplied the files for this project.
  - Notes: Music is on by default, prefers MP3 for browser compatibility, keeps OGG as fallback, and starts only after browser/user interaction allows playback.

## Code Dependencies

- Phaser 3 for browser game rendering and scene management.
- Vite for local development and static builds.
- TypeScript for typed implementation.
- Vitest for deterministic unit tests.
- Playwright for browser smoke-test scaffolding.

## Future Asset Rules

- Track every third-party asset here before release.
- Credit third-party art, fonts, music, and sound effects with source links and license names.
- Prefer CC0 or clearly permissive assets for rapid production.
- Remember that code license and asset license can differ.
- Do not add Maria's private photos, messages, recordings, or personal materials to a public repo unless intentionally approved.
