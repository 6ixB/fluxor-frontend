import { useSimulationStore } from "@/hooks/use-simulation-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { FocusIcon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";
import { AnimationStatus } from "@/types/simulation.type";

type ViewPortAnimationControlsProps = {
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onFocus: () => void;
};

const ViewPortAnimationControls: React.FC<ViewPortAnimationControlsProps> = ({
  onPlay,
  onPause,
  onReplay,
  onFocus,
}) => {
  const timeStep = useSimulationStore.use.timeStep();
  const animationStatus = useSimulationStore.use.animationStatus();
  const animationResetKey = useSimulationStore.use.animationResetKey();
  const setAnimationStep = useSimulationStore.use.setAnimationStep();

  const prevResetKeyRef = useRef(animationResetKey);
  const animationProgress = useSimulationStore.use.animationProgress();
  const animationMaxProgress = useSimulationStore.use.animationMaxProgress();
  const setAnimationProgress = useSimulationStore.use.setAnimationProgress();

  useEffect(() => {
    if (
      animationResetKey !== prevResetKeyRef.current ||
      animationProgress === 0
    ) {
      prevResetKeyRef.current = animationResetKey;
      onPause();
      setAnimationStep(0);
    }
  }, [animationResetKey, onPause, animationProgress, setAnimationStep]);

  const ts = useSimulationStore.use.ts();
  const playable = ts.length > 0;

  return (
    <div
      id={TOUR_STEP_IDS.VIEWPORT_ANIMATION_PLAYBACK_CONTROLS}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <Card
        className={`bg-background w-xl rounded-lg px-0 py-2 transition-opacity duration-300 ease-in-out ${
          animationStatus === AnimationStatus.Playing
            ? "opacity-50 hover:opacity-100"
            : "opacity-100 hover:opacity-100"
        } `}
      >
        <CardContent className="flex flex-col items-center justify-center gap-y-2">
          <Slider
            value={[animationProgress]}
            onValueChange={(value) => {
              setAnimationProgress(value[0]);
            }}
            max={animationMaxProgress}
            step={timeStep}
            disabled={!playable}
            className="mt-4"
          />
          <div className="flex items-center justify-center">
            {animationStatus !== AnimationStatus.Ended && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={
                      animationStatus === AnimationStatus.Paused
                        ? onPlay
                        : onPause
                    }
                    variant="ghost"
                    size="icon"
                    disabled={!playable}
                    aria-label={
                      animationStatus === AnimationStatus.Paused
                        ? "Play"
                        : "Pause"
                    }
                  >
                    {animationStatus === AnimationStatus.Paused ? (
                      <PlayIcon />
                    ) : (
                      <PauseIcon />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {animationStatus === AnimationStatus.Paused ? (
                    <p>Play animation</p>
                  ) : (
                    <p>Pause animation</p>
                  )}
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onReplay}
                  variant="ghost"
                  size="icon"
                  disabled={!playable}
                  aria-label="Replay"
                >
                  <RotateCcwIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset animation playback</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onFocus}
                  variant="ghost"
                  size="icon"
                  aria-label="Focus"
                >
                  <FocusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset camera to default</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ViewPortAnimationControls };
