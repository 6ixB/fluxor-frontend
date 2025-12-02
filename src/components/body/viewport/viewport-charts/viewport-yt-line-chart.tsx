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

const ViewPortYTLineChart: React.FC = () => {
  const ts = useSimulationStore.use.ts();
  const ys = useSimulationStore.use.ys();

  const dataLength = Math.min(ts.length, ys.length);
  const data = Array.from({ length: dataLength }, (_, i) => ({
    t: ts[i],
    ys: ys[i],
  }));

  const chartConfig = {
    ys: { label: "Y", color: "#00ff00" },
  } satisfies ChartConfig;

  return (
    <Card className="dark:bg-background flex aspect-square w-full flex-col rounded-md">
      <CardHeader>
        <CardDescription>
          Simulated drone's Y-axis position in 3D at each time point.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pl-0">
        <ChartContainer config={chartConfig} className="pr-2">
          <LineChart data={data}>
            <CartesianGrid />
            <YAxis
              dataKey="ys"
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
              dataKey="ys"
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
          Showing y vs t
        </div>
      </CardFooter>
    </Card>
  );
};

export { ViewPortYTLineChart };
