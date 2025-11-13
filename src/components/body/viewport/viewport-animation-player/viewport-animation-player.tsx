import { useCallback, useRef } from "react";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { Canvas } from "@react-three/fiber";
import {
  ViewportFocusApi,
  type FocusAPI,
} from "@/components/body/viewport/viewport-animation-player/viewport-animation-focus-api";
import {
  Status,
  ViewPortAnimationControls,
} from "@/components/body/viewport/viewport-animation-player/viewport-animation-controls";
import { Grid } from "@react-three/drei";
import { ViewPortAnimationLights } from "@/components/body/viewport/viewport-animation-player/viewport-animation-lights";
import { ViewPortAnimationFreeCam } from "@/components/body/viewport/viewport-animation-player/viewport-animation-free-cam";
import { ViewPortAnimationDronePath } from "@/components/body/viewport/viewport-animation-player/viewport-animation-drone-path";
import { ViewPortAnimationTarget } from "@/components/body/viewport/viewport-animation-player/viewport-animation-target";
import { ViewPortAnimationInformation } from "@/components/body/viewport/viewport-animation-player/viewport-animation-information";

const cameraPos: [number, number, number] = [5, 5, 5];
const cameraLookAtPos: [number, number, number] = [0, 0, 0];

const ViewPortAnimationPlayer: React.FC = () => {
  const animationResetKey = useSimulationStore.use.animationResetKey();
  const setAnimationStatus = useSimulationStore.use.setAnimationStatus();
  const setAnimationResetKey = useSimulationStore.use.setAnimationResetKey();
  const setAnimationStep = useSimulationStore.use.setAnimationStep();

  const focusApiRef = useRef<FocusAPI | null>(null);
  const handleFocus = useCallback(() => {
    focusApiRef.current?.focus(cameraPos, cameraLookAtPos);
  }, []);

  const handleAnimationEnd = useCallback(
    () => setAnimationStatus(Status.Ended),
    [setAnimationStatus],
  );
  const handleAnimationPlay = () => setAnimationStatus(Status.Playing);
  const handleAnimationPause = () => setAnimationStatus(Status.Paused);
  const handleAnimationReplay = () => {
    setAnimationResetKey(animationResetKey + 1);
    setAnimationStatus(Status.Paused);
    setAnimationStep(0);
  };

  return (
    <div className="relative h-full min-h-0 w-full min-w-0">
      <Canvas
        shadows
        onCreated={({ gl }) => {
          gl.domElement.id = "viewport-canvas";
          gl.toneMappingExposure = 1.25;
        }}
        gl={{ powerPreference: "low-power" }}
        camera={{ position: cameraPos }}
      >
        <ViewportFocusApi apiRef={focusApiRef} />
        <Grid
          infiniteGrid
          cellSize={1}
          cellThickness={0.5}
          cellColor="gray"
          sectionSize={5}
          sectionThickness={1}
          fadeDistance={50}
          fadeStrength={1}
        />
        <ViewPortAnimationLights />
        <ViewPortAnimationFreeCam />
        <ViewPortAnimationDronePath onEnd={handleAnimationEnd} />
        <ViewPortAnimationTarget />
      </Canvas>
      <ViewPortAnimationControls
        onPlay={handleAnimationPlay}
        onPause={handleAnimationPause}
        onReplay={handleAnimationReplay}
        onFocus={handleFocus}
      />
      <ViewPortAnimationInformation />
    </div>
  );
};

export { ViewPortAnimationPlayer };
