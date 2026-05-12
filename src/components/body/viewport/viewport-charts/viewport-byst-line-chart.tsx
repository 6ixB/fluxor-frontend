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
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  bys: { label: "BY", color: "#00ff00" },
} satisfies ChartConfig;

const ViewPortBYTLineChart: React.FC = () => {
  const ts = useSimulationStore.use.ts();
  const bys = useSimulationStore.use.bys();

  const data = useMemo(() => {
    const dataLength = Math.min(ts.length, bys.length);
    const out = new Array(dataLength);
    for (let i = 0; i < dataLength; i++) out[i] = { t: ts[i], bys: bys[i] };
    return out;
  }, [ts, bys]);

  return (
    <Card className="dark:bg-background flex aspect-square w-full flex-col rounded-md">
      <CardHeader>
        <CardDescription>
          Simulated drone's Y-axis speed in 3D at each time point.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pl-0">
        <ChartContainer config={chartConfig} className="pr-2">
          <LineChart data={data}>
            <CartesianGrid />
            <YAxis
              dataKey="bys"
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
              dataKey="bys"
              type="monotone"
              stroke="#00ff00"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground text-sm font-semibold">
          Showing bys vs t
        </div>
      </CardFooter>
    </Card>
  );
};

export { ViewPortBYTLineChart };
