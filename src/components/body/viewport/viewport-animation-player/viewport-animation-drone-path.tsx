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
  const animationStep = useSimulationStore.use.animationStep();
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

  useEffect(() => {
    if (!hasPath || !ts.length) return;

    notifiedRef.current = false;

    const total = ts[ts.length - 1] - ts[0];
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

  useEffect(() => {
    if (animationProgress < animationMaxProgress) {
      const t0 = ts[0];
      const i = getAnimationStep(animationStep, animationProgress, ts, t0);
      setAnimationStep(i);
      setDronePathPos(i, xs, ys, zs, droneRef, lineGeoRef);

      if (animationStatus == AnimationStatus.Ended) {
        setAnimationStatus(AnimationStatus.Paused);
      }
    }
  }, [
    ts,
    xs,
    ys,
    zs,
    animationStep,
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
    const elapsed = animationProgress + delta * animationSpeed;
    const total = ts[ts.length - 1] - t0;

    setAnimationProgress(elapsed);

    if (elapsed >= total) {
      const last = ts.length - 1;

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

      setAnimationStatus(AnimationStatus.Ended);

      if (!notifiedRef.current) {
        notifiedRef.current = true;
        onEnd?.();
      }
      return;
    }

    const i = getAnimationStep(animationStep, animationProgress, ts, t0);
    setAnimationStep(i);
    setDronePathPos(i, xs, ys, zs, droneRef, lineGeoRef);
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
