import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { extend, type ThreeElement } from "@react-three/fiber";
import { DroneModel } from "@/components/body/viewport/viewport-animation-player/drone-model";
import { AnimationStatus } from "@/types/simulation.type";

extend({ Line_: THREE.Line });

declare module "@react-three/fiber" {
  interface ThreeElements {
    line_: ThreeElement<typeof THREE.Line>;
  }
}

type ViewPortAnimationDronePathProps = ThreeElements["group"] & {
  onEnd?: () => void;
};

const ViewPortAnimationDronePath: React.FC<ViewPortAnimationDronePathProps> = ({
  onEnd,
  ...props
}) => {
  const animationResetKey = useSimulationStore.use.animationResetKey();
  const animationStatus = useSimulationStore.use.animationStatus();
  const animationSpeed = useSimulationStore.use.animationSpeed();
  const setAnimationStep = useSimulationStore.use.setAnimationStep();
  const playing = animationStatus === AnimationStatus.Playing;

  const x0 = useSimulationStore.use.x0();
  const y0 = useSimulationStore.use.y0();
  const z0 = useSimulationStore.use.z0();

  const ts = useSimulationStore.use.ts();
  const xs = useSimulationStore.use.xs();
  const ys = useSimulationStore.use.ys();
  const zs = useSimulationStore.use.zs();

  const setProgress = useSimulationStore.use.setAnimationProgress();
  const setMaxProgress = useSimulationStore.use.setAnimationMaxProgress();

  const droneRef = useRef<THREE.Group>(null!);

  const lineRef = useRef<THREE.Line>(null!);
  const lineGeoRef = useRef<THREE.BufferGeometry>(null!);

  const count = Math.min(xs.length, ys.length, zs.length);
  const hasPath = count >= 1;

  const t0Ref = useRef(0);
  const tRef = useRef(0);
  const iRef = useRef(0);
  const endedRef = useRef(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!hasPath || !ts.length) return;

    t0Ref.current = ts[0];
    tRef.current = 0;
    iRef.current = 0;
    endedRef.current = false;
    notifiedRef.current = false;

    droneRef.current.position.set(-x0, z0, y0);

    const total = ts[ts.length - 1] - ts[0];
    setProgress(0);
    setMaxProgress(total);

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
    animationResetKey,
    hasPath,
    setProgress,
    setMaxProgress,
  ]);

  useFrame((_, delta) => {
    if (!hasPath || !ts.length || !droneRef.current) return;
    if (endedRef.current || !playing) return;

    tRef.current += delta * animationSpeed;
    const t0 = t0Ref.current;
    const elapsed = tRef.current;
    const total = ts[ts.length - 1] - t0;

    setProgress(elapsed);

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

      endedRef.current = true;

      if (!notifiedRef.current) {
        notifiedRef.current = true;
        onEnd?.();
      }
      return;
    }

    let i = iRef.current;
    while (i < ts.length - 1 && ts[i + 1] - t0 <= tRef.current) i++;
    while (i > 0 && ts[i] - t0 > tRef.current) i--;
    iRef.current = i;
    setAnimationStep(i);

    droneRef.current.position.set(-1 * (xs[i] ?? 0), ys[i] ?? 0, zs[i] ?? 0);

    if (lineGeoRef.current) {
      lineGeoRef.current.setDrawRange(0, i + 1);
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
