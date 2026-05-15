import type { SaveData } from "../../types/SaveData";

export type LevelAvailabilityStatus = "completed" | "playable" | "coming-soon" | "locked";

export interface LevelAvailability {
  levelId: number;
  playable: boolean;
  status: LevelAvailabilityStatus;
  label: string;
}

export function getLevelAvailability(levelId: number, save: Pick<SaveData, "completedLevelIds" | "unlockedLevelIds">): LevelAvailability {
  const completed = save.completedLevelIds.includes(levelId);
  const unlocked = save.unlockedLevelIds.includes(levelId);

  if (completed) {
    return {
      levelId,
      playable: levelId <= 10,
      status: "completed",
      label: levelId === 10 ? "Completed / Replay Finale" : "Completed / Replay"
    };
  }

  if (levelId === 1 && unlocked) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Play"
    };
  }

  if (levelId === 2 && unlocked && save.completedLevelIds.includes(1)) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Next Clue"
    };
  }

  if (levelId === 3 && unlocked && save.completedLevelIds.includes(2)) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Next Clue"
    };
  }

  if (levelId === 4 && unlocked && save.completedLevelIds.includes(3)) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Next Clue"
    };
  }

  if (levelId === 5 && unlocked && save.completedLevelIds.includes(4)) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Next Clue"
    };
  }

  if (levelId === 6 && unlocked && save.completedLevelIds.includes(5)) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Next Clue"
    };
  }

  if (levelId === 7 && unlocked && save.completedLevelIds.includes(6)) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Next Clue"
    };
  }

  if (levelId === 8 && unlocked && save.completedLevelIds.includes(7)) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Next Clue"
    };
  }

  if (levelId === 9 && unlocked && save.completedLevelIds.includes(8)) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Next Clue"
    };
  }

  if (levelId === 10 && unlocked && save.completedLevelIds.includes(9)) {
    return {
      levelId,
      playable: true,
      status: "playable",
      label: "Finale"
    };
  }

  if ((levelId >= 2 && levelId <= 8) && unlocked) {
    return {
      levelId,
      playable: false,
      status: "coming-soon",
      label: "Coming Soon"
    };
  }

  return {
    levelId,
    playable: false,
    status: "locked",
    label: "Locked"
  };
}
