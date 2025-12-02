import { ViewPortYTLineChart } from "@/components/body/viewport/viewport-charts//viewport-yt-line-chart";
import { ViewPortBTLineChart } from "@/components/body/viewport/viewport-charts/viewport-bst-line-chart";
import { ViewPortBXTLineChart } from "@/components/body/viewport/viewport-charts/viewport-bxst-line-chart";
import { ViewPortBYTLineChart } from "@/components/body/viewport/viewport-charts/viewport-byst-line-chart";
import { ViewPortBZTLineChart } from "@/components/body/viewport/viewport-charts/viewport-bzst-line-chart";
import { ViewPortXTLineChart } from "@/components/body/viewport/viewport-charts/viewport-xt-line-chart";
import { ViewPortXYZLineChart } from "@/components/body/viewport/viewport-charts/viewport-xyz-line-chart";
import { ViewPortZTLineChart } from "@/components/body/viewport/viewport-charts/viewport-zt-line-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const ViewPortCharts: React.FC = () => {
  const { open, isMobile } = useSidebar();

  return (
    <ScrollArea className="h-full w-full">
      <div
        className={cn(
          "grid h-full w-full grid-cols-1 gap-4 px-4 pt-16 pb-4",
          open && !isMobile
            ? "md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        )}
      >
        <ViewPortXTLineChart />
        <ViewPortYTLineChart />
        <ViewPortZTLineChart />
        <ViewPortBXTLineChart />
        <ViewPortBYTLineChart />
        <ViewPortBZTLineChart />
        <ViewPortBTLineChart />
        <ViewPortXYZLineChart />
      </div>
    </ScrollArea>
  );
};

export { ViewPortCharts };
