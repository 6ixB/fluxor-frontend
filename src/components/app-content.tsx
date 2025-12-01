import { Body } from "@/components/body/body";
import { Header } from "@/components/header/header";
import { TourAlertDialog, type TourStep } from "@/components/tour";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { useTour } from "@/hooks/use-tour";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";
import {
  DroneIcon,
  FullscreenIcon,
  InfoIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps: TourStep[] = [
  {
    content: (
      <div className="flex flex-col gap-y-2 text-sm">
        <h3 className="flex items-center gap-x-2 font-medium">
          <SlidersHorizontalIcon className="size-4" />
          Simulation Config
        </h3>
        <p className="text-muted-foreground">
          Configure simulation parameters such as drone starting position,
          speed, simulation steps, time step, and wind velocities.
        </p>
        <p className="text-muted-foreground">
          If you're new to the app, start by exploring the default configuration
          settings provided here.
        </p>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.SIMULATION_CONFIG,
    position: "right",
    onClickWithinArea: () => {},
  },
  {
    content: (
      <div className="flex flex-col gap-y-2 text-sm">
        <h3 className="flex items-center gap-x-2 font-medium">
          <SlidersHorizontalIcon className="size-4" />
          Simulation Config
        </h3>
        <p className="text-muted-foreground">
          When you are satisfied with your configuration, click this apply
          button for the simulator to calculate the drone's flight path based on
          the provided parameters.
        </p>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.APPLY_SIMULATION_CONFIG_BUTTON,
    position: "right",
    onClickWithinArea: () => {},
  },
  {
    content: (
      <div className="flex flex-col gap-y-2 text-sm">
        <h3 className="flex items-center gap-x-2 font-medium">
          <FullscreenIcon className="size-4" />
          Viewport
        </h3>
        <p className="text-muted-foreground">
          To see the simulation animations, select the&nbsp;
          <strong>Animation</strong> tab and to analyze simulation data charts
          select the <strong>Charts</strong> tab.
        </p>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.VIEWPORT_TABS,
    position: "bottom",
    onClickWithinArea: () => {},
  },
  {
    content: (
      <div className="flex flex-col gap-y-2 text-sm">
        <h3 className="flex items-center gap-x-2 font-medium">
          <FullscreenIcon className="size-4" />
          Viewport
        </h3>
        <p className="text-muted-foreground">
          To control the viewport camera and animation details refer to the this
          info panel.
        </p>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.VIEWPORT_ANIMATION_INFORMATION,
    position: "left",
    onClickWithinArea: () => {},
  },
  {
    content: (
      <div className="flex flex-col gap-y-2 text-sm">
        <h3 className="flex items-center gap-x-2 font-medium">
          <FullscreenIcon className="size-4" />
          Viewport
        </h3>
        <p className="text-muted-foreground">
          Start the animation, pause it, or adjust the playback speed using
          these animation playback controls.
        </p>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.VIEWPORT_ANIMATION_PLAYBACK_CONTROLS,
    position: "top",
    onClickWithinArea: () => {},
  },
  {
    content: (
      <div className="flex flex-col gap-y-2 text-sm">
        <h3 className="flex items-center gap-x-2 font-medium">
          <DroneIcon className="size-4" />
          Drone Target
        </h3>
        <p className="text-muted-foreground">
          The red circle indicates the initial goal of the drone, set as the
          delivery target located at the origin point.
        </p>
        <p className="text-muted-foreground">
          Based on wind conditions, the drone may or may not reach this exact
          target during the simulation. Shown by the drone's flight path in the
          viewport.
        </p>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.SIMULATION_DRONE_GOAL,
    position: "top",
    onClickWithinArea: () => {},
  },
  {
    content: (
      <div className="flex flex-col gap-y-2 text-sm">
        <h3 className="flex items-center gap-x-2 font-medium">
          <InfoIcon className="size-4" />
          More Information
        </h3>
        <p className="text-muted-foreground">
          For more information about the application, click on this icon to open
          the app information dialog.
        </p>
        <p className="text-muted-foreground">
          You can access this dialog anytime to revisit the app details and get
          assistance as needed.
        </p>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.APP_INFORMATION_DIALOG,
    position: "bottom",
    onClickWithinArea: () => {},
  },
];

const AppContent: React.FC = () => {
  const isMobile = useIsMobile();
  const canvasReady = useSimulationStore.use.canvasReady();
  const [openTour, setOpenTour] = useState(false);
  const { setSteps } = useTour();
  const hasOpenedTourRef = useRef(false);

  useEffect(() => {
    if (!canvasReady || isMobile) return;

    if (hasOpenedTourRef.current) return;

    setSteps(steps);
    hasOpenedTourRef.current = true;

    const timer = setTimeout(() => {
      setOpenTour(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [setSteps, canvasReady, isMobile]);

  return (
    <div className="flex h-dvh w-full flex-col bg-neutral-100 dark:bg-neutral-900">
      <Toaster
        richColors
        closeButton
        position="top-right"
        className="pointer-events-auto"
      />
      <TourAlertDialog isOpen={openTour} setIsOpen={setOpenTour} />
      <Header />
      <Body />
    </div>
  );
};

export { AppContent };
