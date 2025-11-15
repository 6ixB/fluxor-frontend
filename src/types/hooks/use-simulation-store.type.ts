import type { Status as AnimationStatus } from "@/components/body/viewport/viewport-animation-player/viewport-animation-controls";
import type { SimulationResultEntity } from "@/types/simulation.type";

type SimulationState = {
  /* 
    Usage: Drone starting point.
  */
  x0: number;
  y0: number;
  z0: number;
  setStartPos: (x: number, y: number, z: number) => void;

  /* 
    Usage: Array of time points.
  */
  ts: number[];
  setTs: (value: ((draft: number[]) => void) | number[]) => void;

  /* 
    Usage: Array of x positions.
  */
  xs: number[];
  setXs: (value: ((draft: number[]) => void) | number[]) => void;

  /* 
    Usage: Array of y positions.
  */
  ys: number[];
  setYs: (value: ((draft: number[]) => void) | number[]) => void;

  /* 
    Usage: Array of z positions.
  */
  zs: number[];
  setZs: (value: ((draft: number[]) => void) | number[]) => void;

  /* 
    Usage: Array of drone velocities (x component).
  */
  bxs: number[];
  setBxs: (value: ((draft: number[]) => void) | number[]) => void;

  /* 
    Usage: Array of drone velocities (y component).
  */
  bys: number[];
  setBys: (value: ((draft: number[]) => void) | number[]) => void;

  /* 
    Usage: Array of drone velocities (z component).
  */
  bzs: number[];
  setBzs: (value: ((draft: number[]) => void) | number[]) => void;

  /* 
    Usage: Array of drone velocities (resultant).
  */
  bs: number[];
  setBs: (value: ((draft: number[]) => void) | number[]) => void;

  setAll: (value: SimulationResultEntity) => void;

  animationResetKey: number;
  setAnimationResetKey: (value: number) => void;

  animationStatus: AnimationStatus;
  setAnimationStatus: (value: AnimationStatus) => void;

  animationProgress: number;
  setAnimationProgress: (value: number) => void;

  animationMaxProgress: number;
  setAnimationMaxProgress: (value: number) => void;

  animationStep: number;
  setAnimationStep: (value: number) => void;

  animationSpeed: number;
  setAnimationSpeed: (value: number) => void;

  canvasReady: boolean;
  setCanvasReady: (value: boolean) => void;
};

export { type SimulationState };
