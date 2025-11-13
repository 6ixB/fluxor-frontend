import * as THREE from "three";
import type { PointerLockControls as PLCImpl } from "three-stdlib";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";

type ViewPortAnimationFreeCamProps = {
  baseSpeed?: number;
  boost?: number;
};

const ViewPortAnimationFreeCam: React.FC<ViewPortAnimationFreeCamProps> = ({
  baseSpeed = 5,
  boost = 5,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<PLCImpl>(null!);
  const keys = useRef<Record<string, boolean>>({});
  const worldUp = new THREE.Vector3(0, 1, 0);

  useEffect(() => {
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);

    window.addEventListener("keyup", up);
    window.addEventListener("keydown", down);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

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
