import { describe, expect, it } from "vitest";
import { DEFAULT_SAVE_KEY, SaveManager, type StorageLike } from "../game/systems/SaveManager";

class MemoryStorage implements StorageLike {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

describe("SaveManager", () => {
  it("creates a default save", () => {
    const save = new SaveManager(new MemoryStorage()).load();

    expect(save.saveVersion).toBe(1);
    expect(save.completedLevelIds).toEqual([]);
    expect(save.unlockedLevelIds).toEqual([1]);
    expect(save.currentLevelId).toBe(1);
    expect(save.gameCompleted).toBe(false);
  });

  it("can mark a level completed", () => {
    const manager = new SaveManager(new MemoryStorage());
    const save = manager.markLevelCompleted(1);

    expect(save.completedLevelIds).toEqual([1]);
    expect(save.unlockedLevelIds).toEqual([1, 2]);
    expect(save.currentLevelId).toBe(2);
    expect(manager.isLevelCompleted(1)).toBe(true);
    expect(manager.isLevelCompleted(2)).toBe(false);
  });

  it("can unlock a level", () => {
    const manager = new SaveManager(new MemoryStorage());
    const save = manager.unlockLevel(4);

    expect(save.unlockedLevelIds).toEqual([1, 4]);
    expect(save.currentLevelId).toBe(4);
    expect(manager.getHighestUnlockedLevel()).toBe(4);
    expect(manager.isLevelUnlocked(4)).toBe(true);
    expect(manager.isLevelUnlocked(5)).toBe(false);
  });

  it("can set the current level without changing the save schema", () => {
    const manager = new SaveManager(new MemoryStorage());
    const save = manager.setCurrentLevel(1);

    expect(save.saveVersion).toBe(1);
    expect(save.currentLevelId).toBe(1);
    expect(save.unlockedLevelIds).toEqual([1]);
  });

  it("handles corrupted storage without crashing", () => {
    const storage = new MemoryStorage();
    storage.setItem(DEFAULT_SAVE_KEY, "{not-json");

    const save = new SaveManager(storage).load();

    expect(save.saveVersion).toBe(1);
    expect(save.unlockedLevelIds).toEqual([1]);
  });

  it("normalizes partial save data safely", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DEFAULT_SAVE_KEY,
      JSON.stringify({
        saveVersion: 1,
        muted: true
      })
    );

    const save = new SaveManager(storage).load();

    expect(save.saveVersion).toBe(1);
    expect(save.completedLevelIds).toEqual([]);
    expect(save.unlockedLevelIds).toEqual([1]);
    expect(save.currentLevelId).toBe(1);
    expect(save.gameCompleted).toBe(false);
    expect(save.muted).toBe(true);
    expect(save.reduceMotion).toBe(false);
  });

  it("does not trust a partial gameCompleted flag without Level 10 completion", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DEFAULT_SAVE_KEY,
      JSON.stringify({
        saveVersion: 1,
        completedLevelIds: [1, 2, 3],
        unlockedLevelIds: [1, 2, 3, 4],
        currentLevelId: 4,
        gameCompleted: true,
        muted: false,
        reduceMotion: false,
        lastUpdatedAt: "2026-05-02T00:00:00.000Z"
      })
    );

    const save = new SaveManager(storage).load();

    expect(save.completedLevelIds).toEqual([1, 2, 3]);
    expect(save.currentLevelId).toBe(4);
    expect(save.gameCompleted).toBe(false);
  });

  it("keeps gameCompleted true when a normalized save has Level 10 completed", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DEFAULT_SAVE_KEY,
      JSON.stringify({
        saveVersion: 1,
        completedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        currentLevelId: 10,
        gameCompleted: true,
        muted: false,
        reduceMotion: false,
        lastUpdatedAt: "2026-05-02T00:00:00.000Z"
      })
    );

    const save = new SaveManager(storage).load();

    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(save.gameCompleted).toBe(true);
  });

  it("ignores invalid level ids and unlocks only the next completed level", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DEFAULT_SAVE_KEY,
      JSON.stringify({
        saveVersion: 1,
        completedLevelIds: [1, 999, -2, "not-a-level"],
        unlockedLevelIds: [1, 99],
        currentLevelId: 99,
        muted: false,
        reduceMotion: false,
        lastUpdatedAt: "2026-05-02T00:00:00.000Z"
      })
    );

    const save = new SaveManager(storage).load();

    expect(save.completedLevelIds).toEqual([1]);
    expect(save.unlockedLevelIds).toEqual([1, 2]);
    expect(save.currentLevelId).toBe(2);
  });

  it("does not unlock levels 3 through 10 after completing level 1", () => {
    const manager = new SaveManager(new MemoryStorage());
    const save = manager.markLevelCompleted(1);

    expect(save.unlockedLevelIds).toEqual([1, 2]);
    for (let levelId = 3; levelId <= 10; levelId += 1) {
      expect(manager.isLevelUnlocked(levelId)).toBe(false);
    }
  });

  it("does not mark Level 2 completed when only Level 1 is complete", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);

    expect(manager.isLevelCompleted(2)).toBe(false);
    expect(manager.isLevelUnlocked(3)).toBe(false);
  });

  it("completing Level 2 marks only Level 2 next and unlocks Level 3", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    const save = manager.markLevelCompleted(2);

    expect(save.completedLevelIds).toEqual([1, 2]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3]);
    expect(manager.isLevelCompleted(3)).toBe(false);
    expect(manager.isLevelUnlocked(3)).toBe(true);

    for (let levelId = 4; levelId <= 10; levelId += 1) {
      expect(manager.isLevelUnlocked(levelId)).toBe(false);
    }
  });

  it("starting Level 3 does not mark it completed or unlock Level 4", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    const save = manager.setCurrentLevel(3);

    expect(save.currentLevelId).toBe(3);
    expect(save.completedLevelIds).toEqual([1, 2]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3]);
    expect(manager.isLevelCompleted(3)).toBe(false);
    expect(manager.isLevelUnlocked(4)).toBe(false);
  });

  it("completing Level 3 marks only Level 3 next and unlocks Level 4", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    const save = manager.markLevelCompleted(3);

    expect(save.completedLevelIds).toEqual([1, 2, 3]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4]);
    expect(manager.isLevelCompleted(4)).toBe(false);
    expect(manager.isLevelUnlocked(4)).toBe(true);

    for (let levelId = 5; levelId <= 10; levelId += 1) {
      expect(manager.isLevelUnlocked(levelId)).toBe(false);
    }
  });

  it("starting Level 4 does not mark it completed or unlock Level 5", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    const save = manager.setCurrentLevel(4);

    expect(save.currentLevelId).toBe(4);
    expect(save.completedLevelIds).toEqual([1, 2, 3]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4]);
    expect(manager.isLevelCompleted(4)).toBe(false);
    expect(manager.isLevelUnlocked(5)).toBe(false);
  });

  it("completing Level 4 marks only Level 4 next and unlocks Level 5", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    const save = manager.markLevelCompleted(4);

    expect(save.completedLevelIds).toEqual([1, 2, 3, 4]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5]);
    expect(manager.isLevelCompleted(5)).toBe(false);
    expect(manager.isLevelUnlocked(5)).toBe(true);

    for (let levelId = 6; levelId <= 10; levelId += 1) {
      expect(manager.isLevelUnlocked(levelId)).toBe(false);
    }
  });

  it("starting Level 5 does not mark it completed or unlock Level 6", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    manager.markLevelCompleted(4);
    const save = manager.setCurrentLevel(5);

    expect(save.currentLevelId).toBe(5);
    expect(save.completedLevelIds).toEqual([1, 2, 3, 4]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5]);
    expect(manager.isLevelCompleted(5)).toBe(false);
    expect(manager.isLevelUnlocked(6)).toBe(false);
  });

  it("completing Level 5 marks only Level 5 next and unlocks Level 6", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    manager.markLevelCompleted(4);
    const save = manager.markLevelCompleted(5);

    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6]);
    expect(manager.isLevelCompleted(6)).toBe(false);
    expect(manager.isLevelUnlocked(6)).toBe(true);

    for (let levelId = 7; levelId <= 10; levelId += 1) {
      expect(manager.isLevelUnlocked(levelId)).toBe(false);
    }
  });

  it("starting Level 6 does not mark it completed or unlock Level 7", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    manager.markLevelCompleted(4);
    manager.markLevelCompleted(5);
    const save = manager.setCurrentLevel(6);

    expect(save.currentLevelId).toBe(6);
    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6]);
    expect(manager.isLevelCompleted(6)).toBe(false);
    expect(manager.isLevelUnlocked(7)).toBe(false);
  });

  it("completing Level 6 marks only Level 6 next and unlocks Level 7", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    manager.markLevelCompleted(4);
    manager.markLevelCompleted(5);
    const save = manager.markLevelCompleted(6);

    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(manager.isLevelCompleted(7)).toBe(false);
    expect(manager.isLevelUnlocked(7)).toBe(true);

    for (let levelId = 8; levelId <= 10; levelId += 1) {
      expect(manager.isLevelUnlocked(levelId)).toBe(false);
    }
  });

  it("starting Level 7 does not mark it completed or unlock Level 8", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    manager.markLevelCompleted(4);
    manager.markLevelCompleted(5);
    manager.markLevelCompleted(6);
    const save = manager.setCurrentLevel(7);

    expect(save.currentLevelId).toBe(7);
    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(manager.isLevelCompleted(7)).toBe(false);
    expect(manager.isLevelUnlocked(8)).toBe(false);
  });

  it("completing Level 7 marks only Level 7 next and unlocks Level 8", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    manager.markLevelCompleted(4);
    manager.markLevelCompleted(5);
    manager.markLevelCompleted(6);
    const save = manager.markLevelCompleted(7);

    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(manager.isLevelCompleted(8)).toBe(false);
    expect(manager.isLevelUnlocked(8)).toBe(true);
    expect(manager.isLevelUnlocked(9)).toBe(false);
    expect(manager.isLevelUnlocked(10)).toBe(false);
  });

  it("starting Level 8 does not mark it completed or unlock Level 9", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    manager.markLevelCompleted(4);
    manager.markLevelCompleted(5);
    manager.markLevelCompleted(6);
    manager.markLevelCompleted(7);
    const save = manager.setCurrentLevel(8);

    expect(save.currentLevelId).toBe(8);
    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(manager.isLevelCompleted(8)).toBe(false);
    expect(manager.isLevelUnlocked(9)).toBe(false);
  });

  it("completing Level 8 marks only Level 8 next and unlocks Level 9", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    manager.markLevelCompleted(4);
    manager.markLevelCompleted(5);
    manager.markLevelCompleted(6);
    manager.markLevelCompleted(7);
    const save = manager.markLevelCompleted(8);

    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(manager.isLevelCompleted(9)).toBe(false);
    expect(manager.isLevelUnlocked(9)).toBe(true);
    expect(manager.isLevelUnlocked(10)).toBe(false);
  });

  it("starting Level 9 does not mark it completed or unlock Level 10", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.markLevelCompleted(2);
    manager.markLevelCompleted(3);
    manager.markLevelCompleted(4);
    manager.markLevelCompleted(5);
    manager.markLevelCompleted(6);
    manager.markLevelCompleted(7);
    manager.markLevelCompleted(8);
    const save = manager.setCurrentLevel(9);

    expect(save.currentLevelId).toBe(9);
    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(manager.isLevelCompleted(9)).toBe(false);
    expect(manager.isLevelUnlocked(10)).toBe(false);
  });

  it("completing Level 9 marks only Level 9 next and unlocks Level 10", () => {
    const manager = new SaveManager(new MemoryStorage());
    for (let levelId = 1; levelId <= 8; levelId += 1) {
      manager.markLevelCompleted(levelId);
    }

    const save = manager.markLevelCompleted(9);

    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(manager.isLevelCompleted(10)).toBe(false);
    expect(manager.isLevelUnlocked(10)).toBe(true);
  });

  it("starting Level 10 does not mark it completed", () => {
    const manager = new SaveManager(new MemoryStorage());
    for (let levelId = 1; levelId <= 9; levelId += 1) {
      manager.markLevelCompleted(levelId);
    }

    const save = manager.setCurrentLevel(10);

    expect(save.currentLevelId).toBe(10);
    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(manager.isLevelCompleted(10)).toBe(false);
  });

  it("accepting the final verdict marks Level 10 and the game completed", () => {
    const manager = new SaveManager(new MemoryStorage());
    for (let levelId = 1; levelId <= 9; levelId += 1) {
      manager.markLevelCompleted(levelId);
    }

    const save = manager.markGameCompleted();

    expect(save.completedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(save.unlockedLevelIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(save.currentLevelId).toBe(10);
    expect(save.gameCompleted).toBe(true);
    expect(manager.isLevelCompleted(10)).toBe(true);
    expect(manager.isGameCompleted()).toBe(true);
  });

  it("game completion preserves settings", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.setMuted(true);
    manager.setReduceMotion(true);

    const save = manager.markGameCompleted();

    expect(save.muted).toBe(true);
    expect(save.reduceMotion).toBe(true);
    expect(save.gameCompleted).toBe(true);
  });

  it("persists muted and reduce motion settings", () => {
    const storage = new MemoryStorage();
    const manager = new SaveManager(storage);
    manager.setMuted(true);
    manager.setReduceMotion(true);

    const reloaded = new SaveManager(storage).load();

    expect(reloaded.muted).toBe(true);
    expect(reloaded.reduceMotion).toBe(true);
  });

  it("reset returns to default progress", () => {
    const manager = new SaveManager(new MemoryStorage());
    manager.markLevelCompleted(1);
    manager.setMuted(true);

    const save = manager.reset();

    expect(save.completedLevelIds).toEqual([]);
    expect(save.unlockedLevelIds).toEqual([1]);
    expect(save.currentLevelId).toBe(1);
    expect(save.muted).toBe(false);
  });

  it("keeps working when storage is missing", () => {
    const manager = new SaveManager(null);
    const save = manager.markLevelCompleted(1);

    expect(save.completedLevelIds).toEqual([1]);
    expect(save.unlockedLevelIds).toEqual([1, 2]);
  });
});
