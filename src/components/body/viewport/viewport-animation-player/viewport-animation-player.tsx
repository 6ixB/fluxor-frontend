import { ViewPortAnimationCamera } from "@/components/body/viewport/viewport-animation-player/viewport-animation-camera";
import { ViewPortAnimationControls } from "@/components/body/viewport/viewport-animation-player/viewport-animation-controls";
import { ViewPortAnimationDronePath } from "@/components/body/viewport/viewport-animation-player/viewport-animation-drone-path";
import { ViewPortAnimationGizmoHelpers } from "@/components/body/viewport/viewport-animation-player/viewport-animation-gizmo-helpers";
import { ViewPortAnimationGround } from "@/components/body/viewport/viewport-animation-player/viewport-animation-ground";
import { ViewPortAnimationInformation } from "@/components/body/viewport/viewport-animation-player/viewport-animation-information";
import { ViewPortAnimationLights } from "@/components/body/viewport/viewport-animation-player/viewport-animation-lights";
import { ViewPortAnimationTarget } from "@/components/body/viewport/viewport-animation-player/viewport-animation-target";
import { ServerStatus } from "@/components/header/server-status";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";
import { AnimationStatus } from "@/types/simulation.type";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";

const ViewPortAnimationPlayer: React.FC = () => {
  const animationResetKey = useSimulationStore.use.animationResetKey();
  const setAnimationResetKey = useSimulationStore.use.setAnimationResetKey();
  const setAnimationStatus = useSimulationStore.use.setAnimationStatus();

  const canvasReady = useSimulationStore.use.canvasReady();
  const setCanvasReady = useSimulationStore.use.setCanvasReady();
  const [open, setOpen] = useState(false);

  const cameraControlsRef = useRef<CameraControls | null>(null);

  const animationStatus = useSimulationStore.use.animationStatus();
  const ts = useSimulationStore.use.ts();
  const playable = ts.length > 0;

  useEffect(() => {
    if (!canvasReady) {
      setOpen(true);
      return;
    }

    setOpen(false);
  }, [canvasReady]);

  const handleAnimationEnd = useCallback(
    () => setAnimationStatus(AnimationStatus.Ended),
    [setAnimationStatus],
  );

  const handleAnimationPlay = useCallback(
    () => setAnimationStatus(AnimationStatus.Playing),
    [setAnimationStatus],
  );

  const handleAnimationPause = useCallback(
    () => setAnimationStatus(AnimationStatus.Paused),
    [setAnimationStatus],
  );

  const handleAnimationReplay = useCallback(() => {
    setAnimationResetKey(animationResetKey + 1);
    setAnimationStatus(AnimationStatus.Paused);
  }, [animationResetKey, setAnimationResetKey, setAnimationStatus]);

  const handleAnimationFocus = useCallback(() => {
    if (!cameraControlsRef.current) return;
    cameraControlsRef.current.reset(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Avoid triggering while typing in inputs/textareas
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (event.repeat) return;

      // FOCUS (always allowed, even if not playable)
      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        handleAnimationFocus();
        return;
      }

      // Below this line we only act if animation is playable
      if (!playable) return;

      switch (event.key) {
        case " ":
          event.preventDefault();
          if (animationStatus === AnimationStatus.Ended) break;

          if (animationStatus === AnimationStatus.Playing) {
            handleAnimationPause();
          } else {
            handleAnimationPlay();
          }
          break;

        case "r":
        case "R":
          event.preventDefault();
          handleAnimationReplay();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    playable,
    animationStatus,
    handleAnimationPlay,
    handleAnimationPause,
    handleAnimationFocus,
    handleAnimationReplay,
  ]);

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
      >
        <ViewPortAnimationGizmoHelpers />
        <ViewPortAnimationCamera cameraControlsRef={cameraControlsRef} />
        <ViewPortAnimationGround />
        <ViewPortAnimationLights />
        <ViewPortAnimationDronePath onEnd={handleAnimationEnd} />
        <ViewPortAnimationTarget />
      </Canvas>
      <ViewPortAnimationControls
        onPlay={handleAnimationPlay}
        onPause={handleAnimationPause}
        onReplay={handleAnimationReplay}
        onFocus={handleAnimationFocus}
      />
      <ViewPortAnimationInformation />
      <ServerStatus />
    </div>
  );
};

export { ViewPortAnimationPlayer };
