import { useSimulationStore } from "@/hooks/use-simulation-store";
import { Kbd } from "@/components/ui/kbd";
import { MousePointerClickIcon } from "lucide-react";

const ViewPortAnimationInformation: React.FC = () => {
  const animationStep = useSimulationStore.use.animationStep();
  const droneSpeed = useSimulationStore.use.bs();

  return (
    <div className="absolute top-4 right-4">
      <div className="bg-foreground/5 flex w-80 flex-col items-start justify-center gap-y-2 rounded-lg p-4 select-none">
        <div className="text-muted-foreground flex items-center gap-x-2">
          <Kbd className="size-8">
            <MousePointerClickIcon className="size-4" />
          </Kbd>
          Enter
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2">
          <Kbd className="size-8">Esc</Kbd> Exit
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2">
          <Kbd className="size-8">W</Kbd> Forward
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2">
          <Kbd className="size-8">S</Kbd> Backward
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2">
          <Kbd className="size-8">A</Kbd> Left
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2">
          <Kbd className="size-8">D</Kbd> Right
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2">
          <Kbd className="size-8">Q</Kbd> Up
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2">
          <Kbd className="size-8">E</Kbd> Down
        </div>
        <div className="text-muted-foreground flex items-center gap-x-2">
          <Kbd className="size-8">Shift</Kbd> Increase Speed
        </div>
        <div className="text-muted-foreground text-sm">
          step={animationStep}
        </div>
        <div className="text-muted-foreground text-sm">
          droneSpeed={(droneSpeed[animationStep] ?? 0).toFixed(2)} m/s (towards
          target)
        </div>
      </div>
    </div>
  );
};

export { ViewPortAnimationInformation };
