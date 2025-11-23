import { useSimulationStore } from "@/hooks/use-simulation-store";
import { Kbd } from "@/components/ui/kbd";
import { ArrowBigUpIcon, MousePointerClickIcon, SpaceIcon } from "lucide-react";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";
import { Badge } from "@/components/ui/badge";

const ViewPortAnimationInformation: React.FC = () => {
  const animationStep = useSimulationStore.use.animationStep();
  const animationMaxStep = useSimulationStore.use.animationMaxStep();
  const animationSpeed = useSimulationStore.use.animationSpeed();
  const droneSpeed = useSimulationStore.use.bs();

  return (
    <div
      id={TOUR_STEP_IDS.VIEWPORT_ANIMATION_INFORMATION}
      className="absolute top-4 right-4"
    >
      <div className="bg-foreground/5 flex w-80 flex-col items-start justify-center gap-y-2 rounded-lg p-4 select-none">
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">
            <MousePointerClickIcon className="size-4" />
          </Kbd>
          Enter
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">Esc</Kbd> Exit
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">W</Kbd> Forward
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">S</Kbd> Backward
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">A</Kbd> Left
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">D</Kbd> Right
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">Q</Kbd> Up
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">E</Kbd> Down
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">
            <ArrowBigUpIcon className="size-4" />
          </Kbd>
          Boost
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">F</Kbd> Reset Camera
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">
            <SpaceIcon className="size-4" />
          </Kbd>{" "}
          Play/Pause
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
          <Kbd className="size-6">R</Kbd> Replay
        </div>
        <Badge className="bg-primary/70 rounded-sm text-xs">
          Step: {animationStep}/{animationMaxStep}
        </Badge>
        <Badge className="bg-primary/70 rounded-sm text-xs">
          Drone Speed: {(droneSpeed[animationStep] ?? 0).toFixed(2)} m/s
          (towards target)
        </Badge>
        <Badge className="bg-primary/70 rounded-sm text-xs">
          Animation Speed: {animationSpeed}x
        </Badge>
      </div>
    </div>
  );
};

export { ViewPortAnimationInformation };
