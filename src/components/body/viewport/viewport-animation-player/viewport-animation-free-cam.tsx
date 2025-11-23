import * as THREE from "three";
import type { PointerLockControls as PLCImpl } from "three-stdlib";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { AnimationStatus } from "@/types/simulation.type";

type ViewPortAnimationFreeCamProps = {
  baseSpeed?: number;
  boost?: number;
  onReplay: () => void;
};

const ViewPortAnimationFreeCam: React.FC<ViewPortAnimationFreeCamProps> = ({
  baseSpeed = 5,
  boost = 5,
  onReplay,
}) => {
  const animationStatus = useSimulationStore.use.animationStatus();
  const animationMaxProgress = useSimulationStore.use.animationMaxProgress();
  const setAnimationStatus = useSimulationStore.use.setAnimationStatus();

  const { camera } = useThree();
  const worldUp = new THREE.Vector3(0, 1, 0);
  const keys = useRef<Record<string, boolean>>({});
  const controlsRef = useRef<PLCImpl>(null!);

  useEffect(() => {
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;

      if (animationMaxProgress === 0) return;

      if (e.code === "Space") {
        if (animationStatus === AnimationStatus.Playing) {
          setAnimationStatus(AnimationStatus.Paused);
          return;
        }

        if (animationStatus === AnimationStatus.Paused) {
          setAnimationStatus(AnimationStatus.Playing);
          return;
        }
      }

      if (e.code === "KeyR") {
        onReplay();
        return;
      }
    };
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);

    window.addEventListener("keyup", up);
    window.addEventListener("keydown", down);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onReplay, animationStatus, animationMaxProgress, setAnimationStatus]);

  useFrame((_, dt) => {
    const locked = !!controlsRef.current?.isLocked;

    if (!locked) return;

    const k = keys.current;
    const s = baseSpeed * (k.ShiftLeft || k.ShiftRight ? boost : 1) * dt;

    if (k.KeyW) camera.translateZ(-s);
    if (k.KeyS) camera.translateZ(s);

    if (k.KeyA) camera.translateX(-s);
    if (k.KeyD) camera.translateX(s);

    if (k.KeyE) camera.position.addScaledVector(worldUp, -s);
    if (k.KeyQ) camera.position.addScaledVector(worldUp, s);
  });

  return <PointerLockControls ref={controlsRef} selector="#viewport-canvas" />;
};

export { ViewPortAnimationFreeCam };
