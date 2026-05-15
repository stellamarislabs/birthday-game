import { describe, expect, it, vi } from "vitest";
import { AudioManager } from "../game/systems/AudioManager";

function createFakeAudioContext(state: "running" | "suspended" = "running") {
  const oscillator = {
    type: "sine" as OscillatorType,
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn()
  };
  const gain = {
    gain: {
      value: 0,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn()
    },
    connect: vi.fn()
  };
  const context = {
    currentTime: 4,
    state,
    destination: {},
    createOscillator: vi.fn(() => oscillator),
    createGain: vi.fn(() => gain),
    resume: vi.fn(async () => undefined)
  };

  return { context, oscillator, gain };
}

function createFakeMusicAudio(play = vi.fn(async () => undefined)) {
  return {
    loop: false,
    volume: 0,
    currentTime: 12,
    play,
    pause: vi.fn()
  };
}

describe("AudioManager", () => {
  it("starts unmuted and can update muted state", () => {
    const audio = new AudioManager(() => null);

    expect(audio.isMuted()).toBe(false);
    audio.setMuted(true);
    expect(audio.isMuted()).toBe(true);
  });

  it("does not create or play audio while muted", () => {
    const factory = vi.fn(() => createFakeAudioContext().context);
    const audio = new AudioManager(factory);

    audio.setMuted(true);

    expect(audio.playUiClick()).toBe(false);
    expect(factory).not.toHaveBeenCalled();
  });

  it("plays a short generated tone when audio is available", () => {
    const { context, oscillator, gain } = createFakeAudioContext();
    const audio = new AudioManager(() => context);

    expect(audio.playExhibit()).toBe(true);
    expect(context.createOscillator).toHaveBeenCalledOnce();
    expect(context.createGain).toHaveBeenCalledOnce();
    expect(oscillator.connect).toHaveBeenCalledWith(gain);
    expect(gain.connect).toHaveBeenCalledWith(context.destination);
    expect(oscillator.start).toHaveBeenCalledWith(4);
    expect(oscillator.stop).toHaveBeenCalledWith(expect.any(Number));
  });

  it("attempts to resume suspended audio on unlock", () => {
    const { context } = createFakeAudioContext("suspended");
    const audio = new AudioManager(() => context);

    expect(audio.unlock()).toBe(true);
    expect(context.resume).toHaveBeenCalledOnce();
  });

  it("fails safely when no audio context is available", () => {
    const audio = new AudioManager(() => null);

    expect(audio.unlock()).toBe(false);
    expect(audio.playVerdict()).toBe(false);
  });

  it("plays looping music with the requested volume", () => {
    const music = createFakeMusicAudio();
    const factory = vi.fn(() => music);
    const audio = new AudioManager(() => null, factory);

    expect(audio.playMusic({ key: "chapter-1", audioUrl: "/music/Chapter1.ogg", volume: 0.26 })).toBe(true);

    expect(factory).toHaveBeenCalledWith("/music/Chapter1.ogg");
    expect(music.loop).toBe(true);
    expect(music.volume).toBe(0.26);
    expect(music.play).toHaveBeenCalledOnce();
  });

  it("does not stack duplicate copies of the same music track", () => {
    const music = createFakeMusicAudio();
    const factory = vi.fn(() => music);
    const audio = new AudioManager(() => null, factory);

    audio.playMusic({ key: "chapter-1", audioUrl: "/music/Chapter1.ogg", volume: 0.26 });
    audio.playMusic({ key: "chapter-1", audioUrl: "/music/Chapter1.ogg", volume: 0.26 });

    expect(factory).toHaveBeenCalledOnce();
    expect(music.play).toHaveBeenCalledOnce();
  });

  it("stops the previous music track when switching chapters", () => {
    const first = createFakeMusicAudio();
    const second = createFakeMusicAudio();
    const factory = vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(second);
    const audio = new AudioManager(() => null, factory);

    audio.playMusic({ key: "chapter-1", audioUrl: "/music/Chapter1.ogg", volume: 0.26 });
    audio.playMusic({ key: "chapter-2", audioUrl: "/music/Chapter2.ogg", volume: 0.26 });

    expect(first.pause).toHaveBeenCalledOnce();
    expect(first.currentTime).toBe(0);
    expect(second.play).toHaveBeenCalledOnce();
  });

  it("queues blocked music and retries on the next unlock gesture", async () => {
    const blocked = createFakeMusicAudio(vi.fn(async () => Promise.reject(new Error("blocked"))));
    const factory = vi.fn(() => blocked);
    const audio = new AudioManager(() => null, factory);

    expect(audio.playMusic({ key: "chapter-1", audioUrl: "/music/Chapter1.ogg", volume: 0.26 })).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(audio.unlock()).toBe(true);
    expect(blocked.play).toHaveBeenCalledTimes(2);
    expect(factory).toHaveBeenCalledOnce();
  });

  it("stops music cleanly", () => {
    const music = createFakeMusicAudio();
    const audio = new AudioManager(() => null, () => music);

    audio.playMusic({ key: "chapter-1", audioUrl: "/music/Chapter1.ogg", volume: 0.26 });
    audio.stopMusic();

    expect(music.pause).toHaveBeenCalledOnce();
    expect(music.currentTime).toBe(0);
  });
});
