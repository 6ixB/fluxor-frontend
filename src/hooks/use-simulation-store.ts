import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { SimulationState } from "@/types/hooks/use-simulation-store.type";
import { createSelectors } from "@/lib/utils";
import { AnimationStatus } from "@/types/simulation.type";

const keys = ["ts", "xs", "ys", "zs", "bxs", "bys", "bzs", "bs"] as const;
type Key = (typeof keys)[number];

const useSimulationStoreBase = create<SimulationState>()(
  immer((set) => {
    const makeArraySetter =
      (k: Key) => (update: number[] | ((draft: number[]) => void)) =>
        set((draft) => {
          if (typeof update === "function") update(draft[k]);
          else draft[k] = update;
        });

    return {
      x0: 0,
      y0: 0,
      z0: 0,
      setStartPos: (x, y, z) =>
        set((state) => {
          state.x0 = x;
          state.y0 = y;
          state.z0 = z;
        }),

      timeStep: 0,
      setTimeStep: (timeStep) =>
        set((state) => {
          state.timeStep = timeStep;
        }),

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
        set((draft) => {
          for (const k of keys) draft[k] = value[k];
        }),

      animationResetKey: 0,
      setAnimationResetKey: (value) =>
        set((state) => {
          state.animationResetKey = value;
        }),

      animationStatus: AnimationStatus.Paused,
      setAnimationStatus: (value) =>
        set((state) => {
          state.animationStatus = value;
        }),

      animationProgress: 0,
      setAnimationProgress: (value) =>
        set((state) => {
          state.animationProgress = value;
        }),

      animationMaxProgress: 0,
      setAnimationMaxProgress: (value) =>
        set((state) => {
          state.animationMaxProgress = value;
        }),

      animationStep: 0,
      setAnimationStep: (value) =>
        set((state) => {
          state.animationStep = value;
        }),

      animationMaxStep: 0,
      setAnimationMaxStep: (value) =>
        set((state) => {
          state.animationMaxStep = value;
        }),

      animationSpeed: 1.0,
      setAnimationSpeed: (value) =>
        set((state) => {
          state.animationSpeed = value;
        }),

      canvasReady: false,
      setCanvasReady: (value) =>
        set((state) => {
          state.canvasReady = value;
        }),

      animationInfoOpen: true,
      setAnimationInfoOpen: (value) =>
        set((state) => {
          state.animationInfoOpen = value;
        }),
    };
  }),
);

const useSimulationStore = createSelectors(useSimulationStoreBase);

export { useSimulationStore };
