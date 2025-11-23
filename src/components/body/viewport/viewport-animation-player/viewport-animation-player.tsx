import { useCallback, useEffect, useRef, useState } from "react";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { AnimationStatus } from "@/types/simulation.type";
import { Canvas } from "@react-three/fiber";
import {
  ViewportFocusApi,
  type FocusAPI,
} from "@/components/body/viewport/viewport-animation-player/viewport-animation-focus-api";
import { ViewPortAnimationControls } from "@/components/body/viewport/viewport-animation-player/viewport-animation-controls";
import { Grid } from "@react-three/drei";
import { ViewPortAnimationLights } from "@/components/body/viewport/viewport-animation-player/viewport-animation-lights";
import { ViewPortAnimationFreeCam } from "@/components/body/viewport/viewport-animation-player/viewport-animation-free-cam";
import { ViewPortAnimationDronePath } from "@/components/body/viewport/viewport-animation-player/viewport-animation-drone-path";
import { ViewPortAnimationTarget } from "@/components/body/viewport/viewport-animation-player/viewport-animation-target";
import { ViewPortAnimationInformation } from "@/components/body/viewport/viewport-animation-player/viewport-animation-information";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

const cameraPos: [number, number, number] = [5, 5, 5];
const cameraLookAtPos: [number, number, number] = [0, 0, 0];

const ViewPortAnimationPlayer: React.FC = () => {
  const animationResetKey = useSimulationStore.use.animationResetKey();
  const setAnimationResetKey = useSimulationStore.use.setAnimationResetKey();
  const setAnimationStatus = useSimulationStore.use.setAnimationStatus();

  const canvasReady = useSimulationStore.use.canvasReady();
  const setCanvasReady = useSimulationStore.use.setCanvasReady();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!canvasReady) {
      setOpen(true);
      return;
    }

    setOpen(false);
  }, [canvasReady]);

  const focusApiRef = useRef<FocusAPI | null>(null);
  const handleFocus = useCallback(() => {
    focusApiRef.current?.focus(cameraPos, cameraLookAtPos);
  }, []);

  const handleAnimationEnd = useCallback(
    () => setAnimationStatus(AnimationStatus.Ended),
    [setAnimationStatus],
  );
  const handleAnimationPlay = () => setAnimationStatus(AnimationStatus.Playing);
  const handleAnimationPause = () => setAnimationStatus(AnimationStatus.Paused);
  const handleAnimationReplay = () => {
    setAnimationResetKey(animationResetKey + 1);
    setAnimationStatus(AnimationStatus.Paused);
  };

  return (
    <div
      id={TOUR_STEP_IDS.SIMULATION_DRONE_GOAL}
      className="relative h-full min-h-0 w-full min-w-0"
    >
      <AlertDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <AlertDialogHeader>
            <AlertDialogTitle className="sr-only">
              Loading viewport...
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">
              The viewport is loading. Please wait...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </VisuallyHidden>
        <AlertDialogContent className="flex items-center justify-center border-none bg-transparent shadow-none outline-none">
          <Spinner className="size-4" />
          Loading viewport...
        </AlertDialogContent>
      </AlertDialog>
      <Canvas
        shadows
        onCreated={({ gl }) => {
          gl.domElement.id = "viewport-canvas";
          gl.toneMappingExposure = 1.25;
          setCanvasReady(true);
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
        <ViewPortAnimationFreeCam onReplay={handleAnimationReplay} />
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
