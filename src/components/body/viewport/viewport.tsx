import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewPortAnimationPlayer } from "@/components/body/viewport/viewport-animation-player/viewport-animation-player";
import { ViewPortCharts } from "@/components/body/viewport/viewport-charts/viewport-charts";
import { ChartSplineIcon, RouteIcon } from "lucide-react";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";

const ViewPort: React.FC = () => {
  return (
    <div className="grid h-full w-full flex-1 grid-cols-1 grid-rows-1">
      <Tabs defaultValue="animation-player" className="relative h-full w-full">
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
          <ViewPortCharts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { ViewPort };
