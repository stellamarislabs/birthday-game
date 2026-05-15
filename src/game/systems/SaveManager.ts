import type { SaveData } from "../../types/SaveData";

export const SAVE_VERSION = 1;
export const DEFAULT_SAVE_KEY = "maria-tenth-exhibit-save";
const FIRST_LEVEL_ID = 1;
const FINAL_LEVEL_ID = 10;

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function createDefaultSaveData(now = new Date()): SaveData {
  return {
    saveVersion: SAVE_VERSION,
    completedLevelIds: [],
    unlockedLevelIds: [FIRST_LEVEL_ID],
    currentLevelId: FIRST_LEVEL_ID,
    gameCompleted: false,
    muted: false,
    reduceMotion: false,
    lastUpdatedAt: now.toISOString()
  };
}

export class SaveManager {
  private data: SaveData;
  private readonly storage: StorageLike | null;
  private readonly key: string;

  constructor(storage: StorageLike | null = resolveBrowserStorage(), key = DEFAULT_SAVE_KEY) {
    this.storage = storage;
    this.key = key;
    this.data = createDefaultSaveData();
    this.data = this.load();
  }

  load(): SaveData {
    if (!this.storage) {
      this.data = cloneSaveData(this.data ?? createDefaultSaveData());
      return cloneSaveData(this.data);
    }

    try {
      const raw = this.storage.getItem(this.key);
      if (!raw) {
        this.data = createDefaultSaveData();
        return cloneSaveData(this.data);
      }

      this.data = normalizeSaveData(JSON.parse(raw));
      return cloneSaveData(this.data);
    } catch {
      this.data = createDefaultSaveData();
      return cloneSaveData(this.data);
    }
  }

  save(data = this.data): SaveData {
    this.data = touchSaveData(normalizeSaveData(data));

    if (this.storage) {
      try {
        this.storage.setItem(this.key, JSON.stringify(this.data));
      } catch {
        // Browsers can reject localStorage writes in private or restricted modes.
      }
    }

    return cloneSaveData(this.data);
  }

  reset(): SaveData {
    this.data = createDefaultSaveData();

    if (this.storage) {
      try {
        this.storage.removeItem(this.key);
      } catch {
        // Reset should still succeed in memory when storage removal fails.
      }
    }

    return this.save(this.data);
  }

  markLevelCompleted(levelId: number): SaveData {
    const safeLevelId = clampLevelId(levelId);
    const completedLevelIds = uniqueSorted([...this.data.completedLevelIds, safeLevelId]);
    const nextLevelId = Math.min(safeLevelId + 1, FINAL_LEVEL_ID);
    const unlockedLevelIds = uniqueSorted([...this.data.unlockedLevelIds, safeLevelId, nextLevelId]);

    return this.save({
      ...this.data,
      completedLevelIds,
      unlockedLevelIds,
      currentLevelId: nextLevelId
    });
  }

  markGameCompleted(): SaveData {
    const completedLevelIds = uniqueSorted([...this.data.completedLevelIds, FINAL_LEVEL_ID]);
    const unlockedLevelIds = uniqueSorted([...this.data.unlockedLevelIds, ...completedLevelIds, FINAL_LEVEL_ID]);

    return this.save({
      ...this.data,
      completedLevelIds,
      unlockedLevelIds,
      currentLevelId: FINAL_LEVEL_ID,
      gameCompleted: true
    });
  }

  unlockLevel(levelId: number): SaveData {
    const safeLevelId = clampLevelId(levelId);

    return this.save({
      ...this.data,
      unlockedLevelIds: uniqueSorted([...this.data.unlockedLevelIds, safeLevelId]),
      currentLevelId: safeLevelId
    });
  }

  setCurrentLevel(levelId: number): SaveData {
    const safeLevelId = clampLevelId(levelId);

    return this.save({
      ...this.data,
      currentLevelId: safeLevelId,
      unlockedLevelIds: uniqueSorted([...this.data.unlockedLevelIds, safeLevelId])
    });
  }

  setCurrentLevelId(levelId: number): SaveData {
    return this.setCurrentLevel(levelId);
  }

  setMuted(value: boolean): SaveData {
    return this.save({ ...this.data, muted: value });
  }

  setReduceMotion(value: boolean): SaveData {
    return this.save({ ...this.data, reduceMotion: value });
  }

  getHighestUnlockedLevel(): number {
    return Math.max(...this.data.unlockedLevelIds, FIRST_LEVEL_ID);
  }

  isLevelCompleted(levelId: number): boolean {
    const safeLevelId = clampLevelId(levelId);
    return this.data.completedLevelIds.includes(safeLevelId);
  }

  isLevelUnlocked(levelId: number): boolean {
    const safeLevelId = clampLevelId(levelId);
    return this.data.unlockedLevelIds.includes(safeLevelId);
  }

  isGameCompleted(): boolean {
    return this.data.gameCompleted;
  }
}

function resolveBrowserStorage(): StorageLike | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeSaveData(value: unknown): SaveData {
  if (!isRecord(value) || value.saveVersion !== SAVE_VERSION) {
    return createDefaultSaveData();
  }

  const completedLevelIds = sanitizeLevelIds(value.completedLevelIds);
  const unlockedLevelIds = uniqueSorted([
    FIRST_LEVEL_ID,
    ...sanitizeLevelIds(value.unlockedLevelIds),
    ...completedLevelIds,
    ...completedLevelIds.map((levelId) => Math.min(levelId + 1, FINAL_LEVEL_ID))
  ]);
  const currentLevelId = unlockedLevelIds.includes(Number(value.currentLevelId))
    ? Number(value.currentLevelId)
    : getHighest(unlockedLevelIds);
  const gameCompleted = Boolean(value.gameCompleted) && completedLevelIds.includes(FINAL_LEVEL_ID);

  return {
    saveVersion: SAVE_VERSION,
    completedLevelIds,
    unlockedLevelIds,
    currentLevelId,
    gameCompleted,
    muted: Boolean(value.muted),
    reduceMotion: Boolean(value.reduceMotion),
    lastUpdatedAt: typeof value.lastUpdatedAt === "string" ? value.lastUpdatedAt : new Date().toISOString()
  };
}

function touchSaveData(data: SaveData): SaveData {
  return {
    ...data,
    lastUpdatedAt: new Date().toISOString()
  };
}

function sanitizeLevelIds(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return uniqueSorted(value.map(Number).filter((id) => Number.isInteger(id) && id >= FIRST_LEVEL_ID && id <= FINAL_LEVEL_ID));
}

function uniqueSorted(levelIds: number[]): number[] {
  return [...new Set(levelIds)].sort((a, b) => a - b);
}

function clampLevelId(levelId: number): number {
  if (!Number.isFinite(levelId)) {
    return FIRST_LEVEL_ID;
  }

  return Math.min(Math.max(Math.trunc(levelId), FIRST_LEVEL_ID), FINAL_LEVEL_ID);
}

function getHighest(levelIds: number[]): number {
  return Math.max(...levelIds, FIRST_LEVEL_ID);
}

function cloneSaveData(data: SaveData): SaveData {
  return {
    ...data,
    completedLevelIds: [...data.completedLevelIds],
    unlockedLevelIds: [...data.unlockedLevelIds]
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
