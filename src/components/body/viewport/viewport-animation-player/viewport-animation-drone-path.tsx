import { DroneModel } from "@/components/body/viewport/viewport-animation-player/drone-model";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { AnimationStatus } from "@/types/simulation.type";
import {
  extend,
  useFrame,
  type ThreeElement,
  type ThreeElements,
} from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

extend({ Line_: THREE.Line });

declare module "@react-three/fiber" {
  interface ThreeElements {
    line_: ThreeElement<typeof THREE.Line>;
  }
}

type ViewPortAnimationDronePathProps = ThreeElements["group"] & {
  onEnd?: () => void;
};

function getAnimationStep(
  animationStep: number,
  animationProgress: number,
  ts: number[],
  t0: number,
): number {
  let i = animationStep;

  while (i < ts.length - 1 && ts[i + 1] - t0 <= animationProgress) {
    i++;
  }

  while (i > 0 && ts[i] - t0 > animationProgress) {
    i--;
  }

  return i;
}

function setDronePathPos(
  animationStep: number,
  xs: number[],
  ys: number[],
  zs: number[],
  droneRef: RefObject<THREE.Group<THREE.Object3DEventMap>>,
  lineGeoRef: RefObject<
    THREE.BufferGeometry<
      THREE.NormalBufferAttributes,
      THREE.BufferGeometryEventMap
    >
  >,
) {
  droneRef.current.position.set(
    -1 * (xs[animationStep] ?? 0),
    ys[animationStep] ?? 0,
    zs[animationStep] ?? 0,
  );

  if (lineGeoRef.current) {
    lineGeoRef.current.setDrawRange(0, animationStep + 1);
  }
}

const ViewPortAnimationDronePath: React.FC<ViewPortAnimationDronePathProps> = ({
  onEnd,
  ...props
}) => {
  const animationResetKey = useSimulationStore.use.animationResetKey();
  const animationStatus = useSimulationStore.use.animationStatus();
  const animationSpeed = useSimulationStore.use.animationSpeed();
  const animationProgress = useSimulationStore.use.animationProgress();
  const animationMaxProgress = useSimulationStore.use.animationMaxProgress();

  const setAnimationStatus = useSimulationStore.use.setAnimationStatus();
  const setAnimationStep = useSimulationStore.use.setAnimationStep();
  const setAnimationProgress = useSimulationStore.use.setAnimationProgress();
  const setAnimationMaxProgress =
    useSimulationStore.use.setAnimationMaxProgress();

  const playing = animationStatus === AnimationStatus.Playing;

  const x0 = useSimulationStore.use.x0();
  const y0 = useSimulationStore.use.y0();
  const z0 = useSimulationStore.use.z0();

  const ts = useSimulationStore.use.ts();
  const xs = useSimulationStore.use.xs();
  const ys = useSimulationStore.use.ys();
  const zs = useSimulationStore.use.zs();

  const droneRef = useRef<THREE.Group>(null!);

  const lineRef = useRef<THREE.Line>(null!);
  const lineGeoRef = useRef<THREE.BufferGeometry>(null!);

  const count = Math.min(xs.length, ys.length, zs.length);
  const hasPath = count >= 1;

  const notifiedRef = useRef(false);

  // Live playback state — avoids ~60Hz Zustand writes that re-render slider/etc.
  const progressRef = useRef(0);
  const stepRef = useRef(0);
  const flushAccumRef = useRef(0);

  useEffect(() => {
    if (!hasPath || !ts.length) return;

    notifiedRef.current = false;

    const total = ts[ts.length - 1] - ts[0];
    progressRef.current = 0;
    stepRef.current = 0;
    flushAccumRef.current = 0;
    setAnimationStep(0);
    setAnimationProgress(0);
    setAnimationMaxProgress(total);

    droneRef.current.position.set(-x0, y0, z0);

    if (lineGeoRef.current) {
      const N = Math.min(xs.length, ys.length, zs.length);
      const positions = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        positions[i * 3 + 0] = -1 * (xs[i] ?? 0);
        positions[i * 3 + 1] = ys[i] ?? 0;
        positions[i * 3 + 2] = zs[i] ?? 0;
      }

      lineGeoRef.current.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      lineGeoRef.current.computeBoundingSphere?.();
      lineGeoRef.current.setDrawRange(0, 0);
    }
  }, [
    ts,
    xs,
    ys,
    zs,
    x0,
    y0,
    z0,
    hasPath,
    animationResetKey,
    setAnimationStep,
    setAnimationProgress,
    setAnimationMaxProgress,
  ]);

  // Sync from store (seek via slider, reset). Skipped during play so it doesn't
  // duplicate the work useFrame is already doing each frame.
  useEffect(() => {
    if (playing) return;

    progressRef.current = animationProgress;

    if (animationProgress < animationMaxProgress) {
      const t0 = ts[0];
      const i = getAnimationStep(stepRef.current, animationProgress, ts, t0);
      stepRef.current = i;
      setAnimationStep(i);
      setDronePathPos(i, xs, ys, zs, droneRef, lineGeoRef);

      if (animationStatus == AnimationStatus.Ended) {
        setAnimationStatus(AnimationStatus.Paused);
      }
    }
  }, [
    playing,
    ts,
    xs,
    ys,
    zs,
    animationProgress,
    animationMaxProgress,
    animationStatus,
    setAnimationStep,
    setAnimationStatus,
  ]);

  useFrame((_, delta) => {
    if (!hasPath || !ts.length || !droneRef.current) return;
    if (!playing) return;

    const t0 = ts[0];
    const total = ts[ts.length - 1] - t0;
    const elapsed = progressRef.current + delta * animationSpeed;
    progressRef.current = elapsed;

    if (elapsed >= total) {
      const last = ts.length - 1;
      stepRef.current = last;
      progressRef.current = total;

      droneRef.current.position.set(
        -1 * (xs[last] ?? 0),
        ys[last] ?? 0,
        zs[last] ?? 0,
      );

      if (lineGeoRef.current) {
        lineGeoRef.current.setDrawRange(
          0,
          Math.min(xs.length, ys.length, zs.length),
        );
      }

      setAnimationProgress(total);
      setAnimationStep(last);
      setAnimationStatus(AnimationStatus.Ended);

      if (!notifiedRef.current) {
        notifiedRef.current = true;
        onEnd?.();
      }
      return;
    }

    const i = getAnimationStep(stepRef.current, elapsed, ts, t0);
    stepRef.current = i;
    setDronePathPos(i, xs, ys, zs, droneRef, lineGeoRef);

    // Throttle store flush to ~20Hz so the slider/UI update without forcing
    // a re-render on every frame.
    flushAccumRef.current += delta;
    if (flushAccumRef.current >= 0.05) {
      flushAccumRef.current = 0;
      setAnimationProgress(elapsed);
      setAnimationStep(i);
    }
  });

  return (
    <>
      <DroneModel {...props} ref={droneRef} />
      <line_ ref={lineRef} frustumCulled={false}>
        <bufferGeometry ref={lineGeoRef} />
        <lineBasicMaterial color="#00ff00" />
      </line_>
    </>
  );
};

export { ViewPortAnimationDronePath };
