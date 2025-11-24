import React, { Suspense, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { ViewPortAnimationPlayer } from "@/components/body/viewport/viewport-animation-player/viewport-animation-player";
import { ChartSplineIcon, RouteIcon } from "lucide-react";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";

const ViewPortChartsLazy = React.lazy(() =>
  import("@/components/body/viewport/viewport-charts/viewport-charts").then(
    (mod) => ({ default: mod.ViewPortCharts }),
  ),
);

const ViewPort: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"animation-player" | "charts">(
    "animation-player",
  );
  const [shouldLoadCharts, setShouldLoadCharts] = useState(false);

  return (
    <div className="grid h-full w-full flex-1 grid-cols-1 grid-rows-1">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const v = value as "animation-player" | "charts";
          setActiveTab(v);
          if (v === "charts") setShouldLoadCharts(true);
        }}
        className="relative h-full w-full"
      >
        <TabsList
          id={TOUR_STEP_IDS.VIEWPORT_TABS}
          className="bg-background/75 absolute top-4 left-4 z-50 rounded-md"
        >
          <TabsTrigger value="animation-player" className="rounded-sm">
            <RouteIcon />
            Animation
          </TabsTrigger>
          <TabsTrigger value="charts" className="rounded-sm">
            <ChartSplineIcon />
            Charts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="animation-player" className="h-full w-full">
          <ViewPortAnimationPlayer />
        </TabsContent>
        <TabsContent value="charts" className="h-full w-full">
          {shouldLoadCharts ? (
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center gap-4">
                  <Spinner className="size-4" />
                  Loading charts...
                </div>
              }
            >
              <ViewPortChartsLazy />
            </Suspense>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { ViewPort };
