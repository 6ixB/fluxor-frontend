import { useSimulationStore } from "@/hooks/use-simulation-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  CircleGaugeIcon,
  FocusIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
} from "lucide-react";
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

  const animationSpeed = useSimulationStore.use.animationSpeed();
  const setAnimationSpeed = useSimulationStore.use.setAnimationSpeed();

  const isDraggingRef = useRef(false);
  const wasPlayingRef = useRef(false);

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

  const handleSpeedChange = (value: string) => {
    if (!value) return;
    setAnimationSpeed(parseFloat(value));
  };

  const handleSliderChange = (value: number[]) => {
    if (!playable) return;

    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      wasPlayingRef.current = animationStatus === AnimationStatus.Playing;

      if (wasPlayingRef.current) {
        onPause();
      }
    }

    setAnimationProgress(value[0]);
  };

  const handleSliderCommit = () => {
    if (!playable) return;

    if (isDraggingRef.current && wasPlayingRef.current) {
      onPlay();
    }

    isDraggingRef.current = false;
    wasPlayingRef.current = false;
  };

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
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
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
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="AnimationPlaybackSpeed"
                    >
                      <CircleGaugeIcon />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Set animation playback speed</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="flex w-fit flex-col items-center justify-center p-0">
                <ToggleGroup
                  type="single"
                  value={String(animationSpeed)}
                  onValueChange={handleSpeedChange}
                >
                  <ToggleGroupItem
                    className="data-state-on:bg-muted-foreground"
                    aria-label="0.25 animation playback speed"
                    value="0.25"
                  >
                    0.25x
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="data-state-on:bg-muted-foreground"
                    aria-label="0.5 animation playback speed"
                    value="0.5"
                  >
                    0.5x
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="data-state-on:bg-muted-foreground"
                    aria-label="0.75 animation playback speed"
                    value="0.75"
                  >
                    0.75x
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="data-state-on:bg-muted-foreground"
                    aria-label="1.0 animation playback speed"
                    value="1"
                  >
                    1.0x
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="data-state-on:bg-muted-foreground"
                    aria-label="1.5 animation playback speed"
                    value="1.5"
                  >
                    1.5x
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="data-state-on:bg-muted-foreground"
                    aria-label="2.0 animation playback speed"
                    value="2"
                  >
                    2.0x
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    className="data-state-on:bg-muted-foreground"
                    aria-label="4.0 animation playback speed"
                    value="4"
                  >
                    4.0x
                  </ToggleGroupItem>
                </ToggleGroup>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ViewPortAnimationControls };
