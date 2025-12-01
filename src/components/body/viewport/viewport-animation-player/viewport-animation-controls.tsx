import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";
import { cn } from "@/lib/utils";
import { AnimationStatus } from "@/types/simulation.type";
import {
  CircleGaugeIcon,
  FocusIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  ScanTextIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

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

  const animationInfoOpen = useSimulationStore.use.animationInfoOpen();
  const setAnimationInfoOpen = useSimulationStore.use.setAnimationInfoOpen();

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

  const { open, isMobile } = useSidebar();

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
      className="xs:bottom-8 absolute bottom-0 left-1/2 -translate-x-1/2"
    >
      <Card
        className={cn(
          "bg-background xs:border xs:w-md xs:rounded-lg w-dvw rounded-none border-t border-r-0 border-b-0 border-l-0 px-0 py-2 transition-opacity duration-300 ease-in-out hover:opacity-100 lg:w-xl",
          open && !isMobile ? "sm:w-sm" : "sm:w-lg",
          animationStatus === AnimationStatus.Playing
            ? "opacity-50"
            : "opacity-100",
        )}
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  aria-label="ShowAnimationInfo"
                  pressed={animationInfoOpen}
                  onPressedChange={setAnimationInfoOpen}
                  className="aria-pressed:bg-accent aria-pressed:text-accent-foreground"
                >
                  <ScanTextIcon />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show animation information</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ViewPortAnimationControls };
