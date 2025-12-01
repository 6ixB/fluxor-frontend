import { ViewPortBTLineChart } from "@/components/body/viewport/viewport-charts/viewport-bst-line-chart";
import { ViewPortBXTLineChart } from "@/components/body/viewport/viewport-charts/viewport-bxst-line-chart";
import { ViewPortBYTLineChart } from "@/components/body/viewport/viewport-charts/viewport-byst-line-chart";
import { ViewPortBZTLineChart } from "@/components/body/viewport/viewport-charts/viewport-bzst-line-chart";
import { ViewPortXTLineChart } from "@/components/body/viewport/viewport-charts/viewport-xt-line-chart";
import { ViewPortXYZLineChart } from "@/components/body/viewport/viewport-charts/viewport-xyz-line-chart";
import { ViewPortYTLineChart } from "@/components/body/viewport/viewport-charts/viewport-yt-line-chart";
import { ViewPortZTLineChart } from "@/components/body/viewport/viewport-charts/viewport-zt-line-chart";
import { ScrollArea } from "@/components/ui/scroll-area";

const ViewPortCharts: React.FC = () => {
  return (
    <div className="h-full w-full pt-16">
      <ScrollArea className="h-full w-full">
        <div className="grid grid-cols-3 grid-rows-4 gap-4 px-4 pb-4">
          <ViewPortXTLineChart />
          <ViewPortYTLineChart />
          <ViewPortZTLineChart />
          <ViewPortBXTLineChart />
          <ViewPortBYTLineChart />
          <ViewPortBZTLineChart />
          <ViewPortXYZLineChart />
          <ViewPortBTLineChart />
        </div>
      </ScrollArea>
    </div>
  );
};

export { ViewPortCharts };
