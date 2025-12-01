import { useSimulationStore } from "@/hooks/use-simulation-store";
import { Kbd } from "@/components/ui/kbd";
import {
  HandIcon,
  MouseIcon,
  MousePointerClickIcon,
  SpaceIcon,
} from "lucide-react";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";
import { cn } from "@/lib/utils";

const ViewPortAnimationInformation: React.FC = () => {
  const animationInfoOpen = useSimulationStore.use.animationInfoOpen();

  return (
    <div
      id={TOUR_STEP_IDS.VIEWPORT_ANIMATION_INFORMATION}
      className={cn(
        "bg-foreground/5 absolute top-16 left-4 flex w-52 flex-col gap-2 rounded-lg p-4 transition-opacity duration-150 select-none",
        animationInfoOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
        <Kbd className="size-6">
          <MousePointerClickIcon className="size-4" />
        </Kbd>
        Rotate (Left Mouse)
      </div>
      <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
        <Kbd className="size-6">
          <HandIcon className="size-4" />
        </Kbd>
        Pan (Right Mouse)
      </div>
      <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
        <Kbd className="size-6">
          <MouseIcon className="size-4" />
        </Kbd>
        Zoom (Middle Mouse)
      </div>
      <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
        <Kbd className="size-6">F</Kbd> Reset Camera
      </div>
      <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
        <Kbd className="size-6">
          <SpaceIcon className="size-4" />
        </Kbd>
        Play/Pause
      </div>
      <div className="text-muted-foreground flex items-center gap-x-2 text-xs">
        <Kbd className="size-6">R</Kbd> Replay
      </div>
    </div>
  );
};

export { ViewPortAnimationInformation };
