type ToneName = "ui-click" | "exhibit" | "checkpoint" | "puzzle-success" | "puzzle-wrong" | "verdict";

interface AudioParamLike {
  value: number;
  setValueAtTime?: (value: number, time: number) => void;
  exponentialRampToValueAtTime?: (value: number, time: number) => void;
}

interface OscillatorLike {
  type: OscillatorType;
  frequency: AudioParamLike;
  connect: (node: GainLike) => void;
  start: (time?: number) => void;
  stop: (time?: number) => void;
}

interface GainLike {
  gain: AudioParamLike;
  connect: (destination: unknown) => void;
}

interface AudioContextLike {
  currentTime: number;
  state: "closed" | "running" | "suspended";
  destination: unknown;
  createOscillator: () => OscillatorLike;
  createGain: () => GainLike;
  resume: () => Promise<void>;
}

interface ToneSpec {
  frequency: number;
  durationSeconds: number;
  gain: number;
  type?: OscillatorType;
}

type AudioContextFactory = () => AudioContextLike | null;

interface MusicAudioLike {
  loop: boolean;
  volume: number;
  currentTime: number;
  play: () => Promise<void> | void;
  pause: () => void;
}

export interface MusicTrackRequest {
  key: string;
  audioUrl?: string;
  volume: number;
}

type MusicAudioFactory = (audioUrl: string) => MusicAudioLike | null;

const TONES: Record<ToneName, ToneSpec> = {
  "ui-click": { frequency: 420, durationSeconds: 0.045, gain: 0.025, type: "triangle" },
  exhibit: { frequency: 640, durationSeconds: 0.14, gain: 0.045, type: "sine" },
  checkpoint: { frequency: 520, durationSeconds: 0.1, gain: 0.036, type: "triangle" },
  "puzzle-success": { frequency: 720, durationSeconds: 0.16, gain: 0.04, type: "sine" },
  "puzzle-wrong": { frequency: 230, durationSeconds: 0.09, gain: 0.022, type: "triangle" },
  verdict: { frequency: 880, durationSeconds: 0.22, gain: 0.04, type: "sine" }
};

export class AudioManager {
  private context: AudioContextLike | null = null;
  private muted = false;
  private currentMusicKey: string | null = null;
  private currentMusic: MusicAudioLike | null = null;
  private pendingMusic: MusicTrackRequest | null = null;

  constructor(
    private readonly createContext: AudioContextFactory = createBrowserAudioContext,
    private readonly createMusicAudio: MusicAudioFactory = createBrowserMusicAudio
  ) {}

  setMuted(value: boolean): void {
    this.muted = value;
    if (value) {
      this.stopMusic();
    } else if (this.pendingMusic) {
      this.playPendingMusic();
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  unlock(): boolean {
    if (this.muted) {
      return false;
    }

    const context = this.getContext();
    if (!context) {
      this.playPendingMusic();
      return this.currentMusic !== null;
    }

    if (context.state === "suspended") {
      void context.resume().catch(() => {
        // Audio should never be able to crash the gift flow.
      });
    }

    this.playPendingMusic();

    return true;
  }

  playUiClick(): boolean {
    return this.playTone("ui-click");
  }

  playExhibit(): boolean {
    return this.playTone("exhibit");
  }

  playCheckpoint(): boolean {
    return this.playTone("checkpoint");
  }

  playPuzzleSuccess(): boolean {
    return this.playTone("puzzle-success");
  }

  playPuzzleWrong(): boolean {
    return this.playTone("puzzle-wrong");
  }

  playVerdict(): boolean {
    return this.playTone("verdict");
  }

  playMusic(track: MusicTrackRequest | undefined): boolean {
    if (!track?.audioUrl || this.muted) {
      return false;
    }

    if (this.currentMusicKey === track.key && this.currentMusic && this.pendingMusic?.key !== track.key) {
      return true;
    }

    let audio = this.currentMusicKey === track.key ? this.currentMusic : null;
    if (!audio) {
      this.stopCurrentMusic();
      audio = this.createMusicAudio(track.audioUrl);
      if (!audio) {
        this.pendingMusic = track;
        return false;
      }
    }

    this.currentMusicKey = track.key;
    this.currentMusic = audio;
    audio.loop = true;
    audio.volume = track.volume;

    try {
      const playResult = audio.play();
      if (playResult && typeof playResult.then === "function") {
        void playResult.catch(() => {
          if (this.currentMusicKey === track.key) {
            this.pendingMusic = track;
          }
        });
      }
      this.pendingMusic = null;
      return true;
    } catch {
      this.pendingMusic = track;
      return false;
    }
  }

  stopMusic(): void {
    this.pendingMusic = null;
    this.stopCurrentMusic();
  }

  private playTone(name: ToneName): boolean {
    if (this.muted) {
      return false;
    }

    const context = this.getContext();
    if (!context || context.state === "closed") {
      return false;
    }

    try {
      const tone = TONES[name];
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = tone.type ?? "sine";
      oscillator.frequency.value = tone.frequency;
      gain.gain.setValueAtTime?.(tone.gain, now);
      gain.gain.exponentialRampToValueAtTime?.(0.001, now + tone.durationSeconds);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + tone.durationSeconds);
      return true;
    } catch {
      return false;
    }
  }

  private getContext(): AudioContextLike | null {
    if (!this.context) {
      this.context = this.createContext();
    }

    return this.context;
  }

  private playPendingMusic(): void {
    const pendingMusic = this.pendingMusic;
    if (!pendingMusic || this.muted) {
      return;
    }

    this.playMusic(pendingMusic);
  }

  private stopCurrentMusic(): void {
    if (!this.currentMusic) {
      this.currentMusicKey = null;
      return;
    }

    try {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    } catch {
      // Music should never be able to crash the gift flow.
    }

    this.currentMusic = null;
    this.currentMusicKey = null;
  }
}

const sharedAudioManager = new AudioManager();

export function getAudioManager(): AudioManager {
  return sharedAudioManager;
}

export function installAudioGestureUnlock(target: Document = document): void {
  const unlock = () => getAudioManager().unlock();
  target.addEventListener("pointerdown", unlock, { passive: true });
  target.addEventListener("keydown", unlock);
}

export function installButtonClickAudio(target: Document = document): void {
  target.addEventListener(
    "click",
    (event) => {
      const targetElement = event.target instanceof Element ? event.target : null;
      if (targetElement?.closest("button")) {
        getAudioManager().playUiClick();
      }
    },
    { passive: true }
  );
}

function createBrowserAudioContext(): AudioContextLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  const audioWindow = window as typeof window & { webkitAudioContext?: typeof AudioContext };
  const AudioContextConstructor = audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
  if (!AudioContextConstructor) {
    return null;
  }

  return new AudioContextConstructor() as unknown as AudioContextLike;
}

function createBrowserMusicAudio(audioUrl: string): MusicAudioLike | null {
  if (typeof Audio === "undefined") {
    return null;
  }

  return new Audio(audioUrl);
}
