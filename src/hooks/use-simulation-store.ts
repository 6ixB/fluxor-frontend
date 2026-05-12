import { createSelectors } from "@/lib/utils";
import type { SimulationState } from "@/types/hooks/use-simulation-store.type";
import { AnimationStatus } from "@/types/simulation.type";
import { create } from "zustand";

type Key = "ts" | "xs" | "ys" | "zs" | "bxs" | "bys" | "bzs" | "bs";

const useSimulationStoreBase = create<SimulationState>()((set, get) => {
  const makeArraySetter =
    (k: Key) => (update: number[] | ((draft: number[]) => void)) => {
      if (typeof update === "function") {
        const next = get()[k].slice();
        update(next);
        set({ [k]: next } as Partial<SimulationState>);
      } else {
        set({ [k]: update } as Partial<SimulationState>);
      }
    };

  return {
    x0: 0,
    y0: 0,
    z0: 0,
    setStartPos: (x, y, z) => set({ x0: x, y0: y, z0: z }),

    timeStep: 0,
    setTimeStep: (timeStep) => set({ timeStep }),

    ts: [],
    setTs: makeArraySetter("ts"),

    xs: [],
    setXs: makeArraySetter("xs"),

    ys: [],
    setYs: makeArraySetter("ys"),

    zs: [],
    setZs: makeArraySetter("zs"),

    bxs: [],
    setBxs: makeArraySetter("bxs"),

    bys: [],
    setBys: makeArraySetter("bys"),

    bzs: [],
    setBzs: makeArraySetter("bzs"),

    bs: [],
    setBs: makeArraySetter("bs"),

    setAll: (value) =>
      set({
        ts: value.ts,
        xs: value.xs,
        ys: value.ys,
        zs: value.zs,
        bxs: value.bxs,
        bys: value.bys,
        bzs: value.bzs,
        bs: value.bs,
      }),

    animationResetKey: 0,
    setAnimationResetKey: (value) => set({ animationResetKey: value }),

    animationStatus: AnimationStatus.Paused,
    setAnimationStatus: (value) => set({ animationStatus: value }),

    animationProgress: 0,
    setAnimationProgress: (value) => set({ animationProgress: value }),

    animationMaxProgress: 0,
    setAnimationMaxProgress: (value) => set({ animationMaxProgress: value }),

    animationStep: 0,
    setAnimationStep: (value) => set({ animationStep: value }),

    animationMaxStep: 0,
    setAnimationMaxStep: (value) => set({ animationMaxStep: value }),

    animationSpeed: 1.0,
    setAnimationSpeed: (value) => set({ animationSpeed: value }),

    canvasReady: false,
    setCanvasReady: (value) => set({ canvasReady: value }),

    animationInfoOpen: true,
    setAnimationInfoOpen: (value) => set({ animationInfoOpen: value }),
  };
});

const useSimulationStore = createSelectors(useSimulationStoreBase);

export { useSimulationStore };
