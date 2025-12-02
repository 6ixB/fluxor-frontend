import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSimulationStore } from "@/hooks/use-simulation-store";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const ViewPortBZTLineChart: React.FC = () => {
  const ts = useSimulationStore.use.ts();
  const bzs = useSimulationStore.use.bzs();

  const dataLength = Math.min(ts.length, bzs.length);
  const data = Array.from({ length: dataLength }, (_, i) => ({
    t: ts[i],
    bzs: bzs[i],
  }));

  const chartConfig = {
    bzs: { label: "BZ", color: "#00ff00" },
  } satisfies ChartConfig;

  return (
    <Card className="dark:bg-background flex aspect-square w-full flex-col rounded-md">
      <CardHeader>
        <CardDescription>
          Simulated drone's Z-axis speed in 3D at each time point.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pl-0">
        <ChartContainer config={chartConfig} className="pr-2">
          <LineChart data={data}>
            <CartesianGrid />
            <YAxis
              dataKey="bzs"
              type="number"
              tickLine
              axisLine
              tickMargin={8}
              tickCount={8}
            />
            <XAxis
              dataKey="t"
              type="number"
              tickLine
              axisLine
              tickMargin={8}
              tickCount={8}
            />
            <ChartTooltip
              cursor
              content={<ChartTooltipContent />}
              wrapperStyle={{ pointerEvents: "none" }}
            />
            <Line
              dataKey="bzs"
              type="monotone"
              stroke="#00ff00"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground text-sm font-semibold">
          Showing bzs vs t
        </div>
      </CardFooter>
    </Card>
  );
};

export { ViewPortBZTLineChart };
