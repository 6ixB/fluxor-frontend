import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useSimulationStore } from "@/hooks/use-simulation-store";
import { AnimationStatus } from "@/types/simulation.type";

const arrayKeys = ["ts", "xs", "ys", "zs", "bxs", "bys", "bzs", "bs"] as const;

const initialState = useSimulationStore.getState();

beforeEach(() => {
  useSimulationStore.setState(initialState, true);
});

describe("useSimulationStore initial state", () => {
  it("starts position values at 0", () => {
    const state = useSimulationStore.getState();
    expect(state.x0).toBe(0);
    expect(state.y0).toBe(0);
    expect(state.z0).toBe(0);
  });

  it("starts with all numeric arrays empty", () => {
    const state = useSimulationStore.getState();
    for (const key of arrayKeys) {
      expect(state[key]).toEqual([]);
    }
  });

  it("starts in the Paused animation status", () => {
    expect(useSimulationStore.getState().animationStatus).toBe(
      AnimationStatus.Paused,
    );
  });

  it("starts with sensible defaults for animation/canvas flags", () => {
    const state = useSimulationStore.getState();
    expect(state.animationResetKey).toBe(0);
    expect(state.animationProgress).toBe(0);
    expect(state.animationMaxProgress).toBe(0);
    expect(state.animationStep).toBe(0);
    expect(state.animationMaxStep).toBe(0);
    expect(state.animationSpeed).toBe(1.0);
    expect(state.canvasReady).toBe(false);
    expect(state.animationInfoOpen).toBe(true);
    expect(state.timeStep).toBe(0);
  });
});

describe("setStartPos", () => {
  it("updates x0/y0/z0 together", () => {
    act(() => {
      useSimulationStore.getState().setStartPos(1, 2, 3);
    });

    const state = useSimulationStore.getState();
    expect(state.x0).toBe(1);
    expect(state.y0).toBe(2);
    expect(state.z0).toBe(3);
  });
});

describe("setTimeStep", () => {
  it("updates the timeStep value", () => {
    act(() => {
      useSimulationStore.getState().setTimeStep(0.05);
    });
    expect(useSimulationStore.getState().timeStep).toBe(0.05);
  });
});

describe("array setters", () => {
  it("each setter replaces its array when given a value", () => {
    const setterMap = {
      ts: "setTs",
      xs: "setXs",
      ys: "setYs",
      zs: "setZs",
      bxs: "setBxs",
      bys: "setBys",
      bzs: "setBzs",
      bs: "setBs",
    } as const;

    for (const key of arrayKeys) {
      const next = [1, 2, 3];
      act(() => {
        const setter = useSimulationStore.getState()[setterMap[key]];
        setter(next);
      });
      expect(useSimulationStore.getState()[key]).toEqual(next);
    }
  });

  it("each setter supports a draft mutator function and produces a new array", () => {
    act(() => {
      useSimulationStore.getState().setXs([1, 2, 3]);
    });
    const before = useSimulationStore.getState().xs;

    act(() => {
      useSimulationStore.getState().setXs((draft) => {
        draft.push(4);
      });
    });

    const after = useSimulationStore.getState().xs;
    expect(after).toEqual([1, 2, 3, 4]);
    expect(after).not.toBe(before);
    expect(before).toEqual([1, 2, 3]);
  });

  it("does not mutate the original array when using the draft mutator", () => {
    const original = [10, 20];
    act(() => {
      useSimulationStore.getState().setTs(original);
    });

    act(() => {
      useSimulationStore.getState().setTs((draft) => {
        draft[0] = 999;
      });
    });

    expect(original).toEqual([10, 20]);
    expect(useSimulationStore.getState().ts).toEqual([999, 20]);
  });
});

describe("setAll", () => {
  it("populates every result array in one call", () => {
    const payload = {
      ts: [0, 0.1],
      xs: [1, 2],
      ys: [3, 4],
      zs: [5, 6],
      bxs: [7, 8],
      bys: [9, 10],
      bzs: [11, 12],
      bs: [13, 14],
    };

    act(() => {
      useSimulationStore.getState().setAll(payload);
    });

    const state = useSimulationStore.getState();
    for (const key of arrayKeys) {
      expect(state[key]).toEqual(payload[key]);
    }
  });
});

describe("animation setters", () => {
  it("updates animation status, progress, step, speed, and reset key", () => {
    act(() => {
      const state = useSimulationStore.getState();
      state.setAnimationStatus(AnimationStatus.Playing);
      state.setAnimationProgress(0.5);
      state.setAnimationMaxProgress(1);
      state.setAnimationStep(50);
      state.setAnimationMaxStep(100);
      state.setAnimationSpeed(2.0);
      state.setAnimationResetKey(7);
      state.setCanvasReady(true);
      state.setAnimationInfoOpen(false);
    });

    const state = useSimulationStore.getState();
    expect(state.animationStatus).toBe(AnimationStatus.Playing);
    expect(state.animationProgress).toBe(0.5);
    expect(state.animationMaxProgress).toBe(1);
    expect(state.animationStep).toBe(50);
    expect(state.animationMaxStep).toBe(100);
    expect(state.animationSpeed).toBe(2.0);
    expect(state.animationResetKey).toBe(7);
    expect(state.canvasReady).toBe(true);
    expect(state.animationInfoOpen).toBe(false);
  });
});

describe("createSelectors integration (use.* hooks)", () => {
  it("exposes a selector hook for every state field", () => {
    expect(typeof useSimulationStore.use.x0).toBe("function");
    expect(typeof useSimulationStore.use.animationStatus).toBe("function");
    expect(typeof useSimulationStore.use.setStartPos).toBe("function");
  });

  it("re-renders a component when the selected slice changes", () => {
    const { result } = renderHook(() => useSimulationStore.use.x0());
    expect(result.current).toBe(0);

    act(() => {
      useSimulationStore.getState().setStartPos(9, 0, 0);
    });

    expect(result.current).toBe(9);
  });

  it("animation status selector tracks updates", () => {
    const { result } = renderHook(() =>
      useSimulationStore.use.animationStatus(),
    );
    expect(result.current).toBe(AnimationStatus.Paused);

    act(() => {
      useSimulationStore.getState().setAnimationStatus(AnimationStatus.Ended);
    });

    expect(result.current).toBe(AnimationStatus.Ended);
  });
});
