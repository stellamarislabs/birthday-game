import { describe, expect, it } from "vitest";
import { createDefaultSaveData } from "../game/systems/SaveManager";
import { getLevelAvailability } from "../game/systems/LevelAvailability";

describe("LevelAvailability", () => {
  it("keeps Level 2 locked before Level 1 completion", () => {
    const save = createDefaultSaveData();

    expect(getLevelAvailability(2, save)).toMatchObject({
      playable: false,
      status: "locked"
    });
  });

  it("makes Level 2 playable after Level 1 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1],
      unlockedLevelIds: [1, 2],
      currentLevelId: 2
    };

    expect(getLevelAvailability(2, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Next Clue"
    });
  });

  it("keeps Levels 3 through 10 locked after Level 1 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1],
      unlockedLevelIds: [1, 2],
      currentLevelId: 2
    };

    for (let levelId = 3; levelId <= 10; levelId += 1) {
      expect(getLevelAvailability(levelId, save)).toMatchObject({
        playable: false,
        status: "locked"
      });
    }
  });

  it("makes Level 3 playable after Level 2 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2],
      unlockedLevelIds: [1, 2, 3],
      currentLevelId: 3
    };

    expect(getLevelAvailability(2, save)).toMatchObject({
      playable: true,
      status: "completed"
    });
    expect(getLevelAvailability(3, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Next Clue"
    });

    for (let levelId = 4; levelId <= 10; levelId += 1) {
      expect(getLevelAvailability(levelId, save)).toMatchObject({
        playable: false,
        status: "locked"
      });
    }
  });

  it("does not make Level 4 playable after Level 3 starts", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2],
      unlockedLevelIds: [1, 2, 3],
      currentLevelId: 3
    };

    expect(getLevelAvailability(4, save)).toMatchObject({
      playable: false,
      status: "locked"
    });
  });

  it("makes Level 4 playable after Level 3 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3],
      unlockedLevelIds: [1, 2, 3, 4],
      currentLevelId: 4
    };

    expect(getLevelAvailability(3, save)).toMatchObject({
      playable: true,
      status: "completed"
    });
    expect(getLevelAvailability(4, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Next Clue"
    });

    for (let levelId = 5; levelId <= 10; levelId += 1) {
      expect(getLevelAvailability(levelId, save)).toMatchObject({
        playable: false,
        status: "locked"
      });
    }
  });

  it("does not make Level 5 playable after Level 4 starts", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3],
      unlockedLevelIds: [1, 2, 3, 4],
      currentLevelId: 4
    };

    expect(getLevelAvailability(5, save)).toMatchObject({
      playable: false,
      status: "locked"
    });
  });

  it("makes Level 5 playable after Level 4 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4],
      unlockedLevelIds: [1, 2, 3, 4, 5],
      currentLevelId: 5
    };

    expect(getLevelAvailability(4, save)).toMatchObject({
      playable: true,
      status: "completed",
      label: "Completed / Replay"
    });
    expect(getLevelAvailability(5, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Next Clue"
    });

    for (let levelId = 6; levelId <= 10; levelId += 1) {
      expect(getLevelAvailability(levelId, save)).toMatchObject({
        playable: false,
        status: "locked"
      });
    }
  });

  it("makes Level 6 playable after Level 5 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6],
      currentLevelId: 6
    };

    expect(getLevelAvailability(5, save)).toMatchObject({
      playable: true,
      status: "completed",
      label: "Completed / Replay"
    });
    expect(getLevelAvailability(6, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Next Clue"
    });

    for (let levelId = 7; levelId <= 10; levelId += 1) {
      expect(getLevelAvailability(levelId, save)).toMatchObject({
        playable: false,
        status: "locked"
      });
    }
  });

  it("does not make Level 7 playable after Level 6 starts", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6],
      currentLevelId: 6
    };

    expect(getLevelAvailability(7, save)).toMatchObject({
      playable: false,
      status: "locked"
    });
  });

  it("makes Level 7 playable after Level 6 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5, 6],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7],
      currentLevelId: 7
    };

    expect(getLevelAvailability(6, save)).toMatchObject({
      playable: true,
      status: "completed",
      label: "Completed / Replay"
    });
    expect(getLevelAvailability(7, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Next Clue"
    });

    for (let levelId = 8; levelId <= 10; levelId += 1) {
      expect(getLevelAvailability(levelId, save)).toMatchObject({
        playable: false,
        status: "locked"
      });
    }
  });

  it("does not make Level 8 playable after Level 7 starts", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5, 6],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7],
      currentLevelId: 7
    };

    expect(getLevelAvailability(8, save)).toMatchObject({
      playable: false,
      status: "locked"
    });
  });

  it("makes Level 8 playable after Level 7 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5, 6, 7],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8],
      currentLevelId: 8
    };

    expect(getLevelAvailability(7, save)).toMatchObject({
      playable: true,
      status: "completed",
      label: "Completed / Replay"
    });
    expect(getLevelAvailability(8, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Next Clue"
    });

    expect(getLevelAvailability(9, save)).toMatchObject({
      playable: false,
      status: "locked"
    });
    expect(getLevelAvailability(10, save)).toMatchObject({
      playable: false,
      status: "locked"
    });
  });

  it("makes Level 9 playable after Level 8 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      currentLevelId: 9
    };

    expect(getLevelAvailability(8, save)).toMatchObject({
      playable: true,
      status: "completed",
      label: "Completed / Replay"
    });
    expect(getLevelAvailability(9, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Next Clue"
    });
    expect(getLevelAvailability(10, save)).toMatchObject({
      playable: false,
      status: "locked"
    });
  });

  it("does not make Level 9 playable before Level 8 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5, 6, 7],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8],
      currentLevelId: 8
    };

    expect(getLevelAvailability(9, save)).toMatchObject({
      playable: false,
      status: "locked"
    });
  });

  it("makes Level 10 playable as the finale platformer after Level 9 completion", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      currentLevelId: 10
    };

    expect(getLevelAvailability(9, save)).toMatchObject({
      playable: true,
      status: "completed",
      label: "Completed / Replay"
    });
    expect(getLevelAvailability(10, save)).toMatchObject({
      playable: true,
      status: "playable",
      label: "Finale"
    });
  });

  it("labels completed Level 10 as replay finale", () => {
    const save = {
      ...createDefaultSaveData(),
      completedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      currentLevelId: 10,
      gameCompleted: true
    };

    expect(getLevelAvailability(10, save)).toMatchObject({
      playable: true,
      status: "completed",
      label: "Completed / Replay Finale"
    });
  });
});
